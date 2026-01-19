import React, { useState } from "react";
import qrImage from "../assets/upi_id1.jpeg";

export default function UPITest() {
  const [amount, setAmount] = useState("");

  const payOnThisPhone = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    const upiUrl = `upi://pay?pa=7483673954@ybl&pn=Swamy&am=${amount}&cu=INR&tn=Payment`;

    window.location.href = upiUrl;
  };

  return (
    <div style={{ padding: 20, maxWidth: 360, margin: "auto" }}>
      <h3>Pay via UPI</h3>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {/* SAME PHONE PAYMENT */}
      <button
        onClick={payOnThisPhone}
        style={{
          width: "100%",
          padding: 12,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: 6,
        }}
      >
        Pay on this phone
      </button>

      <p style={{ textAlign: "center", margin: "12px 0", color: "#777" }}>
        OR
      </p>

      {/* OTHER PHONE PAYMENT */}
      <img
        src={qrImage}
        alt="Scan to Pay"
        style={{ width: 220, display: "block", margin: "auto" }}
      />

      <p style={{ fontSize: 12, textAlign: "center", marginTop: 8 }}>
        Scan using another phone
      </p>
    </div>
  );
}
