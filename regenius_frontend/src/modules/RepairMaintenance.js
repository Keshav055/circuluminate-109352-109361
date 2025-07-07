import React, { useState } from "react";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { GreenButton } from "../components/GreenButton";
import { COLORS } from "../theme";
import {
  MdBuild, MdSearch, MdDevices, MdSupportAgent, MdAutorenew,
  MdQrCodeScanner, MdPrecisionManufacturing, MdCheckCircle, MdCameraAlt, MdErrorOutline,
  MdHelpOutline, MdDirectionsWalk, MdTrendingUp
} from "react-icons/md";

/**
 * PUBLIC_INTERFACE
 * Repair & Maintenance Hub module for ReGenius App.
 * Modern, eco-themed integrated UI for repair, AI diagnostics, AR guides, IoT, pro network, 3D part sourcing.
 * All field/button validation is inline. All features are interactive demos/stubs as appropriate.
 */
export function RepairMaintenance({ user }) {
  // Main repair/diagnostic form state
  const [form, setForm] = useState({
    item: "",
    fault: "",
    contact: "",
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const [aiResult, setAiResult] = useState(null); // AI Diagnostics result object
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AR Guide demo: Static steps per common repair (as proof of concept)
  const arStepsList = [
    { sc: "EcoSmart Fan", steps: [
      { step: "Align your camera on the fan base.", icon: <MdCameraAlt /> },
      { step: "Highlight the 3 mounting screws in the app overlay.", icon: <MdHelpOutline /> },
      { step: "Follow the animated AR overlay to loosen screws.", icon: <MdDirectionsWalk /> },
      { step: "Clean visible dust; reassemble as shown.", icon: <MdTrendingUp /> }
    ] },
    { sc: "EcoCool Fridge", steps: [
      { step: "Point your camera at the rear access cover.", icon: <MdCameraAlt /> },
      { step: "Watch overlay to safely remove panel.", icon: <MdHelpOutline /> },
      { step: "Scan for clogged vent/coil.", icon: <MdErrorOutline /> },
      { step: "Step-by-step: AR shows area to clean.", icon: <MdDirectionsWalk /> }
    ] },
  ];
  const [arGuideOpen, setArGuideOpen] = useState(false);
  const [arSelected, setArSelected] = useState("");
  const arGuideToShow = arStepsList.find(x =>
    arSelected && arSelected.toLowerCase().includes(x.sc.toLowerCase())
  ) || arStepsList[0];

  // Local repair pros mock
  const repairProsMock = [
    { name: "GreenFix Solutions", location: "1.2 km", expertise: "Electronics", rating: 4.9 },
    { name: "EcoAppliance Repair", location: "3.5 km", expertise: "Appliance", rating: 4.7 },
    { name: "FixForGood", location: "4.1 km", expertise: "General/IoT", rating: 5.0 }
  ];
  const [pros, setPros] = useState(repairProsMock);
  const [connectMsg, setConnectMsg] = useState("");

  // IoT device mock/interaction
  const iotDevices = [
    { id: "ac-unit", name: "Smart Air Conditioner", status: "online", lastCheck: "Today", predictedIssue: "Filter needs cleaning" },
    { id: "fridge", name: "EcoCool Fridge", status: "offline", lastCheck: "2d ago", predictedIssue: "No issues" }
  ];
  const [devices, setDevices] = useState(iotDevices);
  const [iotCheckStatus, setIotCheckStatus] = useState({});

  // 3D part sourcing
  const partResults = [
    { id: "part1", name: "Eco Motor Gear", fit: "Compatible", price: "$9.40" },
    { id: "part2", name: "BioPlastic Hinge", fit: "Check dimensions", price: "$3.10" },
    { id: "part3", name: "Regenius Fan Blade", fit: "Exact", price: "$6.70" }
  ];
  const [partSearch, setPartSearch] = useState("");
  const [partSearchResults, setPartSearchResults] = useState([]);
  const [partSelection, setPartSelection] = useState(null);

  // --- Repair/diagnostic form validation ---
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
      e.contact = "Enter valid email or phone.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  // --- On repair/diagnostic submit: show AI result demo ---
  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("Submitted! See your instant AI diagnostic below.");
      // Demo: generate mock AI result based on fault desc.
      const probable = form.fault.toLowerCase().includes("fan")
        ? ["Worn-out belt", "Dusty blades", "Loose wiring"]
        : form.fault.toLowerCase().includes("cool")
        ? ["Low coolant", "Dirty coil", "Compressor relay"]
        : ["Needs power reset", "Physical inspection required"];
      setAiResult({
        product: form.item,
        problems: probable,
        repairSteps: [
          "Unplug device and inspect visually.",
          "Clean/replace identified failing part.",
          "Consult AR guide for assembly tips.",
          "Contact local pro if unresolved."
        ],
        suggestedParts: probable.includes("Worn-out belt") ? ["Eco Motor Gear"] : ["BioPlastic Hinge"]
      });
      setForm({ item: "", fault: "", contact: "" });
    }, 1200);
  }
  // --- AR Guide Demo ---
  function handleARGuideTrigger(e) {
    e.preventDefault();
    setArSelected(form.item || "EcoSmart Fan");
    setArGuideOpen(true);
    setTimeout(() => window.scrollTo({ top: 420, behavior: "smooth" }), 120);
  }
  function renderARStep(stepObj, idx) {
    return (
      <div key={stepObj.step + idx}
        style={{ display: "flex", alignItems: "center", fontSize: 16, margin: "12px 0" }}>
        <span style={{ fontSize: 21, opacity: 0.8, marginRight: 8 }}>
          {stepObj.icon}
        </span>
        {stepObj.step}
      </div>
    );
  }
  // --- Local Network demo ---
  function handleConnectPro(pro) {
    setConnectMsg(`Demo: Connect request sent to ${pro.name}`);
    setTimeout(() => setConnectMsg(""), 1600);
  }
  // --- IoT Integration demo ---
  function triggerPredictive(id) {
    setIotCheckStatus(inStatus => ({ ...inStatus, [id]: "checking" }));
    setTimeout(() => {
      setIotCheckStatus(inStatus => ({
        ...inStatus,
        [id]: "done"
      }));
      setDevices(devs => devs.map(d =>
        d.id === id
          ? ({
              ...d,
              predictedIssue:
                d.name.match(/Air Conditioner/i)
                  ? "Fan slightly unbalanced"
                  : "No issues detected"
            })
          : d
      ));
    }, 1000);
  }
  // --- 3D Part Sourcing demo ---
  function handlePartSearch(e) {
    setPartSearch(e.target.value);
    if (e.target.value.length > 1) {
      // Simulate search (filter by name substring)
      const val = e.target.value.toLowerCase();
      setPartSearchResults(partResults.filter(p => p.name.toLowerCase().includes(val)));
    } else {
      setPartSearchResults([]);
    }
    setPartSelection(null);
  }
  function handlePartSelect(part) {
    setPartSelection(part);
    setTimeout(() => {
      setPartSelection(null);
      setPartSearch("");
    }, 1100);
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
        Diagnose, repair, and extend your products' life with AI diagnostics, AR repair, IoT integration, local pro networks, and eco 3D part sourcing—all in one eco-smart hub.
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
            <div style={{
              fontWeight: 700, fontSize: 18, color: COLORS.primary, marginBottom: 6, display: "flex", alignItems: "center", gap: 6
            }}>
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
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <GreenButton type="submit" style={{ width: "70%", marginTop: 6 }} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Request Repair/Diagnosis"}
                </GreenButton>
                <GreenButton type="button" onClick={handleARGuideTrigger} style={{ width: "29%", marginTop: 6 }}>
                  Try AR Guide
                </GreenButton>
              </div>
              {submitStatus && (
                <div style={{ color: COLORS.success, fontWeight: 600, marginTop: 12 }}>
                  {submitStatus}
                </div>
              )}
            </form>
          </Card>

          {/* == AI Diagnostic Interactive Output == */}
          <Card>
            <div style={{
              fontWeight: 700, color: "#236b3f", marginBottom: 7, display: "flex",
              alignItems: "center", gap: 9
            }}>
              <MdBuild size={22} /> AI Diagnostic Results
            </div>
            {!aiResult ? (
              <div style={{
                color: COLORS.text, opacity: 0.85, fontSize: 15,
                display: "flex", alignItems: "center", gap: 6
              }}>
                <span style={{ color: COLORS.secondary }}><MdHelpOutline /></span>
                Submit a request above to see instant AI-driven fault probable causes, repair steps, and part suggestions.
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 6 }}>
                  <b style={{ color: COLORS.secondary }}>{aiResult.product}</b>
                  <span style={{ fontSize: 13, color: "#888", marginLeft: 11 }}>
                    AI probability scores
                  </span>
                </div>
                <ul style={{ paddingLeft: 19, margin: "6px 0" }}>
                  {aiResult.problems.map((prob, i) =>
                    <li key={prob + i} style={{ color: COLORS.primary }}>
                      {prob}
                      <span style={{
                        color: COLORS.accent,
                        background: "#effbe5",
                        borderRadius: 8,
                        marginLeft: 7,
                        padding: "3px 10px",
                        fontSize: 13
                      }}>&#9889; {(95-i*7)}%</span>
                    </li>
                  )}
                </ul>
                <div style={{ color: COLORS.accent, marginTop: 6, marginBottom: 3, fontWeight: 700 }}>
                  Step-by-Step Repair:
                </div>
                <ul style={{ paddingLeft: 19, margin: "4px 0 7px" }}>
                  {aiResult.repairSteps.map((st, i) =>
                    <li key={st + i} style={{ color: "#404" }}>{st}</li>)}
                </ul>
                <div>
                  <span style={{ color: COLORS.secondary, fontWeight: 500 }}>
                    3D Part suggestion:&nbsp;
                  </span>
                  {aiResult.suggestedParts.map(p => <span key={p}>{p}</span>)}
                </div>
                <div style={{ marginTop: 8, color: "#449F5A", fontSize: 13 }}>
                  * Contact a pro, download AR guide, or search 3D parts below for further help.
                </div>
              </div>
            )}
          </Card>

          {/* == AR Guide == */}
          {arGuideOpen && (
            <Card>
              <div style={{
                fontWeight: 700, color: "#236b3f", marginBottom: 7,
                display: "flex", alignItems: "center", gap: 7
              }}>
                <MdQrCodeScanner size={22} /> AR Repair Steps for <b style={{ marginLeft: 6, color: COLORS.secondary }}>{arGuideToShow.sc}</b>
              </div>
              {arGuideToShow.steps.map(renderARStep)}
              <div style={{ marginTop: 13, textAlign: "right" }}>
                <GreenButton onClick={() => setArGuideOpen(false)}>Close</GreenButton>
              </div>
            </Card>
          )}
        </div>
        <div>
          {/* == Local Pro Network Interactive == */}
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
              {pros.map((pro, idx) => (
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
                    <b style={{ color: COLORS.primary }}>{pro.name}</b>
                    <span style={{ color: COLORS.accent, fontSize: 13, marginLeft: 8 }}>
                      {pro.expertise}
                    </span>
                    <span style={{ color: "#01741c", fontSize: 12, marginLeft: 7 }}>
                      {Array(Math.round(pro.rating)).fill("★").join("")}
                    </span>
                    <br />
                    <span style={{ fontSize: 13, color: "#206a3980" }}>{pro.location} away</span>
                  </div>
                  <GreenButton
                    style={{ fontSize: "0.97em", padding: "6px 22px" }}
                    onClick={() => handleConnectPro(pro)}
                  >Connect</GreenButton>
                </li>
              ))}
            </ul>
            {connectMsg && (
              <div style={{
                color: COLORS.success,
                fontWeight: 600,
                marginTop: 9,
                fontSize: 15
              }}>
                <MdCheckCircle style={{ marginRight: 6, color: COLORS.secondary, verticalAlign: "-5%" }} />
                {connectMsg}
              </div>
            )}
          </Card>

          {/* == IoT Device Integration == */}
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
              {devices.map(d => (
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
                  <GreenButton
                    onClick={() => triggerPredictive(d.id)}
                    style={{
                      fontSize: "0.95em", padding: "5px 10px", width: "40%", minWidth: 115
                    }}
                    disabled={iotCheckStatus[d.id] === "checking"}
                  >
                    {iotCheckStatus[d.id] === "checking" ? "Checking..." : iotCheckStatus[d.id] === "done" ? "Checked" : "Predictive Check"}
                  </GreenButton>
                </li>
              ))}
            </ul>
            <div style={{ color: COLORS.info, fontSize: 13, marginTop: 5 }}>
              IoT checks are currently simulated. Future: link real ReGenius IoT devices.
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
                    background: "#ffeeca", borderRadius: 8, padding: "3px 10px", marginRight: 16
                  }}>
                    {p.price}
                  </div>
                  <GreenButton
                    onClick={() => handlePartSelect(p)}
                    style={{
                      fontSize: "0.89em", padding: "5px 12px", background: "#68e0b1"
                    }}>Request</GreenButton>
                </li>
              ))}
              {(partSearch && !partSearchResults.length) &&
                <li style={{ color: "#cc2222", marginTop: 6 }}>No parts found for search.</li>
              }
            </ul>
            {partSelection && (
              <div style={{
                color: COLORS.success,
                background: "#ebfaee",
                borderRadius: 9,
                marginTop: 10,
                padding: "8px 13px",
                fontWeight: 600,
                fontSize: 15
              }}><MdCheckCircle style={{ color: COLORS.secondary, marginRight: 6, verticalAlign: "-10%" }} />
                {partSelection.name} request sent!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
