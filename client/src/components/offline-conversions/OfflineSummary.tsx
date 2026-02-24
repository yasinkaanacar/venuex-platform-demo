import { useMemo } from "react";
import {
  ChevronRight,
  Info,
  DollarSign,
  Target,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react";
import OfflineDataFlowStatus from './OfflineDataFlowStatus';
import { useLocales } from '@/lib/formatters';

// --- Types ---

interface EngagementMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface OfflineSummaryProps {
  filters: { platforms: string[] };
}

// --- Mock Data ---

const GOOGLE_METRICS: EngagementMetric[] = [
  { label: 'Attributed Revenue', value: '2.847.500 ₺', change: 27.5, icon: <DollarSign className="w-4 h-4" />, color: 'blue' },
  { label: 'Offline ROAS', value: '4.23:1', change: 9.3, icon: <Target className="w-4 h-4" />, color: 'green' },
  { label: 'Store Conversions', value: '1.847', change: 13.8, icon: <Store className="w-4 h-4" />, color: 'purple' },
  { label: 'Avg Order Value', value: '1.542 ₺', change: 12.0, icon: <TrendingUp className="w-4 h-4" />, color: 'orange' }
];

const META_METRICS: EngagementMetric[] = [
  { label: 'Attributed Revenue', value: '1.450.200 ₺', change: -5.2, icon: <DollarSign className="w-4 h-4" />, color: 'blue' },
  { label: 'Offline ROAS', value: '3.10:1', change: 2.1, icon: <Target className="w-4 h-4" />, color: 'green' },
  { label: 'Store Conversions', value: '890', change: 4.5, icon: <Store className="w-4 h-4" />, color: 'purple' },
  { label: 'Avg Order Value', value: '1.240 ₺', change: -1.5, icon: <TrendingUp className="w-4 h-4" />, color: 'orange' }
];

const TIKTOK_METRICS: EngagementMetric[] = [
  { label: 'Attributed Revenue', value: '980.000 ₺', change: 45.8, icon: <DollarSign className="w-4 h-4" />, color: 'blue' },
  { label: 'Offline ROAS', value: '2.85:1', change: 15.4, icon: <Target className="w-4 h-4" />, color: 'green' },
  { label: 'Store Conversions', value: '1.100', change: 32.0, icon: <Store className="w-4 h-4" />, color: 'purple' },
  { label: 'Avg Order Value', value: '890 ₺', change: 8.5, icon: <TrendingUp className="w-4 h-4" />, color: 'orange' }
];

const ALL_METRICS: EngagementMetric[] = [
  { label: 'Attributed Revenue', value: '5.277.700 ₺', change: 18.4, icon: <DollarSign className="w-4 h-4" />, color: 'blue' },
  { label: 'Offline ROAS', value: '3.62:1', change: 7.8, icon: <Target className="w-4 h-4" />, color: 'green' },
  { label: 'Store Conversions', value: '3.837', change: 15.2, icon: <Store className="w-4 h-4" />, color: 'purple' },
  { label: 'Avg Order Value', value: '1.375 ₺', change: 6.5, icon: <TrendingUp className="w-4 h-4" />, color: 'orange' }
];

const METRICS_BY_PLATFORM: Record<string, EngagementMetric[]> = {
  google: GOOGLE_METRICS,
  meta: META_METRICS,
  tiktok: TIKTOK_METRICS,
};

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google Ads',
  meta: 'Meta Ads',
  tiktok: 'TikTok Ads',
};

// --- Utils ---

const getSeverityColor = (score: number) => {
  if (score >= 90) return { text: 'text-emerald-600', bg: 'bg-emerald-500' };
  if (score >= 70) return { text: 'text-amber-600', bg: 'bg-amber-500' };
  return { text: 'text-rose-600', bg: 'bg-rose-500' };
};

// --- Sub-Components ---

