import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Target,
  BarChart3,
} from "lucide-react";
import { useLocales, fCurrency, fNumber, fPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { SegmentAttribution } from "@/lib/types/segments";

interface SegmentAttributionKPIsProps {
  attributions: SegmentAttribution[];
}

interface KPICardProps {
  label: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  iconBg: string;
}

function KPICard({ label, value, trend, icon, iconBg }: KPICardProps) {
  return (
    <div className="vx-card shadow-none hover:shadow-sm transition-all duration-200">
      <div className="vx-card-body pt-4">
        <div className="flex items-start justify-between mb-2">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center",
              iconBg,
            )}
          >
            {icon}
          </div>
          {trend !== undefined && trend !== 0 && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                trend > 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend > 0 ? "+" : ""}
              {fPercent(Math.abs(trend))}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-lg font-bold text-foreground tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function SegmentAttributionKPIs({
  attributions,
}: SegmentAttributionKPIsProps) {
  const { t } = useLocales();

  // Aggregate totals across all segments
  const totals = attributions.reduce(
    (acc, a) => ({
      adSpend: acc.adSpend + a.totals.adSpend,
      offlineRevenue: acc.offlineRevenue + a.totals.offlineRevenue,
      onlineRevenue: acc.onlineRevenue + a.totals.onlineRevenue,
      totalRevenue: acc.totalRevenue + a.totals.totalRevenue,
      offlineConversions:
        acc.offlineConversions + a.totals.offlineConversions,
      totalConversions: acc.totalConversions + a.totals.totalConversions,
    }),
    {
      adSpend: 0,
      offlineRevenue: 0,
      onlineRevenue: 0,
      totalRevenue: 0,
      offlineConversions: 0,
      totalConversions: 0,
    },
  );

  const avgTrend = attributions.length > 0
    ? {
        revenue:
          attributions.reduce((a, attr) => a + attr.trend.revenueChange, 0) /
          attributions.length,
        roas:
          attributions.reduce((a, attr) => a + attr.trend.roasChange, 0) /
          attributions.length,
        conversions:
          attributions.reduce((a, attr) => a + attr.trend.conversionsChange, 0) /
          attributions.length,
      }
    : { revenue: 0, roas: 0, conversions: 0 };

  const omniROAS =
    totals.adSpend > 0
      ? totals.totalRevenue / totals.adSpend
      : 0;

  const offlineROAS =
    totals.adSpend > 0
      ? totals.offlineRevenue / totals.adSpend
      : 0;

  const costPerConversion =
    totals.totalConversions > 0
      ? totals.adSpend / totals.totalConversions
      : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard
        label={t("segments.attribution.totalAdSpend") || "Total Ad Spend"}
        value={fCurrency(totals.adSpend)}
        icon={<DollarSign className="w-4 h-4 text-red-600" />}
        iconBg="bg-red-50"
      />
      <KPICard
        label={t("segments.attribution.totalRevenue") || "Total Revenue"}
        value={fCurrency(totals.totalRevenue)}
        trend={avgTrend.revenue}
        icon={<TrendingUp className="w-4 h-4 text-green-600" />}
        iconBg="bg-green-50"
      />
      <KPICard
        label={t("segments.attribution.offlineROAS") || "Offline ROAS"}
        value={`${offlineROAS.toFixed(2)}x`}
        icon={<Target className="w-4 h-4 text-blue-600" />}
        iconBg="bg-blue-50"
      />
      <KPICard
        label={t("segments.attribution.omniROAS") || "Omni ROAS"}
        value={`${omniROAS.toFixed(2)}x`}
        trend={avgTrend.roas}
        icon={<BarChart3 className="w-4 h-4 text-purple-600" />}
        iconBg="bg-purple-50"
      />
      <KPICard
        label={t("segments.attribution.totalConversions") || "Total Conversions"}
        value={fNumber(totals.totalConversions)}
        trend={avgTrend.conversions}
        icon={<ShoppingCart className="w-4 h-4 text-orange-600" />}
        iconBg="bg-orange-50"
      />
      <KPICard
        label={t("segments.attribution.costPerConversion") || "Cost per Conversion"}
        value={fCurrency(costPerConversion)}
        icon={<DollarSign className="w-4 h-4 text-gray-600" />}
        iconBg="bg-gray-100"
      />
    </div>
  );
}
