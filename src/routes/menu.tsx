import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CATEGORIES, cartStore, useCart, useMenu, type Category } from "@/lib/store";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu & Shop – Crave n Love Calabar" },
      { name: "description", content: "Browse our signature mains, small chops platters, celebration cakes and mocktails. Prices in Naira." },
      { property: "og:title", content: "Crave n Love Menu" },
      { property: "og:description", content: "Signature mains, platters, cakes and mocktails." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const menu = useMenu();
  const cart = useCart();
  const [tab, setTab] = useState<Category>(CATEGORIES[0]);

  const items = menu.filter((m) => m.category === tab);

  const add = (id: string) => {
    cartStore.set({ ...cart, [id]: (cart[id] ?? 0) + 1 });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <section className="container mx-auto px-5 lg:px-8 py-12">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">Menu & Shop</p>
          <h1 className="mt-3 font-display text-5xl">Taste the love.</h1>
          <p className="mt-4 text-muted-foreground">
            Every dish, platter and cake is plated by our chefs in Calabar. Prices in Naira (₦).
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-b border-border/60 pb-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`px-5 h-10 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                tab === c
                  ? "bg-foreground text-background shadow-soft"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => {
            const inCart = (cart[it.id] ?? 0) > 0;
            return (
              <article key={it.id} className="group rounded-3xl bg-card border border-border/60 overflow-hidden hover:shadow-elegant transition-all">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={it.image} alt={it.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-semibold text-gold">
                    {formatNaira(it.price)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl">{it.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{it.description}</p>
                  <button
                    onClick={() => add(it.id)}
                    className={`mt-5 w-full h-11 rounded-full font-medium inline-flex items-center justify-center gap-2 transition-all ${
                      inCart ? "bg-secondary text-secondary-foreground" : "bg-foreground text-background hover:bg-gold hover:text-gold-foreground"
                    }`}
                  >
                    {inCart ? <><Check className="h-4 w-4" /> Added · {cart[it.id]}</> : <><Plus className="h-4 w-4" /> Add to Cart</>}
                  </button>
                </div>
              </article>
            );
          })}
          {items.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">Nothing here yet — check back soon.</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
