// ------------------------------------------------------------------
// Core enums / union types
// ------------------------------------------------------------------

export type SyncHealth = 'healthy' | 'warning' | 'error' | 'setup_required';

// ------------------------------------------------------------------
// Rejection Reasons
// ------------------------------------------------------------------

export interface RejectionReason {
  id: string;
  errorType: string;
  errorCode: string;
  count: number;
  description: string;
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
  rejectionReasons: RejectionReason[];
}

// ------------------------------------------------------------------
// Pipeline Data (returned by /api/catalog/pipeline)
// ------------------------------------------------------------------

export interface CatalogPipelineData {
  ingestion: {
    connected: boolean;
    lastReceivedAt: string;
    itemCount: number;
  };
  statuses: PlatformSyncStatus[];
}
