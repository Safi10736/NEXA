import { createClient } from '@supabase/supabase-js';

/**
 * NEXA - Standard Supabase Initialization
 * Direct hardcoding to ensure zero failures across all environments (Mobile/Desktop/iFrame)
 */
const supabaseUrl = 'https://gnspkprqfsswnlvbuxvd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imduc3BrcHJxZnNzd25sdmJ1eHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NzI1NTEsImV4cCI6MjA5MjI0ODU1MX0.wmAT-blyJW1AFK00366LeLvBguMor7fIreGawkwtSHQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
