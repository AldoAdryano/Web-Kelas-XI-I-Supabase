-- Migration: 004_schedule_admin.sql
-- Create schedules and piket tables and update RLS for admin dashboard

-- 1. Create Schedules Table
CREATE TABLE IF NOT EXISTS schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id INTEGER NOT NULL CHECK (day_id >= 1 AND day_id <= 6), -- 1=Senin, 6=Sabtu
  subject TEXT NOT NULL,
  time_start TEXT NOT NULL,
  time_end TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Piket Table
CREATE TABLE IF NOT EXISTS piket (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id INTEGER NOT NULL CHECK (day_id >= 1 AND day_id <= 6),
  student_name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ENABLE RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE piket ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR SCHEDULES
-- Anyone can read
CREATE POLICY "schedules_select_public" ON schedules FOR SELECT TO anon, authenticated USING (true);
-- Only authenticated users (Admin) can insert, update, delete
CREATE POLICY "schedules_insert_admin" ON schedules FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "schedules_update_admin" ON schedules FOR UPDATE TO authenticated USING (true);
CREATE POLICY "schedules_delete_admin" ON schedules FOR DELETE TO authenticated USING (true);

-- 5. RLS POLICIES FOR PIKET
-- Anyone can read
CREATE POLICY "piket_select_public" ON piket FOR SELECT TO anon, authenticated USING (true);
-- Only authenticated users (Admin) can insert, update, delete
CREATE POLICY "piket_insert_admin" ON piket FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "piket_update_admin" ON piket FOR UPDATE TO authenticated USING (true);
CREATE POLICY "piket_delete_admin" ON piket FOR DELETE TO authenticated USING (true);

-- 6. ADD DELETE POLICY TO CHATS FOR ADMIN MODERATION
-- We previously only allowed SELECT and INSERT for chats. Now Admin needs to DELETE.
CREATE POLICY "chats_delete_admin" ON chats FOR DELETE TO authenticated USING (true);

-- 7. SEED INITIAL DATA (Optional, matches existing hardcoded data)
-- Senin (1)
INSERT INTO schedules (day_id, subject, time_start, time_end, order_index) VALUES 
  (1, 'Upacara', '07.00', '08.00', 1),
  (1, 'Agama', '08.00', '10.00', 2),
  (1, 'Istirahat', '10.00', '10.15', 3),
  (1, 'Agama', '10.15', '11.00', 4),
  (1, 'Sejarah', '11.00', '11.45', 5),
  (1, 'Istirahat', '11.45', '12.15', 6),
  (1, 'Sejarah', '12.15', '13.00', 7),
  (1, 'B.Indonesia', '13.00', '14.30', 8);

-- Selasa (2)
INSERT INTO schedules (day_id, subject, time_start, time_end, order_index) VALUES 
  (2, 'Kimia', '07.00', '08.30', 1),
  (2, 'Biologi', '08.30', '10.00', 2),
  (2, 'Istirahat', '10.00', '10.15', 3),
  (2, 'Biologi', '10.15', '11.00', 4),
  (2, 'Matematika W', '11.00', '11.45', 5),
  (2, 'Istirahat', '11.45', '12.15', 6),
  (2, 'Matematika W', '12.15', '13.45', 7),
  (2, 'BK', '13.45', '14.30', 8);

-- Rabu (3)
INSERT INTO schedules (day_id, subject, time_start, time_end, order_index) VALUES 
  (3, 'Penjas', '07.00', '09.15', 1),
  (3, 'Fisika', '09.15', '10.00', 2),
  (3, 'Istirahat', '10.00', '10.15', 3),
  (3, 'Fisika', '10.15', '11.45', 4),
  (3, 'Istirahat', '11.45', '12.15', 5),
  (3, 'Seni Budaya', '12.15', '13.45', 6),
  (3, 'B.Inggris', '13.45', '15.15', 7);

-- Kamis (4)
INSERT INTO schedules (day_id, subject, time_start, time_end, order_index) VALUES 
  (4, 'B.Jawa', '07.00', '08.30', 1),
  (4, 'Kimia', '08.30', '10.00', 2),
  (4, 'Istirahat', '10.00', '10.15', 3),
  (4, 'Matematika M', '10.15', '11.45', 4),
  (4, 'Istirahat', '11.45', '12.15', 5),
  (4, 'Matematika M', '12.15', '13.00', 6),
  (4, 'B.Indonesia', '13.00', '14.30', 7);

-- Jumat (5)
INSERT INTO schedules (day_id, subject, time_start, time_end, order_index) VALUES 
  (5, 'PKWU', '07.00', '08.30', 1),
  (5, 'B.Inggris Lintas Minat', '08.30', '10.00', 2),
  (5, 'Istirahat', '10.00', '10.15', 3),
  (5, 'B.Inggris Lintas Minat', '10.15', '11.00', 4),
  (5, 'Pancasila', '11.00', '11.45', 5);

-- Sabtu (6)
INSERT INTO schedules (day_id, subject, time_start, time_end, order_index) VALUES 
  (6, 'Pancasila', '07.00', '07.45', 1),
  (6, 'Senam', '07.45', '08.30', 2),
  (6, 'Pramuka', '08.30', '10.00', 3);

-- SEED PIKET DATA
-- Senin (1)
INSERT INTO piket (day_id, student_name, order_index) VALUES 
  (1, 'Aldo', 1), (1, 'Alya', 2), (1, 'Ayu', 3), (1, 'Balqis', 4), (1, 'Fitri', 5), (1, 'Tia', 6);

-- Selasa (2)
INSERT INTO piket (day_id, student_name, order_index) VALUES 
  (2, 'Dina', 1), (2, 'Eka', 2), (2, 'Farhan', 3), (2, 'Fauziyah', 4), (2, 'Firda', 5), (2, 'Chelsea', 6);

-- Rabu (3)
INSERT INTO piket (day_id, student_name, order_index) VALUES 
  (3, 'Geby', 1), (3, 'Anggun', 2), (3, 'Halwa', 3), (3, 'Sultan', 4), (3, 'Keysa', 5), (3, 'Laura', 6);

-- Kamis (4)
INSERT INTO piket (day_id, student_name, order_index) VALUES 
  (4, 'Aeni', 1), (4, 'Luna', 2), (4, 'Marsa', 3), (4, 'Maulidia', 4), (4, 'Maya', 5), (4, 'Candra', 6), (4, 'Merys', 7);

-- Jumat (5)
INSERT INTO piket (day_id, student_name, order_index) VALUES 
  (5, 'Firdaus', 1), (5, 'Ihsaina', 2), (5, 'Niswah', 3), (5, 'Mutia', 4), (5, 'Nafis', 5), (5, 'Nasywa', 6);

-- Sabtu (6)
INSERT INTO piket (day_id, student_name, order_index) VALUES 
  (6, 'Nayla', 1), (6, 'Muntaha', 2), (6, 'Novelia', 3), (6, 'Qoila', 4), (6, 'Roro', 5), (6, 'Sella', 6), (6, 'Zhafira', 7);
