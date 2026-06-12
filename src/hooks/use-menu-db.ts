import { useEffect, useState } from "react";
import { listMenuPublic, type MenuRow } from "@/lib/api/menu.functions";
import jollof from "@/assets/jollof.jpg";
import smallchops from "@/assets/smallchops.jpg";
import cake from "@/assets/cake.jpg";
import mocktail from "@/assets/mocktail.jpg";

const FALLBACKS: Record<string, string> = {
  "Main Courses": jollof,
  "Platters & Small Chops": smallchops,
  "Celebration Cakes": cake,
  "Drinks/Mocktails": mocktail,
};

export type MenuDisplayItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

let cache: MenuDisplayItem[] | null = null;
const listeners = new Set<() => void>();
let inflight: Promise<MenuDisplayItem[]> | null = null;

function toDisplay(rows: MenuRow[]): MenuDisplayItem[] {
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    price: Number(r.price),
    category: r.category,
    image: r.image_url || FALLBACKS[r.category] || jollof,
  }));
}

export async function refreshMenu() {
  if (!inflight) {
    inflight = listMenuPublic().then((rows) => {
      cache = toDisplay(rows);
      listeners.forEach((l) => l());
      return cache;
    }).finally(() => { inflight = null; });
  }
  return inflight;
}

export function useMenuDb(): MenuDisplayItem[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const sub = () => setTick((n) => n + 1);
    listeners.add(sub);
    if (cache === null) refreshMenu().catch(() => {});
    return () => { listeners.delete(sub); };
  }, []);
  return cache ?? [];
}
