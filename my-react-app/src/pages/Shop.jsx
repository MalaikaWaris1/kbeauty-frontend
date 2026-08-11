// src/pages/Shop.jsx
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Helmet } from "react-helmet-async"; // 🟢 1. HELMET IMPORT KIYA
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
  
  const { products: liveProducts, loadingProducts, wishlist, toggleWishlist } = useContext(AppContext);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  
  const [exchangeRate, setExchangeRate] = useState(278);

  const activeCategory = searchParams.get("category") || "All";
  const sourceProducts = liveProducts && liveProducts.length > 0 ? liveProducts : FALLBACK_PRODUCTS;

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

 // ✨ UPDATE: Discount calculate karne ka logic PKR ke hisaab se update karein
  const getDiscountPercentage = (product) => {
    if (product.discount !== undefined && product.discount !== null) {
      const parsed = parseFloat(String(product.discount).replace(/[^0-9.]/g, ""));
      if (!isNaN(parsed) && parsed > 0) return Math.round(parsed);
    }
    
    // PKR base calculation
    const currentPKR = product.pricePKR ? Number(product.pricePKR) : Number(product.price || 0) * 278;
    const oldPKR = product.originalPricePKR ? Number(product.originalPricePKR) : (Number(product.originalPrice || product.oldPrice) || 0) * 278;
    
    if (oldPKR > currentPKR && currentPKR > 0) {
      return Math.round(((oldPKR - currentPKR) / oldPKR) * 100);
    }
    return 0;
  };

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

  // ✨ CATEGORY CLEANING LOGIC (Shows only text before '/' in sidebar list)
  const categories = useMemo(() => {
    const uniqueMap = new Map();
    uniqueMap.set("all", "All");
    sourceProducts.forEach((product) => {
      if (product.category && typeof product.category === "string" && product.category.trim() !== "") {
        const originalCat = product.category.trim();
        // '/' se pehle wala hissa alag karna (jaise "Skincare / Anti-Acne" -> "Skincare")
        const cleanCat = originalCat.split('/')[0].trim();
        const lowerCat = cleanCat.toLowerCase();
        if (!uniqueMap.has(lowerCat)) {
          const formattedCat = cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1);
          uniqueMap.set(lowerCat, formattedCat);
        }
      }
    });
    return Array.from(uniqueMap.values());
  }, [sourceProducts]);

  useEffect(() => {
    let result = [...sourceProducts];

    // 1. Sidebar Category Filter (Matches prefix or exact category)
    if (activeCategory.toLowerCase() !== "all") {
      result = result.filter(p => {
        const cat = p.category || "";
        const mainCat = cat.split('/')[0].trim().toLowerCase();
        return mainCat === activeCategory.trim().toLowerCase() || cat.trim().toLowerCase() === activeCategory.trim().toLowerCase();
      });
    }

    // 2. Search Logic
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
      
      {/* 🟢 2. SEO & CANONICAL TAG YAHAN ADD KIYA HAI */}
      <Helmet>
        <title>Shop Authentic Korean Skincare | KoreanProductsby_sunny</title>
        <meta name="description" content="Browse our complete collection of authentic Korean beauty and skincare products. Fast delivery in Pakistan." />
        <link rel="canonical" href="https://www.koreanproducts.org/shop" />
      </Helmet>
      {/* 🟢 BAKI KUCH NAHI CHERA */}

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
              // ⬇️ MAIN FIX: Jaha map chala rahe hain (Render Products) waha ye update karein ⬇️
  {filteredProducts.map((product) => {
    const productId = product._id || product.id;
    const productName = product.name || product.title || "Product";
    const productImage = (product.images && product.images.length > 0 && product.images[0]) || product.image || "https://via.placeholder.com/500";
    
    // ✨ FIX: Base price ab PKR hai (Admin wali value hilegi nahi)
    const fixedPKR = product.pricePKR ? Number(product.pricePKR) : (Number(product.price) || 0) * 278;
    const fixedOldPKR = product.originalPricePKR ? Number(product.originalPricePKR) : (product.originalPrice || product.oldPrice ? Number(product.originalPrice || product.oldPrice) * 278 : null);
    
    // ✨ FIX: USD dynamically generate hoga taa-ke exchange rate se sirf USD change ho
    const dynamicUSD = exchangeRate > 0 ? (fixedPKR / exchangeRate) : (Number(product.price) || 0);
    const dynamicOldUSD = fixedOldPKR && exchangeRate > 0 ? (fixedOldPKR / exchangeRate) : (product.originalPrice ? Number(product.originalPrice) : null);

    const productBadges = getProductBadges(product);
    const isOutOfStock = product.stock !== undefined && Number(product.stock) <= 0;
    
    const discountPercent = getDiscountPercentage(product);
    const isWishlisted = wishlist ? wishlist.some((item) => String(item._id || item.id) === String(productId)) : false;

    return (
      <Link 
        to={`/product/${productId}`} 
        key={productId} 
        className="shop-product-card group" 
      >
        {/* ... (Image aur Badges wala code bilkul same rahega) ... */}

        <div className="product-card-details">
          <div className="prod-title-row">
            <h3 className="prod-title-name">{productName}</h3>
            
            {/* ✨ FIX: Rendering values */}
            <div className="prod-price-box">
              {dynamicOldUSD && <span className="old-price">${dynamicOldUSD.toFixed(2)}</span>}
              <span className="current-price" style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                {/* Dynamically calculated USD */}
                <span>${dynamicUSD.toFixed(2)}</span> 
                {/* Fixed PKR from Admin */}
                <span style={{fontSize: "0.75em", color: "#888"}}>
                  PKR {fixedPKR.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </span>
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


