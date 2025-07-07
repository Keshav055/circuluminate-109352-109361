import React, { useState } from "react";
import { Card } from "../components/Card";
import { GreenButton } from "../components/GreenButton";
import { COLORS } from "../theme";
import { MdUploadFile, MdRefresh, MdHelpOutline, MdCheckCircle, MdRecycling, MdLocationOn } from "react-icons/md";

// Demo AI classifier categories (expand for real app)
const RECYCLE_CLASSES = [
  {
    name: "Plastic Bottle",
    rules: [
      "Rinse out before recycling.",
      "Remove cap. Place bottle in plastics bin.",
      "Local curbside recycling accepted."
    ],
    mapQuery: "plastic bottle recycling",
    icon: <MdRecycling style={{ color: "#6ab187", fontSize: 27, verticalAlign: "-16%" }} />
  },
  {
    name: "Alkaline Battery",
    rules: [
      "Do NOT place in household trash.",
      "Drop-off at battery collection point or electronics store.",
      "Check local hazardous waste hours."
    ],
    mapQuery: "battery recycling",
    icon: <MdHelpOutline style={{ color: "#ffa600", fontSize: 27, verticalAlign: "-16%" }} />
  },
  {
    name: "Paper/Cardboard",
    rules: [
      "Flatten boxes, remove tape.",
      "No greasy/soiled paper (place those in trash).",
      "Bin: mixed paper and cardboard."
    ],
    mapQuery: "paper recycling",
    icon: <MdRecycling style={{ color: "#68b481", fontSize: 25, verticalAlign: "-16%" }} />
  }
];

// Fake local recycling locations for demo map
const DEMO_LOCATIONS = [
  {
    name: "Eco Recycling Center",
    address: "123 Greenway Ave",
    lat: 37.78751, lng: -122.40746,
    type: "General"
  },
  {
    name: "Battery Drop-Off (Hardware Hub)",
    address: "85 Bright St",
    lat: 37.78552, lng: -122.40141,
    type: "Battery"
  },
  {
    name: "Neighborhood Paper Bin",
    address: "445 Maple Lane",
    lat: 37.78443, lng: -122.40875,
    type: "Paper"
  }
];

/**
 * PUBLIC_INTERFACE
 * Smart Recycling & Waste Locator module:
 * - Upload or drop an item photo/file for demo AI "classification"
 * - Displays recycling rules for recognized item
 * - Shows nearby locations to drop off, with map integration
 * - All feedback/validation inline, styled as dashboard card content
 * - Fully self-contained (no API dependencies for demo)
 */
