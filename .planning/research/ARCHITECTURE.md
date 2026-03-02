# Architecture Patterns

**Domain:** SaaS platform settings, sub-page forms, and configuration flows
**Researched:** 2026-03-02
**Confidence:** HIGH — derived directly from the existing codebase and established patterns

---

## Context: What We Are Redesigning

Six pages need to be brought into the new design system:

| Page | Route | Shape |
|------|-------|-------|
| Settings | `/settings` | Multi-tab config: Edit Business, Activity Feed, Store Sets, Data Source & Mapping |
| Edit Location | `/locations/:id/edit` | Single-entity form (or drawer) |
| Add Location | `/locations/new` | Single-entity form |
| Import Locations | `/locations/import` | Multi-step wizard |
| Profile | `/profile` | Single-form account settings |
| Onboarding/Setup | `/onboarding` | Multi-step wizard with sidebar checklist |

All pages already exist in some form. The work is visual redesign — not new functionality.

---

## Established Architecture in This Codebase

Before recommending patterns, here is what already works in the redesigned modules:

### Page-Level Pattern (Segments, Reviews, Offline Conversions)

```
Page component (pages/*.tsx)
  └── Tab navigation (sticky, vx-tabs)
  └── vx-page-body
        └── Section components (components/{module}/*.tsx)
              └── vx-card > vx-card-header + vx-card-body vx-surface-muted
                    └── Inner white content areas
```

The page orchestrates tab state and passes nothing complex down — each section component is self-contained, reads from its own mock service, manages its own local state.

### Dialog/Drawer Pattern (SegmentBuilderDialog, DetailsDrawer)

Multi-step flows use MUI Dialog wrapped by shadcn conventions. Step state lives in a local `useReducer`. The parent page only manages `open: boolean`.

### Mock Service Pattern

```
mock-{module}-data.ts (raw data + service class)
  ↓ consumed by
queryClient.ts (URL routing table → service method calls)
  ↓ consumed by
useQuery({ queryKey: ['/api/{module}/{resource}'] })
  ↓ consumed by
Section component or Page component
```

Mutations use `apiRequest('PATCH'|'POST'|'DELETE', url, payload)` + `queryClient.invalidateQueries()`.

### Translation Pattern

Two modes exist in the codebase:
- `useTranslation()` → `t.module.key` (direct object access, used in newer pages like Reviews, Offline Conversions)
- `useLocales()` → `t('module.key')` (path resolver, used in older pages like Settings, Segments)

**CLAUDE.md mandates:** Use `useTranslation()` with direct object access (`t.module as any`) for all new component-level translations. `useLocales()` is unreliable for dynamically added keys.

---

## Recommended Architecture

### Component Boundaries

#### Shared Settings Components (new `components/settings/` folder)

These components are reused across Settings tabs and can be extracted as shared primitives:

| Component | Purpose | Used By |
|-----------|---------|---------|
| `SettingsFormRow` | Label + input in a horizontal row with optional helper text | Edit Business, Profile |
| `SettingsSectionCard` | vx-card wrapper with vx-card-header + title/description slot | All Settings tabs |
| `SettingsFieldGroup` | Groups multiple `SettingsFormRow` under a subheading | Edit Business, Data Source |
| `SettingsToggleRow` | Label + Switch row with optional description | Notification prefs (existing) |
| `ActivityFeedItem` | Single activity log entry: icon, message, timestamp, status | Activity Feed tab |
| `StoreSetCard` | Expandable card for a store set: name, location count, actions | Store Sets tab |
| `DataSourceCard` | Connection card with status indicator, source type badge, actions | Data Source & Mapping tab |

All of these extend the vx-card hierarchy — they are not standalone design system primitives. Do not put them in `components/ui/`.

#### Page-Specific Components

