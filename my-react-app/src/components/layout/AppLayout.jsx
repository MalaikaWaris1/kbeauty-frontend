// src/components/layout/AppLayout.jsx
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer"; // 🟢 Import the new footer

const AppLayout = () => {
  return (
    <>
      <Header />
      <main style={{ minHeight: "60vh", padding: "91px 0px 10px 0px" }}>
        <Outlet />
      </main>
      <Footer /> {/* 🟢 Rendered at the very bottom */}
    </>
  );
};

export default AppLayout;