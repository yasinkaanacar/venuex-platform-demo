import { useState, useMemo } from "react";
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
import { SiGoogle, SiMeta, SiApple, SiTiktok } from 'react-icons/si';
import { mockLocations, calculateDataHealth } from "@/lib/mock-locations";
import OfflineDataFlowStatus from './OfflineDataFlowStatus';
import ProviderSelection, { ProviderOptions } from "./provider-selection";
import { Provider, useSetup } from "./mock-setup";

// --- Types ---

type PlatformKey = 'google' | 'meta' | 'apple' | 'yandex';

interface EngagementMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  isCurrency?: boolean;
}

interface PlatformStats {
  live: number;
  pending: number;
  suspended: number;
  action_required: number;
  rejected: number;
  not_connected: number;
  total_problems: number;
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

const PLATFORM_CONFIG: { key: PlatformKey; name: string; icon: React.ReactNode }[] = [
  { key: 'google', name: 'Google', icon: <SiGoogle className="w-3.5 h-3.5" /> },
  { key: 'meta', name: 'Meta', icon: <SiMeta className="w-3.5 h-3.5" /> },
  { key: 'apple', name: 'Apple', icon: <SiApple className="w-3.5 h-3.5" /> },
  { key: 'yandex', name: 'Yandex', icon: <img src="https://yastatic.net/s3/home-static/_/nova/JSRBlH1m.png" alt="Yandex" className="w-3.5 h-3.5 object-contain" /> }
];

// --- Utils ---

const getSeverityColor = (score: number) => {
  if (score >= 90) return { text: 'text-emerald-600', bg: 'bg-emerald-500' };
  if (score >= 70) return { text: 'text-amber-600', bg: 'bg-amber-500' };
  return { text: 'text-rose-600', bg: 'bg-rose-500' };
};

// --- Sub-Components ---

const HealthCard = ({ platforms, totalLocations, businessStatus }: {
  platforms: Record<PlatformKey, PlatformStats>;
  totalLocations: number;
  businessStatus: { open: number; temporarilyClosed: number; closed: number };
}) => {
  return (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Business Status - Top Half */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Business Status</h4>
      <div className="grid grid-cols-4 gap-2 mb-5">
        <div className="p-2 bg-gray-50 rounded-lg text-center">
          <div className="text-xl font-bold text-gray-900">{totalLocations}</div>
          <div className="text-[10px] text-gray-500">Total</div>
        </div>
        <div className="p-2 bg-emerald-50 rounded-lg text-center">
          <div className="text-xl font-bold text-emerald-600">{businessStatus.open}</div>
          <div className="text-[10px] text-gray-500">Open</div>
        </div>
        <div className="p-2 bg-amber-50 rounded-lg text-center">
          <div className="text-xl font-bold text-amber-600">{businessStatus.temporarilyClosed}</div>
          <div className="text-[10px] text-gray-500">Temporarily Closed</div>
        </div>
        <div className="p-2 bg-rose-50 rounded-lg text-center">
          <div className="text-xl font-bold text-rose-600">{businessStatus.closed}</div>
          <div className="text-[10px] text-gray-500">Permanently Closed</div>
        </div>
      </div>

      {/* Platform Sync - Bottom Half */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Platform Synchronization</h4>
      <div className="space-y-2">
        {PLATFORM_CONFIG.map(({ key, name, icon }) => {
          const p = platforms[key];
          const percentage = totalLocations > 0 ? Math.round((p.live / totalLocations) * 100) : 0;
          const barColor = percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500';

          // Show setup required for Yandex
          if (key === 'yandex') {
            return (
              <div key={key} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-2 text-gray-400 w-20">
                  {icon}
                  <span>{name}</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-400 italic">Setup Required</span>
                </div>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  Setup
                </button>
              </div>
            );
          }

          return (
            <div key={key} className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-600 w-20">
                {icon}
                <span>{name}</span>
              </div>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
              </div>
              <span className={`font-medium w-10 text-right ${percentage >= 80 ? 'text-emerald-600' : percentage >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EngagementCard = ({
  metrics,
  selectedProvider,
  onProviderChange,
  providerOptions
}: {
  metrics: EngagementMetric[],
  selectedProvider: Provider,
  onProviderChange: (p: Provider) => void,
  providerOptions: ProviderOptions[]
}) => (
  <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-1.5">
        <h4 className="text-sm font-semibold text-gray-700">Offline Conversion Performance</h4>
        <div className="relative group">
          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
            Performance data is only valid for Google Business Profile and Apple Business Connect.
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Scaled down provider selector */}
        <div className="scale-90 origin-right">
          <ProviderSelection
            providers={providerOptions}
            selectedProvider={selectedProvider}
            onProviderChange={onProviderChange}
            attrIdPrefix="summary-card"
          />
        </div>
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
      Detailed Performance Report <ChevronRight className="w-3 h-3" />
    </button>
  </div>
);

const DataQualityCard = () => {
  return (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold text-gray-700">Data Quality and Compliance</h4>
          <div className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
            92%
          </div>
        </div>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          Detailed Report <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
        {/* Zorunlu Alanlar */}
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-3 flex items-center gap-2">
            Required Fields
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
            Match Rate (Kritik)
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
            Optional Data
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
            Product Details
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

export function OfflineSummary() {
  const { isGoogleAdsEnabled, isMetaConversionsConnected, isMetaAdAccountEnabled, isTiktokEventsConnected } = useSetup();

  const providerOptions: ProviderOptions[] = useMemo(() => [
    { key: Provider.Google, enabled: isGoogleAdsEnabled },
    { key: Provider.Meta, enabled: isMetaConversionsConnected && isMetaAdAccountEnabled },
    { key: Provider.TikTok, enabled: isTiktokEventsConnected },
  ], [isGoogleAdsEnabled, isMetaConversionsConnected, isMetaAdAccountEnabled, isTiktokEventsConnected]);

  const [selectedProvider, setSelectedProvider] = useState<Provider>(Provider.Google);

  const currentMetrics = useMemo(() => {
    switch (selectedProvider) {
      case Provider.Meta: return META_METRICS;
      case Provider.TikTok: return TIKTOK_METRICS;
      case Provider.Google: return GOOGLE_METRICS;
      case Provider.Apple: return GOOGLE_METRICS; // Reuse Google for Apple as fallback/simplified
      default: return GOOGLE_METRICS;
    }
  }, [selectedProvider]);

  const stats = useMemo(() => {
    const businessStatus = {
      open: mockLocations.filter(l => l.businessStatus === 'open').length,
      temporarilyClosed: mockLocations.filter(l => l.businessStatus === 'temporarily_closed').length,
      closed: mockLocations.filter(l => l.businessStatus === 'closed').length
    };

    const totalHealth = mockLocations.reduce((sum, loc) => sum + calculateDataHealth(loc), 0);
    const dataQuality = mockLocations.length > 0 ? Math.round(totalHealth / mockLocations.length) : 0;

    const platforms: Record<PlatformKey, PlatformStats> = {
      google: { live: 0, pending: 0, suspended: 0, action_required: 0, rejected: 0, not_connected: 0, total_problems: 0 },
      meta: { live: 0, pending: 0, suspended: 0, action_required: 0, rejected: 0, not_connected: 0, total_problems: 0 },
      apple: { live: 0, pending: 0, suspended: 0, action_required: 0, rejected: 0, not_connected: 0, total_problems: 0 },
      yandex: { live: 0, pending: 0, suspended: 0, action_required: 0, rejected: 0, not_connected: 0, total_problems: 0 }
    };

    mockLocations.forEach(loc => {
      (Object.keys(platforms) as PlatformKey[]).forEach(key => {
        const status = loc[key].status;
        const p = platforms[key];
        if (status === 'live') p.live++;
        else if (status === 'pending') p.pending++;
        else if (status === 'action_required') p.action_required++;
        else if (status === 'suspended') { p.suspended++; p.total_problems++; }
        else if (status === 'rejected') { p.rejected++; p.total_problems++; }
        else if (status === 'not_connected' || status === 'closed') p.not_connected++;
      });
    });

    (Object.keys(platforms) as PlatformKey[]).forEach(key => {
      platforms[key].total_problems += platforms[key].action_required;
    });

    return { dataQuality, totalLocations: mockLocations.length, businessStatus, platforms };
  }, []);

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
                Shows the general status of all locations and platform synchronization.
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Data connections, conversion matching, and platform status overview</p>
        </div>

        <div className="vx-card-body vx-surface-muted space-y-4">
          {/* Top Row: Data Flow + Engagement (2 columns 1/2 - 1/2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OfflineDataFlowStatus />
            <EngagementCard
              metrics={currentMetrics}
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
              providerOptions={providerOptions}
            />
          </div>

          {/* Bottom Row: Data Quality (full width) */}
          <DataQualityCard />
        </div>
      </div>
    </div>
  );
}

export default OfflineSummary;
