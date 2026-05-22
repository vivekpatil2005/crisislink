import { Input } from "@/components/ui/input";
import {
  Activity,
  AlertCircle,
  Bone,
  ChevronDown,
  Droplets,
  Flame,
  Heart,
  Mountain,
  Search,
  Waves,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const FIRST_AID_DATA = [
  {
    id: "immediate",
    icon: <AlertCircle size={22} className="text-crisis-red" />,
    title: "Immediate Actions",
    description: "First steps in any emergency",
    steps: [
      "Ensure the scene is safe before approaching",
      "Call 112 (Emergency) or 108 (Ambulance) immediately",
      "Check for consciousness — shout, tap shoulder gently",
      "If unconscious & not breathing, start CPR",
      "Keep the person warm and calm",
      "Do not move the person if spinal injury is suspected",
    ],
  },
  {
    id: "bleeding",
    icon: <Droplets size={22} className="text-[#e11d48]" />,
    title: "Bleeding Control",
    description: "Stop and manage severe bleeding",
    steps: [
      "Apply firm, direct pressure with a clean cloth or bandage",
      "Do NOT remove the cloth — add more on top if soaked",
      "Elevate the wounded limb above heart level if possible",
      "Apply a tourniquet 5–7cm above the wound as last resort",
      "Keep pressing for at least 10–15 minutes continuously",
      "Seek emergency medical help immediately",
    ],
  },
  {
    id: "choking",
    icon: <AlertCircle size={22} className="text-crisis-orange" />,
    title: "Choking",
    description: "Airway obstruction response",
    steps: [
      "Ask if the person can speak or cough — mild choking: encourage coughing",
      "For severe choking: stand behind, lean them forward",
      "Give 5 firm back blows between shoulder blades with heel of hand",
      "Give 5 abdominal thrusts (Heimlich maneuver)",
      "Alternate back blows and abdominal thrusts",
      "If unconscious, call 112 and start CPR",
    ],
  },
  {
    id: "burns",
    icon: <Flame size={22} className="text-[#f97316]" />,
    title: "Burns & Scalds",
    description: "Thermal injury first response",
    steps: [
      "Cool the burn under cool (not cold) running water for 20 minutes",
      "Remove clothing/jewelry near burn — NOT if stuck to skin",
      "Cover loosely with clean cling film or non-fluffy material",
      "Do NOT use ice, butter, oil, or toothpaste",
      "Do NOT burst blisters",
      "For large/deep burns or burns on face/hands: call 112 immediately",
    ],
  },
  {
    id: "cpr",
    icon: <Activity size={22} className="text-crisis-red" />,
    title: "CPR Instructions",
    description: "Cardiopulmonary resuscitation",
    steps: [
      "Ensure scene is safe; check for response (shout & tap)",
      "Call 112 immediately or ask bystander to call",
      "30 chest compressions: heel of hand on center of chest",
      "Press down 5–6 cm at 100–120 compressions per minute",
      "2 rescue breaths: tilt head, lift chin, pinch nose, blow 1 second",
      "Continue 30:2 ratio until help arrives or AED is available",
    ],
  },
  {
    id: "fractures",
    icon: <Bone size={22} className="text-crisis-blue" />,
    title: "Fractures",
    description: "Bone injury management",
    steps: [
      "Do NOT try to straighten or move the broken bone",
      "Immobilize the area with a splint or padding",
      "Support above and below the fracture point",
      "Apply ice pack wrapped in cloth to reduce swelling",
      "Elevate the injured limb if possible",
      "Call 108 for suspected spinal, neck, or hip fractures",
    ],
  },
  {
    id: "drowning",
    icon: <Waves size={22} className="text-crisis-blue" />,
    title: "Drowning Response",
    description: "Water emergency rescue",
    steps: [
      "Do NOT jump in unless trained — throw a rope or float",
      "Call 112 / Coast Guard 1554 immediately",
      "Once victim is on land: check for breathing",
      "If not breathing, start CPR immediately",
      "Keep warm — risk of hypothermia is high",
      "Seek medical attention even if victim appears recovered",
    ],
  },
  {
    id: "disaster",
    icon: <Mountain size={22} className="text-crisis-green" />,
    title: "Earthquake/Flood Evacuation",
    description: "Natural disaster safety protocol",
    steps: [
      "Earthquake: DROP, COVER, HOLD ON — under table or against interior wall",
      "Move away from windows, gas lines, and heavy furniture",
      "Flood: Move to highest ground immediately — do NOT walk in moving water",
      "Do not drive through flooded roads (30cm can sweep a car)",
      "Follow NDMA evacuation routes to nearest safe zone",
      "Call Disaster Management Helpline: 1078",
    ],
  },
  {
    id: "heart",
    icon: <Heart size={22} className="text-crisis-red" />,
    title: "Heart Attack Signs",
    description: "Recognise and respond quickly",
    steps: [
      "Symptoms: chest pain, shortness of breath, nausea, sweating",
      "Call 108 ambulance immediately — do NOT drive yourself",
      "Have person sit or lie down comfortably, loosen clothing",
      "If prescribed: help them take aspirin (325mg) or nitroglycerin",
      "Stay with the person until ambulance arrives",
      "If unresponsive and not breathing: start CPR immediately",
    ],
  },
];

export default function FirstAidGuide() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = FIRST_AID_DATA.filter(
    (item) =>
      search === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.steps.some((s) => s.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <section id="firstaid" className="mt-6" data-ocid="firstaid.section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            First Aid Emergency Guide
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Step-by-step instructions for common emergencies in India
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search first aid topics..."
            className="pl-8 bg-input border-border text-foreground placeholder:text-muted-foreground text-xs h-9"
            data-ocid="firstaid.search_input"
          />
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        data-ocid="firstaid.list"
      >
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
            data-ocid={`firstaid.item.${i + 1}`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setExpanded(expanded === item.id ? null : item.id)
                }
                className="mt-3 w-full flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/80 transition-colors text-xs font-medium text-foreground"
                data-ocid={`firstaid.toggle.${i + 1}`}
              >
                <span>View Steps</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${expanded === item.id ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {expanded === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <ol className="flex flex-col gap-2">
                      {item.steps.map((step) => (
                        <li key={step} className="flex items-start gap-2.5">
                          <span className="shrink-0 w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5">
                            {item.steps.indexOf(step) + 1}
                          </span>
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div
            className="col-span-full text-center py-10 text-muted-foreground text-sm"
            data-ocid="firstaid.empty_state"
          >
            No results for "{search}"
          </div>
        )}
      </div>
    </section>
  );
}
