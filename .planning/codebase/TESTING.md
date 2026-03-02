# Testing Patterns

**Analysis Date:** 2026-03-02

## Test Framework

**Runner:**
- Not yet configured — no test runner installed
- No Jest, Vitest, or other testing framework in package.json
- TypeScript type checking via `tsc` only (`npm run check`)

**Assertion Library:**
- Not installed — testing not yet implemented in codebase

**Run Commands:**
```bash
npm run check              # Type checking only (tsc)
npm run lint               # ESLint validation
npm run lint:fix           # Auto-fix lint issues
npm run format             # Prettier formatting
```

## Test File Organization

**Location:**
- No test files in codebase (prototype phase)
- TypeScript compiler config explicitly excludes `**/*.test.ts` from output
- Pattern when tests are added should be: co-locate test files with source

**Naming:**
- Recommended: `.test.ts` or `.test.tsx` extension (based on config exclusion pattern)
- Alternative observed: `.spec.ts` pattern in dependencies

**Structure:**
- Tests should match file location: `src/lib/formatters.ts` → `src/lib/formatters.test.ts`
- Component tests: `src/components/layout/Header.test.tsx` (co-located)

## Test Structure

**Current State:**
- No test suites currently written
- No mocking framework configured

**Recommended Pattern (based on codebase architecture):**

Unit tests for utilities should test pure functions:
```typescript
describe('formatters', () => {
  describe('fCurrency', () => {
    it('should format millions correctly', () => {
      expect(fCurrency(1500000)).toBe('₺1.5M');
    });
    it('should format thousands correctly', () => {
      expect(fCurrency(5000)).toBe('₺5K');
    });
    it('should format small amounts with locale', () => {
      expect(fCurrency(100)).toBe('₺100');
    });
  });

  describe('fNumber', () => {
    it('should format large numbers without currency', () => {
      expect(fNumber(1000000)).toBe('1M');
    });
  });

  describe('fPercent', () => {
    it('should format with one decimal place', () => {
      expect(fPercent(33.456)).toBe('33.5%');
    });
  });
});
```

Hook tests should use React Testing Library patterns:
```typescript
describe('useFilteredCampaigns', () => {
  it('should aggregate totals correctly', () => {
    const filters: PageFilterState = {
      dateRange: '30d',
      platforms: ['google', 'meta'],
      campaigns: [],
      campaignTypes: [],
      activeOnly: false,
      compareMode: false,
    };
    const result = renderHook(() => useFilteredCampaigns(filters));
    expect(result.current.totals.spend).toBeGreaterThan(0);
  });

  it('should filter by platform', () => {
    const filters: PageFilterState = {
      dateRange: '30d',
      platforms: ['google'],
      campaigns: [],
      campaignTypes: [],
      activeOnly: false,
      compareMode: false,
    };
    const result = renderHook(() => useFilteredCampaigns(filters));
    expect(result.current.byPlatform.get('google')).toBeDefined();
  });
});
```

Component tests should render and verify output:
```typescript
describe('Header', () => {
  it('should render breadcrumbs', () => {
    render(<Header />);
    // Expect breadcrumb elements to be present
  });

  it('should switch language', async () => {
    render(<LanguageProvider><Header /></LanguageProvider>);
    // Click language dropdown, select 'tr'
    // Verify language changes in context
  });
});
```

## Mocking

**Framework:** Not configured yet

**Recommended Approach (for production):**
- Use `vi` (Vitest) or Jest for mocking
- Mock React Query: `@tanstack/react-query` provides test utilities
- Mock hooks: use `jest.mock()` or Vitest's `vi.mock()`

**Current Mocking Strategy (Prototype):**
- All API calls routed through mock data service in `lib/queryClient.ts`
- `handleMockRequest()` intercepts fetch calls and returns mock data based on URL patterns
- No unit-level mocking needed: mock data service is the single source of truth

**Example: Mock data service intercept pattern:**
```typescript
// lib/queryClient.ts
async function handleMockRequest(method: string, url: string, data?: unknown) {
  if (url.includes('/api/segments/summary')) {
    return await mockDataService.getSegmentSummary();
  }
  if (url.includes('/api/segments') && method === 'POST') {
    return await segmentDataService.createSegment(data);
  }
  // ... more endpoints
}
```

**What to Mock:**
- External API calls (Google Ads, Meta, TikTok) — already handled by mock service
- React Query hooks: use `useQuery` test utilities or mock `@tanstack/react-query`
- Context providers: wrap components with provider in tests
- Browser APIs: `localStorage` (test `LanguageContext`)

**What NOT to Mock:**
- Utility functions (`fCurrency`, `fNumber`, `cn()`) — test as-is, they're pure
- Component event handlers — test actual click/change behavior
- React hooks from React core (`useState`, `useCallback`, etc.) — test behavior, not internals
- Tailwind CSS classes — verify via snapshot or className inspection

## Fixtures and Factories

**Test Data:**
- Use data from `mock-campaign-data.ts`, `mock-reviews-data.ts`, etc. as fixtures
- Example from `useFilteredCampaigns.ts`:
  ```typescript
  import { mockCampaigns } from '@/lib/mock-campaign-data';
  // In tests, filter and aggregate mockCampaigns directly
  ```

