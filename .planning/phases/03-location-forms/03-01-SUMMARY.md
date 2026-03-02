---
phase: 03-location-forms
plan: 01
subsystem: ui
tags: [zod, react, typescript, mock-data, translations, routing, wouter]

# Dependency graph
requires: []
provides:
  - LocationFormData Zod schema with 5 form sections (basic info, social media, address, hours, amenities)
  - LocationFormRecord type (extends LocationFormData with id/timestamps/photos)
  - emptyLocationFormData defaults for Add mode
  - AMENITY_CATEGORIES (10 categories), PLATFORM_CATEGORIES, TURKISH_CITIES constants
  - locationFormDataService with getLocation/createLocation/updateLocation and 3 mock Turkish retail records
  - /api/location-form/* endpoints registered in queryClient (GET/POST/PATCH)
  - locationForms translation namespace in en.json and tr.json
  - /locations/add and /locations/:id/edit routes in App.tsx
  - Static and dynamic breadcrumb entries in route-config.ts
  - Placeholder pages: location-add.tsx, location-edit.tsx
affects: [03-02, 03-03, 03-04, 03-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - locationFormDataService follows same internal-mutable-state pattern as settingsDataService/profileDataService
    - Dynamic route matching in getRouteConfig via startsWith/endsWith prefix check
    - Translation namespace locationForms.* added to both en.json and tr.json

key-files:
  created:
    - client/src/lib/types/location-form.ts
    - client/src/lib/mock-location-form-data.ts
    - client/src/pages/location-add.tsx
    - client/src/pages/location-edit.tsx
  modified:
    - client/src/lib/queryClient.ts
    - client/src/lib/translations/en.json
    - client/src/lib/translations/tr.json
    - client/src/App.tsx
    - client/src/lib/route-config.ts

key-decisions:
  - "locationFormDataService uses internal mutable let array (same pattern as settingsDataService/profileDataService) — mutations persist within session"
  - "/api/location-form/ prefix (not /api/locations/) avoids collision with existing location list endpoints"
  - "Mock records use IDs '1','2','3' matching existing mockLocations IDs for easy cross-reference by future plans"
  - "Record 3 (Kızılay) has locationStatus=temporarily_closed to cover that edge case in form UI"
  - "getRouteConfig dynamic match uses startsWith('/locations/') && endsWith('/edit') — sufficient for this route pattern"
  - "Breadcrumb labels are Turkish per locked project decision (Lokasyonlar, Konum Ekle, Konumu Düzenle)"

patterns-established:
  - "Location form endpoint prefix: /api/location-form/{id} — distinguishes from /api/locations list endpoint"
  - "Dynamic breadcrumb in route-config: prefix-match fallback before default fallback"

requirements-completed: [LOC-01, LOC-02, LOC-03]

# Metrics
duration: 4min
completed: 2026-03-02
---

# Phase 03 Plan 01: Location Forms Infrastructure Summary

**Zod schema + mock data service + queryClient endpoints + translation namespace + routed placeholder pages for Location Add/Edit forms**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-02T14:48:07Z
- **Completed:** 2026-03-02T14:52:00Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Full LocationFormData Zod schema covering all 5 form sections with realistic field types and Turkish validation messages
- locationFormDataService with 3 fully-populated Turkish retail mock records (Nişantaşı open, Kadıköy open, Kızılay temporarily_closed)
- queryClient routes /api/location-form/* to locationFormDataService (GET by ID, POST create, PATCH update)
- locationForms translation namespace with all section/field/UI string keys in both en.json and tr.json
- /locations/add and /locations/:id/edit routes registered (in correct order to avoid wouter matching "add" as ID)
- Dynamic breadcrumb support for /locations/:id/edit added to getRouteConfig

## Task Commits

Each task was committed atomically:

1. **Task 1: Create LocationFormData types and mock data service** - `7070fb2` (feat)
2. **Task 2: Wire routes, endpoints, translations, placeholder pages** - `d0bd9d7` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `client/src/lib/types/location-form.ts` - locationFormSchema Zod schema, LocationFormData, LocationFormRecord, WorkingHoursDay, AmenityCategory, emptyLocationFormData, AMENITY_CATEGORIES, PLATFORM_CATEGORIES, TURKISH_CITIES
- `client/src/lib/mock-location-form-data.ts` - locationFormDataService with 3 mock records (IDs '1','2','3')
- `client/src/pages/location-add.tsx` - Placeholder page for /locations/add
- `client/src/pages/location-edit.tsx` - Placeholder page for /locations/:id/edit
- `client/src/lib/queryClient.ts` - Added locationFormDataService import + 3 endpoint handlers
- `client/src/lib/translations/en.json` - Added locationForms namespace (~70 keys)
- `client/src/lib/translations/tr.json` - Added locationForms namespace (~70 keys in Turkish)
- `client/src/App.tsx` - Added LocationAdd/LocationEdit imports and route declarations
- `client/src/lib/route-config.ts` - Added /locations/add static entry + dynamic /locations/:id/edit match in getRouteConfig

## Decisions Made
- `/api/location-form/` endpoint prefix chosen (not `/api/locations/`) to avoid collision with existing location list endpoints
- Mock records use IDs '1','2','3' matching existing mockLocations IDs so future plans can cross-reference consistently
- Record 3 (Ankara Kızılay) has `locationStatus: 'temporarily_closed'` to provide an edge case for form UI testing
- Breadcrumb labels in Turkish per locked project decision (Lokasyonlar, Konum Ekle, Konumu Düzenle)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All infrastructure in place for Plans 03-02 through 03-05 to build actual form sections
- Types, mock data service, queryClient endpoints, translations, and routing are all ready
- No blockers

## Self-Check: PASSED

All artifacts verified:
- `client/src/lib/types/location-form.ts` — FOUND
- `client/src/lib/mock-location-form-data.ts` — FOUND
- `client/src/pages/location-add.tsx` — FOUND
- `client/src/pages/location-edit.tsx` — FOUND
- `.planning/phases/03-location-forms/03-01-SUMMARY.md` — FOUND
- Commit `7070fb2` (Task 1) — FOUND
- Commit `d0bd9d7` (Task 2) — FOUND

---
*Phase: 03-location-forms*
*Completed: 2026-03-02*
