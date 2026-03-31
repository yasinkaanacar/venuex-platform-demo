import { useState } from 'react';
import { X, Download, ChevronRight } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

interface ErrorItem {
  id: string;
  platform: 'google' | 'meta';
  errorType: string;
  errorCode: string;
  count: number;
}

interface BatchReportSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    batchId: string;
    platform?: 'google' | 'meta' | 'erp';
  } | null;
}

const mockErrors: ErrorItem[] = [
  {
    id: 'e1',
    platform: 'google',
    errorType: 'Store Code Mismatch',
    errorCode: 'invalid_store_code',
    count: 45
  },
  {
    id: 'e2',
    platform: 'meta',
    errorType: 'Price Mismatch',
    errorCode: 'price_mismatch',
    count: 32
  },
  {
    id: 'e3',
    platform: 'google',
    errorType: 'Missing GTIN',
    errorCode: 'missing_gtin',
    count: 28
  },
  {
    id: 'e4',
    platform: 'meta',
    errorType: 'Invalid Image URL',
    errorCode: 'invalid_image_url',
    count: 15
  }
];

export default function BatchReportSheet({ isOpen, onClose, event }: BatchReportSheetProps) {
  if (!isOpen || !event) return null;

  const totalCount = 125000;
  const issueCount = mockErrors.reduce((sum, e) => sum + e.count, 0);
  const successCount = totalCount - issueCount;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 h-full w-[600px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header Section (Sticky) */}
        <div className="px-6 py-5 border-b border-gray-200">
          {/* Title Row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Batch #{event.batchId} Report</h2>
              <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                Completed with Issues
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors -mr-2 -mt-1"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Summary Metrics */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-500">Total: </span>
              <span className="font-medium text-gray-700">{totalCount.toLocaleString('tr-TR')}</span>
            </div>
            <div>
              <span className="text-gray-500">Success: </span>
              <span className="font-medium text-green-600">{successCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Issues: </span>
              <span className="font-bold text-red-600">{issueCount}</span>
            </div>
          </div>
        </div>

        {/* Body Section (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-sm text-gray-500 mb-4">
            We found {issueCount} items that failed to sync. Grouped by error type:
          </p>

          {/* Error Table */}
          <div className="space-y-0">
            {mockErrors.map((error) => (
              <div
                key={error.id}
                className="flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
              >
                {/* Platform Icon */}
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {error.platform === 'google' ? (
                    <SiGoogle className="w-4 h-4 text-gray-600" />
                  ) : (
                    <SiMeta className="w-4 h-4 text-gray-600" />
                  )}
                </div>

                {/* Error Type */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{error.errorType}</p>
                  <p className="text-xs font-mono text-gray-400">Error code: {error.errorCode}</p>
                </div>

                {/* Count Badge */}
                <div className="flex-shrink-0">
                  <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {error.count} items
                  </span>
                </div>

                {/* Action — disabled, coming soon */}
                <button
                  disabled
                  title="Coming soon"
                  className="flex items-center gap-1 text-sm text-gray-400 cursor-not-allowed font-medium flex-shrink-0"
                >
                  Preview <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Section (Sticky) */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
            <Download className="w-4 h-4" />
            Download Error Report (.CSV)
          </button>
        </div>
      </div>
    </>
  );
}
