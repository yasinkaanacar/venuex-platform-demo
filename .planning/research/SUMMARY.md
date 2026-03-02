# Project Research Summary

**Project:** VenueX Platform — Settings & Sub-Page Redesigns Milestone
**Domain:** SaaS settings pages, form-heavy sub-pages, onboarding flows, multi-location brand management
**Researched:** 2026-03-02
**Confidence:** HIGH

## Executive Summary

This milestone redesigns six existing pages — Settings (4-tab), Edit Location, Add Location, Import Locations, Profile, and Onboarding/Setup — to conform with the visual and architectural patterns established by the already-redesigned modules (Segments, Reviews, Offline Conversions). The core work is visual consistency and component alignment, not new functionality. Every page already exists in some form; the task is bringing them into the `vx-card` / `vx-surface-muted` hierarchy and aligning their architecture with the plug-and-play principle. The most important architecture decision is building Settings first: it produces shared primitives (`SettingsSectionCard`, `SettingsFormRow`, `SettingsFieldGroup`) that all subsequent pages directly reuse, making it the dependency root of the entire milestone.

The recommended approach is a five-phase build ordered by component dependency rather than page importance. Settings ships first. Profile is second because it is simplest and validates the shared primitive reuse pattern with minimal risk. Edit + Add Location share a single form component and go third. Import Locations is structurally independent and goes fourth. Onboarding goes last because it requires a prerequisite cleanup step (four competing setup page versions must be deprecated before any new work begins). The tech stack is fully locked — React 18, TypeScript, shadcn/ui, MUI v7, Tailwind, Wouter. No new libraries are needed. All interaction patterns (drag-and-drop, CRUD, step wizards, connection status cards) are achievable with tools already installed.

The primary risk is pattern drift: the existing `settings.tsx` uses the OLD shadcn Card layout and `useLocales()` for translations — both are easy to accidentally copy when starting new pages. Any new component that imports shadcn `Card` as a layout primitive, or calls `useLocales()` for new keys, is building against the wrong reference. A secondary risk is translation key drift between `en.json` and `tr.json`: with 1,439 lines already in `en.json`, new keys are easy to add to one file and forget in the other. Both risks are preventable with a simple rule: always start from the three-layer CLAUDE.md template, always write both JSON files before writing components, and always use `useTranslation()` with direct object access (`t.module as any`).

---

## Key Findings

### Recommended Stack

The stack requires zero new additions. All patterns needed for this milestone already exist in the codebase as working, proven code. Decisions are about which existing tool to use for each situation.

**Core patterns and their canonical sources:**
- `vx-card` / `vx-card-header` / `vx-card-body vx-surface-muted`: Page layout hierarchy — defined in `index.css`, proven in `segmentsMVP.tsx` and `offline-conversionsMVP.tsx`
- `useTranslation()` with `t.module as any`: Translation access for all new components — from `LanguageContext.tsx`; do NOT use `useLocales()` for new keys
- `useState` for form fields: Sufficient for prototype; RHF added at production handoff
- `useReducer` for multi-step flows: Proven in `onboarding-unified.tsx` — use for Import Locations wizard
- `mock-{module}-data.ts` + `queryClient.ts` routing table: Mock service pattern — new file will be `mock-settings-data.ts`
- shadcn/ui primitives (`Input`, `Button`, `Select`, `Switch`, `Sheet`, `Dialog`): All form UI — no direct MUI TextField in new components
- Wouter `useLocation` for URL query string sync: Prevents tab state loss on navigation (`?tab=editBusiness`)
- `showToast({ type, title, description })` from `@/lib/toast`: All mutation feedback

**File upload:** Custom 40-line drag-and-drop zone (no library). Pattern is documented in STACK.md with a ready-to-use code snippet.

**Form validation:** Do NOT add RHF schemas in the prototype. The prototype needs to look right; engineering adds validation when connecting real backends. Per ARCHITECTURE.md: use `useState` for all form fields.

### Expected Features

**Must have (table stakes — required for this milestone):**
- Settings Edit Business tab: brand name, category, contact info, description, website, social links — all in vx-card hierarchy
- Settings Activity Feed tab: reverse-chronological event log, date-grouped, filter by type and date, "Load more" pagination
- Settings Store Sets tab: CRUD list with inline editing, name/location-count display, membership editing via dialog
- Settings Data Source & Mapping tab: connection cards (SFTP/API) with `connected/error/pending` state machine, field mapping table; all source labels generic (never branded)
- Notification Preferences: update existing layout to vx-card system (already built, needs visual conformance)
- Edit Location: address, hours, contact, platform sync status panel, store code prominent in header
- Add Location: same form as Edit with empty initial state, platform selection step
- Import Locations: drag-and-drop upload, column mapping, validation preview with row-level errors, conflict resolution (reuse `LocationConflictResolutionDialog`)
- Profile: display name, email (read-only), role badge, language preference toggle, password change placeholder
- Onboarding: step sidebar with completion dots, resumable state, completion summary, one canonical version

