# Meet Coworkers — Product Specification

**Version:** 1.0  
**Status:** MVP source of truth  
**Initial market:** Dubai, UAE  
**Product type:** Mobile-first web app / PWA  
**Core model:** **People ↔ Places ↔ Presence ↔ Connections**

---

## 1. Product Overview

Meet Coworkers helps people discover and meet professionals who work from the same physical places.

The product is built around a simple observation:

> **We already work from the same places. We should know each other.**

People already spend time working from coworking spaces, cafés, hotels, clubs, and other work-friendly locations. Today, there is no simple way to know who else regularly works from those places or who is there right now.

Meet Coworkers creates a professional network around this existing physical behavior.

The product should answer two questions:

### When I already know where I am working

> **Who else works from here?**

### When I have not chosen where to work yet

> **Where should I work from today?**

The people associated with a place therefore become part of what makes that place attractive.

---

## 2. Core Positioning

### Primary positioning

> **We already work from the same places. We should know each other.**

### Product utility

> **Find where interesting people work from.**

### Product model

**Discover people through places. Discover places through people.**

Meet Coworkers should never feel like another LinkedIn. The physical place provides the context and the reason for the connection.

---

## 3. MVP Objective

The MVP should validate four behaviors:

1. People are willing to associate themselves with the places they regularly work from.
2. People want to see who else works from those places.
3. People voluntarily indicate where they are working today.
4. Knowing who works somewhere can influence where another user decides to work.

The MVP should optimize for learning whether this loop works before adding broader networking functionality.

---

## 4. Product Principles

### 4.1 Physical context comes first

Every meaningful discovery should relate back to a real place.

### 4.2 Regular workplace and current presence are different

**Regular workplace**

> “I regularly work from here.”

Creates the permanent community associated with a place.

**Current presence**

> “I’m working from here today.”

Creates a temporary opportunity to meet.

These must remain separate concepts throughout the data model and UI.

### 4.3 Presence is voluntary

Meet Coworkers does not track users automatically.

There is:
- no background GPS tracking
- no automatic check-in
- no public location history

Presence is explicitly declared by the user.

### 4.4 Real-world interaction over digital engagement

The goal is to help people meet. The MVP should avoid features designed mainly to keep users inside the app.

No social feed, likes, or content posting.

### 4.5 Keep networking lightweight

Connecting should feel natural because users already share a place.

The MVP should not require elaborate introductions or networking workflows.

---

## 5. Launch Geography

Initial launch:

**Dubai, UAE**

The architecture must support multiple cities from the beginning.

Every user has a primary city. Every place belongs to a city.

No Dubai-specific assumptions should be hard-coded into the database architecture.

---

## 6. User Types

### Member

Can:
- create and edit a profile
- add regular workplaces
- check in somewhere today
- browse people and places
- send and respond to connection requests
- block/report users

### Admin

Can manage:
- users
- places
- duplicate places
- reports
- basic platform data

There are no company accounts or organization pages in the MVP.

---

## 7. Authentication

Use Supabase Auth.

Supported MVP authentication:
- Google OAuth
- email magic link

LinkedIn authentication is not required.

Authentication is required before users can browse individual coworker profiles or current presence.

The marketing landing page remains public.

---

## 8. Onboarding

The onboarding flow should be short and focused on making the network useful immediately.

### Step 1 — Basic profile

Required:
- first name
- last name
- profile photo
- professional headline / job title

Optional:
- company

### Step 2 — What are you working on?

Short free-text field.

Example:

> Building a health startup intelligence platform.

Target length: approximately 100–160 characters.

### Step 3 — Professional context

Select one role category:
- Founder
- Investor
- Operator
- Consultant
- Designer
- Developer
- Marketer
- Freelancer
- Other

Select up to 3 industries.

Seed examples:
- AI
- Health
- Fintech
- SaaS
- Consumer
- Investment

### Step 4 — Add workplaces

Prompt:

> **Where do you usually work from?**

User searches places using Google Places.

During onboarding, encourage 1–5 places.

Maximum regular workplaces in MVP: **10**

At least one workplace is required to complete the full MVP onboarding.

### Step 5 — Meeting preference

Prompt:

> **Open to meeting people who work from the same places?**

Options:
- Yes
- Not right now

Store as `open_to_meet`.

---

## 9. Main Navigation

Mobile bottom navigation:

- **Home**
- **Places**
- **Coworkers**
- **Connections**
- **Profile**

---

## 10. Home

The Home screen should answer:

> **What is happening around my workplaces today?**

### Current presence

If the user has no active check-in:

