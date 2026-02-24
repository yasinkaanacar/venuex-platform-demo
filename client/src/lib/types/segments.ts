// ------------------------------------------------------------------
// Core enums / union types
// ------------------------------------------------------------------

export type SegmentType = 'value' | 'category' | 'rfm' | 'store' | 'combination';
export type SegmentStatus = 'active' | 'building' | 'paused' | 'error' | 'draft';

export type RuleOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'in' | 'not_in' | 'between';
export type RuleDimension =
  | 'basket_amount'
  | 'total_spend'
  | 'average_order_value'
  | 'total_orders'
  | 'customer_lifetime_value'
  | 'last_order_amount'
  | 'product_category'
  | 'product_brand'
  | 'product_subcategory'
  | 'purchase_channel'
  | 'purchase_recency_days'
  | 'purchase_frequency'
  | 'monetary_score'
  | 'rfm_segment'
  | 'days_since_first_purchase'
  | 'avg_days_between_purchases'
  | 'store_id'
  | 'store_region'
  | 'store_city'
  | 'store_format'
  | 'loyalty_tier'
  | 'gender'
  | 'age_range';

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
  automationRules?: SegmentAutomationRule[];
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
  activeCampaigns: number;
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

// ------------------------------------------------------------------
// Audience Overlap (Feature 1)
// ------------------------------------------------------------------

export interface SegmentOverlapResult {
  segmentA: { id: string; name: string; size: number };
  segmentB: { id: string; name: string; size: number };
  overlapCount: number;
  overlapPercent: number;
  onlyA: number;
  onlyB: number;
  unionSize: number;
  jaccardIndex: number;
  recommendation: 'exclude' | 'merge' | 'ok';
  wastedSpendEstimate: number;
}

// ------------------------------------------------------------------
// Segment Exclusion Rule (Insights - Exclude Flow)
// ------------------------------------------------------------------

export interface SegmentExclusionRule {
  id: string;
  sourceSegmentId: string;
  sourceSegmentName: string;
  excludedSegmentId: string;
  excludedSegmentName: string;
  platforms: AdPlatform[];
  overlapCount: number;
  estimatedSavings: number;
  createdAt: string;
}

// ------------------------------------------------------------------
// Segment Merge Record (Insights - Merge Flow)
// ------------------------------------------------------------------

export type MergeStrategy = 'union' | 'intersection';

export interface SegmentMergeRecord {
  id: string;
  sourceSegmentAId: string;
  sourceSegmentAName: string;
  sourceSegmentBId: string;
  sourceSegmentBName: string;
  strategy: MergeStrategy;
  newSegmentId: string;
  newSegmentName: string;
  resultingSize: number;
  pausedOriginals: boolean;
  createdAt: string;
}

// ------------------------------------------------------------------
// Reach / Cost Projection (Feature 2)
// ------------------------------------------------------------------

export interface ReachProjection {
  platform: AdPlatform;
  segmentSize: number;
  estimatedMatchRate: number;
  estimatedReach: number;
  estimatedCPM: number;
  estimatedMonthlySpend: number;
  confidenceLevel: 'high' | 'medium' | 'low';
}

// ------------------------------------------------------------------
// Lifecycle Automation (Feature 3)
// ------------------------------------------------------------------

export type AutomationTrigger = 'schedule' | 'size_threshold' | 'match_rate_drop';
export type AutomationAction = 'rebuild' | 'pause' | 'notify' | 'push_refresh';

export interface SegmentAutomationRule {
  id: string;
  segmentId: string;
  trigger: AutomationTrigger;
  frequency?: ExportFrequency;
  sizeOperator?: 'below' | 'above';
  sizeValue?: number;
  matchRateThreshold?: number;
  action: AutomationAction;
  isActive: boolean;
  lastTriggeredAt?: string;
  nextScheduledAt?: string;
  createdAt: string;
}

// ------------------------------------------------------------------
// Lookalike & A/B Test (Feature 4)
// ------------------------------------------------------------------

export type LookalikeStatus = 'active' | 'building' | 'expired' | 'failed';

export interface LookalikeAudience {
  id: string;
  sourceSegmentId: string;
  sourceSegmentName: string;
  platform: AdPlatform;
  name: string;
  expansionPercent: number;
  estimatedSize: number;
  status: LookalikeStatus;
  createdAt: string;
}

export interface ABTestConfig {
  id: string;
  name: string;
  sourceSegmentId: string;
  sourceSegmentName: string;
  platform: AdPlatform;
  splitPercentage: number;
  groupA: { name: string; size: number };
  groupB: { name: string; size: number };
  status: 'active' | 'draft' | 'completed';
  createdAt: string;
}

// ------------------------------------------------------------------
// ROI Attribution (Feature 5)
// ------------------------------------------------------------------

export interface SegmentPlatformAttribution {
  platform: AdPlatform;
  adSpend: number;
  offlineRevenue: number;
  onlineRevenue: number;
  offlineConversions: number;
  matchRate: number;
  offlineROAS: number;
  campaigns: number;
}

export interface SegmentAttribution {
  segmentId: string;
  segmentName: string;
  segmentSize: number;
  platforms: SegmentPlatformAttribution[];
  totals: {
    adSpend: number;
    offlineRevenue: number;
    onlineRevenue: number;
    totalRevenue: number;
    offlineConversions: number;
    totalConversions: number;
    offlineROAS: number;
    omniROAS: number;
    costPerConversion: number;
  };
  trend: {
    revenueChange: number;
    roasChange: number;
    conversionsChange: number;
  };
}

export interface AttributionTimeseriesPoint {
  date: string;
  adSpend: number;
  offlineRevenue: number;
  onlineRevenue: number;
  conversions: number;
}

// ------------------------------------------------------------------
// Segment Performance Tracking
// ------------------------------------------------------------------

export type PerformancePeriod = '7d' | '30d' | '90d';
export type AttributionConfidence = 'direct' | 'estimated';

/** Lightweight summary for SegmentListTable columns */
export interface SegmentPerformanceSummary {
  segmentId: string;
  totalSpend: number;
  conversions: number;
  roas: number;
  confidence: AttributionConfidence;
}

/** Full detail for SegmentDetailDrawer Performance tab */
export interface SegmentPerformanceDetail {
  segmentId: string;
  period: PerformancePeriod;
  platforms: PlatformPerformance[];
  campaigns: CampaignPerformance[];
  timeseries: PerformanceTimeseriesPoint[];
}

export interface PlatformPerformance {
  platform: AdPlatform;
  spend: number;
  conversions: number;
  revenue: number;
  roas: number;
  matchRate: number;
  confidence: AttributionConfidence;
  trend: { spendChange: number; conversionsChange: number; roasChange: number };
}

export interface CampaignPerformance {
  id: string;
  platform: AdPlatform;
  campaignName: string;
  entityType: 'campaign' | 'ad_group' | 'ad_set';
  spend: number;
  conversions: number;
  roas: number;
  confidence: AttributionConfidence;
}

export interface PerformanceTimeseriesPoint {
  date: string;
  spend: number;
  conversions: number;
  roas: number;
  google?: { spend: number; conversions: number; roas: number };
  meta?: { spend: number; conversions: number; roas: number };
  tiktok?: { spend: number; conversions: number; roas: number };
}
