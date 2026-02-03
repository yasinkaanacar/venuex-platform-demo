import { TrendingUp, TrendingDown, ArrowUpDown, MapPin, Megaphone } from 'lucide-react';
import { SiGoogle, SiTiktok } from 'react-icons/si';
import { useState } from 'react';

export default function TopPerformingOverview() {
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Locations */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="text-base font-semibold text-gray-900">Top Performing Locations</h3>
                    </div>
                    <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                        View All →
                    </button>
                </div>
                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">
                                    <button onClick={() => handleLocationSort('location')} className="flex items-center gap-1 hover:text-gray-700">
                                        Location <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase">Impressions</th>
                                <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase">Direction Requests</th>
                                <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase">Calls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="font-medium text-gray-900">Istanbul - Beyoğlu</div>
                                    <div className="text-xs text-gray-500">İstiklal Caddesi 125</div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">89,420</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">549</td>
                                <td className="text-right py-3 px-2">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="font-medium text-gray-900">276</span>
                                        <TrendingUp className="w-3 h-3 text-green-600" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="font-medium text-gray-900">Antalya - Muratpaşa</div>
                                    <div className="text-xs text-gray-500">Lara Caddesi 112</div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">94,672</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">627</td>
                                <td className="text-right py-3 px-2">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="font-medium text-gray-900">298</span>
                                        <TrendingUp className="w-3 h-3 text-green-600" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="font-medium text-gray-900">İzmir - Alsancak</div>
                                    <div className="text-xs text-gray-500">Kordon Caddesi 67</div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">82,155</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">559</td>
                                <td className="text-right py-3 px-2">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="font-medium text-gray-900">267</span>
                                        <TrendingUp className="w-3 h-3 text-green-600" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="font-medium text-gray-900">Ankara - Çankaya</div>
                                    <div className="text-xs text-gray-500">Tunalı Hilmi Caddesi 89</div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">76,230</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">514</td>
                                <td className="text-right py-3 px-2">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="font-medium text-gray-900">242</span>
                                        <TrendingDown className="w-3 h-3 text-red-500" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="font-medium text-gray-900">Bursa - Nilüfer</div>
                                    <div className="text-xs text-gray-500">Görükle Mahallesi 45</div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">71,845</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">486</td>
                                <td className="text-right py-3 px-2">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="font-medium text-gray-900">231</span>
                                        <TrendingUp className="w-3 h-3 text-green-600" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Performing Campaigns */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-purple-600" />
                        <h3 className="text-base font-semibold text-gray-900">Top Performing Campaigns</h3>
                    </div>
                    <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                        View All →
                    </button>
                </div>
                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">
                                    <button onClick={() => handleCampaignSort('campaign')} className="flex items-center gap-1 hover:text-gray-700">
                                        Campaign <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase">Spend</th>
                                <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase">Impressions</th>
                                <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase">CR</th>
                                <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase">Omni-ROAS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-[#EA4335] rounded flex items-center justify-center flex-shrink-0">
                                            <SiGoogle className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Summer Sale 2024</div>
                                            <div className="text-xs text-gray-500">google-ads</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">$16,350</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">142,580</td>
                                <td className="text-right py-3 px-2 text-gray-600">3.4%</td>
                                <td className="text-right py-3 px-2 text-green-600 font-medium">4.2x</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs text-white font-bold">f</span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Local Store Promo</div>
                                            <div className="text-xs text-gray-500">meta-ads</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">$12,840</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">89,670</td>
                                <td className="text-right py-3 px-2 text-gray-600">4.1%</td>
                                <td className="text-right py-3 px-2 text-green-600 font-medium">5.1x</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs text-white font-bold">f</span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Store Visit Drive</div>
                                            <div className="text-xs text-gray-500">meta-ads</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">$18,960</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">135,240</td>
                                <td className="text-right py-3 px-2 text-gray-600">3.7%</td>
                                <td className="text-right py-3 px-2 text-amber-600 font-medium">3.6x</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-[#EA4335] rounded flex items-center justify-center flex-shrink-0">
                                            <SiGoogle className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Local Shopping Campaign</div>
                                            <div className="text-xs text-gray-500">google-ads</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">$15,420</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">118,420</td>
                                <td className="text-right py-3 px-2 text-gray-600">2.9%</td>
                                <td className="text-right py-3 px-2 text-amber-600 font-medium">3.8x</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-black rounded flex items-center justify-center flex-shrink-0">
                                            <SiTiktok className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Gen Z Store Discovery</div>
                                            <div className="text-xs text-gray-500">tiktok-ads</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">$8,920</td>
                                <td className="text-right py-3 px-2 text-gray-900 font-medium">78,950</td>
                                <td className="text-right py-3 px-2 text-gray-600">2.8%</td>
                                <td className="text-right py-3 px-2 text-amber-600 font-medium">2.9x</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
