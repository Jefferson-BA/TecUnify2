import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ToastProvider } from "./toast";

export default function DashboardLayout() {
  const location = useLocation();
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <ToastProvider>
      <div className="min-h-screen w-full flex bg-[var(--bg-main)] transition-colors">
  <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

  <div className="min-h-screen w-full flex bg-[var(--bg-main)] transition-colors">

  <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

  <div className="flex-1 flex flex-col"
       style={{ paddingLeft: collapsed ? "5rem" : "16rem" }}>
    
    <Navbar darkMode={dark} setDarkMode={setDark} />

    <main className="flex-1 p-6 overflow-y-auto">
      <Outlet key={location.pathname} />
    </main>
  </div>

</div>

</div>

    </ToastProvider>
  );
}
