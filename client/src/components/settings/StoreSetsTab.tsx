import { useState } from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
} from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/contexts/LanguageContext';
import { showToast } from '@/lib/toast';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
import StoreSetDialog from '@/components/settings/StoreSetDialog';
import { settingsDataService } from '@/lib/mock-settings-data';
import type { StoreSet } from '@/lib/types/settings';

export default function StoreSetsTab() {
  const { t } = useTranslation();
  const oc = t.settings as any;
  const queryClient = useQueryClient();

  // Fetch store sets
  const { data: storeSets = [], isLoading } = useQuery<StoreSet[]>({
    queryKey: ['/api/settings/store-sets'],
    queryFn: () => settingsDataService.getStoreSets(),
  });

  // Dialog state — null editing = create mode
  const [dialogState, setDialogState] = useState<{ open: boolean; editing: StoreSet | null }>({
    open: false,
    editing: null,
  });

  // Delete confirm state
  const [deleteState, setDeleteState] = useState<{ open: boolean; set: StoreSet | null }>({
    open: false,
    set: null,
  });
  const [deleting, setDeleting] = useState(false);

  // ── CRUD handlers ─────────────────────────────────────────────────

  function handleOpenCreate() {
    setDialogState({ open: true, editing: null });
  }

  function handleOpenEdit(set: StoreSet) {
    setDialogState({ open: true, editing: set });
  }

  function handleOpenDelete(set: StoreSet) {
    setDeleteState({ open: true, set });
  }

  async function handleSave(data: { name: string; description: string; locationIds: string[] }) {
    if (dialogState.editing) {
      // Edit mode
      await settingsDataService.updateStoreSet(dialogState.editing.id, {
        name: data.name,
        description: data.description,
        locationIds: data.locationIds,
        locationCount: data.locationIds.length,
      });
      await queryClient.invalidateQueries({ queryKey: ['/api/settings/store-sets'] });
      showToast({
        type: 'success',
        title: oc?.storeSets?.updateSuccess || 'Store set updated successfully',
      });
    } else {
      // Create mode
      await settingsDataService.createStoreSet(data);
      await queryClient.invalidateQueries({ queryKey: ['/api/settings/store-sets'] });
      showToast({
        type: 'success',
        title: oc?.storeSets?.createSuccess || 'Store set created successfully',
      });
    }
  }

  async function handleConfirmDelete() {
    if (!deleteState.set) return;
    setDeleting(true);
    try {
      await settingsDataService.deleteStoreSet(deleteState.set.id);
      await queryClient.invalidateQueries({ queryKey: ['/api/settings/store-sets'] });
      showToast({
        type: 'success',
        title: oc?.storeSets?.deleteSuccess || 'Store set deleted successfully',
      });
      setDeleteState({ open: false, set: null });
    } finally {
      setDeleting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <>
      <SettingsSectionCard
        title={oc?.storeSets?.title || 'Store Sets'}
        description={oc?.storeSets?.desc || 'Group your locations into sets for bulk operations and targeted campaigns'}
        tooltip={oc?.storeSets?.tooltip || 'Store sets let you organize locations by region, type, or any custom grouping for easier management'}
        headerRight={
          <button
            onClick={handleOpenCreate}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
          >
            {oc?.storeSets?.createNew || '+ Create Store Set'}
          </button>
        }
      >
        <SettingsFieldGroup>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-400">Loading...</div>
          ) : storeSets.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {oc?.storeSets?.noSets || 'No store sets created yet'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {storeSets.map((set) => (
                <div key={set.id} className="flex items-start justify-between py-3 px-1">
                  {/* Left: name, description, location count */}
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-gray-900">{set.name}</p>
                    {set.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{set.description}</p>
                    )}
                    <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full mt-1">
                      {(oc?.storeSets?.locationCount || '{{count}} locations').replace(
                        '{{count}}',
                        String(set.locationCount)
                      )}
                    </span>
                  </div>

                  {/* Right: edit + delete buttons */}
                  <div className="flex items-center gap-3 flex-shrink-0 pt-0.5">
                    <button
                      onClick={() => handleOpenEdit(set)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <Pencil size={12} />
                      {oc?.storeSets?.editAction || 'Edit'}
                    </button>
                    <button
                      onClick={() => handleOpenDelete(set)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                    >
                      <Trash2 size={12} />
                      {oc?.storeSets?.deleteAction || 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SettingsFieldGroup>
      </SettingsSectionCard>

      {/* Create / Edit Dialog */}
      <StoreSetDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((s) => ({ ...s, open }))}
        editingSet={dialogState.editing}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <MuiDialog
        open={deleteState.open}
        onClose={() => !deleting && setDeleteState({ open: false, set: null })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <MuiDialogTitle
          sx={{
            px: 3,
            py: 2,
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: '#111827',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          {oc?.storeSets?.deleteConfirm?.title || 'Delete Store Set'}
        </MuiDialogTitle>
        <MuiDialogContent sx={{ px: 3, py: 2.5 }}>
          <p className="text-sm text-gray-600">
            {(oc?.storeSets?.deleteConfirm?.message || 'Are you sure you want to delete "{{name}}"? This action cannot be undone.').replace(
              '{{name}}',
              deleteState.set?.name ?? ''
            )}
          </p>
        </MuiDialogContent>
        <MuiDialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f3f4f6', gap: '8px' }}>
          <button
            onClick={() => !deleting && setDeleteState({ open: false, set: null })}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {oc?.storeSets?.deleteConfirm?.cancel || 'Cancel'}
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting ? '...' : oc?.storeSets?.deleteConfirm?.confirm || 'Delete'}
          </button>
        </MuiDialogActions>
      </MuiDialog>
    </>
  );
}
