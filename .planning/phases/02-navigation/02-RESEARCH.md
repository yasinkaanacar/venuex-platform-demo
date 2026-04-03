# Phase 2: Navigation - Research

**Researched:** 2026-04-03
**Domain:** PostHog analytics instrumentation — sidebar navigation + tab switching
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** ALL analytics event name values must be prefixed with `demo_` — e.g., `'demo_sidebar_nav_clicked'`, `'demo_tab_switched'`. This applies to every event in ANALYTICS_EVENTS, including Phase 1 events and all future phases.
- **D-02:** Every capture call must include `source: 'demo'` as an additional property alongside the event-specific props. Both prefix AND property for maximum clarity in PostHog filtering.
- **D-03:** The namespacing update to analytics.ts is the first task of Phase 2 — update all existing ANALYTICS_EVENTS values and modify capture wrapper functions to inject `source: 'demo'`.
- **D-04:** Add inline `onClick` handlers directly on the existing `<Link>` elements in `sidebar.tsx` — call `trackSidebarNav()` with `to`, `from`, and `module` properties. No new wrapper component.
- **D-05:** Track ALL sidebar items — not just the 5 required modules. Settings, Team, VenueX AI, and Dashboard clicks are all captured.
- **D-06:** Module strings use kebab-case route segments: `'overview'`, `'locations'`, `'reviews'`, `'catalog'`, `'offline-conversions'`, `'segments'`, `'venuex-ai'`, `'settings'`, `'team'`. Matches URL paths for easy PostHog filtering.
- **D-07:** Tab names use kebab-case descriptive strings regardless of internal implementation (numeric index, string ID, etc.). Examples: `'overview'`, `'store-profiles'`, `'reviews-inbox'`, `'sentiment-analysis'`.

### Claude's Discretion

- Exact tab name strings for each module's tabs (Claude reads each page component to determine appropriate kebab-case names)
- How to derive `from` path in sidebar tracking (current `location` from Wouter vs. stored previous route)
- Whether to extract module name from href path programmatically or use a lookup map

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAV-01 | Sidebar navigation clicks fire `sidebar_nav_clicked` event with destination and source page | Sidebar instrumentation pattern — onClick on each `<Link>` using `trackSidebarNav()` |
| NAV-02 | Tab switches in Locations module fire `tab_switched` with module and tab_name | Locations uses `mainTab` string state (`'locations'` / `'performance'` / `'posts'`) + separate `activeTab` numeric state for inner chart tabs — only `mainTab` needs tracking |
| NAV-03 | Tab switches in Reviews module fire `tab_switched` with module and tab_name | Reviews uses `handleTabChange()` handler for `ActiveTab` string state — inject tracking there |
| NAV-04 | Tab switches in Catalog module fire `tab_switched` with module and tab_name | Catalog uses `activeTab` string state with `TabId` type (`'dashboard'` / `'activity'`) |
| NAV-05 | Tab switches in Offline Conversions module fire `tab_switched` with module and tab_name | Offline Conversions uses `mainTab` with `TabKey` type (`'ozet'` / `'performans'` / `'kampanyalar'` / `'veri_baglantisi'`) — internal keys need mapping to kebab-case names |
| NAV-06 | Tab switches in Segments module fire `tab_switched` with module and tab_name | Segments uses `mainTab` with `Tab` type (`'audiences'` / `'platform_push'`) — already kebab-friendly |

</phase_requirements>

---

## Summary

Phase 2 instruments two navigation surfaces: sidebar clicks and tab switches across five modules. The foundation (analytics.ts with `trackSidebarNav` and `trackTabSwitch`) already exists from Phase 1. The work is threefold: (1) update analytics.ts to apply the `demo_` prefix convention and inject `source: 'demo'` into all capture calls, (2) add onClick tracking to sidebar Links, and (3) inject `trackTabSwitch()` calls into each tabbed module's existing tab handler.

