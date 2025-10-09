import { supabase } from './SupabaseClient';

export async function uploadPlantImage(file, userId) {
  if (!file || !userId) {
    console.error('Missing file or userId');
    return null;
  }

  try {
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = timestamp + '.' + ext;
    const filePath = userId + '/' + fileName;

    const { error: uploadError } = await supabase.storage
      .from('plant-images')
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('plant-images').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error('Upload error:', err);
    return null;
  }
}

export async function deletePlantImage(path) {
  if (!path) return false;

  try {
    const { error } = await supabase.storage.from('plant-images').remove([path]);
    if (error) {
      console.error('Delete error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Delete error:', err);
    return false;
  }
}

export function dataURLtoFile(dataUrl, filename) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename || 'image.jpg', { type: mime });
}