> **Where are you working from today?**

Show regular workplaces as quick options and allow **Choose another place**.

If checked in:

> **Working from Nasab today**

Show:
- active since
- people here today
- `End check-in`

### Your workplaces today

Show regular workplaces ordered by current activity.

Example:

**Nasab**  
12 here today · 126 coworkers

**One Life**  
5 here today · 48 coworkers

### Active places in Dubai

Show places with the most active coworkers today.

This begins answering:

> **Where should I work from today?**

No personalization algorithm is required for MVP.

---

## 11. Places Directory

The Places directory lets users discover work locations through their communities.

### Place card

Display:
- photo
- place name
- area
- place category
- total coworkers
- here today
- top professional categories

Example:

**Nasab**  
Al Barari · Coworking

**126 coworkers · 14 here today**

Founders · Investors · Creatives

### Search

Search by:
- place name
- neighborhood / area

### Sorting

MVP sorting:
- **Active today**
- **Most coworkers**

### Place creation

Users do not manually create arbitrary place records.

When searching Google Places:

1. If the Google Place already exists internally, use the existing record.
2. Otherwise create a new internal place based on the Google result.

`google_place_id` must be unique.

---

## 12. Place Page

The Place page is one of the central screens.

Example:

# Nasab

Al Barari · Coworking

**126 coworkers**

**14 working here today**

Actions:

**Work from here today**

**Add to my workplaces**

### Coworkers here today

Show users with an active presence at the place.

Each card shows:
- photo
- name
- professional headline
- company if available
- open-to-meet state
- Connect action

### Regular coworkers

Show users who have added the location to their workplaces.

### Community composition

Show a few aggregated signals such as:

**Founders · Investors · AI**

These should be derived from associated profiles.

### External location action

Provide **Open in Google Maps**.

Meet Coworkers does not need its own navigation system.

---

## 13. My Workplaces

Users manage the places they regularly work from.

Maximum: **10 workplaces**

Actions:
- add workplace
- remove workplace
- view workplace
- check in

There is no need for workplace frequency or weekly schedules in MVP.

A workplace association means only:

> **I regularly work from here.**

---

## 14. Working From Here Today

Current presence is one of the main product loops.

### Check-in

A user can check in from:
- Home
- Place page
- My Workplaces

Button:

> **Work from here today**

No GPS verification is required.

### Active presence

A user can have only **one active presence** at a time.

Checking into another place automatically ends the previous presence.

### Expiration

Presence should automatically expire.

Suggested behavior:

`expires_at = MIN(check_in_time + 12 hours, end of local calendar day)`

Users can manually end presence earlier.

### Visibility

Other authenticated users can see:

> **Working from Nasab today**

They cannot see:
- previous visits
- check-in history
- exact arrival location
- GPS coordinates

Historical presence may be stored internally for analytics but is never exposed as a user timeline.

---

## 15. Coworker Directory

The Coworker directory allows professional discovery while remaining anchored to places.

### Coworker card

Show:
- profile photo
- name
- title
- company
- short “working on” text
- current place if actively checked in
- shared workplace where relevant
- `Open to meet`

### Search

Text search across:
- name
- company
- headline

### Filters

MVP filters:
- Workplace
- Role
- Industry
- Here today
- Open to meet

---

## 16. Coworker Profile

Profile contains:
- photo
- full name
- professional headline
- company
- short “working on” description
- role category
- up to 3 industries
- current place if actively checked in
- regular workplaces
- open-to-meet state

Primary CTA:

> **Connect**

States:
- Connect
- Request sent
- Connected

No direct messaging system is included in MVP.

---

## 17. Connections

Connections provide lightweight mutual consent before moving the relationship elsewhere.

### Sending a request

Tap **Connect**.

No custom message is required in MVP.

### Receiving a request

Recipient can:
- Accept
- Decline

### Accepted connection

Accepted connections appear under **Connections**.

An accepted connection can expose an optional **LinkedIn URL**.

The app itself does not provide messaging.

### Constraints

Users cannot:
- connect with themselves
- send duplicate pending requests
- send a new request when already connected
- connect with users they have blocked or who have blocked them

---

## 18. Safety and Privacy

### Place-level presence only

The app shows only the public place selected by the user.

It does not expose exact device location.

### No automatic tracking

Presence is always user initiated.

### No public history

Previous check-ins are never shown on profiles.

### Remove workplace

Users can remove themselves from a workplace immediately.

### End presence

Users can stop a check-in at any time.

### Block

Blocking another user should prevent connection requests and interaction, and hide profiles from each other where practical.

### Report

