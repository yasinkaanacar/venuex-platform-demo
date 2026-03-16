/**
 * Centralized route paths for the entire application.
 * Import PATHS instead of using hardcoded strings.
 */
export const PATHS = {
  // Core
  HOME: '/',
  NOT_FOUND: '/404',

  // Location Management
  LOCATIONS: '/locations',
  LOCATIONS_POSTS: '/locations/posts',
  LOCATIONS_ADD: '/locations/add',
  LOCATIONS_EDIT: '/locations/:id/edit',
  LOCATION_MATCH: '/location-match',

  // Reviews
  REVIEWS: '/reviews',

  // Sales & Conversions
  CATALOG: '/catalog',
  OFFLINE_CONVERSIONS: '/offline-conversions',
  SEGMENTS: '/segments',
  SEGMENTS_FULL: '/segments-full',

  // AI
  VENUEX_AI: '/venuex-ai',
  AI_RECOMMENDATIONS: '/ai-recommendations',

  // Content
  CREATE_POST: '/create-post',
  MANAGE_POSTS: '/manage-posts',

  // Management
  SETTINGS: '/settings',
  PROFILE: '/profile',
  SETUP: '/setup',

  // Dev
  COMPONENTS: '/components',

  // Standalone (no sidebar)
  ONBOARDING: '/onboarding',
  SIGNUP: '/signup',
  WELCOME: '/welcome',
} as const;

export type RoutePath = (typeof PATHS)[keyof typeof PATHS];

/**
 * Build a dynamic location edit path.
 */
export function locationEditPath(id: string | number): string {
  return `/locations/${id}/edit`;
}

/**
 * Build a create-post path with optional query params.
 */
export function createPostPath(scope?: string, date?: string): string {
  const params = new URLSearchParams();
  if (scope) params.set('scope', scope);
  if (date) params.set('date', date);
  const qs = params.toString();
  return qs ? `${PATHS.CREATE_POST}?${qs}` : PATHS.CREATE_POST;
}
