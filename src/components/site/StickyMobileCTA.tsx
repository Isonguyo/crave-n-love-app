import { Link } from "@tanstack/react-router";
import { ShoppingBag, CalendarHeart, Phone } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export function StickyMobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="grid grid-cols-3 gap-1 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Link to="/menu" className="flex flex-col items-center justify-center gap-0.5 h-12 rounded-xl bg-gradient-gold text-gold-foreground text-[11px] font-semibold">
          <ShoppingBag className="h-4 w-4" /> Order
        </Link>
        <Link to="/book-service" className="flex flex-col items-center justify-center gap-0.5 h-12 rounded-xl bg-foreground text-background text-[11px] font-semibold">
          <CalendarHeart className="h-4 w-4" /> Book
        </Link>
        <a href={CONTACT.phoneHref} className="flex flex-col items-center justify-center gap-0.5 h-12 rounded-xl border border-border text-[11px] font-semibold">
          <Phone className="h-4 w-4 text-gold" /> Call
        </a>
      </div>
    </div>
  );
}
