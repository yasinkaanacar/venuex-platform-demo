import { AddressDto, LocationStatusEnum, RegularHoursDto } from './common';

/**
 * Listing channel — aligned with Provider lowercase convention.
 * 'google' = Google Business Profile, 'gmc' = Google Merchant Center.
 */
export type Channel = 'google' | 'apple' | 'meta' | 'gmc';

export type ChannelStatus = 'CONNECTED' | 'NEEDS_ATTENTION' | 'NOT_CONNECTED';

export type DataHealth = 'HEALTHY' | 'WARNING' | 'ERROR';

export interface ChannelInfo {
  status: ChannelStatus;
  lastSync?: string;
  errorNote?: string;
}

// ---------------------------------------------------------------------------
// Store verification & listing status — per-platform enums
// Source: libs/database/src/mongoose/schemas/location/location-platform-status.schema.ts
// ---------------------------------------------------------------------------

export type StoreVerificationStatus = 'UNKNOWN' | 'VERIFIED' | 'UNVERIFIED' | 'PENDING';

export type StoreListingStatus = 'UNLISTED' | 'LISTED' | 'PENDING' | 'SUSPENDED' | 'REJECTED';

/** Per-platform verification status map */
export interface StorePlatformVerifications {
  google?: StoreVerificationStatus;
  meta?: StoreVerificationStatus;
  apple?: StoreVerificationStatus;
  yandex?: StoreVerificationStatus;
}

/** Per-platform listing status map */
export interface StorePlatformListings {
  google?: StoreListingStatus;
  meta?: StoreListingStatus;
  apple?: StoreListingStatus;
  yandex?: StoreListingStatus;
}

// ---------------------------------------------------------------------------
// Platform-level sync & warning data (UI-specific, used by LocationStatusTable)
// ---------------------------------------------------------------------------

export type WarningType = 'phone_missing' | 'email_missing' | 'address_error' | 'image_missing' | 'sync_error';

export type SyncErrorCode = 'auth_expired' | 'missing_coordinates' | 'validation_error' | 'rate_limit' | 'invalid_store_code' | 'unknown';

export type PlatformKey = 'google' | 'meta' | 'apple' | 'yandex';

export interface LocationWarning {
  type: WarningType;
  label: string;
  errorLog?: string;
  errorCode?: SyncErrorCode;
  platform?: PlatformKey;
}

export type PlatformStatusType =
  | 'live'
  | 'pending'
  | 'action_required'
  | 'rejected'
  | 'suspended'
  | 'closed'
  | 'unclaimed'
  | 'not_connected';

export interface PlatformSyncData {
  status: PlatformStatusType;
  lastSync: string | null;
  warnings: LocationWarning[];
}

// ---------------------------------------------------------------------------
// LocationDto — production-aligned list-view type
// Source: libs/dto/src/location/location.dto.ts
// ---------------------------------------------------------------------------

export interface LocationDto {
  _id: string;
  location_name: string;
  brand: string;
  store_code: string;
  descriptor?: string;
  profile_description?: string;
  address: AddressDto;
  website?: string;
  email?: string;
  primary_phone?: string;
  additional_phones?: string[];
  location_status: LocationStatusEnum;
  regular_hours?: RegularHoursDto[];
  labels?: string[];
  primary_category?: string;
  additional_categories?: string[];
  meta_categories?: string[];
  apple_business_categories?: string[];
  yandex_rubrics?: string[];
  time_zone?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  store_verification_status?: StorePlatformVerifications;
  store_listing_status?: StorePlatformListings;
  /** UI-enriched: per-platform sync data for the status table */
  platforms?: Record<PlatformKey, PlatformSyncData>;
  /** UI-enriched: store set label */
  store_set?: string;
  /** UI-enriched: logo/image URL */
  image_url?: string;
}

export interface LocationFilters {
  cities: string[];
  statuses: DataHealth[];
  channels: Channel[];
}

export interface LocationsPageState {
  searchQuery: string;
  filters: LocationFilters;
  selectedLocationIds: Set<string>;
  detailsDrawerOpen: boolean;
  selectedLocationId: string | null;
  currentPage: number;
  pageSize: number;
}

export interface LocationsFilterState {
  search: string;
  selectedLocationIds: string[];
  selectedStoreGroups: string[];
  city: string;
  businessStatus: string;
  platformStatus: string;
  storeSet: string;
  missingPOI: string;
  dateRange: string;
  platform: string;
  compareMode: boolean;
  startDate?: Date;
  endDate?: Date;
  compareStartDate?: Date;
  compareEndDate?: Date;
  showProblemsOnly?: boolean;
}