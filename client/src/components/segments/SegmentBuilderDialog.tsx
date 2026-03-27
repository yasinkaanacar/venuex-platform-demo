import { useState, useMemo } from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
} from "@mui/material";
import {
  X,
  DollarSign,
  Tag,
  BarChart3,
  MapPin,
  Combine,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { segmentDataService } from "@/lib/mock/segments";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLocales, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import SegmentRuleEditor from "./SegmentRuleEditor";
import SegmentPreviewPanel from "./SegmentPreviewPanel";
import type {
  Segment,
  SegmentType,
  SegmentRuleGroup,
  RuleDimension,
} from "@/lib/types/segments";

interface SegmentBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (segment: Segment) => void;
}

// ------------------------------------------------------------------
// Type option config
// ------------------------------------------------------------------

interface TypeOption {
  type: SegmentType;
  labelKey: string;
  descKey: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    type: "value",
    labelKey: "segments.builder.valueBased",
    descKey: "segments.builder.valueBasedDesc",
    icon: DollarSign,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  {
    type: "category",
    labelKey: "segments.builder.categoryBased",
    descKey: "segments.builder.categoryBasedDesc",
    icon: Tag,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    type: "rfm",
    labelKey: "segments.builder.rfmBased",
    descKey: "segments.builder.rfmBasedDesc",
    icon: BarChart3,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },
  {
    type: "store",
    labelKey: "segments.builder.storeBased",
    descKey: "segments.builder.storeBasedDesc",
    icon: MapPin,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    type: "combination",
    labelKey: "segments.builder.combination",
    descKey: "segments.builder.combinationDesc",
    icon: Combine,
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
];

// ------------------------------------------------------------------
// Estimated size calculation (mirrors SegmentPreviewPanel logic)
// ------------------------------------------------------------------

const BASE_SIZES: Record<SegmentType, number> = {
  value: 45000,
  category: 28000,
  rfm: 12000,
  store: 65000,
  combination: 9000,
};

function calcEstimatedSize(
  ruleGroups: SegmentRuleGroup[],
  segmentType: SegmentType,
): number {
  const base = BASE_SIZES[segmentType];
  const totalRules = ruleGroups.reduce(
    (acc, group) => acc + group.rules.length,
    0,
  );
  if (totalRules === 0) return base;
  return Math.round(base * Math.pow(0.8, totalRules - 1));
}

// ------------------------------------------------------------------
// Initial empty rule group for a given type
// ------------------------------------------------------------------

const FIRST_DIM: Record<SegmentType, RuleDimension> = {
  value: "basket_amount",
  category: "product_category",
  rfm: "purchase_recency_days",
  store: "store_id",
  combination: "basket_amount",
};

function makeInitialGroup(segmentType: SegmentType): SegmentRuleGroup {
  return {
    id: `rg-init-${Date.now()}`,
    logic: "AND",
    rules: [
      {
        id: `r-init-${Date.now()}`,
        dimension: FIRST_DIM[segmentType],
        operator: "gte",
        value: "",
      },
    ],
  };
}

// ------------------------------------------------------------------
// Steps
// ------------------------------------------------------------------

const STEPS = ["step1", "step2", "step3"] as const;

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export default function SegmentBuilderDialog({
  open,
  onOpenChange,
  onCreated,
}: SegmentBuilderDialogProps) {
  const { t } = useLocales();
  const queryClient = useQueryClient();

  // Wizard step
  const [step, setStep] = useState(0);

  // Step 1 - Basics
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [segmentType, setSegmentType] = useState<SegmentType>("value");

  // Step 2 - Rules
  const [ruleGroups, setRuleGroups] = useState<SegmentRuleGroup[]>([
    makeInitialGroup("value"),
  ]);

  // Create state
  const [isCreating, setIsCreating] = useState(false);

  // Derived
  const estimatedSize = useMemo(
    () => calcEstimatedSize(ruleGroups, segmentType),
    [ruleGroups, segmentType],
  );
  const isBelowMinimum = estimatedSize < 1000;

  // Reset on close
  function handleClose() {
    onOpenChange(false);
    // Delay reset so animation finishes
    setTimeout(() => {
      setStep(0);
      setName("");
      setDescription("");
      setSegmentType("value");
      setRuleGroups([makeInitialGroup("value")]);
    }, 300);
  }

  // When segment type changes, reset rule groups
  function handleTypeChange(type: SegmentType) {
    setSegmentType(type);
    setRuleGroups([makeInitialGroup(type)]);
  }

  // Navigation
  function goNext() {
    if (step < 2) setStep(step + 1);
  }
  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  async function handleCreate() {
    setIsCreating(true);
    try {
      const newSegment = await segmentDataService.createSegment({
        name: name.trim(),
        description: description.trim(),
        type: segmentType,
        ruleGroups,
        estimatedSize,
      });

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS_SUMMARY] });

