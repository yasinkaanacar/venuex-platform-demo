/**
 * Production-aligned shared types
 *
 * Canonical type definitions matching the VenueX monorepo data contracts.
 * All modules should import shared enums and DTOs from this file.
 *
 * Source: libs/dto, libs/constants, libs/database schemas
 */

// ---------------------------------------------------------------------------
// Metric — the universal KPI shape used across all dashboards
// Source: libs/dto/src/conversion/google-ads-metrics.dto.ts (MetricDto)
// ---------------------------------------------------------------------------

export interface Metric {
  value: number;
  change: number;
  past_value?: number;
}

// ---------------------------------------------------------------------------
// Provider — canonical platform identifier
// Source: libs/constants/src/provider.ts
// ---------------------------------------------------------------------------

export enum Provider {
  Google = 'google',
  Meta = 'meta',
  TikTok = 'tiktok',
  Apple = 'apple',
  Yandex = 'yandex',
}

// ---------------------------------------------------------------------------
// Location enums
// Source: libs/constants/src/location/location-status.ts
// ---------------------------------------------------------------------------

export enum LocationStatusEnum {
  OPEN = 'open',
  CLOSED_TEMPORARILY = 'closed_temporarily',
  CLOSED_PERMANENTLY = 'closed_permanently',
}

// ---------------------------------------------------------------------------
// Review enums
// Source: libs/constants/src/location/location-review.ts
// ---------------------------------------------------------------------------

export enum ReviewSourceEnum {
  GOOGLE = 'Google',
  APPLE = 'Apple',
  META = 'Meta',
  TIKTOK = 'Tiktok',
}

export enum ReviewStatusEnum {
  ANSWERED = 'ANSWERED',
  UNANSWERED = 'UNANSWERED',
}

// ---------------------------------------------------------------------------
// Review sentiment
// Source: libs/constants/src/location/location-review.ts
// ---------------------------------------------------------------------------

export enum ReviewSentimentEnum {
  NO_DATA = 'no_sentiment_data',
  ALL = 'all_sentiments',
  POSITIVE = 'positive_sentiment',
  NEGATIVE = 'negative_sentiment',
  NEUTRAL = 'neutral_sentiment',
}

// ---------------------------------------------------------------------------
// AI Review Analysis — attached to each LocationReview
// Source: libs/database/src/mongoose/schemas/location-review/location-review.schema.ts
// ---------------------------------------------------------------------------

export interface AnalysisResult {
  category_scores?: Record<string, number>;
  category?: string;
  anomaly?: boolean;
  review_analysis?: string;
  safety_issue?: boolean;
  product_group?: string;
  product?: string;
  overall_emotion?: string;
}

// ---------------------------------------------------------------------------
// Days & Working Hours
// Source: libs/constants (DaysEnum), libs/dto/src/location/regular-hours.dto.ts
// ---------------------------------------------------------------------------

export enum DaysEnum {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface RegularHoursDto {
  openDay: DaysEnum;
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  closeDay: DaysEnum;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Address
// Source: libs/dto/src/location/address.dto.ts
// ---------------------------------------------------------------------------

export interface AddressDto {
  lat: number;
  lng: number;
  countryCode: string;
  administrativeArea?: string;
  locality?: string;
  sublocality?: string;
  fullAddress: string;
  addressLines: string[];
  postalCode?: string;
}

// ---------------------------------------------------------------------------
// Ad Platform Metrics — normalized response across Google/Meta/TikTok
// Source: libs/dto/src/conversion (NormalizedAdMetricsResponse)
// ---------------------------------------------------------------------------

export interface NormalizedAdMetricsResponse {
  cost: Metric;
  impressions: Metric;
  clicks: Metric;
  onlineOrders: Metric;
  onlineRevenue: Metric;
  onlineROI: Metric;
  onlineAOV: Metric;
  storeVisit: Metric;
  offlineOrders: Metric;
  offlineRevenue: Metric;
  offlineROAS: Metric;
  offlineAOV: Metric;
}

// ---------------------------------------------------------------------------
// Top Campaigns
// Source: libs/dto/src/conversion/top-campaign-result.dto.ts
// ---------------------------------------------------------------------------

export interface TopCampaignResultDto {
  name: string;
  impressions: number;
  clickToVisitRate?: number;
  spend: number;
  visits?: number;
  clicks: number;
  offlinePurchases: number;
  offlineRevenue: number;
  offlineRoas: number;
}

// ---------------------------------------------------------------------------
// Geographic Metrics
// Source: libs/dto/src/conversion/geographic-metrics-result.dto.ts
// ---------------------------------------------------------------------------

export interface GeographicMetricsResultDto {
  level: string;
  name?: string;
  iso: string;
  impressions: number;
  clickToVisitRate?: number;
  spend: number;
  visits?: number;
  clicks: number;
  offlinePurchases: number;
  offlineRevenue: number;
  offlineRoas: number;
}

// ---------------------------------------------------------------------------
// Filter State — cross-module campaign/date filter shape
// ---------------------------------------------------------------------------

export interface FilterState {
  dateRange: string | { startDate: Date; endDate: Date };
  platform: string;
  compareMode: boolean;
  campaigns?: string[];
  campaignTypes?: string[];
  isAllCampaignsSelected?: boolean;
}
