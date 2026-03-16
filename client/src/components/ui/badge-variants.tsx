import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataHealth, ChannelStatus } from "@/lib/types/locations";
import { CheckCircle, AlertTriangle, XCircle, Clock, Link, AlertCircle } from "lucide-react";

interface HealthBadgeProps {
  health: DataHealth;
  className?: string;
}

export function HealthBadge({ health, className }: HealthBadgeProps) {
  const configs = {
    HEALTHY: {
      variant: "default" as const,
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
      icon: CheckCircle,
      text: "Healthy"
    },
    WARNING: {
      variant: "secondary" as const,
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      icon: AlertTriangle,
      text: "Warning"
    },
    ERROR: {
      variant: "destructive" as const,
      className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
      icon: XCircle,
      text: "Error"
    }
  };

  const config = configs[health];
  const IconComponent = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, "flex items-center gap-1 px-2 py-1", className)}
      data-testid={`health-badge-${health.toLowerCase()}`}
    >
      <IconComponent className="w-3 h-3" />
      {config.text}
    </Badge>
  );
}

interface ChannelBadgeProps {
  channel: string;
  status: ChannelStatus;
  className?: string;
  showText?: boolean;
}

// Maps lowercase channel identifiers to display labels
const CHANNEL_LABELS: Record<string, string> = {
  google: 'GBP',
  apple: 'Apple',
  meta: 'Meta',
  gmc: 'GMC',
  yandex: 'Yandex',
};

export function ChannelBadge({ channel, status, className, showText = false }: ChannelBadgeProps) {
  const label = CHANNEL_LABELS[channel] ?? channel.toUpperCase();

  const statusConfigs = {
    CONNECTED: {
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
      icon: Link,
      text: "Connected"
    },
    NEEDS_ATTENTION: {
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      icon: AlertCircle,
      text: "Needs Attention"
    },
    NOT_CONNECTED: {
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800",
      icon: XCircle,
      text: "Not Connected"
    }
  };

  const statusConfig = statusConfigs[status];
  const IconComponent = statusConfig.icon;

  return (
    <Badge 
      variant="outline"
      className={cn(statusConfig.className, "flex items-center gap-1 px-2 py-1 text-xs", className)}
      data-testid={`channel-badge-${channel.toLowerCase()}-${status.toLowerCase().replace('_', '-')}`}
    >
      <IconComponent className="w-3 h-3" />
      <span className="font-medium">{label}</span>
      {showText && <span className="ml-1">{statusConfig.text}</span>}
    </Badge>
  );
}