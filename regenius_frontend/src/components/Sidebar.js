import React from "react";
import { COLORS } from "../theme";
import {
  MdBuild,     // Repair Hub
  MdReplay,    // Reuse & Exchange
  MdRecycling, // Resource Recovery
  MdPieChart,  // Dashboard/Impact Tracker
  MdPeople,    // Community
  MdLogout     // Logout
} from "react-icons/md";

// Sidebar navigation: dashboard-centric, with eco-modern circular icons.
const navItems = [
  { label: "Dashboard", icon: <MdPieChart size={22}/>, to: "/" },
  { label: "Repair Hub", icon: <MdBuild size={22}/>, to: "/repair" },
  { label: "Reuse & Exchange", icon: <MdReplay size={22}/>, to: "/reuse" },
  { label: "Resource Recovery", icon: <MdRecycling size={22}/>, to: "/recycle" },
  { label: "Impact Tracker", icon: <MdPieChart size={22}/>, to: "/impact" },
  { label: "Community", icon: <MdPeople size={22}/>, to: "/community" },
];

export function Sidebar({ current, onNavigate }) {
  return (
    <nav style={{
      width: 82,
      background: COLORS.primary,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "2px 0 10px rgba(32,106,57,.10)",
      paddingTop: 32
    }}>
      {navItems.map(item => (
        <div
          key={item.label}
          title={item.label}
          onClick={() => onNavigate(item.to)}
          style={{
            margin: "18px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: current === item.to ? COLORS.accent : COLORS.textInverse,
            cursor: "pointer",
            borderRadius: "50%",
            background: current === item.to && COLORS.background,
            width: 48,
            height: 48,
            justifyContent: "center",
            fontWeight: current === item.to ? "bold" : "normal",
            boxShadow: current === item.to ? "0 2px 6px #6ab18733" : undefined,
            transition: "all .18s"
          }}
        >
          {item.icon}
          <span style={{
            fontSize: "0.85rem",
            marginTop: 2,
            letterSpacing: "0.01em",
            display: "none"
          }}>{item.label}</span>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{
        marginBottom: 22,
        color: COLORS.secondary,
        cursor: "pointer"
      }}>
        <MdLogout size={22} />
      </div>
    </nav>
  );
}
