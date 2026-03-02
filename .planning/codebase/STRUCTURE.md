# Codebase Structure

**Analysis Date:** 2025-03-02

## Directory Layout

```
venuex-platform-repl/
├── client/                          # React frontend
│   └── src/
│       ├── main.tsx                 # React entry point
│       ├── App.tsx                  # Root app component, router, providers
│       ├── index.css                # Tailwind + CSS variables (theme)
│       ├── pages/                   # Route page components
│       │   ├── overview.tsx
│       │   ├── segmentsMVP.tsx
│       │   ├── offline-conversionsMVP.tsx
│       │   ├── reviewsMVP.tsx
│       │   ├── locations2.tsx
│       │   ├── catalog.tsx
│       │   ├── settings.tsx
│       │   └── [setup/onboarding pages...]
│       ├── components/
│       │   ├── ui/                  # shadcn/ui primitives (named exports)
│       │   │   ├── card.tsx
│       │   │   ├── button.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── input.tsx
│       │   │   └── [50+ other primitives]
│       │   ├── layout/              # App shell components
│       │   │   ├── sidebar.tsx
│       │   │   └── Header.tsx
│       │   ├── overview/            # Overview/dashboard components
│       │   │   ├── DataPipelineStatus.tsx
│       │   │   ├── TopPerformingOverview.tsx
│       │   │   └── [dashboard cards]
│       │   ├── locations2/          # Location management components
│       │   │   ├── LocationDataTable.tsx
│       │   │   ├── LocationCard.tsx
│       │   │   ├── LocationConflictDialog.tsx
│       │   │   └── [18 total components]
│       │   ├── reviews/             # Review management components
│       │   │   ├── ReviewTrendChart.tsx
│       │   │   ├── ReviewTable.tsx
│       │   │   ├── SentimentAnalysisCard.tsx
│       │   │   └── [14 total components]
│       │   ├── offline-conversions/ # Offline conversion pipeline components
│       │   │   ├── CampaignTable.tsx
│       │   │   ├── OfflineConversionFlowChart.tsx
│       │   │   ├── DataPipelineStatus.tsx
│       │   │   ├── PerformanceKPISummary.tsx
│       │   │   ├── PipelineHealthSummary.tsx
│       │   │   ├── GeographicMap.tsx
│       │   │   ├── GeographicPerformance.tsx
│       │   │   ├── RevenueTrendChart.tsx
│       │   │   └── [27 total components]
│       │   ├── segments/            # Audience segmentation components
│       │   │   ├── SegmentListTable.tsx
│       │   │   ├── SegmentBuilderDialog.tsx
│       │   │   ├── PlatformPushDashboard.tsx
│       │   │   ├── ExportDashboard.tsx
│       │   │   ├── PushToPlatformDialog.tsx
│       │   │   ├── FeedLabelDashboard.tsx
│       │   │   ├── MergeSegmentsDialog.tsx
│       │   │   ├── PlatformSyncLog.tsx
│       │   │   └── [35 total components]
│       │   ├── catalog/             # Local inventory components
│       │   │   └── [catalog-specific]
│       │   └── shared/              # Shared utility components
│       │       └── [cross-module UI]
│       ├── contexts/                # Global context providers
│       │   └── LanguageContext.tsx  # i18n state (en/tr)
│       ├── hooks/                   # Custom React hooks
│       │   ├── useNotifications.ts
│       │   ├── useFilteredCampaigns.ts
│       │   ├── useDashboard.ts
│       │   ├── useGeoJSON.ts
│       │   ├── use-toast.ts
│       │   └── use-mobile.tsx
│       ├── lib/
│       │   ├── queryClient.ts       # TanStack Query client + mock request router
│       │   ├── mockData.ts          # Main mock data service (overview, enrichment, alerts)
│       │   ├── mock-segments-data.ts    # Segments data service + CRUD operations
│       │   ├── mock-campaign-data.ts    # Campaign/offline conversion mock data
│       │   ├── mock-reviews-data.ts     # Reviews mock data
│       │   ├── mock-locations.tsx       # Locations mock data
│       │   ├── mock-notifications-data.ts # Notifications service
│       │   ├── mock-pipeline-data.ts    # Offline conversion pipeline data
│       │   ├── formatters.ts        # fCurrency, fNumber, fPercent, useLocales
│       │   ├── utils.ts             # cn() Tailwind merge utility
│       │   ├── route-config.ts      # Route metadata (breadcrumbs, titles)
│       │   ├── types.ts             # Global types (TypeScript interface exports)
│       │   ├── toast.ts             # Toast notification utility
│       │   ├── formatDate.ts        # Date formatting helpers
│       │   ├── constants.ts         # App-wide constants
│       │   ├── types/               # Grouped type files
│       │   │   ├── segments.ts      # Segment-related types
│       │   │   ├── reviews.ts       # Review-related types
│       │   │   ├── locations.ts     # Location-related types
│       │   │   ├── notifications.ts # Notification types
│       │   │   └── react-simple-maps.d.ts # Type declaration
│       │   ├── translations/        # i18n JSON files
│       │   │   ├── index.ts         # Type exports
│       │   │   ├── en.json          # English strings (64KB)
│       │   │   └── tr.json          # Turkish strings (67KB)
│       │   └── mock/                # Placeholder for mock sub-modules
│       └── types/                   # Legacy types folder (see lib/types/ instead)
│           └── react-simple-maps.d.ts
├── server/                          # Express.js backend
│   ├── index.ts                     # Express app, middleware, server startup
│   ├── routes.ts                    # API endpoints (currently stub returns)
│   ├── storage.ts                   # Data persistence layer (not yet used)
│   └── vite.ts                      # Vite dev middleware + static serving
├── shared/                          # Shared types & schema
│   └── schema.ts                    # Drizzle ORM tables + Zod insert schemas
├── .planning/                       # Planning documents (created by /gsd tools)
│   └── codebase/                    # This folder
│       ├── ARCHITECTURE.md          # (generated)
│       ├── STRUCTURE.md             # (generated)
│       ├── CONVENTIONS.md           # (generated)
│       ├── TESTING.md               # (generated)
│       ├── STACK.md                 # (generated)
│       ├── INTEGRATIONS.md          # (generated)
│       └── CONCERNS.md              # (generated)
├── .agent/                          # Agent rules and specs
│   └── rules/
│       └── VenueX_Platform_PRD.docx.md
├── vite.config.ts                   # Vite configuration with path aliases
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies, build scripts
├── tailwind.config.ts               # Tailwind CSS config
└── CLAUDE.md                        # Project instructions (read this first)
```

