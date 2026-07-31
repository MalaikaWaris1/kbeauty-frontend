// src/pages/WishlistPage.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "./WishlistPage.css";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, moveToBag } = useContext(AppContext);

  // Price formatter matching decimal structure
  const formatPrice = (price) => {
    if (typeof price === "number") return price.toFixed(2);
    const cleaned = String(price || 0).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) ? parseFloat(cleaned).toFixed(2) : "0.00";
  };

  return (
    <div className="premium-wishlist-page">
      <div className="wishlist-header-section">
        <span className="wishlist-subtitle">SAVED FOR LATER</span>
        <h1 className="wishlist-title">Wishlist</h1>
      </div>

      {!wishlist || wishlist.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is currently empty.</p>
          <Link to="/shop" className="wishlist-shop-now-btn" style={{ marginTop: "15px", display: "inline-block", textDecoration: "underline" }}>
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid-layout">
          {wishlist.map((item, index) => {
            const isObject = item && typeof item === "object";
            
            // 🟢 MongoDB & Local ID Normalization
            const targetId = isObject ? (item._id || item.id) : item;
            const name = isObject ? (item.name || item.title || "Luxury Product") : "Product Layout";
            const image = isObject ? (item.image || (item.images && item.images[0])) : "";
            const description = isObject ? (item.description || item.tagline || "Barrier-first luxury care") : "Premium luxury care";
            const price = isObject ? (item.price || 0) : 0;

            return (
              <div key={`${targetId || 'item'}-${index}`} className="wishlist-card">
                {/* Remove Cross Button */}
                <button 
                  className="wishlist-remove-cross" 
                  onClick={() => removeFromWishlist(targetId, name)}
                  aria-label="Remove item"
                >
                  ×
                </button>
                
                <div className="wishlist-card-content">
                  {/* Product Image Link */}
                  <Link to={`/product/${targetId}`} className="wishlist-img-wrapper">
                    {image ? (
                      <img src={image} alt={name} className="wishlist-item-img" />
                    ) : (
                      <div className="wishlist-img-fallback"></div>
                    )}
                  </Link>
                  
                  {/* Product Info */}
                  <div className="wishlist-item-info">
                    <div className="info-top-block">
                      <Link to={`/product/${targetId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 className="wishlist-item-name">{name}</h3>
                      </Link>
                      <p className="wishlist-item-desc">{description}</p>
                    </div>
                    
                    <div className="wishlist-card-bottom">
                      <span className="wishlist-item-price">${formatPrice(price)}</span>
                      <button 
                        className="wishlist-add-to-bag-btn" 
                        onClick={() => moveToBag(isObject ? item : { _id: targetId, id: targetId, name, price, image })}
                      >
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;