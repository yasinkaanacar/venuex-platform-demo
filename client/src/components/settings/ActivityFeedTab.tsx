import { useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useBrandContext } from '@/hooks/useAuth';
import { useApiSettingsActivityFeed } from '@/hooks/api';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import ActivityFeedItem from '@/components/settings/ActivityFeedItem';
import type { ActivityFeedEntry, ActivityEventType } from '@/lib/types/settings';

// ─── Date grouping helper ────────────────────────────────────────────────────

function groupByDate(events: ActivityFeedEntry[]): Map<string, ActivityFeedEntry[]> {
  return events.reduce((map, event) => {
    const dateKey = new Date(event.timestamp).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(event);
    return map;
  }, new Map<string, ActivityFeedEntry[]>());
}

// ─── Activity event types list ───────────────────────────────────────────────

const ALL_EVENT_TYPES: ActivityEventType[] = [
  'location_update',
  'review_response',
  'settings_change',
  'user_action',
  'data_sync',
  'store_set_change',
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ActivityFeedTab() {
  const { t } = useTranslation();
  const oc = (t.settings as any)?.activityFeed;

  const [typeFilter, setTypeFilter] = useState<ActivityEventType | 'all'>('all');
  const [dateRange, setDateRange] = useState<'all' | '7' | '30' | '90'>('all');
  const [visibleCount, setVisibleCount] = useState(10);

  // Fetch all events
  const { brandId } = useBrandContext();
  const { data: allEvents = [] } = useApiSettingsActivityFeed({ brandId });

  // ── Filtering logic ──────────────────────────────────────────────────────
  let filtered = [...allEvents];

  // 1. Type filter
  if (typeFilter !== 'all') {
    filtered = filtered.filter((e) => e.type === typeFilter);
  }

  // 2. Date range filter
  if (dateRange !== 'all') {
    const daysBack = parseInt(dateRange, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysBack);
    const cutoffIso = cutoff.toISOString();
    filtered = filtered.filter((e) => e.timestamp >= cutoffIso);
  }

  // 3. Slice for pagination
  const hasMore = filtered.length > visibleCount;
  const visible = filtered.slice(0, visibleCount);

  // 4. Group by date
  const grouped = groupByDate(visible);

  return (
    <SettingsSectionCard
      title={oc?.title || 'Activity Feed'}
      description={oc?.desc || 'Track all changes and actions across your account'}
      tooltip={oc?.tooltip || 'Shows a chronological log of all modifications'}
    >
      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as ActivityEventType | 'all');
            setVisibleCount(10);
          }}
          className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label={oc?.filterByType || 'Filter by type'}
        >
          <option value="all">{oc?.allTypes || 'All Types'}</option>
          {ALL_EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {oc?.eventTypes?.[type] || type}
            </option>
          ))}
        </select>

        {/* Date range filter */}
        <select
          value={dateRange}
          onChange={(e) => {
            setDateRange(e.target.value as 'all' | '7' | '30' | '90');
            setVisibleCount(10);
          }}
          className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label={oc?.dateRange || 'Date range'}
        >
          <option value="all">{oc?.allDates || 'All Dates'}</option>
          <option value="7">{oc?.last7Days || 'Last 7 Days'}</option>
          <option value="30">{oc?.last30Days || 'Last 30 Days'}</option>
          <option value="90">{oc?.last90Days || 'Last 90 Days'}</option>
        </select>
      </div>

      {/* Date-grouped event list */}
      {grouped.size === 0 ? (
        /* Empty state */
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm text-center text-gray-400 py-12">
          {oc?.noEvents || 'No activity to show'}
        </div>
      ) : (
        <div>
          {Array.from(grouped.entries()).map(([dateKey, events], groupIndex) => (
            <div key={dateKey} className={groupIndex > 0 ? 'mt-4' : ''}>
              {/* Date header */}
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-2 bg-gray-50 rounded-md">
                {dateKey}
              </div>

              {/* Events under this date */}
              <div className="divide-y divide-gray-100 bg-white rounded-lg border border-gray-100 shadow-sm mt-1">
                {events.map((entry) => (
                  <ActivityFeedItem key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}

          {/* Load More button */}
          {hasMore && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="w-full mt-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {oc?.loadMore || 'Load More'}
            </button>
          )}
        </div>
      )}
    </SettingsSectionCard>
  );
}
