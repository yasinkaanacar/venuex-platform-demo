---
phase: 01-settings
plan: 01
subsystem: ui
tags: [typescript, mock-data, i18n, react-query, tanstack-query]

# Dependency graph
requires: []
provides:
  - TypeScript type definitions for all Settings entities (BusinessProfile, ActivityFeedEntry, StoreSet, DataSourceConnection, FieldMapping, CompletionChecklistItem, DataSourceStatus, ActivityEventType)
  - settingsDataService with 10 async mock methods (get/update/create/delete for all Settings resources)
  - Mock data: Karaca brand profile, 18-entry activity feed, 5 store sets, 4 data sources with field mappings, completion checklist
  - queryClient endpoint routing for /api/settings/* (9 endpoint patterns)
  - en.json and tr.json settings.* translation keys for all 4 tabs (editBusiness, activityFeed, storeSets, dataSource)
affects:
  - 01-02 (EditBusiness tab component)
  - 01-03 (ActivityFeed tab component)
  - 01-04 (StoreSets tab component)
  - 01-05 (DataSource tab component)
  - 01-06 (Settings page shell)
  - 01-07 (CompletionSidebar component)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "settingsDataService: async methods with delay() — mirrors mock-segments-data.ts and mock-notifications-data.ts patterns"
    - "queryClient endpoint registration: most-specific URL patterns first, PATCH/DELETE with ID extraction before generic GET"
    - "Translation structure: new keys added alongside existing settings.notifications and settings.account without disruption"

key-files:
  created:
    - client/src/lib/types/settings.ts
    - client/src/lib/mock-settings-data.ts
  modified:
    - client/src/lib/queryClient.ts
    - client/src/lib/translations/en.json
    - client/src/lib/translations/tr.json

key-decisions:
  - "Generic SFTP/API labels for data sources — no branded names per CLAUDE.md mock data standards"
  - "Inventory SFTP source has error status with Turkish error message — covers edge case for error state UI"
  - "Pre-existing TypeScript errors in collapsible.tsx, form.tsx, sidebar.tsx — out of scope, not introduced by settings files"

patterns-established:
  - "Data source naming: always 'SFTP' or 'API' — never branded identifiers"
  - "Field mappings: sourceColumn snake_case, venueXField Title Case display name"
  - "Activity feed: 6 event types represented, Turkish actor names, timestamps in ISO 8601"

requirements-completed: [XCT-01, XCT-02, XCT-03]

# Metrics
duration: 4min
completed: 2026-03-02
---

# Phase 1 Plan 01: Settings Infrastructure Summary

**Settings foundation: TypeScript types, Karaca mock data service, queryClient routing, and full en/tr translations for all 4 Settings tabs**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-02T00:00:00Z
- **Completed:** 2026-03-02T00:04:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Created 8 exported TypeScript types covering all Settings entities including 4 union types and 4 interfaces
- Built settingsDataService with 10 async methods and realistic Karaca brand mock data (145 locations, 18 activity entries, 5 store sets, 4 data sources)
- Registered 9 endpoint patterns in queryClient.ts routing /api/settings/* to settingsDataService
- Added 60+ translation keys to en.json and tr.json under settings.* for all 4 tabs, preserving existing notifications/account keys

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TypeScript types and mock data service** - `60aee6e` (feat)
2. **Task 2: Register endpoints in queryClient and add translation keys** - `df41580` (feat)

## Files Created/Modified
- `client/src/lib/types/settings.ts` - 8 TypeScript types: BusinessProfile, ActivityFeedEntry, StoreSet, DataSourceConnection, FieldMapping, CompletionChecklistItem, DataSourceStatus, ActivityEventType
- `client/src/lib/mock-settings-data.ts` - settingsDataService + mock data: Karaca brand profile, activity feed (18 entries, all 6 event types), 5 store sets (Istanbul EU/Anatolian, Ankara, AVM, Pilot), 4 data sources with field mappings
- `client/src/lib/queryClient.ts` - Import + 9 endpoint patterns for /api/settings/*
- `client/src/lib/translations/en.json` - Added settings.pageTitle, tabs, completionSidebar, editBusiness, activityFeed, storeSets, dataSource
- `client/src/lib/translations/tr.json` - Same key structure with full Turkish translations

## Decisions Made
- Used generic "SFTP" and "API" labels for all data sources — no branded names per CLAUDE.md mock data standards
- Inventory SFTP source set to error status with Turkish timeout message to provide realistic edge case for error state UI
- Pre-existing TypeScript errors in collapsible.tsx, sidebar.tsx, form.tsx are out of scope — not introduced by this plan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors exist in the codebase (collapsible, form, sidebar, toaster components) — confirmed none are related to settings files. Settings-specific files produce zero TypeScript errors.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All subsequent Settings tab plans (01-02 through 01-07) can import from these files immediately
- Types, mock data, endpoints, and translations are all in place
- No blockers

## Self-Check

**Files exist:**
- `client/src/lib/types/settings.ts`: FOUND
- `client/src/lib/mock-settings-data.ts`: FOUND
- Commits `60aee6e` and `df41580`: FOUND

## Self-Check: PASSED

---
*Phase: 01-settings*
*Completed: 2026-03-02*
