create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);
-- RLS on with NO policies: the public anon key can neither read nor write.
-- Only the server (service role key, which bypasses RLS) inserts messages.
alter table public.messages enable row level security;
