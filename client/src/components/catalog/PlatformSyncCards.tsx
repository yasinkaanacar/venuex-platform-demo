import { Info, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { PlatformSyncStatus } from '@/lib/types/catalog';

interface PlatformSyncCardsProps {
  statuses: PlatformSyncStatus[];
}

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ago`;
}

function getPlatformMeta(platform: 'google' | 'meta') {
  if (platform === 'google') {
    return {
      name: 'Google LIA',
      bgColor: 'bg-[#4285F4]',
      letter: 'G',
    };
  }
  return {
    name: 'Meta Local Inventory',
    bgColor: 'bg-[#1877F2]',
    letter: 'M',
  };
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

export default function PlatformSyncCards({ statuses }: PlatformSyncCardsProps) {
  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-foreground">Platform Sync</h3>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
              Shows how many products are successfully published, rejected, or pending on each ad platform.
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Product publish status per advertising platform</p>
      </div>

      <div className="vx-card-body vx-surface-muted">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statuses.map((status) => {
            const meta = getPlatformMeta(status.platform);
            const badge = getSyncBadge(status.syncStatus);

            return (
              <div
                key={status.platform}
                className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
              >
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
  );
}
