# AGENTS.md

# DANG Community Platform — Development Guide

This document defines the development standards, architecture, and workflow for the DANG Community Platform (Diary of a Naija Girl). It is derived from the Business & Product Requirements Document (BRD/PRD, v1.0, 9 April 2026) and should be read alongside it — the PRD is the source of truth for _what_ to build; this file governs _how_.

> **Assumption flag:** The PRD leaves the build-vs-buy platform decision as an open question for the tech team (Section 10, Q02–Q04). This guide assumes a **custom build** on a modern TypeScript web stack, since several MUST HAVE requirements (native anonymity at the DB layer, no-redirect live rooms, in-platform tester feedback, full data portability) are difficult to guarantee on most off-the-shelf community platforms. If the team instead selects a shelf platform, most domain rules below still apply — the tech-stack section will need to be replaced.

---

# Tech Stack (assumed — confirm against Section 10 decision)

- **Frontend:** Next.js (App Router) + React + TypeScript, mobile-web-first (NFR-U01: no native app required at launch)
- **Styling:** TailwindCSS with DANG brand tokens (NFR-U04) + dark mode support (NFR-U05)
- **Backend:** Next.js API routes or a dedicated Node.js/Express service, TypeScript throughout
- **Database:** PostgreSQL (relational integrity matters here — payments, tiered access, anonymity separation)
- **ORM:** Prisma
- **Auth:** Managed auth provider (e.g. Clerk/Auth.js) with 2FA support (NFR-S06), SSO bridge to Dang Lifestyle shop
- **Payments:** Paystack + Flutterwave (NGN, primary market) and Stripe (GBP/USD/EUR, diaspora audience) — FR-J01, FR-J05
- **Real-time:** WebSocket/Pusher (or Ably) for notifications, thread replies, presence
- **Live audio/video rooms:** LiveKit or Agora (self-hosted or managed) — must support 100+ concurrent participants (NFR-P03) with no third-party redirect (FR-G03)
- **Media storage:** S3-compatible object storage (Cloudflare R2 / AWS S3) for images, audio, video
- **Caching / queues:** Redis (session cache, scheduled post queue, notification dispatch)
- **Search:** Postgres full-text search initially; evaluate Meilisearch/Typesense if thread volume outgrows it (NFR-P04: search <2s)
- **Hosting:** Vercel (frontend) + a managed Postgres provider with EU + Nigeria-adjacent region options for GDPR/NDPR compliance
- **Native apps:** Not in Phase 1 scope (out of scope, Section 3.2) — architecture should not block a future React Native/Expo wrapper (NFR-U02: roadmap within 12 months)

---

# Project Structure

```
app/                    # Next.js routes (App Router)
  (community)/           # feed, channels, threads
  (circles)/              # private circles / inner rooms
  (learning)/             # learning hub, courses, live sessions
  (events)/               # events, live rooms
  (founder)/               # gated founder content
  (account)/               # profile, subscription, billing
components/
  ui/                     # generic, reusable UI
  community/              # channel/thread/post components
  circles/
  learning/
  events/
  commerce/               # Dang Lifestyle integration widgets
hooks/
services/                 # business logic — see Folder Responsibilities
api/                       # HTTP/tRPC client, interceptors
lib/                        # shared helpers
store/                       # client-side global state (UI state only)
types/
prisma/                      # schema, migrations
jobs/                          # scheduled post publisher, notification dispatch, digest emails
constants/
theme/
```

Never place business logic inside route components/screens.

Routes should only:

- Fetch data (server components / route handlers)
- Render UI
- Handle navigation

Everything else belongs in `services/`.

---

# Folder Responsibilities

## services/

Business logic, one service per domain area. Map directly to PRD sections so a requirement can always be traced to a file:

```
ConversationService     # FR-A: channels, threads, search, pinning
FaithRitualService      # FR-B: scheduled prayer posts, notification timing
AnonymityService        # FR-C: anonymous posting, identity separation, unmask policy
ConnectionService       # FR-D: member matching, directory, DMs
GatedContentService     # FR-E: founder content, tiering, share-protection
CircleService           # FR-F: private circles, invites, leaders
LearningService         # FR-G: courses, progress, live sessions, replays
EventService            # FR-H: events, RSVPs, live rooms, recordings
CommerceIntegrationService  # FR-I: Dang Lifestyle SSO, discounts, drops, testers
SubscriptionService      # FR-J: billing, tiers, payment gateways, retries
DataPortabilityService   # NFR-D: export, migration, right to erasure
```