The sidebar has two rendering paths (expanded and collapsed), and the VenueX AI item has a unique layout with an expand/collapse toggle — both paths need the tracking onClick. All five tabbed modules have already-identified state patterns and handler locations. The only non-trivial decision is the module-name extraction strategy for the sidebar and the tab-name normalization for Offline Conversions (which uses Turkish-language internal keys).

**Primary recommendation:** Inject tracking at handler level — not at the render level — to avoid tracking noise from re-renders. For sidebar, use a lookup map from `href` → `module` string derived from PATHS constants. For Offline Conversions, map internal Turkish keys to English kebab-case names in the tracking call.

---

## Standard Stack

### Core (already installed — no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| posthog-js | 1.364.6 | PostHog capture | Already initialized in main.tsx |
| wouter | 3.3.5 | `useLocation()` for `from` path | Already used in sidebar.tsx |
| TypeScript | 5.6.3 | Type safety for event props | Project standard |

**Installation:** None required. All libraries are already present.

---

## Architecture Patterns

### Pattern 1: analytics.ts Namespacing Update

**What:** Prefix all ANALYTICS_EVENTS values with `demo_` and inject `source: 'demo'` into every capture wrapper.

**When to use:** First task — all subsequent tracking depends on this being correct.

**Current state (analytics.ts lines 16-29):**
```typescript
export const ANALYTICS_EVENTS = {
  SIDEBAR_NAV_CLICKED: 'sidebar_nav_clicked',   // needs → 'demo_sidebar_nav_clicked'
  TAB_SWITCHED: 'tab_switched',                  // needs → 'demo_tab_switched'
  LOCATION_VIEWED: 'location_viewed',            // needs → 'demo_location_viewed'
  LOCATION_ACTION: 'location_action',            // needs → 'demo_location_action'
  FILTER_CHANGED: 'filter_changed',              // needs → 'demo_filter_changed'
  AI_CHAT_MESSAGE_SENT: 'ai_chat_message_sent',  // needs → 'demo_ai_chat_message_sent'
  AI_EXAMPLE_QUESTION_CLICKED: 'ai_example_question_clicked', // needs → 'demo_ai_example_question_clicked'
} as const;
```

**Target pattern for each wrapper (example):**
```typescript
export const trackSidebarNav = (props: SidebarNavClickedProps) => {
  try {
    posthog.capture(ANALYTICS_EVENTS.SIDEBAR_NAV_CLICKED, { ...props, source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};
```

The `source: 'demo'` is spread into props at the capture call site inside analytics.ts — callers do NOT pass it. TypeScript interfaces (`SidebarNavClickedProps`, `TabSwitchedProps`, etc.) stay unchanged.

### Pattern 2: Sidebar onClick Instrumentation

**What:** Add onClick to each `<Link>` in sidebar.tsx that calls `trackSidebarNav({ to, from, module })`.

**Key facts about sidebar.tsx:**
- `useLocation()` from Wouter already imported and destructured as `[location]` — this is the `from` value
- `navItems` array has items with `type: 'item'` and `href` property — use href for module derivation
- Three render paths exist for nav items:
  1. **Standard items** (lines 187-204): `<Link href={item.href}>` wrapping a `<div>`
  2. **VenueX AI expanded** (lines 132-183): `<Link href={item.href} className="flex-1">` inside a flex row — the Link is the only navigating element
  3. **Collapsed footer** (lines 220-241): Separate `<Link>` elements for Settings and Team/Profile icons

**Module name derivation — use a lookup map (recommended over programmatic extraction):**
```typescript
const MODULE_NAMES: Record<string, string> = {
  [PATHS.HOME]: 'overview',
  [PATHS.LOCATIONS]: 'locations',
  [PATHS.REVIEWS]: 'reviews',
  [PATHS.CATALOG]: 'catalog',
  [PATHS.OFFLINE_CONVERSIONS]: 'offline-conversions',
  [PATHS.SEGMENTS]: 'segments',
  [PATHS.VENUEX_AI]: 'venuex-ai',
  [PATHS.SETTINGS]: 'settings',
  [PATHS.PROFILE]: 'team',
};
```

