import { Info, Server, Zap, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { IngestionSource, PlatformSyncStatus } from '@/lib/types/catalog';

interface DataPipelineCardProps {
  sources: IngestionSource[];
  statuses: PlatformSyncStatus[];
}

/* ── Shared helpers ── */

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatTimeUntil(isoDate: string | null): string {
  if (!isoDate) return 'realtime';
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return 'overdue';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `~${minutes}m`;
  return `~${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/* ── Source Health helpers ── */

function getStatusColor(source: IngestionSource) {
  if (source.isStale) return { dot: 'bg-red-500', ring: 'ring-red-500/20' };
  if (source.status === 'warning') return { dot: 'bg-amber-500', ring: 'ring-amber-500/20' };
  return { dot: 'bg-green-500', ring: 'ring-green-500/20' };
}

function getSourceIcon(type: IngestionSource['type']) {
  return type === 'sftp' ? Server : Zap;
}

/* ── Platform Sync helpers ── */

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

export default function DataPipelineCard({ sources, statuses }: DataPipelineCardProps) {
  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-foreground">Data Pipeline</h3>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
              Shows ingestion source health and platform sync status. Staleness is detected when a feed hasn't arrived within its expected interval.
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Feed freshness and platform publish status</p>
      </div>

      <div className="vx-card-body vx-surface-muted space-y-5">
        {/* ── Source Health ── */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Source Health</h4>
          <div className={`grid gap-3 ${sources.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {sources.map((source) => {
              const colors = getStatusColor(source);
              const Icon = getSourceIcon(source.type);
              const timeAgo = formatTimeAgo(source.lastReceivedAt);
              const nextIn = formatTimeUntil(source.nextExpectedAt);
              const isOverdue = nextIn === 'overdue';

              return (
                <div key={source.id} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} ring-4 ${colors.ring}`} />
                      <span className="text-sm font-semibold text-gray-900">{source.name}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-[11px] font-medium text-gray-600 uppercase tracking-wider">
                      <Icon className="w-3 h-3" />
                      {source.type}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last received</span>
                      <span className={source.isStale ? 'text-red-600 font-medium' : 'text-gray-900'}>{timeAgo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">SKUs in batch</span>
                      <span className="text-gray-900">{source.lastBatchSkuCount.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next expected</span>
                      <span className={isOverdue ? 'text-amber-600 font-medium' : 'text-gray-900'}>{nextIn}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Platform Sync ── */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Platform Sync</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {statuses.map((status) => {
              const meta = getPlatformMeta(status.platform);
              const badge = getSyncBadge(status.syncStatus);

              return (
                <div key={status.platform} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded ${meta.bgColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                        {meta.letter}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{meta.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded border ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span className="text-lg font-bold text-green-600">{status.published.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Published</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span className="text-lg font-bold text-red-600">{status.rejected.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Rejected</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-lg font-bold text-amber-600">{status.pending.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Pending</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                    Last sync: {formatTimeAgo(status.lastSyncAt)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
