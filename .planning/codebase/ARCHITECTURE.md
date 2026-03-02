# Architecture

**Analysis Date:** 2025-03-02

## Pattern Overview

**Overall:** Client-driven prototype with mock data service layer. Express.js backend (currently minimal stub) serves static assets and provides HTTP server infrastructure. VenueX is a full-stack React + TypeScript prototype designed to be architecturally identical to the production system — the mock data service replaces the real API without changing component contracts.

**Key Characteristics:**
- Mock-first design: All API calls routed through `mockDataService` in client, not real backend
- Type-safe end-to-end: TypeScript types from `shared/schema.ts` used in client, backend, and mock data
- Module-per-feature: Each product module (locations, reviews, segments, offline-conversions) has dedicated component folder and mock data file
- Provider-agnostic: Platform logic (Google, Meta, TikTok) abstracted in type layer, not hardcoded in components
- Bilingual from ground up: All UI strings keyed in `en.json` and `tr.json`

## Layers

**Presentation Layer:**
- Purpose: React components, pages, and UI composition
- Location: `client/src/components/` and `client/src/pages/`
- Contains: Feature components (e.g., `SegmentBuilderDialog`, `CampaignTable`), UI primitives (shadcn/ui), layout components (Sidebar, Header)
- Depends on: Hooks (React Query), contexts (LanguageContext), formatters (currency, number, percent), utilities (Tailwind merge)
- Used by: React Router (Wouter), App.tsx for rendering

**Hook/Context Layer:**
- Purpose: State management, data fetching, app-wide context
- Location: `client/src/hooks/` and `client/src/contexts/`
- Contains: Custom hooks (`useQuery`, `useFilteredCampaigns`, `useDashboard`, `useNotifications`, `useGeoJSON`), LanguageContext for i18n
- Depends on: TanStack Query (react-query), LanguageContext provider, mock data service
- Used by: All feature components for data and language

**Data Service Layer:**
- Purpose: Mock API contract implementation — routes requests to appropriate mock data generators
- Location: `client/src/lib/mockData.ts`, `client/src/lib/mock-segments-data.ts`, `client/src/lib/mock-campaign-data.ts`, etc.
- Contains: Service objects (`mockDataService`, `segmentDataService`, `notificationDataService`) with methods matching future API endpoints (e.g., `getSegments()`, `createSegment()`, `updateSegment()`)
- Depends on: Mock data files (mock-*-data.ts), delay simulation, data transformation
- Used by: Query client's `handleMockRequest()` function which intercepts all API calls

**Query Client & Fetch Layer:**
- Purpose: Normalize all HTTP requests to mock data service
- Location: `client/src/lib/queryClient.ts`
- Contains: `queryClient` (TanStack Query instance), `apiRequest()` function, `handleMockRequest()` router that maps URLs to data service methods
- Depends on: Mock data service
- Used by: QueryClientProvider wrapping entire app, all useQuery hooks

**Shared Type Layer:**
- Purpose: Define types and database schema shared between client and backend
- Location: `shared/schema.ts`
- Contains: Drizzle ORM table definitions (users, platforms, locations, campaigns, metrics, enrichmentSuggestions, alerts, notifications), Zod insert schemas (InsertUser, InsertPlatform, etc.)
- Depends on: Drizzle ORM, Zod
- Used by: Client types, mock data generators, future backend routes

**Library/Utility Layer:**
- Purpose: Formatters, helpers, and constants
- Location: `client/src/lib/formatters.ts`, `client/src/lib/utils.ts`, `client/src/lib/types.ts`, `client/src/lib/route-config.ts`
- Contains: `fCurrency()`, `fNumber()`, `fPercent()` formatters; `cn()` Tailwind merge utility; route config with breadcrumbs; TypeScript types (OverviewData, Metric, EnrichmentSuggestion, etc.)
- Depends on: Tailwind utilities, date-fns for formatting
- Used by: Components for formatting values and conditional styling

**Backend/Server Layer:**
- Purpose: HTTP server, static asset serving, express middleware setup
- Location: `server/index.ts`, `server/routes.ts`, `server/vite.ts`
- Contains: Express app setup, logging middleware, stub API endpoints, Vite dev middleware integration
- Depends on: Express.js, HTTP server
- Used by: npm run dev (PORT=5001), production deployment

## Data Flow

**Page Load → Component Render:**

1. User navigates to route (e.g., `/segments`)
2. Wouter router matches route and renders page component (`client/src/pages/segmentsMVP.tsx`)
3. Page component renders feature components (e.g., `SegmentListTable`, `SegmentBuilderDialog`)
4. Feature components call `useQuery()` with queryKey (e.g., `['/api/segments']`)
5. queryClient's `getQueryFn()` invokes `handleMockRequest('GET', '/api/segments')`
6. `handleMockRequest()` matches URL pattern and calls appropriate data service method
7. Data service (e.g., `segmentDataService.getSegments()`) returns mock data (with simulated delay)
8. Component receives data and renders

**Mutation Flow (Create/Update/Delete):**

