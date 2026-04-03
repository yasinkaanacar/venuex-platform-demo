# Phase 2: Navigation - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Instrument sidebar navigation clicks and tab switches across all tabbed modules with PostHog events using the typed analytics helper from Phase 1. Also update analytics.ts to namespace all events for demo/live disambiguation. No existing functionality is modified — only tracking calls are added.

</domain>

<decisions>
## Implementation Decisions

### Event Namespacing (NEW — shared PostHog instance)
- **D-01:** ALL analytics event name values must be prefixed with `demo_` — e.g., `'demo_sidebar_nav_clicked'`, `'demo_tab_switched'`. This applies to every event in ANALYTICS_EVENTS, including Phase 1 events and all future phases.
- **D-02:** Every capture call must include `source: 'demo'` as an additional property alongside the event-specific props. Both prefix AND property for maximum clarity in PostHog filtering.
- **D-03:** The namespacing update to analytics.ts is the first task of Phase 2 — update all existing ANALYTICS_EVENTS values and modify capture wrapper functions to inject `source: 'demo'`.

### Sidebar Tracking
- **D-04:** Add inline `onClick` handlers directly on the existing `<Link>` elements in `sidebar.tsx` — call `trackSidebarNav()` with `to`, `from`, and `module` properties. No new wrapper component.
- **D-05:** Track ALL sidebar items — not just the 5 required modules. Settings, Team, VenueX AI, and Dashboard clicks are all captured. This gives complete navigation funnel data in PostHog.

### Module Naming
- **D-06:** Module strings use kebab-case route segments: `'overview'`, `'locations'`, `'reviews'`, `'catalog'`, `'offline-conversions'`, `'segments'`, `'venuex-ai'`, `'settings'`, `'team'`. Matches URL paths for easy PostHog filtering.

### Tab Naming
- **D-07:** Tab names use kebab-case descriptive strings regardless of internal implementation (numeric index, string ID, etc.). Examples: `'overview'`, `'store-profiles'`, `'reviews-inbox'`, `'sentiment-analysis'`. Human-readable and consistent across modules.

### Claude's Discretion
- Exact tab name strings for each module's tabs (Claude reads each page component to determine appropriate kebab-case names)
- How to derive `from` path in sidebar tracking (current `location` from Wouter vs. stored previous route)
- Whether to extract module name from href path programmatically or use a lookup map

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Analytics Foundation (Phase 1 outputs)
- `client/src/lib/analytics.ts` — Centralized analytics helper with ANALYTICS_EVENTS, typed interfaces, and capture wrappers. MUST be updated for demo_ prefix and source property.
- `client/src/main.tsx` — PostHog initialization (capture_pageview: false)
- `client/src/App.tsx` — Manual $pageview tracking in Router useEffect

### Sidebar Component
- `client/src/components/layout/sidebar.tsx` — Sidebar with nav items using Wouter `<Link href={item.href}>`. This is the primary file to instrument for NAV-01.

### Tabbed Page Components (one per module)
- `client/src/pages/locations.tsx` — Locations tabs (uses numeric index `activeTab` state)
- `client/src/pages/reviews.tsx` — Reviews tabs
- `client/src/pages/catalog.tsx` — Catalog tabs (uses string ID `activeTab` state)
- `client/src/pages/offline-conversions.tsx` — Offline Conversions tabs
- `client/src/pages/segments.tsx` — Segments tabs

### Project Specs
- `.planning/REQUIREMENTS.md` — NAV-01 through NAV-06 define this phase's acceptance criteria
- `.planning/ROADMAP.md` — Phase 2 success criteria (4 conditions)
- `.planning/codebase/CONVENTIONS.md` — Import ordering, naming, code style

### Existing PostHog Usage
- `client/src/components/shared/DemoGate.tsx` — Existing posthog.identify() and posthog.capture('demo_gate_submitted'). Note: DemoGate already uses 'demo_' prefix convention.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `trackSidebarNav(props)` and `trackTabSwitch(props)` already exist in analytics.ts with typed interfaces
- Wouter's `useLocation()` hook available for getting current route (used in sidebar.tsx already)
- Sidebar nav items defined as typed array with `href` and `name` properties

### Established Patterns
- Sidebar uses `<Link href={item.href}>` from Wouter — adding onClick doesn't interfere with navigation
- Tab state managed via `useState` in each page component — `setActiveTab` handlers are the natural tracking injection point
- Pages use different tab state patterns: numeric index (locations), string ID (catalog) — tab names must be normalized to kebab-case

### Integration Points
- `sidebar.tsx`: Add onClick with trackSidebarNav() to each Link element
- Each tabbed page: Add trackTabSwitch() call alongside existing setActiveTab() in onClick handlers
- `analytics.ts`: Update ANALYTICS_EVENTS values to add 'demo_' prefix, update capture wrappers to inject source: 'demo'

</code_context>

<specifics>
## Specific Ideas

- DemoGate already fires `demo_gate_submitted` — the `demo_` prefix convention is already established in the codebase
- PostHog instance is shared between the live VenueX platform and this demo — all filtering relies on the `demo_` prefix and `source: 'demo'` property

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-navigation*
*Context gathered: 2026-04-03*