**Should have (low-effort differentiators worth adding in this milestone):**
- Brand completion score / 63% progress tracker in Settings left sidebar — already referenced in PROJECT.md, makes brand completeness actionable
- Platform health panel with inline Reconnect CTAs in Data Source & Mapping tab — one-click fix beats status-only display
- Store code shown prominently in Edit Location header — currently buried, immediate value for operations teams
- Estimated time per step label in Onboarding (`~5 minutes`) — reduces abandonment with zero implementation cost

**Defer to next milestone:**
- Cross-platform diff view in Edit Location (requires platform sync data infrastructure)
- Audit log with field-level diff view (before/after values) — requires richer event schema
- Bulk apply hours to multiple locations — requires multi-select location flow
- Duplicate detection on import — requires comparison query against full location list
- Session management / active devices in Profile
- Team management — full module, not a settings tab
- Billing, SSO, webhook builder, API key management, dark mode — explicitly out of scope

### Architecture Approach

The architecture follows the pattern already proven in redesigned modules: the page component owns tab/step state only; all form field state lives in child form components; all data flows through the mock service via `useQuery` and `apiRequest`. New shared primitives belong in `components/settings/` (not `components/ui/`) since they extend the vx-card system rather than being design system primitives. Edit and Add Location open as Sheet overlays from the existing locations list page — no new routes required, matching the `DetailsDrawer.tsx` precedent.

**Major components (build in this order):**
1. `components/settings/` — `SettingsSectionCard`, `SettingsFormRow`, `SettingsFieldGroup`, `ActivityFeedItem`, `StoreSetCard`, `DataSourceCard` (shared across 4+ pages)
2. `settings.tsx` redesign — two-panel layout (completion sidebar + 4-tab content shell), `EditBusinessForm`, `ActivityFeed`, `StoreSetList`, `DataSourcePanel`
3. `profile.tsx` + `components/profile/ProfileAvatarSection` — reuses all Settings primitives
4. `components/locations2/LocationEditForm` — single component, add/edit modes via `locationId?: string` prop, opened as Sheet overlay
5. `components/locations2/ImportWizard` — `useReducer` state machine with 4 step sub-components, rendered as Dialog from locations page
6. `onboarding-unified.tsx` redesign — extract `OnboardingHeader`, `OnboardingProgressBar`, `OnboardingStepShell`, `StepSidebar`, step content components; deprecate all `setup*.tsx` files first

**TypeScript types needed:**
- `lib/types/settings.ts`: `BusinessProfile`, `ActivityFeedEntry`, `StoreSet`, `DataSource`, `FieldMapping`
- Extend `lib/types/locations.ts`: `LocationFormData` (name, code, address, hours, channels)

**Mock service:** Create `lib/mock-settings-data.ts` with `settingsDataService` class. Register all new endpoints in `queryClient.ts`.

### Critical Pitfalls

1. **Using shadcn Card instead of vx-card hierarchy** — Existing `settings.tsx` uses shadcn Card throughout; copying from it poisons new pages. Prevention: start every component from the CLAUDE.md three-layer template, not existing settings pages. Reject any new settings component importing `Card` from `@/components/ui/card` as a layout wrapper.

2. **Translation key drift between en.json and tr.json** — With 1,439 lines in `en.json`, adding to one file and forgetting the other is the easiest mistake in the codebase. Prevention: write both JSON files before writing any component; use `|| 'Fallback'` on every `t.module?.key` access to make misses visible in development.

3. **Using useLocales() for new translation keys** — `getNestedValue()` path resolver silently returns `undefined` for dynamically-added keys. CLAUDE.md explicitly mandates `useTranslation()` for component-level translations. Prevention: use `const { t } = useTranslation(); const oc = t.settings as any;` in all new components; never `useLocales()`.

4. **Tab state lost on navigation** — Local `useState` for `activeTab` resets when the user navigates away and returns, losing partially-filled forms. Prevention: sync active tab to URL query string (`?tab=editBusiness`) via Wouter `useLocation`; track `isDirty` flag on forms and warn before tab switch.

5. **Five competing onboarding versions with no canonical reference** — `setup.tsx`, `setup2.tsx`, `setup3.tsx`, `setup3B.tsx`, and `onboarding-unified.tsx` all exist in `client/src/pages/` with no clear winner. Prevention: before writing a single line of onboarding code, add `// DEPRECATED — use onboarding-unified.tsx` to the four non-canonical files and redirect their routes.

