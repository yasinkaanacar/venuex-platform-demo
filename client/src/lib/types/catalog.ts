// ------------------------------------------------------------------
// Core enums / union types
// ------------------------------------------------------------------

export type IngestionSourceType = 'sftp' | 'api';
export type SourceStatus = 'connected' | 'warning' | 'disconnected';
export type FeedFreshness = 'fresh' | 'degraded' | 'stale';

export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'limited';
export type PlatformPublishStatus = 'published' | 'rejected' | 'pending' | 'not_submitted';
export type SyncHealth = 'healthy' | 'warning' | 'error';
export type IssueSeverity = 'critical' | 'warning' | 'info';
export type IssuePlatform = 'google' | 'meta' | 'both';

export type SyncEventStatus = 'processing' | 'success' | 'warning' | 'error';
export type SyncEventPlatform = 'google' | 'meta' | 'source';

// ------------------------------------------------------------------
// Ingestion Source — one per data connection
// ------------------------------------------------------------------

export interface IngestionSource {
  id: string;
  name: string;
  type: IngestionSourceType;
  status: SourceStatus;
  lastReceivedAt: string;              // ISO 8601
  nextExpectedAt: string | null;       // null for realtime API sources
  expectedIntervalMinutes: number;     // used for staleness calculation
  lastBatchSkuCount: number;
  isStale: boolean;
}

// ------------------------------------------------------------------
// Platform Sync Status
// ------------------------------------------------------------------

export interface PlatformSyncStatus {
  platform: 'google' | 'meta';
  published: number;
  rejected: number;
  pending: number;
  lastSyncAt: string;
  syncStatus: SyncHealth;
}

// ------------------------------------------------------------------
// Feed Hygiene Issues
// ------------------------------------------------------------------

export interface FeedHygieneIssue {
  id: string;
  severity: IssueSeverity;
  type: string;
  platform: IssuePlatform;
  affectedCount: number;
  description: string;
}

// ------------------------------------------------------------------
// Quick Stats
// ------------------------------------------------------------------

export interface CatalogQuickStatsData {
  totalSkus: number;
  totalStores: number;
  syncSuccessRate: number;        // 0-100 percentage
  feedFreshnessScore: number;     // % of sources within expected interval
}

// ------------------------------------------------------------------
// Catalog Product — read-only, from ERP feed
// ------------------------------------------------------------------

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  thumbnail: string | null;
  gtin: string | null;
  brand: string;

  // Aggregate store-level data
  storeCoverage: {
    available: number;
    total: number;
  };
  availabilityBreakdown: {
    inStock: number;
    outOfStock: number;
    limited: number;
  };

  // Platform publish status
  platforms: {
    google: PlatformPublishStatus;
    meta: PlatformPublishStatus;
  };

  feedFreshness: FeedFreshness;
  labels: string[];               // Phase 2 — custom labels from inventory signals
  issueCount: number;             // number of feed hygiene issues affecting this product
}

// ------------------------------------------------------------------
// Sync Timeline Event — for Feed Activity tab
// ------------------------------------------------------------------

export interface SyncTimelineEvent {
  id: number;
  timestamp: string;
  batchId: string;
  title: string;
  subtitle: string;
  status: SyncEventStatus;
  platform?: SyncEventPlatform;
  progress?: number;              // 0-100 for processing events
}

// ------------------------------------------------------------------
// Batch Report — detail view for a completed sync event
// ------------------------------------------------------------------

export interface BatchReportError {
  id: string;
  platform: 'google' | 'meta';
  errorType: string;
  errorCode: string;
  count: number;
}

export interface BatchReport {
  batchId: string;
  status: 'completed' | 'completed_with_issues' | 'failed';
  totalItems: number;
  successCount: number;
  issueCount: number;
  errors: BatchReportError[];
}
