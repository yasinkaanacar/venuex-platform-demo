import { useState } from 'react';
import {
  Plug,
  Star,
  MapPin,
  Package,
  BarChart2,
  Bell,
  User,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { showToast } from '@/lib/toast';
import { useLocales } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type {
  NotificationCategory,
  NotificationFrequency,
  NotificationSeverityFilter,
  CategoryPreferences,
} from '@/lib/types/notifications';

type NotificationPrefs = Record<NotificationCategory, CategoryPreferences>;

// --- Category display config (mirrors NotificationCenter) ---
const CATEGORY_CONFIG: Record<
  NotificationCategory,
  { icon: React.ElementType; color: string; bg: string }
> = {
  platform: { icon: Plug, color: 'text-blue-600', bg: 'bg-blue-100' },
  reviews: { icon: Star, color: 'text-orange-600', bg: 'bg-orange-100' },
  locations: { icon: MapPin, color: 'text-red-600', bg: 'bg-red-100' },
  catalog: { icon: Package, color: 'text-teal-600', bg: 'bg-teal-100' },
  offline_conversions: { icon: BarChart2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
};

// --- Event keys per category ---
const CATEGORY_EVENTS: Record<NotificationCategory, string[]> = {
  platform: ['connectionLost', 'syncFailed', 'tokenExpiring'],
  reviews: ['negativeReview', 'slaBreached', 'ratingDrop', 'dailySummary', 'policyViolation'],
  locations: ['suspended', 'duplicate', 'verificationNeeded', 'dataMismatch'],
  catalog: ['disapproval', 'feedError', 'lowApprovalRate'],
  offline_conversions: ['uploadFailed', 'dataGap', 'lowMatchRate', 'anomaly'],
};

const CATEGORY_ORDER: NotificationCategory[] = [
  'platform', 'reviews', 'locations', 'catalog', 'offline_conversions',
];

function buildDefaultPrefs(): NotificationPrefs {
  return Object.fromEntries(
    (Object.entries(CATEGORY_EVENTS) as [NotificationCategory, string[]][]).map(([cat, events]) => [
      cat,
      {
        frequency: 'instant' as NotificationFrequency,
        severity: 'all' as NotificationSeverityFilter,
        events: Object.fromEntries(events.map((e) => [e, true])),
      },
    ])
  ) as NotificationPrefs;
}

// --- FrequencySelector ---
function FrequencySelector({
  value,
  onChange,
}: {
  value: NotificationFrequency;
  onChange: (v: NotificationFrequency) => void;
}) {
  const { t } = useLocales();
  const options: NotificationFrequency[] = ['instant', 'daily', 'weekly', 'off'];
  return (
    <div className="flex border border-gray-200 rounded-lg overflow-hidden divide-x divide-gray-200 text-xs flex-shrink-0">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'px-2.5 py-1.5 font-medium transition-colors',
            value === opt
              ? opt === 'off'
                ? 'bg-red-500 text-white'
                : 'bg-blue-600 text-white'
              : 'text-muted-foreground hover:bg-gray-50'
          )}
        >
          {t(`settings.notifications.frequency.${opt}`)}
        </button>
      ))}
    </div>
  );
}

// --- SeveritySelector ---
function SeveritySelector({
  value,
  onChange,
}: {
  value: NotificationSeverityFilter;
  onChange: (v: NotificationSeverityFilter) => void;
}) {
  const { t } = useLocales();
  const options: NotificationSeverityFilter[] = ['all', 'warnings_errors', 'errors_only'];
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'px-2 py-0.5 rounded-full text-xs font-medium border transition-colors',
            value === opt
              ? 'bg-gray-900 text-white border-gray-900'
              : 'text-muted-foreground border-gray-200 hover:border-gray-300'
          )}
        >
          {t(`settings.notifications.severity.${opt}`)}
        </button>
      ))}
    </div>
  );
}

