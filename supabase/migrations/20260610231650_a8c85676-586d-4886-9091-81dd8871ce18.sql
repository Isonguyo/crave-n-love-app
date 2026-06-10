
CREATE POLICY "Anyone can upload order images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'order-uploads');
