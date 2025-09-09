import { useState } from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Chip } from "@mui/material";
import { Button } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import { Platform, Alert as AlertType, Location } from "@shared/schema";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  Store,
  MapPin,
  Package,
  Receipt,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  ArrowDown,
} from "lucide-react";
import { SiGoogle, SiMeta, SiTiktok, SiApple } from "react-icons/si";
import mouseIcon from "@assets/image_1756736100487.png";
import vxLogo from "@assets/vx-logo-1000x1000_1756824361260.png";

interface LocationsDataHealthAlertsProps {
  platforms?: Platform[];
  alerts?: AlertType[];
  locations?: Location[];
  bannerMode?: boolean;
  onScrollToBottom?: () => void;
  alwaysExpanded?: boolean;
  locationsPageMode?: boolean;
}

export default function LocationsDataHealthAlerts({
  platforms = [],
  alerts = [],
  locations = [],
  bannerMode = false,
  onScrollToBottom,
  alwaysExpanded = false,
  locationsPageMode = false,
}: LocationsDataHealthAlertsProps) {
  // Mock alerts and notifications data
  const systemAlerts = [
    {
      id: "1",
      type: "warning",
      icon: AlertTriangle,
      title: "Data sync delay detected",
      description: "Meta Ads data is 15 minutes behind schedule",
      timestamp: "11 minutes ago",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      iconColor: "text-yellow-600",
    },
    {
      id: "2",
      type: "success",
      icon: CheckCircle,
      title: "Data enrichment completed",
      description: "47 location profiles updated with new attributes",
      timestamp: "11 minutes ago",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600",
    },
    {
      id: "3",
      type: "error",
      icon: AlertCircle,
      title: "API rate limit warning",
      description: "Google Ads API approaching rate limit (85% used)",
      timestamp: "11 minutes ago",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-800",
      iconColor: "text-red-600",
    },
  ];

  // Initialize as collapsed by default
  const [isOpen, setIsOpen] = useState(false);

  // Count failed and pending statuses across all platforms
  const countStatuses = () => {
    let failed = 0;
    let pending = 0;

    // Check for failed/pending in each platform section
    const statusChecks = [
      "Failed 1h ago",
      "Pending 15m ago", // Meta Commerce, Google Merchant Center
    ];

    statusChecks.forEach((status) => {
      if (status.includes("Failed")) failed++;
      if (status.includes("Pending")) pending++;
    });

    return { failed, pending };
  };

  const { failed, pending } = countStatuses();

  // Banner mode - simplified status display
  if (bannerMode) {
    return (
      <div
        className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 rounded-lg shadow-none cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors"
        onClick={onScrollToBottom}
      >
        <div className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Typography variant="h6" component="h2">
                Data Health & Flow
              </Typography>
              <div className="flex items-center gap-2">
                {failed === 0 && pending === 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      Everything is well
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">
                      {failed > 0 && `${failed} Failed`}
                      {failed > 0 && pending > 0 && ", "}
                      {pending > 0 && `${pending} Pending`}
                    </span>
                  </>
                )}
              </div>
            </div>

            <Button
              variant="outlined"
              size="small"
              className="text-xs pointer-events-none"
              data-testid="button-scroll-to-bottom"
            >
              <ArrowDown className="w-3 h-3 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Always expanded mode - no collapsible functionality
  if (alwaysExpanded) {
    return (
      <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Data Health & Flow
            </h3>
            <p className="text-sm text-muted-foreground">
              Data flow from source systems through VenueX to platforms
            </p>
          </div>
        </div>

        <div className="bg-[#f9fafb] p-6 space-y-8">
          <div className="relative">
            {/* Vertical VenueX alignment guide */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 transform -translate-x-1/2 z-0"></div>

            <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 py-8 px-6">
              {/* Clean Data Flow Layout */}
              <div className="relative w-full h-[500px]">
                {/* Connection Lines SVG */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1000 400"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* Clean modern arrowheads */}
                    <marker
                      id="arrow-primary"
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <polygon points="0,0 0,6 8,3" fill="#3b82f6" />
                    </marker>
                    <marker
                      id="arrow-success"
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <polygon points="0,0 0,6 8,3" fill="#10b981" />
                    </marker>
                    <marker
                      id="arrow-warning"
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <polygon points="0,0 0,6 8,3" fill="#f59e0b" />
                    </marker>

                    {/* Smooth animated gradients for data flow */}
                    <linearGradient
                      id="flowActive"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="transparent" />
                      <stop
                        offset="20%"
                        stopColor="#10b981"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="50%"
                        stopColor="#10b981"
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="80%"
                        stopColor="#10b981"
                        stopOpacity="0.3"
                      />
                      <stop offset="100%" stopColor="transparent" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        values="-100,0;300,0;-100,0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>

                    <linearGradient
                      id="flowError"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="transparent" />
                      <stop
                        offset="20%"
                        stopColor="#ef4444"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="50%"
                        stopColor="#ef4444"
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="80%"
                        stopColor="#ef4444"
                        stopOpacity="0.3"
                      />
                      <stop offset="100%" stopColor="transparent" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        values="-100,0;300,0;-100,0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>

                    <linearGradient
                      id="flowWarning"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="transparent" />
                      <stop
                        offset="20%"
                        stopColor="#f59e0b"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="50%"
                        stopColor="#f59e0b"
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="80%"
                        stopColor="#f59e0b"
                        stopOpacity="0.3"
                      />
                      <stop offset="100%" stopColor="transparent" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        values="-100,0;300,0;-100,0"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>

                    {/* Subtle shadow filter */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Base connection lines - always visible */}
                  <g opacity="0.3">
                    {/* Straight line from Locations to VenueX */}
                    <path
                      d="M 280 200 L 500 200"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    {/* Fork lines from VenueX to each platform */}
                    <path
                      d="M 500 200 Q 580 200 580 120 L 720 120"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 170 L 720 170"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 230 L 720 230"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 280 L 720 280"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  </g>

                  {/* Status-based colored lines */}
                  <g>
                    {/* Straight line from Locations to VenueX (Online - green line) */}
                    <path
                      d="M 200 200 L 500 200"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />

                    {/* Fork lines from VenueX to each platform (Good sync status - green) */}
                    <path
                      d="M 500 200 Q 580 200 580 120 L 720 120"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 170 L 720 170"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 230 L 720 230"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 280 L 720 280"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />
                  </g>

                  {/* Status-based animated flow overlays */}
                  <g>
                    {/* Locations to VenueX active flow - healthy animation */}
                    <path
                      d="M 280 285 L 500 200"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.9"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.5;0.9;0.5"
                        dur="2s"
                        begin="0.3s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* VenueX to platforms flows are healthy - good sync status */}
                    <path
                      d="M 500 200 Q 580 200 580 120 L 720 120"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.8;0.4"
                        dur="2s"
                        begin="0.8s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 500 200 Q 580 200 580 170 L 720 170"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.9"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.5;0.9;0.5"
                        dur="1.8s"
                        begin="0.2s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 500 200 Q 580 200 580 230 L 720 230"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.8;0.4"
                        dur="2.2s"
                        begin="1.2s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 500 200 Q 580 200 580 280 L 720 280"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.8;0.4"
                        dur="2.4s"
                        begin="1.5s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>

                  {/* Data pulse indicators */}
                  <g>
                    <circle
                      cx="390"
                      cy="200"
                      r="3"
                      fill="#10b981"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values="2;5;2"
                        dur="2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0.3;0.8"
                        dur="2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="580"
                      cy="200"
                      r="3"
                      fill="#10b981"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values="2;5;2"
                        dur="2s"
                        begin="1s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0.3;0.8"
                        dur="2s"
                        begin="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  {/* Connection nodes */}
                  <circle
                    cx="500"
                    cy="200"
                    r="4"
                    fill="#3b82f6"
                    opacity="0.9"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>

                {/* Data Sources - Left Side */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 space-y-6">
                  {locationsPageMode ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-64">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            Locations
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600">
                              Online - Updated 2m ago
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-64">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              Inventory
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-red-600">
                                Error - Last sync 2h ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-64">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              Store Sales
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600">
                                Online - Updated 30s ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-64">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              Locations
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600">
                                Online - Updated 2m ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Central VenueX Hub */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <img
                          src={vxLogo}
                          alt="VenueX"
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div className="mt-3 font-semibold text-foreground">
                        VenueX
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Data Processing Hub
                      </div>
                    </div>
                  </div>
                </div>

                {/* Destination Categories - Right Side */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-2">
                  {locationsPageMode ? (
                    /* Location Platforms Only */
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700 w-56">
                      <div className="text-xs font-semibold text-blue-600 mb-1.5">
                        Location Platforms
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="w-4 h-4 bg-[#EA4335] rounded flex items-center justify-center">
                            <SiGoogle className="w-2.5 h-2.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-foreground">
                              Google Business Profile
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Synced 2m ago
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              M
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-foreground">
                              Meta Pages
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Synced 5m ago
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                            <SiApple className="w-2.5 h-2.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-foreground">
                              Apple Business Connect
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Synced 1h ago
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              Y
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-foreground">
                              Yandex Business
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Synced 15m ago
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Location Platforms */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700 w-56">
                        <div className="text-xs font-semibold text-blue-600 mb-1.5">
                          Location Platforms
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#EA4335] rounded flex items-center justify-center">
                              <SiGoogle className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Google Business Profile
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 2m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                M
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Meta Pages
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 5m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                              <SiApple className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Apple Business Connect
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 1h ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                Y
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Yandex Business
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 15m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>

                      {/* Merchant Platforms */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700 w-56">
                        <div className="text-xs font-semibold text-green-600 mb-1.5">
                          Merchant Platforms
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#34A853] rounded flex items-center justify-center">
                              <SiGoogle className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Google Merchant Center
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Pending 15m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#1877F2] rounded flex items-center justify-center">
                              <SiMeta className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Meta Commerce
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Failed 1h ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                              <SiTiktok className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                TikTok Shop
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 8m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>

                      {/* Ad Platforms */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700 w-56">
                        <div className="text-xs font-semibold text-purple-600 mb-1.5">
                          Ad Platforms
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#4285F4] rounded flex items-center justify-center">
                              <SiGoogle className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Google Ads
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 1m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#1877F2] rounded flex items-center justify-center">
                              <SiMeta className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Meta Ads
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 3m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                              <SiTiktok className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                TikTok Ads
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 12m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Alerts Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Recent Alerts & Notifications
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Recent system alerts and data notifications
                </p>
              </div>

              <Button
                variant="outlined"
                size="small"
                className="text-muted-foreground border-border hover:bg-muted/50"
                data-testid="button-view-all-alerts"
              >
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {systemAlerts.map((alert) => {
                const IconComponent = alert.icon;
                return (
                  <div
                    key={alert.id}
                    className={`${alert.bgColor} ${alert.borderColor} border rounded-lg p-3 flex items-start gap-3`}
                    data-testid={`alert-${alert.id}`}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${alert.iconColor} flex-shrink-0 mt-0.5`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm font-medium text-foreground">
                          {alert.title}
                        </h5>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default collapsible mode
  return (
    <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
      <div
        className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Data Health & Flow
          </h3>
          <p className="text-sm text-muted-foreground">
            Data flow from source systems through VenueX to platforms
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {failed === 0 && pending === 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Everything is well
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">
                  {failed > 0 && `${failed} Failed`}
                  {failed > 0 && pending > 0 && ", "}
                  {pending > 0 && `${pending} Pending`}
                </span>
              </>
            )}
          </div>

          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="bg-[#f9fafb] p-6 space-y-8">
          <div className="relative">
            {/* Vertical VenueX alignment guide */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 transform -translate-x-1/2 z-0"></div>

            <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 py-8 px-6">
              {/* Clean Data Flow Layout */}
              <div className="relative w-full h-[500px]">
                {/* Connection Lines SVG */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1000 400"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* Clean modern arrowheads */}
                    <marker
                      id="arrow-primary"
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <polygon points="0,0 0,6 8,3" fill="#3b82f6" />
                    </marker>
                    <marker
                      id="arrow-success"
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <polygon points="0,0 0,6 8,3" fill="#10b981" />
                    </marker>
                    <marker
                      id="arrow-warning"
                      markerWidth="8"
                      markerHeight="6"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <polygon points="0,0 0,6 8,3" fill="#f59e0b" />
                    </marker>

                    {/* Smooth animated gradients for data flow */}
                    <linearGradient
                      id="flowActive"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="transparent" />
                      <stop
                        offset="20%"
                        stopColor="#10b981"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="50%"
                        stopColor="#10b981"
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="80%"
                        stopColor="#10b981"
                        stopOpacity="0.3"
                      />
                      <stop offset="100%" stopColor="transparent" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        values="-100,0;300,0;-100,0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>

                    <linearGradient
                      id="flowError"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="transparent" />
                      <stop
                        offset="20%"
                        stopColor="#ef4444"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="50%"
                        stopColor="#ef4444"
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="80%"
                        stopColor="#ef4444"
                        stopOpacity="0.3"
                      />
                      <stop offset="100%" stopColor="transparent" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        values="-100,0;300,0;-100,0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>

                    <linearGradient
                      id="flowWarning"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="transparent" />
                      <stop
                        offset="20%"
                        stopColor="#f59e0b"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="50%"
                        stopColor="#f59e0b"
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="80%"
                        stopColor="#f59e0b"
                        stopOpacity="0.3"
                      />
                      <stop offset="100%" stopColor="transparent" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="translate"
                        values="-100,0;300,0;-100,0"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>

                    {/* Subtle shadow filter */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Base connection lines - always visible */}
                  <g opacity="0.3">
                    {/* Straight line from Locations to VenueX */}
                    <path
                      d="M 280 285 L 500 200"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    {/* Fork lines from VenueX to each platform */}
                    <path
                      d="M 500 200 Q 580 200 580 120 L 720 120"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 170 L 720 170"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 230 L 720 230"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 280 L 720 280"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  </g>

                  {/* Status-based colored lines */}
                  <g>
                    {/* Straight line from Locations to VenueX (Online - green line) */}
                    <path
                      d="M 280 285 L 500 200"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />

                    {/* Fork lines from VenueX to each platform (Good sync status - green) */}
                    <path
                      d="M 500 200 Q 580 200 580 120 L 720 120"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 170 L 720 170"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 230 L 720 230"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />
                    <path
                      d="M 500 200 Q 580 200 580 280 L 720 280"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow-success)"
                      opacity="0.8"
                    />
                  </g>

                  {/* Status-based animated flow overlays */}
                  <g>
                    {/* Locations to VenueX active flow - healthy animation */}
                    <path
                      d="M 280 285 L 500 200"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.9"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.5;0.9;0.5"
                        dur="2s"
                        begin="0.3s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* VenueX to platforms flows are healthy - good sync status */}
                    <path
                      d="M 500 200 Q 580 200 580 120 L 720 120"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.8;0.4"
                        dur="2s"
                        begin="0.8s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 500 200 Q 580 200 580 170 L 720 170"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.9"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.5;0.9;0.5"
                        dur="1.8s"
                        begin="0.2s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 500 200 Q 580 200 580 230 L 720 230"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.8;0.4"
                        dur="2.2s"
                        begin="1.2s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d="M 500 200 Q 580 200 580 280 L 720 280"
                      stroke="url(#flowActive)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.8;0.4"
                        dur="2.4s"
                        begin="1.5s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>

                  {/* Data pulse indicators */}
                  <g>
                    <circle
                      cx="390"
                      cy="242"
                      r="3"
                      fill="#10b981"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values="2;5;2"
                        dur="2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0.3;0.8"
                        dur="2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="580"
                      cy="200"
                      r="3"
                      fill="#10b981"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values="2;5;2"
                        dur="2s"
                        begin="1s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0.3;0.8"
                        dur="2s"
                        begin="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  {/* Connection nodes */}
                  <circle
                    cx="500"
                    cy="200"
                    r="4"
                    fill="#3b82f6"
                    opacity="0.9"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>

                {/* Data Sources - Left Side */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 space-y-6">
                  {locationsPageMode ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-64">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            Locations
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600">
                              Online - Updated 2m ago
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-64">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              Inventory
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-red-600">
                                Error - Last sync 2h ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-64">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              Store Sales
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600">
                                Online - Updated 30s ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-64">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              Locations
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600">
                                Online - Updated 2m ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Central VenueX Hub */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <img
                          src={vxLogo}
                          alt="VenueX"
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div className="mt-3 font-semibold text-foreground">
                        VenueX
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Data Processing Hub
                      </div>
                    </div>
                  </div>
                </div>

                {/* Destination Categories - Right Side */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-2">
                  {locationsPageMode ? (
                    /* Location Platforms Only */
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700 w-56">
                      <div className="text-xs font-semibold text-blue-600 mb-1.5">
                        Location Platforms
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="w-4 h-4 bg-[#EA4335] rounded flex items-center justify-center">
                            <SiGoogle className="w-2.5 h-2.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-foreground">
                              Google Business Profile
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Synced 2m ago
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              M
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-foreground">
                              Meta Pages
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Synced 5m ago
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                            <SiApple className="w-2.5 h-2.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-foreground">
                              Apple Business Connect
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Synced 1h ago
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              Y
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-foreground">
                              Yandex Business
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Synced 15m ago
                            </div>
                          </div>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Location Platforms */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700 w-56">
                        <div className="text-xs font-semibold text-blue-600 mb-1.5">
                          Location Platforms
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#EA4335] rounded flex items-center justify-center">
                              <SiGoogle className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Google Business Profile
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 2m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                M
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Meta Pages
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 5m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                              <SiApple className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Apple Business Connect
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 1h ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                Y
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Yandex Business
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 15m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>

                      {/* Merchant Platforms */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700 w-56">
                        <div className="text-xs font-semibold text-green-600 mb-1.5">
                          Merchant Platforms
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#34A853] rounded flex items-center justify-center">
                              <SiGoogle className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Google Merchant Center
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Pending 15m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#1877F2] rounded flex items-center justify-center">
                              <SiMeta className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Meta Commerce
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Failed 1h ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                              <SiTiktok className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                TikTok Shop
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 8m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>

                      {/* Ad Platforms */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700 w-56">
                        <div className="text-xs font-semibold text-purple-600 mb-1.5">
                          Ad Platforms
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#4285F4] rounded flex items-center justify-center">
                              <SiGoogle className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Google Ads
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 1m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#1877F2] rounded flex items-center justify-center">
                              <SiMeta className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                Meta Ads
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 3m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                              <SiTiktok className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">
                                TikTok Ads
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Synced 12m ago
                              </div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Alerts Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Recent Alerts & Notifications
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Recent system alerts and data notifications
                </p>
              </div>

              <Button
                variant="outlined"
                size="small"
                className="text-muted-foreground border-border hover:bg-muted/50"
                data-testid="button-view-all-alerts"
              >
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {systemAlerts.map((alert) => {
                const IconComponent = alert.icon;
                return (
                  <div
                    key={alert.id}
                    className={`${alert.bgColor} ${alert.borderColor} border rounded-lg p-3 flex items-start gap-3`}
                    data-testid={`alert-${alert.id}`}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${alert.iconColor} flex-shrink-0 mt-0.5`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm font-medium text-foreground">
                          {alert.title}
                        </h5>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
