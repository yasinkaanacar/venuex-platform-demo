# Technology Stack — Settings & Sub-Page Redesigns

**Project:** VenueX Platform — Sub-Page Redesigns Milestone
**Domain:** SaaS settings pages / configuration UI patterns
**Researched:** 2026-03-02
**Confidence note:** Web search and WebFetch were unavailable. All findings are from codebase analysis (HIGH confidence) and training knowledge through August 2025 (MEDIUM confidence for external patterns). Flagged per finding.

---

## What This Research Answers

The VenueX platform already has a locked tech stack (React 18, TypeScript, shadcn/ui, MUI v7, Tailwind, Wouter). This document does NOT re-research that stack. It answers:

1. What UI structural patterns work best for each target page (Settings tabs, Edit/Add/Import Location, Profile, Onboarding)?
2. What component patterns handle the specific content types these pages contain?
3. What form layout conventions apply to dense configuration UIs?
4. What to explicitly avoid?

---

## Recommended Patterns Per Page Type

### 1. Settings Page — Tab-Based Multi-Section Layout

**Pattern: Sticky top-tab navigation with full-width content panels**

The current redesigned platform (segmentsMVP, offline-conversionsMVP) already establishes this as the canonical pattern. Settings should follow it exactly.

```
Layout structure:
  vx-page
  └── sticky top-0 z-40  (tab bar — white bg, border-b)
      └── vx-tabs pill container (px-6 py-3)
  └── vx-page-body
      └── vx-section-stack (per section within each tab)
```

**Tab count:** 4 tabs is the established maximum before needing dropdown overflow. VenueX Settings has exactly 4 (Edit Business, Activity Feed, Store Sets, Data Source & Mapping) — this is appropriate.

**Tab label convention:** Short nouns, no verbs. "Business Info" not "Edit Business Information". "Activity" not "Activity Feed Log".

**Sidebar-within-Settings:** The LEFT sidebar with brand completion progress (63% tracker, checklist) shown in the PROJECT.md is a recognized SaaS onboarding pattern used by Stripe, HubSpot, and Linear. It should be a fixed sidebar column (w-64 or w-72) rendered inside the page body alongside the tab content, NOT a second global nav layer.

```
Settings page body layout:
  ┌─────────────────────────────────────────────────┐
  │ [Tabs bar — full width, sticky]                 │
  ├────────────┬────────────────────────────────────┤
  │ Left panel │ Tab content area                   │
  │ w-64       │ flex-1                              │
  │ Progress   │ vx-section-stack sections           │
  │ checklist  │                                     │
  └────────────┴────────────────────────────────────┘
```

**Confidence:** HIGH (codebase pattern analysis) + MEDIUM (external SaaS benchmark from training data)

---

### 2. Edit Business Tab — Form-Heavy Configuration

**Pattern: Grouped field sections with gray-50 card headers**

The vx-card system already encodes the right answer. Each logical group (Business Name & Category, Address, Hours, Contact Info) becomes one vx-card with a vx-card-header label and a vx-card-body containing fields.

**Field layout rules:**

| Situation | Layout | Why |
|-----------|--------|-----|
| Single short field (e.g. store name) | Full width | Maximizes label-to-field readability |
| Two related short fields (e.g. city + postal code) | 2-column grid | Groups semantically related data |
| Address block | 1-col then 2-col sub-grid | Standard address convention |
| Long text (description, notes) | Full width textarea | Needs horizontal space |
| Toggle/switch settings | Label left, toggle right | Inline, never stacked |

**Label placement:** Always above the field (not inline/placeholder-only). Never rely on placeholder text as the only label — it disappears on focus and fails accessibility requirements.

**Save behavior:** Autosave is table stakes in 2025 for form-heavy SaaS settings. Each section should save independently with a toast confirmation. A single "Save All" at the bottom of a long form is an anti-pattern — users don't know what changed.

```tsx
// Correct: Per-section save with toast
<div className="vx-card">
  <div className="vx-card-header flex items-center justify-between">
    <h3>Business Info</h3>
    <Button size="sm" onClick={handleSave}>Save</Button>
  </div>
  <div className="vx-card-body vx-surface-muted">
    {/* fields */}
  </div>
</div>
```

