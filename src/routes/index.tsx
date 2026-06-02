import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, UtensilsCrossed, Cake, Briefcase, Star } from "lucide-react";
import heroPlatter from "@/assets/hero-platter.jpg";
import heroEvent from "@/assets/hero-event.jpg";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useGallery } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crave n Love – Gourmet Dining & Event Catering in Calabar" },
      { name: "description", content: "Premium restaurant, catering & event hosting in Calabar, Nigeria. Order food, book birthdays, weddings & corporate events." },
      { property: "og:title", content: "Crave n Love – Gourmet Dining & Event Catering" },
      { property: "og:description", content: "Premium restaurant, catering & event hosting in Calabar." },
      { property: "og:image", content: heroPlatter },
      { name: "twitter:image", content: heroPlatter },
    ],
  }),
  component: HomePage,
});

const slides = [
  { src: heroPlatter, label: "Signature Platters" },
  { src: heroEvent, label: "Birthday Events" },
];

const services = [
  {
    icon: UtensilsCrossed,
    title: "Dine-In & Casual Orders",
    desc: "Premium restaurant meals plated to perfection — pick up, delivery or dine with us.",
  },
  {
    icon: Cake,
    title: "Birthday & Private Party Hosting",
    desc: "Full-service catering, bespoke celebration cakes and styled décor packages.",
  },
  {
    icon: Briefcase,
    title: "Corporate Executive Catering",
    desc: "Large-scale food supply, breakfast meetings and conference catering across Calabar.",
  },
];

function HomePage() {
  const [active, setActive] = useState(0);
  const gallery = useGallery();

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-blush opacity-60 dark:opacity-20 pointer-events-none" />
        <div className="container mx-auto px-5 lg:px-8 pt-12 pb-20 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blush/60 dark:bg-secondary text-xs font-medium tracking-wide">
              <Sparkles className="h-3 w-3 text-gold" /> Calabar's premier culinary house
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
              Gourmet Dining, <span className="italic text-gold">Premium</span> Catering &
              <br className="hidden sm:block" /> Unforgettable Events
              <span className="text-gold">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              From signature platters to styled celebrations — Crave n Love crafts every detail of
              Calabar's most memorable moments, one taste at a time.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/book-service"
                className="group inline-flex items-center gap-2 h-12 px-7 rounded-full bg-gradient-gold text-gold-foreground font-semibold shadow-elegant hover:shadow-soft transition-all"
              >
                Book an Event
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-foreground/20 hover:bg-foreground hover:text-background font-semibold transition-colors"
              >
                Order Now
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <span>Loved by 2,000+ guests across Calabar</span>
            </div>
          </div>

          {/* Slider */}
          <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-3xl overflow-hidden shadow-elegant animate-fade-in">
            {slides.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt={s.label}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                  active === i ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <p className="font-display text-white text-2xl">{slides[active].label}</p>
            </div>
            <div className="absolute bottom-6 right-6 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all ${active === i ? "w-8 bg-gold" : "w-3 bg-white/60"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-5 lg:px-8 py-20">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">What we do</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Three ways to taste the love</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <article
              key={s.title}
              className="group relative p-8 rounded-3xl bg-card border border-border/60 hover:shadow-elegant transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-14 w-14 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <Link
                to={i === 0 ? "/menu" : "/book-service"}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold group-hover:gap-3 transition-all"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="container mx-auto px-5 lg:px-8 pb-20">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Showcase</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">From our kitchen & events</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {gallery.slice(0, 8).map((g) => (
            <div key={g.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <img src={g.url} alt={g.caption ?? ""} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-5 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-gold p-10 sm:p-16 text-gold-foreground">
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl sm:text-5xl">Let's craft your next celebration.</h2>
            <p className="mt-4 text-base opacity-80">
              Tell us about your event and we'll design the menu, the cake and the experience —
              start to finish.
            </p>
            <Link
              to="/book-service"
              className="mt-8 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
            >
              Start Booking <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
