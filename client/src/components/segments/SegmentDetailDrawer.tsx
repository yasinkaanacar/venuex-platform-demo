import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  Clock,
  Tag,
  Play,
  Pause,
  Trash2,
  Send,
  Layers,
  ArrowRight,
} from "lucide-react";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocales, fNumber, fPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { mockSegments, segmentDataService } from "@/lib/mock-segments-data";
import { showToast } from "@/lib/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PushToPlatformDialog from "./PushToPlatformDialog";
import SegmentAutomationSection from "./SegmentAutomationSection";
import SegmentPerformanceTab from "./SegmentPerformanceTab";
import type {
  Segment,
  SegmentStatus,
  SegmentType,
  PushStatus,
  AdPlatform,
  RuleDimension,
  RuleOperator,
  SegmentRuleGroup,
} from "@/lib/types/segments";

interface SegmentDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segmentId: string | null;
}

const statusConfig: Record<
  SegmentStatus,
  { label: string; color: string; bg: string }
> = {
  active: { label: "Active", color: "text-green-700", bg: "bg-green-100" },
  building: { label: "Building", color: "text-blue-700", bg: "bg-blue-100" },
  paused: { label: "Paused", color: "text-yellow-700", bg: "bg-yellow-100" },
  error: { label: "Error", color: "text-red-700", bg: "bg-red-100" },
  draft: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100" },
};

const typeConfig: Record<SegmentType, { label: string; color: string; bg: string }> = {
  value: { label: "Value", color: "text-purple-700", bg: "bg-purple-100" },
  category: { label: "Category", color: "text-indigo-700", bg: "bg-indigo-100" },
  rfm: { label: "RFM", color: "text-orange-700", bg: "bg-orange-100" },
  store: { label: "Store", color: "text-teal-700", bg: "bg-teal-100" },
  combination: { label: "Combination", color: "text-pink-700", bg: "bg-pink-100" },
};

const pushStatusConfig: Record<
  PushStatus,
  { label: string; color: string; bg: string }
> = {
  synced: { label: "Synced", color: "text-green-700", bg: "bg-green-100" },
  syncing: { label: "Syncing", color: "text-blue-700", bg: "bg-blue-100" },
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100" },
  failed: { label: "Failed", color: "text-red-700", bg: "bg-red-100" },
  not_pushed: { label: "Not Pushed", color: "text-gray-700", bg: "bg-gray-100" },
};

const platformIcons: Record<AdPlatform, React.ReactNode> = {
  google: <SiGoogle className="w-4 h-4 text-blue-500" />,
  meta: <SiMeta className="w-4 h-4 text-blue-600" />,
  tiktok: <SiTiktok className="w-4 h-4 text-gray-900" />,
};

const platformNames: Record<AdPlatform, string> = {
  google: "Google Ads",
  meta: "Meta Ads",
  tiktok: "TikTok Ads",
};

const dimensionLabels: Record<RuleDimension, string> = {
  basket_amount: "Basket Amount",
  total_spend: "Total Spend",
  average_order_value: "Average Order Value",
  total_orders: "Total Orders",
  customer_lifetime_value: "Customer Lifetime Value",
  last_order_amount: "Last Order Amount",
  product_category: "Product Category",
  product_brand: "Product Brand",
  product_subcategory: "Product Subcategory",
  purchase_channel: "Purchase Channel",
  purchase_recency_days: "Purchase Recency (Days)",
  purchase_frequency: "Purchase Frequency",
  monetary_score: "Monetary Score",
  rfm_segment: "RFM Segment",
  days_since_first_purchase: "Days Since First Purchase",
  avg_days_between_purchases: "Avg. Days Between Purchases",
  store_id: "Store ID",
  store_region: "Store Region",
  store_city: "Store City",
  store_format: "Store Format",
  loyalty_tier: "Loyalty Tier",
  gender: "Gender",
  age_range: "Age Range",
};

const operatorLabels: Record<RuleOperator, string> = {
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  eq: "=",
  neq: "!=",
  in: "in",
  not_in: "not in",
  between: "between",
};

