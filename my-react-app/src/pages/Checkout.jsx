import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import API from "../api/axios";
import "./Checkout.css";

const Checkout = () => {
  const { cart, setCart, cartSubtotal, shippingCost, totalAmount, clearCart } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 💱 AUTOMATIC LIVE EXCHANGE RATE STATE
  const [exchangeRate, setExchangeRate] = useState(280);

  // 🧠 SMART DETECTION: Check if user came from Online Payment or COD
  const checkoutMode = localStorage.getItem("checkoutMode") || "cod";
  const isOnlinePayment = checkoutMode === "online"; 

  // 🌐 FETCH LIVE USD TO PKR EXCHANGE RATE
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        if (data && data.rates && data.rates.PKR) {
          setExchangeRate(data.rates.PKR);
        }
      } catch (err) {
        console.error("Live PKR Rate Fetch Failed, using fallback rate:", err);
      }
    };

    fetchExchangeRate();
  }, []);

  // 💵 HELPER FUNCTION TO FORMAT PKR
  const formatPKR = (usdAmount) => {
    if (usdAmount === undefined || usdAmount === null) return "Rs. 0";
    const pkrAmount = Math.round(usdAmount * exchangeRate);
    return `Rs. ${pkrAmount.toLocaleString("en-PK")}`;
  };

  const initialState = {
    firstName: "", lastName: "", email: "", phone: "",
    street: "", city: "", postalCode: "", country: "Pakistan", notes: ""
  };

  const [formData, setFormData] = useState(initialState);

  // ✈️ DETECT INTERNATIONAL COUNTRY
  const userCountry = formData.country.trim().toLowerCase();
  const isInternational = userCountry !== "" && !["pakistan", "pk", "pak"].includes(userCountry);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 PROFESSIONAL QUANTITY HANDLER (Works only if COD)
  const handleQuantityChange = (itemToUpdate, action) => {
    if (isOnlinePayment) return; // Ek additional security check (Lock bypass na ho)
    
    if (setCart) {
      const updatedCart = cart.map(item => {
        if ((item._id || item.id) === (itemToUpdate._id || itemToUpdate.id)) {
          let newQty = item.quantity;
          if (action === 'inc') newQty += 1;
          if (action === 'dec' && newQty > 1) newQty -= 1;
          return { ...item, quantity: newQty };
        }
        return item;
      });
      setCart(updatedCart);
    }
  };

  // 🚀 BACKEND SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (cart.length === 0) {
      alert("Your shopping bag is empty.");
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        items: cart.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price)
        })),
        isInternationalOrder: isInternational,
        paymentMethod: isOnlinePayment ? "Online (Pre-Paid)" : "Cash on Delivery", // 👈 Backend ko pata chalega
        orderNotes: formData.notes
      };

      const response = await API.post("/orders", orderPayload);

      if (response.status === 201) {
        alert("🎉 Order successfully placed! Thank you for shopping with us.");
        clearCart();
        setFormData(initialState);
        localStorage.removeItem("checkoutMode"); // Clear mode after successful order
        navigate("/");
      }
    } catch (err) {
      console.error("Order submit failed:", err);
      const msg = err.response?.data?.message || "Failed to submit order. Please check your network or credentials.";
      setErrorMessage(msg);

      if (err.response?.status === 401) {
        if (window.confirm("You must be logged in to submit an order. Go to Login page?")) {
          navigate("/auth");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page-container">
      <div className="checkout-breadcrumb">
        <Link to="/cart">Your Bag</Link> <span>/</span> <span className="current">Checkout</span>
      </div>

      <h1>Checkout</h1>

      {/* ✈️ STYLISH HIGH-ATTENTION INTERNATIONAL SHIPPING BANNER */}
      {isInternational ? (
        <div className="intl-banner-container">
          <div className="intl-banner-header">
            <div className="intl-banner-icon-wrapper"><span className="intl-globe-icon">✈️</span></div>
            <div className="intl-banner-title">
              <div className="intl-banner-badge"><span className="pulse-dot"></span> INTERNATIONAL ORDER DETECTED</div>
              <h4>Custom Shipping Quote & Invoice Notice</h4>
            </div>
          </div>
          <p className="intl-banner-text">
            Flat rates apply only within Pakistan. For international deliveries, shipping costs are calculated manually based on weight and country. Our team will contact you with a customized invoice after order submission.
          </p>
          <div className="intl-contact-strip">
            <div className="intl-contact-info">
              <span className="intl-contact-label">Direct Support & Shipping Queries:</span>
              <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="intl-contact-phone">
                📱 +92 3420466996 <span className="whatsapp-tag">(WhatsApp Available)</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="checkout-banner">
          📦 <strong>Domestic Orders:</strong> Flat delivery charge across Pakistan via courier.
        </div>
      )}

      {errorMessage && <div className="checkout-error-box">{errorMessage}</div>}

      <form className="checkout-form-grid" onSubmit={handleSubmit}>
        
        {/* LEFT PANEL: FORM DETAILS */}
        <div className="checkout-left">
          <h3>Contact Information</h3>
          <div className="form-row">
            <input name="firstName" placeholder="FIRST NAME *" required value={formData.firstName} onChange={handleInputChange} />
            <input name="lastName" placeholder="LAST NAME *" required value={formData.lastName} onChange={handleInputChange} />
          </div>
          <input name="email" type="email" placeholder="EMAIL *" required value={formData.email} onChange={handleInputChange} />
          <input name="phone" placeholder="PHONE *" required value={formData.phone} onChange={handleInputChange} />

          <h3>Shipping Address</h3>
          <input name="street" placeholder="STREET ADDRESS *" required value={formData.street} onChange={handleInputChange} />
          <div className="form-row-3">
            <input name="city" placeholder="CITY *" required value={formData.city} onChange={handleInputChange} />
            <input name="postalCode" placeholder="POSTAL CODE *" required value={formData.postalCode} onChange={handleInputChange} />
            <input name="country" placeholder="COUNTRY *" required value={formData.country} onChange={handleInputChange} />
          </div>

          <h3>Order Notes</h3>
          <textarea name="notes" placeholder="Any special instructions or delivery requirements..." value={formData.notes} onChange={handleInputChange} />

          <button type="submit" className="submit-order-btn" disabled={loading}>
            {loading ? "PROCESSING ORDER..." : isInternational ? "SUBMIT INTERNATIONAL ORDER REQUEST →" : "SUBMIT ORDER REQUEST →"}
          </button>
        </div>

        {/* RIGHT PANEL: ORDER SUMMARY */}
        <div className="checkout-right">
          <div className="summary-header-row">
            <h3>Order Summary</h3>
            <span className="exchange-badge">(1 USD ≈ {exchangeRate.toFixed(1)} PKR)</span>
          </div>

          {/* 🔒 ONLINE PAYMENT LOCK NOTIFICATION */}
          {isOnlinePayment && (
            <div style={{ backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", padding: "12px", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>💳</span>
              <div>
                <p style={{ margin: "0 0 4px 0", color: "#3730a3", fontWeight: "bold", fontSize: "0.9rem" }}>Payment Initiated Online</p>
                <p style={{ margin: 0, color: "#4f46e5", fontSize: "0.8rem", lineHeight: "1.4" }}>
                  You have chosen to pay via online transfer. Your quantity has been locked for this transaction.
                </p>
              </div>
            </div>
          )}

          <div className="summary-item-list">
            {cart.map((item, index) => (
              <div key={index} className="summary-item" style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }} />
                
                <div className="summary-item-details" style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#111", fontSize: "0.95rem" }}>{item.name}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    
                    {/* 🔘 SMART QUANTITY SELECTOR (LOCKED IF ONLINE, ACTIVE IF COD) */}
                    <div style={{ 
                      display: "flex", alignItems: "center", border: "1px solid #ddd", 
                      borderRadius: "6px", overflow: "hidden", 
                      backgroundColor: isOnlinePayment ? "#f5f5f5" : "#fff",
                      opacity: isOnlinePayment ? 0.6 : 1,
                    }}>
                      <button 
                        type="button" 
                        disabled={isOnlinePayment}
                        onClick={() => handleQuantityChange(item, 'dec')}
                        style={{ padding: "5px 12px", border: "none", background: "transparent", cursor: isOnlinePayment ? "not-allowed" : "pointer", fontSize: "1.1rem", color: "#555" }}
                      >-</button>
                      
                      <span style={{ padding: "5px 12px", fontSize: "0.9rem", fontWeight: "600", minWidth: "20px", textAlign: "center", borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd" }}>
                        {item.quantity}
                      </span>
                      
                      <button 
                        type="button" 
                        disabled={isOnlinePayment}
                        onClick={() => handleQuantityChange(item, 'inc')}
                        style={{ padding: "5px 12px", border: "none", background: "transparent", cursor: isOnlinePayment ? "not-allowed" : "pointer", fontSize: "1.1rem", color: "#555" }}
                      >+</button>
                    </div>

                    <div className="summary-item-price" style={{ textAlign: "right" }}>
                      <span style={{ display: "block", fontSize: "0.95rem", color: "#111" }}>${(item.price * item.quantity).toFixed(2)}</span>
                      <small className="pkr-price-text" style={{ color: "#16a34a", fontWeight: "600", fontSize: "0.75rem" }}>
                        {formatPKR(item.price * item.quantity)}
                      </small>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals" style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <div className="total-row">
              <span>Subtotal</span>
              <span style={{ textAlign: "right" }}>
                ${cartSubtotal.toFixed(2)}
                <small className="pkr-price-text">{formatPKR(cartSubtotal)}</small>
              </span>
            </div>

            <div className="total-row">
              <span>Shipping</span>
              <span style={{ textAlign: "right" }}>
                {isInternational ? (
                  <span className="intl-shipping-text">Calculated Manually <small className="intl-shipping-sub">Billed Separately</small></span>
                ) : shippingCost === 0 ? "Complimentary" : `$${shippingCost.toFixed(2)}`}

                {!isInternational && shippingCost > 0 && (
                  <small className="pkr-price-text">{formatPKR(shippingCost)}</small>
                )}
              </span>
            </div>

            <hr />

            <div className="total-row total-bold">
              <span>Total</span>
              <span style={{ textAlign: "right" }}>
                ${totalAmount.toFixed(2)}
                <small className="pkr-total-text">
                  {formatPKR(totalAmount)} {isInternational ? "+ Custom DC" : ""}
                </small>
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;