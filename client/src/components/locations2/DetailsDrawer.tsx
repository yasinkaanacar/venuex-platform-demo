import { useEffect } from "react";
import { LocationDto, PlatformKey } from "@/lib/types/locations";
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
  Activity,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { computeDataHealth, formatHoursLabel, platformToChannelInfo } from "@/lib/mock/locations";

interface DetailsDrawerProps {
  location: LocationDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (locationId: string, channel: PlatformKey) => void;
  onFix: (locationId: string, channel: PlatformKey) => void;
}

// Mock map placeholder component
function MapPlaceholder({ address }: { address: string }) {
  return (
    <div className="w-full h-48 bg-gray-100  rounded-lg flex items-center justify-center border">
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
    channel: 'google' as PlatformKey,
    status: 'success',
    message: 'Successfully synced location data',
    timestamp: '2024-09-05T10:30:00Z',
  },
  {
    id: '2',
    type: 'error',
    channel: 'meta' as PlatformKey,
    status: 'error',
    message: 'Photo needs update - policy violation',
    timestamp: '2024-09-04T14:22:00Z',
  },
  {
    id: '3',
    type: 'sync',
    channel: 'apple' as PlatformKey,
    status: 'success',
    message: 'Hours updated successfully',
    timestamp: '2024-09-05T09:15:00Z',
  },
  {
    id: '4',
    type: 'warning',
    channel: 'yandex' as PlatformKey,
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

  const health = computeDataHealth(location);
  const hoursLabel = formatHoursLabel(location.regular_hours);
  const platformEntries = location.platforms
    ? Object.entries(location.platforms) as [PlatformKey, NonNullable<typeof location.platforms>[PlatformKey]][]
    : [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[600px] sm:w-[540px] overflow-y-auto"
        data-testid={`drawer-${location._id}`}
      >
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl font-semibold">
                {location.location_name}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-2">
                <code className="text-sm bg-gray-100  px-2 py-1 rounded">
                  {location.store_code}
                </code>
                <HealthBadge health={health} />
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="vx-icon-button"
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
              <MapPlaceholder address={location.address.fullAddress} />

              {/* Quick Info */}
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div className="text-sm">
                          <div>{location.address.addressLines.join(', ')}</div>
                          <div className="text-gray-500">
                            {location.address.locality ?? location.address.administrativeArea}
                            {location.address.sublocality && `, ${location.address.sublocality}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{hoursLabel}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{location.primary_phone ?? 'No phone'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button variant="outline" className="vx-button w-full">
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
                      <label className="text-sm font-medium text-gray-700 ">
                        Location Name
                      </label>
                      <div className="mt-1 p-2 bg-gray-50  rounded border text-sm">
                        {location.location_name}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 ">
                        Store Code
                      </label>
                      <div className="mt-1 p-2 bg-gray-50  rounded border text-sm">
                        {location.store_code}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 ">
                        Address
                      </label>
                      <div className="mt-1 p-2 bg-gray-50  rounded border text-sm">
                        {location.address.fullAddress}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 ">
                          City
                        </label>
                        <div className="mt-1 p-2 bg-gray-50  rounded border text-sm">
                          {location.address.locality ?? location.address.administrativeArea}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 ">
                          District
                        </label>
                        <div className="mt-1 p-2 bg-gray-50  rounded border text-sm">
                          {location.address.sublocality ?? '—'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 ">
                        Hours
                      </label>
                      <div className="mt-1 p-2 bg-gray-50  rounded border text-sm">
                        {hoursLabel}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 ">
                        Phone
                      </label>
                      <div className="mt-1 p-2 bg-gray-50  rounded border text-sm">
                        {location.primary_phone ?? '—'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="mt-6">
              <div className="space-y-4">
                {platformEntries.map(([platform, syncData]) => {
                  if (!syncData) return null;
                  const channelInfo = platformToChannelInfo(syncData);
                  return (
                    <Card key={platform}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            {platform}
                          </CardTitle>
                          <ChannelBadge channel={platform} status={channelInfo.status} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 ">Status:</span>
                            <span className="font-medium">
                              {channelInfo.status.replace('_', ' ')}
                            </span>
                          </div>

                          {channelInfo.lastSync && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 ">Last Sync:</span>
                              <span>{formatDistanceToNow(new Date(channelInfo.lastSync))} ago</span>
                            </div>
                          )}

                          {channelInfo.errorNote && (
                            <div className="p-2 bg-red-50  rounded border border-red-200 ">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-red-700 ">
                                  {channelInfo.errorNote}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="pt-2">
                            {channelInfo.status === 'NOT_CONNECTED' ? (
                              <Button
                                onClick={() => onConnect(location._id, platform)}
                                className="vx-button w-full"
                                data-testid={`btn-connect-${location._id}-${platform}`}
                              >
                                Connect {platform}
                              </Button>
                            ) : channelInfo.status === 'NEEDS_ATTENTION' ? (
                              <Button
                                variant="outline"
                                onClick={() => onFix(location._id, platform)}
                                className="vx-button w-full"
                                data-testid={`btn-sync-now-${location._id}-${platform}`}
                              >
                                Fix Issues
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                onClick={() => onFix(location._id, platform)}
                                className="vx-button w-full"
                                data-testid={`btn-sync-now-${location._id}-${platform}`}
                              >
                                Sync Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
