/**
 * Typed mutation payloads for API registry handlers.
 *
 * Each type corresponds to the `data` parameter of a mutation endpoint
 * in api-config.ts, replacing the previous `as any` casts.
 */

import type { EnrichmentSuggestion } from '@shared/schema';
import type { BusinessProfile, StoreSet } from './settings';
import type { ProfileUser } from './profile';
import type { LocationFormData } from './location-form';

// ── Enrichment Suggestions ─────────────────────────────────────────

/** PATCH /api/enrichment-suggestions/:id */
export type EnrichmentSuggestionUpdatePayload = Partial<EnrichmentSuggestion>;

// ── Settings: Business Profile ─────────────────────────────────────

/** PATCH /api/settings/profile */
export type BusinessProfileUpdatePayload = Partial<BusinessProfile>;

// ── Settings: Store Sets ───────────────────────────────────────────

/** POST /api/settings/store-sets */
export interface StoreSetCreatePayload {
  name: string;
  description: string;
  locationIds: string[];
}

/** PATCH /api/settings/store-sets/:id */
export type StoreSetUpdatePayload = Partial<StoreSet>;

// ── Profile ────────────────────────────────────────────────────────

/** PATCH /api/profile */
export type ProfileUpdatePayload = Partial<Pick<ProfileUser, 'firstName' | 'lastName'>>;

// ── Location Form ──────────────────────────────────────────────────

/** POST /api/location-form */
export type LocationCreatePayload = LocationFormData;

/** PATCH /api/location-form/:id */
export type LocationUpdatePayload = Partial<LocationFormData>;
