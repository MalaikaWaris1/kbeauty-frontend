import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Helmet } from "react-helmet-async"; // 🟢 SEO HELMET IMPORT KIYA
import "./ProductDetail.css";

const FALLBACK_PRODUCTS = [
  {
    _id: "p1",
    id: "p1",
    name: "Moonlit Recovery Balm",
    category: "MOISTURIZERS",
    tagline: "Overnight barrier repair",
    price: 48.00,
    pricePKR: 13344,
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("benefits");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(278);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { products: liveProducts, loadingProducts, addToCart, toggleWishlist, wishlist } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  // ✨ FIX: MAIN PRODUCT PRICING LOGIC (PKR Base, USD Dynamic)
  const fixedPKR = rawProduct.pricePKR ? Number(rawProduct.pricePKR) : (Number(rawProduct.price) || 0) * 278;
  const fixedOldPKR = rawProduct.originalPricePKR ? Number(rawProduct.originalPricePKR) : (rawProduct.originalPrice || rawProduct.oldPrice ? Number(rawProduct.originalPrice || rawProduct.oldPrice) * 278 : null);

  const dynamicUSD = exchangeRate > 0 ? (fixedPKR / exchangeRate) : (Number(rawProduct.price) || 0);
  const dynamicOldUSD = fixedOldPKR && exchangeRate > 0 ? (fixedOldPKR / exchangeRate) : (rawProduct.originalPrice || rawProduct.oldPrice ? Number(rawProduct.originalPrice || rawProduct.oldPrice) : null);

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

  // 🔄 Carousel Controls
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % recommendedProducts.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + recommendedProducts.length) % recommendedProducts.length);
  };

  const processBuyNow = (mode) => {
    localStorage.setItem("checkoutMode", mode);
    localStorage.setItem("buyNowProduct", JSON.stringify(product));
    localStorage.setItem("buyNowQuantity", "1");
    setShowPaymentModal(false);

    if (mode === "online") {
      navigate("/payment-instructions");
    } else {
      navigate("/checkout");
    }
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

      {/* 🟢 DYNAMIC SEO TAGS (Google ab har product ko pehchanega) */}
      <Helmet>
        <title>{product.name} - Buy Original in Pakistan</title>
        <meta name="description" content={product.tagline || product.description.substring(0, 150)} />
        <link rel="canonical" href={`https://www.koreanproducts.org/product/${product._id}`} />

        {/* 👇 Google ke liye Structured Data (Product Schema) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.image,
            "description": product.description,
            "sku": product._id,
            "brand": {
              "@type": "Brand",
              "name": "KoreanProductsBy_Sunny"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://www.koreanproducts.org/product/${product._id}`,
              "priceCurrency": "PKR",
              "price": fixedPKR,
              "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
      {/* 🟢 END OF SEO TAGS */}

      <nav className="p-detail-breadcrumb">
        <Link to="/">HOME</Link> <span className="bc-divider">/</span>
        <Link to="/shop">SHOP</Link> <span className="bc-divider">/</span>
        <span className="bc-current">{product.name.toUpperCase()}</span>
      </nav>

      <div className="p-detail-main-layout">
        {/* Left Image Section */}
        <div className="p-detail-image-block">
          <div className="p-detail-img-container">
            <img src={product.image} alt={product.name} className="p-detail-hero-img" style={isOutOfStock ? { opacity: 0.7 } : {}} />
          </div>
        </div>

        {/* Right Info Section */}
        <div className="p-detail-info-block">
          <span className="p-info-mini-category">{product.category.toUpperCase()}</span>
          <h1 className="p-info-main-title">{product.name}</h1>
          <p className="p-info-tagline">{product.tagline}</p>

          <div className="p-info-price-wrapper">
            <span className="p-info-current-price">
              {/* ✨ FIX: Render Dynamic USD and Fixed PKR */}
              ${dynamicUSD.toFixed(2)} <span style={{ fontSize: "0.75em", color: "#666", fontWeight: "normal" }}>(PKR {fixedPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
            </span>
            {dynamicOldUSD && (
              <>
                <span className="p-info-old-price">${dynamicOldUSD.toFixed(2)}</span>
                {product.discountLabel && <span className="p-info-discount-badge">{product.discountLabel}</span>}
              </>
            )}
            {isOutOfStock && <span style={{ color: "#d9534f", fontWeight: "bold", fontSize: "0.85rem", marginLeft: "10px", textTransform: "uppercase" }}>(Out of Stock)</span>}
          </div>

          <div className="p-info-description-box"><p>{product.description}</p></div>

          <div className="p-info-specs-row">
            <div className="spec-col"><span className="spec-heading-label">VOLUME</span><p className="spec-heading-value">{product.volume}</p></div>
            <div className="spec-col"><span className="spec-heading-label">FOR</span><p className="spec-heading-value">{product.skinType}</p></div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="p-info-action-row" style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "25px" }}>
            <button
              className="p-primary-buy-now-btn"
              disabled={isOutOfStock}
              style={{
                flex: "1", padding: "16px", backgroundColor: isOutOfStock ? "#888" : "#000", color: "#fff", border: "none", fontWeight: "600", letterSpacing: "1px", cursor: isOutOfStock ? "not-allowed" : "pointer", transition: "all 0.3s ease", opacity: isOutOfStock ? 0.7 : 1
              }}
              onClick={() => setShowPaymentModal(true)}
            >
              {isOutOfStock ? "OUT OF STOCK" : "BUY NOW"}
            </button>

            <button
              className="p-secondary-add-bag-btn"
              disabled={isOutOfStock}
              style={{
                flex: "1", padding: "15px", backgroundColor: "transparent", color: isOutOfStock ? "#888" : "#000", border: isOutOfStock ? "1px solid #888" : "1px solid #000", fontWeight: "600", letterSpacing: "1px", cursor: isOutOfStock ? "not-allowed" : "pointer", transition: "all 0.3s ease", opacity: isOutOfStock ? 0.7 : 1
              }}
              onClick={() => !isOutOfStock && addToCart(product, 1)}
            >
              ADD TO BAG
            </button>

            <button
              className={`p-minimal-wishlist-btn ${isWishlisted ? "wishlisted-active" : ""}`}
              onClick={() => toggleWishlist(product)}
              style={{ padding: "14px", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", cursor: "pointer" }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill={isWishlisted ? "#111" : "none"} stroke="currentColor" strokeWidth="1.2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          {/* 🏷️ BENEFITS / INGREDIENTS / HOW TO USE TABS */}
          <div className="p-detail-tabs-container" style={{ marginTop: "40px", borderTop: "1px solid #f0f0f0", paddingTop: "20px" }}>
            {/* Tab Headers */}
            <div style={{ display: "flex", gap: "32px", borderBottom: "1px solid #eee", paddingBottom: "12px", marginBottom: "24px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("benefits")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  letterSpacing: "1.2px",
                  color: activeTab === "benefits" ? "#111" : "#888",
                  borderBottom: activeTab === "benefits" ? "2px solid #111" : "2px solid transparent",
                  paddingBottom: "12px",
                  marginBottom: "-13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                BENEFITS
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ingredients")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  letterSpacing: "1.2px",
                  color: activeTab === "ingredients" ? "#111" : "#888",
                  borderBottom: activeTab === "ingredients" ? "2px solid #111" : "2px solid transparent",
                  paddingBottom: "12px",
                  marginBottom: "-13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                INGREDIENTS
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("howToUse")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  letterSpacing: "1.2px",
                  color: activeTab === "howToUse" ? "#111" : "#888",
                  borderBottom: activeTab === "howToUse" ? "2px solid #111" : "2px solid transparent",
                  paddingBottom: "12px",
                  marginBottom: "-13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                HOW TO USE
              </button>
            </div>

            {/* Tab Body Contents */}
            <div className="p-tab-content-body">
              {activeTab === "benefits" && (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {Array.isArray(product.benefits) ? (
                    product.benefits.map((item, index) => (
                      <li key={index} style={{ display: "flex", alignItems: "baseline", gap: "12px", color: "#333", fontSize: "0.95rem", marginBottom: "14px", lineHeight: "1.6" }}>
                        <span style={{ color: "#666", fontWeight: "300" }}>—</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li style={{ display: "flex", alignItems: "baseline", gap: "12px", color: "#333", fontSize: "0.95rem" }}>
                      <span style={{ color: "#666" }}>—</span>
                      <span>{product.benefits}</span>
                    </li>
                  )}
                </ul>
              )}

              {activeTab === "ingredients" && (
                <p style={{ color: "#444", fontSize: "0.92rem", lineHeight: "1.7", margin: 0 }}>
                  {product.ingredients}
                </p>
              )}

              {activeTab === "howToUse" && (
                <p style={{ color: "#444", fontSize: "0.92rem", lineHeight: "1.7", margin: 0 }}>
                  {product.howToUse}
                </p>
              )}
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

            // ✨ FIX: RECOMMENDED CAROUSEL PRICING LOGIC
            const fixedRecPKR = recProd.pricePKR ? Number(recProd.pricePKR) : (Number(recProd.price) || 0) * 278;
            const dynamicRecUSD = exchangeRate > 0 ? (fixedRecPKR / exchangeRate) : (Number(recProd.price) || 0);

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
                        {/* ✨ FIX: Render Dynamic USD and Fixed PKR for Carousel */}
                        ${dynamicRecUSD.toFixed(2)} <span className="p-rec-pkr">/ PKR {fixedRecPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
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

      {/* 💳 PAYMENT MODAL OVERLAY */}
      {showPaymentModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "12px", maxWidth: "420px", width: "90%", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.5rem", fontWeight: "600", color: "#111" }}>Complete Your Purchase</h3>
            <p style={{ margin: "0 0 30px 0", color: "#666", fontSize: "0.95rem" }}>Please select your preferred payment method for <strong>{product.name}</strong>.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <button
                onClick={() => processBuyNow("online")}
                style={{ padding: "16px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "500", cursor: "pointer", transition: "0.2s" }}
              >
                💳 Pay Online (Card / Wallet)
              </button>

              <button
                onClick={() => processBuyNow("cod")}
                style={{ padding: "16px", backgroundColor: "#fff", color: "#000", border: "2px solid #000", borderRadius: "8px", fontSize: "1rem", fontWeight: "500", cursor: "pointer", transition: "0.2s" }}
              >
                📦 Cash on Delivery (COD)
              </button>
            </div>

            <button onClick={() => setShowPaymentModal(false)} style={{ marginTop: "25px", background: "none", border: "none", color: "#888", fontSize: "0.9rem", textDecoration: "underline", cursor: "pointer" }}>Cancel & Return to Product</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;