# Domain Pitfalls — Settings & Sub-Page Redesigns

**Domain:** SaaS platform settings pages, form-heavy sub-pages, onboarding flows
**Project:** VenueX Platform — Sub-Page Redesign Milestone
**Researched:** 2026-03-02
**Confidence:** MEDIUM — derived from direct codebase inspection plus established UX patterns. No external sources available (search/fetch tools restricted). Findings are grounded in the actual VenueX codebase state.

---

## Critical Pitfalls

Mistakes that cause rewrites or visual inconsistencies that block engineering handoff.

---

### Pitfall 1: Using the Wrong Design Language for New Pages

**What goes wrong:** New settings/sub-pages are built using shadcn `<Card>` + `<CardHeader>` + `<CardContent>` — the OLD pattern — instead of the established `vx-card` / `vx-card-header` / `vx-card-body` + `vx-surface-muted` hierarchy.

**Why it happens:** The current `settings.tsx` uses shadcn Card throughout. It is easy to copy-paste this pattern when starting new pages, especially since shadcn Card is still in the codebase and works fine visually at a glance.

**Consequences:** The redesigned page looks subtly wrong next to redesigned pages (Locations, Reviews, Segments, Offline Conversions). Engineering receives two conflicting reference patterns in the same codebase and must guess which one is canonical. Visual regression accumulates across every sub-page built.

**Warning signs:**
- A new component file imports `Card`, `CardContent`, `CardHeader` from `@/components/ui/card` as its primary layout primitive
- Page body has a white background directly rather than a `vx-card-body vx-surface-muted` (gray-50) background
- Section headers lack the `bg-gray-50 border-b border-gray-100` treatment from `vx-card-header`

**Prevention:**
- Start every new page/component from the three-layer template defined in CLAUDE.md, not from an existing old page
- In code review: reject any new settings component that imports shadcn `Card` as a layout wrapper (it is acceptable for inline UI elements, not page structure)
- Wrap pages in `<div className="vx-section-stack">` immediately — this enforces correct horizontal padding (`px-6`) and spacing (`mt-6`) from the start

**Phase:** Settings page (first priority) — this pattern established here cascades to Edit Location, Add Location, Import Locations, Profile, and Onboarding.

---

### Pitfall 2: Translation Key Drift Between en.json and tr.json

**What goes wrong:** New UI strings are added to `en.json` but not `tr.json` (or vice versa), causing runtime translation misses in Turkish mode. With 1,439 lines in `en.json`, this is easy to miss.

**Why it happens:** The Settings page currently uses `useLocales()` with dot-path strings (e.g., `t('settings.notifications.frequency.instant')`). When adding new tab content (Edit Business, Activity Feed, Store Sets, Data Source & Mapping), new keys must be added to both files. The development workflow in Turkish is rarely tested first.

**Consequences:** Turkish-mode users see raw key strings or empty strings instead of labels. Engineering may ship broken i18n. The bilingual constraint is non-negotiable per CLAUDE.md.

**Warning signs:**
- A new component has hardcoded English strings instead of `t('...')` calls
- `en.json` has keys under a module section that `tr.json` does not have at the same path
- A translation key like `t('settings.editBusiness.someField')` is referenced in code before the key exists in either file

**Prevention:**
- Add translation keys to both `en.json` AND `tr.json` in the same edit session, before writing the component that uses them
- Use the `|| 'Fallback'` pattern on every translation access (already mandated in CLAUDE.md) to make misses visible in development rather than silent
- For Settings specifically: plan all tab content labels upfront, write both JSON files, then build the components

**Phase:** Every page in this milestone — applies universally.

---

### Pitfall 3: Mixing useLocales() and useTranslation() Incorrectly

**What goes wrong:** A component uses `useLocales()` (which resolves via `getNestedValue()` dot-path splitting) for dynamically-added keys that `getNestedValue()` cannot reliably resolve. The result is silent `undefined` returns that fallback to empty strings.

**Why it happens:** The codebase has TWO translation access patterns:
1. `useTranslation()` from `@/contexts/LanguageContext` → returns `t` as a typed object → access via `t.module as any` → `oc?.key`
2. `useLocales()` from `@/lib/formatters` → returns `t(dotPath: string)` → uses `getNestedValue()`

