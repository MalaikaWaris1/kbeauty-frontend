import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import API from "../api/axios";
import "./SaleArchive.css";

export const SaleArchive = () => {
  // 🎯 FIX: AppContext se exchangeRate aur currencySymbol nikal liya
  const { 
    saleData, 
    toggleWishlist, 
    wishlist = [], 
    addToCart,
    exchangeRate = 278,
    currencySymbol = "$"
  } = useContext(AppContext);
  
  const productsSectionRef = useRef(null);

  const [archiveProducts, setArchiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isAnimated, setIsAnimated] = useState(false);

  const isActive = saleData?.isActive ?? true;
  const endTime = saleData?.endTime;

  // 🌐 Fetch ALL Sale Products
  useEffect(() => {
    const fetchArchive = async () => {
      try {
        setLoading(true);
        const response = await API.get("/sale/archive");
        
        let fetchedData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.products || response.data?.data || [];

        // Fallback context array check
        if (fetchedData.length === 0 && saleData) {
          fetchedData = saleData.archiveProducts?.length > 0 
            ? saleData.archiveProducts 
            : saleData.featuredProducts || saleData.products || [];
        }

        setArchiveProducts(fetchedData);
      } catch (error) {
        console.error("Failed to load archive collection:", error);
        if (saleData) {
          const fallback = saleData.archiveProducts?.length > 0 
            ? saleData.archiveProducts 
            : saleData.featuredProducts || saleData.products || [];
          setArchiveProducts(fallback);
        } else {
          setArchiveProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArchive();
  }, [saleData]);

  // Timer Countdown Logic
  useEffect(() => {
    if (!endTime) return;

    const calculateTime = () => {
      const difference = +new Date(endTime) - +new Date();
      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    const animTimeout = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => {
      clearInterval(timer);
      clearTimeout(animTimeout);
    };
  }, [endTime]);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const getOffset = (value, max) => {
    if (!isAnimated) return circumference;
    const progress = value / max;
    return circumference - (progress * circumference);
  };

  const getProductImage = (prod) => {
    if (prod?.image) return prod.image;
    if (Array.isArray(prod?.images) && prod.images.length > 0) return prod.images[0];
    return "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop";
  };

  if (!loading && (!saleData || !isActive || archiveProducts.length === 0)) {
    return (
      <div className="no-sale-overlay">
        <div className="no-sale-modal">
          {/* Close Button */}
          <Link to="/" className="no-sale-close-btn">&times;</Link>
          
          {/* Left Beige Banner */}
          <div className="no-sale-left-panel">
            <h2>No Active<br />Sales</h2>
          </div>

          {/* Right Content Panel */}
          <div className="no-sale-right-panel">
            <h3>Stay Tuned!</h3>
            <p className="no-sale-subtext">
              There are currently no active flash sales or discounts.
            </p>
            <p className="no-sale-description">
              Our exclusive collections go on sale for very limited times. Please check back later or subscribe to our newsletter to be the first to know when the next sale drops.
            </p>
            <Link to="/shop" className="no-sale-shopping-btn">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sale-archive-page-wrapper">

      {/* HERO COUNTDOWN SECTION */}
      <section className="archive-hero-canvas">
        <div className="archive-hero-content">
          <span className="archive-mini-tagline">{saleData?.subtitle || "LIMITED TIME ARCHIVE"}</span>
          <h1 className="archive-main-title">{saleData?.title || "ARCHIVAL EDIT SALE"}</h1>
          <p className="archive-lead-text">
            {saleData?.description || "Up to 30% off the archival edit. Formulas we're retiring or refreshing — while stocks last."}
          </p>

          <div className="luxury-circular-countdown-grid">
            <div className="circle-node-wrapper">
              <div className="svg-ring-container">
                <svg width="100" height="100" className="progress-ring-svg">
                  <circle className="ring-track-bg" cx="50" cy="50" r={radius} />
                  <circle
                    className="ring-fill-bar"
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={getOffset(timeLeft.days, 60)}
                  />
                </svg>
                <span className="inner-counter-digits">
                  {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
                </span>
              </div>
              <span className="circle-node-label">DAYS</span>
            </div>

            <div className="circle-node-wrapper">
              <div className="svg-ring-container">
                <svg width="100" height="100" className="progress-ring-svg">
                  <circle className="ring-track-bg" cx="50" cy="50" r={radius} />
                  <circle
                    className="ring-fill-bar"
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={getOffset(timeLeft.hours, 24)}
                  />
                </svg>
                <span className="inner-counter-digits">
                  {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
                </span>
              </div>
              <span className="circle-node-label">HOURS</span>
            </div>

            <div className="circle-node-wrapper">
              <div className="svg-ring-container">
                <svg width="100" height="100" className="progress-ring-svg">
                  <circle className="ring-track-bg" cx="50" cy="50" r={radius} />
                  <circle
                    className="ring-fill-bar"
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={getOffset(timeLeft.minutes, 60)}
                  />
                </svg>
                <span className="inner-counter-digits">
                  {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
                </span>
              </div>
              <span className="circle-node-label">MINS</span>
            </div>

            <div className="circle-node-wrapper">
              <div className="svg-ring-container">
                <svg width="100" height="100" className="progress-ring-svg">
                  <circle className="ring-track-bg" cx="50" cy="50" r={radius} />
                  <circle
                    className="ring-fill-bar"
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={getOffset(timeLeft.seconds, 60)}
                  />
                </svg>
                <span className="inner-counter-digits">
                  {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                </span>
              </div>
              <span className="circle-node-label">SECS</span>
            </div>
          </div>

          <Link to="/shop" className="archive-hero-action-btn">
            SHOP THE COLLECTION
          </Link>
        </div>
      </section>

      {/* ALL PRODUCTS GRID */}
      <section ref={productsSectionRef} className="archive-products-display-section">
        <h2 className="products-grid-main-heading">On sale now</h2>

        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>Loading Sale Archive...</p>
        ) : !isActive ? (
          <p style={{ textAlign: "center", padding: "40px", fontSize: "16px", fontWeight: "500" }}>
            There are not sale yet
          </p>
        ) : archiveProducts.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px" }}>No active sale products available right now.</p>
        ) : (
          <div className="archive-product-cards-layout-grid">
            {/* Display ALL products */}
            {archiveProducts.map((product) => {
              const pId = product._id || product.id;
              const isWishlisted = Array.isArray(wishlist) && wishlist.includes(pId);
              const pImage = getProductImage(product);
              
              // 💡 1. BASE PKR LOGIC (Same as Banner/Admin)
              let originalPKR = Number(
                product.originalPricePKR || 
                (product.originalPrice ? product.originalPrice * 278 : 0)
              );
              
              let salePKR = Number(
                product.pricePKR || 
                (product.price ? product.price * 278 : 0)
              );

              // Agar koi ek price missing ho toh dusri se replace kar dein
              if (!originalPKR) originalPKR = salePKR;
              if (!salePKR) salePKR = originalPKR;

              // 💡 2. DISCOUNT CALCULATION (Based on PKR)
              const rawDiscount = product.discountPercentage || product.discount;
              let discountPct = "";

              if (rawDiscount) {
                const cleanVal = String(rawDiscount).replace(/[^0-9]/g, "");
                if (cleanVal && Number(cleanVal) > 0) {
                  discountPct = `-${cleanVal}%`;
                  salePKR = originalPKR - (originalPKR * (Number(cleanVal) / 100)); // Flash Sale Discount
                }
              } else if (originalPKR > salePKR) {
                const calcPct = Math.round(((originalPKR - salePKR) / originalPKR) * 100);
                if (calcPct > 0) discountPct = `-${calcPct}%`;
              }

              // 💡 3. CONVERT PKR TO DYNAMIC CURRENCY (e.g. USD)
              const displaySaleCurrency = salePKR / exchangeRate;
              const displayOriginalCurrency = originalPKR / exchangeRate;

              return (
                <div key={pId} className="premium-boutique-product-card">
                  <div className="boutique-card-image-wrapper">
                    <Link to={`/product/${pId}`} className="boutique-image-link-overlay">
                      <img src={pImage} alt={product.name || "Sale Product"} className="boutique-main-img" />
                    </Link>

                    {product.badge && (
                      <span className="boutique-left-tag-badge">{product.badge}</span>
                    )}

                    {discountPct && (
                      <span className="boutique-right-discount-badge">{discountPct}</span>
                    )}

                    <button
                      onClick={() => toggleWishlist && toggleWishlist(pId)}
                      className={`boutique-card-wishlist-action-trigger ${isWishlisted ? "active-loved" : ""}`}
                      aria-label="Add to wishlist"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "#111111" : "none"} stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>

                    <div className="boutique-card-quick-add-curtain">
                      <button onClick={() => addToCart && addToCart(product, 1)} className="boutique-curtain-btn">
                        QUICK ADD BAG
                      </button>
                    </div>
                  </div>

                  <div className="boutique-card-details-info-box">
                    <Link to={`/product/${pId}`} className="boutique-title-link">
                      <h3 className="boutique-product-title-text">{product.name}</h3>
                    </Link>
                    
                    {/* 💡 4. DUAL PRICING UI (USD + PKR) */}
                    <div className="boutique-product-pricing-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', marginTop: '6px' }}>
                      <div>
                        <span className="boutique-current-sale-price">{currencySymbol}{displaySaleCurrency.toFixed(2)}</span>
                        {originalPKR > salePKR && (
                          <span className="boutique-old-original-price" style={{ marginLeft: '6px' }}>
                            {currencySymbol}{displayOriginalCurrency.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <div className="static-pkr-display" style={{ fontSize: '12px', color: '#777', fontWeight: '500' }}>
                        PKR {Math.round(salePKR)}
                        {originalPKR > salePKR && (
                          <span style={{ textDecoration: 'line-through', marginLeft: '4px', opacity: 0.6 }}>
                            {Math.round(originalPKR)}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};