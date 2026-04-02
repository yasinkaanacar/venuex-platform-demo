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
