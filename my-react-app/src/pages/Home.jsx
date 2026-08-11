// src/pages/Home.jsx
import React, { useContext } from "react"; 
import { AppContext } from "../context/AppContext"; 
import { Helmet } from "react-helmet-async"; 

import { Hero } from "../components/sections/Hero";
import { FlashSaleBanner } from "../components/sections/FlashSaleBanner";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import { ShopByRitual } from "../components/sections/ShopByRitual";
import { CommunityFavourites } from "../components/sections/CommunityFavourites";
import { PremiumVideoGallery } from "../components/sections/PremiumVideoGallery";
import { BeautyBrandStory } from "../components/sections/BeautyBrandStory";
import { InstagramGallery } from "../components/sections/InstagramGallery";
import { InnerCircleSubscribe } from "../components/sections/InnerCircleSubscribe";

const Home = () => {
  const { saleData } = useContext(AppContext);

  return (
    <div className="home-page">
      <Helmet>
        <title>Korean Beauty Products - Shop Top Brands in Pakistan | KoreanProductsby_sunny</title>
        <meta 
          name="description" 
          content="Get original Korean skincare and beauty products in Pakistan. Shop top brands like COSRX, Innisfree, and more with fast delivery." 
        />
        <meta property="og:title" content="Korean Beauty Products - Shop Top Brands in Pakistan | KoreanProductsby_sunny" />
        <meta property="og:description" content="Get original Korean skincare and beauty products in Pakistan. Shop top brands like COSRX, Innisfree, and more with fast delivery." />
        
        {/* 🟢 CANONICAL TAG YAHAN ADD KIYA HAI */}
        <link rel="canonical" href="https://www.koreanproducts.org/" />
      </Helmet>

      <Hero />

      {saleData?.isActive && <FlashSaleBanner />}

      <ShopByRitual />
      <CommunityFavourites />
      <PremiumVideoGallery />
      <BeautyBrandStory />
      <InstagramGallery />
      <WhyChooseUs />
      <InnerCircleSubscribe />
    </div>
  );
};

export default Home;