import { useState } from 'react';
import { Mail, Pencil, Trash2 } from 'lucide-react';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
import { showToast } from '@/lib/toast';
import { mockTeamMembers, mockPendingInvites } from '@/lib/mock-profile-data';
import type { TeamMember } from '@/lib/types/profile';

// Deterministic avatar color palette
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

function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getRoleBadgeClasses(role: TeamMember['role']): string {
  switch (role) {
    case 'brand_owner':
      return 'bg-purple-100 text-purple-700';
    case 'venuex_admin':
      return 'bg-blue-100 text-blue-700';
    case 'admin':
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function TeamTableSection() {
  const { t } = useTranslation();
  const oc = (t as any).profile;

  const [activeTab, setActiveTab] = useState<'team' | 'pending'>('team');
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers.map((m) => ({ ...m })));
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);

  // Pending invites from mock data (empty array)
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

  const deleteConfirmDesc = (oc?.deleteConfirmDesc || 'Are you sure you want to remove {{name}} from the team? This action cannot be undone.').replace(
    '{{name}}',
    deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName}` : '',
  );

  return (
    <SettingsSectionCard
      title={oc?.teamTableTitle || 'Team Management'}
      description={oc?.teamTableDesc}
      tooltip={oc?.teamTableTooltip}
    >
      <SettingsFieldGroup>
        {/* Tab switcher */}
        <div className="flex gap-1 border-b border-gray-100 mb-4 -mx-5 px-5">
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'team'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {oc?.teamTab || 'Team'} ({members.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {oc?.pendingTab || 'Pending Invites'} ({pendingInvites.length})
          </button>
        </div>

        {/* Team tab */}
        {activeTab === 'team' && (
          <div>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_200px_120px_100px_80px] gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>{oc?.name || 'Name'}</span>
              <span>{oc?.email || 'Email'}</span>
              <span>{oc?.role || 'Role'}</span>
              <span>{oc?.status || 'Status'}</span>
              <span>{oc?.actions || 'Actions'}</span>
            </div>

            {/* Member rows */}
            {members.map((member) => {
              const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
              const avatarColor = getAvatarColor(`${member.firstName} ${member.lastName}`);
              const roleBadge = getRoleBadgeClasses(member.role);

              return (
                <div
                  key={member.id}
                  className="grid grid-cols-[1fr_200px_120px_100px_80px] gap-4 px-4 py-3 items-center border-t border-gray-50"
                >
                  {/* Name cell */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${avatarColor}`}
                    >
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {member.firstName} {member.lastName}
                    </span>
                  </div>

                  {/* Email cell */}
                  <span className="text-sm text-gray-500 truncate">{member.email}</span>

                  {/* Role badge */}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge}`}
                  >
                    {member.roleLabel}
                  </span>

                  {/* Status toggle */}
                  <Switch
                    size="small"
                    checked={member.isActive}
                    onChange={() => handleToggle(member.id)}
                  />

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      title={oc?.edit || 'Edit'}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(member)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title={oc?.delete || 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pending Invites tab — empty state */}
        {activeTab === 'pending' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">
              {oc?.emptyPending || 'No pending invitations'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {oc?.emptyPendingDesc || 'Invite new team members using the form above'}
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
