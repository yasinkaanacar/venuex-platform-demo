import { useState } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Chip } from '@mui/material';
import { Button } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Alert, AlertTitle } from '@mui/material';
import { Card as ShadcnCard, CardContent as ShadcnCardContent, CardHeader as ShadcnCardHeader, CardTitle } from '@/components/ui/card';
import { Platform, Alert as AlertType, Location } from '@shared/schema';
import { CheckCircle, Clock, XCircle, AlertTriangle, ArrowRight, Database, Store, MapPin, Package, Receipt, AlertCircle, X, ChevronDown, ChevronUp, ArrowDown } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import mouseIcon from '@assets/image_1756736100487.png';
import vxLogo from '@assets/vx-logo-1000x1000_1756824361260.png';

interface DataHealthAlertsProps {
  platforms?: Platform[];
  alerts?: AlertType[];
  locations?: Location[];
  bannerMode?: boolean;
  onScrollToBottom?: () => void;
  alwaysExpanded?: boolean;
  locationsPageMode?: boolean;
}

export default function DataHealthAlerts({ platforms = [], alerts = [], locations = [], bannerMode = false, onScrollToBottom, alwaysExpanded = false, locationsPageMode = false }: DataHealthAlertsProps) {
  // Mock alerts and notifications data
  const systemAlerts = [
    {
      id: '1',
      type: 'warning',
      icon: AlertTriangle,
      title: 'Data sync delay detected',
      description: 'Meta Ads data is 15 minutes behind schedule',
      timestamp: '11 minutes ago',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600'
    },
    {
      id: '2',
      type: 'success',
      icon: CheckCircle,
      title: 'Data enrichment completed',
      description: '47 location profiles updated with new attributes',
      timestamp: '11 minutes ago',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600'
    },
    {
      id: '3',
      type: 'error',
      icon: AlertCircle,
      title: 'API rate limit warning',
      description: 'Google Ads API approaching rate limit (85% used)',
      timestamp: '11 minutes ago',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600'
    }
  ];

  // Initialize as collapsed by default
  const [isOpen, setIsOpen] = useState(false);

  // Count failed and pending statuses across all platforms
  const countStatuses = () => {
    let failed = 0;
    let pending = 0;
    
    // Check for failed/pending in each platform section
    const statusChecks = [
      'Failed 1h ago', 'Pending 15m ago' // Meta Commerce, Google Merchant Center
    ];
    
    statusChecks.forEach(status => {
      if (status.includes('Failed')) failed++;
      if (status.includes('Pending')) pending++;
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
                    <span className="text-sm text-green-600 font-medium">Everything is well</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">
                      {failed > 0 && `${failed} Failed`}{failed > 0 && pending > 0 && ', '}{pending > 0 && `${pending} Pending`}
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
      <ShadcnCard>
        <ShadcnCardHeader>
          <CardTitle>Data Health & Flow</CardTitle>
          <p className="text-sm text-muted-foreground">Data flow from source systems through VenueX to platforms</p>
        </ShadcnCardHeader>
        
        <ShadcnCardContent className="space-y-8">
        <div className="relative">
          {/* Vertical VenueX alignment guide */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 transform -translate-x-1/2 z-0"></div>
          
          <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 py-4 px-6">
            {/* Clean Data Flow Layout */}
            <div className="relative w-full h-[400px]">
              
              {/* Connection Lines SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Clean modern arrowheads */}
                  <marker id="arrow-primary" markerWidth="8" markerHeight="6" 
                    refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0,0 0,6 8,3" fill="#3b82f6" />
                  </marker>
                  <marker id="arrow-success" markerWidth="8" markerHeight="6" 
                    refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0,0 0,6 8,3" fill="#10b981" />
                  </marker>
                  <marker id="arrow-warning" markerWidth="8" markerHeight="6" 
                    refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0,0 0,6 8,3" fill="#f59e0b" />
                  </marker>
                  <marker id="arrow-error" markerWidth="8" markerHeight="6" 
                    refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0,0 0,6 8,3" fill="#ef4444" />
                  </marker>
                  
                  {/* Smooth animated gradients for data flow */}
                  <linearGradient id="flowActive" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="20%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="transparent" />
                    <animateTransform
                      attributeName="gradientTransform"
                      type="translate"
                      values="-100,0;300,0;-100,0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </linearGradient>
                  
                  <linearGradient id="flowError" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="20%" stopColor="#ef4444" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#ef4444" stopOpacity="0.7" />
                    <stop offset="80%" stopColor="#ef4444" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="transparent" />
                    <animateTransform
                      attributeName="gradientTransform"
                      type="translate"
                      values="-100,0;300,0;-100,0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </linearGradient>
                  
                  <linearGradient id="flowWarning" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="20%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7" />
                    <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.3" />
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
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Base connection lines - always visible */}
                <g opacity="0.3">
                  {/* Location Data to VenueX */}
                  <path d="M 280 150 L 460 250" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  {/* Inventory Data to VenueX */}
                  <path d="M 280 250 L 460 250" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  {/* Sales Data to VenueX */}
                  <path d="M 280 350 L 460 250" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  {/* VenueX to Ad Platforms */}
                  <path d="M 540 250 L 720 250" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                </g>
                
                {/* Status-based colored lines */}
                <g>
                  {/* Location Data (Active - blue/green line) */}
                  <path d="M 280 150 L 460 250" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrow-success)" opacity="0.8" />
                  {/* Inventory Data (Syncing - yellow line) */}
                  <path d="M 280 250 L 460 250" stroke="#f59e0b" strokeWidth="3" fill="none" markerEnd="url(#arrow-warning)" opacity="0.8" />
                  {/* Sales Data (Active - green line) */}
                  <path d="M 280 350 L 460 250" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrow-success)" opacity="0.8" />
                  {/* VenueX to Ad Platforms (Good sync status - green) */}
                  <path d="M 540 250 L 720 250" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrow-success)" opacity="0.8" />
                </g>
                
                {/* Status-based animated flow overlays */}
                <g>
                  {/* Location Data flow */}
                  <path d="M 280 150 L 460 250" stroke="url(#flowActive)" strokeWidth="2" fill="none" opacity="0.8">
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin="0s" repeatCount="indefinite"/>
                  </path>
                  {/* Inventory Data flow */}
                  <path d="M 280 250 L 460 250" stroke="url(#flowWarning)" strokeWidth="2" fill="none" opacity="0.8">
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" begin="0.3s" repeatCount="indefinite"/>
                  </path>
                  {/* Sales Data flow */}
                  <path d="M 280 350 L 460 250" stroke="url(#flowActive)" strokeWidth="2" fill="none" opacity="0.8">
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin="0.6s" repeatCount="indefinite"/>
                  </path>
                  {/* VenueX to Ad Platforms flow */}
                  <path d="M 540 250 L 720 250" stroke="url(#flowActive)" strokeWidth="2" fill="none" opacity="0.9">
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.8s" begin="0.2s" repeatCount="indefinite"/>
                  </path>
                </g>
                
                {/* Data pulse indicators */}
                <g>
                  <circle cx="370" cy="200" r="3" fill="#10b981" opacity="0.8">
                    <animate attributeName="r" values="2;5;2" dur="2s" begin="0s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="0s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="370" cy="250" r="3" fill="#f59e0b" opacity="0.8">
                    <animate attributeName="r" values="2;5;2" dur="2.5s" begin="0.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" begin="0.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="370" cy="300" r="3" fill="#10b981" opacity="0.8">
                    <animate attributeName="r" values="2;5;2" dur="2s" begin="1s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="1s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="625" cy="250" r="3" fill="#10b981" opacity="0.8">
                    <animate attributeName="r" values="2;5;2" dur="2s" begin="1.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="1.5s" repeatCount="indefinite"/>
                  </circle>
                </g>
                
                {/* Connection nodes */}
                <circle cx="460" cy="250" r="4" fill="#3b82f6" opacity="0.9" stroke="#ffffff" strokeWidth="2"/>
                <circle cx="540" cy="250" r="4" fill="#3b82f6" opacity="0.9" stroke="#ffffff" strokeWidth="2"/>
              </svg>

              {/* Data Sources - Left Side */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                <div className="space-y-3">
                  {/* Location Data */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 w-56">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">Location Data</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Data */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 w-56">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">Inventory Data</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs text-yellow-600">Syncing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* In-Store Sales Data */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 w-56">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">In-Store Sales</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Central VenueX Hub */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <img src={vxLogo} alt="VenueX" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="mt-2 font-semibold text-foreground">VenueX</div>
                    <div className="text-xs text-muted-foreground">Data Processing Hub</div>
                  </div>
                </div>
              </div>

              {/* Destination Categories - Right Side */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                {/* Ad Platforms Only */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700 w-48">
                  <div className="text-xs font-semibold text-purple-600 mb-1.5">Ad Platforms</div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="w-4 h-4 bg-[#EA4335] rounded flex items-center justify-center">
                        <SiGoogle className="w-2.5 h-2.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-foreground">Google Ads</div>
                        <div className="text-xs text-muted-foreground">Synced 10m ago</div>
                      </div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-xs text-white font-bold">M</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-foreground">Meta Ads</div>
                        <div className="text-xs text-muted-foreground">Synced 3m ago</div>
                      </div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                        <SiTiktok className="w-2.5 h-2.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-foreground">TikTok Ads</div>
                        <div className="text-xs text-muted-foreground">Synced 7m ago</div>
                      </div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alerts & Notifications Section */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Alerts & Notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                Recent system alerts and data notifications
              </p>
            </div>
            
            <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-alerts">
              View All →
            </button>
          </div>
          
          <div className="space-y-3">
            {systemAlerts.map((alert) => {
              const IconComponent = alert.icon;
              return (
                <div 
                  key={alert.id}
                  className={`flex items-start p-4 rounded-lg border-2 ${alert.bgColor} ${alert.borderColor} shadow-sm`}
                  data-testid={`alert-${alert.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${alert.iconColor} mt-0.5`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground mb-1">
                        {alert.title}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {alert.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        </ShadcnCardContent>
      </ShadcnCard>
    );
  }

  // Full mode - original collapsible version
  return (
    <Card sx={{ mb: 2 }}>
      <Accordion expanded={isOpen} onChange={() => setIsOpen(!isOpen)}>
        <CardHeader
          title="Data Health & Flow"
          subheader={isOpen ? "Data flow from source systems through VenueX to platforms" : undefined}
          action={
            <div className="flex items-center gap-2">
              {!isOpen && (
                <div className="flex items-center gap-2">
                  {failed === 0 && pending === 0 ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Everything is well</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">
                        {failed > 0 && `${failed} Failed`}{failed > 0 && pending > 0 && ', '}{pending > 0 && `${pending} Pending`}
                      </span>
                    </>
                  )}
                </div>
              )}
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Button variant="text" size="small" className="h-8 w-8 p-0" data-testid="button-toggle-data-health">
                  <img src={mouseIcon} alt="Toggle" className="h-4 w-4" />
                </Button>
              </AccordionSummary>
            </div>
          }
        />
        
        <AccordionDetails>
          <CardContent sx={{ '& > *': { mb: 2 } }}>
        <div className="relative">
          {/* Note: This would contain the same content as above but in collapsible form */}
        </div>
        </CardContent>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}