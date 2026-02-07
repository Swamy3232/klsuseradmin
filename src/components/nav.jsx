import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, MapPin, Store, Download, ChevronDown, X, Menu } from "lucide-react";
import logo from "../assets/image/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const apkDownloadLink =
    "https://drive.google.com/file/d/1v7xpcBh5YDqwXIpa8WyFmqQM6kqZEI9z/view?usp=drivesdk";

  const mainNavItems = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/collection" },
    { name: "Gallery", path: "/gallery" },
    { name: "Your Chitti", path: "/chitti", highlight: true },
    { name: "Update Payment", path: "/update-your-payment" },
    { name: "Calculator", path: "/metal-calculator" },
    { name: "Contacts", path: "/contact" },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = mainNavItems
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
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      {/* Bluestone-style: Single clean header row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="KLS Jewels"
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain"
            />
            <div className="ml-2 lg:ml-3">
              <span className="text-lg lg:text-xl font-semibold text-gray-900 block leading-tight">
                KLS <span className="text-amber-600">Jewels</span>
              </span>
              <span className="text-[10px] lg:text-xs text-gray-500 hidden sm:block">
                Excellence Since 1995
              </span>
            </div>
          </Link>

          {/* Center: Search - Bluestone style */}
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
          <div className="flex items-center gap-2 lg:gap-4">
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
              {open ? <X size={24} /> : <Menu size={24} />}
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

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
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
            {mainNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
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
          className="lg:hidden fixed inset-0 bg-black/20 z-[-1]"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
