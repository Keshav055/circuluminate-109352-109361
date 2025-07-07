import React, { useState } from "react";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { GreenButton } from "../components/GreenButton";
import { COLORS } from "../theme";
import { MdBuild, MdSearch, MdDevices, MdSupportAgent, MdAutorenew, MdQrCodeScanner, MdPrecisionManufacturing } from "react-icons/md";

/**
 * PUBLIC_INTERFACE
 * Repair & Maintenance Hub module for ReGenius App.
 * Modern, eco-themed integrated UI for repair, AI diagnostics, AR guides, IoT, pro network, 3D part sourcing.
 * All field/button validation is inline.
 */
export function RepairMaintenance({ user }) {
  // Form state for repair/diagnostic request
  const [form, setForm] = useState({
    item: "",
    fault: "",
    contact: "",
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock: fake local repair pros
  const repairPros = [
    { name: "GreenFix Solutions", location: "1.2 km", expertise: "Electronics" },
    { name: "EcoAppliance Repair", location: "3.5 km", expertise: "Appliance" },
    { name: "FixForGood", location: "4.1 km", expertise: "General/IoT" }
  ];

  // Mock: IoT devices
  const iotDevices = [
    { id: "ac-unit", name: "Smart Air Conditioner", status: "online", lastCheck: "Today", predictedIssue: "Filter needs cleaning" },
    { id: "fridge", name: "EcoCool Fridge", status: "offline", lastCheck: "2 days ago", predictedIssue: "No issues" }
  ];

  // Mock: 3D Parts listings
  const partResults = [
    { id: "part1", name: "Eco Motor Gear", fit: "Compatible", price: "$9.40" },
    { id: "part2", name: "BioPlastic Hinge", fit: "Check dimensions", price: "$3.10" },
    { id: "part3", name: "Regenius Fan Blade", fit: "Exact", price: "$6.70" }
  ];
  const [partSearch, setPartSearch] = useState("");
  const [partSearchResults, setPartSearchResults] = useState([]);

  // PUBLIC_INTERFACE
  function handleFormField(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: undefined }));
    setSubmitStatus("");
  }

  function validateForm() {
    const e = {};
    if (!form.item) e.item = "Please enter the item.";
    if (!form.fault) e.fault = "Describe the issue.";
    if (!form.contact) e.contact = "Email or phone required.";
    else if (!/^.+@.+\..+$/.test(form.contact) && !/^(?:\+?\d{7,}|\d{10,})$/.test(form.contact)) {
      e.contact = "Enter email or phone.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // PUBLIC_INTERFACE
  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("Submitted! We'll get back to you soon with an AI-powered diagnosis and repair suggestions.");
      setForm({ item: "", fault: "", contact: "" });
    }, 1200);
  }

  // PUBLIC_INTERFACE: part search
  function handlePartSearch(e) {
    setPartSearch(e.target.value);
    if (e.target.value.length > 1) {
      // Simulate search (filter by name substring)
      const val = e.target.value.toLowerCase();
      setPartSearchResults(partResults.filter(p => p.name.toLowerCase().includes(val)));
    } else {
      setPartSearchResults([]);
    }
  }

  // PUBLIC_INTERFACE: predictive maintenance trigger
  function triggerPredictive(id) {
    // Simulate check (highlight with success)
    alert("Predictive maintenance result: Device is healthy! (demo/mock)");
  }

  // ==== UI ====

  return (
    <div style={{
      maxWidth: 1150,
      margin: "0 auto",
      padding: "8px 0"
    }}>
      <h2 style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: COLORS.primary,
        fontWeight: 700,
        fontSize: "2rem",
        letterSpacing: "0.01em",
        marginBottom: 12
      }}>
        <MdBuild size={32} style={{ opacity: 0.84 }} />
        Repair & Maintenance Hub
      </h2>
      <div style={{
        color: COLORS.text,
        opacity: .85,
        fontSize: 18,
        marginBottom: 34
      }}>
        Diagnose, repair, and extend the life of your products. Use AI-powered diagnostics, local pros, IoT integration,
        AR repair guides, and source eco-friendly 3D parts—all in one eco-smart hub.
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        gap: "36px",
        alignItems: "start"
      }}>
        <div>
          {/* == Inline Repair Request/Diagnostic Form == */}
          <Card>
            <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.primary, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <MdAutorenew size={22} style={{ opacity: 0.68 }} />
              Submit a Repair or Diagnostic Request
            </div>
            <form onSubmit={handleFormSubmit} autoComplete="off">
              <FormField
                label="Product or Item"
                name="item"
                value={form.item}
                onChange={handleFormField}
                error={errors.item}
                required
                placeholder="e.g. EcoSmart Fan"
              />
              <FormField
                label="Describe Issue or Fault"
                name="fault"
                value={form.fault}
                onChange={handleFormField}
                error={errors.fault}
                required
                placeholder="What's wrong? (Be specific for better AI diagnosis)"
              />
              <FormField
                label="Contact Info"
                name="contact"
                value={form.contact}
                onChange={handleFormField}
                error={errors.contact}
                required
                placeholder="Email or phone"
              />
              <GreenButton type="submit" style={{ width: "100%", marginTop: 6 }} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Request Repair/Diagnosis"}
              </GreenButton>
              {submitStatus && (
                <div style={{ color: COLORS.success, fontWeight: 600, marginTop: 12 }}>
                  {submitStatus}
                </div>
              )}
            </form>
          </Card>

          {/* == AI Diagnostic Placeholder == */}
          <Card>
            <div style={{
              fontWeight: 700, color: "#236b3f", marginBottom: 7, display: "flex",
              alignItems: "center", gap: 9
            }}>
              <MdBuild size={22} /> AI Diagnostic Results
            </div>
            <div style={{
              color: COLORS.text, opacity: 0.85, fontSize: 15
            }}>
              <em>
                Results from our AI systems will appear here after submitting a request.<br />
                <span style={{ color: COLORS.secondary }}>Coming soon:</span> See probable causes, step-by-step repair, and part suggestions!
              </em>
            </div>
          </Card>

          {/* == AR Guide Placeholder == */}
          <Card>
            <div style={{
              fontWeight: 700, color: "#236b3f", marginBottom: 7, display: "flex", alignItems: "center", gap: 7
            }}>
              <MdQrCodeScanner size={22} /> AR Repair Guides
            </div>
            <div style={{
              color: "#555", opacity: 0.82, fontSize: 15
            }}>
              <em>
                <b>Coming soon:</b> Launch live camera AR overlays to visualize repairs step-by-step on your device.
                Supports smartphones/tablets (WebXR ready). Will guide you visually through even complex tasks!
              </em>
            </div>
          </Card>
        </div>
        <div>
          {/* == Local Pro Network == */}
          <Card>
            <div style={{
              fontWeight: 700, color: "#236b3f", marginBottom: 5, display: "flex", alignItems: "center", gap: 7
            }}>
              <MdSupportAgent size={22} /> Local Repair Network
            </div>
            <div style={{ color: "#666", fontSize: 15, opacity: .83, marginBottom: 6 }}>
              Quickly connect with trusted, eco-friendly repair professionals nearby.
            </div>
            <ul style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              fontSize: 15
            }}>
              {repairPros.map((pro, idx) => (
                <li key={pro.name + idx} style={{
                  background: "#eef6ef",
                  borderRadius: 11,
                  padding: "8px 13px",
                  marginBottom: 9,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <b style={{ color: COLORS.primary }}>{pro.name}</b><br />
                    <span style={{ fontSize: 13, color: "#206a3980" }}>{pro.expertise} &middot; {pro.location} away</span>
                  </div>
                  <GreenButton style={{ fontSize: "0.97em", padding: "6px 22px" }} disabled>
                    Connect
                  </GreenButton>
                </li>
              ))}
            </ul>
            <div style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>
              (Direct network booking coming soon)
            </div>
          </Card>

          {/* == IoT Device Pair/Check == */}
          <Card>
            <div style={{
              fontWeight: 700, color: "#236b3f", marginBottom: 6, display: "flex", alignItems: "center", gap: 6
            }}>
              <MdDevices size={21} /> IoT Device Integration
            </div>
            <div style={{ color: "#666", fontSize: 15, opacity: .83, marginBottom: 9 }}>
              Pair and check your connected smart devices for health & predictive maintenance.
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: 15 }}>
              {iotDevices.map(d => (
                <li key={d.id}
                  style={{
                    background: "#ebf2fa",
                    borderRadius: 11,
                    padding: "9px 9px",
                    marginBottom: 9,
                    display: "flex", flexDirection: "column", gap: 5
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <b style={{ color: COLORS.primary }}>{d.name}</b>
                    <span style={{
                      color: d.status === "online" ? COLORS.accent : "#888",
                      fontWeight: 600,
                      fontSize: 13
                    }}>
                      {d.status === "online" ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div style={{ color: "#444", fontSize: 13, marginLeft: 2 }}>
                    Last check: {d.lastCheck} – Predictive: <span style={{ color: COLORS.secondary }}>{d.predictedIssue}</span>
                  </div>
                  <GreenButton onClick={() => triggerPredictive(d.id)} style={{
                    fontSize: "0.95em", padding: "5px 10px", width: "40%", minWidth: 115
                  }}>
                    Predictive Check
                  </GreenButton>
                </li>
              ))}
            </ul>
            <div style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>
              (IoT health checks and pairing UX coming soon)
            </div>
          </Card>

          {/* == 3D Parts Sourcing == */}
          <Card>
            <div style={{
              fontWeight: 700, color: "#236b3f", marginBottom: 6, display: "flex", alignItems: "center", gap: 7
            }}>
              <MdPrecisionManufacturing size={22} /> 3D Part Sourcing
            </div>
            <div style={{ marginBottom: 10 }}>
              <form onSubmit={e => e.preventDefault()}>
                <FormField
                  label="Search for 3D Printable/Eco Spare Parts"
                  name="partSearch"
                  value={partSearch}
                  onChange={handlePartSearch}
                  placeholder="Search by name or fit (e.g. Gear, Hinge...)"
                />
              </form>
            </div>
            <ul style={{ margin: 0, padding: 0, fontSize: 15, listStyle: "none" }}>
              {(partSearchResults.length ? partSearchResults : (partSearch ? [] : partResults)).map(p => (
                <li key={p.id}
                  style={{
                    background: "#f6fefe",
                    borderRadius: 11,
                    padding: "8px 13px",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                  <div>
                    <b style={{ color: COLORS.primary }}>{p.name}</b>
                    <span style={{
                      color: COLORS.accent, fontSize: 13, marginLeft: 8
                    }}>
                      {p.fit}
                    </span>
                  </div>
                  <div style={{
                    fontWeight: 600, color: COLORS.secondary, fontSize: 15,
                    background: "#ffeeca", borderRadius: 8, padding: "3px 10px"
                  }}>
                    {p.price}
                  </div>
                </li>
              ))}
              {(partSearch && !partSearchResults.length) &&
                <li style={{ color: "#cc2222", marginTop: 6 }}>No parts found for search.</li>
              }
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
