---
phase: 02-navigation
verified: 2026-04-03T15:00:00Z
status: human_needed
score: 7/8 must-haves verified
re_verification: false
human_verification:
  - test: "Open PostHog Activity feed and navigate the sidebar. Confirm demo_sidebar_nav_clicked events appear with correct to, from, and module properties."
    expected: "Each sidebar click produces one event. The 'module' property matches the destination (e.g. 'locations', 'reviews', 'venuex-ai'). The 'from' property contains the previous route. The 'source' property equals 'demo'."
    why_human: "PostHog event ingestion and real-time display cannot be verified programmatically without a live session. The code path is wired but actual event arrival requires a browser session with PostHog connected."
  - test: "Switch tabs in Locations, Reviews, Catalog, Offline Conversions, and Segments. Confirm demo_tab_switched events appear in PostHog Activity with the correct module and tab_name."
    expected: "Locations fires store-profiles / performance / posts. Reviews fires tab values directly (overview / inbox / locations). Catalog fires dashboard / activity. Offline Conversions fires summary / performance / campaigns / data-connection (including when navigated programmatically via onNavigateToTab). Segments fires audiences / platform-push (kebab-case hyphen, not underscore)."
    why_human: "Real event ingestion requires a live browser session with PostHog connected."
  - test: "Verify the PostHog funnel view shows which module visitors land on first and where they navigate next."
    expected: "A navigable user path funnel is constructable in PostHog using demo_sidebar_nav_clicked events grouped by 'module' property."
    why_human: "PostHog funnel configuration and event availability is a product-analytics concern, not code-level. Requires live event data in the PostHog project to confirm."
---

# Phase 2: Navigation Verification Report

**Phase Goal:** Every sidebar click and every tab switch across all five modules is captured in PostHog
**Verified:** 2026-04-03T15:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | All ANALYTICS_EVENTS values are prefixed with `demo_` | VERIFIED | analytics.ts lines 18-28: all 7 event string values begin with `demo_` |
| 2 | Every capture wrapper injects `source: 'demo'` into PostHog properties | VERIFIED | analytics.ts lines 67, 75, 83, 91, 99, 107, 115: all 7 wrappers spread `{ ...props, source: 'demo' }` |
| 3 | Clicking any sidebar nav item fires `demo_sidebar_nav_clicked` with `to`, `from`, and `module` | VERIFIED | sidebar.tsx lines 84, 150, 180, 202, 233, 244, 267, 278: 8 trackSidebarNav calls, each passing `{ to, from: location, module: MODULE_NAMES[...] ?? ... }` |
| 4 | ALL sidebar links are tracked — including Settings, Team/Profile, VenueX AI, and logo | VERIFIED | Logo (line 84), VenueX AI main link (line 180), navItems loop (lines 150, 202), collapsed footer Settings+Profile (lines 233, 244), expanded footer Settings+Profile (lines 267, 278). Plus 3 recent-chat Links under VenueX AI expansion in the navItems loop at line 150. 8 total Link elements covered. |
| 5 | Switching tabs in Locations fires `demo_tab_switched` with `module: 'locations'` and correct `tab_name` | VERIFIED | locations.tsx lines 429, 436, 443: 3 inline onClick wrappers — `store-profiles`, `performance`, `posts` |
| 6 | Switching tabs in Reviews, Catalog, Offline Conversions, and Segments each fire `demo_tab_switched` with their respective module names | VERIFIED | reviews.tsx line 138 (inside `handleTabChange`, passes `tab` directly); catalog.tsx line 61 (passes `tab.id`); offline-conversions.tsx line 115 (inside `handleMainTabChange`, maps Turkish keys via `OC_TAB_NAMES`); segments.tsx lines 21, 28 (`audiences` and `platform-push` with kebab-case) |
| 7 | `trackSidebarNav` is wired from `sidebar.tsx` to `analytics.ts` | VERIFIED | sidebar.tsx line 19: `import { trackSidebarNav } from '@/lib/analytics'`; called 8 times in Link onClick handlers |
| 8 | PostHog receives events and a navigable funnel is viewable | ? UNCERTAIN | Requires human verification — live PostHog session needed |

