import React from "react";
import { COLORS } from "../theme";

/** Field input with label and inline error/message display (no popups) */
export function FormField({
  label, type = "text", value, onChange, placeholder, error, required, ...props
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block",
        fontWeight: 500,
        color: COLORS.primary,
        marginBottom: 4
      }}>
        {label}{required && <span style={{ color: COLORS.secondary }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          border: `1.5px solid ${error ? COLORS.error : COLORS.accent}`,
          borderRadius: "8px",
          padding: "10px 14px",
          width: "100%",
          fontSize: "1rem",
          outline: error ? COLORS.error : COLORS.accent,
          background: "#fff"
        }}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <div style={{
          color: COLORS.error,
          fontSize: "0.95rem",
          marginTop: 4,
          fontWeight: 500,
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
