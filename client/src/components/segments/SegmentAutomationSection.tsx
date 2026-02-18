import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Zap,
  Plus,
  Clock,
  BarChart3,
  Users,
  RefreshCw,
  Pause,
  Bell,
  Send,
} from "lucide-react";
import { Switch } from "@mui/material";
import { Button } from "@/components/ui/button";
import { useLocales } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { segmentDataService } from "@/lib/mock-segments-data";
import { showToast } from "@/lib/toast";
import SegmentAutomationDialog from "./SegmentAutomationDialog";
import type {
  SegmentAutomationRule,
  AutomationTrigger,
  AutomationAction,
} from "@/lib/types/segments";

interface SegmentAutomationSectionProps {
  segmentId: string;
}

const triggerIcons: Record<AutomationTrigger, React.ReactNode> = {
  schedule: <Clock className="w-4 h-4 text-blue-500" />,
  size_threshold: <Users className="w-4 h-4 text-orange-500" />,
  match_rate_drop: <BarChart3 className="w-4 h-4 text-red-500" />,
};

const actionIcons: Record<AutomationAction, React.ReactNode> = {
  rebuild: <RefreshCw className="w-3.5 h-3.5" />,
  pause: <Pause className="w-3.5 h-3.5" />,
  notify: <Bell className="w-3.5 h-3.5" />,
  push_refresh: <Send className="w-3.5 h-3.5" />,
};

export default function SegmentAutomationSection({
  segmentId,
}: SegmentAutomationSectionProps) {
  const { t } = useLocales();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: rules = [] } = useQuery<SegmentAutomationRule[]>({
    queryKey: [`/api/segments/automation/${segmentId}`],
    enabled: !!segmentId,
  });

  function triggerLabel(trigger: AutomationTrigger): string {
    const map: Record<AutomationTrigger, string> = {
      schedule: t("segments.automation.triggerSchedule") || "Scheduled",
      size_threshold:
        t("segments.automation.triggerSizeThreshold") || "Size Threshold",
      match_rate_drop:
        t("segments.automation.triggerMatchRateDrop") || "Match Rate Drop",
    };
    return map[trigger];
  }

  function actionLabel(action: AutomationAction): string {
    const map: Record<AutomationAction, string> = {
      rebuild: t("segments.automation.actionRebuild") || "Rebuild Segment",
      pause: t("segments.automation.actionPause") || "Pause Segment",
      notify: t("segments.automation.actionNotify") || "Send Notification",
      push_refresh:
        t("segments.automation.actionPushRefresh") || "Refresh Platform Push",
    };
    return map[action];
  }

  function triggerDetail(rule: SegmentAutomationRule): string {
    if (rule.trigger === "schedule" && rule.frequency) {
      return rule.frequency.charAt(0).toUpperCase() + rule.frequency.slice(1);
    }
    if (rule.trigger === "size_threshold" && rule.sizeValue) {
      const op =
        rule.sizeOperator === "below"
          ? t("segments.automation.sizeBelow") || "Drops below"
          : t("segments.automation.sizeAbove") || "Exceeds";
      return `${op} ${rule.sizeValue.toLocaleString("tr-TR")}`;
    }
    if (rule.trigger === "match_rate_drop" && rule.matchRateThreshold) {
      return `< ${rule.matchRateThreshold}%`;
    }
    return "";
  }

  async function handleToggle(ruleId: string, isActive: boolean) {
    try {
      await segmentDataService.toggleAutomationRule(
        segmentId,
        ruleId,
        isActive,
      );
      queryClient.invalidateQueries({
        queryKey: [`/api/segments/automation/${segmentId}`],
      });
      showToast({
        type: "success",
        title: t("segments.automation.ruleToggled") || "Rule updated",
      });
    } catch {
      showToast({ type: "error", title: t("common.error") || "Error" });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {t("segments.automation.title") || "Lifecycle Automation"}
        </h4>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          startIcon={<Plus className="w-3 h-3" />}
          onClick={() => setDialogOpen(true)}
        >
          {t("segments.automation.addRule") || "Add Rule"}
        </Button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-6 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Zap className="w-5 h-5 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            {t("segments.automation.noRules") ||
              "No automation rules configured"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {t("segments.automation.noRulesDesc") ||
              "Set up rules to automatically rebuild, pause, or refresh this segment"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border bg-white transition-opacity",
                rule.isActive
                  ? "border-gray-200"
                  : "border-gray-100 opacity-60",
              )}
            >
              <div className="shrink-0">{triggerIcons[rule.trigger]}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {triggerLabel(rule.trigger)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {triggerDetail(rule)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">→</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {actionIcons[rule.action]}
                    {actionLabel(rule.action)}
                  </span>
                </div>
                {rule.lastTriggeredAt && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {t("segments.automation.lastTriggered") || "Last triggered"}:{" "}
                    {new Date(rule.lastTriggeredAt).toLocaleDateString("tr-TR")}
                  </p>
                )}
              </div>

              <Switch
                size="small"
                checked={rule.isActive}
                onChange={(_, checked) => handleToggle(rule.id, checked)}
              />
            </div>
          ))}
        </div>
      )}

      <SegmentAutomationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        segmentId={segmentId}
      />
    </div>
  );
}
