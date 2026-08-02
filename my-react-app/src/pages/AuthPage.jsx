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
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">PASSWORD</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
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
                        openModal("terms"); // Yeh aapka modal show karne wala function call karega
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

export default AuthPage;