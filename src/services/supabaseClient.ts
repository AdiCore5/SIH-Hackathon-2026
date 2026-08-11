import { createClient } from '@supabase/supabase-js';

// Load Supabase environment variables from Vite env config
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ JanSetu-AI: Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are missing. App will automatically run in local mockup mode using LocalStorage and mock AI simulation.'
  );
}

// Fallback empty strings to prevent createClient from throwing exception
const url = supabaseUrl || 'https://placeholder-project-id.supabase.co';
const key = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
