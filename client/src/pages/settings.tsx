import { useSearchParams } from 'wouter';
import { useTranslation } from '@/contexts/LanguageContext';
import CompletionSidebar from '@/components/settings/CompletionSidebar';
import { cn } from '@/lib/utils';

const TAB_VALUES = ['editBusiness', 'activityFeed', 'storeSets', 'dataSource'] as const;
type SettingsTab = (typeof TAB_VALUES)[number];

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          This tab will be implemented in a subsequent plan.
        </p>
      </div>
      <div className="vx-card-body vx-surface-muted">
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm text-center text-gray-400 py-12">
          Coming soon
        </div>
      </div>
    </div>
  );
}

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
          {activeTab === 'editBusiness' && (
            <PlaceholderTab name={oc?.tabs?.editBusiness || 'Edit Business'} />
          )}
          {activeTab === 'activityFeed' && (
            <PlaceholderTab name={oc?.tabs?.activityFeed || 'Activity Feed'} />
          )}
          {activeTab === 'storeSets' && (
            <PlaceholderTab name={oc?.tabs?.storeSets || 'Store Sets'} />
          )}
          {activeTab === 'dataSource' && (
            <PlaceholderTab name={oc?.tabs?.dataSource || 'Data Source & Mapping'} />
          )}
        </div>
      </div>
    </div>
  );
}
