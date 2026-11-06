import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.log('❌ .env уншигдсангүй (URL эсвэл key хоосон байна)')
  process.exit(1)
}

const supabase = createClient(url, key)
const { data, error } = await supabase.from('teachers').select('id, name, position')

if (error) console.log('❌ Алдаа:', error.message)
else console.log(`✅ Холбогдлоо. ${data.length} багш олдлоо:`, data)