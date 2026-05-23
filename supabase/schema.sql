create extension if not exists "pgcrypto";

create schema if not exists private;

do $$ begin
  create type public.user_role as enum ('bride', 'groom');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.account_status as enum ('active', 'blocked', 'deleted');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.verification_status as enum ('draft', 'pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.interest_status as enum ('pending', 'accepted', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.match_status as enum ('active', 'blocked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.subscription_status as enum ('created', 'active', 'expired', 'failed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.report_status as enum ('open', 'closed');
exception when duplicate_object then null;
end $$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  role public.user_role not null,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  price integer not null,
  duration_days integer not null,
  contact_unlock_limit integer not null,
  interest_limit integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text not null,
  gender text not null,
  date_of_birth date not null,
  religion text,
  community text,
  caste text,
  education text not null,
  profession text not null,
  income_range text,
  city text not null,
  state text not null,
  height text not null,
  marital_status text not null,
  about_me text not null,
  partner_preferences text not null,
  privacy_accepted boolean not null default false,
  terms_accepted boolean not null default false,
  verification_status public.verification_status not null default 'pending',
  is_visible boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  status public.verification_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan text not null default 'premium_annual',
  status public.subscription_status not null default 'created',
  amount integer not null,
  currency text not null default 'INR',
  razorpay_order_id text unique,
  razorpay_payment_id text,
  razorpay_signature text,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subscriptions add column if not exists plan_id text references public.plans(id);
alter table public.subscriptions add column if not exists start_date timestamptz;
alter table public.subscriptions add column if not exists end_date timestamptz;
alter table public.subscriptions add column if not exists contact_unlocks_used integer not null default 0;
alter table public.subscriptions add column if not exists interests_used integer not null default 0;
alter table public.subscriptions add column if not exists last_limit_reset_date timestamptz;
alter table public.subscriptions add column if not exists updated_at timestamptz not null default now();
alter table public.subscriptions alter column amount drop not null;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  razorpay_order_id text not null unique,
  razorpay_payment_id text,
  razorpay_signature text,
  amount integer not null,
  currency text not null default 'INR',
  status text not null default 'created',
  created_at timestamptz not null default now()
);

create table if not exists public.interests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id) on delete cascade,
  receiver_profile_id uuid not null references public.profiles(id) on delete cascade,
  status public.interest_status not null default 'pending',
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique(sender_id, receiver_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  interest_id uuid not null unique references public.interests(id) on delete cascade,
  user_one_id uuid not null references public.users(id) on delete cascade,
  user_two_id uuid not null references public.users(id) on delete cascade,
  status public.match_status not null default 'active',
  blocked_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  reported_profile_id uuid references public.profiles(id) on delete set null,
  match_id uuid references public.matches(id) on delete set null,
  reason text not null,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.contact_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, profile_id)
);

create table if not exists public.profile_views (
  id uuid primary key default gen_random_uuid(),
  viewer_id uuid references public.users(id) on delete set null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function private.is_admin(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists(select 1 from public.admin_users where user_id = check_user_id);
$$;

create or replace function private.is_active_match(check_match_id uuid, check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists(
    select 1
    from public.matches
    where id = check_match_id
      and status = 'active'
      and check_user_id in (user_one_id, user_two_id)
  );
$$;

create index if not exists profiles_visibility_idx on public.profiles (verification_status, is_visible, city, community);
create index if not exists interests_sender_idx on public.interests (sender_id, status);
create index if not exists interests_receiver_idx on public.interests (receiver_id, status);
create index if not exists matches_users_idx on public.matches (user_one_id, user_two_id, status);
create index if not exists messages_match_idx on public.messages (match_id, created_at);
create index if not exists subscriptions_user_status_idx on public.subscriptions (user_id, status, end_date);
create index if not exists payments_user_idx on public.payments (user_id, status, created_at);
create index if not exists contact_unlocks_user_idx on public.contact_unlocks (user_id, created_at);
create index if not exists profile_views_profile_idx on public.profile_views (profile_id, created_at);

insert into public.plans (id, name, price, duration_days, contact_unlock_limit, interest_limit)
values
  ('basic_monthly', 'Basic Monthly', 29900, 30, 30, 100),
  ('basic_3_months', 'Basic 3 Months', 69900, 90, 30, 100),
  ('basic_6_months', 'Basic 6 Months', 99900, 180, 30, 100)
on conflict (id) do update set
  name = excluded.name,
  price = excluded.price,
  duration_days = excluded.duration_days,
  contact_unlock_limit = excluded.contact_unlock_limit,
  interest_limit = excluded.interest_limit;

insert into storage.buckets (id, name, public)
values
  ('profile-photos', 'profile-photos', true),
  ('verification-documents', 'verification-documents', false)
on conflict (id) do nothing;
