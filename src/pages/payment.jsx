import React from "react";
import upiQr from "../assets/upi_id1.jpeg";

const PaymentPage = () => {
  const upiId = "niru1997.bank-3@okaxis";
  const name = "Niranjan K V";
  const whatsappNumber = "9019740523";
  const amount = 10;

  const openWhatsApp = () => {
    const msg = `Hi, I want to pay ₹${amount} for KLS Gold. Please guide me.`;
    window.location.href = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(
      msg
    )}`;
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    alert("UPI ID copied");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 text-center">
        <h1 className="text-xl font-bold mb-1">UPI Payment</h1>
        <p className="text-sm text-gray-600 mb-4">
          Pay securely using any UPI app
        </p>

        {/* QR CODE */}
        <img
          src={upiQr}
          alt="UPI QR"
          className="w-64 mx-auto border rounded-lg mb-4"
        />

        <p className="text-sm text-gray-700 font-medium mb-1">UPI ID</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm">{upiId}</span>
          <button
            onClick={copyUpi}
            className="text-blue-600 text-xs underline"
          >
            Copy
          </button>
        </div>

        {/* WHATSAPP BUTTON */}
        <button
          onClick={openWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg"
        >
          Pay via WhatsApp
        </button>

        {/* IMPORTANT NOTE */}
        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg text-left">
          ⚠️ <strong>Important:</strong>
          <ul className="list-disc pl-4 mt-1">
            <li>
              Please use <b>Scan & Pay camera</b> in your UPI app
            </li>
            <li>
              Do <b>NOT</b> upload QR from gallery (UPI limit issue)
            </li>
            <li>
              For small amounts like ₹10, WhatsApp payment is recommended
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
