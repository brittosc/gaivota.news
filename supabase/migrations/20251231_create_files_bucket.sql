-- Create storage bucket for files (safe to run)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-files', 'blog-files', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
-- We update the policies to include the new 'blog-files' bucket

-- Policy: Allow public read access to all objects in these buckets
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING ( bucket_id IN ('blog-images', 'blog-audio', 'blog-video', 'blog-files') );

-- Policy: Allow authenticated users to upload/insert objects
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  bucket_id IN ('blog-images', 'blog-audio', 'blog-video', 'blog-files')
);

-- Policy: Allow authenticated users to update/delete
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('blog-images', 'blog-audio', 'blog-video', 'blog-files')
);

DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('blog-images', 'blog-audio', 'blog-video', 'blog-files')
);
