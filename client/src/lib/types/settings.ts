// Settings module types — module-prefixed convention per CLAUDE.md Token Index

export type ActivityEventType =
  | 'location_update'
  | 'review_response'
  | 'settings_change'
  | 'user_action'
  | 'data_sync'
  | 'store_set_change';

export type DataSourceStatus = 'connected' | 'error' | 'pending' | 'inactive';

export type DataSourceType = 'sftp' | 'api';

export type DataSourceCategory = 'sales' | 'inventory';

export interface BusinessProfile {
  id: string;
  brandName: string;
  businessType: string;
  description: string;
  logoUrl: string | null;
  categories: {
    google: string[];
    meta: string[];
    apple: string[];
    yandex: string[];
  };
  contactEmail: string;
  contactPhone: string;
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    x: string;
    tiktok: string;
    youtube: string;
    pinterest: string;
    linkedin: string;
  };
  locationCount: number;
  updatedAt: string;
}

export interface ActivityFeedEntry {
  id: string;
  type: ActivityEventType;
  actor: string;
  action: string;
  timestamp: string;
  details?: {
    field?: string;
    oldValue?: string;
    newValue?: string;
    locationName?: string;
    additionalInfo?: string;
  };
}

export interface StoreSet {
  id: string;
  name: string;
  description: string;
  locationCount: number;
  locationIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FieldMapping {
  id: string;
  sourceColumn: string;
  venueXField: string;
  sampleValue: string;
  mapped: boolean;
}

export interface DataSourceConnection {
  id: string;
  name: string;
  type: DataSourceType;
  category: DataSourceCategory;
  status: DataSourceStatus;
  lastSyncAt: string | null;
  recordCount: number;
  errorMessage: string | null;
  fieldMappings: FieldMapping[];
}

export interface CompletionChecklistItem {
  id: string;
  label: string;
  completed: number;
  total: number;
  isComplete: boolean;
}