const EngagementCard = ({
  metrics,
  platformLabel,
  oc
}: {
  metrics: EngagementMetric[],
  platformLabel: string,
  oc: (key: string) => string
}) => (
  <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-1.5">
        <h4 className="text-sm font-semibold text-gray-700">{oc('offlineConversionPerformance')}</h4>
        <div className="relative group">
          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
            Offline conversion metrics attributed by each ad platform (Google Ads, Meta CAPI, TikTok CAPI).
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{platformLabel}</span>
        <span className="text-xs text-gray-400">Last 30 days</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric) => {
        const isPositive = metric.change >= 0;
        return (
          <div key={metric.label} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-md bg-${metric.color}-100 text-${metric.color}-600`}>
                {metric.icon}
              </div>
              <span className="text-xs text-gray-500 font-medium">{metric.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-lg font-bold text-gray-900 tracking-tight">{metric.value}</span>
              <div className={`flex items-center gap-0.5 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(metric.change)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <button className="w-full mt-4 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
      {oc('detailedPerformanceReport')} <ChevronRight className="w-3 h-3" />
    </button>
  </div>
);

const DataQualityCard = ({ oc }: { oc: (key: string) => string }) => {
  return (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold text-gray-700">{oc('dataQualityCompliance')}</h4>
          <div className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
            92%
          </div>
        </div>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          {oc('detailedReport')} <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
        {/* Zorunlu Alanlar */}
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-3 flex items-center gap-2">
            {oc('requiredFields')}
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </h5>
          <div className="space-y-2">
            {[
              { label: 'Country', status: 100 },
              { label: 'Conversion Name', status: 100 },
              { label: 'Conversion Time', status: 100 },
              { label: 'Conversion Value', status: 98 },
              { label: 'Conversion Currency', status: 100 }
            ].map(field => {
              const colors = getSeverityColor(field.status);
              return (
                <div key={field.label} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">{field.label}</span>
                    <span className={`${colors.text} font-medium`}>{field.status}%</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${field.status}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Match Rate Kritik */}
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-3 flex items-center gap-2">
            {oc('matchRateCritical')}
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </h5>
          <div className="space-y-2">
            {[
              { label: 'Email (SHA-256)', status: 95 },
              { label: 'Phone (SHA-256)', status: 92 },
              { label: 'First Name', status: 88 },
              { label: 'Last Name', status: 88 }
            ].map(field => {
              const colors = getSeverityColor(field.status);
              return (
                <div key={field.label} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">{field.label}</span>
                    <span className={`${colors.text} font-medium`}>{field.status}%</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${field.status}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Opsiyonel Alanlar */}
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-3 flex items-center gap-2">
            {oc('optionalData')}
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </h5>
          <div className="space-y-2">
            {[
              { label: 'City', status: 85 },
              { label: 'Zip / Postal Code', status: 78 },
              { label: 'Store Code', status: 100 },
              { label: 'Order ID', status: 94 }
            ].map(field => {
              const colors = getSeverityColor(field.status);
              return (
                <div key={field.label} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">{field.label}</span>
                    <span className={`${colors.text} font-medium`}>{field.status}%</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${field.status}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ürün Bazlı Attribution */}
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-3 flex items-center gap-2">
            {oc('productDetails')}
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          </h5>
          <div className="space-y-2">
            {[
              { label: 'Contents ID', status: 65 },
              { label: 'Quantity', status: 65 },
              { label: 'Price', status: 65 },
              { label: 'Brand / Category', status: 42 }
            ].map(field => {
              const colors = getSeverityColor(field.status);
              return (
                <div key={field.label} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">{field.label}</span>
                    <span className={`${colors.text} font-medium`}>{field.status}%</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${field.status}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enrichment Suggestions based on PDF */}
      <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-lg text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span className="text-gray-700">Product category info missing (affects ROAS)</span>
          <button className="text-blue-600 hover:underline font-medium ml-1">Edit</button>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span className="text-gray-700">Email hash format should be verified</span>
          <button className="text-blue-600 hover:underline font-medium ml-1">Verify</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export function OfflineSummary({ filters }: OfflineSummaryProps) {
  const { t } = useLocales();
  const oc = (key: string) => t(`offlineConversions.${key}`);

  const { currentMetrics, platformLabel } = useMemo(() => {
    const selected = filters.platforms;
    if (selected.length === 0) {
      return { currentMetrics: ALL_METRICS, platformLabel: 'All Platforms' };
    }
    if (selected.length === 1) {
      return {
        currentMetrics: METRICS_BY_PLATFORM[selected[0]] || ALL_METRICS,
        platformLabel: PLATFORM_LABELS[selected[0]] || selected[0],
      };
    }
    // Multiple platforms selected — show combined
    return {
      currentMetrics: ALL_METRICS,
      platformLabel: selected.map(p => PLATFORM_LABELS[p] || p).join(', '),
    };
  }, [filters.platforms]);

  return (
    <div className="mb-6">
      {/* Main Card */}
      <div className="vx-card">
        <div className="vx-card-header">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-foreground">Summary</h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                Data connections, match rates, and offline conversion performance overview.
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Data connections, conversion matching, and platform status overview</p>
        </div>

        <div className="vx-card-body vx-surface-muted space-y-4">
          {/* Row 1: Data Flow (40%) + Conversion Performance (60%) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <OfflineDataFlowStatus />
            </div>
            <div className="lg:col-span-3">
              <EngagementCard
                metrics={currentMetrics}
                platformLabel={platformLabel}
                oc={oc}
              />
            </div>
          </div>

          {/* Row 2: Data Quality (full width) */}
          <DataQualityCard oc={oc} />
        </div>
      </div>
    </div>
  );
}

export default OfflineSummary;
