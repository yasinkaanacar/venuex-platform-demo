import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StoreConversion {
    store: string;
    city: string;
    attributedRevenue: number;
    digitalOrders: number;
    conversionRate: number;
    avgOrderValue: number;
    topChannel: string;
    channelShare: number;
    performance: 'excellent' | 'good' | 'moderate';
}

interface StoreConversionsTableProps {
    data?: StoreConversion[];
}

const defaultData: StoreConversion[] = [
    {
        store: 'Istanbul Zorlu Center',
        city: 'Istanbul',
        attributedRevenue: 487200,
        digitalOrders: 142,
        conversionRate: 3.8,
        avgOrderValue: 3431,
        topChannel: 'Google Ads',
        channelShare: 67,
        performance: 'excellent'
    },
    {
        store: 'Ankara Ankamall',
        city: 'Ankara',
        attributedRevenue: 356800,
        digitalOrders: 124,
        conversionRate: 3.2,
        avgOrderValue: 2877,
        topChannel: 'Meta Ads',
        channelShare: 54,
        performance: 'excellent'
    },
    {
        store: 'Izmir Optimum',
        city: 'Izmir',
        attributedRevenue: 298600,
        digitalOrders: 96,
        conversionRate: 2.9,
        avgOrderValue: 3110,
        topChannel: 'Google Ads',
        channelShare: 61,
        performance: 'good'
    },
    {
        store: 'Bursa Kent Meydanı',
        city: 'Bursa',
        attributedRevenue: 189400,
        digitalOrders: 67,
        conversionRate: 2.4,
        avgOrderValue: 2827,
        topChannel: 'Meta Ads',
        channelShare: 48,
        performance: 'good'
    },
    {
        store: 'Antalya Terracity',
        city: 'Antalya',
        attributedRevenue: 156700,
        digitalOrders: 53,
        conversionRate: 2.1,
        avgOrderValue: 2957,
        topChannel: 'TikTok Ads',
        channelShare: 42,
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

export default function StoreConversionsTable({ data = defaultData }: StoreConversionsTableProps) {
    const totalRevenue = data.reduce((sum, store) => sum + store.attributedRevenue, 0);
    const avgConversionRate = (data.reduce((sum, store) => sum + store.conversionRate, 0) / data.length).toFixed(2);

    const getPerformanceBadge = (performance: StoreConversion['performance']) => {
        switch (performance) {
            case 'excellent':
                return <Badge className="bg-green-100 text-green-700 border-0">Excellent</Badge>;
            case 'good':
                return <Badge className="bg-blue-100 text-blue-700 border-0">Good</Badge>;
            case 'moderate':
                return <Badge className="bg-orange-100 text-orange-700 border-0">Moderate</Badge>;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-b from-white to-stone-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <h3 className="text-base font-semibold text-gray-900">Store Conversions</h3>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                        Top Performers
                    </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">Digital attribution by store location</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-5 py-3 text-left">Store</th>
                            <th className="px-5 py-3 text-right">Revenue</th>
                            <th className="px-5 py-3 text-right">Orders</th>
                            <th className="px-5 py-3 text-right">Conv. Rate</th>
                            <th className="px-5 py-3 text-right">AOV</th>
                            <th className="px-5 py-3 text-left">Top Channel</th>
                            <th className="px-5 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((store, index) => (
                            <tr key={store.store} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="font-medium text-gray-900 text-sm">{store.store}</div>
                                    <div className="text-xs text-gray-500">{store.city} • #{index + 1}</div>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="font-bold text-gray-900">{formatCurrency(store.attributedRevenue)}</div>
                                </td>
                                <td className="px-5 py-4 text-right text-sm text-gray-600">
                                    {store.digitalOrders}
                                </td>
                                <td className="px-5 py-4 text-right text-sm font-medium text-gray-900">
                                    {store.conversionRate}%
                                </td>
                                <td className="px-5 py-4 text-right text-sm text-gray-600">
                                    {formatCurrency(store.avgOrderValue)}
                                </td>
                                <td className="px-5 py-4 text-left">
                                    <div className="text-sm text-gray-900">{store.topChannel}</div>
                                    <div className="text-xs text-gray-500">{store.channelShare}%</div>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    {getPerformanceBadge(store.performance)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
                        <div className="text-xs text-gray-500">Total Store Revenue</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-gray-900">{avgConversionRate}%</div>
                        <div className="text-xs text-gray-500">Avg Conversion Rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
