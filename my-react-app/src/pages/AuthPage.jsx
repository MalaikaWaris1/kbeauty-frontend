// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";
// import "./AuthPage.css";

// const AuthPage = () => {
//   const [activeTab, setActiveTab] = useState("signin");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   // 👁️ PASSWORD SHOW/HIDE STATE
//   const [showPassword, setShowPassword] = useState(false);

//   // 🟢 Modal State & Handlers
//   const [activeModal, setActiveModal] = useState(null);

//   const openModal = (modalName, e) => {
//     if (e) e.preventDefault();
//     setActiveModal(modalName);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setActiveModal(null);
//     document.body.style.overflow = "auto";
//   };

//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrorMsg("");
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setErrorMsg("");
//     setSuccessMsg("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setSuccessMsg("");
//     setLoading(true);

//     try {
//       if (activeTab === "signin") {
//         const response = await API.post("/users/login", {
//           email: formData.email,
//           password: formData.password,
//         });

//         // 🔑 FIXED: Customer tokens saved in USER specific keys
//         if (response.data.accessToken) {
//           localStorage.setItem("userAccessToken", response.data.accessToken);
//         }
//         if (response.data.refreshToken) {
//           localStorage.setItem("userRefreshToken", response.data.refreshToken);
//         }
//         if (response.data.user) {
//           localStorage.setItem("userData", JSON.stringify(response.data.user));
//         }

//         setSuccessMsg("Sign in successful! Redirecting...");
        
//         setTimeout(() => {
//           navigate("/");
//           window.location.reload();
//         }, 1000);

//       } else {
//         const response = await API.post("/users/register", {
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//         });

//         setSuccessMsg(response.data.message || "Account created successfully! Please sign in.");
        
//         setTimeout(() => {
//           setActiveTab("signin");
//           setSuccessMsg("");
//         }, 1500);
//       }
//     } catch (err) {
//       console.error("Auth Error:", err);
//       const detailedError = err.response?.data?.error || err.response?.data?.message || "Something went wrong!";
//       setErrorMsg(detailedError);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="premium-auth-page">
//       <div className="auth-split-container">
        
//         <div className="auth-left-panel">
//           <span className="auth-subtitle">THE INNER CIRCLE</span>
//           <h1 className="auth-main-title">Ritual, remembered.</h1>
//           <p className="auth-description">
//            This account keeps track of your bag, your wishlist, and 
//             your favourite rituals — so returning is easy, wherever you are.
//           </p>
//         </div>

//         <div className="auth-right-panel">
//           <div className="auth-card">
            
//             <div className="auth-tabs">
//               <button 
//                 type="button"
//                 className={`tab-btn ${activeTab === "signin" ? "active" : ""}`}
//                 onClick={() => handleTabChange("signin")}
//               >
//                 SIGN IN
//               </button>
//               <button 
//                 type="button"
//                 className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
//                 onClick={() => handleTabChange("signup")}
//               >
//                 CREATE ACCOUNT
//               </button>
//             </div>

//             {errorMsg && <div className="auth-alert error-alert">{errorMsg}</div>}
//             {successMsg && <div className="auth-alert success-alert">{successMsg}</div>}

//             <form onSubmit={handleSubmit} className="auth-form animate-fade">
//               {activeTab === "signup" && (
//                 <div className="input-group">
//                   <label htmlFor="name">NAME</label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//               )}

//               <div className="input-group">
//                 <label htmlFor="email">EMAIL</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               {/* 👁️ PASSWORD FIELD WITH PROFESSIONAL SHOW/HIDE TOGGLE */}
//               <div className="input-group">
//                 <label htmlFor="password">PASSWORD</label>
//                 <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     required
//                     style={{ width: "100%", paddingRight: "40px" }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     style={{
//                       position: "absolute",
//                       right: "12px",
//                       background: "none",
//                       border: "none",
//                       cursor: "pointer",
//                       color: "#777",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       padding: "4px"
//                     }}
//                     title={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? (
//                       // Hide Eye Slash Icon
//                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
//                         <line x1="1" y1="1" x2="23" y2="23"></line>
//                       </svg>
//                     ) : (
//                       // Show Eye Icon
//                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                         <circle cx="12" cy="12" r="3"></circle>
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <button type="submit" className="auth-submit-btn" disabled={loading}>
//                 {loading 
//                   ? "PROCESSING..." 
//                   : activeTab === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
//               </button>

//               <div className="form-footer-links">
//                 {activeTab === "signin" ? (
//                   <p>
//                     Forgotten your password? <a href="/contact" className="premium-link">Contact us</a>.
//                   </p>
//                 ) : (
//                   <p>
//                     By creating an account you agree to our{" "}
//                     <a
//                       href="/auth"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         openModal("terms");
//                       }}
//                       className="premium-link"
//                     >
//                       Terms & Conditions
//                     </a>.
//                   </p>
//                 )}
//               </div>
//             </form>

//             <div className="auth-card-disclaimer">
//               <p>ACCOUNTS ARE SECURE & ENCRYPTED</p>
//             </div>

//           </div>
//         </div>

//       </div>

