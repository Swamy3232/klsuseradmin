
import React from "react";
import slidevideo from "../assets/slidevideo.mp4";

const KlsGoldSlider = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-amber-100 py-8">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 text-yellow-600 drop-shadow-lg">
        KLS GOLD
      </h1>
      <div className="w-full flex justify-center items-center">
        <div className="relative w-[320px] sm:w-[360px] md:w-[420px] lg:w-[500px] xl:w-[600px] 2xl:w-[700px] aspect-[9/16] max-w-full mx-auto ">
          <div className="absolute -inset-2 md:-inset-4 rounded-2xl bg-gradient-to-br from-yellow-200/60 to-amber-100/80 blur-lg z-0" />
          <video
            src={slidevideo}
            className="relative rounded-2xl border-4 border-white shadow-2xl w-full h-full object-cover bg-black z-10"
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