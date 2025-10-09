# Supabase Storage Implementation Guide

## Overview
This guide explains how image storage works in EcoTrace using Supabase Storage buckets instead of base64 strings.

## Architecture

### Flow Diagram
```
User uploads image → Base64 preview → Identify plant → Convert to File → Upload to Storage → Save URL to DB → Display in Gallery
```

### Components

1. **lib/imageStorage.js** - Storage utilities
2. **lib/plantStorage.js** - Database operations  
3. **app/page.js** - Initial upload and preview
4. **app/results/page.js** - Save plant with image upload
5. **app/Gallery/page.jsx** - Display saved plants

## Implementation Details

### 1. Image Storage Module (`lib/imageStorage.js`)

Three core functions:

#### `uploadPlantImage(file, userId)`
- Accepts a File object and user ID
- Generates unique filename: `{userId}/{timestamp}.{ext}`
- Uploads to `plant-images` bucket
- Returns public URL

#### `deletePlantImage(path)`
- Accepts storage path (e.g., "user123/1234567890.jpg")
- Removes file from bucket
- Returns boolean success

#### `dataURLtoFile(dataUrl, filename)`
- Converts base64 data URL to File object
- Handles MIME type extraction
- Used when converting canvas/camera images

### 2. Plant Storage Module (`lib/plantStorage.js`)

#### `savePlantResult(plantData, userId)`
- Saves plant identification to database
- Expects `uploadedImage` to be a Storage URL (not base64)
- Includes deduplication logic
- Returns `{duplicate: boolean, id: string}`

#### `deletePlantResult(id, userId)`
- Deletes from database
- Extracts image path from URL
- Calls `deletePlantImage` to remove from Storage
- Handles both Storage URLs and legacy base64

### 3. Upload Flow (`app/page.js`)

Current implementation:
- User selects image → creates base64 preview
- On analyze → sends to API → navigates to results with base64

**No changes needed here** - base64 is fine for preview and passing between pages.

### 4. Results Page (`app/results/page.js`)

Key section (lines 60-95):
```javascript
// Upload image to Supabase Storage if it's a data URL
let imageUrl = parsed.uploadedImage;
if (imageUrl && imageUrl.startsWith('data:')) {
  try {
    const file = dataURLtoFile(imageUrl, `plant-${Date.now()}.jpg`);
    const uploadResult = await uploadPlantImage(file, user.id);
    imageUrl = uploadResult;
    console.log('Image uploaded to Storage:', imageUrl);
  } catch (uploadErr) {
    console.error('Failed to upload image to Storage:', uploadErr);
    // Continue with data URL as fallback
  }
}

// Save plant result with image URL
const plantDataToSave = { ...parsed, uploadedImage: imageUrl };
const result = await savePlantResult(plantDataToSave, user.id);
```

**This is the critical conversion point** - base64 → File → Storage URL → Database

### 5. Gallery Display (`app/Gallery/page.jsx`)

The gallery already handles this correctly:
```jsx
<img src={item.uploaded_image} alt={item.scientific_name} />
```

Works with both:
- Storage URLs: `https://...supabase.co/storage/v1/object/public/plant-images/user123/123.jpg`
- Legacy base64: `data:image/jpeg;base64,...` (during migration)

## Database Schema

### `plant_results` table
```sql
CREATE TABLE plant_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scientific_name TEXT NOT NULL,
  common_names TEXT[] DEFAULT '{}',
  family TEXT,
  genus TEXT,
  score FLOAT,
  uploaded_image TEXT,  -- Storage URL (not base64)
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint to prevent duplicates
CREATE UNIQUE INDEX unique_plant_per_user_image 
ON plant_results (user_id, scientific_name, uploaded_image);
```

## Supabase Storage Setup

### 1. Create Bucket

Run in Supabase SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', true)
ON CONFLICT (id) DO NOTHING;
```

### 2. Set Up Policies

```sql
-- Allow users to upload their own images
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'plant-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'plant-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'plant-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Testing Checklist

### ✅ Upload Flow
1. Go to home page
2. Upload or take photo of a plant
3. Click "Analyze"
4. Check browser console - should see "Image uploaded to Storage: https://..."
5. Verify in Supabase Dashboard → Storage → plant-images bucket

### ✅ Gallery Display
1. Navigate to Gallery
2. Verify images load without ERR_FILE_NOT_FOUND
3. Click on a plant card → should navigate to results
4. Image should display correctly

