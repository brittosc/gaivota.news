-- Add archived column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create supporters table
CREATE TABLE IF NOT EXISTS supporters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  link TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create post_revisions table
CREATE TABLE IF NOT EXISTS post_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies For Supporters
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active supporters" ON supporters;
CREATE POLICY "Public can view active supporters" ON supporters FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Admins can manage supporters" ON supporters;
CREATE POLICY "Admins can manage supporters" ON supporters FOR ALL USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- RLS Policies For Post Likes
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view likes" ON post_likes;
CREATE POLICY "Public can view likes" ON post_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own likes" ON post_likes;
CREATE POLICY "Users can insert own likes" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own likes" ON post_likes;
CREATE POLICY "Users can delete own likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies For Post Revisions
ALTER TABLE post_revisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Editors/Admins can view revisions" ON post_revisions;
CREATE POLICY "Editors/Admins can view revisions" ON post_revisions FOR SELECT USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role IN ('admin', 'editor', 'user')
  )
);

DROP POLICY IF EXISTS "Editors/Admins can create revisions" ON post_revisions;
CREATE POLICY "Editors/Admins can create revisions" ON post_revisions FOR INSERT WITH CHECK (
  auth.uid() = author_id
);

DROP POLICY IF EXISTS "Admins can update revisions" ON post_revisions;
CREATE POLICY "Admins can update revisions" ON post_revisions FOR UPDATE USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- Function to increment/decrement likes count automatically
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_like_change ON post_likes;
CREATE TRIGGER on_like_change
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE PROCEDURE update_likes_count();
