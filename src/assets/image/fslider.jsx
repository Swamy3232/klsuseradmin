
import React from "react";

const KlsGoldSlider = () => {
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-5xl font-bold text-center mb-8 text-yellow-600">
        KLS GOLD
      </h1>
      <div className="w-full flex justify-center items-center">
        <div className="relative w-[320px] sm:w-[360px] md:w-[400px] lg:w-[420px] xl:w-[480px] 2xl:w-[540px] aspect-[9/16] max-w-full mx-auto">
          <video
            src={require("../slidevideo.mp4")}
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
