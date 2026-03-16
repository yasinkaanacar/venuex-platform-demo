import { useState } from 'react';
import { useBrandContext } from '@/hooks/useAuth';
import { useApiOverview } from '@/hooks/api';
import { useTranslation } from '@/contexts/LanguageContext';

import PerformanceChart from '@/components/offline-conversions/performance-chart';
import TopPerformingOverview from '@/components/overview/TopPerformingOverview';
import DataPipelineStatus from '@/components/overview/DataPipelineStatus';
import AlertsPanel from '@/components/overview/AlertsPanel';
import DataQualityEnrichment from '@/components/overview/data-quality-enrichment';
import { Select, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@mui/material';
import { Calendar, Monitor } from 'lucide-react';

interface OverviewFilterState {
  dateRange: string;
  platform: string;
}

export default function Overview() {
  const { brandId } = useBrandContext();
  const { data: overviewData, isLoading, error } = useApiOverview({ brandId });
  const { t } = useTranslation();
  const db = t.dashboard as any;

  const [filters, setFilters] = useState<OverviewFilterState>({
    dateRange: 'last30d',
    platform: 'all',
  });

  const dateRangeOptions = [
    { value: 'last7d', label: db?.last7d || 'Last 7 Days' },
    { value: 'last30d', label: db?.last30d || 'Last 30 Days' },
    { value: 'last90d', label: db?.last90d || 'Last 90 Days' },
    { value: 'thisMonth', label: db?.thisMonth || 'This Month' },
    { value: 'lastMonth', label: db?.lastMonth || 'Last Month' },
  ];

  const platformOptions = [
    { value: 'all', label: db?.allPlatforms || 'All Platforms' },
    { value: 'google', label: 'Google' },
    { value: 'meta', label: 'Meta' },
    { value: 'tiktok', label: 'TikTok' },
  ];

  const selectedDateLabel = dateRangeOptions.find(o => o.value === filters.dateRange)?.label || db?.last30d || 'Last 30 Days';
  const selectedPlatformLabel = platformOptions.find(o => o.value === filters.platform)?.label || db?.allPlatforms || 'All Platforms';

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Failed to load dashboard</h1>
          <p className="text-muted-foreground">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vx-page">
      {/* Main Content */}
      <div className="vx-page-body min-h-[calc(100vh-4rem)]">
        {isLoading ? (
          <div className="vx-section-stack space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={128} sx={{ borderRadius: 2 }} data-testid={`skeleton-kpi-${i}`} />
              ))}
            </div>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} data-testid="skeleton-alerts" />
            <Skeleton variant="rectangular" height={384} sx={{ borderRadius: 2 }} data-testid="skeleton-chart" />
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} data-testid="skeleton-quality" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} data-testid="skeleton-locations" />
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} data-testid="skeleton-campaigns" />
            </div>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="vx-section-stack">
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
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-gray-400" />
                  <Select
                    value={filters.platform}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value }))}
                    displayLabel={selectedPlatformLabel}
                    width={160}
                  >
                    {platformOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Data Pipeline Status with KPIs */}
            <div className="vx-section-stack">
              <DataPipelineStatus kpis={overviewData?.kpis} platforms={overviewData?.platforms} />
            </div>

            {/* Alerts & Issues */}
            <div className="vx-section-stack">
              <AlertsPanel alerts={overviewData?.alerts ?? []} />
            </div>

            {/* Online-to-Offline Conversion Funnel */}
            <div className="vx-section-stack">
              <PerformanceChart
                filters={{
                  dateRange: filters.dateRange,
                  platforms: filters.platform === 'all' ? [] : [filters.platform],
                  platform: filters.platform === 'all' ? 'google' : filters.platform,
                  campaigns: [],
                  campaignTypes: [],
                }}
                onFiltersChange={() => {}}
              />
            </div>

            {/* Data Quality & Enrichment */}
            <div className="vx-section-stack">
              <DataQualityEnrichment context="dashboard" />
            </div>

            {/* Top Performing Locations & Campaigns Side by Side */}
            <div className="vx-section-stack">
              <TopPerformingOverview
                topLocations={overviewData?.topLocations}
                topCampaigns={overviewData?.topCampaigns}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
