# Roadmap: VenueX Sub-Page Redesigns

## Overview

This milestone brings six sub-pages into alignment with the design system already established across VenueX's main modules. Settings ships first because it produces the shared primitives (`SettingsSectionCard`, `SettingsFormRow`, `SettingsFieldGroup`) that every subsequent page reuses. Profile validates that reuse pattern. Edit + Add Location share one form component and ship together. Import Locations is independent and gets focused isolation for its state-machine wizard. Onboarding closes the milestone with a prerequisite cleanup step before any new code is written. When all five phases complete, every page in the prototype speaks the same visual language — a single, unambiguous engineering reference.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Settings** - Redesign Settings with two-panel layout, 4 tabs, shared primitives, and mock data infrastructure (completed 2026-03-02)
- [x] **Phase 2: Profile** - Redesign Profile page reusing Settings primitives (completed 2026-03-02)
- [ ] **Phase 3: Location Forms** - Add Location and Edit Location as full dedicated pages with progress sidebar, matching production design
- [ ] **Phase 4: Import Locations** - Import page with template download, export, drag-drop upload, and file history table
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
**Requirements**: PRF-01, PRF-02, PRF-03, PRF-04, PRF-05
**Success Criteria** (what must be TRUE):
  1. Profile page renders avatar section with both an image state and an initials-fallback state visible
  2. Personal info fields (display name, email read-only, role badge) and language preference toggle all appear in vx-card sections using SettingsSectionCard and SettingsFormRow components from Phase 1
  3. Password change section is present but visibly stubbed (no active form fields, placeholder text only)
**Plans**: 3 plans in 3 waves

Plans:
- [x] 02-01-PLAN.md — Infrastructure: TypeScript types, mock data service, queryClient registration, translation keys, route registration, placeholder page (Wave 1)
- [ ] 02-02-PLAN.md — ProfileInfoSection (avatar + inline-edit form) and PasswordStubSection (placeholder stub) (Wave 2)
- [ ] 02-03-PLAN.md — TeamInviteSection (multi-row invite form) and TeamTableSection (tabbed roster with actions) (Wave 3)

### Phase 3: Location Forms
**Goal**: Users can add and edit locations on full dedicated pages matching the production design, with progress sidebar, all form sections (basic info, social media, address+map, hours, amenities, photos), and validation
**Depends on**: Phase 1
**Requirements**: LOC-01, LOC-02, LOC-03
**Success Criteria** (what must be TRUE):
  1. `/locations/add` renders a full page with left progress sidebar and scrollable form sections: Temel Bilgiler, Sosyal Medya, Lokasyon (with map), Çalışma Saatleri, Olanaklar
  2. `/locations/:id/edit` renders the same form pre-populated with location data, plus Photos and Business Cover Photo sections
  3. The same LocationEditForm component renders in both add and edit modes — Photos sections conditionally shown in edit only
  4. Progress sidebar shows completion percentage and per-section field counts that update as user fills fields
  5. Working hours section uses day pill buttons (Mon-Sun), time pickers, location status radio, and "Add break" support
**Plans**: 4 plans in 4 waves

Plans:
- [ ] 03-01-PLAN.md — Infrastructure: TypeScript types + Zod schema, mock data service (3 records), queryClient endpoints, translations, route registration, placeholder pages (Wave 1)
- [ ] 03-02-PLAN.md — Page shell + sidebar: LocationEditForm orchestrator, LocationProgressSidebar with useWatch(), BasicInfoSection, SocialMediaSection (Wave 2)
- [ ] 03-03-PLAN.md — Complex sections: AddressMapSection with Leaflet, WorkingHoursSection with day pills, AmenitiesSection with chip toggles (Wave 3)
- [ ] 03-04-PLAN.md — Edit mode + wiring: PhotosSection, CoverPhotoSection (edit-only), Add Location button in TopBar, Edit button in DetailsDrawer (Wave 4)

### Phase 4: Import Locations
**Goal**: Users can import locations via a dedicated page with template download, bulk export, drag-drop file upload, and file history table matching production design
**Depends on**: Phase 1
**Requirements**: LOC-04, LOC-05
**Success Criteria** (what must be TRUE):
  1. `/locations/import` renders a full page with warning banner, three action cards (download template, export locations, drag-drop upload), and file history table
  2. Drag-drop upload zone accepts JSON, XLS, CSV files with visual feedback
  3. File history table shows: file name, upload date, row count, file size, source type, status (new/updated counts), and download button per row
  4. Download Template and Export Locations buttons trigger mock file download actions
**Plans**: TBD

Plans:
- (to be generated by /gsd:plan-phase 4)

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
| 1. Settings | 7/7 | Complete   | 2026-03-02 |
| 2. Profile | 3/3 | Complete   | 2026-03-02 |
| 3. Location Forms | 0/4 | Not started | - |
| 4. Import Locations | 0/1 | Not started | - |
| 5. Onboarding | 0/2 | Not started | - |
