
-- Remove overly-permissive public INSERT policies. Submissions go through server functions with service_role.
DROP POLICY IF EXISTS "Anyone can request a table" ON public.table_reservations;
DROP POLICY IF EXISTS "Anyone can request the venue" ON public.venue_requests;
DROP POLICY IF EXISTS "Anyone can request catering" ON public.catering_requests;
DROP POLICY IF EXISTS "Anyone can place an order" ON public.food_orders;
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;

-- Revoke public data-API access; server functions use service_role which bypasses RLS/grants.
REVOKE ALL ON public.table_reservations FROM anon, authenticated;
REVOKE ALL ON public.venue_requests FROM anon, authenticated;
REVOKE ALL ON public.catering_requests FROM anon, authenticated;
REVOKE ALL ON public.food_orders FROM anon, authenticated;

-- Reviews: keep public read of approved reviews via the existing SELECT policy.
REVOKE INSERT, UPDATE, DELETE ON public.reviews FROM anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;

-- Storage: order-uploads bucket. Remove any permissive policies; deny all client access.
DROP POLICY IF EXISTS "Anyone can upload order images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload order images" ON storage.objects;
DROP POLICY IF EXISTS "order-uploads insert" ON storage.objects;
DROP POLICY IF EXISTS "order_uploads_insert" ON storage.objects;
DROP POLICY IF EXISTS "Deny client access to order-uploads" ON storage.objects;

-- Explicit deny policies for the order-uploads bucket (service_role bypasses RLS).
CREATE POLICY "order-uploads deny select"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'order-uploads' AND false);

CREATE POLICY "order-uploads deny insert"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'order-uploads' AND false);

CREATE POLICY "order-uploads deny update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'order-uploads' AND false)
  WITH CHECK (bucket_id = 'order-uploads' AND false);

CREATE POLICY "order-uploads deny delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'order-uploads' AND false);
