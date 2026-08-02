import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // Backend API

const ManualPayment = () => {
  const navigate = useNavigate();
  const exchangeRate = 280; 

  // 🟢 100% RELOAD-PROOF LOCAL STATE
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isNotifying, setIsNotifying] = useState(false);

  // 🔄 Fetch Item from Storage on Load
  useEffect(() => {
    const storedProduct = localStorage.getItem("buyNowProduct");
    const storedQty = localStorage.getItem("buyNowQuantity");
    
    if (storedProduct) {
      setProduct(JSON.parse(storedProduct));
      setQuantity(Number(storedQty) || 1);
    } else {
      // Agar direct koi URL open kare without item, redirect back
      navigate("/");
    }
  }, [navigate]);

  if (!product) return null; // Wait for load

  // 🧮 DYNAMIC TOTAL CALCULATOR
  const totalPKR = product.price * quantity * exchangeRate;

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // 🚀 ADMIN NOTIFICATION & PROCEED TO LOCK IN CHECKOUT
  const handlePaymentDone = async () => {
    setIsNotifying(true);
    // User ne jo quantity select ki, use lock karne k liye save karein
    localStorage.setItem("buyNowQuantity", quantity); 
    
    try {
      await API.post("/orders/notify-admin", {
        message: "A user has initiated an online manual payment (Buy Now Flow).",
        product: product.name,
        quantity: quantity,
        totalAmountPKR: totalPKR,
        status: "Payment Verification Pending"
      });
    } catch (error) {
      console.log("Admin notification failed, proceeding to checkout.", error);
    } finally {
      setIsNotifying(false);
      navigate("/checkout"); // Proceed to Address Page
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "#fafafa", padding: "20px" }}>
      <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "16px", maxWidth: "500px", width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", textAlign: "center" }}>
        
        <h2 style={{ margin: "0 0 10px 0", color: "#111", fontSize: "1.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <span style={{ fontSize: "2rem" }}>💳</span> Secure Transfer
        </h2>
        
        <p style={{ color: "#666", marginBottom: "25px", fontSize: "0.95rem", lineHeight: "1.5" }}>
          Adjust your quantity below. The final amount will update automatically. Please transfer the total amount to complete your order.
        </p>

        {/* 🛒 SINGLE ITEM & QUANTITY SELECTOR */}
        <div style={{ backgroundColor: "#f9fafb", padding: "15px", borderRadius: "12px", marginBottom: "25px", textAlign: "left" }}>
          <h4 style={{ margin: "0 0 15px 0", fontSize: "0.95rem", color: "#444", textTransform: "uppercase", letterSpacing: "1px" }}>Order Summary</h4>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px solid #eaeaea", paddingBottom: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={product.image || product.images?.[0]} alt={product.name} style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }} />
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", fontWeight: "600", color: "#111", maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#16a34a", fontWeight: "600" }}>PKR {(product.price * exchangeRate).toLocaleString()}</p>
              </div>
            </div>

            {/* + / - QUANTITY SELECTOR (WORKING 100%) */}
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "6px", backgroundColor: "#fff" }}>
              <button 
                onClick={handleDecrease} 
                style={{ padding: "6px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: "1.1rem" }}
              >-</button>
              <span style={{ padding: "6px 12px", fontSize: "0.9rem", fontWeight: "600", borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd", minWidth: "35px", textAlign: "center" }}>
                {quantity}
              </span>
              <button 
                onClick={handleIncrease} 
                style={{ padding: "6px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: "1.1rem" }}
              >+</button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "5px" }}>
            <span style={{ fontWeight: "600", color: "#111", fontSize: "1.1rem" }}>Total to Pay:</span>
            <span style={{ fontWeight: "bold", color: "#d9534f", fontSize: "1.2rem" }}>
              PKR {totalPKR.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 🟡 JazzCash Box (CSS Badge instead of broken image) */}
        <div style={{ border: "2px solid #efefef", borderRadius: "12px", padding: "15px 20px", marginBottom: "15px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px", backgroundColor: "#fff" }}>
          <div style={{ backgroundColor: "#ed1c24", color: "#fff", padding: "6px 10px", borderRadius: "6px", fontWeight: "bold", fontStyle: "italic", fontSize: "0.9rem", letterSpacing: "0.5px" }}>
            JazzCash
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <p style={{ margin: "0", color: "#111", fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "1px" }}>0342 0466996</p>
            <small style={{ color: "#888", fontWeight: "500" }}>Account Title: Ahmed Waris</small>
          </div>
        </div>

        {/* 🟢 EasyPaisa Box (CSS Badge instead of broken image) */}
        <div style={{ border: "2px solid #efefef", borderRadius: "12px", padding: "15px 20px", marginBottom: "30px", textAlign: "left", display: "flex", alignItems: "center", gap: "15px", backgroundColor: "#fff" }}>
          <div style={{ backgroundColor: "#00a350", color: "#fff", padding: "6px 10px", borderRadius: "6px", fontWeight: "bold", fontSize: "0.9rem", letterSpacing: "0.5px" }}>
            easypaisa
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <p style={{ margin: "0", color: "#111", fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "1px" }}>0342 0466996</p>
            <small style={{ color: "#888", fontWeight: "500" }}>Account Title: Ahmed Waris</small>
          </div>
        </div>

        {/* I HAVE PAID BUTTON */}
        <button 
          onClick={handlePaymentDone}
          disabled={isNotifying}
          style={{ width: "100%", padding: "18px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", cursor: isNotifying ? "not-allowed" : "pointer", transition: "0.3s", boxShadow: "0 4px 15px rgba(22, 163, 74, 0.3)" }}
        >
          {isNotifying ? "VERIFYING..." : "✅ I HAVE DONE PAYMENT"}
        </button>
        
        <button 
          onClick={() => {
            localStorage.removeItem("buyNowProduct");
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