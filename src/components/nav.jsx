import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, MapPin, Store, Download, ChevronDown, X, Menu, ChevronRight, Phone } from "lucide-react";
import logo from "../assets/image/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showStores, setShowStores] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const storesRef = useRef(null);

  // APK download link
  const apkDownloadLink = "https://drive.google.com/file/d/1v7xpcBh5YDqwXIpa8WyFmqQM6kqZEI9z/view?usp=drivesdk";

  // Main navigation items
  const mainNavItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "About", path: "/about", icon: "📖" },
    { name: "Collection", path: "/collection", icon: "💎", highlight: true },
    { name: "Gallery", path: "/gallery", icon: "🖼️" },
    { name: "Your Chitti", path: "/chitti", icon: "💰" },
    { name: "Payment", path: "/update-your-payment", icon: "💳" },
    { name: "Contact", path: "/contact", icon: "📞" },
    { name: "Calculator", path: "/metal-calculator", icon: "🧮" },
  ];

  // Store locations
  const storeLocations = [
    { 
      id: "main-branch", 
      name: "Main Branch", 
      address: "Beside Old Sangeetha Mobiles, Bengaluru Circle, Chintamani",
      phone: "+91 1234567890",
      hours: "10:00 AM - 8:30 PM"
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (storesRef.current && !storesRef.current.contains(event.target)) {
        setShowStores(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search suggestions
  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = mainNavItems
        .filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.path.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(item => ({
          name: item.name,
          path: item.path,
          icon: item.icon
        }));
      
      setSearchSuggestions(suggestions.slice(0, 4));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleDownloadClick = () => {
    window.open(apkDownloadLink, "_blank");
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'}`}>
      {/* Top Bar - Compact Layout */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="KLS Jewels"
                  className="w-10 h-10 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">
                    KLS <span className="text-yellow-600">Jewels</span>
                  </h1>
                  <p className="text-[10px] text-gray-500 tracking-wider">Excellence Since 1995</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center space-x-1 mx-4">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-1.5
                    ${location.pathname === item.path 
                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  {item.highlight && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Action Buttons - Right */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} className="text-gray-600" />
                </button>
                
                {/* Search Dropdown */}
                {showSearch && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 z-50">
                    <form onSubmit={handleSearch} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Search size={18} className="text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search collections, pages, etc..."
                          className="flex-1 border-none focus:ring-0 text-sm text-gray-700 placeholder-gray-400"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowSearch(false)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      {searchSuggestions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 px-1">Quick Links</p>
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                navigate(suggestion.path);
                                setShowSearch(false);
                                setSearchQuery("");
                              }}
                              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg text-left"
                            >
                              <span>{suggestion.icon}</span>
                              <span className="text-sm font-medium text-gray-900">{suggestion.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>

              {/* Stores Dropdown */}
              <div className="relative hidden sm:block" ref={storesRef}>
                <button
                  onClick={() => setShowStores(!showStores)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1"
                >
                  <Store size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 hidden md:inline">Stores</span>
                </button>
                
                {showStores && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <MapPin size={16} className="mr-2" />
                        Our Locations
                      </h4>
                      {storeLocations.map((store) => (
                        <div key={store.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">{store.name}</p>
                          <p className="text-xs text-gray-600 mt-1">{store.address}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1 text-sm text-gray-700">
                              <Phone size={12} />
                              <span>{store.phone}</span>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              {store.hours}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => {
                          navigate("/contact");
                          setShowStores(false);
                        }}
                        className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
                      >
                        View All Details
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Download App Button */}
              <button
                onClick={handleDownloadClick}
                className="hidden md:flex items-center space-x-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Download size={16} />
                <span>App</span>
              </button>

              {/* Contact Button */}
              <a
                href="tel:+911234567890"
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Phone size={16} />
                <span className="hidden lg:inline">Call Now</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden fixed inset-x-0 top-16 bg-white shadow-xl transition-transform duration-300 ease-in-out z-40
        ${open ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Mobile Search Bar */}
          <div className="p-3 border-b">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-gray-50 border-none text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg"
              >
                Go
              </button>
            </form>
          </div>

          {/* Mobile Navigation Items */}
          <div className="grid grid-cols-2 gap-1 p-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-1.5 transition-colors
                  ${location.pathname === item.path
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium text-center">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="p-3 border-t space-y-2">
            <button
              onClick={() => {
                handleDownloadClick();
                setOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg"
            >
              <Download size={18} />
              <span>Download App</span>
            </button>
            
            <a
              href="tel:+911234567890"
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white font-medium rounded-lg"
              onClick={() => setOpen(false)}
            >
              <Phone size={18} />
              <span>Call Now: +91 1234567890</span>
            </a>
          </div>

          {/* Store Info */}
          <div className="p-3 bg-gray-50 border-t">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Visit Our Store:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Beside Old Sangeetha Mobiles</p>
                <p>Bengaluru Circle, Chintamani</p>
                <p className="text-gray-500">10:00 AM - 8:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;