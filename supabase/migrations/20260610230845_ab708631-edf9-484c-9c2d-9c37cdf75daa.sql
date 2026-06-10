
-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text NOT NULL,
  avatar_color text NOT NULL DEFAULT '#D4AF37',
  approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read approved reviews" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can submit a review" ON public.reviews FOR INSERT WITH CHECK (true);

-- TABLE RESERVATIONS
CREATE TABLE public.table_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  guests int NOT NULL CHECK (guests > 0),
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.table_reservations TO anon, authenticated;
GRANT ALL ON public.table_reservations TO service_role;
ALTER TABLE public.table_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a table" ON public.table_reservations FOR INSERT WITH CHECK (true);

-- VENUE (FULL RESTAURANT) REQUESTS
CREATE TABLE public.venue_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  event_type text NOT NULL,
  guests int NOT NULL CHECK (guests > 0),
  event_date date NOT NULL,
  event_time time,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.venue_requests TO anon, authenticated;
GRANT ALL ON public.venue_requests TO service_role;
ALTER TABLE public.venue_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request the venue" ON public.venue_requests FOR INSERT WITH CHECK (true);

-- FOOD ORDERS
CREATE TABLE public.food_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  delivery_at timestamptz,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.food_orders TO anon, authenticated;
GRANT ALL ON public.food_orders TO service_role;
ALTER TABLE public.food_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place an order" ON public.food_orders FOR INSERT WITH CHECK (true);

-- CATERING REQUESTS
CREATE TABLE public.catering_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  event_date date NOT NULL,
  venue_address text NOT NULL,
  guests int NOT NULL CHECK (guests > 0),
  menu_choices text NOT NULL,
  extras jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.catering_requests TO anon, authenticated;
GRANT ALL ON public.catering_requests TO service_role;
ALTER TABLE public.catering_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request catering" ON public.catering_requests FOR INSERT WITH CHECK (true);
