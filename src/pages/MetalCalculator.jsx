import React, { useEffect, useState } from "react";

const MetalCalculator = () => {
  const [metal, setMetal] = useState("gold");
  const [rates, setRates] = useState([]);
  const [purity, setPurity] = useState("");
  const [rate, setRate] = useState(0);
  const [weight, setWeight] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rates by metal
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`https://klsbackend.onrender.com/get-metal-rates?metal_type=${metal}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        setRates(res.data || []);
        if (res.data?.length) {
          setPurity(res.data[0].purity);
          setRate(res.data[0].rate_per_gram);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch rates. Please try again.");
        setRates([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [metal]);

  // Update rate when purity changes
  useEffect(() => {
    const selected = rates.find((r) => r.purity === purity);
    if (selected) setRate(selected.rate_per_gram);
  }, [purity, rates]);

  // Calculate total
  useEffect(() => {
    const weightNum = parseFloat(weight);
    setTotal(!isNaN(weightNum) && weightNum > 0 ? weightNum * rate : 0);
  }, [weight, rate]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Metal Price Calculator</h2>
        <p className="text-gray-500 mt-2">Calculate current market value</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Metal Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Metal
          </label>
          <div className="flex space-x-3">
            <button
              onClick={() => setMetal("gold")}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${metal === "gold" 
                ? "border-amber-500 bg-amber-50 text-amber-700" 
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${metal === "gold" ? "bg-amber-500" : "bg-amber-400"}`}></div>
                <span className="font-medium">Gold</span>
              </div>
            </button>
            <button
              onClick={() => setMetal("silver")}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${metal === "silver" 
                ? "border-gray-400 bg-gray-50 text-gray-700" 
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${metal === "silver" ? "bg-gray-400" : "bg-gray-300"}`}></div>
                <span className="font-medium">Silver</span>
              </div>
            </button>
          </div>
        </div>

        {/* Purity Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Purity
          </label>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {rates.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setPurity(r.purity)}
                  className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${purity === r.purity
                    ? metal === "gold" 
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-400 bg-gray-50 text-gray-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">{r.purity}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatCurrency(r.rate_per_gram)}/g
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current Rate Display */}
        {!loading && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Current Rate</div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(rate)}<span className="text-sm font-normal text-gray-600">/gram</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Metal</div>
                <div className={`font-semibold ${metal === "gold" ? "text-amber-600" : "text-gray-600"}`}>
                  {metal.charAt(0).toUpperCase() + metal.slice(1)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weight Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Weight (grams)
          </label>
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border-2 border-gray-200 p-4 pl-12 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all duration-200"
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={loading}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              grams
            </div>
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-100">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">TOTAL VALUE</div>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {formatCurrency(total)}
            </div>
            <div className="text-sm text-gray-500">
              {weight && !isNaN(parseFloat(weight)) ? (
                <>
                  {weight} g × {formatCurrency(rate)} = {formatCurrency(total)}
                </>
              ) : (
                "Enter weight to calculate"
              )}
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
          <p>Rates are updated daily from market sources.</p>
          <p className="mt-1">Prices are indicative and may vary based on market conditions.</p>
        </div>
      </div>
    </div>
  );
};

export default MetalCalculator;