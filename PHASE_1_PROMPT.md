# Meet Coworkers — Phase 1 Implementation Prompt

Implement **Phase 1 — Foundation, Auth & Profiles** for Meet Coworkers.

Work from the repository's current `main` branch and follow the repository documentation as the source of truth.

## Start by reading

Read these files in full before changing code:

- `AGENTS.md`
- `docs/PRODUCT_SPEC.md`
- `docs/INFRASTRUCTURE.md`
- all existing files under `supabase/migrations/`
- `src/types/database.ts` if it already exists

Inspect the existing repository before deciding what needs to be created or changed.

---

## Product context

Meet Coworkers is a place-based professional network.

Core model:

> **People ↔ Places ↔ Presence ↔ Connections**

Core positioning:

> **We already work from the same places. We should know each other.**

The MVP will eventually let users associate themselves with places they regularly work from, indicate where they are working today, discover people through places, discover places through people, and connect.

**This task is only Phase 1.**

Do not implement later phases early.

---

# Phase 1 Scope

Build the foundation required for a new user to register, complete a professional profile, and reach the authenticated app shell.

## 1. Application foundation

Ensure the project has a clean production-ready foundation using the documented stack:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- mobile-first responsive design
- Supabase
- Vercel-compatible configuration

Preserve good existing project structure if already present.

Do not rewrite working setup without a reason.

---

## 2. Supabase client/server setup

Implement clean Supabase utilities for the App Router.

Support authenticated server-side and browser-side usage without exposing privileged credentials.

Use environment variables.

Never expose the Supabase service-role key to client code.

Provide or update `.env.example` with required non-secret variable names.

---

## 3. Phase 1 database schema

Create SQL migration(s) for the Phase 1 tables only.

### `cities`

Support at least:

- `id`
- `name`
- `country_code`
- `timezone`
- `is_active`
- timestamps where appropriate

Seed:

**Dubai, UAE**

Timezone:

`Asia/Dubai`

### `profiles`

Support:

- `id`
- `user_id`
- `first_name`
- `last_name`
- `avatar_url`
- `headline`
- `company_name`
- `working_on`
- `role_category`
- `city_id`
- `open_to_meet`
- `linkedin_url`
- `onboarding_completed`
- `created_at`
- `updated_at`

Requirements:

- 1:1 relation to Supabase Auth user
- unique `user_id`
- sensible nullability
- foreign key to city
- authorization-safe ownership model

### `industries`

Support:

- `id`
- `name`
- `slug`
- `created_at`

Seed a compact useful MVP set including:

- AI
- Health
- Fintech
- SaaS
- Consumer
- Investment

Avoid creating a huge taxonomy.

### `profile_industries`

Support:

- `profile_id`
- `industry_id`
- `created_at`

Enforce unique profile/industry pairs.

The product maximum is **3 industries per user**.

Enforce this in application logic and, if practical without overengineering, at the database level.

---

## 4. Row Level Security

Enable and configure RLS for all Phase 1 user-facing tables.

### `cities`

Authenticated users may read active cities.

### `industries`

Authenticated users may read industries.

### `profiles`

Authenticated users may read public profile information required by the product.

A user may create/update only the profile associated with their own authenticated `auth.uid()`.

Do not expose auth email addresses as profile data.

### `profile_industries`

Users may manage only industry relationships for their own profile.

Authenticated users may read relationships needed to display professional profile information.

Do not rely on client-side checks as the security boundary.

---

## 5. Generated database types

If Supabase type generation is configured, generate/update:

`src/types/database.ts`

Make application code use generated types where practical.

Do not create a conflicting hand-maintained database schema type file.

---

## 6. Authentication

Implement:

- Google OAuth
- email magic link

Create polished but simple auth screens.

Expected behavior:

- signed-out users can access the public landing page
- signed-out users attempting authenticated pages are redirected to auth
- authenticated users without completed onboarding are routed to onboarding
- authenticated users with completed onboarding are routed into the app

Handle OAuth callback/session exchange correctly for Next.js App Router.

---

## 7. Public landing page

Create a compact landing page.

Primary hero:

> **We already work from the same places. We should know each other.**

Supporting copy:

> Discover the people working from your favorite places — and find where interesting people are working today.

Primary CTA:

**Join Meet Coworkers**

Do not build a large marketing website.

---

## 8. Onboarding

