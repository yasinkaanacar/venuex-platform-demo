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
  dateRange: string;
  platform: string;
  compareMode: boolean;
}

export interface LocationsFilterState {
  search: string;
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
}

export interface ChartDataPoint {
  date: string;
  google: number;
  meta: number;
  tiktok: number;
  apple: number;
}
