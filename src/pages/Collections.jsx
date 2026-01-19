import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  X, 
  Grid, 
  List, 
  Star, 
  Heart, 
  Share2,
  Loader2,
  ChevronDown,
  Scale,
  User,
  Gem,
  Sparkles,
  Info
} from 'lucide-react';

const KLSGoldCollections = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [weightRange, setWeightRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const itemTypes = ['Gold', 'Silver', 'Diamond', 'Platinum', 'Rose Gold', 'White Gold'];
  const genders = ['Male', 'Female', 'Unisex'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'weight-high', label: 'Weight: High to Low' },
    { value: 'weight-low', label: 'Weight: Low to High' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/gold');
      const result = await response.json();
      if (result.status === 'success') {
        setCollections(result.data);
        setFilteredCollections(result.data);
        // Calculate weight range
        const weights = result.data.map(item => item.weight_gm);
        const maxWeight = Math.max(...weights);
        setWeightRange({ min: 0, max: Math.ceil(maxWeight / 100) * 100 });
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedTypes, selectedGenders, weightRange, sortBy, collections]);

  const applyFilters = () => {
    let filtered = [...collections];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(item => selectedTypes.includes(item.type));
    }

    // Gender filter
    if (selectedGenders.length > 0) {
      filtered = filtered.filter(item => selectedGenders.includes(item.gender));
    }

    // Weight range filter
    filtered = filtered.filter(item =>
      item.weight_gm >= weightRange.min && item.weight_gm <= weightRange.max
    );

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'weight-high':
          return b.weight_gm - a.weight_gm;
        case 'weight-low':
          return a.weight_gm - b.weight_gm;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredCollections(filtered);
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleGender = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender)
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const toggleWishlist = (id) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
    } else {
      newWishlist.add(id);
    }
    setWishlist(newWishlist);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTypes([]);
    setSelectedGenders([]);
    setWeightRange({ min: 0, max: 1000 });
    setSortBy('newest');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Diamond': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Platinum': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Rose Gold': return 'bg-pink-50 text-pink-700 border-pink-100';
      case 'White Gold': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'Male': return <User className="w-4 h-4" />;
      case 'Female': return <Sparkles className="w-4 h-4" />;
      default: return <Gem className="w-4 h-4" />;
    }
  };

  const contactViaWhatsApp = (item) => {
    if (!item) return;
    const lines = [
      'Hello KLS Jewellers, I am interested in this jewellery item:',
      `Name: ${item.name || '-'}`,
      `Type: ${item.type || '-'}`,
      `Weight: ${item.weight_gm ? item.weight_gm + ' gm' : '-'}`,
      `Gender: ${item.gender || '-'}`,
      item.id ? `Item ID: ${item.id}` : '',
    ].filter(Boolean);
    const text = lines.join('\n');
    const url = `https://wa.me/919448866788?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openQuickView = (item) => {
    setSelectedItem(item);
    setShowQuickView(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KLS Gold Collections</h1>
              <p className="text-gray-600 mt-1">Explore our exquisite collection of premium jewelry</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors">
                <Heart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.size}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or type..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {(selectedTypes.length > 0 || selectedGenders.length > 0 || weightRange.min > 0) && (
                  <span className="bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedTypes.length + selectedGenders.length + (weightRange.min > 0 ? 1 : 0)}
                  </span>
                )}
              </button>

              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedTypes.length > 0 || selectedGenders.length > 0 || searchTerm || weightRange.min > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 self-center">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTypes.map(type => (
                <span key={type} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getTypeColor(type)}`}>
                  {type}
                  <button onClick={() => toggleType(type)} className="hover:opacity-75">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedGenders.map(gender => (
                <span key={gender} className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-100">
                  {getGenderIcon(gender)}
                  {gender}
                  <button onClick={() => toggleGender(gender)} className="hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {weightRange.min > 0 && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-100">
                  <Scale className="w-3 h-3" />
                  Min {weightRange.min}gm
                  <button onClick={() => setWeightRange(prev => ({ ...prev, min: 0 }))} className="hover:text-green-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                Clear all
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-64 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    Clear all
                  </button>
                </div>

                {/* Material Type */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Gem className="w-4 h-4" />
                    Material Type
                  </h4>
                  <div className="space-y-2">
                    {itemTypes.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                          selectedTypes.includes(type)
                            ? getTypeColor(type)
                            : 'border-gray-200 group-hover:border-amber-300'
                        }`}>
                          <span>{type}</span>
                          {collections.filter(item => item.type === type).length > 0 && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {collections.filter(item => item.type === type).length}
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Gender
                  </h4>
                  <div className="space-y-2">
                    {genders.map(gender => (
                      <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedGenders.includes(gender)}
                          onChange={() => toggleGender(gender)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                          selectedGenders.includes(gender)
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'border-gray-200 group-hover:border-purple-300'
                        }`}>
                          <span className="flex items-center gap-2">
                            {getGenderIcon(gender)}
                            {gender}
                          </span>
                          {collections.filter(item => item.gender === gender).length > 0 && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {collections.filter(item => item.gender === gender).length}
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Weight Range */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Weight Range (gm)
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{weightRange.min} gm</span>
                      <span>{weightRange.max} gm</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={weightRange.max}
                      value={weightRange.min}
                      onChange={(e) => setWeightRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600"
                    />
                    <div className="text-center text-sm text-gray-500">
                      Current range: {weightRange.min} - {weightRange.max} gm
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Collection Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-semibold">{collections.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items Shown</span>
                    <span className="font-semibold text-amber-600">{filteredCollections.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Types Available</span>
                    <span className="font-semibold">{new Set(collections.map(item => item.type)).size}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collections Grid/List */}
          <div className={`flex-1 ${showFilters ? 'lg:w-calc(100%-16rem)' : ''}`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading collections...</p>
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-amber-200"
                  >
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(item.id)}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            wishlist.has(item.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600 hover:text-red-500'
                          }`}
                        />
                      </button>
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => openQuickView(item)}
                          className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{item.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-2">
                            <Scale className="w-4 h-4" />
                            Weight
                          </span>
                          <span className="font-semibold">{item.weight_gm} gm</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-2">
                            {getGenderIcon(item.gender)}
                            Gender
                          </span>
                          <span className="font-medium">{item.gender}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Added</span>
                          <span className="text-gray-600">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                          onClick={() => openQuickView(item)}
                          className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
                        >
                          <Info className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => contactViaWhatsApp(item)}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                        >
                          Inquire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {filteredCollections.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Image */}
                      <div className="md:w-48">
                        <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => toggleWishlist(item.id)}
                            className="absolute top-2 right-2"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                wishlist.has(item.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-white drop-shadow-lg hover:text-red-500'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(item.type)}`}>
                                {item.type}
                              </span>
                              <span className="flex items-center gap-2 text-gray-600">
                                {getGenderIcon(item.gender)}
                                {item.gender}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-amber-600">{item.weight_gm} gm</div>
                            <div className="text-sm text-gray-500">Weight</div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-6">
                          Premium {item.type.toLowerCase()} jewelry piece with exquisite craftsmanship.
                          Perfect for {item.gender === 'Unisex' ? 'all genders' : item.gender.toLowerCase()}.
                        </p>

                        <div className="flex flex-wrap gap-3 mb-6">
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Scale className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Weight: {item.weight_gm}gm</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              Added: {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Sparkles className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Premium Quality</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => openQuickView(item)}
                            className="px-6 py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium"
                          >
                            View Full Details
                          </button>
                          <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-500 hover:text-gray-700">
                              <Share2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => contactViaWhatsApp(item)}
                              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                            >
                              Contact for Price
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Info */}
            {filteredCollections.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
                <div>
                  Showing <span className="font-semibold text-gray-900">{filteredCollections.length}</span> of{' '}
                  <span className="font-semibold text-gray-900">{collections.length}</span> items
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                    <Star className="w-4 h-4" />
                    Save Search
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <Share2 className="w-4 h-4" />
                    Share Collection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      {showQuickView && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Image */}
              <div className="lg:w-1/2">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(selectedItem.id)}
                    className="absolute top-4 right-4"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        wishlist.has(selectedItem.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-white drop-shadow-lg hover:text-red-500'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="lg:w-1/2 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(selectedItem.type)}`}>
                        {selectedItem.type}
                      </span>
                      <span className="flex items-center gap-2 text-gray-600">
                        {getGenderIcon(selectedItem.gender)}
                        {selectedItem.gender}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Weight</div>
                      <div className="text-xl font-semibold text-gray-900">{selectedItem.weight_gm} gm</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Added Date</div>
                      <div className="text-xl font-semibold text-gray-900">
                        {new Date(selectedItem.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-sm text-gray-600">
                    <p>
                      This exquisite {selectedItem.type.toLowerCase()} piece features premium craftsmanship 
                      and attention to detail. Perfect for {selectedItem.gender.toLowerCase()} wearers, 
                      it combines elegance with durability.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => contactViaWhatsApp(selectedItem)}
                    className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Request Price & Availability (WhatsApp)
                  </button>
                  <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Schedule Viewing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-4">KLS Gold Collections</h3>
          <p className="text-gray-400">
            Premium jewelry collection • Since 1995 • Authenticity Guaranteed
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Showing {filteredCollections.length} exquisite pieces
          </div>
        </div>
      </footer>
    </div>
  );
};

// Add missing Calendar icon component
const Calendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default KLSGoldCollections;