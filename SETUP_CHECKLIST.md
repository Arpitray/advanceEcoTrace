# Quick Setup Checklist

## ✅ Code Implementation (DONE)
- [x] `lib/imageStorage.js` - Clean storage utilities created
- [x] `lib/plantStorage.js` - Updated with image deletion
- [x] `app/results/page.js` - Converts base64 to Storage URLs
- [x] `app/Gallery/page.jsx` - Normalized common_names display
- [x] `lib/SupabaseClient.js` - Safe stub for prerender

## 🔧 Supabase Dashboard Setup (YOU NEED TO DO THIS)

### Step 1: Run Database Migrations

1. Open Supabase Dashboard → SQL Editor
2. Run this migration:

```sql
-- Remove duplicate plant results
DELETE FROM plant_results a
USING plant_results b
WHERE a.user_id = b.user_id
  AND a.scientific_name = b.scientific_name
  AND a.uploaded_image = b.uploaded_image
  AND a.id < b.id;

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS unique_plant_per_user_image 
ON plant_results (user_id, scientific_name, uploaded_image);

-- Add created_at column
ALTER TABLE plant_results 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

### Step 2: Create Storage Bucket

Run this in SQL Editor:

```sql
-- Create plant-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', true)
ON CONFLICT (id) DO NOTHING;
```

### Step 3: Set Up Storage Policies

Run this in SQL Editor:

```sql
-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own plant images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plant-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to view plant images
CREATE POLICY "Users can view all plant images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'plant-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own plant images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'plant-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own images
CREATE POLICY "Users can update their own plant images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'plant-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 4: Verify Setup

In Supabase Dashboard:
1. Go to Storage → Check `plant-images` bucket exists
2. Go to Storage → Policies → Verify 4 policies are created
3. Go to Database → Tables → plant_results → Check unique index exists

## 🚀 Vercel Deployment (IF DEPLOYING)

### Set Environment Variables

In Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Get these values from:
- Supabase Dashboard → Project Settings → API

### Redeploy

After setting env vars:
```bash
git add .
git commit -m "Implement Supabase Storage for images"
git push origin main
```

Or trigger manual redeploy in Vercel dashboard.

## 🧪 Testing the Implementation

### Test 1: Upload New Plant
1. Go to homepage
2. Upload or take photo
3. Click Analyze
4. Open browser console (F12)
5. Look for: `"Image uploaded to Storage: https://..."`
6. Go to Gallery → Verify image loads correctly

### Test 2: Check Supabase Storage
1. Open Supabase Dashboard → Storage → plant-images
2. Navigate to your user_id folder
3. Verify image file is there
4. Click on it → Should preview the plant image

### Test 3: Delete Plant
1. In Gallery, hover over a plant card
2. Click red delete button
3. Confirm deletion
4. Check Supabase Storage → Image should be removed
5. Refresh Gallery → Plant should be gone

### Test 4: Duplicate Prevention
1. Upload same plant twice (same image, same result)
2. Should only appear once in gallery
3. Check console for "Plant already saved" or "Duplicate detected"

### Test 5: Common Names Display
1. View Gallery
2. Each card should show:
   - Plant image
   - Scientific name (italic)
   - Common name (or family as fallback)
3. No "[object Object]" or stray brackets

## 🐛 Troubleshooting

### Images not uploading
**Error**: "Upload error" in console
**Fix**:
- Run Step 2 & 3 above (create bucket + policies)
- Check user is logged in
- Verify env vars are set

### Images not loading in Gallery
**Error**: Broken image icons
**Fix**:
- Check bucket is public (Step 2)
- Verify SELECT policy exists (Step 3)
- Inspect element → Check if `src` is a valid URL

### Duplicates appearing
**Error**: Same plant shows multiple times
**Fix**:
- Run Step 1 migration (remove duplicates + add unique index)
- Clear browser sessionStorage
- Hard refresh (Ctrl+Shift+R)

### Vercel build failing
**Error**: "supabaseUrl is required"
**Fix**:
- Set environment variables in Vercel (see above)
- Redeploy after adding env vars

## 📝 What Changed

### Before (Problems)
- ❌ Images stored as base64 in database
- ❌ ERR_FILE_NOT_FOUND errors
- ❌ Database bloated with large base64 strings
- ❌ Duplicate plants appearing
- ❌ Common names showing as "[object Object]"

### After (Fixed)
- ✅ Images uploaded to Supabase Storage
- ✅ Only URLs stored in database
- ✅ Fast CDN-backed image loading
- ✅ Duplicate prevention at DB level
- ✅ Common names properly normalized
- ✅ Images deleted from storage when plant removed
- ✅ Build-safe Supabase client

## 📚 Documentation

See these files for details:
- `STORAGE_IMPLEMENTATION.md` - Complete technical guide
- `MIGRATION_GUIDE.md` - Original migration planning
- `supabase/migrations/` - SQL migration files

## 🎯 Next Steps

After completing setup above:

1. Test thoroughly (use checklist above)
2. Consider adding image compression (see STORAGE_IMPLEMENTATION.md)
3. Monitor Supabase storage usage
4. Optionally migrate old base64 images (see guide)

---

**Status**: All code is implemented. Just needs Supabase dashboard configuration (Steps 1-3 above).
