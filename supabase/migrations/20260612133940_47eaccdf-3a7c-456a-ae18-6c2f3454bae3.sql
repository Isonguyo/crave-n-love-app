
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read available menu items"
  ON public.menu_items FOR SELECT
  USING (available = true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER menu_items_set_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.menu_items (name, description, price, category, sort_order) VALUES
('Signature Jollof & Grilled Chicken','Smoky party jollof with grilled chicken and sweet plantain.',8500,'Main Courses',1),
('Seafood Okra Pot','Fresh prawns, fish & periwinkle in our chef''s okra stew with pounded yam.',12500,'Main Courses',2),
('Buka Native Rice Bowl','Calabar-style native rice with assorted meat and prawn.',9500,'Main Courses',3),
('Royal Small Chops Platter (40 pcs)','Puff puff, samosa, spring roll, gizdodo, mini suya skewers.',18000,'Platters & Small Chops',4),
('Grazing Board – Petite','Cheese, charcuterie, fruit and house dips for 4–6 guests.',32000,'Platters & Small Chops',5),
('Three-Tier Blush & Gold Cake','Vanilla bean sponge with raspberry-rose buttercream, gold leaf.',95000,'Celebration Cakes',6),
('Red Velvet Celebration (8")','Classic red velvet, cream cheese frosting, sugar roses.',42000,'Celebration Cakes',7),
('Hibiscus Rose Mocktail','House zobo infusion, rose, lime, sparkling water.',3500,'Drinks/Mocktails',8),
('Calabar Sunset Cooler','Mango, pineapple, ginger, mint over crushed ice.',3000,'Drinks/Mocktails',9);
