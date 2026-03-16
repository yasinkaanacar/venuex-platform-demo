/**
 * Canonical auth & setup hooks
 *
 * Single source of truth for brand context, auth context, and platform setup
 * state. These hooks read from real React contexts (BrandContext, AuthContext)
 * backed by mock providers; in production the providers will use API data.
 *
 * All other files should import from this module — no inline re-definitions.
 */

import {
  useBrandContext as useBrandCtx,
  type BrandContextType,
} from '@/contexts/BrandContext';

import {
  useAuthContext as useAuthCtx,
  type AuthContextType,
} from '@/contexts/AuthContext';

// ---------------------------------------------------------------------------
// Brand context — scopes every API call to the active brand
// ---------------------------------------------------------------------------

export function useBrandContext(): BrandContextType {
  return useBrandCtx();
}

// ---------------------------------------------------------------------------
// Auth context — current user session info
// ---------------------------------------------------------------------------

export function useAuthContext(): AuthContextType {
  return useAuthCtx();
}

// ---------------------------------------------------------------------------
// Setup — which platform integrations are connected / enabled
// ---------------------------------------------------------------------------

export function useSetup() {
  return {
    isLoading: false,
    isGoogleAdsEnabled: true,
    isMetaConversionsConnected: true,
    isMetaAdAccountEnabled: true,
    isTiktokEventsConnected: true,
  } as const;
}
