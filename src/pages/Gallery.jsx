import React from 'react';
import { Link } from 'react-router-dom';

// Import images
import img1 from "../assets/collections/1.jpg";
import img2 from "../assets/collections/2.jpg";
import img3 from "../assets/collections/3.webp";
import img4 from "../assets/collections/4.webp";
import img5 from "../assets/collections/5.webp";
import img6 from "../assets/collections/6.webp";
import img7 from "../assets/collections/7.jpg";
import img8 from "../assets/collections/8.jpg";
import img9 from "../assets/collections/9.webp";
import img10 from "../assets/collections/10.webp";
import img11 from "../assets/collections/11.webp";
import img12 from "../assets/collections/12.webp";
import img13 from "../assets/collections/13.webp";
import img14 from "../assets/collections/14.webp";
import img15 from "../assets/collections/15.webp";
import img16 from "../assets/collections/16.webp";
import img17 from "../assets/collections/17.jpg";

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

const Gallery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">
            KLS Gold Palace Gallery
          </h1>
          <p className="text-lg md:text-xl text-amber-700 mb-6">
            A Glimpse into Our Exquisite Collection
          </p>
        </div>

        {/* CTA Section - Smaller */}
        <div className="bg-gradient-to-br from-amber-900 to-yellow-900 rounded-2xl overflow-hidden shadow-xl mb-12 max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-yellow-500/10 rounded-full"></div>
            
            <div className="relative z-10 p-6 md:p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                  Discover Our Complete Collection
                </h2>
                <p className="text-base text-amber-100 mb-6 leading-relaxed">
                  Explore our extensive range of premium gold, diamond, and precious stone 
                  jewelry at KLS Gold Palace.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Link 
                    to="/collection" 
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span>View Complete Collection</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  
                  <div className="text-amber-200 text-xs">
                    <svg className="inline-block w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                    500+ Unique Designs
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-amber-700/50">
                  <p className="text-amber-200 text-xs">
                    <span className="font-semibold">Exclusive Preview:</span> New collections added weekly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2 font-serif">{image.title}</h3>
                  <p className="text-sm text-amber-200">{image.description}</p>
                </div>
              </div>
              
              {/* Title badge */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-4 py-2 rounded-full shadow-lg">
                <span className="font-semibold text-sm">{image.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Note - Moved to Bottom */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-100 to-yellow-50 p-6 rounded-2xl shadow-lg border border-amber-200 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-amber-800 mb-2">
                Just a Preview of Our Collection
              </p>
              <p className="text-amber-700">
                These are only few pieces from our gallery. To view our complete range of 
                stunning gold and diamond jewelry, please visit our collections page.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-amber-600">
            <span className="font-semibold">KLS Gold Palace</span> • Where Tradition Meets Elegance
          </p>
          <p className="text-xs text-amber-500 mt-2">
            All jewelry pieces are crafted with 22K & 24K gold with certified diamonds
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;