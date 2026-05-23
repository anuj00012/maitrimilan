create table if not exists public.plans (
  id text primary key,
  name text not null,
  price integer not null,
  duration_days integer not null,
  contact_unlock_limit integer not null,
  interest_limit integer not null,
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

create index if not exists subscriptions_user_status_idx on public.subscriptions (user_id, status, end_date);
create index if not exists payments_user_idx on public.payments (user_id, status, created_at);
create index if not exists contact_unlocks_user_idx on public.contact_unlocks (user_id, created_at);
create index if not exists profile_views_profile_idx on public.profile_views (profile_id, created_at);

alter table public.plans enable row level security;
alter table public.payments enable row level security;
alter table public.contact_unlocks enable row level security;
alter table public.profile_views enable row level security;

drop policy if exists "plans are public to authenticated users" on public.plans;
create policy "plans are public to authenticated users"
on public.plans for select
using (auth.role() = 'authenticated');

drop policy if exists "payments visible to owner and admin" on public.payments;
create policy "payments visible to owner and admin"
on public.payments for select
using (user_id = auth.uid() or private.is_admin(auth.uid()));

drop policy if exists "users create own payment orders" on public.payments;
create policy "users create own payment orders"
on public.payments for insert
with check (user_id = auth.uid());

drop policy if exists "users update own payment verification records" on public.payments;
create policy "users update own payment verification records"
on public.payments for update
using (user_id = auth.uid() or private.is_admin(auth.uid()))
with check (user_id = auth.uid() or private.is_admin(auth.uid()));

drop policy if exists "active subscribers send interests" on public.interests;
create policy "active subscribers send interests"
on public.interests for insert
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.subscriptions
    where subscriptions.user_id = auth.uid()
      and subscriptions.status = 'active'
      and subscriptions.end_date > now()
      and subscriptions.interests_used < coalesce((
        select plans.interest_limit from public.plans where plans.id = subscriptions.plan_id
      ), 100)
  )
);

drop policy if exists "contact unlocks visible to owner and admin" on public.contact_unlocks;
create policy "contact unlocks visible to owner and admin"
on public.contact_unlocks for select
using (user_id = auth.uid() or private.is_admin(auth.uid()));

drop policy if exists "active subscribers unlock contacts" on public.contact_unlocks;
create policy "active subscribers unlock contacts"
on public.contact_unlocks for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.subscriptions
    where subscriptions.user_id = auth.uid()
      and subscriptions.status = 'active'
      and subscriptions.end_date > now()
      and subscriptions.contact_unlocks_used < coalesce((
        select plans.contact_unlock_limit from public.plans where plans.id = subscriptions.plan_id
      ), 30)
  )
);

drop policy if exists "profile views visible to viewer profile owner and admin" on public.profile_views;
create policy "profile views visible to viewer profile owner and admin"
on public.profile_views for select
using (
  viewer_id = auth.uid()
  or private.is_admin(auth.uid())
  or exists (
    select 1 from public.profiles
    where profiles.id = profile_views.profile_id
      and profiles.user_id = auth.uid()
  )
);

drop policy if exists "authenticated users record profile views" on public.profile_views;
create policy "authenticated users record profile views"
on public.profile_views for insert
with check (viewer_id = auth.uid());
