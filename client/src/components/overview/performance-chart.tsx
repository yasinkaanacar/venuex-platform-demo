import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PerformanceChart() {
  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('-')) return TrendingDown;
    return TrendingUp;
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Customer Journey Funnel
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Online-to-offline conversion metrics
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6" data-testid="chart-performance">
          {/* Ad Spend & Clicks */}
          <div className="flex items-center justify-between">
            <div className="bg-muted/30 rounded-lg p-4 w-48">
              <div className="text-sm font-medium text-muted-foreground mb-1">Cost</div>
              <div className="text-xl font-bold text-foreground">£3.90M</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                -9.5%
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 w-48">
              <div className="text-sm font-medium text-muted-foreground mb-1">Clicks</div>
              <div className="text-xl font-bold text-foreground">1.21M</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                -11.3%
              </div>
            </div>
          </div>

          {/* Store Visits */}
          <div className="flex justify-center">
            <div className="bg-muted/30 rounded-lg p-4 w-48">
              <div className="text-sm font-medium text-muted-foreground mb-1">Store Visits</div>
              <div className="text-xl font-bold text-foreground">78.18K</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                -17.40%
              </div>
            </div>
          </div>

          {/* Online & Offline Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Online Section */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">ONLINE</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Online Sales</div>
                  <div className="text-lg font-bold">15.32K</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -19.90%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Online Revenue</div>
                  <div className="text-lg font-bold">£47.95M</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -20.20%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Online ROAS</div>
                  <div className="text-lg font-bold">12.29</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -11.90%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Online AOV</div>
                  <div className="text-lg font-bold">£3.13K</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -0.40%
                  </div>
                </div>
              </div>
            </div>

            {/* Offline Section */}
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">OFFLINE</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Offline Sales</div>
                  <div className="text-lg font-bold">39.12K</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -16.70%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Offline Revenue</div>
                  <div className="text-lg font-bold">£160.75M</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -16.20%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Offline ROAS</div>
                  <div className="text-lg font-bold">41.18</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -7.40%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Offline AOV</div>
                  <div className="text-lg font-bold">£4.11K</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +0.80%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Omni Channel Results */}
          <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
            <div>
              <div className="text-xs text-muted-foreground">Omni AOV</div>
              <div className="text-lg font-bold">£3.62K</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.20%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Omni ROAS</div>
              <div className="text-lg font-bold">53.47</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                -8.50%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Omni Revenue</div>
              <div className="text-lg font-bold">£208.70M</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                -17.20%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
