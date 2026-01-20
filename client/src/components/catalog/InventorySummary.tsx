import { useMemo } from "react";
import {
    ChevronRight,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Eye,
    Info,
    ShoppingCart,
    DollarSign,
    BarChart3
} from "lucide-react";
import { SiGoogle, SiMeta } from 'react-icons/si';

// --- Types ---

type PlatformKey = 'google' | 'meta';

interface SyncMetric {
    label: string;
    value: number;
    previousValue: number;
    icon: React.ReactNode;
    color: string;
}

interface PlatformSyncStats {
    live: number;
    pending: number;
    error: number;
    not_synced: number;
    total: number;
}

// --- Mock Data ---

const MOCK_SYNC_METRICS: SyncMetric[] = [
    { label: 'Günlük Sync', value: 12450, previousValue: 11200, icon: <RefreshCw className="w-4 h-4" />, color: 'blue' },
    { label: 'Ürün Gösterimi', value: 8320, previousValue: 7890, icon: <Eye className="w-4 h-4" />, color: 'purple' },
    { label: 'Reklam Tıklaması', value: 1260, previousValue: 1180, icon: <ShoppingCart className="w-4 h-4" />, color: 'emerald' },
    { label: 'Dönüşüm', value: 84, previousValue: 92, icon: <DollarSign className="w-4 h-4" />, color: 'amber' }
];

const PLATFORM_CONFIG: { key: PlatformKey; name: string; icon: React.ReactNode }[] = [
    { key: 'google', name: 'Google Merchant', icon: <SiGoogle className="w-3.5 h-3.5" /> },
    { key: 'meta', name: 'Meta Commerce', icon: <SiMeta className="w-3.5 h-3.5" /> }
];

// --- Utils ---

const formatNumber = (num: number): string =>
    num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : num.toString();

const calculateChange = (current: number, previous: number) => {
    const percent = Math.round(((current - previous) / previous) * 100);
    return { percent: Math.abs(percent), isPositive: percent >= 0 };
};

// --- Sub-Components ---

const InventoryStatsCard = ({
    stockStats,
    platforms
}: {
    stockStats: { inStock: number; lowStock: number; outOfStock: number; total: number };
    platforms: Record<PlatformKey, PlatformSyncStats>;
}) => {
    return (
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            {/* Stock Status - Top Half */}
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Stok Durumu</h4>
            <div className="grid grid-cols-4 gap-2 mb-5">
                <div className="p-2 bg-gray-50 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-900">{stockStats.total}</div>
                    <div className="text-[10px] text-gray-500">Toplam SKU</div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg text-center">
                    <div className="text-xl font-bold text-emerald-600">{stockStats.inStock}</div>
                    <div className="text-[10px] text-gray-500">Stokta</div>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg text-center">
                    <div className="text-xl font-bold text-amber-600">{stockStats.lowStock}</div>
                    <div className="text-[10px] text-gray-500">Düşük Stok</div>
                </div>
                <div className="p-2 bg-rose-50 rounded-lg text-center">
                    <div className="text-xl font-bold text-rose-600">{stockStats.outOfStock}</div>
                    <div className="text-[10px] text-gray-500">Tükendi</div>
                </div>
            </div>

            {/* Platform Sync - Bottom Half */}
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Platform Senkronizasyonu</h4>
            <div className="space-y-2">
                {PLATFORM_CONFIG.map(({ key, name, icon }) => {
                    const p = platforms[key];
                    const percentage = p.total > 0 ? Math.round((p.live / p.total) * 100) : 0;
                    const barColor = percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500';

                    return (
                        <div key={key} className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-2 text-gray-600 w-32">
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

const SyncMetricsCard = ({ metrics }: { metrics: SyncMetric[] }) => (
    <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-gray-700">Sync Performansı</h4>
                <div className="relative group">
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                        Google Merchant ve Meta Commerce verileri
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                </div>
            </div>
            <span className="text-xs text-gray-400">Son 24 saat</span>
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
            Detaylı rapor <ChevronRight className="w-3 h-3" />
        </button>
    </div>
);

// Data Quality Categories for Inventory
const DATA_QUALITY_CATEGORIES = [
    {
        category: 'Ürün Bilgisi',
        items: [
            { label: 'Başlık', value: 95, count: '120/126' },
            { label: 'Açıklama', value: 82, count: '103/126' },
            { label: 'Kategori', value: 94, count: '118/126' },
        ]
    },
    {
        category: 'Fiyat & Stok',
        items: [
            { label: 'Fiyat', value: 100, count: '126/126' },
            { label: 'Stok Adedi', value: 100, count: '126/126' },
            { label: 'SKU', value: 98, count: '124/126' },
        ]
    },
    {
        category: 'Görsel & Kimlik',
        items: [
            { label: 'Fotoğraf', value: 78, count: '98/126' },
            { label: 'GTIN/Barkod', value: 65, count: '82/126' },
            { label: 'Marka', value: 89, count: '112/126' },
        ]
    }
];

const ENRICHMENT_SUGGESTIONS = [
    { label: '28 üründe fotoğraf eksik', priority: 'high', action: 'Ekle' },
    { label: '44 üründe GTIN eksik', priority: 'medium', action: 'Güncelle' },
    { label: '14 üründe marka eksik', priority: 'low', action: 'Ekle' },
];

const DataQualityCard = () => {
    const allItems = DATA_QUALITY_CATEGORIES.flatMap(c => c.items);
    const overallScore = Math.round(allItems.reduce((sum, item) => sum + item.value, 0) / allItems.length);
    const scoreColor = overallScore >= 80 ? 'emerald' : overallScore >= 60 ? 'amber' : 'rose';

    return (
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <h4 className="text-sm font-semibold text-gray-700">Veri Kalitesi</h4>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold bg-${scoreColor}-100 text-${scoreColor}-700`}>
                        {overallScore}%
                    </div>
                </div>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Tümünü gör <ChevronRight className="w-3 h-3" />
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
                <h5 className="text-xs font-medium text-gray-500 mb-3">Zenginleştirme Önerileri</h5>
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

// --- Main Component ---

export default function InventorySummary() {
    // Mock computed stats
    const stockStats = useMemo(() => ({
        total: 126,
        inStock: 89,
        lowStock: 23,
        outOfStock: 14
    }), []);

    const platformStats = useMemo(() => ({
        google: { live: 112, pending: 8, error: 4, not_synced: 2, total: 126 },
        meta: { live: 98, pending: 15, error: 8, not_synced: 5, total: 126 }
    }), []);

    return (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-b from-white to-stone-50">
                <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-semibold text-foreground">Özet</h3>
                    <div className="relative group">
                        <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                            Envanter ve platform senkronizasyon özetiniz
                            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Stok durumu, sync performansı ve veri kalitesine genel bakış</p>
            </div>

            {/* Card Content */}
            <div className="p-6 bg-stone-50 space-y-4">
                {/* Top Row: 50/50 - Stok Durumu + Sync Performansı */}
                <div className="grid grid-cols-2 gap-6">
                    <InventoryStatsCard
                        stockStats={stockStats}
                        platforms={platformStats}
                    />
                    <SyncMetricsCard metrics={MOCK_SYNC_METRICS} />
                </div>

                {/* Bottom Row: Full Width - Veri Kalitesi */}
                <DataQualityCard />
            </div>
        </div>
    );
}

