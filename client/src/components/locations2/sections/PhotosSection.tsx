import { useState } from 'react';
import { CloudUpload, ImageIcon, X } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function PhotosSection() {
  const { t } = useTranslation();
  const oc = t.locationForms as any;
  const ph = oc?.photos;

  const [files, setFiles] = useState<Array<{ id: string; name: string; preview: string }>>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        preview: URL.createObjectURL(f),
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div id="section-photos" className="vx-card scroll-mt-6">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">
          {oc?.sections?.photos || 'Photos'}
        </h3>
      </div>
      <div className="vx-card-body vx-surface-muted">
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm space-y-4">
          {/* Drop zone */}
          <label
            className={cn(
              'flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
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
              if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
            }}
          >
            <CloudUpload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">
              {ph?.dropzone || 'Drag files here or click to browse'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {ph?.formats || 'Supported: jpg, png, webp'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {ph?.maxSize || 'Max 10 MB per file, up to 20 photos'}
            </p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files?.length) handleFiles(e.target.files);
              }}
            />
          </label>

          {/* Preview grid */}
          {files.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group"
                >
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length === 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ImageIcon className="w-3.5 h-3.5" />
              {ph?.empty || 'No photos uploaded yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
