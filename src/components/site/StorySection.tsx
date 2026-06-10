import { Heart, Award, Soup } from "lucide-react";

export function StorySection() {
  return (
    <section className="container mx-auto px-5 lg:px-8 py-20">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Our story</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl leading-[1.05]">
            Born on Marian Road, <span className="italic text-gold">brewed</span> with love.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Crave-N-Love started as a small Calabar kitchen with a simple promise: every plate should feel
            like home, and every event should feel like a story. From late-night Sunday Specials to bespoke
            wedding banquets, we cook the way Calabar lives — generously, joyfully, and with a touch of gold.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-card border border-border/60 p-4">
              <Soup className="h-5 w-5 text-gold" />
              <p className="mt-3 font-display text-2xl">2k+</p>
              <p className="text-xs text-muted-foreground">Plates served weekly</p>
            </div>
            <div className="rounded-2xl bg-card border border-border/60 p-4">
              <Heart className="h-5 w-5 text-gold" />
              <p className="mt-3 font-display text-2xl">500+</p>
              <p className="text-xs text-muted-foreground">Events catered</p>
            </div>
            <div className="rounded-2xl bg-card border border-border/60 p-4">
              <Award className="h-5 w-5 text-gold" />
              <p className="mt-3 font-display text-2xl">5★</p>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </div>
          </div>
        </div>

        <aside className="relative rounded-3xl overflow-hidden bg-gradient-blush dark:bg-secondary p-8 shadow-elegant">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-gold grid place-items-center text-gold-foreground font-display text-3xl font-bold shadow-soft">
              C
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Owner & Head Chef</p>
              <p className="font-display text-2xl mt-1">Chef Crave</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            "I built Crave-N-Love so every guest — whether ordering a single bowl of afang or hiring us to feed
            500 — leaves feeling like family. Hospitality is our heritage, and Calabar is our muse."
          </p>
          <p className="mt-4 text-xs text-muted-foreground">— Founder, Crave-N-Love</p>
        </aside>
      </div>
    </section>
  );
}
