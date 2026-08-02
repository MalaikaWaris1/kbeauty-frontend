import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; 
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

  useEffect(() => {
    if (recommendedProducts.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % recommendedProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [recommendedProducts.length, isPaused]);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % recommendedProducts.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + recommendedProducts.length) % recommendedProducts.length);

  // 🟢 👈 UPDATED: Buy Now Logic (Bypasses Cart)
  const processBuyNow = (mode) => {
    localStorage.setItem("checkoutMode", mode);
    // Product ko local storage mein save karein (bina global cart ke)
    localStorage.setItem("buyNowProduct", JSON.stringify(product));
    localStorage.setItem("buyNowQuantity", "1"); // Default 1
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
      <div className="product-detail-page-wrapper" style={{ padding: "100px 20px", textAlign: "center" }}><h2>Loading Product Details...</h2></div>
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
            <img src={product.image} alt={product.name} className="p-detail-hero-img" style={isOutOfStock ? { opacity: 0.7 } : {}} />
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
            {isOutOfStock && <span style={{ color: "#d9534f", fontWeight: "bold", fontSize: "0.85rem", marginLeft: "10px", textTransform: "uppercase" }}>(Out of Stock)</span>}
          </div>
          
          <div className="p-info-description-box"><p>{product.description}</p></div>

          <div className="p-info-specs-row">
            <div className="spec-col"><span className="spec-heading-label">VOLUME</span><p className="spec-heading-value">{product.volume}</p></div>
            <div className="spec-col"><span className="spec-heading-label">FOR</span><p className="spec-heading-value">{product.skinType}</p></div>
          </div>

          <div className="p-info-action-row" style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "25px" }}>
            
            {/* BUY NOW BUTTON */}
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

            {/* ADD TO BAG BUTTON */}
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

            {/* WISHLIST BUTTON */}
            <button 
              className={`p-minimal-wishlist-btn ${isWishlisted ? "wishlisted-active" : ""}`} 
              onClick={() => toggleWishlist(product)}
              style={{ padding: "14px", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", cursor: "pointer" }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill={isWishlisted ? "#111" : "none"} stroke="currentColor" strokeWidth="1.2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>

          {/* ... TABS AND RECOMMENDATIONS (Unchanged for brevity) ... */}
        </div>
      </div>
      
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