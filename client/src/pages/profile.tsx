import { useTranslation } from '@/contexts/LanguageContext';
import ProfileInfoSection from '@/components/profile/ProfileInfoSection';
import TeamTableSection from '@/components/profile/TeamTableSection';

export default function Profile() {
  const { t } = useTranslation();
  const oc = (t as any).profile;

  return (
    <div className="vx-section-stack">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {oc?.pageTitle || 'Profile & Team'}
        </h1>
      </div>

      <div className="space-y-6">
        <ProfileInfoSection />
        <TeamTableSection />
      </div>
    </div>
  );
}
