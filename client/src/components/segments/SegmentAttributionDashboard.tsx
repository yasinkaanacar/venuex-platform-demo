import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { useLocales } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import SegmentAttributionKPIs from "./SegmentAttributionKPIs";
import SegmentAttributionChart from "./SegmentAttributionChart";
import SegmentAttributionTable from "./SegmentAttributionTable";
import SegmentAttributionBreakdown from "./SegmentAttributionBreakdown";
import SegmentAttributionTimeseries from "./SegmentAttributionTimeseries";
import type { SegmentAttribution } from "@/lib/types/segments";

type Period = "7d" | "30d" | "90d";

export default function SegmentAttributionDashboard() {
  const { t } = useLocales();
  const [period, setPeriod] = useState<Period>("30d");
  const [expandedSegmentId, setExpandedSegmentId] = useState<string | null>(
    null,
  );

  const { data: attributions = [], isLoading } = useQuery<
    SegmentAttribution[]
  >({
    queryKey: ["/api/segments/attribution"],
  });

  const expandedAttr = expandedSegmentId
    ? attributions.find((a) => a.segmentId === expandedSegmentId)
    : null;

  function handleToggleExpand(segmentId: string) {
    setExpandedSegmentId((prev) =>
      prev === segmentId ? null : segmentId,
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (attributions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BarChart3 className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-sm text-muted-foreground">
          {t("segments.attribution.noData") ||
            "No attribution data available"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-6">
      {/* Header + Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("segments.attribution.title") || "ROI Attribution"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("segments.attribution.description") ||
              "Measure the real return on ad spend across segments and platforms"}
          </p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                period === p
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`segments.attribution.period${p}`) || p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <SegmentAttributionKPIs attributions={attributions} />

      {/* Chart */}
      <SegmentAttributionChart
        attributions={attributions}
        expandedSegmentId={expandedSegmentId}
        onSegmentClick={handleToggleExpand}
      />

      {/* Table */}
      <SegmentAttributionTable
        attributions={attributions}
        expandedSegmentId={expandedSegmentId}
        onToggleExpand={handleToggleExpand}
      />

      {/* Expanded Detail: Timeseries + Platform Breakdown */}
      {expandedAttr && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SegmentAttributionTimeseries
            segmentId={expandedAttr.segmentId}
            segmentName={expandedAttr.segmentName}
          />
          <SegmentAttributionBreakdown
            platforms={expandedAttr.platforms}
          />
        </div>
      )}
    </div>
  );
}
