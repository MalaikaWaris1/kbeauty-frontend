// // src/components/sections/ShopByRitual.jsx
// import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { AppContext } from "../../context/AppContext";
// import "./ShopByRitual.css";

// const RAW_RITUALS_DATA = [
//   {
//     id: "1",
//     title: "Cleansers",
//     link: "/shop?category=Cleansers",
//     images: [
//       "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop", 
//       "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=500&auto=format&fit=crop"
//     ]
//   },
//   {
//     id: "2",
//     title: "Serums",
//     link: "/shop?category=Serums",
//     images: [
//       "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=500&auto=format&fit=crop"
//     ]
//   },
//   {
//     id: "3",
//     title: "Essence",
//     link: "/shop?category=Essence",
//     images: [
//       "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=500&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500&auto=format&fit=crop"
//     ]
//   },
//   {
//     id: "4",
//     title: "Moisturizers",
//     link: "/shop?category=Moisturizers",
//     images: [
//       "https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=500&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=500&auto=format&fit=crop"
//     ]
//   },
//   {
//     id: "5",
//     title: "Sunscreen",
//     link: "/shop?category=Sunscreen",
//     images: [
//       "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=500&auto=format&fit=crop"
//     ]
//   },
//   {
//     id: "6",
//     title: "Masks",
//     link: "/shop?category=Masks",
//     images: [
//       "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=500&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1643185539104-3622eb1f0ff6?q=80&w=500&auto=format&fit=crop"
//     ]
//   }
// ];

// // Framer Motion Variants
// const MotionLink = motion(Link);

// const cardVariants = {
//   hidden: { opacity: 0, y: 25 },
//   visible: { 
//     opacity: 1, 
//     y: 0, 
//     transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
//   }
// };

// const RitualCard = ({ ritual }) => {
//   const [currentImgIndex, setCurrentImgIndex] = useState(0);
//   const [img1Error, setImg1Error] = useState(false);
//   const [img2Error, setImg2Error] = useState(false);

//   const imageList = ritual.images || [];

//   useEffect(() => {
//     if (img1Error || img2Error || imageList.length < 2) {
//       setCurrentImgIndex(0); 
//       return;
//     }

//     const interval = setInterval(() => {
//       setCurrentImgIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
//     }, 2500); 

//     return () => clearInterval(interval);
//   }, [img1Error, img2Error, imageList.length]);

//   return (
//     <MotionLink 
//       to={ritual.link} 
//       className="ritual-card"
//       variants={cardVariants}
//       whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
//     >
//       <div className="ritual-image-wrapper">
//         {!img1Error && imageList[0] ? (
//           <img 
//             src={imageList[0]} 
//             alt={ritual.title} 
//             className={`ritual-img ${currentImgIndex === 0 || img2Error ? "active" : "hidden"}`} 
//             onError={() => setImg1Error(true)} 
//           />
//         ) : null}

//         {!img2Error && imageList[1] ? (
//           <img 
//             src={imageList[1]} 
//             alt={ritual.title} 
//             className={`ritual-img ${currentImgIndex === 1 && !img1Error ? "active" : "hidden"}`} 
//             onError={() => setImg2Error(true)} 
//           />
//         ) : null}

//         {(img1Error && img2Error) || imageList.length === 0 ? (
//           <div className="premium-fallback-box">
//             <span>{ritual.title}</span>
//           </div>
//         ) : null}
//       </div>
//       <h4 className="ritual-card-title">{ritual.title}</h4>
//     </MotionLink>
//   );
// };

// // Animation Variants for Container & Header
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.1
//     }
//   }
// };

// const headerVariants = {
//   hidden: { opacity: 0, y: -15 },
//   visible: { 
//     opacity: 1, 
//     y: 0, 
//     transition: { duration: 0.6, ease: "easeOut" } 
//   }
// };

// export const ShopByRitual = () => {
//   const { products: liveProducts } = useContext(AppContext);
//   const gridRef = useRef(null);
//   const [activeScrollIndex, setActiveScrollIndex] = useState(0);

//   // 🔄 DYNAMIC CATEGORY AGGREGATOR
//   const rituals = useMemo(() => {
//     if (!Array.isArray(liveProducts) || liveProducts.length === 0) {
//       return RAW_RITUALS_DATA;
//     }

//     const categoryMap = new Map();

//     liveProducts.forEach((product) => {
//       if (!product?.category || typeof product.category !== "string") return;

//       const rawCat = product.category.trim();
//       if (!rawCat) return;

//       const key = rawCat.toLowerCase();

