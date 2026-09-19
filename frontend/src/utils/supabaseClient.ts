import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { debugLog, debugError } from './debug';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your_supabase') &&
  !supabaseAnonKey.includes('your_supabase')
);

if (!isSupabaseConfigured) {
  debugLog('supabaseClient', 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not configured. Falling back to local data.');
}

// Resilient client instance: will not crash at startup even if env keys are pending
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);
