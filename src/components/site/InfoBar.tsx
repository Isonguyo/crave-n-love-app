import { Phone, Clock, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export function InfoBar() {
  return (
    <div className="hidden sm:block bg-foreground text-background text-[11px]">
      <div className="container mx-auto px-5 lg:px-8 h-9 flex items-center justify-between gap-6">
        <div className="flex items-center gap-5 truncate">
          <a href={CONTACT.mapLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-gold transition-colors truncate">
            <MapPin className="h-3 w-3 text-gold shrink-0" /> <span className="truncate">{CONTACT.shortAddress}</span>
          </a>
          <span className="hidden md:flex items-center gap-1.5 opacity-80">
            <Clock className="h-3 w-3 text-gold" /> Mon–Sat 7:30am–1am · Sun 2pm–1am
          </span>
        </div>
        <a href={CONTACT.phoneHref} className="flex items-center gap-1.5 font-semibold hover:text-gold transition-colors">
          <Phone className="h-3 w-3 text-gold" /> {CONTACT.phone}
        </a>
      </div>
    </div>
  );
}
