import React, { useState } from "react";

// Import all images
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
import img18 from "../assets/image/18.JPG";
import img19 from "../assets/image/19.JPG";
import img20 from "../assets/image/20.JPG";
import img21 from "../assets/image/21.JPG";
import img22 from "../assets/image/22.JPG";
import img23 from "../assets/image/23.JPG";
import img24 from "../assets/image/24.JPG";
import img26 from "../assets/image/26.JPG";
import img27 from "../assets/image/27.JPG";
import img28 from "../assets/image/28.JPG";
import img29 from "../assets/image/29.JPG";

// Enhanced image data structure with categories
const imageData = [
  { src: img1, alt: "Modern Residential Design", category: "residential" },
  { src: img2, alt: "Structural Engineering Excellence", category: "structural" },
  { src: img3, alt: "Vastu-Compliant Architecture", category: "vastu" },
  { src: img4, alt: "Contemporary Facade Design", category: "residential" },
  { src: img5, alt: "3D Architectural Visualization", category: "visualization" },
  { src: img6, alt: "Project Planning & Layout", category: "planning" },
  { src: img7, alt: "Structural Detailing", category: "structural" },
  { src: img8, alt: "Interior Space Planning", category: "interior" },
  { src: img9, alt: "Sustainable Design Concept", category: "sustainable" },
  { src: img10, alt: "Luxury Residence Design", category: "residential" },
  { src: img11, alt: "Commercial Building Design", category: "commercial" },
  { src: img12, alt: "Architectural Blueprint", category: "planning" },
  { src: img13, alt: "Modern Office Space", category: "commercial" },
  { src: img14, alt: "Vastu-Integrated Layout", category: "vastu" },
  { src: img15, alt: "Structural Analysis", category: "structural" },
  { src: img16, alt: "Residential Complex", category: "residential" },
  { src: img17, alt: "Design Development", category: "planning" },
  { src: img18, alt: "Sustainable Materials", category: "sustainable" },
  { src: img19, alt: "Contemporary Design", category: "residential" },
  { src: img20, alt: "Project Execution", category: "structural" },
  { src: img21, alt: "Vastu Consultation", category: "vastu" },
  { src: img22, alt: "Interior Design", category: "interior" },
  { src: img23, alt: "Commercial Complex", category: "commercial" },
  { src: img24, alt: "Architectural Rendering", category: "visualization" },
  { src: img26, alt: "Structural Framework", category: "structural" },
  { src: img27, alt: "Design Innovation", category: "residential" },
  { src: img28, alt: "Project Completion", category: "commercial" },
  { src: img29, alt: "Final Implementation", category: "structural" },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  
  const categories = [
    { id: "all", label: "All Projects" },
    { id: "residential", label: "Residential" },
    { id: "commercial", label: "Commercial" },
    { id: "structural", label: "Structural" },
    { id: "vastu", label: "Vastu" },
    { id: "interior", label: "Interior" },
  ];

  const filteredImages = activeCategory === "all" 
    ? imageData 
    : imageData.filter(img => img.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 to-gray-900 py-20 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
            Architectural Excellence Gallery
          </h1>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Showcasing our portfolio of precision-engineered architectural marvels, 
            where traditional Vastu wisdom meets contemporary structural innovation.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Masonry Style */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {filteredImages.map((img, index) => (
            <div
              key={index}
              className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-2xl transition-all duration-500"
              onClick={() => setSelectedImage(img)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-lg font-semibold mb-2">{img.alt}</p>
                    <div className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
                      {img.category.charAt(0).toUpperCase() + img.category.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 truncate">{img.alt}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Results Counter */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 font-medium">
            Showing {filteredImages.length} of {imageData.length} projects
          </p>
        </div>
      </div>

      {/* Modal for Image View */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button 
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-2xl font-bold">{selectedImage.alt}</h3>
              <p className="text-gray-300 mt-2">
                Category: {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mission Statement */}
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-8">
            <div className="bg-gray-900 rounded-full p-3">
              <span className="text-3xl">🏛️</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-8">
            Crafting Timeless Structures with Innovation & Tradition
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-blue-300 text-2xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-white mb-3">Precision Engineering</h3>
              <p className="text-blue-100">Advanced structural analysis ensuring safety, durability, and compliance with global standards.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-blue-300 text-2xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-white mb-3">Vastu Integration</h3>
              <p className="text-blue-100">Harmonious designs blending ancient principles with modern architectural requirements.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-blue-300 text-2xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-white mb-3">Sustainable Innovation</h3>
              <p className="text-blue-100">Eco-friendly materials and energy-efficient solutions for a greener tomorrow.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to Bring Your Vision to Life?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's collaborate to create spaces that inspire, function, and stand the test of time.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Start Your Project Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;