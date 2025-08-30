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
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Top Performing Store Locations</CardTitle>
            <p className="text-sm text-muted-foreground">Store visits and conversions by location</p>
          </CardHeader>
          
          <CardContent>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-foreground">Istanbul - Beyoğlu</div>
                      <div className="text-sm text-muted-foreground">İstiklal Caddesi 125</div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 text-foreground font-medium">1,636</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">276</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">549</td>
                  <td className="text-center py-4 px-4 text-foreground font-medium">$68,712</td>
                  <td className="text-center py-4 px-4 text-green-600 font-medium">4.2%</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-foreground">Ankara - Çankaya</div>
                      <div className="text-sm text-muted-foreground">Tunalı Hilmi Caddesi 89</div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 text-foreground font-medium">1,395</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">242</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">514</td>
                  <td className="text-center py-4 px-4 text-foreground font-medium">$58,590</td>
                  <td className="text-center py-4 px-4 text-green-600 font-medium">4.2%</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-foreground">İzmir - Alsancak</div>
                      <div className="text-sm text-muted-foreground">Kordon Caddesi 67</div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 text-foreground font-medium">1,608</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">267</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">559</td>
                  <td className="text-center py-4 px-4 text-foreground font-medium">$67,536</td>
                  <td className="text-center py-4 px-4 text-green-600 font-medium">4.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
          </CardContent>
        </Card>
        
        {/* Data Quality Assessment Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Data Quality Assessment</CardTitle>
              <div className="text-sm text-muted-foreground">
                Overall Score: <span className="text-green-600 font-semibold">97%</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Location Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Business Names</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Addresses</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">98%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phone Numbers</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Opening Hours</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">96%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Inventory Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Product Availability</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '99%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">99%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price Accuracy</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '97%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">97%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stock Levels</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Product Images</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">95%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Customer Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email Addresses</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">98%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction IDs</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Store IDs</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Purchase Values</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-border rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">96%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
        
        {/* Data Enrichment Suggestions */}
        <div className="mt-8">
          <EnrichmentSuggestions />
        </div>
      </CardContent>
    </Card>
  );
}
