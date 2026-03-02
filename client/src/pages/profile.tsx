import { useTranslation } from '@/contexts/LanguageContext';

export default function Profile() {
  const { t } = useTranslation();
  const oc = (t as any).profile;

  return (
    <div className="vx-section-stack">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{oc?.pageTitle || 'Profile & Team'}</h1>
        </div>
      </div>
      {/* Sections will be added by Plans 02 and 03 */}
    </div>
  );
}
