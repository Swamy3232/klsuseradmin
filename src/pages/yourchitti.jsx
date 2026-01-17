import React, { useState } from 'react';
import axios from 'axios';

const YourChitti = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [registerData, setRegisterData] = useState({
    phone: '',
    full_name: '',
    address: '',
    password: '',
    start_date: '',
    total_months: ''
  });
  const [loginData, setLoginData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [loginResponse, setLoginResponse] = useState(null);

  const API_BASE_URL = 'https://klsbackend.onrender.com';

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/create-customer`, {
        ...registerData,
        total_months: parseInt(registerData.total_months),
        start_date: registerData.start_date || new Date().toISOString().split('T')[0]
      });
      
      setMessage(response.data.message || 'Registration successful!');
      setRegisterData({
        phone: '',
        full_name: '',
        address: '',
        password: '',
        start_date: '',
        total_months: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setLoginResponse(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/gold_user_summary_auth`, {
        params: {
          phone: loginData.phone,
          password: loginData.password
        }
      });
      
      setLoginResponse(response.data);
      setMessage('Login successful!');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            YourChitti Gold KLS
          </h1>
          <p className="text-amber-700 text-lg">
            Secure Gold Chitti Platform - Manage Your Investments
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-lg font-semibold transition-all touch-manipulation min-h-[48px] ${
                activeTab === 'register'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
              }`}
              onClick={() => setActiveTab('register')}
              type="button"
            >
              Register
            </button>
            <button
              className={`flex-1 py-4 text-lg font-semibold transition-all touch-manipulation min-h-[48px] ${
                activeTab === 'login'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
              }`}
              onClick={() => setActiveTab('login')}
              type="button"
            >
              Login
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {message}
              </div>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                      inputMode="numeric"
                      required
                    />
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={registerData.full_name}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={registerData.address}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                      placeholder="Enter your complete address"
                      rows="3"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                      placeholder="Create a strong password"
                      required
                    />
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={registerData.start_date}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                    />
                  </div>

                  {/* Total Months */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Total Months *
                    </label>
                    <input
                      type="number"
                      name="total_months"
                      value={registerData.total_months}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                      placeholder="e.g., 24"
                      min="1"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px] active:from-amber-800 active:to-amber-900"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Register Account'
                  )}
                </button>

                {/* Note */}
                <p className="text-sm text-gray-500 text-center">
                  Note: After registration, your account will be pending admin approval.
                </p>
              </form>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="space-y-8">
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={loginData.phone}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                        placeholder="9876543210"
                        pattern="[0-9]{10}"
                        inputMode="numeric"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px] active:from-amber-800 active:to-amber-900"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      'Login to Your Account'
                    )}
                  </button>
                </form>

                {/* User Summary Display */}
                {loginResponse && (
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200 shadow-lg">
                    <h3 className="text-2xl font-bold text-amber-800 mb-6 pb-3 border-b border-amber-200">
                      Your Chitti Summary
                    </h3>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {/* User Info Card */}
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-semibold text-gray-600 mb-2">Customer Info</h4>
                        <p className="text-lg font-bold text-amber-700">{loginResponse.full_name}</p>
                        <p className="text-gray-600">{loginResponse.phone}</p>
                      </div>

                      {/* Plan Duration */}
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-semibold text-gray-600 mb-2">Plan Duration</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-amber-700">{loginResponse.payments_count}</p>
                            <p className="text-sm text-gray-500">Months Paid</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-amber-700">{loginResponse.remaining_months}</p>
                            <p className="text-sm text-gray-500">Remaining</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-amber-700">{loginResponse.total_months}</p>
                            <p className="text-sm text-gray-500">Total</p>
                          </div>
                        </div>
                      </div>

                      {/* Amount Summary */}
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-semibold text-gray-600 mb-2">Amount Summary</h4>
                        <p className="text-3xl font-bold text-green-600">
                          ₹{loginResponse.total_paid?.toLocaleString('en-IN') || '0'}
                        </p>
                        <p className="text-sm text-gray-500">Total Amount Paid</p>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <h4 className="font-semibold text-gray-700 p-4 bg-gray-50 border-b">
                        Payment History
                      </h4>
                      <div className="max-h-60 overflow-y-auto">
                        {loginResponse.payment_dates && loginResponse.payment_dates.length > 0 ? (
                          <ul className="divide-y">
                            {loginResponse.payment_dates.map((date, index) => (
                              <li key={index} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="inline-block w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-center leading-8 mr-3">
                                      {index + 1}
                                    </span>
                                    <span className="text-gray-700">
                                      Payment #{index + 1}
                                    </span>
                                  </div>
                                  <span className="text-gray-500">
                                    {formatDate(date)}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            No payment history available
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>
                          {Math.round((loginResponse.payments_count / loginResponse.total_months) * 100)}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${(loginResponse.payments_count / loginResponse.total_months) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} YourChitti Gold KLS. All rights reserved.</p>
          <p className="mt-1">Secure Gold Chitti Management System</p>
        </footer>
      </div>
    </div>
  );
};

export default YourChitti;