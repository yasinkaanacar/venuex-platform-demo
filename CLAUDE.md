# VenueX Platform

## Soul

VenueX is an integrated omnichannel operations and measurement platform for multi-location brands. It connects in-store data — locations, reviews, inventory, POS/CRM sales — to digital advertising platforms (Google, Meta, TikTok) so brands can prove which campaigns drive real store-level results.

**This repository is VenueX's product design environment.** Not production. Not a toy. It is a living, buildable specification — a polished frontend prototype that serves as the canonical reference for what every screen, component, interaction, and data contract should look like when engineering builds the real thing.

Two things are equally true here:
1. **It should look and feel like the real product.** Realistic layouts, polished interactions, believable mock data. If a developer opens this and can't tell it's a prototype, that's the goal.
2. **It should be architecturally ready to plug in.** Every endpoint stub, every TypeScript type, every mock response shape, every component contract — designed to lift directly into production with minimal refactoring.

## Who Is Building This

Kaan Acar — first employee at VenueX Bilisim Teknolojileri A.S. Product-builder who designs, decides, and ships in the same session. The work spans product management (scoping, specs, roadmap), product design (UX, layout, data presentation), and frontend engineering (building the prototype with AI-assisted development). These roles blur together by design — speed of iteration matters more than org chart boundaries.

**Communication style:** Simple, direct, everyday language. Turkish speaker. No fluff.

**Primary audience for this repo:** The engineering team. This prototype is their reference for exactly what to build.

## Design Environment Rules

### Plug-and-Play Principle
Nothing here is throwaway. Every feature built in this environment should be ready to connect to real backends:
- Endpoint stubs must match the real API contract shape
- Mock data must mirror the exact response structure production will return
- Component props must type the real data, not simplified versions
- State management patterns must scale to real async flows

### Token Index Convention
Every referenceable entity follows a consistent, traceable naming convention:

| Entity | Convention | Example |
|--------|-----------|---------|
| **Endpoints** | `METHOD /api/{module}/{resource}` | `GET /api/locations`, `POST /api/offline-conversions/batches` |
| **Types** | `{Module}{Entity}` | `LocationProfile`, `OfflineConversionBatch`, `CampaignMetric` |
| **Components** | `{Module}{Feature}{Role}` | `LocationDataTable`, `OfflineSummaryCard`, `ReviewSentimentChart` |
| **Translation keys** | `{module}.{section}.{element}` | `overview.header.title`, `locations.table.storeName` |
| **Mock data files** | `mock-{module}-data.ts` | `mock-campaign-data.ts`, `mock-location-data.ts` |
| **Pages** | `{moduleName}.tsx` (kebab-case route) | `locations2.tsx` → `/locations`, `offline-conversionsMVP.tsx` → `/offline-conversions` |

When adding anything new, check existing naming patterns first. Consistency across the token index is non-negotiable — the engineering team needs to `Ctrl+F` any reference and find it everywhere.

### Mock Data Standards
- Use fictional brand names (e.g. "Nova Living", "Acme Home") — **never use real brand names** anywhere in mock data, as this environment doubles as a demo
- Use realistic Turkish market data: real city names (Istanbul districts), TRY currency
- Match rates, conversion values, and metrics should be plausible, not random
- Every mock dataset should include edge cases (empty states, error states, partial data)
- **No explicit brand naming in data connection / pipeline mock data.** Ingestion sources should be labeled generically as "SFTP" or "API". No POS/CRM/loyalty domain references.

## Product Modules

Full PRD: `.agent/rules/VenueX_Platform_PRD.docx.md`

| Module | Route | Status | Core Function |
|--------|-------|--------|--------------|
| **Overview** | `/overview` | Active | Cross-platform dashboard, data health, enrichment suggestions |
| **Location Management** | `/locations` | Active | CRUD + bulk ops for store profiles across GBP, Apple, Meta, Yandex |
| **Review Management** | `/reviews` | Active | GBP review aggregation, AI-suggested responses, sentiment/theme analysis |
| **Local Inventory (Catalog)** | `/catalog` | Active | Store-level product availability feeds to Google Merchant Center + Meta |
| **Offline Conversions** | `/offline-conversions` | Active | Privacy-safe POS/CRM data pipelines to Google/Meta/TikTok for attribution |
| **Analytics & Reporting** | — | Roadmap | Unified cross-platform campaign performance, offline ROAS, listing metrics |

## Tech Stack

