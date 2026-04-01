/**
 * Centralized API endpoint registry.
 *
 * Every mock route is declared here with its HTTP method, URL pattern,
 * handler, and a human-readable description.  queryClient.ts uses
 * `resolveEndpoint()` instead of a hand-maintained if-else chain.
 *
 * Pattern matching rules:
 *   - `string`  → matched via `url.includes(pattern)`
 *   - `RegExp`  → matched via `pattern.test(url)`
 *
 * Routes are evaluated top-to-bottom — list more specific patterns first.
 */

import {
  mockDataService,
  segmentDataService,
  notificationDataService,
  settingsDataService,
  profileDataService,
  locationFormDataService,
  catalogDataService,
} from './mock';

import type {
  EnrichmentSuggestionUpdatePayload,
  BusinessProfileUpdatePayload,
  StoreSetCreatePayload,
  StoreSetUpdatePayload,
  ProfileUpdatePayload,
  LocationCreatePayload,
  LocationUpdatePayload,
} from './types/mutations';

// ── Types ────────────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface EndpointDefinition {
  /** Human-readable purpose of this endpoint. */
  description: string;
  method: HttpMethod | HttpMethod[];
  /** String (includes-match) or RegExp for the URL. */
  pattern: string | RegExp;
  /** Handler receives the matched URL and optional body, returns mock data. */
  handler: (url: string, data?: unknown) => Promise<unknown>;
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Extract a single path segment immediately after `segmentName` in the URL. */
function paramAfter(url: string, segmentName: string): string {
  const parts = url.split('/');
  return parts[parts.indexOf(segmentName) + 1] ?? '';
}

/** Extract the last path segment from a URL. */
function lastSegment(url: string): string {
  return url.split('/').filter(Boolean).pop() ?? '';
}

// ── Registry ─────────────────────────────────────────────────────────

