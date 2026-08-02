// src/pages/Shop.jsx
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "./Shop.css";

const FALLBACK_PRODUCTS = [
  {
    id: "p1",
    name: "Moonlit Recovery Balm",
    category: "Moisturizers",
    price: 48.00,
    description: "Overnight barrier repair",
    image: "https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=500&auto=format&fit=crop",
    tag: "NEW",
    discount: null,
    stock: 5
  },
  {
    id: "p2",
    name: "Glow Infusion Essence",
    category: "Essence",
    price: 36.00,
    oldPrice: 42.00,
    description: "Fermented botanical complex",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=500&auto=format&fit=crop",
    tag: "BEST SELLER",
    discount: "-14%",
    stock: 0
  }
];

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 🟢 FIXED: Extracted wishlist and toggleWishlist from Context
  const { products: liveProducts, loadingProducts, wishlist, toggleWishlist } = useContext(AppContext);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  
  // 💱 Exchange Rate State
  const [exchangeRate, setExchangeRate] = useState(278);

  const activeCategory = searchParams.get("category") || "All";
  const sourceProducts = liveProducts && liveProducts.length > 0 ? liveProducts : FALLBACK_PRODUCTS;

  // ✨ Fetch Exchange Rate 
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

  // 🏷️ Dynamic Helper for Extracting Discount %
  const getDiscountPercentage = (product) => {
    if (product.discount !== undefined && product.discount !== null) {
      const parsed = parseFloat(String(product.discount).replace(/[^0-9.]/g, ""));
      if (!isNaN(parsed) && parsed > 0) return Math.round(parsed);
    }
    const currentPrice = Number(product.price) || 0;
    const oldPrice = Number(product.originalPrice || product.oldPrice) || 0;
    if (oldPrice > currentPrice && currentPrice > 0) {
      return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
    }
    return 0;
  };

  // 📦 Stock condition handle karke badges filter karna
  const getProductBadges = (product) => {
    let list = [];

    if (product.stock !== undefined && Number(product.stock) <= 0) {
      list.push("OUT OF STOCK");
    }

    if (Array.isArray(product.badges) && product.badges.length > 0) {
      list = list.concat(product.badges.map((b) => String(b).trim()).filter(Boolean));
    } else if (typeof product.badges === "string" && product.badges.trim() !== "") {
      list = list.concat(product.badges.split(",").map((b) => b.trim()).filter(Boolean));
    } else if (product.tag) {
      list.push(product.tag);
    }

    if (list.length === 0 || (list.length === 1 && list[0] === "OUT OF STOCK")) {
      if (product.isNew) list.push("NEW");
      if (product.isBestSeller) list.push("BEST SELLER");
    }
    return list;
  };

  const categories = useMemo(() => {
    const uniqueMap = new Map();
    uniqueMap.set("all", "All");
    sourceProducts.forEach((product) => {
      if (product.category && typeof product.category === "string" && product.category.trim() !== "") {
        const cleanCat = product.category.trim();
        const lowerCat = cleanCat.toLowerCase();
        if (!uniqueMap.has(lowerCat)) {
          const formattedCat = cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1);
          uniqueMap.set(lowerCat, formattedCat);
        }
      }
    });
    return Array.from(uniqueMap.values());
  }, [sourceProducts]);

  // 🔍 Enhanced Search & Filter Logic
  useEffect(() => {
    let result = [...sourceProducts];

    // 1. Sidebar Category Filter
    if (activeCategory.toLowerCase() !== "all") {
      result = result.filter(p => {
        const cat = p.category || "";
        return cat.trim().toLowerCase() === activeCategory.trim().toLowerCase();
      });
    }

    // 2. Multi-field Case-insensitive Search (Name, Category, Description, Tags)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(p => {
        const name = String(p.name || p.title || "").toLowerCase();
        const category = String(p.category || "").toLowerCase();
        const description = String(p.description || "").toLowerCase();
        const tag = String(p.tag || "").toLowerCase();
        const badges = Array.isArray(p.badges) 
          ? p.badges.join(" ").toLowerCase() 
          : String(p.badges || "").toLowerCase();

        return (
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query) ||
          tag.includes(query) ||
          badges.includes(query)
        );
      });
    }

    // 3. Sort Logic
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    setFilteredProducts(result);
  }, [activeCategory, searchQuery, sortBy, sourceProducts]);

  const handleCategoryChange = (category) => {
    if (category.toLowerCase() === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="shop-page-container">
      <div className="shop-header-intro">
        <span className="shop-subtitle-tag">THE COLLECTION</span>
        <h1 className="shop-main-title">Shop all</h1>
        <p className="shop-intro-description">
          Barrier-first Korean skincare, made in small batches. Every product is 
          formulated with fermented actives and clean, transparent ingredients.
        </p>
      </div>

      <div className="shop-layout-body">
        <aside className="shop-sidebar-filters">
          <div className="filter-group">
            <label className="filter-label">SEARCH</label>
            <input 
              type="text" 
              placeholder="Search products, categories..." 
              className="search-input-box"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">CATEGORY</label>
            <ul className="category-filter-list">
              {categories.map((cat) => (
                <li 
                  key={cat} 
                  className={`category-item ${activeCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <label className="filter-label">SORT</label>
            <select 
              className="sort-dropdown" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </aside>

        <main className="shop-products-grid-view">
          <div className="products-count-bar">
            <span>{filteredProducts.length} products</span>
          </div>

          {loadingProducts && (
            <div className="loading-spinner-box" style={{ padding: "40px", textAlign: "center" }}>
              <p>Loading live catalog...</p>
            </div>
          )}

          {!loadingProducts && (
            <div className="shop-products-grid">
              {filteredProducts.map((product) => {
                const productId = product._id || product.id;
                const productName = product.name || product.title || "Product";
                const productImage = (product.images && product.images.length > 0 && product.images[0]) || product.image || "https://via.placeholder.com/500";
                const productPrice = Number(product.price) || 0;
                const productOldPrice = product.originalPrice || product.oldPrice ? Number(product.originalPrice || product.oldPrice) : null;
                const productBadges = getProductBadges(product);
                const isOutOfStock = product.stock !== undefined && Number(product.stock) <= 0;
                
                const discountPercent = getDiscountPercentage(product);

                // 🟢 NEW: Check if this specific product is in the wishlist
                const isWishlisted = wishlist ? wishlist.some((item) => String(item._id || item.id) === String(productId)) : false;

                return (
                  <Link 
                    to={`/product/${productId}`} 
                    key={productId} 
                    className="shop-product-card group" 
                  >
                    <div className="product-card-media" style={{ position: "relative" }}>
                      
                      <div 
                        className="badges-wrapper"
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: "6px",
                          zIndex: 5
                        }}
                      >
                        {productBadges.map((badge, index) => (
                          <span 
                            key={index} 
                            className="badge-text tag-badge"
                            style={{
                              position: "static",
                              backgroundColor: badge === "OUT OF STOCK" ? "#d9534f" : undefined,
                              color: badge === "OUT OF STOCK" ? "#ffffff" : undefined,
                              display: "inline-block"
                            }}
                          >
                            {badge}
                          </span>
                        ))}

                        {discountPercent > 0 && (
                          <span 
                            className="badge-text discount-badge"
                            style={{
                              position: "static",
                              backgroundColor: "#e53e3e",
                              color: "#ffffff",
                              fontWeight: "bold",
                              display: "inline-block"
                            }}
                          >
                            -{discountPercent}% off
                          </span>
                        )}
                      </div>

                      {/* 💖 WISHLIST BUTTON (Heart Icon) */}
                      {/* 💖 WISHLIST BUTTON (Bottom-Right & Show on Hover) */}
                      <button
                        className="wishlist-hover-btn"
                        onClick={(e) => {
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          if (toggleWishlist) toggleWishlist(product);
                        }}
                        style={{
                          position: "absolute",
                          bottom: "10px", // 👈 Bottom right corner
                          right: "10px",
                          top: "auto",
                          zIndex: 10,
                          backgroundColor: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          transition: "all 0.25s ease",
                          // 👇 Agar pehle se wishlisted hai toh show ho, warna hide rahe
                          opacity: isWishlisted ? 1 : 0,
                          pointerEvents: isWishlisted ? "auto" : "none",
                          transform: isWishlisted ? "scale(1)" : "scale(0.8)"
                        }}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <svg 
                          viewBox="0 0 24 24" 
                          width="18" 
                          height="18" 
                          fill={isWishlisted ? "#e53e3e" : "none"} 
                          stroke={isWishlisted ? "#e53e3e" : "#111"} 
                          strokeWidth="1.5"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>

                      <img 
                        src={productImage} 
                        alt={productName} 
                        className="shop-prod-img"
                        style={isOutOfStock ? { opacity: 0.65 } : {}}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/500?text=No+Image";
                        }} 
                      />
                    </div>

                    <div className="product-card-details">
                      <div className="prod-title-row">
                        <h3 className="prod-title-name">{productName}</h3>
                        <div className="prod-price-box">
                          {productOldPrice && <span className="old-price">${productOldPrice.toFixed(2)}</span>}
                          <span className="current-price" style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                            <span>${productPrice.toFixed(2)}</span>
                            <span style={{fontSize: "0.75em", color: "#888"}}>PKR {(productPrice * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                          </span>
                        </div>
                      </div>
                      <p className="prod-short-desc">{product.description}</p>
                    </div>
                  </Link>
                );
              })}
              
              {filteredProducts.length === 0 && (
                <p className="no-products-msg">No products found matching the criteria.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};