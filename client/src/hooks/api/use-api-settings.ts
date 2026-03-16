/**
 * Settings module data-fetching hooks.
 *
 * Production signature: { brandId, payload?, enabled }
 * Wraps useQuery with centralized QUERY_KEYS and STALE_TIMES.
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { STALE_TIMES } from '@/hooks/stale-times';
import type {
  BusinessProfile,
  CompletionChecklistItem,
  StoreSet,
  DataSourceConnection,
  ActivityFeedEntry,
} from '@/lib/types/settings';
import type {
  BusinessProfileUpdatePayload,
  StoreSetCreatePayload,
  StoreSetUpdatePayload,
} from '@/lib/types/mutations';

// ── Params ──────────────────────────────────────────────────────────

interface UseApiSettingsParams {
  brandId: string;
  enabled?: boolean;
}

// ── Queries ─────────────────────────────────────────────────────────

export function useApiSettingsProfile({ brandId, enabled = true }: UseApiSettingsParams) {
  return useQuery<BusinessProfile>({
    queryKey: [QUERY_KEYS.SETTINGS_PROFILE],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SETTINGS,
  });
}

export function useApiSettingsCompletion({ brandId, enabled = true }: UseApiSettingsParams) {
  return useQuery<CompletionChecklistItem[]>({
    queryKey: [QUERY_KEYS.SETTINGS_COMPLETION],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SETTINGS,
  });
}

export function useApiSettingsStoreSets({ brandId, enabled = true }: UseApiSettingsParams) {
  return useQuery<StoreSet[]>({
    queryKey: [QUERY_KEYS.SETTINGS_STORE_SETS],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SETTINGS,
  });
}

export function useApiSettingsDataSources({ brandId, enabled = true }: UseApiSettingsParams) {
  return useQuery<DataSourceConnection[]>({
    queryKey: [QUERY_KEYS.SETTINGS_DATA_SOURCES],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SETTINGS,
  });
}

export function useApiSettingsActivityFeed({ brandId, enabled = true }: UseApiSettingsParams) {
  return useQuery<ActivityFeedEntry[]>({
    queryKey: [QUERY_KEYS.SETTINGS_ACTIVITY_FEED],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SETTINGS,
  });
}

// ── Mutations ───────────────────────────────────────────────────────

export function useUpdateBusinessProfile() {
  return useMutation({
    mutationFn: async (data: BusinessProfileUpdatePayload) => {
      const res = await apiRequest('PATCH', '/api/settings/profile', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS_PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS_COMPLETION] });
    },
  });
}

export function useCreateStoreSet() {
  return useMutation({
    mutationFn: async (data: StoreSetCreatePayload) => {
      const res = await apiRequest('POST', '/api/settings/store-sets', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS_STORE_SETS] });
    },
  });
}

export function useUpdateStoreSet() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StoreSetUpdatePayload }) => {
      const res = await apiRequest('PATCH', `/api/settings/store-sets/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS_STORE_SETS] });
    },
  });
}

export function useDeleteStoreSet() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/settings/store-sets/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS_STORE_SETS] });
    },
  });
}
