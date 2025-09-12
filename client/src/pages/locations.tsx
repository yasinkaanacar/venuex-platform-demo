import { useState } from "react";
import { showToast } from "@/lib/toast";
import { LocationsFilterState } from "@/lib/types";

import { LocationsTable } from "@/components/locations/LocationsTable";
import { FieldManagementDialog } from "@/components/locations/FieldManagementDialog";
import { PlatformSummarySection } from "@/components/locations/PlatformSummarySection";
import { LocationActionsSection } from "@/components/locations/LocationActionsSection";
import DataQualityEnrichment from "@/components/overview/data-quality-enrichment";
import LocationsDataHealthAlerts from "@/components/locations/locations-data-health-alerts";
import { Store, User, Check } from 'lucide-react';
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