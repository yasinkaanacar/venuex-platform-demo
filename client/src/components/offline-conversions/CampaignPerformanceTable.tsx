import { BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Campaign {
    name: string;
    platform: string;
    spend: number;
    revenue: number;
    roas: number;
    conversions: number;
    revenuePerConv: number;
    performance: 'excellent' | 'good' | 'moderate';
}

interface CampaignPerformanceTableProps {
    data?: Campaign[];
    onExport?: () => void;
}

const defaultData: Campaign[] = [
    {
        name: 'Spring Fashion Collection',
        platform: 'Google Ads',
        spend: 125400,
        revenue: 672800,
        roas: 5.36,
        conversions: 284,
        revenuePerConv: 2369,
        performance: 'excellent'
    },
    {
        name: "Men's Casual Wear",
        platform: 'Meta Ads',
        spend: 89200,
        revenue: 445600,
        roas: 4.99,
        conversions: 198,
        revenuePerConv: 2251,
        performance: 'excellent'
    },
    {
        name: "Women's Summer Sale",
        platform: 'Google Ads',
        spend: 67800,
        revenue: 298300,
        roas: 4.40,
        conversions: 156,
        revenuePerConv: 1912,
        performance: 'good'
    },
    {
        name: 'Footwear Collection',
        platform: 'TikTok Ads',
        spend: 45600,
        revenue: 167200,
        roas: 3.67,
        conversions: 89,
        revenuePerConv: 1879,
        performance: 'good'
    },
    {
        name: 'Accessories Campaign',
        platform: 'Meta Ads',
        spend: 32100,
        revenue: 89400,
        roas: 2.78,
        conversions: 52,
        revenuePerConv: 1719,
        performance: 'moderate'
    }
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export default function CampaignPerformanceTable({ data = defaultData, onExport }: CampaignPerformanceTableProps) {
    const totalRevenue = data.reduce((sum, c) => sum + c.revenue, 0);
    const totalSpend = data.reduce((sum, c) => sum + c.spend, 0);
    const avgROAS = (totalRevenue / totalSpend).toFixed(2);
    const totalConversions = data.reduce((sum, c) => sum + c.conversions, 0);

    const getROASBadge = (roas: number, performance: Campaign['performance']) => {
        const colors = {
            excellent: 'bg-green-100 text-green-700',
            good: 'bg-blue-100 text-blue-700',
            moderate: 'bg-orange-100 text-orange-700'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[performance]}`}>
                {roas.toFixed(2)}:1
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-b from-white to-stone-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        <h3 className="text-base font-semibold text-gray-900">Campaign Performance</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                            Financial Impact
                        </Badge>
                        {onExport && (
                            <Button variant="outline" size="sm" className="text-xs" onClick={onExport}>
                                Export
                            </Button>
                        )}
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Campaign-level ROI and conversion metrics</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-5 py-3 text-left">Campaign</th>
                            <th className="px-5 py-3 text-right">Ad Spend</th>
                            <th className="px-5 py-3 text-right">Store Revenue</th>
                            <th className="px-5 py-3 text-right">ROAS</th>
                            <th className="px-5 py-3 text-right">Conversions</th>
                            <th className="px-5 py-3 text-right">Revenue/Conv</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((campaign) => (
                            <tr key={campaign.name} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="font-medium text-gray-900 text-sm">{campaign.name}</div>
                                    <div className="text-xs text-gray-500">{campaign.platform}</div>
                                </td>
                                <td className="px-5 py-4 text-right text-sm text-gray-600">
                                    {formatCurrency(campaign.spend)}
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="font-bold text-blue-600">{formatCurrency(campaign.revenue)}</div>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    {getROASBadge(campaign.roas, campaign.performance)}
                                </td>
                                <td className="px-5 py-4 text-right text-sm font-medium text-gray-900">
                                    {campaign.conversions}
                                </td>
                                <td className="px-5 py-4 text-right text-sm text-gray-600">
                                    {formatCurrency(campaign.revenuePerConv)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-600">{avgROAS}:1</div>
                        <div className="text-xs text-gray-500">Avg ROAS</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">{formatCurrency(totalRevenue)}</div>
                        <div className="text-xs text-gray-500">Total Revenue</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-purple-600">{totalConversions}</div>
                        <div className="text-xs text-gray-500">Total Conversions</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
