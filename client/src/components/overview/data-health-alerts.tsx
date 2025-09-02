import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Platform, Alert as AlertType, Location } from '@shared/schema';
import { CheckCircle, Clock, XCircle, AlertTriangle, ArrowRight, Database, Store, MapPin, Package, Receipt, AlertCircle, X, ChevronDown, ChevronUp, ArrowDown } from 'lucide-react';
import mouseIcon from '@assets/image_1756736100487.png';

interface DataHealthAlertsProps {
  platforms?: Platform[];
  alerts?: AlertType[];
  locations?: Location[];
  bannerMode?: boolean;
  onScrollToBottom?: () => void;
  alwaysExpanded?: boolean;
}

export default function DataHealthAlerts({ platforms = [], alerts = [], locations = [], bannerMode = false, onScrollToBottom, alwaysExpanded = false }: DataHealthAlertsProps) {
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
              <CardTitle className="text-base font-semibold text-foreground">
                Data Health & Flow
              </CardTitle>
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
              variant="outline" 
              size="sm" 
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
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Data Health & Flow
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Data flow from source systems through VenueX to platforms
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
        <div className="relative">
          {/* Vertical VenueX alignment guide */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 transform -translate-x-1/2 z-0"></div>
          
          <div className="relative bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-blue-950/20 rounded-xl py-8 px-4">
            {/* Central Hub Layout */}
            <div className="relative w-full h-80 flex items-center justify-center">
              
              {/* Background Flow Shape */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1"/>
                    <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                
                {/* Flowing connection shape */}
                <path 
                  d="M 80 160 Q 200 100 400 160 Q 600 220 720 160" 
                  stroke="url(#flowGradient)" 
                  strokeWidth="60" 
                  fill="none"
                  opacity="0.6"
                />
                
                {/* Additional flow lines */}
                <path 
                  d="M 80 120 Q 200 80 400 160 Q 600 240 720 200" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  fill="none"
                  opacity="0.3"
                />
                <path 
                  d="M 80 200 Q 200 120 400 160 Q 600 200 720 120" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  fill="none"
                  opacity="0.3"
                />
              </svg>

              {/* Data Sources - Left Side */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-foreground">Inventory</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-red-600">Error</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">Last sync 2h ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                      <Receipt className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-foreground">Store Sales</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Online</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">Updated 30s ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-foreground">Locations</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Online</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">Updated 2m ago</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Central VenueX Hub */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                    <span className="text-lg font-bold text-white">VenueX</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-foreground">Data Hub</div>
                  <div className="text-xs text-muted-foreground">Processing all data flows</div>
                </div>
              </div>

              {/* Platform Destinations - Right Side */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">G</span>
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-medium text-foreground">Google</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">f</span>
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-medium text-foreground">Facebook</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">📷</span>
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-medium text-foreground">Instagram</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">🍎</span>
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-medium text-foreground">Apple</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">Y</span>
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-medium text-foreground">Yandex</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">🎵</span>
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-medium text-foreground">TikTok</div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Flow Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Real-time data flow active</span>
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
            
            <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium" data-testid="button-view-all-alerts">
              View all
            </Button>
          </div>
          
          <div className="space-y-3">
            {systemAlerts.map((alert) => {
              const IconComponent = alert.icon;
              return (
                <div 
                  key={alert.id}
                  className={`flex items-start justify-between p-4 rounded-lg border-2 ${alert.bgColor} ${alert.borderColor} shadow-sm`}
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
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    data-testid={`close-alert-${alert.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        
      </CardContent>
    </Card>
    );
  }

  // Full mode - original collapsible version
  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Data Health & Flow
              </CardTitle>
              {isOpen ? (
                <p className="text-sm text-muted-foreground">
                  Data flow from source systems through VenueX to platforms
                </p>
              ) : (
                <div className="flex items-center gap-2 mt-1">
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
            </div>
            
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" data-testid="button-toggle-data-health">
                <img src={mouseIcon} alt="Toggle" className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="space-y-8">
        <div className="relative">
          {/* Note: This would contain the same content as above but in collapsible form */}
        </div>
        </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}