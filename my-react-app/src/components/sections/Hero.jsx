
// // src/components/sections/Hero.jsx
// import React from "react";
// import "./Hero.css";
// import cosmeticVideo from "../../assets/hero.mp4"; // 🟢 Video Import
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion"; // 🟢 Framer Motion Import

// export const Hero = () => {
  
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15, 
//         delayChildren: 0.3,   
//       },
//     },
//   };

  
//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { 
//         duration: 0.8, 
//         ease: [0.25, 1, 0.5, 1] 
//       },
//     },
//   };

//   return (
//     <section className="kbeauty-hero">
//       {/* 🟢 Background Video Layer with Smooth Fade-In */}
//       <motion.video 
//         className="hero-video-bg" 
//         autoPlay 
//         loop 
//         muted 
//         playsInline
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1.2 }}
//       >
//         <source src={cosmeticVideo} type="video/mp4" />
//         Your browser does not support the video tag.
//       </motion.video>

//       {/* 🟢 Soft Visual Overlay Mask */}
//       <motion.div 
//         className="hero-overlay-mask"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       ></motion.div>

//       {/* 🟢 Content Container */}
//       <div className="hero-content-wrapper">
//         <motion.div 
//           className="hero-text-block"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {/* 🟢 Fancy Top Korean Beauty Products Heading / Badge */}
//           <motion.div variants={itemVariants} className="hero-fancy-badge-container">
//             <span className="hero-fancy-badge">
//               <span className="sparkle-icon">✨</span> Top Korean Beauty Products
//             </span>
//           </motion.div>

//           <motion.span className="hero-subtitle" variants={itemVariants}>
//             AUTHENTIC K-PRODUCTS COLLECTION
//           </motion.span>
          
//           <motion.h1 className="hero-title" variants={itemVariants}>
//             Glass skin is a <br />
//             <span className="serif-italic">daily ritual.</span>
//           </motion.h1>
          
//           <motion.p className="hero-description" variants={itemVariants}>
//             Experience the transformative power of ancient Korean botanical secrets. 
//             Formulated with fermented rice water, centella asiatica, and natural ceramides 
//             for deeply hydrated, luminous skin.
//           </motion.p>

//           {/* 🟢 Mobile-Responsive Premium Buttons */}
//           <motion.div className="hero-cta-group" variants={itemVariants}>
//             <Link to="/shop" className="btn-solid">
//               EXPLORE OUR PRODUCTS
//             </Link>
//             <Link to="/about" className="btn-outline">
//               OUR FORMULATIONS
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// src/components/sections/Hero.jsx
import React from "react";
import "./Hero.css";
import cosmeticVideo from "../../assets/hero.mp4"; // 🟢 Video Import
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // 🟢 Framer Motion Import

export const Hero = () => {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, 
        delayChildren: 0.3,   
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 1, 0.5, 1] 
      },
    },
  };

  return (
    <section className="kbeauty-hero">
      {/* 🟢 Background Video Layer (Optimized for High Priority Load) */}
      <motion.video 
        className="hero-video-bg" 
        autoPlay 
        loop 
        muted 
        playsInline
        disablePictureInPicture /* 🚀 OPTIMIZATION: Hardware acceleration helper */
        preload="auto"          /* 🚀 OPTIMIZATION: Forces browser to load this first */
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <source src={cosmeticVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* 🟢 Soft Visual Overlay Mask */}
      <motion.div 
        className="hero-overlay-mask"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      ></motion.div>

      {/* 🟢 Content Container */}
      <div className="hero-content-wrapper">
        <motion.div 
          className="hero-text-block"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 🟢 Fancy Top Korean Beauty Products Heading / Badge */}
          <motion.div variants={itemVariants} className="hero-fancy-badge-container">
            <span className="hero-fancy-badge">
              <span className="sparkle-icon">✨</span> Top Korean Beauty Products
            </span>
          </motion.div>

          <motion.span className="hero-subtitle" variants={itemVariants}>
            AUTHENTIC K-PRODUCTS COLLECTION
          </motion.span>
          
          <motion.h1 className="hero-title" variants={itemVariants}>
            Glass skin is a <br />
            <span className="serif-italic">daily ritual.</span>
          </motion.h1>
          
          <motion.p className="hero-description" variants={itemVariants}>
            Experience the transformative power of ancient Korean botanical secrets. 
            Formulated with fermented rice water, centella asiatica, and natural ceramides 
            for deeply hydrated, luminous skin.
          </motion.p>

          {/* 🟢 Mobile-Responsive Premium Buttons */}
          <motion.div className="hero-cta-group" variants={itemVariants}>
            <Link to="/shop" className="btn-solid">
              EXPLORE OUR PRODUCTS
            </Link>
            <Link to="/about" className="btn-outline">
              OUR FORMULATIONS
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};