      showToast({
        type: "success",
        title: t("segments.builder.createSuccess") || "Segment created",
        description: name.trim(),
      });

      handleClose();
      onCreated?.(newSegment);
    } catch {
      showToast({
        type: "error",
        title: t("segments.builder.createError") || "Failed to create segment",
      });
    } finally {
      setIsCreating(false);
    }
  }

  // Readability helper for rules
  function ruleToText(rule: {
    dimension: RuleDimension;
    operator: string;
    value: string | number | string[];
    secondaryValue?: number;
  }) {
    const dimLabel = t(`segments.dimensions.${rule.dimension}`) || rule.dimension;
    const opLabel = t(`segments.operators.${rule.operator}`) || rule.operator;
    const val = Array.isArray(rule.value) ? rule.value.join(", ") : String(rule.value);
    if (rule.operator === "between" && rule.secondaryValue !== undefined) {
      return `${dimLabel} ${opLabel} ${val} - ${rule.secondaryValue}`;
    }
    return `${dimLabel} ${opLabel} ${val}`;
  }

  // ------------------------------------------------------------------
  // Step content renderers
  // ------------------------------------------------------------------

  function renderStep1() {
    return (
      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {t("segments.builder.segmentName") || "Segment Name"}
          </label>
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder={t("segments.builder.segmentNamePlaceholder") || "e.g. High Value Customers"}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {t("segments.builder.segmentDescription") || "Description"}
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("segments.builder.segmentDescriptionPlaceholder") || "Describe the purpose of this segment..."}
            rows={3}
          />
        </div>

        {/* Type selector - radio-style cards */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {t("segments.builder.segmentType") || "Segment Type"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = segmentType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleTypeChange(opt.type)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-all",
                    isSelected
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/30",
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      opt.bgColor,
                    )}
                  >
                    <Icon className={cn("w-4.5 h-4.5", opt.color)} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {t(opt.labelKey) || opt.type}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {t(opt.descKey) || ""}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="flex gap-4">
        {/* Rules editor */}
        <div className="flex-1 min-w-0">
          <SegmentRuleEditor
            rules={ruleGroups}
            onChange={setRuleGroups}
            segmentType={segmentType}
          />
        </div>

        {/* Preview panel on the right */}
        <div className="w-64 shrink-0">
          <SegmentPreviewPanel rules={ruleGroups} segmentType={segmentType} />
        </div>
      </div>
    );
  }

  function renderStep3() {
    const totalRules = ruleGroups.reduce(
      (acc, g) => acc + g.rules.length,
      0,
    );

    const typeOption = TYPE_OPTIONS.find((o) => o.type === segmentType);

    return (
      <div className="space-y-6">
        {/* Summary card */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">{name || (t("segments.builder.untitledSegment") || "Untitled Segment")}</h4>
            {typeOption && (
              <Badge
                variant="outline"
                sx={{ fontSize: "0.7rem" }}
              >
                {t(typeOption.labelKey) || segmentType}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Rules as readable text */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">
            {t("segments.builder.rulesSummary") || "Rules Summary"}
          </h4>
          <div className="space-y-2">
            {ruleGroups.map((group, gIdx) => (
              <div key={group.id}>
                {gIdx > 0 && (
                  <div className="text-xs font-semibold text-muted-foreground text-center py-1">
                    AND
                  </div>
                )}
                <div className="rounded-md border px-3 py-2 space-y-1">
                  {group.rules.map((rule, rIdx) => (
                    <div key={rule.id} className="text-sm">
                      {rIdx > 0 && (
                        <span className="text-xs font-medium text-muted-foreground mr-1">
                          {group.logic}{" "}
                        </span>
                      )}
                      {ruleToText(rule)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated audience size - prominent */}
        <div className="rounded-lg border bg-card p-5 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {t("segments.builder.estimatedSize") || "Estimated Audience Size"}
          </div>
          <div
            className={cn(
              "text-4xl font-bold tabular-nums",
              isBelowMinimum ? "text-red-600" : "text-foreground",
            )}
          >
            {fNumber(estimatedSize)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t("segments.builder.identifiers") || "identifiers"} &middot;{" "}
            {ruleGroups.length} {ruleGroups.length === 1 ? (t("segments.builder.group") || "group") : (t("segments.builder.groups") || "groups")},{" "}
            {totalRules} {totalRules === 1 ? (t("segments.builder.rule") || "rule") : (t("segments.builder.rules") || "rules")}
          </div>
        </div>

        {/* Warning if below minimum */}
        {isBelowMinimum && (
          <div className="flex items-start gap-2 rounded-md bg-yellow-50 border border-yellow-200 p-3">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-xs text-yellow-800 leading-relaxed">
              {t("segments.builder.minimumWarning") ||
                "Audience size is below the recommended minimum of 1,000 identifiers for effective platform matching."}
            </p>
          </div>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  const stepLabels = [
    t("segments.builder.step1") || "Basics",
    t("segments.builder.step2") || "Rules",
    t("segments.builder.step3") || "Preview",
  ];

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: "100%",
          maxWidth: 768,
          maxHeight: "85vh",
        },
      }}
    >
      {/* Header */}
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
          {t("segments.builder.createSegment") || "Create Segment"}
        </span>
        <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
          <X size={16} />
        </IconButton>
      </MuiDialogTitle>

      {/* Step indicators */}
      <div className="px-6 pt-2 pb-4">
        <div className="flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                  i === step
                    ? "bg-blue-100 text-blue-700"
                    : i < step
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                    i === step
                      ? "bg-blue-600 text-white"
                      : i < step
                        ? "bg-green-600 text-white"
                        : "bg-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {i < step ? "\u2713" : i + 1}
                </span>
                {label}
              </div>
              {i < stepLabels.length - 1 && (
                <div className="w-8 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <MuiDialogContent sx={{ px: 3, py: 0, overflowY: "auto" }}>
        {step === 0 && renderStep1()}
        {step === 1 && renderStep2()}
        {step === 2 && renderStep3()}
      </MuiDialogContent>

      {/* Footer navigation */}
      <MuiDialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <div className="flex items-center justify-between w-full">
          <div>
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={goBack}>
                <ArrowLeft className="w-4 h-4" />
                {t("segments.builder.back") || "Back"}
              </Button>
            )}
          </div>
          <div>
            {step < 2 ? (
              <Button
                variant="default"
                size="sm"
                onClick={goNext}
                disabled={step === 0 && !name.trim()}
              >
                {t("segments.builder.next") || "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleCreate}
                disabled={isCreating}
              >
                {isCreating
                  ? (t("segments.builder.creating") || "Creating…")
                  : (t("segments.builder.create") || "Create Segment")}
              </Button>
            )}
          </div>
        </div>
      </MuiDialogActions>
    </MuiDialog>
  );
}
