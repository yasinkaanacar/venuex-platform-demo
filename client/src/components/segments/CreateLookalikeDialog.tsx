import { useState } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  Slider,
} from "@mui/material";
import { X, Loader2 } from "lucide-react";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { Button } from "@/components/ui/button";
import { useLocales } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { segmentDataService } from "@/lib/mock/segments";
import { showToast } from "@/lib/toast";
import type { Segment, AdPlatform } from "@/lib/types/segments";

interface CreateLookalikeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const platforms: { key: AdPlatform; name: string; icon: React.ElementType; iconColor: string }[] = [
  { key: "google", name: "Google", icon: SiGoogle, iconColor: "text-blue-500" },
  { key: "meta", name: "Meta", icon: SiMeta, iconColor: "text-blue-600" },
  { key: "tiktok", name: "TikTok", icon: SiTiktok, iconColor: "text-gray-900" },
];

export default function CreateLookalikeDialog({
  open,
  onOpenChange,
}: CreateLookalikeDialogProps) {
  const { t } = useLocales();
  const queryClient = useQueryClient();

  const { data: segments = [] } = useQuery<Segment[]>({
    queryKey: [QUERY_KEYS.SEGMENTS],
  });

  const activeSegments = segments.filter(
    (s) => s.status === "active" || s.status === "building",
  );

  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform | "">("");
  const [expansion, setExpansion] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  function handleClose() {
    if (isSaving) return;
    onOpenChange(false);
    setTimeout(() => {
      setSelectedSegment("");
      setSelectedPlatform("");
      setExpansion(3);
    }, 200);
  }

  async function handleCreate() {
    if (!selectedSegment || !selectedPlatform || isSaving) return;
    const seg = segments.find((s) => s.id === selectedSegment);
    if (!seg) return;

    setIsSaving(true);
    try {
      await segmentDataService.createLookalikeAudience({
        sourceSegmentId: selectedSegment,
        sourceSegmentName: seg.name,
        platform: selectedPlatform as AdPlatform,
        expansionPercent: expansion,
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SEGMENTS_LOOKALIKES],
      });

      showToast({
        type: "success",
        title:
          t("segments.lookalike.lookalikeCreated") ||
          "Lookalike audience created",
      });
      handleClose();
    } catch {
      showToast({ type: "error", title: t("common.error") || "Error" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: { borderRadius: 2, width: "100%", maxWidth: 440 },
      }}
    >
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
        <span>
          {t("segments.lookalike.dialogTitle") || "Create Lookalike Audience"}
        </span>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: "text.secondary" }}
          disabled={isSaving}
        >
          <X size={16} />
        </IconButton>
      </MuiDialogTitle>

      <MuiDialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        {/* Source Segment */}
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-1.5">
            {t("segments.lookalike.sourceSegment") || "Source Segment"}
          </label>
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {t("segments.insights.selectPlaceholder") || "Select a segment..."}
            </option>
            {activeSegments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Platform */}
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-1.5">
            {t("segments.lookalike.platform") || "Platform"}
          </label>
          <div className="flex gap-2">
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setSelectedPlatform(p.key)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 transition-all",
                    selectedPlatform === p.key
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <Icon className={cn("w-4 h-4", p.iconColor)} />
                  <span className="text-sm font-medium">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Expansion Slider */}
        <div className="mb-2">
          <label className="text-xs font-medium text-foreground block mb-1">
            {t("segments.lookalike.expansionSlider") || "Expansion Percentage"}:{" "}
            <span className="tabular-nums text-blue-600">{expansion}%</span>
          </label>
          <Slider
            value={expansion}
            onChange={(_, val) => setExpansion(val as number)}
            min={1}
            max={10}
            step={1}
            marks
            size="small"
            sx={{ color: "#3b82f6" }}
          />
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {t("segments.lookalike.expansionHelp") ||
              "Higher % = larger audience but less similar"}
          </p>
        </div>
      </MuiDialogContent>

      <MuiDialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClose}
          disabled={isSaving}
        >
          {t("common.cancel") || "Cancel"}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleCreate}
          disabled={!selectedSegment || !selectedPlatform || isSaving}
          startIcon={
            isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : undefined
          }
        >
          {isSaving
            ? t("common.creating") || "Creating..."
            : t("common.create") || "Create"}
        </Button>
      </MuiDialogActions>
    </MuiDialog>
  );
}
