import { UseFormReturn } from 'react-hook-form';
import { Check } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { LocationFormData } from '@/lib/types/location-form';
import { AMENITY_CATEGORIES } from '@/lib/types/location-form';

interface AmenitiesSectionProps {
  form: UseFormReturn<LocationFormData>;
}

export default function AmenitiesSection({ form }: AmenitiesSectionProps) {
  const { t, language } = useTranslation();
  const oc = t.locationForms as any;
  const isTurkish = language === 'tr';

  const amenities = form.watch('amenities');

  const toggleAmenity = (id: string) => {
    const current = form.getValues('amenities');
    const next = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    form.setValue('amenities', next, { shouldDirty: true });
  };

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">
          {oc?.sections?.amenities || 'Amenities'}
        </h3>
      </div>
      <div className="vx-card-body vx-surface-muted">
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm space-y-6">
          {AMENITY_CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {isTurkish ? cat.labelTr : cat.label}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => {
                  const selected = amenities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleAmenity(item.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors',
                        selected
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      )}
                    >
                      {selected && <Check className="w-3 h-3" />}
                      {isTurkish ? item.labelTr : item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
