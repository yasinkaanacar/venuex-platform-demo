import type { ProfileUser, TeamMember, TeamInvite, InviteRow } from '../types/profile';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const mockCurrentUser: ProfileUser = {
  id: 'user-001',
  firstName: 'Yasar Engin',
  lastName: 'Ayan',
  email: 'yayan@kigili.com.tr',
  role: 'brand_owner',
  roleLabel: 'Marka Sahibi',
  status: 'active',
  statusLabel: 'Aktif',
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-001',
    firstName: 'Yasar Engin',
    lastName: 'Ayan',
    email: 'yayan@kigili.com.tr',
    role: 'brand_owner',
    roleLabel: 'Marka Sahibi',
    isActive: true,
  },
  {
    id: 'user-002',
    firstName: 'Furkan',
    lastName: 'Dal',
    email: 'furkan@venuex.io',
    role: 'venuex_admin',
    roleLabel: 'VenueX Yetkilisi',
    isActive: true,
  },
  {
    id: 'user-003',
    firstName: 'Hulusi',
    lastName: 'Kurt',
    email: 'hulusi@kigili.com.tr',
    role: 'admin',
    roleLabel: 'Yönetici',
    isActive: false,
  },
];

export const mockPendingInvites: TeamInvite[] = [];

// ---------------------------------------------------------------------------
// Internal mutable state (simulates server-side mutations)
// ---------------------------------------------------------------------------

let _currentUser: ProfileUser = { ...mockCurrentUser };
let _teamMembers: TeamMember[] = mockTeamMembers.map((m) => ({ ...m }));
let _pendingInvites: TeamInvite[] = [...mockPendingInvites];

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// profileDataService
// ---------------------------------------------------------------------------

export const profileDataService = {
  async getCurrentUser(): Promise<ProfileUser> {
    await delay();
    return { ..._currentUser };
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    await delay();
    return _teamMembers.map((m) => ({ ...m }));
  },

  async getPendingInvites(): Promise<TeamInvite[]> {
    await delay();
    return [..._pendingInvites];
  },

  async updateProfile(data: Partial<Pick<ProfileUser, 'firstName' | 'lastName'>>): Promise<ProfileUser> {
    await delay();
    _currentUser = { ..._currentUser, ...data };
    // Keep the matching team member in sync too
    const idx = _teamMembers.findIndex((m) => m.id === _currentUser.id);
    if (idx !== -1) {
      _teamMembers[idx] = {
        ..._teamMembers[idx],
        firstName: _currentUser.firstName,
        lastName: _currentUser.lastName,
      };
    }
    return { ..._currentUser };
  },

  async toggleMemberStatus(id: string): Promise<TeamMember> {
    await delay();
    const idx = _teamMembers.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Team member ${id} not found`);
    _teamMembers[idx] = { ..._teamMembers[idx], isActive: !_teamMembers[idx].isActive };
    return { ..._teamMembers[idx] };
  },

  async deleteMember(id: string): Promise<{ success: boolean }> {
    await delay();
    _teamMembers = _teamMembers.filter((m) => m.id !== id);
    return { success: true };
  },

  async sendInvites(rows: InviteRow[]): Promise<{ success: boolean; count: number }> {
    await delay();
    const newInvites: TeamInvite[] = rows.map((r) => ({
      id: `invite-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email: r.email,
      role: (r.role as TeamInvite['role']) || 'admin',
      invitedAt: new Date().toISOString(),
      status: 'pending',
    }));
    _pendingInvites = [..._pendingInvites, ...newInvites];
    return { success: true, count: newInvites.length };
  },
};
