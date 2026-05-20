-- Stutzman's Construction shared admin content storage
-- Run this in Supabase SQL Editor one time.

create table if not exists public.stutzmans_site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_stutzmans_site_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_stutzmans_site_content_updated_at on public.stutzmans_site_content;
create trigger set_stutzmans_site_content_updated_at
before update on public.stutzmans_site_content
for each row
execute function public.set_stutzmans_site_content_updated_at();

alter table public.stutzmans_site_content enable row level security;

drop policy if exists "Public can read Stutzmans site content" on public.stutzmans_site_content;
create policy "Public can read Stutzmans site content"
on public.stutzmans_site_content
for select
to anon
using (true);

drop policy if exists "Public can insert Stutzmans site content" on public.stutzmans_site_content;
create policy "Public can insert Stutzmans site content"
on public.stutzmans_site_content
for insert
to anon
with check (id = 'main');

drop policy if exists "Public can update Stutzmans site content" on public.stutzmans_site_content;
create policy "Public can update Stutzmans site content"
on public.stutzmans_site_content
for update
to anon
using (id = 'main')
with check (id = 'main');
