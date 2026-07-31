// src/components/sections/InstagramGallery.jsx
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppContext";
import "./InstagramGallery.css";

// 🟢 Framer Motion Variants Configurations
const headerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Har image ek ke baad ek aayegi
    },
  },
};

const gridItemVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const InstagramGallery = () => {
  const { instagramPosts, loadingInstagramPosts } = useContext(AppContext);

  return (
    <section className="instagram-gallery-section">
      {/* Header Section */}
      <motion.div
        className="insta-header-wrapper"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headerContainerVariants}
      >
        <motion.span variants={fadeUpVariant} className="insta-overline">
          Follow Us
        </motion.span>
        
        <motion.h2 variants={fadeUpVariant} className="insta-handle-heading">
          Join Our Community
        </motion.h2>

        <motion.p variants={fadeUpVariant} className="insta-description">
          Get inspired by clean botanical rituals, glowing skin, and
          behind-the-scenes formulation moments across our channels.
        </motion.p>

        {/* Social Icons Row */}
        <motion.div variants={fadeUpVariant} className="social-icons-row">
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            title="Instagram"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </motion.a>

          <motion.a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            title="TikTok"
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
            </svg>
          </motion.a>

          <motion.a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            title="Facebook"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </motion.a>

          <motion.a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-link"
            title="Pinterest"
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Live Instagram Feed Grid (Limit: Max 6 Items) */}
      {loadingInstagramPosts ? (
        <div className="text-center py-10 text-gray-400">Loading Instagram gallery...</div>
      ) : instagramPosts.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No active posts linked yet.</div>
      ) : (
        <motion.div
          className="insta-images-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridContainerVariants}
        >
          {/* Pehle 6 posts render honge with Framer Motion */}
          {instagramPosts.slice(0, 6).map((post) => (
            <motion.a
              key={post._id || post.id}
              href={post.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="insta-grid-item overflow-hidden block"
              variants={gridItemVariant}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={post.imageUrl}
                alt="Instagram Feed Item"
                className="insta-product-img w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              <div className="insta-hover-overlay">
                <svg
                  className="insta-icon-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}
    </section>
  );
};