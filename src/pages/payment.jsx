import React, { useState } from "react";

export default function UPITest() {
  const [amount, setAmount] = useState("");

  const payNow = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    const upiUrl = `upi://pay?pa=9019740523@ybl&pn=Swamy&am=${amount}&cu=INR&tn=Test Payment`;

    window.location.href = upiUrl;
  };

  return (
    <div style={{
      padding: 20,
      maxWidth: 320,
      margin: "auto",
      fontFamily: "Arial"
    }}>
      <h3>Pay via UPI</h3>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          marginBottom: 12
        }}
      />

      <button
        onClick={payNow}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: 6
        }}
      >
        Pay Now
      </button>

      <p style={{ fontSize: 12, marginTop: 10, color: "#555" }}>
        Opens GPay / PhonePe / Paytm
      </p>
    </div>
  );
}
