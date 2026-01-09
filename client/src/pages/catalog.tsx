import { useState } from 'react';
import { 
  Search, 
  ArrowRight,
  Package,
  X
} from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

const mockKPIs = {
  adBudgetSaved: 4250,
  missedRevenueRisks: 142,
  syncSuccessRate: 99.8,
  totalSKUs: 124500
};

const mockQuadrantData = {
  stars: [
    { sku: 'NKE-AM270-BLK', name: 'Nike Air Max 270', clicks: 2450 },
    { sku: 'ADI-UB22-WHT', name: 'Adidas Ultraboost 22', clicks: 1820 },
    { sku: 'NKE-AF1-WHT', name: 'Nike Air Force 1', clicks: 1650 },
  ],
  criticalOOS: [
    { sku: 'NKE-DK2-GRY', name: 'Nike Dunk Low', clicks: 3200 },
    { sku: 'ADI-YZY-BLK', name: 'Adidas Yeezy 350', clicks: 2100 },
    { sku: 'NB-550-WHT', name: 'New Balance 550', clicks: 1900 },
  ],
  deadStock: [
    { sku: 'ASC-GT2-BLU', name: 'Asics GT-2000', days: 45 },
    { sku: 'PUM-RS-X', name: 'Puma RS-X', days: 38 },
    { sku: 'RBK-CL-WHT', name: 'Reebok Classic', days: 32 },
  ],
  ignore: [
    { sku: 'SKC-WALK-BRN', name: 'Skechers Walk', days: 60 },
    { sku: 'FLA-DIS-BLK', name: 'Fila Disruptor', days: 55 },
  ]
};

const mockIssues = [
  { id: 1, errorType: 'Store Code Mismatch', count: 23, platform: 'google' },
  { id: 2, errorType: 'Price Anomaly', count: 15, platform: 'meta' },
  { id: 3, errorType: 'Missing GTIN', count: 8, platform: 'google' },
  { id: 4, errorType: 'Image URL Invalid', count: 12, platform: 'both' },
  { id: 5, errorType: 'Description Too Long', count: 5, platform: 'google' },
];

const mockActivityLog = [
  { time: '14:02', message: 'Batch #992 synced to Meta (200 OK)' },
  { time: '14:01', message: 'Batch #991 synced to Google (200 OK)' },
  { time: '13:58', message: 'Price update received from ERP' },
  { time: '13:55', message: 'Batch #990 partial sync to Meta (12 errors)' },
  { time: '13:52', message: 'Availability delta: 142 items OOS' },
  { time: '13:50', message: 'Batch #989 synced to Google (200 OK)' },
  { time: '13:45', message: 'New product feed received (5,200 items)' },
  { time: '13:40', message: 'Batch #988 synced to Meta (200 OK)' },
  { time: '13:35', message: 'Store IST-003 marked offline' },
  { time: '13:30', message: 'Batch #987 synced to Google (200 OK)' },
];