| Page | Folder | Key Components |
|------|--------|----------------|
| Settings | `components/settings/` | `EditBusinessForm`, `ActivityFeed`, `StoreSetList`, `DataSourcePanel` |
| Edit/Add Location | `components/locations2/` | `LocationEditForm` (shared between edit and add flows) |
| Import Locations | `components/locations2/` | `ImportWizard`, `ImportStepUpload`, `ImportStepMap`, `ImportStepReview` |
| Profile | `components/profile/` | `ProfileForm`, `ProfileAvatarSection` |
| Onboarding | `components/onboarding/` | already exists (`steps-sidebar.tsx`) — needs redesign only |

#### No New Shared UI Primitives

Do not create new items in `components/ui/`. All sub-page components go into module folders. The existing `components/ui/` set (Input, Button, Dialog, Sheet, Tabs, Switch, Badge, Separator) covers all needs.

---

### Settings Page Architecture (Most Complex)

The Settings page has a two-panel layout: left sidebar with brand completion tracker + right content area with 4 tabs.

```
settings.tsx (page)
  ├── SettingsSidebar (completion tracker, 63% bar, checklist)
  │     └── purely display, props: { completionPercent, items[] }
  └── SettingsContent (tab shell)
        ├── Tab: Edit Business
        │     └── EditBusinessForm
        │           ├── SettingsSectionCard (Business Identity)
        │           │     └── SettingsFieldGroup (Name, Type, Description, Website)
        │           ├── SettingsSectionCard (Contact)
        │           │     └── SettingsFieldGroup (Phone, Email)
        │           └── SettingsSectionCard (Social Links)
        │                 └── SettingsFieldGroup (meta, google, tiktok links)
        ├── Tab: Activity Feed
        │     └── ActivityFeed
        │           ├── FilterBar (date range, type filter)
        │           └── ActivityFeedItem[] (virtualized list)
        ├── Tab: Store Sets
        │     └── StoreSetList
        │           ├── TopBar (search + "New Store Set" button)
        │           └── StoreSetCard[] (CRUD list)
        └── Tab: Data Source & Mapping
              └── DataSourcePanel
                    ├── DataSourceCard[] (SFTP, API connections)
                    └── FieldMappingSection (column → field mapping table)
```

**Tab state lives in `settings.tsx`.** All form state lives in the individual form components. The page orchestrates tab switching only.

---

### Edit Location / Add Location Architecture

These share a single form component — the difference is whether the form is pre-populated:

```
LocationEditForm
  props: {
    locationId?: string;    // undefined = "add" mode
    initialData?: Location; // undefined = empty form
    onSave: (data: LocationFormData) => void;
    onCancel: () => void;
  }
```

Render pattern — **use a Sheet (slide-over) from the locations list page, not a standalone route.** This matches the existing DetailsDrawer pattern in `components/locations2/DetailsDrawer.tsx`. Adding a new route just to edit one location adds routing complexity for no benefit in a prototype.

If a standalone page is needed, the URL is `/locations/:id/edit` → `LocationEditPage` wraps `LocationEditForm` with breadcrumb navigation.

```
LocationEditForm
  ├── SettingsSectionCard (Core Info: name, store code, status)
  ├── SettingsSectionCard (Address: line1, city, district, postal)
  ├── SettingsSectionCard (Hours: business hours editor)
  ├── SettingsSectionCard (Contact: phone, website)
  └── SettingsSectionCard (Platform Links: GBP, Apple, Meta IDs)
```

Form state: `useState<LocationFormData>` initialized from `initialData`. No React Hook Form needed for the prototype — direct controlled inputs. RHF is the production pattern but adds build complexity with no prototype benefit.

---

### Import Locations Architecture (Multi-Step Wizard)

The existing `onboarding-unified.tsx` uses `useReducer` for multi-step state. Use the same pattern here.

```typescript
type ImportStep = 'upload' | 'map' | 'review' | 'done';

interface ImportState {
  step: ImportStep;
  file: File | null;
  parsedRows: RawRow[];
  columnMappings: Record<string, string>; // csvColumn → locationField
  validRows: LocationFormData[];
  errorRows: { row: number; errors: string[] }[];
}
```

