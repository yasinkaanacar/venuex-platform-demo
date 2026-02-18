import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { Plus, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocales, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import CreateABTestDialog from "./CreateABTestDialog";
import type { ABTestConfig, AdPlatform } from "@/lib/types/segments";

const platformIcons: Record<AdPlatform, React.ReactNode> = {
  google: <SiGoogle className="w-4 h-4 text-blue-500" />,
  meta: <SiMeta className="w-4 h-4 text-blue-600" />,
  tiktok: <SiTiktok className="w-4 h-4 text-gray-900" />,
};

const testStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-green-700", bg: "bg-green-100" },
  draft: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100" },
  completed: { label: "Completed", color: "text-blue-700", bg: "bg-blue-100" },
};

export default function ABTestSection() {
  const { t } = useLocales();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: tests = [] } = useQuery<ABTestConfig[]>({
    queryKey: ["/api/segments/ab-tests"],
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="vx-card-header flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {t("segments.abtest.title") || "A/B Test Audiences"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {t("segments.abtest.description") ||
              "Split segments into test groups for controlled experiments"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => setDialogOpen(true)}
        >
          {t("segments.abtest.createTest") || "Create A/B Test"}
        </Button>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-8 px-4">
          <FlaskConical className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {t("segments.abtest.noTests") || "No A/B tests yet"}
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {tests.map((test) => {
            const sCfg = testStatusConfig[test.status] ?? testStatusConfig.draft;
            const totalSize = test.groupA.size + test.groupB.size;
            const aPercent = Math.round((test.groupA.size / totalSize) * 100);
            const bPercent = 100 - aPercent;

            return (
              <div
                key={test.id}
                className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {test.name}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                        sCfg.bg,
                        sCfg.color,
                      )}
                    >
                      {t(`segments.abtest.status${test.status.charAt(0).toUpperCase()}${test.status.slice(1)}`) || sCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {platformIcons[test.platform]}
                    <span className="text-xs text-muted-foreground">
                      {test.platform.charAt(0).toUpperCase() + test.platform.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Source segment */}
                <p className="text-xs text-muted-foreground mb-3">
                  {t("segments.abtest.sourceSegment") || "Source Segment"}:{" "}
                  <span className="font-medium text-foreground">
                    {test.sourceSegmentName}
                  </span>
                </p>

                {/* Split bar */}
                <div className="mb-2">
                  <div className="flex h-6 rounded-lg overflow-hidden">
                    <div
                      className="bg-blue-500 flex items-center justify-center"
                      style={{ width: `${aPercent}%` }}
                    >
                      <span className="text-[10px] font-medium text-white">
                        {test.groupA.name}
                      </span>
                    </div>
                    <div
                      className="bg-orange-400 flex items-center justify-center"
                      style={{ width: `${bPercent}%` }}
                    >
                      <span className="text-[10px] font-medium text-white">
                        {test.groupB.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Size details */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {test.groupA.name}: {fNumber(test.groupA.size)}
                  </span>
                  <span className="font-medium text-foreground">
                    {aPercent}/{bPercent}
                  </span>
                  <span>
                    {test.groupB.name}: {fNumber(test.groupB.size)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateABTestDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
