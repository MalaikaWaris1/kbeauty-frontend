// // src/context/AppContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import API from "../api/axios";

// export const AppContext = createContext();

// const adminChannel = new BroadcastChannel("admin_data_sync");

// export const AppProvider = ({ children }) => {
//   // 👤 CUSTOMER USER STATE & LOGOUT FUNCTIONALITY
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("userData") || localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const logoutUser = () => {
//     localStorage.removeItem("userAccessToken");
//     localStorage.removeItem("userRefreshToken");
//     localStorage.removeItem("userData");
//     // Purani backup keys ki safai
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");

//     setUser(null);
//     setWishlist([]);
//     window.location.href = "/auth";
//   };

//   const [products, setProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);

//   const [videoGalleryData, setVideoGalleryData] = useState([]);
//   const [loadingStories, setLoadingStories] = useState(true);

//   const [instagramPosts, setInstagramPosts] = useState([]);
//   const [loadingInstagramPosts, setLoadingInstagramPosts] = useState(true);

//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem("luxury_cart");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const [wishlist, setWishlist] = useState(() => {
//     const savedWishlist = localStorage.getItem("luxury_wishlist");
//     return savedWishlist ? JSON.parse(savedWishlist) : [];
//   });

//   const [toast, setToast] = useState({ show: false, name: "", image: "", quantity: 0 });

//   const [exchangeRate, setExchangeRate] = useState(278); 

//   const [saleData, setSaleData] = useState({
//     isActive: true,
//     subtitle: "LIMITED OCCURRENCE",
//     title: "The Solstice Flash Sale",
//     description: "Up to 30% off the archival edit. 48 hours only, while stocks last.",
//     buttonText: "SHOP THE ARCHIVE",
//     endTime: "2026-08-30T23:59:59",
//     bannerColor: "#F3DCD3",
//     featuredProducts: [],
//     latestProducts: [],
//     products: [],
//     archiveProducts: []
//   });

//   useEffect(() => {
//     fetch("https://open.er-api.com/v6/latest/USD")
//       .then(res => res.json())
//       .then(data => {
//         if (data && data.rates && data.rates.PKR) {
//           setExchangeRate(data.rates.PKR);
//         }
//       })
//       .catch(err => console.error("Exchange rate fetch failed, using fallback:", err));
//   }, []);

//   // 🟢 Optimized Data Fetching (isInitial True sirf pehli baar loading dikhayega)
//   const fetchProducts = async (isInitial = false) => {
//     try {
//       if (isInitial) setLoadingProducts(true);
//       const response = await API.get("/products");
//       const data = response.data.products || response.data;
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Failed to load live products:", error.message);
//     } finally {
//       if (isInitial) setLoadingProducts(false);
//     }
//   };

//   const fetchStories = async (isInitial = false) => {
//     try {
//       if (isInitial) setLoadingStories(true);
//       const response = await API.get("/stories");
//       const data = Array.isArray(response.data) ? response.data : response.data.stories || [];
//       setVideoGalleryData(data);
//     } catch (error) {
//       console.error("Failed to load live stories:", error.message);
//     } finally {
//       if (isInitial) setLoadingStories(false);
//     }
//   };

//   const fetchInstagramPosts = async (isInitial = false) => {
//     try {
//       if (isInitial) setLoadingInstagramPosts(true);
//       const response = await API.get("/instagram"); 
//       const data = Array.isArray(response.data) ? response.data : response.data.posts || [];
//       setInstagramPosts(data);
//     } catch (error) {
//       console.error("Failed to load live instagram posts:", error.message);
//     } finally {
//       if (isInitial) setLoadingInstagramPosts(false);
//     }
//   };

//   const fetchActiveSale = async () => {
//     try {
//       const response = await API.get("/sale/active").catch(() => API.get("/sales/active"));
//       if (response && response.data) {
//         const data = response.data;
//         const activeProducts = data.featuredProducts || data.latestProducts || data.products || [];

//         setSaleData({
//           isActive: data.isActive ?? true,
//           subtitle: data.miniTitle || data.subtitle || "LIMITED OCCURRENCE",
//           title: data.mainTitle || data.title || "The Solstice Flash Sale",
//           description: data.description || "Up to 30% off the archival edit.",
//           buttonText: "SHOP THE ARCHIVE",
//           endTime: data.endDate || data.endTime || "2026-08-30T23:59:59",
//           bannerColor: data.bannerColor || "#F3DCD3",
//           featuredProducts: activeProducts,
//           latestProducts: activeProducts,
//           products: activeProducts,
//           archiveProducts: data.archiveProducts || []
//         });
//       }
//     } catch (error) {
//       console.warn("Using default static sale data:", error.message);
//     }
//   };

//   useEffect(() => {
//     // ⚡ First load with loading indicators
//     const syncAllDataInitial = () => {
//       fetchProducts(true);
//       fetchStories(true);
//       fetchInstagramPosts(true);
//       fetchActiveSale();
//     };

//     // 🤫 Background Sync without triggering loading state (prevents repeated loading screens)
//     const syncAllDataSilent = () => {
//       fetchProducts(false);
//       fetchStories(false);
//       fetchInstagramPosts(false);
//       fetchActiveSale();
//     };

//     syncAllDataInitial();

//     const handleFocus = () => syncAllDataSilent();
//     window.addEventListener("focus", handleFocus);

//     adminChannel.onmessage = (event) => {
//       if (event.data === "REFETCH_DATA") syncAllDataSilent();
//     };

//     return () => window.removeEventListener("focus", handleFocus);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("luxury_cart", JSON.stringify(cart));
//   }, [cart]);

//   useEffect(() => {
//     localStorage.setItem("luxury_wishlist", JSON.stringify(wishlist));
//   }, [wishlist]);

//   const addToCart = (product, quantity) => {
//     setCart((prevCart) => {
//       const pId = product._id || product.id;
//       const existingItem = prevCart.find((item) => (item._id || item.id) === pId);
//       if (existingItem) {
//         return prevCart.map((item) =>
//           (item._id || item.id) === pId ? { ...item, quantity: item.quantity + quantity } : item
//         );
//       }
//       return [...prevCart, { ...product, id: pId, quantity }];
//     });

//     setToast({ show: true, name: product.name || product.title, image: product.images?.[0] || product.image, quantity });
//     setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
//   };

//   const updateCartQuantity = (id, amount) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         (item.id || item._id) === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
//       )
//     );
//   };

//   const updateCartSize = (id, newSize) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         (item.id || item._id) === id ? { ...item, size: newSize } : item
//       )
//     );
//   };

//   const removeFromCart = (id) => {
//     setCart((prevCart) => prevCart.filter((item) => (item.id || item._id) !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem("luxury_cart");
//   };

//   const toggleWishlist = async (product) => {
//     if (!product) return;
    
//     const token = localStorage.getItem("userAccessToken") || localStorage.getItem("accessToken");
//     if (!token) {
//       if (window.confirm("Please log in to save items to your wishlist. Go to login page?")) {
//         window.location.href = "/auth";
//       }
//       return;
//     }

//     const uniqueId = product._id || product.id || product.name;
//     let isAdding = false;
    
//     setWishlist((prevWishlist) => {
//       const alreadyExists = prevWishlist.some((item) => String(item._id || item.id || item.name) === String(uniqueId));
//       if (alreadyExists) {
//         isAdding = false;
//         return prevWishlist.filter((item) => String(item._id || item.id || item.name) !== String(uniqueId));
//       } else {
//         isAdding = true;
//         return [...prevWishlist, { ...product, id: uniqueId }];
//       }
//     });

//     try {
//       if (isAdding) {
//         await API.post("/wishlist/add", { productId: uniqueId });
//       } else {
//         await API.post("/wishlist/remove", { productId: uniqueId });
//       }
//     } catch (err) {
//       console.error("Wishlist backend sync failed:", err.message);
//     }
//   };

//   const removeFromWishlist = (id, name) => {
//     setWishlist((prev) => prev.filter((item) => {
//       if (!item) return false;
//       const itemId = typeof item === 'object' ? (item.id || item._id) : item;
//       if (itemId && id && String(itemId) === String(id)) {
//         if (item.name && name) return item.name !== name;
//         return false;
//       }
//       if (item.name && name) return item.name !== name;
//       return String(itemId) !== String(id);
//     }));
//   };

//   const moveToBag = (product) => {
//     addToCart(product, 1);
//     removeFromWishlist(product.id || product._id, product.name);
//   };

//   const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
//   const wishlistCount = wishlist.length;

//   const cartSubtotal = cart.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0);
//   const cartSubtotalPKR = cartSubtotal * exchangeRate;
  
//   const shippingCost = cartSubtotal === 0 ? 0 : (cartSubtotalPKR >= 6000 ? 0 : 290 / exchangeRate);
//   const totalAmount = cartSubtotal + shippingCost;

//   return (
//     <AppContext.Provider
//       value={{
//         user,
//         logoutUser,
//         products, loadingProducts, videoGalleryData, loadingStories,
//         instagramPosts, loadingInstagramPosts, cart, wishlist,
//         exchangeRate,
//         addToCart, updateCartQuantity, updateCartSize,
//         removeFromCart, clearCart, toggleWishlist, removeFromWishlist, moveToBag,
//         cartCount, wishlistCount, toast, saleData,
//         cartSubtotal, shippingCost, totalAmount,
//         refetchProducts: () => fetchProducts(false),
//         refetchStories: () => fetchStories(false),
//         refetchInstagramPosts: () => fetchInstagramPosts(false),
//         refetchActiveSale: fetchActiveSale,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AppContext = createContext();

const adminChannel = new BroadcastChannel("admin_data_sync");

export const AppProvider = ({ children }) => {
  // 👤 CUSTOMER USER STATE & LOGOUT FUNCTIONALITY
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData") || localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const logoutUser = () => {
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("userRefreshToken");
    localStorage.removeItem("userData");
    // Purani backup keys ki safai
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setWishlist([]);
    window.location.href = "/auth";
  };

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [videoGalleryData, setVideoGalleryData] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);

  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loadingInstagramPosts, setLoadingInstagramPosts] = useState(true);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("luxury_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("luxury_wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [toast, setToast] = useState({ show: false, name: "", image: "", quantity: 0 });

  const [exchangeRate, setExchangeRate] = useState(278); 

  // 🎯 FIX 1: Default isActive ko false kar diya taake jab tak sale active na ho tab tak hidden rahe
  const [saleData, setSaleData] = useState({
    isActive: false, 
    subtitle: "LIMITED OCCURRENCE",
    title: "The Solstice Flash Sale",
    description: "Up to 30% off the archival edit. 48 hours only, while stocks last.",
    buttonText: "SHOP THE ARCHIVE",
    endTime: "2026-08-30T23:59:59",
    bannerColor: "#F3DCD3",
    featuredProducts: [],
    latestProducts: [],
    products: [],
    archiveProducts: []
  });

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.PKR) {
          setExchangeRate(data.rates.PKR);
        }
      })
      .catch(err => console.error("Exchange rate fetch failed, using fallback:", err));
  }, []);

  // 🟢 Optimized Data Fetching
  const fetchProducts = async (isInitial = false) => {
    try {
      if (isInitial) setLoadingProducts(true);
      const response = await API.get("/products");
      const data = response.data.products || response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load live products:", error.message);
    } finally {
      if (isInitial) setLoadingProducts(false);
    }
  };

  const fetchStories = async (isInitial = false) => {
    try {
      if (isInitial) setLoadingStories(true);
      const response = await API.get("/stories");
      const data = Array.isArray(response.data) ? response.data : response.data.stories || [];
      setVideoGalleryData(data);
    } catch (error) {
      console.error("Failed to load live stories:", error.message);
    } finally {
      if (isInitial) setLoadingStories(false);
    }
  };

  const fetchInstagramPosts = async (isInitial = false) => {
    try {
      if (isInitial) setLoadingInstagramPosts(true);
      const response = await API.get("/instagram"); 
      const data = Array.isArray(response.data) ? response.data : response.data.posts || [];
      setInstagramPosts(data);
    } catch (error) {
      console.error("Failed to load live instagram posts:", error.message);
    } finally {
      if (isInitial) setLoadingInstagramPosts(false);
    }
  };

  const fetchActiveSale = async () => {
    try {
      const response = await API.get("/sale/active").catch(() => API.get("/sales/active"));
      if (response && response.data) {
        const data = response.data;
        const activeProducts = data.featuredProducts || data.latestProducts || data.products || [];

        setSaleData({
          // 🎯 FIX 2: Default true ke bajaye actual value ya false use karein
          isActive: Boolean(data.isActive),
          subtitle: data.miniTitle || data.subtitle || "LIMITED OCCURRENCE",
          title: data.mainTitle || data.title || "The Solstice Flash Sale",
          description: data.description || "Up to 30% off the archival edit.",
          buttonText: "SHOP THE ARCHIVE",
          endTime: data.endDate || data.endTime || "2026-08-30T23:59:59",
          bannerColor: data.bannerColor || "#F3DCD3",
          featuredProducts: activeProducts,
          latestProducts: activeProducts,
          products: activeProducts,
          archiveProducts: data.archiveProducts || []
        });
      }
    } catch (error) {
      console.warn("Using default static sale data:", error.message);
      // Aggar API fail hoti hai toh sale active nahi hogi
      setSaleData(prev => ({ ...prev, isActive: false }));
    }
  };

  useEffect(() => {
    const syncAllDataInitial = () => {
      fetchProducts(true);
      fetchStories(true);
      fetchInstagramPosts(true);
      fetchActiveSale();
    };

    const syncAllDataSilent = () => {
      fetchProducts(false);
      fetchStories(false);
      fetchInstagramPosts(false);
      fetchActiveSale();
    };

    syncAllDataInitial();

    const handleFocus = () => syncAllDataSilent();
    window.addEventListener("focus", handleFocus);

    adminChannel.onmessage = (event) => {
      if (event.data === "REFETCH_DATA") syncAllDataSilent();
    };

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    localStorage.setItem("luxury_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("luxury_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const pId = product._id || product.id;
      const existingItem = prevCart.find((item) => (item._id || item.id) === pId);
      if (existingItem) {
        return prevCart.map((item) =>
          (item._id || item.id) === pId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, id: pId, quantity }];
    });

    setToast({ show: true, name: product.name || product.title, image: product.images?.[0] || product.image, quantity });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  const updateCartQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id || item._id) === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const updateCartSize = (id, newSize) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id || item._id) === id ? { ...item, size: newSize } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => (item.id || item._id) !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("luxury_cart");
  };

  const toggleWishlist = async (product) => {
    if (!product) return;
    
    const token = localStorage.getItem("userAccessToken") || localStorage.getItem("accessToken");
    if (!token) {
      if (window.confirm("Please log in to save items to your wishlist. Go to login page?")) {
        window.location.href = "/auth";
      }
      return;
    }

    const uniqueId = product._id || product.id || product.name;
    let isAdding = false;
    
    setWishlist((prevWishlist) => {
      const alreadyExists = prevWishlist.some((item) => String(item._id || item.id || item.name) === String(uniqueId));
      if (alreadyExists) {
        isAdding = false;
        return prevWishlist.filter((item) => String(item._id || item.id || item.name) !== String(uniqueId));
      } else {
        isAdding = true;
        return [...prevWishlist, { ...product, id: uniqueId }];
      }
    });

    try {
      if (isAdding) {
        await API.post("/wishlist/add", { productId: uniqueId });
      } else {
        await API.post("/wishlist/remove", { productId: uniqueId });
      }
    } catch (err) {
      console.error("Wishlist backend sync failed:", err.message);
    }
  };

  const removeFromWishlist = (id, name) => {
    setWishlist((prev) => prev.filter((item) => {
      if (!item) return false;
      const itemId = typeof item === 'object' ? (item.id || item._id) : item;
      if (itemId && id && String(itemId) === String(id)) {
        if (item.name && name) return item.name !== name;
        return false;
      }
      if (item.name && name) return item.name !== name;
      return String(itemId) !== String(id);
    }));
  };

  const moveToBag = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id || product._id, product.name);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const cartSubtotal = cart.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0);
  const cartSubtotalPKR = cartSubtotal * exchangeRate;
  
  const shippingCost = cartSubtotal === 0 ? 0 : (cartSubtotalPKR >= 6000 ? 0 : 290 / exchangeRate);
  const totalAmount = cartSubtotal + shippingCost;

  return (
    <AppContext.Provider
      value={{
        user,
        logoutUser,
        products, loadingProducts, videoGalleryData, loadingStories,
        instagramPosts, loadingInstagramPosts, cart, wishlist,
        exchangeRate,
        addToCart, updateCartQuantity, updateCartSize,
        removeFromCart, clearCart, toggleWishlist, removeFromWishlist, moveToBag,
        cartCount, wishlistCount, toast, saleData,
        cartSubtotal, shippingCost, totalAmount,
        refetchProducts: () => fetchProducts(false),
        refetchStories: () => fetchStories(false),
        refetchInstagramPosts: () => fetchInstagramPosts(false),
        refetchActiveSale: fetchActiveSale,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};