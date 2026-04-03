# Architecture Patterns: PostHog Analytics Instrumentation

**Domain:** React SPA analytics instrumentation
**Researched:** 2026-04-03
**Confidence:** HIGH — PostHog React SDK is stable and well-documented; patterns derived from direct codebase inspection

---

## Recommended Architecture

### Single Source of Truth: `client/src/lib/analytics.ts`

One file owns all event names and all capture calls. No component ever imports `posthog` directly (DemoGate already does this — it predates the pattern and is the only exception). Every other component calls through `analytics.ts`.

```
posthog (SDK singleton, initialized in main.tsx)
    ↑
analytics.ts (typed wrappers, event name constants)
    ↑
Components / Pages / Hooks (call analytics.* functions)
```

This is the correct layering for this codebase. There is no router middleware, no HOC, no context needed — the PostHogProvider is already in place and `posthog` is importable as a singleton from `posthog-js`.

---

## Component Boundaries

### Where Tracking Code Lives

| Layer | Responsibility | What It Tracks |
|-------|---------------|----------------|
| `analytics.ts` | All PostHog calls, all event name strings | Nothing directly — it is the API |
| Page components (`pages/*.tsx`) | Route-level navigation actions | Tab switches, bulk actions, page-level filter changes |
| Feature components (`components/{module}/*.tsx`) | Feature-specific interactions | Row clicks, AI generation, enrichment accept/dismiss |
| Layout components (`layout/sidebar.tsx`, `layout/Header.tsx`) | Cross-cutting navigation/settings | Sidebar nav clicks, language switch |

**Rule:** Track at the lowest component that "owns" the interaction. If a tab switch is managed by `useState` in `pages/reviews.tsx`, the tracking call goes in `reviews.tsx` next to the `setActiveTab` call — not in a child component that receives `onTabChange` as a prop.

### What Does Not Track

- UI primitives in `components/ui/` — never. These are reused everywhere and have no business context.
- `shared/schema.ts`, `lib/queryClient.ts`, `lib/mockData.ts` — data/utility layer, never tracks.
- Server routes — this is frontend-only.

---

## Data Flow

```
User interaction (click, submit, select)
    ↓
Event handler in Page or Feature Component
    ↓
analytics.trackX() call (imported from analytics.ts)
    ↓
analytics.ts: posthog.capture(EVENT_NAME, properties)
    ↓
PostHog JS SDK (batches, queues, sends)
    ↓
EU PostHog cloud (https://eu.i.posthog.com)
```

PostHog JS buffers calls internally and flushes on a timer or when the buffer is full. If PostHog fails to initialize or the network is unavailable, `posthog.capture()` silently no-ops — this is the SDK's built-in behavior and satisfies the "silent failures" constraint in PROJECT.md.

---

## The `analytics.ts` Contract

The file should export:

1. **An event name enum or const object** — every event name is a string constant, never a raw string at the call site.
2. **Typed capture functions** — one per event category, with typed `properties` parameters. This prevents typos in property names and makes all events greppable.

```typescript
// client/src/lib/analytics.ts
import posthog from "posthog-js";

// ── Event Names ──────────────────────────────────────────────────────────────
export const ANALYTICS_EVENTS = {
  SIDEBAR_NAV_CLICKED:          "sidebar_nav_clicked",
  TAB_SWITCHED:                 "tab_switched",
  LOCATION_ACTION:              "location_action",
  REVIEW_AI_RESPONSE_GENERATED: "review_ai_response_generated",
  ENRICHMENT_SUGGESTION_ACTION: "enrichment_suggestion_action",
  AI_ASSISTANT_MESSAGE_SENT:    "ai_assistant_message_sent",
  GLOBAL_FILTER_CHANGED:        "global_filter_changed",
  LANGUAGE_SWITCHED:            "language_switched",
} as const;

// ── Typed Capture Helpers ─────────────────────────────────────────────────────
export function trackSidebarNav(destination: string) {
  posthog.capture(ANALYTICS_EVENTS.SIDEBAR_NAV_CLICKED, { destination });
}

export function trackTabSwitch(module: string, tab: string) {
  posthog.capture(ANALYTICS_EVENTS.TAB_SWITCHED, { module, tab });
}

export function trackLocationAction(
  action: "view_detail" | "add" | "edit" | "import" | "bulk_edit" | "bulk_delete",
  properties?: Record<string, unknown>
) {
  posthog.capture(ANALYTICS_EVENTS.LOCATION_ACTION, { action, ...properties });
}

export function trackReviewAiResponse(trigger: "button_click" | "auto") {
  posthog.capture(ANALYTICS_EVENTS.REVIEW_AI_RESPONSE_GENERATED, { trigger });
}

export function trackEnrichmentSuggestion(
  action: "accepted" | "dismissed",
  suggestion_type: string
) {
  posthog.capture(ANALYTICS_EVENTS.ENRICHMENT_SUGGESTION_ACTION, { action, suggestion_type });
}

export function trackAiAssistantMessage(is_example_prompt: boolean) {
  posthog.capture(ANALYTICS_EVENTS.AI_ASSISTANT_MESSAGE_SENT, { is_example_prompt });
}

export function trackGlobalFilterChange(
  filter_type: "date_range" | "platform" | "location",
  value: string
) {
  posthog.capture(ANALYTICS_EVENTS.GLOBAL_FILTER_CHANGED, { filter_type, value });
}

export function trackLanguageSwitch(to_language: "en" | "tr") {
  posthog.capture(ANALYTICS_EVENTS.LANGUAGE_SWITCHED, { to_language });
}
```

