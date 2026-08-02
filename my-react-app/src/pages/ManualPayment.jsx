import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import API from "../api/axios"; 

const ManualPayment = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(AppContext);
  
  // 💱 1. LIVE EXCHANGE RATE FETCH STATE
  const [exchangeRate, setExchangeRate] = useState(280); 

  const [displayCart, setDisplayCart] = useState([]);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌍 2. NEW COUNTRY SELECTION STATE
  const [country, setCountry] = useState("Pakistan");

  const [verificationStatus, setVerificationStatus] = useState("idle"); 
  const [paymentReqId, setPaymentReqId] = useState(null);

  // 🌐 FETCH LIVE RATE
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.PKR) {
          setExchangeRate(data.rates.PKR);
        }
      })
      .catch(err => console.error("Exchange rate fetch failed:", err));
  }, []);

  useEffect(() => {
    const storedBuyNowProduct = localStorage.getItem("buyNowProduct");
    const storedBuyNowQuantity = localStorage.getItem("buyNowQuantity");

    if (storedBuyNowProduct) {
      setIsBuyNowFlow(true);
      const product = JSON.parse(storedBuyNowProduct);
      product.quantity = Number(storedBuyNowQuantity) || 1;
      setDisplayCart([product]);
    } else {
      setIsBuyNowFlow(false);
      if (cart && cart.length > 0) {
        setDisplayCart(cart);
      } else {
        navigate("/cart");
      }
    }
    setIsLoading(false);
  }, [cart, navigate]);

  // 🧮 DYNAMIC TOTAL & SMART DELIVERY CHARGE CALCULATOR
  const currentSubtotalUSD = displayCart.reduce((total, item) => total + (Number(item.price) * (item.quantity || 1)), 0);
  const currentSubtotalPKR = currentSubtotalUSD * exchangeRate;
  
  const isInternational = country !== "Pakistan";
  
  // 🚚 Delivery Logic: Free above 6000 PKR, else 290 PKR (For Pakistan only)
  const deliveryChargePKR = isInternational ? 0 : (currentSubtotalPKR >= 6000 ? 0 : 290);
  
  // 💵 Final Total
  const finalTotalPKR = currentSubtotalPKR + deliveryChargePKR;

  const handleQuantityChange = (itemToUpdate, action) => {
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
        setCart([...updatedCart]); 
      }
    }
  };

  const handlePaymentDone = async () => {
    setVerificationStatus("waiting");
    
    // Save selected country so Checkout page can prepopulate it
    localStorage.setItem("checkoutCountry", country);

    try {
      const response = await API.post("/orders/notify-admin", {
        message: `Online manual payment initiated via ${isBuyNowFlow ? 'Buy Now' : 'Shopping Cart'} flow.`,
        items: displayCart,
        totalAmountPKR: finalTotalPKR, 
        status: "Pending"
      });
      
      if (response.data && response.data.paymentId) {
        setPaymentReqId(response.data.paymentId);
      } else {
        setPaymentReqId("demo-id-123");
      }
    } catch (error) {
      console.log("Admin notification failed", error);
      alert("Server error. Please try again or contact support.");
      setVerificationStatus("idle");
    }
  };

  useEffect(() => {
    let interval;
    if (verificationStatus === "waiting" && paymentReqId) {
      interval = setInterval(async () => {
        try {
          const res = await API.get(`/orders/check-payment/${paymentReqId}`);
          if (res.data.status === "Approved") {
            setVerificationStatus("approved");
            clearInterval(interval);
            setTimeout(() => navigate("/checkout"), 1500); 
          } else if (res.data.status === "Rejected") {
            setVerificationStatus("rejected");
            clearInterval(interval);
          }
        } catch (error) {
          console.log("Polling error", error);
        }
      }, 3000); 
    }
    return () => clearInterval(interval);
  }, [verificationStatus, paymentReqId, navigate]);

  if (isLoading) return null;

  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "#fafafa", padding: "20px" }}>
      
      {verificationStatus !== "idle" && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 10,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          backdropFilter: "blur(5px)", borderRadius: "16px"
        }}>
          {verificationStatus === "waiting" && (
            <>
              <div style={{ width: "50px", height: "50px", border: "5px solid #f3f3f3", borderTop: "5px solid #16a34a", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <h2 style={{ marginTop: "20px", color: "#111" }}>Verifying Payment...</h2>
              <p style={{ color: "#666", textAlign: "center", maxWidth: "300px" }}>Please wait while our team confirms your transaction. Do not close this page.</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </>
          )}

          {verificationStatus === "approved" && (
            <>
              <div style={{ fontSize: "4rem" }}>✅</div>
              <h2 style={{ marginTop: "10px", color: "#16a34a" }}>Payment Verified!</h2>
              <p style={{ color: "#666" }}>Redirecting you to complete your order...</p>
            </>
          )}

          {verificationStatus === "rejected" && (
            <>
              <div style={{ fontSize: "4rem" }}>❌</div>
              <h2 style={{ marginTop: "10px", color: "#dc2626" }}>Verification Failed</h2>
              <p style={{ color: "#666", textAlign: "center", maxWidth: "300px", marginBottom: "20px" }}>We could not verify your payment. Please ensure you sent the correct amount.</p>
              <button 
                onClick={() => setVerificationStatus("idle")}
                style={{ padding: "12px 24px", backgroundColor: "#111", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      )}

      <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "16px", maxWidth: "500px", width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", textAlign: "center" }}>
        
        <h2 style={{ margin: "0 0 10px 0", color: "#111", fontSize: "1.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <span style={{ fontSize: "2rem" }}>💳</span> Secure Transfer
        </h2>
        
        <p style={{ color: "#666", marginBottom: "25px", fontSize: "0.95rem", lineHeight: "1.5" }}>
          Select your country, adjust quantity, and transfer the exact total amount to complete your order.
        </p>

        {/* 🌍 COUNTRY SELECTOR */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Destination Country *
          </label>
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: "100%", padding: "12px 15px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem", outline: "none", backgroundColor: "#f9fafb", cursor: "pointer" }}
          >
            <option value="Pakistan">Pakistan</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Other International">Other (International)</option>
          </select>
        </div>

        {/* ORDER SUMMARY CART */}
        <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "12px", marginBottom: "25px", textAlign: "left", border: "1px solid #eee" }}>
          <h4 style={{ margin: "0 0 15px 0", fontSize: "0.95rem", color: "#444", textTransform: "uppercase", letterSpacing: "1px" }}>Order Summary</h4>
          
          {displayCart.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px", paddingBottom: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src={item.image || item.images?.[0]} alt={item.name} style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }} />
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", fontWeight: "600", color: "#111", maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#16a34a", fontWeight: "600" }}>PKR {(Number(item.price) * exchangeRate).toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                </div>
              </div>

              {/* QUANTITY SELECTOR */}
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "6px", backgroundColor: "#fff" }}>
                <button onClick={() => handleQuantityChange(item, 'dec')} style={{ padding: "6px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: "1.1rem" }}>-</button>
                <span style={{ padding: "6px 12px", fontSize: "0.9rem", fontWeight: "600", borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd", minWidth: "35px", textAlign: "center" }}>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item, 'inc')} style={{ padding: "6px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: "1.1rem" }}>+</button>
              </div>
            </div>
          ))}

          {/* 🚚 DYNAMIC PRICING BREAKDOWN */}
          <div style={{ borderTop: "1px solid #eaeaea", paddingTop: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#444" }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: "600" }}>PKR {currentSubtotalPKR.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#444" }}>
              <span>Delivery ({country}):</span>
              <span style={{ fontWeight: "600", color: deliveryChargePKR === 0 ? "#16a34a" : "#444" }}>
                {isInternational ? "Calculated Later" : (deliveryChargePKR === 0 ? "Free Delivery" : `PKR ${deliveryChargePKR}`)}
              </span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #ccc", paddingTop: "10px" }}>
              <span style={{ fontWeight: "600", color: "#111", fontSize: "1.1rem" }}>Total to Pay:</span>
              <span style={{ fontWeight: "bold", color: "#d9534f", fontSize: "1.2rem" }}>PKR {finalTotalPKR.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
            
            {isInternational && (
              <div style={{ textAlign: "right", marginTop: "5px" }}>
                 <small style={{ color: "#888", fontSize: "0.75rem", fontStyle: "italic" }}>
                   *Custom shipping will be billed separately.
                 </small>
              </div>
            )}
          </div>
        </div>

        {/* 🟡 JazzCash Box */}
        <div style={{ border: "2px solid #efefef", borderRadius: "12px", padding: "15px 20px", marginBottom: "15px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px", backgroundColor: "#fff" }}>
          <div style={{ backgroundColor: "#ed1c24", color: "#fff", padding: "6px 10px", borderRadius: "6px", fontWeight: "bold", fontStyle: "italic", fontSize: "0.9rem", letterSpacing: "0.5px" }}>JazzCash</div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <p style={{ margin: "0", color: "#111", fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "1px" }}>0342 0466996</p>
            <small style={{ color: "#888", fontWeight: "500" }}>Account Title: Ahmed Waris</small>
          </div>
        </div>

        {/* 🟢 EasyPaisa Box */}
        <div style={{ border: "2px solid #efefef", borderRadius: "12px", padding: "15px 20px", marginBottom: "30px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px", backgroundColor: "#fff" }}>
          <div style={{ backgroundColor: "#00a350", color: "#fff", padding: "6px 10px", borderRadius: "6px", fontWeight: "bold", fontSize: "0.9rem", letterSpacing: "0.5px" }}>easypaisa</div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <p style={{ margin: "0", color: "#111", fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "1px" }}>0342 0466996</p>
            <small style={{ color: "#888", fontWeight: "500" }}>Account Title: Ahmed Waris</small>
          </div>
        </div>

        {/* I HAVE PAID BUTTON */}
        <button 
          onClick={handlePaymentDone}
          style={{ width: "100%", padding: "18px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", transition: "0.3s", boxShadow: "0 4px 15px rgba(22, 163, 74, 0.3)" }}
        >
          ☑️ I HAVE DONE PAYMENT
        </button>
        
        <button 
          onClick={() => {
            if(isBuyNowFlow) localStorage.removeItem("buyNowProduct");
            navigate(-1);
          }}
          style={{ width: "100%", padding: "15px", backgroundColor: "transparent", color: "#888", border: "none", marginTop: "10px", fontSize: "0.9rem", cursor: "pointer", textDecoration: "underline" }}
        >
          Cancel and modify order
        </button>
      </div>
    </div>
  );
};

export default ManualPayment;