- **Frontend:** React 18 + TypeScript, Vite, Wouter (routing), TanStack Query v5
- **UI:** shadcn/ui (new-york style) + MUI v7, Tailwind CSS, Radix UI primitives, Lucide icons
- **Charts/Maps:** Recharts, D3, Leaflet + React Leaflet
- **Backend:** Express.js + TypeScript, PostgreSQL (Neon serverless), Drizzle ORM, Passport.js
- **i18n:** Custom context-based system with English (`en`) and Turkish (`tr`) JSON files
- **Theme:** Light mode only — white backgrounds, gray borders, clean Inter font

## Commands

```bash
npm run dev          # Start dev server (PORT=5001)
npm run build        # Build client (Vite) + server (esbuild)
npm run start        # Production server
npm run check        # TypeScript type checking (tsc)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier
npm run db:push      # Apply Drizzle schema migrations
```

## Project Structure

```
client/src/
├── pages/              # Route page components (default exports)
├── components/
│   ├── ui/             # shadcn/ui primitives (named exports)
│   ├── layout/         # Sidebar, Header
│   ├── overview/       # Dashboard components
│   ├── offline-conversions/
│   ├── locations2/     # Location management
│   ├── reviews/
│   ├── catalog/
│   ├── onboarding/
│   └── shared/         # Shared/utility components
├── hooks/              # Custom React hooks
├── contexts/           # LanguageContext (en/tr)
├── lib/
│   ├── utils.ts        # cn() - Tailwind merge utility
│   ├── formatters.ts   # fCurrency, fNumber, fPercent, useLocales
│   ├── queryClient.ts  # React Query + mock data service
│   ├── mockData.ts     # Mock data for all endpoints
│   ├── route-config.ts # Route config with breadcrumbs
│   ├── mock/           # Mock data modules
│   ├── translations/   # en.json, tr.json
│   └── types/          # TypeScript type definitions
└── App.tsx             # Router, providers, theme setup

server/
├── index.ts            # Express server entry
├── routes.ts           # API routes (currently stub endpoints)
├── storage.ts          # Data persistence layer
└── vite.ts             # Vite dev middleware

shared/
└── schema.ts           # Drizzle schema + Zod validators
```

## Path Aliases

```
@/*       → client/src/*
@shared/* → shared/*
@assets   → attached_assets/
```

## Code Conventions

### Imports
Order: React/external libs → hooks/contexts → components → utilities/types → assets

```typescript
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
```

### Components
- **Pages:** Function declarations with `export default`
- **UI primitives (shadcn):** `React.forwardRef` with named exports
- **Feature components:** Function declarations with `export default`
- **Utilities/formatters:** Arrow functions with named exports

### Styling
- Tailwind utility classes as primary styling method
- `cn()` from `@/lib/utils` for conditional/merged classes
- CSS variables for theming (defined in `index.css`)
- MUI ThemeProvider wraps the app (primary: `#3b82f6`, secondary: `#64748b`)

### State Management
- TanStack Query for server state (currently backed by mock data service)
- React Context for language/i18n
- Local state for UI concerns

### Translations
- Access via `useLocales()` hook which returns `t('key.path')` function
- Supports nested keys: `t('overview.title')`
- Supports variables: `{{varName}}` or `{varName}` in translation strings
- Files: `client/src/lib/translations/en.json` and `tr.json`

## Database Schema (shared/schema.ts)

Tables: `users`, `platforms`, `locations`, `campaigns`, `metrics`, `enrichmentSuggestions`, `alerts`

Insert schemas generated via `drizzle-zod`. Types exported as `InsertUser`/`User`, `InsertPlatform`/`Platform`, etc.

## API Routes

Currently stub endpoints returning mock data messages:
- `GET /api/overview`
- `GET /api/metrics`
- `GET /api/enrichment-suggestions`
- `PATCH /api/enrichment-suggestions/:id`
- `DELETE /api/alerts/:id`

Frontend fetches are intercepted by the mock data service in `queryClient.ts`.

## Key Patterns

- **Mock data architecture:** All API calls go through `mockDataService` in `queryClient.ts` — no real backend calls yet
- **Route groups:** Standalone pages (onboarding, signup, welcome) render without sidebar; main app routes include sidebar + header
- **Sidebar:** Collapsible, auto-collapses on `/venuex-ai` route
- **Currency:** Turkish Lira (₺) via `fCurrency()`
- **Icons:** Lucide React as primary icon library
- **Notifications:** notistack snackbars via `toast` utility
- **Forms:** React Hook Form + Zod validation

### Default Card Structure

Every card/section component follows a three-layer visual hierarchy. **Use this by default for all new components unless explicitly told otherwise.**

