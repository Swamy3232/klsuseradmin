import React, { useState, useEffect } from 'react';
import { 
  Filter, Search, X, Grid, List, Heart, Info, Scale, User, Gem, Sparkles, Loader2, Star, Share2
} from 'lucide-react';

const KLSGoldCollections = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metalRates, setMetalRates] = useState({}); // { metalKey: ratePerGram }
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

  const itemTypes = ['Gold', 'Silver', 'Diamond', 'Platinum', 'Rose Gold', 'White Gold'];
  const genders = ['Male', 'Female', 'Unisex'];
  const purities = ['18K', '22K', '24K', '925']; // 925 for silver
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'weight-high', label: 'Weight: High to Low' },
    { value: 'weight-low', label: 'Weight: Low to High' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  const METAL_RATE_ENDPOINT = 'https://klsbackend.onrender.com/get-metal-rates';

  // Fetch collections
  useEffect(() => { fetchCollections(); }, []);

  // Fetch metal rates periodically
  useEffect(() => { 
    fetchMetalRates(); 
    const id = setInterval(fetchMetalRates, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const normalizeMetalKey = (type) => {
    if (!type) return null;
    const t = type.toLowerCase();
    if (t.includes('gold')) return 'gold';
    if (t.includes('silver')) return 'silver';
    if (t.includes('platinum')) return 'platinum';
    return null;
  };

  const fetchMetalRate = async (metalKey) => {
    try {
      const res = await fetch(`${METAL_RATE_ENDPOINT}?metal_type=${encodeURIComponent(metalKey)}`);
      const json = await res.json();
      const rate = json?.data?.[0]?.rate_per_gram || json?.data?.[0]?.ratePerGram || null;
      if (!rate) return null;
      return { metalKey, ratePerGram: Number(rate) };
    } catch { return null; }
  };

  const fetchMetalRates = async () => {
    const keys = ['gold', 'silver', 'platinum'];
    const results = await Promise.all(keys.map(fetchMetalRate));
    const next = {};
    results.filter(Boolean).forEach(r => { next[r.metalKey] = r.ratePerGram; });
    if (Object.keys(next).length) setMetalRates(prev => ({ ...prev, ...next }));
  };

  const fetchCollections = async () => {
    try {
      const res = await fetch('https://test-check-q5kj.onrender.com/gold');
      const json = await res.json();
      if (Array.isArray(json.data)) {
        setCollections(json.data);
        setFilteredCollections(json.data);

        const weights = json.data.map(i => Number(i.weight_gm)).filter(w => Number.isFinite(w));
        if (weights.length) {
          setWeightRange({ min: 0, max: Math.ceil(Math.max(...weights) / 100) * 100 });
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const purityFactor = (purity) => {
    if (!purity) return 1;
    if (purity.endsWith('K')) return Number(purity.replace('K',''))/24; // 18K -> 0.75
    if (purity === '925') return 0.925; // silver
    return 1;
  };

  const getEstimatedPrice = (item) => {
    const metal = normalizeMetalKey(item?.type);
    const rate = metal ? metalRates[metal] : null;
    const weight = Number(item?.weight_gm);
    const purity = item?.purity;
    if (!metal || !rate || !weight) return null;
    return rate * weight * purityFactor(purity);
  };

  // Filters
  useEffect(() => { applyFilters(); }, [searchTerm, selectedTypes, selectedGenders, selectedPurities, weightRange, sortBy, collections]);

  const applyFilters = () => {
    let filtered = [...collections];

    if (searchTerm) {
      filtered = filtered.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.type.toLowerCase().includes(searchTerm.toLowerCase()));
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
  const toggleWishlist = id => { const w = new Set(wishlist); w.has(id)?w.delete(id):w.add(id); setWishlist(w); };
  const clearFilters = () => { setSearchTerm(''); setSelectedTypes([]); setSelectedGenders([]); setSelectedPurities([]); setWeightRange({min:0,max:weightRange.max}); setSortBy('newest'); };

  const getTypeColor = (type) => {
    switch(type){
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
    if (gender==='Male') return <User className="w-4 h-4" />;
    if (gender==='Female') return <Sparkles className="w-4 h-4" />;
    return <Gem className="w-4 h-4" />;
  };

  const contactViaWhatsApp = (item) => {
    const lines = [
      'Hello KLS Jewellers, I am interested in this jewellery item:',
      `Name: ${item.name || '-'}`,
      `Type: ${item.type || '-'}`,
      `Purity: ${item.purity || '-'}`,
      `Weight: ${item.weight_gm || '-'} gm`,
      `Gender: ${item.gender || '-'}`,
      item.id?`Item ID: ${item.id}`:''
    ].filter(Boolean);
    window.open(`https://wa.me/919448866788?text=${encodeURIComponent(lines.join('\n'))}`,'_blank');
  };

  const openQuickView = (item) => { setSelectedItem(item); setShowQuickView(true); };

  // ----- RENDER -----
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KLS Gold Collections</h1>
            <p className="text-gray-600">Explore our exquisite collection of premium jewelry</p>
          </div>
          <button className="relative p-2 text-gray-600 hover:text-amber-600">
            <Heart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlist.size}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-xl w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search by name or type..." className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 bg-white" />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={()=>setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showFilters?'bg-amber-600 text-white border-amber-600':'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
              <Filter className="w-4 h-4" /> Filters
              {(selectedTypes.length+selectedGenders.length+selectedPurities.length+(weightRange.min>0?1:0))>0 && (
                <span className="bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedTypes.length+selectedGenders.length+selectedPurities.length+(weightRange.min>0?1:0)}
                </span>
              )}
            </button>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={()=>setViewMode('grid')} className={`p-2 rounded ${viewMode==='grid'?'bg-white shadow-sm':'hover:bg-gray-200'}`}><Grid className="w-5 h-5"/></button>
              <button onClick={()=>setViewMode('list')} className={`p-2 rounded ${viewMode==='list'?'bg-white shadow-sm':'hover:bg-gray-200'}`}><List className="w-5 h-5"/></button>
            </div>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-amber-500">
              {sortOptions.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-64 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <button onClick={clearFilters} className="text-amber-600">Clear all</button>
                </div>

                {/* Type */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2"><Gem className="w-4 h-4"/> Material Type</h4>
                  <div className="space-y-2">{itemTypes.map(t=><label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedTypes.includes(t)} onChange={()=>toggleType(t)} className="rounded border-gray-300 text-amber-600"/>
                    {t} ({collections.filter(i=>i.type===t).length})
                  </label>)}</div>
                </div>

                {/* Gender */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2"><User className="w-4 h-4"/> Gender</h4>
                  <div className="space-y-2">{genders.map(g=><label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedGenders.includes(g)} onChange={()=>toggleGender(g)} className="rounded border-gray-300 text-amber-600"/>
                    {g} ({collections.filter(i=>i.gender===g).length})
                  </label>)}</div>
                </div>

                {/* Purity */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Purity</h4>
                  <div className="space-y-2">{purities.map(p=><label key={p} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedPurities.includes(p)} onChange={()=>togglePurity(p)} className="rounded border-gray-300 text-amber-600"/>
                    {p} ({collections.filter(i=>i.purity===p).length})
                  </label>)}</div>
                </div>

                {/* Weight */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2"><Scale className="w-4 h-4"/> Min Weight</h4>
                  <input type="range" min="0" max={weightRange.max} value={weightRange.min} onChange={e=>setWeightRange(prev=>({...prev,min:parseInt(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg"/>
                  <div className="text-sm text-gray-500">Min: {weightRange.min} gm</div>
                </div>
              </div>
            </div>
          )}

          {/* Collections Grid/List */}
          <div className="flex-1">
            {loading?(
              <div className="flex flex-col items-center justify-center h-96"><Loader2 className="w-12 h-12 animate-spin text-amber-600"/><p>Loading...</p></div>
            ):filteredCollections.length===0?(
              <div className="text-center py-16 bg-white rounded-xl border">No items found</div>
            ):viewMode==='grid'?(
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map(item=>(
                  <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200">
                    <div className="relative h-64">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                      <button onClick={()=>toggleWishlist(item.id)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full"><Heart className={`${wishlist.has(item.id)?'fill-red-500 text-red-500':'text-gray-600 hover:text-red-500'}`}/></button>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <button onClick={()=>openQuickView(item)} className="bg-white px-6 py-2 rounded-full">Quick View</button>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(item.type)}`}>{item.type}</span>
                      <div className="flex justify-between mt-2">
                        <div className="text-sm text-gray-600 flex items-center gap-2">{getGenderIcon(item.gender)} {item.gender}</div>
                        <div className="text-sm text-gray-600">{item.weight_gm} gm</div>
                      </div>
                      {item.purity && <div className="mt-1 text-sm text-gray-600">Purity: {item.purity}</div>}
                      <div className="mt-2 font-semibold text-amber-600">Est. Price: {formatINR(getEstimatedPrice(item))}</div>
                      <button onClick={()=>contactViaWhatsApp(item)} className="mt-3 w-full py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 flex items-center justify-center gap-2"><span>Contact via WhatsApp</span></button>
                    </div>
                  </div>
                ))}
              </div>
            ):(
              <div className="space-y-4">
                {filteredCollections.map(item=>(
                  <div key={item.id} className="flex bg-white rounded-xl shadow-sm border overflow-hidden">
                    <img src={item.image_url} alt={item.name} className="w-32 h-32 object-cover"/>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getTypeColor(item.type)}`}>{item.type}</span>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          {getGenderIcon(item.gender)} {item.gender} | {item.weight_gm} gm | {item.purity}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="font-semibold text-amber-600">Est. Price: {formatINR(getEstimatedPrice(item))}</div>
                        <div className="flex gap-2">
                          <button onClick={()=>toggleWishlist(item.id)} className={`${wishlist.has(item.id)?'text-red-500':'text-gray-600 hover:text-red-500'}`}><Heart/></button>
                          <button onClick={()=>contactViaWhatsApp(item)} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg">Contact</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick View Modal */}
        {showQuickView && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl overflow-hidden w-11/12 md:w-3/4 lg:w-1/2 relative">
              <button onClick={()=>setShowQuickView(false)} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"><X/></button>
              <div className="flex flex-col md:flex-row">
                <img src={selectedItem.image_url} alt={selectedItem.name} className="w-full md:w-1/2 h-96 object-cover"/>
                <div className="p-6 flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(selectedItem.type)}`}>{selectedItem.type}</span>
                  <div className="mt-2 text-gray-700 flex flex-col gap-1">
                    <div>Weight: {selectedItem.weight_gm} gm</div>
                    <div>Purity: {selectedItem.purity || '-'}</div>
                    <div>Gender: {selectedItem.gender}</div>
                    <div>Est. Price: {formatINR(getEstimatedPrice(selectedItem))}</div>
                  </div>
                  <button onClick={()=>contactViaWhatsApp(selectedItem)} className="mt-4 w-full py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 flex items-center justify-center gap-2">Contact via WhatsApp</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default KLSGoldCollections;
