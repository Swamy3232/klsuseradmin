import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Collection", path: "/collection" },
    { name: "Gallery", path: "/gallery" },
    { name: "Your Chitti", path: "/chitti" },
    {name: "Contact", path:"/contact"}
    
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-yellow-600">
            KLS <span className="text-gray-900">Gold</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
            {menuItems.map((item) => (
              item.name === "Your Chitti" ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className="ml-4 px-4 py-1 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition"
                >
                  {item.name}
                </Link>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="hover:text-yellow-600 transition"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setOpen(!open)} 
              className="text-gray-800 p-2 touch-manipulation"
              aria-label="Toggle menu"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 flex flex-col bg-white border-t">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className="block px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition touch-manipulation min-h-[44px] flex items-center"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
