---
phase: 02-navigation
plan: 01
subsystem: ui
tags: [posthog, analytics, sidebar, tracking, navigation]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: centralized analytics.ts helper with typed event constants and capture wrappers
provides:
  - demo_-prefixed PostHog event names for all 7 analytics events
  - source: 'demo' property injected into every PostHog capture call
  - sidebar navigation click tracking on every Link element via trackSidebarNav
  - MODULE_NAMES lookup map mapping PATHS to human-readable module names
affects: [03-feature-depth, 04-global-ai, all phases importing analytics.ts]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "All analytics events prefixed with demo_ to namespace them in PostHog"
    - "source: 'demo' injected by capture wrapper internally — callers never pass it"
    - "MODULE_NAMES lookup map at module level, keyed by PATHS constants"
    - "Inline onClick on Link components — no wrapper component (TrackableLink avoided)"

key-files:
  created: []
  modified:
    - client/src/lib/analytics.ts
    - client/src/components/layout/sidebar.tsx

key-decisions:
  - "source: 'demo' injected by wrapper, not by callers — keeps call sites clean and consistent"
  - "MODULE_NAMES defined at module level (not inside component) — avoids recreation on each render"
  - "Recent chat Links under VenueX AI also tracked (3 additional calls) — all Links instrumented, not just primary nav"

patterns-established:
  - "Capture wrapper pattern: posthog.capture(EVENT, { ...props, source: 'demo' })"
  - "MODULE_NAMES[href] ?? href fallback ensures unknown routes still emit a meaningful module value"

requirements-completed: [NAV-01]

# Metrics
duration: 8min
completed: 2026-04-03
---

# Phase 2 Plan 1: Analytics Namespacing and Sidebar Tracking Summary

**All 7 PostHog events namespaced with demo_ prefix, source: 'demo' injected in every capture wrapper, and 9 trackSidebarNav calls covering every Link in sidebar.tsx**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-03T11:30:00Z
- **Completed:** 2026-04-03T11:38:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Updated all 7 ANALYTICS_EVENTS values with demo_ prefix (D-01 requirement)
- Updated all 7 capture wrappers to inject `source: 'demo'` into PostHog properties (D-02/D-03)
- Added MODULE_NAMES lookup map (9 entries) and trackSidebarNav import to sidebar.tsx
- Instrumented 9 Link elements across all sidebar render paths: logo, VenueX AI main link, 3 recent chat links, standard navItems loop, 2 collapsed footer links (Settings + Profile), 2 expanded footer links (Settings + Profile)

## Task Commits

Each task was committed atomically:

1. **Task 1: Namespace analytics.ts events with demo_ prefix and inject source property** - `7452b12` (feat)
2. **Task 2: Instrument sidebar navigation clicks with trackSidebarNav** - `b3d22c9` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `client/src/lib/analytics.ts` - All 7 event values prefixed with demo_, all 7 capture wrappers inject source: 'demo'
- `client/src/components/layout/sidebar.tsx` - Added MODULE_NAMES, trackSidebarNav import, onClick tracking on all 9 Link elements

## Decisions Made
- MODULE_NAMES defined at module level (not inside component) to avoid recreation on every render
- Recent chat Links under VenueX AI expansion panel also tracked (9 total instead of minimum 5) — plan requirement was >= 5, we track all Links
- source: 'demo' is injected internally by wrappers, never by callers, keeping interfaces clean

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors in unrelated files (reviewsX.tsx, components/ui/sidebar.tsx) — confirmed not introduced by this plan's changes, out of scope.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- analytics.ts is fully namespaced and ready for all subsequent Phase 2-4 tracking calls
- Sidebar tracking is complete — every navigation click emits demo_sidebar_nav_clicked with to, from, and module properties
- Phase 2 Plan 2 (tab switch tracking) can proceed immediately

---
*Phase: 02-navigation*
*Completed: 2026-04-03*
