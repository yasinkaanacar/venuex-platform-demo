import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { RefreshCw, Send } from "lucide-react";
import { useLocales, fPercent, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import PlatformPushCard from "./PlatformPushCard";
import PlatformSyncLog from "./PlatformSyncLog";
import PushToPlatformDialog from "./PushToPlatformDialog";
import LookalikeAudienceSection from "./LookalikeAudienceSection";
import ABTestSection from "./ABTestSection";
import type {
  Segment,
  PushLogEntry,
  AdPlatform,
  PushStatus,
  SegmentPlatformPush,
} from "@/lib/types/segments";

const platformIcons: Record<AdPlatform, React.ReactNode> = {
  google: <SiGoogle className="w-4 h-4 text-blue-500" />,
  meta: <SiMeta className="w-4 h-4 text-blue-600" />,
  tiktok: <SiTiktok className="w-4 h-4 text-gray-900" />,
};

const pushStatusBadge: Record<
  PushStatus,
  { label: string; color: string; bg: string }
> = {
  synced: { label: "Synced", color: "text-green-700", bg: "bg-green-100" },
  syncing: { label: "Syncing", color: "text-blue-700", bg: "bg-blue-100" },
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100" },
  failed: { label: "Failed", color: "text-red-700", bg: "bg-red-100" },
  not_pushed: { label: "Not Pushed", color: "text-gray-700", bg: "bg-gray-100" },
};

interface PlatformStats {
  audienceCount: number;
  avgMatchRate: number;
  activeCampaigns: number;
  isConnected: boolean;
}

function computePlatformStats(
  segments: Segment[]
): Record<AdPlatform, PlatformStats> {
  const platforms: AdPlatform[] = ["google", "meta", "tiktok"];
  const result: Record<AdPlatform, PlatformStats> = {
    google: { audienceCount: 0, avgMatchRate: 0, activeCampaigns: 0, isConnected: true },
    meta: { audienceCount: 0, avgMatchRate: 0, activeCampaigns: 0, isConnected: true },
    tiktok: { audienceCount: 0, avgMatchRate: 0, activeCampaigns: 0, isConnected: true },
  };

  for (const platform of platforms) {
    const pushes = segments.flatMap((s) =>
      s.platformPushes.filter(
        (p) => p.platform === platform && p.status === "synced"
      )
    );
    result[platform].audienceCount = pushes.length;
    result[platform].activeCampaigns = pushes.reduce(
      (acc, p) => acc + p.activeCampaigns, 0
    );
    result[platform].avgMatchRate =
      pushes.length > 0
        ? Math.round(
            pushes.reduce((acc, p) => acc + p.matchRate, 0) / pushes.length
          )
        : 0;
  }

  return result;
}

function getPushForPlatform(
  segment: Segment,
  platform: AdPlatform
): SegmentPlatformPush | null {
  return (
    segment.platformPushes.find((p) => p.platform === platform) ?? null
  );
}

export default function PlatformPushDashboard() {
  const { t } = useLocales();
  const [pushDialogOpen, setPushDialogOpen] = useState(false);
  const [pushTargetSegment, setPushTargetSegment] = useState<Segment | null>(null);
  const [pushPreSelectedPlatform, setPushPreSelectedPlatform] = useState<AdPlatform[]>([]);

  const { data: segments = [] } = useQuery<Segment[]>({
    queryKey: ["/api/segments"],
  });

  const { data: pushLog = [] } = useQuery<PushLogEntry[]>({
    queryKey: ["/api/segments/push-log"],
  });

  const platformStats = useMemo(
    () => computePlatformStats(segments),
    [segments]
  );

  // Show active + building segments, plus paused segments that have existing pushes
  const activeSegments = useMemo(
    () =>
      segments.filter(
        (s) =>
          s.status === "active" ||
          s.status === "building" ||
          (s.status === "paused" && s.platformPushes.length > 0),
      ),
    [segments]
  );

  const platformOrder: AdPlatform[] = ["google", "meta", "tiktok"];

  function openPushDialog(segment: Segment, platform?: AdPlatform) {
    setPushTargetSegment(segment);
    setPushPreSelectedPlatform(platform ? [platform] : []);
    setPushDialogOpen(true);
  }

  return (
    <div className="space-y-6 px-6 py-6">
      {/* Platform Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platformOrder.map((platform) => (
          <PlatformPushCard
            key={platform}
            platform={platform}
            audienceCount={platformStats[platform].audienceCount}
            avgMatchRate={platformStats[platform].avgMatchRate}
            activeCampaigns={platformStats[platform].activeCampaigns}
            isConnected={platformStats[platform].isConnected}
          />
        ))}
      </div>

      {/* Segment-Platform Matrix Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="vx-card-header">
          <h3 className="text-base font-semibold text-gray-900">
            {t("segments.push.matrixTitle") || "Segment-Platform Matrix"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {t("segments.push.matrixDescription") || "Push status and match rates across all active segments"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  {t("segments.list.name") || "Segment Name"}
                </th>
                {platformOrder.map((platform) => (
                  <th
                    key={platform}
                    className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {platformIcons[platform]}
                      <span>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  {t("segments.push.campaignsColumn") || "Campaigns"}
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  {t("segments.push.autoSync") || "Auto-Sync"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeSegments.map((segment) => {
                const hasAutoSync = segment.platformPushes.some(
                  (p) => p.autoSync
                );
                return (
                  <tr
                    key={segment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">
                        {segment.name}
                      </span>
                    </td>
                    {platformOrder.map((platform) => {
                      const push = getPushForPlatform(segment, platform);
                      if (!push) {
                        const cfg = pushStatusBadge["not_pushed"];
                        return (
                          <td key={platform} className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPushDialog(segment, platform);
                              }}
                              className="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                            >
                              <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              {t("segments.push.notPushed") || cfg.label}
                            </button>
                          </td>
                        );
                      }
                      const cfg = pushStatusBadge[push.status];
                      const isRetryable = push.status === "failed" || push.status === "pending";
                      return (
                        <td key={platform} className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {isRetryable ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPushDialog(segment, platform);
                                }}
                                className="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:ring-1 hover:ring-current transition-all"
                                style={{ color: undefined }}
                              >
                                <span className={cn(cfg.bg, cfg.color, "px-2 py-0.5 rounded-full inline-flex items-center gap-1")}>
                                  <RefreshCw className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  {t(`segments.push.${push.status}`) || cfg.label}
                                </span>
                              </button>
                            ) : (
                              <span
                                className={cn(
                                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                  cfg.bg,
                                  cfg.color
                                )}
                              >
                                {t(`segments.push.${push.status === "not_pushed" ? "notPushed" : push.status}`) || cfg.label}
                              </span>
                            )}
                            {push.matchRate > 0 && (
                              <span className="text-xs text-gray-500">
                                {fPercent(push.matchRate)}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      {(() => {
                        const total = segment.platformPushes.reduce(
                          (acc, p) => acc + p.activeCampaigns, 0
                        );
                        return total > 0 ? (
                          <span className="text-sm font-medium text-gray-900">
                            {total}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasAutoSync ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                          <RefreshCw className="w-3 h-3" />
                          {t("segments.push.autoSyncOn") || "On"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">{t("segments.push.autoSyncOff") || "Off"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {activeSegments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    {t("segments.push.noActiveSegments") || "No active segments to display."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync Activity Log */}
      <PlatformSyncLog entries={pushLog} />

      {/* Lookalike Audiences */}
      <LookalikeAudienceSection />

      {/* A/B Test Audiences */}
      <ABTestSection />

      {/* Push to Platform dialog */}
      {pushTargetSegment && (
        <PushToPlatformDialog
          open={pushDialogOpen}
          onOpenChange={setPushDialogOpen}
          segment={pushTargetSegment}
          preSelectedPlatforms={pushPreSelectedPlatform}
        />
      )}
    </div>
  );
}
