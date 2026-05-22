import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Loader2, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitSOS } from "../hooks/useQueries";

export default function SOSButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locLoading, setLocLoading] = useState(false);
  const { mutateAsync: submitSOS, isPending } = useSubmitSOS();

  const captureLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => {
        setCoords({ lat: 20.5937, lng: 78.9629 });
        setLocLoading(false);
        toast.error("Could not get GPS. Using approximate location.");
      },
    );
  };

  const handleOpen = () => {
    setOpen(true);
    captureLocation();
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please describe your emergency.");
      return;
    }
    try {
      await submitSOS({
        name: name.trim(),
        message: message.trim(),
        latitude: coords?.lat ?? 20.5937,
        longitude: coords?.lng ?? 78.9629,
      });
      toast.success("SOS Alert sent! Help is being notified.");
      setOpen(false);
      setName("");
      setMessage("");
    } catch {
      toast.error("Failed to send SOS. Please try again.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="fixed bottom-8 right-8 z-50 w-20 h-20 rounded-full text-white font-bold text-sm flex flex-col items-center justify-center sos-pulse hover:scale-105 transition-transform"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #ff3b5c, #e11d48, #b5113a)",
          boxShadow:
            "0 0 30px rgba(225,29,72,0.6), 0 0 60px rgba(225,29,72,0.25)",
        }}
        data-ocid="sos.open_modal_button"
      >
        <AlertTriangle size={22} className="mb-0.5" />
        <span className="text-[10px] font-black tracking-wider">SOS</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            data-ocid="sos.modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e11d48]/20 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-crisis-red" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-base">
                      Send SOS Alert
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Emergency services will be notified
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="sos.close_button"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-secondary/50 border border-border">
                <MapPin
                  size={14}
                  className={
                    coords ? "text-crisis-green" : "text-muted-foreground"
                  }
                />
                <span className="text-xs">
                  {locLoading ? (
                    <span className="text-muted-foreground">
                      Getting your location...
                    </span>
                  ) : coords ? (
                    <span className="text-crisis-green font-medium">
                      GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Location unavailable
                    </span>
                  )}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label
                    htmlFor="sos-name"
                    className="text-xs font-medium text-muted-foreground mb-1.5 block"
                  >
                    Your Name
                  </label>
                  <Input
                    id="sos-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="sos.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sos-message"
                    className="text-xs font-medium text-muted-foreground mb-1.5 block"
                  >
                    Emergency Description
                  </label>
                  <Textarea
                    id="sos-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your emergency situation..."
                    rows={3}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                    data-ocid="sos.textarea"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="flex-1 border border-border"
                    data-ocid="sos.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="flex-1 bg-[#e11d48] hover:bg-[#c0143c] text-white font-bold"
                    data-ocid="sos.submit_button"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                        Sending...
                      </>
                    ) : (
                      <>🆘 Send SOS</>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
