import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KlsGoldSlider from "./fsliders";
import {
  FaGem,
  FaStore,
  FaArrowRight,
  FaCalendarAlt,
  FaShieldAlt,
  FaAward,
  FaHandshake,
   FaCertificate,
  FaSyncAlt,
  FaMoneyBillWave,
  FaGlobe,
  FaHeart,
  FaUndo
} from "react-icons/fa";


import img15 from "../assets/collections/15.webp";
import img16 from "../assets/collections/5.webp";
// import img17 from "../assets/collections/17.jpg"; 
import store from "../assets/collections/store.png";
import chitti from "../assets/collections/chitti.jpg";



const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const planRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    if (planRef.current) observer.observe(planRef.current);
    return () => planRef.current && observer.unobserve(planRef.current);
  }, []);


  // Bluestone-style: Category grid (main browsing tiles)
  const categoryGrid = [
    {
      title: "Gallery",
      path: "/gallery",
      image: img15,
      subtitle: "500+ Designs",
    },
    {
      title: "Collection",
      path: "/collection",
      image: img16,
      subtitle: "New Arrivals",
    },
    {
      title: "Your Chitti",
      path: "/chitti",
      image: chitti,
      subtitle: "Gold Plans",
    },
    {
      title: "Store",
      path: "/contact",
      image: store,
      subtitle: "Visit Us",
    },
  ];

  const plans = [
    {
      months: 12,
      title: "12 Months Gold Plan",
      benefit: "10% Extra Value",
      features: ["Monthly Investment", "10% Bonus on Maturity", "Redeem as Jewellery"],
      color: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-200",
    },
    {
      months: 24,
      title: "24 Months Premium Plan",
      benefit: "20% Extra Value",
      features: ["Higher Returns", "20% Bonus Value", "Wedding Savings"],
      color: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
    },
  ];

  const values = [
  {
    icon: <FaCertificate />,
    title: "Certified Jewellery",
  },
  {
    icon: <FaSyncAlt />,
    title: "Lifetime Exchange",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "100% Refund*",
  },
  {
    icon: <FaGlobe />,
    title: "International Shipping",
  },
  {
    icon: <FaHeart />,
    title: "Trust of KLS Jewellers",
  },
  {
    icon: <FaUndo />,
    title: "15 Day Return",
  },
];

  return (
    <div className="bg-white">
      {/* Hero Slider - Bluestone style full-width banner */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <KlsGoldSlider />
      </section>

      {/* Bluestone-style: Category Grid - Primary navigation */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categoryGrid.map((item, idx) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onClick={() => navigate(item.path)}
                className="group cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners - Bluestone Gold Mine style */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 mb-2">
              <FaCalendarAlt className="text-amber-600 text-xl" />
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                KLS Gold Investment Plans
              </h2>
            </div>
            <p className="text-gray-600 max-w-xl mx-auto">
              Secure your future with our exclusive gold savings schemes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.months}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`rounded-xl p-6 lg:p-8 border ${plan.borderColor} bg-gradient-to-br ${plan.color} hover:shadow-lg transition-shadow`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                  <span className="px-3 py-1 bg-amber-600 text-white text-sm font-semibold rounded-full">
                    {plan.benefit}
                  </span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/chitti")}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Start {plan.months} Month Plan
                </button>
              </motion.div>
            ))}
          </div>

          {/* Calculate Amount Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={() => navigate("/chitti-calculator")}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <FaArrowRight className="text-lg" />
              Calculate Investment Amount
            </button>
          </motion.div>
        </div>
      </section>

      {/* Our Values - Bluestone trust badges */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
            The KLS Gold Promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 lg:py-16 bg-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Begin Your Legacy
          </h2>
          <p className="text-amber-100 mb-8 max-w-xl mx-auto">
            Join thousands of families who trust KLS Gold for their most precious moments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/chitti")}
              className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors"
            >
              View Investment Plans
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Book Store Visit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