export const API_REGISTRY: EndpointDefinition[] = [
  // ── Notifications (most-specific first) ────────────────────────────
  {
    description: 'Mark all notifications as read',
    method: 'POST',
    pattern: '/api/notifications/read-all',
    handler: () => notificationDataService.markAllAsRead(),
  },
  {
    description: 'Mark a single notification as read',
    method: 'PATCH',
    pattern: /\/api\/notifications\/[^/]+\/read$/,
    handler: (url) => {
      const id = paramAfter(url, 'notifications');
      return notificationDataService.markAsRead(id);
    },
  },
  {
    description: 'Get unread notification count',
    method: 'GET',
    pattern: '/api/notifications/unread-count',
    handler: () => notificationDataService.getUnreadCount(),
  },
  {
    description: 'List all notifications',
    method: 'GET',
    pattern: '/api/notifications',
    handler: () => notificationDataService.getNotifications(),
  },

  // ── Overview ───────────────────────────────────────────────────────
  {
    description: 'Get overview dashboard data',
    method: 'GET',
    pattern: '/api/overview',
    handler: () => mockDataService.getOverviewData(),
  },

  // ── Catalog ─────────────────────────────────────────────────────────
  {
    description: 'Get catalog pipeline data (ingestion + platform sync statuses)',
    method: 'GET',
    pattern: '/api/catalog/pipeline',
    handler: () => catalogDataService.getPipelineData(),
  },

  // ── Enrichment Suggestions ─────────────────────────────────────────
  {
    description: 'Update an enrichment suggestion',
    method: 'PATCH',
    pattern: /\/api\/enrichment-suggestions\/[^?]+/,
    handler: (url, data) => {
      const id = lastSegment(url.split('?')[0]);
      return mockDataService.updateEnrichmentSuggestion(id, data as EnrichmentSuggestionUpdatePayload);
    },
  },
  {
    description: 'List enrichment suggestions (optionally filtered by platform)',
    method: 'GET',
    pattern: '/api/enrichment-suggestions',
    handler: (url) => {
      const params = new URLSearchParams(url.split('?')[1] || '');
      return mockDataService.getEnrichmentSuggestions(params.get('platformId') || undefined);
    },
  },

  // ── Alerts ─────────────────────────────────────────────────────────
  {
    description: 'Dismiss an alert',
    method: 'DELETE',
    pattern: /\/api\/alerts\/[^/]+$/,
    handler: (url) => mockDataService.dismissAlert(lastSegment(url)),
  },

  // ── Segments (most-specific first) ─────────────────────────────────
  {
    description: 'Get segment summary cards',
    method: 'GET',
    pattern: '/api/segments/summary',
    handler: () => mockDataService.getSegmentSummary(),
  },
  {
    description: 'Get feed labels',
    method: 'GET',
    pattern: '/api/segments/feed-labels',
    handler: () => mockDataService.getFeedLabels(),
  },
  {
    description: 'Get scheduled exports',
    method: 'GET',
    pattern: '/api/segments/exports/scheduled',
    handler: () => mockDataService.getScheduledExports(),
  },
  {
    description: 'Get all exports',
    method: 'GET',
    pattern: '/api/segments/exports',
    handler: () => mockDataService.getExports(),
  },
  {
    description: 'Get platform push log',
    method: 'GET',
    pattern: '/api/segments/push-log',
    handler: () => mockDataService.getPushLog(),
  },
  {
    description: 'Get automation rules for a segment',
    method: 'GET',
    pattern: /\/api\/segments\/automation\/[^/]+$/,
    handler: (url) => segmentDataService.getAutomationRules(lastSegment(url)),
  },
  {
    description: 'Get reach projection for a segment on a platform',
    method: 'GET',
    pattern: /\/api\/segments\/reach-projection\/[^/]+\/[^/]+$/,
    handler: (url) => {
      const parts = url.split('/');
      const platform = parts.pop()!;
      const segId = parts.pop()!;
      return segmentDataService.getReachProjection(segId, platform as 'google' | 'meta' | 'tiktok');
    },
  },
  {
    description: 'Get segment overlap data',
    method: 'GET',
    pattern: '/api/segments/overlap',
    handler: () => mockDataService.getTopOverlaps(),
  },
  {
    description: 'Get lookalike audiences',
    method: 'GET',
    pattern: '/api/segments/lookalikes',
    handler: () => mockDataService.getLookalikeAudiences(),
  },
  {
    description: 'Get A/B tests',
    method: 'GET',
    pattern: '/api/segments/ab-tests',
    handler: () => mockDataService.getABTests(),
  },
  {
    description: 'Get attribution timeseries for a segment',
    method: 'GET',
    pattern: /\/api\/segments\/attribution\/timeseries\/[^/]+$/,
    handler: (url) => mockDataService.getAttributionTimeseries(lastSegment(url)),
  },
  {
    description: 'Get segment attribution overview',
    method: 'GET',
    pattern: '/api/segments/attribution',
    handler: () => mockDataService.getSegmentAttributions(),
  },
  {
    description: 'Get performance detail for a segment',
    method: 'GET',
    pattern: /\/api\/segments\/performance\/detail\/[^/]+\/[^/]+$/,
    handler: (url) => {
      const parts = url.split('/');
      const period = parts.pop()!;
      const segId = parts.pop()!;
      return segmentDataService.getPerformanceDetail(segId, period as '7d' | '30d' | '90d');
    },
  },
  {
    description: 'Get performance summaries for all segments',
    method: 'GET',
    pattern: '/api/segments/performance/summaries',
    handler: () => segmentDataService.getPerformanceSummaries(),
  },
  {
    description: 'List all segments',
    method: 'GET',
    pattern: '/api/segments',
    handler: () => mockDataService.getSegments(),
  },

  // ── Settings (most-specific first) ─────────────────────────────────
  {
    description: 'Get business profile',
    method: 'GET',
    pattern: '/api/settings/profile',
    handler: () => settingsDataService.getBusinessProfile(),
  },
  {
    description: 'Update business profile',
    method: 'PATCH',
    pattern: '/api/settings/profile',
    handler: (_url, data) => settingsDataService.updateBusinessProfile(data as BusinessProfileUpdatePayload),
  },
  {
    description: 'Get activity feed',
    method: 'GET',
    pattern: '/api/settings/activity-feed',
    handler: () => settingsDataService.getActivityFeed(),
  },
  {
    description: 'Update a store set',
    method: 'PATCH',
    pattern: /\/api\/settings\/store-sets\/[^/]+$/,
    handler: (url, data) => settingsDataService.updateStoreSet(lastSegment(url), data as StoreSetUpdatePayload),
  },
  {
    description: 'Delete a store set',
    method: 'DELETE',
    pattern: /\/api\/settings\/store-sets\/[^/]+$/,
    handler: (url) => settingsDataService.deleteStoreSet(lastSegment(url)),
  },
  {
    description: 'Create a store set',
    method: 'POST',
    pattern: '/api/settings/store-sets',
    handler: (_url, data) => settingsDataService.createStoreSet(data as StoreSetCreatePayload),
  },
  {
    description: 'List store sets',
    method: 'GET',
    pattern: '/api/settings/store-sets',
    handler: () => settingsDataService.getStoreSets(),
  },
  {
    description: 'Get data sources',
    method: 'GET',
    pattern: '/api/settings/data-sources',
    handler: () => settingsDataService.getDataSources(),
  },
  {
    description: 'Get completion checklist',
    method: 'GET',
    pattern: '/api/settings/completion',
    handler: () => settingsDataService.getCompletionChecklist(),
  },

  // ── Profile ────────────────────────────────────────────────────────
  {
    description: 'Get team members',
    method: 'GET',
    pattern: '/api/profile/team',
    handler: () => profileDataService.getTeamMembers(),
  },
  {
    description: 'Get pending invites',
    method: 'GET',
    pattern: '/api/profile/invites',
    handler: () => profileDataService.getPendingInvites(),
  },
  {
    description: 'Get current user profile',
    method: 'GET',
    pattern: '/api/profile',
    handler: () => profileDataService.getCurrentUser(),
  },
  {
    description: 'Update current user profile',
    method: 'PATCH',
    pattern: '/api/profile',
    handler: (_url, data) => profileDataService.updateProfile(data as ProfileUpdatePayload),
  },

  // ── Location Form ──────────────────────────────────────────────────
  {
    description: 'Update a location',
    method: 'PATCH',
    pattern: /\/api\/location-form\/[^/]+$/,
    handler: (url, data) => locationFormDataService.updateLocation(lastSegment(url), data as LocationUpdatePayload),
  },
  {
    description: 'Create a new location',
    method: 'POST',
    pattern: '/api/location-form',
    handler: (_url, data) => locationFormDataService.createLocation(data as LocationCreatePayload),
  },
  {
    description: 'Get a location by ID',
    method: 'GET',
    pattern: /\/api\/location-form\/[^/]+$/,
    handler: (url) => locationFormDataService.getLocation(lastSegment(url)),
  },
];

// ── Resolver ─────────────────────────────────────────────────────────

export interface ResolvedEndpoint {
  definition: EndpointDefinition;
  handler: (url: string, data?: unknown) => Promise<unknown>;
}

/**
 * Find the first matching endpoint definition for the given method + URL.
 * Returns `null` if no route matches (falls through to default response).
 */
export function resolveEndpoint(method: string, url: string): ResolvedEndpoint | null {
  const upperMethod = method.toUpperCase() as HttpMethod;

  for (const def of API_REGISTRY) {
    // Check method
    const methods = Array.isArray(def.method) ? def.method : [def.method];
    if (!methods.includes(upperMethod)) continue;

    // Check pattern
    const matches =
      typeof def.pattern === 'string'
        ? url.includes(def.pattern)
        : def.pattern.test(url);

    if (matches) {
      return { definition: def, handler: def.handler };
    }
  }

  return null;
}
