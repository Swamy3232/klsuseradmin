import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import your images
import img1 from "../assets/image/1.png";
import img2 from "../assets/image/2.jpg";
import img3 from "../assets/image/3.jpg";
import img4 from "../assets/image/4.jpeg";
import img5 from "../assets/image/5.png";
import img6 from "../assets/image/6.PNG";
import img7 from "../assets/image/7.PNG";
import img8 from "../assets/image/8.PNG";
import img9 from "../assets/image/9.PNG";
import img10 from "../assets/image/10.JPG";
import img11 from "../assets/image/11.JPG";
import img12 from "../assets/image/12.JPG";
import img13 from "../assets/image/13.JPG";
import img14 from "../assets/image/14.JPG";
import img15 from "../assets/image/15.JPG";
import img16 from "../assets/image/16.JPG";
import img17 from "../assets/image/17.JPG";

// Array of images with titles and optional descriptions
const images = [
  { src: img1, title: "Chain", description: "Premium Gold Collection" },
  { src: img2, title: "Ring", description: "Handcrafted Excellence" },
  { src: img3, title: "Winter Whispers", description: "Seasonal Elegance" },
  { src: img4, title: "Summer Shine", description: "Radiant Designs" },
  { src: img5, title: "Spring Bloom", description: "Nature Inspired" },
  { src: img6, title: "Earrings", description: "Subtle Sophistication" },
  { src: img7, title: "Necklace", description: "Centerpiece Elegance" },
  { src: img8, title: "Bracelet", description: "Wrist Adornments" },
  { src: img9, title: "Pendant", description: "Personal Statements" },
  { src: img10, title: "Classic Collection", description: "Timeless Beauty" },
  { src: img11, title: "Golden Glow", description: "Luxury Redefined" },
  { src: img12, title: "Diamond Spark", description: "Brilliant Craftsmanship" },
  { src: img13, title: "Royal Elegance", description: "Regal Designs" },
  { src: img14, title: "Vintage Charm", description: "Heritage Collection" },
  { src: img15, title: "Modern Style", description: "Contemporary Designs" },
  { src: img16, title: "Luxury Line", description: "Exclusive Creations" },
  { src: img17, title: "Exclusive Edition", description: "Limited Series" },
];

