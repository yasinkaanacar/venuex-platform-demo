import { useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsFormRow from '@/components/settings/SettingsFormRow';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
import { mockCurrentUser } from '@/lib/mock-profile-data';
import { showToast } from '@/lib/toast';

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function ProfileInfoSection() {
  const { t } = useTranslation();
  const oc = (t as any).profile;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: mockCurrentUser.firstName,
    lastName: mockCurrentUser.lastName,
  });
  const [saved, setSaved] = useState({
    firstName: mockCurrentUser.firstName,
    lastName: mockCurrentUser.lastName,
  });

  const initials =
    (form.firstName[0] || '').toUpperCase() +
    (form.lastName[0] || '').toUpperCase();
  const avatarColor = getAvatarColor(mockCurrentUser.firstName);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setForm({ ...saved });
    setIsEditing(false);
  }

  function handleSave() {
    setSaved({ ...form });
    showToast({
      type: 'success',
      title: oc?.profileUpdated || 'Profile updated successfully',
    });
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
      onClick={handleEdit}
      className="px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
    >
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
        {/* Avatar row */}
        <div className="flex items-start gap-4 py-3">
          <div className="w-1/3 flex-shrink-0 pt-2">
            <span className="text-sm font-medium text-gray-700">
              {/* No label needed for avatar row */}
            </span>
          </div>
          <div className="flex-1 flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0 ${avatarColor}`}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-xs text-gray-500">{mockCurrentUser.email}</p>
            </div>
          </div>
        </div>

        {/* First Name */}
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
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <span className="text-sm text-gray-900">{form.firstName}</span>
          )}
        </SettingsFormRow>

        {/* Last Name */}
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
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <span className="text-sm text-gray-900">{form.lastName}</span>
          )}
        </SettingsFormRow>

        {/* Email — always read-only */}
        <SettingsFormRow
          label={oc?.email || 'Email'}
          hint={oc?.emailHint || 'Email cannot be changed'}
        >
          <span className="text-sm text-gray-500">{mockCurrentUser.email}</span>
        </SettingsFormRow>

        {/* Role — always read-only badge */}
        <SettingsFormRow label={oc?.role || 'Role'}>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {mockCurrentUser.roleLabel}
          </span>
        </SettingsFormRow>

        {/* Status — always read-only */}
        <SettingsFormRow label={oc?.status || 'Status'}>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {mockCurrentUser.statusLabel}
          </span>
        </SettingsFormRow>
      </SettingsFieldGroup>
    </SettingsSectionCard>
  );
}
