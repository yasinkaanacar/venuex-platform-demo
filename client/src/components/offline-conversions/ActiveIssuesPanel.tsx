import { AlertTriangle, XCircle, Info, Zap, RefreshCw, X } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { useTranslation } from '@/contexts/LanguageContext';
import type { ActiveIssue } from '@/lib/mock-pipeline-data';

interface ActiveIssuesPanelProps {
  issues: ActiveIssue[];
  onDismiss: (issueId: string) => void;
  onRetry: (issueId: string) => void;
}

const severityConfig = {
  critical: {
    icon: XCircle,
    iconColor: 'text-red-500',
    borderColor: 'border-red-200',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-200',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    borderColor: 'border-gray-200',
  },
};

function PlatformIcon({ platform }: { platform?: string }) {
  switch (platform) {
    case 'google':
      return <div className="w-6 h-6 bg-red-50 rounded flex items-center justify-center"><SiGoogle className="w-3 h-3 text-red-500" /></div>;
    case 'meta':
      return <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center"><SiMeta className="w-3 h-3 text-blue-600" /></div>;
    case 'tiktok':
      return <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"><SiTiktok className="w-3 h-3 text-gray-900" /></div>;
    default:
      return null;
  }
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function ActiveIssuesPanel({ issues, onDismiss, onRetry }: ActiveIssuesPanelProps) {
  const { t } = useTranslation();
  const dc = (t.offlineConversions as any)?.dataConnectionTab as Record<string, string> | undefined;

  if (issues.length === 0) return null;

  return (
    <div className="vx-card border-l-4 border-l-amber-400">
      {/* Header */}
      <div className="vx-card-header">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-base font-semibold text-foreground">
            {dc?.activeIssuesTitle || 'Active Issues'}
          </h3>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
            {issues.length}
          </span>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
              {dc?.activeIssuesTooltip || 'Current issues requiring attention.'}
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{dc?.activeIssuesDesc || 'Issues requiring attention'}</p>
      </div>

      {/* Body */}
      <div className="vx-card-body vx-surface-muted space-y-3">
        {issues.map((issue) => {
          const config = severityConfig[issue.severity];
          const SeverityIcon = config.icon;

          return (
            <div
              key={issue.id}
              className={`p-4 bg-white rounded-lg border shadow-sm ${config.borderColor}`}
            >
              {/* Title row */}
              <div className="flex items-center gap-2.5">
                <SeverityIcon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
                {issue.platform && <PlatformIcon platform={issue.platform} />}
                <h4 className="text-sm font-semibold text-gray-900 flex-1">{issue.title}</h4>
                <span className="text-xs text-gray-400 flex-shrink-0">{getRelativeTime(issue.timestamp)}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-2 ml-[30px]">{issue.description}</p>

              {/* Suggested Action */}
              <div className="mt-3 ml-[30px] p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">
                      {dc?.suggestedAction || 'Suggested Action'}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{issue.suggestedAction}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-3 ml-[30px]">
                {issue.isRetryable && (
                  <button
                    onClick={() => onRetry(issue.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {dc?.retryAction || 'Retry'}
                  </button>
                )}
                {issue.isDismissable && (
                  <button
                    onClick={() => onDismiss(issue.id)}
                    className="flex items-center gap-1 ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {dc?.dismiss || 'Dismiss'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
