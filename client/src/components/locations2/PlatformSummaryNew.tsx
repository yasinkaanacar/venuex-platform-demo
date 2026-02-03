import { useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  Phone,
  Navigation,
  Eye,
  TrendingUp,
  TrendingDown,
  Search,
  Info
} from "lucide-react";
import { SiGoogle, SiMeta, SiApple } from 'react-icons/si';
import { useTranslation } from "@/contexts/LanguageContext";
import { mockLocations, calculateDataHealth } from "@/lib/mock-locations";

// --- Types ---

type PlatformKey = 'google' | 'meta' | 'apple' | 'yandex';

interface EngagementMetric {
  label: string;
  value: number;
  previousValue: number;
  icon: React.ReactNode;
  color: string;
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

// Moved MOCK_ENGAGEMENT inside component to use translations

const PLATFORM_CONFIG: { key: PlatformKey; name: string; icon: React.ReactNode }[] = [
  { key: 'google', name: 'Google', icon: <SiGoogle className="w-3.5 h-3.5" /> },
  { key: 'meta', name: 'Meta', icon: <SiMeta className="w-3.5 h-3.5" /> },
  { key: 'apple', name: 'Apple', icon: <SiApple className="w-3.5 h-3.5" /> },
  { key: 'yandex', name: 'Yandex', icon: <img src="https://yastatic.net/s3/home-static/_/nova/JSRBlH1m.png" alt="Yandex" className="w-3.5 h-3.5 object-contain" /> }
];

// --- Utils ---

const formatNumber = (num: number): string =>
  num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : num.toString();

const calculateChange = (current: number, previous: number) => {
  const percent = Math.round(((current - previous) / previous) * 100);
  return { percent: Math.abs(percent), isPositive: percent >= 0 };
};

// --- Sub-Components ---

const HealthCard = ({ platforms, totalLocations, businessStatus }: {
  platforms: Record<PlatformKey, PlatformStats>;
  totalLocations: number;
  businessStatus: { open: number; temporarilyClosed: number; closed: number };
}) => {
  const { t } = useTranslation();
  return (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Business Status - Top Half */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{t.platformSummary.businessStatus}</h4>
      <div className="grid grid-cols-4 gap-2 mb-5">
        <div className="p-2 bg-gray-50 rounded-lg text-center">
          <div className="text-xl font-bold text-gray-900">{totalLocations}</div>
          <div className="text-[10px] text-gray-500">{t.platformSummary.total}</div>
        </div>
        <div className="p-2 bg-emerald-50 rounded-lg text-center">
          <div className="text-xl font-bold text-emerald-600">{businessStatus.open}</div>
          <div className="text-[10px] text-gray-500">{t.platformSummary.open}</div>
        </div>
        <div className="p-2 bg-amber-50 rounded-lg text-center">
          <div className="text-xl font-bold text-amber-600">{businessStatus.temporarilyClosed}</div>
          <div className="text-[10px] text-gray-500">{t.platformSummary.tempClosed}</div>
        </div>
        <div className="p-2 bg-rose-50 rounded-lg text-center">
          <div className="text-xl font-bold text-rose-600">{businessStatus.closed}</div>
          <div className="text-[10px] text-gray-500">{t.platformSummary.closed}</div>
        </div>
      </div>

      {/* Platform Sync - Bottom Half */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{t.platformSummary.platformSync}</h4>
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
                  <span className="text-xs text-gray-400 italic">{t.platformSummary.setupRequired}</span>
                </div>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  {t.platformSummary.setup}
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

const EngagementCard = ({ metrics }: { metrics: EngagementMetric[] }) => {
  const { t } = useTranslation();
  return (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm font-semibold text-gray-700">{t.platformSummary.listingPerformance}</h4>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
              Performans verileri sadece Google Business Profile ve Apple Business Connect için geçerlidir.
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-400">{t.platformSummary.last30Days}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const change = calculateChange(metric.value, metric.previousValue);
          return (
            <div key={metric.label} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`text-${metric.color}-500`}>{metric.icon}</div>
                <span className="text-xs text-gray-500">{metric.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-gray-900">{formatNumber(metric.value)}</span>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${change.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {change.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {change.percent}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
        {t.platformSummary.viewReport} <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};

// Compact Data Quality Card matching existing card styles
// Moved static data inside DataQualityCard to use translation hooks

const DataQualityCard = () => {
  const { t } = useTranslation();

  const DATA_QUALITY_CATEGORIES = [
    {
      category: t.platformSummary.locationData,
      items: [
        { label: t.platformSummary.address, value: 95, count: '12/13' },
        { label: t.platformSummary.coordinates, value: 92, count: '12/13' },
        { label: t.platformSummary.postalCode, value: 84, count: '11/13' },
      ]
    },
    {
      category: t.platformSummary.businessData,
      items: [
        { label: t.platformSummary.hours, value: 78, count: '10/13' },
        { label: t.platformSummary.category, value: 94, count: '12/13' },
        { label: t.platformSummary.photos, value: 45, count: '6/13' },
      ]
    },
    {
      category: t.platformSummary.contactData,
      items: [
        { label: t.platformSummary.phone, value: 82, count: '11/13' },
        { label: t.platformSummary.website, value: 89, count: '12/13' },
        { label: t.platformSummary.email, value: 63, count: '8/13' },
      ]
    }
  ];

  const ENRICHMENT_SUGGESTIONS = [
    { label: `3 ${t.platformSummary.photoMissing}`, priority: 'high', action: t.common.add },
    { label: `2 ${t.platformSummary.hoursUpdate}`, priority: 'medium', action: t.common.edit },
    { label: `5 ${t.platformSummary.emailMissing}`, priority: 'low', action: t.common.add },
  ];

  const allItems = DATA_QUALITY_CATEGORIES.flatMap(c => c.items);
  const overallScore = Math.round(allItems.reduce((sum, item) => sum + item.value, 0) / allItems.length);
  const scoreColor = overallScore >= 80 ? 'emerald' : overallScore >= 60 ? 'amber' : 'rose';

  return (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold text-gray-700">{t.platformSummary.dataQuality}</h4>
          <div className={`px-2 py-0.5 rounded-full text-xs font-bold bg-${scoreColor}-100 text-${scoreColor}-700`}>
            {overallScore}%
          </div>
        </div>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          {t.common.viewAll} <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 3-Column Categories */}
      <div className="grid grid-cols-3 gap-6 mb-5">
        {DATA_QUALITY_CATEGORIES.map(({ category, items }) => (
          <div key={category}>
            <h5 className="text-xs font-medium text-gray-500 mb-3">{category}</h5>
            <div className="space-y-2">
              {items.map(({ label, value, count }) => {
                const barColor = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-rose-500';
                const textColor = value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-amber-600' : 'text-rose-600';
                return (
                  <div key={label} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-[10px]">{count}</span>
                        <span className={`font-medium ${textColor}`}>{value}%</span>
                      </div>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor} transition-all duration-300`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Enrichment Suggestions */}
      <div className="pt-4 border-t border-gray-100">
        <h5 className="text-xs font-medium text-gray-500 mb-3">{t.platformSummary.enrichmentSuggestions}</h5>
        <div className="flex flex-wrap gap-2">
          {ENRICHMENT_SUGGESTIONS.map(({ label, priority, action }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${priority === 'high' ? 'bg-rose-50 border border-rose-200' :
                priority === 'medium' ? 'bg-amber-50 border border-amber-200' :
                  'bg-gray-50 border border-gray-200'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority === 'high' ? 'bg-rose-500' :
                priority === 'medium' ? 'bg-amber-500' :
                  'bg-gray-400'
                }`} />
              <span className="text-gray-700">{label}</span>
              <button className="font-medium text-blue-600 hover:text-blue-700 ml-1">
                {action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StoreStatusRow = ({ businessStatus, totalLocations }: {
  businessStatus: { open: number; temporarilyClosed: number; closed: number };
  totalLocations: number;
}) => (
  <div>
    <h4 className="text-sm font-semibold text-gray-700 mb-3">İşletme Durumu</h4>
    <div className="grid grid-cols-4 gap-3">
      <div className="p-3 bg-white rounded-lg border border-gray-100 text-center">
        <div className="text-2xl font-bold text-gray-900">{totalLocations}</div>
        <div className="text-xs text-gray-500">Toplam</div>
      </div>
      <div className="p-3 bg-white rounded-lg border border-emerald-100 text-center">
        <div className="text-2xl font-bold text-emerald-600">{businessStatus.open}</div>
        <div className="text-xs text-gray-500">Açık</div>
      </div>
      <div className="p-3 bg-white rounded-lg border border-amber-100 text-center">
        <div className="text-2xl font-bold text-amber-600">{businessStatus.temporarilyClosed}</div>
        <div className="text-xs text-gray-500">Geçici Kapalı</div>
      </div>
      <div className="p-3 bg-white rounded-lg border border-rose-100 text-center">
        <div className="text-2xl font-bold text-rose-600">{businessStatus.closed}</div>
        <div className="text-xs text-gray-500">Kalıcı Kapalı</div>
      </div>
    </div>
  </div>
);

// --- Main Component ---

export function PlatformSummaryNew() {
  const { t } = useTranslation();

  const MOCK_ENGAGEMENT: EngagementMetric[] = [
    { label: t.platformSummary.views, value: 12450, previousValue: 11200, icon: <Eye className="w-4 h-4" />, color: 'blue' },
    { label: t.platformSummary.searchImpressions, value: 8320, previousValue: 7890, icon: <Search className="w-4 h-4" />, color: 'purple' },
    { label: t.platformSummary.directions, value: 1260, previousValue: 1180, icon: <Navigation className="w-4 h-4" />, color: 'emerald' },
    { label: t.platformSummary.phone, value: 840, previousValue: 920, icon: <Phone className="w-4 h-4" />, color: 'amber' }
  ];

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
    <div className="mx-6 mb-6">
      {/* Main Card */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-b from-white to-stone-50">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-foreground">{t.common.summary}</h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                {t.locations.generalStatus}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t.locations.platformStatuses}</p>
        </div>

        <div className="p-6 bg-stone-50 space-y-4">
          {/* Top Row: Health + Engagement (2 columns) */}
          <div className="grid grid-cols-2 gap-6">
            <HealthCard platforms={stats.platforms} totalLocations={stats.totalLocations} businessStatus={stats.businessStatus} />
            <EngagementCard metrics={MOCK_ENGAGEMENT} />
          </div>

          {/* Bottom Row: Data Quality (full width) */}
          <DataQualityCard />
        </div>
      </div>
    </div>
  );
}

export default PlatformSummaryNew;
