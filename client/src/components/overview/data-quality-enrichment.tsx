import EnrichmentSuggestions from './enrichment-suggestions';

export default function DataQualityEnrichment() {
  return (
    <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
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

          {/* Platform Data */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Platform Data</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Google Business Profile</span>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meta Business</span>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Apple Business Connect</span>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">87%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Yandex Maps</span>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '84%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">84%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Sync Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last 24 Hours</span>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '99%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">99%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last 7 Days</span>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '97%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">97%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last 30 Days</span>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data Accuracy</span>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '98%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">98%</span>
                </div>
              </div>
            </div>
          </div>

          
        </div>
        
        {/* Data Enrichment Suggestions */}
        <div className="pt-8 border-t border-border">
          <EnrichmentSuggestions />
        </div>
      </div>
    </div>
  );
}