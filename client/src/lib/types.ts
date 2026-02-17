export interface KPI {
  value: string;
  trend: string;
  previousValue: string;
}

export interface OverviewData {
  kpis: {
    o2oAttribution: KPI;
    locationListings: KPI;
    localInventory: KPI;
    reviewManagement: KPI;
  };
  platforms: any[];
  locations: any[];
  campaigns: any[];
  alerts: any[];
  lastSync: string;
}

export interface FilterState {
  dateRange: string | { startDate: Date; endDate: Date };
  platform: string;
  compareMode: boolean;
  campaigns?: string[];
  campaignTypes?: string[];
  isAllCampaignsSelected?: boolean;
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

export interface ChartDataPoint {
  date: string;
  google: number;
  meta: number;
  tiktok: number;
  apple: number;
}
