import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css"; 
import { HelmetProvider } from "react-helmet-async"; // 🟢 SEO ke liye import kiya

const rootElement = document.getElementById("root");

// App ke structure ko ek variable mein rakh liya taake code clean rahe
const appComponent = (
  <React.StrictMode>
    <HelmetProvider> 
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Agar HTML pehle se pre-render ho chuki hai (react-snap/Googlebot ke zariye)
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appComponent);
} else {
  // Normal React rendering
  const root = createRoot(rootElement);
  root.render(appComponent);
}