```
ImportWizard (page or Dialog — recommend Dialog opened from LocationsTopBar)
  ├── ImportStepUpload   → file drag-drop, CSV/XLSX
  ├── ImportStepMap      → column mapping table (csv header → location field)
  ├── ImportStepReview   → valid rows count, error count, preview table
  └── ImportStepDone     → success state with "Go to Locations" CTA
```

Step navigation: Previous/Next buttons in wizard footer. No URL routing per step — all state in `useReducer` inside the dialog.

**Render location:** Dialog triggered from the locations page top bar. Not a standalone route.

---

### Onboarding/Setup Architecture

The existing `onboarding-unified.tsx` is a large monolithic page (~1000 lines). The redesign should extract sub-components but keep the same `useReducer` pattern.

```
OnboardingUnified (page — standalone, no sidebar)
  ├── OnboardingHeader (logo, skip link)
  ├── OnboardingProgressBar (step counter)
  └── OnboardingStepShell
        ├── StepSidebar (step list with completion dots)
        └── StepContent (rendered per currentStepId)
              ├── AccountStep → (company info form)
              ├── StoreStep  → (platform connection cards)
              ├── AttributionStep → (data source wizard)
              └── InventoryStep  → (merchant connection cards)
```

Each `*Step` component receives `onComplete: () => void` and `onSkip?: () => void`. The parent dispatches to the reducer. No prop drilling of the full step state.

---

### Profile Page Architecture

Simplest of all the pages. Single-section form.

```
profile.tsx (page, renders inside sidebar layout)
  └── ProfilePageContent
        ├── ProfileAvatarSection (avatar, name, role badge)
        └── SettingsSectionCard[] (same shared component as Settings)
              ├── Personal Info (name, email — read-only in prototype)
              ├── Preferences (language toggle EN/TR, timezone)
              └── Security (change password placeholder — "coming soon" state)
```

---

## Data Flow

### Form State Flow

```
Page/Dialog (tab state, open state)
  └── Form Component (all form field state — useState)
        ├── Reads initial data from mock service via useQuery
        └── On save: calls apiRequest() → mock service method → queryClient.invalidateQueries()
```

No form state crosses component boundaries except through explicit callbacks (`onSave(data)`). Parent components do not know field-level state.

### Mock Service Integration

Each redesigned page needs a corresponding mock service. Recommended structure:

```typescript
// lib/mock-settings-data.ts
export const mockBusinessProfile: BusinessProfile = { ... };
export const mockActivityFeed: ActivityFeedEntry[] = [ ... ];
export const mockStoreSets: StoreSet[] = [ ... ];
export const mockDataSources: DataSource[] = [ ... ];

export const settingsDataService = {
  getBusinessProfile: async (): Promise<BusinessProfile> => { ... },
  updateBusinessProfile: async (data: Partial<BusinessProfile>): Promise<BusinessProfile> => { ... },
  getActivityFeed: async (filters?: ActivityFeedFilters): Promise<ActivityFeedEntry[]> => { ... },
  getStoreSets: async (): Promise<StoreSet[]> => { ... },
  createStoreSet: async (data: NewStoreSet): Promise<StoreSet> => { ... },
  updateStoreSet: async (id: string, data: Partial<StoreSet>): Promise<StoreSet> => { ... },
  deleteStoreSet: async (id: string): Promise<void> => { ... },
  getDataSources: async (): Promise<DataSource[]> => { ... },
};
```

Register all endpoints in `queryClient.ts` following the existing URL routing table pattern.

### TypeScript Types

New types go in `lib/types/settings.ts`:

