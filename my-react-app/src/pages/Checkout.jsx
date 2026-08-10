import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import API from "../api/axios";
import "./Checkout.css";

const Checkout = () => {
  const { cart, setCart, cartSubtotal, shippingCost, totalAmount, clearCart } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 💱 AUTOMATIC LIVE EXCHANGE RATE STATE
  const [exchangeRate, setExchangeRate] = useState(280);

  // 🧠 SMART DETECTION: Check if user came from Online Payment or COD
  const checkoutMode = localStorage.getItem("checkoutMode") || "cod";
  const isOnlinePayment = checkoutMode === "online"; 

  // 🛒 SMART CART DETECTION (Buy Now vs Normal Cart)
  const [displayCart, setDisplayCart] = useState([]);
  const [calculatedSubtotal, setCalculatedSubtotal] = useState(0);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);

  useEffect(() => {
    const storedBuyNowProduct = localStorage.getItem("buyNowProduct");
    const storedBuyNowQuantity = localStorage.getItem("buyNowQuantity");

    if (storedBuyNowProduct) {
      // 🟢 USER CAME FROM "BUY NOW"
      setIsBuyNowFlow(true);
      const product = JSON.parse(storedBuyNowProduct);
      const qty = Number(storedBuyNowQuantity) || 1;
      product.quantity = qty;
      setDisplayCart([product]);
    } else {
      // 🟡 USER CAME FROM "ADD TO BAG" (NORMAL CART)
      setIsBuyNowFlow(false);
      setDisplayCart(cart);
    }
  }, [cart]); 

  // 🧮 DYNAMIC TOTALS RE-CALCULATION
  useEffect(() => {
    if (isBuyNowFlow) {
      const sub = displayCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setCalculatedSubtotal(sub);
      setCalculatedTotal(sub + shippingCost); 
    } else {
      setCalculatedSubtotal(cartSubtotal);
      setCalculatedTotal(totalAmount);
    }
  }, [displayCart, isBuyNowFlow, cartSubtotal, totalAmount, shippingCost]);

  // 🌐 FETCH LIVE USD TO PKR EXCHANGE RATE
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        if (data && data.rates && data.rates.PKR) {
          setExchangeRate(data.rates.PKR);
        }
      } catch (err) {
        console.error("Live PKR Rate Fetch Failed, using fallback rate:", err);
      }
    };
    fetchExchangeRate();
  }, []);

  const formatPKR = (usdAmount) => {
    if (usdAmount === undefined || usdAmount === null) return "Rs. 0";
    const pkrAmount = Math.round(usdAmount * exchangeRate);
    return `Rs. ${pkrAmount.toLocaleString("en-PK")}`;
  };

  // 🌍 AUTO-FILL COUNTRY FROM LOCAL STORAGE
  const initialState = {
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "",
    street: "", 
    city: "", 
    postalCode: "", 
    country: localStorage.getItem("checkoutCountry") || "Pakistan", 
    notes: ""
  };
  const [formData, setFormData] = useState(initialState);

  const userCountry = formData.country.trim().toLowerCase();
  const isInternational = userCountry !== "" && !["pakistan", "pk", "pak"].includes(userCountry);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 SMART QUANTITY HANDLER
  const handleQuantityChange = (itemToUpdate, action) => {
    if (isOnlinePayment) return; 

    if (isBuyNowFlow) {
      const updatedCart = displayCart.map(item => {
        if ((item._id || item.id) === (itemToUpdate._id || itemToUpdate.id)) {
          let newQty = item.quantity;
          if (action === 'inc') newQty += 1;
          if (action === 'dec' && newQty > 1) newQty -= 1;
          
          localStorage.setItem("buyNowQuantity", newQty); 
          return { ...item, quantity: newQty };
        }
        return item;
      });
      setDisplayCart(updatedCart);
    } else {
      if (setCart) {
        const updatedCart = cart.map(item => {
          if ((item._id || item.id) === (itemToUpdate._id || itemToUpdate.id)) {
            let newQty = item.quantity;
            if (action === 'inc') newQty += 1;
            if (action === 'dec' && newQty > 1) newQty -= 1;
            return { ...item, quantity: newQty };
          }
          return item;
        });
        setCart(updatedCart);
      }
    }
  };

  // 🚀 BACKEND SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (displayCart.length === 0) {
      alert("Your order summary is empty.");
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        items: displayCart.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price)
        })),
        isInternationalOrder: isInternational,
        paymentMethod: isOnlinePayment ? "Online (Pre-Paid)" : "Cash on Delivery",
        orderNotes: formData.notes
      };

      const response = await API.post("/orders", orderPayload);

      if (response.status === 201) {
        alert("🎉 Order successfully placed! Thank you for shopping with us.");
        
        if (isBuyNowFlow) {
          localStorage.removeItem("buyNowProduct");
          localStorage.removeItem("buyNowQuantity");
        } else {
          clearCart();
        }
        localStorage.removeItem("checkoutMode"); 
        localStorage.removeItem("checkoutCountry"); 
        
        setFormData(initialState);
        navigate("/");
      }
    } catch (err) {
      console.error("Order submit failed:", err);
      const msg = err.response?.data?.message || "Failed to submit order. Please check your network or credentials.";
      setErrorMessage(msg);

      if (err.response?.status === 401) {
        if (window.confirm("You must be logged in to submit an order. Go to Login page?")) {
          navigate("/auth");
        }
      }
    } finally {
      setLoading(false);
    }
  };
