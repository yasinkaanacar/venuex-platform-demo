# Coding Conventions

**Analysis Date:** 2026-03-02

## Naming Patterns

**Files:**
- React components: PascalCase (`Header.tsx`, `SummaryTab.tsx`, `SegmentBuilderDialog.tsx`)
- Utility functions: camelCase (`formatters.ts`, `queryClient.ts`, `useFilteredCampaigns.ts`)
- Mock data: `mock-{module}-data.ts` (`mock-campaign-data.ts`, `mock-reviews-data.ts`, `mock-segments-data.ts`)
- Pages: kebab-case route pattern with `.tsx` extension (`offline-conversionsMVP.tsx` → `/offline-conversions`, `locations2.tsx` → `/locations`)
- Type definition files: plural or module-specific (`reviews.ts`, `segments.ts`, `locations.ts`)

**Functions:**
- React components: PascalCase with `export default` or named exports (`export default function Header()`, `export function useFilteredCampaigns()`)
- Hooks: camelCase with `use` prefix (`useFilteredCampaigns`, `useLanguage`, `useLocales`, `useMutation`, `useQuery`)
- Event handlers: camelCase prefixed with `handle` or `on` (`handleCreate()`, `handleRetry()`, `onSuccess`, `onError`)
- Utility functions: camelCase, exported as named exports (`fCurrency`, `fNumber`, `fPercent`, `cn()`, `showToast()`)

**Variables:**
- Local state: camelCase (`sidebarCollapsed`, `language`, `suggestions`)
- Constants: UPPER_SNAKE_CASE or camelCase (mix observed: `ALL_CAMPAIGNS_ID`, `staleTime`, `refetchInterval`)
- Boolean prefixes: `is`, `has`, `should` (`isLoading`, `isActive`, `isConnected`, `hasError`)

**Types:**
- Interface/Type names: PascalCase (`EnrichmentSuggestion`, `PageFilterState`, `Campaign`, `ReviewPlatform`, `SegmentType`)
- Union types: PascalCase (`ReviewSentiment`, `SegmentStatus`, `AdPlatform`)
- Generic/utility types: PascalCase (`Metric`, `NormalizedAdMetricsResponse`)

**React Components:**
- Page components: Default exports (`export default function Overview()`)
- UI primitives (shadcn): Named exports with `React.forwardRef` when needed (`export const Card = React.forwardRef(...)`)
- Feature components: Default exports (`export default function SummaryTab()`)

## Code Style

**Formatting:**
- Tool: Prettier
- Semicolons: enabled (`semi: true`)
- Single quotes: enforced (`singleQuote: true`)
- Trailing comma: "all" mode
- Print width: 100 characters
- Tab width: 2 spaces

**Linting:**
- Tool: ESLint (flat config: `eslint.config.mjs`)
- Rules applied:
  - `@typescript-eslint/no-unused-vars`: warn (allows `_` prefix for intentionally unused)
  - `@typescript-eslint/no-explicit-any`: warn
  - `react/react-in-jsx-scope`: off (React 18+)
  - `react-hooks/rules-of-hooks`: enforced

**TypeScript:**
- Strict mode: enabled (`strict: true`)
- Module resolution: bundler
- Target: ESNext
- No emit: true (only type checking)

## Import Organization

**Order:**
1. React and core external libraries (`import { useState } from 'react'`, `import { useQuery } from '@tanstack/react-query'`)
2. Hooks and contexts (`import { useLanguage } from '@/contexts/LanguageContext'`, `import { useFilteredCampaigns } from '@/hooks/useFilteredCampaigns'`)
3. Components (`import { Card, CardContent } from '@/components/ui/card'`, `import Header from '@/components/layout/Header'`)
4. Utilities and types (`import { cn } from '@/lib/utils'`, `import { fCurrency } from '@/lib/formatters'`, `import type { Campaign } from '@/lib/mock-campaign-data'`)
5. Assets and styles (last)

**Path Aliases (tsconfig.json):**
- `@/*` → `client/src/*` (preferred for client imports)
- `@shared/*` → `shared/*` (for shared schemas, types)

