-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role text default 'user' check (role in ('admin', 'user')),

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text unique not null,
  content text not null,
  author_id uuid references auth.users not null default auth.uid(),
  published boolean default false
);

-- Set up RLS for posts
alter table posts enable row level security;

create policy "Published posts are viewable by everyone."
  on posts for select
  using ( published = true );

create policy "Admins can view all posts."
  on posts for select
  using ( 
    auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

create policy "Admins can insert posts."
  on posts for insert
  with check (
    auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

create policy "Admins can update posts."
  on posts for update
  using (
    auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

create policy "Admins can delete posts."
  on posts for delete
  using (
    auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket for blog images (optional, but good practice)
insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Images are viewable by everyone" 
on storage.objects for select 
using ( bucket_id = 'images' );

create policy "Admins can upload images" 
on storage.objects for insert 
with check ( 
  bucket_id = 'images' and 
  auth.uid() in (select id from profiles where role = 'admin') 
);
