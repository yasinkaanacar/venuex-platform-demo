import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Tag, Package, Radio, Plus } from "lucide-react";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { useLocales, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardSkeleton, DataErrorState } from "@/components/shared/data-states";
import type { FeedLabel } from "@/lib/types/segments";
import FeedLabelTable from "./FeedLabelTable";
import FeedLabelEditor from "./FeedLabelEditor";

export default function FeedLabelDashboard() {
  const { t } = useLocales();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<FeedLabel | null>(null);

  const { data: labels = [], isLoading, isError, refetch } = useQuery<FeedLabel[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_FEED_LABELS],
  });

  // --- Derived stats ---
  const activeLabels = useMemo(
    () => labels.filter((l) => l.isActive),
    [labels],
  );

  const activeCount = activeLabels.length;

  const productsLabeled = useMemo(
    () => activeLabels.reduce((sum, l) => sum + l.affectedProductCount, 0),
    [activeLabels],
  );

  const uniqueChannels = useMemo(() => {
    const set = new Set<string>();
    activeLabels.forEach((l) => l.channels.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [activeLabels]);

  const channelDisplayNames: Record<string, string> = {
    gmc: "GMC",
    meta_catalog: "Meta Catalog",
  };

  const channelsText = uniqueChannels
    .map((c) => channelDisplayNames[c] ?? c)
    .join(", ");

  // GMC slot count: unique gmcSlotIndex values across all labels with gmc channel
  const gmcSlotCount = useMemo(() => {
    const slots = new Set<number>();
    labels.forEach((l) => {
      if (l.channels.includes("gmc") && l.gmcSlotIndex !== undefined) {
        slots.add(l.gmcSlotIndex);
      }
    });
    return slots.size;
  }, [labels]);

  const handleAddLabel = () => {
    setEditingLabel(null);
    setEditorOpen(true);
  };

  const handleEditLabel = (label: FeedLabel) => {
    setEditingLabel(label);
    setEditorOpen(true);
  };

  // --- Summary card definitions ---
  const summaryCards = [
    {
      title: t("segments.labels.activeLabels") || "Active Labels",
      value: String(activeCount),
      icon: Tag,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: t("segments.labels.productsLabeled") || "Products Labeled",
      value: fNumber(productsLabeled),
      icon: Package,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      title: t("segments.labels.channelsActive") || "Channels Active",
      value: channelsText || "—",
      icon: Radio,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="px-6 pt-6">
        <CardSkeleton lines={5} />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="px-6 pt-6">
        <DataErrorState onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      {/* GMC Limit Warning Banner */}
      {gmcSlotCount >= 4 && (
        <div className="px-6 pt-6">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3",
              gmcSlotCount >= 5
                ? "bg-red-50 border border-red-200"
                : "bg-amber-50 border border-amber-200",
            )}
          >
            <AlertTriangle
              className={cn(
                "w-5 h-5 flex-shrink-0",
                gmcSlotCount >= 5 ? "text-red-600" : "text-amber-600",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                gmcSlotCount >= 5 ? "text-red-800" : "text-amber-800",
              )}
            >
              {t("segments.labels.gmcLimitWarning") ||
                `Google Merchant Center supports a maximum of 5 custom labels. You are using ${gmcSlotCount} of 5.`}
            </span>
          </div>
        </div>
      )}

      {/* Summary Cards + Add Button */}
      <div className="px-6 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className="vx-card shadow-none hover:shadow-sm transition-all duration-200"
              >
                <div className="vx-card-body pt-3 vx-surface-muted">
                  <div className="flex items-center space-x-2 mb-4">
                    <div
                      className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}
                    >
                      <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {card.title}
                    </h3>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {card.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleAddLabel} className="flex-shrink-0 mt-1">
            <Plus className="w-4 h-4" />
            {t("segments.labels.addLabel") || "Add Label"}
          </Button>
        </div>
      </div>

      {/* Feed Label Table */}
      <div className="vx-section-stack">
        <FeedLabelTable labels={labels} onEdit={handleEditLabel} />
      </div>

      {/* Feed Label Editor Dialog */}
      <FeedLabelEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editingLabel={editingLabel}
      />
    </div>
  );
}
