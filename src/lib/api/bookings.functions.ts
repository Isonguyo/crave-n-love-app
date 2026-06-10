import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tableSchema = z.object({
  customer_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(200).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  guests: z.number().int().min(1).max(50),
  reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reservation_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  notes: z.string().max(1000).optional(),
});

export const createTableReservation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tableSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("table_reservations")
      .insert({ ...data, status: "confirmed" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

const venueSchema = z.object({
  customer_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(200).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  event_type: z.string().trim().min(1).max(120),
  guests: z.number().int().min(1).max(1000),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  event_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  notes: z.string().max(2000).optional(),
});

export const createVenueRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => venueSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("venue_requests")
      .insert({ ...data, status: "pending" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

const cateringSchema = z.object({
  customer_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(200).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  venue_address: z.string().trim().min(3).max(500),
  guests: z.number().int().min(1).max(5000),
  menu_choices: z.string().trim().min(1).max(2000),
  extras: z.array(z.string().max(120)).max(20).default([]),
  notes: z.string().max(2000).optional(),
});

export const createCateringRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => cateringSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("catering_requests")
      .insert({ ...data, status: "new" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

const orderSchema = z.object({
  customer_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().min(3).max(500),
  delivery_at: z.string().datetime().optional(),
  items: z.array(
    z.object({
      id: z.string().max(60),
      name: z.string().max(200),
      qty: z.number().int().min(1).max(500),
      price: z.number().min(0).max(10_000_000),
    })
  ).min(1).max(100),
  image_urls: z.array(z.string().max(500)).max(10).default([]),
  total: z.number().min(0).max(1_000_000_000),
  notes: z.string().max(2000).optional(),
});

export const createFoodOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("food_orders")
      .insert({ ...data, status: "new" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });
