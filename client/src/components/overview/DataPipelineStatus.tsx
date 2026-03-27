import { useState } from 'react';
import {
    CheckCircle, AlertTriangle, XCircle, RefreshCw, Clock,
    MapPin, ShoppingBag, Upload,
    TrendingUp, TrendingDown, Star, DollarSign, Eye,
    Activity, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { FaApple } from 'react-icons/fa';
import { useTranslation } from '@/contexts/LanguageContext';
import type { Metric } from '@/lib/types/common';
import type { OverviewData, PlatformConnection } from '@/lib/types/overview';
import type { OverviewFilterState } from '@/pages/overview';
import { fNumber, fPercent } from '@/lib/formatters';

// ─── Props ──────────────────────────────────────────────────
interface DataPipelineStatusProps {
    kpis?: OverviewData['kpis'];
    platforms?: PlatformConnection[];
    filters?: OverviewFilterState;
}

// ─── Types ──────────────────────────────────────────────────
type PipelineStatus = 'healthy' | 'warning' | 'error' | 'syncing';

interface KpiCard {
    id: string;
    title: string;
    tooltip: string;
    metric: Metric;
    format: 'multiplier' | 'number' | 'percent' | 'rating';
    icon: React.ReactNode;
    gradient: string;
    border: string;
    iconBadge: string;
}

interface ModuleConnection {
    id: string;
    name: string;
    icon: React.ReactNode;
    status: PipelineStatus;
    primaryStat: string;
    secondaryStat: string;
    platformSync: { name: string; status: PipelineStatus; detail: string }[];
}

// ─── Helpers ────────────────────────────────────────────────
const formatKpiValue = (m: Metric, f: KpiCard['format']): string => {
    switch (f) {
        case 'multiplier': return `${m.value.toFixed(1)}x`;
        case 'number':     return fNumber(m.value);
        case 'percent':    return fPercent(m.value);
        case 'rating':     return m.value.toFixed(1);
    }
};

const getStatusDot = (status: PipelineStatus) => {
    const color: Record<PipelineStatus, string> = {
        healthy: 'bg-emerald-500', warning: 'bg-amber-500',
        error: 'bg-red-500', syncing: 'bg-blue-500',
    };
    return (
        <span className="relative flex h-2 w-2">
            {(status === 'healthy' || status === 'syncing') && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color[status]} opacity-30`} />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${color[status]}`} />
        </span>
    );
};

const getStatusIcon = (status: PipelineStatus) => {
    switch (status) {
        case 'healthy': return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
        case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
        case 'error':   return <XCircle className="w-3.5 h-3.5 text-red-500" />;
        case 'syncing': return <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />;
    }
};

const getPlatformIcon = (name: string) => {
    switch (name.toLowerCase()) {
        case 'google':  return <SiGoogle className="w-3.5 h-3.5 text-[#4285F4]" />;
        case 'meta':    return <SiMeta className="w-3.5 h-3.5 text-[#0081FB]" />;
        case 'tiktok':  return <SiTiktok className="w-3.5 h-3.5 text-gray-900" />;
        case 'apple':   return <FaApple className="w-3.5 h-3.5 text-gray-800" />;
        default: return null;
    }
};

