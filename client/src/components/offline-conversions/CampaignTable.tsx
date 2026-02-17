import { useState, useMemo } from 'react';
import {
    ChevronDown,
    ChevronRight,
    ArrowUpDown,
    Search,
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart3,
    ArrowLeft,
    Image,
    Video,
    Layers,
    Type
} from 'lucide-react';
import { SiGoogle, SiTiktok } from 'react-icons/si';
import {
    mockCampaigns,
    Campaign,
    AdSet,
    Ad,
    Platform,
    AdType,
    calcOfflineROAS,
    calcCostPerConversion,
    calcOnlineROAS,
    calcOmniROAS,
    calcAvgBasketSize,
    calcConversionRate
} from '@/lib/mock-campaign-data';

// Types
type SortColumn = 'name' | 'spend' | 'offlineConversions' | 'offlineRevenue' | 'offlineROAS' | 'costPerConversion' | 'avgBasket';
type SortDirection = 'asc' | 'desc';
type ViewLevel = 'campaigns' | 'adsets' | 'ads';

// Format helpers
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

// Platform icon component
const PlatformIcon = ({ platform }: { platform: Platform }) => {
    switch (platform) {
        case 'google':
            return (
                <div className="w-6 h-6 bg-[#EA4335] rounded flex items-center justify-center flex-shrink-0">
                    <SiGoogle className="w-3 h-3 text-white" />
                </div>
            );
        case 'meta':
            return (
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">f</span>
                </div>
            );
        case 'tiktok':
            return (
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0">
                    <SiTiktok className="w-3.5 h-3.5 text-white" />
                </div>
            );
    }
};

// Ad type icon
const AdTypeIcon = ({ type }: { type: AdType }) => {
    switch (type) {
        case 'image':
            return <Image className="w-4 h-4 text-blue-500" />;
        case 'video':
            return <Video className="w-4 h-4 text-purple-500" />;
        case 'carousel':
            return <Layers className="w-4 h-4 text-amber-500" />;
        case 'text':
            return <Type className="w-4 h-4 text-gray-500" />;
    }
};

// Trend icon component
const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    switch (trend) {
        case 'up':
            return <TrendingUp className="w-4 h-4 text-emerald-500" />;
        case 'down':
            return <TrendingDown className="w-4 h-4 text-rose-500" />;
        default:
            return <Minus className="w-4 h-4 text-gray-400" />;
    }
};

// ROAS color helper
const getROASStyle = (roas: number) => {
    if (roas >= 4) return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    if (roas >= 2) return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-rose-700 bg-rose-100 border-rose-200';
};

