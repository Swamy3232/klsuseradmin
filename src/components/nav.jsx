import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, MapPin, Store, Download, ChevronDown, X, Menu, Instagram, MessageCircle, Mail, LayoutGrid, Wallet, Calculator, Scale, Loader2, Gem } from "lucide-react";
import logo from "../assets/image/newlogo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [allMetalPrices, setAllMetalPrices] = useState({
    gold: [],
    silver: [],
    diamond: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPricesModal, setShowPricesModal] = useState(false);
  const [currentPriceIndex, setCurrentPriceIndex] = useState(0);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);
  const [collectionsData, setCollectionsData] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collModalTypes, setCollModalTypes] = useState([]);
  const [collModalGenders, setCollModalGenders] = useState([]);
  const [collModalPurities, setCollModalPurities] = useState([]);
  const [collModalWeightMin, setCollModalWeightMin] = useState(0);
  const [collModalWeightMax, setCollModalWeightMax] = useState(1000);
  const [selectedCollectionName, setSelectedCollectionName] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const COLLECTION_API = "https://test-check-q5kj.onrender.com/gold";
  const itemTypes = ["Gold", "Silver", "Diamond", "Platinum", "Rose Gold", "White Gold"];
  const genders = ["Male", "Female", "Unisex", "Kids"];
  const purities = ["18K", "22K", "24K", "925"];

  const fetchCollectionsForModal = async () => {
    setCollectionsLoading(true);
    try {
      const res = await fetch(COLLECTION_API);
      const json = await res.json();
      if (Array.isArray(json.data)) {
        setCollectionsData(json.data);
        const weights = json.data.map((i) => Number(i.weight_gm)).filter((w) => Number.isFinite(w));
        if (weights.length) setCollModalWeightMax(Math.ceil(Math.max(...weights) / 100) * 100);
      } else {
        setCollectionsData([]);
      }
    } catch (e) {
      console.error("Failed to fetch collections:", e);
      setCollectionsData([]);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const openCollectionsModal = () => {
    setShowCollectionsModal(true);
    setSelectedCollectionName(null);
    setOpen(false);
    fetchCollectionsForModal();
  };

  const closeCollectionsModal = () => {
    setShowCollectionsModal(false);
    setSelectedCollectionName(null);
  };

  const goToCollectionsPage = () => {
    closeCollectionsModal();
    navigate("/collection", {
      state: {
        selectedCategory: selectedCollectionName,
        selectedTypes: collModalTypes,
        selectedGenders: collModalGenders,
        selectedPurities: collModalPurities,
        weightMin: collModalWeightMin,
        weightMax: collModalWeightMax,
      },
    });
  };

  const toggleCollType = (t) => setCollModalTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  const toggleCollGender = (g) => setCollModalGenders((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  const toggleCollPurity = (p) => setCollModalPurities((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  const clearCollModalFilters = () => {
    setCollModalTypes([]);
    setCollModalGenders([]);
    setCollModalPurities([]);
    setCollModalWeightMin(0);
  };

  const apkDownloadLink =
    "https://drive.google.com/file/d/1v7xpcBh5YDqwXIpa8WyFmqQM6kqZEI9z/view?usp=drivesdk";

  useEffect(() => {
    fetchAllMetalPrices();
    const interval = setInterval(fetchAllMetalPrices, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Rotate through different purities every 5 seconds
  useEffect(() => {
    const getAllPricesToShow = () => {
      const allPrices = [];
      if (allMetalPrices.gold && allMetalPrices.gold.length > 0) {
        allPrices.push(...allMetalPrices.gold);
      }
      if (allMetalPrices.silver && allMetalPrices.silver.length > 0) {
        allPrices.push(...allMetalPrices.silver);
      }
      return allPrices;
    };

    const allPricesToShow = getAllPricesToShow();
    if (allPricesToShow.length > 0) {
      const interval = setInterval(() => {
        setCurrentPriceIndex((prev) => (prev + 1) % allPricesToShow.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [allMetalPrices]);

  const fetchAllMetalPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://klsbackend.onrender.com/get-metal-rates');
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const groupedPrices = data.data.reduce((acc, price) => {
          if (!acc[price.metal_type]) {
            acc[price.metal_type] = [];
          }
          acc[price.metal_type].push(price);
          return acc;
        }, {});
        
        setAllMetalPrices(groupedPrices);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching metal prices:', err);
      setError('Unable to fetch live prices');
      setAllMetalPrices({
        gold: [{
          metal_type: "gold",
          purity: "24K",
          rate_per_gram: 14590,
          currency: "INR"
        }],
        silver: [{
          metal_type: "silver",
          purity: "",
          rate_per_gram: 295.75,
          currency: "INR"
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '--';
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const mainNavItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Update Payment", path: "/update-your-payment" },
    { name: "Contacts", path: "/contact" },
  ];

  const bottomNavItems = [
    { name: "Collections", path: "/collection", icon: LayoutGrid },
    { name: "Your Chitti", path: "/chitti", icon: Wallet, highlight: true },
    { name: "Calculator", path: "/metal-calculator", icon: Calculator },
  ];

  const allNavItemsForSearch = [...mainNavItems, ...bottomNavItems];

  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = allNavItemsForSearch
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.path.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((item) => ({ name: item.name, path: item.path }));
      setSearchSuggestions(suggestions.slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setOpen(false);
    }
    setSearchQuery("");
  };

  const storeLocations = [
    {
      id: "main-branch",
      name: "KLS Jewels Main Branch",
      address: "Beside Old Sangeetha Mobiles, Bengaluru Circle, Chintamani",
    },
  ];

  return (
    <>
      {/* Price Ticker Header - Above Navigation */}
      <div className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-2 sticky top-0 z-50 shadow-md overflow-x-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 min-w-max sm:min-w-0">
            {/* Left: Rotating Metal Price Display */}
            <div className="flex items-center gap-3 text-xs sm:text-sm md:text-base">
              {loading ? (
                <span className="text-amber-100">Loading prices...</span>
              ) : (() => {
                // Get all prices to rotate through
                const allPricesToShow = [];
                if (allMetalPrices.gold && allMetalPrices.gold.length > 0) {
                  allPricesToShow.push(...allMetalPrices.gold);
                }
                if (allMetalPrices.silver && allMetalPrices.silver.length > 0) {
                  allPricesToShow.push(...allMetalPrices.silver);
                }

                // Get current price to display
                const currentPrice = allPricesToShow[currentPriceIndex];

                return currentPrice ? (
                  <div className="flex items-center gap-1 animate-fade">
                    <span className="font-semibold">
                      {currentPrice.metal_type === 'gold' ? 'Gold' : 'Silver'}
                    </span>
                    <span className={`font-bold ${currentPrice.metal_type === 'gold' ? 'text-yellow-200' : 'text-gray-200'}`}>
                      ₹{formatPrice(currentPrice.rate_per_gram)}
                    </span>
                    <span className="text-amber-100 text-xs">({currentPrice.purity || 'Standard'})</span>
                  </div>
                ) : (
                  <span className="text-amber-100">--</span>
                );
              })()}
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Instagram Button */}
              <a
                href="https://www.instagram.com/kjp_jewellers?igsh=MTEwNjBiOWdpanZmOA=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                title="Follow us on Instagram"
              >
                <Instagram size={18} />
              </a>

              {/* Email Button */}
              <a
                href="mailto:korarlajewellerypalace@gmail.com"
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                title="Send us an email"
              >
                <Mail size={18} />
              </a>

              {/* Call Button */}
              <a
                href="tel:9448866788"
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                title="Call us"
              >
                <span className="text-lg">📞</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm">
        {/* Bluestone-style: Single clean header row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          {/* Mobile Only: Logo and Name - Left Side */}
          <Link to="/" className="sm:hidden flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="KLS Jewels"
              className="h-12 w-10 object-contain"
            />
            <div className="ml-1.5">
              <span className="text-[9px] font-semibold text-gray-900 block leading-tight">
                KOMARAL <span className="text-amber-600">JEWELLERY</span>
              </span>
              <span className="text-[6px] text-gray-500 block">
                  BY KLS GROUP SINCE 1975
              </span>
            </div>
          </Link>

          {/* Left: Social Icons - Desktop Only (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
            <a
              href="https://wa.me/919448866788"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              title="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
            <a
              href="https://www.instagram.com/kjp_jewellers?igsh=MTEwNjBiOWdpanZmOA=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
              title="Instagram"
            >
              <Instagram size={16} />
            </a>
          </div>

          {/* Center: Logo and Name - Desktop Only */}
          <Link to="/" className="hidden sm:flex items-center flex-shrink-0 flex-1 justify-start sm:ml-2">
            <img
              src={logo}
              alt="KLS Jewels"
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 object-contain"
            />
            <div className="ml-2 sm:ml-3 lg:ml-4">
              <span className="text-[10px] sm:text-base lg:text-lg font-semibold text-gray-900 block leading-tight">
                KOMARLA <span className="text-amber-600">JEWELLWEY</span>
              </span>
              <span className="text-[7px] sm:text-[10px] lg:text-xs text-gray-500 block">
                BY KLS GROUP SINCE 1975
              </span>
            </div>
          </Link>

          {/* Center: Search - Desktop Only */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Collection, Gallery, Chitti..."
                className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 rounded-md text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  {searchSuggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        navigate(s.path);
                        setSearchQuery("");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 ml-1 sm:ml-0">
            {/* Location - Desktop */}
            <div className="hidden lg:block relative group">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
                <MapPin size={18} />
                <span>Store</span>
                <ChevronDown size={14} />
              </button>
              <div className="absolute top-full right-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Store size={16} />
                  Our Location
                </h4>
                {storeLocations.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => navigate("/contact")}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium text-gray-900">{store.name}</p>
                    <p className="text-sm text-gray-600 mt-0">{store.address}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Download App - Desktop */}
            <button
              onClick={() => window.open(apkDownloadLink, "_blank")}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <Download size={18} />
              Download App
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop: Horizontal Nav Links - Bluestone category bar */}
        <nav className="hidden lg:flex items-center border-t border-gray-100 overflow-x-auto">
          <ul className="flex items-center gap-1 py-3 min-w-0">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "text-amber-600 bg-amber-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } ${item.highlight ? "flex items-center gap-1.5" : ""}`}
                >
                  {item.name}
                  {item.highlight && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white relative z-50">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
              />
            </form>
            {[...mainNavItems, ...bottomNavItems].map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  if (item.path === "/collection") {
                    openCollectionsModal();
                  } else {
                    navigate(item.path);
                    setOpen(false);
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-amber-50 text-amber-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.name}
                {item.highlight && (
                  <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </button>
            ))}
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-3"></div>
            
            {/* Social Links in Mobile Menu */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-4">Connect With Us</p>
              
              {/* WhatsApp */}
              <a
                href="https://wa.me/919448866788"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-green-600 hover:bg-green-50 rounded-lg font-medium text-sm"
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </a>
              
              {/* Instagram */}
              <a
                href="https://www.instagram.com/kjp_jewellers?igsh=MTEwNjBiOWdpanZmOA=="
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-pink-600 hover:bg-pink-50 rounded-lg font-medium text-sm"
              >
                <Instagram size={18} />
                <span>Instagram</span>
              </a>
              
              {/* Email */}
              <a
                href="mailto:korarlajewellerypalace@gmail.com"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-amber-600 hover:bg-amber-50 rounded-lg font-medium text-sm"
              >
                <Mail size={18} />
                <span>Email</span>
              </a>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-3"></div>
            
            <button
              onClick={() => {
                window.open(apkDownloadLink, "_blank");
                setOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white font-medium rounded-lg mt-2"
            >
              <Download size={18} />
              Download App
            </button>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Social Media Links - Right Side - Desktop and Tablet Only */}
      <div className="hidden md:flex fixed right-2 lg:right-4 top-32 lg:top-44 z-30 flex-col gap-2 lg:gap-4">
        {/* Instagram */}
        <a
         href="https://www.instagram.com/kjp_jewellers?igsh=MTEwNjBiOWdpanZmOA=="
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
          aria-label="Instagram"
          title="Follow us on Instagram"
        >
          <Instagram size={18} />
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919448866788"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-11 lg:w-12 lg:h-12 rounded-full bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:scale-110 transition-all duration-300"
          aria-label="WhatsApp"
          title="Contact us on WhatsApp"
        >
          <MessageCircle size={18} />
        </a>

        {/* Email */}
        <a
           href="mailto:korarlajewellerypalace@gmail.com"
          className="flex items-center justify-center w-11 lg:w-12 lg:h-12 rounded-full bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg hover:scale-110 transition-all duration-300"
          aria-label="Email"
          title="Send us an email"
        >
          <Mail size={18} />
        </a>
      </div>

      {/* Bottom Menu Bar - Collections, Your Chitti, Calculator */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isCollections = item.path === "/collection";
              const content = (
                <>
                  <span className="relative inline-block">
                    <Icon size={22} className="flex-shrink-0" />
                    {item.highlight && !isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </span>
                  <span className="text-xs font-medium mt-1 truncate w-full text-center max-w-[80px]">
                    {item.name}
                  </span>
                </>
              );
              if (isCollections) {
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={openCollectionsModal}
                    className={`relative flex flex-col items-center justify-center flex-1 py-2 px-1 min-w-0 rounded-lg transition-colors ${
                      isActive ? "text-amber-600 bg-amber-50" : "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
                    }`}
                  >
                    {content}
                  </button>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex flex-col items-center justify-center flex-1 py-2 px-1 min-w-0 rounded-lg transition-colors ${
                    isActive ? "text-amber-600 bg-amber-50" : "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
                  }`}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Collections Modal: Names → Filters → View collections (no direct navigate) */}
      {showCollectionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeCollectionsModal}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Collections</h3>
              <button onClick={closeCollectionsModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {collectionsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
                  <p className="text-gray-500 text-sm">Loading collections...</p>
                </div>
              ) : (
                <>
                  {/* 1. Collection names with images (clickable, selectable) */}
                  <div>
                    <h4 className="font-medium mb-3 text-gray-800">Collections</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide min-h-[100px]">
                      {(() => {
                        const names = [...new Set(collectionsData.map((i) => i.name))].sort();
                        if (names.length === 0) {
                          return <p className="text-sm text-gray-500 py-2">No collections found.</p>;
                        }
                        return names.map((name) => {
                          const items = collectionsData.filter((i) => i.name === name);
                          const firstItem = items[0];
                          const count = items.length;
                          const isSelected = selectedCollectionName === name;
                          return (
                            <button
                              key={name}
                              type="button"
                              onClick={() => setSelectedCollectionName(name)}
                              className="flex flex-col items-center gap-1.5 flex-shrink-0 focus:outline-none cursor-pointer"
                            >
                              <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 transition-all shadow-sm ${
                                isSelected
                                  ? "border-amber-600 shadow-lg scale-110 bg-amber-50"
                                  : "border-gray-200 hover:border-amber-400 bg-gray-100"
                              }`}>
                                {firstItem?.image_url ? (
                                  <img
                                    src={firstItem.image_url}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
                                    <Gem className="w-8 h-8 text-amber-600" />
                                  </div>
                                )}
                                {isSelected && (
                                  <div className="absolute inset-0 bg-black/10 rounded-full"></div>
                                )}
                              </div>
                              <div className="text-center">
                                <p className={`text-xs font-medium max-w-[72px] truncate ${
                                  isSelected ? "text-amber-600" : "text-gray-800"
                                }`}>{name}</p>
                                <p className="text-[10px] text-gray-500">({count})</p>
                              </div>
                            </button>
                          );
                        });
                      })()}
                    </div>
                    <style>{`
                      .scrollbar-hide::-webkit-scrollbar { display: none; }
                      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>
                  </div>

                  {/* 2. Filters */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-3 text-gray-800">Filters</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Material type</p>
                        <div className="flex flex-wrap gap-2">
                          {itemTypes.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => toggleCollType(t)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                collModalTypes.includes(t) ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Gender</p>
                        <div className="flex flex-wrap gap-2">
                          {genders.map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => toggleCollGender(g)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                collModalGenders.includes(g) ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Purity</p>
                        <div className="flex flex-wrap gap-2">
                          {purities.map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => toggleCollPurity(p)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                collModalPurities.includes(p) ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5" />
                          Min weight (gm)
                        </p>
                        <input
                          type="range"
                          min={0}
                          max={collModalWeightMax}
                          value={collModalWeightMin}
                          onChange={(e) => setCollModalWeightMin(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">0 – {collModalWeightMin} gm (min)</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!collectionsLoading && collectionsData.length > 0 && (
              <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
                <button type="button" onClick={clearCollModalFilters} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-medium">
                  Clear filters
                </button>
                <button type="button" onClick={goToCollectionsPage} className="flex-1 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 font-medium">
                  View collections
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prices Modal */}
    {showPricesModal && (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm">
        <div className="relative bg-gradient-to-b from-gray-900 to-black w-full max-w-md sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-yellow-900/50 max-h-[85vh] overflow-hidden">
          {/* Modal Header */}
          <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-gray-950 p-4 sm:p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Live Metal Rates</h2>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-green-400 text-xs">● REAL TIME</span>
                    <span className="text-gray-400 text-xs">|</span>
                    <span className="text-yellow-200/80 text-xs">
                      {new Date().toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPricesModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-yellow-900/30 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                  </div>
                </div>
                <p className="mt-4 text-gray-400">Fetching latest rates...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-900/20 to-red-950/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchAllMetalPrices}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-700 to-yellow-900 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-800 transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Gold Section */}
                {allMetalPrices.gold && allMetalPrices.gold.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-950/20 to-yellow-900/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-900/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-200">Gold</h3>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {allMetalPrices.gold.map((price, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-yellow-900/20 last:border-0">
                          <div>
                            <span className="text-gray-300 text-sm">{price.purity}</span>
                            <p className="text-gray-400 text-xs">Gold Purity</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-yellow-300">
                              ₹{formatPrice(price.rate_per_gram)}
                              <span className="text-yellow-200/70 text-sm ml-1">/g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Silver Section */}
                {allMetalPrices.silver && allMetalPrices.silver.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-900/20 to-gray-800/10 backdrop-blur-sm rounded-xl p-4 border border-gray-800/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-200">Silver</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-gray-300 text-sm">{allMetalPrices.silver[0].purity || "24"} Purity</span>
                        <p className="text-gray-400 text-xs">Fine Silver</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-300">
                          ₹{formatPrice(allMetalPrices.silver[0].rate_per_gram)}
                          <span className="text-gray-200/70 text-sm ml-1">/g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Diamond Section */}
                {allMetalPrices.diamond && allMetalPrices.diamond.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-950/20 to-blue-900/10 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2l4 4 4-4-2-2-2 2-2-2-2 2-2-2-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-200">Diamond</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-gray-300 text-sm">Premium Quality</span>
                        <p className="text-gray-400 text-xs">Fine Diamonds</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-300">
                          ₹{formatPrice(allMetalPrices.diamond[0].rate_per_carat)}
                          <span className="text-blue-200/70 text-sm ml-1">/carat</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-500 text-xs text-center">
                    Prices update every 5 minutes. Rates are indicative and may vary for custom jewelry.
                  </p>
                  <p className="text-gray-400 text-xs text-center mt-1">
                    Last updated: {new Date().toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gradient-to-t from-gray-950 to-transparent p-4 border-t border-gray-800">
            <div className="flex gap-3">
              <button
                onClick={fetchAllMetalPrices}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-800 to-yellow-900 text-white font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>UPDATING</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>REFRESH</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowPricesModal(false)}
                className="flex-1 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};


export default Navbar;
