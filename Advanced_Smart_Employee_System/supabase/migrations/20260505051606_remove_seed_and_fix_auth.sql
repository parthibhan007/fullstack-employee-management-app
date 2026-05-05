/*
  # Fix Authentication and Remove Bad Seed

  ## Overview
  Removes the problematic auth.users insertion that was causing database errors.
  The default admin account must be created through Supabase's Auth API, not direct SQL.
*/

DO $$
BEGIN
  DELETE FROM auth.identities WHERE provider_id = 'admin@gmail.com';
  DELETE FROM auth.users WHERE email = 'admin@gmail.com';
END $$;
