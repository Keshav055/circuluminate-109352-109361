import React from "react";
import { COLORS } from "../theme";
import { MdNotifications, MdSearch, MdPerson } from "react-icons/md";

// Top header: search, notifications, profile.
export function Topbar({ onSearch, onProfile, notifications }) {
  return (
    <header style={{
      width: "100%",
      minHeight: 56,
      background: COLORS.backgroundSecondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      borderBottom: `1px solid ${COLORS.accent}22`,
      boxSizing: "border-box",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
        <MdSearch color={COLORS.primary} size={22} />
        <input
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: 17,
            flex: 1,
            color: COLORS.primary
          }}
          placeholder="Search platform..."
          aria-label="Search"
          onChange={e => onSearch?.(e.target.value)}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{
          position: "relative",
          cursor: "pointer"
        }}>
          <MdNotifications size={22} color={COLORS.primary} />
          {notifications > 0 &&
            <span style={{
              position: "absolute",
              right: -7, top: -7,
              background: COLORS.secondary,
              color: COLORS.primary,
              fontSize: 11,
              padding: "2px 6px",
              borderRadius: "999px",
              fontWeight: "bold",
              lineHeight: 1,
              boxShadow: "0 1px 6px #ffa60066"
            }}>{notifications}</span>
          }
        </div>
        <div
          onClick={onProfile}
          style={{
            cursor: "pointer",
            background: COLORS.primary,
            borderRadius: "100%",
            padding: 4
          }}>
          <MdPerson size={21} color={COLORS.textInverse} />
        </div>
      </div>
    </header>
  );
}
