-- NeuroLint Waitlist Table Setup
-- Run this SQL in your Supabase SQL Editor

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'onboarded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for the waitlist form)
CREATE POLICY "Anyone can insert into waitlist" ON waitlist 
FOR INSERT WITH CHECK (true);

-- Create a policy that allows service role to read all (for admin access)
CREATE POLICY "Service role can read all waitlist entries" ON waitlist 
FOR SELECT USING (auth.role() = 'service_role');

-- Create a policy that allows service role to update (for admin management)
CREATE POLICY "Service role can update waitlist entries" ON waitlist 
FOR UPDATE USING (auth.role() = 'service_role');

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_updated_at 
    BEFORE UPDATE ON waitlist 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for admin dashboard (if needed later)
CREATE OR REPLACE VIEW waitlist_summary AS
SELECT 
    status,
    COUNT(*) as count,
    MIN(created_at) as first_signup,
    MAX(created_at) as latest_signup
FROM waitlist 
GROUP BY status;
