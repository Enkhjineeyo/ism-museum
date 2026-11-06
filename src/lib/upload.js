import { supabase } from '../supabaseClient'

// Supabase Storage ('images' bucket)-д зураг хадгалаад public URL буцаана
export async function uploadImage(file, folder) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('images').upload(path, file, { contentType: file.type })
  if (error) throw error
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl
}
