import { Lock } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';

export default function PasswordStubSection() {
  const { t } = useTranslation();
  const oc = (t as any).profile;

  return (
    <SettingsSectionCard
      title={oc?.passwordTitle || 'Password'}
      description={oc?.passwordDesc || 'Manage your account password'}
      tooltip={oc?.passwordTooltip || 'Password management will be available in a future update'}
    >
      <SettingsFieldGroup>
        <div className="flex items-start gap-3 py-3">
          <Lock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-500">
            {oc?.passwordPlaceholder ||
              'Password change functionality is not yet available. This feature will be enabled in a future update.'}
          </p>
        </div>
      </SettingsFieldGroup>
    </SettingsSectionCard>
  );
}