const KlsGoldSlider = () => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [silverPrice, setSilverPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetalPrices();
    // Refresh prices every 5 minutes
    const interval = setInterval(fetchMetalPrices, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetalPrices = async () => {
    try {
      setLoading(true);
      
      // Fetch gold price
      const goldResponse = await fetch('http://127.0.0.1:8000/get-metal-rates?metal_type=gold');
      const goldData = await goldResponse.json();
      
      // Fetch silver price
      const silverResponse = await fetch('http://127.0.0.1:8000/get-metal-rates?metal_type=silver');
      const silverData = await silverResponse.json();
      
      if (goldData.data && goldData.data.length > 0) {
        setGoldPrice(goldData.data[0]);
      }
      
      if (silverData.data && silverData.data.length > 0) {
        setSilverPrice(silverData.data[0]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching metal prices:', err);
      setError('Unable to fetch live prices');
      // Set fallback prices
      setGoldPrice({
        metal_type: "gold",
        rate_per_gram: 5000,
        currency: "INR",
        effective_date: new Date().toISOString().split('T')[0]
      });
      setSilverPrice({
        metal_type: "silver",
        rate_per_gram: 600,
        currency: "INR",
        effective_date: new Date().toISOString().split('T')[0]
      });
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    pauseOnHover: false,
    pauseOnFocus: false,
    swipe: false,
    touchMove: false,
    adaptiveHeight: true,
    dotsClass: "slick-dots custom-dots",
    appendDots: dots => (
      <div className="mt-8">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 bg-gray-300 rounded-full hover:bg-yellow-500 transition-colors duration-300"></div>
    )
  };

  // Format price with Indian numbering system
  const formatPrice = (price) => {
    if (!price) return '--';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Top Section with Branding */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-2 tracking-wider">
              KLS GOLD
            </h1>
            <p className="text-white text-lg md:text-xl font-light tracking-widest uppercase">
              Timeless Elegance • Exceptional Craftsmanship
            </p>
          </div>
        </div>
      </div>

      {/* Live Price Indicators - Left Side */}
      <div className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col space-y-4">
          {/* Gold Price */}
          <div className="relative group">
            <div className="bg-gradient-to-r from-yellow-600/90 to-yellow-800/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-yellow-400/30 transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-bold text-lg">GOLD</h3>
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                    ) : error ? (
                      <span className="text-red-300 text-xs">Offline</span>
                    ) : (
                      <span className="text-green-400 text-xs animate-pulse">● LIVE</span>
                    )}
                  </div>
                  <div className="text-yellow-300 font-bold text-xl">
                    ₹ {formatPrice(goldPrice?.rate_per_gram)}
                    <span className="text-white text-sm font-normal ml-1">/g</span>
                  </div>
                  <p className="text-yellow-200/80 text-xs mt-1">
                    {goldPrice?.effective_date || 'Today'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl border border-yellow-500/30 w-48">
                <p className="text-sm">Live gold rate per gram (24K)</p>
                <p className="text-xs text-gray-300 mt-1">Updated in real-time</p>
              </div>
            </div>
          </div>

          {/* Silver Price */}
          <div className="relative group">
            <div className="bg-gradient-to-r from-gray-700/90 to-gray-900/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-gray-400/30 transform transition-all duration-300 hover:scale-105 hover:shadow-gray-400/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-bold text-lg">SILVER</h3>
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    ) : error ? (
                      <span className="text-red-300 text-xs">Offline</span>
                    ) : (
                      <span className="text-green-400 text-xs animate-pulse">● LIVE</span>
                    )}
                  </div>
                  <div className="text-gray-300 font-bold text-xl">
                    ₹ {formatPrice(silverPrice?.rate_per_gram)}
                    <span className="text-white text-sm font-normal ml-1">/g</span>
                  </div>
                  <p className="text-gray-300/80 text-xs mt-1">
                    {silverPrice?.effective_date || 'Today'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl border border-gray-500/30 w-48">
                <p className="text-sm">Live silver rate per gram</p>
                <p className="text-xs text-gray-300 mt-1">Updated in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Prices Banner - Right Side */}
      <div className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-yellow-500/20 transform hover:scale-105 transition-transform duration-300">
          <div className="text-center mb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-600/30 rounded-full">
              <span className="text-yellow-400 text-sm font-bold tracking-wider">LIVE PRICES</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">24K Gold:</span>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400 font-bold">₹ {formatPrice(goldPrice?.rate_per_gram)}</span>
                <span className="text-gray-400 text-xs">/g</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Silver:</span>
              <div className="flex items-center space-x-1">
                <span className="text-gray-300 font-bold">₹ {formatPrice(silverPrice?.rate_per_gram)}</span>
                <span className="text-gray-400 text-xs">/g</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-700/50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Updated:</span>
                <span className="text-gray-300">
                  {goldPrice?.effective_date ? 
                    new Date(goldPrice.effective_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    }) : 'Today'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Refresh Button */}
          <button 
            onClick={fetchMetalPrices}
            disabled={loading}
            className="mt-4 w-full py-2 bg-gradient-to-r from-yellow-700 to-yellow-900 text-white text-sm font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Rates</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Slider */}
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="relative">
            {/* Background Image with Overlay */}
            <div className="relative w-full h-[45vh] md:h-[60vh] max-h-[650px] overflow-hidden">
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover object-center scale-110 animate-zoomSlow"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 max-w-4xl transform transition-all duration-1000 animate-slideUp">
                  <div className="inline-block bg-black/40 backdrop-blur-sm px-8 py-6 rounded-2xl border border-yellow-600/30">
                    <h2 className="text-4xl md:text-6xl font-bold text-yellow-300 mb-4 tracking-tight">
                      {img.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-200 font-light mb-6">
                      {img.description}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button className="px-8 py-3 bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300">
                        View Collection
                      </button>
                      <button className="px-8 py-3 bg-transparent border-2 border-yellow-500 text-yellow-400 font-semibold rounded-full hover:bg-yellow-500/10 transform hover:scale-105 transition-all duration-300">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 animate-progressBar"></div>
                  </div>
                  <span className="text-white text-sm font-mono">
                    {index + 1}/{images.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Navigation Hint */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-70 animate-pulse">
        <p className="text-white text-sm tracking-widest uppercase">
          Auto-rotating every 2 seconds
        </p>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes zoomSlow {
          0% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes slideUp {
          0% { 
            opacity: 0;
            transform: translateY(30px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes progressBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-zoomSlow {
          animation: zoomSlow 20s linear infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 1.5s ease-out;
        }
        
        .animate-progressBar {
          animation: progressBar 2s linear;
          animation-iteration-count: infinite;
        }
        
        :global(.slick-dots li.slick-active div) {
          background-color: #fbbf24 !important;
          transform: scale(1.2);
        }
        
        :global(.slick-prev:before, .slick-next:before) {
          color: #fbbf24;
          font-size: 30px;
        }
        
        :global(.slick-prev) {
          left: 25px;
          z-index: 1;
        }
        
        :global(.slick-next) {
          right: 25px;
        }
      `}</style>
    </div>
  );
};

export default KlsGoldSlider;