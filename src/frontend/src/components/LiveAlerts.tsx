import { AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import type { SOSAlert } from "../backend";

function formatTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  const now = Date.now();
  const diff = now - ms;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-IN");
}

const SAMPLE_ALERTS: SOSAlert[] = [
  {
    id: BigInt(1),
    name: "Rajesh Kumar",
    message: "Flash flood near Nashik bridge, need evacuation",
    latitude: 19.99,
    longitude: 73.79,
    timestamp: BigInt(Date.now() - 5 * 60000) * BigInt(1_000_000),
  },
  {
    id: BigInt(2),
    name: "Priya Sharma",
    message: "Building collapse in Bhopal, 3 trapped inside",
    latitude: 23.25,
    longitude: 77.41,
    timestamp: BigInt(Date.now() - 18 * 60000) * BigInt(1_000_000),
  },
  {
    id: BigInt(3),
    name: "Amit Verma",
    message: "Cyclone damage, medical help needed urgently",
    latitude: 13.08,
    longitude: 80.27,
    timestamp: BigInt(Date.now() - 42 * 60000) * BigInt(1_000_000),
  },
];

interface LiveAlertsProps {
  alerts: SOSAlert[];
  isLoading: boolean;
}

export default function LiveAlerts({ alerts, isLoading }: LiveAlertsProps) {
  const displayAlerts = alerts.length > 0 ? alerts : SAMPLE_ALERTS;

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
      data-ocid="alerts.panel"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">
          Live Crisis Updates
        </h3>
        {isLoading ? (
          <RefreshCw size={13} className="animate-spin text-muted-foreground" />
        ) : (
          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {displayAlerts.length} active
          </span>
        )}
      </div>

      <div
        className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1"
        data-ocid="alerts.list"
      >
        {displayAlerts.length === 0 ? (
          <div
            className="text-center py-6 text-muted-foreground text-xs"
            data-ocid="alerts.empty_state"
          >
            No active alerts
          </div>
        ) : (
          displayAlerts.slice(0, 8).map((alert, i) => (
            <motion.div
              key={String(alert.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-secondary/40 border border-border hover:bg-secondary/70 transition-colors"
              data-ocid={`alerts.item.${i + 1}`}
            >
              <div className="mt-0.5 w-6 h-6 rounded-full bg-[#e11d48]/15 flex items-center justify-center shrink-0">
                <AlertTriangle size={11} className="text-crisis-red" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {alert.name}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {alert.message}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={9} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
