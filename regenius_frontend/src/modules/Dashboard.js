import React from "react";
import { Card } from "../components/Card";
import { COLORS, SHADOW } from "../theme";

/**
 * API_BASE is the base URL for backend API requests.
 * Always use this when making fetch() calls to the backend!
 * Example: fetch(`${API_BASE}/api/dashboard/data`, ...)
 */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// Simple circular score dial widget (no package needed)
function ScoreDial({ score }) {
  const percent = Math.min(Math.max(score, 0), 100);
  const size = 100, stroke = 11, r = (size / 2) - (stroke / 2);
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percent / 100);
  return (
    <svg width={size} height={size} style={{ display: "block", margin: "12px auto" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={COLORS.accent}
        strokeWidth={stroke}
        fill="none"
        style={{ opacity: 0.15 }}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={COLORS.primary}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset .5s",
          filter: "drop-shadow(0 4px 20px #206a3920)"
        }}
      />
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        fontSize={27}
        fontWeight={700}
        fill={COLORS.primary}
      >
        {score}
      </text>
    </svg>
  );
}

export function Dashboard({ user }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gridGap: "2vw",
      alignItems: "start",
      padding: "24px 0",
      maxWidth: 1250,
      margin: "0 auto"
    }}>
      <div>
        <Card style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 44 }}>
          <ScoreDial score={user ? user.circularityScore : 78} />
          <div>
            <div style={{
              fontSize: "2rem", fontWeight: 700,
              color: COLORS.primary, marginBottom: 4
            }}>
              Circularity: <span style={{ color: COLORS.secondary }}>{user ? user.circularityScore : 78}</span>
            </div>
            <div style={{
              fontSize: "1.05rem",
              color: COLORS.text,
              opacity: .82,
              marginBottom: 12
            }}>
              You're above the community average! Keep going for more impact points & rewards!
            </div>
          </div>
        </Card>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18
        }}>
          <Card>
            <b style={{ color: COLORS.secondary }}>5</b> items repaired <br />
            <span style={{ fontSize: 13, color: "#888" }}>last month</span>
          </Card>
          <Card>
            <b style={{ color: COLORS.secondary }}>3</b> objects exchanged<br />
            <span style={{ fontSize: 13, color: "#888" }}>+9 kg emissions saved</span>
          </Card>
          <Card>
            <b style={{ color: COLORS.secondary }}>2</b> community events<br />
            <span style={{ fontSize: 13, color: "#888" }}>joined</span>
          </Card>
        </div>
      </div>
      <div>
        <Card>
          <div style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 7 }}>
            Eco-Tip
          </div>
          <div style={{ color: "#3A705C", fontSize: "1.09rem" }}>
            Clean your air filter monthly for optimized energy and longer lifespan!
          </div>
        </Card>
        <Card>
          <div style={{
            fontWeight: 700, color: COLORS.primary, marginBottom: 7
          }}>Goals</div>
          <ul style={{ margin: 0, paddingLeft: 17 }}>
            <li>List 1 item for exchange this week</li>
            <li>Attend a skills workshop</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
