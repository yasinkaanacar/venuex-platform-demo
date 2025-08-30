import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Platform, Alert as AlertType, Location } from '@shared/schema';
import { CheckCircle, Clock, XCircle, AlertTriangle, ArrowRight, Database, Store, MapPin, Package, Receipt, AlertCircle, X } from 'lucide-react';

interface DataHealthAlertsProps {
  platforms?: Platform[];
  alerts?: AlertType[];
  locations?: Location[];
}

export default function DataHealthAlerts({ platforms = [], alerts = [], locations = [] }: DataHealthAlertsProps) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Data Health & Flow
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Data flow from source systems through VenueX to platforms
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Healthy</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="relative">
          {/* Vertical VenueX alignment guide */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 transform -translate-x-1/2 z-0"></div>
          
          <div className="space-y-6 relative z-10">
            {/* Location Data Flow */}
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">Location Data</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">Active</span>
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
                  {/* VenueX to Platforms line - aligned with logo centers */}
                  <line x1="52%" y1="35%" x2="80%" y2="35%" stroke="url(#greenDotted)" strokeWidth="2" />
                </svg>
                
                <div className="absolute left-[10%] top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-muted rounded-lg flex items-center justify-center mb-1">
                      <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground text-center whitespace-nowrap">Store Systems</span>
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
                
                <div className="absolute right-[10%] top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="flex flex-col gap-1 text-right">
                    <div className="text-xs text-muted-foreground">Google Business Profile</div>
                    <div className="text-xs text-muted-foreground">Meta Pages</div>
                    <div className="text-xs text-muted-foreground">Apple Business Connect</div>
                    <div className="text-xs text-muted-foreground">Yandex Business</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Data Flow */}
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-sm">Inventory Data</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-600" />
                  <span className="text-xs text-red-600">Error</span>
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
                  {/* VenueX to Platforms line - aligned with logo centers */}
                  <line x1="52%" y1="35%" x2="80%" y2="35%" stroke="url(#redDotted)" strokeWidth="2" />
                </svg>
                
                <div className="absolute left-[10%] top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-muted rounded-lg flex items-center justify-center mb-1">
                      <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground text-center whitespace-nowrap">ERP Systems</span>
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
                
                <div className="absolute right-[10%] top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="flex flex-col gap-1 text-right">
                    <div className="text-xs text-muted-foreground">Google Merchant Center</div>
                    <div className="text-xs text-muted-foreground">Meta Commerce</div>
                  </div>
                </div>
              </div>
            </div>

            {/* In-Store Sales Data Flow */}
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-sm">In-Store Sales Data</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">Active</span>
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
                  {/* VenueX to Platforms line - aligned with logo centers */}
                  <line x1="52%" y1="35%" x2="80%" y2="35%" stroke="url(#greenDotted2)" strokeWidth="2" />
                </svg>
                
                <div className="absolute left-[10%] top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-muted rounded-lg flex items-center justify-center mb-1">
                      <Receipt className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground text-center whitespace-nowrap">CRM/POS Systems</span>
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
                
                <div className="absolute right-[10%] top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="flex flex-col gap-1 text-right">
                    <div className="text-xs text-muted-foreground">Google Ads</div>
                    <div className="text-xs text-muted-foreground">Meta Ads</div>
                    <div className="text-xs text-muted-foreground">TikTok Ads</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Alerts & Notifications Section */}
        <div className="pt-8 border-t-2 border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Alerts & Notifications
            </h3>
            
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="button-view-all-alerts">
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