import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calculator, Scale, Gem, Sparkles, TrendingUp, Zap, Loader2, Info, RefreshCw, MessageCircle } from "lucide-react";

const MetalRateCalculator = () => {
  const [metals, setMetals] = useState([]);
  const [selectedMetal, setSelectedMetal] = useState("");
  const [rateType, setRateType] = useState("per_gram");
  const [purities, setPurities] = useState([]);
  const [selectedPurity, setSelectedPurity] = useState("");
  const [weight, setWeight] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratesLastUpdated, setRatesLastUpdated] = useState("");
  const [basePrice, setBasePrice] = useState(null); // Store base price without making charges
  const [gold24kRate, setGold24kRate] = useState(null); // Store 24k gold rate

  useEffect(() => {
    fetchMetalRates();
  }, []);

  const fetchMetalRates = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://klsbackend.onrender.com/get-metal-rates");
      setMetals(res.data.data);
      
      // Find gold 24k rate
      const gold24k = res.data.data.find(
        metal => metal.metal_type.toLowerCase().includes('gold') && 
        (metal.purity.toLowerCase().includes('24k') || metal.purity === '24')
      );
      
      if (gold24k) {
        setGold24kRate(gold24k.rate_per_gram);
      }
      
      // Find the latest update timestamp
      const latestDate = res.data.data.reduce((latest, metal) => {
        const metalDate = new Date(metal.updated_at || metal.created_at);
        return metalDate > latest ? metalDate : latest;
      }, new Date(0));
      
      if (latestDate > new Date(0)) {
        setRatesLastUpdated(latestDate.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }));
      }
    } catch (err) {
      console.error("Error fetching metal rates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update purities when metal changes
  useEffect(() => {
    if (selectedMetal) {
      const metalLower = selectedMetal.toLowerCase();
      
      if (metalLower.includes('gold')) {
        // For gold, show predefined purity options
        setPurities(['24K', '22K', '20K', '18K']);
        setSelectedPurity("24K");
      } else {
        // For other metals, use existing logic
        const metalPurities = metals
          .filter((m) => m.metal_type.toLowerCase() === selectedMetal.toLowerCase())
          .map((m) => m.purity);
        setPurities([...new Set(metalPurities)]);
        setSelectedPurity(metalPurities[0] || "");
      }
      setCalculatedPrice(null);
      setBasePrice(null);
    }
  }, [selectedMetal, metals]);

  // Calculate purity percentage for gold
  const getGoldPurityPercentage = (purity) => {
    switch (purity) {
      case '24K': return 100; // 100%
      case '22K': return 91.6; // Approximately 91.6% (22/24)
      case '20K': return 83.3; // Approximately 83.3% (20/24)
      case '18K': return 75.0; // 75% (18/24)
      default: return 100;
    }
  };

  // Calculate making charge percentage
  const getMakingChargePercentage = (metal, purity) => {
    const metalLower = metal.toLowerCase();
    if (metalLower.includes('gold') && purity === '24K') {
      return 12; // 12% for 24K gold
    } else if (metalLower.includes('gold')) {
      return 3; // 3% for other gold purities
    }
    return 3; // Default 3% for other metals
  };

  const calculatePrice = () => {
    if (!selectedMetal || !selectedPurity || !weight) return;

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) return;

    let baseRate = 0;
    let metalRate = null;

    // Check if selected metal is gold
    if (selectedMetal.toLowerCase().includes('gold')) {
      // For gold, calculate based on 24k rate and purity percentage
      if (gold24kRate) {
        const purityPercentage = getGoldPurityPercentage(selectedPurity);
        baseRate = (gold24kRate * purityPercentage) / 100;
        metalRate = {
          rate_per_gram: baseRate,
          rate_per_carat: baseRate // Assuming same rate for carat for simplicity
        };
      } else {
        // Fallback to finding the metal in the list
        metalRate = metals.find(
          (m) => m.metal_type.toLowerCase() === selectedMetal.toLowerCase() &&
          m.purity === selectedPurity
        );
        if (!metalRate) return;
        baseRate = rateType === "per_gram" ? metalRate.rate_per_gram : metalRate.rate_per_carat;
      }
    } else {
      // For non-gold metals, use existing logic
      metalRate = metals.find(
        (m) => m.metal_type.toLowerCase() === selectedMetal.toLowerCase() &&
        m.purity === selectedPurity
      );
      if (!metalRate) return;
      baseRate = rateType === "per_gram" ? metalRate.rate_per_gram : metalRate.rate_per_carat;
    }

    // Calculate base price without making charges
    const priceWithoutMakingCharge = baseRate * weightNum;
    setBasePrice(priceWithoutMakingCharge);

    // Calculate making charge
    const makingChargePercentage = getMakingChargePercentage(selectedMetal, selectedPurity);
    const makingChargeAmount = (priceWithoutMakingCharge * makingChargePercentage) / 100;
    
    // Calculate final price with making charge
    const finalPrice = priceWithoutMakingCharge + makingChargeAmount;
    
    setCalculatedPrice({
      finalPrice: finalPrice,
      basePrice: priceWithoutMakingCharge,
      makingCharge: makingChargeAmount,
      makingChargePercentage: makingChargePercentage,
      ratePerUnit: baseRate
    });
  };

  const getMetalIcon = (metal) => {
    const metalLower = metal.toLowerCase();
    if (metalLower.includes('gold')) return <Gem className="w-5 h-5 text-amber-500" />;
    if (metalLower.includes('silver')) return <Scale className="w-5 h-5 text-gray-400" />;
    if (metalLower.includes('platinum')) return <Sparkles className="w-5 h-5 text-slate-400" />;
    return <TrendingUp className="w-5 h-5 text-blue-500" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const resetCalculator = () => {
    setSelectedMetal("");
    setSelectedPurity("");
    setWeight("");
    setCalculatedPrice(null);
    setBasePrice(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calculator Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-amber-600 mb-4" />
                  <p className="text-gray-600">Loading current metal rates...</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Metal Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Gem className="w-4 h-4" />
                        Select Metal Type
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white appearance-none"
                          value={selectedMetal}
                          onChange={(e) => setSelectedMetal(e.target.value)}
                        >
                          <option value="">Choose a metal</option>
                          {[...new Set(metals.map((m) => m.metal_type))].map((metal) => (
                            <option key={metal} value={metal}>
                              {metal}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <TrendingUp className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Rate Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Scale className="w-4 h-4" />
                        Measurement Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className={`py-3 px-4 rounded-lg border transition-all ${rateType === "per_gram" 
                            ? "bg-amber-50 border-amber-500 text-amber-700 font-medium" 
                            : "border-gray-300 hover:border-gray-400 text-gray-700"}`}
                          onClick={() => setRateType("per_gram")}
                        >
                          Per Gram
                        </button>
                        <button
                          className={`py-3 px-4 rounded-lg border transition-all ${rateType === "per_carat" 
                            ? "bg-amber-50 border-amber-500 text-amber-700 font-medium" 
                            : "border-gray-300 hover:border-gray-400 text-gray-700"}`}
                          onClick={() => setRateType("per_carat")}
                        >
                          Per Carat
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Purity */}
                  {selectedMetal && purities.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Select Purity
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {purities.map((purity) => (
                          <button
                            key={purity}
                            className={`py-3 px-4 rounded-lg border transition-all ${selectedPurity === purity
                              ? "bg-amber-50 border-amber-500 text-amber-700 font-medium"
                              : "border-gray-300 hover:border-gray-400 text-gray-700"}`}
                            onClick={() => setSelectedPurity(purity)}
                          >
                            {purity}
                          </button>
                        ))}
                      </div>
                      {selectedMetal.toLowerCase().includes('gold') && gold24kRate && (
                        <p className="text-sm text-gray-500 mt-2">
                          {selectedPurity} gold is based on 24K rate: {formatCurrency(gold24kRate)}/gm
                        </p>
                      )}
                    </div>
                  )}

                  {/* Weight Input */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter Weight ({rateType === "per_gram" ? "in grams" : "in carats"})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder={`Enter weight in ${rateType === "per_gram" ? "grams" : "carats"}`}
                        step="0.01"
                        min="0"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        {rateType === "per_gram" ? "gm" : "ct"}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                      className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                      onClick={calculatePrice}
                      disabled={!selectedMetal || !selectedPurity || !weight}
                    >
                      <Calculator className="w-5 h-5" />
                      Calculate Value
                    </button>
                    <button
                      className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      onClick={resetCalculator}
                    >
                      Reset
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Note:</span> This calculator provides an estimate based on current market rates. 
              For gold: 24K uses 12% making charge, other purities use 3%. 
              Final pricing may vary based on craftsmanship, design complexity, and current market conditions. 
              Please visit our store or contact us for exact pricing.
            </p>
          </div>
        </div>

        {/* Results & Current Rates Panel */}
        <div className="space-y-6">
          {/* Current Rates */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Current Metal Rates
            </h3>
            <div className="space-y-4">
              {metals.slice(0, 4).map((metal, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getMetalIcon(metal.metal_type)}
                    <div>
                      <p className="font-medium text-gray-900">{metal.metal_type}</p>
                      <p className="text-sm text-gray-600">{metal.purity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{metal.rate_per_gram?.toLocaleString('en-IN') || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">per gram</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={fetchMetalRates}
              className="w-full mt-4 py-2 text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Rates
            </button>
          </div>

          {/* Results Display */}
          {calculatedPrice !== null && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-600 rounded-full mb-3">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Estimated Value</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Final Price (including making charge)</div>
                    <div className="text-3xl font-bold text-amber-700">
                      {formatCurrency(calculatedPrice.finalPrice)}
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-amber-100">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Metal:</span>
                      <span className="font-medium text-gray-900">{selectedMetal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Purity:</span>
                      <span className="font-medium text-gray-900">{selectedPurity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Weight:</span>
                      <span className="font-medium text-gray-900">
                        {weight} {rateType === "per_gram" ? "grams" : "carats"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rate per unit:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(calculatedPrice.ratePerUnit)}
                      </span>
                    </div>
                    {selectedMetal.toLowerCase().includes('gold') && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Gold purity value:</span>
                        <span className="font-medium text-gray-900">
                          {getGoldPurityPercentage(selectedPurity)}% of 24K
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => window.open(`https://wa.me/919448866788?text=${encodeURIComponent(
                    `Hello KLS Jewellers,\n\nI calculated the value of my ${selectedMetal} (${selectedPurity}) weighing ${weight} ${rateType === "per_gram" ? 'grams' : 'carats'}.\nEstimated value: ${formatCurrency(calculatedPrice.finalPrice)}\n\nPlease provide more details.`
                  )}`, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact for Exact Quote
                </button>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gold Purity Guide</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600"><strong>24K (100%):</strong> Pure gold, 12% making charge</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600"><strong>22K (91.6%):</strong> 22 parts gold, 3% making charge</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600"><strong>20K (83.3%):</strong> 20 parts gold, 3% making charge</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600"><strong>18K (75%):</strong> 18 parts gold, 3% making charge</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetalRateCalculator;