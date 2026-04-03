# Domain Pitfalls: PostHog Analytics in React

**Domain:** PostHog event instrumentation on an existing React SPA (demo prototype)
**Researched:** 2026-04-03
**Confidence:** HIGH — findings sourced from PostHog SDK source code (posthog-core.ts) and
direct inspection of the existing codebase. PostHog docs site is JS-rendered and not
accessible via fetch; all behavioral claims are verified against the actual SDK source.

---

## Critical Pitfalls

Mistakes that silently corrupt data or require structural fixes later.

---

### Pitfall 1: Events Fired Before PostHog Finishes Initializing Are Silently Dropped

**What goes wrong:**
PostHog `init()` is async. If `posthog.capture()` is called before the SDK finishes
loading (before the internal `__loaded` flag is set), the SDK returns immediately with
an uninitializedWarning — it does not queue the call. The event is lost with no error
thrown and no visible failure.

**Why it happens:**
In this app, `posthog.init()` runs in `main.tsx` synchronously, but initialization
involves network negotiation (feature flags, decide endpoint). Components that call
`posthog.capture()` at mount time — especially heavy initial render paths — can fire
before `__loaded` resolves.

The PostHog source confirms this explicitly:
```typescript
if (!this.__loaded || !this.persistence || ...) {
  logger.uninitializedWarning('posthog.capture')
  return  // event is dropped, no retry
}
```

**Consequences:**
- Silent data loss for the first-render events in the session
- `demo_gate_submitted` is particularly at risk if the gate resolves on the very first
  render (unlikely here since it waits for form submit, but relevant for future events)

**Prevention:**
- Never call `posthog.capture()` from a `useEffect` with an empty dependency array
  (component mount) unless guarded
- Use the `loaded` callback option in `posthog.init()` to gate any startup-time
  tracking calls if needed
- For the `analytics.ts` helper: wrap every call with a guard:
  ```typescript
  export function track(event: string, props?: Record<string, unknown>) {
    if (!posthog.__loaded) return;  // or posthog._loaded
    posthog.capture(event, props);
  }
  ```
  The PROJECT.md "silent failures" constraint makes this mandatory.

**Detection:**
- Open PostHog debugger panel in browser (EU: eu.posthog.com → Activity) and compare
  expected vs received events immediately after a fresh session
- Check browser DevTools Network tab for the `/decide` and `/batch` XHR requests; if
  they are still pending when capture fires, events will be lost

**Phase:** Centralized analytics.ts helper (Phase 1 / first milestone)

---

### Pitfall 2: Wouter Routing Does Not Trigger PostHog Auto-Pageviews

**What goes wrong:**
PostHog's `capture_pageview` setting uses `history_change` mode (as of defaults >= 2025-01-30)
or `true` (all navigation), which listens to `popstate` and `history.pushState`/
`history.replaceState` events. Wouter intercepts history but its behavior with PostHog's
history listener can be unreliable — route transitions may fire the PostHog pageview
listener zero times or multiple times per navigation depending on the Wouter version and
whether hash or history routing is used.

This app uses `posthog.init(..., { defaults: "2025-01-01" })`. That date is below
`2025-05-24`, so `capture_pageview` defaults to `true` (boolean) — meaning it fires one
pageview on init and relies on history events for subsequent navigations.

**Why it happens:**
PostHog was built primarily against React Router's history implementation. Wouter
manages its own location state and may not always push to `window.history` in a way
that PostHog's listener catches, particularly on initial load or when using the
`<Link>` component versus programmatic navigation.

**Consequences:**
- `$pageview` events missing for internal module navigations
- PostHog path-based funnels and session replays show only the entry URL
- Makes module-level engagement analysis unreliable

**Prevention:**
Add a manual pageview capture tied to Wouter's location:
```typescript
// In App.tsx or a dedicated hook
import { useLocation } from "wouter";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export function usePostHogPageview() {
  const [location] = useLocation();
  const posthog = usePostHog();
  useEffect(() => {
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [location]);
}
```
Place this hook in the `Router` component so it runs on every route change.

Alternatively, set `capture_pageview: false` in `posthog.init()` and own all pageview
captures manually to avoid double-counting.

**Detection:**
- Navigate between sidebar modules and check PostHog Activity feed — if `$pageview`
  fires only once (on initial load), Wouter is not triggering PostHog's listener
- Each route change should produce exactly one `$pageview` in the Activity feed

**Phase:** Centralized analytics.ts helper — must be validated during sidebar nav
tracking implementation

---

### Pitfall 3: Calling `identify()` Multiple Times Creates Merging Problems

**What goes wrong:**
PostHog's `identify()` call in `DemoGate.tsx` fires once on form submit and stores the
lead in localStorage. The gate checks localStorage on mount and skips showing the form
if the lead is already stored. However, if someone clears localStorage but PostHog
has already set a persistent cookie/session, their anonymous ID and identified ID can
become mismatched — leading to duplicated user profiles in PostHog.

More importantly: if `identify()` is ever called again (e.g., if DemoGate logic is
touched or if a future feature re-identifies), PostHog merges the anonymous and
identified profiles. Calling `identify()` with a different email than the existing
identified person creates a **new** person record, not a merge — leading to orphaned
profiles.

**Why it happens:**
PostHog's identity system uses a distinct ID. Once identified, calling
`identify("new@email.com")` when already identified as `"old@email.com"` does not merge
the two; it creates a separate person profile. The SDK source confirms that
`_validateIdentifyId()` rejects empty/null/undefined IDs but does NOT prevent
re-identification with a different ID.

**Consequences:**
- Inflated person counts in PostHog
- Session recording assigned to wrong person
- Funnel analysis broken for users who clear storage and re-enter the gate

**Prevention:**
- Only call `identify()` once per session. The current DemoGate implementation is
  correct: it guards with `if (!gated)` and localStorage check.
- Never call `identify()` outside DemoGate unless it is a deliberate re-identification
  with the same ID
- If re-identification is ever needed, call `posthog.reset()` first, then `identify()`
- Guard in the analytics.ts helper: do not expose an `identify` wrapper — let only
  DemoGate own this call

**Detection:**
- In PostHog Persons list, filter for duplicates or users with the same email on
  multiple records
- Watch for `$identify` events appearing in the Activity feed more than once per
  session for the same user

**Phase:** Identity management — addressed in Phase 1, guard maintained throughout

---

### Pitfall 4: Scattering Raw `posthog.capture()` Calls Directly in Components

**What goes wrong:**
Without a centralized analytics helper, individual components call
`posthog.capture("some_event", {...})` with string literals. Event names drift
(e.g., `"tab_switched"` vs `"tab_switch"` vs `"TabSwitched"`), properties vary by
component (some pass `module`, others pass `page`, others nothing). PostHog queries
break. Adding new properties retroactively means hunting every call site.

**Why it happens:**
DemoGate already sets a precedent by importing `posthog` directly. If this pattern
scales to 30+ components, the event taxonomy becomes unauditable. The app currently has
zero events beyond `demo_gate_submitted` — the moment tracking spreads, without a
helper it fragments immediately.

**Consequences:**
- Inconsistent event names make PostHog Insights unusable
- Typo in an event name means zero data captured for that interaction (no error thrown)
- Renaming an event requires a global search-and-replace across the codebase
- Properties are inconsistent — same event in two components emits different shapes

**Prevention:**
The first thing built must be `client/src/lib/analytics.ts` with:
- An exhaustive typed const for event names: `const EVENTS = { ... } as const`
- Typed capture wrappers per event family (nav, tab, action) that enforce required
  properties at compile time
- All tracking funneled through these wrappers — never raw `posthog.capture()` in
  components (DemoGate is the only legitimate exception because it also calls `identify`)

```typescript
// analytics.ts
import posthog from "posthog-js";

export const EVENTS = {
  SIDEBAR_NAV_CLICKED: "sidebar_nav_clicked",
  TAB_SWITCHED: "tab_switched",
  DEMO_GATE_SUBMITTED: "demo_gate_submitted",
  // ... one line per event
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

export function track(
  event: EventName,
  properties?: Record<string, unknown>
): void {
  try {
    posthog.capture(event, properties);
  } catch {
    // Silent failure — never break the app
  }
}
```

**Detection:**
- Run `grep -r "posthog.capture" client/src --include="*.tsx" --include="*.ts"` —
  any result outside `DemoGate.tsx` is a violation
- In PostHog, open Event Explorer and look for near-duplicate event names

**Phase:** Must be built first, before any other tracking is added (Phase 1)

---

## Moderate Pitfalls

---

### Pitfall 5: Double-Counting Pageviews When Auto-Capture and Manual Capture Both Run

**What goes wrong:**
If PostHog's `capture_pageview: true` (the current default given `defaults: "2025-01-01"`)
AND manual `$pageview` captures are added for Wouter (see Pitfall 2), every route change
produces two `$pageview` events. Session recording timelines and funnel step counts are
inflated by 2x.

**Prevention:**
Before adding a manual Wouter pageview hook, test whether PostHog auto-capture is
already firing on route changes (see Pitfall 2 detection). If it is, do not add manual
captures. If it is not, add manual captures AND disable auto-capture:

```typescript
posthog.init(token, {
  api_host: "...",
  defaults: "2025-01-01",
  capture_pageview: false,  // own all pageviews manually
});
```

Never run both. Make the decision once in the first phase and document it.

**Phase:** Pageview strategy must be finalized in Phase 1 before module tracking begins

---

### Pitfall 6: Tracking Events in Components That Render Multiple Times (StrictMode / Tabs)

**What goes wrong:**
React StrictMode double-invokes effects in development. If an analytics call is inside
a `useEffect`, it fires twice in dev (but only once in production). This creates noise
in the dev PostHog project and can mask double-fire bugs. Separate from StrictMode,
tabbed components that unmount/remount when switching tabs (e.g., switching from
Overview to Locations and back) can fire "module viewed" events on every remount even
if the user never re-navigated.

**Prevention:**
- Keep analytics calls in response to explicit user actions (click handlers, form
  submits) rather than mount effects where possible
