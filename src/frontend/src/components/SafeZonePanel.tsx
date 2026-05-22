import { Input } from "@/components/ui/input";
import { Building2, Home, MapPin, Navigation, Search } from "lucide-react";
import { useState } from "react";
import type { SafeZone } from "../backend";

const INDIA_STATES = [
  "All States",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
];

const TYPE_ICONS = {
  hospital: <Building2 size={11} className="text-crisis-blue" />,
  shelter: <Home size={11} className="text-crisis-green" />,
  exit: <Navigation size={11} className="text-crisis-orange" />,
};

const TYPE_COLORS = {
  hospital: "text-crisis-blue",
  shelter: "text-crisis-green",
  exit: "text-[#f97316]",
};

interface SafeZonePanelProps {
  safeZones: SafeZone[];
  onSelectZone: (zone: SafeZone) => void;
}

export default function SafeZonePanel({
  safeZones,
  onSelectZone,
}: SafeZonePanelProps) {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filtered = safeZones.filter((z) => {
    const matchSearch =
      search === "" ||
      z.name.toLowerCase().includes(search.toLowerCase()) ||
      z.district.toLowerCase().includes(search.toLowerCase());
    const matchState =
      selectedState === "All States" || z.state === selectedState;
    const matchType = selectedType === "all" || z.zoneType === selectedType;
    return matchSearch && matchState && matchType;
  });

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
      data-ocid="safezone.panel"
    >
      <h3 className="font-semibold text-sm text-foreground">
        Safe Zones Near You
      </h3>

      <div className="relative">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="City, district or zone name"
          className="pl-8 bg-input border-border text-foreground placeholder:text-muted-foreground text-xs h-8"
          data-ocid="safezone.search_input"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="flex-1 bg-input border border-border rounded-lg text-xs text-foreground px-2 py-1.5 appearance-none cursor-pointer"
          data-ocid="safezone.select"
        >
          {INDIA_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-input border border-border rounded-lg text-xs text-foreground px-2 py-1.5 appearance-none cursor-pointer"
          data-ocid="safezone.select"
        >
          <option value="all">All Types</option>
          <option value="hospital">Hospital</option>
          <option value="shelter">Shelter</option>
          <option value="exit">Exit</option>
        </select>
      </div>

      <div
        className="flex flex-col gap-1.5 max-h-48 overflow-y-auto"
        data-ocid="safezone.list"
      >
        {filtered.length === 0 ? (
          <div
            className="text-center py-4 text-muted-foreground text-xs"
            data-ocid="safezone.empty_state"
          >
            No safe zones found
          </div>
        ) : (
          filtered.slice(0, 12).map((zone, i) => (
            <button
              type="button"
              key={String(zone.id)}
              onClick={() => onSelectZone(zone)}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/70 transition-colors text-left"
              data-ocid={`safezone.item.${i + 1}`}
            >
              <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center shrink-0">
                {TYPE_ICONS[zone.zoneType as keyof typeof TYPE_ICONS] ?? (
                  <MapPin size={11} />
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={`text-xs font-medium truncate ${TYPE_COLORS[zone.zoneType as keyof typeof TYPE_COLORS] ?? "text-foreground"}`}
                >
                  {zone.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {zone.district}, {zone.state}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
