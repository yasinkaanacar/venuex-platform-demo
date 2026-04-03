# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 01-foundation
**Areas discussed:** Event naming & typing, Pageview strategy, Helper API surface

---

## Event Naming & Typing

### Q1: How should event names be organized?

| Option | Description | Selected |
|--------|-------------|----------|
| Flat constants object | Single ANALYTICS_EVENTS object with SCREAMING_SNAKE keys. Matches existing QUERY_KEYS, STALE_TIMES convention. | ✓ |
| Grouped by module | Nested object: ANALYTICS_EVENTS.NAV.SIDEBAR_CLICKED, etc. More organized but deeper paths. | |
| String enum | TypeScript enum. Stricter typing but enums have known quirks. | |

**User's choice:** Flat constants object
**Notes:** Recommended — aligns with codebase convention

### Q2: Pre-define all events or foundation only?

| Option | Description | Selected |
|--------|-------------|----------|
| All events now | Define every event constant and property interface upfront from Phases 2-4. | ✓ |
| Foundation only, add later | Only define pageview-related events now. | |

**User's choice:** All events now
**Notes:** Roadmap success criteria requires all planned constants in analytics.ts

### Q3: How should event properties be typed?

| Option | Description | Selected |
|--------|-------------|----------|
| Per-event interfaces | Each event gets its own property interface. Strict and self-documenting. | ✓ |
| Generic Record<string, unknown> | One loose type for all properties. Less type safety. | |
| Discriminated union | Single union type keyed by event name. Maximum safety but complex. | |

**User's choice:** Per-event interfaces
**Notes:** None

### Q4: Event name string casing?

| Option | Description | Selected |
|--------|-------------|----------|
| snake_case | sidebar_nav_clicked, tab_switched. Matches PostHog convention and existing demo_gate_submitted. | ✓ |
| kebab-case | sidebar-nav-clicked. Less common in PostHog ecosystem. | |

**User's choice:** snake_case
**Notes:** Consistent with existing DemoGate event

---

## Pageview Strategy

### Q1: How to handle SPA pageviews with Wouter?

| Option | Description | Selected |
|--------|-------------|----------|
| Validate auto-capture first | Test if PostHog auto-capture works with Wouter. Only add manual tracking if needed. | ✓ |
| Manual hook from the start | Disable auto-capture and build usePageview() hook. Guaranteed but adds code. | |
| You decide | Claude picks based on runtime testing. | |

**User's choice:** Validate auto-capture first
**Notes:** Pragmatic — don't fix what isn't broken

### Q2: If manual pageview needed, where should it live?

| Option | Description | Selected |
|--------|-------------|----------|
| Inside App.tsx router | <PageviewTracker /> component rendered inside Router. One place for all routes. | ✓ |
| In analytics.ts as a hook | Export usePageviewTracking() from analytics.ts. Mixes hook and utility concerns. | |

**User's choice:** Inside App.tsx router
**Notes:** Consistent with existing provider setup pattern

---

## Helper API Surface

### Q1: What should analytics.ts export?

| Option | Description | Selected |
|--------|-------------|----------|
| Per-event typed functions | Named exports like trackSidebarNav(props). Type safety and autocomplete. | ✓ |
| Single generic capture() | One function for all events. Simpler but less safe. | |
| Both | Generic + typed functions. More exports, covers both use cases. | |

**User's choice:** Per-event typed functions
**Notes:** Matches codebase's typed wrapper convention

### Q2: Export ANALYTICS_EVENTS constants?

| Option | Description | Selected |
|--------|-------------|----------|
| Export constants too | Available for debugging, tests, documentation. Low cost. | ✓ |
| Keep internal | Constants as implementation detail. Components never see raw strings. | |

**User's choice:** Export constants too
**Notes:** None

### Q3: How should posthog be imported in analytics.ts?

| Option | Description | Selected |
|--------|-------------|----------|
| Direct import | import posthog from 'posthog-js'. Matches main.tsx and DemoGate.tsx. | ✓ |
| Lazy import via PostHogProvider | Use usePostHog() hook. More indirection. | |

**User's choice:** Direct import
**Notes:** PostHog already initialized before any component renders

---

## Claude's Discretion

- Error handling verbosity (console.warn in dev vs completely silent)
- Internal helper organization within analytics.ts

## Deferred Ideas

None — discussion stayed within phase scope
