import { Link } from "@tanstack/react-router";
import { Instagram, Phone, MapPin, Clock } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-cream/40 dark:bg-card/30">
      <div className="container mx-auto px-5 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-full bg-gradient-gold grid place-items-center text-gold-foreground font-display font-bold">C</span>
            <span className="font-display text-xl">Crave-N-Love</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Gourmet dining, premium catering and unforgettable events — crafted with love in Calabar.
          </p>
          <div className="mt-5 rounded-2xl overflow-hidden border border-border/60 aspect-[16/9] max-w-md">
            <iframe
              title="Crave-N-Love location"
              src={CONTACT.mapEmbed}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div>
          <h4 className="font-display text-base mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/menu" className="hover:text-foreground">Menu & Shop</Link></li>
            <li><Link to="/book-service" className="hover:text-foreground">Book an Event</Link></li>
            <li><Link to="/catering" className="hover:text-foreground">Calabar Buka Catering</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base mb-3">Visit & Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-gold mt-1 shrink-0" />
              <a href={CONTACT.mapLink} target="_blank" rel="noreferrer" className="hover:text-foreground">
                {CONTACT.address}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
              <a href={CONTACT.phoneHref} className="hover:text-foreground">{CONTACT.phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="h-3.5 w-3.5 text-gold mt-1 shrink-0" />
              <div>
                {CONTACT.hours.map((h) => (
                  <div key={h.days}><span className="text-foreground">{h.days}:</span> {h.time}</div>
                ))}
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="h-3.5 w-3.5 text-gold shrink-0" /> @cravenlove
            </li>
          </ul>
        </div>
      </div>
      <div className="gold-divider" />
      <div className="container mx-auto px-5 lg:px-8 py-5 text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
        <span>© {new Date().getFullYear()} Crave-N-Love. All rights reserved.</span>
        <span>Made with love in Calabar</span>
      </div>
    </footer>
  );
}
