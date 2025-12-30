
-- TAGS SYSTEM
create table if not exists tags (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

create table if not exists post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- NEWSLETTER SYSTEM
create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamptz default now(),
  active boolean default true
);

-- RLS POLICIES
alter table tags enable row level security;
alter table post_tags enable row level security;
alter table newsletter_subscribers enable row level security;

create policy "Public read tags" on tags for select using (true);
create policy "Authenticated users can create tags" on tags for insert with check (auth.role() = 'authenticated');
create policy "Public subscribe newsletter" on newsletter_subscribers for insert with check (true);
