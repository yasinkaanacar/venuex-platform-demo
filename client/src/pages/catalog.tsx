import { useState } from 'react';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
  Zap,
  Database,
  TrendingUp
} from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';
import Sidebar from '@/components/layout/sidebar';

const mockMetrics = {
  totalSKUs: 142853,
  availablePercent: 87.3,
  notAvailablePercent: 12.7,
  syncErrors: 234,
  googleLatency: 145,
  metaLatency: 89,
  lastSync: '2 min ago',
};

const mockIssues = [
  { id: 1, errorType: 'Store Code Mismatch', impactedSKUs: 156, platform: 'google', severity: 'high', description: 'Store codes in feed do not match registered locations' },
  { id: 2, errorType: 'API Timeout', impactedSKUs: 42, platform: 'meta', severity: 'medium', description: 'Connection timeout during batch upload' },
  { id: 3, errorType: 'Invalid Product ID', impactedSKUs: 28, platform: 'google', severity: 'high', description: 'Product IDs not found in Merchant Center catalog' },
  { id: 4, errorType: 'Duplicate Entry', impactedSKUs: 12, platform: 'meta', severity: 'low', description: 'Same SKU submitted multiple times in batch' },
  { id: 5, errorType: 'Missing Required Field', impactedSKUs: 8, platform: 'google', severity: 'medium', description: 'Availability status not provided for items' },
];

const mockBatchLogs = [
  { id: 992, items: 10250, status: 'success', timestamp: '14:32', platform: 'google' },
  { id: 991, items: 8420, status: 'success', timestamp: '14:15', platform: 'meta' },
  { id: 990, items: 12100, status: 'partial', timestamp: '13:58', platform: 'google', errors: 23 },
  { id: 989, items: 9800, status: 'success', timestamp: '13:41', platform: 'meta' },
  { id: 988, items: 11500, status: 'success', timestamp: '13:24', platform: 'google' },
  { id: 987, items: 7650, status: 'failed', timestamp: '13:07', platform: 'meta', errors: 156 },
];

const mockStoreMatrix = [
  { storeCode: 'IST-001', storeName: 'Istanbul Kadıköy', available: true },
  { storeCode: 'IST-002', storeName: 'Istanbul Beşiktaş', available: true },
  { storeCode: 'ANK-001', storeName: 'Ankara Çankaya', available: false },
  { storeCode: 'IZM-001', storeName: 'İzmir Alsancak', available: true },
  { storeCode: 'ANT-001', storeName: 'Antalya Merkez', available: false },
  { storeCode: 'BUR-001', storeName: 'Bursa Nilüfer', available: true },
];

export default function Catalog() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ sku: string; name: string; stores: typeof mockStoreMatrix } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setSearchResult({
        sku: searchQuery.toUpperCase(),
        name: 'Sample Product - Premium Widget XL',
        stores: mockStoreMatrix
      });
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Local Inventory</h1>
              <p className="text-sm text-gray-500 mt-1">System health & sync status for {mockMetrics.totalSKUs.toLocaleString()}+ SKUs</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock size={14} />
                Last sync: {mockMetrics.lastSync}
              </span>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                <RefreshCw size={16} /> Sync Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">Total SKUs Processed</span>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{mockMetrics.totalSKUs.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Across all connected stores</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">Availability Status</span>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-3xl font-bold text-green-600">{mockMetrics.availablePercent}%</p>
                <p className="text-sm text-gray-400 mb-1">Available</p>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                  style={{ width: `${mockMetrics.availablePercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                <span>In Stock: {mockMetrics.availablePercent}%</span>
                <span>Out of Stock: {mockMetrics.notAvailablePercent}%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">Sync Errors</span>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-red-600">{mockMetrics.syncErrors}</p>
              <p className="text-xs text-gray-400 mt-1">Items requiring attention</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">API Latency</span>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SiGoogle className="w-4 h-4 text-[#4285F4]" />
                    <span className="text-sm text-gray-600">Google</span>
                  </div>
                  <span className={`text-sm font-medium ${mockMetrics.googleLatency < 200 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {mockMetrics.googleLatency}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SiMeta className="w-4 h-4 text-[#0668E1]" />
                    <span className="text-sm text-gray-600">Meta</span>
                  </div>
                  <span className={`text-sm font-medium ${mockMetrics.metaLatency < 200 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {mockMetrics.metaLatency}ms
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Spot Check</h2>
                    <p className="text-sm text-gray-500">Look up a specific SKU or Store Code to check availability</p>
                  </div>
                </div>
                
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter SKU or Store Code (e.g., SKU-12345, IST-001)"
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {searchResult && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-gray-500">SKU:</span>
                          <span className="ml-2 font-mono font-medium text-gray-900">{searchResult.sku}</span>
                        </div>
                        <span className="text-sm text-gray-600">{searchResult.name}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-gray-500 mb-3">AVAILABILITY BY STORE</p>
                      <div className="grid grid-cols-3 gap-2">
                        {searchResult.stores.map((store) => (
                          <div
                            key={store.storeCode}
                            className={`flex items-center gap-2 p-3 rounded-lg border ${
                              store.available 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                            {store.available ? (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">{store.storeName}</p>
                              <p className="text-[10px] text-gray-500 font-mono">{store.storeCode}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Issues Feed</h2>
                      <p className="text-sm text-gray-500">Errors and problems requiring attention</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    {mockIssues.length} Active Issues
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Error Type</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Impacted SKUs</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockIssues.map((issue) => (
                        <tr key={issue.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{issue.errorType}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{issue.description}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900">{issue.impactedSKUs.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {issue.platform === 'google' ? (
                                <SiGoogle className="w-4 h-4 text-[#4285F4]" />
                              ) : (
                                <SiMeta className="w-4 h-4 text-[#0668E1]" />
                              )}
                              <span className="text-sm text-gray-600 capitalize">{issue.platform}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                              issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                              issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                              View Sample SKUs <ChevronRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 sticky top-6">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                  <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Batch Activity</h3>
                    <p className="text-xs text-gray-500">Recent sync jobs</p>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {mockBatchLogs.map((batch) => (
                    <div key={batch.id} className="px-5 py-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-gray-900">#{batch.id}</span>
                          {batch.platform === 'google' ? (
                            <SiGoogle className="w-3.5 h-3.5 text-[#4285F4]" />
                          ) : (
                            <SiMeta className="w-3.5 h-3.5 text-[#0668E1]" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{batch.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{batch.items.toLocaleString()} items</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                          batch.status === 'success' ? 'text-green-600' :
                          batch.status === 'partial' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {batch.status === 'success' && <CheckCircle size={12} />}
                          {batch.status === 'partial' && <AlertTriangle size={12} />}
                          {batch.status === 'failed' && <XCircle size={12} />}
                          {batch.status === 'success' ? 'Success' : 
                           batch.status === 'partial' ? `Partial (${batch.errors} errors)` : 
                           `Failed (${batch.errors} errors)`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-3 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Activity <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
