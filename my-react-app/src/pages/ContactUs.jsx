// src/components/pages/ContactUs.jsx
import React, { useState } from "react";
import "./ContactUs.css";
import API from "../api/axios";

export const ContactUs = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "General Inquiry",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        inquiryType: formData.enquiryType,
        message: formData.message
      };

      const response = await API.post("/contact/submit", payload);

      if (response.status === 201 || response.status === 200) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          enquiryType: "General Inquiry",
          message: ""
        });
      }
    } catch (error) {
      console.error("Contact Form Submission Error:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error.response?.data?.message || "Failed to dispatch message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="luxury-page-bg">
      <div className={`beauty-book-wrapper ${isOpen ? "book-is-open" : ""}`}>
        
        {/* RIGHT PAGE (Form) */}
        <div className="book-page-right">
          <div className="page-right-header">
            <h2 className="form-mini-title">Contact Us</h2>
            <button className="close-diary-btn" onClick={() => setIsOpen(false)} title="Close Diary">
              ✕ Close
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="premium-contact-form">
            <div className="input-group-row">
              <span className="input-field-icon">👤</span>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="name" required />
            </div>

            <div className="input-group-row">
              <span className="input-field-icon">✉️</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" required />
            </div>

            <div className="input-group-row">
              <span className="input-field-icon">📞</span>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03279298417" required />
            </div>

            <div className="input-group-row">
              <span className="input-field-icon">✦</span>
              <select name="enquiryType" value={formData.enquiryType} onChange={handleChange} className="premium-select-field">
                <option value="General Inquiry">General Inquiry</option>
                <option value="Product Question">Product Ingredient Question</option>
                <option value="Order Tracking">Order & Shipping Status</option>
                <option value="Wholesale">Wholesale & B2B Enquiry</option>
              </select>
            </div>

            <div className="input-group-row text-area-row">
              <span className="input-field-icon">💬</span>
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your message here..." rows="3" required></textarea>
            </div>

            <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {submitStatus === "success" && (
              <p className="form-status-msg success">✨ Message dispatched successfully!</p>
            )}
            {submitStatus === "error" && (
              <p className="form-status-msg error" style={{ color: "#e11d48", fontSize: "12px", marginTop: "8px" }}>
                ❌ {errorMessage}
              </p>
            )}
          </form>
        </div>

        {/* FLIP PAGE ENGINE */}
        <div className="book-flip-page">
          <div className="book-side book-side-front" onClick={() => setIsOpen(true)}>
            <div className="cover-center-title">
              <h2>Customer Care</h2>
              <p>ARCHIVE & INQUIRIES</p>
            </div>
            <button className="cover-interactive-btn">
              OPEN CUSTOMER DIARY <span className="arrow-pulse"> →</span>
            </button>
          </div>

          <div className="book-side book-side-back">
            
            {/* 🟢 Continuous Brand Text Marquee (Replaced Image Logo) */}
            <div className="brand-ticker-container">
              <div className="brand-ticker-track">
                <span>KProducts_BySunny</span>
                <span className="ticker-dot">•</span>
                <span>KProducts_BySunny</span>
                <span className="ticker-dot">•</span>
                <span>KProducts_BySunny</span>
                <span className="ticker-dot">•</span>
                <span>KProducts_BySunny</span>
                <span className="ticker-dot">•</span>
              </div>
            </div>

            <div className="listening-page-wrapper">
              <span className="listening-say-hello">Say Hello</span>
              <h1 className="listening-main-title">We're listening.</h1>
              <p className="listening-description">
                Questions about a product, an order, or a wholesale enquiry? 
                Our care team responds within one business day.
              </p>

              <div className="listening-info-list">
                <div className="info-row-item">
                  <span className="info-icon">✉</span> 
                  <span>ahmedgadet0@gmail.com</span>
                </div>
                <div className="info-row-item">
                  <span className="info-icon">📞</span> 
                  <span>+92 3420466996 </span>
                </div>
                <div className="info-row-item">
                  <span className="info-icon">📍</span> 
                  <span>City Housing, Daska Road, Sialkot, Pakistan</span>
                </div>
              </div>

              <div className="listening-hours-footer">
                Hours · Mon-Fri · 09:00-18:00 PKT
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};