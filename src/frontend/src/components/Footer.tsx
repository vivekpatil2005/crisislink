import { Globe, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const href = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="mt-12 border-t border-border bg-card/60"
      data-ocid="footer.section"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e11d48]/20 flex items-center justify-center">
              <Globe size={16} className="text-crisis-red" />
            </div>
            <div>
              <span className="font-bold text-foreground">CrisisLink</span>
              <p className="text-[11px] text-muted-foreground">
                India Emergency Communication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
            <Phone size={14} className="text-crisis-green" />
            <span className="text-crisis-green font-bold text-lg">108</span>
            <span className="text-xs text-muted-foreground">Ambulance</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground">
              © {year}. Built with ❤️ using{" "}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-crisis-blue hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-[10px] text-muted-foreground">
              For real emergencies, always call 112 (National Emergency Number)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