//       const prodImages = Array.isArray(product.images) && product.images.length > 0
//         ? product.images
//         : product.image ? [product.image] : [];

//       if (!categoryMap.has(key)) {
//         const displayTitle = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
        
//         categoryMap.set(key, {
//           id: key,
//           title: displayTitle,
//           link: `/shop?category=${encodeURIComponent(rawCat)}`,
//           images: []
//         });
//       }

//       const categoryObj = categoryMap.get(key);

//       for (const imgUrl of prodImages) {
//         if (categoryObj.images.length < 2 && imgUrl && !categoryObj.images.includes(imgUrl)) {
//           categoryObj.images.push(imgUrl);
//         }
//       }
//     });

//     const dynamicRituals = Array.from(categoryMap.values()).map((item) => ({
//       ...item,
//       images: item.images.length > 0 ? item.images : [RAW_RITUALS_DATA[0].images[0]]
//     }));

//     return dynamicRituals.length > 0 ? dynamicRituals.slice(0, 6) : RAW_RITUALS_DATA;
//   }, [liveProducts]);

//   // 📱 Detect Mobile Scroll Position for Active Dot Indicator
//   const handleGridScroll = () => {
//     if (!gridRef.current) return;
//     const scrollPosition = gridRef.current.scrollLeft;
//     const cardWidth = 175; // 160px width + 15px gap
//     const newIndex = Math.round(scrollPosition / cardWidth);
    
//     if (newIndex !== activeScrollIndex && newIndex >= 0 && newIndex < rituals.length) {
//       setActiveScrollIndex(newIndex);
//     }
//   };

//   // 👆 Scroll to clicked index card (Mobile)
//   const scrollToCardIndex = (index) => {
//     if (!gridRef.current) return;
//     const cardWidth = 175;
//     gridRef.current.scrollTo({
//       left: index * cardWidth,
//       behavior: "smooth"
//     });
//     setActiveScrollIndex(index);
//   };

//   return (
//     <section className="shop-by-ritual-section">
//       <motion.div 
//         className="ritual-section-header"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-50px" }}
//         variants={headerVariants}
//       >
//         <h2 className="ritual-main-heading">Shop by ritual</h2>
//         <Link to="/shop" className="ritual-view-all">VIEW ALL</Link>
//       </motion.div>

//       <motion.div 
//         className="rituals-grid-container" 
//         ref={gridRef}
//         onScroll={handleGridScroll}
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-50px" }}
//       >
//         {rituals.map((ritual) => (
//           <RitualCard key={ritual.id} ritual={ritual} />
//         ))}
//       </motion.div>

//       {/* 🔴 Responsive Dots for Mobile View */}
//       {rituals.length > 1 && (
//         <motion.div 
//           className="ritual-mobile-dots"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.4 }}
//         >
//           {rituals.map((_, index) => (
//             <span
//               key={index}
//               className={`ritual-dot ${activeScrollIndex === index ? "active" : ""}`}
//               onClick={() => scrollToCardIndex(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </motion.div>
//       )}
//     </section>
//   );
// };

// src/components/sections/ShopByRitual.jsx
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppContext";
import "./ShopByRitual.css";

const RAW_RITUALS_DATA = [
  {
    id: "1",
    title: "Cleansers",
    link: "/shop?category=Cleansers",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=500&auto=format&fit=crop"
    ]
  },
  {
    id: "2",
    title: "Serums",
    link: "/shop?category=Serums",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=500&auto=format&fit=crop"
    ]
  },
  {
    id: "3",
    title: "Essence",
    link: "/shop?category=Essence",
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500&auto=format&fit=crop"
    ]
  },
  {
    id: "4",
    title: "Moisturizers",
    link: "/shop?category=Moisturizers",
    images: [
      "https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=500&auto=format&fit=crop"
    ]
  },
  {
    id: "5",
    title: "Sunscreen",
    link: "/shop?category=Sunscreen",
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=500&auto=format&fit=crop"
    ]
  },
  {
    id: "6",
    title: "Masks",
    link: "/shop?category=Masks",
    images: [
      "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1643185539104-3622eb1f0ff6?q=80&w=500&auto=format&fit=crop"
    ]
  }
];

// Framer Motion Variants
const MotionLink = motion(Link);

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
  }
};