Build a mobile-first onboarding flow for Phase 1 fields.

### Basic profile

Collect:

- first name
- last name
- profile photo
- professional headline / job title
- optional company

### What are you working on?

Collect a short free-text description.

Target length: approximately 100–160 characters.

Use a sensible hard maximum.

### Professional context

Collect:
- one role category
- up to 3 industries

Role options:

- Founder
- Investor
- Operator
- Consultant
- Designer
- Developer
- Marketer
- Freelancer
- Other

### Meeting preference

Prompt:

> **Open to meeting people who work from the same places?**

Options:

- Yes
- Not right now

### City

For the MVP, default/select Dubai from the seeded cities table.

---

## Important onboarding exception for Phase 1

The full product onboarding eventually requires at least one workplace.

**Do not implement workplaces in Phase 1.**

That belongs to Phase 2.

For Phase 1 only, onboarding is considered complete after the profile/professional-context steps above.

Structure the code so the workplace step can be inserted in Phase 2 without rewriting the onboarding system.

Do not create fake workplaces or temporary client-only place records.

---

## 9. Profile page

Build an authenticated profile screen that displays the current user's Phase 1 profile information.

Allow editing:

- photo
- first/last name
- headline
- company
- working-on text
- role
- industries
- open-to-meet
- LinkedIn URL

LinkedIn URL is optional.

Do not add workplace, check-in, connection, or social features.

---

## 10. Authenticated app shell

Create the mobile-first authenticated application shell.

The final MVP navigation will contain:

- Home
- Places
- Coworkers
- Connections
- Profile

For Phase 1:

- `Profile` should be functional.
- `Home` may be a minimal authenticated welcome/dashboard state.
- Later-phase navigation destinations may exist only as clearly unfinished placeholders if needed for navigation structure.

Do not implement their product functionality yet.

Do not populate them with fake coworker/place data.

---

## 11. Avatar handling

Support profile photo upload using the simplest secure Supabase Storage approach appropriate for the MVP.

Requirements:

- user can upload/change their own image
- file type/size validation
- ownership-safe write permissions
- stable profile image display

Avoid elaborate image processing infrastructure.

---

# Explicitly Out of Scope

Do **not** implement in Phase 1:

- Google Places API
- `places` table
- `workplaces` table
- workplace selection
- place directory
- place pages
- check-ins
- presence
- current location
- coworker directory
- discovery filters
- connections
- connection requests
- messaging
- blocks/reports
- admin dashboard
- AI matching
- events
- push notifications

Do not add speculative schema for later phases unless the existing architecture absolutely requires it.

---

# UX Requirements

The UI should be:

- mobile-first
- clean
- modern
- professional
- fast to understand

Avoid making it look like a generic LinkedIn clone.

Use shadcn/ui and reusable components.

Include good loading, validation, error, and empty states.

Do not spend the phase on decorative complexity.

---

# Validation

Before considering Phase 1 complete:

1. Install dependencies successfully.
2. Run lint successfully.
3. Run TypeScript validation if separately configured.
4. Run a production build successfully.
5. Verify SQL migrations are valid.
6. Verify RLS policies protect profile ownership.
7. Verify a new user can sign in.
8. Verify a new user can complete onboarding.
9. Verify the completed profile persists in Supabase.
10. Verify the user can edit their profile.
11. Verify another normal user cannot edit that profile.
12. Verify no auth email or privileged credential is exposed in public profile data.
13. Verify the main flow at mobile viewport size.

Fix issues found during validation.

---

# Git / Preview Workflow

Use a dedicated branch for this phase.

Suggested branch name:

`codex/phase-1-foundation-auth-profiles`

Before implementation, confirm the branch starts from current `main`.

Commit completed work.

Push the branch.

If Vercel preview deployments are connected, verify the preview deployment and fix build/runtime issues before considering the phase complete.

Do not deploy unfinished Phase 1 work directly to production.

---

# Completion Report

At the end, provide a concise factual summary covering:

- what you implemented
- migrations created
- RLS/security decisions
- environment variables required
- manual Supabase/Google OAuth configuration still required, if any
- tests/validation performed
- preview deployment status if available
- any genuine blocker

Do not claim later phases are implemented.

The Phase 1 definition of done is:

> **A new user can register, complete onboarding, enter the authenticated app, view their profile, and edit it securely.**
