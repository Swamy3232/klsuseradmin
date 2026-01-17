import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="text-2xl font-bold text-yellow-600">
            KLS <span className="text-gray-900">Gold</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
            <a href="/" className="hover:text-yellow-600 transition">Home</a>
            <a href="/about" className="hover:text-yellow-600 transition">About</a>
            <a href="/collection" className="hover:text-yellow-600 transition">Collection</a>
            <a href="/gallery" className="hover:text-yellow-600 transition">Gallery</a>
            <a
              href="/chitti"
              className="ml-4 px-4 py-1 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition"
            >
              Your Chitti
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} className="text-gray-800">
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 flex flex-col bg-white border-t">
            {["Home", "About", "Collection", "Gallery", "Your Chitti"].map(
              (item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "")}`}
                  className="block px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition"
                >
                  {item}
                </a>
              )
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
