import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Cake, Users, Sparkles, CalendarDays } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/book-service")({
  head: () => ({
    meta: [
      { title: "Book an Event – Calabar Buka" },
      { name: "description", content: "Book Calabar Buka for birthdays, weddings, anniversaries, corporate events and private dinners in Calabar." },
    ],
  }),
  component: BookPage,
});

const EVENT_TYPES = ["Birthday Party", "Wedding", "Anniversary", "Corporate Event", "Private Dinner"] as const;
const GUEST_RANGES = ["10–50", "50–100", "100+"] as const;
const TIERS = [
  { name: "Silver", price: 15000, desc: "Crowd-pleasing menu with rich Nigerian staples." },
  { name: "Gold", price: 25000, desc: "Expanded menu with seafood, live carving, premium drinks." },
  { name: "Platinum", price: 40000, desc: "Full chef's tasting menu, bespoke styling, executive service." },
] as const;
const ADDONS = [
  { id: "cake", name: "Bespoke Celebration Cake", price: 75000 },
  { id: "decor", name: "Full Venue Decoration", price: 250000 },
  { id: "waitstaff", name: "Executive Waitstaff", price: 80000 },
] as const;

export type EventBooking = {
  eventType: string;
  guests: string;
  tier: string;
  perGuest: number;
  addons: string[];
  date: string;
  theme: string;
  estimate: number;
};

const STORAGE_KEY = "cnl.eventDraft.v1";

function BookPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [eventType, setEventType] = useState<string>(EVENT_TYPES[0]);
  const [guests, setGuests] = useState<string>(GUEST_RANGES[0]);
  const [tier, setTier] = useState<(typeof TIERS)[number]>(TIERS[1]);
  const [addons, setAddons] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [theme, setTheme] = useState<string>("");

  const guestCount = guests === "10–50" ? 40 : guests === "50–100" ? 80 : 130;
  const estimate = useMemo(() => {
    const food = tier.price * guestCount;
    const addonsTotal = ADDONS.filter((a) => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
    return food + addonsTotal;
  }, [tier, guestCount, addons]);

  const steps = ["Event Type", "Guests & Package", "Add-ons", "Date & Details"];

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const proceed = () => {
    const draft: EventBooking = {
      eventType, guests, tier: tier.name, perGuest: tier.price, addons,
      date, theme, estimate,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    navigate({ to: "/checkout", search: { source: "event" } as any });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <section className="container mx-auto px-5 lg:px-8 py-12 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Event Booking</p>
        <h1 className="mt-3 font-display text-5xl">Plan your celebration.</h1>
        <p className="mt-3 text-muted-foreground">Four short steps. We'll do the rest.</p>

        {/* Stepper */}
        <ol className="mt-10 flex items-center gap-3">
          {steps.map((label, i) => (
            <li key={label} className="flex-1 flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold ${
                i <= step ? "bg-gradient-gold text-gold-foreground" : "bg-muted text-muted-foreground"
              }`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</div>
              <div className={`flex-1 h-px ${i < step ? "bg-gold" : "bg-border"} ${i === steps.length - 1 ? "hidden" : ""}`} />
            </li>
          ))}
        </ol>
        <p className="mt-3 font-display text-2xl">{steps[step]}</p>

        <div className="mt-8 rounded-3xl bg-card border border-border/60 p-6 sm:p-10 shadow-soft">
          {step === 0 && (
            <div className="grid sm:grid-cols-2 gap-3 animate-fade-in">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setEventType(t)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    eventType === t ? "border-gold bg-blush/40 dark:bg-secondary shadow-soft" : "border-border hover:border-gold/60"
                  }`}
                >
                  <Sparkles className="h-5 w-5 text-gold" />
                  <p className="mt-3 font-display text-lg">{t}</p>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4 text-gold" /> Estimated guests</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {GUEST_RANGES.map((g) => (
                    <button key={g} onClick={() => setGuests(g)} className={`px-5 h-10 rounded-full text-sm font-medium ${guests === g ? "bg-foreground text-background" : "bg-muted"}`}>
                      {g} guests
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Menu package</label>
                <div className="mt-3 grid sm:grid-cols-3 gap-3">
                  {TIERS.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setTier(t)}
                      className={`p-5 rounded-2xl border text-left ${tier.name === t.name ? "border-gold bg-blush/40 dark:bg-secondary" : "border-border hover:border-gold/60"}`}
                    >
                      <p className="font-display text-xl">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                      <p className="mt-3 text-sm font-semibold text-gold">₦{t.price.toLocaleString()} <span className="text-muted-foreground font-normal">/ guest</span></p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              {ADDONS.map((a) => {
                const on = addons.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => setAddons(on ? addons.filter((x) => x !== a.id) : [...addons, a.id])}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border ${on ? "border-gold bg-blush/40 dark:bg-secondary" : "border-border hover:border-gold/60"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-6 w-6 rounded-md grid place-items-center ${on ? "bg-gold text-gold-foreground" : "bg-muted"}`}>
                        {on && <Check className="h-4 w-4" />}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">₦{a.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <Cake className="h-5 w-5 text-gold" />
                  </button>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gold" /> Event date & time</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 w-full h-12 rounded-xl bg-background border border-input px-4 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Theme, dietary or special requests</label>
                <textarea
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  rows={4}
                  placeholder="e.g. blush & gold theme, vegetarian options for 10 guests…"
                  className="mt-2 w-full rounded-xl bg-background border border-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
          )}
        </div>

        {/* Estimate footer */}
        <div className="mt-6 flex items-center justify-between p-5 rounded-2xl bg-gradient-blush dark:bg-secondary">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Estimate</p>
            <p className="font-display text-3xl text-gold">₦{estimate.toLocaleString()}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{tier.name} · {guests} guests</p>
            <p>{addons.length} add-on{addons.length === 1 ? "" : "s"}</p>
          </div>
        </div>

        {/* Nav */}
        <div className="mt-6 flex justify-between">
          <button onClick={back} disabled={step === 0} className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-border disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={next} className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-foreground text-background">
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={proceed} disabled={!date} className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-gradient-gold text-gold-foreground font-semibold shadow-elegant disabled:opacity-50">
              Proceed to Booking <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
