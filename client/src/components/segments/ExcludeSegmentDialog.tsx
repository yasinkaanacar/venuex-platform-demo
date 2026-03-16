import { useState } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import { X, Loader2, ShieldAlert, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocales, fNumber, fCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { segmentDataService } from "@/lib/mock/segments";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import SegmentOverlapVenn from "./SegmentOverlapVenn";
import type { SegmentOverlapResult, AdPlatform } from "@/lib/types/segments";

interface ExcludeSegmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overlap: SegmentOverlapResult;
}

const PLATFORM_OPTIONS: { key: AdPlatform; label: string; color: string }[] = [
  { key: "google", label: "Google Ads", color: "text-blue-600" },
  { key: "meta", label: "Meta Ads", color: "text-indigo-600" },
  { key: "tiktok", label: "TikTok Ads", color: "text-gray-800" },
];

export default function ExcludeSegmentDialog({
  open,
  onOpenChange,
  overlap,
}: ExcludeSegmentDialogProps) {
  const { t } = useLocales();
  const queryClient = useQueryClient();

  // Default source = larger segment
  const defaultSource =
    overlap.segmentA.size >= overlap.segmentB.size ? "a" : "b";
  const [source, setSource] = useState<"a" | "b">(defaultSource);
  const [selectedPlatforms, setSelectedPlatforms] = useState<AdPlatform[]>([
    "google",
    "meta",
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const sourceSegment = source === "a" ? overlap.segmentA : overlap.segmentB;
  const excludedSegment = source === "a" ? overlap.segmentB : overlap.segmentA;

  function togglePlatform(platform: AdPlatform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  }

  async function handleApply() {
    if (selectedPlatforms.length === 0) return;
    setIsSaving(true);
    try {
      await segmentDataService.createExclusionRule({
        sourceSegmentId: sourceSegment.id,
        sourceSegmentName: sourceSegment.name,
        excludedSegmentId: excludedSegment.id,
        excludedSegmentName: excludedSegment.name,
        platforms: selectedPlatforms,
        overlapCount: overlap.overlapCount,
        estimatedSavings: overlap.wastedSpendEstimate,
      });

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS] });
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SEGMENTS_OVERLAP],
      });

      showToast({
        type: "success",
        title:
          t("segments.insights.excludeDialog.excludeApplied") ||
          "Exclusion rule applied",
        description:
          t("segments.insights.excludeDialog.excludeAppliedDesc") ||
          `${excludedSegment.name} members will be excluded from ${sourceSegment.name} campaigns`,
      });
      onOpenChange(false);
    } catch {
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to create exclusion rule",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MuiDialog
      open={open}
      onClose={() => !isSaving && onOpenChange(false)}
      maxWidth={false}
      PaperProps={{
        sx: { width: 520, maxWidth: "95vw", borderRadius: "12px" },
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
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <span className="text-base font-semibold">
            {t("segments.insights.excludeDialog.title") ||
              "Create Exclusion Rule"}
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
          {t("segments.insights.excludeDialog.description") ||
            "Exclude overlapping users from one segment's campaigns to reduce wasted ad spend."}
        </p>

        {/* Compact Venn */}
        <div className="mb-5 scale-90 origin-center">
          <SegmentOverlapVenn
            segmentA={overlap.segmentA}
            segmentB={overlap.segmentB}
            overlapCount={overlap.overlapCount}
            onlyA={overlap.onlyA}
            onlyB={overlap.onlyB}
          />
        </div>

        {/* Source Picker */}
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-2">
            {t("segments.insights.excludeDialog.selectSource") ||
              "Exclude from which segment's campaigns?"}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["a", "b"] as const).map((side) => {
              const seg =
                side === "a" ? overlap.segmentA : overlap.segmentB;
              const isSelected = source === side;
              return (
                <button
                  key={side}
                  type="button"
                  onClick={() => setSource(side)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all",
                    isSelected
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-white hover:border-gray-300",
                  )}
                >
                  <p className="text-sm font-semibold text-foreground truncate">
                    {seg.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {fNumber(seg.size)} users
                  </p>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {t("segments.insights.excludeDialog.sourceHint") ||
              "Members of the other segment will be excluded from this segment's ad campaigns."}
          </p>
        </div>

        {/* Platform Checkboxes */}
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-2">
            {t("segments.insights.excludeDialog.platformSection") ||
              "Apply to platforms"}
          </label>
          <div className="space-y-1.5">
            {PLATFORM_OPTIONS.map((p) => (
              <label
                key={p.key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <MuiCheckbox
                  size="small"
                  checked={selectedPlatforms.includes(p.key)}
                  onChange={() => togglePlatform(p.key)}
                  sx={{ p: 0.5 }}
                />
                <span className={cn("text-sm font-medium", p.color)}>
                  {p.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-800 leading-relaxed">
            {t("segments.insights.excludeDialog.infoEstimate") ||
              "This will exclude"}{" "}
            <span className="font-semibold">
              {fNumber(overlap.overlapCount)}
            </span>{" "}
            users.{" "}
            {t("segments.insights.excludeDialog.estSavings") ||
              "Estimated savings"}
            :{" "}
            <span className="font-semibold">
              {fCurrency(overlap.wastedSpendEstimate)}
            </span>
          </div>
        </div>
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
          onClick={handleApply}
          disabled={isSaving || selectedPlatforms.length === 0}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isSaving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
          {isSaving
            ? t("segments.insights.excludeDialog.applying") || "Applying..."
            : t("segments.insights.excludeDialog.applyButton") ||
              "Apply Exclusion"}
        </Button>
      </MuiDialogActions>
    </MuiDialog>
  );
}
