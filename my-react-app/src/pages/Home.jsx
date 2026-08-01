// src/pages/Home.jsx
import React, { useContext } from "react"; // 1. useContext import kiya
import { AppContext } from "../context/AppContext"; // 2. AppContext import kiya
import { Hero } from "../components/sections/Hero";
import { ShopByRitual } from "../components/sections/ShopByRitual";
import { FlashSaleBanner } from "../components/sections/FlashSaleBanner";
import { PremiumVideoGallery } from "../components/sections/PremiumVideoGallery";
import { BeautyBrandStory } from "../components/sections/BeautyBrandStory";
import { InstagramGallery } from "../components/sections/InstagramGallery";
import { InnerCircleSubscribe } from "../components/sections/InnerCircleSubscribe";
import { CommunityFavourites } from "../components/sections/CommunityFavourites";

const Home = () => {
  // 3. saleData context se nikala
  const { saleData } = useContext(AppContext);

  return (
    <div className="home-page">
      <Hero />

      {/* 4. Agar sale active hogi tabhi FlashSaleBanner show hoga */}
      {saleData?.isActive && <FlashSaleBanner />}

      <ShopByRitual />
      <CommunityFavourites />
      <PremiumVideoGallery />
      <BeautyBrandStory />
      <InstagramGallery />
      <InnerCircleSubscribe />
    </div>
  );
};

export default Home;