import { Anchor, Baby, Flame, Phone, Radio, Shield, Users } from "lucide-react";

const CONTACTS = [
  {
    icon: <Phone size={14} className="text-crisis-green" />,
    label: "Ambulance",
    number: "108",
    color: "text-crisis-green",
  },
  {
    icon: <Shield size={14} className="text-crisis-blue" />,
    label: "Police",
    number: "100",
    color: "text-crisis-blue",
  },
  {
    icon: <Flame size={14} className="text-[#f97316]" />,
    label: "Fire Brigade",
    number: "101",
    color: "text-[#f97316]",
  },
  {
    icon: <Radio size={14} className="text-crisis-red" />,
    label: "Disaster Mgmt",
    number: "1078",
    color: "text-crisis-red",
  },
  {
    icon: <Users size={14} className="text-[#a855f7]" />,
    label: "Women Helpline",
    number: "1091",
    color: "text-[#a855f7]",
  },
  {
    icon: <Baby size={14} className="text-[#ec4899]" />,
    label: "Child Helpline",
    number: "1098",
    color: "text-[#ec4899]",
  },
  {
    icon: <Anchor size={14} className="text-crisis-blue" />,
    label: "Coast Guard",
    number: "1554",
    color: "text-crisis-blue",
  },
  {
    icon: <Phone size={14} className="text-crisis-green" />,
    label: "National Emergency",
    number: "112",
    color: "text-crisis-green",
  },
];

export default function EmergencyResources() {
  return (
    <section id="resources" className="mt-6" data-ocid="resources.section">
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-bold text-foreground mb-1">
          Emergency Contacts
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Dial immediately — available 24/7 across India
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CONTACTS.map((c, i) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/40 border border-border hover:bg-secondary/80 hover:border-border/80 transition-all group"
              data-ocid={`resources.item.${i + 1}`}
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                {c.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground truncate">
                  {c.label}
                </p>
                <p
                  className={`text-base font-bold ${c.color} group-hover:opacity-90`}
                >
                  {c.number}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
