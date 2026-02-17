import { useState } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Chip } from '@mui/material';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Store, AlertTriangle, X } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';

const data = [
  {
    week: "Week 29",
    period: "Jul 14, 2025 to Jul 20, 2025",
    onlineSales: 6200,
    offlineSales: 22000,
    onlineSalesCount: 124,
    offlineSalesCount: 286,
    onlineAdSpend: 1850,
    offlineAdSpend: 4200,
    conversion: 4.2,

    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 30",
    period: "Jul 21, 2025 to Jul 27, 2025",
    onlineSales: 5800,
    offlineSales: 20500,
    onlineSalesCount: 115,
    offlineSalesCount: 268,
    onlineAdSpend: 1950,
    offlineAdSpend: 3850,
    conversion: 3.8,

    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 31",
    period: "Jul 28, 2025 to Aug 3, 2025",
    onlineSales: 5400,
    offlineSales: 19000,
    onlineSalesCount: 108,
    offlineSalesCount: 247,
    onlineAdSpend: 1680,
    offlineAdSpend: 4750,
    conversion: 3.5,

    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 32",
    period: "Aug 4, 2025 to Aug 10, 2025",
    onlineSales: 5000,
    offlineSales: 18000,
    onlineSalesCount: 100,
    offlineSalesCount: 234,
    onlineAdSpend: 1250,
    offlineAdSpend: 3600,
    conversion: 3.2,

    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 33",
    period: "Aug 11, 2025 to Aug 17, 2025",
    onlineSales: 5000,
    offlineSales: 17000,
    onlineSalesCount: 100,
    offlineSalesCount: 221,
    onlineAdSpend: 1670,
    offlineAdSpend: 2550,
    conversion: 3.0,

    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 34",
    period: "Aug 18, 2025 to Aug 24, 2025",
    onlineSales: 4500,
    offlineSales: 11000,
    onlineSalesCount: 90,
    offlineSalesCount: 143,
    onlineAdSpend: 1125,
    offlineAdSpend: 3300,
    conversion: 2.1,

    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 35",
    period: "Aug 25, 2025 to Aug 31, 2025",
    onlineSales: 3000,
    offlineSales: 1000,
    onlineSalesCount: 60,
    offlineSalesCount: 13,
    onlineAdSpend: 900,
    offlineAdSpend: 2100,
    conversion: 0.8,

    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 36",
    period: "Sep 1, 2025 to Sep 7, 2025",
    onlineSales: 4200,
    offlineSales: 8500,
    onlineSalesCount: 84,
    offlineSalesCount: 110,
    onlineAdSpend: 1400,
    offlineAdSpend: 2550,
    conversion: 2.4,

    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const totalSales = data.onlineSales + data.offlineSales;
    const roas = ((totalSales / data.cost) * 100).toFixed(1);

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[280px] z-[9999]" style={{ pointerEvents: 'none' }}>
        <div className="border-b border-gray-200 pb-2 mb-3">
          <p className="font-semibold text-gray-900 text-sm">{data.period}</p>
          <p className="text-xs text-gray-500">{data.week}</p>
        </div>
        <div className="pt-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total Revenue:</span>
            <span className="text-sm font-bold text-green-600">${totalSales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total Transactions:</span>
            <span className="text-sm font-bold text-gray-900">{(data.onlineSalesCount + data.offlineSalesCount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Online Transactions:</span>
            <span className="text-sm font-bold text-blue-600">{data.onlineSalesCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Offline Transactions:</span>
            <span className="text-sm font-bold text-red-600">{data.offlineSalesCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Overall ROAS:</span>
            <span className="text-sm font-bold text-indigo-600">{roas}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Online ROAS:</span>
            <span className="text-sm font-bold text-cyan-600">{data.onlineROAS}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Offline ROAS:</span>
            <span className="text-sm font-bold text-teal-600">{data.offlineROAS}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Online Ad Spend:</span>
            <span className="text-sm font-bold text-blue-600">${data.onlineAdSpend.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Offline Ad Spend:</span>
            <span className="text-sm font-bold text-red-600">${data.offlineAdSpend.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Conversion Rate:</span>
            <span className="text-sm font-bold text-emerald-600">{data.conversion}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const calculateTrend = (currentValue: number, previousValue: number) => {
  const change = ((currentValue - previousValue) / previousValue) * 100;
  return { change: change.toFixed(1), isPositive: change >= 0 };
};

const getTotalSales = () => {
  return data.reduce((acc, curr) => acc + curr.onlineSales + curr.offlineSales, 0);
};

const getAverageROAS = () => {
  const totalRevenue = getTotalSales();
  const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
  return ((totalRevenue / totalCost) * 100).toFixed(1);
};

const getAverageOnlineROAS = () => {
  const avgOnlineROAS = data.reduce((acc, curr) => acc + curr.onlineROAS, 0) / data.length;
  return avgOnlineROAS.toFixed(1);
};

const getAverageOfflineROAS = () => {
  const avgOfflineROAS = data.reduce((acc, curr) => acc + curr.offlineROAS, 0) / data.length;
  return avgOfflineROAS.toFixed(1);
};

const getWeekOverWeekGrowth = () => {
  // If we have at least 2 weeks of data
  if (data.length < 2) return { change: "0", isPositive: true };

  const lastWeek = data[data.length - 1];
  const previousWeek = data[data.length - 2];
  const lastWeekTotal = lastWeek.onlineSales + lastWeek.offlineSales;
  const previousWeekTotal = previousWeek.onlineSales + previousWeek.offlineSales;
  return calculateTrend(lastWeekTotal, previousWeekTotal);
};

const getTotalOnlineSales = () => {
  return data.reduce((acc, curr) => acc + curr.onlineSales, 0);
};

const getTotalOfflineSales = () => {
  return data.reduce((acc, curr) => acc + curr.offlineSales, 0);
};

const getTotalOnlineSalesCount = () => {
  return data.reduce((acc, curr) => acc + curr.onlineSalesCount, 0);
};

const getTotalOfflineSalesCount = () => {
  return data.reduce((acc, curr) => acc + curr.offlineSalesCount, 0);
};

export default function WeeklySalesChart() {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'google' | 'meta' | 'tiktok'>('all');
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const totalSales = getTotalSales();
  const totalOnlineSales = getTotalOnlineSales();
  const totalOfflineSales = getTotalOfflineSales();
  const totalOnlineSalesCount = getTotalOnlineSalesCount();
  const totalOfflineSalesCount = getTotalOfflineSalesCount();
  const averageROAS = getAverageROAS();
  const averageOnlineROAS = getAverageOnlineROAS();
  const averageOfflineROAS = getAverageOfflineROAS();
  const weekGrowth = getWeekOverWeekGrowth();

  const handlePlatformChange = (platform: 'all' | 'google' | 'meta' | 'tiktok') => {
    setSelectedPlatform(platform);
    if (platform === 'all') {
      setShowDisclaimer(true);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full relative">
      {/* Disclaimer Popup */}
      {showDisclaimer && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-800 mb-1">Deduplication Notice</h4>
              <p className="text-xs text-amber-700">
                When viewing all platforms, there may be duplications as platforms sometimes attribute the same sales at the same time. For accurate attribution, view individual platform data.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="text-amber-600 hover:text-amber-800 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="vx-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-md">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Weekly Sales Performance</h3>
          </div>
          <div className="flex items-center gap-3">
            {/* Platform Selector */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handlePlatformChange('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${selectedPlatform === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => handlePlatformChange('google')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${selectedPlatform === 'google'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <SiGoogle className="w-3 h-3" />
                Google
              </button>
              <button
                onClick={() => handlePlatformChange('meta')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${selectedPlatform === 'meta'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <SiMeta className="w-3 h-3" />
                Meta
              </button>
              <button
                onClick={() => handlePlatformChange('tiktok')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${selectedPlatform === 'tiktok'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <SiTiktok className="w-3 h-3" />
                TikTok
              </button>
            </div>

            {/* Trend Badge */}
            <span className={`flex items-center px-2 py-0.5 rounded text-xs font-medium ${weekGrowth.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {weekGrowth.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {weekGrowth.change}%
            </span>

          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Total Revenue</p>
            <p className="text-lg font-bold text-gray-900">${totalSales.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Online Sales</p>
            <p className="text-lg font-bold text-blue-600">${totalOnlineSales.toLocaleString()}</p>
            <p className="text-xs text-gray-400">{totalOnlineSalesCount.toLocaleString()} transactions</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Offline Sales</p>
            <p className="text-lg font-bold text-red-600">${totalOfflineSales.toLocaleString()}</p>
            <p className="text-xs text-gray-400">{totalOfflineSalesCount.toLocaleString()} transactions</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Avg ROAS</p>
            <p className="text-lg font-bold text-indigo-600">{averageROAS}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Online ROAS</p>
            <p className="text-lg font-bold text-cyan-600">{averageOnlineROAS}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Offline ROAS</p>
            <p className="text-lg font-bold text-teal-600">{averageOfflineROAS}%</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full mt-4 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 60, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => value}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} wrapperStyle={{ zIndex: 9999 }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#374151' }}
            />
            <Bar
              yAxisId="left"
              dataKey="onlineSales"
              name="Online Sales ($)"
              stackId="a"
              fill="#3b82f6"
              radius={[0, 0, 0, 0]}
              barSize={32}
            />
            <Bar
              yAxisId="left"
              dataKey="offlineSales"
              name="Offline Sales ($)"
              stackId="a"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="onlineSalesCount"
              name="Online Count"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="offlineSalesCount"
              name="Offline Count"
              stroke="#f87171"
              strokeWidth={2}
              dot={{ fill: '#f87171', strokeWidth: 2, r: 4 }}
            />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