**`from` value:** Use `location` (from `useLocation()` already in scope). This is the current route at click time — exactly what we want.

**Inline onClick pattern for standard items:**
```typescript
<Link
  href={item.href}
  onClick={() => trackSidebarNav({
    to: item.href,
    from: location,
    module: MODULE_NAMES[item.href] ?? item.href,
  })}
>
```

**Footer Links in collapsed mode:** Both Settings and Profile (Team) `<Link>` elements in the collapsed footer strip (lines 220-241 and expanded footer lines 254-276) also need onClick — these are outside the navItems map loop.

### Pattern 3: Tab Switch Tracking — Per Module

**What:** Call `trackTabSwitch({ module, tab_name })` when tab state changes.

**Injection points by module:**

#### Reviews (`client/src/pages/reviews.tsx`)
- State: `const [activeTab, setActiveTab] = useState<ActiveTab>('overview')` where `ActiveTab = 'overview' | 'inbox' | 'locations'`
- Handler: `handleTabChange(tab: ActiveTab)` at line 136 — already exists, centralized
- Tab names are already English kebab-friendly strings
- **Inject:** Call `trackTabSwitch({ module: 'reviews', tab_name: tab })` inside `handleTabChange` before/after `setActiveTab`

**Confirmed tab names for Reviews:**
| Tab internal value | tab_name to fire |
|--------------------|-----------------|
| `'overview'` | `'overview'` |
| `'inbox'` | `'inbox'` |
| `'locations'` | `'locations'` |

#### Catalog (`client/src/pages/catalog.tsx`)
- State: `const [activeTab, setActiveTab] = useState<TabId>('dashboard')` where `TabId = 'dashboard' | 'activity'`
- No dedicated handler — `setActiveTab(tab.id)` called inline in button `onClick`
- **Inject:** Wrap inline setter: `onClick={() => { setActiveTab(tab.id); trackTabSwitch({ module: 'catalog', tab_name: tab.id }); }}`

**Confirmed tab names for Catalog:**
| Tab internal value | tab_name to fire |
|--------------------|-----------------|
| `'dashboard'` | `'dashboard'` |
| `'activity'` | `'activity'` |

#### Offline Conversions (`client/src/pages/offline-conversions.tsx`)
- State: `const [mainTab, setMainTab] = useState<TabKey>('ozet')` where `TabKey = 'ozet' | 'performans' | 'kampanyalar' | 'veri_baglantisi'`
- No dedicated handler — `setMainTab(tab.key)` called inline at line 288
- Internal keys are Turkish — must normalize to English kebab-case for PostHog
- **Inject with normalization map:**

```typescript
const OC_TAB_NAMES: Record<TabKey, string> = {
  ozet: 'summary',
  performans: 'performance',
  kampanyalar: 'campaigns',
  veri_baglantisi: 'data-connection',
};
// In onClick:
onClick={() => {
  setMainTab(tab.key);
  trackTabSwitch({ module: 'offline-conversions', tab_name: OC_TAB_NAMES[tab.key] });
}}
```

Note: `onNavigateToTab` callback at line 618 also calls `setMainTab` — add tracking there too.

**Confirmed tab names for Offline Conversions:**
| Tab internal key | tab_name to fire |
|-----------------|-----------------|
| `'ozet'` | `'summary'` |
| `'performans'` | `'performance'` |
| `'kampanyalar'` | `'campaigns'` |
| `'veri_baglantisi'` | `'data-connection'` |

