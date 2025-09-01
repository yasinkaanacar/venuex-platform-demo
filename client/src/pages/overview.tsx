import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/overview/header';
import FilterBar from '@/components/overview/filter-bar';
import KpiCards from '@/components/overview/kpi-cards';
import PerformanceChart from '@/components/overview/performance-chart';
import WeeklySalesChart from '@/components/overview/weekly-sales-chart';
import TopPerformingLocations from '@/components/overview/top-performing-locations';
import TopPerformingCampaigns from '@/components/overview/top-performing-campaigns';
import DataQualityEnrichment from '@/components/overview/data-quality-enrichment';
import DataHealthAlerts from '@/components/overview/data-health-alerts';
import AlertsNotifications from '@/components/overview/alerts-notifications';
import { FilterState, OverviewData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Overview() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'Last 7 days',
    platform: 'All Platforms',
    location: 'All Locations',
    campaign: 'All Campaigns',
    compareMode: false
  });

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
        <FilterBar filters={filters} onFiltersChange={setFilters} />
        
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" data-testid={`skeleton-kpi-${i}`} />
              ))}
            </div>
            <Skeleton className="h-96 rounded-lg" data-testid="skeleton-chart" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-lg" data-testid="skeleton-data-health" />
              <Skeleton className="h-80 rounded-lg" data-testid="skeleton-locations" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <KpiCards kpis={overviewData?.kpis} />
            <PerformanceChart />
            <WeeklySalesChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopPerformingLocations />
              <TopPerformingCampaigns />
            </div>
            <DataQualityEnrichment />
            
            <div className="space-y-6">
              <DataHealthAlerts 
                platforms={overviewData?.platforms} 
                alerts={overviewData?.alerts}
                locations={overviewData?.locations}
              />
              <AlertsNotifications 
                alerts={overviewData?.alerts}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
