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
      platformStatus: ""
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

      {/* Filters Row */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
              data-testid="filter-search"
            />
          </div>

          {/* City Filter */}
          <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
            <SelectTrigger className="w-[150px]" data-testid="filter-city">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="City" />
              </div>
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
            <SelectTrigger className="w-[160px]" data-testid="filter-business-status">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Business Status" />
              </div>
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
            <SelectTrigger className="w-[160px]" data-testid="filter-platform-status">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Platform Status" />
              </div>
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
              className="text-gray-500 hover:text-gray-700"
              data-testid="clear-filters"
            >
              <X className="w-4 h-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {filters.search && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('search', '')}>
                Search: "{filters.search}" ×
              </Badge>
            )}
            {filters.city && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('city', '')}>
                City: {filters.city} ×
              </Badge>
            )}
            {filters.businessStatus && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('businessStatus', '')}>
                Business: {filters.businessStatus} ×
              </Badge>
            )}
            {filters.platformStatus && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('platformStatus', '')}>
                Platform: {filters.platformStatus} ×
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}