Each service owns its own validation, authorization checks, and side effects (notifications, webhooks). Route handlers call services — they never talk to Prisma directly.

## api/ (client side)

- Typed API client / tRPC router
- Never call fetch directly inside components

## jobs/

Anything time-triggered belongs here, not in request handlers:

- Faith ritual post publisher (FR-B01–B04) — must fire within 60s of scheduled time (NFR-P02)
- Early-access drop window opener/closer (FR-I04, FR-I05)
- Subscription renewal / failed-payment retry (FR-J04)
- Discount deactivation on subscription lapse (FR-I03)

---

# Domain Rules (non-negotiable, from PRD)

These aren't generic best practices — they're specific commitments made in the BRD and must be enforced in code review, not just documentation:

- **True anonymity, not a UI toggle.** Anonymous posts (FR-C01–C04) must store the author's identity in a way that is _structurally_ separated from the post record (NFR-S02) — e.g. a separate identity-mapping table with restricted access, not an `isAnonymous: true` flag on the same row with the author ID still attached. A leaked post record must not reveal identity.
- **Unmask is an emergency-only, audited action.** Founder/admin unmasking of an anonymous post (FR-C03) must be logged (who, when, why) and gated behind a documented policy — never a casual admin toggle.
- **Gated content must not leak.** Founder content (FR-E01–E04) must be unreachable by direct URL for non-members (NFR-S05) and must not be embeddable/shareable outside the platform (FR-E03). Check access at the data-fetching layer, not just in the UI.
- **No dead-end redirects for core experiences.** Live sessions and live rooms must run in-platform (FR-G03, FR-H02) — don't bounce members to Zoom/YouTube for the "no bouncing between platforms" promise to hold.
- **Discounts and drops are automatic, not code-hunting.** The 10% Dang Lifestyle discount (FR-I02) must apply via SSO/auto-populated code with zero manual steps, and must deactivate the moment a subscription lapses (FR-I03). Early-access drops (FR-I04) need a configurable window with three states: member-only, then public — build this as an explicit state machine, not a cron-adjacent hack.
- **Data belongs to the founder, not the platform.** Full member data export (profiles, posts, engagement, payments) must be self-serve from the admin dashboard at any time, in CSV or JSON (NFR-D01–D03). Don't build this as a "contact support" process — that violates the platform-independence requirement directly.
- **Faith ritual timing is a product promise, not a nice-to-have.** Scheduled posts must be live by the configured time and notifications delivered within 60 seconds (NFR-P02). Treat missed/late faith-ritual notifications as a P1 bug, not a background job hiccup.
- **Compliance is dual-jurisdiction.** Every feature touching personal data needs to satisfy both GDPR (UK) and NDPR (Nigeria) — right to erasure (NFR-S04), encryption at rest and in transit with TLS 1.2 minimum (NFR-S01), and no silent cross-border data movement without checking both regimes.

---

# Styling

Use Tailwind with DANG's brand tokens defined once in `theme/` (colors, type scale, spacing) — never hardcode brand hex values inline.

Bad

```tsx
<View style={{ marginTop: 14 }} />
```

Good

```tsx
<View className="mt-4" />
```

Support dark mode (NFR-U05) via Tailwind's `dark:` variant from day one rather than retrofitting — it's cheaper to build in than bolt on later.

---

# Payments & Subscriptions

- Route all billing logic through `SubscriptionService` — never call a payment gateway SDK directly from a route handler or component.
- Support Paystack/Flutterwave for NGN and Stripe (or equivalent) for GBP/USD/EUR (FR-J01, FR-J05) behind a single internal interface so the checkout flow doesn't fork by currency.
- Failed payments must trigger automated retry + member notification _before_ access is revoked (FR-J04) — never hard-cut access on first failure.
- Self-service upgrade/downgrade/cancel/pause (FR-J03) lives in `SubscriptionService`, exposed via the member's account settings.

---

