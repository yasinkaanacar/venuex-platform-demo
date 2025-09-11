import { Button } from "@/components/ui/button";
import { Settings, Plus, Edit } from "lucide-react";
import { useLocation } from "wouter";

interface LocationActionsSectionProps {
  onAddNewLocation?: () => void;
  onUploadLocations?: () => void;
}

export function LocationActionsSection({ 
  onAddNewLocation, 
  onUploadLocations 
}: LocationActionsSectionProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="mx-6 mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-none">
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-4 gap-4 items-center">
          {/* 1/4 - Location count */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-1">130</div>
            <div className="text-base text-gray-600">Lokasyon</div>
          </div>

          {/* 1/4 - Manage Posts */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/locations/posts')}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full"
              data-testid="btn-manage-posts"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Posts
            </Button>
          </div>

          {/* 1/4 - Add New Location */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddNewLocation}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full"
              data-testid="btn-add-new-location"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Location
            </Button>
          </div>

          {/* 1/4 - Upload Locations */}
          <div className="flex justify-center">
            <Button
              variant="default"
              size="sm"
              onClick={onUploadLocations}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              data-testid="btn-bulk-updates"
            >
              <Edit className="w-4 h-4 mr-2" />
              Bulk Updates
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationActionsSection;