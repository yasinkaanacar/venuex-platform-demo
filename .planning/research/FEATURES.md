# Feature Landscape: PostHog Analytics for VenueX Demo

**Domain:** SaaS product demo engagement tracking
**Researched:** 2026-04-03
**Confidence:** HIGH (derived from direct codebase inspection + established SaaS analytics patterns)

---

## Context

PostHog is already initialized with EU cloud. `demo_gate_submitted` + `posthog.identify()` fire on gate submission. Auto-capture gives `$pageview` on every route change. Everything below is custom event instrumentation layered on top.

The goal is not vanity metrics — it's demo intelligence: which modules hold attention, which features land, where visitors drop off, and whether language/behavior patterns predict deal quality.

---

## Table Stakes

Features you must have or you miss the primary insight loop.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Centralized `analytics.ts` helper | Without it, event names drift — one file misspelled breaks a funnel. Single source of truth for typed event constants and the `capture()` wrapper. | Low | One file: typed event enum/const + thin wrapper around posthog.capture() with try/catch |
| `sidebar_nav_clicked` | The sidebar is the primary navigation mechanism. Every module visit that comes from sidebar click needs its own event — `$pageview` tells you the URL but not the intent signal of clicking. Include `{ to: string, from: string }`. | Low | Hook into sidebar Link onClick |
| `tab_switched` | Tabs are the primary engagement pattern within every module (Locations has 5+ tabs, Reviews has 3, Catalog 2, Offline Conversions 3+, Segments 2). Tab-level data tells you which module features actually get explored vs which modules visitors just land on and bounce. | Low | Uniform pattern: `{ module: string, tab: string }` on every tab onChange |
| `module_time_spent` | Time on module is the clearest demo engagement proxy. Combine with tab data to know if someone spent 3 minutes on Offline Conversions or 3 minutes staring at the first tab. | Medium | Needs an enter/exit timestamp per route — use useEffect + useLocation in a shared hook |
| `demo_gate_submitted` | Already exists. Non-negotiable baseline — identifies the visitor. | Done | — |
| Language switch tracking | `language_switched` with `{ from, to }`. Two-language demo (TR/EN) means language choice is a signal about visitor profile — Turkish vs international prospects behave differently. | Low | Header already has the setLanguage call — one line addition |

**Confidence: HIGH.** These mirror the minimum viable event set used in every SaaS PLG funnel. Missing any one of these leaves a blank spot in the demo visitor journey.

---

## Differentiators

