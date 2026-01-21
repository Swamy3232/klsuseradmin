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
  const [allMetalPrices, setAllMetalPrices] = useState({
    gold: [],
    silver: [],
    diamond: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showPricesModal, setShowPricesModal] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    fetchAllMetalPrices();
    const interval = setInterval(fetchAllMetalPrices, 300000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const fetchAllMetalPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://klsbackend.onrender.com/get-metal-rates');
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
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
      // Set minimal fallback data
      setAllMetalPrices({
        gold: [{
          metal_type: "gold",
          purity: "24K",
          rate_per_gram: 14590,
          currency: "INR"
        }],
        silver: [{
          metal_type: "silver",
          purity: "",
          rate_per_gram: 295.75,
          currency: "INR"
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: !isMobile,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    pauseOnHover: true,
    pauseOnFocus: true,
    swipe: true,
    touchMove: true,
    adaptiveHeight: false,
    beforeChange: (current, next) => setActiveSlide(next),
    dotsClass: "slick-dots custom-dots",
    appendDots: dots => (
      <div className="mt-2 md:mt-6">
        <ul className="flex justify-center space-x-1.5">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
        i === activeSlide 
          ? 'bg-yellow-500 scale-125' 
          : 'bg-gray-400/50 hover:bg-gray-300'
      }`}></div>
    )
  };

  const formatPrice = (price) => {
    if (!price) return '--';
    return new Intl.NumberFormat('en-IN').format(price);
  };

  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* Minimal Header for Mobile */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 pt-4 md:pt-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl md:text-3xl font-bold text-yellow-500 leading-tight">
                KLS GOLD
              </h1>
              <p className="text-gray-300 text-xs md:text-sm font-light uppercase tracking-wider">
                Timeless Excellence
              </p>
            </div>
            
            {/* Live Price Badge - Mobile */}
            {isMobile && (
              <button
                onClick={() => setShowPricesModal(true)}
                className="relative group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-600/20 blur-sm rounded-lg"></div>
                  <div className="relative bg-gradient-to-r from-yellow-900/90 to-yellow-950/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-yellow-500/30 flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-yellow-200 text-xs font-medium">LIVE</span>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Slider */}
      <div className="relative">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className="relative overflow-hidden">
              <div className="relative w-full h-[60vh] md:h-[70vh] max-h-[700px]">
                {/* Image with smooth zoom */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                
                {/* Content overlay - Modern minimalist */}
                <div className="absolute inset-0 flex items-end md:items-center">
                  <div className="container mx-auto px-4 pb-8 md:pb-16 md:px-8">
                    <div className="max-w-lg transform transition-all duration-700">
                      {/* Subtle indicator */}
                      <div className="flex items-center space-x-2 mb-3 md:mb-4">
                        <div className="w-6 h-px bg-yellow-500"></div>
                        <span className="text-yellow-400 text-xs uppercase tracking-widest">
                          Premium Collection
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 leading-tight">
                        {img.title}
                      </h2>
                      
                      {/* Description */}
                      <p className="text-gray-300 text-sm md:text-lg font-light mb-4 md:mb-6 max-w-md">
                        {img.description}
                      </p>
                      
                      {/* CTA Buttons - Stacked on mobile */}
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                        <button className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-sm md:text-base">
                          Explore Collection
                        </button>
                        <button className="px-4 md:px-6 py-2.5 md:py-3 bg-transparent border border-yellow-500/50 text-yellow-400 font-medium rounded-lg hover:bg-yellow-500/10 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-sm md:text-base">
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        
        {/* Current slide indicator - Minimal */}
        <div className="absolute bottom-4 right-4 md:right-8 z-10">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-xs font-mono">
              <span className="text-yellow-400">{activeSlide + 1}</span>
              <span className="text-gray-400">/{images.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Prices - Mobile */}
      {isMobile && (
        <>
          {/* Fixed bottom button */}
          <button
            onClick={() => setShowPricesModal(true)}
            className="fixed bottom-6 right-4 z-40 group"
          >
            <div className="relative">
              {/* Animated ring */}
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping opacity-75"></div>
              
              {/* Main button */}
              <div className="relative bg-gradient-to-br from-yellow-600 to-yellow-800 backdrop-blur-sm p-3 rounded-full shadow-2xl border border-yellow-400/30 transform transition-all duration-300 hover:scale-110 hover:shadow-yellow-500/40">
                <svg className="w-6 h-6 text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap border border-gray-700">
                  View Live Prices
                </div>
                <div className="absolute top-1/2 left-full transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-black/90 rotate-45 border-r border-b border-gray-700"></div>
                </div>
              </div>
            </div>
          </button>
          
          {/* Refresh indicator */}
          <div className="fixed bottom-6 left-4 z-40">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-700/50">
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-gray-300 text-xs">
                  {loading ? 'Updating...' : 'Click to view Live Prices'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Professional Prices Modal */}
      {showPricesModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative bg-gradient-to-b from-gray-900 to-black w-full max-w-md sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-yellow-900/50 max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-gray-950 p-4 sm:p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Live Market Rates</h2>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-green-400 text-xs">● REAL TIME</span>
                      <span className="text-gray-400 text-xs">|</span>
                      <span className="text-yellow-200/80 text-xs">
                        {new Date().toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPricesModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-yellow-900/30 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-400">Fetching latest rates...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-900/20 to-red-950/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={fetchAllMetalPrices}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-700 to-yellow-900 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-800 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Gold Section */}
                  {allMetalPrices.gold && allMetalPrices.gold.length > 0 && (
                    <div className="bg-gradient-to-br from-yellow-950/20 to-yellow-900/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-900/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-yellow-200">Gold</h3>
                        </div>
                        <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded-full">
                          LIVE
                        </span>
                      </div>
                      <div className="space-y-2">
                        {allMetalPrices.gold.map((price, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-yellow-900/20 last:border-0">
                            <div>
                              <span className="text-gray-300 text-sm">{price.purity}</span>
                              <p className="text-gray-400 text-xs">Gold Purity</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-yellow-300">
                                ₹{formatPrice(price.rate_per_gram)}
                                <span className="text-yellow-200/70 text-sm ml-1">/g</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Silver Section */}
                  {allMetalPrices.silver && allMetalPrices.silver.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-900/20 to-gray-800/10 backdrop-blur-sm rounded-xl p-4 border border-gray-800/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-200">Silver</h3>
                        </div>
                        <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded-full">
                          LIVE
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <span className="text-gray-300 text-sm">{allMetalPrices.silver[0].purity || "24"} Purity</span>
                          <p className="text-gray-400 text-xs">Fine Silver</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-300">
                            ₹{formatPrice(allMetalPrices.silver[0].rate_per_gram)}
                            <span className="text-gray-200/70 text-sm ml-1">/g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Diamond Section */}
                  {allMetalPrices.diamond && allMetalPrices.diamond.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-950/20 to-blue-900/10 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2l4 4 4-4-2-2-2 2-2-2-2 2-2-2-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-blue-200">Diamond</h3>
                        </div>
                        <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded-full">
                          CLICK TO VIEW LIVE PRICES
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <span className="text-gray-300 text-sm">Premium Quality</span>
                          <p className="text-gray-400 text-xs">Fine Diamonds</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-300">
                            ₹{formatPrice(allMetalPrices.diamond[0].rate_per_carat)}
                            <span className="text-blue-200/70 text-sm ml-1">/carat</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-gray-500 text-xs text-center">
                      Prices update every 5 minutes. Rates are indicative and may vary for custom jewelry.
                    </p>
                    <p className="text-gray-400 text-xs text-center mt-1">
                      Last updated: {new Date().toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-t from-gray-950 to-transparent p-4 border-t border-gray-800">
              <div className="flex gap-3">
                <button
                  onClick={fetchAllMetalPrices}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-800 to-yellow-900 text-white font-medium rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>UPDATING</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>REFRESH</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowPricesModal(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        .slick-slide {
          opacity: 0.3;
          transition: opacity 0.5s ease;
        }
        
        .slick-active {
          opacity: 1;
        }
        
        .slick-dots {
          bottom: 20px;
        }
        
        .slick-dots li button:before {
          color: rgba(251, 191, 36, 0.3);
        }
        
        .slick-dots li.slick-active button:before {
          color: rgb(251, 191, 36);
        }
        
        @media (max-width: 768px) {
          .slick-dots {
            bottom: 15px;
          }
          
          .slick-dots li {
            margin: 0 2px;
          }
          
          .slick-dots li button:before {
            font-size: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default KlsGoldSlider;