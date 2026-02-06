import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-yellow-50 to-amber-50 border-t border-amber-200 mt-12">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-gray-700">
        {/* Top Links + Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">KLS Jewellers</h3>
            <p className="text-sm">
              Beside Old Sangeetha Mobiles, Bengaluru Circle, Chintamani <br />
              Showroom: 10 AM – 8 PM
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              <li><a href="/collection" className="hover:underline">Our Designs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                📞 <a href="tel:9448866788" className="hover:underline text-blue-600">
                  94488 66788
                </a>
              </li>
              <li>
                ✉️ <a href="mailto:korarlajewellerypalace@gmail.com" className="hover:underline text-blue-600">
                  korarlajewellerypalace@gmail.com
                </a>
              </li>
              <li>
                📍 Beside Old Sangeetha Mobiles, Chintamani
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Follow Us</h4>
            <div className="flex items-center space-x-4 text-sm">
              <a
                href="https://wa.me/919448866788"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800"
              >
                WhatsApp
              </a>

              <a
                href="mailto:korarlajewellerypalace@gmail.com"
                className="text-blue-600 hover:text-blue-800"
              >
                Email
              </a>

              <a
                href="https://www.instagram.com/kjp_jewellers?igsh=MTEwNjBiOWdpanZmOA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-700"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-amber-200 mt-8"></div>

        {/* Bottom */}
        <div className="mt-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} KLS Jewellers — Korarla Jewellery Palace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
