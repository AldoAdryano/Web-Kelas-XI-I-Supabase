-- Migration: 002_rls_policies.sql
-- Enables Row Level Security and creates appropriate policies
-- Based on existing application access patterns from audit

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blacklist_ips ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CHATS POLICIES
-- Original: Anyone can read (onSnapshot), anyone can write (addDoc)
-- ============================================================

-- Anyone can read chat messages (needed for anonymous chat)
CREATE POLICY "chats_select_public"
  ON chats FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can insert new chat messages (anonymous chat)
CREATE POLICY "chats_insert_public"
  ON chats FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No one can update chat messages from the browser
-- (messages are immutable once sent)

-- No one can delete chat messages from the browser
-- (admin manages via Supabase Dashboard)

-- ============================================================
-- RATINGS POLICIES
-- Original: Anyone can write (addDoc), no reads from frontend
-- ============================================================

-- Allow reading ratings (for potential future average display)
CREATE POLICY "ratings_select_public"
  ON ratings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can insert ratings (anonymous rating)
CREATE POLICY "ratings_insert_public"
  ON ratings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No updates or deletes from browser

-- ============================================================
-- BLACKLIST_IPS POLICIES
-- Original: Anyone can read (getDocs), only admin writes via Console
-- ============================================================

-- Anyone can read the blacklist (needed for client-side IP check)
-- NOTE: This exposes blocked IPs to all users — same as original Firebase behavior.
-- A more secure approach would use an Edge Function, but we preserve existing behavior.
CREATE POLICY "blacklist_ips_select_public"
  ON blacklist_ips FOR SELECT
  TO anon, authenticated
  USING (true);

-- NO insert/update/delete from browser
-- Admin manages blocked IPs via Supabase Dashboard SQL Editor

-- ============================================================
-- ENABLE REALTIME FOR CHATS TABLE
-- Required for Supabase Realtime to work with the chats table
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE chats;
