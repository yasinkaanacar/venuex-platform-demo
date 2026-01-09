import { DollarSign, AlertTriangle, RefreshCw, Database, Search, Star, AlertCircle, Box, Minus, Eye, Download } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

export default function MainDashboardContent() {
  return (
    <div className="space-y-6">
      {/* Top Row: KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1: Ad Budget Saved */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Ad Budget Saved</span>
          </div>
          <p className="text-2xl font-bold text-green-600">$4,250</p>
          <p className="text-xs text-gray-500 mt-1">Saved by pausing ads for OOS items</p>
        </div>

        {/* Card 2: Missed Revenue Risks */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Missed Revenue Risks</span>
          </div>
          <p className="text-2xl font-bold text-red-600">142</p>
          <p className="text-xs text-gray-500 mt-1">High clicks + Out of stock</p>
        </div>

        {/* Card 3: Sync Success Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Sync Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">99.8%</p>
          <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
        </div>

        {/* Card 4: Total SKUs Monitored */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total SKUs Monitored</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">124,500</p>
          <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
        </div>
      </div>

      {/* Middle Row: Spot Check Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by SKU, Product Name, or Store Code..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Spot Check
          </button>
        </div>
      </div>

      {/* Bottom Section: Intelligence & Issues */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left Column: Intelligence Matrix (40%) */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Intelligence Matrix (Supply vs Demand)</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Q1: Star Items */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Star Items</span>
              </div>
              <p className="text-lg font-bold text-green-600">2,450</p>
              <p className="text-[10px] text-gray-500">High Demand + In Stock</p>
            </div>

            {/* Q2: Critical Alerts */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">Critical Alerts</span>
              </div>
              <p className="text-lg font-bold text-red-600">142</p>
              <p className="text-[10px] text-gray-500">High Demand + OOS</p>
            </div>

            {/* Q3: Dead Stock */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Box className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Dead Stock</span>
              </div>
              <p className="text-lg font-bold text-gray-600">890</p>
              <p className="text-[10px] text-gray-500">Low Demand + In Stock</p>
            </div>

            {/* Q4: Ignore */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Minus className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">Ignore</span>
              </div>
              <p className="text-lg font-bold text-gray-400">320</p>
              <p className="text-[10px] text-gray-500">Low Demand + OOS</p>
            </div>
          </div>
        </div>

        {/* Right Column: Issues Feed (60%) */}
        <div className="col-span-3 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Grouped Issues Summary</h3>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Issue Type</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-2">Platform</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-2">Count</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Store Code Mismatch</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <SiGoogle className="w-4 h-4 text-gray-500 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-gray-900">23</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Price Anomaly</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <SiMeta className="w-4 h-4 text-gray-500 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-gray-900">15</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-900">Missing GTIN</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <SiGoogle className="w-4 h-4 text-gray-500 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-gray-900">8</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Image URL Invalid</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <SiGoogle className="w-4 h-4 text-gray-500" />
                      <SiMeta className="w-4 h-4 text-gray-500" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-gray-900">12</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
