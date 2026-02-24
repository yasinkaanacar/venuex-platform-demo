export type NotificationCategory =
  | 'platform'
  | 'reviews'
  | 'locations'
  | 'catalog'
  | 'offline_conversions';

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

export type NotificationFrequency = 'instant' | 'daily' | 'weekly' | 'off';
export type NotificationSeverityFilter = 'all' | 'warnings_errors' | 'errors_only';

export interface CategoryPreferences {
  frequency: NotificationFrequency;
  severity: NotificationSeverityFilter;
  events: Record<string, boolean>;
}
