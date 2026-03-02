import { useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Info, Plus, X } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import type { LocationFormData } from '@/lib/types/location-form';
import { PLATFORM_CATEGORIES } from '@/lib/types/location-form';

interface BasicInfoSectionProps {
  form: UseFormReturn<LocationFormData>;
}

const COUNTRY_CODES = [
  { code: '+90', flag: '🇹🇷', label: '+90' },
  { code: '+1', flag: '🇺🇸', label: '+1' },
  { code: '+44', flag: '🇬🇧', label: '+44' },
  { code: '+49', flag: '🇩🇪', label: '+49' },
  { code: '+33', flag: '🇫🇷', label: '+33' },
];

export default function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const { t } = useTranslation();
  const oc = t.locationForms as any;
  const bi = oc?.basicInfo;

  const [showTooltip, setShowTooltip] = useState(false);

  const { fields: additionalPhones, append, remove } = useFieldArray({
    control: form.control,
    name: 'additionalPhones' as never,
  });

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">
          {oc?.sections?.basicInfo || 'Basic Info'}
        </h3>
      </div>
      <div className="vx-card-body vx-surface-muted">
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm space-y-5">

          {/* 1. Location Name */}
          <div>
            <label className={labelClass}>{bi?.name || 'Location Name'}</label>
            <input
              {...form.register('name')}
              className={inputClass}
              placeholder="Karaca Nişantaşı"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* 2. Store Identifier */}
          <div>
            <label className={labelClass}>{bi?.storeCode || 'Store Identifier'}</label>
            <input
              {...form.register('storeCode')}
              className={inputClass}
              placeholder="KRC-IST-001"
            />
          </div>

          {/* 3. Description */}
          <div>
            <label className={labelClass}>{bi?.description || 'Description'}</label>
            <input
              {...form.register('description')}
              className={inputClass}
              placeholder="Alışveriş merkezi, Giyim mağazası"
            />
          </div>

          {/* 4. Platform Categories */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-sm font-medium text-gray-700">Categories</span>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-[9999]">
                  {bi?.categoryTooltip || 'Categories are synced to each platform automatically'}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {/* Meta Category */}
              <div>
                <label className={labelClass}>{bi?.metaCategory || 'Meta Category'}</label>
                <select {...form.register('metaCategory')} className={inputClass}>
                  <option value="">— Select —</option>
                  {PLATFORM_CATEGORIES.meta.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {/* Apple Category */}
              <div>
                <label className={labelClass}>{bi?.appleCategory || 'Apple Category'}</label>
                <select {...form.register('appleCategory')} className={inputClass}>
                  <option value="">— Select —</option>
                  {PLATFORM_CATEGORIES.apple.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {/* Yandex Category */}
              <div>
                <label className={labelClass}>{bi?.yandexCategory || 'Yandex Category'}</label>
                <select {...form.register('yandexCategory')} className={inputClass}>
                  <option value="">— Select —</option>
                  {PLATFORM_CATEGORIES.yandex.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 5. Authority */}
          <div>
            <label className={labelClass}>{bi?.authority || 'Authority'}</label>
            <textarea
              {...form.register('authority')}
              rows={3}
              className={inputClass.replace('py-2', 'py-2 resize-none')}
              placeholder="Türkiye"
            />
          </div>

          {/* 6. Stub action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              {bi?.addSameDate || 'Aynı Tarihte Ekle'}
            </button>
            <button
              type="button"
              className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {bi?.relatedGroup || 'İlgili Konum Grubu'}
            </button>
          </div>

          {/* 7. Phone with country code */}
          <div>
            <label className={labelClass}>{bi?.phone || 'Phone'}</label>
            <div className="flex gap-2">
              <select
                {...form.register('phoneCountryCode')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-24 flex-shrink-0"
              >
                {COUNTRY_CODES.map((cc) => (
                  <option key={cc.code} value={cc.code}>
                    {cc.flag} {cc.label}
                  </option>
                ))}
              </select>
              <input
                {...form.register('phone')}
                className={inputClass}
                placeholder="555 123 4567"
                type="tel"
              />
            </div>
          </div>

          {/* Additional phone numbers */}
          {(additionalPhones as Array<{ id: string }>).map((field, index) => (
            <div key={field.id}>
              <div className="flex gap-2 items-center">
                <input
                  {...form.register(`additionalPhones.${index}` as const)}
                  className={inputClass}
                  placeholder="555 123 4567"
                  type="tel"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* 8. Website */}
          <div>
            <label className={labelClass}>{bi?.website || 'Website'}</label>
            <input
              {...form.register('website')}
              className={inputClass}
              placeholder="https://www.karaca.com"
              type="url"
            />
            {form.formState.errors.website && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.website.message}</p>
            )}
          </div>

          {/* 9. Add another phone link */}
          <button
            type="button"
            onClick={() => append('')}
            className="flex items-center gap-1.5 text-blue-500 text-sm hover:text-blue-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {bi?.addPhone || 'Farklı Bir Telefon Numarası Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}