// --- CategoryCard ---
function CategoryCard({
  category,
  prefs,
  onChange,
}: {
  category: NotificationCategory;
  prefs: CategoryPreferences;
  onChange: (prefs: CategoryPreferences) => void;
}) {
  const { t } = useLocales();
  const cfg = CATEGORY_CONFIG[category];
  const Icon = cfg.icon;
  const isOff = prefs.frequency === 'off';
  const events = CATEGORY_EVENTS[category];

  function handleFrequency(f: NotificationFrequency) {
    onChange({ ...prefs, frequency: f });
    showToast({
      type: 'success',
      title: t('settings.notifications.toastTitle'),
      description: `${t(`notifications.categories.${category}`)}: ${t(`settings.notifications.frequency.${f}`)}`,
    });
  }

  function handleSeverity(s: NotificationSeverityFilter) {
    onChange({ ...prefs, severity: s });
    showToast({
      type: 'success',
      title: t('settings.notifications.toastTitle'),
      description: `${t(`notifications.categories.${category}`)}: ${t(`settings.notifications.severity.${s}`)}`,
    });
  }

  function handleEvent(event: string) {
    const next = !(prefs.events[event] ?? true);
    onChange({ ...prefs, events: { ...prefs.events, [event]: next } });
    showToast({
      type: 'success',
      title: t('settings.notifications.toastTitle'),
      description: `${t(`settings.notifications.events.${category}.${event}`)}: ${t(next ? 'settings.notifications.toastOn' : 'settings.notifications.toastOff')}`,
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', cfg.bg)}>
              <Icon className={cn('w-4 h-4', cfg.color)} />
            </div>
            <CardTitle className="text-sm font-semibold">
              {t(`notifications.categories.${category}`)}
            </CardTitle>
          </div>
          <FrequencySelector value={prefs.frequency} onChange={handleFrequency} />
        </div>
      </CardHeader>
      <CardContent className={cn(isOff && 'opacity-40 pointer-events-none')}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-muted-foreground w-20 flex-shrink-0">
            {t('settings.notifications.severity.label')}
          </span>
          <SeveritySelector value={prefs.severity} onChange={handleSeverity} />
        </div>
        <Separator className="mb-3" />
        <div className="space-y-2.5">
          {events.map((event) => (
            <div key={event} className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {t(`settings.notifications.events.${category}.${event}`)}
              </span>
              <Switch
                checked={prefs.events[event] ?? true}
                onChange={() => handleEvent(event)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Settings page ---
export default function Settings() {
  const { t } = useLocales();
  const [prefs, setPrefs] = useState<NotificationPrefs>(buildDefaultPrefs);

  function handleCategoryChange(category: NotificationCategory, updated: CategoryPreferences) {
    setPrefs((prev) => ({ ...prev, [category]: updated }));
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('settings.description')}</p>
      </div>

      {/* Notification Preferences header */}
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-blue-600" />
        <h2 className="text-base font-semibold text-foreground">{t('settings.notifications.title')}</h2>
      </div>

      {/* Category cards */}
      {CATEGORY_ORDER.map((category) => (
        <CategoryCard
          key={category}
          category={category}
          prefs={prefs[category]}
          onChange={(updated) => handleCategoryChange(category, updated)}
        />
      ))}

      {/* Account Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-base">{t('settings.account.title')}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">{t('settings.account.description')}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{t('settings.account.name')}</span>
              <span className="text-sm font-medium text-foreground">Kürşad Arman</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{t('settings.account.role')}</span>
              <span className="text-sm font-medium text-foreground">Admin</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{t('settings.account.email')}</span>
              <span className="text-sm font-medium text-foreground">kursad@venuex.io</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications (coming soon) */}
      <Card className="opacity-60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            <CardTitle className="text-base text-muted-foreground">{t('settings.emailNotifications.title')}</CardTitle>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{t('settings.emailNotifications.comingSoon')}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('settings.emailNotifications.description')}</p>
        </CardHeader>
      </Card>
    </div>
  );
}
