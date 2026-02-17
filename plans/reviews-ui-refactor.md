# Reviews UI/UX Refactor Plan

Goal: Refactor `client/src/pages/reviewsMVP.tsx` to match the shared visual language and component structure used in Overview/Locations/Offline Conversions pages (vx layout tokens, spacing, cards, inputs, tabs, and reusable section patterns).

## Status
- Started: 2026-02-03
- Current phase: Planning

## Chunked Plan

### Chunk 1 — Page Skeleton + Tabs + Global Spacing
- Replace outer wrapper with `vx-page` and `vx-page-body`
- Normalize top tab bar to `vx-tabs` / `vx-tab` and match sticky behavior
- Replace ad‑hoc spacing (`mx-6 mt-6`) with `vx-section` / `vx-section-stack`
- Ensure section headers align with other pages (font size/weight/spacing)
- Align component boundaries to match other pages (page shell -> sections -> cards)

Status: Done (2026-02-03)
Summary:
- Converted page wrapper to `vx-page` and main content to `vx-page-body`
- Normalized sticky tab bar to `vx-tabs` / `vx-tab` and `vx-section` padding
- Replaced `mx-6 mt-6` with `vx-section-stack` for tab content spacing

### Chunk 2 — Overview Tab: Filters + KPI Cards + Summary Blocks
- Convert filter controls to `vx-filter-row` + `vx-input` / `vx-select` / `vx-button`
- Update date range control to match shared select styling
- Convert KPI cards to `vx-card` / `vx-card-header` / `vx-card-body`
- Replace `Separator` with `vx-divider` where appropriate
- Unify metric typography and spacing
- Extract/align subcomponents to mirror other pages (e.g., KPI card blocks, summary panels)

Status: Done (2026-02-03)
Summary:
- Rebuilt Overview filters into a `vx-card` with `vx-filter-row` and `vx-select` controls
- Converted KPI, Weekly Summary, Themes, and Leaderboard blocks to `vx-card` structure
- Replaced separators with `vx-divider` and standardized toggles to `vx-tabs`

### Chunk 3 — Inbox Tab: Filters + Review List/Details
- Standardize filter bar with `vx-filter-row`
- Convert review list cards and detail panel to `vx-card` structure
- Align action buttons to `vx-button` / `vx-icon-button`
- Normalize spacing between list and details panels
- Restructure list/detail sections to match component layout patterns used in Locations/Overview

Status: Done (2026-02-03)
Summary:
- Rebuilt Inbox filter bar as a `vx-card` with `vx-filter-row`, `vx-select`, and `vx-tabs`
- Converted review list/detail panels to `vx-card` structure with muted surfaces
- Normalized list row styling and action buttons to `vx-button` sizing

### Chunk 4 — Locations Tab: Table + Leaderboard + Side Panels
- Apply `vx-th` / `vx-td` to tables
- Convert location/leaderboard panels to `vx-card` layout
- Standardize control buttons and selects
- Normalize grid gaps and section spacing
- Align component hierarchy to existing Locations page patterns (tables, summary cards, side panels)

Status: Done (2026-02-03)
Summary:
- Rebuilt Locations filter bar as `vx-card` + `vx-filter-row` with `vx-select`/`vx-input`
- Converted table container to `vx-card` and applied `vx-th`/`vx-td` styles
- Normalized row hover/stripe behaviors to match other pages

### Chunk 5 — Final Polish + QA
- Cross-check spacing/rhythm vs Overview/Locations/Offline Conversions
- Ensure consistent header hierarchy and muted text styling
- Responsive pass (mobile/tablet)
- Quick visual smoke test across tabs

Status: Done (2026-02-03)
Summary:
- Normalized Inbox grid layout for responsiveness and simplified row badges
- Cleaned unused state/effects/imports and aligned action buttons
- Replaced remaining custom date picker with shared select styling

## Notes
- Update this file at the end of each chunk with:
  - Status change
  - Summary of edits
  - Any follow-up items
