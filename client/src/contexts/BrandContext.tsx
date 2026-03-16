import { createContext, useContext, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface BrandContextType {
  brandId: string;
  brandName: string;
  brand: Brand;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const BrandContext = createContext<BrandContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Mock values — in production these come from an API call after login
// ---------------------------------------------------------------------------

const MOCK_BRAND: Brand = {
  id: 'demo-brand-123',
  name: 'Demo Brand',
  slug: 'demo-brand',
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface BrandProviderProps {
  children: ReactNode;
}

export function BrandProvider({ children }: BrandProviderProps) {
  const value: BrandContextType = {
    brandId: MOCK_BRAND.id,
    brandName: MOCK_BRAND.name,
    brand: MOCK_BRAND,
  };

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useBrandContext(): BrandContextType {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error('useBrandContext must be used within a BrandProvider');
  }
  return ctx;
}
