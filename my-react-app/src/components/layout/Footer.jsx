import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import "./Footer.css";

export const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
  // 🟢 Accessing Sale Data & Navigate
  const { saleData } = useContext(AppContext);
  const navigate = useNavigate();

  const openModal = (modalName, e) => {
    e.preventDefault();
    setActiveModal(modalName);
    setOpenFaqIndex(null); 
    document.body.style.overflow = "hidden"; 
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = "auto";
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // 🟢 SMART SALE CLICK HANDLER (Direct Flash Sale Section Scroll)
  const handleSaleClick = (e) => {
    e.preventDefault();
    if (saleData && saleData.isActive && saleData.featuredProducts?.length > 0) {
      navigate("/sale"); // Homepage par jao
      setTimeout(() => {
        const saleSection = document.querySelector(".flash-sale-container") || document.querySelector("[style*='background-color']") || document.getElementById("flash-sale-section");
        
        if (saleSection) {
          saleSection.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: 550, behavior: "smooth" }); 
        }
      }, 300);
    } else {
      openModal('noSale', e);
    }
  };

  // 🟢 UPDATED FAQ DATA (Rs. 290 DC & Manual International Billing)
  const faqData = [
    { 
      q: "What is your shipping policy?", 
      a: "We offer a flat delivery rate of Rs. 290 nationwide via Leopards Courier within Pakistan." 
    },
    { 
      q: "Do you ship internationally?", 
      a: "Yes, we ship internationally! Delivery charges for international orders are not flat Rs. 290; they depend on the product weight (kg/ml) and destination. A manual bill is calculated and sent to the customer for advance payment." 
    },
    { 
      q: "What payment methods do you support?", 
      a: "We support Cash on Delivery (COD) within Pakistan and Advance JazzCash / Bank Transfer payments." 
    },
    { 
      q: "What is your return policy?", 
      a: "We accept returns within 7 days of delivery if the product is sealed, unused, and in its original packaging." 
    },
    { 
      q: "Are your products authentic?", 
      a: "Absolutely. All our Korean beauty products are 100% authentic, sourced directly from certified distributors in Korea." 
    }
  ];

  const renderModalContent = () => {
    let title, content;

    switch (activeModal) {
      case "noSale":
        title = <>No Active<br/>Sales</>;
        content = (
          <div className="policy-text-area" style={{ textAlign: "center", marginTop: "30px" }}>
            <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>Stay Tuned!</h3>
            <p style={{ fontSize: "1.1rem" }}>There are currently no active flash sales or discounts.</p>
            <p>Our exclusive collections go on sale for very limited times. Please check back later or subscribe to our newsletter to be the first to know when the next sale drops.</p>
            <button onClick={closeModal} style={{ marginTop: "20px", padding: "12px 30px", backgroundColor: "#111", color: "#fff", border: "none", letterSpacing: "1.5px", cursor: "pointer" }}>
              CONTINUE SHOPPING
            </button>
          </div>
        );
        break;

      case "faq":
        title = <>Beauty<br/>FAQs</>;
        content = (
          <div className="faq-list-container">
            {faqData.map((item, i) => (
              <div key={i} className="faq-item-row">
                <button className="faq-item-btn" onClick={() => toggleFaq(i)}>
                  <span>{item.q}</span>
                  <span className="faq-circle-icon">
                    {openFaqIndex === i ? "−" : "+"}
                  </span>
                </button>
                <div className={`faq-item-content ${openFaqIndex === i ? "open" : ""}`}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case "privacy":
        title = <>Privacy<br/>Policy</>;
        content = (
          <div className="policy-text-area">
            <p>Your privacy is important to us. It is Beauty By Sunny's policy to respect your privacy regarding any information we may collect from you across our website.</p>
            <h3>1. Information we collect</h3>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
            <h3>2. How we use your data</h3>
            <p>We use your data to process your orders, communicate with you regarding your purchases, and improve our store experience.</p>
          </div>
        );
        break;

      case "terms":
        title = <>Terms &<br/>Conditions</>;
        content = (
          <div className="policy-text-area">
            <p>By accessing our website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance.</p>
            <h3>1. Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials on Products By Sunny's website for personal, non-commercial transitory viewing only.</p>
            <h3>2. Limitations</h3>
            <p>In no event shall Beauty By Sunny or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.</p>
          </div>
        );
        break;

      case "shipping":
        title = <>Shipping<br/>Information</>;
        content = (
          <div className="policy-text-area">
            <p>We strive to deliver your rituals safely and quickly.</p>
            <h3>Domestic (Pakistan)</h3>
            <p>Orders are dispatched nationwide via Leopards Courier with a flat delivery charge of Rs. 290. Delivery typically takes 3-5 business days.</p>
            <h3>International Shipping</h3>
            <p>For international customers, delivery charges are not flat Rs. 290. Rates are calculated manually based on parcel weight (kg/ml) and destination country. A custom invoice is shared directly with the customer for advance payment prior to dispatch.</p>
          </div>
        );
        break;

      case "returns":
        title = <>Returns &<br/>Exchanges</>;
        content = (
          <div className="policy-text-area">
            <p>If you are not completely satisfied with your purchase, we're here to help.</p>
            <p>Returns are accepted within 7 days of receiving your order. Items must be unopened, in their original packaging, and in the same condition that you received them. Return shipping costs are the responsibility of the customer unless the item was damaged upon arrival.</p>
          </div>
        );
        break;

      default:
        return null;
    }

    return (
      <div className="dark-modal-layout">
        <div className="dark-modal-left">
          <h2>{title}</h2>
        </div>
        <div className="dark-modal-right">
          {content}
        </div>
      </div>
    );
  };

  return (
    <>
      <footer className="kbeauty-footer">
        <div className="footer-container">
          
          <div className="footer-column brand-info">
            {/* 🎨 LOGO */}
            <Link to="/" className="custom-text-logo footer-text-logo">
              <span className="logo-top-italic">korean</span>
              <div className="logo-bottom-row">
                <span className="logo-brand-sub">PRODUCTSBY_SUNNY</span>
                <span className="logo-pkr-badge">PK</span>
              </div>
            </Link>

            <p className="brand-description">
              A quiet ritual for the modern face. Small-batch Korean beauty, formulated in Korea.
            </p>

            {/* 💳 FIRST COLUMN MEIN MOVED PAYMENT PICS */}
            <div className="payment-icons">
              <img 
                src="https://images.seeklogo.com/logo-png/51/1/easypaisa-logo-png_seeklogo-512220.png" 
                alt="Easypaisa" 
                className="pay-icon" 
              />
              <img 
                src="https://images.seeklogo.com/logo-png/34/1/jazz-cash-logo-png_seeklogo-343031.png" 
                alt="JazzCash" 
                className="pay-icon" 
              />
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">SHOP</h3>
            <ul className="footer-links">
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/shop?tag=new">New Arrivals</Link></li>
              <li><a href="/" onClick={handleSaleClick}>Sale</a></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">SUPPORT</h3>
            <ul className="footer-links">
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="/" onClick={(e) => openModal('faq', e)}>FAQ</a></li>
              <li><a href="/" onClick={(e) => openModal('shipping', e)}>Shipping</a></li>
              <li><a href="/" onClick={(e) => openModal('returns', e)}>Returns</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">COMPANY</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><a href="/" onClick={(e) => openModal('privacy', e)}>Privacy Policy</a></li>
              <li><a href="/" onClick={(e) => openModal('terms', e)}>Terms & Conditions</a></li>
            </ul>
          </div>

        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="copyright-text">© 2026 Korean_productsby_sony. PK</p>
          <p className="cities-text">K-BEAUTY · QUALITY · CARE</p>
        </div>
      </footer>

      {activeModal && (
        <div className="dark-modal-overlay" onClick={closeModal}>
          <div className="dark-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="dark-modal-close" onClick={closeModal}>✕</button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
};