#### Segments (`client/src/pages/segments.tsx`)
- State: `const [mainTab, setMainTab] = useState<Tab>("audiences")` where `Tab = "audiences" | "platform_push"`
- No dedicated handler — `setMainTab("audiences")` and `setMainTab("platform_push")` called inline in separate buttons
- **Inject:** Wrap each setter: `onClick={() => { setMainTab("audiences"); trackTabSwitch({ module: 'segments', tab_name: 'audiences' }); }}`

**Confirmed tab names for Segments:**
| Tab internal value | tab_name to fire |
|--------------------|-----------------|
| `'audiences'` | `'audiences'` |
| `'platform_push'` | `'platform-push'` |

Note: internal state uses underscore (`'platform_push'`) but D-07 requires kebab-case for PostHog → fire `'platform-push'`.

#### Locations (`client/src/pages/locations.tsx`)
- Two independent tab states:
  - `mainTab`: `useState<'locations' | 'performance' | 'posts' | 'insights'>('locations')` — the primary navigation tabs
  - `activeTab`: `useState(0)` — numeric index for chart sub-tabs within a section
- Only `mainTab` is a navigation surface per NAV-02. `activeTab` (numeric, chart-related) is out of scope for this phase.
- Three rendered main tabs: `'locations'`, `'performance'`, `'posts'` (the `'insights'` value exists in the type but there is no rendered Insights button in the tab bar — only 3 buttons at lines 427-448)
- No dedicated handler — three separate inline `setMainTab()` calls in three separate buttons
- **Inject:** Three separate inline handlers:

```typescript
onClick={() => { setMainTab('locations'); trackTabSwitch({ module: 'locations', tab_name: 'store-profiles' }); }}
onClick={() => { setMainTab('performance'); trackTabSwitch({ module: 'locations', tab_name: 'performance' }); }}
onClick={() => { setMainTab('posts'); trackTabSwitch({ module: 'locations', tab_name: 'posts' }); }}
```

**Confirmed tab names for Locations:**
| Tab internal value | tab_name to fire | Rationale |
|--------------------|-----------------|-----------|
| `'locations'` | `'store-profiles'` | D-07 requires descriptive names; "locations" is ambiguous at module level |
| `'performance'` | `'performance'` | Direct mapping |
| `'posts'` | `'posts'` | Direct mapping |

### Anti-Patterns to Avoid

- **Tracking on render, not interaction:** `useEffect` watching tab state for tracking — fires on initial mount, not user action. Always track in click handlers.
- **Passing `source: 'demo'` from call sites:** The `source` property is injected inside analytics.ts wrappers, not by callers. Callers use typed interfaces which do not include `source`.
- **Tracking the `activeTab` numeric state in Locations:** This is an inner chart-sub-tab, not a navigation surface. Out of scope.
- **Double-tracking in Offline Conversions:** The `onNavigateToTab` callback calls `setMainTab` programmatically — if tracking is added to the inline handler but not the callback, programmatic navigation goes untracked. Add tracking to both paths.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| `from` path tracking | Custom history stack / route interceptor | `useLocation()` from Wouter (already imported) | Wouter's `useLocation()` returns current route — exactly the `from` value needed before navigation occurs |
| Silent failure on tracking | Try-wrap at every call site | Existing try/catch in analytics.ts wrappers | Already implemented in Phase 1 — do not duplicate |
| Module name derivation | Parse href string with regex/split | Static lookup map `MODULE_NAMES` keyed by PATHS constants | Type-safe, refactor-proof, zero runtime overhead |

---

## Common Pitfalls

### Pitfall 1: Sidebar Has Multiple Link Instances Per Item

**What goes wrong:** The collapsed sidebar footer duplicates Settings and Profile links outside the `navItems` map. Tracking only the navItems loop misses these.

**Why it happens:** The sidebar renders two entirely different DOM trees for collapsed vs expanded state. The footer strip is not part of the `navItems` map.

**How to avoid:** Add onClick to ALL four `<Link>` elements: (1) standard items loop, (2) VenueX AI link, (3) collapsed footer Settings Link, (4) expanded footer Settings Link. Settings appears in both the navItems loop AND the footer — the footer links must be tracked separately.

