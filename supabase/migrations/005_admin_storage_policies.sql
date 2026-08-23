-- Migration: 005_admin_storage_policies.sql
-- Memberikan akses penuh kepada Admin (authenticated user) untuk memanajemen file di semua bucket

CREATE POLICY "Admin Full Access Storage" 
ON storage.objects 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
