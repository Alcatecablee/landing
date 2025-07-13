import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
if (!supabaseUrl || supabaseUrl === "https://your-project-url.supabase.co") {
  console.warn(
    "⚠️ VITE_SUPABASE_URL not configured. Please set up your Supabase environment variables.",
  );
}

if (!supabaseAnonKey || supabaseAnonKey === "your-anon-key") {
  console.warn(
    "⚠️ VITE_SUPABASE_ANON_KEY not configured. Please set up your Supabase environment variables.",
  );
}

// Use fallback values for development
const finalUrl = supabaseUrl || "https://your-project-url.supabase.co";
const finalKey = supabaseAnonKey || "your-anon-key";

export const supabase = createClient(finalUrl, finalKey);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project-url.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"
  );
};

export interface WaitlistEntry {
  id?: string;
  email: string;
  name?: string;
  company?: string;
  created_at?: string;
  status?: "pending" | "contacted" | "onboarded";
}
