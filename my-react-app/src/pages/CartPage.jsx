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

  const getNumericPrice = (price) => {
    if (typeof price === "number") return price;
    const cleaned = String(price).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
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
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-left">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
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
                        <button type="button" onClick={() => updateCartQuantity(item.id, -1)}>—</button>
                        <span className="qty-number">{item.quantity}</span>
                        <button type="button" onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                  </div>

                  <div className="cart-item-right" style={{textAlign: "right"}}>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>×</button>
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
              
              <button
                type="button"
                className="checkout-submit-btn"
                onClick={() => navigate("/checkout")}
              >
                PROCEED TO CHECKOUT
              </button>
              <Link to="/shop" className="continue-shopping-link">CONTINUE SHOPPING</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;