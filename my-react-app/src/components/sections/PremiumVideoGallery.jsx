// import React, { useContext, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { AppContext } from "../../context/AppContext";
// import "./PremiumVideoGallery.css";

// export const PremiumVideoGallery = () => {
//   const { videoGalleryData, loadingStories } = useContext(AppContext);
//   const videoRefs = useRef([]);
//   const navigate = useNavigate();

//   // Mock Fallback Data
//   const fallbackVideos = [
//     {
//       id: "vid-1",
//       title: "Glow Routine",
//       subtitle: "Morning Essentials",
//       videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-applying-a-face-cream-41589-large.mp4",
//       thumbnail: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500"
//     },
//     {
//       id: "vid-2",
//       title: "Silk Textures",
//       subtitle: "Behind The Formula",
//       videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-liquid-skin-care-product-41593-large.mp4",
//       thumbnail: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=500"
//     },
//     {
//       id: "vid-3",
//       title: "Pure Botanical",
//       subtitle: "100% Organic Drops",
//       videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-drop-of-oil-falling-on-a-leaf-41595-large.mp4",
//       thumbnail: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=500"
//     }
//   ];

//   const rawList = (videoGalleryData && videoGalleryData.length > 0) ? videoGalleryData : fallbackVideos;

//   const displayVideos = rawList.map((item) => ({
//     id: item._id || item.id,
//     title: item.title || "Untitled Story",
//     subtitle: item.subtitle || "Boutique Story",
//     videoUrl: item.videoUrl,
//     thumbnail: item.thumbnailUrl || item.thumbnail
//   }));

//   // Auto-play mechanism (🟢 Fixed: Set to muted true for smooth autoplay across all devices)
//   useEffect(() => {
//     videoRefs.current.forEach((video) => {
//       if (video) {
//         video.muted = true; // 🟢 Sound off rakha hai taake autoplay block na ho
//         video.play().catch((err) => {
//           console.log("Autoplay buffered/restricted by browser:", err);
//         });
//       }
//     });
//   }, [displayVideos]);

//   if (loadingStories && videoGalleryData.length === 0) {
//     return <div className="loading-spinner">Loading Boutique Stories...</div>;
//   }

//   return (
//     <section className="luxury-video-gallery-section">
//       <div className="video-gallery-header">
//         <span className="gallery-mini-title">Boutique Stories</span>
//         <h2 className="gallery-main-heading">Formulas in Motion</h2>
//       </div>

//       <div className="premium-phone-mockup-grid">
//         {displayVideos.map((video, index) => (
//           <div 
//             key={`${video.id}-${index}`} 
//             className={`phone-mockup-card size-variant-${index % 3}`}
//             onClick={() => navigate(`/video/${video.id}`)}
//           >
//             <div className="phone-screen-frame">
              
//               <div className="phone-video-icon-badge">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
//                 </svg>
//               </div>

//               <video
//                 ref={(el) => (videoRefs.current[index] = el)}
//                 className="mockup-video-player"
//                 poster={video.thumbnail}
//                 loop
//                 muted
//                 playsInline
//                 preload="auto"
//               >
//                 <source src={video.videoUrl} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>

//               <div className="phone-ui-glass-overlay">
//                 <span className="phone-video-subtitle">{video.subtitle}</span>
//                 <h3 className="phone-video-title">{video.title}</h3>
                
//                 <div className="phone-pulse-indicator">
//                   <span className="pulse-dot"></span>
//                   LIVE LOOK
//                 </div>
//               </div>

//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import "./PremiumVideoGallery.css";

export const PremiumVideoGallery = () => {
  const { videoGalleryData, loadingStories } = useContext(AppContext);
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  // Mock Fallback Data
  const fallbackVideos = [
    {
      id: "vid-1",
      title: "Glow Routine",
      subtitle: "Morning Essentials",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-applying-a-face-cream-41589-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500"
    },
    {
      id: "vid-2",
      title: "Silk Textures",
      subtitle: "Behind The Formula",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-liquid-skin-care-product-41593-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=500"
    },
    {
      id: "vid-3",
      title: "Pure Botanical",
      subtitle: "100% Organic Drops",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-drop-of-oil-falling-on-a-leaf-41595-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=500"
    }
  ];

  const rawList = (videoGalleryData && videoGalleryData.length > 0) ? videoGalleryData : fallbackVideos;

  const displayVideos = rawList.map((item) => ({
    id: item._id || item.id,
    title: item.title || "Untitled Story",
    subtitle: item.subtitle || "Boutique Story",
    videoUrl: item.videoUrl,
    thumbnail: item.thumbnailUrl || item.thumbnail
  }));

  // 🚀 PERFORMANCE FIX: Smart Auto-play using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video screen par aayi toh play karo
            entry.target.muted = true;
            entry.target.play().catch((err) => {
              console.log("Autoplay buffered/restricted by browser:", err);
            });
          } else {
            // Video screen se bahar gayi toh pause karo (CPU aur RAM bachane ke liye)
            entry.target.pause();
          }
        });
      },
      { threshold: 0.2 } // Jab video 20% nazar aaye tabhi play ho
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [displayVideos]);

  if (loadingStories && videoGalleryData.length === 0) {
    return <div className="loading-spinner">Loading Boutique Stories...</div>;
  }

  return (
    <section className="luxury-video-gallery-section">
      <div className="video-gallery-header">
        <span className="gallery-mini-title">Boutique Stories</span>
        <h2 className="gallery-main-heading">Formulas in Motion</h2>
      </div>

      <div className="premium-phone-mockup-grid">
        {displayVideos.map((video, index) => (
          <div 
            key={`${video.id}-${index}`} 
            className={`phone-mockup-card size-variant-${index % 3}`}
            onClick={() => navigate(`/video/${video.id}`)}
          >
            <div className="phone-screen-frame">
              
              <div className="phone-video-icon-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </div>

              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="mockup-video-player"
                poster={video.thumbnail}
                loop
                muted
                playsInline
                preload="none" /* 🚀 SUPER SPEED FIX: Browser ab page load par video download nahi karega */
              >
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="phone-ui-glass-overlay">
                <span className="phone-video-subtitle">{video.subtitle}</span>
                <h3 className="phone-video-title">{video.title}</h3>
                
                <div className="phone-pulse-indicator">
                  <span className="pulse-dot"></span>
                  LIVE LOOK
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};