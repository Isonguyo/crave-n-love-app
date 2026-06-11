import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ChefHat, Check, Send } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { StickyMobileCTA } from "@/components/site/StickyMobileCTA";
import { createCateringRequest } from "@/lib/api/bookings.functions";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: [
      { title: "Calabar Buka Catering" },
      { name: "description", content: "Hire Calabar Buka to cater your event anywhere in Calabar — bulk Buka-style menus, servers, warmers and more." },
      { property: "og:title", content: "Calabar Buka Catering" },
      { property: "og:description", content: "Book full-service Buka-style catering at your venue in Calabar." },
    ],
  }),
  component: CateringPage,
});

const EXTRAS = ["Servers / Waitstaff", "Buffet Warmers", "Disposable Plates & Cutlery", "Drinks Package", "Setup & Cleanup Crew"];

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function CateringPage() {
  const submit = useServerFn(createCateringRequest);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    event_date: "",
    venue_address: "",
    guests: 50,
    menu_choices: "",
    notes: "",
  });
  const [extras, setExtras] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState<"today" | "tomorrow" | "pick">("pick");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const update = (k: keyof typeof form, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (x: string) => setExtras((e) => (e.includes(x) ? e.filter((y) => y !== x) : [...e, x]));

  const onPreset = (p: "today" | "tomorrow" | "pick") => {
    setDatePreset(p);
    if (p === "today") update("event_date", todayPlus(0));
    if (p === "tomorrow") update("event_date", todayPlus(1));
    if (p === "pick") update("event_date", "");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true); setErr(null);
    try {
      await submit({ data: { ...form, extras } });
      setDone(true);
    } catch (e: any) {
      setErr(e?.message || "Could not submit. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <section className="flex-1 grid place-items-center px-5 py-16">
          <div className="max-w-md text-center rounded-3xl border border-border/60 bg-card p-10 shadow-elegant">
            <div className="h-14 w-14 mx-auto rounded-full bg-gradient-gold grid place-items-center text-gold-foreground">
              <Check className="h-6 w-6" />
            </div>
            <h1 className="mt-5 font-display text-3xl">Request received</h1>
            <p className="mt-3 text-muted-foreground">Our catering team will reach out shortly to finalise your Buka-style menu.</p>
          </div>
        </section>
        <Footer />
        <StickyMobileCTA />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Nav />
      <section className="container mx-auto px-5 lg:px-8 py-12 max-w-3xl">
        <div className="flex items-center gap-2 text-gold">
          <ChefHat className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium">Calabar Buka Catering</span>
        </div>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Buka-style catering, anywhere in Calabar.</h1>
        <p className="mt-3 text-muted-foreground">Tell us about your event — we'll bring the kitchen to you.</p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6 rounded-3xl bg-card border border-border/60 p-6 sm:p-8 shadow-soft">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name">
              <input required value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Phone">
              <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Email (optional)">
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Estimated guests">
              <input type="number" min={1} required value={form.guests} onChange={(e) => update("guests", Number(e.target.value))} className={inputCls} />
            </Field>
          </div>

          <Field label="Event date">
            <div className="flex flex-wrap gap-2 mb-2">
              {(["today", "tomorrow", "pick"] as const).map((p) => (
                <button type="button" key={p} onClick={() => onPreset(p)} className={`h-9 px-4 rounded-full text-xs font-medium capitalize ${datePreset === p ? "bg-foreground text-background" : "bg-muted hover:bg-accent"}`}>
                  {p === "pick" ? "Pick a date" : p}
                </button>
              ))}
            </div>
            <input type="date" required value={form.event_date} onChange={(e) => { update("event_date", e.target.value); setDatePreset("pick"); }} className={inputCls} />
          </Field>

          <Field label="Venue address (within Calabar)">
            <input required value={form.venue_address} onChange={(e) => update("venue_address", e.target.value)} placeholder="e.g. 24 Edgerley Rd, Calabar" className={inputCls} />
          </Field>

          <Field label="Menu choices & bulk orders">
            <textarea required rows={4} value={form.menu_choices} onChange={(e) => update("menu_choices", e.target.value)} placeholder="e.g. Afang for 80, Jollof rice for 80, Pepper soup for 30…" className={textareaCls} />
          </Field>

          <Field label="Add-ons">
            <div className="flex flex-wrap gap-2">
              {EXTRAS.map((x) => {
                const on = extras.includes(x);
                return (
                  <button type="button" key={x} onClick={() => toggle(x)} className={`h-10 px-4 rounded-full text-sm border transition-colors ${on ? "border-gold bg-blush/40 dark:bg-secondary" : "border-border hover:border-gold/60"}`}>
                    {on && <Check className="inline h-3.5 w-3.5 mr-1 text-gold" />} {x}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Anything else?">
            <textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Dietary needs, timing, special requests…" className={textareaCls} />
          </Field>

          {err && <p className="text-sm text-destructive">{err}</p>}

          <button disabled={sending} className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-gradient-gold text-gold-foreground font-semibold shadow-elegant disabled:opacity-60">
            {sending ? "Sending…" : (<><Send className="h-4 w-4" /> Send catering request</>)}
          </button>
        </form>
      </section>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}

const inputCls = "w-full h-12 rounded-xl bg-background border border-input px-4 focus:outline-none focus:ring-2 focus:ring-gold";
const textareaCls = "w-full rounded-xl bg-background border border-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
