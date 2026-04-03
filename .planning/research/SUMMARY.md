# Project Research Summary

**Project:** VenueX Platform Demo — PostHog Analytics Instrumentation
**Domain:** SaaS product demo engagement tracking (React SPA + PostHog EU cloud)
**Researched:** 2026-04-03
**Confidence:** HIGH

## Executive Summary

This project adds structured PostHog event tracking to an existing React 18 + TypeScript demo prototype. PostHog is already initialized (EU cloud, `posthog-js` v1.364.6), `demo_gate_submitted` fires on gate submission, and `posthog.identify()` runs at that same moment. The instrumentation work is purely additive — no new packages, no init changes, no backend involvement. The canonical approach is a single `client/src/lib/analytics.ts` file that owns all event name constants and typed capture wrapper functions. Every component calls through this file; nothing ever calls `posthog.capture()` directly except the existing `DemoGate.tsx` (which also handles identity and is deliberately isolated).

The recommended build sequence is strict: analytics helper first, navigation events second, feature-depth events third, global controls last. This ordering is non-negotiable because every subsequent event depends on the typed event catalog in `analytics.ts`. Deviating from it — even by one component — starts the drift toward inconsistent event names that makes PostHog queries unreliable. The goal is demo intelligence (which modules hold attention, which features land, where visitors drop off) not comprehensive product analytics, so scope is intentionally contained: 8 event types covering navigation, tab engagement, location/review/enrichment feature interactions, AI assistant usage, and language switches.

