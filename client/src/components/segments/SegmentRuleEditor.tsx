import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLocales } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type {
  SegmentRuleGroup,
  SegmentRule,
  SegmentType,
  RuleDimension,
  RuleOperator,
  LogicOperator,
} from "@/lib/types/segments";

interface SegmentRuleEditorProps {
  rules: SegmentRuleGroup[];
  onChange: (rules: SegmentRuleGroup[]) => void;
  segmentType: SegmentType;
}

// ------------------------------------------------------------------
// Dimension sets per segment type
// ------------------------------------------------------------------

const DIMENSION_MAP: Record<SegmentType, RuleDimension[]> = {
  value: ["basket_amount", "total_spend"],
  category: ["product_category", "product_brand"],
  rfm: [
    "purchase_recency_days",
    "purchase_frequency",
    "monetary_score",
    "rfm_segment",
  ],
  store: ["store_id", "store_region", "store_city"],
  combination: [
    "basket_amount",
    "total_spend",
    "product_category",
    "product_brand",
    "purchase_recency_days",
    "purchase_frequency",
    "monetary_score",
    "rfm_segment",
    "store_id",
    "store_region",
    "store_city",
  ],
};

const ALL_OPERATORS: RuleOperator[] = [
  "gt",
  "gte",
  "lt",
  "lte",
  "eq",
  "neq",
  "in",
  "not_in",
  "between",
];

// Numeric dimensions use all operators; string dimensions use a subset
const NUMERIC_DIMENSIONS: RuleDimension[] = [
  "basket_amount",
  "total_spend",
  "purchase_recency_days",
  "purchase_frequency",
  "monetary_score",
];

function getOperatorsForDimension(dim: RuleDimension): RuleOperator[] {
  if (NUMERIC_DIMENSIONS.includes(dim)) {
    return ALL_OPERATORS;
  }
  return ["eq", "neq", "in", "not_in"];
}

// ------------------------------------------------------------------
// ID helpers
// ------------------------------------------------------------------

let _ruleCounter = Date.now();
function nextId(prefix: string) {
  _ruleCounter += 1;
  return `${prefix}-${_ruleCounter}`;
}

function makeEmptyRule(segmentType: SegmentType): SegmentRule {
  const dims = DIMENSION_MAP[segmentType];
  const dimension = dims[0];
  const operators = getOperatorsForDimension(dimension);
  return {
    id: nextId("r"),
    dimension,
    operator: operators[0],
    value: "",
  };
}

