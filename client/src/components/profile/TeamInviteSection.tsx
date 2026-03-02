import { useState } from 'react';
import { Plus, Send, X } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
import { showToast } from '@/lib/toast';
import type { InviteRow } from '@/lib/types/profile';

export default function TeamInviteSection() {
  const { t } = useTranslation();
  const oc = (t as any).profile;

  const [rows, setRows] = useState<InviteRow[]>([
    { id: crypto.randomUUID(), firstName: '', lastName: '', email: '', role: '' },
  ]);

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), firstName: '', lastName: '', email: '', role: '' },
    ]);

  const removeRow = (id: string) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));

  const updateRow = (id: string, field: keyof InviteRow, value: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const handleSendInvite = () => {
    const hasEmail = rows.some((r) => r.email.trim().length > 0);
    if (!hasEmail) return;

    showToast({ type: 'success', title: oc?.invitesSent || 'Invitations sent successfully' });
    setRows([{ id: crypto.randomUUID(), firstName: '', lastName: '', email: '', role: '' }]);
  };

  return (
    <SettingsSectionCard
      title={oc?.teamInviteTitle || 'Invite Team Members'}
      description={oc?.teamInviteDesc}
      tooltip={oc?.teamInviteTooltip}
    >
      <SettingsFieldGroup>
        {/* Invite rows */}
        <div className="divide-y divide-gray-100">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              {/* First Name */}
              <input
                type="text"
                value={row.firstName}
                onChange={(e) => updateRow(row.id, 'firstName', e.target.value)}
                placeholder={oc?.firstName || 'First Name'}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* Last Name */}
              <input
                type="text"
                value={row.lastName}
                onChange={(e) => updateRow(row.id, 'lastName', e.target.value)}
                placeholder={oc?.lastName || 'Last Name'}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* Email */}
              <input
                type="email"
                value={row.email}
                onChange={(e) => updateRow(row.id, 'email', e.target.value)}
                placeholder={oc?.email || 'Email'}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* Role */}
              <select
                value={row.role}
                onChange={(e) => updateRow(row.id, 'role', e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{oc?.rolePlaceholder || 'Select role'}</option>
                <option value="admin">{oc?.roleAdmin || 'Yonetici'}</option>
                <option value="brand_owner">{oc?.roleBrandOwner || 'Marka Sahibi'}</option>
              </select>
              {/* Remove row */}
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove row"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            {oc?.addRow || 'Add User'}
          </button>
          <button
            type="button"
            onClick={handleSendInvite}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Send className="w-4 h-4" />
            {oc?.sendInvite || 'Send Invite'}
          </button>
        </div>
      </SettingsFieldGroup>
    </SettingsSectionCard>
  );
}
