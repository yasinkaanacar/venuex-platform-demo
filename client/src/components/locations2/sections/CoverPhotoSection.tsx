import { useState } from 'react';
import { CloudUpload, X } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type Platform = 'gbp' | 'meta' | 'apple';

const PLATFORM_TABS: Array<{ id: Platform; label: string; icon: string }> = [
  { id: 'gbp', label: 'GBP', icon: 'G' },
  { id: 'meta', label: 'Meta', icon: 'M' },
  { id: 'apple', label: 'Apple', icon: 'A' },
];

export default function CoverPhotoSection() {
  const { t } = useTranslation();
  const oc = t.locationForms as any;
  const cp = oc?.coverPhoto;

  const [activePlatform, setActivePlatform] = useState<Platform>('gbp');
  const [photos, setPhotos] = useState<Record<Platform, string | null>>({
    gbp: null,
    meta: null,
    apple: null,
  });
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPhotos((prev) => ({ ...prev, [activePlatform]: url }));
  };

  const currentPhoto = photos[activePlatform];

  return (
    <div id="section-cover-photo" className="vx-card scroll-mt-6">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">
          {oc?.sections?.coverPhoto || 'Business Cover Photo'}
        </h3>
      </div>
      <div className="vx-card-body vx-surface-muted">
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm space-y-4">
          {/* Platform tabs */}
          <div className="flex gap-1 border-b border-gray-100">
            {PLATFORM_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePlatform(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activePlatform === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold',
                    activePlatform === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-500',
                  )}
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Photo or drop zone */}
          {currentPhoto ? (
            <div className="relative aspect-[3/1] rounded-lg overflow-hidden border border-gray-100 group">
              <img
                src={currentPhoto}
                alt={`${activePlatform} cover`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPhotos((prev) => ({ ...prev, [activePlatform]: null }))}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <label
              className={cn(
                'flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                dragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
            >
              <CloudUpload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                {cp?.dropzone || 'Drag file here or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {cp?.formats || 'Supported: jpg, png, webp'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {cp?.recommendation || 'Recommended: 1024×576 (16:9)'}
              </p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
