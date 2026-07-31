// src/pages/PurchaseHistory.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AppContext } from "../context/AppContext";
import "./PurchaseHistory.css"; // 👈 External CSS link kar di

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { exchangeRate } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const response = await API.get("/orders/my-orders");
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again to view your purchase history.");
        } else {
          setError("Failed to load your order history.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "shipped": return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "delivered": return { backgroundColor: "#dcfce3", color: "#166534" };
      case "cancelled": return { backgroundColor: "#fee2e2", color: "#991b1b" };
      default: return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <div className="ph-container">
      <div className="checkout-breadcrumb" style={{marginBottom: "20px"}}>
        <Link to="/">Home</Link> <span>/</span> <span className="current">Purchase History</span>
      </div>

      <div className="ph-header-section">
        <h1 className="ph-title">Purchase History</h1>
        <p className="ph-subtitle">Review your past orders and track current shipments.</p>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fef2f2", color: "#991b1b", padding: "16px", border: "1px solid #f87171", marginBottom: "20px" }}>
          {error} <br/>
          {error.includes("Session") && (
            <button onClick={() => navigate("/auth")} style={{ marginTop: "10px", padding: "8px 15px", backgroundColor: "#991b1b", color: "#fff", border: "none", cursor: "pointer" }}>
              Log In Now
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>Loading your history...</div>
      ) : orders.length === 0 && !error ? (
        <div className="ph-empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/shop" className="ph-shop-btn">EXPLORE THE COLLECTION</Link>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="ph-order-card">
              
              <div className="ph-card-header">
                <div>
                  <span className="ph-meta-label">Order Placed</span>
                  <div className="ph-meta-value">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="ph-meta-label">Status</span>
                  <div className="ph-status-badge" style={getStatusStyle(order.status)}>
                    {order.status || "Processing"}
                  </div>
                </div>
              </div>

              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="ph-item-row">
                    <div><strong>{item.quantity}x</strong> {item.name}</div>
                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="ph-card-footer">
                <div>
                  <span className="ph-meta-label">Order ID</span>
                  <span style={{ fontSize: "0.85rem", color: "#555" }}>#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="ph-total-usd">${order.totalAmount?.toFixed(2)}</div>
                  <div className="ph-total-pkr">
                    PKR {(order.totalAmount * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;