// ─── Fallback KPIs ──────────────────────────────────────────
const defaultKpis: KpiCard[] = [
    { id: 'roas',        title: 'Omni-ROAS',             tooltip: 'Combined online + offline return on ad spend across all platforms.',            metric: { value: 4.2, change: 12.5, past_value: 3.7 },      format: 'multiplier', icon: <DollarSign className="w-3.5 h-3.5 text-white" />, gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50', border: 'border-emerald-100', iconBadge: 'bg-emerald-500' },
    { id: 'interactions', title: 'Location Interactions', tooltip: 'Total GBP interactions — search views, direction requests, calls, and clicks.', metric: { value: 23847, change: 10.7, past_value: 20634 },   format: 'number',     icon: <MapPin className="w-3.5 h-3.5 text-white" />,     gradient: 'bg-gradient-to-br from-rose-50 to-pink-50',    border: 'border-rose-100',    iconBadge: 'bg-rose-500' },
    { id: 'inventory',    title: 'Local Product Impressions', tooltip: 'Total impressions on local product listings across Google Merchant Center.', metric: { value: 142847, change: 18.3, past_value: 120654 }, format: 'number',     icon: <Eye className="w-3.5 h-3.5 text-white" />,        gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',  border: 'border-blue-100',    iconBadge: 'bg-blue-500' },
    { id: 'rating',       title: 'Average Rating',        tooltip: 'Weighted average star rating across all locations on Google Business Profile.',  metric: { value: 4.3, change: 4.9, past_value: 4.1 },        format: 'rating',     icon: <Star className="w-3.5 h-3.5 text-white" />,       gradient: 'bg-gradient-to-br from-amber-50 to-yellow-50', border: 'border-amber-100',   iconBadge: 'bg-amber-500' },
];

// ─── Component ──────────────────────────────────────────────
export default function DataPipelineStatus({ kpis, platforms, filters }: DataPipelineStatusProps = {}) {
    const { t, language } = useTranslation();
    const db = t.dashboard as any;
    const en = language === 'en';
    const [connectionsExpanded, setConnectionsExpanded] = useState(true);

    // Resolve KPI cards
    const kpiTooltips = {
        roas:         db?.kpiRoasTooltip || (en ? 'Combined online + offline return on ad spend across all platforms.' : 'Tüm platformlarda online + offline reklam harcaması getirisi.'),
        interactions: db?.kpiInteractionsTooltip || (en ? 'Total GBP interactions — search views, direction requests, calls, and clicks.' : 'Toplam GBP etkileşimleri — arama görünümleri, yol tarifleri, aramalar ve tıklamalar.'),
        inventory:    db?.kpiInventoryTooltip || (en ? 'Total impressions on local product listings across Google Merchant Center.' : 'Google Merchant Center\'deki yerel ürün listelemelerinin toplam gösterimi.'),
        rating:       db?.kpiRatingTooltip || (en ? 'Weighted average star rating across all locations on Google Business Profile.' : 'Google İşletme Profili\'ndeki tüm lokasyonların ağırlıklı ortalama yıldız puanı.'),
    };

    const kpiCards: KpiCard[] = kpis ? [
        { id: 'roas',        title: db?.omniRoas || 'Omni-ROAS',                                tooltip: kpiTooltips.roas,         metric: kpis.o2oAttribution,   format: 'multiplier', icon: <DollarSign className="w-3.5 h-3.5 text-white" />, gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50', border: 'border-emerald-100', iconBadge: 'bg-emerald-500' },
        { id: 'interactions', title: db?.locationInteractions || 'Location Interactions',        tooltip: kpiTooltips.interactions,  metric: kpis.locationListings, format: 'number',     icon: <MapPin className="w-3.5 h-3.5 text-white" />,     gradient: 'bg-gradient-to-br from-rose-50 to-pink-50',    border: 'border-rose-100',    iconBadge: 'bg-rose-500' },
        { id: 'inventory',    title: db?.localProductImpressions || 'Local Product Impressions', tooltip: kpiTooltips.inventory,     metric: kpis.localInventory,   format: 'number',     icon: <Eye className="w-3.5 h-3.5 text-white" />,        gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',  border: 'border-blue-100',    iconBadge: 'bg-blue-500' },
        { id: 'rating',       title: db?.averageRating || 'Average Rating',                     tooltip: kpiTooltips.rating,        metric: kpis.reviewManagement, format: 'rating',     icon: <Star className="w-3.5 h-3.5 text-white" />,       gradient: 'bg-gradient-to-br from-amber-50 to-yellow-50', border: 'border-amber-100',   iconBadge: 'bg-amber-500' },
    ] : defaultKpis;

    // Module connections
    const pl = db?.pipeline as any;
    const connections: ModuleConnection[] = [
        {
            id: 'catalog',
            name: db?.catalog || 'Catalog',
            icon: <ShoppingBag className="w-4 h-4 text-gray-600" />,
            status: 'healthy',
            primaryStat: pl?.catalogSkus || '124,880 SKUs',
            secondaryStat: pl?.catalogStores || '52 stores covered',
            platformSync: [
                { name: 'Google', status: 'healthy', detail: pl?.catalogGoogleDetail || '124,760 published' },
                { name: 'Meta',   status: 'warning', detail: pl?.catalogMetaDetail || '124,500 published · 380 rejected' },
            ],
        },
        {
            id: 'offline-conversions',
            name: db?.offlineConversions || 'Offline Conversions',
            icon: <Upload className="w-4 h-4 text-gray-600" />,
            status: 'healthy',
            primaryStat: pl?.ocTransactions || '9,847 transactions',
            secondaryStat: pl?.ocBatch || 'Batch #9921 · 5 min ago',
            platformSync: [
                { name: 'Google', status: 'healthy', detail: pl?.ocGoogleDetail || 'Delivered · 5 min ago' },
                { name: 'Meta',   status: 'syncing', detail: pl?.ocMetaDetail || 'Syncing...' },
                { name: 'TikTok', status: 'healthy', detail: pl?.ocTiktokDetail || 'Delivered · 12 min ago' },
            ],
        },
        {
            id: 'locations',
            name: db?.locations || 'Locations',
            icon: <MapPin className="w-4 h-4 text-gray-600" />,
            status: 'warning',
            primaryStat: pl?.locCount || '30 locations',
            secondaryStat: pl?.locStatus || '28 live · 2 pending verification',
            platformSync: [
                { name: 'Google', status: 'healthy', detail: pl?.locGoogleDetail || '28/30 live' },
                { name: 'Meta',   status: 'healthy', detail: pl?.locMetaDetail || '26/30 published' },
                { name: 'Apple',  status: 'healthy', detail: pl?.locAppleDetail || '24/30 published' },
            ],
        },
    ];

    const healthyCount = connections.filter(c => c.status === 'healthy').length;

    return (
        <div className="vx-card">
            {/* Header */}
            <div className="vx-card-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <h3 className="text-sm font-semibold text-gray-900">
                            {db?.dataStreams || 'Data Streams & Performance'}
                        </h3>
                        <div className="relative group">
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                                {db?.dataStreamsTooltip || (en
                                    ? 'Real-time status of all data pipelines. KPIs show period-over-period changes across connected platforms.'
                                    : 'Tüm veri hatlarının anlık durumu. KPI\'lar bağlı platformlardaki dönemsel değişimleri gösterir.')}
                                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                            </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            healthyCount === connections.length ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                            {getStatusIcon(healthyCount === connections.length ? 'healthy' : 'warning')}
                            {healthyCount}/{connections.length} {db?.healthy || 'healthy'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {t.common.lastUpdate}: {t.common.now}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="vx-card-body vx-surface-muted space-y-4">
                {/* KPI metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {kpiCards.map((kpi) => {
                        const up = kpi.metric.change >= 0;
                        return (
                            <div key={kpi.id} className={`p-3.5 rounded-lg border ${kpi.gradient} ${kpi.border}`}>
                                <div className={`w-7 h-7 ${kpi.iconBadge} rounded-md flex items-center justify-center mb-2`}>
                                    {kpi.icon}
                                </div>
                                <div className="flex items-center gap-1 mb-0.5">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                        {kpi.title}
                                    </span>
                                    <div className="relative group/kpi">
                                        <Info className="w-3 h-3 text-gray-300 cursor-help" />
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-3 py-2 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg opacity-0 invisible group-hover/kpi:opacity-100 group-hover/kpi:visible transition-all duration-200 w-56 z-[9999]">
                                            {kpi.tooltip}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-gray-900">
                                        {formatKpiValue(kpi.metric, kpi.format)}
                                        {kpi.id === 'rating' && <span className="text-amber-400 ml-0.5 text-base">★</span>}
                                    </span>
                                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {up ? '+' : ''}{fPercent(Math.abs(kpi.metric.change))}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Data connection cards — collapsible */}
                <div>
                    <button
                        onClick={() => setConnectionsExpanded(prev => !prev)}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 py-1 px-2 -ml-2 rounded-md mb-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        {connectionsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {en ? 'Data Pipelines' : 'Veri Hatları'} ({connections.length})
                    </button>
                </div>
                {connectionsExpanded && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {connections.map((conn) => (
                        <div key={conn.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                            <div className="flex items-center gap-2.5 mb-3">
                                {getStatusDot(conn.status)}
                                <div className="p-1.5 bg-gray-50 rounded-md">{conn.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-900">{conn.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{conn.primaryStat}</div>
                                </div>
                            </div>

                            <div className="text-[11px] text-gray-500 mb-3 pl-[30px]">
                                {conn.secondaryStat}
                            </div>

                            <div className="space-y-1.5 border-t border-gray-100 pt-2.5">
                                {conn.platformSync.map((ps) => (
                                    <div key={ps.name} className="flex items-center gap-2 text-xs">
                                        {getPlatformIcon(ps.name)}
                                        <span className="text-gray-600 w-12 flex-shrink-0">{ps.name}</span>
                                        <span className="text-gray-500 flex-1 truncate" title={ps.detail}>{ps.detail}</span>
                                        {getStatusIcon(ps.status)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
}
