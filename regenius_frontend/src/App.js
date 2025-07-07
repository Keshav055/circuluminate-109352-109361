import React, { useState, useEffect } from "react";
import "./App.css";
import { MainLayout } from "./components/MainLayout";
import { AuthPage } from "./modules/AuthPage";
import { Dashboard } from "./modules/Dashboard";
import { Placeholder } from "./modules/Placeholder";
import { RepairMaintenance } from "./modules/RepairMaintenance";
import { ReuseExchangeRental } from "./modules/ReuseExchangeRental";
import {
  MdBuild, MdReplay, MdRecycling, MdPieChart, MdPeople,
  MdCardGiftcard, MdExtension, MdLocationOn, MdCameraAlt, MdPerson
} from "react-icons/md";

const MODULES = [
  {
    key: "/",
    name: "Dashboard",
    component: Dashboard,
    icon: <MdPieChart />,
    description: "View your circularity at a glance. Personalized tips, goals, and progress.",
  },
  {
    key: "/repair",
    name: "Repair Hub",
    component: RepairMaintenance,
    icon: <MdBuild />,
    description: "AI diagnostics, AR repair guides, local pro network, IoT integration, and 3D part sourcing.",
  },
  {
    key: "/reuse",
    name: "Reuse & Exchange",
    component: ReuseExchangeRental,
    icon: <MdReplay />,
    description: "Marketplace for P2P exchanges, rentals, live chat, and eco-friendly swaps.",
  },
  {
    key: "/recycle",
    name: "Resource Recovery",
    component: require("./modules/SmartRecyclingLocator").SmartRecyclingLocator,
    icon: <MdRecycling />,
    description:
      "AI image recognition, recycling rules, closest locations, and take-back programs.",
  },
  {
    key: "/impact",
    name: "Impact Tracker",
    component: () => <Placeholder
      name="Impact & Incentives"
      icon={<MdCardGiftcard />}
      description="Track tokens, badges, challenges, and chart your positive impact and rewards." />,
  },
  {
    key: "/community",
    name: "Community",
    component: () => <Placeholder
      name="Community Ecosystem"
      icon={<MdPeople />}
      description="Forums, events, mentoring, and workshops for circularity and repair lovers." />,
  },
  {
    key: "/passport",
    name: "Product Passport",
    component: require("./modules/ProductPassport").ProductPassport,
    icon: <MdExtension />,
    description: "Blockchain product histories, ownership changes, and recycler verification.",
  },
  {
    key: "/locator",
    name: "Recycling Locator",
    component: () => <Placeholder
      name="Smart Waste Locator"
      icon={<MdLocationOn />}
      description="Find and sort items for local recycling and comply with area-specific rules." />,
  },
  {
    key: "/arrepair",
    name: "AR Repair",
    component: () => <Placeholder
      name="AR Repair Guides"
      icon={<MdCameraAlt />}
      description="Live camera AR overlays for do-it-yourself repair assistance." />,
  },
  {
    key: "/profile",
    name: "Profile",
    component: () => <Placeholder
      name="User Profile & Settings"
      icon={<MdPerson />}
      description="Manage personal info, IoT integration, notifications, and privacy." />,
  }
];

function getModuleObj(path) {
  // fallback to dashboard for unknown or root
  if (!path || path === "/") return MODULES[0];
  return MODULES.find(m => m.key === path) || MODULES[0];
}

// PUBLIC_INTERFACE
function App() {
  // The main theme for the app is always light (can easily add toggle later).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Simulated authentication state (replace with real user/auth API integration!)
  const [user, setUser] = useState(null);
  // Simple route state (simulate router for MVP)
  const [route, setRoute] = useState("/");
  // Mock notification count
  const [notifications] = useState(2);

  function handleAuth(userObj) {
    setUser({ ...userObj, circularityScore: 82 });
    setRoute("/");
  }

  function handleNavigate(key) {
    setRoute(key);
  }

  // Show auth if not logged in
  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  const mod = getModuleObj(route);
  const ModuleComp = mod.component || (() => null);

  return (
    <MainLayout
      current={mod.key}
      setCurrent={handleNavigate}
      notifications={notifications}
      onProfile={() => setRoute("/profile")}
    >
      <ModuleComp user={user} />
    </MainLayout>
  );
}

export default App;
