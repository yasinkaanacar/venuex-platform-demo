import { useLocales, fCurrency, fNumber, fPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { SegmentAttribution } from "@/lib/types/segments";

interface SegmentAttributionTableProps {
  attributions: SegmentAttribution[];
  expandedSegmentId: string | null;
  onToggleExpand: (segmentId: string) => void;
}

export default function SegmentAttributionTable({
  attributions,
  expandedSegmentId,
  onToggleExpand,
}: SegmentAttributionTableProps) {
  const { t } = useLocales();

  // Sort by omniROAS descending
  const sorted = [...attributions].sort(
    (a, b) => b.totals.omniROAS - a.totals.omniROAS,
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-8 px-2 py-3" />
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.attribution.segmentColumn") || "Segment"}
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.attribution.sizeColumn") || "Size"}
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.attribution.spendColumn") || "Ad Spend"}
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.attribution.revenueColumn") || "Revenue"}
              </th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.attribution.roasColumn") || "Omni ROAS"}
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.attribution.offlineRoasColumn") || "Offline ROAS"}
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.attribution.onlineRoasColumn") || "Online ROAS"}
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                {t("segments.attribution.conversionsColumn") || "Conversions"}
              </th>
              <th
                title="Cost per Acquisition"
                className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 cursor-help"
              >
                CPA
              </th>
              <th
                title="Conversion Rate"
                className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 cursor-help"
              >
                CR
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((attr) => {
              const isExpanded = expandedSegmentId === attr.segmentId;
              const roasColor =
                attr.totals.omniROAS >= 8
                  ? "text-green-700 bg-green-100"
                  : attr.totals.omniROAS >= 5
                    ? "text-blue-700 bg-blue-100"
                    : "text-yellow-700 bg-yellow-100";

              return (
                <tr
                  key={attr.segmentId}
                  onClick={() => onToggleExpand(attr.segmentId)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    isExpanded
                      ? "bg-blue-50/50"
                      : "hover:bg-gray-50",
                  )}
                >
                  <td className="px-2 py-3 text-center">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500 mx-auto" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      {attr.segmentName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-foreground tabular-nums">
                      {fNumber(attr.segmentSize)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      {fCurrency(attr.totals.adSpend)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      {fCurrency(attr.totals.totalRevenue)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums",
                        roasColor,
                      )}
                    >
                      {attr.totals.omniROAS.toFixed(2)}x
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-foreground tabular-nums">
                      {attr.totals.offlineROAS.toFixed(2)}x
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-foreground tabular-nums">
                      {(attr.totals.onlineRevenue / attr.totals.adSpend).toFixed(2)}x
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-foreground tabular-nums">
                      {fNumber(attr.totals.totalConversions)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-foreground tabular-nums">
                      {fCurrency(attr.totals.costPerConversion)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-foreground tabular-nums">
                      {fPercent(
                        (attr.totals.totalConversions / attr.segmentSize) * 100,
                      )}
                    </span>
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
