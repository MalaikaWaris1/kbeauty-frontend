import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css"; 
import { HelmetProvider } from "react-helmet-async"; // 🟢 SEO ke liye import kiya

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider> {/* 🟢 App ko HelmetProvider mein wrap kar diya */}
      <App />
    </HelmetProvider>
  </React.StrictMode>
);