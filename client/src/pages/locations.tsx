import { useState } from "react";
import { showToast } from "@/lib/toast";
import { FilterBar } from "@/components/locations/FilterBar";
import { IssuesSection } from "@/components/locations/IssuesSection";
import { LocationsTable } from "@/components/locations/LocationsTable";
import { BusinessProfileSection } from "@/components/locations/BusinessProfileSection";

export default function LocationsPage() {
  // State management
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // Event handlers
  const handleManageFields = () => {
    console.log('Manage fields clicked');
    showToast({
      type: 'info',
      title: 'Manage Fields',
      description: 'Opening field management dialog'
    });
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

  const handleTakeAction = (issueId: string) => {
    console.log('Take action clicked for issue:', issueId);
    showToast({
      type: 'info',
      title: 'Taking Action',
      description: `Addressing ${issueId} issues`
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
      {/* Filter Bar */}
      <FilterBar
        onManageFields={handleManageFields}
        onAddNewLocation={handleAddNewLocation}
        onUploadLocations={handleUploadLocations}
      />

      {/* Main Content */}
      <div className="pb-6">
        {/* Issues & Suggestions Section */}
        <div className="py-6">
          <IssuesSection onTakeAction={handleTakeAction} />
        </div>

        {/* Locations Table Section */}
        <div className="mb-6">
          <LocationsTable 
            onRowClick={handleRowClick}
            onEdit={handleEdit}
          />
        </div>

        {/* Business Profile Section */}
        <BusinessProfileSection />
      </div>
    </div>
  );
}