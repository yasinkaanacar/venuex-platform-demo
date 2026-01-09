import { useState } from 'react';
import { Zap, Activity, ChevronRight, X } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';
import { Tooltip } from '@/components/ui/tooltip';

interface PipelineStatusProps {
  erpStatus?: 'connected' | 'disconnected' | 'warning';
  erpLastSync?: string;
  erpLatency?: number;
  processedCount?: number;
  avgProcessingTime?: number;
  googleStatus?: 'connected' | 'disconnected' | 'warning';
  metaStatus?: 'connected' | 'disconnected' | 'warning';
  batchActivity?: Array<{
    id: number;
    batchId: string;
    platform: 'google' | 'meta';
    items: number;
    status: 'success' | 'partial' | 'failed';
    duration: string;
    timestamp: string;
    errors?: number;
  }>;
  onActivityLogClick?: () => void;
}

export default function PipelineStatus({
  erpStatus = 'connected',
  erpLastSync = '2 min ago',
  erpLatency = 24,
  processedCount = 124500,
  avgProcessingTime = 1.2,
  googleStatus = 'connected',
  metaStatus = 'connected',
  batchActivity = [],
  onActivityLogClick,
}: PipelineStatusProps) {
  const [showDrawer, setShowDrawer] = useState(false);

  const getStatusColor = (status: 'connected' | 'disconnected' | 'warning') => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
    }
  };

  const getStatusText = (status: 'connected' | 'disconnected' | 'warning') => {
    switch (status) {
      case 'connected': return 'Excellent';
      case 'warning': return 'Degraded';
      case 'disconnected': return 'Disconnected';
    }
  };

  const handleActivityClick = () => {
    if (onActivityLogClick) {
      onActivityLogClick();
    } else {
      setShowDrawer(!showDrawer);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            
            {/* ERP Node */}
            <Tooltip title={`Connection Strength: ${getStatusText(erpStatus)} (${erpLatency}ms)`} arrow>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <div className={`w-3 h-3 ${getStatusColor(erpStatus)} rounded-full`}></div>
                  {erpStatus === 'connected' && (
                    <div className={`absolute inset-0 w-3 h-3 ${getStatusColor(erpStatus)} rounded-full animate-ping opacity-50`}></div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Client ERP</p>
                  <p className="text-xs text-gray-500">Last sync: {erpLastSync}</p>
                </div>
              </div>
            </Tooltip>

            {/* Animated Connector 1 */}
            <div className="flex items-center gap-1">
              <div className="relative w-16 h-0.5 bg-gray-200 overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 animate-flow"></div>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-500" />
            </div>

            {/* VenueX Engine Node */}
            <Tooltip title={`Avg Processing Time: ${avgProcessingTime}s`} arrow>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">VenueX Engine</p>
                  <p className="text-xs text-blue-600">Processing {processedCount.toLocaleString()} items</p>
                </div>
              </div>
            </Tooltip>

            {/* Animated Connector 2 */}
            <div className="flex items-center gap-1">
              <div className="relative w-16 h-0.5 bg-gray-200 overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 animate-flow"></div>
              </div>
              <ChevronRight className="w-4 h-4 text-green-500" />
            </div>

            {/* Destination Nodes */}
            <div className="flex items-center gap-5">
              <Tooltip title={`Google Merchant: ${getStatusText(googleStatus)}`} arrow>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-2 h-2 ${getStatusColor(googleStatus)} rounded-full`}></div>
                  <SiGoogle className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-600">Merchant</span>
                </div>
              </Tooltip>

              <Tooltip title={`Meta Commerce: ${getStatusText(metaStatus)}`} arrow>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-2 h-2 ${getStatusColor(metaStatus)} rounded-full`}></div>
                  <SiMeta className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-600">Commerce</span>
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Activity Log Button */}
          <button 
            onClick={handleActivityClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Activity Log</span>
          </button>
        </div>
      </div>

      {/* Activity Drawer */}
      {showDrawer && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Batch Activity Log</h3>
            <button onClick={() => setShowDrawer(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-64px)]">
            {batchActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            ) : (
              batchActivity.map((batch) => (
                <div key={batch.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Batch #{batch.batchId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      batch.status === 'success' ? 'bg-green-100 text-green-700' :
                      batch.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {batch.status === 'success' ? 'Success' : 
                       batch.status === 'partial' ? `Partial (${batch.errors ?? 0} errors)` : 'Failed'}
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
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-flow {
          animation: flow 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
