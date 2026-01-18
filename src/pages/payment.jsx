import React, { useState } from 'react';
import './SimpleUpiPayment.css';

const SimpleUpiPayment = () => {
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success
  
  // Your UPI details from the image
  const upiId = "niru1997.bank-3@okaxis";
  const upiName = "Niranjan k.v";

  // Handle payment
  const handlePayNow = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setPaymentStatus('processing');
    
    // Generate UPI payment link
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&tn=Payment&cu=INR`;
    
    // Try to open UPI app
    window.location.href = upiLink;
    
    // Show success message after a delay (simulating payment)
    setTimeout(() => {
      setPaymentStatus('success');
    }, 2000);
  };

  // Reset payment
  const resetPayment = () => {
    setPaymentStatus('idle');
    setAmount('');
  };

  // Copy UPI ID to clipboard
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId)
      .then(() => {
        alert("UPI ID copied to clipboard!");
      });
  };

  return (
    <div className="simple-upi-container">
      <div className="simple-payment-card">
        <h1 className="simple-title">Pay with UPI</h1>
        
        {/* UPI Details */}
        <div className="simple-upi-details">
          <div className="simple-recipient">
            <span className="simple-label">Recipient:</span>
            <span className="simple-value">{upiName}</span>
          </div>
          
          <div className="simple-upi-id">
            <span className="simple-label">UPI ID:</span>
            <div className="upi-id-container">
              <span className="upi-id-value">{upiId}</span>
              <button className="copy-btn" onClick={copyUpiId}>Copy</button>
            </div>
          </div>
        </div>

        {/* Payment Form - Only shown when not in success state */}
        {paymentStatus !== 'success' ? (
          <>
            <div className="simple-amount-section">
              <label htmlFor="amount" className="amount-label">Enter Amount (₹)</label>
              <input
                type="number"
                id="amount"
                className="amount-input"
                placeholder="e.g., 1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
              />
              <div className="amount-hint">Try ₹1 for testing</div>
            </div>

            {/* Pay Button */}
            <button 
              className="simple-pay-button" 
              onClick={handlePayNow}
              disabled={paymentStatus === 'processing'}
            >
              {paymentStatus === 'processing' ? 'Opening UPI App...' : 'Pay Now'}
            </button>

            {/* UPI Apps Quick Buttons */}
            <div className="upi-apps-note">
              <p>Will open your default UPI app</p>
              <div className="upi-apps-icons">
                <span className="upi-app-icon">PhonePe</span>
                <span className="upi-app-icon">GPay</span>
                <span className="upi-app-icon">Paytm</span>
                <span className="upi-app-icon">BHIM</span>
              </div>
            </div>
          </>
        ) : (
          /* Success Message */
          <div className="simple-success-message">
            <div className="success-checkmark">✓</div>
            <h2>Payment Initiated!</h2>
            <p>Complete payment of ₹{amount} in your UPI app</p>
            <div className="success-details">
              <div>Paid to: <strong>{upiName}</strong></div>
              <div>UPI ID: <strong>{upiId}</strong></div>
            </div>
            <button className="new-payment-btn" onClick={resetPayment}>
              Make Another Payment
            </button>
          </div>
        )}

        {/* Simple Instructions */}
        <div className="simple-instructions">
          <h3>How to Pay:</h3>
          <ol>
            <li>Enter amount above</li>
            <li>Click "Pay Now"</li>
            <li>Complete payment in UPI app</li>
            <li>Return here for confirmation</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SimpleUpiPayment;