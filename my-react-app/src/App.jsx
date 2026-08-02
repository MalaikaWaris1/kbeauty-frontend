// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import AppLayout from "./components/layout/AppLayout";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { AppProvider } from "./context/AppContext"; // 🟢 IMPORTED
import "./App.css";
import { SaleArchive } from "./pages/SaleArchive";
import { AboutStoryPage } from "./pages/AboutStoryPage";
import { ContactUs } from "./pages/ContactUs";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import Checkout from "./pages/Checkout";
import PremiumVideoDetails from "./pages/PremiumVideoDetails";
import PurchaseHistory from "./pages/PurchaseHistory";
import ManualPayment from "./pages/ManualPayment"; // 💳 NAYA IMPORT ADD KIYA HAI

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "product/:id", element: <ProductDetail /> },
      {
        path: "sale",
        element: <SaleArchive /> 
      },
      {
        path: "about",
        element: <AboutStoryPage /> 
      },
      {
        path: "contact",
        element: <ContactUs /> 
      },
      {
        path: "auth",
        element: <AuthPage /> 
      },
      {
        path: "cart",
        element: <CartPage /> 
      },
      {
        path: "wishlist",
        element: <WishlistPage />
      },
      {
        path: "checkout",
        element: <Checkout />
      },
      {
        path: "payment-instructions", // 🟢 NAYA ROUTE ADD KIYA HAI
        element: <ManualPayment />
      },
      {
        path: "/video/:id",
        element: <PremiumVideoDetails />
      },
      {
        path: "purchase-history",
        element: <PurchaseHistory />
      }
    ],
  },
]);

const App = () => {
  return (
    <AppProvider> {/* 🟢 WRAPPED WHOLE APP WITH PROVIDER */}
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default App;