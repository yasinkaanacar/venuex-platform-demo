import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Pencil,
  Plus,
  Send,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
import { showToast } from '@/lib/toast';
import { mockTeamMembers, mockPendingInvites } from '@/lib/mock/profile';
import { cn } from '@/lib/utils';
import type { TeamMember, InviteRow } from '@/lib/types/profile';

// ─── Constants ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-teal-500',
];

const INPUT_CLS =
  'w-full h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getRoleBadge(role: TeamMember['role']): string {
  switch (role) {
    case 'brand_owner':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'venuex_admin':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

// ─── Inline Invite Form ─────────────────────────────────────────────────────────

function InviteForm({ oc, onDone }: { oc: any; onDone: () => void }) {
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

  const handleSend = () => {
    const valid = rows.some((r) => r.email.trim().length > 0);
    if (!valid) return;
    showToast({ type: 'success', title: oc?.invitesSent || 'Invitations sent successfully' });
    onDone();
  };

  return (
    <div className="border border-blue-100 bg-blue-50/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-800">
          {oc?.teamInviteTitle || 'Invite Team Members'}
        </p>
        <button
          type="button"
          onClick={onDone}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <input
            type="text"
            value={row.firstName}
            onChange={(e) => updateRow(row.id, 'firstName', e.target.value)}
            placeholder={oc?.firstName || 'First Name'}
            className={cn(INPUT_CLS, 'flex-1 bg-white')}
          />
          <input
            type="text"
            value={row.lastName}
            onChange={(e) => updateRow(row.id, 'lastName', e.target.value)}
            placeholder={oc?.lastName || 'Last Name'}
            className={cn(INPUT_CLS, 'flex-1 bg-white')}
          />
          <input
            type="email"
            value={row.email}
            onChange={(e) => updateRow(row.id, 'email', e.target.value)}
            placeholder={oc?.email || 'Email'}
            className={cn(INPUT_CLS, 'flex-[1.5] bg-white')}
          />
          <select
            value={row.role}
            onChange={(e) => updateRow(row.id, 'role', e.target.value)}
            className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
          >
            <option value="">{oc?.rolePlaceholder || 'Role'}</option>
            <option value="admin">{oc?.roleAdmin || 'Admin'}</option>
            <option value="brand_owner">{oc?.roleBrandOwner || 'Brand Owner'}</option>
          </select>
          {rows.length > 1 && (
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {oc?.addRow || 'Add another'}
        </button>
        <button
          type="button"
          onClick={handleSend}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          {oc?.sendInvite || 'Send Invite'}
        </button>
      </div>
    </div>
  );
}

// ─── TeamTableSection (unified: invite + table) ─────────────────────────────────

export default function TeamTableSection() {
  const { t } = useTranslation();
  const oc = (t as any).profile;

  const [activeTab, setActiveTab] = useState<'team' | 'pending'>('team');
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers.map((m) => ({ ...m })));
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const pendingInvites = mockPendingInvites;

  const handleToggle = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)),
    );
    showToast({ type: 'success', title: oc?.memberStatusChanged || 'Member status updated' });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    showToast({ type: 'success', title: oc?.memberRemoved || 'Team member removed' });
    setDeleteTarget(null);
  };

  const deleteConfirmDesc = (
    oc?.deleteConfirmDesc ||
    'Are you sure you want to remove {{name}} from the team? This action cannot be undone.'
  ).replace('{{name}}', deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName}` : '');

  const headerRight = (
    <button
      type="button"
      onClick={() => setShowInvite(!showInvite)}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
        showInvite
          ? 'text-gray-600 border border-gray-200 hover:bg-gray-50'
          : 'text-white bg-blue-600 hover:bg-blue-700',
      )}
    >
      {showInvite ? (
        <>
          <ChevronUp className="w-3.5 h-3.5" />
          {oc?.hideInvite || 'Close'}
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          {oc?.inviteButton || 'Invite'}
        </>
      )}
    </button>
  );

  return (
    <SettingsSectionCard
      title={oc?.teamTableTitle || 'Team'}
      description={oc?.teamTableDesc || 'Manage team members and invitations'}
      tooltip={oc?.teamTableTooltip}
      headerRight={headerRight}
    >
      <SettingsFieldGroup>
        {/* Inline invite form */}
        {showInvite && (
          <div className="mb-4">
            <InviteForm oc={oc} onDone={() => setShowInvite(false)} />
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-1 border-b border-gray-100 mb-4 -mx-5 px-5">
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'team'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            {oc?.teamTab || 'Team'}
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                activeTab === 'team' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500',
              )}
            >
              {members.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            {oc?.pendingTab || 'Pending Invites'}
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                activeTab === 'pending'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-500',
              )}
            >
              {pendingInvites.length}
            </span>
          </button>
        </div>

        {/* ── Team tab ──────────────────────────────────────── */}
        {activeTab === 'team' && (
          <div className="space-y-0.5">
            {members.map((member) => {
              const initials =
                `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
              const avatarColor = getAvatarColor(
                `${member.firstName} ${member.lastName}`,
              );
              const roleCls = getRoleBadge(member.role);

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0',
                      avatarColor,
                    )}
                  >
                    {initials}
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>

                  {/* Role badge */}
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border flex-shrink-0',
                      roleCls,
                    )}
                  >
                    {member.roleLabel}
                  </span>

                  {/* Status toggle + label */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 w-24">
                    <Switch
                      size="small"
                      checked={member.isActive}
                      onChange={() => handleToggle(member.id)}
                    />
                    <span
                      className={cn(
                        'text-[11px] font-medium',
                        member.isActive ? 'text-green-600' : 'text-gray-400',
                      )}
                    >
                      {member.isActive
                        ? (oc?.statusActive || 'Active')
                        : (oc?.statusInactive || 'Inactive')}
                    </span>
                  </div>

                  {/* Actions — visible on hover */}
                  <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                      title={oc?.edit || 'Edit'}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(member)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                      title={oc?.delete || 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pending Invites tab ───────────────────────────── */}
        {activeTab === 'pending' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {oc?.emptyPending || 'No pending invitations'}
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              {oc?.emptyPendingDesc || 'Use the Invite button above to add new team members'}
            </p>
          </div>
        )}
      </SettingsFieldGroup>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 600 }}>
          {oc?.deleteConfirmTitle || 'Remove Team Member'}
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600">{deleteConfirmDesc}</p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            {oc?.deleteCancel || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            {oc?.deleteConfirm || 'Remove'}
          </button>
        </DialogActions>
      </Dialog>
    </SettingsSectionCard>
  );
}
