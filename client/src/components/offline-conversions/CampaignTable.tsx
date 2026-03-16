import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    ChevronDown,
    ChevronRight,
    ArrowUpDown,
    Search,
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart3,
    Clock,
    Target,
    SlidersHorizontal,
    RotateCcw,
    Info,
    Download
} from 'lucide-react';
import { SiGoogle, SiTiktok } from 'react-icons/si';
import {
    mockCampaigns,
    Campaign,
    Platform,
    CampaignStatus,
    CAMPAIGN_TYPE_LABELS,
    calcOfflineROAS,
    calcCostPerConversion,
    calcOnlineCostPerConversion,
    calcOnlineROAS,
    calcOmniROAS,
    calcAvgBasketSize,
    calcConversionRate,
    calcCTR,
    calcCPC,
    calcCPM,
    calcTotalRevenue
} from '@/lib/mock/campaigns';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

// ─── Types ───────────────────────────────────────────────────────────

type SortDirection = 'asc' | 'desc';
type ColumnGroup = 'core' | 'offline' | 'online' | 'omnichannel' | 'traffic' | 'diagnostic';

interface ColumnDef {
    id: string;
    labelEn: string;
    labelTr: string;
    group: ColumnGroup;
    align: 'left' | 'right';
    sortable: boolean;
    isHero?: boolean;
    alwaysVisible?: boolean;
    format: 'currency' | 'number' | 'percent' | 'roas' | 'text';
    getValue: (item: any) => number | string;
}

// ─── Column Definitions ──────────────────────────────────────────────

const ALL_COLUMNS: ColumnDef[] = [
    // Core
    { id: 'platform', labelEn: 'Platform', labelTr: 'Platform', group: 'core', align: 'left', sortable: false, format: 'text', getValue: (i) => i.platform },
    { id: 'type', labelEn: 'Type', labelTr: 'Tip', group: 'core', align: 'left', sortable: false, format: 'text', getValue: (i) => i.campaignType },
    { id: 'spend', labelEn: 'Spend', labelTr: 'Harcama', group: 'core', align: 'right', sortable: true, format: 'currency', getValue: (i) => i.spend },
    // Offline Attribution
    { id: 'offlineConv', labelEn: 'Offline Conv.', labelTr: 'Offline Dönüşüm', group: 'offline', align: 'right', sortable: true, format: 'number', getValue: (i) => i.offlineConversions },
    { id: 'offlineRevenue', labelEn: 'Offline Revenue', labelTr: 'Offline Gelir', group: 'offline', align: 'right', sortable: true, format: 'currency', getValue: (i) => i.offlineRevenue },
    { id: 'offlineROAS', labelEn: 'Offline ROAS', labelTr: 'Offline ROAS', group: 'offline', align: 'right', sortable: true, isHero: true, alwaysVisible: true, format: 'roas', getValue: (i) => calcOfflineROAS(i) },
    { id: 'offlineCostPerConv', labelEn: 'Cost / Offline Conv.', labelTr: 'Maliyet / Offline Dön.', group: 'offline', align: 'right', sortable: true, format: 'currency', getValue: (i) => calcCostPerConversion(i) },
    { id: 'avgBasket', labelEn: 'Avg. Basket', labelTr: 'Ort. Sepet', group: 'offline', align: 'right', sortable: true, format: 'currency', getValue: (i) => calcAvgBasketSize(i) },
    { id: 'convRate', labelEn: 'Conv. Rate', labelTr: 'Dönüşüm Oranı', group: 'offline', align: 'right', sortable: true, format: 'percent', getValue: (i) => calcConversionRate(i) },
    // Online
    { id: 'onlineConv', labelEn: 'Online Conv.', labelTr: 'Online Dönüşüm', group: 'online', align: 'right', sortable: true, format: 'number', getValue: (i) => i.onlineConversions },
    { id: 'onlineRevenue', labelEn: 'Online Revenue', labelTr: 'Online Gelir', group: 'online', align: 'right', sortable: true, format: 'currency', getValue: (i) => i.onlineRevenue || 0 },
    { id: 'onlineROAS', labelEn: 'Online ROAS', labelTr: 'Online ROAS', group: 'online', align: 'right', sortable: true, format: 'roas', getValue: (i) => calcOnlineROAS(i) },
    { id: 'onlineCostPerConv', labelEn: 'Cost / Online Conv.', labelTr: 'Maliyet / Online Dön.', group: 'online', align: 'right', sortable: true, format: 'currency', getValue: (i) => calcOnlineCostPerConversion(i) },
    // Omnichannel
    { id: 'omniROAS', labelEn: 'Omni ROAS', labelTr: 'Omni ROAS', group: 'omnichannel', align: 'right', sortable: true, format: 'roas', getValue: (i) => calcOmniROAS(i) },
    { id: 'totalRevenue', labelEn: 'Total Revenue', labelTr: 'Toplam Gelir', group: 'omnichannel', align: 'right', sortable: true, format: 'currency', getValue: (i) => calcTotalRevenue(i) },
    // Traffic
    { id: 'impressions', labelEn: 'Impressions', labelTr: 'Gösterimler', group: 'traffic', align: 'right', sortable: true, format: 'number', getValue: (i) => i.impressions },
    { id: 'clicks', labelEn: 'Clicks', labelTr: 'Tıklamalar', group: 'traffic', align: 'right', sortable: true, format: 'number', getValue: (i) => i.clicks },
    { id: 'ctr', labelEn: 'CTR', labelTr: 'TO', group: 'traffic', align: 'right', sortable: true, format: 'percent', getValue: (i) => calcCTR(i) },
    { id: 'cpc', labelEn: 'CPC', labelTr: 'TBM', group: 'traffic', align: 'right', sortable: true, format: 'currency', getValue: (i) => calcCPC(i) },
    { id: 'cpm', labelEn: 'CPM', labelTr: 'BGBM', group: 'traffic', align: 'right', sortable: true, format: 'currency', getValue: (i) => calcCPM(i) },
    { id: 'storeVisits', labelEn: 'Store Visits', labelTr: 'Mağaza Ziyaretleri', group: 'traffic', align: 'right', sortable: true, format: 'number', getValue: (i) => i.storeVisits || 0 },
];

const DEFAULT_CAMPAIGN_COLS = new Set(['platform', 'type', 'spend', 'offlineConv', 'offlineRevenue', 'offlineROAS', 'offlineCostPerConv', 'onlineConv', 'onlineRevenue', 'onlineROAS']);

const COLUMN_GROUPS: ColumnGroup[] = ['core', 'offline', 'online', 'omnichannel', 'traffic', 'diagnostic'];
const GROUP_LABELS: Record<ColumnGroup, { en: string; tr: string }> = {
    core: { en: 'Core', tr: 'Temel' },
    offline: { en: 'Offline Attribution', tr: 'Offline İlişkilendirme' },
    online: { en: 'Online Metrics', tr: 'Online Metrikler' },
    omnichannel: { en: 'Omnichannel', tr: 'Omnichannel' },
    traffic: { en: 'Traffic', tr: 'Trafik' },
    diagnostic: { en: 'Diagnostic', tr: 'Diagnostik' },
};

// ─── Format Helpers ──────────────────────────────────────────────────

const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `₺${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₺${Math.round(amount / 1000)}K`;
    return `₺${Math.round(amount)}`;
};

const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString('tr-TR');
};

const formatTimeAgo = (date: Date, lang: 'en' | 'tr') => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHours < 1) return lang === 'en' ? 'Just now' : 'Az önce';
    if (diffHours < 24) return lang === 'en' ? `${diffHours}h ago` : `${diffHours} sa önce`;
    if (diffDays < 7) return lang === 'en' ? `${diffDays}d ago` : `${diffDays} gün önce`;
    return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric' });
};

// ─── Small Components ────────────────────────────────────────────────

