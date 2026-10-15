import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('http')
  ? process.env.SUPABASE_URL
  : 'https://vcmsmyaupsksbjusnzoy.supabase.co';

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.length > 20
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjbXNteWF1cHNrc2JqdXNuem95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTI5NzEsImV4cCI6MjEwNzYyODk3MX0.zqtVl4Ke59u41gX8fPifJp7AJBqIlGt5-2huSP53xcA';

// Supabase Admin Client với quyền Service Role (bảo mật, chỉ chạy ở Backend)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
