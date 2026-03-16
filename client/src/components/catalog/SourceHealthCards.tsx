import { Info, Server, Zap } from 'lucide-react';
import type { IngestionSource } from '@/lib/types/catalog';

interface SourceHealthCardsProps {
  sources: IngestionSource[];
}

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

function getStatusColor(source: IngestionSource) {
  if (source.isStale) return { dot: 'bg-red-500', ring: 'ring-red-500/20' };
  if (source.status === 'warning') return { dot: 'bg-amber-500', ring: 'ring-amber-500/20' };
  return { dot: 'bg-green-500', ring: 'ring-green-500/20' };
}

function getSourceIcon(type: IngestionSource['type']) {
  return type === 'sftp' ? Server : Zap;
}

export default function SourceHealthCards({ sources }: SourceHealthCardsProps) {
  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-foreground">Source Health</h3>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
              Shows the health and freshness of each data source feeding into VenueX. Staleness is detected when a feed hasn't arrived within its expected interval.
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Ingestion sources and feed freshness status</p>
      </div>

      <div className="vx-card-body vx-surface-muted">
        <div className={`grid gap-4 ${sources.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {sources.map((source) => {
            const colors = getStatusColor(source);
            const Icon = getSourceIcon(source.type);
            const timeAgo = formatTimeAgo(source.lastReceivedAt);
            const nextIn = formatTimeUntil(source.nextExpectedAt);
            const isOverdue = nextIn === 'overdue';

            return (
              <div
                key={source.id}
                className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
              >
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
    </div>
  );
}
