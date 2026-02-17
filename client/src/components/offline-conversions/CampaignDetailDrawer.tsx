import { useState } from 'react';
import { X, MapPin, Layers } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';

// Campaign interface (shared with CampaignPerformanceTable)
interface Campaign {
    id: string;
    name: string;
    platform: 'google' | 'meta' | 'tiktok';
    impressions: number;
    spend: number;
    storeVisits: number;
    ctv: number;
    onlineROAS: number;
    offlineROAS: number;
    omniROAS: number;
    offlinePurchases: number;
    offlineRevenue: number;
}

// Geographic data interface
interface GeoData {
    city: string;
    offlineConversions: number;
    offlineRevenue: number;
    offlineROAS: number;
}

// Ad Set interface
interface AdSet {
    id: string;
    name: string;
    offlineConversions: number;
    offlineRevenue: number;
    offlineROAS: number;
    ads: Ad[];
}

interface Ad {
    id: string;
    name: string;
    offlineConversions: number;
    offlineRevenue: number;
    offlineROAS: number;
}

interface CampaignDetailDrawerProps {
    campaign: Campaign | null;
    isOpen: boolean;
    onClose: () => void;
}

// Mock geographic data for campaigns
const mockGeoData: GeoData[] = [
    { city: 'Istanbul', offlineConversions: 12450, offlineRevenue: 45200000, offlineROAS: 38.2 },
    { city: 'Ankara', offlineConversions: 3280, offlineRevenue: 12100000, offlineROAS: 29.4 },
    { city: 'Izmir', offlineConversions: 2910, offlineRevenue: 9800000, offlineROAS: 31.1 },
    { city: 'Antalya', offlineConversions: 1850, offlineRevenue: 6200000, offlineROAS: 33.5 },
    { city: 'Bursa', offlineConversions: 1420, offlineRevenue: 4800000, offlineROAS: 28.7 },
    { city: 'Adana', offlineConversions: 980, offlineRevenue: 3100000, offlineROAS: 25.2 },
];

// Mock ad sets data
const mockAdSets: AdSet[] = [
    {
        id: '1',
        name: 'Retargeting-30D',
        offlineConversions: 6120,
        offlineRevenue: 22300000,
        offlineROAS: 26.8,
        ads: [
            { id: '1a', name: 'Carousel-Yeni Sezon', offlineConversions: 4230, offlineRevenue: 15200000, offlineROAS: 28.4 },
            { id: '1b', name: 'Video-Brand Story', offlineConversions: 1890, offlineRevenue: 7100000, offlineROAS: 22.1 },
        ]
    },
    {
        id: '2',
        name: 'Lookalike-Purchase',
        offlineConversions: 2100,
        offlineRevenue: 8900000,
        offlineROAS: 35.2,
        ads: [
            { id: '2a', name: 'Single Image-Sale', offlineConversions: 1200, offlineRevenue: 5200000, offlineROAS: 36.8 },
            { id: '2b', name: 'Collection-New Arrivals', offlineConversions: 900, offlineRevenue: 3700000, offlineROAS: 32.4 },
        ]
    },
    {
        id: '3',
        name: 'Broad-Interest',
        offlineConversions: 1580,
        offlineRevenue: 5400000,
        offlineROAS: 22.5,
        ads: [
            { id: '3a', name: 'Video-Lifestyle', offlineConversions: 980, offlineRevenue: 3400000, offlineROAS: 24.1 },
            { id: '3b', name: 'Carousel-Categories', offlineConversions: 600, offlineRevenue: 2000000, offlineROAS: 19.8 },
        ]
    },
];

const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
        return `₺${(amount / 1000000).toFixed(1)}M`;
    }
    return `₺${(amount / 1000).toFixed(0)}K`;
};

