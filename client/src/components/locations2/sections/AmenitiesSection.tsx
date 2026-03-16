import { UseFormReturn } from 'react-hook-form';
import { Check, X } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { LocationFormData } from '@/lib/types/location-form';
import { AMENITY_CATEGORIES } from '@/lib/types/location-form';

interface AmenitiesSectionProps {
  form: UseFormReturn<LocationFormData>;
}

type AmenityState = 'neutral' | 'available' | 'not_available';

export default function AmenitiesSection({ form }: AmenitiesSectionProps) {
  const { t, language } = useTranslation();
  const oc = t.locationForms as any;
  const isTurkish = language === 'tr';

  const amenities = form.watch('amenities');

  const getState = (id: string): AmenityState => {
    if (!(id in amenities)) return 'neutral';
    return amenities[id] as AmenityState;
  };

  const cycleState = (id: string) => {
    const current = { ...form.getValues('amenities') };
    const state = getState(id);
    if (state === 'neutral') {
      current[id] = 'available';
    } else if (state === 'available') {
      current[id] = 'not_available';
    } else {
      delete current[id];
    }
    form.setValue('amenities', current, { shouldDirty: true });
  };

  return (
    <div id="section-amenities" className="vx-card scroll-mt-6">
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
                  const state = getState(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => cycleState(item.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors',
                        state === 'available' &&
                          'bg-blue-500 text-white border-blue-500',
                        state === 'not_available' &&
                          'bg-red-500 text-white border-red-500',
                        state === 'neutral' &&
                          'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      )}
                    >
                      {state === 'available' && <Check className="w-3 h-3" />}
                      {state === 'not_available' && <X className="w-3 h-3" />}
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