// 🚀 BACKEND SUBMIT HANDLER WITH WHATSAPP REDIRECT
 

  return (
    <div className="checkout-page-container">
      <div className="checkout-breadcrumb">
        <Link to="/cart">Your Bag</Link> <span>/</span> <span className="current">Checkout</span>
      </div>

      <h1>Checkout</h1>

      {isInternational ? (
        <div className="intl-banner-container">
          <div className="intl-banner-header">
            <div className="intl-banner-icon-wrapper"><span className="intl-globe-icon">✈️</span></div>
            <div className="intl-banner-title">
              <div className="intl-banner-badge"><span className="pulse-dot"></span> INTERNATIONAL ORDER DETECTED</div>
              <h4>Custom Shipping Quote & Invoice Notice</h4>
            </div>
          </div>
          <p className="intl-banner-text">
            Flat rates apply only within Pakistan. For international deliveries, shipping costs are calculated manually based on weight and country. Our team will contact you with a customized invoice after order submission.
          </p>
          <div className="intl-contact-strip">
            <div className="intl-contact-info">
              <span className="intl-contact-label">Direct Support & Shipping Queries:</span>
              <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="intl-contact-phone">
                📱 +92 3420466996 <span className="whatsapp-tag">(WhatsApp Available)</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="checkout-banner">
          📦 <strong>Domestic Orders:</strong> Flat delivery charge across Pakistan via courier.
        </div>
      )}

      {errorMessage && <div className="checkout-error-box">{errorMessage}</div>}

      <form className="checkout-form-grid" onSubmit={handleSubmit}>
        
        <div className="checkout-left">
          <h3>Contact Information</h3>
          {/* 🛡️ FIELD VALIDATION SECURITY ADDED */}
          <div className="form-row">
            <input 
              name="firstName" 
              placeholder="FIRST NAME *" 
              required 
              value={formData.firstName} 
              onChange={handleInputChange} 
              pattern="^[A-Za-z\s]{2,50}$" 
              title="Only letters and spaces allowed (2-50 characters)" 
              maxLength="50" 
            />
            <input 
              name="lastName" 
              placeholder="LAST NAME *" 
              required 
              value={formData.lastName} 
              onChange={handleInputChange} 
              pattern="^[A-Za-z\s]{2,50}$" 
              title="Only letters and spaces allowed (2-50 characters)" 
              maxLength="50" 
            />
          </div>
          <input 
            name="email" 
            type="email" 
            placeholder="EMAIL *" 
            required 
            value={formData.email} 
            onChange={handleInputChange} 
            maxLength="100" 
          />
          <input 
            name="phone" 
            type="tel" 
            placeholder="PHONE *" 
            required 
            value={formData.phone} 
            onChange={handleInputChange} 
            pattern="^\+?[0-9\s\-]{10,15}$" 
            title="Enter a valid phone number (10-15 digits)" 
            maxLength="15" 
          />

          <h3>Shipping Address</h3>
          <input 
            name="street" 
            placeholder="STREET ADDRESS *" 
            required 
            value={formData.street} 
            onChange={handleInputChange} 
            minLength="5" 
            maxLength="150" 
            title="Enter complete street address (min 5 characters)"
          />
          <div className="form-row-3">
            <input 
              name="city" 
              placeholder="CITY *" 
              required 
              value={formData.city} 
              onChange={handleInputChange} 
              pattern="^[A-Za-z\s\.\-]{2,50}$" 
              title="Enter a valid city name" 
              maxLength="50" 
            />
            <input 
              name="postalCode" 
              placeholder="POSTAL CODE *" 
              required 
              value={formData.postalCode} 
              onChange={handleInputChange} 
              pattern="^[A-Za-z0-9\s\-]{3,10}$" 
              title="Enter a valid postal or zip code (3-10 characters)" 
              maxLength="10" 
            />
            
            {/* 🌍 COMPREHENSIVE COUNTRY SELECTION WITH SECURITY */}
            <select 
              name="country" 
              required 
              value={formData.country} 
              onChange={handleInputChange}
              className="country-dropdown-select"
              title="Select your destination country"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "0px",
                backgroundColor: "#fff",
                fontSize: "0.85rem",
                outline: "none",
                appearance: "auto",
                fontFamily: "inherit"
              }}
            >
              <option value="" disabled>Select Country *</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Botswana">Botswana</option>
              <option value="Brazil">Brazil</option>
              <option value="Brunei">Brunei</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cabo Verde">Cabo Verde</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Eswatini">Eswatini</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Greece">Greece</option>
              <option value="Grenada">Grenada</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Laos">Laos</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="North Korea">North Korea</option>
              <option value="North Macedonia">North Macedonia</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Qatar">Qatar</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="Sao Tome and Principe">Sao Tome and Principe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Korea">South Korea</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Togo">Togo</option>
              <option value="Tonga">Tonga</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Vatican City">Vatican City</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
          </div>

          <h3>Order Notes</h3>
          <textarea 
            name="notes" 
            placeholder="Any special instructions or delivery requirements..." 
            value={formData.notes} 
            onChange={handleInputChange} 
            maxLength="500" 
          />

          <button type="submit" className="submit-order-btn" disabled={loading}>
            {loading ? "PROCESSING ORDER..." : isInternational ? "SUBMIT INTERNATIONAL ORDER REQUEST →" : "SUBMIT ORDER REQUEST →"}
          </button>
        </div>

        <div className="checkout-right">
          <div className="summary-header-row">
            <h3>Order Summary</h3>
            <span className="exchange-badge">(1 USD ≈ {exchangeRate.toFixed(1)} PKR)</span>
          </div>

          {isOnlinePayment && (
            <div style={{ backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", padding: "12px", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>💳</span>
              <div>
                <p style={{ margin: "0 0 4px 0", color: "#3730a3", fontWeight: "bold", fontSize: "0.9rem" }}>Payment Initiated Online</p>
                <p style={{ margin: 0, color: "#4f46e5", fontSize: "0.8rem", lineHeight: "1.4" }}>
                  You have chosen to pay via online transfer. Your quantity has been locked for this transaction.
                </p>
              </div>
            </div>
          )}

          <div className="summary-item-list">
            {displayCart.map((item, index) => (
              <div key={index} className="summary-item" style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }} />
                
                <div className="summary-item-details" style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#111", fontSize: "0.95rem" }}>{item.name}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    
                    <div style={{ 
                      display: "flex", alignItems: "center", border: "1px solid #ddd", 
                      borderRadius: "6px", overflow: "hidden", 
                      backgroundColor: isOnlinePayment ? "#f5f5f5" : "#fff",
                      opacity: isOnlinePayment ? 0.6 : 1,
                    }}>
                      <button 
                        type="button" 
                        disabled={isOnlinePayment}
                        onClick={() => handleQuantityChange(item, 'dec')}
                        style={{ padding: "5px 12px", border: "none", background: "transparent", cursor: isOnlinePayment ? "not-allowed" : "pointer", fontSize: "1.1rem", color: "#555" }}
                      >-</button>
                      
                      <span style={{ padding: "5px 12px", fontSize: "0.9rem", fontWeight: "600", minWidth: "20px", textAlign: "center", borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd" }}>
                        {item.quantity}
                      </span>
                      
                      <button 
                        type="button" 
                        disabled={isOnlinePayment}
                        onClick={() => handleQuantityChange(item, 'inc')}
                        style={{ padding: "5px 12px", border: "none", background: "transparent", cursor: isOnlinePayment ? "not-allowed" : "pointer", fontSize: "1.1rem", color: "#555" }}
                      >+</button>
                    </div>

                    <div className="summary-item-price" style={{ textAlign: "right" }}>
                      <span style={{ display: "block", fontSize: "0.95rem", color: "#111" }}>${(item.price * item.quantity).toFixed(2)}</span>
                      <small className="pkr-price-text" style={{ color: "#16a34a", fontWeight: "600", fontSize: "0.75rem" }}>
                        {formatPKR(item.price * item.quantity)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals" style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <div className="total-row">
              <span>Subtotal</span>
              <span style={{ textAlign: "right" }}>
                ${calculatedSubtotal.toFixed(2)}
                <small className="pkr-price-text">{formatPKR(calculatedSubtotal)}</small>
              </span>
            </div>

            <div className="total-row">
              <span>Shipping</span>
              <span style={{ textAlign: "right" }}>
                {isInternational ? (
                  <span className="intl-shipping-text">Calculated Manually <small className="intl-shipping-sub">Billed Separately</small></span>
                ) : shippingCost === 0 ? "Complimentary" : `$${shippingCost.toFixed(2)}`}

                {!isInternational && shippingCost > 0 && (
                  <small className="pkr-price-text">{formatPKR(shippingCost)}</small>
                )}
              </span>
            </div>

            <hr />

            <div className="total-row total-bold">
              <span>Total</span>
              <span style={{ textAlign: "right" }}>
                ${calculatedTotal.toFixed(2)}
                <small className="pkr-total-text">
                  {formatPKR(calculatedTotal)} {isInternational ? "+ Custom DC" : ""}
                </small>
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;