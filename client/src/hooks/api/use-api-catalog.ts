/**
 * Catalog module data-fetching hooks.
 *
 * Production signature: { brandId, provider?, payload, enabled }
 * Wraps useQuery with centralized QUERY_KEYS and STALE_TIMES.
 *
 * Note: Catalog currently loads mock data inline in the page component.
 * This hook is a stub ready for when catalog data flows through useQuery.
 */

import { STALE_TIMES } from '@/hooks/stale-times';
import type { Provider } from '@/lib/types/common';

// ── Params ──────────────────────────────────────────────────────────

interface UseApiCatalogParams {
  brandId: string;
  provider?: Provider;
  payload?: {
    startDate: string;
    endDate: string;
  };
  enabled?: boolean;
}

// ── Stub ────────────────────────────────────────────────────────────

/**
 * Placeholder for when the catalog module migrates to useQuery-based
 * data fetching. Currently catalog loads data from mock files directly.
 *
 * Future query keys to register:
 * - QUERY_KEYS.CATALOG_PRODUCTS
 * - QUERY_KEYS.CATALOG_SOURCES
 * - QUERY_KEYS.CATALOG_SYNC_STATUS
 * - QUERY_KEYS.CATALOG_QUICK_STATS
 * - QUERY_KEYS.CATALOG_HYGIENE_ISSUES
 */
export const CATALOG_STALE_TIME = STALE_TIMES.LOCATIONS; // 24h — inventory syncs daily

export type { UseApiCatalogParams };
