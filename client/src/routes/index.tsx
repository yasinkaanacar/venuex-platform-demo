import type { ComponentType } from 'react';
import { PATHS } from './paths';
import {
  Overview,
  OfflineConversions,
  Locations,
  LocationAdd,
  LocationEdit,
  Reviews,
  LocationMatch,
  AIRecommendations,
  CreatePost,
  ManagePosts,
  Catalog,
  Segments,
  SegmentsFull,
  VenueXAI,
  Setup,
  OnboardingUnified,
  Signup,
  Welcome,
  Components,
  Settings,
  Profile,
  NotFound,
} from './elements';

// Re-export paths and helpers for convenience
export { PATHS, locationEditPath, createPostPath } from './paths';

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  title: string;
  breadcrumbs: Breadcrumb[];
}

/**
 * Standalone routes render without the sidebar/header shell.
 */
export const standaloneRoutes: RouteConfig[] = [
  {
    path: PATHS.ONBOARDING,
    component: OnboardingUnified,
    title: 'Onboarding',
    breadcrumbs: [{ label: 'Onboarding' }],
  },
  {
    path: PATHS.SIGNUP,
    component: Signup,
    title: 'Sign Up',
    breadcrumbs: [{ label: 'Sign Up' }],
  },
  {
    path: PATHS.WELCOME,
    component: Welcome,
    title: 'Welcome',
    breadcrumbs: [{ label: 'Welcome' }],
  },
];

/**
 * Main app routes render inside the sidebar + header shell.
 */
export const appRoutes: RouteConfig[] = [
  {
    path: PATHS.HOME,
    component: Overview,
    title: 'Overview',
    breadcrumbs: [{ label: 'VenueX', href: PATHS.HOME }],
  },
  {
    path: PATHS.OFFLINE_CONVERSIONS,
    component: OfflineConversions,
    title: 'Offline Conversions',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Offline Conversions', href: PATHS.OFFLINE_CONVERSIONS },
    ],
  },
  {
    path: PATHS.LOCATIONS,
    component: Locations,
    title: 'Locations',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Locations', href: PATHS.LOCATIONS },
    ],
  },
  {
    path: PATHS.LOCATIONS_POSTS,
    component: Locations,
    title: 'Locations',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Locations', href: PATHS.LOCATIONS },
    ],
  },
  {
    path: PATHS.LOCATIONS_ADD,
    component: LocationAdd,
    title: 'Add Location',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Locations', href: PATHS.LOCATIONS },
      { label: 'Add Location' },
    ],
  },
  {
    path: PATHS.LOCATIONS_EDIT,
    component: LocationEdit,
    title: 'Edit Location',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Locations', href: PATHS.LOCATIONS },
      { label: 'Edit Location' },
    ],
  },
  {
    path: PATHS.REVIEWS,
    component: Reviews,
    title: 'Reviews',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Reviews', href: PATHS.REVIEWS },
    ],
  },
  {
    path: PATHS.LOCATION_MATCH,
    component: LocationMatch,
    title: 'Location Match',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Locations', href: PATHS.LOCATIONS },
      { label: 'Match', href: PATHS.LOCATION_MATCH },
    ],
  },
  {
    path: PATHS.AI_RECOMMENDATIONS,
    component: AIRecommendations,
    title: 'AI Recommendations',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Recommendations', href: PATHS.AI_RECOMMENDATIONS },
    ],
  },
  {
    path: PATHS.CREATE_POST,
    component: CreatePost,
    title: 'Create Post',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Posts', href: PATHS.CREATE_POST },
    ],
  },
  {
    path: PATHS.MANAGE_POSTS,
    component: ManagePosts,
    title: 'Manage Posts',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Posts', href: PATHS.MANAGE_POSTS },
      { label: 'Manage', href: PATHS.MANAGE_POSTS },
    ],
  },
  {
    path: PATHS.CATALOG,
    component: Catalog,
    title: 'Local Inventory',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Local Inventory', href: PATHS.CATALOG },
    ],
  },
  {
    path: PATHS.SEGMENTS,
    component: Segments,
    title: 'Segments',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Segments', href: PATHS.SEGMENTS },
    ],
  },
  {
    path: PATHS.SEGMENTS_FULL,
    component: SegmentsFull,
    title: 'Segments (Full)',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Segments', href: PATHS.SEGMENTS },
      { label: 'Full View' },
    ],
  },
  {
    path: PATHS.VENUEX_AI,
    component: VenueXAI,
    title: 'VenueX AI',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'AI Assistant', href: PATHS.VENUEX_AI },
    ],
  },
  {
    path: PATHS.SETUP,
    component: Setup,
    title: 'Setup',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Setup', href: PATHS.SETUP },
    ],
  },
  {
    path: PATHS.COMPONENTS,
    component: Components,
    title: 'Components',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Dev', href: PATHS.COMPONENTS },
    ],
  },
  {
    path: PATHS.SETTINGS,
    component: Settings,
    title: 'Settings',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Settings', href: PATHS.SETTINGS },
    ],
  },
  {
    path: PATHS.PROFILE,
    component: Profile,
    title: 'Profile',
    breadcrumbs: [
      { label: 'VenueX', href: PATHS.HOME },
      { label: 'Profile', href: PATHS.PROFILE },
    ],
  },
];

/**
 * Get route config for a given path (used by Header for breadcrumbs).
 * Handles exact matches and dynamic routes.
 */
export function getRouteConfig(path: string): { title: string; breadcrumbs: Breadcrumb[] } {
  // Check standalone routes
  const standalone = standaloneRoutes.find((r) => r.path === path);
  if (standalone) return { title: standalone.title, breadcrumbs: standalone.breadcrumbs };

  // Check app routes (exact match)
  const app = appRoutes.find((r) => r.path === path);
  if (app) return { title: app.title, breadcrumbs: app.breadcrumbs };

  // Dynamic route: /locations/:id/edit
  if (path.startsWith('/locations/') && path.endsWith('/edit')) {
    return {
      title: 'Edit Location',
      breadcrumbs: [
        { label: 'VenueX', href: PATHS.HOME },
        { label: 'Locations', href: PATHS.LOCATIONS },
        { label: 'Edit Location' },
      ],
    };
  }

  // Default fallback
  return {
    title: 'VenueX',
    breadcrumbs: [{ label: 'VenueX', href: PATHS.HOME }],
  };
}

/**
 * The NotFound component for the catch-all route.
 */
export { NotFound };
