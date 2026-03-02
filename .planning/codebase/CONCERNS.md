# Codebase Concerns

**Analysis Date:** 2025-03-02

## Tech Debt

### Incomplete Backend Integration in SegmentBuilderDialog

**Issue:** Segment creation handler is stubbed and does not persist data to backend.

**Files:** `client/src/components/segments/SegmentBuilderDialog.tsx` (line 211)

**Impact:** Creating segments in the UI closes the dialog but segments are never saved. Engineering must wire this to `segmentDataService.createSegment()` with proper async handling and notification. This is blocking the segments feature from being functional.

**Fix approach:**
- Replace `handleCreate()` stub at line 213-215 with actual mutation using `segmentDataService.createSegment()`
- Add loading state to Create button during submission
- Call `queryClient.invalidateQueries(["/api/segments"])` on success
- Show toast notification (success/error) via `showToast()`
- Handle error cases gracefully

### Mock Data Architecture Does Not Match Production Patterns

**Issue:** Frontend uses client-side mock data service (`mockDataService`, `segmentDataService`, etc.) instead of real backend API calls. Mock data is intercepted at query layer.

**Files:**
- `client/src/lib/queryClient.ts` (mock request interception)
- `client/src/lib/mockData.ts` and related mock files
- `server/routes.ts` (all API routes are stubs returning placeholder messages)

**Impact:** No real data validation, no actual backend contract testing, no error handling for real API failures. When engineering builds the real backend, significant integration testing will be needed.

**Fix approach:**
- Keep mock data service during prototype phase
- Ensure all mock response shapes match exact production API contracts (already documented in CLAUDE.md)
- When backend is ready, swap query layer to real fetch() calls with error boundaries
- Add error retry logic and timeout handling for production

### No Mutation Query Invalidation Pattern in Use

**Issue:** Components do not call `queryClient.invalidateQueries()` after mutations. Data consistency between components not ensured.

**Files:** All data-modifying components (segments, locations, etc.)

**Impact:** When a segment is updated in one component, other components showing segment data won't refresh. Leads to stale data and user confusion. RFM test showed users expect updates to be instant across the app.

**Fix approach:**
- After every successful mutation, immediately invalidate affected query keys
- Pattern: `await mutation(); queryClient.invalidateQueries(["/api/{resource}"]); showToast({...})`
- Example in memory: `segmentDataService.updateSegment()` → `queryClient.invalidateQueries(["/api/segments"])`

### Translation Key Inconsistency Risk

**Issue:** `useLocales()` hook uses nested path resolution with `getNestedValue()` splitting by `.` character, but many components access translations directly with optional chaining (`t.module?.key`). Some keys may not exist in both `en.json` and `tr.json`.

**Files:**
- `client/src/contexts/LanguageContext.tsx`
- `client/src/lib/translations/en.json` and `tr.json`
- 179+ usage sites across components

**Impact:** Missing translation keys silently fall back to `undefined` or hardcoded English. Turkish users see untranslated text. Not caught at build time.

**Fix approach:**
- Add translation key validation script at build time (check both en.json and tr.json for parity)
- Enforce consistent access pattern across all components (either all `useLocales()` or all direct object access)
- Maintain strict key naming: `{componentName}.{section}.{property}` following Token Index Convention

## Known Bugs

### Memory Leak Risk in Dialog Close Animation

**Issue:** `SegmentBuilderDialog.handleClose()` uses `setTimeout(300)` to delay state reset after dialog close, but if component unmounts during the delay, state update occurs on unmounted component.

**Files:** `client/src/components/segments/SegmentBuilderDialog.tsx` (lines 185-195)

**Trigger:** Close dialog quickly and navigate away before 300ms timeout completes.

**Workaround:** Currently minor risk due to test usage, but pattern repeats in other dialogs.

**Fix:** Use cleanup function: `useEffect(() => { const timer = setTimeout(...); return () => clearTimeout(timer); }, [])`

### URL Parsing Fragility in Query Client

**Issue:** Mock request handler extracts IDs from URLs by splitting on `/` and using array indices. Breaks if URL structure changes or query params are present.

**Files:** `client/src/lib/queryClient.ts` (lines 49, 79, 98, 105-107)

**Example:** `const id = url.split('/').pop()` fails if URL has trailing slash or query string.

**Impact:** Segment operations (reach projection, automation rules) may route to wrong handlers if URL format changes.

**Fix approach:** Use URL parsing utilities: `new URL(url).pathname.split('/').pop()` or extract path segment before query string.

## Security Considerations

### No Input Validation on User-Created Segments

**Risk:** Segment names, descriptions, and rule definitions are not validated before sending to backend. XSS vectors could exist if backend reflects unsanitized input.

**Files:**
- `client/src/components/segments/SegmentBuilderDialog.tsx` (name, description inputs)
- `client/src/components/segments/SegmentRuleEditor.tsx` (rule value inputs)

**Current mitigation:** React auto-escapes JSX output. Rule values are constrained to predefined dimensions/operators in UI.

