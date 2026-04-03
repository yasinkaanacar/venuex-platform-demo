---
status: partial
phase: 02-navigation
source: [02-VERIFICATION.md]
started: 2026-04-03T15:01:00Z
updated: 2026-04-03T15:01:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. PostHog sidebar events
expected: Each sidebar click produces one `demo_sidebar_nav_clicked` event in PostHog Activity with correct `to`, `from`, `module`, and `source: 'demo'` properties.
result: [pending]

### 2. PostHog tab switch events
expected: Switching tabs fires `demo_tab_switched` with correct module and kebab-case tab_name for all 5 modules (Locations: store-profiles/performance/posts, Reviews: overview/inbox/locations, Catalog: dashboard/activity, Offline Conversions: summary/performance/campaigns/data-connection, Segments: audiences/platform-push).
result: [pending]

### 3. PostHog funnel constructability
expected: A navigable user path funnel is constructable in PostHog using `demo_sidebar_nav_clicked` events grouped by `module` property.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
