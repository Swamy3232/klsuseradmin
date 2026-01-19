import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  CreditCard, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Smartphone,
  IndianRupee,
  Hash,
  ShieldCheck,
  TrendingUp,
  Wallet,
  // Cash,
  Banknote,
  QrCode,
  Receipt
} from "lucide-react";

const PaymentUpdateForm = () => {
  const [formData, setFormData] = useState({
    phone: "",
    paidAmount: "",
    paymentMethod: "cash", // Default to cash
    referenceNumber: "",
    paymentDate: new Date().toISOString().split('T')[0], // Today's date
    notes: ""
  });
  
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState(null);

  const buildShareMessage = (data) => {
    if (!data) return "";
    return [
      `KLS Payment Update`,
      `Phone: ${data.phone || "-"}`,
      `Amount: ₹${data.paidAmount || "-"}`,
      `Method: ${data.paymentMethod || "-"}`,
      `Reference/UTR: ${data.referenceNumber || "CASH_PAYMENT"}`,
      `Date: ${data.paymentDate || new Date().toISOString().split("T")[0]}`
    ].join("\n");
  };

  const shareViaWhatsApp = () => {
    const payload = lastSubmittedFormData || formData;
    const text = buildShareMessage(payload);
    if (!text) return;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareViaEmail = () => {
    const payload = lastSubmittedFormData || formData;
    const text = buildShareMessage(payload);
    if (!text) return;
    const subject = encodeURIComponent("Payment Update - KLS");
    const body = encodeURIComponent(text);
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = url;
  };

  // Prefill phone from login page so users don't need to enter it twice
  useEffect(() => {
    const savedPhone = localStorage.getItem("kls_phone");
    if (savedPhone) {
      setFormData(prev => ({ ...prev, phone: savedPhone }));
    }
  }, []);

  const paymentMethods = [
    { id: "cash", label: "Cash Payment", icon: Banknote, description: "Paid in person with cash" },
    { id: "upi", label: "UPI/QR Code", icon: QrCode, description: "Google Pay, PhonePe, etc." },
    { id: "netbanking", label: "Net Banking", icon: Banknote, description: "Online bank transfer" },
    { id: "card", label: "Card Payment", icon: CreditCard, description: "Debit/Credit card" },
    { id: "cheque", label: "Cheque", icon: Receipt, description: "Bank cheque payment" }
  ];

  const validateForm = () => {
    const errors = {};
    
    // Phone validation (Indian format: 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    // Amount validation
    if (!formData.paidAmount) {
      errors.paidAmount = "Amount is required";
    } else if (parseFloat(formData.paidAmount) <= 0) {
      errors.paidAmount = "Amount must be greater than 0";
    } else if (parseFloat(formData.paidAmount) > 1000000) {
      errors.paidAmount = "Amount exceeds maximum limit";
    }

    // Reference number validation based on payment method
    if (formData.paymentMethod !== "cash") {
      if (!formData.referenceNumber) {
        errors.referenceNumber = `${paymentMethods.find(m => m.id === formData.paymentMethod)?.label} reference is required`;
      } else if (formData.paymentMethod === "upi" && !/^[a-zA-Z0-9]{8,20}$/.test(formData.referenceNumber)) {
        errors.referenceNumber = "Please enter a valid UPI transaction ID";
      } else if (formData.paymentMethod === "netbanking" && formData.referenceNumber.length < 10) {
        errors.referenceNumber = "Please enter a valid transaction reference";
      }
    }

    // Date validation
    if (!formData.paymentDate) {
      errors.paymentDate = "Payment date is required";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Keep saved phone in sync (optional, but helps if user corrects it once)
    if (name === "phone") {
      localStorage.setItem("kls_phone", value);
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleMethodChange = (methodId) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: methodId,
      referenceNumber: methodId === "cash" ? "CASH_PAYMENT" : "" // Default for cash
    }));
    
    // Clear reference number error when changing method
    if (formErrors.referenceNumber) {
      setFormErrors(prev => ({
        ...prev,
        referenceNumber: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setFormErrors({});

    try {
      // Save a snapshot so the user can "Edit & Re-submit" later if needed
      setLastSubmittedFormData({ ...formData });

      const response = await axios.post("https://klsbackend.onrender.com/create-payment", {
        phone: formData.phone,
        paid_amount: parseFloat(formData.paidAmount),
        utr_number: formData.paymentMethod === "cash" ? "CASH_PAYMENT" : formData.referenceNumber
      });

      setMessage({ 
        text: response.data.message || "Payment created successfully!", 
        type: "success" 
      });
      
      // Reset form (keep payment method and date)
      setFormData({
        phone: "",
        paidAmount: "",
        paymentMethod: formData.paymentMethod,
        referenceNumber: "",
        paymentDate: new Date().toISOString().split('T')[0],
        notes: ""
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);

    } catch (err) {
      let errorMessage = "Error updating payment. Please try again.";
      
      if (err.response) {
        // Handle 405 Method Not Allowed
        if (err.response.status === 405) {
          errorMessage = "The server doesn't accept this request method. Please contact support.";
        } else {
          errorMessage = err.response?.data?.detail || 
                        err.response?.data?.message || 
                        `Error ${err.response.status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditLastSubmission = () => {
    if (!lastSubmittedFormData) return;
    setFormData({
      ...lastSubmittedFormData,
      // keep the date sensible if it's empty for some reason
      paymentDate: lastSubmittedFormData.paymentDate || new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
    setMessage({ text: "", type: "" });
  };

  const getReferencePlaceholder = () => {
    switch (formData.paymentMethod) {
      case "cash":
        return "Cash payment - no reference needed";
      case "upi":
        return "Enter UPI Transaction ID (e.g., 1234567890ABCD)";
      case "netbanking":
        return "Enter Transaction/UTR Number";
      case "card":
        return "Enter Card Transaction ID";
      case "cheque":
        return "Enter Cheque Number";
      default:
        return "Enter reference number";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
            <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Update Your Payment
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">
            Record your EMI payment with details of how you paid
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Side - Info Cards */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Payment Options</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Multiple ways to pay</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">
                Select how you made your payment - cash, UPI, net banking, card, or cheque.
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Instant Update</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Real-time tracking</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">
                Your payment record will be updated immediately and visible in your account.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
              <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">Important Notes</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-blue-100">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-1.5 rounded-full bg-white flex-shrink-0"></div>
                  <span>For cash payments, enter "CASH_PAYMENT" as reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-1.5 rounded-full bg-white flex-shrink-0"></div>
                  <span>Keep your payment receipt for verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-1.5 rounded-full bg-white flex-shrink-0"></div>
                  <span>Payment will be verified within 24 hours</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Information</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Tell us how you made your payment</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Registered Phone Number
                    </div>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm sm:text-base">+91</span>
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit registered number"
                      className={`w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-3.5 border text-sm sm:text-base ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      maxLength="10"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Amount Paid
                    </div>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-700 font-medium text-sm sm:text-base">₹</span>
                    </div>
                    <input
                      type="number"
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-4 py-3 sm:py-3.5 border text-sm sm:text-base ${
                        formErrors.paidAmount ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      step="0.01"
                      min="1"
                    />
                  </div>
                  {formErrors.paidAmount && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {formErrors.paidAmount}
                    </p>
                  )}
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = formData.paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => handleMethodChange(method.id)}
                          className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            isSelected ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                          <span className={`text-xs font-medium ${
                            isSelected ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {method.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-gray-600">
                    Selected: {paymentMethods.find(m => m.id === formData.paymentMethod)?.description}
                  </p>
                </div>

                {/* Reference Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      {formData.paymentMethod === "cash" ? (
                        <Hash className="w-4 h-4" />
                      ) : formData.paymentMethod === "upi" ? (
                        <QrCode className="w-4 h-4" />
                      ) : formData.paymentMethod === "netbanking" ? (
                        <Hash className="w-4 h-4" />
                      ) : (
                        <Receipt className="w-4 h-4" />
                      )}
                      {formData.paymentMethod === "cash" ? "Cash Payment Note" : "Reference Number"}
                    </div>
                  </label>
                  <input
                    type="text"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleInputChange}
                    placeholder={getReferencePlaceholder()}
                    disabled={formData.paymentMethod === "cash"}
                    className={`w-full px-4 py-3 sm:py-3.5 border text-sm sm:text-base ${
                      formErrors.referenceNumber ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formData.paymentMethod === "cash" ? 'bg-gray-50 text-gray-500' : ''
                    }`}
                  />
                  {formErrors.referenceNumber && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {formErrors.referenceNumber}
                    </p>
                  )}
                </div>

                {/* Payment Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 sm:py-3.5 border text-sm sm:text-base ${
                        formErrors.paymentDate ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    />
                    {formErrors.paymentDate && (
                      <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {formErrors.paymentDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional details about your payment..."
                    rows="2"
                    className="w-full px-4 py-3 sm:py-3.5 border border-gray-300 text-sm sm:text-base rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div> */}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full min-h-[44px] py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base ${
                    loading ? 'opacity-80 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Payment...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Update Payment Record
                    </div>
                  )}
                </button>
              </form>

              {/* Status Message */}
              {message.text && (
                <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                  message.type === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'success' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {message.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm sm:text-base ${
                        message.type === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {message.text}
                      </p>
                      {message.type === 'success' && (
                        <p className="text-xs sm:text-sm text-green-600 mt-1">
                          Your payment has been recorded. It will be verified shortly.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600">
                  By submitting this payment update, you confirm that the information provided is accurate. 
                  False information may lead to account suspension.{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    View payment guidelines
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentUpdateForm;