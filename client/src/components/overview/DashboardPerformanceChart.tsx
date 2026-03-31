/**
 * Dashboard-specific wrapper around PerformanceChart.
 *
 * Bridges the overview page's OverviewFilterState to the
 * offline-conversions FilterState shape. This keeps the original
 * PerformanceChart untouched while giving the dashboard its own
 * filter contract.
 */

import { useState, useCallback } from 'react';
import PerformanceChart from '@/components/offline-conversions/performance-chart';
import ProviderSelection, { ProviderOptions } from '@/components/offline-conversions/provider-selection';
import { Provider } from '@/lib/types/common';
import type { OverviewFilterState } from '@/pages/overview';
import type { FilterState } from '@/components/offline-conversions/mock-setup';

const dashboardProviders: ProviderOptions[] = [
    { key: Provider.Google, enabled: true },
    { key: Provider.Meta, enabled: true },
    { key: Provider.TikTok, enabled: true },
];

interface DashboardPerformanceChartProps {
    filters?: OverviewFilterState;
}

export default function DashboardPerformanceChart({ filters }: DashboardPerformanceChartProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<Provider>(Provider.Google);

    // Bridge OverviewFilterState → FilterState
    const [internalFilters, setInternalFilters] = useState<FilterState>(() => ({
        dateRange: filters?.dateRange || 'last30d',
        platforms: [],
        platform: 'google',
        campaigns: [],
        campaignTypes: [],
    }));

    // Sync when parent filters change
    const derivedFilters: FilterState = {
        ...internalFilters,
        dateRange: filters?.dateRange || internalFilters.dateRange,
        platform: selectedPlatform,
    };

    const handleFiltersChange = useCallback((updater: React.SetStateAction<FilterState>) => {
        setInternalFilters(updater);
    }, []);

    const handlePlatformChange = useCallback((provider: Provider) => {
        setSelectedPlatform(provider);
    }, []);

    const providerSelector = (
        <div className="scale-110">
            <ProviderSelection
                providers={dashboardProviders}
                selectedProvider={selectedPlatform}
                onProviderChange={handlePlatformChange}
                attrIdPrefix="dashboard-provider"
            />
        </div>
    );

    return (
        <div className="dashboard-chart-override">
            <PerformanceChart
                filters={derivedFilters}
                onFiltersChange={handleFiltersChange}
                providerSelector={providerSelector}
            />
        </div>
    );
}
