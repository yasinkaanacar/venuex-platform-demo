import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useLocales, fCurrency, fNumber, fPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type {
  SegmentPerformanceDetail,
  PlatformPerformance,
  CampaignPerformance,
  PerformancePeriod,
  AdPlatform,
  AttributionConfidence,
} from "@/lib/types/segments";

// ------------------------------------------------------------------
// Config
// ------------------------------------------------------------------

const PLATFORM_CONFIG: Record<
  AdPlatform,
  { name: string; icon: React.ReactNode; color: string }
> = {
  google: {
    name: "Google Ads",
    icon: <SiGoogle className="w-5 h-5 text-[#4285F4]" />,
    color: "#4285F4",
  },
  meta: {
    name: "Meta Ads",
    icon: <SiMeta className="w-5 h-5 text-[#0081FB]" />,
    color: "#0081FB",
  },
  tiktok: {
    name: "TikTok Ads",
    icon: <SiTiktok className="w-5 h-5 text-[#000000]" />,
    color: "#000000",
  },
};

const CONFIDENCE_STYLES: Record<
  AttributionConfidence,
  { bg: string; text: string }
> = {
  direct: { bg: "bg-green-100", text: "text-green-700" },
  estimated: { bg: "bg-yellow-100", text: "text-yellow-700" },
};

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function PeriodSelector({
  value,
  onChange,
}: {
  value: PerformancePeriod;
  onChange: (p: PerformancePeriod) => void;
}) {
  const { t } = useLocales();
  const periods: PerformancePeriod[] = ["7d", "30d", "90d"];
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
      {periods.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-md transition-colors",
            value === p
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(`segments.performance.period${p}`) || p.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function TrendIndicator({ value }: { value: number }) {
  if (value === 0) return null;
  const isPositive = value > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        isPositive ? "text-green-600" : "text-red-600",
      )}
    >
      {isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {isPositive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function ConfidenceBadge({
  confidence,
  t,
}: {
  confidence: AttributionConfidence;
  t: (key: string) => string;
}) {
  const style = CONFIDENCE_STYLES[confidence];
  const label =
    confidence === "direct"
      ? t("segments.performance.confidenceDirect") || "Direct"
      : t("segments.performance.confidenceEstimated") || "Estimated";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        style.bg,
        style.text,
      )}
    >
      {label}
    </span>
  );
}

function PlatformPerformanceCard({ data, t }: { data: PlatformPerformance; t: (key: string) => string }) {
  const config = PLATFORM_CONFIG[data.platform];

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {config.icon}
          <span className="text-sm font-medium">{config.name}</span>
        </div>
        <ConfidenceBadge confidence={data.confidence} t={t} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {t("segments.performance.spend") || "Spend"}
          </p>
          <p className="text-sm font-semibold">{fCurrency(data.spend)}</p>
          <TrendIndicator value={data.trend.spendChange} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {t("segments.performance.conversions") || "Conversions"}
          </p>
          <p className="text-sm font-semibold">{fNumber(data.conversions)}</p>
          <TrendIndicator value={data.trend.conversionsChange} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {t("segments.performance.roas") || "ROAS"}
          </p>
          <p className="text-sm font-semibold">{data.roas.toFixed(1)}x</p>
          <TrendIndicator value={data.trend.roasChange} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {t("segments.performance.matchRate") || "Match Rate"}
          </p>
          <p className="text-sm font-semibold">{fPercent(data.matchRate)}</p>
        </div>
      </div>
    </div>
  );
}

