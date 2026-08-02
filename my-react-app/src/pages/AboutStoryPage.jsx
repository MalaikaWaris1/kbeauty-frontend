// src/pages/AboutStoryPage.jsx
import React from "react";
import { motion } from "framer-motion";
import "./AboutStoryPage.css";

// 🎥 Asset Video Import
import heroVideo from "../assets/about.mp4";

// 🎨 Animation Variants (Professional & Smooth)
const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export const AboutStoryPage = () => {
  // Korean Beauty Authenticity Configuration Data Object
  const pageContent = {
    hero: {
      overline: "AUTHENTIC K-PROUCTS",
      title: "Unveiling the Secret to Glass Skin",
      subtitle: "100% genuine Korean formulations, ancient botanical wisdom, and transformative daily rituals sourced directly from Korea.",
    },
    philosophy: {
      overline: "Our Philosophy",
      statement: "We believe true radiance begins with balance—combining centuries-old Korean Hanbang herbal heritage with modern dermatological innovation for effortless radiance."
    },
    beginning: {
      overline: "The Essence of Authenticity",
      title: "Sourced Directly from Korea's Premier Formulators",
      text1: "Our story began with a single mission: to make genuine, high-efficacy Korean skincare accessible without compromise. We partner directly with certified K-beauty laboratories and heritage formulators in Korea, guaranteeing 100% authentic formulas.",
      text2: "From soothing Centella Asiatica and nourishing fermented rice waters to potent Ginseng extracts, every product in our curated collection is verified for purity, safety, and undeniable skin barrier repair.",
      imageUrl: "https://t4.ftcdn.net/jpg/11/19/75/45/240_F_1119754509_MvITU49EYeZBh6RKlvPOGHrnITmz3mi4.jpg"
    },
    quoteBanner: {
      quote: "“In Korea, skincare isn't a routine—it's a sacred ritual of self-love and lifelong hydration.”",
      bgImageUrl: "https://i.pinimg.com/originals/c9/d3/06/c9d306be153bc0c7ff316bda06111f72.jpg"
    },
    values: [
      {
        num: "01",
        title: "100% Certified Authentic",
        desc: "Direct supply chains from Korea guarantee zero counterfeit products. Every bottle arrives with verified batch authenticity and fresh shelf life."
      },
      {
        num: "02",
        title: "Hanbang & Bio-Tech",
        desc: "We curate formulations that masterfully blend traditional Korean herbal medicine (Hanbang) with advanced fermented active ingredients for maximum absorption."
      },
      {
        num: "03",
        title: "Skin-Barrier First",
        desc: "K-Beauty prioritizes gentle, long-term hydration over aggressive treatments. Our products nurture your natural skin barrier to achieve that inner glow."
      }
    ],
    cta: {
      overline: "Personalized Guidance",
      title: "Need Help Finding Your K-Products Ritual?",
      subtitle: "Whether you are starting your first 10-step Korean skincare routine or seeking targeted glass-skin solutions, our beauty specialists are here to assist.",
      bgImageUrl: "https://darbeauty.com/cdn/shop/articles/best-korean-skincare-routine-for-oily-skin-2026_276b3d3b-6138-484e-b607-9c15b6d4b920.webp?v=1780719710&width=600"
    }
  };

  return (
    <div className="about-story-page-wrapper">
      
      {/* 🎬 SECTION 1: HERO CONTAINER WITH BACKGROUND VIDEO */}
      <section className="story-hero-section">
        <div className="video-background-container">
          <video autoPlay loop muted playsInline className="hero-bg-video">
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-dark-overlay"></div>
        </div>
        
        <motion.div 
          className="story-hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span variants={fadeInUp} className="story-overline-badge">
            {pageContent.hero.overline}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="story-hero-title">
            {pageContent.hero.title}
          </motion.h1>
          <motion.p variants={fadeInUp} className="story-hero-subtitle">
            {pageContent.hero.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* 📜 SECTION 2: CLEAN MINIMALIST PHILOSOPHY */}
      <motion.section 
        className="story-philosophy-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="philosophy-accent-line">
          <span className="philosophy-overline">{pageContent.philosophy.overline}</span>
        </div>
        <h2 className="philosophy-statement">
          We believe true radiance begins with balance—combining centuries-old Korean 
          Hanbang herbal heritage with modern dermatological innovation for effortless <em>glass skin</em>.
        </h2>
      </motion.section>

      {/* 📖 SECTION 3: TWO COLUMN STAGGERED INTRO */}
      <section className="story-dual-split-section">
        <motion.div 
          className="split-text-column"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInLeft}
        >
          <span className="column-overline">{pageContent.beginning.overline}</span>
          <h3 className="column-main-title">{pageContent.beginning.title}</h3>
          <p className="column-description-p">{pageContent.beginning.text1}</p>
          <p className="column-description-p">{pageContent.beginning.text2}</p>
        </motion.div>

        <motion.div 
          className="split-image-column"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInRight}
        >
          <div className="image-frame-container">
            <motion.img 
              src={pageContent.beginning.imageUrl} 
              alt="Authentic K-Beauty Sourcing"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* 🖼️ SECTION 4: FULL-WIDTH TEXTURED BANNER */}
      <section 
        className="story-parallax-quote-banner" 
        style={{ backgroundImage: `url(${pageContent.quoteBanner.bgImageUrl})` }}
      >
        <div className="banner-blur-overlay"></div>
        <motion.h2 
          className="banner-embedded-quote"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={scaleIn}
        >
          {pageContent.quoteBanner.quote}
        </motion.h2>
      </section>

      {/* 🏷️ SECTION 5: THREE COLUMN GRID VALUES */}
      <section className="story-brand-values-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <span className="values-main-overline">What Guides Us</span>
          <h2 className="values-main-title">Our Core Pillars</h2>
        </motion.div>
        
        <motion.div 
          className="values-triple-grid-layout"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {pageContent.values.map((val, idx) => (
            <motion.div 
              key={idx} 
              className="value-individual-card"
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="value-index-number">{val.num}</span>
              <h4 className="value-card-title">{val.title}</h4>
              <div className="value-divider-bar"></div>
              <p className="value-card-description">{val.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ✉️ SECTION 6: HIGH-END CTA FOOTER BANNER */}
      <section 
        className="story-cta-footer-banner"
        style={{ backgroundImage: `url(${pageContent.cta.bgImageUrl})` }}
      >
        <div className="cta-banner-overlay"></div>
        <motion.div 
          className="cta-inner-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <span className="cta-overline">{pageContent.cta.overline}</span>
          <h2 className="cta-heading">{pageContent.cta.title}</h2>
          <p className="cta-paragraph">{pageContent.cta.subtitle}</p>
          <motion.button 
            className="cta-action-button" 
            onClick={() => window.location.href = '/contact'}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Consult Our Experts <span className="cta-arrow-symbol">→</span>
          </motion.button>
        </motion.div>
      </section>

    </div>
  );
};