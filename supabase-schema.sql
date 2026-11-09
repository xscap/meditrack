create table if not exists public.medical_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  middle_name text,
  last_name text not null,
  disease text not null,
  doctor_name text not null,
  age integer not null check (age between 0 and 150),
  medicines jsonb not null default '[]'::jsonb
    check (jsonb_typeof(medicines) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.medical_profiles enable row level security;

revoke all on table public.medical_profiles
  from anon, authenticated, public;

grant select, insert, update
  on table public.medical_profiles
  to authenticated;

drop policy if exists "Users can view their own medical profile"
  on public.medical_profiles;
create policy "Users can view their own medical profile"
  on public.medical_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own medical profile"
  on public.medical_profiles;
create policy "Users can create their own medical profile"
  on public.medical_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own medical profile"
  on public.medical_profiles;
create policy "Users can update their own medical profile"
  on public.medical_profiles
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
