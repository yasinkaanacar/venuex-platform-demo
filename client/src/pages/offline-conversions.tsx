import Header from '@/components/overview/header';
import FilterBar from '@/components/overview/filter-bar';
import WeeklySalesChart from '@/components/overview/weekly-sales-chart';
import TopPerformingLocations from '@/components/overview/top-performing-locations';
import { useState } from 'react';
import { FilterState } from '@/lib/types';

export default function OfflineConversions() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'Last 7 days',
    platform: 'Google',
    compareMode: false
  });

  return (
    <div className="min-h-full bg-white dark:bg-gray-900">
      <Header lastSync="2 minutes ago" />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Offline Conversions</h1>
          <p className="text-muted-foreground">Track and analyze offline sales performance driven by online advertising</p>
        </div>
        
        <FilterBar filters={filters} onFiltersChange={setFilters} />
        
        <div className="space-y-8">
          <WeeklySalesChart />
          <TopPerformingLocations filters={filters} onFiltersChange={setFilters} />
        </div>
      </div>
    </div>
  );
}