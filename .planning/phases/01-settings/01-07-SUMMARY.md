---
phase: 01-settings
plan: 07
subsystem: ui
tags: [react, tanstack-query, tailwind, settings, data-sources, field-mapping]

# Dependency graph
requires:
  - phase: 01-settings-01
    provides: types/settings.ts with DataSourceConnection, FieldMapping, DataSourceStatus types
  - phase: 01-settings-02
    provides: SettingsSectionCard component for consistent section layout
  - phase: 01-settings-03
    provides: settings.tsx page shell with tab navigation and PlaceholderTab

provides:
  - DataSourceTab component — Sales/Inventory/StoreData sections with connection cards and field mapping tables
  - All four settings tabs fully wired (EditBusinessTab, ActivityFeedTab, StoreSetsTab, DataSourceTab)
  - PlaceholderTab removed from settings.tsx — no placeholder tabs remain

affects:
  - offline-conversions
  - future phases referencing settings data source config

# Tech tracking
tech-stack:
  added: []
  patterns:
    - DataSourceCard inline helper within DataSourceTab.tsx (not a separate file)
    - STATUS_STYLES Record<DataSourceStatus, styles> pattern for colored status badges
    - expandedSourceId: string | null for accordion-style field mapping expansion
    - useQuery with /api/settings/data-sources key for DataSourceConnection[]

key-files:
  created:
    - client/src/components/settings/DataSourceTab.tsx
  modified:
    - client/src/pages/settings.tsx

key-decisions:
  - "DataSourceCard defined as inline helper inside DataSourceTab.tsx — not extracted to separate file, keeps related logic co-located"
  - "PlaceholderTab removed entirely — all four tabs (editBusiness, activityFeed, storeSets, dataSource) now render real components"
  - "Store Data section shows centered Upload icon + description + Import button — non-functional placeholder for Phase 4 Import Locations"

patterns-established:
  - "STATUS_STYLES: Record<DataSourceStatus, { bg, text, dot }> for colored badge variants — use this pattern for any status badge"
  - "Expandable table toggle: useState<string | null> for expandedSourceId, toggle via card action button"

requirements-completed: [SET-05, SET-06]

# Metrics
duration: 4min
completed: 2026-03-02
---

# Phase 1 Plan 7: Data Source & Mapping Tab Summary

**DataSourceTab with SFTP/API connection cards, field mapping tables, and Store Data import section — all four settings tabs fully implemented with PlaceholderTab removed**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-02T11:04:22Z
- **Completed:** 2026-03-02T11:08:18Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- DataSourceTab renders three SettingsSectionCard sections: Sales Data, Inventory Data, Store Data Settings
- Connection cards show SFTP/API type labels, colored status badges (green/red/yellow/gray), last sync time, record count
- Error sources display red AlertCircle banner with error message
- Clicking "Map Data" expands field mapping table inline with source/VenueX field/sample value/status columns
- Store Data section shows centered Upload icon + Import Store Data button placeholder
- settings.tsx wired with all four real tab components — PlaceholderTab removed entirely
- All data source labels are generic (SFTP/API only, no branded names per CLAUDE.md)
- Full EN/TR translation coverage via useTranslation()

## Task Commits

Each task was committed atomically:

1. **Task 1: Build DataSourceTab component** - `3d206c1` (feat)
2. **Task 2: Wire DataSourceTab into settings.tsx, remove PlaceholderTab** - `a857bbc` (feat)

## Files Created/Modified
- `client/src/components/settings/DataSourceTab.tsx` — Data source connection cards, field mapping tables, three SettingsSectionCard sections
- `client/src/pages/settings.tsx` — All four tabs wired to real components, PlaceholderTab removed

## Decisions Made
- DataSourceCard is an inline helper inside DataSourceTab.tsx rather than a separate file — keeps the card logic co-located with its only consumer
- PlaceholderTab removed from settings.tsx entirely since EditBusinessTab.tsx, ActivityFeedTab.tsx, and StoreSetsTab.tsx were already built in prior plans (04-06), only not wired to the dataSource tab yet
- Store Data Settings section uses a centered layout with Upload icon to visually distinguish it from the data pipeline sections

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Wired EditBusinessTab and StoreSetsTab in addition to DataSourceTab**
- **Found during:** Task 2 (settings.tsx wiring)
- **Issue:** Plan said to remove PlaceholderTab "entirely since it is no longer used by any tab" — but that required wiring EditBusinessTab and StoreSetsTab which existed on disk (plans 04/06 had already been executed) but were still showing PlaceholderTab in settings.tsx
- **Fix:** Imported all four real tab components and replaced all PlaceholderTab usages, then removed the function
- **Files modified:** client/src/pages/settings.tsx
- **Verification:** `grep -n "PlaceholderTab" settings.tsx` returns no usage lines
- **Committed in:** a857bbc (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 2 — missing critical wiring)
**Impact on plan:** Required to complete the plan's stated goal of removing PlaceholderTab entirely. No scope creep — only wired existing components.

## Issues Encountered
None — all pre-existing TypeScript errors in unrelated files (collapsible.tsx, form.tsx, sidebar.tsx) were out of scope and not touched.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All four settings tabs are fully implemented and render real components
- The Settings module is complete — no placeholder content remains
- Phase 2 can proceed (next milestone phase) with confidence that the Settings reference design is complete
- Store Data import button is a placeholder — will connect to real import flow in Phase 4 Import Locations

---
*Phase: 01-settings*
*Completed: 2026-03-02*
