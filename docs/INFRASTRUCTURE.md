# Meet Coworkers — Infrastructure Specification

**Version:** 1.0  
**Status:** MVP infrastructure source of truth

Product behavior is defined in `docs/PRODUCT_SPEC.md`. If this document appears to conflict with the product specification, use the product specification for user-facing behavior.

---

## 1. Stack

### Application
- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- mobile-first responsive UI
- PWA-compatible architecture

### Backend
- Supabase
  - PostgreSQL
  - Auth
  - Row Level Security
  - Storage
  - SQL migrations

### Places
- Google Places API for place discovery and canonical Google place identity
- internal `places` table for Meet Coworkers relationships

### Deployment
- GitHub
- Vercel
- preview deployments for branches / pull requests
- production from `main`

---

## 2. Repository Structure

Recommended structure:

```text
AGENTS.md

docs/
  PRODUCT_SPEC.md
  INFRASTRUCTURE.md

supabase/
  migrations/

src/
  app/
  components/
  lib/
  types/
    database.ts
```

Keep feature code modular rather than concentrating logic in page files.

---

## 3. Environment Separation

Support:
- local development
- Vercel preview
- production

Do not hard-code secrets, project URLs, API keys, or environment-specific values.

Use environment variables for Supabase, Google Places, and future analytics configuration.

Never expose:
- Supabase service-role key
- privileged admin credentials
- unrestricted server-only API secrets

---

## 4. Supabase Conventions

### Migrations

All database schema changes must be committed as SQL migrations under:

```text
supabase/migrations/
```

Do not rely on undocumented manual dashboard changes.

### Generated types

Generate and maintain:

```text
src/types/database.ts
```

Regenerate after schema changes.

### Database source of truth

PostgreSQL is the source of truth for relationships, constraints, uniqueness, authorization boundaries, and data integrity.

Do not move critical integrity rules exclusively into client-side code.

---

## 5. Core Data Architecture

The MVP schema should support:
- cities
- profiles
- industries
- profile industries
- places
- workplaces
- presences
- connections
- blocks
- reports

Use UUID primary keys unless there is a strong reason not to.

Use timezone-aware timestamps.

Prefer `created_at` and `updated_at` consistently where records are mutable.

---

## 6. Authentication

Use Supabase Auth.

MVP providers:
- Google OAuth
- email magic link

The authenticated Supabase user must map 1:1 to an application profile.

Recommended relationship:

```text
auth.users.id → profiles.user_id
```

Enforce uniqueness on `profiles.user_id`.

Do not expose authentication email addresses through public profile queries.

---

## 7. Row Level Security

RLS must be enabled on user-related tables.

### Profiles
Authenticated users may read public coworker profile fields required by the product. A user may update only their own profile.

### Workplaces
Authenticated users may read workplace associations needed for discovery. A user may insert/delete only associations belonging to their own profile.

### Presences
Authenticated users may read active presence information needed by the product. A user may create/end only their own presence. Historical presence must not become publicly queryable as a profile timeline.

### Connections
Only requester and recipient may read a connection record. Only requester may create/cancel a request. Only recipient may accept/decline it.

### Blocks
A user may create/delete their own block records. Block state must be respected by relevant profile and connection queries.

### Reports
A user may create reports. Admin review must use privileged server-side paths.

---

## 8. Admin Authorization

Do not implement admin privileges by trusting a client-provided boolean.

Use a server-verifiable approach such as protected role metadata or a dedicated admin table.

Admin operations must run through secure server-side code.

---

## 9. Storage

Use Supabase Storage for profile photos if needed.

Requirements:
- validate file type
- apply reasonable size limits
- restrict upload/update permissions to the owner
- avoid exposing private buckets unnecessarily

---

## 10. Google Places Integration

Google Places supplies canonical real-world place data. Meet Coworkers owns the internal relationship graph.

Store `google_place_id` and enforce uniqueness.

