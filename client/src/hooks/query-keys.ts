/**
 * Centralized query key registry for TanStack Query.
 *
 * Every useQuery / invalidateQueries / setQueryData call MUST reference
 * a key from this file — no inline "/api/..." strings elsewhere.
 */

export const QUERY_KEYS = {
  // ── Overview ──────────────────────────────────────────────
  OVERVIEW: '/api/overview',

  // ── Enrichment Suggestions ────────────────────────────────
  ENRICHMENT_SUGGESTIONS: '/api/enrichment-suggestions',

  // ── Notifications ─────────────────────────────────────────
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATIONS_UNREAD_COUNT: '/api/notifications/unread-count',

  // ── Locations ─────────────────────────────────────────────
  LOCATION_FORM: '/api/location-form', // used with dynamic id: [QUERY_KEYS.LOCATION_FORM, locationId]

  // ── Segments ──────────────────────────────────────────────
  SEGMENTS: '/api/segments',
  SEGMENTS_SUMMARY: '/api/segments/summary',
  SEGMENTS_PERFORMANCE_SUMMARIES: '/api/segments/performance/summaries',
  SEGMENTS_PERFORMANCE_DETAIL: '/api/segments/performance/detail', // + /{segmentId}/{period}
  SEGMENTS_FEED_LABELS: '/api/segments/feed-labels',
  SEGMENTS_AB_TESTS: '/api/segments/ab-tests',
  SEGMENTS_LOOKALIKES: '/api/segments/lookalikes',
  SEGMENTS_ATTRIBUTION: '/api/segments/attribution',
  SEGMENTS_ATTRIBUTION_TIMESERIES: '/api/segments/attribution/timeseries', // + /{segmentId}
  SEGMENTS_OVERLAP: '/api/segments/overlap',
  SEGMENTS_AUTOMATION: '/api/segments/automation', // + /{segmentId}
  SEGMENTS_REACH_PROJECTION: '/api/segments/reach-projection', // + /{segmentId}/{platform}
  SEGMENTS_EXPORTS: '/api/segments/exports',
  SEGMENTS_EXPORTS_SCHEDULED: '/api/segments/exports/scheduled',
  SEGMENTS_PUSH_LOG: '/api/segments/push-log',

  // ── Settings ──────────────────────────────────────────────
  SETTINGS_PROFILE: '/api/settings/profile',
  SETTINGS_COMPLETION: '/api/settings/completion',
  SETTINGS_STORE_SETS: '/api/settings/store-sets',
  SETTINGS_ACTIVITY_FEED: '/api/settings/activity-feed',
  SETTINGS_DATA_SOURCES: '/api/settings/data-sources',

  // ── Catalog ──────────────────────────────────────────────
  CATALOG_PIPELINE: '/api/catalog/pipeline',

  // ── Profile ───────────────────────────────────────────────
  PROFILE: '/api/profile',
  PROFILE_TEAM: '/api/profile/team',
  PROFILE_INVITES: '/api/profile/invites',
} as const;

export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
