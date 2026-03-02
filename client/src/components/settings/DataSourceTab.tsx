import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Upload } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import { cn } from '@/lib/utils';
import type { DataSourceConnection, DataSourceStatus } from '@/lib/types/settings';

// ─── Status badge styles ─────────────────────────────────────────────────────

const STATUS_STYLES: Record<DataSourceStatus, { bg: string; text: string; dot: string }> = {
  connected: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  error:     { bg: 'bg-red-100',   text: 'text-red-800',   dot: 'bg-red-500' },
  pending:   { bg: 'bg-yellow-100',text: 'text-yellow-800',dot: 'bg-yellow-500' },
  inactive:  { bg: 'bg-gray-100',  text: 'text-gray-600',  dot: 'bg-gray-400' },
};

// ─── DataSourceCard helper ───────────────────────────────────────────────────

interface DataSourceCardProps {
  source: DataSourceConnection;
  expandedSourceId: string | null;
  onToggleExpand: (id: string) => void;
  oc: any;
}

function DataSourceCard({ source, expandedSourceId, onToggleExpand, oc }: DataSourceCardProps) {
  const statusStyle = STATUS_STYLES[source.status];
  const isExpanded = expandedSourceId === source.id;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Top row */}
      <div className="flex items-center justify-between">
        {/* Left: type label + name */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 tracking-wide uppercase">
            {source.type.toUpperCase()}
          </span>
          <span className="text-sm font-medium text-gray-700">{source.name}</span>
        </div>

        {/* Right: status badge */}
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
            statusStyle.bg,
            statusStyle.text,
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full', statusStyle.dot)} />
          {oc?.dataSource?.connectionStatus?.[source.status] || source.status}
        </span>
      </div>

      {/* Info row */}
      <div className="flex items-center mt-2">
        <span className="text-xs text-gray-500">
          {source.lastSyncAt
            ? (oc?.dataSource?.lastSync || 'Last sync: {{date}}').replace(
                '{{date}}',
                new Date(source.lastSyncAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              )
            : (oc?.dataSource?.noSync || 'Never synced')}
        </span>
        {source.recordCount > 0 && (
          <span className="text-xs text-gray-500 ml-4">
            {(oc?.dataSource?.records || '{{count}} records').replace(
              '{{count}}',
              source.recordCount.toLocaleString('tr-TR'),
            )}
          </span>
        )}
      </div>

      {/* Error message */}
      {source.status === 'error' && source.errorMessage && (
        <div className="mt-2 p-2.5 bg-red-50 rounded-md flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="text-xs text-red-700">
            {(oc?.dataSource?.errorDetails || 'Error: {{message}}').replace(
              '{{message}}',
              source.errorMessage,
            )}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex items-center">
        <button
          type="button"
          onClick={() => onToggleExpand(source.id)}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          {oc?.dataSource?.mapData || 'Map Data'}
        </button>
        <button
          type="button"
          className="text-xs font-medium text-gray-600 hover:text-gray-700 cursor-pointer ml-3"
        >
          {oc?.dataSource?.enterDataSource || 'Enter Data Source'}
        </button>
      </div>

      {/* Field mapping table */}
      {isExpanded && source.fieldMappings.length > 0 && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            {oc?.dataSource?.fieldMapping?.title || 'Field Mapping'}
          </h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="vx-th text-left">
                  {oc?.dataSource?.fieldMapping?.sourceColumn || 'Source Column'}
                </th>
                <th className="vx-th text-left">
                  {oc?.dataSource?.fieldMapping?.venueXField || 'VenueX Field'}
                </th>
                <th className="vx-th text-left">
                  {oc?.dataSource?.fieldMapping?.sampleValue || 'Sample Value'}
                </th>
                <th className="vx-th text-left">
                  {oc?.dataSource?.fieldMapping?.status || 'Status'}
                </th>
              </tr>
            </thead>
            <tbody>
              {source.fieldMappings.map((mapping) => (
                <tr key={mapping.id} className="border-b border-gray-50">
                  <td className="vx-td font-mono">{mapping.sourceColumn}</td>
                  <td className="vx-td">{mapping.venueXField}</td>
                  <td className="vx-td text-gray-500">{mapping.sampleValue || '—'}</td>
                  <td className="vx-td">
                    {mapping.mapped ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {oc?.dataSource?.fieldMapping?.mapped || 'Mapped'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {oc?.dataSource?.fieldMapping?.unmapped || 'Unmapped'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Save button */}
          <div className="mt-2">
            <button
              type="button"
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700"
            >
              {oc?.dataSource?.fieldMapping?.save || 'Save Mapping'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DataSourceTab ────────────────────────────────────────────────────────────

export default function DataSourceTab() {
  const { t } = useTranslation();
  const oc = t.settings as any;

  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  const { data: sources = [], isLoading } = useQuery<DataSourceConnection[]>({
    queryKey: ['/api/settings/data-sources'],
  });

  const salesSources = sources.filter((s) => s.category === 'sales');
  const inventorySources = sources.filter((s) => s.category === 'inventory');

  function handleToggleExpand(id: string) {
    setExpandedSourceId((prev) => (prev === id ? null : id));
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="vx-card animate-pulse">
            <div className="vx-card-header">
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
            <div className="vx-card-body vx-surface-muted">
              <div className="p-5 bg-white rounded-lg border border-gray-100 h-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Sales Data Settings */}
      <SettingsSectionCard
        title={oc?.dataSource?.salesSection || 'Sales Data Settings'}
        description={oc?.dataSource?.salesDesc || 'Configure how sales data flows into VenueX'}
      >
        <div className="space-y-3">
          {salesSources.map((source) => (
            <DataSourceCard
              key={source.id}
              source={source}
              expandedSourceId={expandedSourceId}
              onToggleExpand={handleToggleExpand}
              oc={oc}
            />
          ))}
          {salesSources.length === 0 && (
            <div className="p-5 bg-white rounded-lg border border-gray-100 text-center text-gray-400 py-8 text-sm">
              No sales data sources configured
            </div>
          )}
        </div>
      </SettingsSectionCard>

      {/* Section 2: Inventory Data Settings */}
      <SettingsSectionCard
        title={oc?.dataSource?.inventorySection || 'Inventory Data Settings'}
        description={oc?.dataSource?.inventoryDesc || 'Configure how inventory data flows into VenueX'}
      >
        <div className="space-y-3">
          {inventorySources.map((source) => (
            <DataSourceCard
              key={source.id}
              source={source}
              expandedSourceId={expandedSourceId}
              onToggleExpand={handleToggleExpand}
              oc={oc}
            />
          ))}
          {inventorySources.length === 0 && (
            <div className="p-5 bg-white rounded-lg border border-gray-100 text-center text-gray-400 py-8 text-sm">
              No inventory data sources configured
            </div>
          )}
        </div>
      </SettingsSectionCard>

      {/* Section 3: Store Data Settings */}
      <SettingsSectionCard
        title={oc?.dataSource?.storeDataSection || 'Store Data Settings'}
        description={oc?.dataSource?.storeDataDesc || 'Import and manage store-level data'}
      >
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center py-8">
          <Upload className="w-8 h-8 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 max-w-sm">
            {oc?.dataSource?.storeDataDesc || 'Import and manage store-level data'}
          </p>
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            {oc?.dataSource?.importButton || 'Import Store Data'}
          </button>
        </div>
      </SettingsSectionCard>
    </div>
  );
}
