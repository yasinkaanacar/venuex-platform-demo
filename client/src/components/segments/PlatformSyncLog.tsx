import { useMemo } from "react";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { Activity, Send, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { useLocales, fPercent, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { PushLogEntry, AdPlatform } from "@/lib/types/segments";

interface PlatformSyncLogProps {
  entries: PushLogEntry[];
}

const platformIcons: Record<AdPlatform, React.ReactNode> = {
  google: <SiGoogle className="w-3.5 h-3.5 text-blue-500" />,
  meta: <SiMeta className="w-3.5 h-3.5 text-blue-600" />,
  tiktok: <SiTiktok className="w-3.5 h-3.5 text-gray-900" />,
};

const actionConfig: Record<
  PushLogEntry["action"],
  { label: string; icon: React.ReactNode }
> = {
  push: {
    label: "Pushed",
    icon: <Send className="w-3.5 h-3.5" />,
  },
  sync: {
    label: "Synced",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
  },
  delete: {
    label: "Deleted",
    icon: <Trash2 className="w-3.5 h-3.5" />,
  },
  error: {
    label: "Error",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
};

const statusColors: Record<
  PushLogEntry["status"],
  { text: string; bg: string; dot: string }
> = {
  success: {
    text: "text-green-700",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  failed: {
    text: "text-red-700",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  partial: {
    text: "text-yellow-700",
    bg: "bg-yellow-100",
    dot: "bg-yellow-500",
  },
};

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function PlatformSyncLog({ entries }: PlatformSyncLogProps) {
  const { t } = useLocales();

  const actionLabels: Record<PushLogEntry["action"], string> = {
    push: t("segments.push.actionPushed") || "Pushed",
    sync: t("segments.push.actionSynced") || "Synced",
    delete: t("segments.push.actionDeleted") || "Deleted",
    error: t("segments.push.actionError") || "Error",
  };

  const statusLabels: Record<PushLogEntry["status"], string> = {
    success: t("common.success") || "Success",
    failed: t("segments.push.failed") || "Failed",
    partial: t("segments.push.statusPartial") || "Partial",
  };

  const sortedEntries = useMemo(() => {
    return [...entries]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
  }, [entries]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="vx-card-header">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-50"></div>
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            {t("segments.push.syncLog") || "Sync Activity Log"}
          </h3>
          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            {sortedEntries.length} {t("segments.push.events") || "events"}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t("segments.push.syncLogDescription") || "Recent push and sync operations across platforms"}
        </p>
      </div>

      {/* Timeline */}
      <div className="vx-card-body">
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-3">
            {sortedEntries.map((entry) => {
              const statusCfg = statusColors[entry.status];
              const actionCfg = actionConfig[entry.action];

              return (
                <div key={entry.id} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div
                    className={cn(
                      "absolute left-[10px] top-4 w-3 h-3 rounded-full ring-4 ring-white",
                      statusCfg.dot
                    )}
                  ></div>

                  {/* Entry Card */}
                  <div className="rounded-lg border border-gray-200 p-3 bg-white hover:bg-gray-50 transition-colors">
                    {/* Top Row: timestamp + platform + date */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono text-gray-500">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                        <div className="text-gray-500">
                          {platformIcons[entry.platform]}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>

                    {/* Content Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {entry.segmentName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                            {actionCfg.icon}
                            {actionLabels[entry.action]}
                          </span>
                          {entry.details && (
                            <span className="text-xs text-gray-400 truncate">
                              - {entry.details}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Match Rate */}
                        {entry.matchRate > 0 && (
                          <span className="text-xs font-medium text-gray-700">
                            {fPercent(entry.matchRate)}
                          </span>
                        )}

                        {/* Identifier Count */}
                        <span className="text-xs text-gray-500">
                          {fNumber(entry.identifierCount)} {t("segments.push.identifierSuffix") || "IDs"}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            statusCfg.bg,
                            statusCfg.text
                          )}
                        >
                          {statusLabels[entry.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
