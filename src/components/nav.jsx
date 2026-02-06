import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, MapPin, Store, Download, ChevronDown, X, Menu, ChevronRight } from "lucide-react";
import logo from "../assets/image/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // APK download link
  const apkDownloadLink =
    "https://drive.google.com/file/d/1v7xpcBh5YDqwXIpa8WyFmqQM6kqZEI9z/view?usp=drivesdk";

  // Main navigation items with categories
  const mainNavItems = [
    { name: "Home", path: "/", category: "home" },
    { name: "About", path: "/about", category: "info" },
    { name: "Collection", path: "/collection", category: "products" },
    { name: "Gallery", path: "/gallery", category: "gallery" },
    { name: "Your Chitti", path: "/chitti", category: "services", highlight: true },
    { name: "Update Payment", path: "/update-your-payment", category: "services" },
    { name: "Contact", path: "/contact", category: "contact" },
    { name: "Jewelry Calculator", path: "/metal-calculator", category: "tools" },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search suggestions effect
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
          type: 'Navigation'
        }));
      
      setSearchSuggestions(suggestions.slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleDownloadClick = () => {
    window.open(apkDownloadLink, "_blank");
    setOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setOpen(false);
    }
    setSearchQuery("");
  };

  const handleStoreClick = (storeId) => {
    if (storeId === "main-branch") {
      navigate("/contact");
    } else {
      const storePath = `/stores/${storeId}`;
      navigate(storePath);
    }
    setOpen(false);
  };

  const handleSuggestionClick = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowSearch(false);
    setOpen(false);
  };

  const storeLocations = [
    { 
      id: "main-branch", 
      name: "KLS Jewels Main Branch", 
      address: "Beside Old Sangeetha Mobiles, Bengaluru Circle, Chintamani"
    },
    // { 
    //   id: "mall-outlet", 
    //   name: "City Center Outlet", 
    //   address: "456 Mall Road, Downtown, Chintamani" 
    // },
  ];

  // Navigation click handler for desktop
  const handleDesktopNavClick = (path) => {
    navigate(path);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      {/* Top Bar - Logo left, Search center, Download & Stores right */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Brand Name */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img
                    src={logo}
                    alt="KLS Jewels Logo"
                    className="w-10 h-10 object-contain drop-shadow-md"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                    KLS
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent ml-1">
                      Jewels
                    </span>
                  </span>
                  <span className="text-xs text-gray-500 font-light tracking-wider">
                    Excellence Since 1995
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden lg:flex-1 lg:flex lg:justify-center px-8">
              <div className="relative w-full max-w-md">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
                >
                  <Search size={18} className="text-gray-500" />
                  <span className="text-gray-600 font-medium">Search ...</span>
                </button>
                
                {/* Search Dropdown */}
                {showSearch && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                    <form onSubmit={handleSearch} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Search size={20} className="text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for pages like Collection, Gallery, etc..."
                          className="flex-1 border-none focus:ring-0 text-gray-700 placeholder-gray-400"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X size={20} className="text-gray-400" />
                        </button>
                      </div>
                      
                      {/* Search Suggestions */}
                      {searchSuggestions.length > 0 && (
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-xs text-gray-500 font-medium mb-2">Quick Navigation</p>
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSuggestionClick(suggestion.path)}
                              className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg text-left"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{suggestion.name}</p>
                                <p className="text-xs text-gray-500">{suggestion.type}</p>
                              </div>
                              <ChevronRight size={16} className="text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Common searches */}
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <p className="font-medium mb-1">Try searching for:</p>
                        <div className="flex flex-wrap gap-2 mt-0">
                          {["Collection", "Gallery", "Chitti", "Calculator", "Contact", "Payment"].map((term, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setSearchQuery(term);
                              }}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-xs"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Download & Stores */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Stores Dropdown (Desktop) */}
              <div className="hidden lg:block relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <Store size={18} className="text-gray-500" />
                  <span className="text-gray-600 font-medium">Location</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                
                {/* Stores Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <MapPin size={16} className="mr-2" />
                      Our Store Locations
                    </h4>
                    {storeLocations.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => handleStoreClick(store.id)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <p className="font-medium text-gray-900">{store.name}</p>
                        <p className="text-sm text-gray-600 mt-0">{store.address}</p>
                        <span className="text-yellow-600 text-sm font-medium mt-2 hover:text-yellow-700 inline-block">
                          View Details →
                        </span>
                      </button>
                    ))}
                    
                    {/* Google Maps Embed for main branch */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Find us on Google Maps:</p>
                      <div className="h-40 rounded-lg overflow-hidden">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.020831798067!2d77.4931997!3d13.0825775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzU3LjMiTiA3N8KwMjknMzkuNSJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="KLS Jewels Location"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download App Button */}
              <button
                onClick={handleDownloadClick}
                className="hidden lg:flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Download size={18} />
                <span>Download App</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  setOpen(!open);
                  if (open) {
                    setShowSearch(false);
                    setSearchQuery("");
                  }
                }}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Black Background */}
      <div className={`relative bg-gray-900 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center justify-center space-x-1">
              {mainNavItems.map((item) => (
                <li key={item.path} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleDesktopNavClick(item.path)}
                    className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative block w-full h-full text-center
                      ${location.pathname === item.path 
                        ? 'text-yellow-400 bg-gray-800' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      }`}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {item.name}
                      {item.highlight && (
                        <span className="ml-2 relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                        </span>
                      )}
                    </span>
                    {location.pathname === item.path && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-yellow-400"></span>
                    )}
                  </button>
                  
                  {/* Category Indicator */}
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium
                      ${item.category === 'products' ? 'bg-yellow-500/20 text-yellow-400' :
                        item.category === 'services' ? 'bg-blue-500/20 text-blue-400' :
                        item.category === 'tools' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                      {item.category}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Navigation Dropdown */}
          <div
            className={`lg:hidden absolute left-0 right-0 mt-0 bg-gray-900 rounded-b-2xl shadow-2xl border border-gray-800 transform transition-all duration-300 ease-in-out z-40
              ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"}`}
          >
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-800">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Collection, Gallery, Chitti, etc..."
                  className="flex-1 bg-gray-800 border-none text-white placeholder-gray-400 focus:ring-0 rounded px-3 py-2"
                  autoFocus={open}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-gray-700 rounded-full"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                )}
              </form>
              
              {/* Mobile Search Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 font-medium mb-2">Suggestions:</p>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.path)}
                      className="w-full text-left p-2 hover:bg-gray-800 rounded-lg mb-1"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{suggestion.name}</p>
                          <p className="text-xs text-gray-400">{suggestion.type}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-500" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Navigation Items */}
            <div className="py-2 max-h-[60vh] overflow-y-auto">
              {mainNavItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    navigate(item.path);
                    handleLinkClick();
                  }}
                  className={`flex items-center justify-between w-full px-6 py-3.5 transition-all duration-200 border-b border-gray-800/50 last:border-b-0
                    ${location.pathname === item.path
                      ? 'bg-gray-800 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{item.name}</span>
                    {item.highlight && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium
                      ${item.category === 'products' ? 'bg-yellow-500/20 text-yellow-400' :
                        item.category === 'services' ? 'bg-blue-500/20 text-blue-400' :
                        item.category === 'tools' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                      {item.category}
                    </span>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <div className="p-4 border-t border-gray-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadClick}
                  className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold"
                >
                  <Download size={18} />
                  <span>Download App</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    navigate("/contact");
                    setOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Store size={18} />
                  <span>Our Location</span>
                </button>
              </div>
              
              {/* Quick Store Access */}
              <div className="pt-3 border-t border-gray-800">
                <p className="text-sm font-medium text-gray-400 mb-2">Store Locations:</p>
                <div className="space-y-2">
                  {storeLocations.map((store) => (
                    <button
                      key={store.id}
                      type="button"
                      onClick={() => handleStoreClick(store.id)}
                      className="w-full text-left p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <p className="text-white font-medium">{store.name}</p>
                      <p className="text-xs text-gray-400 truncate">{store.address}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Click outside to close mobile menu */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;