export function SmartRecyclingLocator() {
  // Upload state
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [error, setError] = useState("");
  // Inferred result (demo: simple "AI classifier" by file name mimic)
  const [result, setResult] = useState(null);
  // Static location
  const [location] = useState({ city: "San Francisco, CA", lat: 37.786, lng: -122.404 });
  // Map load error simulation
  const [mapErr, setMapErr] = useState("");
  // Loading states
  const [loading, setLoading] = useState(false);

  // Validation and AI-classify (demo stub)
  function handleFileChange(e) {
    setError("");
    setResult(null);
    const f = e.target.files[0];
    if (!f) {
      setFile(null);
      setImgUrl("");
      setError("Please select an image or item file.");
      return;
    }
    // Accept only typical image files for demo
    if (!/^image\/(jpeg|png|gif|webp)$/i.test(f.type)) {
      setFile(null);
      setImgUrl("");
      setError("Unsupported file type. Please upload JPG/PNG image of item.");
      return;
    }
    setFile(f);
    // Preview
    setImgUrl(URL.createObjectURL(f));
    setLoading(true);
    // "Classifier" mimic (fake AI)
    setTimeout(() => {
      setLoading(false);
      // If file name hints at class, pick it; else random
      const fname = f.name.toLowerCase();
      if (fname.match(/bott(le)?|plastic/)) {
        setResult(RECYCLE_CLASSES[0]);
      } else if (fname.match(/battery/)) {
        setResult(RECYCLE_CLASSES[1]);
      } else if (fname.match(/paper|cardboard/)) {
        setResult(RECYCLE_CLASSES[2]);
      } else {
        // Random for fun
        setResult(RECYCLE_CLASSES[Math.floor(Math.random() * RECYCLE_CLASSES.length)]);
      }
    }, 850);
  }

  function handleReset() {
    setFile(null);
    setImgUrl("");
    setError("");
    setResult(null);
    setMapErr("");
    setLoading(false);
  }

  // Simulate map tile (simple SVG or open layer) and list
  function LocatorMap({ focusType }) {
    // Show demo markers; could integrate Google Maps, etc.
    // For demo, just render a local map SVG with colored markers.
    return (
      <div style={{
        width: "100%",
        height: 220,
        background: "#eaf6e9",
        borderRadius: 14,
        position: "relative",
        marginBottom: 14,
        boxShadow: "0 1px 6px #206a3920"
      }}>
        {/* Roughly simulate "city" map */}
        <svg width="100%" height="220" viewBox="0 0 400 220">
          {/* City shape */}
          <rect x="18" y="15" width="364" height="190" rx="36" fill="#e3f1e7" stroke="#cae8db" strokeWidth={3} />
          {/* Markers */}
          {DEMO_LOCATIONS.map((loc, idx) => {
            // If filtering by focusType, slightly "pulse" target marker
            const highlight = result && loc.type.toLowerCase() === focusType?.toLowerCase();
            const mx = 80 + (idx * 110);
            const my = 60 + ((idx % 2) * 60);
            return (
              <g key={loc.name}>
                <circle
                  cx={mx}
                  cy={my}
                  r={highlight ? 15 : 10}
                  fill={highlight ? "#206a39" : "#6ab187"}
                  opacity={highlight ? 0.92 : 0.7}
                  stroke="#ffa600"
                  strokeWidth={highlight ? 4 : 1.5}
                  style={highlight ? { filter: "drop-shadow(0 4px 6px #206a3940)" } : {}}
                />
                <text x={mx} y={my + 32} fontSize="13" textAnchor="middle" fill="#1e5531" fontWeight={highlight ? 700 : 500}>
                  {loc.type}
                </text>
              </g>
            );
          })}
        </svg>
        {/* Marker legend/list, below map */}
        <div style={{
          position: "absolute", left: 19, bottom: 8, right: 19, display: "flex",
          gap: 20, alignItems: "center", fontSize: 14, color: "#206a39"
        }}>
          <b style={{ marginRight: 7 }}>Nearby Locations:</b>
          {DEMO_LOCATIONS.map((loc, idx) =>
            <span key={loc.name} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              color: (result && loc.type.toLowerCase() === focusType?.toLowerCase()) ? "#ffa600" : "#206a39"
            }}>
              <MdLocationOn style={{ verticalAlign: -2 }} />{loc.name}
              <span style={{ fontSize: 13, color: "#446", marginLeft: 4 }}>{loc.address}</span>
            </span>
          )}
        </div>
      </div>
    );
  }

  // ==== UI ====
  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "9px 0" }}>
      <h2 style={{
        display: "flex", alignItems: "center", gap: 14,
        color: COLORS.primary, fontWeight: 700, fontSize: "2rem", marginBottom: 8
      }}>
        <MdRecycling size={32} style={{ opacity: 0.88 }} />
        Smart Recycling & Waste Locator
      </h2>
      <div style={{
        color: COLORS.text, opacity: .9, fontSize: 18, marginBottom: 34
      }}>
        Instantly identify items via photo upload, see <b>local recycling rules</b>,
        and find <b>nearest drop-off points</b>—demoing our AI-powered, eco-friendly classifier!
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Upload/Card Section */}
        <div>
          <Card>
            <div style={{
              fontWeight: 700, fontSize: 18, color: COLORS.primary,
              marginBottom: 9, display: "flex", alignItems: "center", gap: 8
            }}>
              <MdUploadFile size={23} style={{ opacity: 0.72 }} />
              Upload or Drag an Item Photo
            </div>
            <form
              onSubmit={e => e.preventDefault()}
              style={{ width: "100%" }}
              aria-label="Recycling Item Upload"
            >
              <label
                htmlFor="rec-upload"
                style={{
                  width: "100%",
                  minHeight: 75,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f1faf0",
                  border: `2px dashed ${error ? COLORS.error : COLORS.accent}`,
                  borderRadius: 14,
                  cursor: "pointer",
                  marginBottom: 10,
                  transition: "border 0.15s"
                }}
                aria-invalid={!!error}
              >
                {!imgUrl &&
                  <span style={{ color: COLORS.accent, fontSize: 17 }}>
                    <MdUploadFile style={{ fontSize: 28, verticalAlign: "-8%" }} /> Click or drop an image<br />
                  </span>}
                {imgUrl &&
                  <img src={imgUrl} alt="item preview" style={{
                    maxWidth: "82%", maxHeight: 98,
                    borderRadius: 10, margin: "0 auto 7px"
                  }} />}
                <input
                  id="rec-upload"
                  type="file"
                  name="recycleImg"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  aria-describedby="uploadHelp"
                />
              </label>
              <div id="uploadHelp" style={{ fontSize: 13, color: "#6ab187", marginBottom: 6 }}>
                {file ? file.name : "JPG/PNG supported."}
              </div>
              {error &&
                <div style={{ color: COLORS.error, fontWeight: 500, marginBottom: 6 }}>
                  {error}
                </div>}
              {!result ?
                <GreenButton
                  onClick={e => document.getElementById("rec-upload").click()}
                  style={{ width: "100%", marginTop: 3 }}
                  type="button"
                >
                  Choose Image
                </GreenButton>
                :
                <GreenButton
                  onClick={handleReset}
                  style={{
                    width: "100%",
                    marginTop: 3,
                    background: "#6ab187"
                  }}
                  type="button"
                >
                  <MdRefresh style={{ marginRight: 7, verticalAlign: "-9%" }} />
                  Upload Another
                </GreenButton>
              }
            </form>
            {loading && (
              <div style={{
                marginTop: 11, color: COLORS.secondary, fontWeight: 600,
                fontSize: 16
              }}>
                <span className="loader" style={{
                  marginRight: 7, width: 12, height: 12,
                  display: "inline-block",
                  border: "2px solid #ffa60055",
                  borderRadius: "50%",
                  borderTop: "2px solid #ffa600",
                  animation: "spin 1.1s linear infinite",
                  verticalAlign: "-15%"
                }} />
                Analyzing item...
                <style>{`
                @keyframes spin { 0% { transform: rotate(0deg);} 100%{transform:rotate(360deg);}}
                `}</style>
              </div>
            )}
            {result &&
              <div style={{ color: COLORS.success, marginTop: 16, fontWeight: 600, fontSize: 16 }}>
                <MdCheckCircle style={{ color: COLORS.secondary, marginRight: 6, verticalAlign: "-5%" }} />
                Classified as: <b style={{ color: COLORS.secondary }}>{result.name}</b>
              </div>
            }
          </Card>
          {/* Show rules if result */}
          {result &&
            <Card style={{ marginTop: 13 }}>
              <div style={{
                fontWeight: 700, fontSize: 17, color: "#206a39",
                marginBottom: 6, display: "flex", alignItems: "center", gap: 8
              }}>
                {result.icon}
                <span>Local Recycling Rules</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {result.rules.map(rule =>
                  <li key={rule} style={{ color: "#376b48", marginBottom: 3, fontSize: 15 }}>{rule}</li>)}
              </ul>
              <div style={{ color: "#449F5A", fontSize: 13, marginTop: 7 }}>
                <b>Location:</b> {location.city}
              </div>
            </Card>
          }
        </div>
        {/* Map and locations */}
        <div>
          <Card>
            <div style={{
              fontWeight: 700, color: COLORS.primary, marginBottom: 7, fontSize: 18,
              display: "flex", alignItems: "center", gap: 7
            }}>
              <MdLocationOn size={23} /> Find Nearby Recycling Locations
            </div>
            <LocatorMap focusType={result?.name.split(" ")[0]} />
            <div style={{ fontSize: 14, color: "#1e5e39", marginTop: 11, marginLeft: 2 }}>
              {result
                ? <>Best drop-off for <b>{result.name}</b>:&nbsp;
                  <b style={{ color: "#ffa600" }}>
                    {DEMO_LOCATIONS.find(l => l.type.toLowerCase() === result.name.split(" ")[0].toLowerCase())?.name || "Check map"}
                  </b>
                </>
                : <>Select or upload an item to see closest recycling drop points in <b>{location.city}</b>.</>
              }
            </div>
            {mapErr && <div style={{
              color: COLORS.error, fontSize: 14, fontWeight: 600, marginTop: 4
            }}>{mapErr}</div>}
          </Card>
          {/* Drop-off location info */}
          <Card style={{ marginTop: 13 }}>
            <div style={{
              fontWeight: 700, color: COLORS.accent, marginBottom: 7,
              fontSize: 16, display: "flex", alignItems: "center", gap: 8
            }}>
              <MdLocationOn size={19} /> Location Details
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 15 }}>
              {DEMO_LOCATIONS.filter(loc =>
                !result || loc.type.toLowerCase() === result.name.split(" ")[0].toLowerCase()
              ).map(loc =>
                <li key={loc.name} style={{
                  color: "#20723e",
                  borderBottom: "1.5px solid #6ab18716",
                  marginBottom: 6, paddingBottom: 7
                }}>
                  <b>{loc.name}</b>
                  <div style={{ fontSize: 13, color: "#555", margin: "2px 0" }}>{loc.address}</div>
                  <span style={{
                    padding: "2px 9px", borderRadius: 7, background: "#effbe5",
                    color: "#ffa600", fontSize: 12, marginRight: 9
                  }}>
                    {loc.type} drop-off
                  </span>
                </li>)}
              {/* List all if not filtered */}
              {!result && DEMO_LOCATIONS.length > 0 && DEMO_LOCATIONS.slice(1).map(loc =>
                <li key={loc.name + "-extra"} style={{ color: "#20723e", opacity: 0.8, fontSize: 14, marginTop: 2 }}>
                  <b>{loc.name}</b> - <span>{loc.type} drop-off</span>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