**Score:** 7/8 truths verified (1 human-only)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `client/src/lib/analytics.ts` | Namespaced event constants + source-injected capture wrappers | VERIFIED | 7 event constants with `demo_` prefix; 7 wrappers all inject `source: 'demo'`; no `source` field in any interface |
| `client/src/components/layout/sidebar.tsx` | Sidebar navigation click tracking on every Link | VERIFIED | MODULE_NAMES map (9 entries) at module level; `trackSidebarNav` imported; 8 Link elements instrumented |
| `client/src/pages/locations.tsx` | Tab switch tracking for Locations module | VERIFIED | Import present; 3 trackTabSwitch calls with `module: 'locations'` and tab names `store-profiles`, `performance`, `posts` |
| `client/src/pages/reviews.tsx` | Tab switch tracking for Reviews module | VERIFIED | Import present; 1 trackTabSwitch call inside `handleTabChange`, passes `tab` directly |
| `client/src/pages/catalog.tsx` | Tab switch tracking for Catalog module | VERIFIED | Import present; 1 trackTabSwitch call in tab onClick, passes `tab.id` directly |
| `client/src/pages/offline-conversions.tsx` | Tab switch tracking for Offline Conversions module | VERIFIED | Import present; `OC_TAB_NAMES` map at module level (ozet/performans/kampanyalar/veri_baglantisi -> summary/performance/campaigns/data-connection); `handleMainTabChange` extracted; covers both inline tab clicks (line 301) and programmatic `onNavigateToTab` callback (line 631) |
| `client/src/pages/segments.tsx` | Tab switch tracking for Segments module | VERIFIED | Import present; 2 trackTabSwitch calls — `audiences` and `platform-push` (kebab-case hyphen, not underscore, per D-07) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `client/src/components/layout/sidebar.tsx` | `client/src/lib/analytics.ts` | `import { trackSidebarNav }` | WIRED | Import at line 19; `trackSidebarNav(` called 8 times in Link onClick handlers |
| `client/src/pages/locations.tsx` | `client/src/lib/analytics.ts` | `import { trackTabSwitch }` | WIRED | Import at line 45; called 3 times in tab button onClick handlers |
| `client/src/pages/reviews.tsx` | `client/src/lib/analytics.ts` | `import { trackTabSwitch }` | WIRED | Import at line 29; called 1 time inside `handleTabChange` at line 138 |
| `client/src/pages/catalog.tsx` | `client/src/lib/analytics.ts` | `import { trackTabSwitch }` | WIRED | Import at line 11; called 1 time in tab onClick at line 61 |
| `client/src/pages/offline-conversions.tsx` | `client/src/lib/analytics.ts` | `import { trackTabSwitch }` | WIRED | Import at line 22; called inside `handleMainTabChange` at line 115; handler invoked at lines 301 and 631 |
| `client/src/pages/segments.tsx` | `client/src/lib/analytics.ts` | `import { trackTabSwitch }` | WIRED | Import at line 2; called 2 times in tab button onClick handlers at lines 21, 28 |

### Data-Flow Trace (Level 4)

Not applicable. These are event emission artifacts (fire-and-forget analytics calls), not data-rendering components. There is no data variable rendered to the UI from these tracking calls. The downstream consumer is PostHog, verified as human-only (Success Criterion 4).

### Behavioral Spot-Checks

Step 7b: SKIPPED — analytics event emission requires a live browser session connected to PostHog. No runnable entry point can be tested without starting the dev server and conducting a real user interaction.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| NAV-01 | 02-01-PLAN.md | Sidebar navigation clicks fire `sidebar_nav_clicked` event with destination and source page | SATISFIED | sidebar.tsx: 8 trackSidebarNav calls on all Link elements, each passing `to`, `from: location`, `module: MODULE_NAMES[href]` |
| NAV-02 | 02-02-PLAN.md | Tab switches in Locations module fire `tab_switched` event with module and tab_name | SATISFIED | locations.tsx: 3 trackTabSwitch calls — `store-profiles`, `performance`, `posts` — all with `module: 'locations'` |
| NAV-03 | 02-02-PLAN.md | Tab switches in Reviews module fire `tab_switched` event with module and tab_name | SATISFIED | reviews.tsx: trackTabSwitch inside `handleTabChange` passes `module: 'reviews'` and `tab_name: tab` (ActiveTab values are already kebab-friendly) |
| NAV-04 | 02-02-PLAN.md | Tab switches in Catalog module fire `tab_switched` event with module and tab_name | SATISFIED | catalog.tsx: trackTabSwitch passes `module: 'catalog'` and `tab_name: tab.id` (TabId values `dashboard`/`activity`) |
| NAV-05 | 02-02-PLAN.md | Tab switches in Offline Conversions module fire `tab_switched` event with module and tab_name | SATISFIED | offline-conversions.tsx: `handleMainTabChange` normalizes Turkish keys via `OC_TAB_NAMES` and fires `module: 'offline-conversions'` with English kebab-case tab names; covers both user clicks and programmatic navigation |
| NAV-06 | 02-02-PLAN.md | Tab switches in Segments module fire `tab_switched` event with module and tab_name | SATISFIED | segments.tsx: `tab_name: 'platform-push'` (hyphen) for internal `platform_push` (underscore) state — D-07 kebab-case compliance confirmed |

