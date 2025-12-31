-- Create storage buckets (safe to run)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-audio', 'blog-audio', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-video', 'blog-video', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
-- Note: We are NOT running 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY' as it's typically already on and restricted.

-- Policy: Allow public read access to all objects in these buckets
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING ( bucket_id IN ('blog-images', 'blog-audio', 'blog-video') );

-- Policy: Allow authenticated users to upload/insert objects
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  bucket_id IN ('blog-images', 'blog-audio', 'blog-video')
);

-- Policy: Allow authenticated users to update/delete
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('blog-images', 'blog-audio', 'blog-video')
);

DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('blog-images', 'blog-audio', 'blog-video')
);

-- FIX POSTS TABLE RLS (This is for your public.posts table, so you ARE the owner)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to posts
DROP POLICY IF EXISTS "Public can view posts" ON posts;
CREATE POLICY "Public can view posts" ON posts FOR SELECT USING (true);

-- Allow Admins and Editors to INSERT posts
DROP POLICY IF EXISTS "Admins/Editors can insert posts" ON posts;
CREATE POLICY "Admins/Editors can insert posts" ON posts FOR INSERT 
WITH CHECK (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() 
    and profiles.role IN ('admin', 'editor')
  )
);

-- Allow Admins and Editors to UPDATE posts
DROP POLICY IF EXISTS "Admins/Editors can update posts" ON posts;
CREATE POLICY "Admins/Editors can update posts" ON posts FOR UPDATE
USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() 
    and profiles.role IN ('admin', 'editor')
  )
);

-- Allow Admins to DELETE posts
DROP POLICY IF EXISTS "Admins can delete posts" ON posts;
CREATE POLICY "Admins can delete posts" ON posts FOR DELETE
USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() 
    and profiles.role = 'admin'
  )
);