**Form library:** React Hook Form (already in the stack). Use `register()` + `handleSubmit()`. Do NOT wire every keystroke to a save call — debounce or use section-level submit.

**Confidence:** HIGH (codebase) + MEDIUM (training data, RHF docs)

---

### 3. Activity Feed Tab — Log List Pattern

**Pattern: Reverse-chronological list with filter bar, no infinite scroll needed at prototype stage**

Activity feeds in SaaS are table-adjacent but NOT tables — they are event streams. Key conventions:

| Element | Pattern |
|---------|---------|
| Entry structure | Icon (event type) + title + timestamp + optional detail link |
| Status coloring | Match existing VenueX badge colors (green=success, red=error, amber=warning, blue=info) |
| Grouping | Group by date ("Today", "Yesterday", "March 1") — reduces cognitive load |
| Filtering | Simple filter row (event type dropdown + date range) — no complex facets needed |
| Empty state | Explicit empty state with icon and descriptive text — never an empty list |
| Pagination | Load more button (not infinite scroll) — simpler to implement and more predictable |

**Component structure:**
```
ActivityFeed
├── FilterRow (vx-filter-row)
├── DateGroup ("Today")
│   ├── ActivityEntry
│   ├── ActivityEntry
└── DateGroup ("Yesterday")
    └── ActivityEntry
```

Each `ActivityEntry` = a single `div` row inside a vx-card-body white inner section. Do NOT put each entry in its own Card — too much visual weight.

**Confidence:** MEDIUM (training data on activity feed UX patterns, cross-referenced with existing VenueX component patterns)

---

### 4. Store Sets Tab — CRUD List Pattern

**Pattern: Inline-editable list with add/delete row actions, no modal needed for simple sets**

Store sets are named groups of locations. This is a classic "tag/group manager" pattern:

| Element | Pattern |
|---------|---------|
| List display | Table-adjacent list — name column, location count badge, action column |
| Create | Inline add row at the top (not modal) for simple creates. Modal for sets with complex membership editing |
| Edit name | Click-to-edit inline — click the name, it becomes an input, blur saves |
| Delete | Confirm inline (row-level confirmation: "Delete?" → "Yes / Cancel" appears in place) |
| Membership editing | Opens drawer or dialog showing location multi-select |
| Empty state | Explicit empty with "Create your first Store Set" CTA |

**The key pattern:** Avoid modals for simple operations. The Segments module already uses `SegmentBuilderDialog` for complex operations — Store Sets are simpler, so prefer inline editing where possible.

**Component:** Use the vx-card container with a vx-card-header that has the "Add Store Set" button on the right, and list rows inside the vx-card-body.

**Confidence:** MEDIUM (training data on inline CRUD patterns, aligned with existing codebase conventions)

---

### 5. Data Source & Mapping Tab — Card-Based Connection Setup

**Pattern: Platform connection cards (connect/connected/error states) + mapping table below**

This tab already exists in the codebase with `DataPipelineStatus` as a reference component. The card-based approach (each platform = one card with status, last sync, action button) is the right pattern:

```
DataSource tab:
├── Section: "Ingestion Sources" (vx-card)
│   └── Grid of source cards (API / SFTP)
│       └── Each card: type badge, status dot, last sync, configure button
└── Section: "Field Mapping" (vx-card)
    └── Table: source field → VenueX field → transformation
```

**Connection state machine** per card:
- `disconnected`: Gray border, "Connect" CTA, no status dot
- `connecting`: Blue pulsing dot, spinner, disabled button
- `connected`: Green dot, last sync timestamp, "Configure" secondary button
- `error`: Red dot, error message, "Reconnect" CTA

This mirrors the `getSourceStatusDot()` pattern already in `DataPipelineStatus.tsx` — reuse it.

**Confidence:** HIGH (codebase — DataPipelineStatus.tsx and mock-pipeline-data.ts analyzed directly)

---

### 6. Edit Location Page — Detail/Edit Hybrid

**Pattern: Full-width form with left sticky metadata panel**

Edit Location is a record detail page, not a settings page. The standard 2025 pattern for this:

```
┌────────────────────────────────────────────────────┐
│ Page header: "Edit Location — Beyoğlu Mağazası"   │
│ [Breadcrumb] [Save button — top right]             │
├──────────────┬─────────────────────────────────────┤
│ Metadata     │ Tabbed field groups                 │
│ panel        │ [Basic Info] [Hours] [Media] [Platforms]
│ w-64         │                                     │
│ Status       │ vx-card per group                   │
│ Platforms    │                                     │
│ Quick stats  │                                     │
└──────────────┴─────────────────────────────────────┘
```

The left metadata panel shows: business status badge, platform sync status (Google/Meta/Apple), quick stats (review count, rating). This panel stays fixed while scrolling the form.

**Tabs within Edit Location** (4 max, same `vx-tabs` pill pattern):
1. Basic Info (name, address, category, hours)
2. Media (photos, cover image)
3. Platforms (per-platform field overrides)
4. History (edit log — same activity feed pattern as above)

**Form fields:** Same rules as Edit Business above. Use `react-hook-form` + zod validation.

**Confidence:** MEDIUM (training data on location management SaaS patterns, e.g. Yext, Uberall, Brightlocal)

---

### 7. Add Location Page — Wizard/Stepper Pattern

**Pattern: Linear multi-step form with step indicator header**

"Add Location" is a creation flow, not an editing form. Creation flows benefit from a stepper because:
- Reduces overwhelming first-view (all fields at once)
- Forces logical ordering (you need an address before you configure platforms)
- Gives progress feedback

**Step structure (recommended 4 steps):**
1. Basic Info (name, address, category)
2. Hours & Contact
3. Platform Connections (which platforms to publish to)
4. Review & Confirm

**Step indicator:** Horizontal step bar at the top of the page (not inside a card). Each step = numbered circle + label. Current step is highlighted blue, completed steps show a checkmark.

**Navigation:** "Back" and "Next" buttons at the bottom of each step. Last step shows "Save Location" instead of "Next". No skip — all steps are required for a valid location.

**Validation:** Validate per-step on "Next" click (not on blur). This keeps the form friendly during first fill-in. Use `react-hook-form`'s `trigger()` method scoped to current-step fields.

```tsx
// Step validation pattern
const handleNext = async () => {
  const isValid = await trigger(STEP_FIELDS[currentStep]);
  if (isValid) setCurrentStep(s => s + 1);
};
```

**Confidence:** MEDIUM (well-established multi-step form pattern, React Hook Form trigger() approach is documented and stable as of v7)

---

### 8. Import Locations Page — Upload + Preview + Confirm Flow

**Pattern: 3-phase linear flow (Upload → Validate → Confirm) on a single page**

Import is a distinct workflow that should NOT be a wizard with separate routes — keep it on one page with phase state.

```
Phase 1 — Upload:
  ├── Drag-and-drop file zone (with click-to-browse fallback)
  ├── Download template link
  └── Supported formats (CSV, XLSX)

Phase 2 — Validation Preview:
  ├── Summary stats bar: X rows found, Y valid, Z errors
  ├── Table preview: first 10 rows with validation status per row
  │   └── Error rows highlighted in red with tooltip on error icon
  └── "Fix errors before importing" note if errors > 0

Phase 3 — Confirm:
  ├── "Import X locations?" confirmation card
  ├── Existing location conflict handling (merge / skip / overwrite choice)
  └── "Start Import" button → shows progress indicator
```

**File upload:** The stack already has MUI and shadcn — use a custom drag-and-drop zone (no additional library needed). The pattern is: `<input type="file" ref={} hidden>` + a styled div that handles `onDragOver`/`onDrop`.

**Validation table:** Use the existing vx-card + table pattern. NOT a data grid — a simple `<table>` inside the vx-card-body is sufficient.

**Conflict resolution:** This is the most complex part. Present as a radio choice per-import (not per-row): "Skip existing", "Update existing", "Import all as new". This matches the `LocationConflictResolutionDialog` pattern already in the codebase.

