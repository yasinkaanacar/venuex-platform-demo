# Phase 2: Navigation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 02-navigation
**Areas discussed:** Sidebar tracking approach, Tracking coverage scope, Module name mapping, Event namespacing

---

## Sidebar Tracking Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Add onClick to Link wrapper | Add trackSidebarNav() call to existing <Link> elements in sidebar.tsx. Simple, explicit, fires before navigation. | ✓ |
| Observe route changes in Router | Detect navigation via useLocation() changes in App.tsx and infer source. No sidebar changes needed but 'from' page harder to determine. | |
| You decide | Claude picks best approach. | |

**User's choice:** Add onClick to Link wrapper (Recommended)
**Notes:** None

### Follow-up: Implementation Style

| Option | Description | Selected |
|--------|-------------|----------|
| Inline onClick on Link | Add onClick directly on existing <Link> elements. Minimal change, no new components. | ✓ |
| NavLink wrapper component | Create a TrackedLink wrapper. Cleaner separation but adds a new abstraction. | |
| You decide | Claude picks. | |

**User's choice:** Inline onClick on Link (Recommended)
**Notes:** None

---

## Tracking Coverage Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Track ALL sidebar items | Fire sidebar_nav_clicked for every sidebar link including Settings, Team, VenueX AI. | ✓ |
| Only the 5 required modules | Sidebar tracking only for the 5 modules in requirements. | |
| You decide | Claude picks. | |

**User's choice:** Track ALL sidebar items (Recommended)
**Notes:** None

---

## Module Name Mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Kebab-case route segments | Use route-derived names: 'overview', 'locations', 'reviews', etc. Matches URL paths. | ✓ |
| Display names | Use human-readable names: 'Dashboard', 'Locations', etc. | |
| You decide | Claude picks. | |

**User's choice:** Kebab-case route segments (Recommended)
**Notes:** None

### Follow-up: Tab Name Convention

| Option | Description | Selected |
|--------|-------------|----------|
| Kebab-case descriptive names | Always send descriptive names like 'overview', 'store-profiles'. Consistent across modules. | ✓ |
| Use whatever internal ID exists | Send internal IDs as-is (numeric index, string ID). Simpler but inconsistent. | |
| You decide | Claude picks. | |

**User's choice:** Kebab-case descriptive names (Recommended)
**Notes:** None

---

## Event Namespacing (User-Initiated)

**Context:** User raised that PostHog instance is shared between live platform and demo — events need disambiguation.

| Option | Description | Selected |
|--------|-------------|----------|
| Prefix event names with 'demo_' | All events become demo_sidebar_nav_clicked, etc. Easy PostHog filtering. | |
| Add 'source: demo' property | Keep names, add source property to every event. | |
| Both prefix AND property | Prefix names AND add source property. Maximum clarity. | ✓ |

**User's choice:** Both prefix AND property
**Notes:** Since live platform and demo share a single PostHog instance, there should be no ambiguity about event origin.

### Follow-up: Timing of Namespacing Update

| Option | Description | Selected |
|--------|-------------|----------|
| Include in Phase 2 | First task of Phase 2 updates analytics.ts. Clean since no consumers exist yet. | ✓ |
| You decide | Claude determines sequencing. | |

**User's choice:** Include in Phase 2 (Recommended)
**Notes:** None

---

## Claude's Discretion

- Exact tab name strings per module (Claude reads components)
- How to derive `from` path in sidebar tracking
- Whether module name extraction is programmatic or lookup-based

## Deferred Ideas

None
