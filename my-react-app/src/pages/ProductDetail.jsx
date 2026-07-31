import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext"; 
import "./ProductDetail.css";

const FALLBACK_PRODUCTS = [
  {
    _id: "p1",
    id: "p1",
    name: "Moonlit Recovery Balm",
    category: "MOISTURIZERS",
    tagline: "Overnight barrier repair",
    price: 48.00,
    oldPrice: null,
    discountLabel: null,
    volume: "50ml",
    skinType: "Dry, Sensitive, Normal",
    stock: 10,
    image: "https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=700&auto=format&fit=crop",
    description: "A silken ceramide balm formulated with fermented ginseng and cold-pressed camellia oil. Melts into the skin overnight to restore the moisture barrier.",
    benefits: ["Restores moisture barrier", "Softens fine lines", "Wakes up plumper skin"],
    ingredients: "Water, Glycerin, Ceramide NP, Fermented Ginseng Root Extract, Camellia Japonica Seed Oil, Squalane.",
    howToUse: "Apply a pea-sized amount as the final step of your evening skincare routine."
  }
];

export const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("benefits");
  
  // 💱 State
  const [exchangeRate, setExchangeRate] = useState(278);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { products: liveProducts, loadingProducts, addToCart, toggleWishlist, wishlist } = useContext(AppContext);

  useEffect(() => {
    setQuantity(1);
    window.scrollTo(0, 0);
    
    // ✨ Fetch Live USD to PKR Rate
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.PKR) {
          setExchangeRate(data.rates.PKR);
        }
      })
      .catch(err => console.error("Exchange rate fetch failed, using fallback:", err));
  }, [id]);

  const sourceProducts = liveProducts && liveProducts.length > 0 ? liveProducts : FALLBACK_PRODUCTS;
  const rawProduct = sourceProducts.find((p) => String(p._id || p.id) === String(id)) || sourceProducts[0];

  const product = {
    _id: rawProduct._id || rawProduct.id,
    id: rawProduct._id || rawProduct.id,
    name: rawProduct.name || rawProduct.title || "Untitled Product",
    category: rawProduct.category || "SKINCARE",
    tagline: rawProduct.tagline || rawProduct.description?.slice(0, 40) || "Barrier repair formula",
    price: Number(rawProduct.price) || 0,
    oldPrice: rawProduct.oldPrice ? Number(rawProduct.oldPrice) : null,
    discountLabel: rawProduct.discountLabel || (rawProduct.discount ? `${rawProduct.discount}` : null),
    volume: rawProduct.volume || "50ml",
    skinType: rawProduct.skinType || "All Skin Types",
    stock: rawProduct.stock !== undefined ? Number(rawProduct.stock) : 10,
    image: (Array.isArray(rawProduct.images) && rawProduct.images.length > 0 && rawProduct.images[0]) || rawProduct.image || "https://via.placeholder.com/700",
    description: rawProduct.description || "No description available for this product.",
    benefits: Array.isArray(rawProduct.benefits) && rawProduct.benefits.length > 0 
      ? rawProduct.benefits 
      : ["Dermatologist tested", "Hydrates deeply", "Clean ingredients"],
    ingredients: rawProduct.ingredients || "Water, Glycerin, Botanical Extracts, Hyaluronic Acid.",
    howToUse: rawProduct.howToUse || "Apply evenly to clean skin morning and night."
  };

  const isOutOfStock = product.stock <= 0;

  // 🟢 Recommendation Logic
  const recommendedProducts = useMemo(() => {
    if (!sourceProducts || sourceProducts.length === 0) return [];
    const currentId = String(product._id);
    const currentCat = (product.category || "").trim().toLowerCase();

    const sameCategory = sourceProducts.filter((p) => {
      const pId = String(p._id || p.id);
      const pCat = (p.category || "").trim().toLowerCase();
      return pId !== currentId && pCat === currentCat && pCat !== "";
    });

    const otherProducts = sourceProducts.filter((p) => {
      const pId = String(p._id || p.id);
      const pCat = (p.category || "").trim().toLowerCase();
      return pId !== currentId && (pCat !== currentCat || pCat === "");
    });

    return [...sameCategory, ...otherProducts].slice(0, 8);
  }, [sourceProducts, product._id, product.category]);

  // ⏱️ Auto Slide every 5s
  useEffect(() => {
    if (recommendedProducts.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % recommendedProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [recommendedProducts.length, isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % recommendedProducts.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + recommendedProducts.length) % recommendedProducts.length);
  };

  const isWishlisted = wishlist ? wishlist.some((item) => String(item._id || item.id) === String(product._id)) : false;

  if (loadingProducts) {
    return (
      <div className="product-detail-page-wrapper" style={{ padding: "100px 20px", textAlign: "center" }}>
        <h2>Loading Product Details...</h2>
      </div>
    );
  }

  return (
    <div className="product-detail-page-wrapper">
      <nav className="p-detail-breadcrumb">
        <Link to="/">HOME</Link> <span className="bc-divider">/</span> 
        <Link to="/shop">SHOP</Link> <span className="bc-divider">/</span> 
        <span className="bc-current">{product.name.toUpperCase()}</span>
      </nav>

      <div className="p-detail-main-layout">
        <div className="p-detail-image-block">
          <div className="p-detail-img-container">
            <img 
              src={product.image} 
              alt={product.name} 
              className="p-detail-hero-img" 
              style={isOutOfStock ? { opacity: 0.7 } : {}}
            />
          </div>
        </div>

        <div className="p-detail-info-block">
          <span className="p-info-mini-category">{product.category.toUpperCase()}</span>
          <h1 className="p-info-main-title">{product.name}</h1>
          <p className="p-info-tagline">{product.tagline}</p>
          
          <div className="p-info-price-wrapper">
            <span className="p-info-current-price">
              ${product.price.toFixed(2)} <span style={{fontSize: "0.75em", color: "#666", fontWeight: "normal"}}>(PKR {(product.price * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 0})})</span>
            </span>
            {product.oldPrice && (
              <>
                <span className="p-info-old-price">${product.oldPrice.toFixed(2)}</span>
                {product.discountLabel && <span className="p-info-discount-badge">{product.discountLabel}</span>}
              </>
            )}

            {isOutOfStock && (
              <span style={{ color: "#d9534f", fontWeight: "bold", fontSize: "0.85rem", marginLeft: "10px", textTransform: "uppercase" }}>
                (Out of Stock)
              </span>
            )}
          </div>
          
          <div className="p-info-description-box">
            <p>{product.description}</p>
          </div>

          <div className="p-info-specs-row">
            <div className="spec-col">
              <span className="spec-heading-label">VOLUME</span>
              <p className="spec-heading-value">{product.volume}</p>
            </div>
            <div className="spec-col">
              <span className="spec-heading-label">FOR</span>
              <p className="spec-heading-value">{product.skinType}</p>
            </div>
          </div>

          <div className="p-info-action-row">
            <div className="p-quantity-counter" style={isOutOfStock ? { opacity: 0.5, pointerEvents: "none" } : {}}>
              <button className="q-btn" disabled={isOutOfStock} onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>-</button>
              <span className="q-display">{quantity}</span>
              <button className="q-btn" disabled={isOutOfStock} onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>

            <button 
              className="p-primary-add-bag-btn" 
              disabled={isOutOfStock}
              style={isOutOfStock ? { backgroundColor: "#888888", cursor: "not-allowed", opacity: 0.7 } : {}}
              onClick={() => !isOutOfStock && addToCart(product, quantity)}
            >
              {isOutOfStock 
                ? "OUT OF STOCK" 
                : `ADD TO BAG · $${(product.price * quantity).toFixed(2)} / PKR ${((product.price * quantity) * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 0})}`
              }
            </button>

            <button className={`p-minimal-wishlist-btn ${isWishlisted ? "wishlisted-active" : ""}`} onClick={() => toggleWishlist(product)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill={isWishlisted ? "#111" : "none"} stroke="currentColor" strokeWidth="1.2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>

          <div className="p-detail-trust-markers">
            <div className="marker-item">FREE SHIP $60+</div>
            <div className="marker-item">30-DAY RETURNS</div>
            <div className="marker-item">AUTHENTIC</div>
          </div>

          <div className="p-detail-accordion-tabs">
            <div className="p-tabs-nav">
              <button className={`p-tab-trigger ${activeTab === "benefits" ? "active" : ""}`} onClick={() => setActiveTab("benefits")}>BENEFITS</button>
              <button className={`p-tab-trigger ${activeTab === "ingredients" ? "active" : ""}`} onClick={() => setActiveTab("ingredients")}>INGREDIENTS</button>
              <button className={`p-tab-trigger ${activeTab === "howToUse" ? "active" : ""}`} onClick={() => setActiveTab("howToUse")}>HOW TO USE</button>
            </div>
            <div className="p-tabs-display-content">
              {activeTab === "benefits" && (
                <ul className="p-benefits-bullets-list">
                  {product.benefits.map((benefit, i) => (
                    <li key={i}><span className="bullet-dash">&mdash;</span> {benefit}</li>
                  ))}
                </ul>
              )}
              {activeTab === "ingredients" && <p className="p-tab-prose-text">{product.ingredients}</p>}
              {activeTab === "howToUse" && <p className="p-tab-prose-text">{product.howToUse}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 3D INFINITE CAROUSEL (Zero Space - Perfectly Centered) */}
      <section className="p-detail-recommendations-section">
        <h2 className="p-rec-main-heading">You may also love</h2>
        
        <div 
          className="p-3d-stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {recommendedProducts.map((recProd, index) => {
            const total = recommendedProducts.length;
            
            // 🔄 Infinite Circular Offset Math (Fixes left empty space completely)
            let offset = (index - activeIndex + total) % total;
            if (offset > total / 2) {
              offset -= total;
            }

            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            const recId = recProd._id || recProd.id;
            const recName = recProd.name || recProd.title || "Product";
            const recImage = (Array.isArray(recProd.images) && recProd.images.length > 0 && recProd.images[0]) || recProd.image || "https://via.placeholder.com/500?text=Product";
            const recPrice = Number(recProd.price) || 0;
            const tagBadge = recProd.tag || (Array.isArray(recProd.badges) ? recProd.badges[0] : recProd.badges);
            const discountBadge = recProd.discount ? `-${recProd.discount}%` : recProd.discountLabel;

            return (
              <div 
                key={recId} 
                className={`p-3d-card-wrapper ${isCenter ? "is-center" : ""}`}
                style={{
                  "--offset": offset,
                  "--abs-offset": absOffset
                }}
                onClick={() => setActiveIndex(index)}
              >
                <Link to={`/product/${recId}`} className="p-3d-item-card">
                  <div className="p-3d-card-media">
                    {tagBadge && <span className="p-rec-tag-badge">{tagBadge}</span>}
                    {discountBadge && <span className="p-rec-discount-badge">{discountBadge}</span>}
                    
                    <img 
                      src={recImage} 
                      alt={recName} 
                      className={`p-3d-img ${isCenter ? "animated-pulse-zoom" : ""}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/500?text=No+Image";
                      }}
                    />
                    <div className="p-3d-card-overlay">
                      <h4 className="p-3d-card-title">{recName}</h4>
                      <p className="p-3d-card-price">
                        ${recPrice.toFixed(2)} <span className="p-rec-pkr">/ PKR {(recPrice * exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* ↔️ Arrow Controls */}
        <div className="p-rec-slider-controls">
          <button className="p-rec-nav-arrow" onClick={handlePrev}>&#10094;</button>
          <button className="p-rec-nav-arrow" onClick={handleNext}>&#10095;</button>
        </div>
      </section>
    </div>
  );
};