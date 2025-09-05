export type Channel = 'GBP' | 'APPLE' | 'META' | 'GMC';

export type ChannelStatus = 'CONNECTED' | 'NEEDS_ATTENTION' | 'NOT_CONNECTED';

export type DataHealth = 'HEALTHY' | 'WARNING' | 'ERROR';

export interface ChannelInfo {
  status: ChannelStatus;
  lastSync?: string;
  errorNote?: string;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  addressLine: string;
  city: string;
  district: string;
  hoursLabel: string;
  phone: string;
  dataHealth: DataHealth;
  channels: Record<Channel, ChannelInfo>;
  lastSync?: string;
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