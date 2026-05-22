import L from "leaflet";
import { Crosshair, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SOSAlert, SafeZone } from "../backend";

// Fix default icon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
(L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl =
  undefined;
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadowUrl });

function createColorMarker(color: string, size = 14): L.DivIcon {
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.7);box-shadow:0 0 8px ${color}88;"></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function createSOSMarker(): L.DivIcon {
  return L.divIcon({
    html: `<div style="position:relative;width:20px;height:20px;"><div style="position:absolute;inset:0;border-radius:50%;background:rgba(225,29,72,0.3);"></div><div style="position:absolute;inset:3px;border-radius:50%;background:#e11d48;border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 10px rgba(225,29,72,0.8);"></div></div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
}

function createUserMarker(): L.DivIcon {
  return L.divIcon({
    html: `<div style="position:relative;width:16px;height:16px;"><div style="position:absolute;inset:0;border-radius:50%;background:rgba(59,130,246,0.35);"></div><div style="position:absolute;inset:2px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 0 8px rgba(59,130,246,0.8);"></div></div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
}

const TILE_OPTIONS = [
  {
    label: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  },
  {
    label: "Street",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
];

interface MapPanelProps {
  safeZones: SafeZone[];
  alerts: SOSAlert[];
  flyToZone?: SafeZone | null;
}

export default function MapPanel({
  safeZones,
  alerts,
  flyToZone,
}: MapPanelProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const [activeTile, setActiveTile] = useState(0);
  const [showLayers, setShowLayers] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });
    tileLayerRef.current = L.tileLayer(TILE_OPTIONS[0].url, {
      maxZoom: 18,
    }).addTo(map);
    mapRef.current = map;

    navigator.geolocation?.getCurrentPosition((pos) => {
      setUserPos([pos.coords.latitude, pos.coords.longitude]);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update tile layer
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.remove();
    tileLayerRef.current = L.tileLayer(TILE_OPTIONS[activeTile].url, {
      maxZoom: 18,
    }).addTo(mapRef.current);
  }, [activeTile]);

  // User location marker
  useEffect(() => {
    if (!mapRef.current || !userPos) return;
    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.marker(userPos, { icon: createUserMarker() })
      .addTo(mapRef.current)
      .bindPopup("<strong>Your Location</strong>");
  }, [userPos]);

  // Safe zone + SOS markers
  useEffect(() => {
    if (!mapRef.current) return;
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    for (const zone of safeZones) {
      const color =
        zone.zoneType === "hospital"
          ? "#3b82f6"
          : zone.zoneType === "shelter"
            ? "#22c55e"
            : "#f97316";
      const marker = L.marker([zone.latitude, zone.longitude], {
        icon: createColorMarker(color),
      })
        .addTo(mapRef.current!)
        .bindPopup(
          `<div style="min-width:140px"><strong style="font-size:13px">${zone.name}</strong><br/><span style="color:#9aa6b2;font-size:11px">${zone.zoneType.toUpperCase()}</span><br/><span style="font-size:11px">${zone.district}, ${zone.state}</span></div>`,
        );
      markersRef.current.push(marker);
    }

    for (const alert of alerts) {
      const ts = new Date(Number(alert.timestamp) / 1_000_000).toLocaleString();
      const marker = L.marker([alert.latitude, alert.longitude], {
        icon: createSOSMarker(),
      })
        .addTo(mapRef.current!)
        .bindPopup(
          `<div style="min-width:140px"><strong style="font-size:13px;color:#e11d48">🆘 SOS — ${alert.name}</strong><br/><span style="font-size:11px">${alert.message}</span><br/><span style="color:#9aa6b2;font-size:11px">${ts}</span></div>`,
        );
      markersRef.current.push(marker);
    }
  }, [safeZones, alerts]);

  // Fly to zone
  useEffect(() => {
    if (!mapRef.current || !flyToZone) return;
    mapRef.current.flyTo([flyToZone.latitude, flyToZone.longitude], 13, {
      duration: 1.5,
    });
  }, [flyToZone]);

  const recenter = () => {
    if (!mapRef.current) return;
    if (userPos) {
      mapRef.current.flyTo(userPos, 10, { duration: 1 });
    } else {
      mapRef.current.flyTo([20.5937, 78.9629], 5, { duration: 1 });
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        data-ocid="map.canvas_target"
      />

      {/* Controls overlay */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayers((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-medium hover:bg-accent transition-colors shadow-card"
            data-ocid="map.dropdown_menu"
          >
            <Layers size={13} />
            Map Layers
          </button>
          {showLayers && (
            <div className="absolute right-0 top-9 bg-card border border-border rounded-lg shadow-card min-w-[120px] overflow-hidden z-10">
              {TILE_OPTIONS.map((opt, i) => (
                <button
                  type="button"
                  key={opt.label}
                  onClick={() => {
                    setActiveTile(i);
                    setShowLayers(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors ${
                    i === activeTile
                      ? "text-crisis-red font-semibold"
                      : "text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={recenter}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-xs font-medium hover:bg-accent transition-colors shadow-card"
          data-ocid="map.button"
        >
          <Crosshair size={13} />
          Recenter
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-card/90 border border-border rounded-lg px-3 py-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-full bg-[#3b82f6] inline-block" />{" "}
          Hospital
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-full bg-[#22c55e] inline-block" />{" "}
          Shelter
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-full bg-[#f97316] inline-block" />{" "}
          Exit
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-full bg-[#e11d48] inline-block" />{" "}
          SOS
        </div>
      </div>
    </div>
  );
}