const RitualCard = ({ ritual }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [img1Error, setImg1Error] = useState(false);
  const [img2Error, setImg2Error] = useState(false);

  const imageList = ritual.images || [];

  useEffect(() => {
    if (img1Error || img2Error || imageList.length < 2) {
      setCurrentImgIndex(0); 
      return;
    }

    const interval = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 2500); 

    return () => clearInterval(interval);
  }, [img1Error, img2Error, imageList.length]);

  return (
    <MotionLink 
      to={ritual.link} 
      className="ritual-card"
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <div className="ritual-image-wrapper">
        {!img1Error && imageList[0] ? (
          <img 
            src={imageList[0]} 
            alt={ritual.title} 
            className={`ritual-img ${currentImgIndex === 0 || img2Error ? "active" : "hidden"}`} 
            onError={() => setImg1Error(true)} 
            loading="lazy"        /* 🚀 SPEED FIX: Stops blocking page load */
            decoding="async"      /* 🚀 SPEED FIX: Offloads image decoding */
          />
        ) : null}

        {!img2Error && imageList[1] ? (
          <img 
            src={imageList[1]} 
            alt={ritual.title} 
            className={`ritual-img ${currentImgIndex === 1 && !img1Error ? "active" : "hidden"}`} 
            onError={() => setImg2Error(true)} 
            loading="lazy"        /* 🚀 SPEED FIX */
            decoding="async"      /* 🚀 SPEED FIX */
          />
        ) : null}

        {(img1Error && img2Error) || imageList.length === 0 ? (
          <div className="premium-fallback-box">
            <span>{ritual.title}</span>
          </div>
        ) : null}
      </div>
      <h4 className="ritual-card-title">{ritual.title}</h4>
    </MotionLink>
  );
};

// Animation Variants for Container & Header
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export const ShopByRitual = () => {
  const { products: liveProducts } = useContext(AppContext);
  const gridRef = useRef(null);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);

  // 🔄 DYNAMIC CATEGORY AGGREGATOR
  const rituals = useMemo(() => {
    if (!Array.isArray(liveProducts) || liveProducts.length === 0) {
      return RAW_RITUALS_DATA;
    }

    const categoryMap = new Map();

    liveProducts.forEach((product) => {
      if (!product?.category || typeof product.category !== "string") return;

      const rawCat = product.category.trim();
      if (!rawCat) return;

      const key = rawCat.toLowerCase();

      const prodImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image ? [product.image] : [];

      if (!categoryMap.has(key)) {
        const displayTitle = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
        
        categoryMap.set(key, {
          id: key,
          title: displayTitle,
          link: `/shop?category=${encodeURIComponent(rawCat)}`,
          images: []
        });
      }

      const categoryObj = categoryMap.get(key);

      for (const imgUrl of prodImages) {
        if (categoryObj.images.length < 2 && imgUrl && !categoryObj.images.includes(imgUrl)) {
          categoryObj.images.push(imgUrl);
        }
      }
    });

    const dynamicRituals = Array.from(categoryMap.values()).map((item) => ({
      ...item,
      images: item.images.length > 0 ? item.images : [RAW_RITUALS_DATA[0].images[0]]
    }));

    return dynamicRituals.length > 0 ? dynamicRituals.slice(0, 6) : RAW_RITUALS_DATA;
  }, [liveProducts]);

  // 📱 Detect Mobile Scroll Position for Active Dot Indicator
  const handleGridScroll = () => {
    if (!gridRef.current) return;
    const scrollPosition = gridRef.current.scrollLeft;
    const cardWidth = 175; // 160px width + 15px gap
    const newIndex = Math.round(scrollPosition / cardWidth);
    
    if (newIndex !== activeScrollIndex && newIndex >= 0 && newIndex < rituals.length) {
      setActiveScrollIndex(newIndex);
    }
  };

  // 👆 Scroll to clicked index card (Mobile)
  const scrollToCardIndex = (index) => {
    if (!gridRef.current) return;
    const cardWidth = 175;
    gridRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth"
    });
    setActiveScrollIndex(index);
  };

  return (
    <section className="shop-by-ritual-section">
      <motion.div 
        className="ritual-section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={headerVariants}
      >
        <h2 className="ritual-main-heading">Shop by ritual</h2>
        <Link to="/shop" className="ritual-view-all">VIEW ALL</Link>
      </motion.div>

      <motion.div 
        className="rituals-grid-container" 
        ref={gridRef}
        onScroll={handleGridScroll}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {rituals.map((ritual) => (
          <RitualCard key={ritual.id} ritual={ritual} />
        ))}
      </motion.div>

      {/* 🔴 Responsive Dots for Mobile View */}
      {rituals.length > 1 && (
        <motion.div 
          className="ritual-mobile-dots"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {rituals.map((_, index) => (
            <span
              key={index}
              className={`ritual-dot ${activeScrollIndex === index ? "active" : ""}`}
              onClick={() => scrollToCardIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
};