Users can report another user or inappropriate profile content.

A complex moderation system is not required.

---

## 19. Core Database Model

### cities

```text
id
name
country_code
timezone
is_active
created_at
updated_at
```

Seed Dubai as the initial city.

### profiles

```text
id
user_id
first_name
last_name
avatar_url
headline
company_name
working_on
role_category
city_id
open_to_meet
linkedin_url
onboarding_completed
created_at
updated_at
```

### industries

```text
id
name
slug
created_at
```

### profile_industries

```text
profile_id
industry_id
created_at
```

Maximum 3 industries per user.

### places

```text
id
google_place_id
name
formatted_address
area
city_id
country_code
latitude
longitude
category
google_maps_url
image_url
is_active
created_at
updated_at
```

`google_place_id` must be unique.

### workplaces

Represents:

> **I regularly work from here.**

```text
id
profile_id
place_id
created_at
```

Constraint:

```text
UNIQUE(profile_id, place_id)
```

Maximum 10 active workplace associations per profile.

### presences

Represents:

> **I’m working from here today.**

```text
id
profile_id
place_id
started_at
expires_at
ended_at
created_at
```

Only one active presence per profile.

Active means:

```sql
ended_at IS NULL
AND expires_at > NOW()
```

### connections

```text
id
requester_id
recipient_id
status
created_at
responded_at
```

Statuses:
- pending
- accepted
- declined
- cancelled

Duplicate connection relationships must be prevented.

### blocks

```text
blocker_id
blocked_id
created_at
```

### reports

```text
id
reporter_id
reported_profile_id
reason
details
status
created_at
reviewed_at
```

---

## 20. Derived Data

The database should remain the source of truth.

Do not manually maintain counters when they can safely be derived.

Useful derived values:
- place coworker count
- here-today count
- shared workplaces
- community composition

Cached aggregates may be introduced later if performance requires them.

---

## 21. Access Control / RLS

Supabase Row Level Security must be enabled.

Users may update only:
- their own profile
- their own workplaces
- their own presence
- their own connection actions
- their own blocks/reports

Authenticated users can read appropriate public profile information.

Authentication email addresses must never be exposed through profile queries.

Connection records should only be visible to the two users involved.

Reports should only be visible to the reporter and admins.

Sensitive backend logic must not depend on client-side authorization.

The Supabase service-role key must never be exposed to the browser.

---

## 22. Landing Page

Keep the public landing page simple.

### Hero

> **We already work from the same places. We should know each other.**

Supporting copy:

> Discover the people working from your favorite places — and find where interesting people are working today.

Primary CTA:

**Join Meet Coworkers**

No elaborate marketing site is required for MVP.

---

## 23. Empty States

### Place with no coworkers

> **Be the first coworker here.**

CTA: **Add to my workplaces**

### Nobody here today

> **Nobody has checked in here yet today.**

Still show regular coworkers.

### No connections

> **People you meet through your workplaces will appear here.**

### No regular workplaces

> **Where do you usually work from?**

---

## 24. Notifications

Push notifications are outside the first MVP.

Support visual in-app indicators for pending connection requests.

Transactional email notifications may be added later.

No notification infrastructure should block MVP launch.

---

## 25. Admin

A minimal admin interface is sufficient.

Admin can:
- search/deactivate users
- search/deactivate/resolve duplicate places
- review/resolve/dismiss reports

A sophisticated moderation dashboard is not required.

---

## 26. Analytics Events

Track core actions:

```text
signup_completed
onboarding_completed
workplace_added
workplace_removed
checkin_started
checkin_ended
place_viewed
coworker_viewed
coworker_search
place_search
connection_requested
connection_accepted
connection_declined
linkedin_clicked
```

Avoid excessive analytics before the core loop is validated.

---

## 27. MVP Success Metrics

### Network creation

Average number of workplaces added per activated user.

### Presence

Percentage of active users checking in at least once per week.

### Discovery

Place page views and coworker profile views per active user.

### Connections

Connection requests sent and acceptance rate.

### Workplace discovery

Users visiting places outside their existing workplace list after discovering the community there.

This specifically tests:

> **Where should I work from today?**

---

## 28. Initial Validation Targets

Indicative targets for the first meaningful Dubai cohort:

- **70%+** of completed registrations add at least two workplaces.
- **30%+** of weekly active users use `Working from here today`.
- **20%+** of activated users send at least one connection request.
- **40%+** acceptance rate for connection requests.

These are learning targets, not permanent KPIs.

---

## 29. Explicitly Out of Scope for MVP

