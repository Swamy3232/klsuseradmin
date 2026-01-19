import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KlsGoldSlider from "./fsliders";
import { 
  FaGem, 
  FaStore, 
  FaArrowRight, 
  FaCalendarAlt,
  FaPercent,
  FaRegGem,
  FaCrown,
  FaShieldAlt,
  FaAward,
  FaHandshake
} from "react-icons/fa";

// Import your images
import img15 from "../assets/image/15.JPG";
import img16 from "../assets/image/16.JPG";
import img17 from "../assets/image/17.JPG";

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const planRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (planRef.current) {
      observer.observe(planRef.current);
    }

    return () => {
      if (planRef.current) {
        observer.unobserve(planRef.current);
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const navigationCards = [
    { 
      title: "Gallery", 
      path: "/gallery", 
      icon: <FaGem className="text-3xl mb-4 text-yellow-600" />,
      description: "Explore our exquisite collection of timeless jewellery designs",
      image: img15,
      gradient: "from-yellow-600/90 to-amber-700/90",
      features: ["500+ Designs", "Custom Orders", "Certified Pieces"]
    },
    { 
      title: "New Collection", 
      path: "/collection", 
      icon: <FaRegGem className="text-3xl mb-4 text-gray-600" />,
      description: "Discover our latest contemporary jewellery collections",
      image: img16,
      gradient: "from-gray-700/90 to-gray-900/90",
      features: ["Seasonal Launch", "Limited Edition", "Trending Styles"]
    },
    { 
      title: "Store Location", 
      path: "/location", 
      icon: <FaStore className="text-3xl mb-4 text-yellow-600" />,
      description: "Visit our flagship store for personalized luxury experience",
      image: img17,
      gradient: "from-amber-700/90 to-yellow-800/90",
      features: ["Expert Consultation", "Home Trial", "Secure Vault"]
    },
  ];

  const plans = [
    {
      months: 12,
      title: "12 Months Gold Plan",
      benefit: "10% Extra Value",
      features: ["Monthly Investment Plan", "10% Bonus on Maturity", "Redeem as Jewellery", "Flexible Installments"],
      color: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
      highlightColor: "text-yellow-700",
      icon: <FaCrown className="text-yellow-600" />
    },
    {
      months: 24,
      title: "24 Months Premium Plan",
      benefit: "20% Extra Value",
      features: ["Higher Returns", "20% Bonus Value", "Wedding Savings Plan", "Early Withdrawal Option"],
      color: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-200",
      highlightColor: "text-amber-700",
      icon: <FaAward className="text-amber-600" />
    }
  ];

  const values = [
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Trust & Purity",
      description: "BIS Hallmarked 22K & 24K Gold",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: <FaHandshake className="text-2xl" />,
      title: "3 Generations Legacy",
      description: "Since 1975 - Family Tradition",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      icon: <FaAward className="text-2xl" />,
      title: "Certified Excellence",
      description: "IGI & GIA Certified Diamonds",
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <section className="relative overflow-hidden">
        <KlsGoldSlider />
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="bg-black/70 backdrop-blur-sm px-8 py-3 rounded-full border border-yellow-600/30">
            <p className="text-white text-sm font-light tracking-wider">
              EST. 1975 • TRADITION • EXCELLENCE • TRUST
            </p>
          </div>
        </motion.div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              The KLS Gold Promise
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Three generations of trust, purity, and exceptional craftsmanship
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className={`${value.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-sm`}>
                  <div className={value.color}>
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-4"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Explore Our World
              </h2>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover excellence in every piece, crafted with generations of expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {navigationCards.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(item.path)}
                className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
              >
                {/* Background Image with Overlay */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} to-transparent`}></div>
                  <div className="absolute top-6 left-6">
                    {item.icon}
                  </div>
                  
                  {/* Floating Features */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, fIdx) => (
                        <span key={fIdx} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Explore</span>
                      <FaArrowRight className="ml-2" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Click to view</span>
                  </div>
                </div>
                
                {/* Hover Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold Mine Plan */}
      <section ref={planRef} className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <FaCalendarAlt className="text-3xl text-yellow-600" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                KLS Gold Investment Plans
              </h2>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Secure your future with our exclusive gold savings schemes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.months}
                initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{ y: -5 }}
                className={`relative rounded-2xl p-8 border ${plan.borderColor} bg-gradient-to-br ${plan.color} shadow-xl hover:shadow-2xl transition-all duration-300 group`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.title}</h3>
                      <p className="text-gray-600">{plan.months} Months • Secure Investment</p>
                    </div>
                  </div>
                  
                  {/* Benefit Badge */}
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                    <span className={`font-bold ${plan.highlightColor}`}>{plan.benefit}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, featureIdx) => (
                    <motion.li
                      key={featureIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: idx * 0.2 + featureIdx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Duration Display */}
                <div className="mb-8 p-4 bg-white/80 rounded-xl">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.months}</span>
                    <span className="text-gray-600">Months Plan</span>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Flexible monthly payments starting from ₹5,000
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/shema")}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start {plan.months} Month Plan
                </motion.button>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
              </motion.div>
            ))}
          </div>

          {/* Investment Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Investment Benefits
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-xl border border-gray-100 hover:border-yellow-200 transition-colors duration-300">
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaShieldAlt className="text-yellow-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">100% Secure</h5>
                  <p className="text-sm text-gray-600">Bank-grade security for your investments</p>
                </div>
                
                <div className="text-center p-6 rounded-xl border border-gray-100 hover:border-yellow-200 transition-colors duration-300">
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHandshake className="text-yellow-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">Easy Withdrawal</h5>
                  <p className="text-sm text-gray-600">Instant redemption options available</p>
                </div>
                
                <div className="text-center p-6 rounded-xl border border-gray-100 hover:border-yellow-200 transition-colors duration-300">
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaAward className="text-yellow-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 mb-2">Bonus Value</h5>
                  <p className="text-sm text-gray-600">Extra value on maturity of your plan</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => navigate("/shema")}
                  className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors duration-300"
                >
                  View All Plans Details →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-50 to-amber-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-white rounded-2xl p-12 shadow-xl border border-yellow-100">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Begin Your Legacy
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of families who trust KLS Gold for their most precious moments
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/shema")}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View Investment Plans
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-full border border-gray-200 shadow-lg hover:shadow-xl hover:border-yellow-300 transition-all duration-300"
                >
                  Book Store Visit
                </motion.button>
              </div>
              
              <p className="text-sm text-gray-500 mt-8">
                Consultation available at our flagship store or via video call
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;