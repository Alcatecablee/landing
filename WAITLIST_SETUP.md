# NeuroLint Waitlist Setup Guide

## Overview

The NeuroLint landing page has been converted to a waitlist system that redirects all `app.neurolint.dev` links to a Supabase-powered waitlist. Here's what was implemented:

## Features

✅ **Waitlist Component** - Beautiful, responsive form connected to Supabase
✅ **App Link Redirects** - All app.neurolint.dev links now redirect to waitlist
✅ **404 Page** - Custom 404 page with waitlist CTA
✅ **Smart Routing** - Detects when users came from app links
✅ **Success State** - Confirmation page after joining waitlist
✅ **Mobile Responsive** - Works perfectly on all devices

## Supabase Setup

### 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Wait for setup to complete

### 2. Create Waitlist Table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'onboarded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert
CREATE POLICY "Anyone can insert into waitlist" ON waitlist FOR INSERT WITH CHECK (true);

-- Create a policy that allows service role to read all
CREATE POLICY "Service role can read all waitlist entries" ON waitlist FOR SELECT USING (auth.role() = 'service_role');
```

### 3. Configure Environment Variables

1. Copy `client/.env.example` to `client/.env`
2. Get your Supabase URL and anon key from Settings > API
3. Update the values:

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## How It Works

### Navigation Redirects

- All "App", "Dashboard", "Log In", "Sign Up" buttons now trigger the waitlist
- Original links to docs and forum remain functional

### Smart Detection

- Detects if users came from `app.neurolint.dev` and shows 404 page
- URL parameters or hash containing "app" trigger 404 mode

### User Flow

1. **Landing Page** - Normal marketing page with waitlist CTAs
2. **Waitlist Form** - Beautiful form to collect email, name, company
3. **Success Page** - Confirmation with social links
4. **404 Page** - For users trying to access the app

### Components Created

- `Waitlist.tsx` - Main waitlist form and success state
- `NotFound.tsx` - 404 page with waitlist CTA
- `lib/supabase.ts` - Supabase client configuration

### Modified Components

- `App.tsx` - Added routing logic and view state management
- `SiteHeader.tsx` - Converted app links to waitlist triggers
- `pages/Index.tsx` - Updated all app CTAs to trigger waitlist

## Development

```bash
# Install dependencies
cd client && npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

## Database Management

### View Waitlist Entries

```sql
SELECT * FROM waitlist ORDER BY created_at DESC;
```

### Export to CSV

Use Supabase dashboard's export feature or:

```sql
COPY (SELECT email, name, company, created_at FROM waitlist ORDER BY created_at DESC) TO STDOUT WITH CSV HEADER;
```

### Update Status

```sql
UPDATE waitlist SET status = 'contacted' WHERE email = 'user@example.com';
```

## MCP Integration Suggestion

For better database management and automation, consider connecting the **Neon MCP server** through Builder.io:

1. Click the "MCP Servers" button under the chat input
2. Connect to Neon for advanced database management
3. This will give you enhanced database querying and management capabilities

## Troubleshooting

### Common Errors

**"Waitlist is not configured yet"**

- Check that `.env` or `.env.local` exists in the `client/` folder
- Verify environment variables are set correctly
- Restart the dev server after changing environment variables

**"[object Object]" errors**

- Now fixed with detailed error logging
- Check browser console for specific error details
- Usually indicates Supabase configuration or table setup issues

**Network errors**

- Check internet connection
- Verify Supabase project is active
- Check browser network tab for failed requests

### Debug Mode

Open browser console to see detailed error information:

- Configuration warnings on app start
- Detailed Supabase error messages
- Network error details

## Next Steps

1. **Set up Supabase** following the instructions above
2. **Configure environment variables**
3. **Test the waitlist** by submitting a form
4. **Monitor entries** in Supabase dashboard
5. **Set up email notifications** (optional)

The waitlist is now fully functional with comprehensive error handling and debugging!
