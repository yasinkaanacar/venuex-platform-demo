import { Button } from "@/components/ui/button";
import { FileText, Plus, Edit } from "lucide-react";
import { useLocation } from "wouter";

interface LocationActionsSectionProps {
  onAddNewLocation?: () => void;
  onUploadLocations?: () => void;
}

export function LocationActionsSection({
  onAddNewLocation,
  onUploadLocations,
}: LocationActionsSectionProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="mx-6 mb-6 grid grid-cols-3 gap-4 items-center">
      {/* 1/3 - Manage Posts */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => setLocation("/locations/posts")}
        className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full h-16 text-[18px] bg-[#ffffff]"
        data-testid="btn-manage-posts"
      >
        <FileText className="w-4 h-4 mr-2" />
        Manage Posts
      </Button>

      {/* 2/3 - Add New Location */}
      <Button
        variant="outline"
        size="lg"
        onClick={onAddNewLocation}
        className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full h-16 bg-[#ffffff]"
        data-testid="btn-add-new-location"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Location
      </Button>

      {/* 3/3 - Upload Locations */}
      <Button
        variant="outline"
        size="lg"
        onClick={onUploadLocations}
        className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full h-16 text-[18px] bg-[#ffffff]"
        data-testid="btn-bulk-updates"
      >
        <Edit className="w-4 h-4 mr-2" />
        Bulk Updates
      </Button>
    </div>
  );
}

export default LocationActionsSection;
