import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useTranslation } from '@/contexts/LanguageContext';
import type { LocationFormData } from '@/lib/types/location-form';
import { TURKISH_CITIES } from '@/lib/types/location-form';

// Fix Vite marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface AddressMapSectionProps {
  form: UseFormReturn<LocationFormData>;
}

// Child component: re-centers map when coordinates change
function MapCenterSyncer({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (!isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function AddressMapSection({ form }: AddressMapSectionProps) {
  const { t } = useTranslation();
  const oc = t.locationForms as any;
  const loc = oc?.location;

  const lat = form.watch('lat');
  const lng = form.watch('lng');
  const isValidCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  const center: [number, number] = isValidCoords ? [lat, lng] : [41.0082, 28.9784];

  return (
    <div id="section-address" className="vx-card scroll-mt-6">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">
          {oc?.sections?.address || 'Location'}
        </h3>
      </div>
      <div className="vx-card-body vx-surface-muted">
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm space-y-5">

          {/* Row 1: Lat/Lng inputs + Map side by side */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Latitude */}
              <div>
                <label className={labelClass}>{loc?.latitude || 'Latitude'}</label>
                <input
                  {...form.register('lat', { valueAsNumber: true })}
                  type="number"
                  step="any"
                  className={inputClass}
                  placeholder="41.0082"
                />
              </div>
              {/* Longitude */}
              <div>
                <label className={labelClass}>{loc?.longitude || 'Longitude'}</label>
                <input
                  {...form.register('lng', { valueAsNumber: true })}
                  type="number"
                  step="any"
                  className={inputClass}
                  placeholder="28.9784"
                />
              </div>
            </div>

            {/* Map */}
            <div className="h-48 rounded-lg overflow-hidden border border-gray-200">
              <MapContainer
                center={center}
                zoom={15}
                className="w-full h-full"
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {isValidCoords && <Marker position={[lat, lng]} />}
                {isValidCoords && <MapCenterSyncer lat={lat} lng={lng} />}
              </MapContainer>
            </div>
          </div>

          {/* Row 2: Country code */}
          <div>
            <label className={labelClass}>{loc?.country || 'Country'}</label>
            <select {...form.register('countryCode')} className={inputClass}>
              <option value="TR">Türkiye</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Row 3: Administrative area (province/city) */}
          <div>
            <label className={labelClass}>{loc?.city || 'Province / City'}</label>
            <select {...form.register('administrativeArea')} className={inputClass}>
              <option value="">— Select —</option>
              {TURKISH_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Full address */}
          <div>
            <label className={labelClass}>{loc?.address || 'Address'}</label>
            <input
              {...form.register('fullAddress')}
              className={inputClass}
              placeholder="Abdi İpekçi Cad. No: 20"
            />
          </div>

          {/* Row 5: Locality (district) + Sublocality (neighborhood) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{loc?.district || 'District'}</label>
              <input
                {...form.register('locality')}
                className={inputClass}
                placeholder="Şişli"
              />
            </div>
            <div>
              <label className={labelClass}>{loc?.neighborhood || 'Neighborhood'}</label>
              <input
                {...form.register('sublocality')}
                className={inputClass}
                placeholder="Nişantaşı"
              />
            </div>
          </div>

          {/* Row 6: Postal Code */}
          <div>
            <label className={labelClass}>{loc?.postalCode || 'Postal Code'}</label>
            <input
              {...form.register('postalCode')}
              className={inputClass}
              placeholder="34367"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
