import { Users, Radio, Tag, TrendingUp } from "lucide-react";
import { useLocales, fNumber, fPercent } from "@/lib/formatters";
import { useBrandContext } from "@/hooks/useAuth";
import { useApiSegmentsSummary } from "@/hooks/api";

export default function SegmentSummaryCards() {
  const { t } = useLocales();
  const { brandId } = useBrandContext();
  const { data: summary } = useApiSegmentsSummary({ brandId });

  const cards = [
    {
      title: t("segments.summary.totalSegments") || "Total Segments",
      value: summary ? String(summary.totalSegments) : "—",
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: t("segments.summary.totalAudienceSize") || "Total Audience Size",
      value: summary ? fNumber(summary.totalAudienceSize) : "—",
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      title: t("segments.summary.activePushes") || "Active Platform Pushes",
      value: summary ? String(summary.activePlatformPushes) : "—",
      icon: Radio,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: t("segments.summary.activeLabels") || "Active Labels",
      value: summary ? String(summary.activeLabels) : "—",
      icon: Tag,
      iconColor: "text-teal-600",
      iconBg: "bg-teal-100",
    },
    {
      title: t("segments.summary.avgMatchRate") || "Avg. Match Rate",
      value: summary ? fPercent(summary.avgMatchRate) : "—",
      icon: TrendingUp,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },
  ];

  return (
    <div className="px-6 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="vx-card overflow-hidden shadow-none hover:shadow-sm transition-all duration-200"
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
    </div>
  );
}
