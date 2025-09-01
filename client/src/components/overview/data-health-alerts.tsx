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
        
        <CardContent className="space-y-6">
          {/* Main Data Flow Layout */}
          <div className="grid grid-cols-12 gap-6 items-center min-h-[300px]">
            
            {/* Left Side - Data Sources */}
            <div className="col-span-4 space-y-4">
              {/* Store Data Sources */}
              <div className="bg-card border-2 border-border rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-3 text-foreground">Store data</h4>
                <p className="text-xs text-muted-foreground mb-3">150+ ERP and POS system integrations</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <Store className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                    <Store className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Customer Data */}
              <div className="bg-card border-2 border-border rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-3 text-foreground">Customer data</h4>
                <p className="text-xs text-muted-foreground mb-3">CRM systems and customer touchpoints</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-xs text-white font-bold">CRM</span>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-xs text-white font-bold">POS</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-xs text-white font-bold">ERP</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Center - VenueX Platform */}
            <div className="col-span-4 flex justify-center">
              <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center min-w-[200px]">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold">VX</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">VenueX</h3>
                <p className="text-sm opacity-90">Cross-platform Data Integration</p>
              </div>
            </div>
            
            {/* Right Side - Output Channels */}
            <div className="col-span-4 space-y-4">
              {/* Digital Channels */}
              <div className="bg-card border-2 border-border rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-3 text-foreground">Digital Channels</h4>
                <div className="flex gap-2 mb-2">
                  <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">G</span>
                  </div>
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">f</span>
                  </div>
                  <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">🍎</span>
                  </div>
                  <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">🎵</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">All platforms synced</span>
                </div>
              </div>
              
              {/* Commerce Platforms */}
              <div className="bg-card border-2 border-border rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-3 text-foreground">Commerce Platforms</h4>
                <div className="flex gap-2 mb-2">
                  <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">S</span>
                  </div>
                  <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">W</span>
                  </div>
                  <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">M</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-600">1 pending sync</span>
                </div>
              </div>
              
              {/* Analytics Tools */}
              <div className="bg-card border-2 border-border rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-3 text-foreground">Analytics Tools</h4>
                <div className="flex gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">GA</span>
                  </div>
                  <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">A</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-red-600">1 connection failed</span>
                </div>
              </div>
            </div>
            
            {/* Connection Lines */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="flowDots" patternUnits="userSpaceOnUse" width="10" height="4">
                    <circle cx="5" cy="2" r="1.5" fill="#3b82f6" opacity="0.6" />
                  </pattern>
                </defs>
                {/* Left to Center */}
                <line x1="33%" y1="50%" x2="50%" y2="50%" stroke="url(#flowDots)" strokeWidth="3" />
                {/* Center to Right */}
                <line x1="58%" y1="50%" x2="75%" y2="50%" stroke="url(#flowDots)" strokeWidth="3" />
              </svg>
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