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
                  {/* VenueX to Platforms line - shorter line */}
                  <line x1="52%" y1="50%" x2="65%" y2="50%" stroke="url(#greenDotted)" strokeWidth="2" />
                </svg>
                
                <div className="absolute left-[10%] top-1/2 transform -translate-y-1/2 z-10">
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
                
                <div className="absolute left-[68%] top-[45%] transform -translate-y-1/2 z-10">
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
                  {/* VenueX to Platforms line - shorter line */}
                  <line x1="52%" y1="50%" x2="65%" y2="50%" stroke="url(#redDotted)" strokeWidth="2" />
                </svg>
                
                <div className="absolute left-[10%] top-1/2 transform -translate-y-1/2 z-10">
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
                
                <div className="absolute left-[68%] top-[45%] transform -translate-y-1/2 z-10">
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
                  {/* VenueX to Platforms line - shorter line */}
                  <line x1="52%" y1="50%" x2="65%" y2="50%" stroke="url(#greenDotted2)" strokeWidth="2" />
                </svg>
                
                <div className="absolute left-[10%] top-1/2 transform -translate-y-1/2 z-10">
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
                
                <div className="absolute left-[68%] top-[45%] transform -translate-y-1/2 z-10">
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
        
      </CardContent>
    </Card>
  );
}