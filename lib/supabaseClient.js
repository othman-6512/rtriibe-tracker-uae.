'use client';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qcdsydoirbughuhdswof.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_T4ZJk2B3VwGLmXflwUQj8w_rYEAA7Yh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