**Layers (outside → inside):**
1. **`vx-card`** — outer white container with rounded border (`bg-white rounded-lg border border-gray-200`)
2. **`vx-card-header`** — gray-50 header bar with border-bottom (`px-6 py-4 border-b border-gray-100 bg-gray-50`)
3. **`vx-card-body vx-surface-muted`** — gray-50 body area (`p-6 bg-gray-50`)
4. **Inner white sections** — content cards sitting on the muted body (`p-5 bg-white rounded-lg border border-gray-100 shadow-sm`)

**Page placement:** Always wrap in `<div className="vx-section-stack">` for correct horizontal padding (`px-6`) and vertical spacing (`mt-6`).

**Sticky tab bars:** Pages with tab navigation (e.g. Locations, Catalog) use a sticky bar that pins to the top of the scroll container. The header is **not** sticky — it scrolls away with the page. Therefore tab bars must always use `sticky top-0`, never `sticky top-16`. Use `py-2` for compact vertical padding inside the tab wrapper. Pattern:

```html
<div className="sticky top-0 z-40 bg-white border-b border-gray-200">
  <div className="px-6 py-2">
    <div className="vx-tabs">...</div>
  </div>
</div>
```

**Complete template:**

```tsx
import { Info } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { t } = useTranslation();
  const oc = t.myModule as any; // direct object access, NOT useLocales()

  return (
    <div className="vx-card">
      {/* Header */}
      <div className="vx-card-header">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-foreground">{oc?.title || 'Fallback Title'}</h3>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
              {oc?.tooltip || 'Fallback tooltip text'}
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{oc?.desc || 'Fallback description'}</p>
      </div>

      {/* Body — gray muted background */}
      <div className="vx-card-body vx-surface-muted space-y-4">
        {/* Inner white section(s) */}
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
          {/* Content here */}
        </div>
      </div>
    </div>
  );
}
```

**Translation access:** Use `useTranslation()` with direct object access (`t.module as any` → `oc?.key`). Do NOT use `useLocales()` for component-level translations — its `getNestedValue` path resolver is unreliable for dynamically added keys.

**Key rules:**
- All tooltip/description strings must exist in both `en.json` and `tr.json`
- Key naming: `{componentTooltip}` and `{componentDesc}` under the relevant module section
- Always provide `|| 'Fallback'` for every translation access

## Production API Contract Patterns

These patterns are derived from production code. When building any new feature in this prototype, follow them exactly so engineering can plug in real backends with minimal changes.

### Metric Shape — Every numeric KPI must use this type

```typescript
interface Metric {
  value: number;       // current period value
  change: number;      // % change vs comparison period (pre-computed server-side)
  past_value?: number; // comparison period value (for tooltip/reference)
}
```

Never use a plain `number` for a KPI that will have period-over-period comparison. Always use `Metric`. Example:

```typescript
// Wrong
interface SummaryData { revenue: number; }

// Correct
interface SummaryData { revenue: Metric; clicks: Metric; roas: Metric; }
```

### API Hook Pattern

Data-fetching hooks follow this shape in production:

```typescript
useApi{Resource}({
  brandId: string;      // always scoped to a brand
  provider: Provider;   // "google" | "meta" | "tiktok"
  payload: {
    startDate: string;
    endDate: string;
    campaign?: string;   // ALL_CAMPAIGNS_ID for aggregate
    campaigns?: string[];
    campaignTypes?: string[];
  };
  enabled: boolean;     // gates the fetch — false when platform not connected or filters incomplete
})
```

Mock hooks in the prototype should accept the same signature and respect `enabled`.

### Provider Enum

Platforms are always typed as `"google" | "meta" | "tiktok"` (lowercase). Do not use display strings like `"Google"` as values — use them only for labels. The production `Provider` enum also includes `"apple"` and `"yandex"` for future expansion.

### Normalized Responses

When a single endpoint aggregates data from multiple ad platforms into one consistent shape, prefix the type with `Normalized`:

```typescript
// Example: NormalizedAdMetricsResponse — same shape regardless of Google/Meta/TikTok
interface NormalizedAdMetricsResponse {
  cost: Metric;
  clicks: Metric;
  onlineRevenue: Metric;
  offlineRevenue: Metric;
  omniROAS: Metric;
  // ...
}
```

This signals to engineering that the backend must unify platform-specific response formats before returning.

## Commit Discipline

This repo has a `demo` branch that stays live as a clean showcase. Changes are cherry-picked from `main` → `demo`, so **commit hygiene is critical**.

