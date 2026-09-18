import { createClient } from '@supabase/supabase-js';
import { debugError } from './debug';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) {
  debugError('supabaseClient', 'VITE_SUPABASE_URL is not set in .env.local');
}
if (!supabaseAnonKey) {
  debugError('supabaseClient', 'VITE_SUPABASE_ANON_KEY is not set in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
