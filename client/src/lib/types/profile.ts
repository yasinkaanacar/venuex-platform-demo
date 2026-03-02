export interface ProfileUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;           // read-only in UI
  role: 'admin' | 'brand_owner' | 'venuex_admin';
  roleLabel: string;       // "Yönetici" | "Marka Sahibi" | "VenueX Yetkilisi"
  status: 'active' | 'inactive';
  statusLabel: string;     // "Aktif"
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'brand_owner' | 'venuex_admin';
  roleLabel: string;
  isActive: boolean;
}

export interface TeamInvite {
  id: string;
  email: string;
  role: 'admin' | 'brand_owner';
  invitedAt: string;       // ISO date string
  status: 'pending';
}

export interface InviteRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
