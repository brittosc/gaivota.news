-- Add newsletter_sent_at column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS newsletter_sent_at TIMESTAMP WITH TIME ZONE;
