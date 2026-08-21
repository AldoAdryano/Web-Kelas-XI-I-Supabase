-- Migration: 003_storage_policies.sql
-- Konfigurasi keamanan (RLS) untuk Storage Buckets

-- 1. Memastikan bucket "gallery" dan "uploads" sudah ada dan diset sebagai publik
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('gallery', 'gallery', true),
  ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Mengizinkan publik (siapa saja) untuk MEMBACA gambar dari bucket "gallery"
CREATE POLICY "Public Read Access for Gallery" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery');

-- 3. Mengizinkan publik (siapa saja) untuk MEMBACA gambar dari bucket "uploads"
CREATE POLICY "Public Read Access for Uploads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

-- 4. Mengizinkan publik (siapa saja anonim) untuk MENGUNGGAH gambar ke bucket "uploads"
CREATE POLICY "Public Insert Access for Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'uploads');
