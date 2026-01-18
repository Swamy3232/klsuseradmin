import React from "react";
import upiQr from "../assets/upi_id1.jpeg";

const UpiPayment = () => {
  const upiId = "niru1997.bank-3@okaxis";
  const name = "Niranjan K V";

  const payNow = () => {
    const amount = ""; // keep empty or set fixed amount like 1000
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&cu=INR${amount ? `&am=${amount}` : ""}`;

    window.location.href = upiUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold mb-1">Pay via UPI</h1>
        <p className="text-gray-600 text-sm mb-4">
          Scan or pay using any UPI app
        </p>

        <img
          src={upiQr}
          alt="UPI QR Code"
          className="w-64 mx-auto mb-4 rounded-lg border"
        />

        <p className="text-sm text-gray-700 mb-1">UPI ID</p>
        <p className="font-medium text-gray-900 mb-4">{upiId}</p>

        <button
          onClick={payNow}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
        >
          Pay using UPI App
        </button>

        <p className="text-xs text-gray-500 mt-4">
          After payment, please inform us
        </p>
      </div>
    </div>
  );
};

export default UpiPayment;
