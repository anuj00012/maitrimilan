-- 1. Register your admin user in the app first.
-- 2. Find the user's UUID from Authentication > Users in Supabase.
-- 3. Replace the UUID below and run this SQL.

insert into public.admin_users (user_id)
values ('00000000-0000-0000-0000-000000000000')
on conflict (user_id) do nothing;
