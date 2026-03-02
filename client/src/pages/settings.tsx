import { useSearchParams } from 'wouter';
import { useTranslation } from '@/contexts/LanguageContext';
import CompletionSidebar from '@/components/settings/CompletionSidebar';
import EditBusinessTab from '@/components/settings/EditBusinessTab';
import ActivityFeedTab from '@/components/settings/ActivityFeedTab';
import StoreSetsTab from '@/components/settings/StoreSetsTab';
import DataSourceTab from '@/components/settings/DataSourceTab';
import { cn } from '@/lib/utils';

const TAB_VALUES = ['editBusiness', 'activityFeed', 'storeSets', 'dataSource'] as const;
type SettingsTab = (typeof TAB_VALUES)[number];

export default function Settings() {
  const { t } = useTranslation();
  const oc = t.settings as any;

  const [params, setParams] = useSearchParams();
  const rawTab = params.get('tab');
  const activeTab: SettingsTab = TAB_VALUES.includes(rawTab as SettingsTab)
    ? (rawTab as SettingsTab)
    : 'editBusiness';

  function handleTabChange(tab: SettingsTab) {
    setParams({ tab });
  }

  return (
    <div className="vx-section-stack">
      <div className="flex gap-6">
        {/* Left panel — fixed 288px sidebar */}
        <CompletionSidebar />

        {/* Right panel — flex content area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Tab navigation */}
          <div className="vx-tabs">
            {TAB_VALUES.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn('vx-tab', activeTab === tab && 'vx-tab-active')}
              >
                {oc?.tabs?.[tab] || tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'editBusiness' && <EditBusinessTab />}
          {activeTab === 'activityFeed' && <ActivityFeedTab />}
          {activeTab === 'storeSets' && <StoreSetsTab />}
          {activeTab === 'dataSource' && <DataSourceTab />}
        </div>
      </div>
    </div>
  );
}
