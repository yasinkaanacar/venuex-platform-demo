import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Circle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import type { BusinessProfile, CompletionChecklistItem } from '@/lib/types/settings';

export default function CompletionSidebar() {
  const { t } = useTranslation();
  const oc = t.settings as any;

  const { data: profile } = useQuery<BusinessProfile>({
    queryKey: ['/api/settings/profile'],
  });

  const { data: checklist = [] } = useQuery<CompletionChecklistItem[]>({
    queryKey: ['/api/settings/completion'],
  });

  // Compute completion percentage from checklist items
  const totalItems = checklist.reduce((sum, item) => sum + item.total, 0);
  const totalCompleted = checklist.reduce((sum, item) => sum + item.completed, 0);
  const percentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  const brandName = profile?.brandName ?? '...';
  const locationCount = profile?.locationCount ?? 0;

  return (
    <div className="w-72 flex-shrink-0">
      <div className="vx-card">
        <div className="vx-card-body space-y-4">
          {/* Brand identity */}
          <div className="flex flex-col items-start gap-2">
            {/* Logo */}
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile?.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={brandName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-400">
                  {brandName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Brand name + location count */}
            <div>
              <p className="text-base font-semibold text-foreground">{brandName}</p>
              <p className="text-xs text-gray-500">
                {locationCount} {oc?.locations || 'locations'}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Progress bar section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {oc?.completionSidebar?.title || 'Profile Completion'}
              </span>
              <span className="text-sm font-semibold text-blue-600">{percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Checklist items */}
          {checklist.length > 0 && (
            <div className="mt-4 space-y-2.5">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  {/* Icon + label */}
                  <div className="flex items-center gap-2 min-w-0">
                    {item.isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={
                        item.isComplete
                          ? 'text-sm text-gray-700 truncate'
                          : 'text-sm text-gray-500 truncate'
                      }
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Count */}
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {item.completed}/{item.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