1. User submits form (e.g., SegmentBuilderDialog)
2. Form handler calls `segmentDataService.createSegment(payload)`
3. Data service modifies internal mock data state and returns result
4. Component calls `queryClient.invalidateQueries(['/api/segments'])` to refetch
5. All components listening to that query key rerender with fresh data
6. Toast notification confirms success/failure

**State Management:**

- **Server state:** TanStack Query (react-query) manages API-driven data, caching, refetching, error handling
- **UI state:** Local `useState()` for component-level toggles, form inputs, dialog open/close
- **Global state:** LanguageContext for language (en/tr) and translations
- **Form state:** React Hook Form + Zod for validation and submission

## Key Abstractions

**Metric:**
- Purpose: Represents a KPI with period-over-period comparison
- Examples: `client/src/lib/types.ts`, used in OverviewData, CampaignTable
- Pattern: Always `{ value, change, past_value }` — never use bare `number` for KPIs

**Provider Enum:**
- Purpose: Type-safe platform identifier
- Examples: `"google" | "meta" | "tiktok"` (lowercase, never display strings)
- Usage: CampaignTable filters, PlatformPushDashboard, SegmentBuilderDialog — always check platform before showing platform-specific UI

**Mock Data Service Method Pattern:**
- Purpose: Simulate API endpoint behavior
- Example pattern (from `mock-segments-data.ts`):
  ```typescript
  async getSegments(): Promise<SegmentListResponse> {
    await delay(200); // Simulate network latency
    return {
      segments: mockSegments.filter(/* filters */),
      total: mockSegments.length,
      hasMore: false
    };
  }
  ```
- All service methods: accept typed payload, return typed response, include delay simulation

**Route Configuration:**
- Purpose: Centralized route metadata (title, breadcrumbs)
- Location: `client/src/lib/route-config.ts`
- Pattern: `routes['/path'] = { title: string, breadcrumbs: [{ label, href }] }`
- Used by: Header.tsx for breadcrumb rendering

**Component Naming Convention:**
- **Pages:** `{Module}{Name}MVP.tsx` (e.g., `segmentsMVP.tsx`) or `{Module}.tsx` (e.g., `segments.tsx`)
- **Feature Components:** `{Module}{Feature}{Role}.tsx` (e.g., `SegmentBuilderDialog.tsx`, `CampaignTable.tsx`, `ReviewTrendChart.tsx`)
- **UI Primitives:** From shadcn/ui in `client/src/components/ui/`

## Entry Points

**Client Entry:**
- Location: `client/src/main.tsx`
- Triggers: npm run dev, vite build
- Responsibilities: Create React root, render App component

**App Component:**
- Location: `client/src/App.tsx`
- Triggers: Called by main.tsx
- Responsibilities: Set up providers (ThemeProvider, QueryClientProvider, SnackbarProvider, LanguageProvider), render Router

**Router:**
- Location: `client/src/App.tsx` (Router function)
- Triggers: Rendered by App
- Responsibilities: Define all routes via Wouter Switch, render Sidebar + Header for main app, standalone pages without sidebar (setup, onboarding, signup)

**Server Entry:**
- Location: `server/index.ts`
- Triggers: npm run dev, npm run start
- Responsibilities: Create Express app, register routes, set up logging middleware, start HTTP server on PORT=5001

## Error Handling

**Strategy:** Client-side error handling for mock data. No error recovery — mock data is always available. Production API errors will be handled via query retry logic when backend is integrated.

**Patterns:**

- **Query errors:** useQuery() captures errors, components check `error` state and render error UI (e.g., "Failed to load dashboard" in Overview)
- **Form errors:** React Hook Form + Zod validation errors displayed inline on form fields
- **Toast notifications:** `showToast({ type: 'error', title, description })` from `@/lib/toast` via notistack SnackbarProvider
- **Silent failures:** Mutation errors (create/update/delete) show toast but don't block UI

## Cross-Cutting Concerns

**Logging:** Express middleware in `server/index.ts` logs API requests/responses (method, path, status, duration, JSON body)

**Validation:**
- Client-side: React Hook Form + Zod for all forms
- Server-side schema: Drizzle insert schemas (InsertSegment, InsertCampaign, etc.) ready for backend integration

**Authentication:**
- Not implemented in prototype (mock data accessible to all)
- Infrastructure ready: Passport.js, express-session, connect-pg-simple in dependencies
- Future: Auth middleware in server/routes.ts

**Internationalization:**
- Context-based: LanguageContext.tsx with `useTranslation()` hook
- Access pattern: `const { t } = useTranslation(); t.module.key` (direct object access with fallback)
- Alternative: `useLocales()` for nested key path resolution (e.g., `t('module.section.key')`)
- All UI text in `client/src/lib/translations/en.json` and `tr.json`

**Styling:**
- Primary: Tailwind CSS utility classes
- Secondary: MUI v7 theme (primary: #3b82f6, secondary: #64748b) for components that need Material Design
- Merge conflicts: `cn()` from `@/lib/utils` using tailwind-merge
- CSS variables: Custom theme colors in `client/src/index.css` (brand palette, surface variants, text colors)

---

*Architecture analysis: 2025-03-02*
