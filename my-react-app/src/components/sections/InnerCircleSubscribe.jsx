// src/components/sections/InnerCircleSubscribe.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";
import "./InnerCircleSubscribe.css";

// 🟢 Framer Motion Variants for High-End Smoothness
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

const formSwitchVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

export const InnerCircleSubscribe = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setLoading(true);
      await API.post("/newsletter/subscribe", { email });
      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="inner-circle-section">
      <motion.div
        className="inner-circle-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Editorial Heading */}
        <h2 className="inner-circle-title">Join the inner circle</h2>

        {/* Dynamic Form / Success State Transition */}
        <AnimatePresence mode="wait">
          {!isSubscribed ? (
            <motion.div
              key="subscribe-form"
              variants={formSwitchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fade-in-content"
            >
              <p className="inner-circle-subtitle">
                Early access to seasonal launches and skin-wellness guides. 
                Fifteen percent off your first order.
              </p>

              {/* Error Feedback */}
              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-500 text-xs mb-3 text-center"
                >
                  {errorMessage}
                </motion.p>
              )}

              {/* Minimalist Subscription Form */}
              <form onSubmit={handleSubscribe} className="subscribe-input-wrapper">
                <input
                  type="email"
                  placeholder="Email address"
                  className="subscribe-email-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="subscribe-action-btn disabled:opacity-50"
                >
                  {loading ? "SAVING..." : "SUBSCRIBE"}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            /* PREMIUM SUCCESS DISPLAY */
            <motion.div
              key="subscribe-success"
              variants={formSwitchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="subscribe-success-message"
            >
              <p className="success-luxury-text">
                Thank you. You have been added to our registry. <br />
                <em>Expect quiet updates in your inbox soon.</em>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};