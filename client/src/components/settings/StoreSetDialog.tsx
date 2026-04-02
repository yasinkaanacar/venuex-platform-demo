import { useState, useEffect } from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsFormRow from '@/components/settings/SettingsFormRow';
import type { StoreSet } from '@/lib/types/settings';

// Hardcoded Istanbul location names for multi-select
const MOCK_LOCATIONS = [
  { id: 'loc-cevahir', name: 'Nova Living Cevahir AVM' },
  { id: 'loc-kanyon', name: 'Nova Living Kanyon AVM' },
  { id: 'loc-zorlu', name: 'Nova Living Zorlu Center' },
  { id: 'loc-istinye', name: 'Nova Living Istinye Park' },
  { id: 'loc-akasya', name: 'Nova Living Akasya AVM' },
  { id: 'loc-marmara', name: 'Nova Living Marmara Forum' },
  { id: 'loc-mall', name: 'Nova Living Mall of Istanbul' },
  { id: 'loc-bagdat', name: 'Nova Living Bağdat Caddesi' },
  { id: 'loc-nisantasi', name: 'Nova Living Nişantaşı' },
  { id: 'loc-kadikoy', name: 'Nova Living Kadıköy' },
];

interface StoreSetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSet: StoreSet | null;
  onSave: (data: { name: string; description: string; locationIds: string[] }) => Promise<void>;
}

export default function StoreSetDialog({
  open,
  onOpenChange,
  editingSet,
  onSave,
}: StoreSetDialogProps) {
  const { t } = useTranslation();
  const oc = t.settings as any;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Reset form when dialog opens or editingSet changes
  useEffect(() => {
    if (open) {
      setName(editingSet?.name ?? '');
      setDescription(editingSet?.description ?? '');
      setSelectedLocationIds(editingSet?.locationIds?.slice(0, 10) ?? []);
      setSaving(false);
    }
  }, [open, editingSet]);

  function handleToggleLocation(id: string) {
    setSelectedLocationIds((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), description: description.trim(), locationIds: selectedLocationIds });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  const isEditMode = editingSet !== null;
  const dialogTitle = isEditMode
    ? oc?.storeSets?.dialog?.editTitle || 'Edit Store Set'
    : oc?.storeSets?.dialog?.createTitle || 'Create Store Set';

  return (
    <MuiDialog
      open={open}
      onClose={() => !saving && onOpenChange(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      {/* Dialog Title */}
      <MuiDialogTitle
        sx={{
          px: 3,
          py: 2,
          fontSize: '1rem',
          fontWeight: 600,
          color: '#111827',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {dialogTitle}
        <IconButton
          onClick={() => !saving && onOpenChange(false)}
          size="small"
          sx={{ color: '#9ca3af', '&:hover': { color: '#374151' } }}
        >
          <X size={16} />
        </IconButton>
      </MuiDialogTitle>

      {/* Dialog Content */}
      <MuiDialogContent sx={{ px: 3, py: 2.5 }}>
        <div className="space-y-1 divide-y divide-gray-100">
          {/* Name field */}
          <SettingsFormRow
            label={oc?.storeSets?.dialog?.nameLabel || 'Name'}
            htmlFor="store-set-name"
            required
          >
            <input
              id="store-set-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={oc?.storeSets?.dialog?.namePlaceholder || 'e.g., Istanbul European Side'}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </SettingsFormRow>

          {/* Description field */}
          <SettingsFormRow
            label={oc?.storeSets?.dialog?.descriptionLabel || 'Description'}
            htmlFor="store-set-description"
          >
            <textarea
              id="store-set-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={oc?.storeSets?.dialog?.descriptionPlaceholder || 'Optional description for this store set'}
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none"
            />
          </SettingsFormRow>

          {/* Locations multi-select */}
          <div className="pt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {oc?.storeSets?.dialog?.locationsLabel || 'Select Locations'}
            </p>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
              {MOCK_LOCATIONS.map((loc) => (
                <label
                  key={loc.id}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedLocationIds.includes(loc.id)}
                    onChange={() => handleToggleLocation(loc.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {loc.name}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {(oc?.storeSets?.dialog?.selectedCount || '{{count}} locations selected').replace(
                '{{count}}',
                String(selectedLocationIds.length)
              )}
            </p>
          </div>
        </div>
      </MuiDialogContent>

      {/* Dialog Actions */}
      <MuiDialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #f3f4f6',
          gap: '8px',
        }}
      >
        <button
          onClick={() => !saving && onOpenChange(false)}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {oc?.storeSets?.dialog?.cancel || 'Cancel'}
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? '...' : oc?.storeSets?.dialog?.save || 'Save'}
        </button>
      </MuiDialogActions>
    </MuiDialog>
  );
}
