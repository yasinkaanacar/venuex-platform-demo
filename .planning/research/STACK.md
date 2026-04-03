# Technology Stack: PostHog Analytics Instrumentation

**Project:** VenueX Platform Demo — PostHog Event Tracking
**Researched:** 2026-04-03
**Scope:** Structuring analytics code in an existing React 18 + TypeScript app where posthog-js is already installed and initialized.

---

## Installed Package

| Package | Installed Version | Source |
|---------|------------------|--------|
| `posthog-js` | `1.364.6` | `package.json` (installed, confirmed) |
| `posthog-js/react` | bundled with above | React sub-package included in posthog-js |
| `@posthog/types` | bundled with above | Type definitions included |

**Confidence: HIGH** — Verified from `node_modules/posthog-js/package.json` and `react/dist/types/index.d.ts`.

No additional packages are needed. `posthog-js` ships its React hooks as a sub-path export (`posthog-js/react`), which is already how `main.tsx` imports `PostHogProvider`. Zero new dependencies required for this instrumentation project.

---

## Core Pattern: Direct Singleton Import

The app already uses the correct pattern and it should be followed throughout:

```typescript
import posthog from "posthog-js";
posthog.capture("event_name", { property: "value" });
```

**Why this, not `usePostHog()`:** The `usePostHog()` hook is the right tool when you need the PostHog instance inside a React component's render tree. But for a centralized `analytics.ts` helper file — which is a plain TypeScript module, not a component — the singleton import is required. This is exactly what `DemoGate.tsx` already does and why the PROJECT.md notes that `window.posthog` was unreliable. The npm-initialized singleton (`posthog-js` default export) is always the correct reference.

**Confidence: HIGH** — Verified from `node_modules/posthog-js/react/dist/esm/index.js` source and confirmed by the existing working pattern in `DemoGate.tsx`.

---

## Recommended Stack

### The Three-Layer Structure

```
client/src/lib/analytics.ts        ← Layer 1: event catalog + capture wrapper
Component files (*.tsx)            ← Layer 2: call analytics.track*() functions
client/src/main.tsx                ← Layer 3: PostHog init (already done)
```

### Layer 1: `analytics.ts` — Single Source of Truth

**What it is:** One file in `client/src/lib/` that exports:
1. A TypeScript union type enumerating all event names (prevents typos, enables `Ctrl+F`)
2. Typed property interfaces for each event
3. Thin wrapper functions (one per event category) that call `posthog.capture()`
4. Silent-failure guard (try/catch) so PostHog unavailability never breaks the app

**Why a wrapper file, not raw `posthog.capture()` in components:**
- Event names are strings. Without a central catalog, the same event gets spelled three different ways across the codebase within a week.
- TypeScript types on properties mean you can't fire `sidebar_nav_clicked` without supplying the required `module` property.
- Changing an event name or adding a property means editing one place, not hunting across 30 components.
- Silent-failure logic lives in one place, not repeated in every `onClick`.

**Confidence: HIGH** — This pattern is the standard community approach for PostHog in TypeScript apps. The PROJECT.md explicitly lists `analytics.ts` as the planned approach. The installed `@posthog/types` package exports `Properties` (`Record<string, any>`) which is what `posthog.capture()` accepts as the second argument.

### Layer 2: `usePostHog()` Hook — For React-Specific Cases Only

The `posthog-js/react` sub-package exports `usePostHog()`:

```typescript
// From node_modules/posthog-js/react/dist/types/index.d.ts
declare const usePostHog: () => PostHog;
```

**When to use it:** Only when you need the PostHog instance inside a component for something the `analytics.ts` wrapper does not cover (e.g., calling `posthog.identify()` in a component directly, not in a plain TS file). For standard event capture, call the `analytics.ts` functions instead — they use the singleton and don't require a component context.

**What NOT to do:** Do not call `posthog.capture()` directly in component event handlers. Route everything through `analytics.ts`.

**Confidence: HIGH** — Verified from the actual type definition file in `node_modules`.

### Layer 3: PostHog Initialization (Already Done — Do Not Change)

