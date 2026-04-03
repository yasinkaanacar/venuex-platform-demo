# Requirements: PostHog Analytics Instrumentation

**Defined:** 2026-04-03
**Core Value:** Every demo visitor's journey through the platform is captured in PostHog — which modules they explore, how deep they go, and where they drop off.

## v1 Requirements

### Foundation

- [ ] **FOUND-01**: Centralized analytics.ts helper exists at client/src/lib/analytics.ts with typed event names and property interfaces
- [ ] **FOUND-02**: All PostHog capture calls go through the analytics helper — no direct posthog.capture() in components (except existing DemoGate)
- [ ] **FOUND-03**: Analytics helper wraps all calls in try/catch so tracking failures never break the app
- [ ] **FOUND-04**: Pageview strategy resolved — auto-capture validated with Wouter or replaced with manual tracking

### Navigation

- [ ] **NAV-01**: Sidebar navigation clicks fire sidebar_nav_clicked event with destination and source page
- [ ] **NAV-02**: Tab switches in Locations module fire tab_switched event with module and tab_name
- [ ] **NAV-03**: Tab switches in Reviews module fire tab_switched event with module and tab_name
- [ ] **NAV-04**: Tab switches in Catalog module fire tab_switched event with module and tab_name
- [ ] **NAV-05**: Tab switches in Offline Conversions module fire tab_switched event with module and tab_name
- [ ] **NAV-06**: Tab switches in Segments module fire tab_switched event with module and tab_name

### Feature Depth

- [ ] **FEAT-01**: Opening a location detail/edit fires location_viewed event with location_id
- [ ] **FEAT-02**: Location add action fires location_action event with action_type: "add"
- [ ] **FEAT-03**: Location edit action fires location_action event with action_type: "edit"
- [ ] **FEAT-04**: Location import action fires location_action event with action_type: "import"

### Global & AI

- [ ] **GLBL-01**: VenueX AI chat message send fires ai_chat_message_sent event with message_length
- [ ] **GLBL-02**: VenueX AI example question click fires ai_example_question_clicked event
- [ ] **GLBL-03**: Date range filter change fires filter_changed event with filter_type and value
- [ ] **GLBL-04**: Platform filter change fires filter_changed event with filter_type and value
- [ ] **GLBL-05**: Location filter change fires filter_changed event with filter_type and value

## v2 Requirements

### Engagement Depth

- **ENGD-01**: Module time spent tracking via route-level timing hook
- **ENGD-02**: Review AI response generation tracking
- **ENGD-03**: Enrichment suggestion apply/dismiss tracking
- **ENGD-04**: Language switch (EN/TR) tracking
- **ENGD-05**: Catalog feed interaction tracking
- **ENGD-06**: AI example question click with question text property

## Out of Scope

| Feature | Reason |
|---------|--------|
| PostHog dashboards/reports | Built in PostHog UI, not code |
| Backend event tracking | Frontend-only prototype |
| A/B testing / feature flags | Not needed for demo analytics |
| Revenue/conversion tracking | No real transactions in demo |
| Session replay configuration | PostHog handles this automatically |
| identify() wrapper in analytics.ts | DemoGate owns identity — exposing it risks double-identify bugs |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| NAV-04 | Phase 2 | Pending |
| NAV-05 | Phase 2 | Pending |
| NAV-06 | Phase 2 | Pending |
| FEAT-01 | Phase 3 | Pending |
| FEAT-02 | Phase 3 | Pending |
| FEAT-03 | Phase 3 | Pending |
| FEAT-04 | Phase 3 | Pending |
| GLBL-01 | Phase 4 | Pending |
| GLBL-02 | Phase 4 | Pending |
| GLBL-03 | Phase 4 | Pending |
| GLBL-04 | Phase 4 | Pending |
| GLBL-05 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-03 after roadmap creation*
