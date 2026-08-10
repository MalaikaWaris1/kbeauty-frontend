import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import API from "../api/axios"; 

// 🌍 MUKAMMAL COUNTRIES KI LIST (Pakistan sab se oopar)
const COUNTRIES_LIST = [
  "Pakistan", "United Arab Emirates", "Saudi Arabia", "United States", "United Kingdom",
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", 
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", 
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", 
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", 
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", 
  "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", 
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", 
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Palau", 
  "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Senegal", 
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", 
  "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", 
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", 
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

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

  // 🟢 FIX: Read initial state from sessionStorage to survive page refresh
  const [verificationStatus, setVerificationStatus] = useState(() => {
    return sessionStorage.getItem("verificationStatus") || "idle";
  }); 
  const [paymentReqId, setPaymentReqId] = useState(() => {
    return sessionStorage.getItem("paymentReqId") || null;
  });

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
  
  // 🚚 Delivery Logic: Online Payment (Advance) pe delivery free ki hai jesa aapne kaha
  const deliveryChargePKR = 0; 
  
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
    // 🟢 FIX: Update State and Session Storage
    const newStatus = "waiting";
    setVerificationStatus(newStatus);
    sessionStorage.setItem("verificationStatus", newStatus);
    
    // Save selected country so Checkout page can prepopulate it
    localStorage.setItem("checkoutCountry", country);

    try {
      const response = await API.post("/orders/notify-admin", {
        message: `Online manual payment initiated via ${isBuyNowFlow ? 'Buy Now' : 'Shopping Cart'} flow.`,
        items: displayCart,
        totalAmountPKR: finalTotalPKR, 
        status: "Pending"
      });
      
      const newPaymentId = (response.data && response.data.paymentId) ? response.data.paymentId : "demo-id-123";
      
      // 🟢 FIX: Save paymentId to state and Session Storage
      setPaymentReqId(newPaymentId);
      sessionStorage.setItem("paymentReqId", newPaymentId);

    } catch (error) {
      console.log("Admin notification failed", error);
      alert("Server error. Please login First or contact support.");
      
      // 🟢 FIX: Reset if API fails
      setVerificationStatus("idle");
      sessionStorage.removeItem("verificationStatus");
      sessionStorage.removeItem("paymentReqId");
    }
  };

  // 🟢 Helper function to handle status resets
  const resetVerificationState = (status = "idle") => {
    setVerificationStatus(status);
    if (status === "idle") {
      sessionStorage.removeItem("verificationStatus");
      sessionStorage.removeItem("paymentReqId");
    } else {
      sessionStorage.setItem("verificationStatus", status);
    }
  };

  useEffect(() => {
    let interval;
    if (verificationStatus === "waiting" && paymentReqId) {
      interval = setInterval(async () => {
        try {
          const res = await API.get(`/orders/check-payment/${paymentReqId}`);
          if (res.data.status === "Approved") {
            resetVerificationState("approved");
            clearInterval(interval);
            setTimeout(() => {
              // Clear session storage before leaving the page completely
              sessionStorage.removeItem("verificationStatus");
              sessionStorage.removeItem("paymentReqId");
              navigate("/checkout");
            }, 1500); 
          } else if (res.data.status === "Rejected") {
            resetVerificationState("rejected");
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
    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "#fafafa", padding: "12px", boxSizing: "border-box" }}>
      
      {/* 📱 MOBILE RESPONSIVE OVERRIDES */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        @media (max-width: 480px) {
          .payment-card-box {
            padding: 20px 14px !important;
          }
          .payment-box-row {
            padding: 12px 12px !important;
            gap: 8px !important;
          }
          .payment-box-title {
            font-size: 0.95rem !important;
          }
          .payment-box-sub {
            font-size: 0.75rem !important;
          }
        }
      `}</style>

      {verificationStatus !== "idle" && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 10,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          backdropFilter: "blur(5px)", borderRadius: "16px", padding: "20px", textAlign: "center"
        }}>
          {verificationStatus === "waiting" && (
            <>
              <div style={{ width: "50px", height: "50px", border: "5px solid #f3f3f3", borderTop: "5px solid #16a34a", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <h2 style={{ marginTop: "20px", color: "#111" }}>Verifying Payment...</h2>
              <p style={{ color: "#666", textAlign: "center", maxWidth: "300px" }}>Please wait while our team confirms your transaction. Do not close this page.</p>
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
                onClick={() => resetVerificationState("idle")} // 🟢 FIX: Reset state on try again
                style={{ padding: "12px 24px", backgroundColor: "#111", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      )}

      {/* MAIN CARD CONTAINER */}
      <div className="payment-card-box" style={{ backgroundColor: "#fff", padding: "30px 25px", borderRadius: "16px", maxWidth: "480px", width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", textAlign: "center", boxSizing: "border-box" }}>
        
        <h2 style={{ margin: "0 0 10px 0", color: "#111", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1.8rem" }}>💳</span> Secure Transfer
        </h2>
        
        <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.88rem", lineHeight: "1.4" }}>
          Select your country, adjust quantity, and transfer the exact total amount to complete your order.
        </p>

        {/* 🌍 ALL COUNTRIES SELECTOR */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#333", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Destination Country *
          </label>
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.95rem", outline: "none", backgroundColor: "#f9fafb", cursor: "pointer", boxSizing: "border-box" }}
          >
            {COUNTRIES_LIST.map((c, index) => (
              <option key={index} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* ORDER SUMMARY CART */}
        <div style={{ backgroundColor: "#f9fafb", padding: "12px 14px", borderRadius: "12px", marginBottom: "20px", textAlign: "left", border: "1px solid #eee", width: "100%", boxSizing: "border-box" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: "#444", textTransform: "uppercase", letterSpacing: "1px" }}>Order Summary</h4>
          
          {displayCart.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px", marginBottom: "12px", paddingBottom: "12px", borderBottom: index !== displayCart.length - 1 ? "1px dashed #eee" : "none" }}>
              
              {/* LEFT: PRODUCT IMAGE & DETAILS */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1", minWidth: 0 }}>
                <img 
                  src={item.image || item.images?.[0]} 
                  alt={item.name} 
                  style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} 
                />
                <div style={{ flex: "1", minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px 0", fontSize: "0.82rem", fontWeight: "600", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#16a34a", fontWeight: "600", whiteSpace: "nowrap" }}>
                    PKR {(Number(item.price) * exchangeRate).toLocaleString(undefined, {maximumFractionDigits:0})}
                  </p>
                </div>
              </div>

              {/* RIGHT: COMPACT QUANTITY SELECTOR */}
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "6px", backgroundColor: "#fff", flexShrink: 0 }}>
                <button 
                  onClick={() => handleQuantityChange(item, 'dec')} 
                  style={{ padding: "3px 7px", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.95rem", lineHeight: "1" }}
                >
                  -
                </button>
                <span style={{ padding: "3px 5px", fontSize: "0.8rem", fontWeight: "600", borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd", minWidth: "20px", textAlign: "center" }}>
                  {item.quantity}
                </span>
                <button 
                  onClick={() => handleQuantityChange(item, 'inc')} 
                  style={{ padding: "3px 7px", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.95rem", lineHeight: "1" }}
                >
                  +
                </button>
              </div>

            </div>
          ))}

          {/* 🚚 DYNAMIC PRICING BREAKDOWN (Updated logic for Free Online Delivery) */}
          <div style={{ borderTop: "1px solid #eaeaea", paddingTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "#444", fontSize: "0.85rem" }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: "600" }}>PKR {currentSubtotalPKR.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#444", fontSize: "0.85rem" }}>
              <span>Delivery ({country}):</span>
              <span style={{ fontWeight: "600", color: deliveryChargePKR === 0 ? "#16a34a" : "#444" }}>
                {isInternational ? "Calculated Later" : "Free (Online Payment)"}
              </span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #ccc", paddingTop: "8px" }}>
              <span style={{ fontWeight: "600", color: "#111", fontSize: "0.95rem" }}>Total to Pay:</span>
              <span style={{ fontWeight: "bold", color: "#d9534f", fontSize: "1.05rem" }}>PKR {finalTotalPKR.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
            
            {isInternational && (
              <div style={{ textAlign: "right", marginTop: "4px" }}>
                 <small style={{ color: "#888", fontSize: "0.72rem", fontStyle: "italic" }}>
                   *Custom shipping will be billed separately.
                 </small>
              </div>
            )}
          </div>
        </div>

        {/* 🟡 JazzCash Box */}
        <div className="payment-box-row" style={{ border: "2px solid #efefef", borderRadius: "12px", padding: "12px 16px", marginBottom: "12px", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", backgroundColor: "#fff", boxSizing: "border-box" }}>
          <div style={{ backgroundColor: "#ed1c24", color: "#fff", padding: "5px 8px", borderRadius: "6px", fontWeight: "bold", fontStyle: "italic", fontSize: "0.8rem", letterSpacing: "0.5px", flexShrink: 0 }}>JazzCash</div>
          <div style={{ textAlign: "right", minWidth: 0 }}>
            <p className="payment-box-title" style={{ margin: "0", color: "#111", fontSize: "1rem", fontWeight: "bold", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>03228314881</p>
            <small className="payment-box-sub" style={{ color: "#888", fontWeight: "500", fontSize: "0.78rem", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Account Title: Ahmed Waris</small>
          </div>
        </div>

        {/* 🟢 EasyPaisa Box */}
        <div className="payment-box-row" style={{ border: "2px solid #efefef", borderRadius: "12px", padding: "12px 16px", marginBottom: "25px", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", backgroundColor: "#fff", boxSizing: "border-box" }}>
          <div style={{ backgroundColor: "#00a350", color: "#fff", padding: "5px 8px", borderRadius: "6px", fontWeight: "bold", fontSize: "0.8rem", letterSpacing: "0.5px", flexShrink: 0 }}>easypaisa</div>
          <div style={{ textAlign: "right", minWidth: 0 }}>
            <p className="payment-box-title" style={{ margin: "0", color: "#111", fontSize: "1rem", fontWeight: "bold", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>0342 0466996</p>
            <small className="payment-box-sub" style={{ color: "#888", fontWeight: "500", fontSize: "0.78rem", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Account Title: Ahmed Waris</small>
          </div>
        </div>

        {/* I HAVE PAID BUTTON */}
        <button 
          onClick={handlePaymentDone}
          style={{ width: "100%", padding: "15px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "bold", cursor: "pointer", transition: "0.3s", boxShadow: "0 4px 15px rgba(22, 163, 74, 0.3)", boxSizing: "border-box" }}
        >
          ☑️ I HAVE DONE PAYMENT
        </button>
        
        <button 
          onClick={() => {
            if(isBuyNowFlow) localStorage.removeItem("buyNowProduct");
            sessionStorage.removeItem("verificationStatus"); // Clear on explicit cancel
            sessionStorage.removeItem("paymentReqId");
            navigate(-1);
          }}
          style={{ width: "100%", padding: "12px", backgroundColor: "transparent", color: "#888", border: "none", marginTop: "8px", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}
        >
          Cancel and modify order
        </button>
      </div>
    </div>
  );
};

export default ManualPayment;