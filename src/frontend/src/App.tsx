import { Toaster } from "@/components/ui/sonner";
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  Globe,
  Heart,
  Home,
  MapPin,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import type { SafeZone } from "./backend";
import EmergencyResources from "./components/EmergencyResources";
import FirstAidGuide from "./components/FirstAidGuide";
import Footer from "./components/Footer";
import LiveAlerts from "./components/LiveAlerts";
import MapPanel from "./components/MapPanel";
import SOSButton from "./components/SOSButton";
import SafeZonePanel from "./components/SafeZonePanel";
import { useGetLatestAlerts, useGetSafeZones } from "./hooks/useQueries";

const NAV_LINKS = [
  { id: "map", label: "Map", icon: <MapPin size={13} /> },
  { id: "safezones", label: "Safe Zones", icon: <Building2 size={13} /> },
  { id: "sos", label: "SOS", icon: <AlertTriangle size={13} /> },
  { id: "firstaid", label: "First Aid", icon: <Heart size={13} /> },
];

const SAMPLE_SAFE_ZONES: SafeZone[] = [
  {
    id: BigInt(1),
    name: "AIIMS New Delhi",
    zoneType: "hospital",
    district: "New Delhi",
    state: "Delhi",
    latitude: 28.5672,
    longitude: 77.21,
  },
  {
    id: BigInt(2),
    name: "Rajiv Gandhi Govt Hospital",
    zoneType: "hospital",
    district: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    id: BigInt(3),
    name: "KEM Hospital Mumbai",
    zoneType: "hospital",
    district: "Mumbai",
    state: "Maharashtra",
    latitude: 18.9869,
    longitude: 72.8422,
  },
  {
    id: BigInt(4),
    name: "NIMHANS Bengaluru",
    zoneType: "hospital",
    district: "Bengaluru",
    state: "Karnataka",
    latitude: 12.9289,
    longitude: 77.5959,
  },
  {
    id: BigInt(5),
    name: "NDRF Camp Kolkata",
    zoneType: "shelter",
    district: "Kolkata",
    state: "West Bengal",
    latitude: 22.5726,
    longitude: 88.3639,
  },
  {
    id: BigInt(6),
    name: "Civil Defence Shelter Hyderabad",
    zoneType: "shelter",
    district: "Hyderabad",
    state: "Telangana",
    latitude: 17.385,
    longitude: 78.4867,
  },
  {
    id: BigInt(7),
    name: "SDRF Base Camp Patna",
    zoneType: "shelter",
    district: "Patna",
    state: "Bihar",
    latitude: 25.5941,
    longitude: 85.1376,
  },
  {
    id: BigInt(8),
    name: "NH48 Emergency Exit — Gujarat",
    zoneType: "exit",
    district: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
  },
  {
    id: BigInt(9),
    name: "NH44 Emergency Exit — Punjab",
    zoneType: "exit",
    district: "Amritsar",
    state: "Punjab",
    latitude: 31.634,
    longitude: 74.8723,
  },
  {
    id: BigInt(10),
    name: "Disaster Relief Centre Jaipur",
    zoneType: "shelter",
    district: "Jaipur",
    state: "Rajasthan",
    latitude: 26.9124,
    longitude: 75.7873,
  },
  {
    id: BigInt(11),
    name: "AIIMS Bhopal",
    zoneType: "hospital",
    district: "Bhopal",
    state: "Madhya Pradesh",
    latitude: 23.2509,
    longitude: 77.4029,
  },
  {
    id: BigInt(12),
    name: "Emergency Exit NH 16 — Odisha",
    zoneType: "exit",
    district: "Bhubaneswar",
    state: "Odisha",
    latitude: 20.2961,
    longitude: 85.8245,
  },
];

