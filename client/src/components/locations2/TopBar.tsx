import { Search, Filter, Plus, Download, Upload, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LocationFilters } from "@/lib/types/locations";
import { getUniqueValues } from "@/lib/mock/locations";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: LocationFilters;
  onFilterChange: (key: keyof LocationFilters, values: string[]) => void;
  selectedCount: number;
  onAddLocation: () => void;
  onBulkImport: () => void;
  onExportCSV: () => void;
  onSyncSelected: () => void;
}

export function TopBar({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  selectedCount,
  onAddLocation,
  onBulkImport,
  onExportCSV,
  onSyncSelected,
}: TopBarProps) {
  const uniqueValues = {
    cities: getUniqueValues.cities(),
    statuses: getUniqueValues.statuses(),
    channels: getUniqueValues.channels(),
  };

  const activeFiltersCount = filters.cities.length + filters.statuses.length + filters.channels.length;

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Title */}
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900 ">Locations</h1>
        </div>

        {/* Right side - Search and Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="vx-input pl-10 w-64"
              data-testid="locations-search"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {/* City Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="vx-button" data-testid="filter-city">
                  <Filter className="w-4 h-4 mr-2" />
                  City
                  {filters.cities.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filters.cities.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by City</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {uniqueValues.cities.map((city) => (
                  <DropdownMenuCheckboxItem
                    key={city}
                    checked={filters.cities.includes(city)}
                    onCheckedChange={(checked) => {
                      const newCities = checked
                        ? [...filters.cities, city]
                        : filters.cities.filter((c) => c !== city);
                      onFilterChange('cities', newCities);
                    }}
                  >
                    {city}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="vx-button" data-testid="filter-status">
                  <Filter className="w-4 h-4 mr-2" />
                  Status
                  {filters.statuses.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filters.statuses.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {uniqueValues.statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={(checked) => {
                      const newStatuses = checked
                        ? [...filters.statuses, status]
                        : filters.statuses.filter((s) => s !== status);
                      onFilterChange('statuses', newStatuses);
                    }}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Channels Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="vx-button" data-testid="filter-channels">
                  <Filter className="w-4 h-4 mr-2" />
                  Channels
                  {filters.channels.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filters.channels.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Channels</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {uniqueValues.channels.map((channel) => (
                  <DropdownMenuCheckboxItem
                    key={channel}
                    checked={filters.channels.includes(channel)}
                    onCheckedChange={(checked) => {
                      const newChannels = checked
                        ? [...filters.channels, channel]
                        : filters.channels.filter((c) => c !== channel);
                      onFilterChange('channels', newChannels);
                    }}
                  >
                    {channel}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="vx-button"
              onClick={onBulkImport}
              data-testid="btn-bulk-import"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </Button>

            <Button
              variant="outline"
              className="vx-button"
              onClick={onExportCSV}
              data-testid="btn-export-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            {selectedCount > 0 && (
              <Button
                variant="outline"
                className="vx-button"
                onClick={onSyncSelected}
                data-testid="btn-sync-selected"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Sync Selected ({selectedCount})
              </Button>
            )}

            <Button onClick={onAddLocation} data-testid="btn-add-location" className="vx-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.cities.map((city) => (
            <Badge
              key={`city-${city}`}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onFilterChange('cities', filters.cities.filter((c) => c !== city))}
            >
              City: {city} ×
            </Badge>
          ))}
          {filters.statuses.map((status) => (
            <Badge
              key={`status-${status}`}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onFilterChange('statuses', filters.statuses.filter((s) => s !== status))}
            >
              Status: {status} ×
            </Badge>
          ))}
          {filters.channels.map((channel) => (
            <Badge
              key={`channel-${channel}`}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onFilterChange('channels', filters.channels.filter((c) => c !== channel))}
            >
              Channel: {channel} ×
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onFilterChange('cities', []);
              onFilterChange('statuses', []);
              onFilterChange('channels', []);
            }}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
