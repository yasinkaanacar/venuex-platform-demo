import { useTranslation } from '@/contexts/LanguageContext';

export default function LocationAdd() {
  const { t } = useTranslation();
  const oc = t.locationForms as any;

  return (
    <div className="vx-section-stack">
      <h1 className="text-2xl font-semibold text-foreground">
        {oc?.addTitle || 'Add Location'}
      </h1>
      <p className="text-sm text-gray-500 mt-2">
        Location form will be built in Plan 03-02.
      </p>
    </div>
  );
}