//       {/* 🟢 TERMS & CONDITIONS MODAL POPUP */}
//       {activeModal === "terms" && (
//         <div className="dark-modal-overlay" onClick={closeModal}>
//           <div className="dark-modal-box" onClick={(e) => e.stopPropagation()}>
//             <button className="dark-modal-close" onClick={closeModal}>✕</button>
//             <div className="dark-modal-layout">
//               <div className="dark-modal-left">
//                 <h2>Terms &<br />Conditions</h2>
//               </div>
//               <div className="dark-modal-right">
//                 <div className="policy-text-area">
//             <p>Your privacy is important to us. It is Products By Sony's policy to respect your privacy regarding any information we may collect from you across our website.</p>
//             <h3>1. Information we collect</h3>
//             <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
//             <h3>2. How we use your data</h3>
//             <p>We use your data to process your orders, communicate with you regarding your purchases, and improve our store experience.</p>
//           </div>
        
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuthPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./AuthPage.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 👁️ PASSWORD SHOW/HIDE STATE
  const [showPassword, setShowPassword] = useState(false);

  // 🟢 Modal State & Handlers
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName, e) => {
    if (e) e.preventDefault();
    setActiveModal(modalName);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = "auto";
  };

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg("");
    setSuccessMsg("");
  };

  // ✨ Password Strength Calculator Helper
  const getPasswordStrength = (pass) => {
    if (!pass) return { width: "0%", color: "#ddd" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { width: "35%", color: "#ef4444" }; // Weak (Red)
    if (score <= 4) return { width: "70%", color: "#f59e0b" }; // Medium (Orange)
    return { width: "100%", color: "#10b981" }; // Strong (Green)
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (activeTab === "signin") {
        const response = await API.post("/users/login", {
          email: formData.email,
          password: formData.password,
        });

        // 🔑 FIXED: Customer tokens saved in USER specific keys
        if (response.data.accessToken) {
          localStorage.setItem("userAccessToken", response.data.accessToken);
        }
        if (response.data.refreshToken) {
          localStorage.setItem("userRefreshToken", response.data.refreshToken);
        }
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }

        setSuccessMsg("Sign in successful! Redirecting...");
        
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);

      } else {
        const response = await API.post("/users/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setSuccessMsg(response.data.message || "Account created successfully! Please sign in.");
        
        setTimeout(() => {
          setActiveTab("signin");
          setSuccessMsg("");
        }, 1500);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const detailedError = err.response?.data?.error || err.response?.data?.message || "Something went wrong!";
      setErrorMsg(detailedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-auth-page">
      <div className="auth-split-container">
        
        <div className="auth-left-panel">
          <span className="auth-subtitle">THE INNER CIRCLE</span>
          <h1 className="auth-main-title">Ritual, remembered.</h1>
          <p className="auth-description">
           This account keeps track of your bag, your wishlist, and 
           your favourite rituals — so returning is easy, wherever you are.
          </p>
        </div>

        <div className="auth-right-panel">
          <div className="auth-card">
            
            <div className="auth-tabs">
              <button 
                type="button"
                className={`tab-btn ${activeTab === "signin" ? "active" : ""}`}
                onClick={() => handleTabChange("signin")}
              >
                SIGN IN
              </button>
              <button 
                type="button"
                className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
                onClick={() => handleTabChange("signup")}
              >
                CREATE ACCOUNT
              </button>
            </div>

            {errorMsg && <div className="auth-alert error-alert">{errorMsg}</div>}
            {successMsg && <div className="auth-alert success-alert">{successMsg}</div>}

            <form onSubmit={handleSubmit} className="auth-form animate-fade">
              {activeTab === "signup" && (
                <div className="input-group">
                  <label htmlFor="name">NAME</label>
                  <input
                    required
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* 👁️ PASSWORD FIELD WITH PROFESSIONAL SHOW/HIDE TOGGLE & STRENGTH BAR */}
              <div className="input-group">
                <label htmlFor="password">PASSWORD</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={{ width: "100%", paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#777",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px"
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      // Hide Eye Slash Icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      // Show Eye Icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {/* ✨ Password Strength Bar Line */}
                {formData.password && (
                  <div style={{ width: "100%", height: "4px", backgroundColor: "#e5e7eb", marginTop: "6px", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: passwordStrength.width, height: "100%", backgroundColor: passwordStrength.color, transition: "all 0.3s ease" }}></div>
                  </div>
                )}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading 
                  ? "PROCESSING..." 
                  : activeTab === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
              </button>

              <div className="form-footer-links">
                {activeTab === "signin" ? (
                  <p>
                    Forgotten your password? <a href="/contact" className="premium-link">Contact us</a>.
                  </p>
                ) : (
                  <p>
                    By creating an account you agree to our{" "}
                    <a
                      href="/auth"
                      onClick={(e) => {
                        e.preventDefault();
                        openModal("terms");
                      }}
                      className="premium-link"
                    >
                      Terms & Conditions
                    </a>.
                  </p>
                )}
              </div>
            </form>

            <div className="auth-card-disclaimer">
              <p>ACCOUNTS ARE SECURE & ENCRYPTED</p>
            </div>

          </div>
        </div>

      </div>

      {/* 🟢 TERMS & CONDITIONS MODAL POPUP */}
      {activeModal === "terms" && (
        <div className="dark-modal-overlay" onClick={closeModal}>
          <div className="dark-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="dark-modal-close" onClick={closeModal}>✕</button>
            <div className="dark-modal-layout">
              <div className="dark-modal-left">
                <h2>Terms &<br />Conditions</h2>
              </div>
              <div className="dark-modal-right">
                <div className="policy-text-area">
            <p>Your privacy is important to us. It is Products By Sony's policy to respect your privacy regarding any information we may collect from you across our website.</p>
            <h3>1. Information we collect</h3>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
            <h3>2. How we use your data</h3>
            <p>We use your data to process your orders, communicate with you regarding your purchases, and improve our store experience.</p>
          </div>
        
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* eslint-disable-next-line no-undef */
export default AuthPage;