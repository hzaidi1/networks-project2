import { createClient } from '@supabase/supabase-js';

// This client uses the service role key — only use it from the backend.
// It bypasses Row Level Security and has full database access.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false, // We don't use Supabase's auth, so no session needed
    },
  }
);