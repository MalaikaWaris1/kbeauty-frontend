// // src/pages/Home.jsx
// import React, { useContext } from "react"; // 1. useContext import kiya
// import { AppContext } from "../context/AppContext"; // 2. AppContext import kiya
// import { Hero } from "../components/sections/Hero";
// import { ShopByRitual } from "../components/sections/ShopByRitual";
// import { FlashSaleBanner } from "../components/sections/FlashSaleBanner";
// import { PremiumVideoGallery } from "../components/sections/PremiumVideoGallery";
// import { BeautyBrandStory } from "../components/sections/BeautyBrandStory";
// import { InstagramGallery } from "../components/sections/InstagramGallery";
// import { InnerCircleSubscribe } from "../components/sections/InnerCircleSubscribe";
// import { CommunityFavourites } from "../components/sections/CommunityFavourites";

// const Home = () => {
//   // 3. saleData context se nikala
//   const { saleData } = useContext(AppContext);

//   return (
//     <div className="home-page">
//       <Hero />

//       {/* 4. Agar sale active hogi tabhi FlashSaleBanner show hoga */}
//       {saleData?.isActive && <FlashSaleBanner />}

//       <ShopByRitual />
//       <CommunityFavourites />
//       <PremiumVideoGallery />
//       <BeautyBrandStory />
//       <InstagramGallery />
//       <InnerCircleSubscribe />
//     </div>
//   );
// };

// export default Home;

// src/pages/Home.jsx
import React, { useContext, lazy, Suspense } from "react"; 
import { AppContext } from "../context/AppContext"; 

// 🚀 LCP (Largest Contentful Paint) ke liye inko normal import rakha hai taake foran load hon
import { Hero } from "../components/sections/Hero";
import { FlashSaleBanner } from "../components/sections/FlashSaleBanner";
import WhyChooseUs from "../components/sections/WhyChooseUs";

// 🚀 SPEED FIX: Neechay wale tamaam sections ko Lazy Load kar diya gaya hai
// (Kyunke yeh Named Exports hain, isliye .then() laga kar default banaya gaya hai)
const ShopByRitual = lazy(() => import("../components/sections/ShopByRitual").then(module => ({ default: module.ShopByRitual })));
const CommunityFavourites = lazy(() => import("../components/sections/CommunityFavourites").then(module => ({ default: module.CommunityFavourites })));
const PremiumVideoGallery = lazy(() => import("../components/sections/PremiumVideoGallery").then(module => ({ default: module.PremiumVideoGallery })));
const BeautyBrandStory = lazy(() => import("../components/sections/BeautyBrandStory").then(module => ({ default: module.BeautyBrandStory })));
const InstagramGallery = lazy(() => import("../components/sections/InstagramGallery").then(module => ({ default: module.InstagramGallery })));
const InnerCircleSubscribe = lazy(() => import("../components/sections/InnerCircleSubscribe").then(module => ({ default: module.InnerCircleSubscribe })));

const Home = () => {
  const { saleData } = useContext(AppContext);

  return (
    <div className="home-page">
      {/* Oopar wala hissa foran render hoga */}
      <Hero />

      {/* Flash Sale Banner foran load hoga agar active hai (layout shift se bachne ke liye) */}
      {saleData?.isActive && <FlashSaleBanner />}

      {/* 🚀 Baqi sab kuch scroll karne par ya background mein aahista aahista render hoga */}
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>}>
        <ShopByRitual />
        <CommunityFavourites />
        <PremiumVideoGallery />
        <BeautyBrandStory />
        <InstagramGallery />
        <WhyChooseUs/>
        <InnerCircleSubscribe />
      </Suspense>
    </div>
  );
};

export default Home;