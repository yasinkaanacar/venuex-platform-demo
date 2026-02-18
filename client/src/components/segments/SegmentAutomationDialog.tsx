import { useState } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  Slider,
} from "@mui/material";
import {
  X,
  Clock,
  Users,
  BarChart3,
  RefreshCw,
  Pause,
  Bell,
  Send,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useLocales } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { segmentDataService } from "@/lib/mock-segments-data";
import { showToast } from "@/lib/toast";
import type {
  AutomationTrigger,
  AutomationAction,
  ExportFrequency,
} from "@/lib/types/segments";

interface SegmentAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segmentId: string;
}

const triggers: {
  key: AutomationTrigger;
  icon: React.ElementType;
  iconColor: string;
}[] = [
  { key: "schedule", icon: Clock, iconColor: "text-blue-500" },
  { key: "size_threshold", icon: Users, iconColor: "text-orange-500" },
  { key: "match_rate_drop", icon: BarChart3, iconColor: "text-red-500" },
];

const actions: {
  key: AutomationAction;
  icon: React.ElementType;
  iconColor: string;
}[] = [
  { key: "rebuild", icon: RefreshCw, iconColor: "text-blue-500" },
  { key: "pause", icon: Pause, iconColor: "text-yellow-600" },
  { key: "notify", icon: Bell, iconColor: "text-purple-500" },
  { key: "push_refresh", icon: Send, iconColor: "text-green-600" },
];

const frequencies: ExportFrequency[] = ["daily", "weekly", "monthly"];