```typescript
// client/src/main.tsx — existing, correct, do not touch
posthog.init("phc_...", {
  api_host: "https://eu.i.posthog.com",
  defaults: "2025-01-01",
});
```

The `defaults: "2025-01-01"` config key opts into PostHog's 2025 SDK behavior defaults. This is the correct modern init pattern. The `PostHogProvider` wrapping the app correctly propagates the same initialized client instance into React context.

**Confidence: HIGH** — Confirmed from `main.tsx` source read.

---

## Capture Method Signature

From `@posthog/types` (installed):

```typescript
capture(
  event_name: string,
  properties?: Properties | null,  // Properties = Record<string, any>
  options?: CaptureOptions
): CaptureResult | undefined;
```

The return type is `CaptureResult | undefined` — `undefined` is returned when PostHog is not loaded or capture is suppressed. This is the native silent-failure shape; the `analytics.ts` wrapper should additionally wrap in `try/catch` per the project's "silent failures" constraint.

---

## What NOT to Use

| Option | Why Not |
|--------|---------|
| `window.posthog` | Unreliable with npm package init — documented in PROJECT.md Key Decisions |
| `usePostHog()` in `analytics.ts` | `analytics.ts` is a plain TS module, not a React component. Hooks cannot be called outside the React tree. |
| Separate analytics npm packages (e.g., `@analytics/posthog`, `analytics`) | Unnecessary abstraction layer. PostHog's own SDK is comprehensive and already installed. |
| Multiple `posthog.init()` calls | Only one init per app. The existing `main.tsx` init is canonical — never re-init in components. |
| Raw `posthog.capture()` scattered in components | Bypasses the typed event catalog. Breaks the single-source-of-truth goal of `analytics.ts`. |

---

## TypeScript Event Typing Pattern

The standard approach for typed PostHog events in TypeScript (no additional libraries needed):

```typescript
// client/src/lib/analytics.ts

import posthog from "posthog-js";

// 1. Event name union — all valid event names in one place
type AnalyticsEvent =
  | "sidebar_nav_clicked"
  | "tab_switched"
  | "location_action"
  | "review_action"
  | "filter_changed"
  | "language_switched"
  | "ai_assistant_used"
  | "enrichment_action";

// 2. Property shapes per event (extend as needed)
interface SidebarNavProps { module: string; }
interface TabSwitchedProps { module: string; tab: string; previous_tab?: string; }

// 3. Safe capture wrapper
function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  try {
    posthog.capture(event, properties ?? null);
  } catch {
    // PostHog unavailable — never throw to caller
  }
}

// 4. Exported helpers — one per event group
export const analytics = {
  sidebarNavClicked: (props: SidebarNavProps) =>
    track("sidebar_nav_clicked", props),
  tabSwitched: (props: TabSwitchedProps) =>
    track("tab_switched", props),
  // ...
};
```

This gives TypeScript autocomplete on event names, compile-time errors on missing properties, and a single grep target for every event.

**Confidence: HIGH** — Pattern derived directly from the installed `posthog-js` types and the project constraints in CLAUDE.md and PROJECT.md.

---

## Sources

| Source | Confidence | What It Confirmed |
|--------|-----------|-------------------|
| `node_modules/posthog-js/package.json` | HIGH | Version 1.364.6 is installed |
| `node_modules/posthog-js/react/dist/types/index.d.ts` | HIGH | `usePostHog()` signature, exported hooks list |
| `node_modules/@posthog/types/dist/posthog.d.ts` | HIGH | `capture()` method signature |
| `node_modules/posthog-js/react/dist/esm/index.js` | HIGH | PostHogProvider and context implementation |
| `client/src/main.tsx` (project file) | HIGH | Existing init pattern, EU cloud host |
| `client/src/components/shared/DemoGate.tsx` (project file) | HIGH | Working singleton import pattern |
| `.planning/PROJECT.md` | HIGH | Project requirements, constraints, existing decisions |
| `https://raw.githubusercontent.com/PostHog/posthog-js/main/packages/react/README.md` | MEDIUM | Confirmed `usePostHog` hook description and capture pattern |
