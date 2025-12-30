-- Allow public read access to post_tags
create policy "Public read post_tags" on post_tags for select using (true);

-- Allow authenticated users (authors/admins) to manage post_tags
create policy "Authenticated users can insert post_tags" on post_tags for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can delete post_tags" on post_tags for delete using (auth.role() = 'authenticated');