export default function CampaignDetailDrawer({ campaign, isOpen, onClose }: CampaignDetailDrawerProps) {
    const [activeTab, setActiveTab] = useState<'geo' | 'adsets'>('geo');
    const [expandedAdSets, setExpandedAdSets] = useState<string[]>([]);
    const [geoSortColumn, setGeoSortColumn] = useState<'city' | 'offlineConversions' | 'offlineRevenue' | 'offlineROAS'>('offlineRevenue');
    const [geoSortDirection, setGeoSortDirection] = useState<'asc' | 'desc'>('desc');

    if (!isOpen || !campaign) return null;

    const getPlatformIcon = (platform: Campaign['platform']) => {
        switch (platform) {
            case 'google':
                return <div className="w-8 h-8 bg-[#EA4335] rounded-lg flex items-center justify-center"><SiGoogle className="w-4 h-4 text-white" /></div>;
            case 'meta':
                return <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-sm text-white font-bold">f</span></div>;
            case 'tiktok':
                return <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center"><SiTiktok className="w-4 h-4 text-white" /></div>;
        }
    };

    const toggleAdSet = (adSetId: string) => {
        setExpandedAdSets(prev =>
            prev.includes(adSetId)
                ? prev.filter(id => id !== adSetId)
                : [...prev, adSetId]
        );
    };

    const handleGeoSort = (column: typeof geoSortColumn) => {
        if (geoSortColumn === column) {
            setGeoSortDirection(geoSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setGeoSortColumn(column);
            setGeoSortDirection('desc');
        }
    };

    const sortedGeoData = [...mockGeoData].sort((a, b) => {
        const aVal = a[geoSortColumn];
        const bVal = b[geoSortColumn];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return geoSortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return geoSortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return 0;
    });

    const getROASColor = (roas: number) => {
        if (roas >= 35) return 'text-green-600 bg-green-50';
        if (roas >= 25) return 'text-blue-600 bg-blue-50';
        return 'text-gray-600 bg-gray-50';
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-[45%] min-w-[500px] bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="vx-card-header">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {getPlatformIcon(campaign.platform)}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 truncate max-w-[350px]" title={campaign.name}>
                                    {campaign.name}
                                </h2>
                                <span className="text-sm text-gray-500 capitalize">{campaign.platform} Ads</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="vx-card-header">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-lg font-bold text-gray-900">{formatCurrency(campaign.spend)}</div>
                            <div className="text-xs text-gray-500 mt-1">Spend</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <div className="text-lg font-bold text-blue-600">{campaign.onlineROAS.toFixed(1)}x</div>
                            <div className="text-xs text-gray-500 mt-1">Online ROAS</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                            <div className="text-lg font-bold text-purple-600">{campaign.offlineROAS.toFixed(1)}x</div>
                            <div className="text-xs text-gray-500 mt-1">Offline ROAS</div>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-4 text-center">
                            <div className="text-lg font-bold text-amber-600">{campaign.omniROAS.toFixed(1)}x</div>
                            <div className="text-xs text-gray-500 mt-1">Omni ROAS</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="vx-card-header py-2">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('geo')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'geo'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <MapPin className="w-4 h-4" />
                            Geographic Distribution
                        </button>
                        <button
                            onClick={() => setActiveTab('adsets')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'adsets'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Layers className="w-4 h-4" />
                            Ad Sets
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto vx-card-body">
                    {/* Geographic Tab */}
                    {activeTab === 'geo' && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th
                                            className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleGeoSort('city')}
                                        >
                                            City {geoSortColumn === 'city' && (geoSortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleGeoSort('offlineConversions')}
                                        >
                                            OfflineConversions {geoSortColumn === 'offlineConversions' && (geoSortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleGeoSort('offlineRevenue')}
                                        >
                                            Offline Revenue {geoSortColumn === 'offlineRevenue' && (geoSortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleGeoSort('offlineROAS')}
                                        >
                                            Offline ROAS {geoSortColumn === 'offlineROAS' && (geoSortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedGeoData.map((geo) => (
                                        <tr key={geo.city} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{geo.city}</td>
                                            <td className="px-4 py-3 text-right text-sm text-gray-600">
                                                {geo.offlineConversions.toLocaleString('tr-TR')}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-medium text-blue-600">
                                                {formatCurrency(geo.offlineRevenue)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getROASColor(geo.offlineROAS)}`}>
                                                    {geo.offlineROAS.toFixed(1)}x
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Ad Sets Tab */}
                    {activeTab === 'adsets' && (
                        <div className="space-y-3">
                            {mockAdSets.map((adSet) => (
                                <div key={adSet.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    {/* Ad Set Header */}
                                    <button
                                        onClick={() => toggleAdSet(adSet.id)}
                                        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-lg transition-transform ${expandedAdSets.includes(adSet.id) ? 'rotate-90' : ''}`}>
                                                ▶
                                            </span>
                                            <span className="font-medium text-gray-900">{adSet.name}</span>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="text-right">
                                                <div className="text-gray-500 text-xs">Conversions</div>
                                                <div className="font-medium">{adSet.offlineConversions.toLocaleString('tr-TR')}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-gray-500 text-xs">Revenue</div>
                                                <div className="font-medium text-blue-600">{formatCurrency(adSet.offlineRevenue)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-gray-500 text-xs">ROAS</div>
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getROASColor(adSet.offlineROAS)}`}>
                                                    {adSet.offlineROAS.toFixed(1)}x
                                                </span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Ads (Expanded) */}
                                    {expandedAdSets.includes(adSet.id) && (
                                        <div className="border-t border-gray-200">
                                            {adSet.ads.map((ad, index) => (
                                                <div
                                                    key={ad.id}
                                                    className={`px-4 py-3 flex items-center justify-between pl-12 ${index < adSet.ads.length - 1 ? 'border-b border-gray-100' : ''
                                                        } hover:bg-gray-50`}
                                                >
                                                    <span className="text-sm text-gray-700">{ad.name}</span>
                                                    <div className="flex items-center gap-6 text-sm">
                                                        <div className="text-right w-20">
                                                            <div className="font-medium">{ad.offlineConversions.toLocaleString('tr-TR')}</div>
                                                        </div>
                                                        <div className="text-right w-20">
                                                            <div className="font-medium text-blue-600">{formatCurrency(ad.offlineRevenue)}</div>
                                                        </div>
                                                        <div className="text-right w-16">
                                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getROASColor(ad.offlineROAS)}`}>
                                                                {ad.offlineROAS.toFixed(1)}x
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