Features that give competitive advantage in understanding demo visitors — not standard, but high signal.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Location module depth tracking | Locations is the anchor module (most tabs, most interactive). Track `location_row_opened` (DetailsDrawer), `location_edit_started`, `location_add_started`, `location_import_started`, `location_bulk_action_triggered`. Visitors who open location details are evaluating the product seriously. | Low-Med | Surgical per-component additions |
| Review AI interaction tracking | `review_ai_response_generated` with `{ rating: number, has_existing_reply: boolean }`. AI response generation is a WOW feature in demos — knowing which visitors triggered it tells you who got the hook. | Low | Single capture call in the generate handler |
| Enrichment suggestion actions | `enrichment_suggestion_acted` with `{ suggestion_type, impact_level, context: 'dashboard' | 'locations' }`. The enrichment suggestions are a key value-demo moment (platform shows you what's wrong and how to fix it). | Low | Wrap the existing implementMutation onSuccess |
| VenueX AI chat usage | `ai_chat_message_sent` with `{ session_id, is_first_message: boolean }` and `ai_example_question_clicked` with `{ question_index }`. The AI assistant is a differentiator feature — knowing who uses it vs who ignores it is a strong engagement signal. | Low | One capture per send + one per example click |
| Offline conversions filter engagement | `oc_filter_changed` with `{ filter_type: 'platform' | 'date_range' | 'campaign' | 'campaign_type', value }`. Visitors who change platform filters (Google/Meta/TikTok) are understanding the multi-platform value prop — that's a high-intent signal. | Low | Capture in the filter onChange handlers |
| Sidebar collapse/expand | `sidebar_toggled` with `{ new_state: 'collapsed' | 'expanded' }`. Minor but useful — if visitors collapse it immediately, maybe the layout is confusing them early in the demo. | Low | One line in onToggle |
| Module first-visit vs return | Property `is_first_visit_to_module: boolean` on every `sidebar_nav_clicked` and `$pageview`. Distinguishes linear explorers (go through every module once) from focused evaluators (return to specific modules). Computed from session state. | Medium | Requires session-level visited-modules tracking in a hook or context |
| Segment / Platform Push tab usage | `tab_switched` covers this generically, but Segments is a newer module with two distinct halves (Audiences vs Platform Push). Tag the module name clearly in the generic tab event. | Low | Covered by uniform tab_switched if module is included |

**Confidence: HIGH.** These are derived from the actual interactive surfaces in the codebase, not generic speculation.

---

## Anti-Features

Things to deliberately not track.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Scroll depth tracking | No meaningful scroll-depth signal in a sidebar-nav app with card-based layouts. Most content is above the fold or within drawers. Would add noise, not insight. | Rely on tab_switched + time_spent as engagement proxies |
| Click heatmaps via PostHog toolbar | PostHog's autocapture can capture a lot of DOM clicks. Don't instrument every button — only actions with clear semantic meaning. Spray-and-pray event capture produces unqueryable noise. | Track only actions that map to product intent |
| Form field interaction tracking | The demo has no real forms that matter (DemoGate is already tracked, location edit form is mock). Tracking every field focus adds event volume with near-zero analytical value. | Track form submission/completion only, not individual field touches |
| Error/exception tracking | PostHog is not the right tool for errors — that's Sentry or console.error. Don't emit custom events for API errors in the mock layer. | Use console.error in dev, PostHog captures should reflect user intent only |
| Tracking Settings and Team/Profile pages | These are account-management screens with nothing demo-relevant to measure. Visits are either accidental navigation or low-intent. They add noise to module engagement data. | Let $pageview handle them passively; no custom events |
| User property updates post-identification | Don't call posthog.identify() again or posthog.people.set() on every page view. The initial identify in DemoGate is the right moment. Re-identifying mid-session can corrupt person merging. | Set all relevant person properties once in DemoGate |
| Revenue/conversion events | No transactions in the demo. Emitting fake purchase events to test funnels would corrupt any real PostHog project data. | Keep revenue tracking out of scope (confirmed in PROJECT.md) |

---

## Feature Dependencies

```
analytics.ts helper
  → sidebar_nav_clicked         (imports typed event names from helper)
  → tab_switched                (imports typed event names from helper)
  → module_time_spent           (imports capture wrapper from helper)
  → all module-specific events  (imports capture wrapper from helper)

demo_gate_submitted (existing)
  → posthog.identify() already called
  → all subsequent events are attributed to identified user automatically

module_time_spent hook
  → depends on: useLocation (Wouter)
  → must be built before per-module time analysis is possible
  → feeds: module_first_visit_vs_return property computation

tab_switched (uniform pattern)
  → must define module naming convention first (in analytics.ts)
  → feeds: per-module tab engagement queries in PostHog
```

---

## MVP Recommendation

Build in this order:

1. **`analytics.ts` helper** — typed event constants + capture wrapper. Everything else imports this. Zero user-visible change.

2. **`sidebar_nav_clicked` + `tab_switched`** — two events that cover 80% of the navigation surface with minimal code. Both are low-complexity, high-signal.

3. **`language_switched`** — one line in Header.tsx. Immediately tells you TR vs EN visitor split.

4. **Location module depth events** — `location_row_opened`, `location_edit_started`, `location_import_started`. Locations is the most interactive module and likely where most serious evaluation happens.

5. **Review AI + Enrichment suggestion actions** — the WOW-feature moments. Knowing who triggered AI response gen or clicked Apply on an enrichment suggestion is the clearest "aha moment" signal.

6. **VenueX AI chat events** — `ai_chat_message_sent`, `ai_example_question_clicked`. The AI module is a differentiator; knowing who engages with it is deal-signal.

7. **`module_time_spent`** — defer until the above events are in place. Time-spent adds depth to the event stream but has the most implementation complexity (shared hook, enter/exit tracking).

**Defer:**
- Offline conversions filter tracking — medium value, low urgency. Add in a follow-up pass after core navigation events are proven out.
- `sidebar_toggled` — nice-to-have, not actionable enough to prioritize.

---

## Event Schema Reference

All events should follow this shape when captured:

```typescript
// Minimum properties on every custom event
{
  module: string;         // 'locations' | 'reviews' | 'catalog' | 'offline_conversions' | 'segments' | 'venuex_ai' | 'overview'
  language: 'en' | 'tr'; // current language at time of event
}

// sidebar_nav_clicked
{ to: string; from: string; module: string; language: string; }

// tab_switched
{ module: string; tab: string; previous_tab: string; language: string; }

// location_row_opened
{ location_id: string; store_code: string; module: string; language: string; }

// review_ai_response_generated
{ rating: number; has_existing_reply: boolean; module: string; language: string; }

// enrichment_suggestion_acted
{ suggestion_type: string; impact_level: 'high' | 'medium' | 'low'; context: 'dashboard' | 'locations'; module: string; language: string; }

// ai_chat_message_sent
{ is_first_message: boolean; session_id: string; module: string; language: string; }

// language_switched
{ from: 'en' | 'tr'; to: 'en' | 'tr'; current_module: string; }
```

Including `language` on every event allows segmenting all engagement metrics by visitor language profile without needing to join against person properties.

---

## Sources

- Direct codebase inspection: `client/src/main.tsx`, `client/src/components/shared/DemoGate.tsx`, `client/src/components/layout/sidebar.tsx`, `client/src/components/layout/Header.tsx`
- Page-level tab pattern analysis: `locations.tsx`, `reviews.tsx`, `catalog.tsx`, `offline-conversions.tsx`, `segments.tsx`, `venuex-ai.tsx`
- Component interaction surfaces: `LocationsTable.tsx`, `ReviewDetail.tsx`, `enrichment-suggestions.tsx`
- Project requirements: `.planning/PROJECT.md`
- PostHog initialization: `client/src/main.tsx` (EU cloud, phc_4zYX... key, PostHogProvider confirmed)
- Confidence basis: All findings grounded in actual code — no speculative capabilities assumed
