import { Zap, ChevronRight } from 'lucide-react';
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
}

export default function PipelineStatus({
  erpStatus = 'connected',
  erpLastSync = '2 min ago',
  erpLatency = 24,
  processedCount = 124500,
  avgProcessingTime = 1.2,
  googleStatus = 'connected',
  metaStatus = 'connected',
}: PipelineStatusProps) {

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center">
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
      </div>

      <style>{`
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-flow {
          animation: flow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
