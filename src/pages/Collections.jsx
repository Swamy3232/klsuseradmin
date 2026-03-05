import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Filter, Search, X, Grid, List, Heart, Info, Scale, User, Gem, Sparkles, Loader2, Star, Share2, Phone, MapPin, Clock, ChevronRight
} from 'lucide-react';
import { useCollectionsContext } from '../context/CollectionsContext';

const KLSGoldCollections = () => {
  const location = useLocation();
  const { setIsFullscreenCollections } = useCollectionsContext();
  
  // Core state
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Hierarchical navigation state
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [navigationStep, setNavigationStep] = useState('types');
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedPurities, setSelectedPurities] = useState([]);
  const [weightRange, setWeightRange] = useState({ min: 0, max: 1000 });

  const itemTypes = ['Gold', 'Silver', 'Diamond', 'All'];
  const genders = ['Male', 'Female', 'Unisex', 'Kids'];
  const purities = ['22K', '18K', '14K', '925', '999'];

  // Get available types from collections
  const getAvailableTypes = () => {
    const types = [...new Set(collections.map(item => item.type))];
    return itemTypes.filter(t => types.includes(t));
  };

  // Get available genders for selected type
  const getAvailableGenders = () => {
    if (!selectedType) return [];
    const genderSet = new Set(
      collections
        .filter(item => item.type === selectedType)
        .map(item => item.gender)
    );
    return genders.filter(g => genderSet.has(g));
  };

  // Get available subcategories for selected type & gender
  const getAvailableSubcategories = () => {
    if (!selectedType || !selectedGender) return [];
    const subcatSet = new Set(
      collections
        .filter(item => item.type === selectedType && item.gender === selectedGender)
        .map(item => item.name)
    );
    return Array.from(subcatSet).sort();
  };

  // Get items for selected type, gender, and subcategory
  const getItemsForSelection = () => {
    let items = [...collections];
    if (selectedType) items = items.filter(i => i.type === selectedType);
    if (selectedGender) items = items.filter(i => i.gender === selectedGender);
    if (selectedSubcategory) items = items.filter(i => i.name === selectedSubcategory);
    return items;
  };

  // Get first image for displays
  const getFirstImageForType = (type) => {
    return collections.find(item => item.type === type)?.image_url;
  };

  const getFirstImageForGender = (type, gender) => {
    return collections.find(item => item.type === type && item.gender === gender)?.image_url;
  };

  const getFirstImageForSubcategory = (type, gender, subcat) => {
    return collections.find(item => item.type === type && item.gender === gender && item.name === subcat)?.image_url;
  };

  // Filter functions
  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleGender = (gender) => {
    setSelectedGenders(prev => 
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const togglePurity = (purity) => {
    setSelectedPurities(prev => 
      prev.includes(purity) ? prev.filter(p => p !== purity) : [...prev, purity]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTypes([]);
    setSelectedGenders([]);
    setSelectedPurities([]);
    setWeightRange({ min: 0, max: 1000 });
  };

  // Get filtered collections
  const filteredCollections = getItemsForSelection().filter(item => {
    // Search filter
    if (searchTerm && !item.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Type filter (only if in items view and filters are applied)
    if (navigationStep === 'items' && selectedTypes.length > 0 && !selectedTypes.includes(item.type)) {
      return false;
    }
    // Purity filter
    if (selectedPurities.length > 0 && !selectedPurities.includes(item.purity)) {
      return false;
    }
    // Weight filter
    const weight = parseFloat(item.weight_gm) || 0;
    if (weight < weightRange.min || weight > weightRange.max) {
      return false;
    }
    return true;
  });

  // Handle location state from nav modal
  useEffect(() => {
    if (location.state) {
      const { 
        selectedTypes: navTypes, 
        selectedGenders: navGenders, 
        selectedPurities: navPurities, 
        weightMin, 
        weightMax 
      } = location.state;
      
      if (navTypes?.length) setSelectedTypes(navTypes);
      if (navGenders?.length) setSelectedGenders(navGenders);
      if (navPurities?.length) setSelectedPurities(navPurities);
      if (weightMin !== undefined || weightMax !== undefined) {
        setWeightRange(prev => ({
          min: weightMin ?? prev.min,
          max: weightMax ?? prev.max
        }));
      }
    }
  }, [location.state]);

  // Fetch collections
  useEffect(() => { 
    fetchCollections(); 
  }, []);

  // Reset fullscreen when component unmounts
  useEffect(() => {
    return () => {
      setIsFullscreenCollections(false);
    };
  }, [setIsFullscreenCollections]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://test-check-q5kj.onrender.com/gold');
      const json = await res.json();
      if (Array.isArray(json.data)) {
        setCollections(json.data);
        
        const weights = json.data.map(i => Number(i.weight_gm)).filter(w => Number.isFinite(w));
        const maxW = weights.length ? Math.ceil(Math.max(...weights) / 100) * 100 : 1000;
        setWeightRange({ min: 0, max: maxW });
      }
    } catch (e) { 
      console.error('Failed to fetch collections:', e);
    } finally { 
      setLoading(false); 
    }
  };

  const toggleWishlist = (id) => { 
    const w = new Set(wishlist); 
    w.has(id) ? w.delete(id) : w.add(id); 
    setWishlist(w); 
  };

  // Navigation functions
  const goToTypes = () => {
    setNavigationStep('types');
    setSelectedType(null);
    setSelectedGender(null);
    setSelectedSubcategory(null);
  };

  const goToGenders = (type) => {
    setSelectedType(type);
    setNavigationStep('genders');
    setSelectedGender(null);
    setSelectedSubcategory(null);
  };

  const goToSubcategories = (type, gender) => {
    setSelectedType(type);
    setSelectedGender(gender);
    setNavigationStep('subcategories');
    setSelectedSubcategory(null);
  };

  const showItems = (type, gender, subcategory) => {
    setSelectedType(type);
    setSelectedGender(gender);
    setSelectedSubcategory(subcategory);
    setNavigationStep('items');
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Gold': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Silver': return 'bg-gray-50 text-gray-800 border-gray-200';
      case 'Diamond': return 'bg-blue-50 text-blue-800 border-blue-200';
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
    window.open(`https://wa.me/919448866788?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
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
      navigator.clipboard.writeText(`${item.name} - KLS Jewellers\n${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={goToTypes} className="text-amber-600 hover:text-amber-700 font-medium">
              Collections
            </button>
            {selectedType && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{selectedType}</span>
              </>
            )}
            {selectedGender && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{selectedGender}</span>
              </>
            )}
            {selectedSubcategory && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{selectedSubcategory}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Step 1: Show Types */}
            {navigationStep === 'types' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Material Type</h2>
                  <p className="text-gray-600">Select the type of jewellery you're interested in</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {getAvailableTypes().map(type => (
                    <button
                      key={type}
                      onClick={() => goToGenders(type)}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-8">
                        {getFirstImageForType(type) ? (
                          <img
                            src={getFirstImageForType(type)}
                            alt={type}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Gem className="w-16 h-16 text-amber-600 group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{type}</h3>
                        <p className="text-sm text-gray-600">
                          {collections.filter(item => item.type === type).length} items
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Show Genders */}
            {navigationStep === 'genders' && selectedType && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedType} Collections</h2>
                  <p className="text-gray-600">Choose the gender category</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {getAvailableGenders().map(gender => (
                    <button
                      key={gender}
                      onClick={() => goToSubcategories(selectedType, gender)}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-8">
                        {getFirstImageForGender(selectedType, gender) ? (
                          <img
                            src={getFirstImageForGender(selectedType, gender)}
                            alt={gender}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            {getGenderIcon(gender)}
                            <span className="text-amber-600 font-medium mt-2">{gender}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{gender}</h3>
                        <p className="text-sm text-gray-600">
                          {collections.filter(item => item.type === selectedType && item.gender === gender).length} items
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Show Subcategories */}
            {navigationStep === 'subcategories' && selectedType && selectedGender && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedGender} {selectedType} Collections
                  </h2>
                  <p className="text-gray-600">Choose a collection to explore</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getAvailableSubcategories().map(subcategory => (
                    <button
                      key={subcategory}
                      onClick={() => showItems(selectedType, selectedGender, subcategory)}
                      className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-amber-300 transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                        {getFirstImageForSubcategory(selectedType, selectedGender, subcategory) ? (
                          <img
                            src={getFirstImageForSubcategory(selectedType, selectedGender, subcategory)}
                            alt={subcategory}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Gem className="w-8 h-8 text-amber-600" />
                        )}
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{subcategory}</h3>
                        <p className="text-xs text-gray-600">
                          {collections.filter(item => 
                            item.type === selectedType && 
                            item.gender === selectedGender && 
                            item.name === subcategory
                          ).length} items
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Show Items */}
            {navigationStep === 'items' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedSubcategory}</h2>
                    <p className="text-gray-600">{selectedGender} {selectedType} Collection</p>
                  </div>
                  <div className="flex items-center gap-4">
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
                  </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search items..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Items Display */}
                {filteredCollections.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <Gem className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search term</p>
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
            )}
          </>
        )}
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
      {/* <footer className="bg-gray-900 text-white mt-12">
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
      </footer> */}
    </div>
  );
};

export default KLSGoldCollections;
