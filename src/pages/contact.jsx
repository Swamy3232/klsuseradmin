import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jewelleryType: "",
    weight: "",
    requirements: ""
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [shareMessage, setShareMessage] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const buildMessage = (data) => {
    return [
      "New Design Inquiry",
      `Name: ${data.name || "-"}`,
      `Email: ${data.email || "-"}`,
      `Phone: ${data.phone || "-"}`,
      `Jewellery Type: ${data.jewelleryType || "-"}`,
      `Weight: ${data.weight || "-"}`,
      `Requirements: ${data.requirements || "-"}`,
    ].join("\n");
  };

  const shareWhatsApp = () => {
    if (!shareMessage) return;
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareEmail = () => {
    if (!shareMessage) return;
    const subject = encodeURIComponent("Design Inquiry - KLS Jewellers");
    const body = encodeURIComponent(shareMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setShowShareOptions(false);

    if (!formData.name || (!formData.email && !formData.phone)) {
      setStatus({
        type: "error",
        text: "Please enter your name and at least one contact method (email or phone).",
      });
      return;
    }

    const message = buildMessage(formData);
    setShareMessage(message);
    setShowShareOptions(true);
    setStatus({
      type: "success",
      text: "Details captured. Choose WhatsApp or Email to send.",
    });

    // Keep the form data so the user can adjust before sending; comment out to clear:
    // setFormData({ name: "", email: "", phone: "", jewelleryType: "", weight: "", requirements: "" });
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block p-3 md:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Visit our showroom or request a custom design consultation with our master craftsmen
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT – CONTACT DETAILS */}
          <div className="space-y-8">
            {/* Brand Card */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">KLS Jewellers</h2>
                  <p className="text-amber-700 font-medium text-sm md:text-base">Korarla Jewellery Palace</p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">Location</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Beside Old Sangeetha Mobiles<br />
                      Bengaluru Circle, Chintamani
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Showroom Timing: 10 AM - 8 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">Contact</h3>
                    <div className="space-y-2">
                      <a href="tel:9448866788" className="block text-blue-600 hover:text-blue-700 font-medium hover:underline text-sm md:text-base">
                        94488 66788
                      </a>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a href="https://wa.me/919448866788" target="_blank" rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium hover:underline text-sm md:text-base">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          </svg>
                          Chat on WhatsApp
                        </a>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <a href="mailto:korarlajewellerypalace@gmail.com" 
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline text-sm md:text-base">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Send Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GOOGLE MAP */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-3 md:p-4">
                <h3 className="text-white font-semibold text-base md:text-lg flex items-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Find Our Showroom
                </h3>
              </div>
              <iframe
                title="KLS Jewellers Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.020831798067!2d77.4931997!3d13.0825775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzU3LjMiTiA3N8KwMjknMzkuNSJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-64 md:h-80 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
              <div className="bg-gray-50 p-3 md:p-4 border-t border-gray-200">
                <a href="https://maps.app.goo.gl/d4kUqQMvc6ML6r417" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline text-sm md:text-base">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Quick Contact Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Quick Contact Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="https://wa.me/919448866788?text=Hello%20KLS%20Jewellers,%20I'm%20interested%20in%20your%20jewellery%20designs"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-xl transition-colors duration-300 border border-green-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  Message on WhatsApp
                </a>
                <a href="mailto:korarlajewellerypalace@gmail.com?subject=Jewellery%20Design%20Inquiry"
                   className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-xl transition-colors duration-300 border border-blue-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send an Email
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT – DESIGN REQUEST FORM */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 md:p-8 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Custom Jewellery Design</h3>
              <p className="text-yellow-100 opacity-90 text-sm md:text-base">
                Share your design preferences and our experts will reach out to you
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-sm md:text-base"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-sm md:text-base"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-sm md:text-base"
                  placeholder="94488 66788"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jewellery Type
                  </label>
                  <select 
                    name="jewelleryType"
                    value={formData.jewelleryType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-sm md:text-base"
                  >
                    <option value="">Select Type</option>
                    <option value="Ring">Ring</option>
                    <option value="Necklace">Necklace</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bangle">Bangle</option>
                    <option value="Chain">Chain</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Weight (grams)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-sm md:text-base"
                    placeholder="10"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Requirements
                </label>
                <textarea
                  rows="4"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-sm md:text-base"
                  placeholder="Tell us about your design ideas, occasion, budget, timeline, etc..."
                ></textarea>
              </div>

              {status.text && (
                <div
                  className={`rounded-lg p-3 border text-sm ${
                    status.type === "error"
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-green-50 border-green-200 text-green-700"
                  }`}
                >
                  {status.text}
                </div>
              )}

              {showShareOptions && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
                  <p className="text-sm text-blue-900 font-medium">Send this message:</p>
                  <pre className="bg-white border border-blue-100 rounded-lg p-3 text-sm whitespace-pre-wrap">
                    {shareMessage}
                  </pre>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={shareWhatsApp}
                      className="flex-1 inline-flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      Send via WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={shareEmail}
                      className="flex-1 inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send via Email
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  You can also send us design references via:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Email: korarlajewellerypalace@gmail.com</li>
                  <li>• WhatsApp: 94488 66788</li>
                  <li>• Visit our showroom with your reference images</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold py-3 md:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Design Request
                </div>
                <p className="text-xs md:text-sm font-normal text-yellow-100 mt-1 opacity-90">
                  Our expert will contact you soon
                </p>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 rounded-xl border border-amber-200 max-w-3xl mx-auto">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-700 text-sm md:text-base text-center sm:text-left">
              All custom designs require a consultation appointment. We'll confirm your booking via your preferred contact method.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;