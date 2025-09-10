import EnrichmentSuggestions from './enrichment-suggestions';

type DataQualityContext = 'dashboard' | 'locations';

interface DataQualityEnrichmentProps {
  context?: DataQualityContext;
}

export default function DataQualityEnrichment({ context = 'dashboard' }: DataQualityEnrichmentProps) {
  return (
    <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#f9fafb] py-2 px-6 flex justify-between items-center border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Data Quality Assessment</h3>
          <p className="text-sm text-muted-foreground">
            Overall Score: <span className="text-green-600 font-semibold">97%</span>
          </p>
        </div>
        <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-data-quality">
          View All →
        </button>
      </div>
      <div className="bg-[#f9fafb] p-6 space-y-8">
        {context === 'locations' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Location Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">95%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Locality</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '89%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">89%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Latitude</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Longitude</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Country</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">98%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Province</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">96%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Postal Code</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
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
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Store Code</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '97%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">97%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Working Hours</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">68%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Photos</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amenities</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
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
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '82%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">82%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">E-mail</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '63%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">63%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Website</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '89%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">89%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Social Media</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
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
                  <span className="text-sm text-muted-foreground">Business Names</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Addresses</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">98%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phone Numbers</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Opening Hours</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '96%' }}></div>
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
                  <span className="text-sm text-muted-foreground">Product Names</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">95%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">SKU Numbers</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pricing Info</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '87%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">87%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stock Levels</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '73%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">73%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Sales Data */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">Store Sales Data</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction IDs</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '99%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">99%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Customer Data</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '91%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">91%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Methods</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">96%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue Totals</span>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8">88%</span>
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
      </div>
    </div>
  );
}