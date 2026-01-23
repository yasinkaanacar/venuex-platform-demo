// Mock useDashboard hook for Geographic components
import { useState, useEffect } from 'react';

// Geographic metrics result interface
export interface GeographicMetricsResultDto {
    iso: string;
    impressions: number;
    clicks: number;
    spend: number;
    visits?: number;
    conversions?: number;
    offlineRevenue: number;
    offlineRoas: number;
    clickToVisitRate?: number;
    offlinePurchases?: number;
}

interface ApiPayload {
    brandId: string;
    provider: string;
    payload: any;
    enabled?: boolean;
}

interface ApiResult<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

// Mock data for Turkey
const mockTurkeyData: GeographicMetricsResultDto[] = [
    { iso: "TR-34", impressions: 2500000, clicks: 125000, spend: 450000, visits: 45000, conversions: 8900, offlineRevenue: 80173725, offlineRoas: 78.8, clickToVisitRate: 4.5, offlinePurchases: 250 },
    { iso: "TR-06", impressions: 1800000, clicks: 78000, spend: 280000, visits: 28000, conversions: 5600, offlineRevenue: 48960000, offlineRoas: 77.3, clickToVisitRate: 3.8, offlinePurchases: 180 },
    { iso: "TR-35", impressions: 2100000, clicks: 89000, spend: 320000, visits: 32000, conversions: 6400, offlineRevenue: 55360000, offlineRoas: 76.5, clickToVisitRate: 4.1, offlinePurchases: 210 },
    { iso: "TR-07", impressions: 1400000, clicks: 52000, spend: 180000, visits: 19000, conversions: 3800, offlineRevenue: 32400000, offlineRoas: 79.6, clickToVisitRate: 3.2, offlinePurchases: 120 },
    { iso: "TR-16", impressions: 1600000, clicks: 61000, spend: 220000, visits: 22000, conversions: 4400, offlineRevenue: 37800000, offlineRoas: 76.0, clickToVisitRate: 3.5, offlinePurchases: 150 },
];

// Mock data for World
const mockWorldData: GeographicMetricsResultDto[] = [
    { iso: "TR", impressions: 12500000, clicks: 525000, spend: 1850000, visits: 180000, conversions: 35000, offlineRevenue: 320000000, offlineRoas: 82.5, clickToVisitRate: 4.2, offlinePurchases: 850 },
    { iso: "DE", impressions: 3200000, clicks: 128000, spend: 420000, visits: 42000, conversions: 8400, offlineRevenue: 72000000, offlineRoas: 68.2, clickToVisitRate: 3.6, offlinePurchases: 220 },
    { iso: "GB", impressions: 2800000, clicks: 112000, spend: 380000, visits: 38000, conversions: 7600, offlineRevenue: 64000000, offlineRoas: 65.8, clickToVisitRate: 3.4, offlinePurchases: 190 },
    { iso: "FR", impressions: 2100000, clicks: 84000, spend: 290000, visits: 29000, conversions: 5800, offlineRevenue: 48000000, offlineRoas: 62.4, clickToVisitRate: 3.1, offlinePurchases: 160 },
    { iso: "US", impressions: 1800000, clicks: 72000, spend: 250000, visits: 25000, conversions: 5000, offlineRevenue: 42000000, offlineRoas: 58.9, clickToVisitRate: 2.8, offlinePurchases: 140 },
];

export function useApiInsightsByGeographySummary({ brandId, payload, enabled = true }: ApiPayload): ApiResult<{ data: GeographicMetricsResultDto[] }> {
    const [data, setData] = useState<{ data: GeographicMetricsResultDto[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!enabled || !brandId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Simulate API call delay
        const timer = setTimeout(() => {
            const mockData = payload?.level === "TURKEY" ? mockTurkeyData : mockWorldData;
            setData({ data: mockData });
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [brandId, payload?.level, enabled]);

    return { data, isLoading, error: null };
}