```typescript
// lib/types/settings.ts

interface BusinessProfile {
  businessName: string;
  businessType: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    pinterest?: string;
    linkedin?: string;
  };
}

interface ActivityFeedEntry {
  id: string;
  type: 'sync' | 'update' | 'error' | 'warning' | 'info';
  module: 'locations' | 'reviews' | 'catalog' | 'offline_conversions' | 'segments';
  message: string;
  timestamp: string;
  actor?: string; // user or system
  metadata?: Record<string, string | number>;
}

interface StoreSet {
  id: string;
  name: string;
  description?: string;
  locationCount: number;
  locationIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface DataSource {
  id: string;
  type: 'sftp' | 'api';
  label: string; // generic: "SFTP Connection 1", not "Boyner POS"
  status: 'connected' | 'error' | 'pending';
  lastSync?: string;
  fieldMappings: FieldMapping[];
}

interface FieldMapping {
  sourceField: string;   // column name in source file/API
  targetField: string;   // VenueX field name
  required: boolean;
}
```

New types for Location forms:

```typescript
// Extends existing Location type from lib/types/locations.ts
interface LocationFormData {
  name: string;
  code: string;
  addressLine: string;
  city: string;
  district: string;
  postalCode: string;
  phone: string;
  website?: string;
  hoursLabel: string;
  channels: {
    gbpId?: string;
    appleId?: string;
    metaId?: string;
  };
}
```

---

## Suggested Build Order

Build in this order — each phase shares components with the next:

### Phase 1: Settings Page (highest complexity, sets shared components)

Build `components/settings/` folder with shared primitives first. Settings is the most complex page and will produce components reused in all subsequent pages.

1. `SettingsSectionCard` — used everywhere
2. `SettingsFormRow` + `SettingsFieldGroup` — used in Edit Business, Profile, Edit Location
3. Settings page skeleton with left sidebar + tab shell
4. Edit Business tab (form-heavy, tests form row components)
5. Activity Feed tab (tests list pattern)
6. Store Sets tab (tests CRUD list pattern)
7. Data Source & Mapping tab (tests connection card pattern)

### Phase 2: Profile Page

Reuses `SettingsSectionCard`, `SettingsFormRow`, `SettingsFieldGroup` from Phase 1.
New: `ProfileAvatarSection` only.
Build time: ~0.5x Settings.

### Phase 3: Edit Location + Add Location

Reuses `SettingsSectionCard`, `SettingsFormRow`, `SettingsFieldGroup`.
New: `LocationEditForm`, `LocationFormData` type.
These two share one form component — build once, test both.

### Phase 4: Import Locations

New: `ImportWizard` + 4 step components.
No shared component overlap with above, but uses the same vx-card design system.
Build as a Dialog triggered from the Locations page top bar.

### Phase 5: Onboarding/Setup Redesign

Independent layout (no sidebar). Extracts sub-components from existing monolith.
Uses no shared settings components.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Standalone Routes for Edit/Add Location

**What:** Creating `/locations/new` and `/locations/:id/edit` as full page routes with their own sidebar+header layout.

**Why bad:** Breaks the flow of the locations list — user loses context. Engineering has to add 2 new routes and test navigation. The existing pattern (DetailsDrawer as Sheet) already covers this.

**Instead:** Open `LocationEditForm` inside a Sheet (shadcn `sheet.tsx`) from the existing Locations page. Same pattern as `DetailsDrawer`.

---

### Anti-Pattern 2: Putting Settings Form State in Page-Level State

**What:** Settings page managing every form field in its top-level state, passing values down as props.

**Why bad:** Settings has 4 tabs, each with 10-20 fields. Page-level state becomes a 40+ field object. Prop drilling kills readability. Adding a field requires touching 3 files.

**Instead:** Each tab's form component manages its own state. The page only tracks `activeTab: string`. `onSave` callback surfaces only the final submitted data.

---

### Anti-Pattern 3: One Translation Key Object for All Settings Tabs

