import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/overview/header';
import FilterBar from '@/components/overview/filter-bar';
import KpiCards from '@/components/overview/kpi-cards';
import PerformanceChart from '@/components/overview/performance-chart';
import TopPerformingLocations from '@/components/overview/top-performing-locations';
import TopPerformingCampaigns from '@/components/overview/top-performing-campaigns';
import DataQualityEnrichment from '@/components/overview/data-quality-enrichment';
import DataHealthAlerts from '@/components/overview/data-health-alerts';
import { FilterState, OverviewData } from '@/lib/types';
import { Skeleton } from '@mui/material';

export default function Overview() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'Last 7 days',
    platform: 'Google',
    compareMode: false
  });

  const scrollToBottom = () => {
    const element = document.getElementById('data-health-details');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { data: overviewData, isLoading, error } = useQuery<OverviewData>({
    queryKey: ['/api/overview'],
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });

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
    <div className="min-h-full bg-white dark:bg-gray-900">
      <Header lastSync={overviewData?.lastSync} />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <DataHealthAlerts 
            platforms={overviewData?.platforms} 
            alerts={overviewData?.alerts}
            locations={overviewData?.locations}
            bannerMode={true}
            onScrollToBottom={scrollToBottom}
          />
        </div>
        
        
        <FilterBar filters={filters} onFiltersChange={setFilters} />
        
        {isLoading ? (
          <div className="space-y-6">
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
          <div className="space-y-8">
            <KpiCards kpis={overviewData?.kpis} filters={filters} onFiltersChange={setFilters} />
            <PerformanceChart filters={filters} onFiltersChange={setFilters} />
            <TopPerformingLocations filters={filters} onFiltersChange={setFilters} />
            <TopPerformingCampaigns filters={filters} onFiltersChange={setFilters} />
            <DataQualityEnrichment />
            
            <div id="data-health-details">
              <DataHealthAlerts 
                platforms={overviewData?.platforms} 
                alerts={overviewData?.alerts}
                locations={overviewData?.locations}
                bannerMode={false}
                alwaysExpanded={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