export default function CampaignTable() {
    // Navigation state
    const [viewLevel, setViewLevel] = useState<ViewLevel>('campaigns');
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [selectedAdSet, setSelectedAdSet] = useState<AdSet | null>(null);

    // Table state
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [sortColumn, setSortColumn] = useState<SortColumn>('offlineROAS');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

    // Navigation handlers
    const navigateToCampaigns = () => {
        setViewLevel('campaigns');
        setSelectedCampaign(null);
        setSelectedAdSet(null);
        setExpandedRows(new Set());
    };

    const navigateToAdSets = (campaign: Campaign) => {
        if (campaign.adSets.length === 0) return;
        setSelectedCampaign(campaign);
        setViewLevel('adsets');
        setExpandedRows(new Set());
    };

    const navigateToAds = (adSet: AdSet) => {
        if (adSet.ads.length === 0) return;
        setSelectedAdSet(adSet);
        setViewLevel('ads');
        setExpandedRows(new Set());
    };

    // Toggle row expansion
    const toggleRow = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Handle sort
    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    // Filter and sort campaigns
    const filteredCampaigns = useMemo(() => {
        let result = [...mockCampaigns];
        if (platformFilter !== 'all') {
            result = result.filter(c => c.platform === platformFilter);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(c => c.name.toLowerCase().includes(query));
        }
        result.sort((a, b) => {
            let aVal: number | string;
            let bVal: number | string;
            switch (sortColumn) {
                case 'name': aVal = a.name; bVal = b.name; break;
                case 'spend': aVal = a.spend; bVal = b.spend; break;
                case 'offlineConversions': aVal = a.offlineConversions; bVal = b.offlineConversions; break;
                case 'offlineRevenue': aVal = a.offlineRevenue; bVal = b.offlineRevenue; break;
                case 'offlineROAS': aVal = calcOfflineROAS(a); bVal = calcOfflineROAS(b); break;
                case 'costPerConversion': aVal = calcCostPerConversion(a); bVal = calcCostPerConversion(b); break;
                default: return 0;
            }
            if (typeof aVal === 'string') return sortDirection === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
            return sortDirection === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
        });
        return result;
    }, [platformFilter, searchQuery, sortColumn, sortDirection]);

    // Sortable header component
    const SortableHeader = ({ column, children, align = 'right', isHero = false }: { column: SortColumn; children: React.ReactNode; align?: 'left' | 'right'; isHero?: boolean }) => (
        <th
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap ${align === 'left' ? 'text-left' : 'text-right'} ${isHero ? 'bg-emerald-50/50 text-emerald-700 font-bold' : 'text-gray-600'}`}
            onClick={() => handleSort(column)}
        >
            <div className={`flex items-center gap-1 ${align === 'left' ? 'justify-start' : 'justify-end'}`}>
                {children}
                <ArrowUpDown className={`w-3 h-3 ${sortColumn === column ? isHero ? 'text-emerald-600' : 'text-blue-600' : 'text-gray-400'}`} />
            </div>
        </th>
    );

    // Breadcrumb component
    const Breadcrumb = () => (
        <div className="flex items-center gap-2 text-sm mb-4">
            <button onClick={navigateToCampaigns} className={`hover:text-blue-600 transition-colors ${viewLevel === 'campaigns' ? 'font-semibold text-gray-900' : 'text-blue-600'}`}>
                Campaigns
            </button>
            {selectedCampaign && (
                <>
                    <span className="text-gray-400">/</span>
                    <button
                        onClick={() => { setViewLevel('adsets'); setSelectedAdSet(null); }}
                        className={`hover:text-blue-600 transition-colors ${viewLevel === 'adsets' ? 'font-semibold text-gray-900' : 'text-blue-600'}`}
                    >
                        {selectedCampaign.name}
                    </button>
                </>
            )}
            {selectedAdSet && (
                <>
                    <span className="text-gray-400">/</span>
                    <span className="font-semibold text-gray-900">{selectedAdSet.name}</span>
                </>
            )}
        </div>
    );

    // Parent Summary Strip
    const ParentSummaryStrip = () => {
        if (viewLevel === 'campaigns') return null;

        const parent = viewLevel === 'adsets' ? selectedCampaign : selectedCampaign;
        const adSetParent = viewLevel === 'ads' ? selectedAdSet : null;

        if (!parent) return null;

        return (
            <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 mb-4 flex items-center gap-6">
                <button onClick={() => viewLevel === 'ads' ? setViewLevel('adsets') : navigateToCampaigns()} className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                    <PlatformIcon platform={parent.platform} />
                    <span className="font-semibold text-gray-900">{parent.name}</span>
                    {adSetParent && (
                        <>
                            <span className="text-gray-400 mx-1">›</span>
                            <span className="text-gray-700">{adSetParent.name}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-6 ml-auto text-sm">
                    <div><span className="text-gray-500">Spend:</span> <span className="font-medium">{formatCurrency(adSetParent?.spend || parent.spend)}</span></div>
                    <div><span className="text-gray-500">Offline ROAS:</span> <span className="font-bold text-emerald-600">{calcOfflineROAS(adSetParent || parent).toFixed(1)}x</span></div>
                    <div><span className="text-gray-500">Offline Conv:</span> <span className="font-medium">{(adSetParent?.offlineConversions || parent.offlineConversions).toLocaleString('tr-TR')}</span></div>
                </div>
            </div>
        );
    };

    // Campaign Table View
    const CampaignTableView = () => (
        <>
            {/* Filters */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Platform:</span>
                    <div className="flex gap-1">
                        {(['all', 'google', 'meta', 'tiktok'] as const).map(platform => (
                            <button
                                key={platform}
                                onClick={() => setPlatformFilter(platform)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${platformFilter === platform ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'}`}
                            >
                                {platform === 'all' ? 'Tümü' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 max-w-xs">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Kampanya ara..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="w-10 px-4 py-3"></th>
                            <SortableHeader column="name" align="left">Kampanya</SortableHeader>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">Platform</th>
                            <SortableHeader column="spend">Harcama</SortableHeader>
                            <SortableHeader column="offlineConversions">Offline Dönüşüm</SortableHeader>
                            <SortableHeader column="offlineRevenue">Offline Gelir</SortableHeader>
                            <SortableHeader column="offlineROAS" isHero>Offline ROAS</SortableHeader>
                            <SortableHeader column="costPerConversion">Cost / Conv.</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCampaigns.map(campaign => {
                            const isExpanded = expandedRows.has(campaign.id);
                            const offlineROAS = calcOfflineROAS(campaign);
                            const costPerConv = calcCostPerConversion(campaign);
                            const onlineROAS = calcOnlineROAS(campaign);
                            const omniROAS = calcOmniROAS(campaign);
                            const hasAdSets = campaign.adSets.length > 0;

                            return (
                                <>
                                    <tr
                                        key={campaign.id}
                                        className={`hover:bg-gray-50 transition-colors ${hasAdSets ? 'cursor-pointer' : ''}`}
                                        onClick={() => hasAdSets && navigateToAdSets(campaign)}
                                    >
                                        <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                            <button className="p-1 hover:bg-gray-200 rounded transition-colors" onClick={(e) => toggleRow(campaign.id, e)}>
                                                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900 text-sm">{campaign.name}</span>
                                                <TrendIcon trend={campaign.roasTrend} />
                                                {hasAdSets && <span className="text-xs text-gray-400 ml-1">({campaign.adSets.length} ad sets)</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <PlatformIcon platform={campaign.platform} />
                                                <span className="text-sm text-gray-600 capitalize">{campaign.platform}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(campaign.spend)}</td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{campaign.offlineConversions.toLocaleString('tr-TR')}</td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-blue-600">{formatCurrency(campaign.offlineRevenue)}</td>
                                        <td className="px-4 py-4 text-right bg-emerald-50/30">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-base font-bold border ${getROASStyle(offlineROAS)}`}>
                                                {offlineROAS.toFixed(1)}x
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-gray-600">{formatCurrency(costPerConv)}</td>
                                    </tr>
                                    {isExpanded && (
                                        <tr key={`${campaign.id}-exp`} className="bg-gray-50">
                                            <td colSpan={8} className="px-8 py-4">
                                                <div className="grid grid-cols-3 gap-6">
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Online Metrikler</div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Online Dönüşüm</span><span className="font-medium">{campaign.onlineConversions.toLocaleString('tr-TR')}</span></div>
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Online Gelir</span><span className="font-medium">{formatCurrency(campaign.onlineRevenue)}</span></div>
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Online ROAS</span><span className="font-medium">{onlineROAS.toFixed(1)}x</span></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Omnichannel</div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Omni ROAS</span><span className="font-bold text-amber-600">{omniROAS.toFixed(1)}x</span></div>
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Toplam Gelir</span><span className="font-medium">{formatCurrency(campaign.offlineRevenue + campaign.onlineRevenue)}</span></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Traffic</div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Gösterimler</span><span className="font-medium">{formatNumber(campaign.impressions)}</span></div>
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Tıklamalar</span><span className="font-medium">{formatNumber(campaign.clicks)}</span></div>
                                                            {campaign.storeVisits && <div className="flex justify-between text-sm"><span className="text-gray-600">Mağaza Ziyaretleri</span><span className="font-medium text-[#EA4335]">{formatNumber(campaign.storeVisits)}</span></div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );

    // Ad Set Table View
    const AdSetTableView = () => {
        if (!selectedCampaign) return null;
        const adSets = selectedCampaign.adSets;

        return (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="w-10 px-4 py-3"></th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">Ad Set Name</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Harcama</th>
                            <th className="px-4 py-3 text-xs font-bold text-emerald-700 uppercase tracking-wider text-right bg-emerald-50/50">Offline ROAS</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Cost / Conv.</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Avg. Basket</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {adSets.map(adSet => {
                            const isExpanded = expandedRows.has(adSet.id);
                            const offlineROAS = calcOfflineROAS(adSet);
                            const costPerConv = calcCostPerConversion(adSet);
                            const avgBasket = calcAvgBasketSize(adSet);
                            const hasAds = adSet.ads.length > 0;

                            return (
                                <>
                                    <tr
                                        key={adSet.id}
                                        className={`hover:bg-gray-50 transition-colors ${hasAds ? 'cursor-pointer' : ''}`}
                                        onClick={() => hasAds && navigateToAds(adSet)}
                                    >
                                        <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                            <button className="p-1 hover:bg-gray-200 rounded transition-colors" onClick={(e) => toggleRow(adSet.id, e)}>
                                                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900 text-sm">{adSet.name}</span>
                                                {hasAds && <span className="text-xs text-gray-400 ml-1">({adSet.ads.length} ads)</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(adSet.spend)}</td>
                                        <td className="px-4 py-4 text-right bg-emerald-50/30">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-base font-bold border ${getROASStyle(offlineROAS)}`}>
                                                {offlineROAS.toFixed(1)}x
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-gray-600">{formatCurrency(costPerConv)}</td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(avgBasket)}</td>
                                    </tr>
                                    {isExpanded && (
                                        <tr key={`${adSet.id}-exp`} className="bg-gray-50">
                                            <td colSpan={6} className="px-8 py-4">
                                                <div className="grid grid-cols-3 gap-6">
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Volume</div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Offline Dönüşüm</span><span className="font-medium">{adSet.offlineConversions.toLocaleString('tr-TR')}</span></div>
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Offline Gelir</span><span className="font-medium">{formatCurrency(adSet.offlineRevenue)}</span></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Diagnostic</div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Frequency</span><span className="font-medium">{adSet.frequency.toFixed(1)}</span></div>
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Conv. Rate</span><span className="font-medium">{calcConversionRate(adSet).toFixed(2)}%</span></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Online</div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Online Dönüşüm</span><span className="font-medium">{adSet.onlineConversions.toLocaleString('tr-TR')}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    // Ad Table View
    const AdTableView = () => {
        if (!selectedAdSet) return null;
        const ads = selectedAdSet.ads;

        return (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="w-10 px-4 py-3"></th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">Ad Creative</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Harcama</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Offline Dönüşüm</th>
                            <th className="px-4 py-3 text-xs font-bold text-emerald-700 uppercase tracking-wider text-right bg-emerald-50/50">Offline ROAS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {ads.map(ad => {
                            const isExpanded = expandedRows.has(ad.id);
                            const offlineROAS = calcOfflineROAS(ad);
                            const costPerConv = calcCostPerConversion(ad);
                            const convRate = calcConversionRate(ad);

                            return (
                                <>
                                    <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <button className="p-1 hover:bg-gray-200 rounded transition-colors" onClick={(e) => toggleRow(ad.id, e)}>
                                                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                    <AdTypeIcon type={ad.type} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">{ad.name}</div>
                                                    <div className="text-xs text-gray-500 capitalize">{ad.type} Ad {ad.dimensions && `· ${ad.dimensions}`}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(ad.spend)}</td>
                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">{ad.offlineConversions.toLocaleString('tr-TR')}</td>
                                        <td className="px-4 py-4 text-right bg-emerald-50/30">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-base font-bold border ${getROASStyle(offlineROAS)}`}>
                                                {offlineROAS.toFixed(1)}x
                                            </span>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr key={`${ad.id}-exp`} className="bg-gray-50">
                                            <td colSpan={5} className="px-8 py-4">
                                                <div className="grid grid-cols-3 gap-6">
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Efficiency</div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Cost / Conv.</span><span className="font-medium">{formatCurrency(costPerConv)}</span></div>
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Offline Gelir</span><span className="font-medium">{formatCurrency(ad.offlineRevenue)}</span></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Diagnostic</div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Conv. Rate</span><span className="font-medium">{convRate.toFixed(2)}%</span></div>
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">CTR</span><span className="font-medium">{((ad.clicks / ad.impressions) * 100).toFixed(2)}%</span></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Online</div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Online Dönüşüm</span><span className="font-medium">{ad.onlineConversions.toLocaleString('tr-TR')}</span></div>
                                                            <div className="flex justify-between text-sm"><span className="text-gray-600">Tıklamalar</span><span className="font-medium">{formatNumber(ad.clicks)}</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    // Get title based on view level
    const getTitle = () => {
        switch (viewLevel) {
            case 'campaigns': return 'Kampanya Performansı';
            case 'adsets': return 'Ad Set Performansı';
            case 'ads': return 'Ad Performansı';
        }
    };

    const getCount = () => {
        switch (viewLevel) {
            case 'campaigns': return `${filteredCampaigns.length} kampanya`;
            case 'adsets': return `${selectedCampaign?.adSets.length || 0} ad set`;
            case 'ads': return `${selectedAdSet?.ads.length || 0} ad`;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="vx-card-header">
                <Breadcrumb />
                <ParentSummaryStrip />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">{getTitle()}</h3>
                    </div>
                    <div className="text-sm text-gray-500">{getCount()}</div>
                </div>
            </div>

            {/* Content based on view level */}
            {viewLevel === 'campaigns' && <CampaignTableView />}
            {viewLevel === 'adsets' && <AdSetTableView />}
            {viewLevel === 'ads' && <AdTableView />}

            {/* Footer */}
            <div className="vx-card-header border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {viewLevel === 'campaigns' && (
                        <>Toplam: {formatCurrency(filteredCampaigns.reduce((sum, c) => sum + c.spend, 0))} harcama, {formatCurrency(filteredCampaigns.reduce((sum, c) => sum + c.offlineRevenue, 0))} offline gelir</>
                    )}
                    {viewLevel === 'adsets' && selectedCampaign && (
                        <>Toplam: {formatCurrency(selectedCampaign.adSets.reduce((sum, as) => sum + as.spend, 0))} harcama, {formatCurrency(selectedCampaign.adSets.reduce((sum, as) => sum + as.offlineRevenue, 0))} offline gelir</>
                    )}
                    {viewLevel === 'ads' && selectedAdSet && (
                        <>Toplam: {formatCurrency(selectedAdSet.ads.reduce((sum, a) => sum + a.spend, 0))} harcama, {formatCurrency(selectedAdSet.ads.reduce((sum, a) => sum + a.offlineRevenue, 0))} offline gelir</>
                    )}
                </div>
            </div>
        </div>
    );
}
