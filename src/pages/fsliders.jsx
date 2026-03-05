
import React from "react";
import slidevideo from "../assets/slidevideo.mp4";

const KlsGoldSlider = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-white py-8">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 text-yellow-600">
        KLS GOLD
      </h1>
      <div className="w-full flex justify-center items-center">
        <div className="relative w-[320px] sm:w-[360px] md:w-[400px] lg:w-[420px] xl:w-[480px] 2xl:w-[540px] aspect-[9/16] max-w-full mx-auto">
          <video
            src={slidevideo}
            className="rounded-xl shadow-lg w-full h-full object-cover bg-black"
            controls
            autoPlay
            loop
            muted
            playsInline
            style={{ aspectRatio: '9/16', background: '#000' }}
          />
        </div>
      </div>
    </div>
  );
};

export default KlsGoldSlider;