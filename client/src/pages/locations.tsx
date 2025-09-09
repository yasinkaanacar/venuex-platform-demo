import { useState } from "react";
import { showToast } from "@/lib/toast";

import { LocationsTable } from "@/components/locations/LocationsTable";
import { FieldManagementDialog } from "@/components/locations/FieldManagementDialog";
import { PlatformSummarySection } from "@/components/locations/PlatformSummarySection";
import DataQualityEnrichment from "@/components/overview/data-quality-enrichment";
import DataHealthAlerts from "@/components/overview/data-health-alerts";

interface FilterState {
  search: string;
  city: string;
  businessStatus: string;
  platformStatus: string;
  storeSet: string;
  missingPOI: string;
}

export default function LocationsPage() {
  // State management
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [fieldManagementOpen, setFieldManagementOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    city: "",
    businessStatus: "",
    platformStatus: "",
    storeSet: "",
    missingPOI: ""
  });

  // Event handlers
  const handleManageFields = () => {
    console.log('Manage fields clicked');
    setFieldManagementOpen(true);
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
      {/* Main Content */}
      <div className="pb-6 bg-[#ffffff]">
        {/* Data Health & Flow Banner */}
        <div className="px-6 py-4">
          <DataHealthAlerts 
            bannerMode={true}
            locationsPageMode={true}
          />
        </div>

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
          <DataQualityEnrichment />
        </div>

        {/* Alerts & Notifications (Expanded) */}
        <div className="mx-6 mt-8">
          <DataHealthAlerts 
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