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
      <Card className="border border-border/30 bg-muted/20">
        <CardContent className="py-3 px-4">
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
              onClick={onScrollToBottom}
              className="text-xs"
              data-testid="button-scroll-to-bottom"
            >
              <ArrowDown className="w-3 h-3 mr-1" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
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
          
          <div className="space-y-6 relative z-10">
            {/* Location Data Flow */}
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="mb-4 -mt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">Location Data</span>
                </div>
              </div>
              <div className="relative w-full h-20 flex items-center">
                <svg className="absolute inset-0 w-full h-full z-[1]">
                  <defs>
                    <pattern id="greenDotted" patternUnits="userSpaceOnUse" width="8" height="2">
                      <circle cx="4" cy="1" r="1" fill="#22c55e" />
                    </pattern>
                  </defs>
                  {/* Source to VenueX line - aligned with logo centers */}
                  <line x1="20%" y1="35%" x2="48%" y2="35%" stroke="url(#greenDotted)" strokeWidth="2" />
                  {/* VenueX to Platforms line - stops before platforms */}
                  <line x1="52%" y1="50%" x2="75%" y2="50%" stroke="url(#greenDotted)" strokeWidth="2" />
                </svg>
                
                <div className="absolute left-[4%] top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-muted rounded-lg flex items-center justify-center mb-1">
                      <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground text-center whitespace-nowrap">Store Systems</span>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Updated 2m ago</span>
                  </div>
                </div>
                
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
                      <span className="text-xs font-bold text-primary">VX</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">VenueX</span>
                  </div>
                </div>
                
                <div className="absolute right-[4%] top-[45%] transform -translate-y-1/2 z-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">G</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Google Business Profile</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-green-600 whitespace-nowrap">Synced 1m ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">f</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Meta Pages</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-green-600 whitespace-nowrap">Synced 3m ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">🍎</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Apple Business Connect</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-green-600 whitespace-nowrap">Synced 5m ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">Y</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Yandex Business</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-green-600 whitespace-nowrap">Synced 4m ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Data Flow */}
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-sm">Inventory Data</span>
                </div>
              </div>
              <div className="relative w-full h-20 flex items-center">
                <svg className="absolute inset-0 w-full h-full z-[1]">
                  <defs>
                    <pattern id="redDotted" patternUnits="userSpaceOnUse" width="8" height="2">
                      <circle cx="4" cy="1" r="1" fill="#ef4444" />
                    </pattern>
                  </defs>
                  {/* Source to VenueX line - aligned with logo centers */}
                  <line x1="20%" y1="35%" x2="48%" y2="35%" stroke="url(#redDotted)" strokeWidth="2" />
                  {/* VenueX to Platforms line - stops before platforms */}
                  <line x1="52%" y1="50%" x2="75%" y2="50%" stroke="url(#redDotted)" strokeWidth="2" />
                </svg>
                
                <div className="absolute left-[4%] top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-muted rounded-lg flex items-center justify-center mb-1">
                      <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground text-center whitespace-nowrap">ERP Systems</span>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-red-600">Error</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Last sync 2h ago</span>
                  </div>
                </div>
                
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
                      <span className="text-xs font-bold text-primary">VX</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">VenueX</span>
                  </div>
                </div>
                
                <div className="absolute right-[4%] top-[45%] transform -translate-y-1/2 z-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">G</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Google Merchant Center</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 bg-yellow-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-yellow-600 whitespace-nowrap">Pending 15m ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">f</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Meta Commerce</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-red-600 whitespace-nowrap">Failed 1h ago</span>
                          <button className="ml-1 px-1 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700" data-testid="button-connect-meta">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* In-Store Sales Data Flow */}
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-sm">In-Store Sales Data</span>
                </div>
              </div>
              <div className="relative w-full h-20 flex items-center">
                <svg className="absolute inset-0 w-full h-full z-[1]">
                  <defs>
                    <pattern id="greenDotted2" patternUnits="userSpaceOnUse" width="8" height="2">
                      <circle cx="4" cy="1" r="1" fill="#22c55e" />
                    </pattern>
                  </defs>
                  {/* Source to VenueX line - aligned with logo centers */}
                  <line x1="20%" y1="35%" x2="48%" y2="35%" stroke="url(#greenDotted2)" strokeWidth="2" />
                  {/* VenueX to Platforms line - stops before platforms */}
                  <line x1="52%" y1="50%" x2="75%" y2="50%" stroke="url(#greenDotted2)" strokeWidth="2" />
                </svg>
                
                <div className="absolute left-[4%] top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-muted rounded-lg flex items-center justify-center mb-1">
                      <Receipt className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground text-center whitespace-nowrap">CRM/POS Systems</span>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Updated 30s ago</span>
                  </div>
                </div>
                
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
                      <span className="text-xs font-bold text-primary">VX</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">VenueX</span>
                  </div>
                </div>
                
                <div className="absolute right-[4%] top-[45%] transform -translate-y-1/2 z-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">G</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Google Ads</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-green-600 whitespace-nowrap">Synced 45s ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">f</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Meta Ads</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-green-600 whitespace-nowrap">Synced 1m ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-black rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">🎵</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">TikTok Ads</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-green-600 whitespace-nowrap">Synced 2m ago</span>
                        </div>
                      </div>
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