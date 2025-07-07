import React, { useState } from "react";
import { Card } from "../components/Card";
import { GreenButton } from "../components/GreenButton";
import { FormField } from "../components/FormField";
import { COLORS } from "../theme";
import {
  MdExtension, MdCheckCircle, MdHistory, MdSchedule, MdVerifiedUser,
  MdAddBox, MdEvent, MdFingerprint, MdCenterFocusStrong, MdClose, MdFactory
} from "react-icons/md";

/**
 * PUBLIC_INTERFACE
 * Product Passport eco-dashboard module with demo blockchain event logic.
 * - View asset's blockchain-verified history (demo)
 * - Add eco/circularity asset events (simulated blockchain write)
 * - View asset summary, credentials, QR/ID, and stats
 * - Eco-compliant, security-emphasized design for dashboard integration
 * Props: { user }
 */
export function ProductPassport({ user }) {
  // Demo products (each would normally be uniquely addressable)
  const demoProducts = [
    {
      id: "RGNFAN-001",
      name: "EcoSmart Ceiling Fan",
      type: "Home Appliance",
      serial: "RGSF-82031-EU",
      issued: "2021-07-11",
      currentOwner: user?.name || "Eco User",
      status: "Active",
      passportAddr: "0xAe23Bc4F08a9b0f",
      img: "https://cdn-icons-png.flaticon.com/512/2092/2092607.png" // CC0 sample icon
    },
    {
      id: "RGNFRC-004",
      name: "EcoCool Fridge",
      type: "Home Appliance",
      serial: "ECOF-48215-UK",
      issued: "2022-03-05",
      currentOwner: user?.name || "Eco User",
      status: "Active",
      passportAddr: "0xEe12Af091Cd42A7e",
      img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
    }
  ];
  const [selectedProd, setSelectedProd] = useState(demoProducts[0]);

  // Blockchain-verified event demo
  const initialEvents = [
    {
      id: "ev101",
      event: "Manufactured",
      timestamp: "2021-07-13",
      actor: "Eco Products Ltd",
      txHash: "0xab12...f98c",
      verified: true,
      desc: "Initial production and sustainability certification."
    },
    {
      id: "ev102",
      event: "Warranty Registered",
      timestamp: "2021-07-25",
      actor: "Eco User",
      txHash: "0x329c...91b4",
      verified: true,
      desc: "User registered ownership for digital warranty"
    },
    {
      id: "ev103",
      event: "Self Repair",
      timestamp: "2022-08-12",
      actor: "Eco User",
      txHash: "0x9fa2...82b3",
      verified: true,
      desc: "Replaced energy-efficient motor (DIY, certified part, impact saved: 2kg CO2e)"
    },
    {
      id: "ev104",
      event: "Recycled Component",
      timestamp: "2024-03-19",
      actor: "GreenCycle Facility",
      txHash: "0x0d3a...bc7d",
      verified: true,
      desc: "Compliant disposal of PCB using authorized recycler"
    }
  ];
  // Add event modal state (eco compliant fields, demo only)
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ event: "", desc: "", actor: user?.name || "", });
  const [eventErrors, setEventErrors] = useState({});
  const [eventSuccess, setEventSuccess] = useState("");
  const [events, setEvents] = useState(initialEvents);

  function validateEvent() {
    const e = {};
    if (!eventForm.event) e.event = "Type required";
    if (!eventForm.desc || eventForm.desc.length < 10) e.desc = "Minimum 10 char description";
    if (!eventForm.actor || eventForm.actor.length < 3) e.actor = "Actor required";
    setEventErrors(e);
    return Object.keys(e).length === 0;
  }

  // PUBLIC_INTERFACE: Simulate on-chain event write (demo only)
  function handleAddEvent(e) {
    e.preventDefault();
    if (!validateEvent()) return;
    // Demo: Add synthetic blockchain tx hash and verified flag
    setTimeout(() => {
      setEvents(evts => [
        {
          id: "ev" + (200 + Math.floor(Math.random() * 999)),
          event: eventForm.event,
          timestamp: new Date().toISOString().slice(0, 10),
          actor: eventForm.actor,
          txHash: "0x" + Math.random().toString(16).slice(2, 10) + "...demo",
          verified: true,
          desc: eventForm.desc
        }, ...evts
      ]);
      setEventForm({ event: "", desc: "", actor: user?.name || "" });
      setEventErrors({});
      setEventSuccess("Blockchain event written! (Simulated)");
      setTimeout(() => setShowAddEvent(false), 1200);
      setTimeout(() => setEventSuccess(""), 1400);
    }, 800);
  }

  function handleFormField(e) {
    setEventForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setEventErrors(er => ({ ...er, [e.target.name]: undefined }));
  }

  // UI helpers for blockchain tx/verification (demo)
  function getEventIcon(event) {
    switch (event.event) {
      case "Manufactured": return <MdFactory style={{ color: COLORS.secondary, fontSize: 22 }} />;
      case "Warranty Registered": return <MdVerifiedUser style={{ color: COLORS.primary, fontSize: 22 }} />;
      case "Self Repair": return <MdCheckCircle style={{ color: COLORS.accent, fontSize: 22 }} />;
      case "Recycled Component": return <MdHistory style={{ color: COLORS.primary, fontSize: 22 }} />;
      default: return <MdEvent style={{ color: COLORS.accent, fontSize: 22 }} />;
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 0" }}>
      <h2 style={{
        display: "flex", alignItems: "center", gap: 13,
        color: COLORS.primary, fontWeight: 700,
        fontSize: "2rem", letterSpacing: ".01em", marginBottom: 12
      }}>
        <MdExtension size={34} style={{ opacity: 0.82 }} /> Product Passport
      </h2>
      <div style={{
        color: COLORS.text, fontSize: 18, opacity: .89, marginBottom: 30
      }}>
        Securely trace your product's lifecycle, circularity events, and ownership history&mdash;all blockchain-verified for transparency and eco-compliance. <b>Select a product to get started.</b>
      </div>
      <div style={{ display: "flex", gap: 39, alignItems: "flex-start" }}>
        {/* PASSPORT Asset Summary */}
        <div style={{ minWidth: 335, flex: "0 0 335px" }}>
          <Card style={{ textAlign: "center", background: "#f5fffa" }}>
            <img
              src={selectedProd.img}
              alt={selectedProd.name}
              style={{ width: 78, marginBottom: 6, borderRadius: 20, boxShadow: "0 2px 8px #206a392e" }}
            />
            <div style={{ fontWeight: 700, color: COLORS.primary, fontSize: 19 }}>
              {selectedProd.name}
            </div>
            <div style={{ fontSize: 14.3, color: COLORS.accent, marginBottom: 7 }}>
              {selectedProd.type} • SN: <b>{selectedProd.serial}</b>
            </div>
            <div style={{ color: "#666", fontSize: 13, marginBottom: 3 }}>
              Issued: <b>{selectedProd.issued}</b><br />
              Status: <span style={{
                color: selectedProd.status === "Active" ? COLORS.secondary : "#777"
              }}>{selectedProd.status}</span>
            </div>
            <div style={{ fontSize: 12.5, color: "#888", margin: "9px 0" }}>
              Passport Address:<br />
              <span style={{ fontSize: 13, color: "#ffa600", fontWeight: 600 }}>
                {selectedProd.passportAddr}
              </span>
            </div>
            <div style={{
              color: "#449F5A",
              fontWeight: 600,
              margin: "7px 0 0",
              fontSize: 13
            }}>
              Owner: {selectedProd.currentOwner}
            </div>
            <div style={{ margin: "15px 0 0", fontSize: 13 }}>
              <MdFingerprint style={{ color: "#FFA600" }} /> Asset ID: <b>{selectedProd.id}</b>
            </div>
            <div style={{ marginTop: 15 }}>
              <span style={{
                color: COLORS.secondary, fontWeight: 500, marginRight: 7, fontSize: 13.4
              }}>Switch Product:</span>
              <select
                value={selectedProd.id}
                onChange={e => {
                  const prod = demoProducts.find(p => p.id === e.target.value);
                  if (prod) setSelectedProd(prod);
                }}
                style={{
                  border: `1.2px solid ${COLORS.accent}`,
                  fontSize: 14,
                  borderRadius: 11,
                  padding: "3px 14px",
                  marginLeft: 2
                }}
              >
                {demoProducts.map(prod =>
                  <option key={prod.id} value={prod.id}>{prod.name}</option>
                )}
              </select>
            </div>
            <div style={{ marginTop: 17, marginBottom: -11 }}>
              <GreenButton onClick={() => setShowAddEvent(true)} style={{ fontSize: 15, padding: "8px 24px" }}>
                <MdAddBox style={{ verticalAlign: -3, marginRight: 6 }} /> Add Event
              </GreenButton>
            </div>
          </Card>
          <Card style={{
            marginTop: 11, color: COLORS.info, background: "#f3fbfe", fontSize: 13.6
          }}>
            <MdCenterFocusStrong style={{ verticalAlign: -4, color: COLORS.primary, marginRight: 7 }} />
            <b>Scan QR/ID for Asset:</b><br />
            <span style={{
              background: "#e7ecfa", padding: "5px 14px", borderRadius: 11, fontFamily: "monospace"
            }}>{selectedProd.id}</span>
          </Card>
        </div>
        {/* HISTORY and EVENTS */}
        <div style={{ flex: 1 }}>
          <Card style={{ minHeight: 480, background: "#fafcf8", marginBottom: 13 }}>
            <div style={{
              fontWeight: 700, color: COLORS.primary, fontSize: 18, marginBottom: 7,
              display: "flex", alignItems: "center", gap: 9
            }}>
              <MdHistory size={23} /> History & Blockchain-Verified Events
            </div>
            {events.length === 0 && (
              <div style={{
                color: "#888", textAlign: "center", fontSize: 16, margin: "60px 0"
              }}>
                No history yet for this asset. <br />Add a new circularity event above to start your passport!
              </div>
            )}
            <ul style={{
              margin: 0, padding: 0, listStyle: "none"
            }}>
              {events.map(evt => (
                <li key={evt.id}
                  style={{
                    borderRadius: 14, background: "#f5fceb",
                    margin: "13px 0", padding: "13px 21px",
                    boxShadow: "0 1px 8px #206a3911",
                    position: "relative",
                    display: "flex", gap: 15
                  }}>
                  <div>{getEventIcon(evt)}</div>
                  <div>
                    <div style={{
                      fontWeight: 600, color: COLORS.primary, fontSize: 15.5
                    }}>{evt.event}</div>
                    <div style={{
                      color: "#666", fontSize: 13, margin: "2px 0 3px"
                    }}>
                      <MdSchedule style={{ fontSize: 13, verticalAlign: -2, color: "#fad273" }} />
                      {evt.timestamp} &mdash; by <span style={{ color: COLORS.secondary, fontWeight: 500 }}>{evt.actor}</span>
                    </div>
                    <div style={{ color: "#449F5A", fontSize: 13 }}>{evt.desc}</div>
                    <div style={{
                      color: "#ffa600", fontSize: 12.5, marginTop: 2
                    }}>
                      {evt.verified
                        ? <span><MdCheckCircle style={{ verticalAlign: -2, color: COLORS.accent, fontSize: 14 }} />Blockchain verified <b>{evt.txHash}</b></span>
                        : "Pending..."}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card style={{
            color: COLORS.success, background: "#edfaf2", fontSize: 14.2
          }}>
            <b>Sustainability Benefit:</b><br />
            - <b>CO2e saved:</b> +4.2 kg<br />
            - <b>Lifecycle events tracked:</b> {events.length}<br />
            - <b>Chain integrity score:</b> 100% (simulation)
          </Card>
        </div>
      </div>
      {/* Add Event Modal */}
      {showAddEvent &&
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "#021b1037", zIndex: 400,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <form onSubmit={handleAddEvent} autoComplete="off" style={{
            background: "#fff", borderRadius: 16, boxShadow: "0 6px 22px #206a3932",
            minWidth: 330, maxWidth: "95vw", minHeight: 160, padding: "34px 28px", position: "relative"
          }}>
            <button aria-label="Close add event" type="button"
              onClick={() => setShowAddEvent(false)}
              style={{
                position: "absolute", right: 17, top: 18, background: "none",
                border: "none", fontSize: 28, color: "#7a8f73", cursor: "pointer"
              }}
            ><MdClose /></button>
            <div style={{ fontWeight: 700, fontSize: 17, color: COLORS.primary, marginBottom: 6, display: "flex", gap: 8 }}>
              <MdAddBox /> Add Verified Asset Event
            </div>
            <FormField
              label="Event Type"
              name="event"
              value={eventForm.event}
              onChange={handleFormField}
              required
              error={eventErrors.event}
              placeholder="E.g. Self Repair, Ownership Change, Recycled"
            />
            <FormField
              label="Description"
              name="desc"
              value={eventForm.desc}
              onChange={handleFormField}
              required
              error={eventErrors.desc}
              placeholder="Explain work, eco impact, or details (10+ chars)"
            />
            <FormField
              label="Performed/Verified by"
              name="actor"
              value={eventForm.actor}
              onChange={handleFormField}
              required
              error={eventErrors.actor}
              placeholder="E.g. John Eco, GreenCycle, yourself"
            />
            <GreenButton type="submit" style={{ marginTop: 9, width: 180 }}>
              Add Event (blockchain demo)
            </GreenButton>
            {eventSuccess &&
              <div style={{
                color: COLORS.success, fontWeight: 600, marginLeft: 7, marginTop: 9
              }}><MdCheckCircle style={{ verticalAlign: -3, marginRight: 4 }} />
                {eventSuccess}
              </div>}
          </form>
        </div>
      }
    </div>
  );
}
