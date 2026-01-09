import { useState } from 'react';
import { X, AlertTriangle, Download, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

interface ErrorGroup {
  id: string;
  platform: 'google' | 'meta';
  issue: string;
  code: string;
  impact: 'High' | 'Medium' | 'Low';
  count: number;
  solution: string;
  sampleSkus: string[];
}

interface LogDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    batchId: string;
    platform?: 'google' | 'meta' | 'erp';
  } | null;
}

const googleErrors: ErrorGroup[] = [
  {
    id: 'e1',
    platform: 'google',
    issue: 'Store Code Not Found',
    code: 'invalid_store_code',
    impact: 'High',
    count: 450,
    solution: 'Check GMC Linking',
    sampleSkus: ['SKU-1021', 'SKU-1022', 'SKU-1023']
  },
  {
    id: 'e2',
    platform: 'google',
    issue: 'Local Price > Online',
    code: 'price_mismatch',
    impact: 'Low',
    count: 12,
    solution: 'Update pricing feed',
    sampleSkus: ['SKU-4455', 'SKU-4456', 'SKU-4457']
  }
];

const metaErrors: ErrorGroup[] = [
  {
    id: 'e3',
    platform: 'meta',
    issue: 'Product Missing in Catalog',
    code: 'content_id_mismatch',
    impact: 'High',
    count: 85,
    solution: 'Re-sync catalog',
    sampleSkus: ['SKU-7801', 'SKU-7802', 'SKU-7803']
  },
  {
    id: 'e4',
    platform: 'meta',
    issue: 'Throttled',
    code: 'rate_limit_exceeded',
    impact: 'Medium',
    count: 1,
    solution: 'Wait and retry',
    sampleSkus: ['Batch-level error']
  }
];

export default function LogDetailDrawer({ isOpen, onClose, event }: LogDetailDrawerProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  if (!isOpen || !event) return null;

  const errors = event.platform === 'meta' ? metaErrors : googleErrors;
  const totalItems = 12400;
  const successCount = totalItems - errors.reduce((sum, e) => sum + e.count, 0);
  const errorCount = errors.reduce((sum, e) => sum + e.count, 0);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getImpactBadge = (impact: 'High' | 'Medium' | 'Low') => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[600px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {event.platform === 'google' ? (
                <SiGoogle className="w-6 h-6 text-gray-700" />
              ) : (
                <SiMeta className="w-6 h-6 text-gray-700" />
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Batch #{event.batchId}</h2>
                <p className="text-sm text-gray-500">Sync Report</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                <AlertTriangle className="w-4 h-4" />
                Completed with Issues
              </span>
              
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Items</p>
              <p className="text-xl font-bold text-gray-900">{totalItems.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xs text-green-600 mb-1">Success</p>
              <p className="text-xl font-bold text-green-700">{successCount.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-xs text-red-600 mb-1">Errors</p>
              <p className="text-xl font-bold text-red-700">{errorCount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Error Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Error Breakdown</h3>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 uppercase">
              <div className="col-span-1"></div>
              <div className="col-span-1">Platform</div>
              <div className="col-span-4">Issue</div>
              <div className="col-span-2 text-center">Impact</div>
              <div className="col-span-2 text-center">Count</div>
              <div className="col-span-2">Solution</div>
            </div>

            {/* Table Rows */}
            {errors.map((error) => (
              <div key={error.id}>
                {/* Main Row */}
                <div 
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleRow(error.id)}
                >
                  <div className="col-span-1">
                    {expandedRows.has(error.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="col-span-1">
                    {error.platform === 'google' ? (
                      <SiGoogle className="w-4 h-4 text-gray-500" />
                    ) : (
                      <SiMeta className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="col-span-4">
                    <p className="text-sm font-medium text-gray-900">{error.issue}</p>
                    <p className="text-xs font-mono text-gray-400">{error.code}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getImpactBadge(error.impact)}`}>
                      {error.impact}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-semibold text-gray-900">{error.count}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-blue-600">{error.solution}</span>
                  </div>
                </div>

                {/* Expanded Sample SKUs */}
                {expandedRows.has(error.id) && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Sample Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {error.sampleSkus.map((sku, i) => (
                        <span key={i} className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200">
                          {sku}
                        </span>
                      ))}
                      {error.count > 3 && (
                        <span className="text-xs text-gray-400 py-1">
                          +{error.count - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 space-y-2">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
            <Download className="w-4 h-4" />
            Download Error Report (.CSV)
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
            <ExternalLink className="w-4 h-4" />
            View in {event.platform === 'meta' ? 'Meta Commerce Manager' : 'Google Merchant Center'}
          </button>
        </div>
      </div>
    </>
  );
}
