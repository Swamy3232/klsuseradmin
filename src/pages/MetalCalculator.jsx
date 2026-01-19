import React, { useEffect, useState } from "react";

const MetalCalculator = () => {
  const [metal, setMetal] = useState("gold");
  const [rate, setRate] = useState(0);
  const [weight, setWeight] = useState("");
  const [total, setTotal] = useState(0);

  // Fetch rate whenever metal changes
  useEffect(() => {
    fetch(`https://klsbackend.onrender.com/get-metal-rates?metal_type=${metal}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setRate(data.data[0].rate_per_gram);
        }
      })
      .catch((err) => console.error(err));
  }, [metal]);

  // Calculate total
  useEffect(() => {
    const result = weight ? weight * rate : 0;
    setTotal(result);
  }, [weight, rate]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {metal === "gold" ? "Gold" : "Silver"} Price Calculator
      </h2>

      {/* Metal Selection */}
      <label className="block mb-2 font-medium">Select Metal</label>
      <select
        value={metal}
        onChange={(e) => setMetal(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      >
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
      </select>

      {/* Rate Display */}
      <div className="mb-4 text-sm text-gray-600">
        Current Rate: <b>₹ {rate} / gram</b>
      </div>

      {/* Weight Input */}
      <label className="block mb-2 font-medium">Weight (grams)</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Enter weight"
        className="w-full border rounded-lg p-2 mb-4"
      />

      {/* Total Price */}
      <div className="text-lg font-semibold text-center mt-4">
        Total Price: <span className="text-green-600">₹ {total}</span>
      </div>
    </div>
  );
};

export default MetalCalculator;
