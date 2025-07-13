import { createClient } from "@supabase/supabase-js";

// These should be environment variables in production
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project-url.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WaitlistEntry {
  id?: string;
  email: string;
  name?: string;
  company?: string;
  created_at?: string;
  status?: "pending" | "contacted" | "onboarded";
}
