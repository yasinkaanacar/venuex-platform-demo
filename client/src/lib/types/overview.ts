/**
 * Overview module types
 *
 * Types for the main dashboard (/overview) including KPI summaries,
 * platform connections, and alert items.
 */

import { Metric } from './common';

export interface PlatformConnection {
  id: string;
  name: string;
  type: string;
  status: string;
  lastSync: Date;
  accountId: string;
  isActive: boolean;
}

export interface LocationSummary {
  id: string;
  name: string;
  address: string;
  platformId: string;
  isActive: boolean;
  coordinates: { lat: number; lng: number };
}

export interface CampaignSummary {
  id: string;
  name: string;
  platformId: string;
  type: string;
  status: string;
  budget: number;
  spent: number;
  isActive: boolean;
}

export interface AlertItem {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  severity: string;
}

export interface ChartDataPoint {
  date: string;
  google: number;
  meta: number;
  tiktok: number;
  apple: number;
}

export interface OverviewData {
  kpis: {
    o2oAttribution: Metric;
    locationListings: Metric;
    localInventory: Metric;
    reviewManagement: Metric;
  };
  platforms: PlatformConnection[];
  locations: LocationSummary[];
  campaigns: CampaignSummary[];
  alerts: AlertItem[];
  lastSync: string;
}
