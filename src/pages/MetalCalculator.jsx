import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calculator, Scale, Gem, Sparkles, TrendingUp, Zap, Loader2, Info } from "lucide-react";

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

  useEffect(() => {
    fetchMetalRates();
  }, []);

  const fetchMetalRates = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://klsbackend.onrender.com/get-metal-rates");
      setMetals(res.data.data);
      
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
      const metalPurities = metals
        .filter((m) => m.metal_type.toLowerCase() === selectedMetal.toLowerCase())
        .map((m) => m.purity);
      setPurities([...new Set(metalPurities)]);
      setSelectedPurity("");
      setCalculatedPrice(null);
    }
  }, [selectedMetal, metals]);

  const calculatePrice = () => {
    if (!selectedMetal || !selectedPurity || !weight) return;

    const metal = metals.find(
      (m) =>
        m.metal_type.toLowerCase() === selectedMetal.toLowerCase() &&
        m.purity === selectedPurity
    );

    if (!metal) return;

    const price =
      rateType === "per_gram"
        ? metal.rate_per_gram * parseFloat(weight)
        : metal.rate_per_carat * parseFloat(weight);

    setCalculatedPrice(price);
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
  };

  const getRatePerUnit = () => {
    if (!selectedMetal || !selectedPurity) return null;
    
    const metal = metals.find(
      (m) =>
        m.metal_type.toLowerCase() === selectedMetal.toLowerCase() &&
        m.purity === selectedPurity
    );

    if (!metal) return null;

    return rateType === "per_gram" ? metal.rate_per_gram : metal.rate_per_carat;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calculator Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* <div className="bg-gradient-to-r from-amber-700 to-amber-800 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Calculator className="w-6 h-6" />
                Calculate Metal Value
              </h2>
              {ratesLastUpdated && (
                <p className="text-amber-100 text-sm mt-2">
                  Rates updated: {ratesLastUpdated}
                </p>
              )}
            </div> */}

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
          
        </div>

        {/* Results & Current Rates Panel */}
        <div className="space-y-6">
          {/* Current Rates */}
         

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
                    <div className="text-sm text-gray-600 mb-1">Total Estimated Value</div>
                    <div className="text-3xl font-bold text-amber-700">
                      {formatCurrency(calculatedPrice)}
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
                        {formatCurrency(getRatePerUnit())}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.open(`https://wa.me/919448866788?text=${encodeURIComponent(
                    `Hello KLS Jewellers,\n\nI calculated the value of my ${selectedMetal} (${selectedPurity}) weighing ${weight} ${rateType === "per_gram" ? 'grams' : 'carats'}.\nEstimated value: ${formatCurrency(calculatedPrice)}\n\nPlease provide more details.`
                  )}`, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact for Exact Quote
                </button>
              </div>
            </div>
          )}
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

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">Select the exact purity for accurate calculation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">Rates are updated regularly from market sources</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">Making charges may apply for jewellery items</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> This calculator provides an estimate based on current market rates. 
              Final pricing may vary based on craftsmanship, design complexity, making charges, and current market conditions. 
              Please visit our store or contact us for exact pricing.
            </p>
          </div>
// Add missing icons
const RefreshCw = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const MessageCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export default MetalRateCalculator;