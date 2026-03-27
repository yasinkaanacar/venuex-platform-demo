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
import type { OverviewFilterState } from '@/pages/overview';
import type { FilterState } from '@/components/offline-conversions/mock-setup';

interface DashboardPerformanceChartProps {
    filters?: OverviewFilterState;
}

export default function DashboardPerformanceChart({ filters }: DashboardPerformanceChartProps) {
    // Bridge OverviewFilterState → FilterState
    const [internalFilters, setInternalFilters] = useState<FilterState>(() => ({
        dateRange: filters?.dateRange || 'last30d',
        platforms: filters?.platform && filters.platform !== 'all' ? [filters.platform] : [],
        platform: filters?.platform && filters.platform !== 'all' ? filters.platform : 'google',
        campaigns: [],
        campaignTypes: [],
    }));

    // Sync when parent filters change
    const derivedFilters: FilterState = {
        ...internalFilters,
        dateRange: filters?.dateRange || internalFilters.dateRange,
        platforms: filters?.platform && filters.platform !== 'all' ? [filters.platform] : [],
        platform: filters?.platform && filters.platform !== 'all' ? filters.platform : 'google',
    };

    const handleFiltersChange = useCallback((updater: React.SetStateAction<FilterState>) => {
        setInternalFilters(updater);
    }, []);

    return (
        <div className="dashboard-chart-override">
            <PerformanceChart
                filters={derivedFilters}
                onFiltersChange={handleFiltersChange}
            />
        </div>
    );
}
