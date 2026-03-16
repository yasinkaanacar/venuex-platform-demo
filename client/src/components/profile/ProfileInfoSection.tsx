import { useState } from 'react';
import { Pencil, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
import SettingsFormRow from '@/components/settings/SettingsFormRow';
import { mockCurrentUser } from '@/lib/mock/profile';
import { showToast } from '@/lib/toast';

const INPUT_CLS =
  'w-full h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getRoleBadge(role: string): { bg: string; text: string } {
  switch (role) {
    case 'brand_owner':
      return { bg: 'bg-purple-100', text: 'text-purple-700' };
    case 'venuex_admin':
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700' };
  }
}

export default function ProfileInfoSection() {
  const { t } = useTranslation();
  const oc = (t as any).profile;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: mockCurrentUser.firstName,
    lastName: mockCurrentUser.lastName,
  });
  const [saved, setSaved] = useState({ ...form });

  // Password fields (stub — not wired to backend)
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initials =
    (form.firstName[0] || '').toUpperCase() +
    (form.lastName[0] || '').toUpperCase();
  const avatarColor = getAvatarColor(mockCurrentUser.firstName);
  const roleBadge = getRoleBadge(mockCurrentUser.role);

  function handleSave() {
    setSaved({ ...form });
    showToast({
      type: 'success',
      title: oc?.profileUpdated || 'Profile updated successfully',
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setForm({ ...saved });
    setIsEditing(false);
  }

  const headerRight = isEditing ? (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCancel}
        className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
      >
        {oc?.cancelEdit || 'Cancel'}
      </button>
      <button
        onClick={handleSave}
        className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
      >
        {oc?.saveProfile || 'Save'}
      </button>
    </div>
  ) : (
    <button
      onClick={() => setIsEditing(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
    >
      <Pencil className="w-3.5 h-3.5" />
      {oc?.editProfile || 'Edit'}
    </button>
  );

  return (
    <SettingsSectionCard
      title={oc?.infoTitle || 'Personal Information'}
      description={oc?.infoDesc || 'Manage your personal details and account settings'}
      tooltip={oc?.infoTooltip || 'Your profile information is visible to team members'}
      headerRight={headerRight}
    >
      <SettingsFieldGroup>
        {/* ── Avatar + identity header ─────────────────────── */}
        <div className="flex items-center gap-4 pb-4 mb-1">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0 ${avatarColor}`}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900">
              {form.firstName} {form.lastName}
            </p>
            <p className="text-sm text-gray-500">{mockCurrentUser.email}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}
            >
              {mockCurrentUser.roleLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {mockCurrentUser.statusLabel}
            </span>
          </div>
        </div>

        {/* ── Editable fields ──────────────────────────────── */}
        <div className="divide-y divide-gray-100 border-t border-gray-100">
          <SettingsFormRow
            label={oc?.firstName || 'First Name'}
            htmlFor="profile-first-name"
            required
          >
            {isEditing ? (
              <input
                id="profile-first-name"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className={INPUT_CLS}
              />
            ) : (
              <span className="text-sm text-gray-900 pt-2 inline-block">{form.firstName}</span>
            )}
          </SettingsFormRow>

          <SettingsFormRow
            label={oc?.lastName || 'Last Name'}
            htmlFor="profile-last-name"
            required
          >
            {isEditing ? (
              <input
                id="profile-last-name"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className={INPUT_CLS}
              />
            ) : (
              <span className="text-sm text-gray-900 pt-2 inline-block">{form.lastName}</span>
            )}
          </SettingsFormRow>

          <SettingsFormRow
            label={oc?.email || 'Email'}
            hint={oc?.emailHint || 'Email cannot be changed'}
          >
            <span className="text-sm text-gray-500 pt-2 inline-block">
              {mockCurrentUser.email}
            </span>
          </SettingsFormRow>

          {/* ── Password (inline) ───────────────────────────── */}
          <SettingsFormRow
            label={oc?.passwordTitle || 'Password'}
            hint={!showPasswordFields ? (oc?.passwordHint || 'Last changed: never') : undefined}
          >
            {showPasswordFields ? (
              <div className="space-y-2.5 pt-1">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={oc?.currentPassword || 'Current password'}
                    className={INPUT_CLS}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <input
                  type="password"
                  placeholder={oc?.newPassword || 'New password'}
                  className={INPUT_CLS}
                />
                <input
                  type="password"
                  placeholder={oc?.confirmPassword || 'Confirm new password'}
                  className={INPUT_CLS}
                />
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      showToast({
                        type: 'info',
                        title: oc?.passwordNotAvailable || 'Password change is not yet available.',
                      });
                      setShowPasswordFields(false);
                    }}
                    className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {oc?.updatePassword || 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordFields(false)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {oc?.cancelEdit || 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-1.5">
                <span className="text-sm text-gray-400 tracking-widest">••••••••</span>
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  {oc?.changePassword || 'Change'}
                </button>
              </div>
            )}
          </SettingsFormRow>
        </div>
      </SettingsFieldGroup>
    </SettingsSectionCard>
  );
}