6. **Hardcoded form field values violating the plug-and-play principle** — Forms with inline `defaultValue="Acarlar Perakende"` give engineering no loading or empty state reference. Prevention: every form page uses a `data: [Type]; isLoading?: boolean` prop, sourced from `mock-settings-data.ts`, with skeleton rendered on load.

7. **Import Locations without a state machine** — Multi-flag `useState` for wizard steps becomes unmanageable as edge cases accumulate. Prevention: `useReducer` with named states `'idle' | 'file_selected' | 'validating' | 'preview' | 'importing' | 'success' | 'error'`; each transition is a named action type.

---

## Implications for Roadmap

### Phase 1: Settings Page — Core Redesign and Shared Primitives
**Rationale:** Settings is the dependency root. It produces shared components (`SettingsSectionCard`, `SettingsFormRow`, `SettingsFieldGroup`) that 4 of the 5 subsequent phases reuse. Doing it first minimizes rework across the milestone. It is also the highest-complexity page (4 distinct content types in one page) and benefits from the most focused attention.
**Delivers:** Fully redesigned Settings with two-panel layout (completion sidebar + 4-tab content), all four tabs implemented with realistic mock data, shared primitive components, `mock-settings-data.ts`, new translation keys in both JSON files.
**Addresses:** All Settings table stakes; brand completion score and platform health panel with reconnect CTAs (differentiators worth adding)
**Avoids:** Pitfall 1 (shadcn Card drift), Pitfall 2/3 (translation drift and wrong hook), Pitfall 4 (tab state loss via URL sync), Pitfall 6 (inner sidebar layout), Pitfall 7 (branded ingestion labels)
**Research flag:** None — all patterns verified in codebase.

### Phase 2: Profile Page
**Rationale:** Simplest page in the milestone. Directly reuses all Phase 1 primitives. Zero new architectural decisions. Ships quickly and validates that the shared component reuse pattern works before tackling more complex pages.
**Delivers:** `profile.tsx` with avatar section (both avatar and initials-fallback states), personal info, language preference, password change placeholder stub.
**Uses:** `SettingsSectionCard`, `SettingsFormRow`, `SettingsFieldGroup` from Phase 1
**Addresses:** All Profile table stakes
**Avoids:** Pitfall 12 (hardcoded avatar without fallback state)
**Research flag:** None — standard profile page conventions.

### Phase 3: Edit Location + Add Location
**Rationale:** Both share one form component — build once, test both. Placing this after Profile means the shared primitive reuse pattern is already validated. Edit Location is the most data-rich page in the milestone (platform sync status, completeness scoring, structured address fields) and warrants dedicated focus.
**Delivers:** `LocationEditForm` (add and edit modes via `locationId?` prop), Sheet overlay from locations list page (no new routes), platform sync status panel, store code prominent in header, `LocationFormData` type.
**Addresses:** Edit Location and Add Location table stakes; store code display prominence (differentiator)
**Avoids:** Pitfall 1 (wrong card pattern), Pitfall 5 (hardcoded form values)
**Architecture note:** Sheet overlay pattern, not new routes. Follows existing `DetailsDrawer.tsx` precedent exactly.
**Research flag:** None — form patterns and Sheet overlay pattern verified against working code.

### Phase 4: Import Locations
**Rationale:** Fully independent of Phases 1–3. No shared component dependencies with Settings or Profile. The state machine complexity of the import wizard benefits from isolated focus. The conflict resolution dialog (`LocationConflictResolutionDialog`) already exists, reducing implementation scope.
**Delivers:** `ImportWizard` Dialog with 4 step components, `useReducer` state machine with explicit step states, drag-and-drop upload zone, column mapping table, validation preview with row-level errors, conflict resolution reusing existing dialog pattern.
**Addresses:** All Import Locations table stakes
**Avoids:** Pitfall 8 (wizard without state machine)
**Research flag:** None — conflict dialog in codebase; upload flow is standard.

### Phase 5: Onboarding/Setup Redesign
**Rationale:** Independent layout (no global sidebar), no shared component dependencies with other phases. Must come last because it has a prerequisite cleanup step — the four competing setup page versions must be deprecated before any new code is written.
**Delivers:** Redesigned `onboarding-unified.tsx` with extracted sub-components, deprecated `setup*.tsx` files with clear comments, canonical route redirects in `App.tsx`, step progress sidebar in vx-card visual language, resumable state.
**Addresses:** Onboarding table stakes; step time estimates (low-effort differentiator)
**Avoids:** Pitfall 9 (five competing versions — must deprecate four as first task), Pitfall 6 (inner step sidebar breaking with collapsed global sidebar)
**Research flag:** None — `onboarding-unified.tsx` analyzed directly.

### Phase Ordering Rationale

