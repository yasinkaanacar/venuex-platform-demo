import { PieChart as PieChartIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PlatformAttribution {
    platform: string;
    revenue: number;
    cost: number;
    revenuePercentage: number;
    costPercentage: number;
    conversions: number;
    color: string;
}

interface AttributionBreakdownProps {
    data?: PlatformAttribution[];
}

const defaultData: PlatformAttribution[] = [
    { platform: 'Google Ads', revenue: 1247800, cost: 185000, revenuePercentage: 43.8, costPercentage: 38.1, conversions: 672, color: '#3B82F6' },
    { platform: 'Meta Ads', revenue: 998600, cost: 156000, revenuePercentage: 35.1, costPercentage: 32.2, conversions: 534, color: '#22C55E' },
    { platform: 'TikTok Ads', revenue: 387200, cost: 98000, revenuePercentage: 13.6, costPercentage: 20.2, conversions: 221, color: '#A855F7' },
    { platform: 'Direct/Organic', revenue: 213900, cost: 46000, revenuePercentage: 7.5, costPercentage: 9.5, conversions: 142, color: '#9CA3AF' }
];

const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
        return `₺${(amount / 1000000).toFixed(2)}M`;
    }
    return `₺${(amount / 1000).toFixed(0)}K`;
};

const CustomTooltip = ({ active, payload, type }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const value = type === 'cost' ? data.cost : data.revenue;
        const percentage = type === 'cost' ? data.costPercentage : data.revenuePercentage;
        return (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                <p className="text-sm font-semibold text-gray-900">{data.platform}</p>
                <p className="text-sm text-gray-600">{formatCurrency(value)}</p>
                <p className="text-xs text-gray-500">{percentage}%</p>
            </div>
        );
    }
    return null;
};

export default function AttributionBreakdown({
    data = defaultData
}: AttributionBreakdownProps) {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalCost = data.reduce((sum, item) => sum + item.cost, 0);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="vx-card-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="text-base font-semibold text-gray-900">Platform Attribution</h3>
                    </div>

                </div>
                <p className="text-xs text-gray-500 mt-1">Cost vs Revenue by platform</p>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center justify-between gap-4">
                    {/* Cost Chart */}
                    <div className="flex-1">
                        <div className="text-center mb-2">
                            <p className="text-xs text-gray-500 uppercase font-medium">Cost</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalCost)}</p>
                        </div>
                        <div className="w-full h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={55}
                                        paddingAngle={2}
                                        dataKey="cost"
                                        strokeWidth={0}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-cost-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip type="cost" />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Middle Legend */}
                    <div className="flex flex-col gap-2 min-w-[120px]">
                        {data.map((item) => (
                            <div key={item.platform} className="flex items-center gap-2">
                                <div
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-xs text-gray-600 truncate">{item.platform}</span>
                            </div>
                        ))}
                    </div>

                    {/* Revenue Chart */}
                    <div className="flex-1">
                        <div className="text-center mb-2">
                            <p className="text-xs text-gray-500 uppercase font-medium">Revenue</p>
                            <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalRevenue)}</p>
                        </div>
                        <div className="w-full h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={55}
                                        paddingAngle={2}
                                        dataKey="revenue"
                                        strokeWidth={0}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-rev-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip type="revenue" />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
