# Meet Coworkers

Phase 1 of a mobile-first, place-based professional network built with Next.js and Supabase.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add the Supabase project URL and anon key.
3. Apply `supabase/migrations/20260923000000_phase_1_foundation.sql` to a Supabase project.
4. In Supabase Auth, enable Email and Google, then add `http://localhost:3000/auth/callback` and the equivalent production/preview callback URLs to the redirect allow list. Google also requires its client ID and secret in the Supabase provider settings.
5. Run `npm run dev`.

The migration creates the public avatar bucket and its owner-scoped write policies. No service-role key is used by the application.
