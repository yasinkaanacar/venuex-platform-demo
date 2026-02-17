// ------------------------------------------------------------------
// Core enums / union types
// ------------------------------------------------------------------

export type SegmentType = 'value' | 'category' | 'rfm' | 'store' | 'combination';
export type SegmentStatus = 'active' | 'building' | 'paused' | 'error' | 'draft';

export type RuleOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'in' | 'not_in' | 'between';
export type RuleDimension =
  | 'basket_amount'
  | 'total_spend'
  | 'product_category'
  | 'product_brand'
  | 'purchase_recency_days'
  | 'purchase_frequency'
  | 'monetary_score'
  | 'rfm_segment'
  | 'store_id'
  | 'store_region'
  | 'store_city';

export type LogicOperator = 'AND' | 'OR';

export type AdPlatform = 'google' | 'meta' | 'tiktok';
export type PushStatus = 'synced' | 'syncing' | 'pending' | 'failed' | 'not_pushed';

export type FeedLabelType =
  | 'offline_bestseller'
  | 'high_value_category'
  | 'store_performer'
  | 'cross_sell_candidate'
  | 'custom';

export type FeedChannel = 'gmc' | 'meta_catalog';

export type ExportFormat = 'csv' | 'json';
export type ExportFrequency = 'once' | 'daily' | 'weekly' | 'monthly';
export type ExportStatus = 'completed' | 'in_progress' | 'scheduled' | 'failed';

// ------------------------------------------------------------------
// Rule & Rule Group
// ------------------------------------------------------------------

export interface SegmentRule {
  id: string;
  dimension: RuleDimension;
  operator: RuleOperator;
  value: string | number | string[];
  secondaryValue?: number; // for 'between' operator
}

export interface SegmentRuleGroup {
  id: string;
  logic: LogicOperator;
  rules: SegmentRule[];
}

// ------------------------------------------------------------------
// Segment
// ------------------------------------------------------------------

export interface Segment {
  id: string;
  name: string;
  description: string;
  type: SegmentType;
  status: SegmentStatus;
  ruleGroups: SegmentRuleGroup[];
  groupLogic: LogicOperator;
  estimatedSize: number;
  actualSize?: number;
  platformPushes: SegmentPlatformPush[];
  createdAt: string;
  updatedAt: string;
  lastBuiltAt?: string;
  createdBy: string;
  tags: string[];
}

// ------------------------------------------------------------------
// Platform Push
// ------------------------------------------------------------------

export interface SegmentPlatformPush {
  id: string;
  segmentId: string;
  platform: AdPlatform;
  status: PushStatus;
  matchRate: number;
  matchedIdentifiers: number;
  totalIdentifiers: number;
  audienceId?: string;
  audienceName?: string;
  autoSync: boolean;
  lastPushedAt?: string;
  nextSyncAt?: string;
  errorMessage?: string;
}

export interface PushLogEntry {
  id: string;
  segmentId: string;
  segmentName: string;
  platform: AdPlatform;
  action: 'push' | 'sync' | 'delete' | 'error';
  status: 'success' | 'failed' | 'partial';
  matchRate: number;
  identifierCount: number;
  timestamp: string;
  details?: string;
}

// ------------------------------------------------------------------
// Feed Label
// ------------------------------------------------------------------

export interface FeedLabel {
  id: string;
  name: string;
  labelKey: string;
  type: FeedLabelType;
  description: string;
  segmentIds: string[];
  channels: FeedChannel[];
  affectedProductCount: number;
  totalProductCount: number;
  isActive: boolean;
  gmcSlotIndex?: number;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------
// Export
// ------------------------------------------------------------------

export interface SegmentExport {
  id: string;
  name: string;
  segmentIds: string[];
  segmentNames: string[];
  format: ExportFormat;
  status: ExportStatus;
  recordCount: number;
  fileSize?: string;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ScheduledExport {
  id: string;
  name: string;
  segmentIds: string[];
  segmentNames: string[];
  format: ExportFormat;
  frequency: ExportFrequency;
  destination: {
    type: 'sftp' | 'ftp';
    host: string;
    port: number;
    username: string;
    remotePath: string;
  };
  isActive: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt: string;
}

// ------------------------------------------------------------------
// Filter state & KPIs
// ------------------------------------------------------------------

export interface SegmentFilters {
  search: string;
  types: SegmentType[];
  statuses: SegmentStatus[];
  platforms: AdPlatform[];
}

export interface SegmentSummaryKPIs {
  totalSegments: number;
  totalAudienceSize: number;
  activePlatformPushes: number;
  activeLabels: number;
  avgMatchRate: number;
}
