import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function MainLayout({ current, setCurrent, children, onSearch, notifications, onProfile }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fcfcfb" }}>
      <Sidebar current={current} onNavigate={setCurrent} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar
          notifications={notifications}
          onSearch={onSearch}
          onProfile={onProfile}
        />
        <div style={{ flex: 1, padding: "36px max(2vw,16px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
