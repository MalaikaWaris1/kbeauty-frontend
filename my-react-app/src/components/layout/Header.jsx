import { useState, useContext, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import "./Header.css";

export const Header = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 🔍 Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Consuming context variables
  const { cartCount, wishlistCount, toast, products = [] } = useContext(AppContext);

  // 🟢 Fetch User Data on Component Mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse userData", e);
      }
    }
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 2 Initials Generator Logic
  const getInitials = (user) => {
    if (!user) return "U";
    if (user.name) {
      const parts = user.name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return user.name.slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  // 🟢 Logout / Sign Out Handler
  const handleLogout = () => {
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userRefreshToken");
    localStorage.removeItem("userData");
    setUserData(null);
    setIsDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // 🔍 Filtered Products for Search Dropdown
  const searchResults = searchQuery.trim() !== ""
    ? products.filter(product => {
        const titleMatch = (product.name || product.title || "").toLowerCase().includes(searchQuery.toLowerCase());
        const brandMatch = (product.brand || product.category || "").toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || brandMatch;
      })
    : [];

  const handleProductClick = (productId) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    closeMenu();
    navigate(`/product/${productId}`);
  };

  return (
    <header className="kbeauty-header-container">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <p> 🔒 100% Authentic · 🇰🇷 Official Korean Brands Partner · ✈️Pakistan to everywhere Delivery 5–7 Days  · 🚚 Free Delivery over 6000 Pkr.</p>
      </div>

      {/* Main Navigation Row */}
      <div className="main-navbar">

        {/* Mobile Hamburger Button */}
        <button
          className={`hamburger-menu ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "44px",
            height: "44px",
            zIndex: 90,
            padding: "0"
          }}
        >
          <span style={{
            display: "block", width: "24px", height: "2px", backgroundColor: "#111", borderRadius: "2px",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isMenuOpen ? "translateY(6px) rotate(45deg)" : "translateY(-5px)"
          }}></span>
          <span style={{
            display: "block", width: "24px", height: "2px", backgroundColor: "#111", borderRadius: "2px",
            transition: "all 0.3s ease", opacity: isMenuOpen ? 0 : 1,
            transform: isMenuOpen ? "translateX(-10px)" : "translateX(0)"
          }}></span>
          <span style={{
            display: "block", width: "24px", height: "2px", backgroundColor: "#111", borderRadius: "2px",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isMenuOpen ? "translateY(-6px) rotate(-45deg)" : "translateY(5px)"
          }}></span>
        </button>

        {/* 🟢 PREMIUM DARK GLASSMORPHIC DRAWER */}
        <nav 
          className={`nav-links ${isMenuOpen ? "mobile-active" : ""}`}
          style={isMenuOpen ? {
            background: "rgba(255, 245, 238, 0.75)", // 🟢 Soft Creamy/Peach Tint
            backdropFilter: "blur(16px)", // Glass Blur Effect
            WebkitBackdropFilter: "blur(16px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.5)", // Light edge reflection
            boxShadow: "4px 0 30px rgba(249, 215, 215, 0.7)", // 🟢 Shadow light kar diya
            paddingTop: "95px"// Cross icon ke liye space
          } : {}}
        >
          
          {/* ❌ THE CROSS ICON (Explicitly inside the drawer) */}
          {isMenuOpen && (
            <button
              onClick={closeMenu}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.1)", // Light glass button
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                color: "#4A3B32",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
              aria-label="Close menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}

          {/* Links with conditional white text for dark glass */}
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} style={isMenuOpen ? { color: "#4A3B32" } : {}}>
            HOME
          </NavLink>
          <NavLink to="/shop" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} style={isMenuOpen ? { color: "#4A3B32" } : {}}>
            SHOP
          </NavLink>
          <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} style={isMenuOpen ? { color: "#4A3B32" } : {}}>
            STORY
          </NavLink>
          <NavLink to="/purchase-history" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} style={isMenuOpen ? { color: "#4A3B32" } : {}}>
            PURCHASES
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} style={isMenuOpen ? { color: "#4A3B32" } : {}}>
            CONTACT
          </NavLink>

          {/* Mobile Side Drawer Utilities */}
          <div className="drawer-mobile-utils">
            <hr className="drawer-divider" style={isMenuOpen ? { borderColor: "rgba(74, 59, 50, 0.15)" } : {}} />

            <button 
              className="drawer-util-btn wishlist-btn" 
              aria-label="Wishlist" 
              onClick={() => { closeMenu(); navigate('/wishlist'); }}
              style={isMenuOpen ? { color: "#4A3B32" } : {}}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span>WISHLIST</span>
              {wishlistCount > 0 && <span  className="wishlist-count-one">{wishlistCount}</span>}
            </button>
          </div>
        </nav>

        {/* Center: Logo */}
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu} className="custom-text-logo">
            <span className="logo-top-italic">korean</span>
            <div className="logo-bottom-row">
              <span className="logo-brand-sub">PRODUCTSBY_SUNNY</span>
              <span className="logo-pkr-badge">PK</span>
            </div>
          </Link>
        </div>

        {/* Right Side: Header Main Icons & Functional Search */}
        <div className="navbar-icons">
          {/* Search Button Container */}
          <div className="search-wrapper-relative" ref={searchRef}>
            <button className="icon-btn desktop-only-icon drawer-util-btn" aria-label="Search" onClick={() => { closeMenu(); setIsSearchOpen(true); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span></span>
            </button>
            
            {/* 🔍 LIVE SEARCH DROPDOWN POPUP */}
            {isSearchOpen && (
              <div className="search-floating-dropdown">
                <div className="search-input-box">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                   
                {searchQuery.trim() !== "" && (
                  <div className="search-results-panel">
                    <h4 className="search-results-heading">Products</h4>
                    {searchResults.length > 0 ? (
                      <div className="search-results-list">
                        {searchResults.map((product) => (
                          <div
                            key={product._id || product.id}
                            className="search-item-card"
                            onClick={() => handleProductClick(product._id || product.id)}
                          >
                            <img
                              src={product.image || product.images?.[0]}
                              alt={product.name || product.title}
                              className="search-item-img"
                            />
                            <div className="search-item-details">
                              <span className="search-item-brand">{product.brand || "K-BEAUTY"}</span>
                              <h5 className="search-item-name">{product.name || product.title}</h5>
                              <div className="search-item-prices">
                                {product.originalPrice && (
                                  <span className="old-price">Rs.{Number(product.originalPrice).toLocaleString()}.00</span>
                                )}
                                <span className="new-price">Rs.{Number(product.price).toLocaleString()}.00</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="search-no-results">No products found matching "{searchQuery}"</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DYNAMIC ACCOUNT ICON */}
          {userData ? (
            <div className="user-profile-menu-container" style={{ position: "relative" }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  backgroundColor: "#aa8676", color: "#ffffff", fontWeight: "bold",
                  fontSize: "12px", border: "none", cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", letterSpacing: "0.5px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
                }}
                title={userData.name || userData.email}
              >
                {getInitials(userData)}
              </button>

              {/* SIGNOUT DROPDOWN MENU */}
              {isDropdownOpen && (
                <div
                  style={{
                    position: "absolute", right: "0", top: "42px", backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                    padding: "12px 16px", width: "190px", zIndex: 100, textAlign: "left"
                  }}
                >
                  <p style={{ fontSize: "10px", color: "#a0aec0", textTransform: "uppercase", margin: "0 0 2px 0", fontWeight: "600" }}>
                    Logged in as
                  </p>
                  <p style={{ fontSize: "12px", color: "#aa8676", fontWeight: "bold", margin: "0 0 10px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {userData.name || userData.email}
                  </p>
                  <hr style={{ border: "none", borderTop: "1px solid #edf2f7", margin: "8px 0" }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%", padding: "6px 0", backgroundColor: "transparent", color: "#e53e3e",
                      border: "none", fontWeight: "600", fontSize: "12px", cursor: "pointer", display: "flex",
                      alignItems: "center", gap: "6px"
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="icon-btn" aria-label="Account" onClick={() => navigate('/auth')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </button>
          )}

          {/* Desktop wishlist icon */}
          <button className="icon-btn desktop-only-icon wishlist-btn" aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
          </button>

          {/* Cart Icon & Dynamic Toast */}
          <div className="cart-icon-wrapper-relative">
            <button className="icon-btn cart-btn" aria-label="Cart" onClick={() => navigate('/cart')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span className="cart-count">{cartCount}</span>
            </button>

            {/* DYNAMIC TOAST POP-UP DROP PANEL */}
            {toast.show && (
              <div className="luxury-cart-toast-popup">
                <div className="toast-arrow-pointer"></div>
                <div className="toast-content-layout">
                  <img src={toast.image} alt={toast.name} className="toast-prod-thumb" />
                  <div className="toast-meta-text">
                    <span className="toast-alert-badge">ADDED TO BAG!</span>
                    <h5 className="toast-item-title">{toast.name}</h5>
                    <span className="toast-item-qty">Quantity: {toast.quantity}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dark Backdrop Overlay */}
      {isMenuOpen && <div className="nav-overlay" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={closeMenu}></div>}
    </header>
  );
};