The CLAUDE.md explicitly states that `getNestedValue` is unreliable for dynamically-added keys. New contributors (or AI agents) default to `useLocales()` because the existing `settings.tsx` uses it.

**Consequences:** Newly-added translation keys silently return `undefined`. Components render empty where labels should be. This is hard to catch in English mode if the fallback string matches the intended label.

**Warning signs:**
- A new component calls `useLocales()` and uses `t('settings.newTab.someKey')` for keys added after the type definitions were established
- Translation renders correctly in English but silently fails in Turkish (or vice versa)
- Component uses `t('...')` without a `|| 'Fallback'` guard

**Prevention:**
- For all new Settings sub-page components: use `useTranslation()` with direct object access (`const { t } = useTranslation(); const oc = t.settings as any; oc?.editBusiness?.fieldLabel || 'Label'`)
- Do NOT use `useLocales()` in new components created during this milestone
- If you see `useLocales()` in a file being redesigned, migrate it to `useTranslation()` as part of the redesign

**Phase:** Settings page, Profile page — anywhere new translation keys are introduced.

---

### Pitfall 4: Tab State Not Persisting Across Navigation

**What goes wrong:** The Settings page has 4 tabs (Edit Business, Activity Feed, Store Sets, Data Source & Mapping). If tab state is managed with `useState` only, navigating away from `/settings` and returning resets the user to Tab 1. In a form-heavy tab like Edit Business, this means losing unsaved form state.

**Why it happens:** Local `useState` for `activeTab` is the simplest approach and works fine for stateless tabs. It breaks the moment any tab contains an in-progress form or when users navigate away (e.g., to fix a location before updating business settings).

**Consequences:** Users lose partially-filled form state. In a prototype, this breaks the "feels like the real product" requirement. Engineering who build from this reference may not add state persistence if it was never modeled.

**Warning signs:**
- `const [activeTab, setActiveTab] = useState('editBusiness')` with no URL sync or form state preservation
- Form inside a tab has no draft/dirty state tracking
- Navigating away and back resets the active tab to the first one

**Prevention:**
- Sync the active tab to the URL query string (`?tab=editBusiness`) using Wouter's `useLocation`. This makes tabs bookmarkable and navigation-safe
- For the Edit Business form: track a `isDirty` flag and show a "You have unsaved changes" inline warning if the user tries to switch tabs
- Mock a `handleSave()` that shows a success toast — models the real async save pattern for engineering

**Phase:** Settings page. Applies to Add Location and Edit Location if they have multi-step forms.

---

### Pitfall 5: Form Fields Without Proper Empty State and Loading States

**What goes wrong:** Form-heavy pages (Edit Business, Edit Location, Add Location) are built with hardcoded mock values directly in JSX. When engineering replaces mock data with real API calls, there is no loading skeleton, no empty state, and no error state — requiring significant rework.

**Why it happens:** In a prototype it is tempting to write `defaultValue="Acarlar Perakende"` directly in an `<Input>` and move on. The current `settings.tsx` does this for the account section (hardcoded name, role, email).

**Consequences:** Engineering sees a form that only works with data present. They must add loading/empty/error states themselves without a reference, which introduces inconsistency. The "plug-and-play" principle from CLAUDE.md is violated.

**Warning signs:**
- Form fields have hardcoded string literals as `value` or `defaultValue` props
- No `isLoading` prop path or skeleton placeholder in the component
- No empty state treatment (e.g., "No business info found")
- Component accepts no `data` prop — content is entirely internal

**Prevention:**
- Structure every form page around a data prop: `interface EditBusinessProps { data: BusinessProfile; isLoading?: boolean; }`
- Render a skeleton (using shadcn Skeleton or a gray placeholder div) when `isLoading` is true
- Use realistic mock data via the mock data service (following `mock-{module}-data.ts` pattern) rather than JSX literals
- The mock data file for Settings should be named `mock-settings-data.ts` and follow the Metric/NormalizedResponse shape contracts

**Phase:** Edit Business tab, Edit Location, Add Location, Profile.

---

## Moderate Pitfalls

---

### Pitfall 6: Sidebar Layout on Sub-Pages Breaks the Full-Width Assumption

**What goes wrong:** Settings, Edit Location, and Profile pages have a sidebar-within-the-page (e.g., the 63% completion tracker sidebar in Settings). These inner sidebars compete with the global sidebar layout and break if the global sidebar collapses, causing layout jank or overflow.

