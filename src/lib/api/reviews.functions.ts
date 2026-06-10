import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PALETTE = ["#D4AF37", "#A0522D", "#8B5E3C", "#C97B63", "#B8860B", "#6B4226", "#9C5A4A", "#7C6F57"];

function colorFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

const submitSchema = z.object({
  name: z.string().trim().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(3).max(1000),
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        name: data.name,
        rating: data.rating,
        body: data.body,
        avatar_color: colorFor(data.name),
        approved: true,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, name, rating, body, avatar_color, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return data ?? [];
});
