import { useNavigate } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { cartStore, useCart } from "@/lib/store";
import { useMenuDb } from "@/hooks/use-menu-db";
import { formatNaira } from "@/lib/format";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  const menu = useMenuDb();
  const navigate = useNavigate();

  const lines = Object.entries(cart)
    .map(([id, qty]) => {
      const item = menu.find((m) => m.id === id);
      return item ? { item, qty } : null;
    })
    .filter(Boolean) as { item: ReturnType<typeof menu.find> & object; qty: number }[];

  const subtotal = lines.reduce((sum, l) => sum + (l.item as any).price * l.qty, 0);

  const setQty = (id: string, qty: number) => {
    const next = { ...cart };
    if (qty <= 0) delete next[id];
    else next[id] = qty;
    cartStore.set(next);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-elegant flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display text-xl">Your Cart</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {lines.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="font-display text-lg text-foreground">Your cart is empty</p>
              <p className="text-sm mt-2">Add something delicious from our menu.</p>
            </div>
          )}
          {lines.map(({ item, qty }) => {
            const it = item as any;
            return (
              <div key={it.id} className="flex gap-3 p-3 rounded-xl bg-card border border-border/60">
                <img src={it.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{it.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNaira(it.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => setQty(it.id, qty - 1)} className="h-7 w-7 grid place-items-center rounded-md bg-muted hover:bg-accent">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{qty}</span>
                    <button onClick={() => setQty(it.id, qty + 1)} className="h-7 w-7 grid place-items-center rounded-md bg-muted hover:bg-accent">
                      <Plus className="h-3 w-3" />
                    </button>
                    <button onClick={() => setQty(it.id, 0)} className="ml-auto h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-sm font-semibold whitespace-nowrap">{formatNaira(it.price * qty)}</div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border p-5 space-y-4 bg-cream/30 dark:bg-card/40">
          <div className="flex justify-between font-display text-lg">
            <span>Subtotal</span>
            <span className="text-gold">{formatNaira(subtotal)}</span>
          </div>
          <button
            disabled={lines.length === 0}
            onClick={() => { onClose(); navigate({ to: "/checkout" }); }}
            className="w-full h-12 rounded-full bg-gradient-gold text-gold-foreground font-semibold tracking-wide disabled:opacity-50 hover:shadow-elegant transition-shadow"
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
