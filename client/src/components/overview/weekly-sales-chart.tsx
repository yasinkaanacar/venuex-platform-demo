import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    week: "Week 32",
    period: "Aug 4, 2025 to Aug 10, 2025",
    onlineSales: 5000,
    offlineSales: 18000,
    cost: 580000
  },
  {
    week: "Week 33", 
    period: "Aug 11, 2025 to Aug 17, 2025",
    onlineSales: 5000,
    offlineSales: 17000,
    cost: 580000
  },
  {
    week: "Week 34",
    period: "Aug 18, 2025 to Aug 24, 2025", 
    onlineSales: 4500,
    offlineSales: 11000,
    cost: 580000
  },
  {
    week: "Week 35",
    period: "Aug 25, 2025 to Aug 31, 2025",
    onlineSales: 3000,
    offlineSales: 1000,
    cost: 580000
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{data.period}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Online Sales: ${data.onlineSales.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Offline Sales: ${data.offlineSales.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Cost: ${data.cost.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const formatXAxisLabel = (value: string, index: number) => {
  const item = data[index];
  return `${item.period} (${item.week})`;
};

export default function WeeklySalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Online x Offline (sales volume) - By week
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 20,
                right: 80,
                bottom: 60,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="week"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={0}
                textAnchor="middle"
                height={80}
                tickFormatter={(value, index) => {
                  const item = data[index];
                  return `${item.period} (${item.week})`;
                }}
              />
              <YAxis 
                yAxisId="sales"
                orientation="left"
                tick={{ fontSize: 12 }}
                domain={[0, 20000]}
                tickFormatter={(value) => `${value / 1000}K`}
                label={{ 
                  value: 'Online Sales / Offline Sales', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '12px' }
                }}
              />
              <YAxis 
                yAxisId="cost"
                orientation="right"
                tick={{ fontSize: 12 }}
                domain={[0, 600000]}
                tickFormatter={(value) => `${value / 1000}K`}
                label={{ 
                  value: 'Cost', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fontSize: '12px' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top"
                height={36}
                iconType="rect"
                wrapperStyle={{ paddingBottom: '20px' }}
              />
              <Bar 
                yAxisId="sales"
                dataKey="onlineSales" 
                name="Online Sales"
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                yAxisId="sales"
                dataKey="offlineSales" 
                name="Offline Sales"
                fill="#dc2626"
                radius={[2, 2, 0, 0]}
              />
              <Line 
                yAxisId="cost"
                type="monotone" 
                dataKey="cost" 
                name="Cost"
                stroke="#eab308"
                strokeWidth={3}
                dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#eab308', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}