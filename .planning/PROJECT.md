# VenueX Platform — Sub-Page Redesigns

## What This Is

A milestone focused on redesigning VenueX's secondary/sub-pages to match the updated design system established across the platform's main pages. These pages — Settings, Edit Location, Add Location, Import Locations, Profile, and Onboarding/Setup — are currently in the old design language and need to be brought up to the new standard (vx-card hierarchy, gray-50 surfaces, consistent component patterns).

This is a product design environment. Everything built here is the canonical reference for engineering to implement. All data is mock, no real API connections.

## Core Value

Every page in the prototype must look and feel like a finished product — consistent design language across all screens so engineering has a single, unambiguous reference to build from.

## Requirements

### Validated

- ✓ Overview dashboard with cross-platform metrics — existing
- ✓ Location management with CRUD + bulk operations — existing
- ✓ Review management with AI-suggested responses and sentiment analysis — existing
- ✓ Offline conversions with campaign performance and data pipelines — existing
- ✓ Segments module with builder, list, and platform push — existing
- ✓ Catalog/inventory page — existing
- ✓ Design system established (vx-card, vx-card-header, vx-card-body, vx-surface-muted) — existing
- ✓ Bilingual support (EN/TR) across all pages — existing
- ✓ Mock data service architecture matching production API contracts — existing

### Active

- [ ] Settings page redesign — 4 tabs (Edit Business, Activity Feed, Store Sets, Data Source & Mapping)
- [ ] Edit Location page redesign — individual location detail/edit view
- [ ] Add Location page — new location creation flow
- [ ] Import Locations page — bulk import flow
- [ ] Profile page redesign — user profile settings
- [ ] Onboarding/Setup redesign — Kurulum flows

### Out of Scope

- New product modules (Analytics, Reporting) — separate milestone
- New feature experimentation/ideation — separate milestone after redesigns
- Backend/API changes — this is frontend prototype only
- Production deployment — this is a design environment

## Context

- The main pages (Overview, Locations, Reviews, Offline Conversions, Segments, Catalog) have already been redesigned with the new design system
- Sub-pages are still in the old visual style — inconsistent with the rest of the platform
- The current live Settings page has 4 tabs: Edit Business (form-heavy), Activity Feed (log list), Store Sets (CRUD list), Data Source & Mapping (card-based setup)
- Left sidebar in Settings shows brand completion progress (63% tracker, checklist)
- Workflow: agent generates first version following established patterns, user iterates
- Settings is the first priority page

## Constraints

- **Design system**: Must use the established vx-card hierarchy, gray-50 surfaces, and component patterns from existing redesigned pages
- **Mock data only**: No real API connections — all data through mock services
- **Bilingual**: All new UI strings must exist in both en.json and tr.json
- **Engineering handoff**: Every component must be plug-and-play ready for production
- **No explicit brand naming in data/pipeline mocks**: Ingestion sources labeled generically (SFTP, API)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Redesigns-only milestone | Clean scope, new features in separate milestone | — Pending |
| Settings page first priority | Most complex sub-page, sets the pattern for others | — Pending |
| Agent-first workflow | Generate initial version from design system, then iterate | — Pending |

---
*Last updated: 2026-03-02 after initialization*
