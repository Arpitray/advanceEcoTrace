import { supabase } from './SupabaseClient'

export async function uploadPlantImage(file, userId) {
  if (!file) throw new Error('No file provided')

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  // Upload to the 'plant-images' bucket
  const { error: uploadError } = await supabase.storage
    .from('plant-images')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  // Get the public URL
  const { data: publicData } = supabase.storage
    .from('plant-images')
    .getPublicUrl(filePath)

  return publicData.publicUrl
}
