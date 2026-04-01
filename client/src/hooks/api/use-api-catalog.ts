/**
 * Catalog module data-fetching hooks.
 *
 * Production signature: { brandId, provider?, payload, enabled }
 * Wraps useQuery with centralized QUERY_KEYS and STALE_TIMES.
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { STALE_TIMES } from '@/hooks/stale-times';
import type { CatalogPipelineData } from '@/lib/types/catalog';
import type { Provider } from '@/lib/types/common';

// ── Params ──────────────────────────────────────────────────────────

interface UseApiCatalogPipelineParams {
  brandId: string;
  provider?: Provider;
  enabled?: boolean;
}

// ── Hook ────────────────────────────────────────────────────────────

export function useApiCatalogPipeline({
  brandId,
  enabled = true,
}: UseApiCatalogPipelineParams) {
  return useQuery<CatalogPipelineData>({
    queryKey: [QUERY_KEYS.CATALOG_PIPELINE, brandId],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.LOCATIONS, // 24h — inventory syncs daily
    refetchInterval: 60_000,
  });
}