**Recommendations:**
- Add Zod schema validation in `SegmentBuilderDialog.handleCreate()` before sending to API
- Define `createSegmentSchema` in shared schema to validate both client and server-side
- Sanitize all string inputs (name, description)
- Validate rule operators and dimensions against allowed enum values

### Password Field Not Present in User Table But Stored

**Risk:** `shared/schema.ts` defines `password` field in users table, but no password input/validation exists in frontend signup.

**Files:**
- `shared/schema.ts` (line 9)
- `client/src/pages/signup.tsx` (no password field)

**Current mitigation:** Signup is prototype-only; authentication not implemented.

**Recommendations:**
- When auth is implemented, use secure password hashing (bcrypt, argon2) on backend
- Add password strength validation client-side
- Never send passwords over unencrypted connection

### Platform API Credentials Not Protected in Mock Data

**Issue:** Mock data includes placeholder account IDs (`google-account-123`, `meta-account-456`) but no pattern shown for handling real API keys or OAuth tokens.

**Files:**
- `client/src/lib/mockData.ts` (lines 36, 44, 54)
- `.env` file (if exists — not readable per policy)

**Current mitigation:** Placeholder data only.

**Recommendations:**
- All credentials must be stored server-side, never in frontend code or localStorage
- Use secure session storage for OAuth tokens with httpOnly, Secure, SameSite flags
- Implement token refresh logic for expired credentials
- Audit scope of granted platform permissions (Google, Meta, TikTok)

## Performance Bottlenecks

### Large Mock Data Files Loaded Into Memory at Startup

**Issue:** Mock data files are imported at module load time, not lazy-loaded. Large datasets (segments, campaign data, pipeline data) all loaded immediately.

**Files:**
- `client/src/lib/mockData.ts` (imported in queryClient)
- `client/src/lib/mock-segments-data.ts` (1,571 lines)
- `client/src/lib/mock-campaign-data.ts` (555 lines)

**Symptom:** Initial bundle size includes all mock data. Measured impact unknown but could slow cold start on mobile.

**Improvement path:**
- Move mock data to separate JSON files
- Load on-demand via dynamic import in query functions
- Use code splitting to lazy-load feature-specific mock data

### No Pagination on Large Tables

**Issue:** Mock data returns full datasets (segments, campaigns, locations) without pagination. Tables like `SegmentListTable` and campaign tables render all rows at once.

**Files:**
- `client/src/components/segments/SegmentListTable.tsx` (722 lines)
- `client/src/components/offline-conversions/CampaignTable.tsx` (642 lines)
- `client/src/components/locations2/LocationStatusTable.tsx` (1,764 lines)

**Impact:** With 100+ rows, DOM nodes and render overhead become noticeable. User interactions (sort, filter) cause full re-renders.

**Improvement path:**
- Implement server-side pagination in backend API (offset, limit, cursor-based)
- Use React Query's pagination support (`useQuery` with `pageIndex`, `pageSize`)
- Consider virtual scrolling for very large lists (TanStack React Virtual already available)

### Geographic Map Component Not Optimized

**Issue:** `GeographicMap.tsx` (1,062 lines) renders all location markers without clustering or progressive loading. High memory usage with 50+ locations.

**Files:** `client/src/components/offline-conversions/GeographicMap.tsx`

**Impact:** Map interactions slow down on low-end devices. No zoom-based filtering shown.

**Improvement path:**
- Implement marker clustering (Leaflet plugin exists)
- Load location details on-demand when marker clicked
- Debounce zoom/pan events before re-rendering

## Fragile Areas

### SegmentRuleEditor Rule State Not Validated

**Files:** `client/src/components/segments/SegmentRuleEditor.tsx`

**Why fragile:** Rules are built in a visual editor with no real-time validation. Empty `value` fields are allowed. Invalid operator/dimension combinations not caught. When rules are sent to backend, API will reject malformed rules without clear error message.

**Safe modification:**
- Add inline validation indicators (red border on invalid fields)
- Disable Create button if any rule has empty required fields
- Show operator-specific validation (e.g., "between" requires both min/max)

**Test coverage:** No unit tests for rule builder logic. Should add snapshot tests for rule group transformations.

### LocationStatusTable Conflict Resolution State Management

**Files:** `client/src/components/locations2/LocationConflictResolutionDialog.tsx` (653 lines)

**Why fragile:** Complex multi-step dialog with nested state for location conflicts. User can select different resolution strategies per location, but no validation that selected strategy is compatible with conflict type.

**Safe modification:**
- Write unit tests for conflict resolution logic before changing
- Add prop validation for conflict types
- Test edge case: rapid back/forward navigation through wizard steps

**Test coverage:** No tests visible. Dialog is critical path for location management.

### Mock Data Synchronization Across Modules

**Files:** Multiple files (`mockData.ts`, `mock-segments-data.ts`, `mock-campaign-data.ts`, etc.)

**Why fragile:** If segment IDs or location IDs change in one mock file, related references in other files break silently. Example: if `seg-001` is renamed, performance attribution queries won't find the segment.

