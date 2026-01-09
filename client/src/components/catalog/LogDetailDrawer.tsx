import { X, CheckCircle, AlertTriangle, XCircle, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

type DrawerScenario = 'issues' | 'fatal' | 'success';

interface LogDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: DrawerScenario;
}

export default function LogDetailDrawer({ isOpen, onClose, scenario }: LogDetailDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[600px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {scenario === 'issues' && (
              <>
                <SiGoogle className="w-5 h-5 text-gray-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Batch #8821 Report</h2>
                  <p className="text-sm text-gray-500">Today, 14:45</p>
                </div>
              </>
            )}
            {scenario === 'fatal' && (
              <>
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">ERP</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Ingestion Failed</h2>
                  <p className="text-sm text-gray-500">Today, 09:12</p>
                </div>
              </>
            )}
            {scenario === 'success' && (
              <>
                <SiMeta className="w-5 h-5 text-gray-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Batch #8820 Report</h2>
                  <p className="text-sm text-gray-500">Today, 13:30</p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            {scenario === 'issues' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                <AlertTriangle className="w-4 h-4" />
                Completed with Issues
              </span>
            )}
            {scenario === 'fatal' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                <XCircle className="w-4 h-4" />
                Failed
              </span>
            )}
            {scenario === 'success' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Success
              </span>
            )}
            
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {scenario === 'issues' && <IssuesContent />}
          {scenario === 'fatal' && <FatalErrorContent />}
          {scenario === 'success' && <SuccessContent />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {scenario === 'issues' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4" />
              Download Full Error Report (.CSV)
            </button>
          )}
          {scenario === 'fatal' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          )}
          {scenario === 'success' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ExternalLink className="w-4 h-4" />
              View on Meta Commerce Manager
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function IssuesContent() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">12,400</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 mb-1">Successful</p>
          <p className="text-2xl font-bold text-green-700">12,250</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-600 mb-1">Failed/Skipped</p>
          <p className="text-2xl font-bold text-red-700">150</p>
        </div>
      </div>

      {/* Error Grouping Table */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Error Summary</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Error Type</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">Count</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Price Mismatch (Local {'>'} Online)</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-medium text-gray-900">120 items</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View Sample SKUs
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Invalid Store Code (TR-99)</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-medium text-gray-900">30 items</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View Sample SKUs
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FatalErrorContent() {
  return (
    <div className="space-y-6">
      {/* Error Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-800 mb-1">Connection Refused</h3>
            <p className="text-sm text-red-700">Could not reach source server. The ERP system did not respond within the timeout period.</p>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Technical Details</h3>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <p className="text-red-400">Error 503: Service Unavailable</p>
          <p className="text-gray-400 mt-2">at https://api.client-erp.com/v1/inventory</p>
          <p className="text-gray-500 mt-2">Request ID: req_8821_abc123</p>
          <p className="text-gray-500">Timestamp: 2024-01-09T09:12:34.567Z</p>
          <p className="text-gray-500">Timeout: 30000ms</p>
          <p className="text-yellow-400 mt-4">Possible causes:</p>
          <p className="text-gray-400">- ERP server is down or unreachable</p>
          <p className="text-gray-400">- Network connectivity issues</p>
          <p className="text-gray-400">- Firewall blocking the connection</p>
        </div>
      </div>

      {/* Retry History */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Retry History</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
            <span className="text-gray-600">Attempt 1</span>
            <span className="text-red-600">Failed at 09:12:34</span>
          </div>
          <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
            <span className="text-gray-600">Attempt 2</span>
            <span className="text-red-600">Failed at 09:13:04</span>
          </div>
          <div className="flex items-center justify-between text-sm py-2">
            <span className="text-gray-600">Attempt 3</span>
            <span className="text-red-600">Failed at 09:13:34</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessContent() {
  return (
    <div className="space-y-6">
      {/* Success Graphic */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Sync Completed Successfully</h3>
        <p className="text-sm text-gray-500 mt-1">All products synced to Meta Commerce</p>
      </div>

      {/* Stats List */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-gray-600">Total Processed</span>
          <span className="text-sm font-semibold text-gray-900">5,000</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-gray-600">Updated</span>
          <span className="text-sm font-semibold text-green-600">420</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-gray-600">Unchanged</span>
          <span className="text-sm font-semibold text-gray-500">4,580</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-gray-600">Avg. Latency</span>
          <span className="text-sm font-semibold text-gray-900">1.2s</span>
        </div>
      </div>

      {/* Platform Info */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-center gap-3">
          <SiMeta className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">Meta Commerce Manager</p>
            <p className="text-xs text-blue-700">Catalog ID: cat_venuex_prod_001</p>
          </div>
        </div>
      </div>
    </div>
  );
}