function ROASChart({
  timeseries,
  platforms,
  t,
}: {
  timeseries: SegmentPerformanceDetail["timeseries"];
  platforms: AdPlatform[];
  t: (key: string) => string;
}) {
  const chartData = timeseries.map((point) => ({
    date: point.date.slice(5), // "02-15" format
    combined: point.roas,
    ...(point.google ? { google: point.google.roas } : {}),
    ...(point.meta ? { meta: point.meta.roas } : {}),
    ...(point.tiktok ? { tiktok: point.tiktok.roas } : {}),
  }));

  return (
    <div className="rounded-lg border bg-white p-4">
      <h5 className="text-sm font-semibold mb-3">
        {t("segments.performance.chartTitle") || "ROAS Over Time"}
      </h5>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
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
            tickFormatter={(v: number) => `${v}x`}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const label =
                name === "combined"
                  ? t("segments.performance.combined") || "Combined"
                  : PLATFORM_CONFIG[name as AdPlatform]?.name || name;
              return [`${value.toFixed(2)}x`, label];
            }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value: string) =>
              value === "combined"
                ? t("segments.performance.combined") || "Combined"
                : PLATFORM_CONFIG[value as AdPlatform]?.name || value
            }
          />
          <Line
            type="monotone"
            dataKey="combined"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
          />
          {platforms.includes("google") && (
            <Line
              type="monotone"
              dataKey="google"
              stroke="#4285F4"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
            />
          )}
          {platforms.includes("meta") && (
            <Line
              type="monotone"
              dataKey="meta"
              stroke="#0081FB"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
            />
          )}
          {platforms.includes("tiktok") && (
            <Line
              type="monotone"
              dataKey="tiktok"
              stroke="#000000"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CampaignBreakdownTable({
  campaigns,
  t,
}: {
  campaigns: CampaignPerformance[];
  t: (key: string) => string;
}) {
  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30">
        <h5 className="text-sm font-semibold">
          {t("segments.performance.campaignBreakdown") || "Campaign Breakdown"}
        </h5>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                {t("segments.performance.campaignName") || "Campaign Name"}
              </th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                {t("segments.performance.spend") || "Spend"}
              </th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                {t("segments.performance.conversions") || "Conv."}
              </th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                {t("segments.performance.roas") || "ROAS"}
              </th>
              <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                {t("segments.performance.confidence") || "Conf."}
              </th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const platCfg = PLATFORM_CONFIG[c.platform];
              return (
                <tr
                  key={c.id}
                  className="border-b last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0">{platCfg.icon}</span>
                      <span className="font-medium text-foreground">
                        {c.campaignName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium">
                    {fCurrency(c.spend)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium">
                    {fNumber(c.conversions)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium">
                    {c.roas.toFixed(1)}x
                  </td>
                  <td className="px-3 py-2 text-center">
                    <ConfidenceBadge confidence={c.confidence} t={t} />
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

// ------------------------------------------------------------------
// Main component
// ------------------------------------------------------------------

interface SegmentPerformanceTabProps {
  segmentId: string;
}

export default function SegmentPerformanceTab({
  segmentId,
}: SegmentPerformanceTabProps) {
  const { t } = useLocales();
  const [period, setPeriod] = useState<PerformancePeriod>("30d");

  const { data: detail, isLoading, isError } = useQuery<SegmentPerformanceDetail | null>(
    {
      queryKey: [
        `${QUERY_KEYS.SEGMENTS_PERFORMANCE_DETAIL}/${segmentId}/${period}`,
      ],
      enabled: !!segmentId,
    },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
        <p className="text-sm font-medium text-red-500">Failed to load performance data</p>
      </div>
    );
  }

  if (!detail || detail.campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground">
          {t("segments.performance.noActiveCampaigns") ||
            "No active campaigns"}
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
          {t("segments.performance.noActiveCampaignsDesc") ||
            "This segment has been pushed but is not yet used in any campaigns."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Header with period selector */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          {t("segments.performance.platformPerformance") ||
            "Platform Performance"}
        </h4>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Platform cards */}
      <div className="space-y-3">
        {detail.platforms.map((p) => (
          <PlatformPerformanceCard key={p.platform} data={p} t={t} />
        ))}
      </div>

      {/* ROAS chart */}
      <ROASChart
        timeseries={detail.timeseries}
        platforms={detail.platforms.map((p) => p.platform)}
        t={t}
      />

      {/* Campaign breakdown */}
      <CampaignBreakdownTable campaigns={detail.campaigns} t={t} />
    </div>
  );
}