Call sites become one-liners:

```typescript
// In sidebar.tsx, inside the nav item click handler:
import { trackSidebarNav } from "@/lib/analytics";
trackSidebarNav(item.href);

// In reviews.tsx, next to setActiveTab:
import { trackTabSwitch } from "@/lib/analytics";
setActiveTab(tab);
trackTabSwitch("reviews", tab);
```

---

## Patterns to Follow

### Pattern 1: Track Adjacent to State Change

Place the tracking call immediately after the state mutation that triggers the interaction. Never split them across components.

```typescript
// Correct — tracking is co-located with the state it describes
const handleTabChange = (tab: ActiveTab) => {
  setActiveTab(tab);
  trackTabSwitch("reviews", tab);
};

// Wrong — tracking buried in a child component's onChange prop
<TabBar onChange={(tab) => { setActiveTab(tab); trackTabSwitch(...) }} />
// This makes the tracking invisible when reading the page component
```

### Pattern 2: Import posthog Singleton, Not usePostHog Hook

The `usePostHog()` hook from `posthog-js/react` requires a component render context. Since `analytics.ts` is a plain module (not a component), it must import the singleton directly:

```typescript
import posthog from "posthog-js";
```

This is consistent with the DemoGate pattern that was validated as working (see PROJECT.md Key Decisions: "Import posthog singleton directly — window.posthog was unreliable").

### Pattern 3: No Tracking in Render Path

Tracking calls only go in event handlers (`onClick`, `onChange`, `onSubmit`), never in component bodies, `useEffect` (except for route-change tracking if needed), or render functions. Violating this causes duplicate events on re-renders.

```typescript
// Wrong
function MyComponent() {
  trackSomeEvent(); // fires on every render
  return <div />;
}

// Correct
function MyComponent() {
  return <button onClick={() => trackSomeEvent()}>Click</button>;
}
```

### Pattern 4: Pageview Is Automatic — Don't Double-Track

PostHog auto-captures `$pageview` on route change when initialized. Do not manually fire pageview events. Sidebar nav click tracking (`sidebar_nav_clicked`) adds business context (which item was clicked) but is separate from pageview.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Scattered Direct posthog.capture Calls

**What goes wrong:** Event names defined inline as strings across 15 files. A typo in one file creates a phantom event. Refactoring an event name requires a project-wide search.

**Instead:** All event names live in `ANALYTICS_EVENTS` in `analytics.ts`. All captures go through typed helper functions. `posthog.capture` is called in exactly two places: `analytics.ts` and `DemoGate.tsx` (legacy).

### Anti-Pattern 2: Tracking in UI Primitives

**What goes wrong:** Adding `onClick` tracking to `<Button>` in `components/ui/button.tsx`. Now every button in the app fires an event with no business context. PostHog data becomes noise.

**Instead:** Track in the feature component that knows what the button *does*, not what it *is*.

### Anti-Pattern 3: Wrapping Components in HOCs for Tracking

**What goes wrong:** Creating `withTracking(Component)` wrappers. In this codebase, components are function declarations that don't compose well with HOCs. Adds indirection with no benefit when direct handler calls are cleaner.

**Instead:** Inline one-line tracking calls in existing handlers. The footprint is minimal.

### Anti-Pattern 4: useEffect for Non-Route Events

**What goes wrong:** Watching state with `useEffect` to fire tracking side effects. Creates timing ambiguity (fires after render, not on interaction) and double-fires on Strict Mode in development.

**Instead:** Track in the handler that sets the state, not in an effect that watches it.

