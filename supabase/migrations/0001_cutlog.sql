create extension if not exists "pgcrypto";

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
  created_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now())
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
