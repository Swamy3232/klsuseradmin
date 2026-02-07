import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Collection", path: "/collection" },
    { label: "Gallery", path: "/gallery" },
    { label: "Your Chitti", path: "/chitti" },
    { label: "Update Payment", path: "/update-your-payment" },
    { label: "Calculator", path: "/metal-calculator" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">KLS Jewels</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Beside Old Sangeetha Mobiles, Bengaluru Circle, Chintamani
            </p>
            <p className="text-sm text-gray-400">Showroom: 10 AM – 8 PM</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:9448866788"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  📞 94488 66788
                </a>
              </li>
              <li>
                <a
                  href="mailto:korarlajewellerypalace@gmail.com"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  ✉️ korarlajewellerypalace@gmail.com
                </a>
              </li>
              <li className="text-gray-400">📍 Beside Old Sangeetha Mobiles, Chintamani</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Follow Us
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="https://wa.me/919448866788"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/kjp_jewellers?igsh=MTEwNjBiOWdpanZmOA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                Instagram
              </a>
              <a
                href="mailto:korarlajewellerypalace@gmail.com"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <p className="text-center text-xs sm:text-sm text-gray-500 px-2">
            © {new Date().getFullYear()} KLS Jewels — Korarla Jewellery Palace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
