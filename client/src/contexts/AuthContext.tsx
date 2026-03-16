import { createContext, useContext, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor' | 'viewer';
  isSuperUser: boolean;
}

export interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isSuperUser: boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Mock values — in production these come from JWT / /auth/profile
// ---------------------------------------------------------------------------

const MOCK_USER: User = {
  id: 'user-001',
  email: 'kaan@venuex.co',
  displayName: 'Kaan Acar',
  role: 'admin',
  isSuperUser: false,
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const value: AuthContextType = {
    user: MOCK_USER,
    isAuthenticated: true,
    isSuperUser: MOCK_USER.isSuperUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
