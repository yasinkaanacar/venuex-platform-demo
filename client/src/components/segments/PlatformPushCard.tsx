import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { CheckCircle } from "lucide-react";
import { useLocales, fNumber, fPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { AdPlatform } from "@/lib/types/segments";

interface PlatformPushCardProps {
  platform: "google" | "meta" | "tiktok";
  audienceCount: number;
  avgMatchRate: number;
  isConnected: boolean;
}

const platformConfig: Record<
  AdPlatform,
  {
    name: string;
    icon: React.ReactNode;
    iconBg: string;
  }
> = {
  google: {
    name: "Google",
    icon: <SiGoogle className="w-8 h-8 text-blue-500" />,
    iconBg: "bg-blue-50",
  },
  meta: {
    name: "Meta",
    icon: <SiMeta className="w-8 h-8 text-blue-600" />,
    iconBg: "bg-blue-50",
  },
  tiktok: {
    name: "TikTok",
    icon: <SiTiktok className="w-8 h-8 text-gray-900" />,
    iconBg: "bg-gray-50",
  },
};

export default function PlatformPushCard({
  platform,
  audienceCount,
  avgMatchRate,
  isConnected,
}: PlatformPushCardProps) {
  const { t } = useLocales();
  const config = platformConfig[platform];

  return (
    <div className="vx-card shadow-none hover:shadow-sm transition-all duration-200">
      <div className="vx-card-body pt-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                config.iconBg
              )}
            >
              {config.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {config.name}
              </h3>
              {isConnected && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                  <CheckCircle className="w-3 h-3" />
                  {t("segments.push.connected") || "Connected"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{t("segments.push.audiencesLabel") || "Audiences"}</p>
            <p className="text-lg font-bold text-foreground">
              {audienceCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">
              {t("segments.push.avgMatchRate") || "Avg. Match Rate"}
            </p>
            <p className="text-lg font-bold text-foreground">
              {avgMatchRate > 0 ? fPercent(avgMatchRate) : "--"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