export default function App() {
  const [activeNav, setActiveNav] = useState("map");
  const [flyToZone, setFlyToZone] = useState<SafeZone | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const { data: safeZones = [], isLoading: szLoading } = useGetSafeZones();
  const { data: alerts = [], isLoading: alertsLoading } = useGetLatestAlerts();

  const displayZones = safeZones.length > 0 ? safeZones : SAMPLE_SAFE_ZONES;
  const hospitalCount = displayZones.filter(
    (z) => z.zoneType === "hospital",
  ).length;
  const shelterCount = displayZones.filter(
    (z) => z.zoneType === "shelter",
  ).length;

  const scrollTo = (id: string) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectZone = (zone: SafeZone) => {
    setFlyToZone(zone);
    const mapEl = document.getElementById("map");
    if (mapEl) mapEl.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav("map");
  };

  return (
    <div className="min-h-screen bg-background" ref={mainRef}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border shadow-card"
        data-ocid="header.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#e11d48]/20 flex items-center justify-center">
              <Globe size={16} className="text-crisis-red" />
            </div>
            <span className="font-black text-lg tracking-tight text-foreground">
              CrisisLink
            </span>
            <span className="hidden sm:block text-[10px] text-muted-foreground px-2 py-0.5 rounded-full border border-border bg-secondary/50">
              India
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1.5">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeNav === link.id
                    ? "bg-[#e11d48] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                data-ocid={`header.${link.id}.link`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          <div className="md:hidden relative">
            <button
              type="button"
              onClick={() => setShowMobileMenu((v) => !v)}
              className="flex items-center gap-1 text-xs text-muted-foreground border border-border rounded-lg px-2.5 py-1.5"
            >
              Menu <ChevronDown size={12} />
            </button>
            {showMobileMenu && (
              <div className="absolute right-0 top-9 bg-card border border-border rounded-xl shadow-xl min-w-[140px] z-50 overflow-hidden">
                {NAV_LINKS.map((link) => (
                  <button
                    type="button"
                    key={link.id}
                    onClick={() => {
                      scrollTo(link.id);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors"
                  >
                    {link.icon} {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3 mb-5"
          data-ocid="stats.section"
        >
          <div
            className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3"
            data-ocid="stats.alerts.card"
          >
            <div className="w-9 h-9 rounded-lg bg-[#e11d48]/15 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-crisis-red" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Active Alerts</p>
              <p className="text-xl font-black text-crisis-red">
                {alerts.length || 3}
              </p>
            </div>
          </div>
          <div
            className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3"
            data-ocid="stats.hospitals.card"
          >
            <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/15 flex items-center justify-center shrink-0">
              <Building2 size={16} className="text-crisis-blue" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Hospitals</p>
              <p className="text-xl font-black text-crisis-blue">
                {szLoading ? "—" : hospitalCount}
              </p>
            </div>
          </div>
          <div
            className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3"
            data-ocid="stats.shelters.card"
          >
            <div className="w-9 h-9 rounded-lg bg-[#22c55e]/15 flex items-center justify-center shrink-0">
              <Home size={16} className="text-crisis-green" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Safe Shelters</p>
              <p className="text-xl font-black text-crisis-green">
                {szLoading ? "—" : shelterCount}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Map + Sidebar */}
        <section id="map" className="scroll-mt-20" data-ocid="map.section">
          <div className="flex flex-col lg:flex-row gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:w-[65%] h-[480px] lg:h-[560px]"
            >
              <MapPanel
                safeZones={displayZones}
                alerts={alerts}
                flyToZone={flyToZone}
              />
            </motion.div>

            <div className="lg:w-[35%] flex flex-col gap-4" id="safezones">
              <LiveAlerts alerts={alerts} isLoading={alertsLoading} />
              <SafeZonePanel
                safeZones={displayZones}
                onSelectZone={handleSelectZone}
              />
            </div>
          </div>
        </section>

        <section id="firstaid" className="scroll-mt-20">
          <FirstAidGuide />
        </section>

        <section id="sos" className="scroll-mt-20">
          <EmergencyResources />
        </section>
      </main>

      <Footer />
      <SOSButton />
      <Toaster richColors position="top-right" />
    </div>
  );
}
