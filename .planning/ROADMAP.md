# Roadmap: VenueX Sub-Page Redesigns

## Overview

This milestone brings six sub-pages into alignment with the design system already established across VenueX's main modules. Settings ships first because it produces the shared primitives (`SettingsSectionCard`, `SettingsFormRow`, `SettingsFieldGroup`) that every subsequent page reuses. Profile validates that reuse pattern. Edit + Add Location share one form component and ship together. Import Locations is independent and gets focused isolation for its state-machine wizard. Onboarding closes the milestone with a prerequisite cleanup step before any new code is written. When all five phases complete, every page in the prototype speaks the same visual language — a single, unambiguous engineering reference.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Settings** - Redesign Settings with two-panel layout, 4 tabs, shared primitives, and mock data infrastructure
- [ ] **Phase 2: Profile** - Redesign Profile page reusing Settings primitives
- [ ] **Phase 3: Location Forms** - Edit Location and Add Location as shared Sheet-overlay form component
- [ ] **Phase 4: Import Locations** - Import wizard with useReducer state machine and drag-drop upload
- [ ] **Phase 5: Onboarding** - Deprecate competing setup files and redesign onboarding-unified

## Phase Details

### Phase 1: Settings
**Goal**: Users can navigate a fully redesigned Settings page with consistent visual hierarchy, persistent tab state, and all four content areas populated with realistic mock data
**Depends on**: Nothing (first phase)
**Requirements**: SET-01, SET-02, SET-03, SET-04, SET-05, SET-06, SET-07, XCT-01, XCT-02, XCT-03
**Success Criteria** (what must be TRUE):
  1. Settings page shows two-panel layout: left sidebar with brand completion percentage tracker and checklist, right area with four navigable tabs
  2. Each of the four tabs (Edit Business, Activity Feed, Store Sets, Data Source & Mapping) renders in the vx-card hierarchy with no shadcn Card layout primitives
  3. Switching tabs and navigating away then returning preserves the active tab via URL query string (`?tab=editBusiness`)
  4. Activity Feed displays reverse-chronological events with date grouping and type/date filters that visibly reduce the list
  5. All UI strings appear correctly in both English and Turkish; no missing or undefined translation keys visible in the UI
**Plans**: 7 plans in 4 waves

Plans:
- [x] 01-01-PLAN.md — Infrastructure: TypeScript types, mock data service, queryClient registration, translation keys (Wave 1)
- [x] 01-02-PLAN.md — Shared primitives: SettingsSectionCard, SettingsFormRow, SettingsFieldGroup (Wave 2)
- [x] 01-03-PLAN.md — Settings page shell: two-panel layout, CompletionSidebar, tab navigation with URL sync (Wave 3)
- [ ] 01-04-PLAN.md — Edit Business tab: brand info form with four vx-card sections (Wave 4)
- [ ] 01-05-PLAN.md — Activity Feed tab: event log with date grouping, filters, expandable details (Wave 4)
- [ ] 01-06-PLAN.md — Store Sets tab: CRUD list with create/edit dialog and delete confirmation (Wave 4)
- [ ] 01-07-PLAN.md — Data Source & Mapping tab: connection cards, status badges, field mapping tables (Wave 4)

### Phase 2: Profile
**Goal**: Users can view and edit their profile information on a page that is visually indistinguishable in style from the redesigned Settings page
**Depends on**: Phase 1
**Requirements**: PRF-01, PRF-02, PRF-03
**Success Criteria** (what must be TRUE):
  1. Profile page renders avatar section with both an image state and an initials-fallback state visible
  2. Personal info fields (display name, email read-only, role badge) and language preference toggle all appear in vx-card sections using SettingsSectionCard and SettingsFormRow components from Phase 1
  3. Password change section is present but visibly stubbed (no active form fields, placeholder text only)
**Plans**: TBD

Plans:
- [ ] 02-01: Profile page — ProfileAvatarSection component, personal info section, language toggle, password stub; all using Phase 1 shared primitives

### Phase 3: Location Forms
**Goal**: Users can open Edit Location and Add Location as Sheet overlays from the locations list, with all form sections populated and functional
**Depends on**: Phase 1
**Requirements**: LOC-01, LOC-02, LOC-03
**Success Criteria** (what must be TRUE):
  1. Clicking edit on a location row opens a Sheet overlay with the location's data pre-populated across all sections (core info, address, hours, contact, platform links)
  2. Clicking add location opens the same Sheet overlay with empty fields and the store code field prominent in the header
  3. The same LocationEditForm component renders in both add and edit modes — no duplicate form components exist
  4. No new routes are created; the Sheet overlays open from and close back to the locations list at `/locations`
**Plans**: TBD

Plans:
- [ ] 03-01: LocationEditForm component (add/edit modes via locationId? prop), LocationFormData type extension, Sheet overlay wiring in locations list page

### Phase 4: Import Locations
**Goal**: Users can import a CSV of locations through a guided wizard that validates data, shows row-level errors, and resolves conflicts before committing
**Depends on**: Phase 1
**Requirements**: LOC-04, LOC-05
**Success Criteria** (what must be TRUE):
  1. Import wizard opens as a Dialog from the locations list and progresses through four named steps: upload, column mapping, validation preview, conflict resolution
  2. Dragging a CSV file onto the upload zone or clicking to browse both trigger file selection; the file name appears as confirmation
  3. Validation preview step shows a table of parsed rows with row-level error badges for invalid entries before any import is triggered
  4. Conflict resolution step reuses the existing LocationConflictResolutionDialog pattern and allows step-back navigation
**Plans**: TBD

Plans:
- [ ] 04-01: ImportWizard Dialog — useReducer state machine, drag-drop upload zone, column mapping table, validation preview, conflict resolution step

### Phase 5: Onboarding
**Goal**: Users encounter a single, canonical onboarding flow in the vx-card visual language with a step sidebar showing progress and resumable state
**Depends on**: Nothing (layout fully independent; no shared component dependencies with other phases)
**Requirements**: ONB-01, ONB-02, ONB-03
**Success Criteria** (what must be TRUE):
  1. The four competing setup files (`setup.tsx`, `setup2.tsx`, `setup3.tsx`, `setup3B.tsx`) each contain a deprecation comment and their routes redirect to `/onboarding` — no old layout renders at any route
  2. The onboarding step sidebar shows each step with a completion indicator (dot or checkmark) and the estimated time label; current step is visually distinct
  3. Completing a step and navigating away then returning resumes at the correct step with previously-entered data preserved
  4. All onboarding sections use the vx-card hierarchy — no shadcn Card layout primitives appear in the redesigned components
**Plans**: TBD

Plans:
- [ ] 05-01: Prerequisite cleanup — add deprecation comments and route redirects to setup.tsx, setup2.tsx, setup3.tsx, setup3B.tsx
- [ ] 05-02: Onboarding redesign — extract OnboardingHeader, OnboardingProgressBar, OnboardingStepShell, StepSidebar; redesign onboarding-unified.tsx in vx-card visual language

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Settings | 3/7 | In progress | - |
| 2. Profile | 0/1 | Not started | - |
| 3. Location Forms | 0/1 | Not started | - |
| 4. Import Locations | 0/1 | Not started | - |
| 5. Onboarding | 0/2 | Not started | - |
