import { useState } from "react";
import { LocationDto, PlatformKey } from "@/lib/types/locations";
import { HealthBadge, ChannelBadge } from "@/components/ui/badge-variants";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { MoreHorizontal, Eye, RotateCw, Edit, Power, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { computeDataHealth, formatHoursLabel, getLatestSync, platformToChannelInfo } from "@/lib/mock/locations";

interface LocationTableProps {
  locations: LocationDto[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onRowClick: (id: string) => void;
  onSyncNow: (id: string, channel?: PlatformKey) => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

type SortField = 'name' | 'code' | 'city' | 'dataHealth' | 'lastSync';
type SortDirection = 'asc' | 'desc';

export function LocationTable({
  locations,
  selectedIds,
  onSelectionChange,
  onRowClick,
  onSyncNow,
  onEdit,
  onToggleStatus,
}: LocationTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLocations = [...locations].sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';

    switch (sortField) {
      case 'name':
        aVal = a.location_name;
        bVal = b.location_name;
        break;
      case 'code':
        aVal = a.store_code;
        bVal = b.store_code;
        break;
      case 'city':
        aVal = a.address.locality ?? '';
        bVal = b.address.locality ?? '';
        break;
      case 'dataHealth': {
        const healthOrder = { HEALTHY: 1, WARNING: 2, ERROR: 3 };
        aVal = healthOrder[computeDataHealth(a)];
        bVal = healthOrder[computeDataHealth(b)];
        break;
      }
      case 'lastSync': {
        const aSync = getLatestSync(a);
        const bSync = getLatestSync(b);
        aVal = aSync ? new Date(aSync).getTime() : 0;
        bVal = bSync ? new Date(bSync).getTime() : 0;
        break;
      }
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onSelectionChange(new Set(locations.map(loc => loc._id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = new Set(selectedIds);
    if (event.target.checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    onSelectionChange(newSelected);
  };

  const isAllSelected = locations.length > 0 && selectedIds.size === locations.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < locations.length;

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-semibold text-left justify-start hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <TooltipProvider>
      <div className="rounded-md border border-gray-200  overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 ">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                  data-testid="select-all-locations"
                />
              </TableHead>
              <TableHead>
                <SortableHeader field="name">Location Name</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="code">Store Code</SortableHeader>
              </TableHead>
              <TableHead>Address</TableHead>
              <TableHead>
                <SortableHeader field="city">City/District</SortableHeader>
              </TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>
                <SortableHeader field="dataHealth">Data Health</SortableHeader>
              </TableHead>
              <TableHead className="w-48">Channels</TableHead>
              <TableHead>
                <SortableHeader field="lastSync">Last Sync</SortableHeader>
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLocations.map((location, index) => {
              const health = computeDataHealth(location);
              const hoursLabel = formatHoursLabel(location.regular_hours);
              const lastSync = getLatestSync(location);
              const platformEntries = location.platforms
                ? Object.entries(location.platforms) as [PlatformKey, typeof location.platforms[PlatformKey]][]
                : [];

              return (
                <TableRow
                  key={location._id}
                  className={`cursor-pointer hover:bg-gray-50  ${
                    index % 2 === 0 ? 'bg-white ' : 'bg-gray-50/50 '
                  }`}
                  onClick={() => onRowClick(location._id)}
                  data-testid={`table-row-${location._id}`}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(location._id)}
                      onChange={(event) => handleSelectRow(location._id, event)}
                      data-testid={`select-location-${location._id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-48 truncate" title={location.location_name}>
                      {location.location_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100  px-2 py-1 rounded">
                      {location.store_code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        <div>
                          <div>{location.address.fullAddress}</div>
                        </div>
                      }
                    >
                      <div className="max-w-48 truncate cursor-help">
                        {location.address.addressLines[0] ?? location.address.fullAddress}
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{location.address.locality ?? location.address.administrativeArea}</div>
                    <div className="text-xs text-gray-500">{location.address.sublocality}</div>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={hoursLabel}>
                      <div className="max-w-32 truncate cursor-help text-sm">
                        {hoursLabel}
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-sm">{location.primary_phone}</TableCell>
                  <TableCell>
                    <Tooltip title="Data health status for this location">
                      <div>
                        <HealthBadge health={health} />
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {platformEntries.map(([platform, syncData]) => {
                        if (!syncData) return null;
                        const channelInfo = platformToChannelInfo(syncData);
                        return (
                          <Tooltip
                            key={platform}
                            title={
                              <div>
                                <div className="font-medium">{platform}</div>
                                <div>Status: {channelInfo.status.replace('_', ' ')}</div>
                                {channelInfo.lastSync && (
                                  <div>Last sync: {formatDistanceToNow(new Date(channelInfo.lastSync))} ago</div>
                                )}
                                {channelInfo.errorNote && (
                                  <div className="text-red-400 mt-1">{channelInfo.errorNote}</div>
                                )}
                              </div>
                            }
                          >
                            <div>
                              <ChannelBadge
                                channel={platform}
                                status={channelInfo.status}
                                className="text-xs"
                              />
                            </div>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {lastSync ? (
                      <Tooltip title={new Date(lastSync).toLocaleString()}>
                        <div className="text-sm cursor-help">
                          {formatDistanceToNow(new Date(lastSync))} ago
                        </div>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-400 text-sm">Never</span>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="vx-icon-button"
                          data-testid={`actions-menu-${location._id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onRowClick(location._id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSyncNow(location._id)}>
                          <RotateCw className="mr-2 h-4 w-4" />
                          Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(location._id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(location._id)}>
                          <Power className="mr-2 h-4 w-4" />
                          Toggle Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
