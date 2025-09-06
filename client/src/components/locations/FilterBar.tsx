import { Button } from "@/components/ui/button";
import { Plus, Upload, Settings } from "lucide-react";

interface FilterBarProps {
  onManageFields: () => void;
  onAddNewLocation: () => void;
  onUploadLocations: () => void;
}

export function FilterBar({
  onManageFields,
  onAddNewLocation,
  onUploadLocations,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
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
  );
}