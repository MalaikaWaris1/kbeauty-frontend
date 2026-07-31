
// src/components/sections/FlashSaleBanner.jsx
// src/components/sections/FlashSaleBanner.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppContext";
import "./FlashSaleBanner.css";

// Framer Motion Configurations
const containerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1.0],
      staggerChildren: 0.12,
    },
  },
};

const childVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const productVariants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const FlashSaleBanner = () => {
  const { saleData } = useContext(AppContext);
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  const [isExpired, setIsExpired] = useState(false);

  const isActive = saleData?.isActive;
  const endTime = saleData?.endDate || saleData?.endTime;

  useEffect(() => {
    if (!isActive || !endTime) return;

    const calculateTime = () => {
      const difference = +new Date(endTime) - +new Date();

      if (difference <= 0) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days: d < 10 ? `0${d}` : d.toString(),
          hours: h < 10 ? `0${h}` : h.toString(),
          minutes: m < 10 ? `0${m}` : m.toString(),
          seconds: s < 10 ? `0${s}` : s.toString(),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [isActive, endTime]);

  const isTimeOver = endTime ? new Date(endTime).getTime() <= Date.now() : false;
  if (!isActive || isExpired || isTimeOver) return null;

  // Safe Image Helper
  const getProductImage = (prod) => {
    if (prod?.image) return prod.image;
    if (prod?.images && prod.images.length > 0) return prod.images[0];
    return "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop";
  };

  // Admin se aane wali featuredProducts list
  const displayProducts =
    saleData?.featuredProducts?.length > 0
      ? saleData.featuredProducts
      : saleData?.archiveProducts?.length > 0
      ? saleData.archiveProducts
      : saleData?.products || [];

  // 🎯 FIX HERE: Admin Panel se Color Fetching
  const dynamicBannerColor = saleData?.bannerColor || saleData?.bgColor || saleData?.backgroundColor || "#F3DCD3";

  return (
    <section className="luxury-flash-sale-section">
      <motion.div
        className="sale-banner-container"
        style={{ backgroundColor: dynamicBannerColor }} // 👈 Ab exact 'bannerColor' match hoga
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* LEFT COLUMN */}
        <div className="sale-banner-left-info">
          <motion.span variants={childVariant} className="sale-mini-tagline">
            {saleData?.miniTitle || saleData?.subtitle || "LIMITED OCCURRENCE"}
          </motion.span>

          <motion.h2 variants={childVariant} className="sale-main-heading">
            {saleData?.mainTitle || saleData?.title || "Flash Sale"}
          </motion.h2>

          {saleData?.description && (
            <motion.p variants={childVariant} className="sale-description-text">
              {saleData.description}
            </motion.p>
          )}

          {/* Countdown Row */}
          <motion.div variants={childVariant} className="luxury-countdown-row">
            <div className="countdown-time-block">
              <span className="time-digit">{timeLeft.days}</span>
              <span className="time-label">DAYS</span>
            </div>
            <span className="countdown-colon-divider">/</span>

            <div className="countdown-time-block">
              <span className="time-digit">{timeLeft.hours}</span>
              <span className="time-label">HOURS</span>
            </div>
            <span className="countdown-colon-divider">/</span>

            <div className="countdown-time-block">
              <span className="time-digit">{timeLeft.minutes}</span>
              <span className="time-label">MINS</span>
            </div>
            <span className="countdown-colon-divider">/</span>

            <div className="countdown-time-block">
              <span className="time-digit">{timeLeft.seconds}</span>
              <span className="time-label">SECS</span>
            </div>
          </motion.div>
        </div>

        {/* MIDDLE COLUMN: Circle Products */}
        <div className="sale-banner-middle-product">
          {displayProducts.slice(0, 3).map((product) => {
            const pId = product._id || product.id;
            const pImage = getProductImage(product);
            const price = Number(product.salePrice || product.price || 0);
            const originalPrice = Number(product.originalPrice || product.comparePrice || price);

            const rawDiscount = product.discountPercentage || product.discount;
            let discountBadgeText = "";

            if (rawDiscount) {
              const cleanVal = String(rawDiscount).replace(/[^0-9]/g, "");
              if (cleanVal) discountBadgeText = `${cleanVal}% OFF`;
            } else if (originalPrice > price) {
              const calcPct = Math.round(((originalPrice - price) / originalPrice) * 100);
              if (calcPct > 0) discountBadgeText = `${calcPct}% OFF`;
            }

            return (
              <motion.div key={pId} variants={productVariants} whileHover={{ y: -4 }}>
                <Link to={`/product/${pId}`} className="banner-circle-product-card">
                  <div className="circle-image-frame">
                    <img src={pImage} alt={product.name || "Sale item"} className="circle-product-img" />
                    {discountBadgeText && (
                      <span className="circle-discount-badge">{discountBadgeText}</span>
                    )}
                  </div>
                  <div className="circle-product-details">
                    <h4 className="circle-product-title">{product.name}</h4>
                    <div className="circle-product-pricing">
                      <span className="circle-sale-price">${price.toFixed(2)}</span>
                      {originalPrice > price && (
                        <span className="circle-old-price">${originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT COLUMN */}
        <motion.div variants={childVariant} className="sale-banner-right-action">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/sale" className="sale-primary-cta-btn">
              {saleData?.buttonText || "SHOP THE ARCHIVE"}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};