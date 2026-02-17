import { useMemo } from "react";
import { AlertTriangle, Users, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocales, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { SegmentRuleGroup, SegmentType } from "@/lib/types/segments";

interface SegmentPreviewPanelProps {
  rules: SegmentRuleGroup[];
  segmentType: SegmentType;
}

const BASE_SIZES: Record<SegmentType, number> = {
  value: 45000,
  category: 28000,
  rfm: 12000,
  store: 65000,
  combination: 9000,
};

const MAX_AUDIENCE = 100000;

function calculateEstimatedSize(
  rules: SegmentRuleGroup[],
  segmentType: SegmentType,
): number {
  const base = BASE_SIZES[segmentType];
  const totalRules = rules.reduce((acc, group) => acc + group.rules.length, 0);
  if (totalRules === 0) return base;
  // Each additional rule beyond the first reduces by 20%
  const multiplier = Math.pow(0.8, totalRules - 1);
  return Math.round(base * multiplier);
}

export default function SegmentPreviewPanel({
  rules,
  segmentType,
}: SegmentPreviewPanelProps) {
  const { t } = useLocales();

  const estimatedSize = useMemo(
    () => calculateEstimatedSize(rules, segmentType),
    [rules, segmentType],
  );

  const totalRules = useMemo(
    () => rules.reduce((acc, g) => acc + g.rules.length, 0),
    [rules],
  );

  const progressPercent = Math.min(
    100,
    Math.round((estimatedSize / MAX_AUDIENCE) * 100),
  );

  const isBelowMinimum = estimatedSize < 1000;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          {t("segments.builder.estimatedSize") || "Estimated Audience Size"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Large audience number */}
        <div className="text-center py-2">
          <div
            className={cn(
              "text-3xl font-bold tabular-nums",
              isBelowMinimum ? "text-red-600" : "text-foreground",
            )}
          >
            {fNumber(estimatedSize)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t("segments.builder.identifiers") || "identifiers"}
          </div>
        </div>

        {/* Progress bar showing relative size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{fNumber(MAX_AUDIENCE)}</span>
          </div>
          <Progress
            value={progressPercent}
            className="h-2"
          />
        </div>

        {/* Warning if below 1,000 */}
        {isBelowMinimum && (
          <div className="flex items-start gap-2 rounded-md bg-yellow-50 border border-yellow-200 p-3">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-xs text-yellow-800 leading-relaxed">
              {t("segments.builder.minimumWarning") ||
                "Audience size is below the recommended minimum of 1,000 identifiers for effective platform matching."}
            </p>
          </div>
        )}

        {/* Rule count summary */}
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {rules.length}
            </span>{" "}
            {rules.length === 1 ? "group" : "groups"},{" "}
            <span className="font-medium text-foreground">{totalRules}</span>{" "}
            {totalRules === 1 ? "rule" : "rules"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
