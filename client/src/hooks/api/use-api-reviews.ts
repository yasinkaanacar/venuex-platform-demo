/**
 * Reviews module data-fetching hooks.
 *
 * Production signature: { brandId, provider?, payload, enabled }
 * Wraps useQuery with centralized QUERY_KEYS and STALE_TIMES.
 *
 * Note: Reviews currently load mock data inline in the page component.
 * This hook is a stub ready for when reviews data flows through useQuery.
 */

import { STALE_TIMES } from '@/hooks/stale-times';
import type { Provider } from '@/lib/types/common';

// ── Params ──────────────────────────────────────────────────────────

interface UseApiReviewsParams {
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
 * Placeholder for when the reviews module migrates to useQuery-based
 * data fetching. Currently reviews load data from mock files directly.
 *
 * Future query keys to register:
 * - QUERY_KEYS.REVIEWS
 * - QUERY_KEYS.REVIEWS_KPI
 * - QUERY_KEYS.REVIEWS_LOCATIONS
 * - QUERY_KEYS.REVIEWS_THEMES
 * - QUERY_KEYS.REVIEWS_TREND
 */
export const REVIEWS_STALE_TIME = STALE_TIMES.REVIEWS;

export type { UseApiReviewsParams };
