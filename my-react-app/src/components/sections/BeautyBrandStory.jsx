// src/components/sections/BeautyBrandStory.jsx
import React from "react";
import { motion } from "framer-motion";
import "./BeautyBrandStory.css";

// 🟢 Luxury Animation Variants Config
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Elements ek ke baad ek aayenge
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0.25, 1.0], // Custom cubic-bezier for high-end smooth motion
    },
  },
};

export const BeautyBrandStory = () => {
  return (
    <section className="beauty-brand-story-section">
      <motion.div
        className="brand-story-wrapper"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Screen par 30% aate hi animate hoga (Sirf ek baar)
      >
        {/* 1. Tagline / Overline */}
        <motion.span variants={itemVariants} className="brand-story-tagline">
          About Us
        </motion.span>

        {/* 2. Main Luxury Heading */}
        <motion.h2 variants={itemVariants} className="brand-story-main-statement">
          We believe in the beauty of conscious skincare—in formulas 
          made with care, botanical ingredients that nourish gracefully, 
          and routines that invite <em>pause</em>.
        </motion.h2>

        {/* 3. Description Paragraph */}
        <motion.p variants={itemVariants} className="brand-story-paragraph">
          Every blend in our collection is selected for its ingredient integrity, its clean 
          formulation, and its ability to restore beautifully. We work with botanists and 
          specialists who share our commitment to mindfulness, ethical sourcing, and visible results.
        </motion.p>

        {/* 4. Action Button with Hover Effect */}
        <motion.div variants={itemVariants}>
          <motion.button
            className="brand-story-action-btn"
            onClick={() => (window.location.href = "/about")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Read Our Story{" "}
            <motion.span
              className="story-btn-arrow"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};