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

// Metal icon mapping
const metalIcons = {
  gold: {
    icon: "M12 2L8 6l-4-4-2 2 6 6 6-6-2-2z",
    gradient: "from-yellow-300 to-yellow-600",
    bgGradient: "from-yellow-600/90 to-yellow-800/90",
    border: "border-yellow-400/30",
    text: "text-yellow-400",
    color: "text-yellow-300"
  },
  silver: {
    icon: "M12 2L8 6l-4-4-2 2 6 6 6-6-2-2z",
    gradient: "from-gray-300 to-gray-500",
    bgGradient: "from-gray-700/90 to-gray-900/90",
    border: "border-gray-400/30",
    text: "text-gray-400",
    color: "text-gray-300"
  },
  diamond: {
    icon: "M12 2l4 4 4-4-2-2-2 2-2-2-2 2-2-2-2 2z",
    gradient: "from-blue-300 to-blue-500",
    bgGradient: "from-blue-600/90 to-blue-800/90",
    border: "border-blue-400/30",
    text: "text-blue-400",
    color: "text-blue-300"
  }
};

const KlsGoldSlider = () => {
  const [allMetalPrices, setAllMetalPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showPricesModal, setShowPricesModal] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    fetchAllMetalPrices();
    // Refresh prices every 5 minutes
    const interval = setInterval(fetchAllMetalPrices, 300000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const fetchAllMetalPrices = async () => {
    try {
      setLoading(true);
      
      // Fetch all metal prices from single endpoint
      const response = await fetch('https://klsbackend.onrender.com/get-metal-rates');
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        // Group by metal type and purity
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
      // Set fallback prices
      setAllMetalPrices({
        gold: [
          {
            metal_type: "gold",
            purity: "24k",
            rate_per_gram: 14590,
            currency: "INR",
            effective_date: new Date().toISOString().split('T')[0]
          },
          {
            metal_type: "gold",
            purity: "22k",
            rate_per_gram: 2500,
            currency: "INR",
            effective_date: new Date().toISOString().split('T')[0]
          }
        ],
        silver: [
          {
            metal_type: "silver",
            purity: "24",
            rate_per_gram: 295.75,
            currency: "INR",
            effective_date: new Date().toISOString().split('T')[0]
          }
        ],
        diamond: [
          {
            metal_type: "diamond",
            purity: "24",
            rate_per_carat: 1000,
            currency: "INR",
            effective_date: new Date().toISOString().split('T')[0]
          }
        ]
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
    arrows: !isMobile,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    pauseOnHover: false,
    pauseOnFocus: false,
    swipe: isMobile,
    touchMove: isMobile,
    adaptiveHeight: true,
    dotsClass: "slick-dots custom-dots",
    appendDots: dots => (
      <div className="mt-4 md:mt-8">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full hover:bg-yellow-500 transition-colors duration-300"></div>
    )
  };

  // Format price with Indian numbering system
  const formatPrice = (price) => {
    if (!price) return '--';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get primary gold price (24k)
  const getPrimaryGoldPrice = () => {
    if (!allMetalPrices.gold) return null;
    return allMetalPrices.gold.find(price => price.purity === "24k") || allMetalPrices.gold[0];
  };

  // Get primary silver price
  const getPrimarySilverPrice = () => {
    if (!allMetalPrices.silver) return null;
    return allMetalPrices.silver[0];
  };

  // Get metal icon config
  const getMetalIcon = (metalType) => {
    return metalIcons[metalType.toLowerCase()] || metalIcons.gold;
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Top Section with Branding - Adjusted for mobile */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent py-3 md:py-6 px-3 md:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-1 md:mb-2 tracking-tight md:tracking-wider">
              KLS GOLD
            </h1>
            <p className="text-white text-sm md:text-lg lg:text-xl font-light tracking-wide md:tracking-widest uppercase text-center px-2">
              Timeless Elegance • Exceptional Craftsmanship
            </p>
          </div>
        </div>
      </div>

      {/* View Live Prices Button - Desktop & Mobile */}
      <div className={`absolute ${isMobile ? 'top-16 left-1/2 transform -translate-x-1/2' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'} z-40`}>
        <button
          onClick={() => setShowPricesModal(true)}
          className="group relative"
        >
          <div className="bg-gradient-to-r from-yellow-600/90 to-yellow-800/90 backdrop-blur-sm px-6 py-3 md:px-8 md:py-4 rounded-2xl shadow-2xl border border-yellow-400/30 transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/30 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-bold text-lg">VIEW LIVE PRICES</h3>
                <span className="text-green-400 text-xs animate-pulse">● LIVE</span>
              </div>
              <p className="text-yellow-200/80 text-sm">
                Gold, Silver & Diamond
              </p>
            </div>
          </div>
          
          {/* Animated ring effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-yellow-500/30 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Live Price Indicators - Desktop Only */}
      {!isMobile && (
        <div className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-40">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-yellow-500/20 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center mb-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-600/30 rounded-full">
                <span className="text-yellow-400 text-sm font-bold tracking-wider">LIVE PRICES</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Gold Prices */}
              {allMetalPrices.gold && allMetalPrices.gold.map((price, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{price.purity} Gold:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400 font-bold">₹ {formatPrice(price.rate_per_gram)}</span>
                    <span className="text-gray-400 text-xs">/g</span>
                  </div>
                </div>
              ))}
              
              {/* Silver Price */}
              {allMetalPrices.silver && allMetalPrices.silver.map((price, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Silver:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-300 font-bold">₹ {formatPrice(price.rate_per_gram)}</span>
                    <span className="text-gray-400 text-xs">/g</span>
                  </div>
                </div>
              ))}
              
              {/* Diamond Price */}
              {allMetalPrices.diamond && allMetalPrices.diamond.map((price, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Diamond:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-400 font-bold">₹ {formatPrice(price.rate_per_carat)}</span>
                    <span className="text-gray-400 text-xs">/ct</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-2 border-t border-gray-700/50">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Updated:</span>
                  <span className="text-gray-300">
                    {allMetalPrices.gold?.[0]?.effective_date ? 
                      new Date(allMetalPrices.gold[0].effective_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      }) : 'Today'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* View All Button */}
            <button 
              onClick={() => setShowPricesModal(true)}
              className="mt-4 w-full py-2 bg-gradient-to-r from-yellow-700 to-yellow-900 text-white text-sm font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-800 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>View All Prices</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Slider */}
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="relative">
            {/* Background Image with Overlay */}
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] max-h-[650px] overflow-hidden">
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover object-center scale-110 animate-zoomSlow"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
              
              {/* Content Overlay - Adjusted for mobile */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 md:px-6 max-w-4xl transform transition-all duration-1000 animate-slideUp">
                  <div className={`inline-block bg-black/50 backdrop-blur-sm ${isMobile ? 'px-4 py-4' : 'px-8 py-6'} rounded-xl md:rounded-2xl border border-yellow-600/30`}>
                    <h2 className={`font-bold text-yellow-300 mb-2 md:mb-4 ${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'}`}>
                      {img.title}
                    </h2>
                    <p className={`text-gray-200 font-light mb-4 md:mb-6 ${isMobile ? 'text-sm' : 'text-xl md:text-2xl'}`}>
                      {img.description}
                    </p>
                    <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-center space-x-4'}`}>
                      <button className={`bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 ${isMobile ? 'px-4 py-2 text-sm' : 'px-8 py-3'}`}>
                        View Collection
                      </button>
                      <button className={`bg-transparent border border-yellow-500 text-yellow-400 font-semibold rounded-full hover:bg-yellow-500/10 transform hover:scale-105 transition-all duration-300 ${isMobile ? 'px-4 py-2 text-sm mt-2' : 'px-8 py-3'}`}>
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Indicator - Mobile optimized */}
              <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-2">
                  <div className={`${isMobile ? 'w-24' : 'w-32'} h-1 bg-gray-600 rounded-full overflow-hidden`}>
                    <div className="h-full bg-yellow-500 animate-progressBar"></div>
                  </div>
                  <span className="text-white text-xs md:text-sm font-mono">
                    {index + 1}/{images.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Refresh Button for Mobile - Bottom Center */}
      {isMobile && (
        <div className="absolute bottom-4 right-4 z-40">
          <button 
            onClick={fetchAllMetalPrices}
            disabled={loading}
            className="bg-black/70 backdrop-blur-sm p-2 rounded-full border border-yellow-500/30 hover:bg-black/90 transition-all duration-300 disabled:opacity-50"
            title="Refresh Prices"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
            ) : (
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Navigation Hint - Hidden on mobile */}
      {!isMobile && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-70 animate-pulse">
          <p className="text-white text-sm tracking-widest uppercase">
            Auto-rotating every 2 seconds
          </p>
        </div>
      )}

      {/* All Prices Modal */}
      {showPricesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-yellow-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-yellow-800/90 to-yellow-900/90 backdrop-blur-sm p-6 rounded-t-2xl border-b border-yellow-500/30">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Live Metal Prices</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400 text-sm animate-pulse">● REAL-TIME UPDATES</span>
                      <span className="text-yellow-200/80 text-sm">
                        {allMetalPrices.gold?.[0]?.effective_date || new Date().toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPricesModal(false)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400">{error}</p>
                  <button
                    onClick={fetchAllMetalPrices}
                    className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Gold Section */}
                  {allMetalPrices.gold && allMetalPrices.gold.length > 0 && (
                    <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-950/20 backdrop-blur-sm rounded-xl p-5 border border-yellow-500/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-yellow-300">Gold Prices</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allMetalPrices.gold.map((price, index) => (
                          <div key={index} className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-yellow-200 font-semibold">{price.purity}</span>
                              <span className="text-green-400 text-xs font-medium">LIVE</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-300">
                              ₹ {formatPrice(price.rate_per_gram)}
                              <span className="text-yellow-200/80 text-sm ml-1">/ gram</span>
                            </div>
                            {price.rate_per_carat > 0 && (
                              <div className="mt-2 text-sm text-yellow-200/70">
                                ₹ {formatPrice(price.rate_per_carat)} / carat
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Silver Section */}
                  {allMetalPrices.silver && allMetalPrices.silver.length > 0 && (
                    <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/20 backdrop-blur-sm rounded-xl p-5 border border-gray-500/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-300">Silver Prices</h3>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gray-500/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-200 font-semibold">
                            {allMetalPrices.silver[0].purity} Purity
                          </span>
                          <span className="text-green-400 text-xs font-medium">LIVE</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-300">
                          ₹ {formatPrice(allMetalPrices.silver[0].rate_per_gram)}
                          <span className="text-gray-200/80 text-sm ml-1">/ gram</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Diamond Section */}
                  {allMetalPrices.diamond && allMetalPrices.diamond.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-900/30 to-blue-950/20 backdrop-blur-sm rounded-xl p-5 border border-blue-500/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2l4 4 4-4-2-2-2 2-2-2-2 2-2-2-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-blue-300">Diamond Prices</h3>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-blue-500/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-blue-200 font-semibold">
                            {allMetalPrices.diamond[0].purity} Quality
                          </span>
                          <span className="text-green-400 text-xs font-medium">LIVE</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-300">
                          ₹ {formatPrice(allMetalPrices.diamond[0].rate_per_carat)}
                          <span className="text-blue-200/80 text-sm ml-1">/ carat</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="text-center text-gray-400 text-sm pt-4 border-t border-gray-800/50">
                    <p>Prices are updated every 5 minutes. Rates may vary for different jewelry types.</p>
                    <p className="mt-1">Last updated: {new Date().toLocaleTimeString('en-IN')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={fetchAllMetalPrices}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-700 to-yellow-900 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Refresh Prices</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowPricesModal(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes zoomSlow {
          0% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes slideUp {
          0% { 
            opacity: 0;
            transform: translateY(20px);
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
          animation: slideUp 1s ease-out;
        }
        
        .animate-progressBar {
          animation: progressBar 2s linear;
          animation-iteration-count: infinite;
        }
        
        @media (max-width: 768px) {
          .animate-zoomSlow {
            animation: zoomSlow 15s linear infinite;
          }
          .animate-slideUp {
            animation: slideUp 0.8s ease-out;
          }
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
          left: 10px;
          z-index: 1;
        }
        
        :global(.slick-next) {
          right: 10px;
        }
        
        @media (max-width: 768px) {
          :global(.slick-prev) {
            left: 5px;
          }
          
          :global(.slick-next) {
            right: 5px;
          }
          
          :global(.slick-prev:before, .slick-next:before) {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default KlsGoldSlider;