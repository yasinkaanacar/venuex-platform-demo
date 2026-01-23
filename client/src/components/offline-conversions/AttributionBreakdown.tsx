import { PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PlatformAttribution {
    platform: string;
    revenue: number;
    percentage: number;
    conversions: number;
    color: string;
}

interface AttributionBreakdownProps {
    data?: PlatformAttribution[];
    firstTouchRevenue?: number;
    dataDrivenRevenue?: number;
}

const defaultData: PlatformAttribution[] = [
    { platform: 'Google Ads', revenue: 1247800, percentage: 43.8, conversions: 672, color: 'bg-blue-500' },
    { platform: 'Meta Ads', revenue: 998600, percentage: 35.1, conversions: 534, color: 'bg-green-500' },
    { platform: 'TikTok Ads', revenue: 387200, percentage: 13.6, conversions: 221, color: 'bg-purple-500' },
    { platform: 'Direct/Organic', revenue: 213900, percentage: 7.5, conversions: 142, color: 'bg-gray-400' }
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export default function AttributionBreakdown({
    data = defaultData,
    firstTouchRevenue = 1847500,
    dataDrivenRevenue = 2847500
}: AttributionBreakdownProps) {
    const improvement = ((dataDrivenRevenue - firstTouchRevenue) / firstTouchRevenue * 100).toFixed(1);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-b from-white to-stone-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-blue-600" />
                        <h3 className="text-base font-semibold text-gray-900">Revenue Attribution</h3>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                        Last 30 Days
                    </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">Platform contribution to offline revenue</p>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
                {/* Platform Breakdown */}
                <div className="space-y-3">
                    {data.map((item) => (
                        <div key={item.platform} className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-900">{item.platform}</span>
                                    <span className="text-sm font-bold text-gray-900">{formatCurrency(item.revenue)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${item.color}`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 min-w-[80px] justify-end">
                                        <span>{item.percentage}%</span>
                                        <span>•</span>
                                        <span>{item.conversions} orders</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Attribution Model Comparison */}
                <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Attribution Model Impact</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-gray-600">{formatCurrency(firstTouchRevenue)}</div>
                            <div className="text-xs font-medium text-gray-500">First-Touch</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-green-600">{formatCurrency(dataDrivenRevenue)}</div>
                            <div className="text-xs font-medium text-green-700">Data-Driven (Current)</div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        <span className="font-medium text-green-600">+{improvement}%</span> improvement using data-driven model
                    </p>
                </div>
            </div>
        </div>
    );
}
