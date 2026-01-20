import { useState } from 'react';

import SummaryTab from '@/components/catalog/SummaryTab';
import ActivityLog from '@/components/catalog/ActivityLog';

export default function Catalog() {
  const [mainTab, setMainTab] = useState<'ozet' | 'aktivite'>('ozet');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Removed - Managed globally */}

      {/* Tab Navigation - Sticky below header */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setMainTab('ozet')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mainTab === 'ozet'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
            >
              Özet
            </button>
            <button
              onClick={() => setMainTab('aktivite')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mainTab === 'aktivite'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
            >
              Aktivite
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive padding */}
      <div className="p-4 sm:p-6 bg-white min-h-[calc(100vh-8rem)]">
        {/* Özet Tab */}
        {mainTab === 'ozet' && (
          <SummaryTab />
        )}

        {/* Aktivite Tab */}
        {mainTab === 'aktivite' && (
          <ActivityLog />
        )}
      </div>
    </div>
  );
}
