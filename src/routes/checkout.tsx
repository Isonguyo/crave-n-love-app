import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { bookingsStore, cartStore, useBookings, useCart, useMenu, uid } from "@/lib/store";
import { buildWhatsAppUrl, formatNaira } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout – Calabar Buka" }] }),
  component: CheckoutPage,
});

type EventDraft = {
  eventType: string; guests: string; tier: string; perGuest: number;
  addons: string[]; date: string; theme: string; estimate: number;
};

function CheckoutPage() {
  const cart = useCart();
  const menu = useMenu();
  const bookings = useBookings();
  const [event, setEvent] = useState<EventDraft | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", dateTime: "" });

  useEffect(() => {
    const raw = localStorage.getItem("cnl.eventDraft.v1");
    if (raw) {
      try { setEvent(JSON.parse(raw)); } catch {}
    }
  }, []);

  const cartLines = Object.entries(cart)
    .map(([id, qty]) => ({ item: menu.find((m) => m.id === id), qty }))
    .filter((l) => l.item) as { item: NonNullable<ReturnType<typeof menu.find>>; qty: number }[];

  const cartSubtotal = cartLines.reduce((s, l) => s + l.item.price * l.qty, 0);

  const hasCart = cartLines.length > 0;
  const hasEvent = !!event;
  const isEvent = hasEvent && !hasCart; // event takes precedence when no cart
  const total = isEvent ? event!.estimate : cartSubtotal;
  const valid = form.name.trim() && form.phone.trim() && form.address.trim() && form.dateTime.trim() && (hasCart || hasEvent);

  const sendOrder = () => {
    if (!valid) return;
    let serviceLines: string;
    if (isEvent) {
      const ev = event!;
      const addonNames = ev.addons.length ? ev.addons.join(", ") : "None";
      serviceLines = [
        `${ev.eventType} (${ev.guests} guests)`,
        `Package: ${ev.tier} – ₦${ev.perGuest.toLocaleString()} per guest`,
        `Add-ons: ${addonNames}`,
        ev.theme ? `Theme/Notes: ${ev.theme}` : "",
        `Event Date: ${ev.date}`,
      ].filter(Boolean).join("\n   • ");
    } else {
      serviceLines = cartLines.map((l) => `${l.item.name} x${l.qty} – ${formatNaira(l.item.price * l.qty)}`).join("\n   • ");
    }

    const message =
`Hello Calabar Buka, I want to place an order/booking from the website:

• Name: ${form.name}
• Phone: ${form.phone}
• Service/Items:
   • ${serviceLines}
• Total/Estimate: ${formatNaira(total)}
• Venue/Address: ${form.address}
• Date/Time: ${form.dateTime}`;

    // log to admin tracker
    bookingsStore.set([
      {
        id: uid(),
        createdAt: Date.now(),
        type: isEvent ? "event" : "order",
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        dateTime: form.dateTime,
        details: isEvent ? `${event!.eventType} · ${event!.tier} · ${event!.guests} guests` : cartLines.map((l) => `${l.item.name} x${l.qty}`).join(", "),
        total,
        status: "new",
      },
      ...bookings,
    ]);

    // clear context
    if (!isEvent) cartStore.set({});
    if (isEvent) localStorage.removeItem("cnl.eventDraft.v1");

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <section className="container mx-auto px-5 lg:px-8 py-12 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Checkout</p>
            <h1 className="mt-3 font-display text-5xl">Almost there.</h1>
            <p className="mt-3 text-muted-foreground">Your order will be sent to us directly on WhatsApp for confirmation.</p>
          </div>

          <div className="rounded-3xl bg-card border border-border/60 p-6 sm:p-8 space-y-5">
            <Field label="Full name">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Adaeze Okon" className={inputCls} />
            </Field>
            <Field label="Phone number">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 803 000 0000" className={inputCls} />
            </Field>
            <Field label="Delivery address / Event venue">
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Marian Road, Calabar" className={inputCls} />
            </Field>
            <Field label="Delivery / Event date & time">
              <input type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} className={inputCls} />
            </Field>
          </div>

          <button
            disabled={!valid}
            onClick={sendOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-gradient-gold text-gold-foreground font-semibold shadow-elegant disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
          >
            <MessageCircle className="h-5 w-5" /> Send Order via WhatsApp
            <ArrowRight className="h-4 w-4" />
          </button>
          {!hasCart && !hasEvent && (
            <p className="text-sm text-muted-foreground">
              No items or event details yet. Visit the <Link to="/menu" className="text-gold underline">menu</Link> or <Link to="/book-service" className="text-gold underline">book an event</Link>.
            </p>
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="sticky top-24 rounded-3xl bg-gradient-blush dark:bg-secondary p-6 sm:p-8">
            <h2 className="font-display text-2xl">{isEvent ? "Event Summary" : "Order Summary"}</h2>
            <div className="gold-divider my-5" />
            {isEvent && event && (
              <ul className="space-y-3 text-sm">
                <Row k="Event" v={event.eventType} />
                <Row k="Guests" v={event.guests} />
                <Row k="Package" v={`${event.tier} (₦${event.perGuest.toLocaleString()}/guest)`} />
                <Row k="Add-ons" v={event.addons.length ? event.addons.join(", ") : "None"} />
                {event.date && <Row k="Date" v={event.date} />}
                {event.theme && <Row k="Theme" v={event.theme} />}
              </ul>
            )}
            {hasCart && (
              <ul className="space-y-3 text-sm">
                {cartLines.map((l) => (
                  <li key={l.item.id} className="flex justify-between gap-3">
                    <span className="truncate">{l.item.name} <span className="text-muted-foreground">x{l.qty}</span></span>
                    <span className="font-medium whitespace-nowrap">{formatNaira(l.item.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="gold-divider my-5" />
            <div className="flex justify-between items-baseline">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-3xl text-gold">{formatNaira(total)}</span>
            </div>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  );
}

const inputCls = "w-full h-12 rounded-xl bg-background border border-input px-4 focus:outline-none focus:ring-2 focus:ring-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex justify-between gap-3"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right">{v}</span></li>
  );
}