**Confidence:** HIGH (conflict dialog pattern analyzed in codebase — `LocationConflictResolutionDialog.tsx` exists) + MEDIUM (upload flow pattern from training data)

---

### 9. Profile Page — Simple Single-Column Settings

**Pattern: Single-column, no tabs needed, linear scroll**

Profile is the simplest page. It has:
- Avatar/photo upload
- Name, email, language preference
- Password change
- Notification preferences (already exists in current settings.tsx)

No tabs needed — use vertically stacked vx-cards. Each card = one logical group. Total page width: `max-w-2xl mx-auto` (narrower than other pages — profile forms feel cramped at full width).

**Avatar upload:** Circular preview + "Change Photo" button. On click: file input opens, selection shows preview, "Save" commits. No cropper needed for prototype.

**Language toggle:** Already exists in the header. On profile page, show as a toggle/select too — but make it clear it's a global setting.

**Confidence:** MEDIUM (standard profile page conventions, well-established since 2015+)

---

### 10. Onboarding/Setup Page — Step Sidebar + Content Panel

**Pattern: Fixed left step nav + right content panel (wizard with sidebar)**

`onboarding-unified.tsx` already implements a version of this. The redesign should match the vx-card system. The pattern used by Linear, Notion, and Stripe onboarding:

```
┌─────────────────────────────────────────────────────┐
│ Header: VenueX logo + "Setup" title                 │
├────────────────┬────────────────────────────────────┤
│ Step sidebar   │ Current step content               │
│ w-64 bg-white  │ vx-card sections                   │
│                │                                    │
│ Step 1 ✓       │ Step title + subtitle              │
│ Step 2 ●       │ Task list or form fields           │
│ Step 3 ○       │ "Mark Complete" / "Next Step" CTA  │
│ Step 4 ○       │                                    │
└────────────────┴────────────────────────────────────┘
```

**Step states:** Completed (green check), Active (blue filled dot), Upcoming (gray empty dot). Optional steps get an "(Optional)" badge on their sidebar item.

**Completion tracker:** The existing 63% progress bar referenced in PROJECT.md goes into the SIDEBAR, not the main content. It summarizes overall completion across all steps.

**Confidence:** HIGH (onboarding-unified.tsx analyzed directly) + MEDIUM (external SaaS onboarding patterns)

---

## Component Patterns Reference

### Badge Color Convention (apply universally)

| Status | Colors | Usage |
|--------|--------|-------|
| Active / Success / Connected | `bg-green-100 text-green-800` | Working state |
| Warning / Pending | `bg-amber-100 text-amber-800` | Needs attention |
| Error / Failed | `bg-red-100 text-red-800` | Broken state |
| Inactive / Draft | `bg-gray-100 text-gray-600` | Off state |
| Info / Processing | `bg-blue-100 text-blue-800` | In-progress state |

This is already established in `SegmentListTable.tsx` STATUS_STYLES. Reuse the same map pattern everywhere.

### Action Button Placement

| Page type | Primary action location |
|-----------|------------------------|
| Settings tab with form | Top-right of each vx-card-header |
| CRUD list | Top-right of vx-card-header (above list) |
| Detail/edit page | Top-right of page header (sticky) |
| Wizard step | Bottom-right of step content panel |
| Import flow | Bottom-right, gated by validation state |

Never put Save buttons at the very bottom of long scrolling pages. Users lose context about what they're saving.

### Empty State Template

