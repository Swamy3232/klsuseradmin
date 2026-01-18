import React, { useState } from "react";
import axios from "axios";
import {
  CreditCard,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  CheckCircle
} from "lucide-react";

import upiQR from "../assets/upi_id.jpeg"; 



const UPI_ID = "901904523@ybl";
const WHATSAPP_NUMBER = "919019740523"; 
const API_URL = "https://klsbackend.onrender.com/create-payment";


const Payment = () => {
  const [step, setStep] = useState("pay"); // pay | form
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    phone: "",
    paidAmount: "",
    utrNumber: "",
  });

  const [errors, setErrors] = useState({});

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=KLS Gold&cu=INR`;

  /* ================= VALIDATION ================= */
  const validate = () => {
    const err = {};
    if (!/^[6-9]\d{9}$/.test(formData.phone))
      err.phone = "Enter valid 10-digit phone number";
    if (!formData.paidAmount || Number(formData.paidAmount) <= 0)
      err.paidAmount = "Enter valid amount";
    if (!/^[A-Za-z0-9]{8,20}$/.test(formData.utrNumber))
      err.utrNumber = "Invalid UTR number";
    return err;
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(API_URL, {
        phone: formData.phone,
        paid_amount: Number(formData.paidAmount),
        utr_number: formData.utrNumber,
      });

      setMessage({
        text: res.data.message || "Payment submitted successfully",
        type: "success",
      });

      setFormData({ phone: "", paidAmount: "", utrNumber: "" });
    } catch (error) {
      setMessage({
        text: error.response?.data?.detail || "Payment submission failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto">

        {/* ================= STEP 1 : PAY ================= */}
        {step === "pay" && (
          <div className="bg-white rounded-2xl p-6 shadow text-center space-y-6">
            <CreditCard className="w-12 h-12 mx-auto text-emerald-600" />
            <h1 className="text-2xl font-bold">Pay via UPI</h1>

            <a
              href={upiLink}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Pay Now <ArrowRight />
            </a>

            {/* QR IMAGE */}
            <div className="flex justify-center">
              <img
                src={upiQR}
                alt="UPI QR Code"
                className="w-48 h-48 object-contain border rounded-lg"
              />
            </div>

            <p className="text-gray-600 text-sm">
              UPI ID: <span className="font-semibold">{UPI_ID}</span>
            </p>

            <button
              onClick={() => setStep("form")}
              className="text-emerald-600 font-semibold"
            >
              I have paid → Enter details
            </button>
          </div>
        )}

        {/* ================= STEP 2 : FORM ================= */}
        {step === "form" && (
          <div className="bg-white rounded-2xl p-6 shadow mt-6">
            <h2 className="text-xl font-bold mb-4">Submit Payment Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border p-3 rounded"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}

              <input
                name="paidAmount"
                type="number"
                value={formData.paidAmount}
                onChange={handleChange}
                placeholder="Paid Amount ₹"
                className="w-full border p-3 rounded"
              />
              {errors.paidAmount && (
                <p className="text-red-500 text-sm">{errors.paidAmount}</p>
              )}

              <input
                name="utrNumber"
                value={formData.utrNumber}
                onChange={handleChange}
                placeholder="UTR Number"
                className="w-full border p-3 rounded"
              />
              {errors.utrNumber && (
                <p className="text-red-500 text-sm">{errors.utrNumber}</p>
              )}

              <button
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded font-semibold"
              >
                {loading ? "Submitting..." : "Submit Payment"}
              </button>
            </form>

            {/* STATUS MESSAGE */}
            {message.text && (
              <div
                className={`mt-4 p-3 rounded flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle />
                ) : (
                  <AlertCircle />
                )}
                {message.text}
              </div>
            )}

            {/* WHATSAPP NOTE */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="font-medium mb-2">
                📸 Please send UTR screenshot on WhatsApp
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 text-green-600 font-semibold"
              >
                <MessageCircle /> WhatsApp
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Payment;
