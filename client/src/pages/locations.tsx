import { useState } from "react";
import { showToast } from "@/lib/toast";
import { LocationsFilterState } from "@/lib/types";

import { LocationsTable } from "@/components/locations/LocationsTable";
import { FieldManagementDialog } from "@/components/locations/FieldManagementDialog";
import { PlatformSummarySection } from "@/components/locations/PlatformSummarySection";
import { LocationActionsSection } from "@/components/locations/LocationActionsSection";
import DataQualityEnrichment from "@/components/overview/data-quality-enrichment";
import LocationsDataHealthAlerts from "@/components/locations/locations-data-health-alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Store, User, Check, Search, GitCompare, X } from 'lucide-react';
import { Tooltip } from '@mui/material';

export default function LocationsPage() {
  // State management
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [fieldManagementOpen, setFieldManagementOpen] = useState(false);
  const [filters, setFilters] = useState<LocationsFilterState>({
    search: "",
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

  // Event handlers
  const handleManageFields = () => {
    console.log('Manage fields clicked');
    setFieldManagementOpen(true);
  };

  const scrollToDataHealthDetails = () => {
    const element = document.getElementById('data-health-details');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddNewLocation = () => {
    console.log('Add new location clicked');
    showToast({
      type: 'info',
      title: 'Add New Location',
      description: 'Opening new location form'
    });
  };

  const handleUploadLocations = () => {
    console.log('Upload locations clicked');
    showToast({
      type: 'info',
      title: 'Upload Locations',
      description: 'Opening location upload dialog'
    });
  };

  

  const handleRowClick = (id: string) => {
    console.log('Location row clicked:', id);
    showToast({
      type: 'info',
      title: 'Location Details',
      description: 'Viewing location details'
    });
  };

  const handleEdit = (id: string) => {
    console.log('Edit location clicked:', id);
    showToast({
      type: 'info',
      title: 'Edit Location',
      description: 'Opening edit form'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-card border-b-2 border-border sticky top-0 z-50 shadow-sm h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center bg-[#f9fafb]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="p-2">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">Locations</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  {/* Step 1 - Completed */}
                  <Tooltip title="İşletme Profili" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </Tooltip>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  
                  {/* Step 2 - Completed */}
                  <Tooltip title="Satışlar ve Offline Conversion" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </Tooltip>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  
                  {/* Step 3 - Pending */}
                  <Tooltip title="İşletme Profili" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                    <div className="w-6 h-6 border-2 border-gray-400 bg-white rounded-full"></div>
                  </Tooltip>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  
                  {/* Step 4 - Pending */}
                  <Tooltip title="Satışlar ve Offline Conversion" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                    <div className="w-6 h-6 border-2 border-gray-400 bg-white rounded-full"></div>
                  </Tooltip>
                </div>
                <div className="text-xs text-gray-500 mt-2">VenueX Kurulum</div>
              </div>
                <div className="w-4"></div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium" data-testid="text-user-name">Kürşad Arman</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="pb-6 bg-[#ffffff]">
        {/* Data Health & Flow Banner */}
        <div className="px-6 py-4">
          <LocationsDataHealthAlerts 
            bannerMode={true}
            locationsPageMode={true}
            onScrollToBottom={scrollToDataHealthDetails}
          />
        </div>

        {/* Location Actions Section */}
        <LocationActionsSection 
          onAddNewLocation={handleAddNewLocation}
          onUploadLocations={handleUploadLocations}
        />

        {/* Platform Summary Section */}
        <PlatformSummarySection />

        {/* Test Section - Same structure as Platform Summary but without tabs */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          {/* Header without tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
            <h3 className="text-base font-semibold text-foreground">Performance</h3>
          </div>
          {/* Content */}
          <div className="bg-stone-50">
            <div className="px-6 py-3">
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-[400px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by store code, store name or address"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                    data-testid="filter-search"
                  />
                </div>

                {/* Business Status Filter */}
                <Select value={filters.businessStatus || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, businessStatus: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-business-status">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Business Status</div>
                      <div className="text-sm">{filters.businessStatus || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Temporarily Closed">Temporarily Closed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Platform Status Filter */}
                <Select value={filters.platformStatus || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, platformStatus: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-platform-status">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Platform Status</div>
                      <div className="text-sm">{filters.platformStatus || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Optimal Waiting">Optimal Waiting</SelectItem>
                    <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                    <SelectItem value="Connected">Connected</SelectItem>
                  </SelectContent>
                </Select>

                {/* Store Set Filter */}
                <Select value={filters.storeSet || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, storeSet: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-store-set">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Store Set</div>
                      <div className="text-sm">{filters.storeSet || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="SMR">SMR</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                  </SelectContent>
                </Select>

                {/* Missing POI Filter */}
                <Select value={filters.missingPOI || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, missingPOI: value === "All" ? "" : value }))}>
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
                <Select value={filters.dateRange || "30d"} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-date-range">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Date Range</div>
                      <div className="text-sm">
                        {filters.dateRange === "7d" ? "Last 7 days" : filters.dateRange === "30d" ? "Last 30 days" : "Last 90 days"}
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>

                {/* Platform Filter */}
                <Select value={filters.platform || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-platform">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Platform</div>
                      <div className="text-sm">{filters.platform || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Apple Maps">Apple Maps</SelectItem>
                  </SelectContent>
                </Select>

                {/* Compare Mode Toggle */}
                <div className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-md" data-testid="compare-mode-toggle">
                  <GitCompare className="w-4 h-4 text-gray-500" />
                  <Label htmlFor="compare-mode" className="text-sm text-gray-600">Compare</Label>
                  <Switch
                    id="compare-mode"
                    checked={filters.compareMode || false}
                    onChange={(event) => setFilters(prev => ({ ...prev, compareMode: event.target.checked }))}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
              
              {/* Active Filters Display */}
              {Object.values(filters).filter(value => value !== "").length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  <Badge variant="secondary" className="text-xs">
                    {Object.values(filters).filter(value => value !== "").length} active
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      search: "",
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
                    })}
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
        </div>

        {/* Locations Table Section */}
        <div className="mb-6">
          <LocationsTable 
            onRowClick={handleRowClick}
            onEdit={handleEdit}
            filters={filters}
            onManageFields={handleManageFields}
            onAddNewLocation={handleAddNewLocation}
            onUploadLocations={handleUploadLocations}
            onFiltersChange={setFilters}
          />
        </div>


        {/* Data Quality Assessment & Data Enrichment Suggestions */}
        <div className="mx-6 mt-8">
          <DataQualityEnrichment context="locations" />
        </div>

        {/* Alerts & Notifications (Expanded) */}
        <div className="mx-6 mt-8" id="data-health-details">
          <LocationsDataHealthAlerts 
            bannerMode={false}
            alwaysExpanded={true}
            locationsPageMode={true}
          />
        </div>
      </div>
      {/* Field Management Dialog */}
      <FieldManagementDialog 
        isOpen={fieldManagementOpen}
        onClose={() => setFieldManagementOpen(false)}
      />
    </div>
  );
}