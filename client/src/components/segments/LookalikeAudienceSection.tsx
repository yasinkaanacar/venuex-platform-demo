import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { Plus, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocales, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import CreateLookalikeDialog from "./CreateLookalikeDialog";
import type { LookalikeAudience, LookalikeStatus, AdPlatform } from "@/lib/types/segments";

const platformIcons: Record<AdPlatform, React.ReactNode> = {
  google: <SiGoogle className="w-4 h-4 text-blue-500" />,
  meta: <SiMeta className="w-4 h-4 text-blue-600" />,
  tiktok: <SiTiktok className="w-4 h-4 text-gray-900" />,
};

const statusConfig: Record<LookalikeStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-green-700", bg: "bg-green-100" },
  building: { label: "Building", color: "text-blue-700", bg: "bg-blue-100" },
  expired: { label: "Expired", color: "text-yellow-700", bg: "bg-yellow-100" },
  failed: { label: "Failed", color: "text-red-700", bg: "bg-red-100" },
};

export default function LookalikeAudienceSection() {
  const { t } = useLocales();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: lookalikes = [] } = useQuery<LookalikeAudience[]>({
    queryKey: ["/api/segments/lookalikes"],
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="vx-card-header flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {t("segments.lookalike.title") || "Lookalike Audiences"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {t("segments.lookalike.description") ||
              "Expand your reach with lookalike audiences based on your best segments"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => setDialogOpen(true)}
        >
          {t("segments.lookalike.createLookalike") || "Create Lookalike"}
        </Button>
      </div>

      {lookalikes.length === 0 ? (
        <div className="text-center py-8 px-4">
          <Users2 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {t("segments.lookalike.noLookalikes") || "No lookalike audiences yet"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  {t("segments.lookalike.sourceSegment") || "Source Segment"}
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  {t("segments.lookalike.platform") || "Platform"}
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  {t("segments.lookalike.expansion") || "Expansion %"}
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  {t("segments.lookalike.estimatedSize") || "Est. Size"}
                </th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lookalikes.map((la) => {
                const sCfg = statusConfig[la.status];
                return (
                  <tr key={la.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{la.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {la.sourceSegmentName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {platformIcons[la.platform]}
                        <span className="text-sm text-foreground">
                          {la.platform.charAt(0).toUpperCase() + la.platform.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {la.expansionPercent}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {fNumber(la.estimatedSize)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          sCfg.bg,
                          sCfg.color,
                        )}
                      >
                        {t(`segments.lookalike.status${la.status.charAt(0).toUpperCase()}${la.status.slice(1)}`) || sCfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateLookalikeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
