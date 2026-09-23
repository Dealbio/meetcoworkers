# AGENTS.md — Meet Coworkers

This repository contains the Meet Coworkers MVP.

Meet Coworkers is a place-based professional network built around:

> **People ↔ Places ↔ Presence ↔ Connections**

Core positioning:

> **We already work from the same places. We should know each other.**

## Read before editing

Before making product or architecture changes, read:

1. `docs/PRODUCT_SPEC.md`
2. `docs/INFRASTRUCTURE.md`
3. relevant files under `supabase/migrations/`
4. `src/types/database.ts` if it exists

The product specification is the source of truth.

## Phase discipline

Implementation is intentionally phased.

Only build functionality included in the phase currently requested. Do not pull later-phase features forward because they seem easy or useful.

In particular, if the current phase does not include them, do not independently add Google Places, workplace communities, check-ins/presence, coworker discovery, connections, messaging, AI matching, or events.

A placeholder navigation item is acceptable when needed for structure. A hidden partial implementation of a later phase is not.

## Product principles

### Physical context first
Discovery should relate back to real places.

### Regular workplace ≠ current presence
`workplaces` means: **I regularly work from here.**

`presences` means: **I am working from here today.**

Do not merge those concepts.

### Presence is voluntary
No automatic tracking. No background GPS. No public location history.

### Real-world interaction over app engagement
Do not introduce feed mechanics or engagement features unless the product specification changes.

### Keep networking lightweight
The app facilitates discovery and mutual connection. It does not need to become a full messaging platform.

## Stack

Use the documented stack:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth / Postgres / RLS / Storage
- Vercel
- mobile-first, PWA-compatible frontend

Do not replace the stack without explicit instruction.

## Database changes

All schema changes must be represented by committed SQL migrations under:

```text
supabase/migrations/
```

Do not rely on undocumented manual Supabase changes.

After schema changes, regenerate `src/types/database.ts` when Supabase type generation is configured.

Critical constraints should live in the database where practical.

## Security

Security is part of the feature.

For every user-owned table:
- enable appropriate RLS
- enforce ownership server/database-side
- never trust a client-supplied user/profile ID without authorization
- never expose the Supabase service-role key to the browser

Authentication email addresses are not public profile fields.

Admin privileges must not be decided by an editable client-side field.

## Code quality

Prefer small reusable components, clear feature boundaries, typed database access, simple server/client boundaries, readable SQL migrations, and explicit error handling.

Avoid giant page components, duplicated UI, premature abstraction, speculative architecture, and unrelated refactors inside phase work.

## Mobile first

Treat mobile as the primary interface.

For every new flow, verify touch targets, viewport behavior, forms, bottom navigation, cards/lists, dialogs/sheets, loading states, and empty states.

Desktop must remain functional but should not drive the interaction design.

## Real data over fake flows

Use actual Supabase-backed behavior when a phase calls for it.

Do not leave core phase functionality as mocked client-only state.

Seed/reference data such as roles, industries, and Dubai may be inserted through migrations where appropriate.

## Validation before completion

Before declaring implementation complete:

1. run lint
2. run TypeScript checks if separately configured
3. run production build
4. verify migrations/schema assumptions
5. verify RLS-sensitive flows
6. manually test the critical phase flow
7. verify the Vercel preview if available

Fix issues discovered during validation rather than merely listing them.

## Completion summary

When finishing a phase, report:
- what was implemented
- migrations added or changed
- environment variables/manual setup required
- validation performed
- anything genuinely blocked

Do not describe later-phase features as completed if they are placeholders.

## Scope rule

When unsure whether to add something, apply this product question:

> **Does this improve discovery or interaction between people because they work from the same physical places?**

Then apply the implementation question:

> **Is it part of the current phase?**

Both need to be true before adding it.
