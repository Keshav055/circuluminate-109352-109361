import React from "react";
import { COLORS, RADIUS, SHADOW } from "../theme";

/** Card component for all module and dashboard areas, with subtle shadow, round corners. */
export function Card({ children, style, ...props }) {
  return (
    <div
      style={{
        background: COLORS.card,
        borderRadius: RADIUS.card,
        boxShadow: SHADOW,
        padding: 24,
        margin: "10px 0",
        width: "100%",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
