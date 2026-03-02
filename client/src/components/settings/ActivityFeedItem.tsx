import { useState } from 'react';
import {
  MapPin,
  MessageSquare,
  Settings,
  UserCircle2,
  RefreshCw,
  FolderEdit,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import type { ActivityFeedEntry, ActivityEventType } from '@/lib/types/settings';

interface ActivityFeedItemProps {
  entry: ActivityFeedEntry;
}

interface IconConfig {
  icon: React.ReactNode;
  bg: string;
}

function getIconConfig(type: ActivityEventType): IconConfig {
  switch (type) {
    case 'location_update':
      return {
        icon: <MapPin className="w-4 h-4 text-blue-500" />,
        bg: 'bg-blue-50',
      };
    case 'review_response':
      return {
        icon: <MessageSquare className="w-4 h-4 text-green-500" />,
        bg: 'bg-green-50',
      };
    case 'settings_change':
      return {
        icon: <Settings className="w-4 h-4 text-purple-500" />,
        bg: 'bg-purple-50',
      };
    case 'user_action':
      return {
        icon: <UserCircle2 className="w-4 h-4 text-orange-500" />,
        bg: 'bg-orange-50',
      };
    case 'data_sync':
      return {
        icon: <RefreshCw className="w-4 h-4 text-cyan-500" />,
        bg: 'bg-cyan-50',
      };
    case 'store_set_change':
      return {
        icon: <FolderEdit className="w-4 h-4 text-amber-500" />,
        bg: 'bg-amber-50',
      };
    default:
      return {
        icon: <Settings className="w-4 h-4 text-gray-500" />,
        bg: 'bg-gray-50',
      };
  }
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export default function ActivityFeedItem({ entry }: ActivityFeedItemProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const oc = (t.settings as any)?.activityFeed;

  const { icon, bg } = getIconConfig(entry.type);
  const hasDetails = Boolean(entry.details);

  return (
    <div className="py-3 px-4">
      <div className="flex items-start justify-between gap-3">
        {/* Left: icon + content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Event type icon */}
          <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-medium text-gray-900">{entry.actor}</span>
              <span className="text-sm text-gray-600">{entry.action}</span>
              {hasDetails && (
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="ml-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  aria-label={expanded ? 'Collapse details' : 'Expand details'}
                >
                  {expanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Expanded detail panel */}
            {expanded && entry.details && (
              <div className="mt-2 ml-0 p-3 bg-gray-50 rounded-lg text-xs space-y-1">
                {entry.details.locationName && (
                  <div className="text-gray-600">
                    <span className="font-medium text-gray-700">
                      {entry.details.locationName}
                    </span>
                  </div>
                )}
                {entry.details.field && (
                  <div className="text-gray-600">
                    <span className="text-gray-500">{oc?.changedField || 'Changed field'}:</span>{' '}
                    <span className="font-medium">{entry.details.field}</span>
                  </div>
                )}
                {entry.details.oldValue && (
                  <div className="text-gray-600">
                    <span className="text-gray-500">{oc?.oldValue || 'Old value'}:</span>{' '}
                    <span className="text-red-600 line-through">{entry.details.oldValue}</span>
                  </div>
                )}
                {entry.details.newValue && (
                  <div className="text-gray-600">
                    <span className="text-gray-500">{oc?.newValue || 'New value'}:</span>{' '}
                    <span className="text-green-600">{entry.details.newValue}</span>
                  </div>
                )}
                {entry.details.additionalInfo && (
                  <div className="text-gray-500">{entry.details.additionalInfo}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: timestamp */}
        <span className="text-xs text-gray-400 flex-shrink-0 mt-1">
          {formatTime(entry.timestamp)}
        </span>
      </div>
    </div>
  );
}
