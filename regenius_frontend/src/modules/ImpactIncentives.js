import React, { useState } from "react";
import { Card } from "../components/Card";
import { GreenButton } from "../components/GreenButton";
import { COLORS } from "../theme";
import {
  MdCardGiftcard, MdEmojiEvents, MdBarChart, MdLeaderboard,
  MdStars, MdLocalActivity, MdNature, MdCheckCircle, MdArrowUpward
} from "react-icons/md";

// --- DEMO DATA ---
const initialTokens = [
  { type: "Repair Token", qty: 12, icon: <MdBuild style={{ color: COLORS.primary, fontSize: 24 }} /> },
  { type: "Reuse Token", qty: 7, icon: <MdReplay style={{ color: COLORS.accent, fontSize: 24 }} /> },
  { type: "Recycle Token", qty: 10, icon: <MdRecycling style={{ color: COLORS.secondary, fontSize: 24 }} /> }
];
const initialBadges = [
  { name: "Eco Rookie", level: 1, desc: "First repair completed", icon: <MdCardGiftcard style={{ color: "#369d6a", fontSize: 27 }} /> },
  { name: "Circular Trailblazer", level: 2, desc: "5+ eco actions", icon: <MdStars style={{ color: "#fa7b00", fontSize: 29 }} /> },
  { name: "Zero Waste Champ", level: 3, desc: "10+ items recycled", icon: <MdNature style={{ color: "#ffa600", fontSize: 27 }} /> },
];
const challenges = [
  { id: 1, title: "Fix 3 items in 2 weeks", progress: 2, goal: 3, reward: 2, completed: false },
  { id: 2, title: "Host an eco-community event", progress: 1, goal: 1, reward: 3, completed: true },
  { id: 3, title: "Recycle 5 plastics this month", progress: 5, goal: 5, reward: 1, completed: true }
];
const initLeaderboard = [
  { rank: 1, name: "GreenQueen92", score: 151, avatar: "🦋" },
  { rank: 2, name: "EcoHero22", score: 120, avatar: "🌿" },
  { rank: 3, name: "Jane G.", score: 110, avatar: "🍃" },
  { rank: 4, name: "You", score: 101, avatar: "🌱" },
  { rank: 5, name: "RepairGuy", score: 98, avatar: "🔧" }
];

function ProgressBar({ value, max, color, label, height = 11 }) {
  const percent = Math.min(100, Math.round(100 * value / max));
  return (
    <div style={{ width: "100%", background: "#e9f5e2", borderRadius: 9, height, position: "relative", marginTop: 4, marginBottom: 7 }}>
      <div style={{
        background: color || COLORS.secondary, height, width: percent + "%",
        borderRadius: 9, transition: "width 0.4s"
      }} />
      <div style={{
        position: "absolute", left: 9, top: -1, color: "#156b3e",
        fontSize: 12, fontWeight: 600
      }}>{label || percent + "%"}</div>
    </div>
  );
}

function ImpactChart({ progressHistory }) {
  // Simple line chart SVG demo
  // progressHistory: array of numbers representing impact points per week
  const maxVal = Math.max(...progressHistory, 1);
  const w = 210, h = 68, pad = 16;
  const pts = progressHistory.map((val, i, arr) => [
    pad + ((w - 2 * pad) * i) / (arr.length - 1),
    h - pad - ((h - 2 * pad) * val) / maxVal
  ]);
  return (
    <svg width={w} height={h} style={{ background: "#f8fff2", borderRadius: 11 }}>
      <polyline
        fill="none"
        stroke={COLORS.secondary}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts.map(([x, y]) => x + "," + y).join(" ")}
      />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4.5} fill={COLORS.accent} stroke="#fff" strokeWidth="2" />
      ))}
    </svg>
  );
}

