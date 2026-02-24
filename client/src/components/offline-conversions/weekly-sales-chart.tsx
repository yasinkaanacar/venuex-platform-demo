import { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, X } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { useLocales } from '@/lib/formatters';

const fTRY = (v: number) => `₺${v.toLocaleString('tr-TR')}`;

const data = [
  {
    week: "W1",
    period: "29 Dec 2025 – 4 Jan 2026",
    onlineSales: 285000,
    offlineSales: 158000,
    onlineSalesCount: 278,
    offlineSalesCount: 275,
    adSpend: 62000,
    conversion: 4.1,
  },
  {
    week: "W2",
    period: "5 Jan – 11 Jan 2026",
    onlineSales: 268000,
    offlineSales: 145000,
    onlineSalesCount: 262,
    offlineSalesCount: 260,
    adSpend: 59000,
    conversion: 3.9,
  },
  {
    week: "W3",
    period: "12 Jan – 18 Jan 2026",
    onlineSales: 292000,
    offlineSales: 162000,
    onlineSalesCount: 285,
    offlineSalesCount: 282,
    adSpend: 63000,
    conversion: 4.3,
  },
  {
    week: "W4",
    period: "19 Jan – 25 Jan 2026",
    onlineSales: 275000,
    offlineSales: 148000,
    onlineSalesCount: 268,
    offlineSalesCount: 265,
    adSpend: 60000,
    conversion: 4.0,
  },
  {
    week: "W5",
    period: "26 Jan – 1 Feb 2026",
    onlineSales: 310000,
    offlineSales: 170000,
    onlineSalesCount: 302,
    offlineSalesCount: 296,
    adSpend: 65000,
    conversion: 4.5,
  },
  {
    week: "W6",
    period: "2 Feb – 8 Feb 2026",
    onlineSales: 262000,
    offlineSales: 140000,
    onlineSalesCount: 256,
    offlineSalesCount: 252,
    adSpend: 58000,
    conversion: 3.8,
  },
  {
    week: "W7",
    period: "9 Feb – 15 Feb 2026",
    onlineSales: 278000,
    offlineSales: 152000,
    onlineSalesCount: 272,
    offlineSalesCount: 268,
    adSpend: 61000,
    conversion: 4.1,
  },
  {
    week: "W8",
    period: "16 Feb – 22 Feb 2026",
    onlineSales: 255000,
    offlineSales: 138000,
    onlineSalesCount: 250,
    offlineSalesCount: 248,
    adSpend: 57000,
    conversion: 3.7,
  }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const totalSales = d.onlineSales + d.offlineSales;
    const roas = (totalSales / d.adSpend).toFixed(2);
    const onlineROAS = (d.onlineSales / d.adSpend).toFixed(2);
    const offlineROAS = (d.offlineSales / d.adSpend).toFixed(2);

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[280px] z-[9999]" style={{ pointerEvents: 'none' }}>
        <div className="border-b border-gray-200 pb-2 mb-3">
          <p className="font-semibold text-gray-900 text-sm">{d.period}</p>
          <p className="text-xs text-gray-500">{d.week}</p>
        </div>
        <div className="pt-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total Revenue:</span>
            <span className="text-sm font-bold text-green-600">{fTRY(totalSales)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total Transactions:</span>
            <span className="text-sm font-bold text-gray-900">{(d.onlineSalesCount + d.offlineSalesCount).toLocaleString('tr-TR')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Online Transactions:</span>
            <span className="text-sm font-bold text-blue-600">{d.onlineSalesCount.toLocaleString('tr-TR')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Offline Transactions:</span>
            <span className="text-sm font-bold text-orange-600">{d.offlineSalesCount.toLocaleString('tr-TR')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Overall ROAS:</span>
            <span className="text-sm font-bold text-indigo-600">{roas}x</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Online ROAS:</span>
            <span className="text-sm font-bold text-cyan-600">{onlineROAS}x</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Offline ROAS:</span>
            <span className="text-sm font-bold text-teal-600">{offlineROAS}x</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Ad Spend:</span>
            <span className="text-sm font-bold text-rose-600">{fTRY(d.adSpend)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Conversion Rate:</span>
            <span className="text-sm font-bold text-emerald-600">{d.conversion}%</span>
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

const getTotalSales = () => data.reduce((acc, curr) => acc + curr.onlineSales + curr.offlineSales, 0);
const getTotalOnlineSales = () => data.reduce((acc, curr) => acc + curr.onlineSales, 0);
const getTotalOfflineSales = () => data.reduce((acc, curr) => acc + curr.offlineSales, 0);
const getTotalOnlineSalesCount = () => data.reduce((acc, curr) => acc + curr.onlineSalesCount, 0);
const getTotalOfflineSalesCount = () => data.reduce((acc, curr) => acc + curr.offlineSalesCount, 0);
const getTotalAdSpend = () => data.reduce((acc, curr) => acc + curr.adSpend, 0);

const getAverageROAS = () => (getTotalSales() / getTotalAdSpend()).toFixed(2);
const getAverageOnlineROAS = () => (getTotalOnlineSales() / getTotalAdSpend()).toFixed(2);
const getAverageOfflineROAS = () => (getTotalOfflineSales() / getTotalAdSpend()).toFixed(2);

const getWeekOverWeekGrowth = () => {
  if (data.length < 2) return { change: "0", isPositive: true };
  const lastWeek = data[data.length - 1];
  const previousWeek = data[data.length - 2];
  return calculateTrend(
    lastWeek.onlineSales + lastWeek.offlineSales,
    previousWeek.onlineSales + previousWeek.offlineSales
  );
};

export default function WeeklySalesChart() {
  const { t } = useLocales();
  const oc = (key: string) => t(`offlineConversions.${key}`);
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
            <h3 className="text-base font-semibold text-gray-900">{oc('weeklySalesPerformance')}</h3>
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
            <p className="text-xs text-gray-500 mb-0.5">{oc('totalRevenue')}</p>
            <p className="text-lg font-bold text-gray-900">{fTRY(totalSales)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{oc('onlineSales')}</p>
            <p className="text-lg font-bold text-blue-600">{fTRY(totalOnlineSales)}</p>
            <p className="text-xs text-gray-400">{totalOnlineSalesCount.toLocaleString('tr-TR')} transactions</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{oc('offlineSales')}</p>
            <p className="text-lg font-bold text-orange-600">{fTRY(totalOfflineSales)}</p>
            <p className="text-xs text-gray-400">{totalOfflineSalesCount.toLocaleString('tr-TR')} transactions</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{oc('avgRoas')}</p>
            <p className="text-lg font-bold text-indigo-600">{averageROAS}x</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{oc('onlineRoas')}</p>
            <p className="text-lg font-bold text-cyan-600">{averageOnlineROAS}x</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{oc('offlineRoas')}</p>
            <p className="text-lg font-bold text-teal-600">{averageOfflineROAS}x</p>
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
              tickFormatter={(value) => `₺${value / 1000}K`}
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
              name="Online Sales (₺)"
              stackId="a"
              fill="#3b82f6"
              radius={[0, 0, 0, 0]}
              barSize={32}
            />
            <Bar
              yAxisId="left"
              dataKey="offlineSales"
              name="Offline Sales (₺)"
              stackId="a"
              fill="#f97316"
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
              stroke="#fb923c"
              strokeWidth={2}
              dot={{ fill: '#fb923c', strokeWidth: 2, r: 4 }}
            />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
