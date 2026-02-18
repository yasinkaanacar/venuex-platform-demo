import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useLocales, fNumber, fCurrency, fPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { SegmentOverlapResult } from "@/lib/types/segments";
import ExcludeSegmentDialog from "./ExcludeSegmentDialog";
import MergeSegmentsDialog from "./MergeSegmentsDialog";

const recConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  exclude: { label: "Exclude", color: "text-red-700", bg: "bg-red-100" },
  merge: { label: "Merge", color: "text-blue-700", bg: "bg-blue-100" },
  ok: { label: "OK", color: "text-green-700", bg: "bg-green-100" },
};

export default function SegmentOverlapTable() {
  const { t } = useLocales();
  const [excludeOverlap, setExcludeOverlap] =
    useState<SegmentOverlapResult | null>(null);
  const [mergeOverlap, setMergeOverlap] =
    useState<SegmentOverlapResult | null>(null);

  const { data: overlaps = [] } = useQuery<SegmentOverlapResult[]>({
    queryKey: ["/api/segments/overlap"],
  });

  function handleAction(overlap: SegmentOverlapResult) {
    if (overlap.recommendation === "exclude") {
      setExcludeOverlap(overlap);
    } else if (overlap.recommendation === "merge") {
      setMergeOverlap(overlap);
    }
  }

  if (overlaps.length === 0) return null;

  // Sort by wasted spend descending
  const sorted = [...overlaps].sort(
    (a, b) => b.wastedSpendEstimate - a.wastedSpendEstimate,
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-gray-900">
          {t("segments.insights.topOverlaps") || "Top Overlapping Pairs"}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {t("segments.insights.topOverlapsDesc") ||
            "Ranked by estimated wasted spend"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.insights.pairColumn") || "Segment Pair"}
              </th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.insights.overlapColumn") || "Overlap"}
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.insights.wastedColumn") || "Wasted Spend"}
              </th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.insights.recColumn") || "Action"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((overlap, i) => {
              const rec =
                recConfig[overlap.recommendation] ?? recConfig.ok;
              return (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {overlap.segmentA.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="text-sm font-medium text-gray-900">
                        {overlap.segmentB.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {fNumber(overlap.overlapCount)}
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {fPercent(overlap.overlapPercent)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-red-600 tabular-nums">
                      {fCurrency(overlap.wastedSpendEstimate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {overlap.recommendation === "exclude" ||
                    overlap.recommendation === "merge" ? (
                      <button
                        type="button"
                        onClick={() => handleAction(overlap)}
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity",
                          rec.bg,
                          rec.color,
                        )}
                      >
                        {t(`segments.insights.rec${overlap.recommendation.charAt(0).toUpperCase()}${overlap.recommendation.slice(1)}`) || rec.label}
                      </button>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                          rec.bg,
                          rec.color,
                        )}
                      >
                        {t("segments.insights.recOk") || "OK"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      {excludeOverlap && (
        <ExcludeSegmentDialog
          open={!!excludeOverlap}
          onOpenChange={(open) => !open && setExcludeOverlap(null)}
          overlap={excludeOverlap}
        />
      )}
      {mergeOverlap && (
        <MergeSegmentsDialog
          open={!!mergeOverlap}
          onOpenChange={(open) => !open && setMergeOverlap(null)}
          overlap={mergeOverlap}
        />
      )}
    </div>
  );
}
