// src/pages/Home.jsx
import React from "react";
import { Hero } from "../components/sections/Hero"; // 🟢 Hero ko import kiya
import { ShopByRitual } from "../components/sections/ShopByRitual";
import { FlashSaleBanner } from "../components/sections/FlashSaleBanner";
import { PremiumVideoGallery } from "../components/sections/PremiumVideoGallery";
import { BeautyBrandStory } from "../components/sections/BeautyBrandStory";
import { InstagramGallery } from "../components/sections/InstagramGallery";
import { InnerCircleSubscribe } from "../components/sections/InnerCircleSubscribe";
import { CommunityFavourites } from "../components/sections/CommunityFavourites";


const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <FlashSaleBanner />
      <ShopByRitual />
         <CommunityFavourites/>
      <PremiumVideoGallery />
      <BeautyBrandStory/>
      <InstagramGallery/>
      <InnerCircleSubscribe/>
   
    
    </div>
  );
};

export default Home;