**Safe modification:**
- Create shared constants for mock IDs: `export const MOCK_SEGMENT_IDS = { highValue: 'seg-001', ... }`
- Import IDs across mock files to avoid duplication
- Add test to verify ID references are consistent across all mock datasets

## Scaling Limits

### Current Mock Data Service Cannot Simulate Database Failures

**Issue:** Mock data service always succeeds. No way to test error states: network timeouts, invalid requests, server 500 errors.

**Current capacity:** Works for single-user prototype testing.

**Limit:** When adding error handling logic, developers can't test it. Production errors will surprise engineering.

**Scaling path:**
- Add error injection mode to mock service (env var: `MOCK_ERROR_RATE=0.1`)
- Return realistic error responses (4xx, 5xx with error messages)
- Simulate latency variance to test loading states

### No Real Database Integration

**Issue:** `shared/schema.ts` defines Drizzle tables, but no actual queries run against PostgreSQL. Data is never persisted.

**Current capacity:** In-memory demo. State lost on refresh.

**Limit:** Cannot test concurrent writes, transaction rollback, or constraint violations.

**Scaling path:**
- Wire Drizzle queries in backend routes when implementing real backend
- Set up test database (Docker Postgres) for CI/CD
- Test data migrations and schema compatibility

### Unplanned Load on Mobile

**Issue:** No responsive grid/table layouts designed for mobile. Wide tables, unscrollable modals, sidebar not mobile-optimized.

**Current capacity:** Desktop prototype only.

**Limit:** Mobile users will see broken layouts.

**Scaling path:**
- Add responsive breakpoints to all tables (collapse to card view on mobile)
- Make dialogs full-screen on small screens
- Test on iOS Safari and Chrome Android

## Dependencies at Risk

### Notistack Version Mismatch with React 18

**Issue:** `notistack@3.0.2` (package.json line 74) claims React 18 support but documentation shows breaking changes in v3.

**Risk:** Snackbar notifications may break on edge cases or version bump.

**Impact:** Toast notifications are critical for user feedback (segment creation, data saves, errors).

**Migration plan:**
- Test upgrade path to `notistack@4.x` when available
- Prepare fallback: replace with `@radix-ui/react-toast` (already in project as dependency)

### MUI v7 Bleeding Edge

**Issue:** `@mui/material@7.3.2` is a very recent major version (released late 2024). May have stability issues.

**Risk:** CSS-in-JS compilation errors, style conflicts, component behavior changes in minor updates.

**Impact:** UI rendering bugs, button/input state issues (already wrapping MUI with shadcn).

**Mitigation:** Current approach of wrapping MUI components in shadcn layer reduces exposure. Keep MUI updates locked to major version.

### React Query Deprecation Warnings

**Issue:** `@tanstack/react-query@5.60.5` uses legacy API patterns. TanStack Query v6 is beta.

**Risk:** v6 release will change hook signatures and cache invalidation API.

**Migration plan:** When v6 releases, update in bulk:
- `useQuery()` remains stable
- `queryClient.invalidateQueries()` API unchanged
- Review custom hooks in `lib/queryClient.ts` for compatibility

## Missing Critical Features

### No Error Boundary Component

**Issue:** React app has no error boundary. Unhandled JS errors crash entire app with blank screen.

**Blocks:** Graceful error UI, error logging, recovery workflows.

**Priority:** High. Should add before shipping.

**Example:** If a segment query throws, whole app is broken for that user.

## Test Coverage Gaps

### No Tests for Mock Data Service Contract

**What's not tested:** `client/src/lib/queryClient.ts` routing logic. If URL patterns don't match handler regexes, requests silently fail.

**Files:** `client/src/lib/queryClient.ts`

**Risk:** Refactoring URL structure breaks routes without warning.

**Priority:** Medium. Add happy-path tests for each endpoint pattern.

### No Integration Tests for Complex Wizards

**What's not tested:** Multi-step flows (onboarding, segment builder, conflict resolution) for edge cases: back/forward, skip steps, close/reopen.

**Files:**
- `client/src/components/segments/SegmentBuilderDialog.tsx`
- `client/src/pages/onboarding-unified.tsx`
- `client/src/components/locations2/LocationConflictResolutionDialog.tsx`

**Risk:** Users encounter broken states (data loss, invalid transitions).

**Priority:** High. Add Cypress or Playwright tests for wizard flows before handoff to engineering.

### No Tests for Translation Key Completeness

**What's not tested:** All translation keys exist in both en.json and tr.json.

**Files:** `client/src/lib/translations/` (both JSON files)

**Risk:** Prototype works in English, breaks when Turkish is enabled for some keys.

**Priority:** Medium. Add build-time validation script.

### No Tests for Segment Rule Validation

**What's not tested:** SegmentRuleEditor produces valid rule shapes. Rule operators match dimensions.

**Files:** `client/src/components/segments/SegmentRuleEditor.tsx`

**Risk:** Invalid rules sent to backend cause cryptic API errors.

**Priority:** Medium-High. Add unit tests for rule validation logic.

---

*Concerns audit: 2025-03-02*