const mockStoreAvailability = [
  { storeCode: 'IST-001', storeName: 'İstanbul Kadıköy', available: true, localPrice: 299.99 },
  { storeCode: 'IST-002', storeName: 'İstanbul Beşiktaş', available: true, localPrice: 299.99 },
  { storeCode: 'IST-003', storeName: 'İstanbul Şişli', available: false, localPrice: 299.99 },
  { storeCode: 'ANK-001', storeName: 'Ankara Çankaya', available: true, localPrice: 289.99 },
  { storeCode: 'ANK-002', storeName: 'Ankara Kızılay', available: false, localPrice: 289.99 },
  { storeCode: 'IZM-001', storeName: 'İzmir Alsancak', available: true, localPrice: 299.99 },
  { storeCode: 'IZM-002', storeName: 'İzmir Karşıyaka', available: false, localPrice: 299.99 },
  { storeCode: 'ANT-001', storeName: 'Antalya Merkez', available: true, localPrice: 309.99 },
  { storeCode: 'BUR-001', storeName: 'Bursa Nilüfer', available: true, localPrice: 299.99 },
  { storeCode: 'BUR-002', storeName: 'Bursa Osmangazi', available: false, localPrice: 299.99 },
  { storeCode: 'KON-001', storeName: 'Konya Selçuklu', available: true, localPrice: 289.99 },
  { storeCode: 'ADN-001', storeName: 'Adana Seyhan', available: true, localPrice: 299.99 },
];

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ sku: string; name: string; globalPrice: number; stores: typeof mockStoreAvailability } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [devView, setDevView] = useState<'dashboard' | 'search'>('dashboard');

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setSearchResult({
        sku: searchQuery.toUpperCase(),
        name: 'Nike Air Max 270 - Black/White',
        globalPrice: 279.99,
        stores: mockStoreAvailability
      });
      setIsSearching(false);
      setDevView('search');
    }, 300);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResult(null);
    setDevView('dashboard');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const showSearchView = devView === 'search' && searchResult;

  return (
    <div className="min-h-screen bg-white">
      {/* Pipeline Header */}
      <div className="border-b-2 border-black py-4">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 border-2 border-black">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span className="font-bold text-sm">CLIENT ERP</span>
          </div>
          <ArrowRight className="w-6 h-6" />
          <div className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-gray-100">
            <span className="font-bold text-sm">VENUEX ENGINE</span>
          </div>
          <ArrowRight className="w-6 h-6" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-black">
              <SiGoogle className="w-4 h-4" />
              <span className="font-bold text-sm">GOOGLE</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-black">
              <SiMeta className="w-4 h-4" />
              <span className="font-bold text-sm">META</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: 75% Left/Center + 25% Right Sidebar */}
      <div className="flex">
        {/* Main Dashboard Area (75%) */}
        <div className="w-3/4 border-r-2 border-black">
          
          {/* KPI Row */}
          <div className="grid grid-cols-4 border-b-2 border-black">
            {/* Ad Budget Saved - Larger */}
            <div className="col-span-1 p-6 border-r-2 border-black bg-gray-50">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">AD BUDGET SAVED</p>
              <p className="text-4xl font-black">${mockKPIs.adBudgetSaved.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Paused ads for OOS items</p>
            </div>
            
            <div className="col-span-1 p-4 border-r-2 border-black">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">MISSED REVENUE RISKS</p>
              <p className="text-2xl font-black">{mockKPIs.missedRevenueRisks}</p>
              <p className="text-xs text-gray-500">High clicks + OOS</p>
            </div>
            
            <div className="col-span-1 p-4 border-r-2 border-black">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">SYNC SUCCESS RATE</p>
              <p className="text-2xl font-black">{mockKPIs.syncSuccessRate}%</p>
              <p className="text-xs text-gray-500">Last 24 hours</p>
            </div>
            
            <div className="col-span-1 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">TOTAL SKUs</p>
              <p className="text-2xl font-black">{mockKPIs.totalSKUs.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Monitored</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="border-b-2 border-black p-4 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter SKU or Store Code to inspect..."
                className="w-full pl-10 pr-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:bg-gray-50"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-gray-500 hover:text-black" />
                </button>
              )}
            </div>
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 disabled:bg-gray-400"
            >
              INSPECT
            </button>
            {/* Dev Toggle */}
            <button 
              onClick={() => setDevView(devView === 'dashboard' ? 'search' : 'dashboard')}
              className="px-4 py-3 border-2 border-black font-mono text-xs hover:bg-gray-100"
            >
              DEV: {devView.toUpperCase()}
            </button>
          </div>

          {/* Content View */}
          {showSearchView ? (
            /* VIEW 2: Search Result - Store Map */
            <div className="p-6">
              {/* Product Header */}
              <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-black">
                <div className="w-20 h-20 border-2 border-black flex items-center justify-center bg-gray-100">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-xs text-gray-500">SKU: {searchResult.sku}</p>
                  <h2 className="text-xl font-black">{searchResult.name}</h2>
                  <p className="text-sm font-bold mt-1">Global Price: ₺{searchResult.globalPrice}</p>
                </div>
                <button onClick={clearSearch} className="px-4 py-2 border-2 border-black font-bold text-sm hover:bg-gray-100">
                  BACK
                </button>
              </div>

              {/* Store Grid */}
              <div className="grid grid-cols-4 gap-3">
                {searchResult.stores.map((store) => (
                  <div 
                    key={store.storeCode}
                    className="border-2 border-black p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${store.available ? 'bg-black' : 'border-2 border-black'}`}></div>
                      <span className="font-mono text-xs">{store.storeCode}</span>
                    </div>
                    <p className="font-bold text-sm">{store.storeName}</p>
                    {store.localPrice !== searchResult.globalPrice && (
                      <p className="text-xs text-gray-600 mt-1">Local: ₺{store.localPrice}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* VIEW 1: Default Dashboard - Intelligence View */
            <div className="flex">
              {/* Left: 2x2 Matrix Grid (50%) */}
              <div className="w-1/2 border-r-2 border-black">
                <div className="grid grid-cols-2">
                  {/* Top-Left: Stars */}
                  <div className="border-b-2 border-r-2 border-black p-4">
                    <p className="text-xs font-bold uppercase tracking-wide mb-3">★ STARS</p>
                    <div className="space-y-2">
                      {mockQuadrantData.stars.map((item) => (
                        <div key={item.sku} className="flex justify-between text-xs">
                          <span className="font-mono truncate flex-1">{item.sku}</span>
                          <span className="font-bold ml-2">{item.clicks} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top-Right: Critical OOS */}
                  <div className="border-b-2 border-black p-4">
                    <p className="text-xs font-bold uppercase tracking-wide mb-3">⚠ CRITICAL OOS</p>
                    <div className="space-y-2">
                      {mockQuadrantData.criticalOOS.map((item) => (
                        <div key={item.sku} className="flex justify-between text-xs">
                          <span className="font-mono truncate flex-1">{item.sku}</span>
                          <span className="font-bold ml-2">{item.clicks} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom-Left: Dead Stock */}
                  <div className="border-r-2 border-black p-4">
                    <p className="text-xs font-bold uppercase tracking-wide mb-3">📦 DEAD STOCK</p>
                    <div className="space-y-2">
                      {mockQuadrantData.deadStock.map((item) => (
                        <div key={item.sku} className="flex justify-between text-xs">
                          <span className="font-mono truncate flex-1">{item.sku}</span>
                          <span className="text-gray-500 ml-2">{item.days}d stale</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom-Right: Ignore */}
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-400">— IGNORE</p>
                    <div className="space-y-2">
                      {mockQuadrantData.ignore.map((item) => (
                        <div key={item.sku} className="flex justify-between text-xs text-gray-400">
                          <span className="font-mono truncate flex-1">{item.sku}</span>
                          <span className="ml-2">{item.days}d</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Issues Table (50%) */}
              <div className="w-1/2">
                <div className="p-4 border-b-2 border-black">
                  <p className="text-xs font-bold uppercase tracking-wide">ISSUES FEED</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left text-xs font-bold uppercase p-3">Error Type</th>
                      <th className="text-right text-xs font-bold uppercase p-3">Count</th>
                      <th className="text-center text-xs font-bold uppercase p-3">Platform</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockIssues.map((issue) => (
                      <tr key={issue.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 text-sm">{issue.errorType}</td>
                        <td className="p-3 text-sm text-right font-bold">{issue.count}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {(issue.platform === 'google' || issue.platform === 'both') && <SiGoogle className="w-4 h-4" />}
                            {(issue.platform === 'meta' || issue.platform === 'both') && <SiMeta className="w-4 h-4" />}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Live Activity Log (25%) */}
        <div className="w-1/4 bg-gray-50">
          <div className="p-4 border-b-2 border-black">
            <p className="text-xs font-bold uppercase tracking-wide">LIVE ACTIVITY LOG</p>
          </div>
          <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            {mockActivityLog.map((log, idx) => (
              <div key={idx} className="font-mono text-xs">
                <span className="text-gray-500">{log.time}:</span>{' '}
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
