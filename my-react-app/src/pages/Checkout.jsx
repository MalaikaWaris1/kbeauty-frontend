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

  // 🛒 SMART CART DETECTION (Buy Now vs Normal Cart)
  const [displayCart, setDisplayCart] = useState([]);
  const [calculatedSubtotal, setCalculatedSubtotal] = useState(0);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);

  useEffect(() => {
    const storedBuyNowProduct = localStorage.getItem("buyNowProduct");
    const storedBuyNowQuantity = localStorage.getItem("buyNowQuantity");

    if (storedBuyNowProduct) {
      // 🟢 USER CAME FROM "BUY NOW"
      setIsBuyNowFlow(true);
      const product = JSON.parse(storedBuyNowProduct);
      const qty = Number(storedBuyNowQuantity) || 1;
      product.quantity = qty;
      setDisplayCart([product]);
    } else {
      // 🟡 USER CAME FROM "ADD TO BAG" (NORMAL CART)
      setIsBuyNowFlow(false);
      setDisplayCart(cart);
    }
  }, [cart]); 

  // 🧮 DYNAMIC TOTALS RE-CALCULATION
  useEffect(() => {
    if (isBuyNowFlow) {
      const sub = displayCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setCalculatedSubtotal(sub);
      setCalculatedTotal(sub + shippingCost); 
    } else {
      setCalculatedSubtotal(cartSubtotal);
      setCalculatedTotal(totalAmount);
    }
  }, [displayCart, isBuyNowFlow, cartSubtotal, totalAmount, shippingCost]);

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

  const formatPKR = (usdAmount) => {
    if (usdAmount === undefined || usdAmount === null) return "Rs. 0";
    const pkrAmount = Math.round(usdAmount * exchangeRate);
    return `Rs. ${pkrAmount.toLocaleString("en-PK")}`;
  };

  // 🌍 AUTO-FILL COUNTRY FROM LOCAL STORAGE
  const initialState = {
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "",
    street: "", 
    city: "", 
    postalCode: "", 
    country: localStorage.getItem("checkoutCountry") || "Pakistan", // 👈 Auto-Fill Logic
    notes: ""
  };
  const [formData, setFormData] = useState(initialState);

  const userCountry = formData.country.trim().toLowerCase();
  const isInternational = userCountry !== "" && !["pakistan", "pk", "pak"].includes(userCountry);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 SMART QUANTITY HANDLER (Works for both Buy Now & Cart, but Locked if Online)
  const handleQuantityChange = (itemToUpdate, action) => {
    if (isOnlinePayment) return; 

    if (isBuyNowFlow) {
      const updatedCart = displayCart.map(item => {
        if ((item._id || item.id) === (itemToUpdate._id || itemToUpdate.id)) {
          let newQty = item.quantity;
          if (action === 'inc') newQty += 1;
          if (action === 'dec' && newQty > 1) newQty -= 1;
          
          localStorage.setItem("buyNowQuantity", newQty); 
          return { ...item, quantity: newQty };
        }
        return item;
      });
      setDisplayCart(updatedCart);
    } else {
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
    }
  };

  // 🚀 BACKEND SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (displayCart.length === 0) {
      alert("Your order summary is empty.");
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
        items: displayCart.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price)
        })),
        isInternationalOrder: isInternational,
        paymentMethod: isOnlinePayment ? "Online (Pre-Paid)" : "Cash on Delivery",
        orderNotes: formData.notes
      };

      const response = await API.post("/orders", orderPayload);

      if (response.status === 201) {
        alert("🎉 Order successfully placed! Thank you for shopping with us.");
        
        if (isBuyNowFlow) {
          localStorage.removeItem("buyNowProduct");
          localStorage.removeItem("buyNowQuantity");
        } else {
          clearCart();
        }
        localStorage.removeItem("checkoutMode"); 
        localStorage.removeItem("checkoutCountry"); // Clean country state
        
        setFormData(initialState);
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
        
        <div className="checkout-left">
          <h3>Contact Information</h3>
          {/* 🛡️ FIELD VALIDATION SECURITY ADDED */}
          <div className="form-row">
            <input 
              name="firstName" 
              placeholder="FIRST NAME *" 
              required 
              value={formData.firstName} 
              onChange={handleInputChange} 
              pattern="^[A-Za-z\s]{2,50}$" 
              title="Only letters and spaces allowed (2-50 characters)" 
              maxLength="50" 
            />
            <input 
              name="lastName" 
              placeholder="LAST NAME *" 
              required 
              value={formData.lastName} 
              onChange={handleInputChange} 
              pattern="^[A-Za-z\s]{2,50}$" 
              title="Only letters and spaces allowed (2-50 characters)" 
              maxLength="50" 
            />
          </div>
          <input 
            name="email" 
            type="email" 
            placeholder="EMAIL *" 
            required 
            value={formData.email} 
            onChange={handleInputChange} 
            maxLength="100" 
          />
          <input 
            name="phone" 
            type="tel" 
            placeholder="PHONE *" 
            required 
            value={formData.phone} 
            onChange={handleInputChange} 
            pattern="^\+?[0-9\s\-]{10,15}$" 
            title="Enter a valid phone number (10-15 digits)" 
            maxLength="15" 
          />

          <h3>Shipping Address</h3>
          <input 
            name="street" 
            placeholder="STREET ADDRESS *" 
            required 
            value={formData.street} 
            onChange={handleInputChange} 
            minLength="5" 
            maxLength="150" 
            title="Enter complete street address"
          />
          <div className="form-row-3">
            <input 
              name="city" 
              placeholder="CITY *" 
              required 
              value={formData.city} 
              onChange={handleInputChange} 
              pattern="^[A-Za-z\s]{2,50}$" 
              title="Enter a valid city name" 
              maxLength="50" 
            />
            <input 
              name="postalCode" 
              placeholder="POSTAL CODE *" 
              required 
              value={formData.postalCode} 
              onChange={handleInputChange} 
              pattern="^[A-Za-z0-9\s\-]{3,10}$" 
              title="Enter a valid postal code" 
              maxLength="10" 
            />
            <input 
              name="country" 
              placeholder="COUNTRY *" 
              required 
              value={formData.country} 
              onChange={handleInputChange} 
              pattern="^[A-Za-z\s]{2,50}$" 
              title="Enter a valid country name" 
              maxLength="50" 
            />
          </div>

          <h3>Order Notes</h3>
          <textarea 
            name="notes" 
            placeholder="Any special instructions or delivery requirements..." 
            value={formData.notes} 
            onChange={handleInputChange} 
            maxLength="500" 
          />

          <button type="submit" className="submit-order-btn" disabled={loading}>
            {loading ? "PROCESSING ORDER..." : isInternational ? "SUBMIT INTERNATIONAL ORDER REQUEST →" : "SUBMIT ORDER REQUEST →"}
          </button>
        </div>

        <div className="checkout-right">
          <div className="summary-header-row">
            <h3>Order Summary</h3>
            <span className="exchange-badge">(1 USD ≈ {exchangeRate.toFixed(1)} PKR)</span>
          </div>

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
            {displayCart.map((item, index) => (
              <div key={index} className="summary-item" style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }} />
                
                <div className="summary-item-details" style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#111", fontSize: "0.95rem" }}>{item.name}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    
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
                ${calculatedSubtotal.toFixed(2)}
                <small className="pkr-price-text">{formatPKR(calculatedSubtotal)}</small>
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
                ${calculatedTotal.toFixed(2)}
                <small className="pkr-total-text">
                  {formatPKR(calculatedTotal)} {isInternational ? "+ Custom DC" : ""}
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