**What:** `settings.editBusiness.fields.name`, `settings.activityFeed.filters.type`, `settings.storeSets.actions.create` all jammed into one flat section.

**Why bad:** `en.json` and `tr.json` get hard to navigate. Key collisions become likely.

**Instead:** Sub-namespace by tab: `settings.editBusiness.*`, `settings.activityFeed.*`, `settings.storeSets.*`, `settings.dataSource.*`. Each tab component accesses only its own sub-namespace.

---

### Anti-Pattern 4: New React Hook Form Dependency

**What:** Introducing RHF + Zod validation schemas for prototype forms.

**Why bad:** Production will use RHF — but adding it to the prototype just for form management adds build complexity with no design benefit. The prototype needs to look right, not validate correctly.

**Instead:** Controlled `useState` for all form fields. Mark fields as required in types. Engineering will add RHF when connecting real backends.

---

### Anti-Pattern 5: Importing MUI TextField Directly in New Components

**What:** Using MUI `TextField` or `Select` directly in new settings/profile components.

**Why bad:** The codebase wraps MUI behind shadcn/ui primitives (`Input`, `Select`). Direct MUI usage bypasses Tailwind styling and breaks visual consistency.

**Instead:** Always use shadcn/ui primitives from `@/components/ui/`. Only use MUI directly in Dialog/Tooltip wrappers where shadcn has no equivalent, matching the existing pattern.

---

## Component Interaction Diagram

```
App.tsx (Router)
│
├── /settings → settings.tsx
│     ├── SettingsSidebar (completion %)
│     └── [Tab switch]
│           ├── EditBusinessForm → SettingsSectionCard[] → SettingsFormRow[]
│           ├── ActivityFeed    → ActivityFeedItem[]
│           ├── StoreSetList    → StoreSetCard[] (CRUD)
│           └── DataSourcePanel → DataSourceCard[] + FieldMappingSection
│
├── /locations → locations2.tsx (existing)
│     └── [+ New Location button] → Sheet overlay → LocationEditForm
│     └── [Import button]        → Dialog        → ImportWizard (4 steps)
│     └── [Row click → Edit]     → Sheet overlay → LocationEditForm (pre-filled)
│
├── /profile → profile.tsx (new)
│     └── ProfileAvatarSection + SettingsSectionCard[]
│
└── /onboarding → onboarding-unified.tsx (existing — redesign in place)
      ├── OnboardingHeader
      ├── OnboardingProgressBar
      └── OnboardingStepShell
            ├── StepSidebar
            └── StepContent → [AccountStep | StoreStep | AttributionStep | InventoryStep]
```

---

## Scalability Considerations

| Concern | Current (Prototype) | Production |
|---------|---------------------|------------|
| Form validation | None — prototype shows shape only | React Hook Form + Zod schemas |
| Settings persistence | Mock service with in-memory state | PATCH /api/settings/business-profile |
| Import wizard file parsing | Client-side CSV/XLSX parse (papaparse) | Server-side pre-validation + async job |
| Store Sets | CRUD against mock array | CRUD against /api/store-sets with real GBP group mapping |
| Activity Feed | Static mock array | Real-time feed from event log table |
| Profile | Read-only mock | Edit flow with email verification |

---

## Sources

- Derived from direct codebase analysis: `settings.tsx`, `onboarding-unified.tsx`, `segmentsMVP.tsx`, `locations2.tsx`, `DetailsDrawer.tsx`, `FieldManagementDialog.tsx`, `SegmentBuilderDialog.tsx`, `SegmentListTable.tsx`
- Design system conventions from `index.css` (vx-card, vx-tabs, vx-surface-muted class definitions)
- Mock service pattern from `queryClient.ts`, `mock-segments-data.ts`
- Type conventions from `lib/types/locations.ts`, `lib/types/segments.ts`
- CLAUDE.md: component naming, token index, translation access patterns, mock data standards
- Confidence: HIGH — all patterns verified against working code in this repository
