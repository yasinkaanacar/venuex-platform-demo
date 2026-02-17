import { useState, useEffect } from 'react';
import { ArrowUpDown, BarChart3 } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import CampaignDetailDrawer from './CampaignDetailDrawer';

// Campaign data interface matching PRD
interface Campaign {
    id: string;
    name: string;
    platform: 'google' | 'meta' | 'tiktok';
    impressions: number;
    spend: number;
    storeVisits: number;
    ctv: number; // Click-to-Visit Rate
    onlineROAS: number;
    offlineROAS: number;
    omniROAS: number; // Calculated: Online + Offline
    offlinePurchases: number;
    offlineRevenue: number;
}

interface CampaignPerformanceTableProps {
    onCampaignClick?: (campaign: Campaign) => void;
}

// Mock data with all PRD fields
const mockCampaigns: Campaign[] = [
    {
        id: '1',
        name: 'Holiday Sale Campaign',
        platform: 'google',
        impressions: 2450000,
        spend: 185000,
        storeVisits: 32400,
        ctv: 3.8,
        onlineROAS: 4.2,
        offlineROAS: 32.6,
        omniROAS: 36.8,
        offlinePurchases: 1650,
        offlineRevenue: 6028000
    },
    {
        id: '2',
        name: 'Brand Awareness Q4',
        platform: 'google',
        impressions: 8900000,
        spend: 120000,
        storeVisits: 18900,
        ctv: 1.2,
        onlineROAS: 2.1,
        offlineROAS: 18.4,
        omniROAS: 20.5,
        offlinePurchases: 420,
        offlineRevenue: 2208000
    },
    {
        id: '3',
        name: 'Social Commerce Push',
        platform: 'meta',
        impressions: 1780000,
        spend: 168000,
        storeVisits: 26700,
        ctv: 3.4,
        onlineROAS: 4.5,
        offlineROAS: 28.2,
        omniROAS: 32.7,
        offlinePurchases: 1240,
        offlineRevenue: 4737600
    },
    {
        id: '4',
        name: 'Video Content Campaign',
        platform: 'meta',
        impressions: 7200000,
        spend: 95000,
        storeVisits: 15200,
        ctv: 1.8,
        onlineROAS: 2.8,
        offlineROAS: 15.6,
        omniROAS: 18.4,
        offlinePurchases: 380,
        offlineRevenue: 1482000
    },
    {
        id: '5',
        name: 'Lookalike Audiences',
        platform: 'meta',
        impressions: 1340000,
        spend: 192000,
        storeVisits: 30100,
        ctv: 4.8,
        onlineROAS: 5.4,
        offlineROAS: 35.2,
        omniROAS: 40.6,
        offlinePurchases: 1450,
        offlineRevenue: 6758400
    },
    {
        id: '6',
        name: 'Dynamic Product Ads',
        platform: 'meta',
        impressions: 1120000,
        spend: 215000,
        storeVisits: 28900,
        ctv: 5.2,
        onlineROAS: 5.8,
        offlineROAS: 38.4,
        omniROAS: 44.2,
        offlinePurchases: 1620,
        offlineRevenue: 8256000
    },
    {
        id: '7',
        name: 'Gen Z Fashion Trends',
        platform: 'tiktok',
        impressions: 4500000,
        spend: 82000,
        storeVisits: 14800,
        ctv: 2.4,
        onlineROAS: 3.2,
        offlineROAS: 22.8,
        omniROAS: 26.0,
        offlinePurchases: 340,
        offlineRevenue: 1869600
    },
    {
        id: '8',
        name: 'Influencer Collaborations',
        platform: 'tiktok',
        impressions: 2800000,
        spend: 115000,
        storeVisits: 19200,
        ctv: 3.6,
        onlineROAS: 4.1,
        offlineROAS: 29.4,
        omniROAS: 33.5,
        offlinePurchases: 780,
        offlineRevenue: 3381000
    },
    {
        id: '9',
        name: 'Short Video Ads',
        platform: 'tiktok',
        impressions: 1650000,
        spend: 148000,
        storeVisits: 22600,
        ctv: 4.5,
        onlineROAS: 4.9,
        offlineROAS: 31.8,
        omniROAS: 36.7,
        offlinePurchases: 1120,
        offlineRevenue: 4706400
    },
    {
        id: '10',
        name: 'Product Launch - Denim',
        platform: 'google',
        impressions: 1560000,
        spend: 220000,
        storeVisits: 28500,
        ctv: 4.2,
        onlineROAS: 4.8,
        offlineROAS: 34.6,
        omniROAS: 39.4,
        offlinePurchases: 1320,
        offlineRevenue: 7612000
    },
    {
        id: '11',
        name: 'Retargeting - Website',
        platform: 'google',
        impressions: 980000,
        spend: 150000,
        storeVisits: 24000,
        ctv: 6.5,
        onlineROAS: 6.2,
        offlineROAS: 42.1,
        omniROAS: 48.3,
        offlinePurchases: 1580,
        offlineRevenue: 6315000
    },
    {
        id: '12',
        name: 'Summer Sale 2024',
        platform: 'google',
        impressions: 1425800,
        spend: 163500,
        storeVisits: 24387,
        ctv: 3.4,
        onlineROAS: 4.2,
        offlineROAS: 28.9,
        omniROAS: 33.1,
        offlinePurchases: 1247,
        offlineRevenue: 4725153
    }
];

