import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client built with the service-role key, which bypasses
// RLS. Never import this from a client component or expose the key to the
// browser. Lazily created so a missing env var throws only when actually used.
let clientInstance = null;

export function getSupabaseAdmin() {
  if (clientInstance) return clientInstance;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('Supabase Admin is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).');
  }

  clientInstance = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return clientInstance;
}