- If a `useEffect` is necessary (e.g., tracking time-on-tab), use a ref guard:
  ```typescript
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    track(EVENTS.MODULE_VIEWED, { module: "locations" });
  }, []);
  ```
- For tab switches: fire on the user action, not on the rendered tab's mount

**Phase:** Relevant for any "module viewed" or "tab viewed" event — Phase 2+

---

### Pitfall 7: Sending PII in Event Properties

**What goes wrong:**
This is a demo app where real people enter their email at the gate. PostHog already
receives the email through `identify()` — that is intentional. The pitfall is
accidentally echoing PII in event properties: passing `email` or `company` as a property
on every capture call, or logging form field values in tracking events.

In the current codebase `demo_gate_submitted` already sends `{ company_name: ... }` —
that is fine. The risk comes when feature tracking is added naively, e.g.:
```typescript
// Bad — attaches lead data to every module event
track(EVENTS.TAB_SWITCHED, { tab: "overview", user_email: lead.email });
```

**Prevention:**
- Properties in `analytics.ts` capture wrappers should only accept interaction data
  (tab name, module, filter value, action type) — never identity fields
- The `identify()` call already attaches email and company to the person profile; they
  do not need to be re-sent on every event
- Review every `properties` object before shipping a phase — no `email`, `company`,
  or `timestamp` fields on behavioral events

**Phase:** Enforce at analytics.ts design time (Phase 1) and review during each phase

---

## Minor Pitfalls

---

### Pitfall 8: Using `window.posthog` Instead of the Imported Singleton

**What goes wrong:**
Early PostHog integrations (pre-npm) relied on `window.posthog` as the global. With
the npm package, the singleton is the imported module. The project has already logged
this as a resolved decision: "Import posthog singleton directly (not window.posthog) —
window.posthog was unreliable with npm package init." This is correct. The risk is
inconsistency if future contributors copy patterns from older PostHog tutorials.

**Prevention:**
The `analytics.ts` file centralizes the import. Since components never import posthog
directly (they call `track()`), this issue cannot re-emerge for new code.

**Phase:** Resolved at project init; maintained by the analytics.ts pattern

---

### Pitfall 9: Capturing the Internal Wouter Location String Instead of Full URL

**What goes wrong:**
Wouter's `useLocation()` returns a path like `/locations` — no origin, no query string.
If this is passed directly to `$current_url` in a pageview event, PostHog receives
a partial URL. PostHog's path analysis works, but features like session replay URL
matching and cross-domain analysis break.

**Prevention:**
Always use `window.location.href` (full URL) when setting `$current_url` in manual
pageview captures. Wouter's location value is only used to detect the route change,
not as the URL value:
```typescript
useEffect(() => {
  posthog.capture("$pageview", { $current_url: window.location.href });
}, [wouterLocation]);
```

**Phase:** Pageview implementation (Phase 1)

---

### Pitfall 10: Re-initializing PostHog (double init)

**What goes wrong:**
The PostHog SDK logs an error and no-ops if `posthog.init()` is called more than once.
This can happen if `main.tsx` is accidentally hot-reloaded in a way that re-executes
module-level code, or if another part of the codebase calls `init()`.

The SDK source confirms: `"You have already initialized PostHog! Re-initializing is a no-op"`.

**Prevention:**
`posthog.init()` belongs only in `main.tsx` (already the case). No other file should
call it. The `analytics.ts` helper imports the already-initialized singleton.

**Phase:** Already correctly structured; no action needed

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|----------------|------------|
| `analytics.ts` helper | Raw capture calls spreading before helper exists | Build helper first, commit it, then start instrumentation |
| Sidebar nav tracking | Double pageview from auto-capture + Wouter | Audit pageview behavior before adding sidebar events |
| Tab switch tracking | Tab remount fires event on every switch via useEffect | Bind to onClick/onChange, not mount effect |
| Wouter route changes | Missing `$pageview` events between modules | Add manual pageview hook, test with Network tab |
| Enrichment suggestions | Event properties leaking user context | Only pass interaction data (suggestion ID, action type) |
| VenueX AI chat | High-frequency capture on every message | Debounce or batch; avoid per-keystroke events |
| Language switch | Trivial to forget | One-liner in the language toggle handler |
| Production deploy | EU host required | `api_host: "https://eu.i.posthog.com"` — already set, never change |

---

## Sources

- PostHog SDK source: `posthog-core.ts` — initialization guards, capture pre-init behavior,
  `capture_pageview` defaults by `defaults` config date, `identify()` person processing
  requirements (HIGH confidence — primary source)
- PostHog GitHub issues search: feature flag persistence, React Native session replay,
  configuration conflicts (MEDIUM confidence — patterns, not directly this use case)
- Direct code inspection: `client/src/main.tsx`, `client/src/components/shared/DemoGate.tsx`,
  `client/src/App.tsx` — existing setup, router pattern, identify/capture usage
  (HIGH confidence — actual project code)
- Project context: `.planning/PROJECT.md` — requirements, constraints, existing decisions
  (HIGH confidence — primary project spec)
