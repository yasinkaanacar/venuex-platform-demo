import { useState } from 'react';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  RefreshCw,
  DollarSign,
  TrendingDown,
  Zap,
  Database,
  Download,
  Eye,
  ChevronRight,
  X,
  Star,
  AlertCircle,
  Package,
  Minus
} from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

const mockPipelineStatus = {
  erp: { status: 'connected', label: 'Client ERP', lastSync: '2 min ago' },
  engine: { status: 'processing', label: 'VenueX Engine', itemsProcessed: '124,500' },
  google: { status: 'connected', label: 'Google Merchant' },
  meta: { status: 'connected', label: 'Meta Commerce' }
};

const mockKPIs = {
  adBudgetSaved: 4250,
  missedRevenueRisks: 142,
  syncSuccessRate: 99.8,
  totalSKUs: 124500
};

const mockQuadrantData = {
  starItems: { count: 8420, label: 'Star Items', desc: 'High Demand + In Stock' },
  criticalAlerts: { count: 142, label: 'Critical Alerts', desc: 'High Demand + Out of Stock' },
  deadStock: { count: 3150, label: 'Dead Stock', desc: 'Low Demand + In Stock' },
  ignore: { count: 890, label: 'Ignore', desc: 'Low Demand + Out of Stock' }
};

const mockIssues = [
  { id: 1, errorType: 'Store Code Mismatch', count: 23, platform: 'google', severity: 'high' },
  { id: 2, errorType: 'Price Anomaly', count: 15, platform: 'meta', severity: 'medium' },
  { id: 3, errorType: 'Missing GTIN', count: 8, platform: 'google', severity: 'low' },
  { id: 4, errorType: 'Image URL Invalid', count: 12, platform: 'both', severity: 'medium' },
];

const mockBatchActivity = [
  { id: 1, batchId: '992', platform: 'meta', items: 5000, status: 'success', duration: '1.2s', timestamp: '2 min ago' },
  { id: 2, batchId: '991', platform: 'google', items: 12500, status: 'success', duration: '3.4s', timestamp: '15 min ago' },
  { id: 3, batchId: '990', platform: 'meta', items: 3200, status: 'partial', duration: '2.1s', timestamp: '32 min ago', errors: 12 },
  { id: 4, batchId: '989', platform: 'google', items: 8700, status: 'success', duration: '2.8s', timestamp: '1 hr ago' },
];