# Notifications & Scheduling

- All time-based publishing (faith posts, event reminders, tester invitations) goes through `jobs/`, using a durable scheduler (not `setTimeout`) so restarts don't drop scheduled sends.
- Respect per-member timezone where configured, defaulting to WAT (FR-B05).
- Every notification path needs a delivery-confirmation or retry mechanism — silent notification failures directly undermine the "daily habit" success metric (DAU/MAU 60%+ target).

---

# Security & Privacy

- Encrypt data at rest and in transit; TLS 1.2 minimum (NFR-S01).
- 2FA available as an option for members (NFR-S06).
- Authorization checks belong in services, re-checked server-side even if the UI already hides an element — gated content and circle visibility must never rely on client-side hiding alone.
- Any admin action that can reveal a member's protected identity (unmasking) or bulk-export personal data must be logged with actor, timestamp, and reason.

---

# Performance Targets (from NFR-P, treat as acceptance criteria)

| Area                                    | Target                                       |
| --------------------------------------- | -------------------------------------------- |
| Core page load (feed, channel, profile) | < 3s on standard mobile connection           |
| Notification delivery                   | < 60s from scheduled trigger                 |
| Live audio/video rooms                  | 100+ concurrent participants, no degradation |
| Search across thread archive            | < 2s                                         |
| Uptime                                  | 99.5%, excluding scheduled maintenance       |

Treat regressions against these as bugs, not backlog items — they're explicit product requirements, not aspirational.

---

# Accessibility & Usability

- Fully functional on mobile web (iOS Safari, Android Chrome) without requiring a native app (NFR-U01).
- New members should be able to post their first message within 5 minutes of signup (NFR-U03) — audit onboarding friction against this number.
- Every interactive component needs `accessibilityRole`/ARIA equivalents, labels for icon-only controls, and adequate touch target size — this is part of the definition of done, not a later pass.

---

# Testing

- Unit/integration tests for every service, especially `AnonymityService`, `SubscriptionService`, and `GatedContentService` — these are the components where a bug is a trust or compliance failure, not just a UX bug.
- Contract tests for payment gateway integrations (mock Paystack/Flutterwave/Stripe webhooks).
- Load-test live room capacity against the 100-concurrent-participant target before launch.
- E2E coverage for the early-access drop state machine (member-only window → public) since it's a timed, revenue-sensitive flow.

---

# File Naming

```
Components        UserCard.tsx
Hooks              useAuth.ts
Services            AnonymityService.ts
Jobs                 publishFaithPosts.ts
Prisma models         schema.prisma (PascalCase model names)
Constants               moscowPriorities.ts
```

---

# Code Style

- Prefer early returns; avoid nested conditionals.
- TypeScript strict mode, no implicit `any` on service boundaries — these are the highest-stakes parts of the codebase (payments, anonymity, gated access).
- Path aliases (`@/services`, `@/components`) instead of long relative imports.
- ESLint flat config (`eslint.config.js`) + Prettier.

---

# Git Workflow

Branch names

```
feature/anonymous-posting
feature/faith-ritual-scheduler
bugfix/discount-not-deactivating
hotfix/gated-content-leak
refactor/subscription-service
```

Commit messages

```
feat(circles): add invite-by-email flow
fix(anonymity): separate identity table from post table
refactor(payments): unify gateway interface across paystack/stripe
```

Reference the PRD requirement ID (e.g. `FR-C02`, `NFR-S02`) in the PR description so every change traces back to a documented requirement.

---

# Pull Requests

Every PR should include:

- Summary
- Requirement ID(s) it addresses (FR-/NFR- reference)
- Screenshots (UI changes)
- Testing steps
- Any compliance implications (GDPR/NDPR) if personal data is touched

---

# Definition of Done

A task is complete only when:

- Requirements are implemented and traced to their FR-/NFR- ID.
- Code is typed, tested, and passes lint.
- UI matches brand and supports dark mode.
- Loading/error/empty states exist.
- Accessibility basics are covered.
- Anonymity, gating, and payment logic have been checked against the Domain Rules section above — not just "it works" but "it can't leak."
- Performance targets in the NFR table are met or explicitly flagged as a known gap.
- Project builds successfully with no TypeScript or lint errors.
