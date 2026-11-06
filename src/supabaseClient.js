import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasEnv = Boolean(url && key)
// .env байхгүй үед build/ажиллагаа унахгүй байлгах
export const supabase = createClient(url || 'http://localhost:54321', key || 'missing-key')
