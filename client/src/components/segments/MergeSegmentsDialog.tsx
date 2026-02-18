import { useState, useMemo } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import { X, Loader2, GitMerge, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocales, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { segmentDataService } from "@/lib/mock-segments-data";
import { useQueryClient } from "@tanstack/react-query";
import SegmentOverlapVenn from "./SegmentOverlapVenn";
import type { SegmentOverlapResult, MergeStrategy } from "@/lib/types/segments";

interface MergeSegmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overlap: SegmentOverlapResult;
}

export default function MergeSegmentsDialog({
  open,
  onOpenChange,
  overlap,
}: MergeSegmentsDialogProps) {
  const { t } = useLocales();
  const queryClient = useQueryClient();

  const [strategy, setStrategy] = useState<MergeStrategy>("union");
  const [segmentName, setSegmentName] = useState(
    `${overlap.segmentA.name} + ${overlap.segmentB.name}`,
  );
  const [pauseOriginals, setPauseOriginals] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const estimatedSize = useMemo(
    () =>
      strategy === "union"
        ? overlap.segmentA.size +
          overlap.segmentB.size -
          overlap.overlapCount
        : overlap.overlapCount,
    [strategy, overlap],
  );

  async function handleMerge() {
    if (!segmentName.trim()) return;
    setIsSaving(true);
    try {
      await segmentDataService.mergeSegments({
        segmentAId: overlap.segmentA.id,
        segmentAName: overlap.segmentA.name,
        segmentBId: overlap.segmentB.id,
        segmentBName: overlap.segmentB.name,
        strategy,
        newSegmentName: segmentName.trim(),
        pauseOriginals,
        overlapCount: overlap.overlapCount,
        sizeA: overlap.segmentA.size,
        sizeB: overlap.segmentB.size,
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/segments"] });
      await queryClient.invalidateQueries({
        queryKey: ["/api/segments/overlap"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["/api/segments/summary"],
      });

      showToast({
        type: "success",
        title:
          t("segments.insights.mergeDialog.mergeSuccess") ||
          "Segments merged successfully",
        description:
          t("segments.insights.mergeDialog.mergeSuccessDesc") ||
          `New segment "${segmentName}" created with ${fNumber(estimatedSize)} users`,
      });
      onOpenChange(false);
    } catch {
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to merge segments",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const strategyOptions: {
    key: MergeStrategy;
    labelKey: string;
    descKey: string;
    fallbackLabel: string;
    fallbackDesc: string;
    size: number;
    symbol: string;
  }[] = [
    {
      key: "union",
      labelKey: "segments.insights.mergeDialog.strategyUnion",
      descKey: "segments.insights.mergeDialog.strategyUnionDesc",
      fallbackLabel: "Union (A ∪ B)",
      fallbackDesc:
        "Combine all users from both segments, removing duplicates",
      size:
        overlap.segmentA.size +
        overlap.segmentB.size -
        overlap.overlapCount,
      symbol: "∪",
    },
    {
      key: "intersection",
      labelKey: "segments.insights.mergeDialog.strategyIntersection",
      descKey: "segments.insights.mergeDialog.strategyIntersectionDesc",
      fallbackLabel: "Intersection (A ∩ B)",
      fallbackDesc: "Only users who exist in both segments",
      size: overlap.overlapCount,
      symbol: "∩",
    },
  ];

  return (
    <MuiDialog
      open={open}
      onClose={() => !isSaving && onOpenChange(false)}
      maxWidth={false}
      PaperProps={{
        sx: { width: 560, maxWidth: "95vw", borderRadius: "12px" },
      }}
    >
      <MuiDialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 0,
        }}
      >
        <div className="flex items-center gap-2">
          <GitMerge className="w-5 h-5 text-blue-600" />
          <span className="text-base font-semibold">
            {t("segments.insights.mergeDialog.title") || "Merge Segments"}
          </span>
        </div>
        <IconButton
          size="small"
          onClick={() => onOpenChange(false)}
          disabled={isSaving}
        >
          <X className="w-4 h-4" />
        </IconButton>
      </MuiDialogTitle>

      <MuiDialogContent sx={{ pt: 2 }}>
        <p className="text-sm text-muted-foreground mb-4">
          {t("segments.insights.mergeDialog.description") ||
            "Combine two overlapping segments into a single, optimized audience."}
        </p>

        {/* Segment Comparison */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[overlap.segmentA, overlap.segmentB].map((seg) => (
            <div
              key={seg.id}
              className="p-3 rounded-lg border border-gray-200 bg-gray-50"
            >
              <p className="text-sm font-semibold text-foreground truncate">
                {seg.name}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-muted-foreground">
                  <Users className="w-3 h-3 inline mr-0.5" />
                  {t("segments.insights.mergeDialog.size") || "Size"}:{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {fNumber(seg.size)}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Venn */}
        <div className="mb-5 scale-[0.85] origin-center">
          <SegmentOverlapVenn
            segmentA={overlap.segmentA}
            segmentB={overlap.segmentB}
            overlapCount={overlap.overlapCount}
            onlyA={overlap.onlyA}
            onlyB={overlap.onlyB}
          />
        </div>

        {/* Strategy Selection */}
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-2">
            {t("segments.insights.mergeDialog.strategySection") ||
              "Merge Strategy"}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {strategyOptions.map((opt) => {
              const isSelected = strategy === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setStrategy(opt.key)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all",
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-foreground">
                      {opt.symbol}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {t(opt.labelKey) || opt.fallbackLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {t(opt.descKey) || opt.fallbackDesc}
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-2 tabular-nums">
                    ≈ {fNumber(opt.size)} users
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* New Segment Name */}
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-1.5">
            {t("segments.insights.mergeDialog.newSegmentName") ||
              "New Segment Name"}
          </label>
          <Input
            value={segmentName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSegmentName(e.target.value)
            }
            placeholder="Enter segment name..."
          />
        </div>

        {/* Estimated Size */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 mb-4">
          <span className="text-sm text-blue-700 font-medium">
            {t("segments.insights.mergeDialog.estimatedSize") ||
              "Estimated Size"}
          </span>
          <span className="text-lg font-bold text-blue-900 tabular-nums">
            {fNumber(estimatedSize)}
          </span>
        </div>

        {/* Pause Originals */}
        <label className="flex items-start gap-2 cursor-pointer">
          <MuiCheckbox
            size="small"
            checked={pauseOriginals}
            onChange={() => setPauseOriginals((v) => !v)}
            sx={{ p: 0.5, mt: 0.25 }}
          />
          <div>
            <span className="text-sm font-medium text-foreground">
              {t("segments.insights.mergeDialog.pauseOriginals") ||
                "Pause original segments after merge"}
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("segments.insights.mergeDialog.pauseOriginalsHint") ||
                "Recommended to prevent continued duplicate ad spend"}
            </p>
          </div>
        </label>
      </MuiDialogContent>

      <MuiDialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSaving}
        >
          {t("common.cancel") || "Cancel"}
        </Button>
        <Button
          onClick={handleMerge}
          disabled={isSaving || !segmentName.trim()}
        >
          {isSaving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
          {isSaving
            ? t("segments.insights.mergeDialog.merging") || "Merging..."
            : t("segments.insights.mergeDialog.mergeButton") ||
              "Merge Segments"}
        </Button>
      </MuiDialogActions>
    </MuiDialog>
  );
}