When a user chooses a Google result:

1. find internal place by `google_place_id`
2. reuse if it exists
3. otherwise create the internal place
4. create the user's workplace association only after the internal place exists

Store only data the product needs, such as name, address, area, city, country, coordinates, category, Maps URL, and permitted image/reference data.

Do not build a parallel manual place-creation system in MVP.

---

## 11. Presence Architecture

A user may have only one active presence.

The database must enforce or safely serialize this rule.

Do not rely solely on the browser to prevent simultaneous active check-ins.

An active presence is one where:

```sql
ended_at IS NULL
AND expires_at > now()
```

Starting a new presence should atomically:
1. end any current active presence
2. create the new presence
3. return the new active state

Presence expiration should respect the relevant city timezone.

No background GPS or location tracking is required.

---

## 12. Derived Counts

Prefer query-derived values for the MVP:
- coworkers at a place
- active users at a place
- shared workplaces
- community composition

Avoid counters requiring complicated synchronization.

Introduce cached aggregates later only if performance requires them.

---

## 13. Server vs Client Boundaries

Use Server Components and server-side data access where appropriate.

Use Client Components for genuine interactivity.

Do not expose privileged backend operations directly to the browser.

Authorization-sensitive actions should use RLS-safe Supabase calls, server actions, route handlers, or database RPCs when atomicity is important.

Choose the simplest secure option.

---

## 14. UI Architecture

Use shadcn/ui and shared application components.

Prefer reusable primitives for:
- page shells
- cards
- profile avatars
- place cards
- coworker cards
- empty states
- filters
- form fields
- mobile bottom navigation

The MVP is mobile-first. Desktop should remain usable.

---

## 15. Design Constraints

The product should feel modern, professional, and social without looking like a social feed.

Avoid visual patterns that make it resemble a generic LinkedIn clone.

Place context should be visually prominent whenever relevant.

---

## 16. Error Handling

Important flows should have:
- loading states
- meaningful empty states
- user-readable error feedback

Do not silently fail writes.

Avoid exposing raw database or API errors to users.

Log enough detail server-side to debug failures.

---

## 17. Testing Expectations

Every phase should validate the flows it introduces.

At minimum:
- TypeScript passes
- lint passes
- production build passes
- critical database constraints are tested
- RLS-sensitive flows are verified
- main mobile flow receives a manual browser check

Add automated tests around business rules as the codebase grows.

---

## 18. Git / Deployment Workflow

Expected workflow:

1. Start from up-to-date `main`.
2. Create a focused branch for the implementation phase.
3. Implement only the requested phase.
4. Run validation locally.
5. Commit changes.
6. Push branch.
7. Verify Vercel preview.
8. Fix preview/build/runtime issues on the same branch.
9. Open or update the pull request.
10. Merge only after the phase works.

Do not deploy unfinished work directly to production.

---

## 19. Documentation Rule

Before architectural or product changes, read:

```text
AGENTS.md
docs/PRODUCT_SPEC.md
docs/INFRASTRUCTURE.md
```

After significant changes:
- update migrations
- regenerate DB types if schema changed
- update infrastructure docs if assumptions changed

Do not let implementation silently drift from the documented MVP.

---

## 20. Security Checklist

Before considering a phase complete, verify:
- no service-role key is exposed client-side
- RLS is enabled where needed
- ownership is enforced server/database-side
- auth fields are not returned through public profile queries
- writes cannot target another user's records
- URL/query parameters do not bypass authorization
- uploaded files are ownership-restricted
- presence history is not publicly exposed
- block state is respected where relevant

---

## 21. MVP Infrastructure Rule

Choose the simplest architecture that safely supports the documented MVP.

Do not introduce microservices, message queues, custom realtime infrastructure, complex caching, separate search infrastructure, or AI infrastructure unless a later product phase explicitly requires them.

The technical foundation should remain easy to understand, modify, and ship.
