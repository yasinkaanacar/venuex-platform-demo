import { useState } from 'react';
import { Calendar, Filter, Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataQualityEnrichment from '@/components/overview/data-quality-enrichment';
import DataHealthAlerts from '@/components/overview/data-health-alerts';
import WeeklySalesChart from '../components/overview/weekly-sales-chart';
import PerformanceChart from '../components/overview/performance-chart';

// New modular components
import AttributionBreakdown from '@/components/offline-conversions/AttributionBreakdown';
import StoreConversionsTable from '@/components/offline-conversions/StoreConversionsTable';
import CampaignPerformanceTable from '@/components/offline-conversions/CampaignPerformanceTable';
import ConversionTrends from '@/components/offline-conversions/ConversionTrends';
import OfflineSummary from '@/components/offline-conversions/OfflineSummary';

export default function OfflineConversions() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [platform, setPlatform] = useState('all');
  const [mainTab, setMainTab] = useState<'summary' | 'performance' | 'stores' | 'campaigns'>('summary');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation - Sticky */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl">
              <button
                onClick={() => setMainTab('summary')}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${mainTab === 'summary'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                data-testid="tab-summary"
              >
                Özet
              </button>
              <button
                onClick={() => setMainTab('performance')}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${mainTab === 'performance'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                data-testid="tab-performance"
              >
                Performans
              </button>
              <button
                onClick={() => setMainTab('stores')}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${mainTab === 'stores'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                data-testid="tab-stores"
              >
                Mağazalar
              </button>
              <button
                onClick={() => setMainTab('campaigns')}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${mainTab === 'campaigns'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                data-testid="tab-campaigns"
              >
                Kampanyalar
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-36 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 days</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="w-36 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="meta">Meta Ads</SelectItem>
                    <SelectItem value="tiktok">TikTok Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                Live • Updated 2 min ago
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-6 bg-white">
        {/* Summary Tab */}
        {mainTab === 'summary' && (
          <>
            {/* Summary Card - matching PlatformSummaryNew pattern */}
            <div className="mt-6">
              <OfflineSummary />
            </div>
          </>
        )}

        {/* Performance Tab */}
        {mainTab === 'performance' && (
          <>
            <div className="mx-6 mt-6 mb-4">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-semibold text-gray-900">Performans Analizi</h2>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                Detailed performance charts and funnel analysis
              </p>
            </div>

            {/* Weekly Sales Chart */}
            <div className="mx-6 mb-6">
              <WeeklySalesChart
                selectedPlatform={platform === 'tiktok' ? 'TikTok' : (platform === 'all' ? 'Google' : platform.charAt(0).toUpperCase() + platform.slice(1))}
                onPlatformChange={(p) => setPlatform(p.toLowerCase())}
              />
            </div>

            {/* Performance Chart */}
            <div className="mx-6 mb-6">
              <PerformanceChart filters={{ platform: platform, dateRange: dateRange, compareMode: false }} onFiltersChange={() => { }} />
            </div>

            {/* Conversion Trends */}
            <div className="mx-6 mb-6">
              <ConversionTrends />
            </div>
          </>
        )}

        {/* Stores Tab */}
        {mainTab === 'stores' && (
          <>
            <div className="mx-6 mt-6 mb-4">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-semibold text-gray-900">Mağaza Dönüşümleri</h2>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                Store-level conversion insights and revenue attribution
              </p>
            </div>

            <div className="mx-6 mb-6">
              <StoreConversionsTable />
            </div>

            {/* Data Health */}
            <div className="mx-6 mb-6">
              <DataHealthAlerts bannerMode={false} alwaysExpanded={true} />
            </div>
          </>
        )}

        {/* Campaigns Tab */}
        {mainTab === 'campaigns' && (
          <>
            <div className="mx-6 mt-6 mb-4">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-semibold text-gray-900">Kampanya Performansı</h2>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                Campaign-level ROI and conversion metrics
              </p>
            </div>

            <div className="mx-6 mb-6">
              <CampaignPerformanceTable onExport={() => console.log('Export clicked')} />
            </div>

            {/* Attribution Breakdown */}
            <div className="mx-6 mb-6">
              <AttributionBreakdown />
            </div>
          </>
        )}
      </div>
    </div>
  );
}