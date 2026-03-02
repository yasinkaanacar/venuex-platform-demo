---
phase: 02-profile
plan: 03
subsystem: ui
tags: [react, typescript, mui, tailwind, i18n, profile, team-management]

# Dependency graph
requires:
  - phase: 02-profile
    provides: Types (TeamMember, TeamInvite, InviteRow), mock data (mockTeamMembers, mockPendingInvites, profileDataService), translation keys for all team UI strings, SettingsSectionCard/SettingsFieldGroup primitives, profile.tsx wired with ProfileInfoSection + PasswordStubSection
provides:
  - TeamInviteSection: multi-row invite form with Add User, Remove row, Send Invite functionality
  - TeamTableSection: tabbed team roster with avatar, role badges, MUI Switch toggle, edit/delete actions, delete confirmation dialog, empty state for Pending Invites tab
  - profile.tsx: all 4 sections assembled (ProfileInfoSection, PasswordStubSection, TeamInviteSection, TeamTableSection)
affects: [future phases consuming profile components, engineering team building real profile management]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Multi-row form with crypto.randomUUID() stable keys (not array indices) for React reconciliation"
    - "Deterministic avatar color via charCodeAt(0) % colors.length"
    - "MUI Dialog inline in component (not extracted) for delete confirmation — follows StoreSetsTab pattern"
    - "Tab switcher as custom border-b-2 buttons (not shadcn Tabs) for lightweight tab UI"

key-files:
  created:
    - client/src/components/profile/TeamInviteSection.tsx
    - client/src/components/profile/TeamTableSection.tsx
  modified:
    - client/src/pages/profile.tsx

key-decisions:
  - "TeamTableSection uses grid-cols-[1fr_200px_120px_100px_80px] for fixed-width column layout — Name column fluid, others fixed"
  - "Delete confirmation inline MUI Dialog follows Phase 1 StoreSetsTab pattern (not extracted to separate component)"
  - "Avatar initials use first char of firstName + first char of lastName — matches ProfileInfoSection pattern from Plan 02"
  - "SettingsFieldGroup divide-y container wraps invite rows — consistent with other sections using the same primitive"

patterns-established:
  - "Multi-row form pattern: useState<Row[]> + crypto.randomUUID() keys + add/remove/update handlers"
  - "Role badge color mapping: brand_owner=purple, venuex_admin=blue, admin=gray — reuse in any role display"
  - "Deterministic avatar color: name.charCodeAt(0) % AVATAR_COLORS.length — consistent across ProfileInfoSection and TeamTableSection"

requirements-completed: [PRF-04, PRF-05]

# Metrics
duration: 2min
completed: 2026-03-02
---

# Phase 2 Plan 03: Team Invite + Team Table Summary

**Multi-row team invite form (PRF-04) and tabbed team roster with MUI Switch toggles, role badges, and delete confirmation dialog (PRF-05) wired into profile.tsx**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-02T13:33:24Z
- **Completed:** 2026-03-02T13:35:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- TeamInviteSection: multi-row form with stable UUID keys, Add User appends rows, X removes rows, Send Invite validates + shows toast + resets
- TeamTableSection: Team/Pending tabs with member counts, 3 mock members with initials avatars, role badges, MUI Switch toggles, edit/delete icon buttons
- Delete confirmation: inline MUI Dialog with member name interpolation in description, confirm removes from state + toast
- Empty state for Pending Invites tab: Mail icon + description text
- profile.tsx: all 4 sections rendered in order — ProfileInfoSection, PasswordStubSection, TeamInviteSection, TeamTableSection

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TeamInviteSection with multi-row invite form** - `5b0d808` (feat)
2. **Task 2: Create TeamTableSection and wire all 4 sections into profile page** - `0ee0258` (feat)

## Files Created/Modified
- `client/src/components/profile/TeamInviteSection.tsx` - Multi-row invite form with Add User, Remove, Send Invite; uses SettingsSectionCard + SettingsFieldGroup
- `client/src/components/profile/TeamTableSection.tsx` - Tabbed roster with avatar, role badges, MUI Switch toggle, inline MUI delete dialog, empty pending state
- `client/src/pages/profile.tsx` - Added TeamInviteSection + TeamTableSection imports and renders; removed Plan 03 placeholder comment

## Decisions Made
- Used `grid-cols-[1fr_200px_120px_100px_80px]` for team table layout — Name column is fluid, role/status/actions have fixed widths for visual consistency
- Tab switcher built with custom border-b-2 buttons rather than shadcn Tabs — simpler, less overhead for a two-tab use case
- Avatar color deterministic via `charCodeAt(0) % colors.length` — same pattern as ProfileInfoSection in Plan 02 for consistency
- `SettingsFieldGroup` wraps invite rows using its built-in `divide-y` — consistent with Phase 1 form row separator pattern

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 02 profile is complete: all 4 sections (ProfileInfoSection, PasswordStubSection, TeamInviteSection, TeamTableSection) are wired and rendering
- Phase 03 can begin — engineering reference for /profile route is fully specified

---
*Phase: 02-profile*
*Completed: 2026-03-02*