### ✅ Delete Flow
1. In Gallery, click delete on a plant
2. Check Supabase Dashboard → Storage
3. Verify image file is removed from bucket
4. Verify database record is deleted

### ✅ Deduplication
1. Upload same plant twice
2. Should only appear once in gallery
3. Check console for "Plant already exists" or "Duplicate detected"

## Troubleshooting

### Images not uploading
**Symptom**: Console shows "Upload error"
**Fixes**:
- Verify bucket exists in Supabase Dashboard
- Check bucket is public
- Verify storage policies are created
- Check user is authenticated

### Images not loading in Gallery
**Symptom**: Broken image icons or ERR_FILE_NOT_FOUND
**Fixes**:
- Check `uploaded_image` field in database contains full URL
- Verify URL is accessible (paste in browser)
- Check bucket is public
- Clear browser cache

### Duplicates still appearing
**Symptom**: Same plant appears multiple times
**Fixes**:
- Run deduplication migration (001_prevent_duplicates.sql)
- Clear sessionStorage in browser
- Check unique constraint exists on table
- Verify `uploadedImage` comparison is working

### Upload quota exceeded
**Symptom**: "Storage quota exceeded" error
**Fixes**:
- Check Supabase project storage limit
- Upgrade plan if needed
- Implement image compression before upload
- Clean up old/unused images

## Performance Optimization

### Image Compression
Add before upload in `uploadPlantImage`:
```javascript
async function compressImage(file) {
  // Use canvas to resize/compress
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = await createImageBitmap(file);
  
  const maxWidth = 1200;
  const scale = maxWidth / img.width;
  canvas.width = maxWidth;
  canvas.height = img.height * scale;
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/jpeg', 0.8);
  });
}
```

### CDN Caching
Supabase Storage automatically provides CDN caching. Images are served from edge locations globally.

### Lazy Loading
Already implemented in Gallery with native `loading="lazy"`:
```jsx
<img src={item.uploaded_image} loading="lazy" />
```

## Migration from Base64

If you have existing plants with base64 images:

### Option 1: Gradual (Recommended)
- New uploads automatically use Storage
- Old entries continue to work (base64 still displays)
- Users can re-upload plants to convert them
- Delete old entries manually over time

### Option 2: Automated Migration
```javascript
async function migrateToStorage() {
  const { data: plants } = await supabase
    .from('plant_results')
    .select('*')
    .like('uploaded_image', 'data:%');

  for (const plant of plants) {
    try {
      const file = dataURLtoFile(plant.uploaded_image, 'plant.jpg');
      const url = await uploadPlantImage(file, plant.user_id);
      
      await supabase
        .from('plant_results')
        .update({ uploaded_image: url })
        .eq('id', plant.id);
        
      console.log(`Migrated plant ${plant.id}`);
    } catch (err) {
      console.error(`Failed to migrate ${plant.id}:`, err);
    }
  }
}
```

## Environment Variables

Required in Vercel (and `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Benefits of Storage Approach

✅ **Performance**: Images load faster from CDN
✅ **Scalability**: No database size bloat from base64
✅ **Reliability**: Dedicated storage infrastructure  
✅ **Organization**: Files organized by user ID
✅ **Cleanup**: Easy to delete orphaned images
✅ **Cost**: More efficient storage billing

## Additional Features to Consider

### Image Thumbnails
Generate thumbnails on upload for faster gallery loading:
```javascript
const thumbnail = await compressImage(file, 300, 300);
await uploadPlantImage(thumbnail, userId, 'thumbnails');
```

### Image Metadata
Store additional data:
```sql
ALTER TABLE plant_results ADD COLUMN image_metadata JSONB;
-- Store: { width, height, size, format, uploadedAt }
```

### Batch Delete
Clean up user's images on account deletion:
```javascript
async function deleteAllUserImages(userId) {
  const { data } = await supabase.storage
    .from('plant-images')
    .list(userId);
    
  const paths = data.map(file => `${userId}/${file.name}`);
  await supabase.storage.from('plant-images').remove(paths);
}
```

## Summary

The current implementation:
1. ✅ Converts base64 to File objects
2. ✅ Uploads to Supabase Storage bucket
3. ✅ Stores public URLs in database
4. ✅ Displays images from Storage in Gallery
5. ✅ Deletes from both DB and Storage
6. ✅ Handles duplicates properly
7. ✅ Falls back to base64 during migration

**Status**: Fully implemented and ready for production use.
