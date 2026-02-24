import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Target, PieChart, Receipt, Store } from 'lucide-react';
import { useLocales } from '@/lib/formatters';

// --- Types ---

interface MetricItemProps {
    label: string;
    value: string;
    change?: number;
    subValues?: { label: string; value: string }[];
}

// --- Sub-Components ---

function TrendBadge({ change }: { change: number }) {
    const isPositive = change >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            <Icon className="w-3 h-3" />
            {isPositive ? '+' : ''}{change}%
        </span>
    );
}

function MetricBlock({ label, value, change, subValues }: MetricItemProps) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">{value}</span>
                {change !== undefined && <TrendBadge change={change} />}
            </div>
            {subValues && (
                <div className="flex gap-3 mt-1.5">
                    {subValues.map((sub) => (
                        <div key={sub.label} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="text-[10px] text-gray-500">{sub.label}:</span>
                            <span className="text-[10px] font-semibold text-gray-700">{sub.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Main Component ---

export default function ExecutiveMetrics() {
    const { t } = useLocales();
    const oc = (key: string) => t(`offlineConversions.${key}`);

    const metrics = {
        cost: { label: oc('adSpend'), value: '₺485K', change: 12.5 },
        revenue: {
            label: oc('revenue'),
            value: '₺3.42M',
            change: 18.2,
            subValues: [
                { label: oc('online'), value: '₺2.22M' },
                { label: oc('offline'), value: '₺1.20M' },
            ],
        },
        roas: {
            label: oc('roas'),
            value: '7.05x',
            change: 5.1,
            subValues: [
                { label: oc('onlineRoas'), value: '4.58x' },
                { label: oc('offlineRoas'), value: '2.47x' },
            ],
        },
        aov: { label: oc('aovOffline'), value: '₺558', change: 8.3 },
        orders: {
            label: oc('orders'),
            value: '4,298',
            change: 15.7,
            subValues: [
                { label: oc('online'), value: '2,148' },
                { label: oc('offline'), value: '2,150' },
            ],
        },
        revenueShare: { label: oc('revenueShare'), value: '68%', change: 4.2 },
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">{oc('executiveSummary')}</h3>

            </div>

            {/* Metrics Grid */}
            <div className="p-4">
                <div className="grid grid-cols-6 gap-3">
                    {/* Cost */}
                    <div className="p-3 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                        <div className="w-7 h-7 bg-rose-500 rounded-md flex items-center justify-center mb-2">
                            <DollarSign className="w-3.5 h-3.5 text-white" />
                        </div>
                        <MetricBlock {...metrics.cost} />
                    </div>

                    {/* Revenue */}
                    <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                        <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center mb-2">
                            <Receipt className="w-3.5 h-3.5 text-white" />
                        </div>
                        <MetricBlock {...metrics.revenue} />
                    </div>

                    {/* ROAS */}
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center mb-2">
                            <Target className="w-3.5 h-3.5 text-white" />
                        </div>
                        <MetricBlock {...metrics.roas} />
                    </div>

                    {/* Orders */}
                    <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                        <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center mb-2">
                            <ShoppingCart className="w-3.5 h-3.5 text-white" />
                        </div>
                        <MetricBlock {...metrics.orders} />
                    </div>

                    {/* AOV */}
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                        <div className="w-7 h-7 bg-purple-500 rounded-md flex items-center justify-center mb-2">
                            <Store className="w-3.5 h-3.5 text-white" />
                        </div>
                        <MetricBlock {...metrics.aov} />
                    </div>

                    {/* Revenue Share */}
                    <div className="p-3 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-lg border border-cyan-100">
                        <div className="w-7 h-7 bg-cyan-500 rounded-md flex items-center justify-center mb-2">
                            <PieChart className="w-3.5 h-3.5 text-white" />
                        </div>
                        <MetricBlock {...metrics.revenueShare} />
                    </div>
                </div>
            </div>
        </div>
    );
}
