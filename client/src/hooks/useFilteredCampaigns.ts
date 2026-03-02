import { useMemo } from 'react';
import {
  Campaign,
  Platform,
  mockCampaigns,
  calcOfflineROAS,
  calcCostPerConversion,
  calcConversionRate,
  calcCTR,
  calcOmniROAS,
  calcOnlineROAS,
  calcAvgBasketSize,
} from '@/lib/mock-campaign-data';

export interface PageFilterState {
  dateRange: string;
  platforms: string[];
  platform?: string;
  campaigns: string[];
  campaignTypes: string[];
  accounts: string[];
  isAllCampaignsSelected?: boolean;
  compareMode: boolean;
  activeOnly: boolean;
}

export interface AggregatedTotals {
  spend: number;
  offlineConversions: number;
  offlineRevenue: number;
  onlineConversions: number;
  onlineRevenue: number;
  impressions: number;
  clicks: number;
  storeVisits: number;
}

export interface DerivedMetrics {
  offlineROAS: number;
  onlineROAS: number;
  costPerConversion: number;
  avgBasketSize: number;
  conversionRate: number;
  omniROAS: number;
  ctr: number;
}

export interface PlatformAggregation {
  totals: AggregatedTotals;
  derived: DerivedMetrics;
}

export interface CampaignTypeAggregation {
  totals: AggregatedTotals;
  derived: DerivedMetrics;
  count: number;
}

function aggregateTotals(campaigns: Campaign[]): AggregatedTotals {
  return campaigns.reduce(
    (acc, c) => ({
      spend: acc.spend + c.spend,
      offlineConversions: acc.offlineConversions + c.offlineConversions,
      offlineRevenue: acc.offlineRevenue + c.offlineRevenue,
      onlineConversions: acc.onlineConversions + (c.onlineConversions || 0),
      onlineRevenue: acc.onlineRevenue + (c.onlineRevenue || 0),
      impressions: acc.impressions + c.impressions,
      clicks: acc.clicks + c.clicks,
      storeVisits: acc.storeVisits + (c.storeVisits || 0),
    }),
    { spend: 0, offlineConversions: 0, offlineRevenue: 0, onlineConversions: 0, onlineRevenue: 0, impressions: 0, clicks: 0, storeVisits: 0 }
  );
}

function derivedFromTotals(t: AggregatedTotals): DerivedMetrics {
  return {
    offlineROAS: calcOfflineROAS({ spend: t.spend, offlineRevenue: t.offlineRevenue }),
    onlineROAS: calcOnlineROAS({ spend: t.spend, onlineRevenue: t.onlineRevenue }),
    costPerConversion: calcCostPerConversion({ spend: t.spend, offlineConversions: t.offlineConversions }),
    avgBasketSize: calcAvgBasketSize({ offlineConversions: t.offlineConversions, offlineRevenue: t.offlineRevenue }),
    conversionRate: calcConversionRate({ offlineConversions: t.offlineConversions, clicks: t.clicks }),
    omniROAS: calcOmniROAS({ spend: t.spend, offlineRevenue: t.offlineRevenue, onlineRevenue: t.onlineRevenue }),
    ctr: calcCTR({ clicks: t.clicks, impressions: t.impressions }),
  };
}

export function useFilteredCampaigns(filters: PageFilterState) {
  return useMemo(() => {
    // Step 1: Filter campaigns
    let campaigns = [...mockCampaigns];

    // Platform filter
    if (filters.platforms.length > 0) {
      campaigns = campaigns.filter(c => filters.platforms.includes(c.platform));
    }

    // Campaign type filter
    if (filters.campaignTypes.length > 0) {
      campaigns = campaigns.filter(c => filters.campaignTypes.includes(c.campaignType));
    }

    // Account filter (Google Ads MCC sub-accounts)
    if (filters.accounts.length > 0) {
      campaigns = campaigns.filter(c => c.accountId && filters.accounts.includes(c.accountId));
    }

    // Active only filter
    if (filters.activeOnly) {
      campaigns = campaigns.filter(c => c.status === 'active');
    }

    // Specific campaign filter (by name)
    if (filters.campaigns.length > 0) {
      campaigns = campaigns.filter(c => filters.campaigns.includes(c.name));
    }

    // Step 2: Aggregate totals
    const totals = aggregateTotals(campaigns);
    const derived = derivedFromTotals(totals);

    // Step 3: By platform
    const byPlatform = new Map<Platform, PlatformAggregation>();
    const platforms: Platform[] = ['google', 'meta', 'tiktok'];
    for (const p of platforms) {
      const platformCampaigns = campaigns.filter(c => c.platform === p);
      if (platformCampaigns.length > 0) {
        const pTotals = aggregateTotals(platformCampaigns);
        byPlatform.set(p, { totals: pTotals, derived: derivedFromTotals(pTotals) });
      }
    }

    // Step 4: By campaign type
    const byCampaignType = new Map<string, CampaignTypeAggregation>();
    const typeSet = Array.from(new Set(campaigns.map(c => c.campaignType)));
    for (const type of typeSet) {
      const typeCampaigns = campaigns.filter(c => c.campaignType === type);
      const tTotals = aggregateTotals(typeCampaigns);
      byCampaignType.set(type, {
        totals: tTotals,
        derived: derivedFromTotals(tTotals),
        count: typeCampaigns.length,
      });
    }

    return { campaigns, totals, derived, byPlatform, byCampaignType };
  }, [filters.platforms, filters.campaignTypes, filters.activeOnly, filters.campaigns, filters.accounts]);
}
