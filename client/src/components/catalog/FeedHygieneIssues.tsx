import { Info, AlertTriangle, AlertCircle, InfoIcon } from 'lucide-react';
import type { FeedHygieneIssue } from '@/lib/types/catalog';

interface FeedHygieneIssuesProps {
  issues: FeedHygieneIssue[];
}

function getSeverityIcon(severity: FeedHygieneIssue['severity']) {
  switch (severity) {
    case 'critical':
      return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
    case 'info':
      return <InfoIcon className="w-3.5 h-3.5 text-blue-500" />;
  }
}

function getPlatformBadge(platform: FeedHygieneIssue['platform']) {
  switch (platform) {
    case 'google':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium border border-blue-100">
          <span className="w-3 h-3 rounded-sm bg-[#4285F4] flex items-center justify-center text-white text-[7px] font-bold">G</span>
          Google
        </span>
      );
    case 'meta':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium border border-blue-100">
          <span className="w-3 h-3 rounded-sm bg-[#1877F2] flex items-center justify-center text-white text-[7px] font-bold">M</span>
          Meta
        </span>
      );
    case 'both':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium border border-gray-200">
          Both
        </span>
      );
  }
}

export default function FeedHygieneIssues({ issues }: FeedHygieneIssuesProps) {
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-foreground">Feed Hygiene</h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                Structural and format issues detected during feed processing. These are problems VenueX can catch — data accuracy is the responsibility of the source system.
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-red-50 text-red-700 border border-red-200">
                {criticalCount} critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-amber-50 text-amber-700 border border-amber-200">
                {warningCount} warning
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Structural issues detected before platform submission</p>
      </div>

      <div className="vx-card-body vx-surface-muted">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          {issues.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No feed hygiene issues detected
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {issues.map((issue) => (
                <div key={issue.id} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                  <div className="mt-0.5 flex-shrink-0">
                    {getSeverityIcon(issue.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-900">{issue.type}</span>
                      {getPlatformBadge(issue.platform)}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{issue.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-sm font-semibold text-gray-900">{issue.affectedCount}</span>
                    <div className="text-[10px] text-gray-500">affected</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