**Location:**
- Mock data modules: `client/src/lib/mock-*.ts`
- Test fixtures: Create `client/src/lib/fixtures/` directory for test-specific data
- Factories: Implement factory functions for common test objects
  ```typescript
  // client/src/lib/fixtures/campaign.ts
  export function createCampaign(overrides: Partial<Campaign> = {}): Campaign {
    return {
      id: 'campaign-1',
      name: 'Test Campaign',
      platform: 'google',
      spend: 1000,
      ...overrides,
    };
  }
  ```

## Coverage

**Requirements:** Not enforced in current setup

**Recommended targets (for production):**
- Utilities: 90%+ coverage (fCurrency, fNumber, filters, aggregations)
- Hooks: 80%+ coverage (useFilteredCampaigns, useLanguage)
- Components: 70%+ coverage (focus on user interactions, not implementation details)
- Pages: Smoke tests only (verify routing, layout)

**View Coverage:**
```bash
# When testing framework is added:
npm run test -- --coverage
# Will generate coverage reports in coverage/ directory
```

## Test Types

**Unit Tests:**
- Scope: Individual functions and small components in isolation
- Approach: Test pure functions (`formatters.ts`, aggregation logic), hooks with mock data
- Examples:
  - `fCurrency(5000)` → `'₺5K'`
  - `useFilteredCampaigns()` with different filter states
  - Utility functions: `cn()`, `getNestedValue()` for i18n

**Integration Tests:**
- Scope: Multiple components/hooks working together
- Approach: Render feature sections with mocked React Query
- Examples:
  - Campaign filter UI + `useFilteredCampaigns()` hook
  - LanguageContext + Header language switcher
  - Segments module: builder dialog + list + deletion flow

**E2E Tests:**
- Framework: Not configured
- Recommended: Playwright, Cypress, or Puppeteer when production-ready
- Focus areas:
  - End-to-end campaign creation/editing flow
  - Data pipeline (offline conversions) status updates
  - Multi-language UI navigation

## Common Patterns

**Async Testing:**
```typescript
// When testing React Query mutations
it('should handle successful mutation', async () => {
  const { result } = renderHook(() => useQuery({
    queryKey: ['/api/segments'],
    queryFn: async () => mockDataService.getSegments(),
  }), { wrapper: QueryClientProvider });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});

// When testing async utilities
it('should await mock request', async () => {
  const response = await handleMockRequest('GET', '/api/overview');
  expect(response.data).toBeDefined();
});
```

**Error Testing:**
```typescript
// Hook misuse
it('should throw when used outside provider', () => {
  expect(() => {
    renderHook(() => useLanguage());
  }).toThrow('useLanguage must be used within a LanguageProvider');
});

// Mutation error handling
it('should show error toast on failure', async () => {
  const { result } = renderHook(() => useMutation({
    mutationFn: () => Promise.reject(new Error('API error')),
    onError: (error) => showToast({ type: 'error', title: 'Error', description: error.message }),
  }));

  // Trigger mutation
  await expect(result.current.mutateAsync(data)).rejects.toThrow();
});
```

**React Query Testing:**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

it('should fetch and cache data', async () => {
  const { result } = renderHook(
    () => useQuery({
      queryKey: ['/api/segments'],
      queryFn: () => mockDataService.getSegments(),
    }),
    { wrapper }
  );

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

**Translation Testing:**
```typescript
it('should switch language', async () => {
  const { result } = renderHook(() => useLanguage(), {
    wrapper: LanguageProvider,
  });

  expect(result.current.language).toBe('en');

  act(() => {
    result.current.setLanguage('tr');
  });

  expect(result.current.language).toBe('tr');
  expect(localStorage.getItem('venuex-language')).toBe('tr');
});
```

**Mock Data Service Testing:**
```typescript
describe('mockDataService', () => {
  it('should return overview data with correct shape', async () => {
    const data = await mockDataService.getOverviewData();
    expect(data).toHaveProperty('dataHealth');
    expect(data).toHaveProperty('enrichmentSuggestions');
  });

  it('should handle segment creation', async () => {
    const segment = await segmentDataService.createSegment({
      name: 'Test Segment',
      type: 'value',
      status: 'active',
    });
    expect(segment.id).toBeDefined();
    expect(segment.name).toBe('Test Segment');
  });
});
```

## Getting Started with Testing

**Step 1: Install testing framework**
```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

**Step 2: Create vitest.config.ts**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@shared': resolve(__dirname, './shared'),
    },
  },
});
```

**Step 3: Create setup file**
```typescript
// client/src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

**Step 4: Add test script to package.json**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Key Testing Principles (for this codebase)

1. **Test behavior, not implementation** — Don't mock internal component state, test rendered output
2. **Use mock data service** — All API calls already routed through `mockDataService`, no additional mocking needed for integration tests
3. **Avoid snapshot tests** — Prefer explicit assertions; snapshots fragile with UI changes
4. **Keep tests close to source** — Co-locate test files with source files
5. **Test translations** — Verify fallbacks work, language switching works, keys exist in both locales
6. **Test aggregations** — Focus on `useFilteredCampaigns` and similar calculation-heavy hooks
7. **Test error boundaries** — Ensure error states in mutations and async operations handled properly

---

*Testing analysis: 2026-03-02*
