/**
 * Overview module data-fetching hooks.
 *
 * Production signature: { brandId, provider?, payload, enabled }
 * Wraps useQuery with centralized QUERY_KEYS and STALE_TIMES.
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { STALE_TIMES } from '@/hooks/stale-times';
import type { OverviewData } from '@/lib/types/overview';
import type { Provider } from '@/lib/types/common';

// ── Params ──────────────────────────────────────────────────────────

interface UseApiOverviewParams {
  brandId: string;
  provider?: Provider;
  payload?: {
    startDate: string;
    endDate: string;
  };
  enabled?: boolean;
}

// ── Hook ────────────────────────────────────────────────────────────

export function useApiOverview({
  brandId,
  enabled = true,
}: UseApiOverviewParams) {
  return useQuery<OverviewData>({
    queryKey: [QUERY_KEYS.OVERVIEW, brandId],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.INSIGHTS,
    refetchInterval: 60_000,
  });
}
