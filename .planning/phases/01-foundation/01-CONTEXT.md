# Phase 1: Foundation - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Create `client/src/lib/analytics.ts` — a typed analytics helper with all planned event constants and per-event capture wrappers for Phases 1-4. Validate that PostHog pageview tracking works correctly with Wouter SPA route changes. No existing functionality is modified.

</domain>

<decisions>
## Implementation Decisions

### Event Naming & Typing
- **D-01:** Flat constants object (`ANALYTICS_EVENTS.SIDEBAR_NAV_CLICKED`) — matches existing codebase convention (QUERY_KEYS, STALE_TIMES)
- **D-02:** All events from Phases 2-4 pre-defined upfront — the file is a complete reference from day one, per roadmap success criteria
- **D-03:** Per-event property interfaces — each event gets its own typed interface (e.g., `SidebarNavClickedProps`, `TabSwitchedProps`)
- **D-04:** snake_case for PostHog event string values — matches PostHog convention and existing `demo_gate_submitted` event

### Pageview Strategy
- **D-05:** Validate auto-capture first — test if PostHog's `capture_pageview: true` already fires on Wouter route changes. Only add manual tracking if it doesn't work
- **D-06:** If manual pageview needed, use a `<PageviewTracker />` component inside the Router in App.tsx — not a hook in analytics.ts

### Helper API Surface
- **D-07:** Per-event typed functions as primary API — named exports like `trackSidebarNav(props)`, `trackTabSwitch(props)`. Each wraps `posthog.capture()` with correct event name
- **D-08:** Export `ANALYTICS_EVENTS` constants alongside typed functions — available for debugging, tests, documentation
- **D-09:** Direct `import posthog from 'posthog-js'` inside analytics.ts — matches existing pattern in main.tsx and DemoGate.tsx

### Pre-Decided (from project setup)
- **D-10:** DemoGate owns `identify()` — analytics.ts must NOT expose an identify wrapper (risk of double-identify bugs)
- **D-11:** All capture calls wrapped in try/catch — tracking failures must never break the app (silent failure principle)

### Claude's Discretion
- Error handling verbosity: Claude decides whether try/catch logs to console.warn in dev or stays completely silent
- Internal helper organization within analytics.ts (grouping, ordering of exports)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing PostHog Integration
- `client/src/main.tsx` — PostHog initialization with EU cloud host and PostHogProvider setup
- `client/src/components/shared/DemoGate.tsx` — Existing posthog.identify() and posthog.capture() usage (the ONLY file that should call posthog directly after this phase)

### Project Specs
- `.planning/REQUIREMENTS.md` — FOUND-01 through FOUND-04 define this phase's acceptance criteria
- `.planning/ROADMAP.md` — Phase 1 success criteria (4 conditions that must be TRUE)

### Codebase Conventions
- `.planning/codebase/CONVENTIONS.md` — Import ordering, naming patterns, module export conventions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- PostHog JS SDK already installed and initialized (`posthog-js` v1.364.6)
- `PostHogProvider` wrapping the app in main.tsx — React context available
- Existing SCREAMING_SNAKE constant objects: `QUERY_KEYS` in `hooks/query-keys.ts`, `STALE_TIMES` in `hooks/stale-times.ts` — follow same pattern

### Established Patterns
- Utility files in `client/src/lib/` use arrow function exports (`export const fn = ()`)
- Direct posthog import: `import posthog from 'posthog-js'` (used in main.tsx and DemoGate.tsx)
- No existing try/catch pattern in the codebase — this will be the first, keep it minimal

### Integration Points
- New file: `client/src/lib/analytics.ts` — follows lib/ utility convention
- If manual pageview needed: small `<PageviewTracker />` component added inside Router in `App.tsx`
- DemoGate.tsx is the only file currently calling posthog directly — it stays as-is (exception to the "all calls through helper" rule)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-03*
