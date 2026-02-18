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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocales } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { segmentDataService } from "@/lib/mock-segments-data";
import { showToast } from "@/lib/toast";
import type { Segment, AdPlatform } from "@/lib/types/segments";

interface CreateABTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const platforms: { key: AdPlatform; name: string; icon: React.ElementType; iconColor: string }[] = [
  { key: "google", name: "Google", icon: SiGoogle, iconColor: "text-blue-500" },
  { key: "meta", name: "Meta", icon: SiMeta, iconColor: "text-blue-600" },
  { key: "tiktok", name: "TikTok", icon: SiTiktok, iconColor: "text-gray-900" },
];

export default function CreateABTestDialog({
  open,
  onOpenChange,
}: CreateABTestDialogProps) {
  const { t } = useLocales();
  const queryClient = useQueryClient();

  const { data: segments = [] } = useQuery<Segment[]>({
    queryKey: ["/api/segments"],
  });

  const activeSegments = segments.filter(
    (s) => s.status === "active" || s.status === "building",
  );

  const [testName, setTestName] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform | "">("");
  const [splitPct, setSplitPct] = useState(50);
  const [groupAName, setGroupAName] = useState("Control");
  const [groupBName, setGroupBName] = useState("Test Variant");
  const [isSaving, setIsSaving] = useState(false);

  function handleClose() {
    if (isSaving) return;
    onOpenChange(false);
    setTimeout(() => {
      setTestName("");
      setSelectedSegment("");
      setSelectedPlatform("");
      setSplitPct(50);
      setGroupAName("Control");
      setGroupBName("Test Variant");
    }, 200);
  }

  async function handleCreate() {
    if (!selectedSegment || !selectedPlatform || !testName || isSaving) return;
    const seg = segments.find((s) => s.id === selectedSegment);
    if (!seg) return;

    setIsSaving(true);
    try {
      const segSize = seg.actualSize ?? seg.estimatedSize;
      const groupASize = Math.round(segSize * (splitPct / 100));
      const groupBSize = segSize - groupASize;
      await segmentDataService.createABTest({
        name: testName,
        sourceSegmentId: selectedSegment,
        sourceSegmentName: seg.name,
        platform: selectedPlatform as AdPlatform,
        splitPercentage: splitPct,
        groupA: { name: groupAName, size: groupASize },
        groupB: { name: groupBName, size: groupBSize },
      });

      queryClient.invalidateQueries({
        queryKey: ["/api/segments/ab-tests"],
      });

      showToast({
        type: "success",
        title: t("segments.abtest.testCreated") || "A/B test created",
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
          {t("segments.abtest.dialogTitle") || "Create A/B Test"}
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
        {/* Test Name */}
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-1.5">
            {t("segments.abtest.testName") || "Test Name"}
          </label>
          <Input
            value={testName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestName(e.target.value)}
            placeholder={
              t("segments.abtest.testNamePlaceholder") ||
              "e.g. Holiday Campaign Test"
            }
            size="small"
          />
        </div>

        {/* Source Segment */}
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-1.5">
            {t("segments.abtest.sourceSegment") || "Source Segment"}
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
            {t("segments.abtest.platform") || "Platform"}
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

        {/* Split Slider */}
        <div className="mb-4">
          <label className="text-xs font-medium text-foreground block mb-1">
            {t("segments.abtest.splitSlider") || "Split Percentage"}:{" "}
            <span className="tabular-nums text-blue-600">
              {splitPct}/{100 - splitPct}
            </span>
          </label>
          <Slider
            value={splitPct}
            onChange={(_, val) => setSplitPct(val as number)}
            min={10}
            max={90}
            step={5}
            size="small"
            sx={{ color: "#3b82f6" }}
          />
          {/* Preview bar */}
          <div className="flex h-4 rounded-lg overflow-hidden mt-1">
            <div
              className="bg-blue-500"
              style={{ width: `${splitPct}%` }}
            />
            <div
              className="bg-orange-400"
              style={{ width: `${100 - splitPct}%` }}
            />
          </div>
        </div>

        {/* Group Names */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              {t("segments.abtest.groupAName") || "Group A Name"}
            </label>
            <Input
              value={groupAName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupAName(e.target.value)}
              size="small"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              {t("segments.abtest.groupBName") || "Group B Name"}
            </label>
            <Input
              value={groupBName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupBName(e.target.value)}
              size="small"
            />
          </div>
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
          disabled={!selectedSegment || !selectedPlatform || !testName || isSaving}
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
