import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockChartData } from '@/lib/mock-data';

export default function PerformanceChart() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Multi-Platform Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Cross-platform metrics comparison over time
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chart-1 rounded"></div>
              <span className="text-muted-foreground">Google Ads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chart-2 rounded"></div>
              <span className="text-muted-foreground">Meta Ads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chart-3 rounded"></div>
              <span className="text-muted-foreground">TikTok Ads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chart-4 rounded"></div>
              <span className="text-muted-foreground">Apple Maps</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80" data-testid="chart-performance">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="google" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                name="Google Ads"
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Meta Ads"
              />
              <Line 
                type="monotone" 
                dataKey="tiktok" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                name="TikTok Ads"
              />
              <Line 
                type="monotone" 
                dataKey="apple" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={2}
                name="Apple Maps"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