**Warning signs:** PostHog shows `sidebar_nav_clicked` for `/settings` only sometimes — means one of the two Settings Links is missing tracking.

### Pitfall 2: Offline Conversions `onNavigateToTab` Callback

**What goes wrong:** `TopCampaignsQuickList` calls `onNavigateToTab={(tab) => setMainTab(tab as TabKey)}` at line 618 — programmatic tab change with no tracking.

**Why it happens:** It bypasses the inline onClick handlers where tracking was added.

**How to avoid:** Extract a `handleMainTabChange` function that both sets state and fires tracking — use it in both the inline onClick and the `onNavigateToTab` callback.

### Pitfall 3: `source: 'demo'` Leaking Into TypeScript Interfaces

**What goes wrong:** Adding `source?: string` to `SidebarNavClickedProps` or `TabSwitchedProps` — call sites start passing it explicitly, creating double-injection.

**Why it happens:** Developers see the PostHog event and want to be "safe" by passing source from call site too.

**How to avoid:** Keep `source: 'demo'` purely inside analytics.ts wrapper functions, injected at `posthog.capture()` time. TypeScript interfaces must NOT include `source`.

### Pitfall 4: Tab Name Inconsistency — `'platform_push'` vs `'platform-push'`

**What goes wrong:** Firing `tab_name: 'platform_push'` (with underscore, matching internal state) instead of `'platform-push'` (kebab-case per D-07).

**Why it happens:** Copy-pasting the internal state value without applying the kebab-case rule.

**How to avoid:** D-07 is explicit — all tab names use kebab-case. Apply string replacement or use explicit string literals in tracking calls, never the raw state value when it contains underscores.

---

## Code Examples

### analytics.ts — Updated ANALYTICS_EVENTS and wrapper (after D-01/D-02/D-03)

```typescript
export const ANALYTICS_EVENTS = {
  SIDEBAR_NAV_CLICKED: 'demo_sidebar_nav_clicked',
  TAB_SWITCHED: 'demo_tab_switched',
  LOCATION_VIEWED: 'demo_location_viewed',
  LOCATION_ACTION: 'demo_location_action',
  FILTER_CHANGED: 'demo_filter_changed',
  AI_CHAT_MESSAGE_SENT: 'demo_ai_chat_message_sent',
  AI_EXAMPLE_QUESTION_CLICKED: 'demo_ai_example_question_clicked',
} as const;

// Wrapper — source injected here, NOT at call sites
export const trackSidebarNav = (props: SidebarNavClickedProps) => {
  try {
    posthog.capture(ANALYTICS_EVENTS.SIDEBAR_NAV_CLICKED, { ...props, source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};

export const trackTabSwitch = (props: TabSwitchedProps) => {
  try {
    posthog.capture(ANALYTICS_EVENTS.TAB_SWITCHED, { ...props, source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};
```

### sidebar.tsx — MODULE_NAMES lookup map + onClick pattern

```typescript
import { trackSidebarNav } from '@/lib/analytics';
import { PATHS } from '@/routes/paths';

const MODULE_NAMES: Record<string, string> = {
  [PATHS.HOME]: 'overview',
  [PATHS.LOCATIONS]: 'locations',
  [PATHS.REVIEWS]: 'reviews',
  [PATHS.CATALOG]: 'catalog',
  [PATHS.OFFLINE_CONVERSIONS]: 'offline-conversions',
  [PATHS.SEGMENTS]: 'segments',
  [PATHS.VENUEX_AI]: 'venuex-ai',
  [PATHS.SETTINGS]: 'settings',
  [PATHS.PROFILE]: 'team',
};

// Standard nav item Link — onClick added
<Link
  href={item.href}
  onClick={() => trackSidebarNav({ to: item.href, from: location, module: MODULE_NAMES[item.href] ?? item.href })}
>
```

