import { useState } from 'react';
import {
  Database, Send, Globe, Server,
  RefreshCw, CheckCircle, AlertTriangle, Loader2,
  Calendar, Clock, FileText, Info,
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { useTranslation } from '@/contexts/LanguageContext';
import { fNumber } from '@/lib/formatters';
import {
  mockIngestionSources,
  mockDestinations,
  type IngestionSource,
  type PlatformDestination,
  type SyncResult,
} from '@/lib/mock/pipeline';

// --- Source helpers ---

function getSourceTypeIcon(type: string) {
  switch (type) {
    case 'api': return <Globe className="w-4 h-4 text-purple-600" />;
    case 'sftp': return <Server className="w-4 h-4 text-teal-600" />;
    default: return <Database className="w-4 h-4 text-gray-500" />;
  }
}

function getSourceTypeBadge(type: string) {
  const styles: Record<string, string> = {
    api: 'bg-purple-50 text-purple-700 border-purple-200',
    sftp: 'bg-teal-50 text-teal-700 border-teal-200',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {type}
    </span>
  );
}

function getSourceStatusDot(status: string) {
  const colors: Record<string, string> = {
    connected: 'bg-emerald-500',
    syncing: 'bg-blue-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };
  return (
    <span className="relative flex h-2.5 w-2.5">
      {(status === 'syncing' || status === 'connected') && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${status === 'syncing' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[status] || 'bg-gray-400'}`} />
    </span>
  );
}

function getSyncDotColor(result: SyncResult) {
  switch (result) {
    case 'success': return 'bg-emerald-500';
    case 'warning': return 'bg-amber-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-300';
  }
}

// --- Destination helpers ---

function getPlatformIcon(platform: string) {
  switch (platform) {
    case 'google':
      return <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><SiGoogle className="w-4 h-4 text-red-500" /></div>;
    case 'meta':
      return <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><SiMeta className="w-4 h-4 text-blue-600" /></div>;
    case 'tiktok':
      return <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><SiTiktok className="w-4 h-4 text-gray-900" /></div>;
    default:
      return <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><Globe className="w-4 h-4 text-gray-500" /></div>;
  }
}

function getDestStatusBadge(status: string, labels: Record<string, string>) {
  const configs: Record<string, { bg: string; Icon: typeof CheckCircle; key: string; spin?: boolean }> = {
    active: { bg: 'bg-emerald-50 text-emerald-700', Icon: CheckCircle, key: 'active' },
    syncing: { bg: 'bg-blue-50 text-blue-700', Icon: Loader2, key: 'syncing', spin: true },
    warning: { bg: 'bg-amber-50 text-amber-700', Icon: AlertTriangle, key: 'warning' },
    error: { bg: 'bg-red-50 text-red-700', Icon: AlertTriangle, key: 'error' },
    paused: { bg: 'bg-gray-100 text-gray-600', Icon: Clock, key: 'paused' },
  };
  const config = configs[status] || configs.active;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.bg}`}>
      <config.Icon className={`w-3 h-3 ${config.spin ? 'animate-spin' : ''}`} />
      {labels[config.key] || config.key}
    </span>
  );
}

function getMatchRateBarColor(rate: number) {
  if (rate >= 75) return 'bg-emerald-500';
  if (rate >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function getMatchRateTextColor(rate: number) {
  if (rate >= 75) return 'text-emerald-700';
  if (rate >= 60) return 'text-amber-700';
  return 'text-red-700';
}

// --- Sub-components ---

function SourceCard({ source, dc }: { source: IngestionSource; dc?: Record<string, string> }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          {getSourceTypeIcon(source.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900 truncate">{source.name}</h4>
            {getSourceTypeBadge(source.type)}
          </div>
          <p className="text-xs text-gray-400 font-mono truncate mt-0.5">{source.serverUrl}</p>
        </div>
        {getSourceStatusDot(source.status)}
      </div>

      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {source.schedule}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {source.lastSync}
        </span>
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {source.fileSize}
        </span>
        <span className="font-medium text-gray-700">{source.recordCount}</span>
      </div>

      <div className="flex items-center gap-1.5 mt-3">
        {source.recentSyncs.map((result, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${getSyncDotColor(result)}`} />
        ))}
        <span className="text-[10px] text-gray-400 ml-1">{dc?.lastSyncs || 'Last 7 syncs'}</span>
      </div>
    </div>
  );
}

function DestinationCard({ dest, labels, dc }: { dest: PlatformDestination; labels: Record<string, string>; dc?: Record<string, string> }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        {getPlatformIcon(dest.platform)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900">{dest.name}</h4>
            {getDestStatusBadge(dest.status, labels)}
          </div>
        </div>
        {dest.errorCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600">
            {dest.errorCount} {dc?.errors || 'errors'}
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{dc?.matchRateLabel || 'Match Rate'}</span>
          <span className={`text-xs font-bold ${getMatchRateTextColor(dest.matchRate)}`}>
            {dest.matchRate}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getMatchRateBarColor(dest.matchRate)}`}
            style={{ width: `${dest.matchRate}%` }}
          />
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
        <span className="font-medium text-gray-700">{fNumber(dest.eventsUploaded)} {dc?.eventsLabel || 'events'}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {dest.lastUpload}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {dc?.nextUpload || 'Next'}: {dest.nextScheduled}
        </span>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function DataPipelineStatus() {
  const { t } = useTranslation();
  const dc = (t.offlineConversions as any)?.dataConnectionTab as Record<string, string> | undefined;
  const oc = (t.offlineConversions as any) || {};

  const statusLabels: Record<string, string> = {
    active: oc?.active || 'Active',
    syncing: oc?.syncing || 'Syncing',
    warning: oc?.warning || 'Warning',
    error: oc?.error || 'Error',
    paused: dc?.paused || 'Paused',
    connected: dc?.connected || 'Connected',
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Ingestion Sources */}
      <div className="vx-card">
        <div className="vx-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-gray-500" />
              <h3 className="text-base font-semibold text-foreground">
                {dc?.ingestionSources || 'Ingestion Sources'}
              </h3>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                  {dc?.ingestionSourcesTooltip || 'Your configured data sources for offline conversion events.'}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                </div>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {oc?.refresh || 'Refresh'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">{dc?.ingestionSourcesDesc || 'Data source connections and sync status'}</p>
        </div>
        <div className="vx-card-body vx-surface-muted space-y-3">
          {mockIngestionSources.map((source) => (
            <SourceCard key={source.id} source={source} dc={dc} />
          ))}
        </div>
      </div>

      {/* Platform Destinations */}
      <div className="vx-card">
        <div className="vx-card-header">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-gray-500" />
            <h3 className="text-base font-semibold text-foreground">
              {dc?.platformDestinations || 'Platform Destinations'}
            </h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                {dc?.platformDestinationsTooltip || 'Ad platform endpoints receiving your offline conversion data.'}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{dc?.platformDestinationsDesc || 'Ad platform upload status and match rates'}</p>
        </div>
        <div className="vx-card-body vx-surface-muted space-y-3">
          {mockDestinations.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} labels={statusLabels} dc={dc} />
          ))}
        </div>
      </div>
    </div>
  );
}
