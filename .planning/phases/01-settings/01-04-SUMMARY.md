---
phase: 01-settings
plan: 04
subsystem: settings/edit-business
tags: [components, settings, form, edit-business, drag-drop]
dependency_graph:
  requires: [01-01, 01-02, 01-03]
  provides: [EditBusinessTab]
  affects: [settings.tsx]
tech_stack:
  added: []
  patterns: [vx-card-composition, drag-drop-logo-upload, 2-col-social-grid, confirmation-checkbox-save]
key_files:
  created:
    - client/src/components/settings/EditBusinessTab.tsx
  modified:
    - client/src/pages/settings.tsx
decisions:
  - Categories section is read-only badges in this prototype — no click-to-edit popover (complexity not needed for spec reference)
  - Logo upload uses custom drag-drop with object URL preview, kept under 40 lines per CONTEXT.md
  - Social media uses const tuple mapping for type safety on platform keys
metrics:
  duration: 4 min
  completed: 2026-03-02
  tasks_completed: 2
  files_created: 1
  files_modified: 1
---

# Phase 1 Plan 04: Edit Business Tab Summary

**One-liner:** Full EditBusinessTab form with four SettingsSectionCard sections — Business Identity (logo upload + fields), Platform Categories (per-platform badge display), Contact Info, and Social Media (2-column grid) — wired into settings.tsx.

## What Was Built

### EditBusinessTab (`client/src/components/settings/EditBusinessTab.tsx`)

A complete form component for the Edit Business tab in Settings. Key implementation details:

**Data flow:**
- `useQuery` with key `['/api/settings/profile']` fetches `BusinessProfile` from `settingsDataService.getBusinessProfile()`
- Local `formData` state initialized from query result via `useEffect`
- `updateField()` and `updateSocialField()` helpers for field changes
- Save: `settingsDataService.updateBusinessProfile(formData)` + `queryClient.invalidateQueries` + success/error toast

**Section 1: Business Identity**
- Custom drag-drop logo upload area with `onDragOver`/`onDrop` handlers + visual feedback
- File input hidden, triggered by click on upload area
- Logo preview when `formData.logoUrl` is set (object URL after drop)
- SettingsFormRow for Brand Name (required), Business Type, Description (3-row textarea)

**Section 2: Platform Categories**
- Four rows for Google, Meta, Apple, Yandex
- Colored letter badges (`bg-blue-500/blue-600/gray-500/red-500`) as platform icons
- Category strings rendered as `bg-gray-100 text-gray-700` badge pills
- Empty state shows italic gray "No categories selected" text
- Read-only display (no click-to-edit) — spec reference only

**Section 3: Contact Information**
- Email (`type="email"`), Phone (`type="tel"`), Website (`type="url"`) fields

**Section 4: Social Media Links**
- 7 platforms in `grid grid-cols-2 gap-x-6` layout
- All fields use `type="url" placeholder="https://..."` inputs
- Typed using `as const` tuple for compile-time platform key safety

**Bottom save area:**
- Checkbox label replacing `{{count}}` with `profile.locationCount`
- Save button disabled when `!confirmChecked || saving`
- Shows "Saving..." during async operation

**Translation:** All strings use `useTranslation()` → `t.settings as any` → `oc?.editBusiness?....` with `|| 'Fallback'` pattern on every access.

### settings.tsx update
`EditBusinessTab` import added and wired to `activeTab === 'editBusiness'` slot. (Note: this wiring was already present in the working tree from a subsequent plan's commit that ran earlier. Verified correct.)

## Verification Results

- No TypeScript errors in any settings-related files
- SettingsSectionCard, SettingsFormRow, SettingsFieldGroup all imported and used
- No shadcn Card/CardContent imports in EditBusinessTab
- useQuery key `['/api/settings/profile']` confirmed
- Four distinct section cards rendered
- Save button disabled-until-checkbox pattern implemented
- Both en.json and tr.json already had all `settings.editBusiness.*` keys from Plan 01-01

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build EditBusinessTab component | f01795d | client/src/components/settings/EditBusinessTab.tsx |
| 2 | Wire EditBusinessTab into settings.tsx | (already present from commit a857bbc) | client/src/pages/settings.tsx |

## Deviations from Plan

**1. [Rule 0 - Already Done] settings.tsx wiring already committed**
- **Found during:** Task 2 verification
- **Issue:** settings.tsx already had EditBusinessTab import and render from commit a857bbc (Plan 07 ran earlier and wired all tabs together)
- **Fix:** No action needed — verified correct wiring is in place
- **Impact:** Task 2 required no code change, just verification

## Self-Check: PASSED

- [x] client/src/components/settings/EditBusinessTab.tsx — FOUND
- [x] Commit f01795d — FOUND
- [x] settings.tsx has EditBusinessTab import on line 4 — VERIFIED
- [x] settings.tsx renders EditBusinessTab on activeTab === 'editBusiness' — VERIFIED
