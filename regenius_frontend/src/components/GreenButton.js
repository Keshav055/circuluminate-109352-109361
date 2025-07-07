import React from "react";
import { COLORS, RADIUS } from "../theme";

/** Green, circular, eco-friendly button */
export function GreenButton({ children, style, disabled, ...props }) {
  return (
    <button
      style={{
        background: disabled ? "#C7EAC7" : COLORS.primary,
        color: COLORS.textInverse,
        border: "none",
        borderRadius: RADIUS.pill,
        fontWeight: 600,
        padding: "10px 28px",
        fontSize: "1rem",
        letterSpacing: "0.01em",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 1px 8px #206a3922",
        transition: "background .21s",
        ...style
      }}
      aria-disabled={disabled}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
