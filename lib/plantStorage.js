import { supabase } from './SupabaseClient';
import { deletePlantImage } from './imageStorage';

// ✅ Save a new plant result with upsert to prevent duplicates
export const savePlantResult = async (plantData, userId) => {
  try {
    // Normalize scientific name for comparisons
    const sciName = (plantData.scientificName || '').trim();

    if (!sciName || !userId) {
      console.warn('Missing required fields for plant save');
      return false;
    }

    // First, check if this exact combination already exists
    const { data: existing, error: checkError } = await supabase
      .from('plant_results')
      .select('id, timestamp')
      .eq('user_id', userId)
      .eq('scientific_name', sciName)
      .eq('uploaded_image', plantData.uploadedImage || '')
      .maybeSingle();

    if (checkError) {
      console.warn('Error checking for existing plant:', checkError.message);
    }

    // If it exists, just return that ID (don't create duplicate)
    if (existing) {
      console.log('Plant already exists in database, returning existing ID');
      return { duplicate: true, id: existing.id };
    }

    // Insert new plant result
    const { data, error } = await supabase
      .from('plant_results')
      .insert({
        user_id: userId,
        scientific_name: sciName,
        common_names: plantData.commonNames || [],
        family: plantData.family || null,
        genus: plantData.genus || null,
        score: plantData.score || null,
        uploaded_image: plantData.uploadedImage || null,
      })
      .select()
      .single();

    if (error) {
      // If this is a unique constraint violation, fetch and return the existing entry
      if (error.code === '23505') {
        console.log('Duplicate detected via constraint, fetching existing entry');
        const { data: existingEntry } = await supabase
          .from('plant_results')
          .select('id')
          .eq('user_id', userId)
          .eq('scientific_name', sciName)
          .eq('uploaded_image', plantData.uploadedImage || '')
          .single();
        
        return { duplicate: true, id: existingEntry?.id };
      }
      throw error;
    }

    console.log('Successfully saved new plant result');
    return { duplicate: false, id: data.id };
  } catch (err) {
    console.error('Error saving plant result:', err.message);
    return false;
  }
};

// ✅ Fetch all plant results for a user
export const getPlantHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('plant_results')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching plant history:', err.message);
    return [];
  }
};

// ✅ Delete a plant result
export const deletePlantResult = async (id, userId) => {
  try {
    // First, fetch the plant result to get the image path
    const { data: plant, error: fetchError } = await supabase
      .from('plant_results')
      .select('uploaded_image')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    // Delete from database
    const { error } = await supabase
      .from('plant_results')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    // Delete image from Storage if it's a Storage URL (not a data URL)
    if (plant?.uploaded_image && plant.uploaded_image.includes('supabase')) {
      try {
        // Extract the path from the URL
        const url = new URL(plant.uploaded_image);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/plant-images\/(.+)$/);
        if (pathMatch && pathMatch[1]) {
          await deletePlantImage(pathMatch[1]);
          console.log('Deleted image from Storage:', pathMatch[1]);
        }
      } catch (imgErr) {
        console.warn('Failed to delete image from Storage:', imgErr);
        // Continue anyway since DB deletion succeeded
      }
    }

    return true;
  } catch (err) {
    console.error('Error deleting plant result:', err.message);
    return false;
  }
};

// --- Convenience helpers to store image URLs (permanent) and fetch them ---
/**
 * Save a plant image record to the DB using a permanent Storage URL.
 * This adapts the simple logic you provided to the existing `plant_results` table.
 *
 * @param {string} userId
 * @param {string} plantName
 * @param {string} imageUrl - public URL (not data: blob)
 */
export async function savePlantImageToDB(userId, plantName, imageUrl) {
  try {
    const { data, error } = await supabase
      .from('plant_results')
      .insert({
        user_id: userId,
        scientific_name: plantName,
        uploaded_image: imageUrl,
      });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving plant image to DB:', err.message || err);
    throw err;
  }
}

/**
 * Fetch saved plant images for a user. Returns records ordered by newest first.
 * @param {string} userId
 */
export async function getUserPlantImages(userId) {
  try {
    // Prefer created_at if available, fallback to timestamp
    const orderColumn = 'created_at';
    const { data, error } = await supabase
      .from('plant_results')
      .select('*')
      .eq('user_id', userId)
      .order(orderColumn, { ascending: false });

    if (error) {
      // If ordering by created_at fails (column may not exist), retry using timestamp
      if (error?.message?.includes('column "created_at" does not exist')) {
        const { data: tdata, error: terr } = await supabase
          .from('plant_results')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false });
        if (terr) throw terr;
        return tdata;
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error fetching user plant images:', err.message || err);
    throw err;
  }
}
