create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table site_settings enable row level security;

create policy "Settings are viewable by everyone"
  on site_settings for select
  using (true);

create policy "Settings are insertable by admins"
  on site_settings for insert
  with check (
    auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

create policy "Settings are updatable by admins"
  on site_settings for update
  using (
    auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );
