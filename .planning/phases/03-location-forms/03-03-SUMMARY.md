---
phase: 03-location-forms
plan: 03
subsystem: ui
tags: [react, leaflet, react-leaflet, react-hook-form, typescript, tailwind]

# Dependency graph
requires:
  - phase: 03-location-forms plan 02
    provides: LocationEditForm orchestrator, BasicInfoSection, SocialMediaSection, LocationFormData types, progress sidebar

provides:
  - AddressMapSection with Leaflet MapContainer and dynamic marker centering
  - WorkingHoursSection with location status radios, day pill buttons, time pickers, 24h toggle, Add Break
  - AmenitiesSection with chip toggles across all 10 amenity categories
  - All 5 core form sections wired into LocationEditForm

affects: [03-location-forms plan 04 (photo sections will follow same section pattern), LocationProgressSidebar (already tracks these sections)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "react-leaflet MapContainer with MapCenterSyncer child component to handle mount-only center prop"
    - "WorkingHoursSection uses local selectedDay index + direct form.watch/setValue for nested array — no useFieldArray"
    - "AmenitiesSection uses form.getValues + form.setValue with shouldDirty for chip toggle mutations"
    - "Leaflet marker icon Vite fix: delete prototype._getIconUrl + L.Icon.Default.mergeOptions at module level"

key-files:
  created:
    - client/src/components/locations2/sections/AddressMapSection.tsx
    - client/src/components/locations2/sections/WorkingHoursSection.tsx
    - client/src/components/locations2/sections/AmenitiesSection.tsx
  modified:
    - client/src/components/locations2/LocationEditForm.tsx

key-decisions:
  - "WorkingHoursSection uses local selectedDay state + form.watch/setValue (not useFieldArray) for nested workingHours array — simpler and avoids RHF field array pitfalls with complex objects"
  - "MapCenterSyncer pattern: Leaflet MapContainer center prop is mount-only, so a child component using useMap().setView() is required to re-center on coordinate changes"
  - "Special Hours tab shows placeholder text — deferred per plan spec"
  - "Day isOpen toggle shown as checkbox within the selected-day panel — consistent with 24h checkbox pattern"

patterns-established:
  - "Leaflet marker icon fix at module level — apply once per file, not inside component"
  - "WorkingHoursSection selectedDay + updateDayField pattern for nested form array editing without useFieldArray"

requirements-completed: [LOC-03]

# Metrics
duration: 3min
completed: 2026-03-02
---

# Phase 3 Plan 3: Address, Working Hours, Amenities Sections Summary

**Leaflet interactive map section, day-pill working hours editor, and chip-toggle amenities grid completing all 5 core form sections**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-02T16:06:09Z
- **Completed:** 2026-03-02T16:09:36Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- AddressMapSection renders lat/lng inputs beside a Leaflet map; entering valid coordinates places a marker and re-centers the map via MapCenterSyncer child pattern
- WorkingHoursSection implements location status radios, Normal/Special tabs, 7 day pill buttons with open/closed/selected states, time pickers, 24h checkbox, and Add Break with removable break time rows
- AmenitiesSection renders chip-style toggles across all 10 AMENITY_CATEGORIES with check icon on selected; language-aware (TR/EN labels via useTranslation language)
- LocationEditForm now renders all 5 core sections in sequence; progress sidebar already tracks all of them

## Task Commits

Each task was committed atomically:

1. **Task 1: Create AddressMapSection with Leaflet map and dynamic marker** - `e5a2269` (feat)
2. **Task 2: Create WorkingHoursSection + AmenitiesSection and wire all 3 sections into LocationEditForm** - `1206461` (feat)

## Files Created/Modified

- `client/src/components/locations2/sections/AddressMapSection.tsx` - Lat/lng inputs + Leaflet MapContainer with MapCenterSyncer, country/city dropdowns, address fields
- `client/src/components/locations2/sections/WorkingHoursSection.tsx` - Location status radios, Normal/Special tabs, day pills, time pickers, 24h toggle, break management
- `client/src/components/locations2/sections/AmenitiesSection.tsx` - Chip toggles across 10 categories with check icon and language-aware labels
- `client/src/components/locations2/LocationEditForm.tsx` - Added imports and renders for all three new sections

## Decisions Made

- WorkingHoursSection uses local `selectedDay` state and direct `form.watch/setValue` (not `useFieldArray`) for nested workingHours array — simpler for complex nested objects and avoids field array re-render issues
- `MapCenterSyncer` as a child component of `MapContainer` is the required pattern because `MapContainer`'s `center` prop is mount-only
- Special Hours tab deferred as placeholder text per plan spec

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 5 core form sections complete and rendering in sequence
- Progress sidebar already tracks address, hours, and amenities fields (was built in Plan 03-02)
- Plan 03-04 can add photo sections following the same section pattern
- No blockers

---
*Phase: 03-location-forms*
*Completed: 2026-03-02*
