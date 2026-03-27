import { TrendingUp, TrendingDown, ArrowUpDown, ArrowUp, ArrowDown, MapPin, Megaphone } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import type { TopLocation, TopCampaign } from '@/lib/types/overview';
import type { OverviewFilterState } from '@/pages/overview';
import { useTranslation } from '@/contexts/LanguageContext';
import { fNumber, fCurrency } from '@/lib/formatters';
import { PATHS } from '@/routes/paths';

interface TopPerformingOverviewProps {
    topLocations?: TopLocation[];
    topCampaigns?: TopCampaign[];
    filters?: OverviewFilterState;
}

const platformConfig: Record<string, { icon: React.ReactNode; bg: string; label: string }> = {
    google: {
        icon: <SiGoogle className="w-3 h-3 text-white" />,
        bg: 'bg-[#EA4335]',
        label: 'google-ads'
    },
    meta: {
        icon: <SiMeta className="w-3 h-3 text-white" />,
        bg: 'bg-[#0081FB]',
        label: 'meta-ads'
    },
    tiktok: {
        icon: <SiTiktok className="w-3 h-3 text-white" />,
        bg: 'bg-black',
        label: 'tiktok-ads'
    }
};

export default function TopPerformingOverview({ topLocations = [], topCampaigns = [], filters }: TopPerformingOverviewProps) {
    const { t } = useTranslation();
    const db = t.dashboard as any;
    const [, navigate] = useLocation();

    const getSortIcon = (column: string, activeColumn: string | null, direction: 'asc' | 'desc') => {
        if (activeColumn !== column) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
        return direction === 'asc'
            ? <ArrowUp className="w-3 h-3 text-blue-600" />
            : <ArrowDown className="w-3 h-3 text-blue-600" />;
    };

    const [locationSortColumn, setLocationSortColumn] = useState<string | null>(null);
    const [locationSortDirection, setLocationSortDirection] = useState<'asc' | 'desc'>('desc');
    const [campaignSortColumn, setCampaignSortColumn] = useState<string | null>(null);
    const [campaignSortDirection, setCampaignSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleLocationSort = (column: string) => {
        if (locationSortColumn === column) {
            setLocationSortDirection(locationSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setLocationSortColumn(column);
            setLocationSortDirection('desc');
        }
    };

    const handleCampaignSort = (column: string) => {
        if (campaignSortColumn === column) {
            setCampaignSortDirection(campaignSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setCampaignSortColumn(column);
            setCampaignSortDirection('desc');
        }
    };

    const sortedLocations = useMemo(() => {
        if (!locationSortColumn) return topLocations;
        const sorted = [...topLocations].sort((a, b) => {
            const key = locationSortColumn as keyof TopLocation;
            const aVal = a[key];
            const bVal = b[key];
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return locationSortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return locationSortDirection === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
        return sorted;
    }, [topLocations, locationSortColumn, locationSortDirection]);

    const sortedCampaigns = useMemo(() => {
        if (!campaignSortColumn) return topCampaigns;
        const sorted = [...topCampaigns].sort((a, b) => {
            const key = campaignSortColumn as keyof TopCampaign;
            const aVal = a[key];
            const bVal = b[key];
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return campaignSortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return campaignSortDirection === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
        return sorted;
    }, [topCampaigns, campaignSortColumn, campaignSortDirection]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Locations */}
            <div className="vx-card">
                <div className="vx-card-header flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm font-semibold text-gray-900">{db?.topPerformingLocations || 'Top Performing Locations'}</h3>
                    </div>
                    <button onClick={() => navigate(PATHS.LOCATIONS)} className="text-xs text-gray-500 hover:text-gray-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                        {db?.view_all || 'View All'} →
                    </button>
                </div>
                <div className="vx-card-body vx-surface-muted overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="vx-th text-left">
                                    <button onClick={() => handleLocationSort('name')} className="flex items-center gap-1 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                                        {db?.location || 'Location'} {getSortIcon('name', locationSortColumn, locationSortDirection)}
                                    </button>
                                </th>
                                <th className="vx-th text-right">{db?.impressions || 'Impressions'}</th>
                                <th className="vx-th text-right">{db?.directionRequests || 'Direction Requests'}</th>
                                <th className="vx-th text-right">{db?.calls || 'Calls'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedLocations.map((loc) => (
                                <tr key={loc.id} className="hover:bg-gray-50">
                                    <td className="vx-td">
                                        <div className="font-medium text-gray-900">{loc.name}</div>
                                        <div className="text-xs text-gray-500">{loc.address}</div>
                                    </td>
                                    <td className="vx-td text-right text-gray-900 font-medium">{fNumber(loc.impressions)}</td>
                                    <td className="vx-td text-right text-gray-900 font-medium">{fNumber(loc.directionRequests)}</td>
                                    <td className="vx-td text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <span className="font-medium text-gray-900">{fNumber(loc.calls)}</span>
                                            {loc.trend === 'up' ? (
                                                <TrendingUp className="w-3 h-3 text-green-600" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3 text-red-500" />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sortedLocations.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="vx-td text-center text-gray-400 py-8">No location data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Performing Campaigns */}
            <div className="vx-card">
                <div className="vx-card-header flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-purple-600" />
                        <h3 className="text-sm font-semibold text-gray-900">{db?.topPerformingCampaigns || 'Top Performing Campaigns'}</h3>
                    </div>
                    <button onClick={() => navigate(PATHS.OFFLINE_CONVERSIONS)} className="text-xs text-gray-500 hover:text-gray-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                        {db?.view_all || 'View All'} →
                    </button>
                </div>
                <div className="vx-card-body vx-surface-muted overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="vx-th text-left">
                                    <button onClick={() => handleCampaignSort('name')} className="flex items-center gap-1 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                                        {db?.campaign || 'Campaign'} {getSortIcon('name', campaignSortColumn, campaignSortDirection)}
                                    </button>
                                </th>
                                <th className="vx-th text-right">{db?.spend || 'Spend'}</th>
                                <th className="vx-th text-right">{db?.impressions || 'Impressions'}</th>
                                <th className="vx-th text-right">{db?.conversionRate || 'CR'}</th>
                                <th className="vx-th text-right">{db?.omniRoas || 'Omni-ROAS'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedCampaigns.map((camp) => {
                                const pConfig = platformConfig[camp.platform] || platformConfig.google;
                                const roasColor = camp.omniRoas >= 4.0 ? 'text-green-600' : 'text-amber-600';
                                return (
                                    <tr key={camp.id} className="hover:bg-gray-50">
                                        <td className="vx-td">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-5 h-5 ${pConfig.bg} rounded flex items-center justify-center flex-shrink-0`}>
                                                    {pConfig.icon}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{camp.name}</div>
                                                    <div className="text-xs text-gray-500">{pConfig.label}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="vx-td text-right text-gray-900 font-medium">{fCurrency(camp.spend)}</td>
                                        <td className="vx-td text-right text-gray-900 font-medium">{fNumber(camp.impressions)}</td>
                                        <td className="vx-td text-right text-gray-600">{camp.cr.toFixed(1)}%</td>
                                        <td className={`vx-td text-right font-medium ${roasColor}`}>{camp.omniRoas.toFixed(1)}x</td>
                                    </tr>
                                );
                            })}
                            {sortedCampaigns.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="vx-td text-center text-gray-400 py-8">No campaign data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
