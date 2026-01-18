import React from "react";

const UpiPayment = () => {
  const upiId = "niru1997.bank-3@okaxis";
  const name = "Niranjan K V";
  const amount = 10;

  const payNow = () => {
    window.location.href = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-xl font-bold mb-2">UPI Payment</h1>
        <p className="text-gray-600 mb-4">Pay ₹{amount} securely</p>

        <button
          onClick={payNow}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg"
        >
          Pay ₹10 using UPI App
        </button>

        <p className="text-xs text-gray-500 mt-4">
          This will open Google Pay / PhonePe directly
        </p>
      </div>
    </div>
  );
};

export default UpiPayment;
