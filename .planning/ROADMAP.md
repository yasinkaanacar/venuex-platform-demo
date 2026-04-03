# Roadmap: PostHog Analytics Instrumentation

## Overview

Four phases that build on each other strictly: a typed analytics helper first (everything imports from it), navigation tracking second (sidebar + all tabs), feature-depth events third (location actions), and global controls last (filters + AI chat). Each phase produces complete, usable PostHog data before the next begins. No phase can be reordered without breaking downstream data quality.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - analytics.ts helper + validated pageview strategy
- [ ] **Phase 2: Navigation** - sidebar nav + tab tracking across all five modules
- [ ] **Phase 3: Feature Depth** - location action events (view, add, edit, import)
- [ ] **Phase 4: Global & AI** - filter change events + VenueX AI chat tracking

## Phase Details

### Phase 1: Foundation
**Goal**: A typed analytics helper exists and pageview tracking is confirmed working with Wouter
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. `client/src/lib/analytics.ts` exists with all planned ANALYTICS_EVENTS constants and typed capture wrappers for every event in Phases 2-4
  2. Opening PostHog Activity feed and navigating between modules shows `$pageview` firing exactly once per route change (not zero, not twice)
  3. Deliberately throwing an error inside a capture wrapper does not break the page — the app continues normally
  4. Running `grep -r "posthog.capture" client/src` returns only DemoGate.tsx — no other component calls posthog directly
**Plans:** 1 plan

Plans:
- [ ] 01-01-PLAN.md — Create analytics.ts helper with typed events + validate pageview strategy

### Phase 2: Navigation
**Goal**: Every sidebar click and every tab switch across all five modules is captured in PostHog
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, NAV-06
**Success Criteria** (what must be TRUE):
  1. Clicking any sidebar item fires `sidebar_nav_clicked` with correct `to`, `from`, and `module` properties visible in PostHog Activity
  2. Switching tabs in the Locations module fires `tab_switched` with `module: "locations"` and the correct `tab_name`
  3. Switching tabs in Reviews, Catalog, Offline Conversions, and Segments each fire `tab_switched` with their respective module names
  4. PostHog shows a navigable funnel: which module visitors land on first and where they go next
**Plans**: TBD
**UI hint**: yes

### Phase 3: Feature Depth
**Goal**: Location module interactions — viewing a detail, adding, editing, and importing — are captured as distinct events
**Depends on**: Phase 2
**Requirements**: FEAT-01, FEAT-02, FEAT-03, FEAT-04
**Success Criteria** (what must be TRUE):
  1. Opening a location detail/edit panel fires `location_viewed` with a `location_id` property in PostHog Activity
  2. Clicking the Add Location button fires `location_action` with `action_type: "add"`
  3. Clicking Edit on a location fires `location_action` with `action_type: "edit"`
  4. Clicking Import fires `location_action` with `action_type: "import"`
**Plans**: TBD

### Phase 4: Global & AI
**Goal**: Filter interactions and VenueX AI chat usage are captured so visitor intent and depth of engagement are measurable
**Depends on**: Phase 3
**Requirements**: GLBL-01, GLBL-02, GLBL-03, GLBL-04, GLBL-05
**Success Criteria** (what must be TRUE):
  1. Sending a message in the VenueX AI assistant fires `ai_chat_message_sent` with a `message_length` property
  2. Clicking an example question in the AI assistant fires `ai_example_question_clicked`
  3. Changing the date range filter fires `filter_changed` with `filter_type: "date_range"` and the selected value
  4. Changing the platform filter fires `filter_changed` with `filter_type: "platform"`
  5. Changing the location filter fires `filter_changed` with `filter_type: "location"`
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/1 | Ready to execute | - |
| 2. Navigation | 0/? | Not started | - |
| 3. Feature Depth | 0/? | Not started | - |
| 4. Global & AI | 0/? | Not started | - |
