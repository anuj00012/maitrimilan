# MaitriMilan

MaitriMilan is a production-ready MVP matrimonial platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase, Razorpay, and Vercel.

It uses original branding, UI, copy, and code. The platform supports verified marriage profiles, annual membership, request-based introductions, accepted-match chat, admin verification, reports, and private ID proof storage.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage, and Realtime
- Razorpay Standard Checkout through server-side order creation and signature verification
- Vercel deployment

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env.local
```

3. Fill in Supabase and Razorpay values in `.env.local`.

4. Run the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. Then run `supabase/rls-policies.sql`.
4. Create your first admin user by registering in the app.
5. Copy that user's UUID from Supabase Authentication > Users.
6. Replace the placeholder UUID in `supabase/seed-admin.sql`.
7. Run `supabase/seed-admin.sql`.

The schema creates these tables:

- `users`
- `profiles`
- `profile_photos`
- `verification_documents`
- `subscriptions`
- `interests`
- `matches`
- `messages`
- `reports`
- `admin_users`

Storage buckets:

- `profile-photos`: public profile image assets
- `verification-documents`: private ID proof bucket

## Security Model

- RLS is enabled on every public table.
- Users can insert and update only their own user/profile data.
- Verified profiles are visible only when `verification_status = 'approved'` and `is_visible = true`.
- ID proof metadata is visible only to the document owner and admins.
- Private ID files are stored in the protected `verification-documents` bucket.
- Interests can be created only by active annual subscribers.
- Chat messages can be read and inserted only by participants in an active accepted match.
- Admin-only dashboard access is enforced in middleware and RLS.

## Realtime Chat

The chat UI subscribes to `messages` inserts filtered by `match_id`.

In Supabase, enable Realtime for the `messages` table:

1. Go to Database > Replication or Realtime settings.
2. Add `public.messages` to the realtime publication.
3. Keep RLS enabled so only accepted match participants can receive/read messages.

## Razorpay Setup

1. Create Razorpay API keys from Razorpay Dashboard.
2. Add keys to `.env.local` and Vercel environment variables.
3. The app creates orders in `app/api/razorpay/order/route.ts`.
4. The app verifies checkout signatures in `app/api/razorpay/verify/route.ts`.
5. Successful verification activates a `premium_annual` subscription for 1 year.

For production, also add a Razorpay webhook for `payment.captured` and reconcile subscriptions server-side for stronger payment reliability.

## Vercel Deployment

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Add these environment variables in Vercel Project Settings:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

4. Deploy.

## Custom Domain

1. In Vercel, open Project Settings > Domains.
2. Add your custom domain.
3. Update DNS at your domain registrar:
   - Use the `A` record or `CNAME` shown by Vercel.
   - Wait for DNS verification.
4. Update `NEXT_PUBLIC_SITE_URL` to the final custom domain.
5. Add the final domain to Supabase Auth > URL Configuration:
   - Site URL
   - Redirect URLs

## MVP Notes

- Email auth is implemented by default. The UI includes an email/phone field, but phone OTP requires Supabase phone provider setup.
- Admin verification is intentionally manual.
- The UI limits contact detail exposure. Do not add phone/email fields to public profile cards.
- This is structured to scale: database policies enforce the core trust rules, and route modules are separated by product area.