### Rules
- **One commit = one logical change.** A feature, a fix, a refactor — never mixed together.
- **Never bundle unrelated work.** "LocationEditForm + A/B test page + random fix" in one commit is forbidden. Split them.
- **Experimental/WIP work gets its own commits.** A/B pages, test variants, throwaway explorations — separate commits so they can be excluded from demo cherry-picks.
- **Commit messages must be descriptive.** Use the pattern: `type(scope): what changed`. Examples:
  - `feat(locations): add WorkingHoursSection to edit form`
  - `fix(reviews): correct sentiment chart tooltip alignment`
  - `wip(catalog): A/B test for grid vs list layout` (WIP prefix = never goes to demo)
- **Keep commits small and self-contained.** If a cherry-pick requires pulling in 3 other commits to work, the commits were too tangled.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**PostHog Analytics Instrumentation**

Adding PostHog event tracking across the VenueX platform demo so we can see how visitors engage with each module after passing through the demo gate. The app is an already-built React prototype — this project instruments it with meaningful analytics events without changing any existing functionality.

**Core Value:** Every demo visitor's journey through the platform is captured in PostHog — which modules they explore, how deep they go, and where they drop off.

### Constraints

- **No functionality changes**: Only add tracking — never modify existing UX or behavior
- **Silent failures**: If PostHog is unavailable, tracking calls must not break the app
- **Existing patterns**: Use the app's existing import/module conventions (see CLAUDE.md)
- **Minimal footprint**: One helper file + surgical edits to existing components
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.6.3 - Core language for all client, server, and shared code
- JavaScript (ESM) - Used in build tooling and Node.js runtime
- JSON - Translation files (`en.json`, `tr.json` in `client/src/lib/translations/`)
- CSS - Tailwind utilities + CSS variables for theming
## Runtime
- Node.js (v20 as per `@types/node`) - Backend runtime via Express.js
- Browser (React 18) - Frontend runtime
- npm
- Lockfile: `package-lock.json` present and committed
## Frameworks
- React 18.3.1 - UI framework
- React DOM 18.3.1 - DOM rendering
- Wouter 3.3.5 - Lightweight client-side routing (replaces React Router)
- TanStack React Query (React Query) 5.60.5 - Server state management and caching
- React Context API - Global state for language (`LanguageContext`), brand (`BrandContext`), auth (`AuthContext`)
- Express.js 4.21.2 - HTTP server framework
- TypeScript - Compiled to ESNext module format via tsx/esbuild
- Drizzle ORM 0.39.1 - Typesafe SQL ORM with PostgreSQL support
- Drizzle Kit 0.30.4 - Schema management and migrations
- PostgreSQL (Neon serverless via `@neondatabase/serverless` 0.10.4) - Primary database
- Zod 3.24.2 - Schema validation and Drizzle schema -> TypeScript type generation via drizzle-zod 0.7.0
- Material-UI (MUI) v7.3.2 - Component library with theme provider
- MUI Lab 7.0.0-beta.17 - Additional components
- MUI Icons 7.3.2 - Icon library
- shadcn/ui - Headless component primitives (custom styled, not via npm)
- Radix UI (comprehensive suite) - Unstyled accessible primitives:
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- Tailwind CSS Vite plugin 4.1.3 - Build integration
- Tailwind CSS Typography 0.5.15 - Prose styling
- Tailwind CSS Animate 1.0.7 - Animation utilities
- CSS Variables - Defined in `client/src/index.css` for theming
- @emotion/react 11.14.0, @emotion/styled 11.14.1 - CSS-in-JS for MUI
- React Hook Form 7.55.0 - Form state management
- @hookform/resolvers 3.10.0 - Zod integration with React Hook Form
- Zod Validation Error 3.4.0 - Human-readable validation error formatting
- Input OTP 1.4.2 - OTP input component
- Recharts 2.15.2 - React charting library for KPI dashboards
- D3 7.9.0 - Lower-level data visualization (used alongside Recharts)
- @types/d3 7.4.3 - TypeScript types for D3
- Leaflet 1.9.4 - Mapping library
- React Leaflet 4.2.1 - React bindings for Leaflet
- @types/leaflet 1.9.20 - TypeScript types for Leaflet
- react-simple-maps 3.0.0 - SVG-based mapping (alternative approach)
- Turkey Neighbourhoods 4.0.3 - Turkish geography/districts data
- notistack 3.0.2 - Toast/snackbar notifications (snackbar provider used in App)
- Framer Motion 11.13.1 - Animation library
- Lucide React 0.453.0 - Primary icon library
- React Icons 5.4.0 - Icon set aggregator
- next-themes 0.4.6 - Theme provider (light/dark mode management)
- React Grab 0.1.24 - Grab/drag interaction
- React Resizable Panels 2.1.7 - Resizable panel layouts
- Embla Carousel React 8.6.0 - Carousel component
- Vaul 1.1.2 - Drawer component
- Class Variance Authority 0.7.1 - Type-safe CSS class composition
- CLSX 2.1.1 - Conditional className utility
- Tailwind Merge 2.6.0 - Merge Tailwind classes intelligently
- cmdk 1.1.1 - Command/search menu component
- date-fns 3.6.0 - Date parsing, formatting, manipulation
- react-day-picker 8.10.1 - Date picker component
- Passport.js 0.7.0 - Authentication middleware (installed but not configured in frontend)
- passport-local 1.0.0 - Local strategy (installed but not configured)
- express-session 1.18.1 - Session middleware (configured in server but frontend uses mock data)
- connect-pg-simple 10.0.0 - PostgreSQL session store for Express
- memorystore 1.6.7 - In-memory session store fallback
- ws (WebSockets) 8.18.0 - WebSocket server for real-time features
- @types/ws 8.5.13 - TypeScript types for ws
- posthog-js 1.364.6 - Product analytics (initialized in `client/src/main.tsx` with EU endpoint)
- PostHog React integration - React hooks and context provider
- @jridgewell/trace-mapping 0.3.25 - Source map support
## Build & Development Tools
- Vite 5.4.19 - Frontend build tool and dev server
- @vitejs/plugin-react 4.3.2 - React Fast Refresh support
- esbuild 0.25.0 - Fast TypeScript/JavaScript transpiler for server
- tsx 4.19.1 - TypeScript execution and Node.js loader
- ESLint 9.39.2 - Linting
- @eslint/js 9.39.2 - Core rules
- @typescript-eslint/parser 8.53.0 - TypeScript parser
- @typescript-eslint/eslint-plugin 8.53.0 - TypeScript rules
- typescript-eslint 8.53.0 - Unified configuration
- eslint-plugin-react 7.37.5 - React-specific rules
- eslint-plugin-react-hooks 7.0.1 - Hooks linting
- Prettier 3.8.0 - Code formatter
- eslint-config-prettier 10.1.8 - Disable ESLint rules that conflict with Prettier
- PostCSS 8.4.47 - CSS transformation
- autoprefixer 10.4.20 - Vendor prefixes
- TypeScript 5.6.3 - Strict type checking enabled (see tsconfig.json)
- Globals 17.0.0 - Global types for Node.js/browser
- @replit/vite-plugin-cartographer 0.4.0 - Replit-specific Vite plugin
- @replit/vite-plugin-runtime-error-modal 0.0.3 - Replit error display
- @playwright/test 1.59.1 - E2E testing framework
- Configuration: `playwright.config.ts`
## Configuration Files
- `tsconfig.json` - Strict mode enabled, ESNext modules, path aliases for `@/*` and `@shared/*`
- No explicit Vite config file found (uses defaults) but Tailwind CSS Vite plugin integrated
- Drizzle Kit config: `drizzle.config.ts` (requires `DATABASE_URL` env var)
- `.prettierrc` - 2 space tabs, single quotes, trailing commas, 100 char line width
- `package.json` - ESM modules (`"type": "module"`)
## Environment Configuration
- `DATABASE_URL` - PostgreSQL connection string (Neon serverless format) - **REQUIRED for build and migrations**
- `PORT` - Server port (default 5000, overridden to 5001 in dev via npm script)
- `NODE_ENV` - "development" or "production"
- API Key: `phc_4zYXhobdCe3U5MtVSkgGgBFYbl8gBCO4TtCt20YgoBC`
- Host: `https://eu.i.posthog.com`
- Location: `client/src/main.tsx`
- `.env` file (not committed, listed in `.gitignore`)
- `.env.*` patterns ignored except `.env.example`
## Build Output
- Client: Vite dev server at `http://localhost:5001` with hot module replacement
- Server: Express.js with Vite middleware via `server/vite.ts`
- Client: Static assets in `dist/` after `vite build`
- Server: Bundled CommonJS in `dist/index.js` after `esbuild` build
- Served together on configured `PORT`
## NPM Scripts
- `npm run dev` - Start dev server (PORT=5001, NODE_ENV=development, runs `tsx server/index.ts`)
- `npm run build` - Build client (Vite) + server (esbuild)
- `npm run start` - Start production server (NODE_ENV=production, runs `node dist/index.js`)
- `npm run check` - TypeScript type checking via `tsc`
- `npm run db:push` - Apply Drizzle schema migrations to database
- `npm run lint` - ESLint check on `.ts` and `.tsx`
- `npm run lint:fix` - ESLint with auto-fix
- `npm run format` - Prettier formatting
## Database Schema Location
- `shared/schema.ts` - Drizzle table definitions and Zod insert schemas
- Tables: `users`, `platforms`, `locations`, `campaigns`, `metrics`, `enrichmentSuggestions`, `alerts`, `notifications`
- Migrations: `migrations/` directory (generated by Drizzle Kit)
## Optional Dependencies
- `bufferutil` 4.0.8 - Performance optimization for WebSocket compression (for `ws` package)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Components: PascalCase (e.g., `LocationsTable.tsx`, `KpiCards.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useApiOverview.ts`, `useFilteredCampaigns.ts`)
- Pages: camelCase (e.g., `overview.tsx`, `locations.tsx`)
- Utility modules: kebab-case (e.g., `mock-location-data.ts`, `query-keys.ts`)
- Type definition files: camelCase with `.d.ts` extension for ambient types (e.g., `react-simple-maps.d.ts`)
- Component functions: PascalCase for default exports
- Custom hooks: camelCase with `use` prefix (e.g., `useApiOverview`, `useBrandContext`)
- Utility functions: camelCase (e.g., `fCurrency`, `cn`, `getNestedValue`)
- Arrow functions for exports in utility modules (e.g., `export const fCurrency = (value: number)`)
- camelCase for all variable names
- SCREAMING_SNAKE_CASE for constants and query keys (e.g., `QUERY_KEYS.OVERVIEW`, `STALE_TIMES.INSIGHTS`)
- Underscore prefix (`_`) for intentionally unused parameters (e.g., `(_req: Request, res: Response)`)
- TypeScript interfaces and types: PascalCase (e.g., `KpiCardsProps`, `OverviewData`)
- Interfaces: PascalCase (e.g., `LanguageContextType`, `PlatformConnection`, `LocationSummary`)
- Type aliases: PascalCase (e.g., `Provider`, `Language`)
- Union types: descriptive names in SCREAMING_SNAKE_CASE when used as constants (e.g., `"google" | "meta" | "tiktok"`)
## Code Style
- Tool: Prettier
- Config: `.prettierrc`
- Tool: ESLint with `@typescript-eslint` and React plugins
- Key rules:
## Import Organization
- `@/*` → `client/src/*` — primary alias for frontend source
- `@shared/*` → `shared/*` — shared code between client/server
- `@assets` → `attached_assets/` — static assets
## Error Handling
- No explicit try-catch blocks in the codebase currently
- Errors are handled at the API/hook level via React Query error state
- Page-level error boundaries show UI feedback with retry buttons (see `overview.tsx` error handling pattern)
- Error messages are passed through translation context (e.g., `db?.errorTitle || 'Failed to load dashboard'`)
## Logging
- Server logging: Uses `log()` utility from `vite.ts` for API request/response logging
- Client logging: No structured logging found; uses `console` if needed
- Server logs include: request method, path, status code, duration, and response JSON (truncated at 80 chars)
## Comments
- File headers with purpose (e.g., `/**Overview module data-fetching hooks.*/`)
- Context setup for complex logic (e.g., LanguageProvider localStorage sync comments)
- Query key and stale time purpose explanations
- Authentication/setup patterns that differ from standard React conventions
- Function parameters documented with JSDoc comments above function definitions
- Return types documented in TypeScript signatures (preferred over JSDoc)
- Params include: purpose, types, default values
## Function Design
- Pages (components in `pages/`): 40-100+ lines (large complex layouts acceptable)
- Feature components: 50-200 lines (modular, compose smaller components)
- UI primitives: 20-40 lines (thin wrappers around Radix/MUI)
- Utility functions: 5-20 lines (single responsibility)
- Prefer object destructuring for component props and hook arguments
- Named interfaces for prop types (e.g., `KpiCardsProps`)
- Optional parameters with `?` and default values in function signatures
- Component props include `children?: ReactNode` when needed
- Components: return JSX.Element (implicit in function components)
- Custom hooks: return `{ data, isLoading, error, refetch }` pattern (via React Query)
- Utility functions: return typed primitives or objects with clear shape
## Module Design
- Pages: `export default` for single component per file
- UI components (shadcn): `export { Card, CardHeader, ... }` — named exports for composable pieces
- Feature components: `export default` for primary component, named exports for subcomponents
- Hooks: `export function` for each hook
- Utilities: `export const` for formatters, `export function` for helpers
- `index.ts` in component directories re-exports for easier imports
- API hooks barrel: `client/src/hooks/api/index.ts` exports all `useApi*` hooks
- Enables: `import { useApiOverview } from '@/hooks/api'` instead of `from '@/hooks/api/use-api-overview'`
## State Management
- Centralized query keys in `client/src/hooks/query-keys.ts`
- Centralized stale times in `client/src/hooks/stale-times.ts`
- Hook signature pattern: `useApi{Resource}({ brandId, provider?, payload, enabled })`
- All hooks respect `enabled` flag to gate requests
- Global state: language selection (`LanguageContext`), brand context (`BrandContext`), auth (`AuthContext`)
- Context providers wrap entire app in `App.tsx`
- Each context has corresponding `useContext` hook with error checking
- UI state managed with `useState` (filter state, tab selection, modal visibility)
- Form state managed with React Hook Form
## Styling
- `cn()` from `@/lib/utils` for conditional/merged classes (combines `clsx` + `tailwind-merge`)
- CSS variables for theming (defined in root CSS, values in tailwind.config.ts)
- MUI ThemeProvider wraps app with primary: `#3b82f6`, secondary: `#64748b`
- Light mode only (dark mode support with `dark:` classes but not primary focus)
- Card structure: `vx-card` (outer container) → `vx-card-header` (gray-50 header) → `vx-card-body vx-surface-muted` (gray-50 body)
- Page wrapper: `vx-page` → `vx-page-body` → `vx-section-stack`
- Sticky tab bars: `sticky top-0 z-40 bg-white border-b border-gray-200` (never `top-16`)
- Icons: Lucide React primary, react-icons for platform logos (`SiGoogle`, `SiMeta`, `SiTiktok`)
## Translations
- Use `useTranslation()` hook which returns `{ t, language }`
- Access as direct object: `const db = t.dashboard as any; db?.key || 'Fallback'`
- Do NOT use `useLocales()` for component translations — its path resolver is unreliable for dynamic keys
- `client/src/lib/translations/en.json` and `tr.json`
- Keys follow pattern: `{module}.{section}.{element}` (e.g., `overview.header.title`, `locations.table.storeName`)
- Both `{{varName}}` and `{varName}` patterns supported in translation strings
- Example: `"Welcome, {{userName}}"` or `"Welcome, {userName}"`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Single-page application (SPA) built in React 18, routed via Wouter
- Mock data layer (`@/lib/api-config.ts`) intercepts all API calls before hitting the server
- Server (Express.js) exists for development and production serving only; real API endpoints are stubs
- All data persistence occurs in the browser (mock data service); no database writes active
- Three provider layers (Auth, Brand, Language) wrap the app with context-based state management
- Module-first component organization: `/components/{module}/` groups feature-specific UI
- Production-ready type contracts defined in `@/lib/types/` ahead of backend implementation
## Layers
- Purpose: Render UI, manage user interactions, fetch/display mock data
- Location: `client/src/`
- Contains: React components (TSX), hooks, contexts, utilities, type definitions
- Depends on: React 18, TanStack Query, shadcn/ui, MUI, Tailwind, Wouter
- Used by: End users via browser
- Purpose: URL-to-component mapping and breadcrumb management
- Location: `client/src/routes/`
- Contains: `index.tsx` (route definitions), `paths.ts` (path constants), `elements.tsx` (route component imports)
- Depends on: Page components from `client/src/pages/`
- Used by: App.tsx router logic
- Purpose: Centralized endpoint resolution and mock response generation
- Location: `client/src/lib/api-config.ts` (registry), `client/src/lib/mock/` (handlers)
- Contains: `API_REGISTRY` array with endpoint definitions, data service implementations
- Depends on: Mock data modules (locations.ts, segments.ts, reviews.ts, etc.)
- Used by: `queryClient.ts` when intercepting fetch requests
- Purpose: TanStack Query configuration and data hook definitions
- Location: `client/src/hooks/api/`, `client/src/lib/queryClient.ts`
- Contains: `useApiOverview`, `useApiLocations`, `useApiSegments`, etc.
- Depends on: API registry, TanStack Query, type definitions
- Used by: Page and component-level logic to fetch data
- Purpose: Cross-app state management for language, authentication, brand
- Location: `client/src/contexts/`
- Contains: `LanguageContext.tsx`, `AuthContext.tsx`, `BrandContext.tsx`
- Depends on: React Context API, localStorage
- Used by: All consuming components via hooks (`useLanguage`, `useAuth`, `useBrandContext`)
- Purpose: UI rendering and user interaction handling
- Location: `client/src/components/`
- Structure: Organized by module (`/overview/`, `/locations2/`, `/segments/`, etc.)
- Depends on: shadcn/ui, MUI, Recharts, Leaflet, Lucide icons, contexts, hooks
- Used by: Pages and other components
- Purpose: Full-page route components that compose sections
- Location: `client/src/pages/`
- Contains: 31 page files (e.g., `overview.tsx`, `locations.tsx`, `catalog.tsx`)
- Depends on: Feature components from `/components/`, hooks, contexts, types
- Used by: Router for rendering
- Purpose: Serve static assets in production, host dev server in development
- Location: `server/`
- Contains: Express setup, Vite middleware, static file serving
- Depends on: Express, Vite dev server, esbuild for production bundling
- Used by: Browser to fetch HTML/JS bundles and stub API responses
- Purpose: Database schema and Zod validators (future production use)
- Location: `shared/schema.ts`
- Contains: Drizzle ORM table definitions, insert schemas
- Depends on: Drizzle ORM, Zod
- Used by: Server-side validation (future); type references in client
## Data Flow
## Key Abstractions
- Purpose: Standardize period-over-period comparison across all dashboards
- Definition: `{ value: number; change: number; past_value?: number }`
- Examples: `client/src/lib/types/common.ts` line 15
- Pattern: Every numeric KPI uses this type; never plain `number` for metrics
- Purpose: Canonical platform identifier across all modules
- Values: `'google' | 'meta' | 'tiktok' | 'apple' | 'yandex'` (lowercase strings)
- Examples: `client/src/lib/types/common.ts` lines 26–32
- Pattern: Use lowercase enum, never display names as enum values
- Purpose: Single response shape for data aggregated from Google/Meta/TikTok
- Example: `NormalizedAdMetricsResponse` in `client/src/lib/types/common.ts` lines 136–149
- Pattern: Backend must unify platform-specific formats before returning
- Purpose: Declarative route definition with title and breadcrumbs
- Definition: `client/src/routes/index.tsx` lines 38–43
- Contains: path, component, title, breadcrumbs
- Pattern: All routes declared in `appRoutes` or `standaloneRoutes` array; getRouteConfig() resolver handles dynamic routes
- Purpose: Declarative endpoint with pattern matching and mock handler
- Definition: `client/src/lib/api-config.ts` lines 39–47
- Contains: description, method(s), pattern (string or RegExp), handler function
- Pattern: Ordered top-to-bottom; more specific patterns first
## Entry Points
- Location: `client/src/App.tsx`
- Triggers: Browser load of `/` or any route
- Responsibilities:
- Location: `client/src/App.tsx`, Router() function
- Triggers: URL change via Wouter
- Responsibilities:
- Location: `client/src/lib/api-config.ts`, `resolveEndpoint(method, url)`
- Triggers: Any `useQuery` or mutation
- Responsibilities:
- Location: `client/src/lib/mock/{module}.ts`
- Triggers: Endpoint handler invocation
- Responsibilities:
## Error Handling
- **Query Errors:** Caught by `useQuery`, exposed via `error` property. Pages check `if (error) render error UI`
- **Mutation Errors:** Caught by mutation hook, exposed in error state. Forms show error toast via `useToast()`
- **Default Behavior:** `queryClient.ts` sets `retry: false` for all queries; pages explicitly refetch on user request
- **Server Errors:** Express middleware in `server/index.ts` catches errors, logs them, returns `{ message: "..." }`
- **Boundary:** No global error boundary defined; errors bubble to component level
## Cross-Cutting Concerns
- Server logs API calls in `server/index.ts` middleware (method, path, status, duration, response snippet)
- Client has no centralized logging; uses browser console for debugging
- Forms use React Hook Form + Zod schemas (e.g., location form in `client/src/components/locations2/`)
- API payloads validated by mutation type definitions in `client/src/lib/types/mutations.ts`
- Server stubs don't validate (mock data only); future production server will use Drizzle insert schemas
- Session stored in AuthContext (`client/src/contexts/AuthContext.tsx`)
- No real auth backend; DemoGate component gates access to non-demo routes
- Production: Passport.js + express-session configured in server (currently disabled)
- LanguageContext manages current language (`en` or `tr`)
- Translations stored in JSON: `client/src/lib/translations/en.json`, `tr.json`
- Components access via `useTranslation()` hook or `useLocales()` for nested key resolution
- Pattern: `t.module as any` for direct object access; fallback strings required
- Tailwind CSS as primary (utility-first)
- `cn()` from `@/lib/utils.ts` for conditional class merging
- MUI ThemeProvider for Material UI component theming (primary: #3b82f6, secondary: #64748b)
- CSS custom properties in `client/src/index.css` for brand colors and spacing
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
