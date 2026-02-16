import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


const GoldChittiCalculator = () => {
  const [months, setMonths] = useState(12);
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const schemes = {
    12: { name: "12 Months Gold Plan", bonus: 10 },
    24: { name: "24 Months Diamond Plan", bonus: 20 },
  };

  const handleCalculate = () => {
    const newErrors = {};

    if (!monthlyAmount || isNaN(monthlyAmount) || monthlyAmount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const amount = parseFloat(monthlyAmount);
      const totalInvested = amount * months;
      const bonusPercentage = schemes[months].bonus;
      const bonusAmount = totalInvested * (bonusPercentage / 100);
      const maturityAmount = totalInvested + bonusAmount;

      setResult({
        duration: `${months} Months`,
        monthly: `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        totalInvested: `₹${totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        bonusPercentage: `${bonusPercentage}%`,
        bonusAmount: `₹${bonusAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        maturityAmount: `₹${maturityAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      });
    }
  };

  const handleReset = () => {
    setMonthlyAmount("");
    setResult(null);
    setErrors({});
    setMonths(12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            🪙 Gold Chitti <span className="text-amber-600">Calculator</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Calculate your gold investment returns with bonus
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Scheme Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              <span className="text-2xl mr-2">📅</span>
              Select Your Scheme
            </label>
            <select
              value={months}
              onChange={(e) => {
                setMonths(Number(e.target.value));
                setResult(null);
              }}
              className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            >
              <option value={12}>12 Months Gold Plan (10% Bonus)</option>
              <option value={24}>24 Months Diamond Plan (20% Bonus)</option>
            </select>
          </div>

          {/* Monthly Amount Input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              <span className="text-2xl mr-2">💰</span>
              Monthly Investment Amount
            </label>
            <input
              type="number"
              value={monthlyAmount}
              onChange={(e) => {
                setMonthlyAmount(e.target.value);
                setErrors({ ...errors, amount: "" });
              }}
              placeholder="Enter amount in rupees"
              className={`w-full px-4 py-3 text-gray-900 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                errors.amount
                  ? "border-red-500 focus:border-red-600 focus:ring-red-100"
                  : "border-gray-200 focus:border-amber-600 focus:ring-amber-100"
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-2">{errors.amount}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              Calculate <ArrowRight size={20} />
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition duration-200"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                📊 Your Investment Summary
              </h3>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Duration</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {result.duration}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Monthly Investment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {result.monthly}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {result.totalInvested}
                  </p>
                </div>
                <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200">
                  <p className="text-amber-700 text-sm mb-1 font-semibold">
                    Bonus ({result.bonusPercentage})
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    {result.bonusAmount}
                  </p>
                </div>
              </div>

              {/* Maturity Amount */}
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-8 text-center">
                <p className="text-white text-sm mb-2">Maturity Amount</p>
                <p className="text-5xl font-bold text-white">
                  {result.maturityAmount}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Why Choose Gold Chitti */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600">
              Your gold is stored safely with certified vault partners
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Guaranteed Returns
            </h3>
            <p className="text-gray-600">
              Fixed bonus percentage secured from day one of investment
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Trusted Partner
            </h3>
            <p className="text-gray-600">
              Over 10+ years serving thousands of happy customers
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Gold Investment?
          </h2>
          <p className="text-amber-100 text-lg mb-8">
            Join thousands of investors who are building wealth through gold chittis
          </p>
          <button
  onClick={() => navigate("/chitti")}
  className="bg-white hover:bg-gray-100 text-amber-700 font-bold py-3 sm:py-4 px-8 rounded-lg transition duration-200 text-lg flex items-center justify-center gap-2 mx-auto"
>
  Open an Account <ArrowRight size={24} />
</button>

        </div>
      </div>
    </div>
  );
};

export default GoldChittiCalculator;
