-- Update the file size limit for the blog-video bucket to 100MB (in bytes)
-- 100MB = 100 * 1024 * 1024 = 104857600
-- 500MB = 524288000

UPDATE storage.buckets
SET file_size_limit = 524288000 -- 500MB
WHERE name = 'blog-video';

UPDATE storage.buckets
SET file_size_limit = 52428800 -- 50MB
WHERE name = 'blog-audio';

UPDATE storage.buckets
SET file_size_limit = 10485760 -- 10MB
WHERE name = 'blog-images';
