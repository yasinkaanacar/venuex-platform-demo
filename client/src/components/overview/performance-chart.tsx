import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import funnelImage from '@assets/Screenshot 2025-08-29 at 18.31.46_1756481891401.png';
import EnrichmentSuggestions from './enrichment-suggestions';

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
          <img 
            src={funnelImage} 
            alt="Customer Journey Funnel" 
            className="w-full rounded-lg shadow-sm"
          />
        </div>
        
        {/* Top Performing Store Locations Section */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Top Performing Store Locations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Store visits and conversions by location</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Store Location
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Calls
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Directions
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sales Value
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Visit→Sale Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Istanbul - Beyoğlu</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">İstiklal Caddesi 125</div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 text-gray-900 dark:text-white font-medium">1,636</td>
                  <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-300">276</td>
                  <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-300">549</td>
                  <td className="text-center py-4 px-4 text-gray-900 dark:text-white font-medium">$68,712</td>
                  <td className="text-center py-4 px-4 text-green-600 font-medium">4.2%</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Ankara - Çankaya</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Tunalı Hilmi Caddesi 89</div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 text-gray-900 dark:text-white font-medium">1,395</td>
                  <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-300">242</td>
                  <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-300">514</td>
                  <td className="text-center py-4 px-4 text-gray-900 dark:text-white font-medium">$58,590</td>
                  <td className="text-center py-4 px-4 text-green-600 font-medium">4.2%</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">İzmir - Alsancak</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Kordon Caddesi 67</div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 text-gray-900 dark:text-white font-medium">1,608</td>
                  <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-300">267</td>
                  <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-300">559</td>
                  <td className="text-center py-4 px-4 text-gray-900 dark:text-white font-medium">$67,536</td>
                  <td className="text-center py-4 px-4 text-green-600 font-medium">4.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Data Quality Assessment Section */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Quality Assessment</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Overall Score: <span className="text-green-600 font-semibold">97%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location Data */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Location Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Business Names</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Addresses</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">98%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Phone Numbers</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Opening Hours</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">96%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Data */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Inventory Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Product Availability</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '99%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">99%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Price Accuracy</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '97%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">97%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Stock Levels</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Product Images</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">95%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Data */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Customer Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Email Addresses</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">98%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Transaction IDs</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Store IDs</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Purchase Values</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">96%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Enrichment Suggestions */}
        <div className="mt-8">
          <EnrichmentSuggestions />
        </div>
      </CardContent>
    </Card>
  );
}
