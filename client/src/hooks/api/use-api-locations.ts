/**
 * Locations module data-fetching hooks.
 *
 * Production signature: { brandId, provider?, payload, enabled }
 * Wraps useQuery with centralized QUERY_KEYS and STALE_TIMES.
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { STALE_TIMES } from '@/hooks/stale-times';
import type { LocationFormRecord } from '@/lib/types/location-form';
import type { LocationCreatePayload, LocationUpdatePayload } from '@/lib/types/mutations';

// ── Params ──────────────────────────────────────────────────────────

interface UseApiLocationFormParams {
  brandId: string;
  locationId?: string;
  enabled?: boolean;
}

interface UseApiLocationMutationParams {
  brandId: string;
}

// ── Queries ─────────────────────────────────────────────────────────

export function useApiLocationForm({
  brandId,
  locationId,
  enabled = true,
}: UseApiLocationFormParams) {
  return useQuery<LocationFormRecord | null>({
    queryKey: [QUERY_KEYS.LOCATION_FORM, locationId],
    enabled: enabled && !!brandId && !!locationId,
    staleTime: STALE_TIMES.LOCATIONS,
  });
}

// ── Mutations ───────────────────────────────────────────────────────

export function useCreateLocation({ brandId }: UseApiLocationMutationParams) {
  return useMutation({
    mutationFn: async (data: LocationCreatePayload) => {
      const res = await apiRequest('POST', '/api/location-form', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOCATION_FORM] });
    },
  });
}

export function useUpdateLocation({ brandId }: UseApiLocationMutationParams) {
  return useMutation({
    mutationFn: async ({
      locationId,
      data,
    }: {
      locationId: string;
      data: LocationUpdatePayload;
    }) => {
      const res = await apiRequest('PATCH', `/api/location-form/${locationId}`, data);
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOCATION_FORM, variables.locationId],
      });
    },
  });
}