**Example:**
```typescript
import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { fCurrency } from '@/lib/formatters';
import type { Campaign } from '@/lib/mock-campaign-data';
```

## Error Handling

**Patterns:**
- Context/hook misuse: throw early with descriptive message
  ```typescript
  export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
      throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
  }
  ```

- Mutation errors: use `onError` callback with toast notification
  ```typescript
  const mutation = useMutation({
    mutationFn: async (data) => { /* ... */ },
    onSuccess: () => {
      toast({ type: 'success', title: 'Success', description: 'Item created' });
    },
    onError: () => {
      toast({ type: 'error', title: 'Error', description: 'Failed to create' });
    }
  });
  ```

- No explicit try/catch in components: rely on React Query's built-in error handling
- Query failures: never thrown; handled via `isError` flag or `onError` callbacks
- Validation: use Zod schemas from `shared/schema.ts` for runtime validation

## Logging

**Framework:** console (no dedicated logger library)

**Patterns:**
- No explicit logging in UI layer observed
- Console calls allowed for debugging but not persisted
- Error details communicated to user via toast notifications (`showToast()`)
- Component-level logging: none enforced

## Comments

**When to Comment:**
- Complex business logic (e.g., derived metric calculations in `useFilteredCampaigns.ts`)
- Non-obvious filter/aggregation steps
- Product-specific rules or constraints

**JSDoc/TSDoc:**
- Not consistently used; observed on interfaces for clarity
  ```typescript
  /** Date string: "Jan 6" for daily, "Jan 6" for weekly, "Jan 2026" for monthly */
  label: string;
  ```
- Component documentation: minimal, logic is self-explanatory
- Type definitions: docstring for complex union types

**Deprecation markers:** Observed in type definitions
  ```typescript
  /** @deprecated Use ReviewTrendDataPoint instead */
  export interface ReviewTrendWeek { /* ... */ }
  ```

## Function Design

**Size:**
- Keep functions under 100 lines where possible
- Separate concerns: filtering, aggregation, derivation as distinct functions
- Example in `useFilteredCampaigns.ts`: separate `aggregateTotals()`, `derivedFromTotals()`, filter logic

**Parameters:**
- Prefer object parameters over positional args when >2 parameters
  ```typescript
  useFilteredCampaigns(filters: PageFilterState)
  showToast({ type, title, description }: ToastOptions)
  ```

**Return Values:**
- Functions return strongly typed objects, not plain numbers or strings
  ```typescript
  // Wrong
  function getTotalRevenue(): number { /* ... */ }

  // Correct
  function getMetrics(): { totals: AggregatedTotals; derived: DerivedMetrics } { /* ... */ }
  ```

- Hooks return objects or tuples with stable identities
  ```typescript
  useQuery<EnrichmentSuggestion[]>({ queryKey: [...], queryFn: ... })
  useMutation({ mutationFn: ..., onSuccess: ..., onError: ... })
  ```

## Module Design

**Exports:**
- Pages: `export default` only
- Components: `export default` for feature components, `export const` for UI primitives
- Hooks: named exports (`export function useFilteredCampaigns()`)
- Utilities: named exports (`export const fCurrency = (...)`)
- Types: named exports (`export type Campaign = ...`)

**Barrel Files:**
- Not heavily used; components typically import directly from files
- Example: `@/components/ui/card` imports `Card` and `CardContent` with named exports

**Module Structure Pattern:**
- Feature modules group related functionality: `components/offline-conversions/`, `components/segments/`
- Shared utilities in `lib/` directory
- Types co-located with modules or in `lib/types/`

## Styling Conventions

**Tailwind CSS:**
- Primary styling method; utility classes in JSX className attributes
- Merge conflicts handled with `cn()` utility from `@/lib/utils`
  ```typescript
  className={cn('p-4 bg-white', isActive && 'bg-blue-100')}
  ```

**MUI Integration:**
- MUI v7 theme provider wraps app (`ThemeProvider` in `App.tsx`)
- Primary color: `#3b82f6` (Tailwind blue-500)
- Secondary color: `#64748b` (Tailwind slate-600)
- MUI components used alongside Tailwind (Button accepts `sx` prop, Icon props)
- No CSS-in-JS files; styles declarative in component attributes

