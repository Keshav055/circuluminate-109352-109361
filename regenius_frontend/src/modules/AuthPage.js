import React, { useState } from "react";
import { Card } from "../components/Card";
import { GreenButton } from "../components/GreenButton";
import { FormField } from "../components/FormField";
import { COLORS, SHADOW, RADIUS } from "../theme";
import { TbBrandGoogle, TbBrandApple } from "react-icons/tb";

/**
 * API_BASE is the base URL for backend API requests.
 * Always use this when making fetch() calls to the backend!
 * Example: fetch(`${API_BASE}/api/auth/login`, ...)
 */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// PUBLIC_INTERFACE
export function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [fields, setFields] = useState({
    email: "", password: "", confirm: "", name: "",
  });
  const [errors, setErrors] = useState({});

  // PUBLIC_INTERFACE
  function handleField(e) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(errors => ({ ...errors, [e.target.name]: undefined }));
  }

  function validate() {
    const e = {};
    if (!fields.email) e.email = "Email required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = "Must be valid email address.";
    if (!fields.password) e.password = "Password required.";
    else if (fields.password.length < 6)
      e.password = "6+ characters needed.";
    if (mode === "signup") {
      if (!fields.name) e.name = "Name required.";
      if (!fields.confirm) e.confirm = "Confirm your password.";
      else if (fields.confirm !== fields.password)
        e.confirm = "Passwords do not match.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    // Example for real login:
    // fetch(`${API_BASE}/api/auth/login`, { ... })
    //   .then(...)...
    // call onAuth callback for demo (actual API elsewhere)
    onAuth?.({ ...fields, mode });
  }

  // PUBLIC_INTERFACE
  function handleSSO(provider) {
    // Note: would redirect to OAuth flow in full app.
    alert("Demo: Would start SSO with " + provider); // For prototype, not prod
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(132deg,#e8faee 0%,#fffbe6 97%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Card style={{
        maxWidth: 340,
        width: "95vw",
        margin: "4vh auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: SHADOW,
      }}>
        <h2 style={{
          marginBottom: 25, color: COLORS.primary, fontWeight: 700, letterSpacing: ".01em"
        }}>{mode === "login" ? "Welcome back" : "Create your ReGenius account"}</h2>
        <form autoComplete="off" onSubmit={handleSubmit} style={{ width: "100%" }}>
          {mode === "signup" &&
            <FormField
              label="Name"
              name="name"
              value={fields.name}
              onChange={handleField}
              required
              error={errors.name}
            />}
          <FormField
            label="Email"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleField}
            required
            error={errors.email}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={fields.password}
            onChange={handleField}
            required
            error={errors.password}
          />
          {mode === "signup" &&
            <FormField
              label="Confirm password"
              name="confirm"
              type="password"
              value={fields.confirm}
              onChange={handleField}
              required
              error={errors.confirm}
            />}
          <GreenButton
            style={{ width: "100%", marginTop: 8, marginBottom: 10 }}
            type="submit"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </GreenButton>
        </form>
        <div style={{ fontSize: "0.95em", marginBottom: 16 }}>
          {mode === "login"
            ? <>
                New to ReGenius?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setErrors({}); }}
                  style={{
                    color: COLORS.accent, background: "none", border: "none",
                    cursor: "pointer", textDecoration: "underline"
                  }}>Create account</button>
              </>
            : <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setErrors({}); }}
                  style={{
                    color: COLORS.accent, background: "none", border: "none",
                    cursor: "pointer", textDecoration: "underline"
                  }}>Log in</button>
              </>
          }
        </div>
        <div style={{
          borderTop: `1px solid ${COLORS.accent}33`,
          margin: "12px 0 22px", width: "85%"
        }}></div>
        <div style={{
          display: "flex", gap: 14, justifyContent: "center", marginBottom: 8
        }}>
          <button
            onClick={() => handleSSO("Google")}
            type="button"
            style={{
              background: COLORS.background,
              border: `1px solid ${COLORS.accent}`,
              borderRadius: "50%",
              width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginRight: 2, cursor: "pointer"
            }}>
            <TbBrandGoogle size={23} color="#DB4437" />
          </button>
          <button
            onClick={() => handleSSO("Apple")}
            type="button"
            style={{
              background: COLORS.background,
              border: `1px solid ${COLORS.accent}`,
              borderRadius: "50%",
              width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer"
            }}>
            <TbBrandApple size={23} color="#111" />
          </button>
        </div>
        <div style={{ color: COLORS.text, fontSize: 13, opacity: .65 }}>
          By continuing, you agree to our <a href="#" style={{ color: COLORS.accent }}>Terms</a>.
        </div>
      </Card>
    </div>
  );
}
