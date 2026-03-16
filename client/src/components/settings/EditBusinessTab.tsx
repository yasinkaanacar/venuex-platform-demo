import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsFormRow from '@/components/settings/SettingsFormRow';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
import { settingsDataService } from '@/lib/mock/settings';
import { showToast } from '@/lib/toast';
import { CardSkeleton, DataErrorState } from '@/components/shared/data-states';
import type { BusinessProfile } from '@/lib/types/settings';

const INPUT_CLS =
  'w-full h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const PLATFORM_BADGES: Array<{
  key: keyof BusinessProfile['categories'];
  color: string;
  letter: string;
}> = [
  { key: 'google', color: 'bg-blue-500', letter: 'G' },
  { key: 'meta', color: 'bg-blue-600', letter: 'M' },
  { key: 'apple', color: 'bg-gray-500', letter: 'A' },
  { key: 'yandex', color: 'bg-red-500', letter: 'Y' },
];

export default function EditBusinessTab() {
  const { t } = useTranslation();
  const oc = t.settings as any;
  const eb = oc?.editBusiness;
  const queryClient = useQueryClient();

  const { data: profile, isLoading, isError } = useQuery<BusinessProfile>({
    queryKey: [QUERY_KEYS.SETTINGS_PROFILE],
    queryFn: () => settingsDataService.getBusinessProfile(),
  });

  const [formData, setFormData] = useState<Partial<BusinessProfile>>({});
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  if (isLoading) {
    return <CardSkeleton lines={8} className="py-6" />;
  }

  if (isError) {
    return <DataErrorState message="Failed to load business profile." />;
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocialField = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...(prev.socialMedia as BusinessProfile['socialMedia']), [platform]: value },
    }));
  };

  function handleFileDrop(file: File) {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    updateField('logoUrl', url);
  }

  async function handleSave() {
    try {
      setSaving(true);
      await settingsDataService.updateBusinessProfile(formData);
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS_PROFILE] });
      showToast({ type: 'success', title: eb?.saveSuccess || 'Business profile updated successfully' });
    } catch {
      showToast({ type: 'error', title: eb?.saveError || 'Failed to update business profile' });
    } finally {
      setSaving(false);
    }
  }

  const confirmText = (eb?.confirmCheckbox || 'I confirm these changes will update {{count}} locations').replace(
    '{{count}}',
    String(profile?.locationCount ?? 0),
  );

  return (
    <div className="space-y-6">
      {/* Section 1: Business Identity */}
      <SettingsSectionCard
        title={eb?.businessIdentity?.title || 'Business Identity'}
        description={eb?.businessIdentity?.desc || 'Your brand name, type, and description'}
        tooltip={eb?.tooltip || 'Changes here apply across all connected platforms and locations'}
      >
        <SettingsFieldGroup>
          {/* Logo Upload */}
          <SettingsFormRow label={eb?.businessIdentity?.logo || 'Brand Logo'} htmlFor="logo-upload">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileDrop(f); }}
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Brand logo" className="h-16 w-auto mx-auto object-contain mb-2 rounded" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-sm text-gray-500">{eb?.businessIdentity?.logoUpload || 'Drag & drop or click to upload'}</p>
              <p className="text-xs text-gray-400 mt-1">{eb?.businessIdentity?.logoHint || 'PNG or JPG, max 2MB'}</p>
              <input ref={fileInputRef} id="logo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileDrop(f); }} />
            </div>
          </SettingsFormRow>

          {/* Brand Name */}
          <SettingsFormRow label={eb?.businessIdentity?.brandName || 'Brand Name'} htmlFor="brandName" required>
            <input id="brandName" className={INPUT_CLS} value={formData.brandName ?? ''} onChange={(e) => updateField('brandName', e.target.value)} />
          </SettingsFormRow>

          {/* Business Type */}
          <SettingsFormRow label={eb?.businessIdentity?.businessType || 'Business Type'} htmlFor="businessType">
            <input id="businessType" className={INPUT_CLS} value={formData.businessType ?? ''} onChange={(e) => updateField('businessType', e.target.value)} />
          </SettingsFormRow>

          {/* Description */}
          <SettingsFormRow label={eb?.businessIdentity?.description || 'Description'} htmlFor="description">
            <textarea
              id="description"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={formData.description ?? ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </SettingsFormRow>
        </SettingsFieldGroup>
      </SettingsSectionCard>

      {/* Section 2: Platform Categories */}
      <SettingsSectionCard
        title={eb?.categories?.title || 'Platform Categories'}
        description={eb?.categories?.desc || 'Category selections per advertising platform'}
      >
        <SettingsFieldGroup>
          {PLATFORM_BADGES.map(({ key, color, letter }) => (
            <SettingsFormRow key={key} label="">
              <div className="flex items-center gap-3 w-full">
                <span className={`w-5 h-5 rounded-full ${color} inline-flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {letter}
                </span>
                <span className="w-16 text-sm font-medium text-gray-700 flex-shrink-0">
                  {eb?.categories?.[key] || key}
                </span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {(formData.categories?.[key] ?? []).length > 0 ? (
                    (formData.categories?.[key] ?? []).map((cat: string) => (
                      <span key={cat} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">{eb?.categories?.noCategories || 'No categories selected'}</span>
                  )}
                </div>
              </div>
            </SettingsFormRow>
          ))}
        </SettingsFieldGroup>
      </SettingsSectionCard>

      {/* Section 3: Contact Information */}
      <SettingsSectionCard
        title={eb?.contactInfo?.title || 'Contact Information'}
        description={eb?.contactInfo?.desc || 'Primary contact details for your business'}
      >
        <SettingsFieldGroup>
          <div className="grid grid-cols-2 gap-x-6 gap-y-0">
            <SettingsFormRow label={eb?.contactInfo?.email || 'Email'} htmlFor="contactEmail" required>
              <input id="contactEmail" type="email" className={INPUT_CLS} value={formData.contactEmail ?? ''} onChange={(e) => updateField('contactEmail', e.target.value)} />
            </SettingsFormRow>
            <SettingsFormRow label={eb?.contactInfo?.website || 'Website'} htmlFor="website">
              <input id="website" type="url" className={INPUT_CLS} value={formData.website ?? ''} onChange={(e) => updateField('website', e.target.value)} />
            </SettingsFormRow>
          </div>
          <SettingsFormRow label={eb?.contactInfo?.phone || 'Phone'} htmlFor="contactPhone">
            <input id="contactPhone" type="tel" className={INPUT_CLS} value={formData.contactPhone ?? ''} onChange={(e) => updateField('contactPhone', e.target.value)} />
          </SettingsFormRow>
        </SettingsFieldGroup>
      </SettingsSectionCard>

      {/* Section 4: Social Media Links */}
      <SettingsSectionCard
        title={eb?.socialMedia?.title || 'Social Media Links'}
        description={eb?.socialMedia?.desc || 'Connect your social media profiles'}
      >
        <SettingsFieldGroup>
          <div className="grid grid-cols-2 gap-x-6 gap-y-0">
            {(
              [
                ['facebook', 'Facebook'],
                ['instagram', 'Instagram'],
                ['x', 'X (Twitter)'],
                ['tiktok', 'TikTok'],
                ['youtube', 'YouTube'],
                ['pinterest', 'Pinterest'],
                ['linkedin', 'LinkedIn'],
              ] as const
            ).map(([platform, fallback]) => (
              <SettingsFormRow key={platform} label={eb?.socialMedia?.[platform] || fallback} htmlFor={`social-${platform}`}>
                <input
                  id={`social-${platform}`}
                  type="url"
                  placeholder="https://..."
                  className={INPUT_CLS}
                  value={(formData.socialMedia as any)?.[platform] ?? ''}
                  onChange={(e) => updateSocialField(platform, e.target.value)}
                />
              </SettingsFormRow>
            ))}
          </div>
        </SettingsFieldGroup>
      </SettingsSectionCard>

      {/* Bottom: Confirm + Save */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmChecked}
            onChange={(e) => setConfirmChecked(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          {confirmText}
        </label>
        <button
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!confirmChecked || saving}
          onClick={handleSave}
        >
          {saving ? (eb?.saving || 'Saving...') : (eb?.save || 'Save Changes')}
        </button>
      </div>
    </div>
  );
}
