import { SiGoogle, SiMeta } from "react-icons/si";
import { Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocales, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { segmentDataService } from "@/lib/mock-segments-data";
import { showToast } from "@/lib/toast";
import type { FeedLabel, FeedLabelType } from "@/lib/types/segments";

interface FeedLabelTableProps {
  labels: FeedLabel[];
  onEdit: (label: FeedLabel) => void;
}

const LABEL_TYPE_CONFIG: Record<
  FeedLabelType,
  { label: string; bg: string; text: string }
> = {
  offline_bestseller: {
    label: "Offline Bestseller",
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  high_value_category: {
    label: "High Value Category",
    bg: "bg-purple-100",
    text: "text-purple-800",
  },
  store_performer: {
    label: "Store Performer",
    bg: "bg-green-100",
    text: "text-green-800",
  },
  cross_sell_candidate: {
    label: "Cross-Sell Candidate",
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  custom: {
    label: "Custom",
    bg: "bg-gray-100",
    text: "text-gray-800",
  },
};

export default function FeedLabelTable({ labels, onEdit }: FeedLabelTableProps) {
  const { t } = useLocales();
  const queryClient = useQueryClient();

  // Translated type labels
  const TYPE_LABEL_MAP: Record<FeedLabelType, string> = {
    offline_bestseller: t("segments.labels.offlineBestseller") || "Offline Bestseller",
    high_value_category: t("segments.labels.highValueCategory") || "High Value Category",
    store_performer: t("segments.labels.storePerformer") || "Store Performer",
    cross_sell_candidate: t("segments.labels.crossSellCandidate") || "Cross-Sell Candidate",
    custom: t("segments.labels.custom") || "Custom",
  };

  // Mock: Toggles feed label active state in memory. Wire to PATCH /api/feed-labels/:id in production.
  async function handleToggle(label: FeedLabel) {
    try {
      await segmentDataService.updateFeedLabel(label.id, { isActive: !label.isActive });
      queryClient.invalidateQueries({ queryKey: ["/api/segments/feed-labels"] });
      showToast({
        type: "success",
        title: !label.isActive
          ? (t("segments.status.active") || "Active")
          : (t("segments.status.paused") || "Paused"),
        description: label.name,
      });
    } catch {
      showToast({ type: "error", title: t("common.error") || "Error" });
    }
  }

  return (
    <div className="vx-card">
      <div className="vx-card-body overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="vx-th text-left">
                {t("segments.labels.table.name") || "Label Name"}
              </th>
              <th className="vx-th text-left">
                {t("segments.labels.table.type") || "Type"}
              </th>
              <th className="vx-th text-left">
                {t("segments.labels.table.labelKey") || "Custom Label Key"}
              </th>
              <th className="vx-th text-left">
                {t("segments.labels.table.channels") || "Channels"}
              </th>
              <th className="vx-th text-right">
                {t("segments.labels.table.affectedProducts") ||
                  "Affected Products"}
              </th>
              <th className="vx-th text-center">
                {t("segments.labels.table.status") || "Status"}
              </th>
              <th className="vx-th text-center">
                {t("segments.labels.table.actions") || "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {labels.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="vx-td text-center text-gray-400 py-12"
                >
                  {t("segments.labels.table.empty") ||
                    "No feed labels created yet."}
                </td>
              </tr>
            )}
            {labels.map((label) => {
              const typeConfig = LABEL_TYPE_CONFIG[label.type];
              return (
                <tr key={label.id} className="hover:bg-gray-50">
                  {/* Label Name */}
                  <td className="vx-td">
                    <div className="font-medium text-gray-900">
                      {label.name}
                    </div>
                    {label.description && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {label.description}
                      </div>
                    )}
                  </td>

                  {/* Type Badge */}
                  <td className="vx-td">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        typeConfig.bg,
                        typeConfig.text,
                      )}
                    >
                      {TYPE_LABEL_MAP[label.type] || typeConfig.label}
                    </span>
                  </td>

                  {/* Custom Label Key */}
                  <td className="vx-td">
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {label.labelKey}
                    </code>
                  </td>

                  {/* Channels */}
                  <td className="vx-td">
                    <div className="flex items-center gap-3">
                      {label.channels.includes("gmc") && (
                        <div className="flex items-center gap-1.5">
                          <SiGoogle className="w-3.5 h-3.5 text-[#4285F4]" />
                          <span className="text-xs text-gray-600">{t("segments.labels.channelGmc") || "GMC"}</span>
                        </div>
                      )}
                      {label.channels.includes("meta_catalog") && (
                        <div className="flex items-center gap-1.5">
                          <SiMeta className="w-3.5 h-3.5 text-[#0081FB]" />
                          <span className="text-xs text-gray-600">{t("segments.labels.channelMetaCatalog") || "Meta Catalog"}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Affected Products */}
                  <td className="vx-td text-right">
                    <span className="font-medium text-gray-900">
                      {fNumber(label.affectedProductCount)}
                    </span>
                    <span className="text-gray-400">
                      {" "}
                      / {fNumber(label.totalProductCount)}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="vx-td text-center">
                    <div className="flex items-center justify-center">
                      <Switch
                        checked={label.isActive}
                        onChange={() => handleToggle(label)}
                        size="small"
                        inputProps={{
                          "aria-label": `Toggle ${label.name}`,
                        }}
                      />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="vx-td text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(label)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
