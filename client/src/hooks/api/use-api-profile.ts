/**
 * Profile module data-fetching hooks.
 *
 * Production signature: { brandId, payload?, enabled }
 * Wraps useQuery with centralized QUERY_KEYS and STALE_TIMES.
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { STALE_TIMES } from '@/hooks/stale-times';
import type { ProfileUser, TeamMember, TeamInvite } from '@/lib/types/profile';
import type { ProfileUpdatePayload } from '@/lib/types/mutations';

// ── Params ──────────────────────────────────────────────────────────

interface UseApiProfileParams {
  brandId: string;
  enabled?: boolean;
}

// ── Queries ─────────────────────────────────────────────────────────

export function useApiProfile({ brandId, enabled = true }: UseApiProfileParams) {
  return useQuery<ProfileUser>({
    queryKey: [QUERY_KEYS.PROFILE],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SETTINGS,
  });
}

export function useApiProfileTeam({ brandId, enabled = true }: UseApiProfileParams) {
  return useQuery<TeamMember[]>({
    queryKey: [QUERY_KEYS.PROFILE_TEAM],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SETTINGS,
  });
}

export function useApiProfileInvites({ brandId, enabled = true }: UseApiProfileParams) {
  return useQuery<TeamInvite[]>({
    queryKey: [QUERY_KEYS.PROFILE_INVITES],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SETTINGS,
  });
}

// ── Mutations ───────────────────────────────────────────────────────

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: ProfileUpdatePayload) => {
      const res = await apiRequest('PATCH', '/api/profile', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
    },
  });
}