- **Phase 1 first** because it is the dependency root for shared primitives used across all subsequent phases.
- **Phase 2 before 3** because Profile is simpler and validates that shared component reuse works before tackling the more complex location form.
- **Phase 3 groups Edit + Add Location** because they share one form component — splitting them into separate phases requires revisiting the same file twice.
- **Phase 4 standalone** because Import Locations has no shared component overlap with other pages and its state machine complexity benefits from focused isolation.
- **Phase 5 last** because it has a prerequisite cleanup step (deprecated files) and its layout is fully independent of all other phases. Deferring it introduces zero risk.

### Research Flags

No phase in this milestone needs `/gsd:research-phase` during planning. All patterns are either verified directly against working code in this repository or well-established enough that the research confidence is already HIGH.

The only pre-work item that functions like research is the **Onboarding canonical version audit** (Phase 5 prerequisite): read all five setup/onboarding files, declare `onboarding-unified.tsx` canonical, add deprecation comments to the others. This is a 15-minute task that must happen before Phase 5 begins.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies. All patterns verified against installed, working code in the repository. |
| Features | HIGH | Based on direct codebase analysis plus stable SaaS domain conventions (Yext, Uberall, Birdeye, HubSpot). Feature list is conservative and grounded in what already exists or is clearly needed. |
| Architecture | HIGH | All component boundaries, data flows, and naming conventions derived from working modules. No speculation. Sheet overlay pattern, useReducer wizard, and mock service pattern are all proven in this codebase. |
| Pitfalls | HIGH | Pitfalls 1–7 directly observable in the codebase. Pitfalls 10–12 are standard SaaS UX patterns. No low-confidence claims included. Web search unavailable but not needed — codebase is the primary source. |

**Overall confidence: HIGH**

### Gaps to Address

- **Notification Preferences placement:** The current `settings.tsx` IS the notification preferences page (renders at `/settings`). The new 4-tab Settings will replace it at the same route. Notification Preferences must migrate to a 5th tab inside Settings or move to the Profile page. Recommendation: 5th tab in Settings (account-level, not user-level). Confirm with Kaan before Phase 1 begins.

- **LocationEditForm as Sheet vs. standalone route:** ARCHITECTURE.md recommends Sheet overlay over a new `/locations/:id/edit` route. This is the right prototype decision, but should be confirmed before Phase 3 begins, as it affects breadcrumb navigation and deep-linking.

- **Settings left sidebar checklist items:** PROJECT.md references a "63% tracker, checklist" but does not enumerate the checklist items. These need to be defined before building the sidebar in Phase 1. Derive from onboarding steps (brand info, platform connections, data source setup, first location) as a reasonable default.

- **Onboarding canonical version:** Before Phase 5, explicitly audit and deprecate `setup.tsx`, `setup2.tsx`, `setup3.tsx`, and `setup3B.tsx`. Add route redirects in `App.tsx`. This is a prerequisite gate for Phase 5.

---

## Sources

### Primary (HIGH confidence)
- `client/src/index.css` — vx-card, vx-tabs, vx-surface-muted class definitions
- `client/src/pages/segmentsMVP.tsx` — canonical tab + vx-card page pattern reference
- `client/src/pages/offline-conversionsMVP.tsx` — filter + tab + section-stack pattern
- `client/src/pages/settings.tsx` — existing notification settings (OLD pattern — documents what NOT to copy)
- `client/src/pages/onboarding-unified.tsx` — useReducer multi-step wizard pattern
- `client/src/components/offline-conversions/DataPipelineStatus.tsx` — connection card + status dot pattern
- `client/src/components/segments/SegmentListTable.tsx` — CRUD list + STATUS_STYLES badge pattern
- `client/src/components/locations2/LocationConflictResolutionDialog.tsx` — conflict resolution pattern for Import Locations
- `client/src/components/segments/SegmentBuilderDialog.tsx` — Dialog + useReducer multi-step pattern
- `client/src/lib/queryClient.ts` — mock service URL routing table pattern
- `client/src/contexts/LanguageContext.tsx` — useTranslation() implementation (canonical for new components)
- `client/src/lib/formatters.ts` — useLocales() implementation (identified as unreliable for dynamically-added keys)
- `CLAUDE.md` — explicit mandates on vx-card system, translation access, mock data standards, Metric type shape, plug-and-play principle

### Secondary (MEDIUM confidence)
- Training data: SaaS settings UX conventions (Stripe, Linear, HubSpot, Vercel, Notion) — August 2025 cutoff, web verification unavailable
- Training data: Yext Knowledge Graph (completeness scoring), Uberall (location management), Birdeye (review + settings UX), Klaviyo (notification preference UI) — domain benchmarks for feature scope
- Training data: React Hook Form v7 `trigger()` API for step-by-step validation — well-established, stable API

---

*Research completed: 2026-03-02*
*Ready for roadmap: yes*
