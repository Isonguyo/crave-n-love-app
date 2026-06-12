import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type MenuRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  sort_order: number;
  available: boolean;
};

export const listMenuPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("id,name,description,price,category,image_url,sort_order,available")
    .eq("available", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as MenuRow[];
});

export const adminListMenu = createServerFn({ method: "GET" }).handler(async () => {
  const { assertAdmin } = await import("@/lib/admin/session.server");
  assertAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as MenuRow[];
});

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).default(""),
  price: z.number().min(0).max(10_000_000),
  category: z.string().min(1).max(80),
  image_url: z.string().max(2000).default(""),
  sort_order: z.number().int().min(0).max(100000).default(0),
  available: z.boolean().default(true),
});

export const adminUpsertMenuItem = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => upsertSchema.parse(data))
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("@/lib/admin/session.server");
    assertAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { id, ...rest } = data;
      const { error } = await supabaseAdmin.from("menu_items").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("menu_items").insert(data);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteMenuItem = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("@/lib/admin/session.server");
    assertAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("menu_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
