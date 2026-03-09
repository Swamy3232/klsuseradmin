import React, { useRef, useState } from "react";
import slidevideo from "../assets/slidevideo.mp4";

const KlsGoldSlider = () => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-amber-100 py-8">
      {/* <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 text-yellow-600 drop-shadow-lg">
        KLS GOLD
      </h1> */}

      <div className="relative w-[320px] sm:w-[360px] md:w-[420px] lg:w-[500px] xl:w-[600px] aspect-[9/16]">

        <video
          ref={videoRef}
          src={slidevideo}
          className="rounded-2xl border-4 border-white shadow-2xl w-full h-full object-cover"
          autoPlay
          loop
          muted={muted}
          playsInline
        />

        {/* Speaker Toggle */}
        <button
          onClick={toggleSound}
          className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
        >
          {muted ? "🔇" : "🔊"}
        </button>

      </div>
    </div>
  );
};

export default KlsGoldSlider;