function makeEmptyGroup(segmentType: SegmentType): SegmentRuleGroup {
  return {
    id: nextId("rg"),
    logic: "AND",
    rules: [makeEmptyRule(segmentType)],
  };
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export default function SegmentRuleEditor({
  rules,
  onChange,
  segmentType,
}: SegmentRuleEditorProps) {
  const { t } = useLocales();

  const dimensions = DIMENSION_MAP[segmentType];

  // -- Group-level helpers ------------------------------------------------

  function updateGroup(groupIdx: number, updates: Partial<SegmentRuleGroup>) {
    const next = rules.map((g, i) => (i === groupIdx ? { ...g, ...updates } : g));
    onChange(next);
  }

  function removeGroup(groupIdx: number) {
    const next = rules.filter((_, i) => i !== groupIdx);
    onChange(next);
  }

  function addGroup() {
    onChange([...rules, makeEmptyGroup(segmentType)]);
  }

  function toggleGroupLogic(groupIdx: number) {
    const current = rules[groupIdx].logic;
    updateGroup(groupIdx, { logic: current === "AND" ? "OR" : "AND" });
  }

  // -- Rule-level helpers -------------------------------------------------

  function updateRule(
    groupIdx: number,
    ruleIdx: number,
    updates: Partial<SegmentRule>,
  ) {
    const newRules = rules[groupIdx].rules.map((r, i) =>
      i === ruleIdx ? { ...r, ...updates } : r,
    );
    updateGroup(groupIdx, { rules: newRules });
  }

  function removeRule(groupIdx: number, ruleIdx: number) {
    const newRules = rules[groupIdx].rules.filter((_, i) => i !== ruleIdx);
    if (newRules.length === 0) {
      removeGroup(groupIdx);
    } else {
      updateGroup(groupIdx, { rules: newRules });
    }
  }

  function addRule(groupIdx: number) {
    const newRules = [...rules[groupIdx].rules, makeEmptyRule(segmentType)];
    updateGroup(groupIdx, { rules: newRules });
  }

  function handleDimensionChange(
    groupIdx: number,
    ruleIdx: number,
    dimension: RuleDimension,
  ) {
    const operators = getOperatorsForDimension(dimension);
    const currentOp = rules[groupIdx].rules[ruleIdx].operator;
    const operator = operators.includes(currentOp) ? currentOp : operators[0];
    updateRule(groupIdx, ruleIdx, { dimension, operator, value: "" });
  }

  // -- Render -------------------------------------------------------------

  return (
    <div className="space-y-4">
      {rules.map((group, groupIdx) => (
        <div key={group.id}>
          {/* AND/OR separator between groups */}
          {groupIdx > 0 && (
            <div className="flex items-center justify-center my-3">
              <div className="h-px flex-1 bg-border" />
              <button
                type="button"
                onClick={() => toggleGroupLogic(groupIdx)}
                className="mx-3"
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer select-none"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    borderColor: group.logic === "AND" ? "#6366f1" : "#f59e0b",
                    color: group.logic === "AND" ? "#6366f1" : "#f59e0b",
                  }}
                >
                  {group.logic}
                </Badge>
              </button>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}

          {/* Group card */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            {/* Group header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {(t("segments.builder.groupLabel") || "Group {{number}}").replace("{{number}}", String(groupIdx + 1))}
              </span>
              {rules.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGroup(groupIdx)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Rules within group */}
            {group.rules.map((rule, ruleIdx) => (
              <div key={rule.id} className="flex items-center gap-2">
                {/* Row logic indicator */}
                {ruleIdx > 0 && (
                  <span className="text-[10px] font-semibold text-muted-foreground w-8 text-center shrink-0">
                    {group.logic}
                  </span>
                )}
                {ruleIdx === 0 && <span className="w-8 shrink-0" />}

                {/* Dimension */}
                <Select
                  value={rule.dimension}
                  onValueChange={(val) =>
                    handleDimensionChange(groupIdx, ruleIdx, val as RuleDimension)
                  }
                  displayLabel={
                    t(`segments.dimensions.${rule.dimension}`) || rule.dimension
                  }
                  width={180}
                >
                  <SelectContent>
                    {dimensions.map((dim) => (
                      <SelectItem key={dim} value={dim}>
                        {t(`segments.dimensions.${dim}`) || dim}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Operator */}
                <Select
                  value={rule.operator}
                  onValueChange={(val) =>
                    updateRule(groupIdx, ruleIdx, {
                      operator: val as RuleOperator,
                    })
                  }
                  displayLabel={
                    t(`segments.operators.${rule.operator}`) || rule.operator
                  }
                  width={160}
                >
                  <SelectContent>
                    {getOperatorsForDimension(rule.dimension).map((op) => (
                      <SelectItem key={op} value={op}>
                        {t(`segments.operators.${op}`) || op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Value input */}
                <div className="flex-1 min-w-[100px]">
                  <Input
                    value={String(rule.value)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateRule(groupIdx, ruleIdx, {
                        value: e.target.value,
                      })
                    }
                    placeholder={t("segments.builder.valuePlaceholder") || "Value"}
                    size="small"
                  />
                </div>

                {/* Secondary value for between operator */}
                {rule.operator === "between" && (
                  <div className="min-w-[100px]">
                    <Input
                      value={
                        rule.secondaryValue !== undefined
                          ? String(rule.secondaryValue)
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateRule(groupIdx, ruleIdx, {
                          secondaryValue: Number(e.target.value) || undefined,
                        })
                      }
                      placeholder={t("segments.builder.maxPlaceholder") || "Max"}
                      size="small"
                    />
                  </div>
                )}

                {/* Remove rule */}
                <button
                  type="button"
                  onClick={() => removeRule(groupIdx, ruleIdx)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-muted"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Add rule to group */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addRule(groupIdx)}
              className="mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("segments.builder.addRule") || "Add Rule"}
            </Button>
          </div>
        </div>
      ))}

      {/* Add rule group */}
      <Button variant="outline" size="sm" onClick={addGroup} className="w-full">
        <Plus className="w-4 h-4" />
        {t("segments.builder.addRuleGroup") || "Add Rule Group"}
      </Button>
    </div>
  );
}
