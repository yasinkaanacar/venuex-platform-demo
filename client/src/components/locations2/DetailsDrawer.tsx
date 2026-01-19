import { useEffect } from "react";
import { Location, Channel } from "@/lib/types/locations";
import { HealthBadge, ChannelBadge } from "@/components/ui/badge-variants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  X,
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Calendar,
  Activity,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DetailsDrawerProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (locationId: string, channel: Channel) => void;
  onFix: (locationId: string, channel: Channel) => void;
}

// Mock map placeholder component
function MapPlaceholder({ address }: { address: string }) {
  return (
    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border">
      <div className="text-center">
        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Map placeholder</p>
        <p className="text-xs text-gray-400 mt-1">{address}</p>
      </div>
    </div>
  );
}

// Mock activity data
const mockActivity = [
  {
    id: '1',
    type: 'sync',
    channel: 'GBP' as Channel,
    status: 'success',
    message: 'Successfully synced location data',
    timestamp: '2024-09-05T10:30:00Z',
  },
  {
    id: '2',
    type: 'error',
    channel: 'META' as Channel,
    status: 'error',
    message: 'Photo needs update - policy violation',
    timestamp: '2024-09-04T14:22:00Z',
  },
  {
    id: '3',
    type: 'sync',
    channel: 'APPLE' as Channel,
    status: 'success',
    message: 'Hours updated successfully',
    timestamp: '2024-09-05T09:15:00Z',
  },
  {
    id: '4',
    type: 'warning',
    channel: 'GMC' as Channel,
    status: 'warning',
    message: 'Category mismatch detected',
    timestamp: '2024-09-04T16:15:00Z',
  },
];

export function DetailsDrawer({
  location,
  isOpen,
  onClose,
  onConnect,
  onFix,
}: DetailsDrawerProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!location) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-[600px] sm:w-[540px] overflow-y-auto"
        data-testid={`drawer-${location.id}`}
      >
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl font-semibold">
                {location.name}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-2">
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {location.code}
                </code>
                <HealthBadge health={location.dataHealth} />
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Map Placeholder */}
              <MapPlaceholder address={`${location.addressLine}, ${location.city}`} />

              {/* Quick Info */}
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div className="text-sm">
                          <div>{location.addressLine}</div>
                          <div className="text-gray-500">{location.city}, {location.district}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{location.hoursLabel}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{location.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Location Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location Name
                      </label>
                      <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border text-sm">
                        {location.name}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Store Code
                      </label>
                      <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border text-sm">
                        {location.code}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                      </label>
                      <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border text-sm">
                        {location.addressLine}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          City
                        </label>
                        <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border text-sm">
                          {location.city}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          District
                        </label>
                        <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border text-sm">
                          {location.district}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hours
                      </label>
                      <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border text-sm">
                        {location.hoursLabel}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border text-sm">
                        {location.phone}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="mt-6">
              <div className="space-y-4">
                {Object.entries(location.channels).map(([channel, info]) => (
                  <Card key={channel}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          {channel}
                        </CardTitle>
                        <ChannelBadge channel={channel} status={info.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className="font-medium">
                            {info.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        {info.lastSync && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Last Sync:</span>
                            <span>{formatDistanceToNow(new Date(info.lastSync))} ago</span>
                          </div>
                        )}

                        {info.errorNote && (
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-red-700 dark:text-red-400">
                                {info.errorNote}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          {info.status === 'NOT_CONNECTED' ? (
                            <Button
                              size="sm"
                              onClick={() => onConnect(location.id, channel as Channel)}
                              className="w-full"
                              data-testid={`btn-connect-${location.id}-${channel.toLowerCase()}`}
                            >
                              Connect {channel}
                            </Button>
                          ) : info.status === 'NEEDS_ATTENTION' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onFix(location.id, channel as Channel)}
                              className="w-full"
                              data-testid={`btn-sync-now-${location.id}-${channel.toLowerCase()}`}
                            >
                              Fix Issues
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onFix(location.id, channel as Channel)}
                              className="w-full"
                              data-testid={`btn-sync-now-${location.id}-${channel.toLowerCase()}`}
                            >
                              Sync Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockActivity.map((activity, index) => (
                      <div key={activity.id}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {activity.status === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : activity.status === 'error' ? (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {activity.channel}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(activity.timestamp))} ago
                              </span>
                            </div>
                            <p className="text-sm mt-1">{activity.message}</p>
                          </div>
                        </div>
                        {index < mockActivity.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}