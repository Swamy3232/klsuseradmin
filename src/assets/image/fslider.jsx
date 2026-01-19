import React from "react";
import Slider from "react-slick";

// Import your images
import qrImage from "../assets/upi_id1.jpeg";
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

// Array of images with titles
const images = [
  { src: img1, title: "Chain" },
  { src: img2, title: "Ring" },
  { src: img3, title: "Winter Whispers" },
  { src: img4, title: "Summer Shine" },
  { src: img5, title: "Spring Bloom" },
  { src: img6, title: "Earrings" },
  { src: img7, title: "Necklace" },
  { src: img8, title: "Bracelet" },
  { src: img9, title: "Pendant" },
  { src: img10, title: "Classic Collection" },
  { src: img11, title: "Golden Glow" },
  { src: img12, title: "Diamond Spark" },
  { src: img13, title: "Royal Elegance" },
  { src: img14, title: "Vintage Charm" },
  { src: img15, title: "Modern Style" },
  { src: img16, title: "Luxury Line" },
  { src: img17, title: "Exclusive Edition" },
];

const KlsGoldSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    fade: true, // smooth fade effect
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-5xl font-bold text-center mb-8 text-yellow-600">
        KLS GOLD
      </h1>

      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-[500px] object-cover rounded-lg shadow-lg"
            />
            <h2 className="absolute top-5 left-5 text-white text-3xl font-semibold bg-black bg-opacity-50 px-4 py-2 rounded">
              {img.title}
            </h2>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default KlsGoldSlider;