**Theme Variables:**
- CSS custom properties defined in `index.css`
- Dark mode: declared but light mode only in current design
- Font: Inter family, fallback to system fonts

**Card Component Pattern (Default Structure):**
Three-layer visual hierarchy for all cards/sections:
1. Outer `.vx-card` — white container with rounded border (`bg-white rounded-lg border border-gray-200`)
2. `.vx-card-header` — gray header bar (`px-6 py-4 border-b border-gray-100 bg-gray-50`)
3. `.vx-card-body vx-surface-muted` — gray-50 body (`p-6 bg-gray-50`)
4. Inner white sections (content cards) — sit on muted body (`p-5 bg-white rounded-lg border border-gray-100 shadow-sm`)

Page placement: Wrap all cards in `<div className="vx-section-stack">` for consistent horizontal padding (`px-6`) and vertical spacing (`mt-6`).

## Translation & Internationalization

**System:**
- React Context-based (custom, not i18next)
- Language context: `LanguageContext` from `@/contexts/LanguageContext.tsx`

**Access Pattern (Two Options):**

1. **Direct object access (preferred for components):**
   ```typescript
   const { t } = useTranslation(); // returns translations object
   const oc = t.myModule as any;   // direct access, NOT useLocales()
   <h3>{oc?.title || 'Fallback Title'}</h3>
   ```

2. **Nested key access (for dynamic paths):**
   ```typescript
   const { t } = useLocales(); // returns t() function
   <span>{t('overview.header.title')}</span>
   ```

**File Structure:**
- `client/src/lib/translations/en.json` — English translations
- `client/src/lib/translations/tr.json` — Turkish translations
- Nested key structure: `{module}.{section}.{element}`

**Token Naming Convention:**
- Keys follow pattern: `{module}.{feature}.{element}`
- Example: `catalog.summary.title`, `segments.builder.createButton`, `reviews.inbox.noReviews`
- Tooltip keys: `{componentTooltip}`, description keys: `{componentDesc}`

**Important Rules:**
- All new translation keys must be added to BOTH `en.json` AND `tr.json`
- When accessing translations in components, always provide fallback: `t.module?.key || 'Fallback'`
- Variable substitution in strings: `{{varName}}` or `{varName}` syntax
- Do NOT use `useLocales()` for component-level translations; its `getNestedValue()` splitting is unreliable

## State Management

**Server State (React Query):**
- All API calls go through `@tanstack/react-query` (v5)
- Mock data service intercepts calls in `queryClient.ts`
- Query key format: `['/api/endpoint']` matching API route
- Stale time: Infinity (no auto-refetch in prototype)
- Retry: disabled for prototype

**Local UI State:**
- useState for toggle/collapse/form input state
- Example: `sidebarCollapsed`, `language`, filter selections

**Context (i18n):**
- `LanguageContext` for language selection
- Persists to localStorage (`venuex-language` key)
- Initialized on mount from localStorage or defaults to 'en'

**No Redux, no Zustand:** Kept minimal by design.

## Data Type Patterns

**Metric Type (for all KPIs with period-over-period):**
```typescript
interface Metric {
  value: number;       // current period
  change: number;      // % change vs comparison period
  past_value?: number; // comparison period value
}

// Usage: revenue: Metric; clicks: Metric; roas: Metric;
// NOT: revenue: number; clicks: number;
```

**Filter State Pattern:**
```typescript
interface PageFilterState {
  dateRange: string;
  platforms: string[];
  campaigns: string[];
  campaignTypes: string[];
  activeOnly: boolean;
  compareMode: boolean;
}
```

**Aggregation Result Pattern:**
```typescript
interface AggregatedTotals {
  spend: number;
  offlineConversions: number;
  offlineRevenue: number;
  // ... more fields
}

interface DerivedMetrics {
  offlineROAS: number;
  onlineROAS: number;
  // ... more calculated fields
}

return { campaigns, totals, derived, byPlatform, byCampaignType };
```

---

*Convention analysis: 2026-03-02*
