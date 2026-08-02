// src/pages/CartPage.jsx
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "./CartPage.css";

const CartPage = () => {
  const { 
    cart, 
    cartSubtotal, 
    shippingCost, 
    totalAmount,
    exchangeRate, // 🟢 Sourced globally 
    updateCartQuantity, 
    removeFromCart 
  } = useContext(AppContext);

  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();
  
  // 🟢 👈 MODAL STATE ADD KIYI
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getNumericPrice = (price) => {
    if (typeof price === "number") return price;
    const cleaned = String(price).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // 🟢 👈 CART CHECKOUT LOGIC (SMART ROUTING)
  const processCartCheckout = (mode) => {
    localStorage.setItem("checkoutMode", mode);
    
    // IMPORTANT: Make sure Checkout page knows this is the global cart, NOT a "Buy Now" item
    localStorage.removeItem("buyNowProduct");
    localStorage.removeItem("buyNowQuantity");
    
    setShowPaymentModal(false);

    if (mode === "online") {
      navigate("/payment-instructions");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="premium-cart-page">
      <div className="cart-header-section">
        <span className="cart-subtitle">YOUR BAG</span>
        <h1 className="cart-title">Shopping bag</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <p>Your shopping bag is currently empty.</p>
          <Link to="/shop" className="continue-shopping-btn">CONTINUE SHOPPING</Link>
        </div>
      ) : (
        <div className="cart-split-layout">
          <div className="cart-items-list">
            {cart.map((item) => {
              const itemPrice = getNumericPrice(item.price);
              
              // 🟢 Get exact size/volume from the product object
              const exactVolume = item.size || item.volume || item.variant || "";

              return (
                <div key={item.id || item._id} className="cart-item-row">
                  <div className="cart-item-left">
                    <img src={item.image || item.images?.[0]} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <div>
                        <h3 className="cart-item-name">{item.name}</h3>
                        
                        {/* 🟢 Shows exact volume from shop data (e.g. 150ml) without fallback */}
                        {exactVolume && (
                          <span className="cart-item-size">
                            {exactVolume}
                          </span>
                        )}
                      </div>

                      <div className="quantity-selector">
                        <button type="button" onClick={() => updateCartQuantity(item.id || item._id, -1)}>—</button>
                        <span className="qty-number">{item.quantity}</span>
                        <button type="button" onClick={() => updateCartQuantity(item.id || item._id, 1)}>+</button>
                      </div>
                    </div>
                  </div>

                  <div className="cart-item-right" style={{textAlign: "right"}}>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id || item._id)}>×</button>
                    <span className="cart-item-price" style={{display: "block"}}>
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </span>
                    <span style={{fontSize: "0.8em", color: "#888", display: "block", marginTop: "4px"}}>
                      PKR {((itemPrice * item.quantity) * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="order-summary-panel">
            <div className="summary-card">
              <h2 className="summary-title">Order summary</h2>
              <div className="coupon-section">
                <label>COUPON CODE</label>
                <div className="coupon-input-wrapper">
                  <input type="text" placeholder="e.g. GLOW10" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                  <button type="button" className="coupon-apply-btn">APPLY</button>
                </div>
              </div>
              
              <div className="summary-row" style={{alignItems: "flex-start"}}>
                <span>Subtotal</span>
                <span style={{textAlign: "right"}}>
                  ${cartSubtotal.toFixed(2)} <br/>
                  <span style={{fontSize: "0.8em", color: "#888"}}>PKR {(cartSubtotal * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </span>
              </div>
              
              <div className="summary-row" style={{alignItems: "flex-start"}}>
                <span>Delivery (DC)</span>
                <span style={{textAlign: "right"}}>
                  {shippingCost === 0 ? "Free Delivery" : (
                    <>
                      ${shippingCost.toFixed(2)} <br/>
                      <span style={{fontSize: "0.8em", color: "#888"}}>PKR {(shippingCost * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </>
                  )}
                </span>
              </div>
              
              <hr className="summary-divider" />
              
              <div className="summary-row total-row" style={{alignItems: "flex-start"}}>
                <span>Total</span>
                <span style={{textAlign: "right"}}>
                  ${totalAmount.toFixed(2)} <br/>
                  <span style={{fontSize: "0.75em", color: "#555"}}>PKR {(totalAmount * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </span>
              </div>
              
              {/* 🟢 👈 BUTTON UPDATED TO OPEN MODAL */}
              <button
                type="button"
                className="checkout-submit-btn"
                onClick={() => setShowPaymentModal(true)}
              >
                PROCEED TO CHECKOUT
              </button>
              <Link to="/shop" className="continue-shopping-link">CONTINUE SHOPPING</Link>
            </div>
          </div>
        </div>
      )}

      {/* 💳 PAYMENT MODAL OVERLAY */}
      {showPaymentModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 9999,
          display: "flex", justifyContent: "center", alignItems: "center",
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "40px", borderRadius: "12px",
            maxWidth: "420px", width: "90%", textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.5rem", fontWeight: "600", color: "#111" }}>
              Complete Your Purchase
            </h3>
            <p style={{ margin: "0 0 30px 0", color: "#666", fontSize: "0.95rem" }}>
              Please select your preferred payment method for your cart items.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <button 
                onClick={() => processCartCheckout("online")}
                style={{
                  padding: "16px", backgroundColor: "#000", color: "#fff", 
                  border: "none", borderRadius: "8px", fontSize: "1rem", 
                  fontWeight: "500", cursor: "pointer", transition: "0.2s"
                }}
              >
                💳 Pay Online (Card / Wallet)
              </button>
              
              <button 
                onClick={() => processCartCheckout("cod")}
                style={{
                  padding: "16px", backgroundColor: "#fff", color: "#000", 
                  border: "2px solid #000", borderRadius: "8px", fontSize: "1rem", 
                  fontWeight: "500", cursor: "pointer", transition: "0.2s"
                }}
              >
                📦 Cash on Delivery (COD)
              </button>
            </div>

            <button 
              onClick={() => setShowPaymentModal(false)}
              style={{
                marginTop: "25px", background: "none", border: "none", 
                color: "#888", fontSize: "0.9rem", textDecoration: "underline", 
                cursor: "pointer"
              }}
            >
              Cancel & Return to Bag
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;