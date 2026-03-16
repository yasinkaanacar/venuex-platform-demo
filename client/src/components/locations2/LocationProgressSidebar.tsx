import { useState, useEffect, useCallback } from 'react';
import { useWatch, Control } from 'react-hook-form';
import { CheckCircle2, Circle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { LocationFormData } from '@/lib/types/location-form';

interface LocationProgressSidebarProps {
  control: Control<LocationFormData>;
  mode: 'add' | 'edit';
}

// Section field configs with completion logic
const SECTION_CONFIGS = {
  basicInfo: {
    total: 10,
    countFn: (values: LocationFormData) =>
      (['name', 'storeCode', 'description', 'googleCategory', 'metaCategory', 'appleCategory', 'yandexCategory', 'authority', 'phone', 'website'] as const)
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
    countFn: (values: LocationFormData) => {
      let count = 0;
      if (values.lat && values.lat !== 0) count++;
      if (values.lng && values.lng !== 0) count++;
      if (values.countryCode?.trim()) count++;
      if (values.administrativeArea?.trim()) count++;
      if (values.fullAddress?.trim()) count++;
      if (values.locality?.trim()) count++;
      if (values.sublocality?.trim()) count++;
      if (values.postalCode?.trim()) count++;
      return count;
    },
  },
  hours: {
    total: 7,
    countFn: (values: LocationFormData) =>
      values.workingHours.filter((d) => d.active).length,
  },
  amenities: {
    total: 1,
    countFn: (values: LocationFormData) =>
      Object.keys(values.amenities).length > 0 ? 1 : 0,
  },
};

// Maps section keys to DOM ids for scroll targeting
const SECTION_IDS: Record<string, string> = {
  basicInfo: 'section-basic-info',
  socialMedia: 'section-social-media',
  address: 'section-address',
  hours: 'section-hours',
  amenities: 'section-amenities',
  photos: 'section-photos',
  coverPhoto: 'section-cover-photo',
};

export default function LocationProgressSidebar({ control, mode }: LocationProgressSidebarProps) {
  const { t } = useTranslation();
  const oc = t.locationForms as any;

  const values = useWatch({ control }) as LocationFormData;
  const [activeSection, setActiveSection] = useState('basicInfo');

  // Compute per-section filled counts
  const basicInfoFilled = SECTION_CONFIGS.basicInfo.countFn(values);
  const socialMediaFilled = SECTION_CONFIGS.socialMedia.countFn(values);
  const addressFilled = SECTION_CONFIGS.address.countFn(values);
  const hoursFilled = SECTION_CONFIGS.hours.countFn(values);
  const amenitiesFilled = SECTION_CONFIGS.amenities.countFn(values);

  const totalFilled = basicInfoFilled + socialMediaFilled + addressFilled + hoursFilled + amenitiesFilled;
  const totalFields = 10 + 7 + 8 + 7 + 1; // 33
  const percentage = Math.round((totalFilled / totalFields) * 100);

  const sections = [
    { key: 'basicInfo', label: oc?.sections?.basicInfo || 'Basic Info', filled: basicInfoFilled, total: SECTION_CONFIGS.basicInfo.total },
    { key: 'socialMedia', label: oc?.sections?.socialMedia || 'Social Media', filled: socialMediaFilled, total: SECTION_CONFIGS.socialMedia.total },
    { key: 'address', label: oc?.sections?.address || 'Location', filled: addressFilled, total: SECTION_CONFIGS.address.total },
    { key: 'hours', label: oc?.sections?.hours || 'Working Hours', filled: hoursFilled, total: SECTION_CONFIGS.hours.total },
    { key: 'amenities', label: oc?.sections?.amenities || 'Amenities', filled: amenitiesFilled, total: SECTION_CONFIGS.amenities.total },
    ...(mode === 'edit' ? [
      { key: 'photos', label: oc?.sections?.photos || 'Photos', filled: 0, total: 1 },
      { key: 'coverPhoto', label: oc?.sections?.coverPhoto || 'Cover Photo', filled: 0, total: 1 },
    ] : []),
  ];

  // Scroll-spy: track which section is in view
  const handleScroll = useCallback(() => {
    const sectionKeys = sections.map((s) => s.key);
    let current = sectionKeys[0];

    for (const key of sectionKeys) {
      const el = document.getElementById(SECTION_IDS[key]);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Section is "active" when its top is above the 40% mark of the viewport
        if (rect.top <= window.innerHeight * 0.4) {
          current = key;
        }
      }
    }
    setActiveSection(current);
  }, [sections.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Click-to-scroll
  const scrollToSection = (key: string) => {
    const el = document.getElementById(SECTION_IDS[key]);
    if (el) {
      const yOffset = -24; // some breathing room
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-72 flex-shrink-0 sticky top-6 self-start">
      <div className="vx-card">
        <div className="vx-card-body space-y-4">
          {/* Brand identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-gray-400">K</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Karaca</p>
              <p className="text-[11px] text-gray-500">
                {percentage}% {oc?.progress?.completed || 'Completed'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Section checklist — clickable navigation */}
          <nav className="space-y-0.5">
            {sections.map((section) => {
              const isComplete = section.filled === section.total;
              const isActive = activeSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => scrollToSection(section.key)}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-left transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-600',
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle
                        className={cn(
                          'w-4 h-4 flex-shrink-0',
                          isActive ? 'text-blue-400' : 'text-gray-300',
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        'text-sm truncate',
                        isActive ? 'font-medium' : 'font-normal',
                      )}
                    >
                      {section.label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-[11px] flex-shrink-0 tabular-nums',
                      isComplete ? 'text-green-500 font-medium' : 'text-gray-400',
                    )}
                  >
                    {section.filled}/{section.total}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
