import {
  ComposedChart,
  Bar,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLocales, fCurrency } from "@/lib/formatters";
import type { SegmentAttribution } from "@/lib/types/segments";

interface SegmentAttributionChartProps {
  attributions: SegmentAttribution[];
  expandedSegmentId?: string | null;
  onSegmentClick?: (segmentId: string) => void;
}

export default function SegmentAttributionChart({
  attributions,
  expandedSegmentId,
  onSegmentClick,
}: SegmentAttributionChartProps) {
  const { t } = useLocales();

  const sorted = [...attributions].sort(
    (a, b) => b.totals.omniROAS - a.totals.omniROAS,
  );

  const data = sorted.map((a) => ({
    segmentId: a.segmentId,
    name:
      a.segmentName.length > 16
        ? a.segmentName.slice(0, 14) + "..."
        : a.segmentName,
    revenue: a.totals.totalRevenue,
    adSpend: a.totals.adSpend,
    roas: a.totals.omniROAS,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        {t("segments.attribution.chartTitle") ||
          "Segment Performance Comparison"}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          onClick={(state) => {
            if (state?.activePayload?.[0]?.payload?.segmentId && onSegmentClick) {
              onSegmentClick(state.activePayload[0].payload.segmentId);
            }
          }}
          style={{ cursor: onSegmentClick ? "pointer" : undefined }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(v: number) => `₺${(v / 1000).toFixed(0)}K`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(v: number) => `${v}x`}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "roas") return [`${value.toFixed(2)}x`, "ROAS"];
              return [fCurrency(value), name === "revenue" ? (t("segments.attribution.chartRevenue") || "Revenue") : "Ad Spend"];
            }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value: string) => {
              if (value === "revenue")
                return t("segments.attribution.chartRevenue") || "Revenue";
              if (value === "adSpend")
                return t("segments.attribution.totalAdSpend") || "Ad Spend";
              if (value === "roas")
                return t("segments.attribution.chartRoas") || "ROAS";
              return value;
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={32}
          >
            {data.map((entry) => (
              <Cell
                key={entry.segmentId}
                fill="#3b82f6"
                fillOpacity={
                  expandedSegmentId && expandedSegmentId !== entry.segmentId
                    ? 0.35
                    : 1
                }
              />
            ))}
          </Bar>
          <Bar
            yAxisId="left"
            dataKey="adSpend"
            fill="#f97316"
            radius={[4, 4, 0, 0]}
            barSize={32}
          >
            {data.map((entry) => (
              <Cell
                key={entry.segmentId}
                fill="#f97316"
                fillOpacity={
                  expandedSegmentId && expandedSegmentId !== entry.segmentId
                    ? 0.35
                    : 1
                }
              />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="roas"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#8b5cf6" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
