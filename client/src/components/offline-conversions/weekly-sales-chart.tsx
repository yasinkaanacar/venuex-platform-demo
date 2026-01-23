import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Chip } from '@mui/material';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Store } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';

const data = [
  {
    week: "Week 29",
    period: "Jul 14, 2025 to Jul 20, 2025",
    onlineSales: 6200,
    offlineSales: 22000,
    onlineAdSpend: 1850,
    offlineAdSpend: 4200,
    conversion: 4.2,
    visitors: 145000,
    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 30",
    period: "Jul 21, 2025 to Jul 27, 2025",
    onlineSales: 5800,
    offlineSales: 20500,
    onlineAdSpend: 1950,
    offlineAdSpend: 3850,
    conversion: 3.8,
    visitors: 138000,
    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 31",
    period: "Jul 28, 2025 to Aug 3, 2025",
    onlineSales: 5400,
    offlineSales: 19000,
    onlineAdSpend: 1680,
    offlineAdSpend: 4750,
    conversion: 3.5,
    visitors: 132000,
    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 32",
    period: "Aug 4, 2025 to Aug 10, 2025",
    onlineSales: 5000,
    offlineSales: 18000,
    onlineAdSpend: 1250,
    offlineAdSpend: 3600,
    conversion: 3.2,
    visitors: 128000,
    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 33", 
    period: "Aug 11, 2025 to Aug 17, 2025",
    onlineSales: 5000,
    offlineSales: 17000,
    onlineAdSpend: 1670,
    offlineAdSpend: 2550,
    conversion: 3.0,
    visitors: 125000,
    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 34",
    period: "Aug 18, 2025 to Aug 24, 2025", 
    onlineSales: 4500,
    offlineSales: 11000,
    onlineAdSpend: 1125,
    offlineAdSpend: 3300,
    conversion: 2.1,
    visitors: 118000,
    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 35",
    period: "Aug 25, 2025 to Aug 31, 2025",
    onlineSales: 3000,
    offlineSales: 1000,
    onlineAdSpend: 900,
    offlineAdSpend: 2100,
    conversion: 0.8,
    visitors: 95000,
    get cost() { return this.onlineAdSpend + this.offlineAdSpend; },
    get onlineROAS() { return parseFloat(((this.onlineSales / this.onlineAdSpend) * 100).toFixed(1)); },
    get offlineROAS() { return parseFloat(((this.offlineSales / this.offlineAdSpend) * 100).toFixed(1)); }
  },
  {
    week: "Week 36",
    period: "Sep 1, 2025 to Sep 7, 2025",
    onlineSales: 4200,
    offlineSales: 8500,
    onlineAdSpend: 1400,
    offlineAdSpend: 2550,
    conversion: 2.4,
    visitors: 108000,
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
    const onlineShare = ((data.onlineSales / totalSales) * 100).toFixed(1);
    
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 min-w-[280px]">
        <div className="border-b border-gray-200 dark:border-gray-600 pb-2 mb-3">
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{data.period}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{data.week}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-sm"></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Online Sales</span>
            </div>
            <p className="text-sm font-bold text-blue-600">${data.onlineSales.toLocaleString()}</p>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-sm"></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Offline Sales</span>
            </div>
            <p className="text-sm font-bold text-red-600">${data.offlineSales.toLocaleString()}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-sm"></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Ad Spend</span>
            </div>
            <p className="text-sm font-bold text-amber-600">${data.cost.toLocaleString()}</p>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-sm"></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Visitors</span>
            </div>
            <p className="text-sm font-bold text-purple-600">{data.visitors.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Total Revenue:</span>
            <span className="text-sm font-bold text-green-600">${totalSales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Overall ROAS:</span>
            <span className="text-sm font-bold text-indigo-600">{roas}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Online ROAS:</span>
            <span className="text-sm font-bold text-cyan-600">{data.onlineROAS}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Offline ROAS:</span>
            <span className="text-sm font-bold text-teal-600">{data.offlineROAS}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Online Ad Spend:</span>
            <span className="text-sm font-bold text-blue-600">${data.onlineAdSpend.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Offline Ad Spend:</span>
            <span className="text-sm font-bold text-red-600">${data.offlineAdSpend.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Online Share:</span>
            <span className="text-sm font-bold text-blue-600">{onlineShare}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Conversion Rate:</span>
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
  const lastWeek = data[data.length - 1];
  const previousWeek = data[data.length - 2];
  const lastWeekTotal = lastWeek.onlineSales + lastWeek.offlineSales;
  const previousWeekTotal = previousWeek.onlineSales + previousWeek.offlineSales;
  return calculateTrend(lastWeekTotal, previousWeekTotal);
};

export default function WeeklySalesChart() {
  const totalSales = getTotalSales();
  const averageROAS = getAverageROAS();
  const averageOnlineROAS = getAverageOnlineROAS();
  const averageOfflineROAS = getAverageOfflineROAS();
  const weekGrowth = getWeekOverWeekGrowth();
  
  return null;
}
