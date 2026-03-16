import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import {
  Bell,
  Plug,
  Star,
  MapPin,
  Package,
  BarChart2,
  ChevronRight,
  CheckCheck,
} from 'lucide-react';
import { PATHS } from '@/routes/paths';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useLocales } from '@/lib/formatters';
import { useNotifications, useMarkAllAsRead } from '@/hooks/useNotifications';
import { formatRelativeTime, getTimeGroup } from '@/lib/mock/notifications';
import type { Notification, NotificationCategory } from '@/lib/types/notifications';

// --- Category config (no label — label comes from i18n) ---
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

const SEVERITY_DOT: Record<string, string> = {
  error: 'bg-red-500',
  warning: 'bg-amber-400',
  success: 'bg-green-500',
  info: 'bg-blue-400',
};

// --- NotificationItem ---
function NotificationItem({
  notification,
  onNavigate,
}: {
  notification: Notification;
  onNavigate: (url: string) => void;
}) {
  const { t } = useLocales();
  const cfg = CATEGORY_CONFIG[notification.category];
  const Icon = cfg.icon;
  const isClickable = !!notification.actionUrl;
  const categoryLabel = t(`notifications.categories.${notification.category}`);

  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-3 transition-colors',
        notification.isRead ? 'bg-gray-50' : 'bg-white border-l-2 border-blue-500',
        isClickable && 'cursor-pointer hover:bg-blue-50/50'
      )}
      onClick={() => {
        if (isClickable && notification.actionUrl) {
          onNavigate(notification.actionUrl);
        }
      }}
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5', cfg.bg)}>
        <Icon className={cn('w-4 h-4', cfg.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', cfg.bg, cfg.color)}>
              {categoryLabel}
            </span>
            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', SEVERITY_DOT[notification.severity])} />
          </div>
          {isClickable && (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          )}
        </div>
        <p className={cn('text-sm mt-1 leading-snug', notification.isRead ? 'font-normal text-gray-700' : 'font-semibold text-gray-900')}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
    </div>
  );
}

// --- Grouped list ---
function NotificationList({
  notifications,
  onNavigate,
  emptyIcon: EmptyIcon = Bell,
}: {
  notifications: Notification[];
  onNavigate: (url: string) => void;
  emptyIcon?: React.ElementType;
}) {
  const { t } = useLocales();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <EmptyIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">{t('notifications.noNotifications')}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{t('notifications.noNotificationsDesc')}</p>
      </div>
    );
  }

  const groups: Array<{ key: string; items: Notification[] }> = [];
  const groupMap: Record<string, Notification[]> = {};

  notifications.forEach((n) => {
    const g = getTimeGroup(n.createdAt);
    if (!groupMap[g]) {
      groupMap[g] = [];
      groups.push({ key: g, items: groupMap[g] });
    }
    groupMap[g].push(n);
  });

  return (
    <>
      {groups.map((group) => (
        <div key={group.key}>
          <div className="px-4 py-2 bg-gray-50 border-y border-gray-100">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t(`notifications.timeGroups.${group.key}`)}
            </span>
          </div>
          {group.items.map((notif, idx) => (
            <div key={notif.id}>
              <NotificationItem notification={notif} onNavigate={onNavigate} />
              {idx < group.items.length - 1 && <Separator className="mx-4" />}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// --- Main component ---
export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { t } = useLocales();
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const markAllAsRead = useMarkAllAsRead();
  const markAllTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Auto-mark all as read 2s after panel opens
  useEffect(() => {
    if (open && unreadCount > 0) {
      markAllTimer.current = setTimeout(() => {
        markAllAsRead.mutate();
      }, 2000);
    }
    return () => {
      if (markAllTimer.current) clearTimeout(markAllTimer.current);
    };
  }, [open, unreadCount]);

  function handleNavigate(url: string) {
    setOpen(false);
    navigate(url);
  }

  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const categoryTabs: NotificationCategory[] = [
    'platform',
    'reviews',
    'locations',
    'catalog',
    'offline_conversions',
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={
            unreadCount > 0
              ? `${t('notifications.title')}, ${unreadCount} ${t('notifications.tabs.unread').toLowerCase()}`
              : t('notifications.title')
          }
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-background">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[420px] p-0 shadow-xl border border-gray-200 rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm text-foreground">{t('notifications.title')}</span>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-semibold">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              className={cn(
                'flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors',
                markAllAsRead.isPending && 'opacity-50'
              )}
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              {t('notifications.markAllRead')}
            </button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <div className="border-b bg-white overflow-x-auto">
            <TabsList className="h-auto p-0 bg-transparent rounded-none flex min-w-max">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent text-xs px-3 py-2.5 font-medium whitespace-nowrap flex-shrink-0"
              >
                {t('notifications.tabs.all')}
                <span className="ml-1 text-[10px] bg-gray-100 text-gray-500 rounded px-1">
                  {notifications.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent text-xs px-3 py-2.5 font-medium whitespace-nowrap flex-shrink-0"
              >
                {t('notifications.tabs.unread')}
                {unreadCount > 0 && (
                  <span className="ml-1 text-[10px] bg-red-100 text-red-600 rounded px-1 font-semibold">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              {categoryTabs.map((cat) => {
                const count = notifications.filter((n) => n.category === cat).length;
                if (count === 0) return null;
                return (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent text-xs px-3 py-2.5 font-medium whitespace-nowrap flex-shrink-0"
                  >
                    {t(`notifications.categories.${cat}`)}
                    <span className="ml-1 text-[10px] bg-gray-100 text-gray-500 rounded px-1">
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* All */}
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[440px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                  {t('common.loading')}
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center py-16 text-sm text-red-500">
                  {t('notifications.loadError') || 'Failed to load notifications'}
                </div>
              ) : (
                <NotificationList notifications={notifications} onNavigate={handleNavigate} />
              )}
            </ScrollArea>
          </TabsContent>

          {/* Unread */}
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[440px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                  {t('common.loading')}
                </div>
              ) : (
                <NotificationList notifications={unreadNotifs} onNavigate={handleNavigate} emptyIcon={CheckCheck} />
              )}
            </ScrollArea>
          </TabsContent>

          {/* Category tabs */}
          {categoryTabs.map((cat) => (
            <TabsContent key={cat} value={cat} className="m-0">
              <ScrollArea className="h-[440px]">
                <NotificationList
                  notifications={notifications.filter((n) => n.category === cat)}
                  onNavigate={handleNavigate}
                />
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-4 py-2.5">
          <button
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            onClick={() => {
              setOpen(false);
              navigate(PATHS.SETTINGS);
            }}
          >
            {t('notifications.settings')}
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
