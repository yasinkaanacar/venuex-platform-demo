import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useLocales, fCurrency } from "@/lib/formatters";
import type { SegmentPlatformAttribution } from "@/lib/types/segments";

interface SegmentAttributionBreakdownProps {
  platforms: SegmentPlatformAttribution[];
}

const PLATFORM_COLORS: Record<string, string> = {
  google: "#4285F4",
  meta: "#0081FB",
  tiktok: "#1a1a1a",
};

export default function SegmentAttributionBreakdown({
  platforms,
}: SegmentAttributionBreakdownProps) {
  const { t } = useLocales();

  const costData = platforms.map((p) => ({
    name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
    value: p.adSpend,
    color: PLATFORM_COLORS[p.platform] || "#94a3b8",
  }));

  const revenueData = platforms.map((p) => ({
    name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
    value: p.offlineRevenue + p.onlineRevenue,
    color: PLATFORM_COLORS[p.platform] || "#94a3b8",
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        {t("segments.attribution.breakdownTitle") || "Platform Breakdown"}
      </h3>
      <div className="grid grid-cols-2 gap-6">
        {/* Cost by Platform */}
        <div>
          <p className="text-xs font-medium text-muted-foreground text-center mb-2">
            {t("segments.attribution.costByPlatform") || "Cost by Platform"}
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => fCurrency(value)}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-1">
            {costData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Platform */}
        <div>
          <p className="text-xs font-medium text-muted-foreground text-center mb-2">
            {t("segments.attribution.revenueByPlatform") ||
              "Revenue by Platform"}
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {revenueData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => fCurrency(value)}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-1">
            {revenueData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
