import { useState, useEffect, useMemo } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
} from "@mui/material";
import { X, Send, Loader2, Info } from "lucide-react";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { useQueryClient, useQueries } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocales, fNumber, fCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { segmentDataService } from "@/lib/mock-segments-data";
import { showToast } from "@/lib/toast";
import SegmentReachProjection from "./SegmentReachProjection";
import type { Segment, AdPlatform, PushStatus, ReachProjection } from "@/lib/types/segments";

interface PushToPlatformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment: Segment;
  preSelectedPlatforms?: AdPlatform[];
}

// ---------------------------------------------------------------------------
// Platform config
// ---------------------------------------------------------------------------

const PLATFORMS: {
  key: AdPlatform;
  name: string;
  icon: React.ElementType;
  iconColor: string;
  estMatchRate: number;
}[] = [
  { key: "google", name: "Google Ads", icon: SiGoogle, iconColor: "text-[#4285F4]", estMatchRate: 76 },
  { key: "meta", name: "Meta Ads", icon: SiMeta, iconColor: "text-[#0081FB]", estMatchRate: 81 },
  { key: "tiktok", name: "TikTok Ads", icon: SiTiktok, iconColor: "text-gray-900", estMatchRate: 61 },
];

const pushStatusDisplay: Record<PushStatus, { label: string; color: string; bg: string }> = {
  synced: { label: "Synced", color: "text-green-700", bg: "bg-green-100" },
  syncing: { label: "Syncing", color: "text-blue-700", bg: "bg-blue-100" },
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100" },
  failed: { label: "Failed", color: "text-red-700", bg: "bg-red-100" },
  not_pushed: { label: "Not Pushed", color: "text-gray-500", bg: "bg-gray-100" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PushToPlatformDialog({
  open,
  onOpenChange,
  segment,
  preSelectedPlatforms,
}: PushToPlatformDialogProps) {
  const { t, translate } = useLocales();
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Set<AdPlatform>>(new Set());
  const [isPushing, setIsPushing] = useState(false);

  // Initialize selection from preSelectedPlatforms
  useEffect(() => {
    if (open) {
      setSelected(new Set(preSelectedPlatforms ?? []));
      setIsPushing(false);
    }
  }, [open, preSelectedPlatforms]);

  const audienceSize = segment.actualSize ?? segment.estimatedSize;

  // Check if any selected platform is already synced (for re-push note)
  const hasAlreadySynced = PLATFORMS.some((p) => {
    if (!selected.has(p.key)) return false;
    const push = segment.platformPushes.find((pp) => pp.platform === p.key);
    return push?.status === "synced";
  });

  function togglePlatform(platform: AdPlatform) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) {
        next.delete(platform);
      } else {
        next.add(platform);
      }
      return next;
    });
  }

  async function handlePush() {
    if (selected.size === 0 || isPushing) return;

    setIsPushing(true);
    try {
      const platforms = Array.from(selected);
      await Promise.all(
        platforms.map((platform) =>
          segmentDataService.pushSegmentToPlatform(segment.id, platform),
        ),
      );

      showToast({
        type: "success",
        title: t("segments.push.pushSuccess") || "Segment pushed successfully",
        description: `${segment.name} → ${platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")}`,
      });

      // Refresh all segment-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/segments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/segments/push-log"] });
      queryClient.invalidateQueries({ queryKey: ["/api/segments/summary"] });

      onOpenChange(false);
    } catch {
      showToast({
        type: "error",
        title: t("common.error") || "Error",
        description: t("segments.push.pushError") || "Failed to push segment to platform",
      });
    } finally {
      setIsPushing(false);
    }
  }

  function handleClose() {
    if (!isPushing) {
      onOpenChange(false);
    }
  }

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: "100%",
          maxWidth: 500,
        },
      }}
    >
      {/* Header */}
      <MuiDialogTitle
        sx={{
          fontSize: "1.125rem",
          fontWeight: 600,
          pb: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{t("segments.push.pushDialog.title") || "Push to Platform"}</span>
        <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }} disabled={isPushing}>
          <X size={16} />
        </IconButton>
      </MuiDialogTitle>

      <MuiDialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        {/* Segment info */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-foreground">{segment.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {translate("segments.push.pushDialog.audienceSize", { count: fNumber(audienceSize) }) ||
              `${fNumber(audienceSize)} identifiers`}
          </div>
        </div>

        {/* Description */}
        <div className="text-xs text-muted-foreground mb-4">
          {t("segments.push.pushDialog.description") ||
            "Select platforms to push this segment as a custom audience."}
        </div>

        {/* Platform checkboxes */}
        <div className="space-y-2">
          {PLATFORMS.map((platform) => {
            const existingPush = segment.platformPushes.find(
              (pp) => pp.platform === platform.key,
            );
            const status: PushStatus = existingPush?.status ?? "not_pushed";
            const statusCfg = pushStatusDisplay[status];
            const isChecked = selected.has(platform.key);
            const Icon = platform.icon;

            return (
              <div key={platform.key}>
                <label
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 cursor-pointer transition-all",
                    isChecked
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onChange={() => togglePlatform(platform.key)}
                    disabled={isPushing}
                  />

                  {/* Platform icon + name */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Icon className={cn("w-5 h-5 shrink-0", platform.iconColor)} />
                    <span className="text-sm font-medium text-foreground">
                      {platform.name}
                    </span>
                  </div>

                  {/* Status + match rate */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                        statusCfg.bg,
                        statusCfg.color,
                      )}
                    >
                      {t(`segments.push.${status === "not_pushed" ? "notPushed" : status}`) || statusCfg.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      ~{existingPush?.matchRate || platform.estMatchRate}%
                    </span>
                  </div>
                </label>
                {/* Reach projection inline below checked platform */}
                {isChecked && (
                  <SegmentReachProjection
                    segmentId={segment.id}
                    platform={platform.key}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Total projected spend */}
        {selected.size > 0 && (
          <TotalProjectedSpend segmentId={segment.id} platforms={Array.from(selected)} />
        )}

        {/* Re-push note */}
        {hasAlreadySynced && (
          <div className="flex items-start gap-2 mt-3 px-1">
            <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
            <span className="text-xs text-muted-foreground leading-relaxed">
              {t("segments.push.pushDialog.rePushNote") ||
                "Re-pushing will refresh the audience data on the platform."}
            </span>
          </div>
        )}
      </MuiDialogContent>

      {/* Actions */}
      <MuiDialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outline" size="sm" onClick={handleClose} disabled={isPushing}>
          {t("segments.push.pushDialog.cancelButton") || "Cancel"}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handlePush}
          disabled={selected.size === 0 || isPushing}
          startIcon={
            isPushing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )
          }
        >
          {isPushing
            ? t("segments.push.pushDialog.pushing") || "Pushing..."
            : t("segments.push.pushDialog.pushButton") || "Push"}
        </Button>
      </MuiDialogActions>
    </MuiDialog>
  );
}

// ---------------------------------------------------------------------------
// Total Projected Spend summary
// ---------------------------------------------------------------------------

function TotalProjectedSpend({
  segmentId,
  platforms,
}: {
  segmentId: string;
  platforms: AdPlatform[];
}) {
  const { t } = useLocales();

  const projectionQueries = useQueries({
    queries: platforms.map((platform) => ({
      queryKey: [`/api/segments/reach-projection/${segmentId}/${platform}`],
      enabled: !!segmentId,
    })),
  });

  const totalSpend = useMemo(() => {
    let sum = 0;
    for (const q of projectionQueries) {
      const data = q.data as ReachProjection | undefined;
      if (data) sum += data.estimatedMonthlySpend;
    }
    return sum;
  }, [projectionQueries]);

  const allLoaded = projectionQueries.every((q) => !q.isLoading);

  if (!allLoaded || totalSpend === 0) return null;

  return (
    <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-blue-900">
            {t("segments.reach.totalProjectedSpend") || "Total Projected Monthly Spend"}
          </p>
          <p className="text-[10px] text-blue-700/70 mt-0.5">
            {t("segments.reach.basedOnHistorical") ||
              "Based on historical match rates and platform benchmarks"}
          </p>
        </div>
        <span className="text-base font-bold text-blue-900 tabular-nums">
          {fCurrency(totalSpend)}
        </span>
      </div>
    </div>
  );
}
