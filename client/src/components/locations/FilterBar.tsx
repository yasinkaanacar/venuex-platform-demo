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
  missingPOI: string;
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
      storeSet: "",
      missingPOI: ""
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Single Line Filters */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-[400px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by store code, store name or address"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
              data-testid="filter-search"
            />
          </div>

          {/* Business Status Filter */}
          <Select value={filters.businessStatus || "All"} onValueChange={(value) => handleFilterChange('businessStatus', value === "All" ? "" : value)}>
            <SelectTrigger className="w-[150px]" data-testid="filter-business-status">
              <div className="flex flex-col items-start w-full">
                <div className="text-xs text-gray-500">Business Status</div>
                <div className="text-sm">{filters.businessStatus || "All"}</div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {businessStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Platform Status Filter */}
          <Select value={filters.platformStatus || "All"} onValueChange={(value) => handleFilterChange('platformStatus', value === "All" ? "" : value)}>
            <SelectTrigger className="w-[150px]" data-testid="filter-platform-status">
              <div className="flex flex-col items-start w-full">
                <div className="text-xs text-gray-500">Platform Status</div>
                <div className="text-sm">{filters.platformStatus || "All"}</div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {platformStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Store Set Filter */}
          <Select value={filters.storeSet || ""} onValueChange={(value) => handleFilterChange('storeSet', value)}>
            <SelectTrigger className="w-[150px]" data-testid="filter-store-set">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-500">{filters.storeSet || "Select a store set"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select a store set</SelectItem>
              {storeSets.map((set) => (
                <SelectItem key={set} value={set}>
                  {set}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Missing POI Filter */}
          <Select value={filters.missingPOI || ""} onValueChange={(value) => handleFilterChange('missingPOI', value)}>
            <SelectTrigger className="w-[120px]" data-testid="filter-missing-poi">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-500">{filters.missingPOI || "Missing POI"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Missing POI</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}