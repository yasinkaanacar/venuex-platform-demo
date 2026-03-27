import { useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';

import CatalogQuickStats from '@/components/catalog/CatalogQuickStats';
import DataPipelineCard from '@/components/catalog/DataPipelineCard';
import FeedHygieneIssues from '@/components/catalog/FeedHygieneIssues';
import ProductsTable from '@/components/catalog/ProductsTable';
import ActivityLog from '@/components/catalog/ActivityLog';

import {
  mockCatalogQuickStats,
  mockIngestionSources,
  mockPlatformSyncStatuses,
  mockFeedHygieneIssues,
  mockCatalogProducts,
} from '@/lib/mock/catalog';

type TabId = 'dashboard' | 'products' | 'activity';

export default function Catalog() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { t } = useTranslation();

  const tabs: { id: TabId; label: string }[] = [
    { id: 'dashboard', label: t.common?.summary || 'Dashboard' },
    { id: 'products', label: t.catalog?.product || 'Products' },
    { id: 'activity', label: t.common?.activity || 'Feed Activity' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Stats — always visible above tabs */}
      <div className="px-6 pt-5 pb-3 bg-white border-b border-gray-100">
        <CatalogQuickStats data={mockCatalogQuickStats} />
      </div>

      {/* Tab Navigation — sticky below header */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
          <div className="vx-section-stack space-y-6">
            <DataPipelineCard sources={mockIngestionSources} statuses={mockPlatformSyncStatuses} />
            <FeedHygieneIssues issues={mockFeedHygieneIssues} />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="vx-section-stack">
            <ProductsTable products={mockCatalogProducts} />
          </div>
        )}

        {activeTab === 'activity' && (
          <ActivityLog />
        )}
      </div>
    </div>
  );
}
