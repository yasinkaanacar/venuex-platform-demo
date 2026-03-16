import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, DollarSign, Users, GitMerge } from "lucide-react";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { useLocales, fNumber, fCurrency, fPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { DataLoadingState, DataErrorState } from "@/components/shared/data-states";
import SegmentOverlapVenn from "./SegmentOverlapVenn";
import SegmentOverlapTable from "./SegmentOverlapTable";
import ExcludeSegmentDialog from "./ExcludeSegmentDialog";
import MergeSegmentsDialog from "./MergeSegmentsDialog";
import type { Segment, SegmentOverlapResult } from "@/lib/types/segments";

const recBadge: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  exclude: { label: "Exclude", color: "text-red-700", bg: "bg-red-100", icon: AlertTriangle },
  merge: { label: "Merge", color: "text-blue-700", bg: "bg-blue-100", icon: GitMerge },
  ok: { label: "OK", color: "text-green-700", bg: "bg-green-100", icon: Users },
};

export default function SegmentInsightsDashboard() {
  const { t } = useLocales();

  const { data: segments = [], isLoading: segmentsLoading, isError: segmentsError, refetch: refetchSegments } = useQuery<Segment[]>({
    queryKey: [QUERY_KEYS.SEGMENTS],
  });

  const { data: allOverlaps = [], isLoading: overlapsLoading } = useQuery<SegmentOverlapResult[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_OVERLAP],
  });

  const activeSegments = useMemo(
    () => segments.filter((s) => s.status === "active" || s.status === "building"),
    [segments],
  );

  const [segmentAId, setSegmentAId] = useState("");
  const [segmentBId, setSegmentBId] = useState("");
  const [excludeOverlap, setExcludeOverlap] =
    useState<SegmentOverlapResult | null>(null);
  const [mergeOverlap, setMergeOverlap] =
    useState<SegmentOverlapResult | null>(null);

  // Find the pre-computed overlap for the selected pair
  const selectedOverlap = useMemo(() => {
    if (!segmentAId || !segmentBId) return null;
    return (
      allOverlaps.find(
        (o) =>
          (o.segmentA.id === segmentAId && o.segmentB.id === segmentBId) ||
          (o.segmentA.id === segmentBId && o.segmentB.id === segmentAId),
      ) ?? null
    );
  }, [segmentAId, segmentBId, allOverlaps]);

  if (segmentsLoading || overlapsLoading) {
    return <div className="space-y-6 px-6 py-6"><DataLoadingState text="Loading insights..." /></div>;
  }
  if (segmentsError) {
    return <div className="space-y-6 px-6 py-6"><DataErrorState onRetry={refetchSegments} /></div>;
  }

  return (
    <div className="space-y-6 px-6 py-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {t("segments.insights.title") || "Audience Overlap Analysis"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("segments.insights.description") ||
            "Identify overlapping audiences across segments to reduce wasted ad spend"}
        </p>
      </div>

      {/* Segment pair selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              {t("segments.insights.selectSegmentA") || "Segment A"}
            </label>
            <select
              value={segmentAId}
              onChange={(e) => setSegmentAId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {t("segments.insights.selectPlaceholder") || "Select a segment..."}
              </option>
              {activeSegments
                .filter((s) => s.id !== segmentBId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({fNumber(s.actualSize ?? s.estimatedSize)})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              {t("segments.insights.selectSegmentB") || "Segment B"}
            </label>
            <select
              value={segmentBId}
              onChange={(e) => setSegmentBId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {t("segments.insights.selectPlaceholder") || "Select a segment..."}
              </option>
              {activeSegments
                .filter((s) => s.id !== segmentAId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({fNumber(s.actualSize ?? s.estimatedSize)})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {selectedOverlap ? (
          <div>
            {/* Venn Diagram */}
            <SegmentOverlapVenn
              segmentA={selectedOverlap.segmentA}
              segmentB={selectedOverlap.segmentB}
              overlapCount={selectedOverlap.overlapCount}
              onlyA={selectedOverlap.onlyA}
              onlyB={selectedOverlap.onlyB}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4 mt-5">
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-700 font-medium">
                    {t("segments.insights.overlapCount") || "Overlap Count"}
                  </span>
                </div>
                <p className="text-lg font-bold text-purple-900 tabular-nums">
                  {fNumber(selectedOverlap.overlapCount)}
                </p>
                <p className="text-[10px] text-purple-600 tabular-nums">
                  {fPercent(selectedOverlap.overlapPercent)} of union
                </p>
              </div>

              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700 font-medium">
                    {t("segments.insights.wastedSpend") || "Wasted Spend Est."}
                  </span>
                </div>
                <p className="text-lg font-bold text-red-900 tabular-nums">
                  {fCurrency(selectedOverlap.wastedSpendEstimate)}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  {(() => {
                    const rec = recBadge[selectedOverlap.recommendation] ?? recBadge.ok;
                    const Icon = rec.icon;
                    return <Icon className="w-4 h-4 text-gray-600" />;
                  })()}
                  <span className="text-xs text-gray-700 font-medium">
                    {t("segments.insights.recommendation") || "Recommendation"}
                  </span>
                </div>
                {(() => {
                  const rec = recBadge[selectedOverlap.recommendation] ?? recBadge.ok;
                  return (
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold mt-1",
                        rec.bg,
                        rec.color,
                      )}
                    >
                      {t(
                        `segments.insights.rec${selectedOverlap.recommendation.charAt(0).toUpperCase()}${selectedOverlap.recommendation.slice(1)}`,
                      ) || rec.label}
                    </span>
                  );
                })()}
                {selectedOverlap.recommendation === "exclude" && (
                  <button
                    type="button"
                    onClick={() => setExcludeOverlap(selectedOverlap)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium mt-2 underline underline-offset-2 cursor-pointer"
                  >
                    {t("segments.insights.applyExclusion") || "Apply exclusion..."}
                  </button>
                )}
                {selectedOverlap.recommendation === "merge" && (
                  <button
                    type="button"
                    onClick={() => setMergeOverlap(selectedOverlap)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 underline underline-offset-2 cursor-pointer"
                  >
                    {t("segments.insights.mergeNow") || "Merge segments..."}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {segmentAId && segmentBId
                ? "No pre-computed overlap data for this pair"
                : t("segments.insights.noOverlapData") ||
                  "Select two segments to see overlap analysis"}
            </p>
          </div>
        )}
      </div>

      {/* Top Overlapping Pairs Table */}
      <SegmentOverlapTable />

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
