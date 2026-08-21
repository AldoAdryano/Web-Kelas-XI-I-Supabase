-- Migration: 001_initial_schema.sql
-- Creates tables for chats, ratings, and blacklist_ips
-- Based on Firebase Firestore schema discovered during audit

-- ============================================================
-- CHATS TABLE
-- Replaces Firestore collection "chats"
-- ============================================================
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_firebase_id TEXT,
  message TEXT NOT NULL CHECK (char_length(message) <= 60),
  sender_image TEXT NOT NULL DEFAULT '/AnonimUser.png',
  user_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat messages are always queried ordered by timestamp
CREATE INDEX idx_chats_created_at ON chats (created_at ASC);

-- ============================================================
-- RATINGS TABLE
-- Replaces Firestore collection "ratings"
-- ============================================================
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_firebase_id TEXT,
  value NUMERIC(3,1) NOT NULL CHECK (value >= 0 AND value <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ratings_created_at ON ratings (created_at ASC);

-- ============================================================
-- BLACKLIST_IPS TABLE
-- Replaces Firestore collection "blacklist_ips"
-- ============================================================
CREATE TABLE IF NOT EXISTS blacklist_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blacklist_ips_address ON blacklist_ips (ip_address);
