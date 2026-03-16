import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from '@/contexts/LanguageContext';
import type { LocationFormData } from '@/lib/types/location-form';

interface SocialMediaSectionProps {
  form: UseFormReturn<LocationFormData>;
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function SocialMediaSection({ form }: SocialMediaSectionProps) {
  const { t } = useTranslation();
  const oc = t.locationForms as any;
  const sm = oc?.socialMedia;

  return (
    <div id="section-social-media" className="vx-card scroll-mt-6">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">
          {oc?.sections?.socialMedia || 'Social Media'}
        </h3>
      </div>
      <div className="vx-card-body vx-surface-muted">
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 gap-4">

            {/* Facebook */}
            <div>
              <label className={labelClass}>{sm?.facebook || 'Facebook'}</label>
              <input
                {...form.register('facebook')}
                className={inputClass}
                placeholder="https://www.facebook.com/..."
              />
            </div>

            {/* Instagram */}
            <div>
              <label className={labelClass}>{sm?.instagram || 'Instagram'}</label>
              <input
                {...form.register('instagram')}
                className={inputClass}
                placeholder="https://www.instagram.com/..."
              />
            </div>

            {/* X (Twitter) */}
            <div>
              <label className={labelClass}>{sm?.twitter || 'X (Twitter)'}</label>
              <input
                {...form.register('twitter')}
                className={inputClass}
                placeholder="https://x.com/..."
              />
            </div>

            {/* TikTok */}
            <div>
              <label className={labelClass}>{sm?.tiktok || 'TikTok'}</label>
              <input
                {...form.register('tiktok')}
                className={inputClass}
                placeholder="https://www.tiktok.com/@..."
              />
            </div>

            {/* YouTube */}
            <div>
              <label className={labelClass}>{sm?.youtube || 'YouTube'}</label>
              <input
                {...form.register('youtube')}
                className={inputClass}
                placeholder="https://www.youtube.com/..."
              />
            </div>

            {/* Pinterest */}
            <div>
              <label className={labelClass}>{sm?.pinterest || 'Pinterest'}</label>
              <input
                {...form.register('pinterest')}
                className={inputClass}
                placeholder="https://www.pinterest.com/..."
              />
            </div>

            {/* LinkedIn — full width */}
            <div className="col-span-2">
              <label className={labelClass}>{sm?.linkedin || 'LinkedIn'}</label>
              <input
                {...form.register('linkedin')}
                className={inputClass}
                placeholder="https://www.linkedin.com/company/..."
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