// PUBLIC_INTERFACE
export function ImpactIncentives({ user }) {
  // Local demo state hooks
  const [tokens, setTokens] = useState(initialTokens);
  const [badges, setBadges] = useState(initialBadges);
  const [currentChallenges, setChallenges] = useState(challenges);
  const [progressHistory, setProgressHistory] = useState([4, 6, 7, 7, 12, 17, 22, 28, 36, 44, 54, 64]);
  const [leaderboard] = useState(initLeaderboard);
  const [feedback, setFeedback] = useState("");

  // Demo: Complete a challenge, earn token & badge
  function handleProgressChallenge(id) {
    setChallenges(chs =>
      chs.map(ch =>
        ch.id === id && !ch.completed
          ? { ...ch, progress: Math.min(ch.progress + 1, ch.goal), completed: ch.progress + 1 >= ch.goal }
          : ch
      )
    );
    setProgressHistory(hist => [...hist.slice(1), hist[hist.length - 1] + 5 + Math.floor(Math.random() * 5)]);
    setFeedback("Great job! Progress updated 🎉");
    setTimeout(() => setFeedback(""), 1200);
    // Reward: add a new token if completed
    const ch = currentChallenges.find(c => c.id === id);
    if (ch && ch.progress + 1 >= ch.goal && !ch.completed) {
      setTokens(ts => ts.map(t =>
        t.type.includes("Repair") && ch.title.toLowerCase().includes("fix")
          ? { ...t, qty: t.qty + ch.reward }
          : t
      ));
      setBadges(bds =>
        ch.title.includes("event") && !bds.some(b => b.name === "Eco Event Host")
          ? [...bds, { name: "Eco Event Host", level: 2, desc: "Hosted an eco event", icon: <MdLocalActivity style={{ color: "#ffa600", fontSize: 25 }} /> }]
          : bds
      );
    }
  }

  return (
    <div style={{ maxWidth: 1220, margin: "0 auto", padding: "10px 2vw" }}>
      <h2 style={{
        display: "flex", alignItems: "center", gap: 13,
        color: COLORS.primary, fontWeight: 800, fontSize: "2rem", letterSpacing: ".01em", marginBottom: 10
      }}>
        <MdCardGiftcard size={35} style={{ opacity: 0.85 }} /> Impact & Incentives
      </h2>
      <div style={{
        color: "#326f49", fontSize: 18, opacity: .92, marginBottom: 22,
        fontWeight: 500
      }}>
        Track your eco-impact, earn tokens & badges, tackle new challenges. Rise up the leaderboard and help your community grow greener!
      </div>
      {feedback &&
        <div style={{
          background: "#e8f7d6",
          color: "#0d8846",
          fontWeight: 600,
          borderRadius: 10,
          marginBottom: 15,
          fontSize: 15,
          padding: "8px 20px",
          maxWidth: 400
        }}>
          <MdCheckCircle style={{ color: COLORS.accent, marginRight: 6 }} />
          {feedback}
        </div>
      }
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: 30, alignItems: "start"
      }}>
        {/* TOKENS & BADGES */}
        <div>
          <Card>
            <div style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 8, fontSize: 19, display: "flex", alignItems: "center", gap: 7 }}>
              <MdCardGiftcard style={{ color: COLORS.secondary }} />Impact Tokens
            </div>
            <div style={{ display: "flex", gap: 15, flexWrap: "wrap", alignItems: "center" }}>
              {tokens.map(tk =>
                <div key={tk.type}
                  style={{
                    background: "#f3fbf6", borderRadius: 13, padding: "9px 17px", margin: "9px 0",
                    display: "flex", alignItems: "center", gap: 7, minWidth: 92,
                    border: `1.6px solid ${COLORS.accent}22`, boxShadow: "0 1px 5px #c2fadc25"
                  }}>
                  <span>{tk.icon}</span>
                  <span style={{ fontWeight: 700, color: COLORS.accent, fontSize: 18 }}>{tk.qty}</span>
                  <span style={{
                    color: COLORS.primary, marginLeft: 7,
                    fontSize: 13, fontWeight: 600, opacity: 0.93
                  }}>{tk.type}</span>
                </div>
              )}
            </div>
          </Card>
          <Card style={{ marginTop: 13, background: "#fafbe6" }}>
            <div style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 8, fontSize: 19, display: "flex", alignItems: "center", gap: 7 }}>
              <MdEmojiEvents style={{ color: COLORS.secondary }} />Progress Badges
            </div>
            <div style={{ display: "flex", gap: 17, flexWrap: "wrap" }}>
              {badges.map(bdg =>
                <div key={bdg.name}
                  style={{
                    background: "#fffcea",
                    borderRadius: 11, padding: "7px 15px",
                    color: COLORS.secondary, display: "flex", alignItems: "center", gap: 8,
                    border: `1.1px solid ${COLORS.accent}22`
                  }}>
                  <span>{bdg.icon}</span>
                  <span style={{ fontWeight: 700, color: COLORS.secondary }}>{bdg.name}</span>
                  <span style={{ color: "#359270", fontWeight: 600, fontSize: 13, marginLeft: 5 }}>{bdg.desc}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
        {/* CHALLENGES & IMPACT CHART */}
        <div>
          <Card>
            <div style={{ fontWeight: 700, color: COLORS.accent, marginBottom: 8, fontSize: 19, display: "flex", alignItems: "center", gap: 7 }}>
              <MdBarChart /> Ongoing Challenges & Progress
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {currentChallenges.map(ch =>
                <li key={ch.id}
                  style={{
                    background: ch.completed ? "#f3fcf8" : "#eafce8",
                    borderRadius: 12,
                    marginBottom: 12, padding: "9px 12px",
                    border: ch.completed
                      ? `1.3px solid ${COLORS.accent}22`
                      : `1.3px solid ${COLORS.secondary}22`,
                    boxShadow: ch.completed ? "0 1px 6px #ffa60023" : "none"
                  }}>
                  <div style={{
                    color: ch.completed ? COLORS.secondary : COLORS.primary,
                    fontWeight: 600, fontSize: 15
                  }}>
                    <span>{ch.completed ? <MdCheckCircle style={{ color: COLORS.secondary, verticalAlign: "-10%" }} /> : <MdArrowUpward style={{ color: COLORS.primary, verticalAlign: "-13%" }} />}</span>
                    {ch.title}
                  </div>
                  <ProgressBar
                    value={ch.progress}
                    max={ch.goal}
                    color={ch.completed ? COLORS.secondary : COLORS.primary}
                    label={ch.completed ? "Completed!" : (ch.progress + " / " + ch.goal)}
                    height={10}
                  />
                  <div style={{ fontSize: 13, color: "#78985e", marginTop: -3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Reward: <b style={{ color: COLORS.secondary }}>{ch.reward} token{ch.reward > 1 ? "s" : ""}</b>
                    {!ch.completed && (
                      <GreenButton
                        style={{
                          background: "#79dea2", color: "#233",
                          fontSize: 13, padding: "4px 15px", marginLeft: 9
                        }}
                        onClick={() => handleProgressChallenge(ch.id)}
                      >Mark Progress</GreenButton>
                    )}
                  </div>
                  {ch.completed &&
                    <div style={{
                      color: COLORS.secondary, marginTop: 3, fontWeight: 500, fontSize: 13
                    }}>Challenge completed! Claim your badge & tokens above.</div>
                  }
                </li>
              )}
            </ul>
          </Card>
          <Card style={{ marginTop: 13, textAlign: "center", background: "#eafaf3" }}>
            <div style={{ fontWeight: 700, color: COLORS.accent, marginBottom: 5, fontSize: 17, display: "flex", alignItems: "center", gap: 7, justifyContent: "center" }}>
              <MdLeaderboard /> Impact Over Time
            </div>
            <ImpactChart progressHistory={progressHistory} />
            <div style={{ color: "#13836e", fontSize: 13.5, marginTop: 8 }}>
              Your eco-actions for the year (weekly points)
            </div>
          </Card>
        </div>
        {/* LEADERBOARD */}
        <div>
          <Card style={{ background: "#fffbee" }}>
            <div style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 8, fontSize: 19, display: "flex", alignItems: "center", gap: 7 }}>
              <MdLeaderboard style={{ color: COLORS.secondary }} />Leaderboard
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {leaderboard.map(l => (
                <li key={l.rank}
                  style={{
                    background: l.name === "You" ? "#e3f5d8" : "#f8faf9",
                    padding: "7px 12px", marginBottom: 6,
                    borderRadius: 10, display: "flex", alignItems: "center", gap: 9
                  }}>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: l.rank === 1 ? "#f3c107" : COLORS.secondary,
                    width: 17, display: "inline-block"
                  }}>{l.rank}</span>
                  <span style={{ fontSize: 22 }}>{l.avatar}</span>
                  <span style={{
                    fontWeight: l.name === "You" ? 700 : 600,
                    color: l.name === "You" ? COLORS.accent : "#299c5b",
                    minWidth: 80
                  }}>{l.name}</span>
                  <span style={{ color: COLORS.primary, marginLeft: "auto", fontSize: 15, fontWeight: 700 }}>
                    {l.score} pts
                  </span>
                  {l.name === "You" &&
                    <span style={{
                      marginLeft: 9,
                      background: "#67dda1", color: "#fff",
                      borderRadius: 7, padding: "2px 8px", fontSize: 13
                    }}>You</span>
                  }
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 8, color: "#ffb800", fontWeight: 600, fontSize: 14 }}>
              Compete & inspire others to grow your eco-impact!
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Icons for tokens/badges at top
function MdBuild(props) { return <span role="img" aria-label="repair" {...props}>🛠️</span> }
function MdReplay(props) { return <span role="img" aria-label="reuse" {...props}>🔁</span> }
function MdRecycling(props) { return <span role="img" aria-label="recycle" {...props}>♻️</span> }