### offline-conversions.tsx — Extracted handler to cover both onClick and callback

```typescript
const OC_TAB_NAMES: Record<TabKey, string> = {
  ozet: 'summary',
  performans: 'performance',
  kampanyalar: 'campaigns',
  veri_baglantisi: 'data-connection',
};

const handleMainTabChange = (tab: TabKey) => {
  setMainTab(tab);
  trackTabSwitch({ module: 'offline-conversions', tab_name: OC_TAB_NAMES[tab] });
};

// In tab buttons:
onClick={() => handleMainTabChange(tab.key)}

// In TopCampaignsQuickList:
onNavigateToTab={(tab) => handleMainTabChange(tab as TabKey)}
```

### reviews.tsx — Tracking injected into existing handleTabChange

```typescript
import { trackTabSwitch } from '@/lib/analytics';

const handleTabChange = (tab: ActiveTab) => {
  setActiveTab(tab);
  trackTabSwitch({ module: 'reviews', tab_name: tab });
  if (tab === 'inbox') {
    setTimeout(() => {
      filterBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }
};
```

---

## Environment Availability

Step 2.6: SKIPPED — no external dependencies. This phase is code/config changes only. PostHog SDK already initialized.

---

## Open Questions

1. **Logo Link in sidebar header (lines 71-88)**
   - What we know: The logo wraps a `<Link href={PATHS.HOME}>` — a click here navigates to Overview
   - What's unclear: D-05 says "track ALL sidebar items" — does the logo link count?
   - Recommendation: Track it. Module `'overview'`, `to: PATHS.HOME`. Consistent with D-05 intent (complete funnel data). Planner can include or exclude as a discrete step.

2. **`insights` tab in Locations**
   - What we know: The `mainTab` type includes `'insights'` but no Insights button is rendered in the current tab bar (only 3 buttons: locations, performance, posts)
   - What's unclear: Is this a future/hidden tab or dead code?
   - Recommendation: Do not track it. No UI trigger exists. If it appears in future, tracking can be added then.

---

## Sources

### Primary (HIGH confidence)

- Direct code reading of `client/src/lib/analytics.ts` — confirmed current event names, wrapper structure, and Phase 1 implementation
- Direct code reading of `client/src/components/layout/sidebar.tsx` — confirmed Link structure, useLocation usage, navItems pattern, collapsed/expanded render paths
- Direct code reading of `client/src/pages/reviews.tsx` — confirmed `handleTabChange` handler and `ActiveTab` type
- Direct code reading of `client/src/pages/catalog.tsx` — confirmed `TabId` type and inline setter pattern
- Direct code reading of `client/src/pages/offline-conversions.tsx` — confirmed `TabKey` type, Turkish internal keys, and `onNavigateToTab` callback
- Direct code reading of `client/src/pages/segments.tsx` — confirmed `Tab` type and inline setter pattern
- Direct code reading of `client/src/pages/locations.tsx` — confirmed dual tab state (`mainTab` + `activeTab`), 3 rendered tabs, no insights button
- Direct code reading of `client/src/routes/paths.ts` — confirmed PATHS constants for MODULE_NAMES map
- `02-CONTEXT.md` — all locked decisions (D-01 through D-07) and canonical references

---

## Metadata

**Confidence breakdown:**
- analytics.ts update: HIGH — file read directly, all values confirmed
- Sidebar instrumentation: HIGH — render paths fully audited, all Link locations confirmed
- Tab tracking (Reviews, Catalog, Segments): HIGH — state patterns and handler locations confirmed
- Tab tracking (Offline Conversions): HIGH — Turkish keys confirmed, normalization map specified
- Tab tracking (Locations): HIGH — dual state confirmed, 3 active tabs confirmed, insights dead code identified

**Research date:** 2026-04-03
**Valid until:** Until any tabbed module page or sidebar.tsx is structurally refactored (stable otherwise)
