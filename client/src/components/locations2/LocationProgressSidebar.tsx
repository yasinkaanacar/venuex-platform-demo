import { useWatch, Control } from 'react-hook-form';
import { CheckCircle2, Circle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import type { LocationFormData } from '@/lib/types/location-form';

interface LocationProgressSidebarProps {
  control: Control<LocationFormData>;
  mode: 'add' | 'edit';
}

// Section field configs with completion logic
const SECTION_CONFIGS = {
  basicInfo: {
    total: 9,
    countFn: (values: LocationFormData) =>
      (['name', 'storeCode', 'description', 'metaCategory', 'appleCategory', 'yandexCategory', 'authority', 'phone', 'website'] as const)
        .filter((f) => !!(values[f] as string)?.trim()).length,
  },
  socialMedia: {
    total: 7,
    countFn: (values: LocationFormData) =>
      (['facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'pinterest', 'linkedin'] as const)
        .filter((f) => !!(values[f] as string)?.trim()).length,
  },
  address: {
    total: 8,
    countFn: (values: LocationFormData) =>
      (['latitude', 'longitude', 'country', 'city', 'address', 'district', 'neighborhood', 'postalCode'] as const)
        .filter((f) => !!(values[f] as string)?.trim()).length,
  },
  hours: {
    total: 7,
    countFn: (values: LocationFormData) =>
      values.workingHours.filter((d) => d.isOpen).length,
  },
  amenities: {
    total: 1,
    countFn: (values: LocationFormData) =>
      values.amenities.length > 0 ? 1 : 0,
  },
};

export default function LocationProgressSidebar({ control, mode }: LocationProgressSidebarProps) {
  const { t } = useTranslation();
  const oc = t.locationForms as any;

  const values = useWatch({ control }) as LocationFormData;

  // Compute per-section filled counts
  const basicInfoFilled = SECTION_CONFIGS.basicInfo.countFn(values);
  const socialMediaFilled = SECTION_CONFIGS.socialMedia.countFn(values);
  const addressFilled = SECTION_CONFIGS.address.countFn(values);
  const hoursFilled = SECTION_CONFIGS.hours.countFn(values);
  const amenitiesFilled = SECTION_CONFIGS.amenities.countFn(values);

  // Overall percentage across all sections (32 total fields)
  const totalFilled = basicInfoFilled + socialMediaFilled + addressFilled + hoursFilled + amenitiesFilled;
  const totalFields = 9 + 7 + 8 + 7 + 1; // 32
  const percentage = Math.round((totalFilled / totalFields) * 100);

  const sections = [
    {
      key: 'basicInfo',
      label: oc?.sections?.basicInfo || 'Basic Info',
      filled: basicInfoFilled,
      total: SECTION_CONFIGS.basicInfo.total,
    },
    {
      key: 'socialMedia',
      label: oc?.sections?.socialMedia || 'Social Media',
      filled: socialMediaFilled,
      total: SECTION_CONFIGS.socialMedia.total,
    },
    {
      key: 'address',
      label: oc?.sections?.address || 'Location',
      filled: addressFilled,
      total: SECTION_CONFIGS.address.total,
    },
    {
      key: 'hours',
      label: oc?.sections?.hours || 'Working Hours',
      filled: hoursFilled,
      total: SECTION_CONFIGS.hours.total,
    },
    {
      key: 'amenities',
      label: oc?.sections?.amenities || 'Amenities',
      filled: amenitiesFilled,
      total: SECTION_CONFIGS.amenities.total,
    },
    // Edit mode adds photo sections (always 0/1 in prototype — photo upload is mocked)
    ...(mode === 'edit' ? [
      {
        key: 'photos',
        label: oc?.sections?.photos || 'Photos',
        filled: 0,
        total: 1,
      },
      {
        key: 'coverPhoto',
        label: oc?.sections?.coverPhoto || 'Business Cover Photo',
        filled: 0,
        total: 1,
      },
    ] : []),
  ];

  return (
    <div className="w-72 flex-shrink-0 sticky top-6 self-start">
      <div className="vx-card">
        <div className="vx-card-body space-y-4">
          {/* Brand identity (hardcoded Karaca for prototype) */}
          <div className="flex flex-col items-start gap-2">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-400">K</span>
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Karaca</p>
              <p className="text-xs text-gray-500">145 locations</p>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {percentage}% {oc?.progress?.completed || 'Completed'}
              </span>
              <span className="text-sm font-semibold text-blue-600">{percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Section checklist */}
          <div className="mt-4 space-y-2.5">
            {sections.map((section) => (
              <div key={section.key} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {section.filled === section.total ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={
                      section.filled === section.total
                        ? 'text-sm text-gray-700 truncate'
                        : 'text-sm text-gray-500 truncate'
                    }
                  >
                    {section.label}
                  </span>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {section.filled}/{section.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