const mockStoreAvailability = [
  { storeCode: 'IST-001', storeName: 'İstanbul Kadıköy', available: true, localPrice: 299.99, onlinePrice: 279.99 },
  { storeCode: 'IST-002', storeName: 'İstanbul Beşiktaş', available: true, localPrice: 299.99, onlinePrice: 279.99 },
  { storeCode: 'IST-003', storeName: 'İstanbul Şişli', available: false, localPrice: 299.99, onlinePrice: 279.99 },
  { storeCode: 'ANK-001', storeName: 'Ankara Çankaya', available: true, localPrice: 289.99, onlinePrice: 279.99 },
  { storeCode: 'ANK-002', storeName: 'Ankara Kızılay', available: false, localPrice: 289.99, onlinePrice: 279.99 },
  { storeCode: 'IZM-001', storeName: 'İzmir Alsancak', available: true, localPrice: 299.99, onlinePrice: 279.99 },
  { storeCode: 'IZM-002', storeName: 'İzmir Karşıyaka', available: false, localPrice: 299.99, onlinePrice: 279.99 },
  { storeCode: 'ANT-001', storeName: 'Antalya Merkez', available: true, localPrice: 309.99, onlinePrice: 279.99 },
  { storeCode: 'BUR-001', storeName: 'Bursa Nilüfer', available: true, localPrice: 299.99, onlinePrice: 279.99 },
];

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ sku: string; name: string; stores: typeof mockStoreAvailability } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showBatchDrawer, setShowBatchDrawer] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setSearchResult({
        sku: searchQuery.toUpperCase(),
        name: 'Nike Air Max 270 - Black/White',
        stores: mockStoreAvailability
      });
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const availableCount = searchResult?.stores.filter(s => s.available).length || 0;
  const unavailableCount = searchResult?.stores.filter(s => !s.available).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        
        {/* Data Pipeline Visualizer */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* ERP Node */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-50"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{mockPipelineStatus.erp.label}</p>
                  <p className="text-xs text-gray-500">{mockPipelineStatus.erp.lastSync}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </div>

              {/* VenueX Engine */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{mockPipelineStatus.engine.label}</p>
                  <p className="text-xs text-blue-600">Processing {mockPipelineStatus.engine.itemsProcessed} items</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-green-500"></div>
                <ChevronRight className="w-4 h-4 text-green-500" />
              </div>

              {/* Platforms */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <SiGoogle className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-600">Merchant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <SiMeta className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-600">Commerce</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowBatchDrawer(!showBatchDrawer)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span className="text-sm">Activity Log</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Ad Budget Saved - Hero Card */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">This Month</span>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">${mockKPIs.adBudgetSaved.toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-900">Ad Budget Saved</p>
            <p className="text-xs text-gray-500 mt-1">Saved by pausing ads for OOS items</p>
          </div>

          {/* Missed Revenue Risks */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Action Needed</span>
            </div>
            <p className="text-3xl font-bold text-red-600 mb-1">{mockKPIs.missedRevenueRisks}</p>
            <p className="text-sm font-medium text-gray-900">Missed Revenue Risks</p>
            <p className="text-xs text-gray-500 mt-1">High clicks + Out of stock</p>
          </div>

          {/* Sync Success Rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{mockKPIs.syncSuccessRate}%</p>
            <p className="text-sm font-medium text-gray-900">Sync Success Rate</p>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </div>

          {/* Total SKUs */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{mockKPIs.totalSKUs.toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-900">Total SKUs Monitored</p>
            <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
          </div>
        </div>

        {/* Spot Check Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by SKU, Product Name, or Store Code..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Spot Check
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {searchResult ? (
          /* Store Availability Map */
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-mono">SKU: {searchResult.sku}</p>
                  <h2 className="text-xl font-semibold text-gray-900">{searchResult.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" /> {availableCount} Available
                    </span>
                    <span className="flex items-center gap-1 text-sm text-red-600">
                      <XCircle className="w-4 h-4" /> {unavailableCount} Out of Stock
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={clearSearch} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
                Back to Dashboard
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {searchResult.stores.map((store) => (
                <div 
                  key={store.storeCode}
                  className={`p-4 rounded-lg border ${
                    store.available 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500">{store.storeCode}</span>
                    {store.available ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="font-medium text-gray-900 text-sm mb-2">{store.storeName}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Local: ₺{store.localPrice}</span>
                    <span className="text-blue-600">Online: ₺{store.onlinePrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Intelligence Matrix + Issues Feed */
          <div className="grid grid-cols-2 gap-6">
            {/* Left: 2x2 Matrix */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Intelligence Matrix</h2>
              <p className="text-sm text-gray-500 mb-6">Supply vs. Demand Analysis</p>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Star Items - High Demand + In Stock */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">{mockQuadrantData.starItems.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockQuadrantData.starItems.count.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{mockQuadrantData.starItems.desc}</p>
                </div>

                {/* Critical Alerts - High Demand + Out of Stock */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-700">{mockQuadrantData.criticalAlerts.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockQuadrantData.criticalAlerts.count}</p>
                  <p className="text-xs text-gray-500 mt-1">{mockQuadrantData.criticalAlerts.desc}</p>
                </div>

                {/* Dead Stock - Low Demand + In Stock */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">{mockQuadrantData.deadStock.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockQuadrantData.deadStock.count.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{mockQuadrantData.deadStock.desc}</p>
                </div>

                {/* Ignore - Low Demand + Out of Stock */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Minus className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">{mockQuadrantData.ignore.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{mockQuadrantData.ignore.count}</p>
                  <p className="text-xs text-gray-500 mt-1">{mockQuadrantData.ignore.desc}</p>
                </div>
              </div>
            </div>

            {/* Right: Issues Feed */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Issues Feed</h2>
                  <p className="text-sm text-gray-500">Grouped error summary</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  {mockIssues.reduce((acc, i) => acc + i.count, 0)} Total
                </span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {mockIssues.map((issue) => (
                  <div key={issue.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          issue.severity === 'high' ? 'bg-red-500' :
                          issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{issue.errorType}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {issue.platform === 'google' && <SiGoogle className="w-3 h-3 text-gray-400" />}
                            {issue.platform === 'meta' && <SiMeta className="w-3 h-3 text-gray-400" />}
                            {issue.platform === 'both' && (
                              <>
                                <SiGoogle className="w-3 h-3 text-gray-400" />
                                <SiMeta className="w-3 h-3 text-gray-400" />
                              </>
                            )}
                            <span className="text-xs text-gray-500 capitalize">{issue.platform}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-900">{issue.count}</span>
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="View Samples">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Download CSV">
                            <Download className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Batch Activity Drawer */}
      {showBatchDrawer && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Batch Activity Log</h3>
            <button onClick={() => setShowBatchDrawer(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-64px)]">
            {mockBatchActivity.map((batch) => (
              <div key={batch.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Batch #{batch.batchId}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    batch.status === 'success' ? 'bg-green-100 text-green-700' :
                    batch.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {batch.status === 'success' ? 'Success' : 
                     batch.status === 'partial' ? `Partial (${batch.errors} errors)` : 'Failed'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {batch.platform === 'google' ? <SiGoogle className="w-3 h-3" /> : <SiMeta className="w-3 h-3" />}
                  <span>{batch.items.toLocaleString()} items</span>
                  <span>•</span>
                  <span>{batch.duration}</span>
                  <span>•</span>
                  <span>{batch.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
