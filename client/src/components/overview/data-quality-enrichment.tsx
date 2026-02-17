import EnrichmentSuggestions from './enrichment-suggestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DataQualityContext = 'dashboard' | 'locations';

interface DataQualityEnrichmentProps {
  context?: DataQualityContext;
}

export default function DataQualityEnrichment({ context = 'dashboard' }: DataQualityEnrichmentProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Data Quality Assessment</CardTitle>
            <p className="text-sm text-muted-foreground">
              Overall Score: <span className="text-green-600 font-semibold">97%</span>
            </p>
          </div>
          <button className="text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-data-quality">
            View All →
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {context === 'locations' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Location Data</h4>
              <div className="space-y-3 vx-surface-muted">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">95%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Locality</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '89%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">89%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Latitude</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Longitude</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Country</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">98%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Province</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">96%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Postal Code</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '84%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">84%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Business Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Store Name</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Store Code</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '97%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">97%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Working Hours</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">68%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Photos</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amenities</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '72%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">72%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Contact Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phone Number</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '82%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">82%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">E-mail</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '63%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">63%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Website</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '89%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">89%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Social Media</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '34%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">34%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Location Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Store Name</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Full Address</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">98%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Latitude & Longitude</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">96%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Primary Category</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Business Hours</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '87%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">87%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Inventory Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">SKU ID</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '99%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">99%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Store ID</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Availability Status</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">95%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Price</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '97%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">97%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">92%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* In-Store Sales Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">In-Store Sales Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Store ID</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">98%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction Value</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">96%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction Timestamp</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Customer Phone (Hashed)</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 rounded-full h-3 shadow-inner border border-gray-300">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Data Enrichment Suggestions */}
        <div className="pt-8 border-t border-border">
          <EnrichmentSuggestions context={context} />
        </div>
      </CardContent>
    </Card>
  );
}