The two structural risks are Wouter pageview compatibility and pre-init event loss. PostHog's auto-capture pageview listener was built against React Router's history model; Wouter may not trigger it reliably on route transitions. This must be validated in Phase 1 and resolved with either a manual Wouter pageview hook or by disabling auto-capture and taking full ownership. Pre-init event loss (events fired before PostHog's internal `__loaded` flag resolves) is mitigated by the `try/catch` guard in `analytics.ts` and by never calling capture from mount-time `useEffect` without a guard. Both risks are known, testable, and have clear fixes.

---

## Key Findings

### Recommended Stack

No new packages are required. `posthog-js` v1.364.6 ships its React hooks as a sub-path export (`posthog-js/react`) and its type definitions via `@posthog/types` — both already installed. The singleton import pattern (`import posthog from "posthog-js"`) is the correct approach for `analytics.ts` as a plain TypeScript module. The `usePostHog()` React hook is reserved for the rare case where PostHog must be accessed inside a component's render tree for something outside standard event capture.

**Core technologies:**
- `posthog-js` v1.364.6: event capture, person identification, auto-pageview — already installed and initialized in `main.tsx`
- `posthog-js/react`: `usePostHog()` hook for the Wouter pageview hook only — bundled, no install needed
- `@posthog/types`: `Properties`, `CaptureResult` types used in `analytics.ts` wrappers — bundled, no install needed

### Expected Features

**Must have (table stakes):**
- `analytics.ts` centralized helper — without it, event name drift makes PostHog data unqueryable within days
- `sidebar_nav_clicked` with `{ to, from, module, language }` — primary navigation intent signal; `$pageview` alone does not capture click intent
- `tab_switched` with `{ module, tab, previous_tab, language }` — the most granular engagement signal available; all 5 main modules have multiple tabs
- `language_switched` with `{ from, to, current_module }` — one-line addition that immediately segments Turkish vs international visitors
- Wouter-compatible pageview tracking — auto-capture may be unreliable with Wouter; must be validated and resolved before any module tracking is meaningful

**Should have (differentiators):**
- Location module depth events: `location_action` with action variants (`view_detail`, `add`, `edit`, `import`, `bulk_edit`, `bulk_delete`) — Locations is the most interactive module; depth engagement here is the strongest "serious evaluation" signal
- `review_ai_response_generated` — AI suggestion generation is a WOW moment in demos; tracking who triggered it is direct deal-signal data
- `enrichment_suggestion_action` with `{ action: 'accepted' | 'dismissed', suggestion_type }` — enrichment suggestions are a key value-demo moment (platform shows what's wrong and how to fix it)
- `ai_assistant_message_sent` with `{ is_first_message, session_id }` — VenueX AI is a differentiator feature; engagement with it is high-intent

**Defer (v2+):**
- `module_time_spent` — highest analytical value but highest implementation complexity (shared hook, enter/exit timestamp tracking); defer until core navigation events are proven
- `oc_filter_changed` (offline conversions filter tracking) — medium signal value; add in a follow-up pass
- `sidebar_toggled` — nice-to-have, not actionable enough to prioritize
- Module first-visit vs return tracking — requires session-level state management; meaningful only after navigation events are in place

**Deliberate non-tracks:**
- Scroll depth, click heatmaps via toolbar, form field interactions, error/exception events, Settings/Team page visits, revenue/conversion events — all produce noise without actionable signal in this demo context

### Architecture Approach

The architecture is a three-layer stack with a strict single-direction dependency flow. PostHog is initialized in `main.tsx` and never touched again. `analytics.ts` imports the singleton and exports typed constants and wrapper functions. Page components and feature components call `analytics.*` functions in their event handlers — co-located with the state mutations they describe, never in child components or effects. UI primitives in `components/ui/` never track anything. The only legitimate exception to the rule against direct `posthog.capture()` calls in components is the existing `DemoGate.tsx`, which also handles `identify()` and predates the pattern.

**Major components:**
1. `client/src/lib/analytics.ts` (new) — typed `ANALYTICS_EVENTS` const object, all capture wrapper functions, `try/catch` silent-failure guard, single import of `posthog` singleton
2. `usePostHogPageview` hook (new, in `App.tsx` or dedicated file) — ties Wouter's `useLocation()` to manual `$pageview` captures; resolves the Wouter/PostHog history listener compatibility gap
3. Instrumented call sites (existing files, minimal additions) — `sidebar.tsx`, `Header.tsx`, `pages/reviews.tsx`, `pages/locations.tsx`, `pages/offline-conversions.tsx`, `pages/catalog.tsx`, `components/locations2/LocationDataTable.tsx`, `components/reviews/ReviewDetail.tsx`, `components/overview/enrichment-suggestions.tsx`, `pages/venuex-ai.tsx`

### Critical Pitfalls

1. **Events dropped before PostHog `__loaded` resolves** — PostHog `init()` is async; captures fired before `__loaded` is set are silently discarded with no error. Guard every capture with `try/catch` in `analytics.ts` and never fire from empty-dependency `useEffect` without a guard. Validate during Phase 1 by watching the Network tab for `/decide` XHR completion timing.

2. **Wouter route changes not triggering PostHog auto-pageview** — PostHog's history listener was built against React Router. With Wouter, `$pageview` may fire only once (on init) and never again. Must be tested immediately in Phase 1. Fix: add a `usePostHogPageview` hook tied to Wouter's `useLocation()` and set `capture_pageview: false` in init to avoid double-counting.

3. **Scattered raw `posthog.capture()` calls without the analytics helper** — if any component directly calls `posthog.capture()` before `analytics.ts` exists, event name drift starts immediately. The helper must be the first commit. Detection: `grep -r "posthog.capture" client/src` — any match outside `DemoGate.tsx` is a violation.

4. **Double-counting pageviews when auto-capture and manual Wouter hook both run** — if Wouter does trigger PostHog's auto-capture listener AND a manual hook is added, every route change produces 2 `$pageview` events. Validate first, then commit to one strategy exclusively.

5. **Re-identifying users mid-session** — calling `posthog.identify()` with a different ID than the initial identify creates a new person record, not a merge. The `analytics.ts` helper must not expose an `identify` wrapper. Only `DemoGate.tsx` owns identity calls.

---

## Implications for Roadmap

All four research files converge on the same 4-phase build order. The sequence is dependency-driven: each phase produces complete, usable PostHog data before the next begins, and no phase can be reordered without breaking downstream data quality.

### Phase 1: Foundation — Analytics Helper + Pageview Strategy

**Rationale:** Everything else imports from `analytics.ts`. Building any tracking before this file exists guarantees event name fragmentation. The pageview compatibility question (Wouter vs PostHog auto-capture) must also be resolved here — it affects whether navigation data is reliable for all subsequent phases.
**Delivers:** `client/src/lib/analytics.ts` with all `ANALYTICS_EVENTS` constants and typed capture wrappers stubbed for all planned events; validated pageview tracking strategy (auto vs manual); `usePostHogPageview` hook if needed.
**Addresses:** Table stakes #1 (analytics.ts helper), table stakes #5 (Wouter pageview)
**Avoids:** Pitfall 1 (pre-init drop), Pitfall 2 (Wouter pageview gap), Pitfall 4 (scattered captures), Pitfall 5 (double-counting)

### Phase 2: Navigation Layer — Sidebar + Tab Tracking

**Rationale:** Sidebar clicks and tab switches are the highest-signal, lowest-complexity events. They cover 80% of the navigation surface with minimal code and immediately make the PostHog funnel useful. With Phase 1 complete, wiring these is one-liners per component.
**Delivers:** `sidebar_nav_clicked` in `sidebar.tsx`; `tab_switched` in `reviews.tsx`, `locations.tsx`, `offline-conversions.tsx`, `catalog.tsx`. PostHog now shows module-level navigation paths for every demo visitor.
**Addresses:** Table stakes #2 (sidebar nav), table stakes #3 (tab switches)
**Avoids:** Pitfall 6 (StrictMode double-fire — bind to onClick, not mount effect)

### Phase 3: Feature Depth — Location, Review, Enrichment Actions

**Rationale:** Navigation events answer "where did they go?"; feature depth events answer "did they try to use the product?" These are the "aha moment" signals — a visitor who opens a location detail, generates an AI review response, or accepts an enrichment suggestion is evaluating seriously. Locations is the most interactive module and anchors the demo.
**Delivers:** `location_action` variants in `LocationDataTable.tsx` and `locations.tsx`; `review_ai_response_generated` in `ReviewDetail.tsx`; `enrichment_suggestion_action` in `enrichment-suggestions.tsx`.
**Addresses:** Should-have features #1, #2, #3
**Avoids:** Pitfall 7 (PII in properties — only pass interaction data, never identity fields)

### Phase 4: Global Controls + AI Assistant

**Rationale:** Lower frequency but high-intent signals. Language switch is one line and immediately segments TR vs EN visitor profiles. VenueX AI message tracking captures the deepest engagement signal available. Both are low-effort relative to their analytical value.
**Delivers:** `language_switched` in `Header.tsx`; `ai_assistant_message_sent` in `venuex-ai.tsx`.
**Addresses:** Table stakes #6 (language switch), should-have #4 (AI chat)
**Avoids:** Pitfall 3 (re-identification — analytics.ts exposes no identify wrapper)

### Phase Ordering Rationale

- Phase 1 before everything: `analytics.ts` is a hard dependency for all other phases. No exceptions.
- Phase 2 before Phase 3: Navigation context (module, previous tab) must be established before feature events are meaningful. A `location_action` without knowing how the visitor reached Locations is lower-value data.
- Phase 3 before Phase 4: High-volume, high-signal features (Location, Review) before low-frequency global controls. Validates the tracking pattern under real use before adding peripheral events.
- `module_time_spent` and OC filter tracking are explicitly deferred — they add complexity without being prerequisites for any other phase. Add after core events are validated.

### Research Flags

Phases with patterns that need validation during implementation (not additional research, but runtime testing):
- **Phase 1:** Wouter pageview compatibility must be empirically validated — open PostHog Activity feed, navigate between modules, count `$pageview` events. Decision (auto vs manual) cannot be made from code inspection alone.
- **Phase 1:** Pre-init timing — validate that `analytics.ts` `try/catch` guard is sufficient by checking Network tab during cold load.

Phases with standard, well-documented patterns (no additional research needed):
- **Phase 2:** Sidebar and tab tracking are textbook PostHog event instrumentation. Patterns are fully specified in `analytics.ts` contract.
- **Phase 3:** Feature action tracking follows the same `track()` wrapper pattern. Component touch points are fully mapped in the component map (ARCHITECTURE.md).
- **Phase 4:** Language switch and AI chat are single-location, single-line additions.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified from `node_modules` source files and `main.tsx`. Zero new dependencies. All claims grounded in installed code, not docs. |
| Features | HIGH | Derived from direct codebase inspection of all pages, tab patterns, and interactive surfaces. Not speculative — every event maps to a specific existing UI element. |
| Architecture | HIGH | Three-layer pattern is well-established for PostHog in TypeScript SPAs. Component map was built from actual file reads, not inference. |
| Pitfalls | HIGH | PostHog SDK source (`posthog-core.ts`) was the primary source for behavioral claims. Pre-init drop and Wouter compatibility gaps verified against SDK internals. |

**Overall confidence:** HIGH

### Gaps to Address

- **Wouter pageview compatibility:** Cannot be resolved from static analysis alone. Must be validated at runtime during Phase 1 implementation. The fix paths are known (manual hook + disable auto-capture), but which path to take depends on empirical testing.
- **PostHog project data hygiene:** The existing `demo_gate_submitted` event fires `company_name` as a property. When adding Phase 3 events, review whether any existing enrichment suggestion data already passes PII fields — audit before shipping.
- **`module_time_spent` design:** Deferred but not abandoned. When re-evaluated, the `useRef` guard pattern for StrictMode and the enter/exit timestamp approach will need a dedicated design pass.

---

## Sources

### Primary (HIGH confidence)
- `node_modules/posthog-js/package.json` — version 1.364.6 confirmed installed
- `node_modules/posthog-js/react/dist/types/index.d.ts` — `usePostHog()` signature
- `node_modules/@posthog/types/dist/posthog.d.ts` — `capture()` method signature, `Properties` type
- `node_modules/posthog-js/react/dist/esm/index.js` — PostHogProvider and context implementation
- `posthog-core.ts` (SDK source) — pre-init drop behavior, `capture_pageview` defaults by config date, `identify()` person processing
- `client/src/main.tsx` — existing init pattern, EU cloud host, `PostHogProvider` wrapping
- `client/src/components/shared/DemoGate.tsx` — working singleton import pattern, `identify()` usage
- `client/src/components/layout/sidebar.tsx`, `Header.tsx` — navigation and language switch surfaces
- `client/src/pages/reviews.tsx`, `locations.tsx`, `offline-conversions.tsx`, `catalog.tsx`, `segments.tsx`, `venuex-ai.tsx` — tab patterns and interactive surfaces
- `.planning/PROJECT.md` — requirements, constraints, Key Decisions (window.posthog unreliability, silent failures constraint)

### Secondary (MEDIUM confidence)
- PostHog GitHub raw README (`posthog-js/react`) — confirmed `usePostHog` hook description and capture pattern
- PostHog GitHub issues search — feature flag persistence and React Native session replay patterns (adjacent, not directly this use case)

---
*Research completed: 2026-04-03*
*Ready for roadmap: yes*
