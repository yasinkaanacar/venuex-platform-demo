# PostHog Analytics Instrumentation

## What This Is

Adding PostHog event tracking across the VenueX platform demo so we can see how visitors engage with each module after passing through the demo gate. The app is an already-built React prototype — this project instruments it with meaningful analytics events without changing any existing functionality.

## Core Value

Every demo visitor's journey through the platform is captured in PostHog — which modules they explore, how deep they go, and where they drop off.

## Requirements

### Validated

- ✓ PostHog JS SDK installed and initialized (EU cloud) — existing
- ✓ PostHogProvider wraps the app in main.tsx — existing
- ✓ DemoGate captures lead (email + company) and identifies user in PostHog — existing
- ✓ `demo_gate_submitted` event fires on gate submission — existing
- ✓ Centralized tracking helper (`analytics.ts`) with typed event names — Validated in Phase 1: Foundation

### Active

- [ ] Sidebar navigation click tracking (`sidebar_nav_clicked`)
- [ ] Tab switch tracking across all tabbed modules (`tab_switched`)
- [ ] Location module actions (view, add, edit, import, bulk)
- [ ] Review module actions (AI response generation)
- [ ] Overview enrichment suggestion actions
- [ ] VenueX AI assistant usage tracking
- [ ] Global filter change tracking (date range, platform, location)
- [ ] Language switch tracking

### Out of Scope

- PostHog dashboards/reports — done in PostHog UI, not code
- Backend event tracking — this is a frontend-only prototype
- A/B testing or feature flags — not needed for demo analytics
- Revenue/conversion tracking — no real transactions in demo

## Context

- VenueX platform demo is a polished frontend prototype (React 18 + TypeScript, Vite, Tailwind, shadcn/ui)
- PostHog is already initialized in `client/src/main.tsx` with EU cloud host
- DemoGate component at `client/src/components/shared/DemoGate.tsx` already uses `posthog.identify()` and `posthog.capture()`
- The app uses Wouter for routing, module-first component organization
- Key interactive modules: Overview, Locations, Reviews, Catalog, Offline Conversions, VenueX AI, Segments
- Each module has tabbed navigation — tab switches are a primary engagement signal
- PostHog pageview tracking uses manual `$pageview` capture via `usePostHog` hook in Router (auto-capture disabled)
- `client/src/lib/analytics.ts` is the centralized analytics helper — all future event tracking imports from here

## Constraints

- **No functionality changes**: Only add tracking — never modify existing UX or behavior
- **Silent failures**: If PostHog is unavailable, tracking calls must not break the app
- **Existing patterns**: Use the app's existing import/module conventions (see CLAUDE.md)
- **Minimal footprint**: One helper file + surgical edits to existing components

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Import posthog singleton directly (not window.posthog) | window.posthog was unreliable with npm package init | ✓ Good |
| Centralized `analytics.ts` helper | Single source of truth for event names, easy to grep | ✓ Good |
| Manual pageview tracking over auto-capture | Auto-capture unreliable with Wouter SPA routing | ✓ Good |
| Track tab switches as primary engagement metric | Tabs are the main navigation pattern within modules | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-03 — Phase 1 (Foundation) complete*
