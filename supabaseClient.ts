import { createClient } from '@supabase/supabase-js';

// جلب البيانات تلقائياً من ملف .env الذي قمنا بإعداده وحفظه بنجاح
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
