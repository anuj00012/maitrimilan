alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_photos enable row level security;
alter table public.verification_documents enable row level security;
alter table public.subscriptions enable row level security;
alter table public.interests enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.admin_users enable row level security;

create policy "users can read self and admins read all"
on public.users for select
using (id = auth.uid() or private.is_admin(auth.uid()));

create policy "users can insert self"
on public.users for insert
with check (id = auth.uid());

create policy "users can update self and admins can update users"
on public.users for update
using (id = auth.uid() or private.is_admin(auth.uid()))
with check (id = auth.uid() or private.is_admin(auth.uid()));

create policy "verified profiles visible to authenticated users"
on public.profiles for select
using (
  (verification_status = 'approved' and is_visible = true)
  or user_id = auth.uid()
  or private.is_admin(auth.uid())
);

create policy "users create own profile"
on public.profiles for insert
with check (user_id = auth.uid());

create policy "users update own profile while admins can verify"
on public.profiles for update
using (user_id = auth.uid() or private.is_admin(auth.uid()))
with check (user_id = auth.uid() or private.is_admin(auth.uid()));

create policy "profile photos visible for verified profiles"
on public.profile_photos for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = profile_photos.profile_id
      and ((profiles.verification_status = 'approved' and profiles.is_visible = true) or profiles.user_id = auth.uid())
  )
  or private.is_admin(auth.uid())
);

create policy "users manage own profile photos"
on public.profile_photos for all
using (exists(select 1 from public.profiles where profiles.id = profile_photos.profile_id and profiles.user_id = auth.uid()) or private.is_admin(auth.uid()))
with check (exists(select 1 from public.profiles where profiles.id = profile_photos.profile_id and profiles.user_id = auth.uid()) or private.is_admin(auth.uid()));

create policy "documents visible only to owner and admin"
on public.verification_documents for select
using (user_id = auth.uid() or private.is_admin(auth.uid()));

create policy "users upload own verification document"
on public.verification_documents for insert
with check (user_id = auth.uid());

create policy "admins update verification documents"
on public.verification_documents for update
using (private.is_admin(auth.uid()))
with check (private.is_admin(auth.uid()));

create policy "subscriptions visible to owner and admin"
on public.subscriptions for select
using (user_id = auth.uid() or private.is_admin(auth.uid()));

create policy "users create own subscription records"
on public.subscriptions for insert
with check (user_id = auth.uid());

create policy "users update own payment records"
on public.subscriptions for update
using (user_id = auth.uid() or private.is_admin(auth.uid()))
with check (user_id = auth.uid() or private.is_admin(auth.uid()));

create policy "interests visible to participants and admin"
on public.interests for select
using (sender_id = auth.uid() or receiver_id = auth.uid() or private.is_admin(auth.uid()));

create policy "active subscribers send interests"
on public.interests for insert
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.subscriptions
    where subscriptions.user_id = auth.uid()
      and subscriptions.status = 'active'
      and subscriptions.expires_at > now()
  )
);

create policy "receivers respond to interests"
on public.interests for update
using (receiver_id = auth.uid() or private.is_admin(auth.uid()))
with check (receiver_id = auth.uid() or private.is_admin(auth.uid()));

create policy "matches visible to participants and admin"
on public.matches for select
using (auth.uid() in (user_one_id, user_two_id) or private.is_admin(auth.uid()));

create policy "receiver creates match after acceptance"
on public.matches for insert
with check (
  auth.uid() in (user_one_id, user_two_id)
  and exists (
    select 1 from public.interests
    where interests.id = matches.interest_id
      and interests.status = 'accepted'
      and interests.receiver_id = auth.uid()
  )
);

create policy "participants can block matches"
on public.matches for update
using (auth.uid() in (user_one_id, user_two_id) or private.is_admin(auth.uid()))
with check (auth.uid() in (user_one_id, user_two_id) or private.is_admin(auth.uid()));

create policy "messages visible only in active accepted matches"
on public.messages for select
using (private.is_active_match(match_id, auth.uid()) or private.is_admin(auth.uid()));

create policy "participants send messages only in active matches"
on public.messages for insert
with check (
  sender_id = auth.uid()
  and private.is_active_match(match_id, auth.uid())
);

create policy "reports visible to reporter and admin"
on public.reports for select
using (reporter_id = auth.uid() or private.is_admin(auth.uid()));

create policy "authenticated users create reports"
on public.reports for insert
with check (reporter_id = auth.uid());

create policy "admins manage reports"
on public.reports for update
using (private.is_admin(auth.uid()))
with check (private.is_admin(auth.uid()));

create policy "admins can read admin list"
on public.admin_users for select
using (private.is_admin(auth.uid()));

create policy "admin storage read private verification documents"
on storage.objects for select
using (
  bucket_id = 'verification-documents'
  and (
    owner = auth.uid()
    or private.is_admin(auth.uid())
  )
);

create policy "users upload own private verification documents"
on storage.objects for insert
with check (
  bucket_id = 'verification-documents'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "profile photos are publicly readable"
on storage.objects for select
using (bucket_id = 'profile-photos');

create policy "users upload own profile photos"
on storage.objects for insert
with check (
  bucket_id = 'profile-photos'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = auth.uid()::text
);
