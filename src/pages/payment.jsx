import React, { useState } from "react";
import {
  IndianRupee,
  QrCode,
  Smartphone,
} from "lucide-react";
import qrImage from "../assets/upi_id.jpeg";

const PaymentForm = () => {
  const [amount, setAmount] = useState("");

  const UPI_ID = "niru1997bank-3@okaxis"; // use verified UPI
  const PAYEE_NAME = "KLS Gold";

  const payWithPhonePe = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const phonePeUrl =
      `phonepe://pay` +
      `?pa=${encodeURIComponent(UPI_ID)}` +
      `&pn=${encodeURIComponent(PAYEE_NAME)}` +
      `&am=${Number(amount).toFixed(2)}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent("Gold Payment")}`;

    // Direct open (must be inside click)
    window.location.href = phonePeUrl;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Scan & Pay
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Pay securely using UPI
          </p>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Enter Amount
            </div>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* QR Code */}
        <div className="text-center space-y-3">
          <img
            src={qrImage}
            alt="Scan to Pay"
            className="mx-auto w-60 rounded-xl border"
          />

          <p className="text-sm text-gray-600">
            Scan using PhonePe / GPay / Paytm
          </p>

          <p className="text-sm">
            UPI ID: <strong>{UPI_ID}</strong>
          </p>
        </div>

        {/* PhonePe Button */}
        <button
          type="button"
          onClick={payWithPhonePe}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Smartphone className="w-5 h-5" />
          Pay with PhonePe
        </button>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center">
          After payment, please return and confirm with the admin.
        </div>

      </div>
    </div>
  );
};

export default PaymentForm;
