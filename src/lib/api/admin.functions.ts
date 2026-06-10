import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ALLOWED_TABLES = [
  "reviews",
  "table_reservations",
  "venue_requests",
  "food_orders",
  "catering_requests",
] as const;
type AdminTable = (typeof ALLOWED_TABLES)[number];
const tableEnum = z.enum(ALLOWED_TABLES);

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ username: z.string().min(1).max(80), password: z.string().min(1).max(200) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { verifyAdminCredentials, issueAdminCookie } = await import("@/lib/admin/session.server");
    if (!verifyAdminCredentials(data.username, data.password)) {
      throw new Response("Invalid credentials", { status: 401 });
    }
    issueAdminCookie(data.username);
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { clearAdminCookie } = await import("@/lib/admin/session.server");
  clearAdminCookie();
  return { ok: true };
});

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  const { readAdminCookie } = await import("@/lib/admin/session.server");
  return { session: readAdminCookie() };
});

export const adminListAll = createServerFn({ method: "GET" }).handler(async () => {
  const { assertAdmin } = await import("@/lib/admin/session.server");
  assertAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [reviews, tableRes, venueReq, orders, catering] = await Promise.all([
    supabaseAdmin.from("reviews").select("*").order("created_at", { ascending: false }).limit(200),
    supabaseAdmin.from("table_reservations").select("*").order("created_at", { ascending: false }).limit(200),
    supabaseAdmin.from("venue_requests").select("*").order("created_at", { ascending: false }).limit(200),
    supabaseAdmin.from("food_orders").select("*").order("created_at", { ascending: false }).limit(200),
    supabaseAdmin.from("catering_requests").select("*").order("created_at", { ascending: false }).limit(200),
  ]);

  // Sign image URLs for orders
  const orderRows = orders.data ?? [];
  for (const o of orderRows) {
    const paths: string[] = Array.isArray(o.image_urls) ? (o.image_urls as string[]) : [];
    if (paths.length) {
      const { data: signed } = await supabaseAdmin.storage.from("order-uploads").createSignedUrls(paths, 60 * 60);
      (o as Record<string, unknown>).signed_image_urls = (signed ?? []).map((s) => s.signedUrl);
    } else {
      (o as Record<string, unknown>).signed_image_urls = [];
    }
  }

  return {
    reviews: reviews.data ?? [],
    table_reservations: tableRes.data ?? [],
    venue_requests: venueReq.data ?? [],
    food_orders: orderRows,
    catering_requests: catering.data ?? [],
  };
});

export const adminUpdateStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ table: tableEnum, id: z.string().uuid(), status: z.string().min(1).max(40) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("@/lib/admin/session.server");
    assertAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table as AdminTable).update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteRow = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ table: tableEnum, id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("@/lib/admin/session.server");
    assertAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table as AdminTable).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