const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
        return `₺${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `₺${(amount / 1000).toFixed(0)}K`;
    }
    return `₺${Math.round(amount)}`;
};

const formatNumber = (num: number) => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString('tr-TR');
};

type SortColumn = keyof Campaign;

export default function CampaignPerformanceTable({ onCampaignClick }: CampaignPerformanceTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn>('spend');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleCampaignClick = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setIsDrawerOpen(true);
        onCampaignClick?.(campaign);
    };

    // Reset to page 1 when items per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    // Sort campaigns
    const sortedCampaigns = [...mockCampaigns].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortDirection === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedCampaigns.length / itemsPerPage);
    const paginatedCampaigns = sortedCampaigns.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPlatformIcon = (platform: Campaign['platform']) => {
        switch (platform) {
            case 'google':
                return <div className="w-6 h-6 bg-[#EA4335] rounded flex items-center justify-center flex-shrink-0"><SiGoogle className="w-3 h-3 text-white" /></div>;
            case 'meta':
                return <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0"><span className="text-xs text-white font-bold">f</span></div>;
            case 'tiktok':
                return <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0"><SiTiktok className="w-3.5 h-3.5 text-white" /></div>;
        }
    };

    const getROASColor = (roas: number) => {
        if (roas >= 35) return 'text-green-600 bg-green-50';
        if (roas >= 25) return 'text-blue-600 bg-blue-50';
        return 'text-gray-600 bg-gray-50';
    };

    const SortableHeader = ({ column, children, align = 'right' }: { column: SortColumn; children: React.ReactNode; align?: 'left' | 'right' | 'center' }) => (
        <th
            className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap ${align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-right'}`}
            onClick={() => handleSort(column)}
        >
            <div className={`flex items-center gap-1 ${align === 'left' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'}`}>
                {children}
                <ArrowUpDown className={`w-3 h-3 ${sortColumn === column ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
        </th>
    );

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="vx-card-header">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-700" />
                            <h3 className="text-lg font-semibold text-gray-900">Kampanya Performansı</h3>
                        </div>
                        <div className="text-sm text-gray-500">
                            {sortedCampaigns.length} kampanya
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <SortableHeader column="name" align="left">Kampanya</SortableHeader>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">Platform</th>
                                <SortableHeader column="spend">Harcama</SortableHeader>
                                <SortableHeader column="offlinePurchases">Offline Dönüşümler</SortableHeader>
                                <SortableHeader column="offlineRevenue">Offline Gelir</SortableHeader>
                                {/* Hero Column - Offline ROAS */}
                                <th
                                    className="px-4 py-3 text-xs font-bold text-emerald-700 uppercase tracking-wider text-right cursor-pointer hover:bg-emerald-50 transition-colors bg-emerald-50/50"
                                    onClick={() => handleSort('offlineROAS')}
                                >
                                    <div className="flex items-center gap-1 justify-end">
                                        <span>Offline ROAS</span>
                                        <ArrowUpDown className={`w-3 h-3 ${sortColumn === 'offlineROAS' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                                    onClick={() => handleSort('offlinePurchases')}
                                >
                                    <div className="flex items-center gap-1 justify-end">
                                        <span>Cost per Conv.</span>
                                        <ArrowUpDown className={`w-3 h-3 text-gray-400`} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedCampaigns.map((campaign) => {
                                const costPerConversion = campaign.offlinePurchases > 0
                                    ? campaign.spend / campaign.offlinePurchases
                                    : 0;
                                const roasColor = campaign.offlineROAS >= 30
                                    ? 'text-emerald-700 bg-emerald-100'
                                    : campaign.offlineROAS >= 20
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : campaign.offlineROAS >= 10
                                            ? 'text-amber-600 bg-amber-50'
                                            : 'text-rose-600 bg-rose-50';

                                return (
                                    <tr
                                        key={campaign.id}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleCampaignClick(campaign)}
                                    >
                                        {/* Campaign Name */}
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-gray-900 text-sm">{campaign.name}</div>
                                        </td>
                                        {/* Platform */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {getPlatformIcon(campaign.platform)}
                                                <span className="text-sm text-gray-600 capitalize">{campaign.platform}</span>
                                            </div>
                                        </td>
                                        {/* Spend */}
                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                                            {formatCurrency(campaign.spend)}
                                        </td>
                                        {/* Offline Conversions */}
                                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                                            {campaign.offlinePurchases.toLocaleString('tr-TR')}
                                        </td>
                                        {/* Offline Revenue */}
                                        <td className="px-4 py-4 text-right text-sm font-medium text-blue-600">
                                            {formatCurrency(campaign.offlineRevenue)}
                                        </td>
                                        {/* Offline ROAS - Hero Column */}
                                        <td className="px-4 py-4 text-right bg-emerald-50/30">
                                            <span className={`inline-block px-3 py-1.5 rounded-md text-base font-bold ${roasColor}`}>
                                                {campaign.offlineROAS.toFixed(1)}x
                                            </span>
                                        </td>
                                        {/* Cost per Conversion */}
                                        <td className="px-4 py-4 text-right text-sm text-gray-600">
                                            {formatCurrency(costPerConversion)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="vx-card-header flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Sayfa başına:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-500">
                            {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedCampaigns.length)} / {sortedCampaigns.length}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Önceki
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sonraki
                        </button>
                    </div>
                </div>
            </div>

            {/* Campaign Detail Drawer */}
            <CampaignDetailDrawer
                campaign={selectedCampaign}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </>
    );
}
