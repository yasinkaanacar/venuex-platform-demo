/**
 * Centralized PostHog analytics helper for VenueX platform.
 *
 * This is the single source of truth for all PostHog event tracking.
 * Every phase (2-4) imports from here — no direct posthog.capture calls
 * outside of DemoGate.tsx (which owns identify + gate submission).
 *
 * All capture wrappers are wrapped in try/catch so tracking failures
 * never propagate to the app (silent failure principle).
 */

import posthog from 'posthog-js';

// ── Event Name Constants ───────────────────────────────────────────────────

export const ANALYTICS_EVENTS = {
  // Phase 2: Navigation
  SIDEBAR_NAV_CLICKED: 'demo_sidebar_nav_clicked',
  TAB_SWITCHED: 'demo_tab_switched',

  // Phase 3: Feature Depth
  LOCATION_VIEWED: 'demo_location_viewed',
  LOCATION_ACTION: 'demo_location_action',

  // Phase 4: Global & AI
  FILTER_CHANGED: 'demo_filter_changed',
  AI_CHAT_MESSAGE_SENT: 'demo_ai_chat_message_sent',
  AI_EXAMPLE_QUESTION_CLICKED: 'demo_ai_example_question_clicked',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// ── Per-Event Property Interfaces ─────────────────────────────────────────

export interface SidebarNavClickedProps {
  to: string;
  from: string;
  module: string;
}

export interface TabSwitchedProps {
  module: string;
  tab_name: string;
}

export interface LocationViewedProps {
  location_id: string;
}

export interface LocationActionProps {
  action_type: 'add' | 'edit' | 'import';
}

export interface FilterChangedProps {
  filter_type: 'date_range' | 'platform' | 'location';
  value: string;
}

export interface AiChatMessageSentProps {
  message_length: number;
}

// ── Typed Capture Wrappers ─────────────────────────────────────────────────

export const trackSidebarNav = (props: SidebarNavClickedProps) => {
  try {
    posthog.capture(ANALYTICS_EVENTS.SIDEBAR_NAV_CLICKED, { ...props, source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};

export const trackTabSwitch = (props: TabSwitchedProps) => {
  try {
    posthog.capture(ANALYTICS_EVENTS.TAB_SWITCHED, { ...props, source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};

export const trackLocationViewed = (props: LocationViewedProps) => {
  try {
    posthog.capture(ANALYTICS_EVENTS.LOCATION_VIEWED, { ...props, source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};

export const trackLocationAction = (props: LocationActionProps) => {
  try {
    posthog.capture(ANALYTICS_EVENTS.LOCATION_ACTION, { ...props, source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};

export const trackFilterChanged = (props: FilterChangedProps) => {
  try {
    posthog.capture(ANALYTICS_EVENTS.FILTER_CHANGED, { ...props, source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};

export const trackAiChatMessageSent = (props: AiChatMessageSentProps) => {
  try {
    posthog.capture(ANALYTICS_EVENTS.AI_CHAT_MESSAGE_SENT, { ...props, source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};

export const trackAiExampleQuestionClicked = () => {
  try {
    posthog.capture(ANALYTICS_EVENTS.AI_EXAMPLE_QUESTION_CLICKED, { source: 'demo' });
  } catch (e) {
    console.warn('[analytics]', e);
  }
};
