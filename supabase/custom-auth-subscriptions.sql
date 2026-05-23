create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  email_verified boolean not null default false,
  email_verification_token text,
  email_verification_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists name text;
alter table public.users add column if not exists password_hash text;
alter table public.users add column if not exists email_verified boolean not null default false;
alter table public.users add column if not exists email_verification_token text;
alter table public.users add column if not exists email_verification_expires_at timestamptz;

create table if not exists public.plans (
  id text primary key,
  name text not null,
  price integer not null,
  duration_days integer not null,
  contact_unlock_limit integer not null,
  interest_limit integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null default 'active',
  start_date timestamptz not null,
  end_date timestamptz not null,
  contact_unlocks_used integer not null default 0,
  interests_used integer not null default 0,
  last_limit_reset_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table if not exists public.contact_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  profile_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, profile_id)
);

create table if not exists public.interests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid,
  receiver_profile_id uuid,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.profile_views (
  id uuid primary key default gen_random_uuid(),
  viewer_id uuid references public.users(id) on delete set null,
  profile_id uuid not null,
  created_at timestamptz not null default now()
);

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