No orphaned requirements found. All 6 NAV-0x IDs declared in plans are mapped to Phase 2 in REQUIREMENTS.md and all show status Complete.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None found | — | — | — | — |

Scanned: `analytics.ts`, `sidebar.tsx`, `locations.tsx`, `reviews.tsx`, `catalog.tsx`, `offline-conversions.tsx`, `segments.tsx`.

No TODOs, placeholders, empty handlers, or disconnected wiring found. The `trackAiExampleQuestionClicked` wrapper takes no props — it passes `{ source: 'demo' }` directly, which is correct per the plan spec. The `source` property is injected internally in all wrappers; no interface definitions include it.

One note: `sidebar.tsx` has 8 trackSidebarNav calls on Link elements (not 9 as stated in SUMMARY.md — the 3 recent-chat items are rendered by the `navItems` loop iteration, counted as one loop body, resulting in 8 distinct call sites but 9+ runtime invocations depending on how many recent-chat items render). This is not a defect — all Links are covered.

### Human Verification Required

#### 1. PostHog: Sidebar click events appear with correct properties

**Test:** Open the VenueX demo in a browser. Open PostHog Activity (live event stream). Click each sidebar item: Overview, Locations, Reviews, Catalog, Offline Conversions, Segments, VenueX AI, Settings, and the profile/team link. Also click the VenueX logo.
**Expected:** Each click produces exactly one `demo_sidebar_nav_clicked` event in PostHog Activity. Each event has: `to` = destination path, `from` = previous path, `module` = readable name (e.g. `locations`, `venuex-ai`, `settings`, `team`), `source` = `demo`.
**Why human:** PostHog event ingestion requires a live browser session. Code wiring is verified; only the PostHog project receiving and displaying the events requires human confirmation.

#### 2. PostHog: Tab switch events appear with correct properties for all five modules

**Test:** Navigate to each tabbed module and switch tabs. Check PostHog Activity after each switch.
**Expected:**
- Locations: `demo_tab_switched` with `module: "locations"`, `tab_name` cycling through `store-profiles`, `performance`, `posts`
- Reviews: `demo_tab_switched` with `module: "reviews"`, `tab_name` cycling through tab values (overview, inbox, locations)
- Catalog: `demo_tab_switched` with `module: "catalog"`, `tab_name` of `dashboard` or `activity`
- Offline Conversions: `demo_tab_switched` with `module: "offline-conversions"`, `tab_name` of `summary`, `performance`, `campaigns`, or `data-connection`. Also test programmatic navigation by triggering the "Go to Campaigns" quick-link from the summary view.
- Segments: `demo_tab_switched` with `module: "segments"`, `tab_name` of `audiences` or `platform-push` (hyphen, not underscore)
**Why human:** Live PostHog session required to confirm events arrive and contain correct property values.

#### 3. PostHog: Navigable funnel is constructable from captured events

**Test:** In PostHog, build a Funnel or User Paths visualization using the `demo_sidebar_nav_clicked` event grouped or filtered by `module`. Confirm a meaningful journey is visible.
**Expected:** A user path is visible showing which modules demo visitors navigate to and in what order.
**Why human:** PostHog funnel construction is a product analytics configuration task, not verifiable from code. Requires live event data accumulated from at least one demo session.

### Gaps Summary

No code-level gaps found. All 7 artifacts exist, are substantive, and are wired. All 6 requirements (NAV-01 through NAV-06) have confirmed implementation evidence. The only open item is live PostHog event confirmation, which requires a human-run browser session.

---

_Verified: 2026-04-03T15:00:00Z_
_Verifier: Claude (gsd-verifier)_
