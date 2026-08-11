// src/components/sections/CommunityFavourites.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppContext";
import "./CommunityFavourites.css";

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } 
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export const CommunityFavourites = () => {
  const { products, loadingProducts, addToCart } = useContext(AppContext);
  
  // 🟢 Hide / Unhide State
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // 🟢 Exchange Rate State
  const [exchangeRate, setExchangeRate] = useState(278);

  // Fetch Exchange Rate on Mount
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.PKR) {
          setExchangeRate(data.rates.PKR);
        }
      })
      .catch(err => console.error("Exchange rate fetch failed, using fallback:", err));
  }, []);

  // Filter: Best Seller or Featured Products
  const bestSellers = products?.filter(
    (product) => product.isBestSeller === true || product.isFeatured === true
  ) || [];

  const handleQuickAdd = (product) => {
    if (addToCart) {
      addToCart(product, 1);
    }
  };

  if (loadingProducts) {
    return <div className="loading-spinner">Loading Best Sellers...</div>;
  }

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className="favourites-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="favourites-container">
        
        {/* 🟢 Header with Framer Motion Reveal */}
        <motion.div 
          className="favourites-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <div className="fav-header-left">
            <span className="fav-overline">COMMUNITY FAVOURITES</span>
            <h2 className="fav-heading">Best sellers</h2>
          </div>

          <motion.button 
            className="fav-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle Section Visibility"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>{isCollapsed ? "UNHIDE" : "HIDE"}</span>
            <svg 
              className={`toggle-icon ${!isCollapsed ? "rotated" : ""}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </motion.div>

        {/* 🟢 Grid with Framer Motion Staggered Card Reveals */}
        <motion.div 
          className={`fav-products-grid ${isCollapsed ? "is-collapsed" : "is-expanded"}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {bestSellers.map((product) => {
            const productId = product._id || product.id;
            
            // Images mapping
            const mainImg = product.images?.[0] || product.image;
            const textureImg = product.images?.[1] || product.textureImg || mainImg;
            
            // Badges mapping
            const badgeTag = "BEST SELLER";
            const discountTag = product.discountPercent ? `-${product.discountPercent}%` : product.discount;

            // Flexible review mapping
            const reviewText = 
              product.featuredReviewText || 
              product.featuredReview?.text || 
              product["featuredReview[text]"] || 
              product.reviewQuote || 
              product.review;

            const reviewAuthor = 
              product.featuredReviewAuthor || 
              product.featuredReview?.author || 
              product["featuredReview[author]"] || 
              product.reviewAuthor || 
              product.author;

            const ratingStars = Number(product.rating) || 5;

            // ✨ FIX: Base price PKR, Dynamic USD
            const fixedPKR = product.pricePKR ? Number(product.pricePKR) : (Number(product.price) || 0) * 278;
            const fixedOldPKR = product.originalPricePKR ? Number(product.originalPricePKR) : (product.originalPrice ? Number(product.originalPrice) * 278 : null);
            
            const dynamicUSD = exchangeRate > 0 ? (fixedPKR / exchangeRate) : (Number(product.price) || 0);
            const dynamicOldUSD = fixedOldPKR && exchangeRate > 0 ? (fixedOldPKR / exchangeRate) : (product.originalPrice ? Number(product.originalPrice) : null);

            return (
              <motion.div 
                key={productId} 
                className="fav-product-card"
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                
                <div className="fav-image-wrapper">
                  
                  {/* Badges Row */}
                  <div className="fav-badge-row">
                    {badgeTag && <span className="fav-status-badge">{badgeTag}</span>}
                    {discountTag && <span className="fav-discount-badge">{discountTag}</span>}
                  </div>

                  {/* Product Link and Images */}
                  <Link to={`/product/${productId}`}>
                    <img src={mainImg} alt={product.name} className="fav-img main-look" />
                    <img src={textureImg} alt={`${product.name} Texture`} className="fav-img texture-look" />
                  </Link>

                  {/* Review Overlay */}
                  {reviewText && (
                    <div className="fav-review-overlay">
                      <div className="stars-row">
                        {[...Array(ratingStars)].map((_, i) => (
                          <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="star-icon">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="overlay-quote">“{reviewText}”</p>
                      {reviewAuthor && <span className="overlay-author">— {reviewAuthor}</span>}
                    </div>
                  )}

                </div>

                {/* Info Wrapper */}
                <div className="fav-info-wrapper">
                  <Link to={`/product/${productId}`}>
                    <h3 className="fav-product-title">{product.name}</h3>
                  </Link>
                  
                  {/* ✨ FIX: Render Dynamic USD and Fixed PKR cleanly */}
                  <div className="fav-price-row" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                      <span className="current-price">${dynamicUSD.toFixed(2)}</span>
                      {dynamicOldUSD && (
                        <span className="old-price" style={{ textDecoration: "line-through", color: "#999", fontSize: "0.85em" }}>
                          ${dynamicOldUSD.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.8em", color: "#777" }}>
                      PKR {fixedPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  <motion.button 
                    onClick={() => handleQuickAdd(product)} 
                    className="fav-quick-add-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    QUICK ADD +
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </motion.section>
  );
};