import { Link } from "@tanstack/react-router";
import { Instagram, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-cream/40 dark:bg-card/30">
      <div className="container mx-auto px-5 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-full bg-gradient-gold grid place-items-center text-gold-foreground font-display font-bold">C</span>
            <span className="font-display text-xl">Calabar <span className="text-gold">.</span> Buka</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Gourmet dining, premium catering and unforgettable events — crafted with love in Calabar.
          </p>
        </div>

        <div>
          <h4 className="font-display text-base mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/menu" className="hover:text-foreground">Menu & Shop</Link></li>
            <li><Link to="/book-service" className="hover:text-foreground">Book an Event</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gold" /> +23411111111</li>
            <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" /> Calabar, Nigeria</li>
            <li className="flex items-center gap-2"><Instagram className="h-3.5 w-3.5 text-gold" /> @calabarbuka</li>
          </ul>
        </div>
      </div>
      <div className="gold-divider" />
      <div className="container mx-auto px-5 lg:px-8 py-5 text-xs text-muted-foreground flex justify-between">
        <span>© {new Date().getFullYear()} Calabar Buka. All rights reserved.</span>
        <span>Made with love in Calabar</span>
      </div>
    </footer>
  );
}
