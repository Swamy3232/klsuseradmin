import React from "react";

const PaymentPage = () => {
  const name = "KLS Gold";
  const amount = 10;
  const upiNumber = "8431497802"; // your number

  const payWithNumber = () => {
    const upiUrl = `upi://pay?pa=${upiNumber}@ybl&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR`;

    window.location.href = upiUrl;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 text-center">
        <h1 className="text-xl font-bold mb-2">UPI Payment</h1>

        <p className="text-gray-600 mb-4">
          Pay ₹{amount} using your UPI app
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-500">Pay to Mobile Number</p>
          <p className="text-lg font-semibold">{upiNumber}</p>
        </div>

        <button
          onClick={payWithNumber}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg"
        >
          Pay ₹10 via UPI Number
        </button>

        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg text-left">
          ⚠️ <strong>Note:</strong>
          <ul className="list-disc pl-4 mt-1">
            <li>The mobile number must be registered with UPI</li>
            <li>If payment fails, the number is not UPI-enabled</li>
            <li>No QR or gallery upload is used</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