## Directory Purposes

**`client/src/pages/`:**
- Purpose: Route-level page components (one per route)
- Contains: Default exports of page components that receive no props from router
- Key files: `overview.tsx`, `segmentsMVP.tsx`, `offline-conversionsMVP.tsx`, `locations2.tsx`, `reviewsMVP.tsx`, `catalog.tsx`, `settings.tsx`
- Pattern: Import feature components, use useQuery hooks, render layout

**`client/src/components/ui/`:**
- Purpose: UI primitives from shadcn/ui (Radix + Tailwind)
- Contains: Named exports (forwardRef components) that wrap Radix or MUI primitives
- Key files: `card.tsx`, `button.tsx`, `dialog.tsx`, `input.tsx`, `select.tsx`, `accordion.tsx`, `tabs.tsx`, `badge-variants.tsx`
- Pattern: Re-export Radix UI with Tailwind styling, compatible with MUI theme

**`client/src/components/layout/`:**
- Purpose: App shell layout components
- Contains: Sidebar (navigation, collapsible), Header (breadcrumbs, user info)
- Renders: On all main app routes (toggled off on `/venuex-ai`)

**`client/src/components/{module}/`:**
- Purpose: Feature-specific components grouped by module
- Examples: `offline-conversions/`, `segments/`, `locations2/`, `reviews/`, `overview/`
- Pattern: One folder per major module, 10-35 components per folder

**`client/src/lib/`:**
- Purpose: Utilities, formatters, configuration, and data layer
- Key responsibilities:
  - `queryClient.ts`: Mock data routing
  - `mockData.ts` and `mock-*-data.ts`: Data generators
  - `formatters.ts`: Currency/number/percent formatting
  - `route-config.ts`: Route breadcrumbs
  - `types.ts`: Global TypeScript types

**`client/src/lib/translations/`:**
- Purpose: i18n strings for all UI text
- Files: `en.json` (English) and `tr.json` (Turkish)
- Pattern: Nested object keys (e.g., `{ "segments": { "builder": { "title": "Create Segment" } } }`)
- Access: `useTranslation()` hook → `t.segments.builder.title`

**`server/`:**
- Purpose: Express HTTP server
- Responsibilities:
  - `index.ts`: App setup, middleware, server listen
  - `routes.ts`: API endpoint stubs (currently return mock data messages)
  - `vite.ts`: Dev server middleware integration
- Current state: Stub endpoints only, all data generation happens client-side

**`shared/schema.ts`:**
- Purpose: Single source of truth for database schema
- Contains: Drizzle table definitions, Zod insert schemas
- Tables: `users`, `platforms`, `locations`, `campaigns`, `metrics`, `enrichmentSuggestions`, `alerts`, `notifications`
- Used by: Client types, mock data, future backend ORM

## Key File Locations

**Entry Points:**
- `client/src/main.tsx`: React root setup
- `client/src/App.tsx`: Provider tree, Router definition
- `server/index.ts`: Express app startup

**Configuration:**
- `vite.config.ts`: Build config, path aliases (`@/`, `@shared/`, `@assets`)
- `tsconfig.json`: TypeScript compiler options
- `tailwind.config.ts`: Tailwind theme configuration
- `client/src/index.css`: CSS variables, Tailwind directives

**Core Logic:**
- `client/src/lib/queryClient.ts`: API request routing
- `client/src/lib/mockData.ts`: Data service orchestration
- `client/src/lib/mock-segments-data.ts`: Segments CRUD + data generation
- `client/src/lib/mock-campaign-data.ts`: Campaign calculations, mock data
- `client/src/contexts/LanguageContext.tsx`: i18n provider

