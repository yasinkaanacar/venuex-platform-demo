# Requirements: VenueX Sub-Page Redesigns

**Defined:** 2026-03-02
**Core Value:** Every page in the prototype must look and feel like a finished product — consistent design language across all screens so engineering has a single, unambiguous reference to build from.

## v1 Requirements

### Settings

- [x] **SET-01**: Settings page has two-panel layout: left sidebar with brand completion tracker + right content area with tab navigation
- [ ] **SET-02**: Edit Business tab displays brand info form (name, categories, description, contact, social links) in vx-card sections
- [x] **SET-03**: Activity Feed tab shows reverse-chronological event log with date grouping, type filters, and date range filter
- [ ] **SET-04**: Store Sets tab provides CRUD list for store groups with name, location count, and inline edit/delete actions
- [ ] **SET-05**: Data Source & Mapping tab displays connection cards (SFTP/API) with status indicators and field mapping configuration
- [x] **SET-06**: All Settings tabs use vx-card hierarchy and useTranslation() pattern
- [x] **SET-07**: Active tab synced to URL query string to prevent state loss on navigation

### Location Pages

- [ ] **LOC-01**: Edit Location opens as Sheet overlay from locations list with pre-populated form
- [ ] **LOC-02**: Add Location opens as Sheet overlay from locations list with empty form
- [ ] **LOC-03**: Location form includes sections: core info, address, hours, contact, platform links
- [ ] **LOC-04**: Import Locations wizard with drag-drop upload, column mapping, validation preview, and conflict resolution
- [ ] **LOC-05**: Import wizard uses useReducer state machine with explicit step transitions

### Profile

- [ ] **PRF-01**: Profile page with avatar section (image + initials fallback), personal info, language preference toggle
- [ ] **PRF-02**: Password change section as placeholder stub
- [ ] **PRF-03**: Reuses SettingsSectionCard and SettingsFormRow shared components from Settings

### Onboarding

- [ ] **ONB-01**: Onboarding-unified.tsx redesigned with vx-card visual language and extracted sub-components
- [ ] **ONB-02**: Competing setup*.tsx files deprecated with clear comments and route redirects
- [ ] **ONB-03**: Step progress sidebar with completion indicators and resumable state

### Cross-Cutting

- [x] **XCT-01**: All new UI strings added to both en.json and tr.json
- [x] **XCT-02**: Mock data service (mock-settings-data.ts) with typed endpoints registered in queryClient.ts
- [x] **XCT-03**: TypeScript types for BusinessProfile, ActivityFeedEntry, StoreSet, DataSource, LocationFormData

## v2 Requirements

### Settings Enhancements

- **SET-V2-01**: Notification preferences as 5th tab in Settings (currently separate page)
- **SET-V2-02**: Audit log with field-level diff view (before/after values)
- **SET-V2-03**: Platform health panel with inline Reconnect CTAs

### Location Enhancements

- **LOC-V2-01**: Cross-platform diff view in Edit Location (showing mismatches between GBP/Apple/Meta data)
- **LOC-V2-02**: Bulk apply hours to multiple locations
- **LOC-V2-03**: Duplicate detection on import

### Profile Enhancements

- **PRF-V2-01**: Session management / active devices display
- **PRF-V2-02**: Avatar upload with cropping

## Out of Scope

| Feature | Reason |
|---------|--------|
| Team management | Full module, not a settings tab — separate milestone |
| Billing / subscription | Not relevant to current product stage |
| SSO / 2FA | Security features deferred to production |
| Webhook builder | Developer feature, not in current product scope |
| API key management | Developer feature, not in current product scope |
| Dark mode toggle | Light mode only per CLAUDE.md |
| Granular per-user notification matrix | Over-engineering for prototype |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SET-01 | Phase 1 | Pending |
| SET-02 | Phase 1 | Pending |
| SET-03 | Phase 1 | Complete |
| SET-04 | Phase 1 | Pending |
| SET-05 | Phase 1 | Pending |
| SET-06 | Phase 1 | Complete |
| SET-07 | Phase 1 | Pending |
| XCT-01 | Phase 1 | Complete |
| XCT-02 | Phase 1 | Complete |
| XCT-03 | Phase 1 | Complete |
| PRF-01 | Phase 2 | Pending |
| PRF-02 | Phase 2 | Pending |
| PRF-03 | Phase 2 | Pending |
| LOC-01 | Phase 3 | Pending |
| LOC-02 | Phase 3 | Pending |
| LOC-03 | Phase 3 | Pending |
| LOC-04 | Phase 4 | Pending |
| LOC-05 | Phase 4 | Pending |
| ONB-01 | Phase 5 | Pending |
| ONB-02 | Phase 5 | Pending |
| ONB-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-02*
*Last updated: 2026-03-02 — roadmap finalized, traceability confirmed*
