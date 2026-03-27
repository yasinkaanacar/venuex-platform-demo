import { useState } from 'react';
import {
    CheckCircle, AlertTriangle, XCircle, RefreshCw, Clock,
    MapPin, ShoppingBag, Upload,
    TrendingUp, TrendingDown, Star, DollarSign, Eye,
    Activity, Info, X
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { FaApple } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/contexts/LanguageContext';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { showToast } from '@/lib/toast';
import { apiRequest } from '@/lib/queryClient';
import type { Metric } from '@/lib/types/common';
import type { OverviewData, PlatformConnection, AlertItem } from '@/lib/types/overview';
import type { OverviewFilterState } from '@/pages/overview';
import { fNumber, fPercent } from '@/lib/formatters';

// ─── Props ──────────────────────────────────────────────────
interface DataPipelineStatusProps {
    kpis?: OverviewData['kpis'];
    platforms?: PlatformConnection[];
    alerts?: AlertItem[];
    filters?: OverviewFilterState;
}

// ─── Types ──────────────────────────────────────────────────
type PipelineStatus = 'healthy' | 'warning' | 'error' | 'syncing';

interface KpiCard {
    id: string;
    title: string;
    metric: Metric;
    format: 'multiplier' | 'number' | 'percent' | 'rating';
    icon: React.ReactNode;
    /** Gradient bg for the card itself */
    gradient: string;
    /** Border color matching the gradient */
    border: string;
    /** Solid bg for the icon badge */
    iconBadge: string;
}

interface ModuleConnection {
    id: string;
    name: string;
    icon: React.ReactNode;
    status: PipelineStatus;
    /** Primary count line, e.g. "124,880 SKUs" */
    primaryStat: string;
    /** Secondary info, e.g. "52 stores" or "28/30 active" */
    secondaryStat: string;
    /** Per-platform sync rows */
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
    { id: 'roas',        title: 'Omni-ROAS',                metric: { value: 4.2, change: 12.5, past_value: 3.7 },      format: 'multiplier', icon: <DollarSign className="w-3.5 h-3.5 text-white" />, gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50', border: 'border-emerald-100', iconBadge: 'bg-emerald-500' },
    { id: 'interactions', title: 'Location Interactions',    metric: { value: 23847, change: 10.7, past_value: 20634 },   format: 'number',     icon: <MapPin className="w-3.5 h-3.5 text-white" />,     gradient: 'bg-gradient-to-br from-rose-50 to-pink-50',    border: 'border-rose-100',    iconBadge: 'bg-rose-500' },
    { id: 'catalog',      title: 'Catalog Coverage',           metric: { value: 87.5, change: 5.3, past_value: 82.2 },     format: 'percent',    icon: <Eye className="w-3.5 h-3.5 text-white" />,        gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',  border: 'border-blue-100',    iconBadge: 'bg-blue-500' },
    { id: 'rating',       title: 'Average Rating',           metric: { value: 4.3, change: 4.9, past_value: 4.1 },        format: 'rating',     icon: <Star className="w-3.5 h-3.5 text-white" />,       gradient: 'bg-gradient-to-br from-amber-50 to-yellow-50', border: 'border-amber-100',   iconBadge: 'bg-amber-500' },
];

// ─── Component ──────────────────────────────────────────────
const alertSeverityConfig: Record<string, { icon: React.ReactNode; bg: string; border: string; text: string }> = {
    error:   { icon: <XCircle className="w-3.5 h-3.5 text-red-500" />,   bg: 'bg-red-50',   border: 'border-red-100',   text: 'text-red-800' },
    warning: { icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />, bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-800' },
    info:    { icon: <Info className="w-3.5 h-3.5 text-blue-500" />,    bg: 'bg-blue-50',  border: 'border-blue-100',  text: 'text-blue-800' },
};

function formatRelativeTime(timestamp: Date, en: boolean): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return en ? 'Just now' : 'Az önce';
    if (diffMins < 60) return en ? `${diffMins}m ago` : `${diffMins}dk önce`;
    if (diffHours < 24) return en ? `${diffHours}h ago` : `${diffHours}sa önce`;
    return en ? `${diffDays}d ago` : `${diffDays}g önce`;
}

export default function DataPipelineStatus({ kpis, platforms, alerts = [], filters }: DataPipelineStatusProps = {}) {
    const { t, language } = useTranslation();
    const db = t.dashboard as any;
    const en = language === 'en';
    const queryClient = useQueryClient();
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    const visibleAlerts = alerts.filter(a => !a.isRead && !dismissedIds.has(a.id));

    const handleDismiss = async (alertId: string) => {
        setDismissedIds(prev => new Set(prev).add(alertId));
        try {
            await apiRequest('DELETE', `/api/alerts/${alertId}`);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OVERVIEW] });
        } catch {
            setDismissedIds(prev => {
                const next = new Set(prev);
                next.delete(alertId);
                return next;
            });
            showToast({ type: 'error', title: en ? 'Failed to dismiss' : 'Kapatılamadı' });
        }
    };

    // Resolve KPI cards
    const kpiCards: KpiCard[] = kpis ? [
        { id: 'roas',        title: db?.omniRoas || 'Omni-ROAS',                                metric: kpis.o2oAttribution,   format: 'multiplier', icon: <DollarSign className="w-3.5 h-3.5 text-white" />, gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50', border: 'border-emerald-100', iconBadge: 'bg-emerald-500' },
        { id: 'interactions', title: db?.locationInteractions || 'Location Interactions',        metric: kpis.locationListings, format: 'number',     icon: <MapPin className="w-3.5 h-3.5 text-white" />,     gradient: 'bg-gradient-to-br from-rose-50 to-pink-50',    border: 'border-rose-100',    iconBadge: 'bg-rose-500' },
        { id: 'catalog',      title: db?.catalogCoverage || 'Catalog Coverage',                 metric: kpis.localInventory,   format: 'percent',    icon: <Eye className="w-3.5 h-3.5 text-white" />,        gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',  border: 'border-blue-100',    iconBadge: 'bg-blue-500' },
        { id: 'rating',       title: db?.averageRating || 'Average Rating',                     metric: kpis.reviewManagement, format: 'rating',     icon: <Star className="w-3.5 h-3.5 text-white" />,       gradient: 'bg-gradient-to-br from-amber-50 to-yellow-50', border: 'border-amber-100',   iconBadge: 'bg-amber-500' },
    ] : defaultKpis;

    // Module connections — each reflects how the actual module page works
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
                                <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-0.5">
                                    {kpi.title}
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

                {/* Data connection cards */}
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
                                        <span className="text-gray-500 flex-1 truncate">{ps.detail}</span>
                                        {getStatusIcon(ps.status)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Inline alerts */}
                {visibleAlerts.length > 0 && (
                    <div className="space-y-2">
                        {visibleAlerts.map((alert) => {
                            const cfg = alertSeverityConfig[alert.type] || alertSeverityConfig.info;
                            return (
                                <div key={alert.id} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border ${cfg.border} ${cfg.bg}`}>
                                    {cfg.icon}
                                    <div className="flex-1 min-w-0">
                                        <span className={`text-xs font-medium ${cfg.text}`}>{alert.title}</span>
                                        <span className="text-xs text-gray-500 ml-2">{alert.message}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 flex-shrink-0">{formatRelativeTime(alert.timestamp, en)}</span>
                                    <button
                                        onClick={() => handleDismiss(alert.id)}
                                        className="p-0.5 hover:bg-white/60 rounded transition-colors flex-shrink-0"
                                    >
                                        <X className="w-3.5 h-3.5 text-gray-400" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
