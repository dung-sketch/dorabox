import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('http')
  ? process.env.SUPABASE_URL
  : 'https://placeholder.supabase.co';

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key';

// Supabase Admin Client với quyền Service Role (bảo mật, chỉ chạy ở Backend)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
