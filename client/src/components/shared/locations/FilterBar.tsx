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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Settings, Search, Filter, X, CalendarIcon, GitCompare } from "lucide-react";
import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { LocationsFilterState } from "@/lib/types";

interface FilterBarProps {
  onManageFields: () => void;
  onAddNewLocation: () => void;
  onUploadLocations: () => void;
  filters: LocationsFilterState;
  onFiltersChange: (filters: LocationsFilterState) => void;
}

export function FilterBar({
  onManageFields,
  onAddNewLocation,
  onUploadLocations,
  filters,
  onFiltersChange,
}: FilterBarProps) {
  const businessStatuses = [
    { value: "open", label: "Açık" },
    { value: "temporarily_closed", label: "Geçici Kapalı" },
    { value: "closed", label: "Kalıcı Kapalı" }
  ];
  const platformStatuses = [
    { value: "live", label: "Yayında" },
    { value: "pending", label: "Bekliyor" },
    { value: "action_required", label: "Aksiyon Gerekli" },
    { value: "suspended", label: "Askıda" },
    { value: "rejected", label: "Reddedildi" }
  ];
  const storeSets = [
    { value: "flagship", label: "Flagship" },
    { value: "premium", label: "Premium" },
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
    { value: "outlet", label: "Outlet" }
  ];
  const platforms = [
    { value: "google", label: "Google" },
    { value: "meta", label: "Meta" },
    { value: "apple", label: "Apple" },
    { value: "yandex", label: "Yandex" }
  ];

  const dateRangePresets = [
    { label: "Son 7 gün", value: "7d" },
    { label: "Son 30 gün", value: "30d" },
    { label: "Son 90 gün", value: "90d" },
    { label: "Bu ay", value: "month" },
    { label: "Geçen ay", value: "lastMonth" },
    { label: "Özel aralık", value: "custom" },
  ];

  const handleFilterChange = (key: keyof LocationsFilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (preset: string) => {
    const today = new Date();
    let startDate: Date;
    let endDate = today;

    switch (preset) {
      case "7d":
        startDate = subDays(today, 7);
        break;
      case "30d":
        startDate = subDays(today, 30);
        break;
      case "90d":
        startDate = subDays(today, 90);
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "lastMonth":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        startDate = subDays(today, 30);
    }

    onFiltersChange({
      ...filters,
      dateRange: preset,
      startDate,
      endDate
    });
  };

  const handleCustomDateRange = (range: { startDate?: Date; endDate?: Date }) => {
    onFiltersChange({
      ...filters,
      dateRange: "custom",
      startDate: range.startDate,
      endDate: range.endDate
    });
  };

  const handleCompareToggle = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      compareMode: checked
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      selectedLocationIds: [],
      selectedStoreGroups: [],
      city: "",
      businessStatus: "",
      platformStatus: "",
      storeSet: "",
      missingPOI: "",
      dateRange: "30d",
      platform: "",
      compareMode: false,
      startDate: undefined,
      endDate: undefined,
      compareStartDate: undefined,
      compareEndDate: undefined
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Single Line Filters */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Mağaza kodu, isim veya adres ara"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
              data-testid="filter-search"
            />
          </div>

          {/* Business Status Filter */}
          <Select value={filters.businessStatus || "all"} onValueChange={(value) => handleFilterChange('businessStatus', value === "all" ? "" : value)}>
            <SelectTrigger className="w-[140px]" data-testid="filter-business-status">
              <div className="flex flex-col items-start w-full">
                <div className="text-xs text-gray-500">İşletme Durumu</div>
                <div className="text-sm">{businessStatuses.find(s => s.value === filters.businessStatus)?.label || "Tümü"}</div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {businessStatuses.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Durum Filter */}
          <Select value={filters.platformStatus || "all"} onValueChange={(value) => handleFilterChange('platformStatus', value === "all" ? "" : value)}>
            <SelectTrigger className="w-[140px]" data-testid="filter-platform-status">
              <div className="flex flex-col items-start w-full">
                <div className="text-xs text-gray-500">Durum</div>
                <div className="text-sm">{platformStatuses.find(s => s.value === filters.platformStatus)?.label || "Tümü"}</div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {platformStatuses.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Grup Filter */}
          <Select value={filters.storeSet || "all"} onValueChange={(value) => handleFilterChange('storeSet', value === "all" ? "" : value)}>
            <SelectTrigger className="w-[130px]" data-testid="filter-store-set">
              <div className="flex flex-col items-start w-full">
                <div className="text-xs text-gray-500">Grup</div>
                <div className="text-sm">{storeSets.find(s => s.value === filters.storeSet)?.label || "Tümü"}</div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {storeSets.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Missing POI Filter */}
          <Select value={filters.missingPOI || "All"} onValueChange={(value) => handleFilterChange('missingPOI', value === "All" ? "" : value)}>
            <SelectTrigger className="w-[120px]" data-testid="filter-missing-poi">
              <div className="flex flex-col items-start w-full">
                <div className="text-xs text-gray-500">Missing POI</div>
                <div className="text-sm">{filters.missingPOI || "All"}</div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Selector */}
          <Select value={filters.dateRange || "30d"} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[150px]" data-testid="filter-date-range">
              <div className="flex flex-col items-start w-full">
                <div className="text-xs text-gray-500">Date Range</div>
                <div className="text-sm">
                  {dateRangePresets.find(p => p.value === (filters.dateRange || "30d"))?.label || "Last 30 days"}
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              {dateRangePresets.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Platform Filter */}
          <Select value={filters.platform || "all"} onValueChange={(value) => handleFilterChange('platform', value === "all" ? "" : value)}>
            <SelectTrigger className="w-[130px]" data-testid="filter-platform">
              <div className="flex flex-col items-start w-full">
                <div className="text-xs text-gray-500">Platform</div>
                <div className="text-sm">{platforms.find(p => p.value === filters.platform)?.label || "Tümü"}</div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {platforms.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Aksiyon Gerekenler Toggle */}
          <div className="flex items-center space-x-2 px-3 py-2 border border-amber-200 bg-amber-50 rounded-md" data-testid="problems-only-toggle">
            <Label htmlFor="problems-only" className="text-sm text-amber-700 font-medium">Aksiyon Gerekenler</Label>
            <Switch
              id="problems-only"
              checked={filters.showProblemsOnly || false}
              onChange={(e) => onFiltersChange({ ...filters, showProblemsOnly: e.target.checked })}
              className="data-[state=checked]:bg-amber-600"
            />
          </div>
        </div>

        {/* Date Range Display */}
        {filters.startDate && filters.endDate && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4" />
            <span>
              {format(filters.startDate, "MMM dd, yyyy")} - {format(filters.endDate, "MMM dd, yyyy")}
            </span>
            {filters.compareMode && filters.compareStartDate && filters.compareEndDate && (
              <>
                <span className="text-gray-400">vs</span>
                <span className="text-blue-600">
                  {format(filters.compareStartDate, "MMM dd, yyyy")} - {format(filters.compareEndDate, "MMM dd, yyyy")}
                </span>
              </>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-6 px-2"
              data-testid="button-clear-filters"
            >
              <X className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}