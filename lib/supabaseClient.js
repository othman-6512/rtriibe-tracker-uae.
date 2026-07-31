'use client';
import { createClient } from '@supabase/supabase-js';

// Values hardcoded on purpose so a mis-entered Vercel env var can't break the app.
// The anon/publishable key is safe in the browser — access is guarded by RLS in Supabase.
const SUPABASE_URL = 'https://qfwntwmyecbojlvucwjx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_T4ZJk2B3VwGLmXflwUQj8w_rYEAA7Yh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
