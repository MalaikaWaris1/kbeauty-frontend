import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      ),
      title: "Free Delivery", // Updated text
      description: "Free delivery on all orders above PKR 6,000.", // Updated text
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      title: "Secure Payment",
      description: "100% safe and encrypted checkout.",
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10h10a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H9"></path>
          <polyline points="7 6 3 10 7 14"></polyline>
        </svg>
      ),
      title: "Easy Returns",
      description: "7-day hassle-free return policy.",
    },
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="6 3 18 3 22 9 12 22 2 9 6 3"></polygon>
        </svg>
      ),
      title: "Korean Beauty", // Updated text
      description: "Authentic Korean products by Sunny.", // Updated text
    },
  ];

  return (
    <section className="why-choose-us-section">
      <div className="why-choose-container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Premium Quality. Trusted Service.</p>
        </div>
        <div className="features-grid">
          {features.map((item) => (
            <div className="feature-card" key={item.id}>
              {/* Ye lines hover par fill hongi */}
              <div className="card-hover-line line-1"></div>
              <div className="card-hover-line line-2"></div>
              <div className="card-hover-line line-3"></div>
              
              <div className="feature-content-wrapper">
                <div className="feature-icon-wrapper">{item.icon}</div>
                <h3 className="feature-title">{item.title}</h3>
                <p className="feature-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;