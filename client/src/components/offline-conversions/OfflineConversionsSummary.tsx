import { useMemo } from 'react';
import {
    Info,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    Store,
    ShoppingCart,
    ChevronRight,
    Zap
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';

// --- Types ---

interface ConversionMetric {
    label: string;
    value: number;
    previousValue: number;
    icon: React.ReactNode;
    color: string;
}

interface PlatformAttribution {
    key: string;
    name: string;
    icon: React.ReactNode;
    revenue: number;
    conversions: number;
    roas: number;
}

// --- Mock Data ---

const MOCK_CONVERSIONS: ConversionMetric[] = [
    { label: 'Toplam Gelir', value: 2847500, previousValue: 2234100, icon: <DollarSign className="w-4 h-4" />, color: 'blue' },
    { label: 'ROAS', value: 4.23, previousValue: 3.87, icon: <Target className="w-4 h-4" />, color: 'emerald' },
    { label: 'Dönüşümler', value: 1847, previousValue: 1623, icon: <ShoppingCart className="w-4 h-4" />, color: 'purple' },
    { label: 'Aktif Mağaza', value: 42, previousValue: 38, icon: <Store className="w-4 h-4" />, color: 'amber' }
];

const PLATFORM_ATTRIBUTION: PlatformAttribution[] = [
    { key: 'google', name: 'Google Ads', icon: <SiGoogle className="w-3.5 h-3.5" />, revenue: 1247800, conversions: 672, roas: 5.36 },
    { key: 'meta', name: 'Meta Ads', icon: <SiMeta className="w-3.5 h-3.5" />, revenue: 998600, conversions: 534, roas: 4.99 },
    { key: 'tiktok', name: 'TikTok Ads', icon: <SiTiktok className="w-3.5 h-3.5" />, revenue: 387200, conversions: 221, roas: 3.67 }
];

const TOP_STORES = [
    { name: 'Istanbul Zorlu', revenue: 487200, conversions: 142, rate: 3.8 },
    { name: 'Ankara Ankamall', revenue: 356800, conversions: 124, rate: 3.2 },
    { name: 'Izmir Optimum', revenue: 298600, conversions: 96, rate: 2.9 }
];

// --- Utils ---

const formatNumber = (num: number): string =>
    num >= 1000000 ? (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' :
        num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K' :
            num.toString();

const formatCurrency = (num: number): string =>
    '₺' + formatNumber(num);

const calculateChange = (current: number, previous: number) => {
    const percent = Math.round(((current - previous) / previous) * 100);
    return { percent: Math.abs(percent), isPositive: percent >= 0 };
};

// --- Sub-Components ---

const MetricsCard = ({ metrics }: { metrics: ConversionMetric[] }) => (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-gray-700">Dönüşüm Metrikleri</h4>
                <div className="relative group">
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                        Dijital reklamlardan mağaza satışlarına atfedilen metrikler.
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                </div>
            </div>
            <span className="text-xs text-gray-400">Son 30 gün</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => {
                const change = calculateChange(metric.value, metric.previousValue);
                const displayValue = metric.label === 'ROAS'
                    ? `${metric.value.toFixed(2)}:1`
                    : metric.label === 'Toplam Gelir'
                        ? formatCurrency(metric.value)
                        : formatNumber(metric.value);

                return (
                    <div key={metric.label} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`text-${metric.color}-500`}>{metric.icon}</div>
                            <span className="text-xs text-gray-500">{metric.label}</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-xl font-bold text-gray-900">{displayValue}</span>
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
            Detaylı rapor <ChevronRight className="w-3 h-3" />
        </button>
    </div>
);

const PlatformCard = ({ platforms }: { platforms: PlatformAttribution[] }) => {
    const totalRevenue = platforms.reduce((sum, p) => sum + p.revenue, 0);

    return (
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Platform Atfı</h4>

            <div className="space-y-3 mb-4">
                {platforms.map((platform) => {
                    const percentage = Math.round((platform.revenue / totalRevenue) * 100);
                    const barColor = platform.roas >= 5 ? 'bg-emerald-500' : platform.roas >= 4 ? 'bg-blue-500' : 'bg-amber-500';

                    return (
                        <div key={platform.key} className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-2 text-gray-600 w-24">
                                {platform.icon}
                                <span>{platform.name}</span>
                            </div>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
                            </div>
                            <div className="text-right w-20">
                                <span className="font-medium text-gray-900">{formatCurrency(platform.revenue)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                {platforms.map((p) => (
                    <div key={p.key} className="text-center">
                        <div className={`text-sm font-bold ${p.roas >= 5 ? 'text-emerald-600' : p.roas >= 4 ? 'text-blue-600' : 'text-amber-600'}`}>
                            {p.roas.toFixed(2)}:1
                        </div>
                        <div className="text-[10px] text-gray-500">ROAS</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TopStoresCard = ({ stores }: { stores: typeof TOP_STORES }) => (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-700">En İyi Mağazalar</h4>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Tümünü gör <ChevronRight className="w-3 h-3" />
            </button>
        </div>

        <div className="space-y-3">
            {stores.map((store, index) => (
                <div key={store.name} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' :
                            index === 1 ? 'bg-gray-100 text-gray-600' :
                                'bg-orange-100 text-orange-700'
                        }`}>
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{store.name}</div>
                        <div className="text-xs text-gray-500">{store.conversions} dönüşüm</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{formatCurrency(store.revenue)}</div>
                        <div className="text-xs text-emerald-600">{store.rate}% oran</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const InsightsCard = () => {
    const insights = [
        { label: 'Akşam saatleri %23 daha yüksek dönüşüm gösteriyor', priority: 'high', action: 'Bütçe Kaydır' },
        { label: 'Cumartesi geliri ortalamanın %22 üzerinde', priority: 'medium', action: 'Kampanya Planla' },
        { label: 'TikTok ROAS hedefin altında (3.67:1)', priority: 'low', action: 'Optimize Et' }
    ];

    return (
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-semibold text-gray-700">Akıllı Öneriler</h4>
            </div>

            <div className="flex flex-wrap gap-2">
                {insights.map(({ label, priority, action }) => (
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
    );
};

// --- Main Component ---

export default function OfflineConversionsSummary() {
    return (
        <div className="mx-6 mb-6">
            {/* Main Card */}
            <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-b from-white to-stone-50">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-semibold text-foreground">Özet</h3>
                        <div className="relative group">
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                                Dijital reklamlardan mağaza satışlarına atfedilen dönüşümlerin özeti.
                                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Offline dönüşüm metrikleri, platform atfı ve mağaza performansına genel bakış</p>
                </div>

                {/* Content */}
                <div className="p-6 bg-stone-50 space-y-4">
                    {/* Top Row: Metrics + Platform (2 columns) */}
                    <div className="grid grid-cols-2 gap-6">
                        <MetricsCard metrics={MOCK_CONVERSIONS} />
                        <PlatformCard platforms={PLATFORM_ATTRIBUTION} />
                    </div>

                    {/* Bottom Row: Top Stores + Insights */}
                    <div className="grid grid-cols-2 gap-6">
                        <TopStoresCard stores={TOP_STORES} />
                        <InsightsCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
