import React, { useState } from "react";
import qrImage from "../assets/upi_id1.jpeg";

export default function UPITest() {
  const [amount, setAmount] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          width: 320,
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: 10 }}>Pay via UPI</h3>

        <img
          src={qrImage}
          alt="UPI QR Code"
          style={{ width: 220, margin: "10px auto" }}
        />

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 12,
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <p style={{ fontSize: 12, marginTop: 10, color: "#555" }}>
          Scan the QR using PhonePe / GPay / Paytm  
          <br />
          Enter amount inside the UPI app
        </p>
      </div>
    </div>
  );
}