Do not build:
- direct messaging
- group chats
- social feed
- posts
- likes/comments
- events
- coworking bookings
- coworking memberships
- payments
- venue reviews
- Wi-Fi/amenity reviews
- GPS verification
- background location tracking
- user location maps
- sophisticated recommendations
- AI matching
- organization/company pages
- calendar integration
- “working here tomorrow” scheduling
- follow/follower system
- public check-in history

These should not enter an implementation phase unless this product specification is explicitly changed.

---

## 30. Future Product Opportunities

Possible later extensions:
- smarter workplace discovery
- people recommendations
- planned presence
- lightweight coffee requests
- place-based events

These should follow proven behavior rather than precede it.

---

## 31. Critical User Flows

### Flow A — New user activation

```text
Landing page
→ Sign up
→ Create profile
→ Add professional context
→ Add workplaces
→ Choose open-to-meet status
→ Home
```

### Flow B — Working somewhere today

```text
Home
→ Where are you working today?
→ Select workplace
→ Confirm
→ Active presence created
→ See who else is here
```

### Flow C — Discover someone through a place

```text
Places
→ Nasab
→ Regular coworkers / Here today
→ Coworker profile
→ Connect
```

### Flow D — Choose where to work

```text
Places
→ Active today
→ Compare places by community
→ Open place
→ Browse people
→ Work from here today
```

This is the most strategically differentiated flow.

### Flow E — Discover a place through a person

```text
Coworkers
→ Person profile
→ Regular workplaces
→ Place page
→ Browse community
→ Add workplace / Work from here today
```

### Flow F — Connection

```text
Coworker profile
→ Connect
→ Recipient receives request
→ Accept
→ Connection created
→ LinkedIn contact available
```

---

## 32. MVP Definition of Done

The MVP is ready for an initial Dubai cohort when a user can:

1. Create a professional profile.
2. Add regular workplaces through Google Places.
3. See the community associated with each place.
4. Voluntarily indicate where they are working today.
5. See who else is currently there.
6. Browse coworkers across Dubai.
7. Filter people by professional context or workplace.
8. Discover active places based on the people there.
9. Send and receive connection requests.
10. Safely control workplace and presence information.

The product must work comfortably on mobile before desktop optimization is considered complete.

---

## 33. Build Phases

Development should be executed one phase at a time.

Later-phase functionality must not be pulled into earlier phases.

### Phase 1 — Foundation, Auth & Profiles

Build:
- Next.js application foundation
- design system
- Supabase connection
- database foundation
- RLS
- Google/email authentication
- onboarding
- profile creation/editing
- industries/roles
- Dubai city seed
- core mobile navigation

**Definition of done:** A new user can register, complete onboarding, and edit their profile.

No place community functionality is required yet.

### Phase 2 — Places & My Workplaces

Build:
- Google Places integration
- internal places table
- search/add place
- Places directory
- Place page foundation
- My Workplaces
- workplace counts
- Google Maps external link

**Definition of done:** Users can associate themselves with real places and browse the permanent communities attached to those places.

### Phase 3 — Presence

Build:
- Working from here today
- active presence lifecycle
- one-active-place constraint
- automatic expiry
- end check-in
- here-today counts
- Here Today section on Place pages
- Home presence module

**Definition of done:** Users can see who is currently working from a place without exposing historical location activity.

### Phase 4 — Discovery

Build:
- Coworker directory
- search
- workplace filter
- role filter
- industry filter
- here-today filter
- open-to-meet filter
- full coworker profiles
- shared workplace signals
- Active Places discovery

**Definition of done:** Users can discover both people through places and places through people.

### Phase 5 — Connections

Build:
- connection requests
- pending requests
- accept/decline
- accepted connections
- LinkedIn reveal/contact action
- blocking
- reporting
- RLS for relationships

**Definition of done:** A user can discover someone through a shared place, establish mutual intent, and continue the relationship outside the app.

### Phase 6 — Admin, Analytics & Launch Polish

Build:
- basic admin tools
- reports management
- place cleanup
- analytics events
- empty/loading/error states
- mobile UX refinement
- accessibility pass
- PWA polish
- production deployment checks
- critical flow tests

**Definition of done:** The application is stable enough for an initial real-world Dubai cohort.

---

## 34. Product Rule for Scope Decisions

When deciding whether something belongs in the MVP, ask:

> **Does this improve discovery or interaction between people because they work from the same physical places?**

If the answer is no, it should probably wait.

The MVP needs to prove one loop:

> **People add places → places reveal people → people choose where to work → presence creates opportunities → people connect.**

Everything else is secondary.
