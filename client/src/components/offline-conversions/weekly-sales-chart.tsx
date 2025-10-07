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
  
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <CardHeader
        title="Online x Offline (sales volume) - By week"
        subheader="Revenue performance across digital and physical channels"
        action={
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-bold text-green-600">${totalSales.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Overall ROAS</p>
              <p className="text-lg font-bold text-indigo-600">{averageROAS}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Online ROAS</p>
              <p className="text-lg font-bold text-cyan-600">{averageOnlineROAS}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Offline ROAS</p>
              <p className="text-lg font-bold text-teal-600">{averageOfflineROAS}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Week Growth
                {weekGrowth.isPositive ? 
                  <TrendingUp className="w-3 h-3 text-green-500" /> : 
                  <TrendingDown className="w-3 h-3 text-red-500" />
                }
              </p>
              <p className={`text-lg font-bold ${weekGrowth.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {weekGrowth.isPositive ? '+' : ''}{weekGrowth.change}%
              </p>
            </div>
          </div>
        }
      />
      
      <div className="flex items-center gap-2 px-6 pb-4">
        <Chip 
          icon={<ShoppingCart className="w-3 h-3" />}
          label="Online Channel"
          size="small"
          variant="outlined"
        />
        <Chip 
          icon={<Store className="w-3 h-3" />}
          label="Offline Channel"
          size="small"
          variant="outlined"
        />
        <Chip 
          icon={<DollarSign className="w-3 h-3" />}
          label="Ad Investment"
          size="small"
          variant="outlined"
        />
      </div>
      
      <CardContent className="pt-0">
        <div className="h-96 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg -z-10"></div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 30,
                right: 90,
                bottom: 70,
                left: 30,
              }}
            >
              <defs>
                <linearGradient id="onlineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="offlineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#991b1b" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="costGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                  <stop offset="50%" stopColor="#eab308" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#d97706" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="onlineROASGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="offlineROASGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="4 4" 
                stroke="#e2e8f0" 
                strokeOpacity={0.6}
                vertical={false}
              />
              
              <XAxis 
                dataKey="week"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={80}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              
              <YAxis 
                yAxisId="sales"
                orientation="left"
                tick={{ fontSize: 11, fill: '#64748b' }}
                domain={[0, 25000]}
                tickFormatter={(value) => `${value / 1000}K`}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                tickLine={{ stroke: '#cbd5e1' }}
                label={{ 
                  value: 'Sales Volume (K)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '12px', fill: '#475569' }
                }}
              />
              
              <YAxis 
                yAxisId="cost"
                orientation="right"
                tick={{ fontSize: 11, fill: '#64748b' }}
                domain={[5000, 15000]}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                tickLine={{ stroke: '#cbd5e1' }}
                label={{ 
                  value: 'Ad Spend (K)', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fontSize: '12px', fill: '#475569' }
                }}
              />
              
              <YAxis 
                yAxisId="roas"
                orientation="right"
                tick={false}
                axisLine={false}
                tickLine={false}
                domain={[0, 150]}
              />
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ 
                  fill: 'rgba(59, 130, 246, 0.1)', 
                  stroke: '#3b82f6',
                  strokeWidth: 2,
                  strokeDasharray: '4 4'
                }}
              />
              
              <Legend 
                verticalAlign="top"
                height={50}
                iconType="rect"
                wrapperStyle={{ 
                  paddingBottom: '25px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              />
              
              <Bar 
                yAxisId="sales"
                dataKey="onlineSales" 
                name="Online Sales"
                fill="url(#onlineGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              
              <Bar 
                yAxisId="sales"
                dataKey="offlineSales" 
                name="Offline Sales"
                fill="url(#offlineGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              
              <Line 
                yAxisId="cost"
                type="monotone" 
                dataKey="cost" 
                name="Ad Spend"
                stroke="url(#costGradient)"
                strokeWidth={4}
                dot={{ 
                  fill: '#f59e0b', 
                  strokeWidth: 3, 
                  r: 6,
                  stroke: '#ffffff',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#f59e0b', 
                  strokeWidth: 3,
                  fill: '#ffffff',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}
              />
              
              <Line 
                yAxisId="roas"
                type="monotone" 
                dataKey="onlineROAS" 
                name="Online ROAS"
                stroke="#06b6d4"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ 
                  fill: '#06b6d4', 
                  strokeWidth: 2, 
                  r: 4,
                  stroke: '#ffffff'
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: '#06b6d4', 
                  strokeWidth: 2,
                  fill: '#ffffff'
                }}
              />
              
              <Line 
                yAxisId="roas"
                type="monotone" 
                dataKey="offlineROAS" 
                name="Offline ROAS"
                stroke="#14b8a6"
                strokeWidth={3}
                strokeDasharray="10 5"
                dot={{ 
                  fill: '#14b8a6', 
                  strokeWidth: 2, 
                  r: 4,
                  stroke: '#ffffff'
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: '#14b8a6', 
                  strokeWidth: 2,
                  fill: '#ffffff'
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
      </CardContent>
    </Card>
  );
}
