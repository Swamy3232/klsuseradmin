import React from "react";
import upiQr from "../assets/upi_id1.jpeg";

const UpiPayment = () => {
  const upiId = "niru1997.bank-3@okaxis";
  const name = "Niranjan K V";
  const mobileUpi = "8431497802@ybl";
  const amount = 10; // ₹10 fixed

  const payViaUpiApp = () => {
    const url = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR`;
    window.location.href = url;
  };

  const payViaMobile = () => {
    const url = `upi://pay?pa=${mobileUpi}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 text-center">
        <h1 className="text-xl font-bold mb-1">UPI Payment</h1>
        <p className="text-sm text-gray-600 mb-4">
          Pay ₹{amount} using any UPI app
        </p>

        <img
          src={upiQr}
          alt="UPI QR"
          className="w-64 mx-auto border rounded-lg mb-4"
        />

        <div className="mb-4">
          <p className="text-sm text-gray-500">UPI ID</p>
          <p className="font-medium">{upiId}</p>
        </div>

        <button
          onClick={payViaUpiApp}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold mb-3"
        >
          Pay ₹10 using UPI App
        </button>

        <button
          onClick={payViaMobile}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          Pay via Mobile Number
        </button>

        <div className="mt-4 text-xs text-gray-500 text-left bg-gray-50 p-3 rounded-lg">
          ⚠️ <strong>Important:</strong>
          <ul className="list-disc pl-4 mt-1">
            <li>
              Do <b>NOT</b> select QR from gallery (₹2000 limit issue)
            </li>
            <li>Use <b>Scan & Pay camera</b> OR buttons above</li>
            <li>₹10 payment works without any issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UpiPayment;
