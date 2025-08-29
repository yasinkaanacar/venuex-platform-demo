import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PerformanceChart() {
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
        <div className="relative" data-testid="chart-performance">
          {/* Funnel Background */}
          <div className="bg-gradient-to-b from-blue-50 to-orange-50 dark:from-blue-950/10 dark:to-orange-950/10 rounded-lg p-8 relative overflow-hidden">
            
            {/* Top Row: Cost and Clicks */}
            <div className="flex justify-between items-start mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border w-36">
                <div className="text-xs text-gray-500 mb-1">Cost</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">£3.90M</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -9.5%
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border w-36">
                <div className="text-xs text-gray-500 mb-1">Clicks</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">1.21M</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -11.3%
                </div>
              </div>
            </div>

            {/* Middle: Store Visits */}
            <div className="flex justify-center mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border w-40">
                <div className="text-xs text-gray-500 mb-1">Store Visits</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">78.18K</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -17.40%
                </div>
              </div>
            </div>

            {/* Split: Online and Offline */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Online Section */}
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 relative">
                <div className="absolute -top-2 left-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium">ONLINE</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Online Sales</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">15.32K</div>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -19.90%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Online Revenue</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">£47.95M</div>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -20.20%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Online ROAS</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">12.29</div>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -11.90%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Online AOV</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">£3.13K</div>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -0.40%
                    </div>
                  </div>
                </div>
              </div>

              {/* Offline Section */}
              <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-4 relative">
                <div className="absolute -top-2 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-medium">OFFLINE</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Offline Sales</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">39.12K</div>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -16.70%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Offline Revenue</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">£160.75M</div>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -16.20%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Offline ROAS</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">41.18</div>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -7.40%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Offline AOV</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">£4.11K</div>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +0.80%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Omni Channel Results */}
            <div className="flex justify-center gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border flex-1 max-w-32">
                <div className="text-xs text-gray-500 mb-1">Omni AOV</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">£3.62K</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.20%
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border flex-1 max-w-32">
                <div className="text-xs text-gray-500 mb-1">Omni ROAS</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">53.47</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -8.50%
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border flex-1 max-w-36">
                <div className="text-xs text-gray-500 mb-1">Omni Revenue</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">£208.70M</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -17.20%
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
