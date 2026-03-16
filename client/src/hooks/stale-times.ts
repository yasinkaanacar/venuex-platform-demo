/**
 * Per-domain stale time configuration for TanStack Query.
 *
 * Controls how long cached data is considered "fresh" before a
 * background refetch is triggered. Values are tuned for each domain's
 * expected data change frequency.
 *
 * Usage: pass to individual useQuery({ staleTime: STALE_TIMES.LOCATIONS })
 * or use getStaleTime() to derive the value from a query key.
 */

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const STALE_TIMES = {
  /** Location data changes rarely — daily sync is typical. */
  LOCATIONS: 24 * HOUR,

  /** Reviews arrive in near-real-time from platforms. */
  REVIEWS: 15 * MINUTE,

  /** Analytics/insights are computed periodically. */
  INSIGHTS: 1 * HOUR,

  /** Segment definitions change infrequently. */
  SEGMENTS: 2 * HOUR,

  /** Settings/profile — very stable, infrequent edits. */
  SETTINGS: 4 * HOUR,

  /** Notifications — check frequently for responsiveness. */
  NOTIFICATIONS: 2 * MINUTE,

  /** Default for any domain not explicitly listed. */
  DEFAULT: 2 * HOUR,
} as const;

/**
 * Derive stale time from a query key string.
 * Matches the first path segment after /api/ to a domain.
 */
export function getStaleTime(queryKey: string): number {
  if (queryKey.includes('/locations') || queryKey.includes('/location-form')) {
    return STALE_TIMES.LOCATIONS;
  }
  if (queryKey.includes('/reviews')) {
    return STALE_TIMES.REVIEWS;
  }
  if (queryKey.includes('/segments') || queryKey.includes('/attribution')) {
    return STALE_TIMES.INSIGHTS;
  }
  if (queryKey.includes('/settings') || queryKey.includes('/profile')) {
    return STALE_TIMES.SETTINGS;
  }
  if (queryKey.includes('/notifications')) {
    return STALE_TIMES.NOTIFICATIONS;
  }
  if (queryKey.includes('/overview')) {
    return STALE_TIMES.INSIGHTS;
  }
  return STALE_TIMES.DEFAULT;
}
