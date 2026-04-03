import { useState } from 'react';
import { useBrandContext } from '@/hooks/useAuth';
import { useApiCatalogPipeline } from '@/hooks/api';
import { useTranslation } from '@/contexts/LanguageContext';

import DataPipelineCard from '@/components/catalog/DataPipelineCard';
import ActivityLog from '@/components/catalog/ActivityLog';

import { Skeleton } from '@mui/material';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { trackTabSwitch } from '@/lib/analytics';

type TabId = 'dashboard' | 'activity';

export default function Catalog() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { brandId } = useBrandContext();
  const { data, isLoading, error, refetch } = useApiCatalogPipeline({ brandId });
  const { t } = useTranslation();
  const oc = t.catalog as any;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'dashboard', label: oc?.dataConnection || 'Data Connection' },
    { id: 'activity', label: oc?.feedActivity || 'Feed Activity' },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="vx-card">
            <div className="vx-card-body vx-surface-muted">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{oc?.errorTitle || 'Failed to load catalog data'}</h3>
                <p className="text-xs text-gray-500 mb-4">{oc?.errorDesc || 'Please check your connection and try again'}</p>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {oc?.retry || 'Retry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation — sticky below header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-6 py-2">
          <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); trackTabSwitch({ module: 'catalog', tab_name: tab.id }); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6 bg-white min-h-[calc(100vh-12rem)]">
        {activeTab === 'dashboard' && (
          <div className="vx-section-stack">
            {isLoading ? (
              <div className="space-y-5">
                {/* Flow diagram skeleton */}
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                {/* Platform cards skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
                </div>
              </div>
            ) : data ? (
              <DataPipelineCard
                ingestion={data.ingestion}
                statuses={data.statuses}
              />
            ) : null}
          </div>
        )}

        {activeTab === 'activity' && (
          <ActivityLog />
        )}
      </div>
    </div>
  );
}
