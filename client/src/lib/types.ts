export interface KPI {
  value: string;
  trend: string;
  previousValue: string;
}

export interface OverviewData {
  kpis: {
    offlineROAS: KPI;
    storeVisits: KPI;
    conversionRate: KPI;
    avgOrderValue: KPI;
    engagements: KPI;
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
  location: string;
  campaign: string;
  compareMode: boolean;
}

export interface ChartDataPoint {
  date: string;
  google: number;
  meta: number;
  tiktok: number;
  apple: number;
}
