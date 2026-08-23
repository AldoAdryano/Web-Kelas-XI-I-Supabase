-- Migration: 006_class_structure.sql
-- Create class_roles table for dynamic organizational structure

CREATE TABLE IF NOT EXISTS class_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  student_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE class_roles ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "class_roles_select_public" ON class_roles FOR SELECT TO anon, authenticated USING (true);
-- Only authenticated users (Admin) can insert, update, delete
CREATE POLICY "class_roles_insert_admin" ON class_roles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "class_roles_update_admin" ON class_roles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "class_roles_delete_admin" ON class_roles FOR DELETE TO authenticated USING (true);

-- Seed initial data
INSERT INTO class_roles (role_key, label, student_name) VALUES
  ('wali_kelas', 'Wali Kelas', 'Gonang Sugiarto.S.E'),
  ('ketua_kelas', 'Ketua Kelas', 'Muntaha A Z'),
  ('wakil_ketua', 'Wakil Ketua', 'Muhammad S A'),
  ('sekretaris_1', 'Sekertaris', 'Ayudya F P'),
  ('sekretaris_2', '', 'Nayla N D N'),
  ('bendahara_1', 'Bendahara', 'Mutia S'),
  ('bendahara_2', '', 'Chelsea L R'),
  ('keamanan_1', 'Keamanan', 'M Firdaus'),
  ('keamanan_2', '', 'Farhan Nurzaky'),
  ('keagamaan_1', 'Keagamaan', 'Balqis Amalia K'),
  ('keagamaan_2', '', 'Niswah A A'),
  ('olahraga_1', 'Olahraga', 'Candra Tulus H'),
  ('olahraga_2', '', 'Marsa Dwi J')
ON CONFLICT (role_key) DO UPDATE SET 
  label = EXCLUDED.label, 
  student_name = EXCLUDED.student_name;
