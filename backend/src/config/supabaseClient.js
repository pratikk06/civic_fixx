// server/src/config/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabaseUrl = process.env.SUPABASE_URL || '';
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ Supabase configuration missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  } else {
    console.warn('⚠️ Supabase config missing – using mock client in test mode');
    supabaseUrl = 'https://mock.supabase.co';
    supabaseServiceKey = 'mock-key';
  }
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
