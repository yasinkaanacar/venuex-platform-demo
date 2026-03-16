/**
 * Segments module data-fetching hooks.
 *
 * Production signature: { brandId, provider?, payload, enabled }
 * Wraps useQuery with centralized QUERY_KEYS and STALE_TIMES.
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { STALE_TIMES } from '@/hooks/stale-times';
import type {
  Segment,
  SegmentSummaryKPIs,
  SegmentPerformanceSummary,
  SegmentPerformanceDetail,
  SegmentAttribution,
  AttributionTimeseriesPoint,
  SegmentAutomationRule,
  SegmentOverlapResult,
  FeedLabel,
  LookalikeAudience,
  ABTestConfig,
  ReachProjection,
  AdPlatform,
  PerformancePeriod,
} from '@/lib/types/segments';

// ── Params ──────────────────────────────────────────────────────────

interface UseApiSegmentsParams {
  brandId: string;
  enabled?: boolean;
}

interface UseApiSegmentDetailParams {
  brandId: string;
  segmentId: string | null;
  enabled?: boolean;
}

// ── List & Summary ──────────────────────────────────────────────────

export function useApiSegments({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery<Segment[]>({
    queryKey: [QUERY_KEYS.SEGMENTS],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

export function useApiSegmentsSummary({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery<SegmentSummaryKPIs>({
    queryKey: [QUERY_KEYS.SEGMENTS_SUMMARY],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

// ── Performance ─────────────────────────────────────────────────────

export function useApiSegmentPerformanceSummaries({
  brandId,
  enabled = true,
}: UseApiSegmentsParams) {
  return useQuery<SegmentPerformanceSummary[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_PERFORMANCE_SUMMARIES],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.INSIGHTS,
  });
}

export function useApiSegmentPerformanceDetail({
  brandId,
  segmentId,
  period,
  enabled = true,
}: UseApiSegmentDetailParams & { period: PerformancePeriod }) {
  return useQuery<SegmentPerformanceDetail>({
    queryKey: [QUERY_KEYS.SEGMENTS_PERFORMANCE_DETAIL, segmentId, period],
    enabled: enabled && !!brandId && !!segmentId,
    staleTime: STALE_TIMES.INSIGHTS,
  });
}

// ── Attribution ─────────────────────────────────────────────────────

export function useApiSegmentAttribution({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery<SegmentAttribution[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_ATTRIBUTION],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.INSIGHTS,
  });
}

export function useApiSegmentAttributionTimeseries({
  brandId,
  segmentId,
  enabled = true,
}: UseApiSegmentDetailParams) {
  return useQuery<AttributionTimeseriesPoint[]>({
    queryKey: [`${QUERY_KEYS.SEGMENTS_ATTRIBUTION_TIMESERIES}/${segmentId}`],
    enabled: enabled && !!brandId && !!segmentId,
    staleTime: STALE_TIMES.INSIGHTS,
  });
}

// ── Automation ──────────────────────────────────────────────────────

export function useApiSegmentAutomation({
  brandId,
  segmentId,
  enabled = true,
}: UseApiSegmentDetailParams) {
  return useQuery<SegmentAutomationRule[]>({
    queryKey: [`${QUERY_KEYS.SEGMENTS_AUTOMATION}/${segmentId}`],
    enabled: enabled && !!brandId && !!segmentId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

// ── Reach Projection ────────────────────────────────────────────────

export function useApiSegmentReachProjection({
  brandId,
  segmentId,
  platform,
  enabled = true,
}: UseApiSegmentDetailParams & { platform: AdPlatform | null }) {
  return useQuery<ReachProjection>({
    queryKey: [`${QUERY_KEYS.SEGMENTS_REACH_PROJECTION}/${segmentId}/${platform}`],
    enabled: enabled && !!brandId && !!segmentId && !!platform,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

// ── Overlap & Insights ──────────────────────────────────────────────

export function useApiSegmentOverlap({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery<SegmentOverlapResult[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_OVERLAP],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

// ── Feed Labels ─────────────────────────────────────────────────────

export function useApiSegmentFeedLabels({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery<FeedLabel[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_FEED_LABELS],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

// ── Lookalikes & A/B Tests ──────────────────────────────────────────

export function useApiSegmentLookalikes({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery<LookalikeAudience[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_LOOKALIKES],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

export function useApiSegmentABTests({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery<ABTestConfig[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_AB_TESTS],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

// ── Exports & Push Log ──────────────────────────────────────────────

export function useApiSegmentExports({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEGMENTS_EXPORTS],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

export function useApiSegmentScheduledExports({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEGMENTS_EXPORTS_SCHEDULED],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

export function useApiSegmentPushLog({ brandId, enabled = true }: UseApiSegmentsParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEGMENTS_PUSH_LOG],
    enabled: enabled && !!brandId,
    staleTime: STALE_TIMES.SEGMENTS,
  });
}

// ── Mutations ───────────────────────────────────────────────────────

export function useCreateSegment() {
  return useMutation({
    mutationFn: async (data: Partial<Segment>) => {
      const res = await apiRequest('POST', '/api/segments', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS_SUMMARY] });
    },
  });
}

export function useDeleteSegment() {
  return useMutation({
    mutationFn: async (segmentId: string) => {
      const res = await apiRequest('DELETE', `/api/segments/${segmentId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS_SUMMARY] });
    },
  });
}