**Testing:**
- Not currently present (no test files detected)

## Naming Conventions

**Files:**
- Pages: `{moduleName}.tsx` or `{moduleName}MVP.tsx` (kebab-case route → CamelCase file)
  - Example: `segmentsMVP.tsx` → `/segments` route
- Components: `{Feature}{Name}.tsx` (PascalCase)
  - Example: `SegmentBuilderDialog.tsx`, `CampaignTable.tsx`
- Utilities: `use{Hook}.ts` (custom hooks), `format{Type}.ts` (formatters)
- Mock data: `mock-{module}-data.ts`
  - Example: `mock-segments-data.ts`, `mock-campaign-data.ts`

**Directories:**
- Feature modules: `{moduleName}/` (lowercase)
  - Example: `offline-conversions/`, `segments/`, `locations2/`
- Types: `types/` (grouped by concern)
- Utilities: `lib/` (miscellaneous utilities)

**TypeScript Types:**
- `{Module}{Entity}` (PascalCase)
  - Example: `SegmentListResponse`, `CampaignMetric`, `LocationProfile`
- Enum values: lowercase (e.g., `"google" | "meta" | "tiktok"`, never `"Google"`)

## Where to Add New Code

**New Feature (e.g., new module):**
1. Create new route page: `client/src/pages/{feature}.tsx` or `client/src/pages/{feature}MVP.tsx`
2. Add to router in `client/src/App.tsx` (Switch routes)
3. Add to route config in `client/src/lib/route-config.ts` (breadcrumbs)
4. Create feature components folder: `client/src/components/{feature}/`
5. Create mock data service: `client/src/lib/mock-{feature}-data.ts`
6. Wire mock service into `client/src/lib/queryClient.ts` `handleMockRequest()` function
7. Add translation keys to both `client/src/lib/translations/en.json` and `tr.json`

**New Component (within existing feature):**
- Implementation: `client/src/components/{feature}/{ComponentName}.tsx` (default export)
- If UI primitive: `client/src/components/ui/{component-name}.tsx` (named export, forwardRef)
- Import in parent page or parent component

**New Utility/Helper:**
- Formatter: `client/src/lib/formatters.ts` (add named export)
- Hook: `client/src/hooks/{hookName}.ts` (add named export)
- Type definition: `client/src/lib/types.ts` or `client/src/lib/types/{concern}.ts`
- Constant: `client/src/lib/constants.ts`

**New Mock Data Service Method:**
1. Add to appropriate `client/src/lib/mock-{module}-data.ts`
2. Export from service object (e.g., `segmentDataService`)
3. Add URL pattern matching in `client/src/lib/queryClient.ts` `handleMockRequest()`
4. Include simulated delay: `await delay(150)`
5. Wire mutation: Call `queryClient.invalidateQueries(['/api/path'])` after successful mutation

**New Translation Key:**
1. Add to `client/src/lib/translations/en.json` under appropriate module section
2. Add exact same key structure to `client/src/lib/translations/tr.json`
3. Access in component: `const { t } = useTranslation(); t.{module}.{section}.{key}`
4. Always provide fallback: `t.module?.key || 'Fallback text'`

## Special Directories

**`dist/`:**
- Purpose: Production build output
- Generated: Yes (by `npm run build`)
- Committed: No (gitignored)
- Contents: Built client (Vite output), bundled server (esbuild output)

**`.planning/codebase/`:**
- Purpose: GSD planning documentation (auto-generated)
- Generated: Yes (by `/gsd:map-codebase` command)
- Committed: Yes (planning is version controlled)
- Documents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, STACK.md, INTEGRATIONS.md, CONCERNS.md

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (by `npm install`)
- Committed: No (gitignored)

**`.claude/`:**
- Purpose: AI agent workspace (session memory, worktrees)
- Generated: Yes (by Claude)
- Committed: No (gitignored)

## File Path Reference

Use these exact paths when referring to code:

| Concern | Primary Path | Alternative |
|---------|-------------|------------|
| Overview/dashboard | `client/src/pages/overview.tsx` | `client/src/components/overview/` |
| Segments | `client/src/pages/segmentsMVP.tsx` | `client/src/components/segments/` |
| Offline conversions | `client/src/pages/offline-conversionsMVP.tsx` | `client/src/components/offline-conversions/` |
| Reviews | `client/src/pages/reviewsMVP.tsx` | `client/src/components/reviews/` |
| Locations | `client/src/pages/locations2.tsx` | `client/src/components/locations2/` |
| Catalog | `client/src/pages/catalog.tsx` | `client/src/components/catalog/` |
| Settings | `client/src/pages/settings.tsx` | — |
| i18n strings | `client/src/lib/translations/en.json` | `client/src/lib/translations/tr.json` |
| Segments data | `client/src/lib/mock-segments-data.ts` | — |
| Campaign data | `client/src/lib/mock-campaign-data.ts` | — |
| API routing | `client/src/lib/queryClient.ts` | — |
| Language context | `client/src/contexts/LanguageContext.tsx` | — |
| Sidebar/Header | `client/src/components/layout/` | — |

---

*Structure analysis: 2025-03-02*