---

## Suggested Build Order

Build in this sequence. Each phase delivers complete, usable PostHog data before the next begins.

### Phase 1 — Foundation (instrument first)
**`analytics.ts` helper file**

Everything else depends on this. Write all event name constants and all typed functions upfront, even for events not yet wired. This is a 30-minute task that eliminates all future inconsistency.

Deliverable: `client/src/lib/analytics.ts` with all constants and helpers stubbed.

### Phase 2 — Navigation Layer
**Sidebar nav clicks + tab switches across all modules**

These two event types produce the highest-signal data for a demo: which modules visitors explore and how deep they go within each module. Combined with PostHog's auto-captured `$pageview`, this answers "what did this visitor look at?"

Touch points:
- `client/src/components/layout/sidebar.tsx` — one `onClick` on nav items
- `client/src/pages/locations.tsx` — tab switch handler
- `client/src/pages/reviews.tsx` — tab switch handler (`activeTab` state)
- `client/src/pages/offline-conversions.tsx` — tab switch handler
- `client/src/pages/catalog.tsx` — tab switch handler

### Phase 3 — High-Value Module Actions
**Location actions + Review AI + Enrichment suggestions**

These are the "did they try to *use* the product?" signals. A visitor who clicks "Add Location", generates an AI review response, or accepts an enrichment suggestion is engaging with the product at a deeper level than someone who just reads.

Touch points:
- `client/src/components/locations2/LocationDataTable.tsx` — row view/edit actions
- `client/src/pages/locations.tsx` — add, import, bulk action buttons
- `client/src/components/reviews/ReviewDetail.tsx` — AI response generation
- `client/src/components/overview/enrichment-suggestions.tsx` — accept/dismiss mutation callbacks

### Phase 4 — Global Controls + AI Assistant
**Language switch + VenueX AI messages**

Lower frequency but high intent signals. A visitor who sends a message to VenueX AI has strong engagement. Language switch tells you something about the visitor's market context.

Touch points:
- `client/src/components/layout/Header.tsx` — language DropdownMenuItem onClick
- `client/src/pages/venuex-ai.tsx` — message send handler

---

## Component Map: Tracking Touch Points

| File | What to Add | Event |
|------|------------|-------|
| `lib/analytics.ts` | New file | All events (Phase 1) |
| `layout/sidebar.tsx` | onClick on nav item | `sidebar_nav_clicked` |
| `layout/Header.tsx` | onClick on language items | `language_switched` |
| `pages/reviews.tsx` | handleTabChange | `tab_switched` |
| `pages/locations.tsx` | tab change handler | `tab_switched` |
| `pages/offline-conversions.tsx` | tab change handler | `tab_switched` |
| `pages/catalog.tsx` | tab change handler | `tab_switched` |
| `pages/locations.tsx` | add/import/bulk action handlers | `location_action` |
| `components/locations2/LocationDataTable.tsx` | row open handler | `location_action` |
| `components/locations2/LocationEditForm.tsx` | save handler | `location_action` |
| `components/reviews/ReviewDetail.tsx` | AI generate button | `review_ai_response_generated` |
| `components/overview/enrichment-suggestions.tsx` | implementMutation onSuccess | `enrichment_suggestion_action` |
| `pages/venuex-ai.tsx` | send message handler | `ai_assistant_message_sent` |

---

## Scalability Considerations

This instrumentation is intentionally thin. It answers the demo analytics question without becoming a product analytics platform.

| Concern | Now (demo) | If product grows |
|---------|-----------|-----------------|
| Event volume | Low — demo visitors only | Add sampling in PostHog, not in code |
| Property schema | Flat key/value | Still correct — no nested objects needed |
| New events | Add function to analytics.ts | Same pattern scales indefinitely |
| Server-side events | Not applicable (mock backend) | analytics.ts stays frontend-only; server gets separate instrumentation |

---

## Sources

- Codebase inspection: `client/src/main.tsx`, `client/src/components/shared/DemoGate.tsx`, `client/src/App.tsx`, `client/src/pages/reviews.tsx`, `client/src/pages/locations.tsx`, `client/src/components/layout/sidebar.tsx`, `client/src/components/layout/Header.tsx`
- Project requirements: `.planning/PROJECT.md`
- PostHog JS SDK: singleton import pattern confirmed working in DemoGate (see PROJECT.md Key Decisions)
- PostHog docs (training data, HIGH confidence): `posthog.capture(event, properties)` is the correct API; `usePostHog()` hook is for component-bound usage only; auto-pageview capture is on by default
