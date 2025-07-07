import React from "react";
import { Card } from "../components/Card";

/**
 * PUBLIC_INTERFACE
 * Minimal placeholder for unimplemented modules.
 */
import {
  MdBuild,    // Repair Hub
  MdReplay,   // Reuse & Exchange
  MdRecycling,// Resource Recovery
  MdPieChart, // Dashboard/Impact Tracker
  MdPeople,   // Community
  MdCardGiftcard, // Impact/Reward
  MdExtension, // Product Passport (as 'cube')
  MdLocationOn, // Locator
  MdCameraAlt, // AR Repair
  MdPerson // Profile
} from "react-icons/md";

export function Placeholder({ name, icon, description }) {
  return (
    <Card style={{ textAlign: "center", minHeight: 210, margin: "60px auto", maxWidth: 480 }}>
      <div style={{ fontSize: 48, opacity: 0.38, marginBottom: 14 }}>{icon}</div>
      <h2 style={{ color: "#206a39", margin: 0, fontWeight: 700 }}>{name}</h2>
      <div style={{ fontSize: 15, color: "#555", opacity: 0.78, marginTop: 8 }}>{description}</div>
      <div style={{ color: "#aaa", marginTop: 24, fontSize: 13 }}>
        (This area is under development.)</div>
    </Card>
  );
}
