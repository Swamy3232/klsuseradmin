import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Filter, Search, X, Grid, List, Heart, Info, Scale, User, Gem, Sparkles, Loader2, Star, Share2, Phone, MapPin, Clock
} from 'lucide-react';

const KLSGoldCollections = () => {
  const location = useLocation();
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedPurities, setSelectedPurities] = useState([]);
  const [weightRange, setWeightRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || null);
  const [categories, setCategories] = useState([]);

  const itemTypes = ['Gold', 'Silver', 'Diamond', 'Platinum', 'Rose Gold', 'White Gold'];
  const genders = ['Male', 'Female', 'Unisex','Kids'];
  const purities = ['18K', '22K', '24K', '925']; // 925 for silver
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'weight-high', label: 'Weight: High to Low' },
    { value: 'weight-low', label: 'Weight: Low to High' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  // Fetch collections
  useEffect(() => { fetchCollections(); }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://test-check-q5kj.onrender.com/gold');
      const json = await res.json();
      if (Array.isArray(json.data)) {
        setCollections(json.data);
        setFilteredCollections(json.data);

        // Extract unique categories by name
        const uniqueCategories = [...new Set(json.data.map(item => item.name))];
        setCategories(uniqueCategories.sort());
        
        // Set selectedCategory from location state or first category
        if (location.state?.selectedCategory) {
          setSelectedCategory(location.state.selectedCategory);
        } else if (selectedCategory === null && uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }

        const weights = json.data.map(i => Number(i.weight_gm)).filter(w => Number.isFinite(w));
        if (weights.length) {
          setWeightRange({ min: 0, max: Math.ceil(Math.max(...weights) / 100) * 100 });
        }
      }
    } catch (e) { 
      console.error('Failed to fetch collections:', e);
    }
    finally { 
      setLoading(false); 
    }
  };

  // Filters
  useEffect(() => { applyFilters(); }, [searchTerm, selectedTypes, selectedGenders, selectedPurities, weightRange, sortBy, collections, selectedCategory]);

  const applyFilters = () => {
    let filtered = [...collections];

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(i => i.name === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedTypes.length) filtered = filtered.filter(i => selectedTypes.includes(i.type));
    if (selectedGenders.length) filtered = filtered.filter(i => selectedGenders.includes(i.gender));
    if (selectedPurities.length) filtered = filtered.filter(i => selectedPurities.includes(i.purity));
    filtered = filtered.filter(i => i.weight_gm >= weightRange.min && i.weight_gm <= weightRange.max);

    filtered.sort((a,b) => {
      switch(sortBy){
        case 'newest': return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest': return new Date(a.created_at) - new Date(b.created_at);
        case 'weight-high': return b.weight_gm - a.weight_gm;
        case 'weight-low': return a.weight_gm - b.weight_gm;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

    setFilteredCollections(filtered);
  };

  const toggleType = t => setSelectedTypes(prev => prev.includes(t) ? prev.filter(i=>i!==t) : [...prev,t]);
  const toggleGender = g => setSelectedGenders(prev => prev.includes(g) ? prev.filter(i=>i!==g) : [...prev,g]);
  const togglePurity = p => setSelectedPurities(prev => prev.includes(p) ? prev.filter(i=>i!==p) : [...prev,p]);
  const toggleWishlist = id => { 
    const w = new Set(wishlist); 
    w.has(id) ? w.delete(id) : w.add(id); 
    setWishlist(w); 
  };
  
  const clearFilters = () => { 
    setSearchTerm(''); 
    setSelectedTypes([]); 
    setSelectedGenders([]); 
    setSelectedPurities([]); 
    setWeightRange({min:0, max:weightRange.max}); 
    setSortBy('newest'); 
  };

  const getTypeColor = (type) => {
    switch(type){
      case 'Gold': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Silver': return 'bg-gray-50 text-gray-800 border-gray-200';
      case 'Diamond': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Platinum': return 'bg-slate-50 text-slate-800 border-slate-200';
      case 'Rose Gold': return 'bg-pink-50 text-pink-800 border-pink-200';
      case 'White Gold': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getGenderIcon = (gender) => {
    if (gender === 'Male') return <User className="w-4 h-4" />;
    if (gender === 'Female') return <Sparkles className="w-4 h-4" />;
    return <Gem className="w-4 h-4" />;
  };

  const contactViaWhatsApp = (item) => {
    const lines = [
      'Hello KLS Jewellers,',
      '',
      'I am interested in this jewellery item:',
      '',
      `• Name: ${item.name || '-'}`,
      `• Type: ${item.type || '-'}`,
      `• Purity: ${item.purity || '-'}`,
      `• Weight: ${item.weight_gm || '-'} gm`,
      `• Gender: ${item.gender || '-'}`,
      '',
      'Please share more details and the current price.',
      '',
      'Thank you!'
    ].filter(Boolean);
    window.open(`https://wa.me/919448866788?text=${encodeURIComponent(lines.join('\n'))}`,'_blank');
  };

  const openQuickView = (item) => { 
    setSelectedItem(item); 
    setShowQuickView(true); 
  };

  const handleShare = async (item) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.name} - KLS Jewellers`,
          text: `Check out this beautiful ${item.type} jewellery from KLS Jewellers`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${item.name} - KLS Jewellers\n${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  // ----- RENDER - Bluestone style -----
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Bluestone clean header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">KLS Jewels</h1>
              <p className="text-gray-600 text-sm">Premium Jewellery Collections</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3 sm:gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 94488 66788</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>10 AM - 8 PM</span>
                </div>
              </div>
              <button className="relative p-2 text-gray-600 hover:text-amber-600">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold">
                  {wishlist.size}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Categories Navigation with Images */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 py-4 min-w-full">
              {categories.map(category => {
                const categoryItems = collections.filter(item => item.name === category);
                const firstItem = categoryItems[0];
                const itemCount = categoryItems.length;
                
                return (
                  <div key={category} className="flex flex-col items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`relative w-24 h-24 rounded-full overflow-hidden border-4 transition-all ${
                        selectedCategory === category
                          ? 'border-amber-600 shadow-lg scale-110'
                          : 'border-gray-300 hover:border-amber-400 hover:shadow-md'
                      }`}
                      title={category}
                    >
                      {firstItem?.image_url ? (
                        <img 
                          src={firstItem.image_url} 
                          alt={category} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                          <Gem className="w-8 h-8 text-amber-600" />
                        </div>
                      )}
                      {selectedCategory === category && (
                        <div className="absolute inset-0 bg-black/10 rounded-full"></div>
                      )}
                    </button>
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-800 max-w-[100px] truncate">
                        {category}
                      </p>
                      <p className="text-xs text-gray-500">({itemCount})</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Search & Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-2xl w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Search jewellery by name, type, or description..." 
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${showFilters ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} flex-1 md:flex-none`}
              >
                <Filter className="w-4 h-4" /> 
                Filters
                {(selectedTypes.length + selectedGenders.length + selectedPurities.length + (weightRange.min > 0 ? 1 : 0)) > 0 && (
                  <span className="bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedTypes.length + selectedGenders.length + selectedPurities.length + (weightRange.min > 0 ? 1 : 0)}
                  </span>
                )}
              </button>
              
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)} 
                className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm w-full md:w-auto"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedTypes.length > 0 || selectedGenders.length > 0 || selectedPurities.length > 0 || searchTerm || weightRange.min > 0) && (
            <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-600 font-medium">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTypes.map(type => (
                <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                  {type}
                  <button onClick={() => toggleType(type)} className="ml-1 hover:text-amber-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedGenders.map(gender => (
                <span key={gender} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                  {gender}
                  <button onClick={() => toggleGender(gender)} className="ml-1 hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedPurities.map(purity => (
                <span key={purity} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                  {purity}
                  <button onClick={() => togglePurity(purity)} className="ml-1 hover:text-emerald-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {weightRange.min > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Min weight: {weightRange.min}gm
                  <button onClick={() => setWeightRange(prev => ({...prev, min: 0}))} className="ml-1 hover:text-gray-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Mobile Overlay / Desktop Sidebar */}
          {showFilters && (
            <>
              {/* Mobile Overlay */}
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowFilters(false)} />
              
              {/* Filters Panel */}
              <div className="fixed lg:relative inset-y-0 left-0 lg:inset-auto w-full lg:w-72 bg-white z-50 lg:z-auto shadow-xl lg:shadow-none border-r lg:border rounded-xl overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={clearFilters} 
                        className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Clear all
                      </button>
                      <button 
                        onClick={() => setShowFilters(false)} 
                        className="lg:hidden p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                      <Gem className="w-4 h-4 text-amber-600" /> 
                      Material Type
                    </h4>
                    <div className="space-y-2">
                      {itemTypes.map(t => (
                        <label key={t} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={selectedTypes.includes(t)} 
                              onChange={() => toggleType(t)} 
                              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-gray-700">{t}</span>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {collections.filter(i => i.type === t).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-amber-600" /> 
                      Gender
                    </h4>
                    <div className="space-y-2">
                      {genders.map(g => (
                        <label key={g} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={selectedGenders.includes(g)} 
                              onChange={() => toggleGender(g)} 
                              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-gray-700">{g}</span>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {collections.filter(i => i.gender === g).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Purity Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                      <Sparkles className="w-4 h-4 text-amber-600" /> 
                      Purity
                    </h4>
                    <div className="space-y-2">
                      {purities.map(p => (
                        <label key={p} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={selectedPurities.includes(p)} 
                              onChange={() => togglePurity(p)} 
                              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-gray-700">{p}</span>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {collections.filter(i => i.purity === p).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Weight Filter */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                      <Scale className="w-4 h-4 text-amber-600" /> 
                      Weight Range
                    </h4>
                    <div className="px-2">
                      <input 
                        type="range" 
                        min="0" 
                        max={weightRange.max} 
                        value={weightRange.min} 
                        onChange={e => setWeightRange(prev => ({...prev, min: parseInt(e.target.value)}))} 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>0 gm</span>
                        <span className="font-medium">Min: {weightRange.min} gm</span>
                        <span>{weightRange.max} gm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Collections Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredCollections.length}</span> of <span className="font-semibold">{collections.length}</span> items
              </p>
              <button 
                onClick={() => setShowFilters(true)} 
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-amber-600 mb-4" />
                <p className="text-gray-600">Loading jewellery collection...</p>
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Gem className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search term</p>
                <button 
                  onClick={clearFilters} 
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map(item => (
                  <div 
                    key={item.id} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <button 
                        onClick={() => toggleWishlist(item.id)} 
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${wishlist.has(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {getGenderIcon(item.gender)}
                          <span>{item.gender}</span>
                        </div>
                        <div className="text-sm text-gray-700 font-medium">
                          {item.weight_gm} gm
                        </div>
                      </div>
                      
                      {item.purity && (
                        <div className="mb-4">
                          <span className="text-sm text-gray-600">Purity:</span>
                          <span className="ml-2 text-sm font-medium text-gray-800">{item.purity}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => contactViaWhatsApp(item)} 
                          className="flex-1 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          Inquire Now
                        </button>
                        <button 
                          onClick={() => handleShare(item)} 
                          className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {filteredCollections.map(item => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-48 h-48 sm:h-auto">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <button 
                          onClick={() => toggleWishlist(item.id)} 
                          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm"
                        >
                          <Heart className={`w-4 h-4 ${wishlist.has(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </button>
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.name}</h3>
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(item.type)}`}>
                                {item.type}
                              </span>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                {getGenderIcon(item.gender)}
                                <span>{item.gender}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900 mb-1">
                              {item.weight_gm} gm
                            </div>
                            <div className="text-sm text-gray-600">
                              Purity: {item.purity || 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                          <button 
                            onClick={() => openQuickView(item)} 
                            className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                          >
                            <Info className="w-4 h-4" />
                            View Details
                          </button>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleShare(item)} 
                              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              <Share2 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => contactViaWhatsApp(item)} 
                              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                            >
                              <Phone className="w-4 h-4" />
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      {showQuickView && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
              <button 
                onClick={() => setShowQuickView(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-6">
                <div className="relative h-96 lg:h-full rounded-lg overflow-hidden">
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => toggleWishlist(selectedItem.id)} 
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
                  >
                    <Heart className={`w-5 h-5 ${wishlist.has(selectedItem.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
              
              <div className="lg:w-1/2 p-6">
                <div className="mb-6">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getTypeColor(selectedItem.type)} mb-3 inline-block`}>
                    {selectedItem.type}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedItem.name}</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Weight</div>
                        <div className="text-lg font-semibold text-gray-900">{selectedItem.weight_gm} gm</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Purity</div>
                        <div className="text-lg font-semibold text-gray-900">{selectedItem.purity || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Gender</div>
                        <div className="text-lg font-semibold text-gray-900">{selectedItem.gender}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Type</div>
                        <div className="text-lg font-semibold text-gray-900">{selectedItem.type}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => contactViaWhatsApp(selectedItem)} 
                    className="w-full py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-3 font-medium text-lg"
                  >
                    <Phone className="w-5 h-5" />
                    Contact via WhatsApp
                  </button>
                  
                  <button 
                    onClick={() => handleShare(selectedItem)} 
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 font-medium"
                  >
                    <Share2 className="w-5 h-5" />
                    Share this Item
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Info className="w-5 h-5" />
                    <p className="text-sm">
                      For accurate pricing and availability, please contact us directly. Prices vary based on current market rates and craftsmanship.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">KLS Jewellers</h3>
              <p className="text-gray-400">Crafting excellence since 1995</p>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-4 mb-3">
                <Phone className="w-5 h-5" />
                <span>+91 94488 66788</span>
              </div>
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} KLS Jewellers. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KLSGoldCollections;