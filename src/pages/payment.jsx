import React, { useState } from 'react';
import './UpiPaymentPage.css';

const UpiPaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const upiId = "niru1997.bank-3@okaxis";
  const upiName = "Niranjan k.v";
  
  // Function to generate UPI payment links
  const generateUpiLink = (app) => {
    const encodedNote = encodeURIComponent(note || 'Payment');
    const encodedAmount = amount || '0';
    
    const links = {
      phonepe: `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${encodedAmount}&tn=${encodedNote}&cu=INR`,
      gpay: `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${encodedAmount}&tn=${encodedNote}`,
      paytm: `paytmmp://upi/pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${encodedAmount}&tn=${encodedNote}`,
      bhim: `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${encodedAmount}&tn=${encodedNote}`,
      default: `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${encodedAmount}&tn=${encodedNote}`
    };
    
    return links[app] || links.default;
  };

  // Handle payment initiation
  const handlePayment = (app) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    const paymentLink = generateUpiLink(app);
    window.location.href = paymentLink;
    
    // Simulate payment success after 2 seconds
    setTimeout(() => {
      setPaymentSuccess(true);
    }, 2000);
  };

  // Copy UPI ID to clipboard
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  // Reset payment
  const resetPayment = () => {
    setPaymentSuccess(false);
    setAmount('');
    setNote('');
  };

  return (
    <div className="upi-payment-container">
      <div className="payment-card">
        <h1 className="payment-title">UPI Payment</h1>
        
        {paymentSuccess ? (
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your payment of ₹{amount} has been completed successfully.</p>
            <button className="pay-button" onClick={resetPayment}>
              Make Another Payment
            </button>
          </div>
        ) : (
          <>
            {/* UPI Details Section */}
            <div className="upi-details">
              <div className="upi-header">
                <h3>Pay to: {upiName}</h3>
                <div className="upi-id-display">
                  <span className="upi-id-label">UPI ID:</span>
                  <span className="upi-id-value">{upiId}</span>
                  <button 
                    className="copy-button"
                    onClick={copyUpiId}
                    title="Copy UPI ID"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              
              {/* QR Code Placeholder (would be your actual image in production) */}
              <div className="qr-container">
                <div className="qr-placeholder">
                  <div className="qr-code">
                    {/* This is a QR code representation - replace with actual QR image */}
                    <div className="qr-grid">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className="qr-cell"></div>
                      ))}
                    </div>
                    <div className="qr-overlay">
                      <div className="upi-logo">UPI</div>
                    </div>
                  </div>
                  <p className="qr-label">Scan to pay with any UPI app</p>
                </div>
              </div>
            </div>
            
            {/* Payment Form */}
            <div className="payment-form">
              <h3>Enter Payment Details</h3>
              
              <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="note">Note (Optional)</label>
                <input
                  type="text"
                  id="note"
                  placeholder="Payment for..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength="50"
                />
              </div>
              
              {/* Payment Options */}
              <div className="payment-options">
                <h4>Pay with:</h4>
                
                <div className="payment-buttons">
                  <button 
                    className="payment-option-button phonepe"
                    onClick={() => handlePayment('phonepe')}
                  >
                    <span className="payment-icon">P</span>
                    <span>PhonePe</span>
                  </button>
                  
                  <button 
                    className="payment-option-button gpay"
                    onClick={() => handlePayment('gpay')}
                  >
                    <span className="payment-icon">G</span>
                    <span>Google Pay</span>
                  </button>
                  
                  <button 
                    className="payment-option-button paytm"
                    onClick={() => handlePayment('paytm')}
                  >
                    <span className="payment-icon">P</span>
                    <span>Paytm</span>
                  </button>
                  
                  <button 
                    className="payment-option-button bhim"
                    onClick={() => handlePayment('bhim')}
                  >
                    <span className="payment-icon">B</span>
                    <span>BHIM</span>
                  </button>
                </div>
                
                <div className="or-divider">
                  <span>OR</span>
                </div>
                
                <button 
                  className="pay-any-upi-button"
                  onClick={() => handlePayment('default')}
                >
                  Pay with any UPI App
                </button>
                
                <p className="upi-note">
                  After clicking, you'll be redirected to your UPI app to complete the payment
                </p>
              </div>
            </div>
          </>
        )}
        
        <div className="payment-instructions">
          <h4>Payment Instructions:</h4>
          <ol>
            <li>Enter the amount you want to pay</li>
            <li>Add an optional note for reference</li>
            <li>Select your preferred UPI app</li>
            <li>Complete the payment in your UPI app</li>
            <li>Return to this page to see confirmation</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentPage;