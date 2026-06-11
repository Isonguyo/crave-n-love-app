// Lightweight localStorage-backed reactive store with cross-tab sync.
import { useSyncExternalStore } from "react";
import jollof from "@/assets/jollof.jpg";
import smallchops from "@/assets/smallchops.jpg";
import cake from "@/assets/cake.jpg";
import mocktail from "@/assets/mocktail.jpg";

export type Category = "Main Courses" | "Platters & Small Chops" | "Celebration Cakes" | "Drinks/Mocktails";
export const CATEGORIES: Category[] = [
  "Main Courses",
  "Platters & Small Chops",
  "Celebration Cakes",
  "Drinks/Mocktails",
];

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
};

export type GalleryPhoto = { id: string; url: string; caption?: string };

export type Booking = {
  id: string;
  createdAt: number;
  type: "order" | "event";
  customerName: string;
  phone: string;
  address: string;
  dateTime: string;
  details: string;
  total: number;
  status: "new" | "contacted" | "confirmed" | "completed";
  notes?: string;
};

const KEYS = {
  menu: "cnl.menu.v1",
  gallery: "cnl.gallery.v1",
  bookings: "cnl.bookings.v1",
  cart: "cnl.cart.v1",
  theme: "cnl.theme.v1",
} as const;

const SEED_MENU: MenuItem[] = [
  { id: "m1", name: "Signature Jollof & Grilled Chicken", description: "Smoky party jollof with grilled chicken and sweet plantain.", price: 8500, category: "Main Courses", image: jollof },
  { id: "m2", name: "Seafood Okra Pot", description: "Fresh prawns, fish & periwinkle in our chef's okra stew with pounded yam.", price: 12500, category: "Main Courses", image: jollof },
  { id: "m3", name: "Buka Native Rice Bowl", description: "Calabar-style native rice with assorted meat and prawn.", price: 9500, category: "Main Courses", image: jollof },
  { id: "m4", name: "Royal Small Chops Platter (40 pcs)", description: "Puff puff, samosa, spring roll, gizdodo, mini suya skewers.", price: 18000, category: "Platters & Small Chops", image: smallchops },
  { id: "m5", name: "Grazing Board – Petite", description: "Cheese, charcuterie, fruit and house dips for 4–6 guests.", price: 32000, category: "Platters & Small Chops", image: smallchops },
  { id: "m6", name: "Three-Tier Blush & Gold Cake", description: "Vanilla bean sponge with raspberry-rose buttercream, gold leaf.", price: 95000, category: "Celebration Cakes", image: cake },
  { id: "m7", name: "Red Velvet Celebration (8\")", description: "Classic red velvet, cream cheese frosting, sugar roses.", price: 42000, category: "Celebration Cakes", image: cake },
  { id: "m8", name: "Hibiscus Rose Mocktail", description: "House zobo infusion, rose, lime, sparkling water.", price: 3500, category: "Drinks/Mocktails", image: mocktail },
  { id: "m9", name: "Calabar Sunset Cooler", description: "Mango, pineapple, ginger, mint over crushed ice.", price: 3000, category: "Drinks/Mocktails", image: mocktail },
];

const SEED_GALLERY: GalleryPhoto[] = [
  { id: "g1", url: cake, caption: "Blush & gold celebration cake" },
  { id: "g2", url: smallchops, caption: "Signature small chops platter" },
  { id: "g3", url: jollof, caption: "Chef's Jollof plate" },
  { id: "g4", url: mocktail, caption: "Hibiscus Rose mocktail" },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("cnl:store", { detail: key }));
}

function makeStore<T>(key: string, seed: T) {
  const listeners = new Set<() => void>();
  let cache: T | undefined;
  let hydrated = false;

  const ensure = () => {
    if (!hydrated && typeof window !== "undefined") {
      const existing = localStorage.getItem(key);
      if (!existing) write(key, seed);
      cache = read(key, seed);
      hydrated = true;
    }
    if (cache === undefined) cache = seed;
    return cache;
  };

  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail === key || (e as StorageEvent).key === key) {
        cache = read(key, seed);
        cb();
      }
    };
    window.addEventListener("cnl:store", handler);
    window.addEventListener("storage", handler);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("cnl:store", handler);
      window.removeEventListener("storage", handler);
    };
  };

  return {
    get: () => ensure(),
    set: (next: T) => {
      cache = next;
      write(key, next);
    },
    subscribe,
  };
}

export const menuStore = makeStore<MenuItem[]>(KEYS.menu, SEED_MENU);
export const galleryStore = makeStore<GalleryPhoto[]>(KEYS.gallery, SEED_GALLERY);
export const bookingsStore = makeStore<Booking[]>(KEYS.bookings, []);
export const cartStore = makeStore<Record<string, number>>(KEYS.cart, {});

function useStore<T>(s: ReturnType<typeof makeStore<T>>): T {
  return useSyncExternalStore(s.subscribe, s.get, s.get);
}

export const useMenu = () => useStore(menuStore);
export const useGallery = () => useStore(galleryStore);
export const useBookings = () => useStore(bookingsStore);
export const useCart = () => useStore(cartStore);

export const uid = () => Math.random().toString(36).slice(2, 10);