**Why it happens:** Designers add left-rail progress or navigation panels without accounting for the outer sidebar's collapsed state. The global sidebar auto-collapses on `/venuex-ai` and may be manually collapsed on any route.

**Consequences:** At narrow sidebar widths, the inner Settings sidebar overflows or wraps unexpectedly. Engineering cannot determine the canonical responsive behavior from the prototype.

**Prevention:**
- For the Settings completion sidebar: make its width fixed (`w-64` or similar) independent of the outer layout
- Use `min-w-0` on flex children to prevent content overflow
- Test the layout with the global sidebar collapsed during prototype development
- If the inner sidebar is optional (can be toggled or omitted on smaller layouts), model that state in the prototype

**Phase:** Settings page (has completion progress sidebar), Onboarding flows.

---

### Pitfall 7: Data Source & Mapping Tab — Generic Labels Violated

**What goes wrong:** The Data Source & Mapping tab is likely to contain pipeline/ingestion UI. Per CLAUDE.md, ingestion sources must be labeled generically ("SFTP", "API") — never as "Boyner POS Exports", "CRM API", "Loyalty Feed", etc. This rule is easy to forget inside Settings where it feels less like "pipeline mock data."

**Why it happens:** When building pipeline cards in a Settings context, contributors may add descriptive source names to make it feel realistic, not realizing the no-explicit-brand-naming rule applies equally here.

**Consequences:** The prototype ships reference data that violates the constraint. Engineering or future AI agents copy the pattern and propagate branded pipeline references.

**Warning signs:**
- Data source cards labeled with a specific brand name or a domain-specific system name ("POS", "CRM", "Loyalty")
- Mock data for the Data Source & Mapping tab uses variable names like `crmSource` or `posSystem`

**Prevention:**
- Name all sources in mock data as: `"SFTP Connection"`, `"API Integration"`, `"Webhook"`, `"Manual Upload"`
- Review mock data for the Data Source & Mapping tab specifically before considering the tab complete

**Phase:** Settings — Data Source & Mapping tab.

---

### Pitfall 8: Import Locations — File Upload UX Without State Machine

**What goes wrong:** The Import Locations page requires a multi-step file upload flow (select file → validate → preview → confirm → result). Building this as a single-component with multiple `useState` flags instead of a state machine creates branching conditional render logic that becomes impossible to follow.

**Why it happens:** Simple `useState` for `step: 1 | 2 | 3 | 4` seems sufficient initially. As edge cases accumulate (validation errors, partial imports, retry states), conditional logic multiplies.

**Consequences:** The import flow is hard to iterate on and impossible for engineering to understand as a state reference. Error and retry paths are never modeled.

**Prevention:**
- Use `useReducer` with explicit step states: `'idle' | 'file_selected' | 'validating' | 'preview' | 'importing' | 'success' | 'error'`
- Each state transition should be a named action type — this is the production contract engineering will implement as a backend-driven state machine
- Model the error state (e.g., "3 locations failed to import") explicitly in mock data

**Phase:** Import Locations page.

---

### Pitfall 9: Onboarding — Multiple Setup Page Versions Create Ambiguity

**What goes wrong:** The codebase currently has `setup.tsx`, `setup2.tsx`, `setup3.tsx`, `setup3B.tsx`, and `onboarding-unified.tsx` — five versions of the onboarding/setup flow. The redesign milestone must designate exactly one as the canonical reference. If it does not, engineering will ask which version to build.

**Why it happens:** Iterative design produces multiple variants. In a prototype environment, old versions are rarely deleted. The result is five pages, none clearly marked as "this one."

**Consequences:** Engineering picks the wrong version. Onboarding UX diverges from design intent. The prototype loses its role as the single unambiguous reference.

**Warning signs:**
- Multiple files at `setup*.tsx` all rendering independently and none marked as deprecated
- No comment or route annotation indicating which is the active design

**Prevention:**
- Before starting the Onboarding redesign: audit all five setup/onboarding pages, decide which to redesign, add a `// DEPRECATED — use onboarding-unified.tsx` comment to the others
- Redirect deprecated routes to the canonical one in `App.tsx`
- Consider removing the deprecated files from the repo or moving them to `.planning/archive/`

