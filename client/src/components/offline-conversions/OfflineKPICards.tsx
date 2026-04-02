import { ArrowUpRight, ArrowDownRight, DollarSign, Target, Store, TrendingUp } from 'lucide-react';

interface KPIData {
    attributedRevenue: { current: number; previous: number; change: number };
    offlineROAS: { current: number; previous: number; change: number };
    totalConversions: { current: number; previous: number; change: number };
    avgOrderValue: { current: number; previous: number; change: number };
}

interface OfflineKPICardsProps {
    data?: KPIData;
}

const defaultData: KPIData = {
    attributedRevenue: { current: 2847500, previous: 2234100, change: 27.5 },
    offlineROAS: { current: 4.23, previous: 3.87, change: 9.3 },
    totalConversions: { current: 1847, previous: 1623, change: 13.8 },
    avgOrderValue: { current: 1542, previous: 1377, change: 12.0 }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
};

export default function OfflineKPICards({ data = defaultData }: OfflineKPICardsProps) {
    const kpis = [
        {
            title: 'Attributed Revenue',
            value: formatCurrency(data.attributedRevenue.current),
            previousValue: formatCurrency(data.attributedRevenue.previous),
            change: data.attributedRevenue.change,
            icon: DollarSign,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Offline ROAS',
            value: `${data.offlineROAS.current.toFixed(2)}:1`,
            previousValue: `${data.offlineROAS.previous.toFixed(2)}:1`,
            change: data.offlineROAS.change,
            icon: Target,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Store Conversions',
            value: formatNumber(data.totalConversions.current),
            previousValue: formatNumber(data.totalConversions.previous),
            change: data.totalConversions.change,
            icon: Store,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Avg Order Value',
            value: formatCurrency(data.avgOrderValue.current),
            previousValue: formatCurrency(data.avgOrderValue.previous),
            change: data.avgOrderValue.change,
            icon: TrendingUp,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                const isPositive = kpi.change > 0;

                return (
                    <div
                        key={kpi.title}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {kpi.title}
                            </span>
                            <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                                <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                            </div>
                        </div>

                        {/* Value */}
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                            {kpi.value}
                        </div>

                        {/* Change Indicator */}
                        <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {isPositive ? (
                                    <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4" />
                                )}
                                <span>{isPositive ? '+' : ''}{kpi.change.toFixed(1)}%</span>
                            </div>
                            <span className="text-xs text-gray-400">vs last period</span>
                        </div>

                        {/* Previous Value */}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                                Previous: <span className="font-medium">{kpi.previousValue}</span>
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
