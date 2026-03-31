import { useState } from 'react';
import { useBrandContext } from '@/hooks/useAuth';
import { useApiOverview } from '@/hooks/api';
import { useTranslation } from '@/contexts/LanguageContext';

import DashboardPerformanceChart from '@/components/overview/DashboardPerformanceChart';
import TopPerformingOverview from '@/components/overview/TopPerformingOverview';
import DataPipelineStatus from '@/components/overview/DataPipelineStatus';
import { Select, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@mui/material';
import { Calendar, LayoutDashboard, RefreshCw, AlertCircle } from 'lucide-react';

export interface OverviewFilterState {
  dateRange: string;
}

export default function Overview() {
  const { brandId } = useBrandContext();
  const { data: overviewData, isLoading, error, refetch } = useApiOverview({ brandId });
  const { t } = useTranslation();
  const db = t.dashboard as any;

  const [filters, setFilters] = useState<OverviewFilterState>({
    dateRange: 'last30d',
  });

  const dateRangeOptions = [
    { value: 'last7d', label: db?.last7d || 'Last 7 Days' },
    { value: 'last30d', label: db?.last30d || 'Last 30 Days' },
    { value: 'last90d', label: db?.last90d || 'Last 90 Days' },
    { value: 'thisMonth', label: db?.thisMonth || 'This Month' },
    { value: 'lastMonth', label: db?.lastMonth || 'Last Month' },
  ];

  const selectedDateLabel = dateRangeOptions.find(o => o.value === filters.dateRange)?.label || db?.last30d || 'Last 30 Days';

  if (error) {
    return (
      <div className="vx-page">
        <div className="vx-page-body">
          <div className="vx-section-stack">
            <div className="vx-card">
              <div className="vx-card-body vx-surface-muted">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{db?.errorTitle || 'Failed to load dashboard'}</h3>
                  <p className="text-xs text-gray-500 mb-4">{db?.errorDesc || 'Please check your connection and try again'}</p>
                  <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {db?.retry || 'Retry'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vx-page">
      {/* Main Content */}
      <div className="vx-page-body min-h-[calc(100vh-4rem)]">
        {isLoading ? (
          <>
            <div className="vx-section-stack">
              <Skeleton variant="rectangular" height={40} width={280} sx={{ borderRadius: 1 }} />
            </div>
            <div className="vx-section-stack">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={128} sx={{ borderRadius: 2 }} data-testid={`skeleton-kpi-${i}`} />
                ))}
              </div>
            </div>
            <div className="vx-section-stack">
              <Skeleton variant="rectangular" height={384} sx={{ borderRadius: 2 }} data-testid="skeleton-chart" />
            </div>
            <div className="vx-section-stack">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} data-testid="skeleton-locations" />
                <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} data-testid="skeleton-campaigns" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Page Title + Filter Bar */}
            <div className="vx-section-stack">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-5 h-5 text-gray-500" />
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      {db?.title || 'Dashboard'}
                    </h1>
                    <p className="text-xs text-gray-500">
                      {db?.subtitle || 'Cross-platform performance overview'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                      displayLabel={selectedDateLabel}
                      width={160}
                    >
                      {dateRangeOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Pipeline Status with KPIs */}
            <div className="vx-section-stack">
              <DataPipelineStatus kpis={overviewData?.kpis} platforms={overviewData?.platforms} filters={filters} />
            </div>

            {/* Online-to-Offline Conversion Funnel */}
            <div className="vx-section-stack">
              <DashboardPerformanceChart filters={filters} />
            </div>

            {/* Top Performing Locations & Campaigns Side by Side */}
            <div className="vx-section-stack">
              <TopPerformingOverview
                topLocations={overviewData?.topLocations}
                topCampaigns={overviewData?.topCampaigns}
                filters={filters}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