Every list, table, or feed must handle empty:

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <Icon className="w-10 h-10 text-gray-300 mb-3" />
  <p className="text-sm font-medium text-gray-600">No [items] yet</p>
  <p className="text-xs text-gray-400 mt-1">
    [Short explanation of why it's empty + what to do]
  </p>
  <Button size="sm" className="mt-4">Create [item]</Button>
</div>
```

### Drawer vs Modal vs Inline — Decision Rule

| Use case | Pattern | Why |
|----------|---------|-----|
| Complex multi-field create/edit | Dialog (modal) | Focused, prevents accidental navigation |
| Record detail preview | Drawer (right side) | Keeps list context visible |
| Simple rename / single field | Inline edit | Lowest friction |
| Destructive confirmation | Dialog (modal) | Forces explicit decision |
| Multi-step flow within page | Panel swap (same page state) | Import, onboarding |

The existing codebase uses `SegmentDetailDrawer` (drawer) and `SegmentBuilderDialog` (modal) — follow this precedent.

### Form Validation Display

Show errors:
- Below the field (not in a banner at the top)
- In `text-xs text-red-600` text
- On blur (not on every keystroke for required fields)
- On submit attempt for all untouched required fields

Never show success states for individual fields (green borders on valid inputs) — visual noise for little benefit.

**Confidence:** HIGH (codebase analysis + established React Hook Form conventions)

---

## What NOT to Do

### Anti-Pattern 1: Single Monolithic Settings Page
**What goes wrong:** Putting all settings (business info + notifications + users + integrations) in one scrolling page without tabs or sections.
**Why it fails:** At the scale VenueX Settings has reached (4 distinct functional areas), a single scroll becomes disorienting. Users can't skim to the section they need.
**Instead:** Tab-based navigation — one tab per functional domain.

### Anti-Pattern 2: Full-Width Forms
**What goes wrong:** Text inputs that stretch across the entire page (e.g., `w-full` inside a `max-w-7xl` container).
**Why it fails:** Input fields over ~500px wide are uncomfortable to fill out — the eye loses track of where text starts. Label-to-field scanning breaks down.
**Instead:** `max-w-2xl` or `max-w-3xl` container for form-heavy pages, or two-column grid for fields that logically pair.

### Anti-Pattern 3: Modal-First CRUD
**What goes wrong:** Every create, edit, and delete opens a modal — even for simple operations like renaming a store set.
**Why it fails:** Modals add a layer of friction for high-frequency operations. They also block the list behind them, losing row context.
**Instead:** Use inline editing for simple single-field changes. Reserve modals for complex multi-field operations.

### Anti-Pattern 4: Flat Activity Log
**What goes wrong:** Activity feed displayed as an undifferentiated flat list with no date grouping or filtering.
**Why it fails:** Temporal context is lost. "When did this happen?" becomes hard to answer by scanning.
**Instead:** Group by date ("Today", "Yesterday", "March 1"), always show relative time in the entry, and provide filter by event type.

### Anti-Pattern 5: File Upload Without State Feedback
**What goes wrong:** File input triggers upload immediately on select with no preview, no validation feedback, and no progress indicator.
**Why it fails:** Users can't verify they selected the right file, can't see errors until the upload completes (or fails), and can't cancel.
**Instead:** Three-phase flow — select + preview, validate, confirm. Never auto-upload on file select.

### Anti-Pattern 6: New Navigation Layer for Sub-Pages
**What goes wrong:** Adding a secondary sidebar navigation for Settings, or changing the global sidebar behavior.
**Why it fails:** The existing sidebar is the global nav. Sub-pages that add their own nav layer create two competing navigation hierarchies.
**Instead:** The Settings left panel (completion progress) is supplementary content, not navigation. The four tabs ARE the Settings navigation.

**Confidence for anti-patterns:** HIGH (derived from direct analysis of current VenueX design decisions + MEDIUM from established SaaS design heuristics)

---

## Existing Stack — Reuse Decisions

No new libraries needed. Specific reuse decisions for each page:

| Need | Use | Location in codebase |
|------|-----|---------------------|
| Tab navigation | `vx-tabs` + `vx-tab` + `vx-tab-active` CSS classes | `index.css` |
| Card container | `vx-card`, `vx-card-header`, `vx-card-body`, `vx-surface-muted` | `index.css` |
| Status badges | Tailwind color pairs (bg-green-100 text-green-800 etc.) | `SegmentListTable.tsx` STATUS_STYLES |
| CRUD table | `vx-th`, `vx-td` CSS classes + native `<table>` | `index.css` |
| Form inputs | shadcn `<Input>`, `<Select>`, `<Switch>` | `@/components/ui/` |
| Form state | React Hook Form (already installed) | Existing hooks |
| Validation | Zod (already installed) | `shared/schema.ts` |
| Toasts | `showToast({ type, title, description })` | `@/lib/toast` |
| Dialogs | MUI `Dialog` wrapped with shadcn-style layout | `setup3B.tsx`, `SegmentBuilderDialog.tsx` |
| Drawers | Right-side drawer pattern | `SegmentDetailDrawer.tsx` |
| Pipeline status dots | `getSourceStatusDot()` pattern | `DataPipelineStatus.tsx` |
| File input | Native `<input type="file">` + custom styled div | No existing, build from scratch |
| Progress bar | shadcn `<Progress>` or Tailwind div-based | `@/components/ui/progress` |
| Breadcrumbs | Custom implementation needed | None existing — build simple |

**File upload (new):** No third-party uploader needed. A custom drag-and-drop zone with 40 lines of Tailwind is sufficient for the prototype. Pattern:

```tsx
const [dragging, setDragging] = useState(false);
const inputRef = useRef<HTMLInputElement>(null);

<div
  className={cn(
    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
    dragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
  )}
  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
  onDragLeave={() => setDragging(false)}
  onDrop={handleDrop}
  onClick={() => inputRef.current?.click()}
>
  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
  <p className="text-sm text-gray-600">Drop your CSV here, or click to browse</p>
  <input ref={inputRef} type="file" accept=".csv,.xlsx" hidden onChange={handleFileSelect} />
</div>
```

**Confidence:** HIGH (codebase analysis — all libraries confirmed installed)

---

## Translation Keys Convention

All new strings must go into both `en.json` and `tr.json`. Follow established key structure:

```json
// en.json additions — Settings page redesign
{
  "settings": {
    "tabs": {
      "editBusiness": "Business Info",
      "activityFeed": "Activity",
      "storeSets": "Store Sets",
      "dataSource": "Data Source"
    },
    "editBusiness": {
      "title": "Business Information",
      "sections": {
        "identity": { "title": "Identity", "desc": "..." },
        "contact": { "title": "Contact", "desc": "..." }
      }
    }
  }
}
```

**Key rule:** Keep existing key paths. The current `settings.notifications.*` tree already exists — don't restructure it, add alongside it.

---

## Confidence Assessment

| Area | Level | Basis |
|------|-------|-------|
| VenueX vx-card component system | HIGH | Direct codebase analysis |
| Tab navigation pattern | HIGH | segmentsMVP.tsx, offline-conversionsMVP.tsx analyzed |
| Form library (React Hook Form) | HIGH | Already installed, used in project |
| Activity feed grouping pattern | MEDIUM | Training data (NNGroup, Stripe, Linear conventions) — web verification unavailable |
| Wizard/stepper for Add Location | MEDIUM | Training data (well-established pattern, RHF trigger() is stable) |
| Import flow 3-phase structure | HIGH (conflict dialog) + MEDIUM (upload) | LocationConflictResolutionDialog in codebase; upload from training data |
| External SaaS benchmark patterns | MEDIUM | Training data through August 2025 — web search unavailable for current verification |
| Anti-patterns | HIGH | Derived from direct codebase analysis of design decisions |

---

## Sources

- Codebase: `client/src/index.css` — vx-* CSS class definitions (HIGH)
- Codebase: `client/src/pages/segmentsMVP.tsx` — tab pattern reference (HIGH)
- Codebase: `client/src/pages/offline-conversionsMVP.tsx` — filter + tab pattern (HIGH)
- Codebase: `client/src/pages/settings.tsx` — current notification settings implementation (HIGH)
- Codebase: `client/src/components/offline-conversions/DataPipelineStatus.tsx` — status dot pattern (HIGH)
- Codebase: `client/src/components/segments/SegmentListTable.tsx` — CRUD list + badge pattern (HIGH)
- Codebase: `client/src/pages/onboarding-unified.tsx` — wizard sidebar pattern (HIGH)
- Codebase: `client/src/pages/setup3B.tsx` — MUI dialog + integration cards pattern (HIGH)
- Training data: SaaS settings page UX conventions (Stripe, Linear, HubSpot, Vercel patterns) — MEDIUM (web verification unavailable, August 2025 cutoff)
- Training data: React Hook Form v7 `trigger()` API — MEDIUM (well-established, stable API)