function formatRuleValue(
  dimension: RuleDimension,
  operator: RuleOperator,
  value: string | number | string[],
  secondaryValue?: number
): string {
  const dimLabel = dimensionLabels[dimension];
  const opLabel = operatorLabels[operator];

  let valueStr: string;
  if (Array.isArray(value)) {
    valueStr = value.join(", ");
  } else if (
    dimension === "basket_amount" ||
    dimension === "total_spend"
  ) {
    valueStr = `\u20BA${Number(value).toLocaleString("tr-TR")}`;
  } else {
    valueStr = String(value);
  }

  if (operator === "between" && secondaryValue !== undefined) {
    const secondaryStr =
      dimension === "basket_amount" || dimension === "total_spend"
        ? `\u20BA${secondaryValue.toLocaleString("tr-TR")}`
        : String(secondaryValue);
    return `${dimLabel} ${opLabel} ${valueStr} and ${secondaryStr}`;
  }

  return `${dimLabel} ${opLabel} ${valueStr}`;
}

export default function SegmentDetailDrawer({
  open,
  onOpenChange,
  segmentId,
}: SegmentDetailDrawerProps) {
  const { t } = useLocales();
  const queryClient = useQueryClient();
  const [pushDialogOpen, setPushDialogOpen] = useState(false);

  const segment = useMemo(() => {
    if (!segmentId) return null;
    return mockSegments.find((s) => s.id === segmentId) ?? null;
  }, [segmentId]);

  function invalidateSegmentQueries() {
    queryClient.invalidateQueries({ queryKey: ["/api/segments"] });
    queryClient.invalidateQueries({ queryKey: ["/api/segments/summary"] });
  }

  // Mock: Updates segment status in memory. Wire to PATCH /api/segments/:id in production.
  async function handleToggleStatus() {
    if (!segment) return;
    const newStatus = segment.status === "active" ? "paused" : "active";
    try {
      await segmentDataService.updateSegment(segment.id, { status: newStatus });
      invalidateSegmentQueries();
      showToast({
        type: "success",
        title: newStatus === "paused"
          ? (t("segments.detail.segmentPaused") || "Segment paused")
          : (t("segments.detail.segmentActivated") || "Segment activated"),
        description: segment.name,
      });
      onOpenChange(false);
    } catch {
      showToast({ type: "error", title: t("common.error") || "Error" });
    }
  }

  // Mock: Deletes segment from memory. Wire to DELETE /api/segments/:id in production.
  async function handleDelete() {
    if (!segment) return;
    const confirmed = window.confirm(
      t("segments.detail.deleteConfirm") || "Are you sure you want to delete this segment?",
    );
    if (!confirmed) return;
    try {
      await segmentDataService.deleteSegment(segment.id);
      invalidateSegmentQueries();
      showToast({
        type: "success",
        title: t("segments.detail.segmentDeleted") || "Segment deleted",
        description: segment.name,
      });
      onOpenChange(false);
    } catch {
      showToast({ type: "error", title: t("common.error") || "Error" });
    }
  }

  if (!segment) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[480px] sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{t("segments.detail.segmentDetails") || "Segment Details"}</SheetTitle>
            <SheetDescription>{t("segments.detail.noSegmentSelected") || "No segment selected."}</SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
            {t("segments.detail.selectSegmentPrompt") || "Select a segment to view details."}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const avgMatchRate =
    segment.platformPushes.length > 0
      ? Math.round(
          segment.platformPushes.reduce((acc, p) => acc + p.matchRate, 0) /
            segment.platformPushes.length
        )
      : 0;

  const audienceSize = segment.actualSize ?? segment.estimatedSize;
  const statusCfg = statusConfig[segment.status];
  const typeCfg = typeConfig[segment.type];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[480px] sm:max-w-lg overflow-y-auto"
      >
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-xl">{segment.name}</SheetTitle>
          <SheetDescription className="sr-only">
            {t("segments.detail.segmentDetails") || "Segment Details"}
          </SheetDescription>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                statusCfg.bg,
                statusCfg.color
              )}
            >
              {t(`segments.status.${segment.status}`) || statusCfg.label}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                typeCfg.bg,
                typeCfg.color
              )}
            >
              {t(`segments.detail.type${segment.type.charAt(0).toUpperCase()}${segment.type.slice(1)}`) || typeCfg.label}
            </span>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">
              {t("segments.performance.tabOverview") || "Overview"}
            </TabsTrigger>
            <TabsTrigger value="performance">
              {t("segments.performance.tabPerformance") || "Performance"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6">
          {/* Description */}
          <div>
            <p className="text-sm text-muted-foreground">
              {segment.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <Users className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">{t("segments.detail.audienceSize") || "Audience Size"}</p>
                <p className="text-sm font-semibold">{fNumber(audienceSize)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <Layers className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">{t("segments.push.avgMatchRate") || "Avg. Match Rate"}</p>
                <p className="text-sm font-semibold">
                  {avgMatchRate > 0 ? fPercent(avgMatchRate) : "--"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <Calendar className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">{t("segments.detail.createdAt") || "Created"}</p>
                <p className="text-sm font-semibold">
                  {new Date(segment.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">{t("segments.detail.lastBuilt") || "Last Built"}</p>
                <p className="text-sm font-semibold">
                  {segment.lastBuiltAt
                    ? new Date(segment.lastBuiltAt).toLocaleDateString("tr-TR")
                    : "--"}
                </p>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              {t("segments.detail.segmentRules") || "Segment Rules"}
            </h4>
            <div className="space-y-3">
              {segment.ruleGroups.map(
                (group: SegmentRuleGroup, groupIndex: number) => (
                  <div
                    key={group.id}
                    className="rounded-lg border border-gray-200 p-3 bg-gray-50"
                  >
                    {groupIndex > 0 && (
                      <div className="flex items-center gap-2 mb-2 -mt-1">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                          {segment.groupLogic}
                        </span>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      {group.rules.map((rule, ruleIndex) => (
                        <div key={rule.id} className="flex items-center gap-2">
                          {ruleIndex > 0 && (
                            <span className="text-xs font-medium text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                              {group.logic}
                            </span>
                          )}
                          <span className="text-sm text-foreground font-mono bg-white px-2 py-1 rounded border border-gray-200">
                            {formatRuleValue(
                              rule.dimension,
                              rule.operator,
                              rule.value,
                              rule.secondaryValue
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Platform Push Status */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Send className="w-4 h-4" />
              {t("segments.detail.platformStatus") || "Platform Push Status"}
            </h4>
            {segment.platformPushes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                {t("segments.detail.notPushedYet") || "Not pushed to any platform yet."}
              </p>
            ) : (
              <div className="space-y-2">
                {segment.platformPushes.map((push) => {
                  const pushCfg = pushStatusConfig[push.status];
                  return (
                    <div
                      key={push.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        {platformIcons[push.platform]}
                        <div>
                          <p className="text-sm font-medium">
                            {platformNames[push.platform]}
                          </p>
                          {push.audienceName && (
                            <p className="text-xs text-muted-foreground">
                              {push.audienceName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">
                          {push.matchRate > 0 ? fPercent(push.matchRate) : "--"}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            pushCfg.bg,
                            pushCfg.color
                          )}
                        >
                          {t(`segments.push.${push.status === "not_pushed" ? "notPushed" : push.status}`) || pushCfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lifecycle Automation */}
          <SegmentAutomationSection segmentId={segment.id} />

          {/* Tags */}
          {segment.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {t("segments.detail.tags") || "Tags"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {segment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t space-y-2">
            <Button
              variant="default"
              className="w-full"
              disabled={segment.status !== "active"}
              startIcon={<Send className="w-4 h-4" />}
              onClick={() => setPushDialogOpen(true)}
            >
              {t("segments.push.pushToPlatform") || "Push to Platform"}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleToggleStatus}
                startIcon={
                  segment.status === "active" ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )
                }
              >
                {segment.status === "active"
                  ? (t("segments.detail.pauseSegment") || "Pause")
                  : (t("segments.detail.activateSegment") || "Activate")}
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                startIcon={<Trash2 className="w-4 h-4" />}
              >
                {t("common.delete") || "Delete"}
              </Button>
            </div>
          </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-2">
            <SegmentPerformanceTab segmentId={segment.id} />
          </TabsContent>
        </Tabs>

        {/* Push to Platform Dialog */}
        {segment && (
          <PushToPlatformDialog
            open={pushDialogOpen}
            onOpenChange={setPushDialogOpen}
            segment={segment}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
