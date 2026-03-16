import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useBrandContext } from '@/hooks/useAuth';
import { useApiLocationForm } from '@/hooks/api';
import { apiRequest } from '@/lib/queryClient';
import { showToast } from '@/lib/toast';
import { PATHS } from '@/routes/paths';
import {
  locationFormSchema,
  type LocationFormData,
  type LocationFormRecord,
  emptyLocationFormData,
} from '@/lib/types/location-form';
import LocationProgressSidebar from './LocationProgressSidebar';
import BasicInfoSection from './sections/BasicInfoSection';
import SocialMediaSection from './sections/SocialMediaSection';
import AddressMapSection from './sections/AddressMapSection';
import WorkingHoursSection from './sections/WorkingHoursSection';
import AmenitiesSection from './sections/AmenitiesSection';
import PhotosSection from './sections/PhotosSection';
import CoverPhotoSection from './sections/CoverPhotoSection';

interface LocationEditFormProps {
  mode: 'add' | 'edit';
  locationId?: string;
}

// Strip record-only fields, return only form fields
function mapRecordToFormData(record: LocationFormRecord): LocationFormData {
  return {
    name: record.name,
    storeCode: record.storeCode,
    description: record.description,
    googleCategory: record.googleCategory,
    metaCategory: record.metaCategory,
    appleCategory: record.appleCategory,
    yandexCategory: record.yandexCategory,
    authority: record.authority,
    phone: record.phone,
    phoneCountryCode: record.phoneCountryCode,
    website: record.website,
    additionalPhones: record.additionalPhones,
    facebook: record.facebook,
    instagram: record.instagram,
    twitter: record.twitter,
    tiktok: record.tiktok,
    youtube: record.youtube,
    pinterest: record.pinterest,
    linkedin: record.linkedin,
    lat: record.lat,
    lng: record.lng,
    countryCode: record.countryCode,
    administrativeArea: record.administrativeArea,
    fullAddress: record.fullAddress,
    locality: record.locality,
    sublocality: record.sublocality,
    postalCode: record.postalCode,
    addressLines: record.addressLines,
    locationStatus: record.locationStatus,
    workingHours: record.workingHours,
    amenities: record.amenities,
  };
}

export default function LocationEditForm({ mode, locationId }: LocationEditFormProps) {
  const { t } = useTranslation();
  const oc = t.locationForms as any;
  const [, setLocation] = useLocation();

  // Fetch existing record in edit mode
  const { brandId } = useBrandContext();
  const { data: locationData, isLoading, isError } = useApiLocationForm({
    brandId,
    locationId,
    enabled: mode === 'edit' && !!locationId,
  });

  // Initialize form — defaultValues set once on first render
  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationFormSchema),
    defaultValues:
      mode === 'edit' && locationData
        ? mapRecordToFormData(locationData)
        : emptyLocationFormData,
    // Re-initialize when edit data loads
    values:
      mode === 'edit' && locationData
        ? mapRecordToFormData(locationData)
        : undefined,
  });

  const onSubmit = async (data: LocationFormData) => {
    try {
      if (mode === 'add') {
        await apiRequest('POST', '/api/location-form', data);
      } else {
        await apiRequest('PATCH', `/api/location-form/${locationId}`, data);
      }
      showToast({ type: 'success', title: oc?.saveSuccess || 'Location saved successfully' });
      setLocation(PATHS.LOCATIONS);
    } catch {
      showToast({ type: 'error', title: oc?.saveError || 'Failed to save location' });
    }
  };

  // Loading skeleton for edit mode while data is fetching
  if (mode === 'edit' && isLoading) {
    return (
      <div className="vx-section-stack">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
            <div className="w-40 h-7 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-20 h-9 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Two-column skeleton */}
        <div className="flex gap-6 items-start">
          <div className="w-72 flex-shrink-0">
            <div className="vx-card">
              <div className="vx-card-body space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="border-t border-gray-100" />
                <div className="h-2 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                      <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-6">
            <div className="vx-card">
              <div className="vx-card-header">
                <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="vx-card-body vx-surface-muted">
                <div className="p-5 bg-white rounded-lg border border-gray-100 space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-full h-9 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state for edit mode
  if (mode === 'edit' && isError) {
    return (
      <div className="vx-section-stack">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm font-medium text-red-500 mb-1">
            {oc?.loadError || 'Failed to load location data'}
          </p>
          <button
            type="button"
            onClick={() => setLocation(PATHS.LOCATIONS)}
            className="mt-3 text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2"
          >
            {oc?.backToLocations || 'Back to Locations'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vx-section-stack">
      {/* Header bar: back arrow + title + save button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLocation(PATHS.LOCATIONS)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">
            {mode === 'add' ? (oc?.addTitle || 'Add Location') : (oc?.editTitle || 'Edit Location')}
          </h1>
        </div>
        <button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {oc?.save || 'Save'}
        </button>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* Left sidebar — sticky */}
        <LocationProgressSidebar control={form.control} mode={mode} />

        {/* Right content — scrollable sections */}
        <div className="flex-1 min-w-0 space-y-6">
          <BasicInfoSection form={form} />
          <SocialMediaSection form={form} />
          <AddressMapSection form={form} />
          <WorkingHoursSection form={form} />
          <AmenitiesSection form={form} />
          {mode === 'edit' && (
            <>
              <PhotosSection />
              <CoverPhotoSection />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
