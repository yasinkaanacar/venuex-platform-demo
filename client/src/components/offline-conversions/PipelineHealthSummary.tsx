import { Activity, CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { fNumber } from '@/lib/formatters';
import type { PipelineHealthData } from '@/lib/mock/pipeline';

interface PipelineHealthSummaryProps {
  health: PipelineHealthData;
}

const healthConfig = {
  healthy: {
    borderColor: 'border-l-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
  },
  degraded: {
    borderColor: 'border-l-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
  },
  disrupted: {
    borderColor: 'border-l-red-500',
    badgeBg: 'bg-red-50 text-red-700',
    icon: XCircle,
    iconColor: 'text-red-500',
  },
};

export default function PipelineHealthSummary({ health }: PipelineHealthSummaryProps) {
  const { t } = useTranslation();
  const dc = (t.offlineConversions as any)?.dataConnectionTab as Record<string, string> | undefined;

  const config = healthConfig[health.level];
  const StatusIcon = config.icon;

  const statusLabel =
    health.level === 'healthy'
      ? dc?.allSystemsOperational || 'All Systems Operational'
      : health.level === 'degraded'
        ? (dc?.issuesDetected || '{{count}} Issues Detected').replace('{{count}}', String(health.activeIssuesCount))
        : dc?.pipelineDisrupted || 'Pipeline Disrupted';

  const kpis = [
    {
      label: dc?.eventsProcessed24h || 'Events Processed (24h)',
      value: fNumber(health.eventsProcessed24h),
      change: health.eventsProcessedChange,
      showChange: true,
    },
    {
      label: dc?.avgMatchRate || 'Avg Match Rate',
      value: `${health.avgMatchRate}%`,
      change: health.avgMatchRateChange,
      showChange: true,
    },
    {
      label: dc?.activeIssues || 'Active Issues',
      value: String(health.activeIssuesCount),
      change: null,
      showChange: false,
      isIssueCount: true,
    },
  ];

  return (
    <div className={`vx-card border-l-4 ${config.borderColor}`}>
      {/* Header */}
      <div className="vx-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <h3 className="text-base font-semibold text-foreground">
              {dc?.pipelineHealth || 'Pipeline Health'}
            </h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                {dc?.pipelineHealthTooltip || 'Real-time overview of your data pipeline status.'}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badgeBg}`}>
              <StatusIcon className={`w-3.5 h-3.5 ${config.iconColor}`} />
              {statusLabel}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{dc?.pipelineHealthDesc || 'System status and key pipeline metrics'}</p>
      </div>

      {/* KPI Grid */}
      <div className="vx-card-body vx-surface-muted">
        <div className="grid grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                {kpi.label}
              </p>
              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${
                  kpi.isIssueCount && health.activeIssuesCount > 0
                    ? 'text-amber-600'
                    : 'text-gray-900'
                }`}>
                  {kpi.value}
                </span>
                {kpi.showChange && kpi.change !== null && (
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${
                    kpi.change >= 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {kpi.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{kpi.change > 0 ? '+' : ''}{kpi.change}%</span>
                  </div>
                )}
                {kpi.isIssueCount && (
                  <span className={`text-xs font-medium ${
                    health.activeIssuesCount === 0 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {health.activeIssuesCount === 0
                      ? dc?.noIssues || 'No issues'
                      : ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
