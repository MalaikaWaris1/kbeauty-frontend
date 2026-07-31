// src/pages/PremiumVideoDetails.jsx
import React, { useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext"; // 👈 AppContext Import kiya
import "./PremiumVideoDetails.css";

const PremiumVideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  // 🟢 Live Context Data (Admin Database Connected)
  const { videoGalleryData, loadingStories } = useContext(AppContext);

  // 🎯 URL ID ke mutabiq Admin uploaded story find karein
  const currentVideo = videoGalleryData?.find(
    (item) => (item._id || item.id) === id
  );

  // 1. Loading State
  if (loadingStories) {
    return (
      <div className="luxury-video-details-page flex justify-center items-center py-20 text-gray-500 font-medium">
        Loading boutique story details...
      </div>
    );
  }

  // 2. Error / Not Found State
  if (!currentVideo) {
    return (
      <div className="luxury-video-details-page text-center py-20">
        <h2 className="text-xl font-semibold mb-4">Story Record Not Found</h2>
        <button onClick={() => navigate(-1)} className="back-gallery-btn">
          ← BACK TO BOUTIQUE STORIES
        </button>
      </div>
    );
  }

  // 3. Helper: Parse Benefits (Handles Array or Comma-Separated String)
  const benefitsList = Array.isArray(currentVideo.benefits)
    ? currentVideo.benefits
    : typeof currentVideo.benefits === "string"
    ? currentVideo.benefits.split(",").map((b) => b.trim()).filter(Boolean)
    : [];

  return (
    <div className="luxury-video-details-page">
      <div className="details-nav-header">
        <button onClick={() => navigate(-1)} className="back-gallery-btn">
          ← BACK TO BOUTIQUE STORIES
        </button>
      </div>

      <div className="details-split-layout">
        {/* VIDEO CONTAINER - Uses Admin Uploaded Thumbnail as Poster Cover */}
        <div className="details-video-container">
          <div className="cinematic-frame">
            <video
              src={currentVideo.videoUrl}
              poster={currentVideo.thumbnailUrl || currentVideo.thumbnail} // 📸 Admin Uploaded Thumbnail Image
              className="details-main-video"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>

        {/* DYNAMIC CONTENT PANEL FROM ADMIN */}
        <div className="details-content-panel">
          <span className="details-mini-tag">{currentVideo.subtitle || "EXCLUSIVE RITUAL"}</span>
          <h1 className="details-main-title">{currentVideo.title}</h1>
          <p className="details-intro-text">{currentVideo.description}</p>

          <div className="details-tab-switcher">
            <button
              className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === "benefits" ? "active" : ""}`}
              onClick={() => setActiveTab("benefits")}
            >
              Benefits
            </button>
            <button
              className={`tab-btn ${activeTab === "ingredients" ? "active" : ""}`}
              onClick={() => setActiveTab("ingredients")}
            >
              Ingredients
            </button>
          </div>

          <div className="tab-content-display">
            {activeTab === "details" && (
              <div className="content-block-fade animate-fade">
                <h4 className="block-title">The Ritual Concept</h4>
                <p>
                  {currentVideo.ritualConcept ||
                    "This formulation serves as an essential pillar for high-performance skincare regimes, bridging pure organic sensory experiences with modern bio-available technology."}
                </p>
              </div>
            )}

            {activeTab === "benefits" && (
              <ul className="benefits-luxury-list content-block-fade animate-fade">
                {benefitsList.length > 0 ? (
                  benefitsList.map((benefit, index) => (
                    <li key={index}>
                      <span className="list-marker">—</span>
                      <p>{benefit}</p>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="list-marker">—</span>
                    <p>Enhances natural glow and supports deep tissue hydration.</p>
                  </li>
                )}
              </ul>
            )}

            {activeTab === "ingredients" && (
              <div className="content-block-fade animate-fade">
                <h4 className="block-title">Full Transparent Declaration</h4>
                <p className="ingredients-paragraph">
                  {currentVideo.ingredients || "Aqueous Botanical Extracts, Multi-molecular Hyaluronic Acid, Organic Oils."}
                </p>
                <small className="formula-disclaimer">
                  *Our formulations are subject to periodic improvements based on global cosmetic science protocols.
                </small>
              </div>
            )}
          </div>

          <div className="details-action-footer">
            <Link
              to={
                currentVideo.relatedCollection
                  ? `/shop?category=${encodeURIComponent(currentVideo.relatedCollection)}`
                  : "/shop"
              }
              className="discover-products-cta"
            >
              DISCOVER RELATED COLLECTION {currentVideo.relatedCollection ? `(${currentVideo.relatedCollection.toUpperCase()})` : ""}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumVideoDetails;