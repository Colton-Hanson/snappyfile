-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).

-- 1. Table that tracks uploaded files.
create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  storage_path text not null,
  original_filename text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists files_slug_idx on files (slug);
create index if not exists files_expires_at_idx on files (expires_at);

-- RLS is on with zero policies: the app only ever talks to this table with the
-- service_role key (see lib/supabase.ts), which bypasses RLS entirely. Enabling
-- it with no policies just means the anon/public key can never read or write
-- this table directly, even if that key were ever exposed client-side.
alter table files enable row level security;

-- 2. Storage bucket that holds the actual file bytes.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', false)
on conflict (id) do nothing;

-- No storage.objects policies are added for the same reason as above: all
-- storage access goes through the server using the service_role key, which
-- bypasses storage RLS too. The bucket is private (public = false), so nobody
-- can read files by guessing a storage path — downloads only work through the
-- app's signed-URL redirect at /f/[slug], which only issues a URL for
-- non-expired rows.

-- Optional (not required to run): files past their expires_at are never
-- automatically deleted from storage or the table today, same as the
-- existing "links" table for the URL shortener. If storage costs/row growth
-- ever become a concern, add a scheduled job (e.g. Supabase Cron + a SQL
-- function, or a Vercel Cron hitting a cleanup route) that deletes expired
-- rows and their matching storage objects.
