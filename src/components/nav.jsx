import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Download } from "lucide-react";
import logo from "../assets/image/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // APK download link
  const apkDownloadLink = "https://drive.google.com/file/d/1v7xpcBh5YDqwXIpa8WyFmqQM6kqZEI9z/view?usp=drivesdk";

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Collection", path: "/collection" },
    { name: "Gallery", path: "/gallery" },
    { name: "Your Chitti", path: "/chitti", highlight: true },
    { name: "Contact", path: "/contact" },
    { name: "Jewelry Calculator", path: "/metal-calculator" },
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleDownloadClick = () => {
    // Open the download link in a new tab
    window.open(apkDownloadLink, "_blank");
    setOpen(false);
  };

  return (
    <header
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-white py-3"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={() => setOpen(false)}
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              <img
                src={logo}
                alt="KLS Gold Logo"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                KLS
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent ml-1">
                  Gold
                </span>
              </span>
              <span className="text-xs text-gray-500 font-light tracking-wider">
                Trusted Since 1995
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    location.pathname === item.path
                      ? "text-yellow-600"
                      : "text-gray-700 hover:text-yellow-600"
                  } ${item.highlight ? "font-semibold" : ""}`}
                >
                  <span className="relative">
                    {item.name}
                    {location.pathname === item.path && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-500"></span>
                    )}
                  </span>
                </Link>
                {item.highlight && (
                  <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Download APK Button */}
            <button
              onClick={handleDownloadClick}
              className="ml-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Download App</span>
            </button>
            
            {/* Special Button for Your Chitti */}
            <Link
              to="/chitti"
              className="ml-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Your Chitti
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Mobile Download Button */}
            <button
              onClick={handleDownloadClick}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md flex items-center space-x-2"
            >
              <Download size={16} />
              <span>App</span>
            </button>
            
            <Link
              to="/chitti"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold text-sm hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-md"
            >
              Your Chitti
            </Link>
            
            <button
              onClick={() => setOpen(!open)}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                open
                  ? "bg-yellow-50 text-yellow-600"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Toggle menu"
            >
              {open ? (
                <X size={24} className="transform rotate-180 transition-transform duration-300" />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown - FIXED */}
        <div
          className={`lg:hidden absolute left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 ease-in-out z-50 ${
            open 
              ? "opacity-100 visible translate-y-0" 
              : "opacity-0 invisible -translate-y-4"
          }`}
          style={{
            maxHeight: open ? "calc(100vh - 100px)" : "0",
            overflowY: "auto"
          }}
        >
          <div className="py-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center px-6 py-3.5 transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-yellow-50 text-yellow-600 border-l-4 border-yellow-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-yellow-600"
                } ${item.highlight ? "font-semibold" : ""}`}
              >
                <span className="flex-1">{item.name}</span>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse ml-2"></span>
                )}
                {location.pathname === item.path && (
                  <ChevronDown size={16} className="text-yellow-500 transform -rotate-90 ml-2" />
                )}
              </Link>
            ))}
            
            {/* Download APK in Mobile Menu */}
            <button
              onClick={handleDownloadClick}
              className="flex items-center w-full px-6 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <Download size={18} className="mr-3" />
              <span className="flex-1 text-left font-medium">Download App</span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">APK</span>
            </button>
          </div>
          
          {/* Mobile Footer */}
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              KLS Gold &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;