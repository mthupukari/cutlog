create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select id
  from public.profiles
  where auth_user_id = auth.uid()
  limit 1
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text,
  display_name text not null default 'Mahit',
  current_weight_lb numeric(5,1),
  goal_weight_lb numeric(5,1),
  daily_calorie_target integer not null default 1800,
  daily_protein_target integer not null default 175,
  daily_water_goal_oz integer not null default 120,
  dietary_restrictions text[] not null default '{}',
  meal_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  owner_profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  cuisine text,
  source text not null check (source in ('library', 'ai_generated')),
  tags text[] not null default '{}',
  macros jsonb not null,
  ingredients jsonb not null,
  steps jsonb not null,
  cook_methods jsonb not null,
  grocery_store text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.planned_weeks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  theme text,
  status text not null default 'draft' check (status in ('draft', 'accepted', 'archived')),
  plan_days jsonb not null,
  grocery_items jsonb not null default '[]'::jsonb,
  macro_summary jsonb not null default '{}'::jsonb,
  generation_rationale text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.food_log_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  planned_week_id uuid references public.planned_weeks(id) on delete set null,
  recipe_id uuid references public.recipes(id) on delete set null,
  source text not null check (source in ('photo', 'manual', 'planned_meal')),
  meal_label text not null,
  note text,
  eaten_at timestamptz not null,
  photo_url text,
  ai_estimate jsonb,
  corrected_macros jsonb not null,
  confidence numeric(4,3),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.water_log_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount_oz integer not null,
  logged_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Nutrition Coach',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  context_refs jsonb not null default '[]'::jsonb,
  action_payload jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists planned_weeks_profile_id_week_start_idx
  on public.planned_weeks (profile_id, week_start);

create index if not exists recipes_owner_profile_id_idx
  on public.recipes (owner_profile_id);

create index if not exists food_log_entries_profile_id_eaten_at_idx
  on public.food_log_entries (profile_id, eaten_at desc);

create index if not exists water_log_entries_profile_id_logged_at_idx
  on public.water_log_entries (profile_id, logged_at desc);

create index if not exists chat_threads_profile_id_idx
  on public.chat_threads (profile_id);

create index if not exists chat_messages_thread_id_created_at_idx
  on public.chat_messages (thread_id, created_at asc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_recipes_updated_at on public.recipes;
create trigger set_recipes_updated_at
before update on public.recipes
for each row
execute function public.set_updated_at();

drop trigger if exists set_planned_weeks_updated_at on public.planned_weeks;
create trigger set_planned_weeks_updated_at
before update on public.planned_weeks
for each row
execute function public.set_updated_at();

drop trigger if exists set_food_log_entries_updated_at on public.food_log_entries;
create trigger set_food_log_entries_updated_at
before update on public.food_log_entries
for each row
execute function public.set_updated_at();

drop trigger if exists set_chat_threads_updated_at on public.chat_threads;
create trigger set_chat_threads_updated_at
before update on public.chat_threads
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.planned_weeks enable row level security;
alter table public.food_log_entries enable row level security;
alter table public.water_log_entries enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = auth_user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = auth_user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

drop policy if exists "recipes_select_owned_or_library" on public.recipes;
create policy "recipes_select_owned_or_library"
on public.recipes
for select
using (
  owner_profile_id is null
  or owner_profile_id = public.current_profile_id()
);

drop policy if exists "recipes_insert_owned" on public.recipes;
create policy "recipes_insert_owned"
on public.recipes
for insert
with check (owner_profile_id = public.current_profile_id());

drop policy if exists "recipes_update_owned" on public.recipes;
create policy "recipes_update_owned"
on public.recipes
for update
using (owner_profile_id = public.current_profile_id())
with check (owner_profile_id = public.current_profile_id());

drop policy if exists "recipes_delete_owned" on public.recipes;
create policy "recipes_delete_owned"
on public.recipes
for delete
using (owner_profile_id = public.current_profile_id());

drop policy if exists "planned_weeks_manage_own" on public.planned_weeks;
create policy "planned_weeks_manage_own"
on public.planned_weeks
for all
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

drop policy if exists "food_logs_manage_own" on public.food_log_entries;
create policy "food_logs_manage_own"
on public.food_log_entries
for all
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

drop policy if exists "water_logs_manage_own" on public.water_log_entries;
create policy "water_logs_manage_own"
on public.water_log_entries
for all
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

drop policy if exists "chat_threads_manage_own" on public.chat_threads;
create policy "chat_threads_manage_own"
on public.chat_threads
for all
using (profile_id = public.current_profile_id())
with check (profile_id = public.current_profile_id());

drop policy if exists "chat_messages_manage_own" on public.chat_messages;
create policy "chat_messages_manage_own"
on public.chat_messages
for all
using (
  exists (
    select 1
    from public.chat_threads
    where public.chat_threads.id = chat_messages.thread_id
      and public.chat_threads.profile_id = public.current_profile_id()
  )
)
with check (
  exists (
    select 1
    from public.chat_threads
    where public.chat_threads.id = chat_messages.thread_id
      and public.chat_threads.profile_id = public.current_profile_id()
  )
);

insert into storage.buckets (id, name, public)
values ('food-photos', 'food-photos', false)
on conflict (id) do nothing;

drop policy if exists "food_photos_select_own" on storage.objects;
create policy "food_photos_select_own"
on storage.objects
for select
using (
  bucket_id = 'food-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "food_photos_insert_own" on storage.objects;
create policy "food_photos_insert_own"
on storage.objects
for insert
with check (
  bucket_id = 'food-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "food_photos_update_own" on storage.objects;
create policy "food_photos_update_own"
on storage.objects
for update
using (
  bucket_id = 'food-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'food-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "food_photos_delete_own" on storage.objects;
create policy "food_photos_delete_own"
on storage.objects
for delete
using (
  bucket_id = 'food-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
