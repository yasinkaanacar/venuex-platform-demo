import { BarChart3, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DayTrend {
    day: string;
    revenue: number;
    change: number;
    isOptimal: boolean;
}

interface TimeSlot {
    time: string;
    rate: number;
    impact: 'peak' | 'high' | 'medium';
    orders: number;
}

interface ConversionTrendsProps {
    dailyData?: DayTrend[];
    hourlyData?: TimeSlot[];
}

const defaultDailyData: DayTrend[] = [
    { day: 'Monday', revenue: 456200, change: 12.3, isOptimal: true },
    { day: 'Tuesday', revenue: 398600, change: 8.7, isOptimal: true },
    { day: 'Wednesday', revenue: 423800, change: 15.2, isOptimal: true },
    { day: 'Thursday', revenue: 387400, change: 5.9, isOptimal: false },
    { day: 'Friday', revenue: 521300, change: 18.6, isOptimal: true },
    { day: 'Saturday', revenue: 612700, change: 22.4, isOptimal: true },
    { day: 'Sunday', revenue: 447500, change: 9.8, isOptimal: false }
];

const defaultHourlyData: TimeSlot[] = [
    { time: '10:00-12:00', rate: 4.2, impact: 'high', orders: 89 },
    { time: '14:00-16:00', rate: 3.8, impact: 'high', orders: 76 },
    { time: '19:00-21:00', rate: 5.1, impact: 'peak', orders: 112 },
    { time: '21:00-23:00', rate: 3.2, impact: 'medium', orders: 58 }
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export default function ConversionTrends({
    dailyData = defaultDailyData,
    hourlyData = defaultHourlyData
}: ConversionTrendsProps) {
    const maxRevenue = Math.max(...dailyData.map(d => d.revenue));

    const getImpactColor = (impact: TimeSlot['impact']) => {
        switch (impact) {
            case 'peak': return 'border-l-green-500 bg-green-50';
            case 'high': return 'border-l-blue-500 bg-blue-50';
            case 'medium': return 'border-l-orange-500 bg-orange-50';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Daily Revenue Trends */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-b from-white to-stone-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <h3 className="text-base font-semibold text-gray-900">Daily Revenue</h3>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                            7-Day Trend
                        </Badge>
                    </div>
                </div>

                <div className="p-5 space-y-3">
                    {dailyData.map((day) => {
                        const percentage = (day.revenue / maxRevenue) * 100;
                        return (
                            <div key={day.day} className="flex items-center gap-3">
                                <div className="w-20 text-xs font-medium text-gray-600">{day.day}</div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatCurrency(day.revenue)}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-semibold ${day.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {day.change > 0 ? '+' : ''}{day.change}%
                                            </span>
                                            {day.isOptimal && (
                                                <Badge className="bg-green-100 text-green-700 border-0 text-xs px-1.5 py-0">
                                                    Optimal
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full bg-blue-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Peak Conversion Hours */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-b from-white to-stone-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h3 className="text-base font-semibold text-gray-900">Peak Hours</h3>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                            Conversion Peaks
                        </Badge>
                    </div>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {hourlyData.map((slot) => (
                            <div
                                key={slot.time}
                                className={`border-l-4 rounded-lg p-3 ${getImpactColor(slot.impact)}`}
                            >
                                <div className="font-medium text-gray-900 text-sm">{slot.time}</div>
                                <div className="text-xl font-bold text-gray-900">{slot.rate}%</div>
                                <div className="text-xs text-gray-500">{slot.orders} conversions</div>
                            </div>
                        ))}
                    </div>

                    {/* Recommendations */}
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-blue-700">Increase evening budgets</div>
                            <div className="text-xs text-blue-600 mt-0.5">
                                19:00-21:00 shows 23% higher conversion rates
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-green-700">Weekend optimization</div>
                            <div className="text-xs text-green-600 mt-0.5">
                                Saturday revenue 22% above average
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
