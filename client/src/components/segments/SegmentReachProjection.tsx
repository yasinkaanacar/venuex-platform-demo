import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Target, DollarSign } from "lucide-react";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { useLocales, fCurrency, fNumber, fPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { ReachProjection, AdPlatform } from "@/lib/types/segments";

interface SegmentReachProjectionProps {
  segmentId: string;
  platform: AdPlatform;
}

const confidenceColors: Record<string, { text: string; bg: string }> = {
  high: { text: "text-green-700", bg: "bg-green-100" },
  medium: { text: "text-yellow-700", bg: "bg-yellow-100" },
  low: { text: "text-gray-600", bg: "bg-gray-100" },
};

export default function SegmentReachProjection({
  segmentId,
  platform,
}: SegmentReachProjectionProps) {
  const { t } = useLocales();

  const { data: projection, isLoading, isError } = useQuery<ReachProjection>({
    queryKey: [`${QUERY_KEYS.SEGMENTS_REACH_PROJECTION}/${segmentId}/${platform}`],
    enabled: !!segmentId && !!platform,
  });

  if (isLoading) {
    return (
      <div className="mt-1.5 px-3 py-2 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded mt-1.5" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-1.5 px-3 py-2 bg-red-50 rounded-lg">
        <p className="text-xs text-red-500">Failed to load projection</p>
      </div>
    );
  }

  if (!projection) return null;

  const conf = confidenceColors[projection.confidenceLevel] ?? confidenceColors.medium;
  const confidenceLabel =
    t(`segments.reach.confidence${projection.confidenceLevel.charAt(0).toUpperCase() + projection.confidenceLevel.slice(1)}`) ||
    projection.confidenceLevel;

  return (
    <div className="mt-1.5 px-3 py-2 bg-gradient-to-r from-blue-50/60 to-transparent rounded-lg border border-blue-100/60">
      <div className="grid grid-cols-3 gap-3">
        {/* Estimated Reach */}
        <div className="flex items-center gap-1.5">
          <Target className="w-3 h-3 text-blue-500 shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {t("segments.reach.estimatedReach") || "Est. Reach"}
            </p>
            <p className="text-xs font-semibold text-foreground tabular-nums">
              {fNumber(projection.estimatedReach)}
            </p>
          </div>
        </div>

        {/* Monthly Spend */}
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3 h-3 text-blue-500 shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {t("segments.reach.estimatedSpend") || "Est. Monthly Spend"}
            </p>
            <p className="text-xs font-semibold text-foreground tabular-nums">
              {fCurrency(projection.estimatedMonthlySpend)}
            </p>
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3 text-blue-500 shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {t("segments.reach.confidence") || "Confidence"}
            </p>
            <span
              className={cn(
                "inline-flex px-1.5 py-0 rounded text-[10px] font-medium",
                conf.bg,
                conf.text,
              )}
            >
              {confidenceLabel}
            </span>
          </div>
        </div>
      </div>

      {/* CPM + Match Rate subtext */}
      <div className="flex items-center gap-3 mt-1.5">
        <span className="text-[10px] text-muted-foreground">
          {t("segments.reach.matchRate") || "Match Rate"}: {fPercent(projection.estimatedMatchRate)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {t("segments.reach.cpm") || "CPM"}: {fCurrency(projection.estimatedCPM)}
        </span>
      </div>
    </div>
  );
}
