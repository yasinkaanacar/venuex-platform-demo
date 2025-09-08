import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Settings, Search, Filter, X } from "lucide-react";

interface FilterState {
  search: string;
  city: string;
  businessStatus: string;
  platformStatus: string;
  storeSet: string;
}

interface FilterBarProps {
  onManageFields: () => void;
  onAddNewLocation: () => void;
  onUploadLocations: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterBar({
  onManageFields,
  onAddNewLocation,
  onUploadLocations,
  filters,
  onFiltersChange,
}: FilterBarProps) {
  const cities = ["Istanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Gaziantep"];
  const businessStatuses = ["Open", "Closed", "Temporarily Closed"];
  const platformStatuses = ["Optimal Waiting", "Needs Attention", "Connected"];
  const storeSets = ["SMR", "Premium", "Express", "Standard", "Regional"];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      city: "",
      businessStatus: "",
      platformStatus: "",
      storeSet: ""
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Header Row */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Locations</span>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">All</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onManageFields}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              data-testid="btn-manage-fields"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Fields
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAddNewLocation}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              data-testid="btn-add-new-location"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Location
            </Button>
            
            <Button
              size="sm"
              onClick={onUploadLocations}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="btn-upload-locations"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Locations
            </Button>
          </div>
        </div>
      </div>

      {/* Single Line Filters */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Search and Filters */}
          <div className="flex items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search locations..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
                data-testid="filter-search"
              />
            </div>

            {/* Store Set Filter */}
            <Select value={filters.storeSet} onValueChange={(value) => handleFilterChange('storeSet', value)}>
              <SelectTrigger className="w-[140px]" data-testid="filter-store-set">
                <SelectValue placeholder="Store Set" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sets</SelectItem>
                {storeSets.map((set) => (
                  <SelectItem key={set} value={set}>
                    {set}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City Filter */}
            <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
              <SelectTrigger className="w-[120px]" data-testid="filter-city">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Business Status Filter */}
            <Select value={filters.businessStatus} onValueChange={(value) => handleFilterChange('businessStatus', value)}>
              <SelectTrigger className="w-[120px]" data-testid="filter-business-status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {businessStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Platform Status Filter */}
            <Select value={filters.platformStatus} onValueChange={(value) => handleFilterChange('platformStatus', value)}>
              <SelectTrigger className="w-[120px]" data-testid="filter-platform-status">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Platforms</SelectItem>
                {platformStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 whitespace-nowrap"
                data-testid="clear-filters"
              >
                <X className="w-4 h-4 mr-1" />
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* Active Filters Display (compact) */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-1">
              {filters.search && (
                <Badge variant="secondary" className="cursor-pointer text-xs" onClick={() => handleFilterChange('search', '')}>
                  "{filters.search}" ×
                </Badge>
              )}
              {filters.storeSet && (
                <Badge variant="secondary" className="cursor-pointer text-xs" onClick={() => handleFilterChange('storeSet', '')}>
                  {filters.storeSet} ×
                </Badge>
              )}
              {filters.city && (
                <Badge variant="secondary" className="cursor-pointer text-xs" onClick={() => handleFilterChange('city', '')}>
                  {filters.city} ×
                </Badge>
              )}
              {filters.businessStatus && (
                <Badge variant="secondary" className="cursor-pointer text-xs" onClick={() => handleFilterChange('businessStatus', '')}>
                  {filters.businessStatus} ×
                </Badge>
              )}
              {filters.platformStatus && (
                <Badge variant="secondary" className="cursor-pointer text-xs" onClick={() => handleFilterChange('platformStatus', '')}>
                  {filters.platformStatus} ×
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}