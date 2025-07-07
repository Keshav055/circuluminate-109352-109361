import React, { useState, useRef } from "react";
import { Card } from "../components/Card";
import { GreenButton } from "../components/GreenButton";
import { COLORS } from "../theme";
import {
  MdUploadFile,
  MdRefresh,
  MdHelpOutline,
  MdCheckCircle,
  MdRecycling,
  MdLocationOn
} from "react-icons/md";

/**
 * PUBLIC_INTERFACE
 * Smart Recycling & Waste Locator module:
 * - Upload item photo for AI-powered classification (calls backend API if available, else demo fallback)
 * - Gets recycling rules per classification (from backend if available, else demo fallback)
 * - Fetches and displays nearby drop-off locations from backend map API or demo/mock
 * - Refined for accessibility, structured feedback, eco-modern theme, responsive for mobile
 */
export function SmartRecyclingLocator() {
  // Upload and AI classify state
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // {name, rules, mapQuery, icon}
  const [location, setLocation] = useState({ city: "San Francisco, CA", lat: 37.786, lng: -122.404 }); // Optionally fetched with geolocation API
  const [mapErr, setMapErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropoffLocations, setDropoffLocations] = useState([]); // dynamic map data
  const [dropoffLoading, setDropoffLoading] = useState(false);
  const uploadInputRef = useRef();

  // Eco-minimal classes fallback (used if backend API is missing)
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

  // Fallback/demo locations
  const DEMO_LOCATIONS = [
    {
      name: "Eco Recycling Center",
      address: "123 Greenway Ave",
      lat: 37.78751, lng: -122.40746,
      type: "Plastic Bottle"
    },
    {
      name: "Battery Drop-Off (Hardware Hub)",
      address: "85 Bright St",
      lat: 37.78552, lng: -122.40141,
      type: "Alkaline Battery"
    },
    {
      name: "Neighborhood Paper Bin",
      address: "445 Maple Lane",
      lat: 37.78443, lng: -122.40875,
      type: "Paper/Cardboard"
    }
  ];

  // ---- API connection logic ----

  /**
   * Returns backend endpoint (if available) for AI/image classification.
   * Replace this string with your real backend path (e.g., '/api/classify').
   * If undefined, mock is used.
   */
  function getImageClassifyApiUrl() {
    // Replace with actual endpoint if exists
    // return "/api/classifier/image";
    return undefined; // Use mock
  }

  /**
   * Returns backend endpoint (if available) for live dropoff locations.
   * Replace with real backend/3rd-party mapping endpoint for go-live.
   */
  function getMapApiUrl() {
    // return "/api/map/locations";
    return undefined; // Use mock
  }

  // PUBLIC_INTERFACE
  async function handleFileChange(e) {
    setError("");
    setResult(null);
    setMapErr("");
    setDropoffLocations([]);
    const f = e.target.files[0];
    if (!f) {
      setFile(null);
      setImgUrl("");
      setError("Please select an image or item file.");
      return;
    }
    if (!/^image\/(jpeg|png|gif|webp)$/i.test(f.type)) {
      setFile(null);
      setImgUrl("");
      setError("Unsupported file type. Please upload JPG/PNG image of item.");
      return;
    }
    setFile(f);
    setImgUrl(URL.createObjectURL(f));
    setLoading(true);

    // === 1. AI Image classification: Call backend (or fallback) ===
    let prediction = null;
    try {
      const endpoint = getImageClassifyApiUrl();
      if (endpoint) {
        // Real API: POST form data
        const data = new FormData();
        data.append("file", f);
        const classifyRes = await fetch(endpoint, {
          method: "POST",
          body: data
        });
        if (!classifyRes.ok) throw new Error("Classifier error");
        const info = await classifyRes.json();
        // Structure: {name: string, rules: string[], mapQuery: string}
        prediction = {
          name: info.name,
          rules: info.rules || [],
          mapQuery: info.mapQuery || info.name,
          icon: <MdRecycling style={{ color: "#ffa600", fontSize: 25 }} />
        };
      } else {
        // === MOCK: Simple filename pattern match ===
        await new Promise(r => setTimeout(r, 1000));
        const fname = f.name.toLowerCase();
        if (fname.match(/bott(le)?|plastic/)) {
          prediction = RECYCLE_CLASSES[0];
        } else if (fname.match(/battery/)) {
          prediction = RECYCLE_CLASSES[1];
        } else if (fname.match(/paper|cardboard/)) {
          prediction = RECYCLE_CLASSES[2];
        } else {
          prediction = RECYCLE_CLASSES[Math.floor(Math.random() * RECYCLE_CLASSES.length)];
        }
      }
      setResult(prediction);
    } catch (apierr) {
      setError("Image recognition failed. Try again or use another image.");
      setResult(null);
      setLoading(false);
      return;
    }
    setLoading(false);

    // === 2. Fetch live map dropoff locations (with API or mock fallback) ===
    fetchDropoffLocations(prediction?.name);
  }

  // PUBLIC_INTERFACE
  async function fetchDropoffLocations(materialName) {
    setDropoffLoading(true);
    setMapErr("");
    setDropoffLocations([]);
    try {
      const endpoint = getMapApiUrl();
      if (endpoint) {
        // Real API: filter by category/material and location
        const params = new URLSearchParams({
          lat: location.lat,
          lng: location.lng,
          category: materialName
        });
        const mapRes = await fetch(endpoint + "?" + params.toString());
        if (!mapRes.ok) throw new Error("Map API error");
        const locs = await mapRes.json();
        setDropoffLocations(locs || []);
      } else {
        // MOCK: Filter demo locations
        await new Promise(r => setTimeout(r, 300));
        setDropoffLocations(
          DEMO_LOCATIONS.filter(
            l => !materialName || (l.type && l.type.toLowerCase().includes(materialName.toLowerCase()))
          )
        );
      }
    } catch (apierr) {
      setDropoffLocations([]);
      setMapErr("Map/directory unavailable.");
    }
    setDropoffLoading(false);
  }

  function handleReset() {
    setFile(null);
    setImgUrl("");
    setError("");
    setResult(null);
    setMapErr("");
    setDropoffLocations([]);
    setLoading(false);
    setDropoffLoading(false);
  }

  // --- Responsive SVG map widget ---
  function LocatorMap({ focusType }) {
    // Use dropoffLocations if present (API or fallback)
    const locations = dropoffLocations.length ? dropoffLocations : DEMO_LOCATIONS;
    return (
      <div style={{
        width: "100%",
        height: 220,
        background: "#eaf6e9",
        borderRadius: 14,
        position: "relative",
        marginBottom: 14,
        boxShadow: "0 1px 6px #206a3920",
        outline: "none"
      }}>
        <svg width="100%" height="220" viewBox="0 0 400 220" role="img" aria-label="Recycling center map">
          <rect x="18" y="15" width="364" height="190" rx="36" fill="#e3f1e7" stroke="#cae8db" strokeWidth={3} />
          {locations.map((loc, idx) => {
            const highlight =
              focusType && loc.type && loc.type.toLowerCase().includes(focusType?.toLowerCase());
            // Distribute markers in demo location set
            const mx = 80 + (idx * 110) % 220;
            const my = 60 + ((idx % 2) * 60);
            return (
              <g key={loc.name}>
                <circle
                  cx={mx}
                  cy={my}
                  r={highlight ? 16 : 10}
                  fill={highlight ? "#206a39" : "#6ab187"}
                  opacity={highlight ? 0.95 : 0.78}
                  stroke="#ffa600"
                  strokeWidth={highlight ? 4 : 1.5}
                  style={highlight ? { filter: "drop-shadow(0 4px 6px #206a3940)" } : {}}
                />
                <text x={mx} y={my + 32} fontSize="13" textAnchor="middle" fill="#1e5531" fontWeight={highlight ? 700 : 500}>
                  {loc.type || ""}
                </text>
              </g>
            );
          })}
        </svg>
        <div style={{
          position: "absolute", left: 19, bottom: 8, right: 19, display: "flex",
          flexWrap: "wrap", gap: 20, alignItems: "center", fontSize: 14, color: "#206a39"
        }}>
          <b style={{ marginRight: 7 }}>Nearby Locations:</b>
          {locations.map((loc, idx) =>
            <span key={loc.name} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              color: (focusType && loc.type && loc.type.toLowerCase().includes(focusType.toLowerCase())) ? "#ffa600" : "#206a39"
            }}>
              <MdLocationOn style={{ verticalAlign: -2 }} />{loc.name}
              <span style={{ fontSize: 13, color: "#446", marginLeft: 4 }}>{loc.address}</span>
            </span>
          )}
        </div>
      </div>
    );
  }

  // ==== Eco-minimal, accessible UI ====
  return (
    <div style={{ maxWidth: 870, margin: "0 auto", padding: "9px 0" }}>
      <h2 style={{
        display: "flex", alignItems: "center", gap: 14,
        color: COLORS.primary, fontWeight: 700, fontSize: "2rem", marginBottom: 8
      }}>
        <MdRecycling size={32} aria-hidden="true" style={{ opacity: 0.88 }} />
        Smart Recycling & Waste Locator
      </h2>
      <div style={{
        color: COLORS.text, opacity: .93, fontSize: 18, marginBottom: 34
      }}>
        Instantly identify recycling items via photo upload, <b>see local rules</b>, and <b>find drop-off sites</b> tailored to your location.
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32,
        alignItems: "start"
      }}>
        {/* Upload/Card Section */}
        <div>
          <Card>
            <div style={{
              fontWeight: 700, fontSize: 18, color: COLORS.primary,
              marginBottom: 9, display: "flex", alignItems: "center", gap: 8
            }}>
              <MdUploadFile size={23} style={{ opacity: 0.72 }} aria-hidden="true" />
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
                  minHeight: 80,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  background: "#f1faf0", border: `2px dashed ${error ? COLORS.error : COLORS.accent}`,
                  borderRadius: 14, cursor: "pointer", marginBottom: 10,
                  transition: "border 0.15s", outline: "none"
                }}
                aria-invalid={!!error}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === " " || e.key === "Enter") {
                    uploadInputRef.current && uploadInputRef.current.click();
                  }
                }}
              >
                {!imgUrl &&
                  <span style={{ color: COLORS.accent, fontSize: 17 }}>
                    <MdUploadFile style={{ fontSize: 28, verticalAlign: "-8%" }} aria-hidden="true" /> Click or drop an image<br />
                  </span>}
                {imgUrl &&
                  <img src={imgUrl} alt="preview of uploaded item" style={{
                    maxWidth: "83%", maxHeight: 98,
                    borderRadius: 10, margin: "0 auto 7px", boxShadow: "0 1px 4px #206a3914"
                  }} />}
                <input
                  id="rec-upload"
                  ref={uploadInputRef}
                  type="file"
                  name="recycleImg"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  aria-describedby="uploadHelp"
                  tabIndex={-1}
                />
              </label>
              <div id="uploadHelp" style={{
                fontSize: 13, color: "#6ab187", marginBottom: 6
              }}>
                {file ? file.name : "JPG/PNG supported."}
              </div>
              {error &&
                <div style={{ color: COLORS.error, fontWeight: 500, marginBottom: 6 }}>
                  {error}
                </div>}
              {!result ?
                <GreenButton
                  onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
                  style={{ width: "100%", marginTop: 3 }}
                  type="button"
                  aria-label="Select image for classification"
                >
                  {loading ? (
                    <span>
                      <span className="loader" style={{
                        marginRight: 8, width: 12, height: 12,
                        display: "inline-block",
                        border: "2px solid #ffa60055",
                        borderRadius: "50%",
                        borderTop: "2px solid #ffa600",
                        animation: "spin 1.1s linear infinite",
                        verticalAlign: "-15%"
                      }} />
                      Analyzing...
                      <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100%{transform:rotate(360deg);}}`}</style>
                    </span>
                  ) : (
                    "Choose Image"
                  )}
                </GreenButton>
                :
                <GreenButton
                  onClick={handleReset}
                  style={{
                    width: "100%", marginTop: 3, background: "#6ab187"
                  }}
                  type="button"
                  aria-label="Reset image input"
                >
                  <MdRefresh style={{ marginRight: 7, verticalAlign: "-9%" }} aria-hidden="true" />
                  Upload Another
                </GreenButton>
              }
            </form>
            {(result && !loading) &&
              <div style={{ color: COLORS.success, marginTop: 16, fontWeight: 600, fontSize: 16 }}>
                <MdCheckCircle style={{ color: COLORS.secondary, marginRight: 6, verticalAlign: "-5%" }} aria-hidden="true" />
                AI classified as: <b style={{ color: COLORS.secondary }}>{result.name}</b>
              </div>
            }
          </Card>
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
                {result.rules && result.rules.map(rule =>
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
              <MdLocationOn size={23} aria-hidden="true" /> Find Nearby Recycling Locations
            </div>
            {dropoffLoading
              ? <div style={{ color: COLORS.accent, fontWeight: 500 }}>
                  <span className="loader" style={{
                    marginRight: 8, width: 12, height: 12,
                    display: "inline-block",
                    border: "2px solid #ffa60044",
                    borderRadius: "50%",
                    borderTop: "2px solid #ffa600",
                    animation: "spin 1.1s linear infinite",
                    verticalAlign: "-15%"
                  }} />
                  Finding locations...
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100%{transform:rotate(360deg);}}`}</style>
                </div>
              :
              <LocatorMap focusType={result?.name} />
            }
            <div style={{ fontSize: 14, color: "#1e5e39", marginTop: 11, marginLeft: 2 }}>
              {result && dropoffLocations.length > 0
                ? <>Best drop-off for <b>{result.name}</b>:{" "}
                    <b style={{ color: "#ffa600" }}>{dropoffLocations[0]?.name || "Check map"}</b></>
                : !result
                  ? <>Select or upload an item to see closest recycling drop points in <b>{location.city}</b>.</>
                  : <span style={{ color: COLORS.error, fontWeight: 500 }}>No nearby locations found.</span>
              }
            </div>
            {mapErr && <div style={{
              color: COLORS.error, fontSize: 14, fontWeight: 600, marginTop: 4
            }}>{mapErr}</div>}
          </Card>
          <Card style={{ marginTop: 13 }}>
            <div style={{
              fontWeight: 700, color: COLORS.accent, marginBottom: 7,
              fontSize: 16, display: "flex", alignItems: "center", gap: 8
            }}>
              <MdLocationOn size={19} aria-hidden="true" /> Location Details
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 15 }}>
              {dropoffLocations.length > 0
                ? dropoffLocations.map(loc =>
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
                  </li>)
                : (!result ? DEMO_LOCATIONS : []).map(loc =>
                  <li key={loc.name + "-extra"} style={{
                    color: "#20723e", opacity: 0.8, fontSize: 14, marginTop: 2
                  }}>
                    <b>{loc.name}</b> - <span>{loc.type} drop-off</span>
                  </li>
                )
              }
            </ul>
          </Card>
        </div>
      </div>
      {/* Accessibility: additional ARIA and keyboard trap for main content would be considered for production */}
    </div>
  );
}