export default function SegmentAutomationDialog({
  open,
  onOpenChange,
  segmentId,
}: SegmentAutomationDialogProps) {
  const { t } = useLocales();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTrigger, setSelectedTrigger] =
    useState<AutomationTrigger | null>(null);
  const [selectedAction, setSelectedAction] =
    useState<AutomationAction | null>(null);
  const [frequency, setFrequency] = useState<ExportFrequency>("weekly");
  const [sizeOperator, setSizeOperator] = useState<"below" | "above">("below");
  const [sizeValue, setSizeValue] = useState(30000);
  const [matchRateThreshold, setMatchRateThreshold] = useState(70);
  const [isSaving, setIsSaving] = useState(false);

  function triggerLabel(key: AutomationTrigger): string {
    const map: Record<AutomationTrigger, string> = {
      schedule: t("segments.automation.triggerSchedule") || "Scheduled",
      size_threshold:
        t("segments.automation.triggerSizeThreshold") || "Size Threshold",
      match_rate_drop:
        t("segments.automation.triggerMatchRateDrop") || "Match Rate Drop",
    };
    return map[key];
  }

  function actionLabel(key: AutomationAction): string {
    const map: Record<AutomationAction, string> = {
      rebuild: t("segments.automation.actionRebuild") || "Rebuild Segment",
      pause: t("segments.automation.actionPause") || "Pause Segment",
      notify: t("segments.automation.actionNotify") || "Send Notification",
      push_refresh:
        t("segments.automation.actionPushRefresh") || "Refresh Platform Push",
    };
    return map[key];
  }

  function handleClose() {
    if (isSaving) return;
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setSelectedTrigger(null);
      setSelectedAction(null);
    }, 200);
  }

  async function handleSave() {
    if (!selectedTrigger || !selectedAction || isSaving) return;

    setIsSaving(true);
    try {
      await segmentDataService.createAutomationRule(segmentId, {
        trigger: selectedTrigger,
        action: selectedAction,
        frequency: selectedTrigger === "schedule" ? frequency : undefined,
        sizeOperator:
          selectedTrigger === "size_threshold" ? sizeOperator : undefined,
        sizeValue:
          selectedTrigger === "size_threshold" ? sizeValue : undefined,
        matchRateThreshold:
          selectedTrigger === "match_rate_drop"
            ? matchRateThreshold
            : undefined,
      });

      queryClient.invalidateQueries({
        queryKey: [`/api/segments/automation/${segmentId}`],
      });

      showToast({
        type: "success",
        title:
          t("segments.automation.ruleCreated") || "Automation rule created",
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
          {t("segments.automation.dialogTitle") || "Create Automation Rule"}
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
        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              step >= 1
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500",
            )}
          >
            1. {t("segments.automation.stepTrigger") || "Trigger"}
          </span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              step >= 2
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500",
            )}
          >
            2. {t("segments.automation.stepAction") || "Action"}
          </span>
        </div>

        {step === 1 && (
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              {t("segments.automation.selectTrigger") ||
                "When should this rule trigger?"}
            </p>
            <div className="space-y-2">
              {triggers.map((trig) => {
                const Icon = trig.icon;
                const isSelected = selectedTrigger === trig.key;
                return (
                  <button
                    key={trig.key}
                    type="button"
                    onClick={() => setSelectedTrigger(trig.key)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-all",
                      isSelected
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                    )}
                  >
                    <Icon className={cn("w-5 h-5", trig.iconColor)} />
                    <span className="text-sm font-medium">
                      {triggerLabel(trig.key)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Trigger-specific config */}
            {selectedTrigger === "schedule" && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-foreground mb-2">
                  {t("segments.automation.frequency") || "Frequency"}
                </p>
                <div className="flex gap-2">
                  {frequencies.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                        frequency === f
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200 text-foreground hover:bg-gray-100",
                      )}
                    >
                      {t(`segments.exports.${f}`) ||
                        f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTrigger === "size_threshold" && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <p className="text-xs font-medium text-foreground mb-2">
                    {t("segments.automation.sizeOperator") || "Condition"}
                  </p>
                  <div className="flex gap-2">
                    {(["below", "above"] as const).map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => setSizeOperator(op)}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          sizeOperator === op
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-gray-200 text-foreground hover:bg-gray-100",
                        )}
                      >
                        {op === "below"
                          ? t("segments.automation.sizeBelow") || "Drops below"
                          : t("segments.automation.sizeAbove") || "Exceeds"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">
                    {t("segments.automation.sizeValue") || "Size Threshold"}:{" "}
                    <span className="tabular-nums">
                      {sizeValue.toLocaleString("tr-TR")}
                    </span>
                  </p>
                  <Slider
                    value={sizeValue}
                    onChange={(_, val) => setSizeValue(val as number)}
                    min={1000}
                    max={100000}
                    step={1000}
                    size="small"
                    sx={{ color: "#3b82f6" }}
                  />
                </div>
              </div>
            )}

            {selectedTrigger === "match_rate_drop" && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-foreground mb-1">
                  {t("segments.automation.matchRateThreshold") ||
                    "Match Rate Threshold"}
                  : <span className="tabular-nums">{matchRateThreshold}%</span>
                </p>
                <Slider
                  value={matchRateThreshold}
                  onChange={(_, val) => setMatchRateThreshold(val as number)}
                  min={30}
                  max={95}
                  step={5}
                  size="small"
                  sx={{ color: "#3b82f6" }}
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              {t("segments.automation.selectAction") || "What should happen?"}
            </p>
            <div className="space-y-2">
              {actions.map((act) => {
                const Icon = act.icon;
                const isSelected = selectedAction === act.key;
                return (
                  <button
                    key={act.key}
                    type="button"
                    onClick={() => setSelectedAction(act.key)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-all",
                      isSelected
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                    )}
                  >
                    <Icon className={cn("w-5 h-5", act.iconColor)} />
                    <span className="text-sm font-medium">
                      {actionLabel(act.key)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </MuiDialogContent>

      <MuiDialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {step === 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep(1)}
            disabled={isSaving}
          >
            {t("common.back") || "Back"}
          </Button>
        )}
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleClose}
          disabled={isSaving}
        >
          {t("common.cancel") || "Cancel"}
        </Button>
        {step === 1 ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => setStep(2)}
            disabled={!selectedTrigger}
          >
            {t("common.next") || "Next"}
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={!selectedAction || isSaving}
            startIcon={
              isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : undefined
            }
          >
            {isSaving
              ? t("common.saving") || "Saving..."
              : t("common.create") || "Create"}
          </Button>
        )}
      </MuiDialogActions>
    </MuiDialog>
  );
}