**Phase:** Onboarding/Setup redesign — must be resolved before building begins.

---

## Minor Pitfalls

---

### Pitfall 10: Activity Feed Tab — No Pagination or Virtualization

**What goes wrong:** The Activity Feed tab in Settings is a log list. Mock data with 20–30 entries renders fine. Engineering inherits a design with no pagination, infinite scroll, or virtualization, then must add it independently for production where logs can be thousands of entries.

**Prevention:**
- Mock the Activity Feed with 50+ entries and include a visible "Load more" button or paginated navigation
- Add a `pagination: { page: number; total: number; perPage: number }` shape to the mock data response type

**Phase:** Settings — Activity Feed tab.

---

### Pitfall 11: Store Sets Tab — CRUD Without Optimistic Updates

**What goes wrong:** The Store Sets tab is a CRUD list (add/edit/delete store groupings). If mutations only show a success toast without immediately reflecting the change in the list (optimistic update), the prototype feels sluggish and does not model the expected production UX.

**Prevention:**
- After add/edit/delete, immediately update local state to reflect the change, then show the success toast
- This models the TanStack Query `onMutate` optimistic update pattern engineering will use

**Phase:** Settings — Store Sets tab.

---

### Pitfall 12: Profile Page — Hardcoded Avatar Without Placeholder State

**What goes wrong:** Profile pages often hardcode an avatar image (or display initials). Without modeling the "no avatar uploaded" empty state, engineering does not know what the fallback looks like.

**Prevention:**
- Mock both states: a user with an avatar and a user without one
- Show initials-based fallback (first + last name initials in a gray circle) when no avatar URL is present

**Phase:** Profile page.

---

## Phase-Specific Warnings

| Phase / Page | Likely Pitfall | Mitigation |
|---|---|---|
| Settings — any tab | Pitfall 1: shadcn Card instead of vx-card hierarchy | Start from CLAUDE.md three-layer template |
| Settings — any tab | Pitfall 2/3: translation key drift or wrong hook | Write both JSON files first; use `useTranslation()` not `useLocales()` |
| Settings — Edit Business | Pitfall 5: hardcoded form values | Use `mock-settings-data.ts`, pass as props |
| Settings — all 4 tabs | Pitfall 4: tab state lost on navigate | Sync active tab to URL query string |
| Settings — sidebar | Pitfall 6: inner sidebar breaks outer layout | Fixed width, test with collapsed global sidebar |
| Settings — Data Source & Mapping | Pitfall 7: branded ingestion source names | Generic labels only (SFTP, API, Webhook) |
| Settings — Activity Feed | Pitfall 10: no pagination | 50+ mock entries, "Load more" visible |
| Settings — Store Sets | Pitfall 11: no optimistic CRUD | Update local state immediately after mutation |
| Edit Location | Pitfall 5: hardcoded field values | Props-driven with loading state |
| Add Location | Pitfall 5 + Pitfall 4: form state on navigation | isDirty flag, warn before leaving |
| Import Locations | Pitfall 8: no state machine | useReducer with explicit step states |
| Profile | Pitfall 12: no avatar fallback | Model both avatar and no-avatar states |
| Onboarding | Pitfall 9: five competing versions | Deprecate four, canonicalize one before building |
| Onboarding | Pitfall 6: inner step sidebar with outer sidebar | Test collapsed sidebar state during development |

---

## Sources

**Confidence notes:**

- Pitfalls 1, 2, 3: HIGH confidence — derived directly from codebase inspection of `settings.tsx`, `LanguageContext.tsx`, `formatters.ts`, and CLAUDE.md explicit rules
- Pitfalls 4, 5, 8: HIGH confidence — established patterns from React/TanStack Query ecosystem and the project's own "plug-and-play" principle
- Pitfalls 6, 7: HIGH confidence — Pitfall 6 from codebase routing structure; Pitfall 7 from CLAUDE.md explicit mock data rule
- Pitfalls 9: HIGH confidence — directly observable from five setup/onboarding files in `client/src/pages/`
- Pitfalls 10, 11, 12: MEDIUM confidence — standard SaaS UX patterns; no external verification available

External search tools were unavailable during this research session. All findings are grounded in direct codebase inspection and established React/SaaS UX patterns. No LOW confidence claims are included.
