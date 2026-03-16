import { useBrandContext } from '@/hooks/useAuth';
import { useApiOverview } from '@/hooks/api';

import PerformanceChart from '@/components/offline-conversions/performance-chart';
import TopPerformingOverview from '@/components/overview/TopPerformingOverview';
import DataPipelineStatus from '@/components/overview/DataPipelineStatus';
import { Skeleton } from '@mui/material';

export default function Overview() {
  const { brandId } = useBrandContext();
  const { data: overviewData, isLoading, error } = useApiOverview({ brandId });

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
            <Skeleton variant="rectangular" height={384} sx={{ borderRadius: 2 }} data-testid="skeleton-chart" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} data-testid="skeleton-data-health" />
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} data-testid="skeleton-locations" />
            </div>
          </div>
        ) : (
          <>
            {/* Data Pipeline Status with KPIs */}
            <div className="vx-section-stack">
              <DataPipelineStatus />
            </div>

            {/* Online-to-Offline Conversion Funnel */}
            <div className="vx-section-stack">
              <PerformanceChart filters={{ dateRange: 'Last 30 days', platform: 'Google', compareMode: false }} onFiltersChange={() => { }} showProviderFilter={true} />
            </div>

            {/* Top Performing Locations & Campaigns Side by Side */}
            <div className="vx-section-stack">
              <TopPerformingOverview />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
