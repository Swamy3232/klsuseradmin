import React, { useRef, useState } from "react";
import aboutvideo from "../assets/about.mp4";
import { Volume2, VolumeX } from "lucide-react";

const AboutKLS = () => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <section className="bg-white py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

        {/* Video */}
        <div className="relative">
          <video
            ref={videoRef}
            src={aboutvideo}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="rounded-xl shadow-xl w-full h-full object-cover"
          />

          {/* Speaker Toggle */}
          <button
            onClick={toggleSound}
            className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            About Komarla Jewellery Palace
          </h2>

          <p className="text-gray-600 mb-4 leading-relaxed">
            <strong>Komarla Jewellery Palace</strong> is one of the most trusted 
            and renowned gold jewellery stores in <strong>Chintamani, Karnataka</strong>. 
            Established in <strong>1975</strong> by proprietor <strong>Niranjan</strong>, 
            the store has been serving customers with authentic and high-quality 
            gold jewellery for nearly five decades.
          </p>

          <p className="text-gray-600 mb-4 leading-relaxed">
            Known for its elegant designs, purity, and customer trust, 
            Komarla Jewellery Palace offers a wide range of jewellery including 
            traditional gold ornaments, modern designs, bridal collections, 
            necklaces, bangles, rings, and custom jewellery pieces.
          </p>

          <p className="text-gray-600 mb-4 leading-relaxed">
            Located at the heart of Chintamani near <strong>Bengaluru Circle</strong>, 
            the store is easily accessible and has become a preferred destination 
            for families looking for quality jewellery and reliable service.
          </p>

          {/* Address */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Visit Our Store
            </h3>

            <p className="text-gray-700">
              Komarla Jewellery Palace <br />
              Beside Old Sangeetha Mobiles <br />
              Bengaluru Circle, Chintamani <br />
              Karnataka, India
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutKLS;