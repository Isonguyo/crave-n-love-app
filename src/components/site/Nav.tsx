import { Link } from "@tanstack/react-router";
import { Moon, Sun, ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { useCart } from "@/lib/store";
import { CartDrawer } from "./CartDrawer";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/book-service", label: "Book Event" },
  { to: "/admin", label: "Admin" },
] as const;

export function Nav() {
  const { theme, toggle } = useTheme();
  const cart = useCart();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="container mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="h-9 w-9 rounded-full bg-gradient-gold grid place-items-center text-gold-foreground font-display font-bold">C</span>
          <span className="font-display text-lg font-semibold tracking-tight">Crave <span className="text-gold">n</span> Love</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {({ isActive }) => (
                <span className="relative">
                  {l.label}
                  {isActive && <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-gold" />}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
            className="relative h-9 px-3 grid place-items-center rounded-full hover:bg-muted transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 grid place-items-center rounded-full bg-gold text-gold-foreground text-[10px] font-semibold">
                {count}
              </span>
            )}
          </button>
          <button
            className="md:hidden h-9 w-9 grid place-items-center rounded-full hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            {open ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background animate-fade-in">
          <nav className="container mx-auto px-5 py-3 flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium border-b border-border/40 last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
