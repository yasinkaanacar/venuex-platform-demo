---
phase: 02-navigation
plan: 02
subsystem: ui
tags: [posthog, analytics, tabs, tracking, navigation, locations, reviews, catalog, offline-conversions, segments]

# Dependency graph
requires:
  - phase: 02-navigation
    plan: 01
    provides: trackTabSwitch export in analytics.ts with TabSwitchedProps interface
provides:
  - tab switch PostHog tracking on all 5 tabbed modules
  - demo_tab_switched events with module and kebab-case tab_name for all tab changes
  - OC_TAB_NAMES normalization map for Turkish-keyed offline-conversions tabs
  - handleMainTabChange centralizes both inline clicks and programmatic onNavigateToTab in offline-conversions
affects: [PostHog analytics, all 5 tabbed module pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline onClick wrapping: { setState(val); trackTabSwitch({ module, tab_name }); } for simple cases"
    - "Handler extraction pattern: handleMainTabChange centralizes tracking when multiple code paths trigger tab change"
    - "Turkish-to-English normalization map (OC_TAB_NAMES) at module level — callers use internal keys, tracker emits English kebab-case"
    - "Direct pass-through: reviews passes tab variable directly since ActiveTab values are already kebab-friendly"

key-files:
  created: []
  modified:
    - client/src/pages/locations.tsx
    - client/src/pages/reviews.tsx
    - client/src/pages/catalog.tsx
    - client/src/pages/offline-conversions.tsx
    - client/src/pages/segments.tsx

key-decisions:
  - "OC_TAB_NAMES map at module level normalizes Turkish internal tab keys to English kebab-case for PostHog (D-07 compliance)"
  - "handleMainTabChange extracted in offline-conversions to cover both inline tab clicks and onNavigateToTab callback with single tracking call"
  - "segments.tsx fires 'platform-push' (hyphen) not 'platform_push' (underscore) per D-07 kebab-case convention"

requirements-completed: [NAV-02, NAV-03, NAV-04, NAV-05, NAV-06]

# Metrics
duration: 7min
completed: 2026-04-03
---

# Phase 2 Plan 2: Tab Switch Tracking Across All Modules Summary

**Tab switch tracking instrumented across all 5 tabbed modules: trackTabSwitch called on every tab change in Locations, Reviews, Catalog, Offline Conversions, and Segments — with D-07 kebab-case tab names.**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-04-03T11:20:00Z
- **Completed:** 2026-04-03T11:27:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- locations.tsx: import + 3 trackTabSwitch calls (store-profiles, performance, posts) — inline onClick wrappers per D-07 naming
- reviews.tsx: import + 1 trackTabSwitch call at top of existing handleTabChange, passes tab directly (ActiveTab values are already kebab-friendly)
- catalog.tsx: import + 1 trackTabSwitch call in tab onClick, passes tab.id directly (TabId values are already kebab-friendly)
- offline-conversions.tsx: import + OC_TAB_NAMES normalization map + handleMainTabChange function extracted — covers both inline tab clicks and onNavigateToTab programmatic navigation (RESEARCH.md Pitfall 2 addressed)
- segments.tsx: import + 2 trackTabSwitch calls — internal 'platform_push' maps to kebab-case 'platform-push' per D-07

## Task Commits

Each task was committed atomically:

1. **Task 1: Instrument tab tracking in Locations and Reviews** - `02154a1` (feat)
2. **Task 2: Instrument tab tracking in Catalog, Offline Conversions, and Segments** - `0400be0` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `client/src/pages/locations.tsx` — import trackTabSwitch, 3 inline onClick wrappers for store-profiles/performance/posts tabs
- `client/src/pages/reviews.tsx` — import trackTabSwitch, call at top of handleTabChange (passes tab directly)
- `client/src/pages/catalog.tsx` — import trackTabSwitch, call in tab button onClick (passes tab.id)
- `client/src/pages/offline-conversions.tsx` — import trackTabSwitch, OC_TAB_NAMES map, handleMainTabChange function, replace inline setMainTab and onNavigateToTab callback
- `client/src/pages/segments.tsx` — import trackTabSwitch, 2 inline onClick wrappers (audiences/platform-push)

## Decisions Made

- OC_TAB_NAMES normalization map at module level converts Turkish internal keys (ozet, performans, kampanyalar, veri_baglantisi) to English kebab-case (summary, performance, campaigns, data-connection) for PostHog
- handleMainTabChange extracted in offline-conversions.tsx to ensure both UI tab clicks and programmatic navigation (onNavigateToTab from TopCampaignsQuickList) go through the same tracking path
- segments.tsx fires 'platform-push' (hyphen) as tab_name even though internal state uses 'platform_push' (underscore) — D-07 requires kebab-case

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Pre-existing TypeScript errors in `reviewsX.tsx` — confirmed not introduced by this plan's changes, out of scope (documented in 02-01-SUMMARY.md as well).

## Known Stubs

None — all tracking calls are wired directly to real tab state changes with real event values.

## User Setup Required

None.

## Next Phase Readiness

- Phase 2 is complete: sidebar nav tracking (Plan 1) + tab switch tracking (Plan 2) both done
- Phase 3 (feature depth) can proceed — analytics.ts is fully set up with trackLocationViewed and trackLocationAction wrappers ready for use

---
*Phase: 02-navigation*
*Completed: 2026-04-03*
