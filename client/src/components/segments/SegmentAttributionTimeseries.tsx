import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLocales, fCurrency } from "@/lib/formatters";
import { DataErrorState } from "@/components/shared/data-states";
import type { AttributionTimeseriesPoint } from "@/lib/types/segments";

interface SegmentAttributionTimeseriesProps {
  segmentId: string;
  segmentName: string;
}

export default function SegmentAttributionTimeseries({
  segmentId,
  segmentName,
}: SegmentAttributionTimeseriesProps) {
  const { t } = useLocales();

  const { data: timeseries = [], isLoading, isError } = useQuery<
    AttributionTimeseriesPoint[]
  >({
    queryKey: [`${QUERY_KEYS.SEGMENTS_ATTRIBUTION_TIMESERIES}/${segmentId}`],
    enabled: !!segmentId,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-[200px] bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <DataErrorState message="Failed to load attribution data." />
      </div>
    );
  }

  if (timeseries.length === 0) return null;

  const chartData = timeseries.map((p) => ({
    date: new Date(p.date).toLocaleDateString("tr-TR", {
      month: "short",
      day: "numeric",
    }),
    adSpend: p.adSpend,
    offlineRevenue: p.offlineRevenue,
    onlineRevenue: p.onlineRevenue,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        {t("segments.attribution.timeseriesTitle") || "Daily Trend"}
      </h3>
      <p className="text-xs text-muted-foreground mb-4">{segmentName}</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="colorOfflineRev"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="colorOnlineRev"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(v: number) => `₺${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                adSpend:
                  t("segments.attribution.timeseriesSpend") || "Ad Spend",
                offlineRevenue:
                  t("segments.attribution.timeseriesOffline") ||
                  "Offline Revenue",
                onlineRevenue:
                  t("segments.attribution.timeseriesOnline") ||
                  "Online Revenue",
              };
              return [fCurrency(value), labels[name] || name];
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
              const labels: Record<string, string> = {
                adSpend:
                  t("segments.attribution.timeseriesSpend") || "Ad Spend",
                offlineRevenue:
                  t("segments.attribution.timeseriesOffline") ||
                  "Offline Revenue",
                onlineRevenue:
                  t("segments.attribution.timeseriesOnline") ||
                  "Online Revenue",
              };
              return labels[value] || value;
            }}
          />
          <Area
            type="monotone"
            dataKey="adSpend"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#colorSpend)"
          />
          <Area
            type="monotone"
            dataKey="offlineRevenue"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorOfflineRev)"
          />
          <Area
            type="monotone"
            dataKey="onlineRevenue"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorOnlineRev)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