const PlatformIcon = ({ platform }: { platform: Platform }) => {
    switch (platform) {
        case 'google':
            return <div className="w-6 h-6 bg-[#EA4335] rounded flex items-center justify-center flex-shrink-0"><SiGoogle className="w-3 h-3 text-white" /></div>;
        case 'meta':
            return <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0"><span className="text-xs text-white font-bold">f</span></div>;
        case 'tiktok':
            return <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0"><SiTiktok className="w-3.5 h-3.5 text-white" /></div>;
    }
};

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    switch (trend) {
        case 'up': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
        case 'down': return <TrendingDown className="w-4 h-4 text-rose-500" />;
        default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
};

const StatusBadge = ({ status, lang }: { status: CampaignStatus; lang: 'en' | 'tr' }) => {
    const config = {
        active: { dot: 'bg-emerald-500', label: lang === 'en' ? 'Active' : 'Aktif' },
        paused: { dot: 'bg-amber-500', label: lang === 'en' ? 'Paused' : 'Duraklatıldı' },
        ended: { dot: 'bg-gray-400', label: lang === 'en' ? 'Ended' : 'Sona Erdi' },
    };
    const { dot, label } = config[status];
    return (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
};

const getROASStyle = (roas: number) => {
    if (roas >= 4) return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    if (roas >= 2) return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-rose-700 bg-rose-100 border-rose-200';
};

// ─── Main Component ──────────────────────────────────────────────────

interface CampaignTableProps {
    filters: { platforms: string[]; campaignTypes: string[]; activeOnly?: boolean };
    onActiveOnlyChange?: (value: boolean) => void;
}

export default function CampaignTable({ filters, onActiveOnlyChange }: CampaignTableProps) {
    const { t, language } = useTranslation();
    const lang = language as 'en' | 'tr';
    const ct = (key: string, fallbackEn: string, fallbackTr: string) => {
        const val = (t.offlineConversions as any)?.campaignTable?.[key];
        return val || (lang === 'en' ? fallbackEn : fallbackTr);
    };

    // Table state
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [sortColumnId, setSortColumnId] = useState<string>('offlineROAS');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const activeOnly = filters.activeOnly ?? false;
    const setActiveOnly = (v: boolean) => onActiveOnlyChange?.(v);

    // Column visibility
    const [campaignCols, setCampaignCols] = useState<Set<string>>(new Set(DEFAULT_CAMPAIGN_COLS));

    const visibleColumns = useMemo(() => ALL_COLUMNS.filter(c => campaignCols.has(c.id)), [campaignCols]);
    const totalColSpan = visibleColumns.length + 2; // +2 for expand chevron + name

    const toggleRow = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleSort = (columnId: string) => {
        if (sortColumnId === columnId) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumnId(columnId);
            setSortDirection('desc');
        }
    };

    // Generic sort
    const getSortValue = (item: any, columnId: string): number | string => {
        if (columnId === 'name') return item.name;
        const col = ALL_COLUMNS.find(c => c.id === columnId);
        return col ? col.getValue(item) : 0;
    };

    const sortItems = <T,>(items: T[]): T[] => {
        return [...items].sort((a, b) => {
            const aVal = getSortValue(a, sortColumnId);
            const bVal = getSortValue(b, sortColumnId);
            if (typeof aVal === 'string') return sortDirection === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
            return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
        });
    };

    // Filtered + sorted data
    const filteredCampaigns = useMemo(() => {
        let result = [...mockCampaigns];
        if (filters.platforms.length > 0) result = result.filter(c => filters.platforms.includes(c.platform));
        if (filters.campaignTypes.length > 0) result = result.filter(c => filters.campaignTypes.includes(c.campaignType));
        if (activeOnly) result = result.filter(c => c.status === 'active');
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(c => c.name.toLowerCase().includes(q));
        }
        return sortItems(result);
    }, [filters.platforms, filters.campaignTypes, activeOnly, searchQuery, sortColumnId, sortDirection]);

    // ─── Cell Rendering ──────────────────────────────────────────────

    const renderCell = (col: ColumnDef, item: any): React.ReactNode => {
        const value = col.getValue(item);

        // Special column rendering
        if (col.id === 'platform') {
            const p = value as Platform;
            return (
                <div className="flex items-center gap-2">
                    <PlatformIcon platform={p} />
                    <span className="text-sm text-gray-600 capitalize">{p}</span>
                </div>
            );
        }
        if (col.id === 'type') {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {CAMPAIGN_TYPE_LABELS[value as string] || value}
                </span>
            );
        }
        if (col.id === 'storeVisits') {
            return value ? <span className="font-medium text-[#EA4335]">{formatNumber(value as number)}</span> : <span className="text-gray-400">—</span>;
        }
        if (col.id === 'matchRate') {
            const rate = value as number;
            return <span className={`font-medium ${rate >= 70 ? 'text-emerald-600' : rate >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{rate.toFixed(1)}%</span>;
        }
        if (col.id === 'offlineRevenue') {
            return <span className="font-medium text-blue-600">{formatCurrency(value as number)}</span>;
        }
        if (col.id === 'frequency') {
            return <span className="font-medium text-gray-900">{(value as number).toFixed(1)}</span>;
        }

        // Format-based rendering
        switch (col.format) {
            case 'currency':
                return <span className="font-medium text-gray-900">{formatCurrency(value as number)}</span>;
            case 'number':
                return <span className="font-medium text-gray-900">{formatNumber(value as number)}</span>;
            case 'percent':
                return <span className="text-gray-600">{(value as number).toFixed(2)}%</span>;
            case 'roas': {
                const roas = value as number;
                return (
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-base font-bold border ${getROASStyle(roas)}`}>
                        {roas.toFixed(1)}x
                    </span>
                );
            }
            default:
                return <span className="text-gray-600">{String(value)}</span>;
        }
    };

    // Shared data column headers
    const renderDataHeaders = () =>
        visibleColumns.map(col =>
            col.sortable ? (
                <th
                    key={col.id}
                    className={cn(
                        'px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap',
                        col.align === 'left' ? 'text-left' : 'text-right',
                        col.isHero ? 'bg-emerald-50/50 text-emerald-700 font-bold' : 'text-gray-600'
                    )}
                    onClick={() => handleSort(col.id)}
                >
                    <div className={cn('flex items-center gap-1', col.align === 'left' ? 'justify-start' : 'justify-end')}>
                        {lang === 'en' ? col.labelEn : col.labelTr}
                        <ArrowUpDown className={cn('w-3 h-3', sortColumnId === col.id ? (col.isHero ? 'text-emerald-600' : 'text-blue-600') : 'text-gray-400')} />
                    </div>
                </th>
            ) : (
                <th
                    key={col.id}
                    className={cn(
                        'px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap',
                        col.align === 'left' ? 'text-left' : 'text-right',
                        col.isHero ? 'bg-emerald-50/50 text-emerald-700 font-bold' : 'text-gray-600'
                    )}
                >
                    {lang === 'en' ? col.labelEn : col.labelTr}
                </th>
            )
        );

    // Shared data column cells
    const renderDataCells = (item: any) =>
        visibleColumns.map(col => (
            <td
                key={col.id}
                className={cn(
                    'px-4 py-4 text-sm',
                    col.align === 'right' ? 'text-right' : 'text-left',
                    col.isHero && 'bg-emerald-50/30'
                )}
            >
                {renderCell(col, item)}
            </td>
        ));

    // ─── CSV Export ────────────────────────────────────────────────────

    const handleExportCSV = () => {
        const cols = visibleColumns;
        const header = [
            lang === 'en' ? 'Campaign' : 'Kampanya',
            lang === 'en' ? 'Status' : 'Durum',
            ...cols.map(c => lang === 'en' ? c.labelEn : c.labelTr),
        ];

        const rows = filteredCampaigns.map((c: Campaign) => [
            c.name,
            c.status,
            ...cols.map(col => {
                const val = col.getValue(c);
                if (typeof val === 'number') {
                    if (col.format === 'percent') return `${val.toFixed(2)}%`;
                    if (col.format === 'roas') return `${val.toFixed(2)}x`;
                    return val.toFixed(2);
                }
                return String(val);
            }),
        ]);

        const csvContent = [header, ...rows]
            .map(row => row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `campaign-report-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // ─── Column Customizer ───────────────────────────────────────────

    const [colMenuOpen, setColMenuOpen] = useState(false);
    const colMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!colMenuOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) {
                setColMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [colMenuOpen]);

    const columnCustomizerJSX = (
        <div className="relative" ref={colMenuRef}>
            <button
                onClick={() => setColMenuOpen(prev => !prev)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
                <SlidersHorizontal className="w-4 h-4" />
                {ct('columns', 'Columns', 'Sütunlar')} ({visibleColumns.length})
            </button>
            {colMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-3 px-4 w-[520px]">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                        {COLUMN_GROUPS.map(group => {
                            const groupCols = ALL_COLUMNS.filter(c => c.group === group);
                            if (groupCols.length === 0) return null;
                            return (
                                <div key={group} className="min-w-0">
                                    <div className="px-1 py-1.5 text-[10px] text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-100 mb-1">
                                        {lang === 'en' ? GROUP_LABELS[group].en : GROUP_LABELS[group].tr}
                                    </div>
                                    {groupCols.map(col => (
                                        <button
                                            key={col.id}
                                            disabled={col.alwaysVisible}
                                            onClick={() => {
                                                if (col.alwaysVisible) return;
                                                setCampaignCols(prev => {
                                                    const next = new Set(prev);
                                                    if (next.has(col.id)) next.delete(col.id);
                                                    else next.add(col.id);
                                                    return next;
                                                });
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-1 py-1.5 text-sm text-left hover:bg-gray-50 rounded transition-colors",
                                                col.alwaysVisible && "opacity-60 cursor-not-allowed"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-3.5 h-3.5 border rounded flex items-center justify-center flex-shrink-0",
                                                campaignCols.has(col.id) ? "bg-gray-900 border-gray-900" : "border-gray-300"
                                            )}>
                                                {campaignCols.has(col.id) && (
                                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                )}
                                            </div>
                                            <span className="text-gray-700 truncate text-[13px]">{lang === 'en' ? col.labelEn : col.labelTr}</span>
                                            {col.alwaysVisible && <span className="ml-auto text-emerald-500 text-xs flex-shrink-0">★</span>}
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => setCampaignCols(new Set(DEFAULT_CAMPAIGN_COLS))}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {ct('resetColumns', 'Reset to Default', 'Varsayılana Dön')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // ─── Expanded Row Content ────────────────────────────────────────

    const CampaignExpandedContent = ({ campaign }: { campaign: Campaign }) => {
        const onlineROAS = calcOnlineROAS(campaign);
        const omniROAS = calcOmniROAS(campaign);
        return (
            <div className="grid grid-cols-4 gap-6">
                <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{ct('onlineMetrics', 'Online Metrics', 'Online Metrikler')}</div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm"><span className="text-gray-600">{ct('onlineConv', 'Online Conv.', 'Online Dönüşüm')}</span><span className="font-medium">{campaign.onlineConversions.toLocaleString('tr-TR')}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">{ct('onlineRevenue', 'Online Revenue', 'Online Gelir')}</span><span className="font-medium">{formatCurrency(campaign.onlineRevenue)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Online ROAS</span><span className="font-medium">{onlineROAS.toFixed(1)}x</span></div>
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Omnichannel</div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Omni ROAS</span><span className="font-bold text-amber-600">{omniROAS.toFixed(1)}x</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">{ct('totalRevenue', 'Total Revenue', 'Toplam Gelir')}</span><span className="font-medium">{formatCurrency(campaign.offlineRevenue + campaign.onlineRevenue)}</span></div>
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{ct('traffic', 'Traffic', 'Trafik')}</div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm"><span className="text-gray-600">{ct('impressions', 'Impressions', 'Gösterimler')}</span><span className="font-medium">{formatNumber(campaign.impressions)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">{ct('clicks', 'Clicks', 'Tıklamalar')}</span><span className="font-medium">{formatNumber(campaign.clicks)}</span></div>
                        {campaign.storeVisits && <div className="flex justify-between text-sm"><span className="text-gray-600">{ct('storeVisits', 'Store Visits', 'Mağaza Ziyaretleri')}</span><span className="font-medium text-[#EA4335]">{formatNumber(campaign.storeVisits)}</span></div>}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{ct('diagnostic', 'Diagnostic', 'Diagnostik')}</div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {ct('matchRate', 'Match Rate', 'Eşleşme Oranı')}</span>
                            <span className={`font-medium ${campaign.matchRate >= 70 ? 'text-emerald-600' : campaign.matchRate >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{campaign.matchRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {ct('lastUpdated', 'Last Updated', 'Son Güncelleme')}</span>
                            <span className="font-medium text-gray-500">{formatTimeAgo(campaign.lastUpdated, lang)}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ─── Table Views ─────────────────────────────────────────────────

    const CampaignRows = () => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="w-10 px-4 py-3"></th>
                        <th
                            className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('name')}
                        >
                            <div className="flex items-center gap-1">
                                {ct('campaign', 'Campaign', 'Kampanya')}
                                <ArrowUpDown className={cn('w-3 h-3', sortColumnId === 'name' ? 'text-blue-600' : 'text-gray-400')} />
                            </div>
                        </th>
                        {renderDataHeaders()}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredCampaigns.map(campaign => {
                        const isExpanded = expandedRows.has(campaign.id);
                        return (
                            <React.Fragment key={campaign.id}>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" onClick={e => toggleRow(campaign.id, e)}>
                                            {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900 text-sm">{campaign.name}</span>
                                            <TrendIcon trend={campaign.roasTrend} />
                                            <StatusBadge status={campaign.status} lang={lang} />
                                        </div>
                                    </td>
                                    {renderDataCells(campaign)}
                                </tr>
                                {isExpanded && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={totalColSpan} className="px-8 py-4">
                                            <CampaignExpandedContent campaign={campaign} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    // ─── Title / Count ───────────────────────────────────────────────

    const getTitle = () => ct('campaignPerformance', 'Campaign Performance', 'Kampanya Performansı');
    const getCount = () => `${filteredCampaigns.length} ${ct('campaignsCount', 'campaigns', 'kampanya')}`;

    // ─── Render ──────────────────────────────────────────────────────

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-visible">
            {/* Header */}
            <div className="vx-card-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">{getTitle()}</h3>
                        <div className="relative group">
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                                {ct('campaignTableTooltip', 'View campaign performance metrics. Customize visible columns and sort by any metric to find top performers.', 'Kampanya performans metriklerini görüntüleyin. Görünen sütunları özelleştirin ve en iyi performans gösterenleri bulmak için sıralayın.')}
                                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 hidden md:inline">{ct('campaignTableDesc', 'Offline & online attribution by campaign', 'Kampanya bazlı offline & online ilişkilendirme')}</span>
                    </div>
                    <div className="text-sm text-gray-500">{getCount()}</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={ct('searchCampaigns', 'Search campaigns...', 'Kampanya ara...')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <Switch size="small" checked={activeOnly} onChange={(_, checked) => setActiveOnly(checked)} />
                        {ct('activeOnly', 'Active only', 'Sadece aktif')}
                    </label>
                    {columnCustomizerJSX}
                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        {ct('export', 'Export', 'Dışa Aktar')}
                    </button>
                </div>
            </div>

            {/* Table content */}
            <CampaignRows />

            {/* Footer */}
            <div className="vx-card-header border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {ct('total', 'Total', 'Toplam')}: {formatCurrency(filteredCampaigns.reduce((sum, c) => sum + c.spend, 0))} {ct('spend', 'spend', 'harcama').toLowerCase()}, {formatCurrency(filteredCampaigns.reduce((sum, c) => sum + c.offlineRevenue, 0))} {ct('offlineRevenue', 'offline revenue', 'offline gelir').toLowerCase()}
                </div>
            </div>
        </div>
    );
}
