import { useState } from 'react';
import { Zap, Info, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';
import type { PlatformSyncStatus, RejectionReason } from '@/lib/types/catalog';

interface DataPipelineCardProps {
  ingestion: {
    connected: boolean;
    lastReceivedAt: string;
    itemCount: number;
  };
  statuses: PlatformSyncStatus[];
}

/* ── Helpers ── */

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getStatusColor(status: 'connected' | 'warning' | 'disconnected') {
  switch (status) {
    case 'connected': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'disconnected': return 'bg-red-500';
  }
}

function getPlatformMeta(platform: 'google' | 'meta') {
  if (platform === 'google') {
    return { name: 'Google LIA', bgColor: 'bg-[#4285F4]', letter: 'G' };
  }
  return { name: 'Meta Local Inventory', bgColor: 'bg-[#1877F2]', letter: 'M' };
}

function getSyncBadge(status: PlatformSyncStatus['syncStatus']) {
  switch (status) {
    case 'healthy':
      return { label: 'Healthy', className: 'bg-green-50 text-green-700 border-green-200' };
    case 'warning':
      return { label: 'Warning', className: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'error':
      return { label: 'Error', className: 'bg-red-50 text-red-700 border-red-200' };
  }
}

function syncHealthToConnectionStatus(health: PlatformSyncStatus['syncStatus']): 'connected' | 'warning' | 'disconnected' {
  switch (health) {
    case 'healthy': return 'connected';
    case 'warning': return 'warning';
    case 'error': return 'disconnected';
  }
}

/* ── Rejection Reason Row ── */

function RejectionReasonRow({ reason }: { reason: RejectionReason }) {
  return (
    <div className="flex items-start gap-2.5 py-2.5 px-3 hover:bg-red-50/50 rounded-md transition-colors">
      <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-medium text-gray-900">{reason.errorType}</span>
            <span className="text-xs font-mono text-gray-400 hidden sm:inline">{reason.errorCode}</span>
          </div>
          <span className="text-xs font-semibold text-red-600 flex-shrink-0">{reason.count} items</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{reason.description}</p>
      </div>
    </div>
  );
}

/* ── Platform Card ── */

function PlatformSyncCard({ status }: { status: PlatformSyncStatus }) {
  const [expanded, setExpanded] = useState(status.rejected > 0);
  const meta = getPlatformMeta(status.platform);
  const badge = getSyncBadge(status.syncStatus);
  const total = status.published + status.rejected + status.pending;
  const successRate = total > 0 ? ((status.published / total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded ${meta.bgColor} flex items-center justify-center text-white text-xs font-bold`}>
              {meta.letter}
            </div>
            <span className="text-sm font-semibold text-gray-900">{meta.name}</span>
          </div>
          <span className={`px-2 py-0.5 text-xs font-medium rounded border ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span className="text-lg font-bold text-green-600">{status.published.toLocaleString('tr-TR')}</span>
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Published</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <XCircle className="w-3 h-3 text-red-500" />
              <span className="text-lg font-bold text-red-600">{status.rejected.toLocaleString('tr-TR')}</span>
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Rejected</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-lg font-bold text-amber-600">{status.pending.toLocaleString('tr-TR')}</span>
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Pending</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Success rate</span>
            <span className="font-medium text-gray-700">{successRate}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Last sync: {formatTimeAgo(status.lastSyncAt)}
        </div>
      </div>

      {status.rejected > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="w-full flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-red-50/40 hover:bg-red-50/70 transition-colors"
          >
            <span className="text-xs font-medium text-red-700">
              {status.rejectionReasons.length} rejection reason{status.rejectionReasons.length !== 1 ? 's' : ''}
            </span>
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5 text-red-400" />
              : <ChevronDown className="w-3.5 h-3.5 text-red-400" />
            }
          </button>

          {expanded && (
            <div className="px-3 py-2 border-t border-red-100/60 bg-white divide-y divide-gray-50">
              {status.rejectionReasons.map((reason) => (
                <RejectionReasonRow key={reason.id} reason={reason} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Main Component ── */

export default function DataPipelineCard({ ingestion, statuses }: DataPipelineCardProps) {
  const sourceStatus = ingestion.connected ? 'connected' as const : 'disconnected' as const;
  const googleStatus = statuses.find(s => s.platform === 'google');
  const metaStatus = statuses.find(s => s.platform === 'meta');

  return (
    <div className="vx-card shadow-sm">
      <div className="vx-card-header">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-foreground">Data Connection Status</h3>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
              End-to-end view of local inventory data — from client ERP into VenueX, then out to Google and Meta.
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        </div>
      </div>

      <div className="vx-card-body space-y-5">
        {/* ── Connection Flow + Last Ingestion ── */}
        <div className="vx-surface-muted rounded-lg overflow-hidden">
          {/* Flow Diagram */}
          <div className="flex items-center justify-between p-4">
            {/* ERP Source Node */}
            <div className="flex items-center gap-3 flex-shrink-0 z-10">
              <div className="relative">
                <div className={`w-3 h-3 ${getStatusColor(sourceStatus)} rounded-full`} />
                {sourceStatus === 'connected' && (
                  <div className={`absolute inset-0 w-3 h-3 ${getStatusColor(sourceStatus)} rounded-full animate-ping opacity-50`} />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">ERP / Inventory Data</p>
                <p className="text-xs text-gray-500">
                  {ingestion.connected ? `Synced ${formatTimeAgo(ingestion.lastReceivedAt)}` : 'Not connected'}
                </p>
              </div>
            </div>

            {/* Connector 1 */}
            <div className="flex-1 mx-4 h-0.5 bg-gray-200 rounded-full overflow-hidden relative">
              {ingestion.connected && (
                <div className="absolute inset-0 w-full h-full">
                  <div className="h-full w-1/2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-flow-contained" />
                </div>
              )}
            </div>

            {/* VenueX Node */}
            <div className="flex items-center gap-3 flex-shrink-0 z-10">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">VenueX</p>
              </div>
            </div>

            {/* Connector 2 */}
            <div className="flex-1 mx-4 h-0.5 bg-gray-200 rounded-full overflow-hidden relative">
              {ingestion.connected && (
                <div className="absolute inset-0 w-full h-full">
                  <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-flow-contained" />
                </div>
              )}
            </div>

            {/* Platform Nodes */}
            <div className="flex flex-col gap-2 flex-shrink-0 z-10">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <div className={`w-2 h-2 ${getStatusColor(googleStatus ? syncHealthToConnectionStatus(googleStatus.syncStatus) : 'disconnected')} rounded-full`} />
                <SiGoogle className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Google LIA</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <div className={`w-2 h-2 ${getStatusColor(metaStatus ? syncHealthToConnectionStatus(metaStatus.syncStatus) : 'disconnected')} rounded-full`} />
                <SiMeta className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Meta Local Inv.</span>
              </div>
            </div>
          </div>

          {/* Last Ingestion — inside the same container */}
          <div className="px-4 pb-4 pt-3 border-t border-gray-200/60">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Ingestion</h4>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                ingestion.connected
                  ? 'bg-green-50 text-green-700 border-green-100'
                  : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                {ingestion.connected ? 'Success' : 'Failed'}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                local-inventory-{new Date(ingestion.lastReceivedAt).toISOString().slice(0, 10)}.csv
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Ingestion Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(ingestion.lastReceivedAt).toLocaleDateString('tr-TR')} - {new Date(ingestion.lastReceivedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Items Received</p>
                <p className="text-sm font-medium text-gray-900">{ingestion.itemCount.toLocaleString('tr-TR')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className={`flex items-center gap-1.5 ${ingestion.connected ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-1.5 h-1.5 ${ingestion.connected ? 'bg-green-600' : 'bg-red-600'} rounded-full animate-pulse`} />
                  <span className="text-sm font-medium">{ingestion.connected ? 'Completed' : 'Failed'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Platform Upload Detail Cards ── */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Platform Upload Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {statuses.map((status) => (
              <PlatformSyncCard key={status.platform} status={status} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flow-contained {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-flow-contained {
          animation: flow-contained 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
