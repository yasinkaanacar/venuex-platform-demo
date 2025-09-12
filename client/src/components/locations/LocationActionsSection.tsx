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
    <div className="mx-6 mb-6 flex items-center justify-between">
      {/* Left - Manage Posts */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => setLocation("/locations/posts")}
        className="border-blue-200 hover:bg-blue-50 h-16 bg-[#3b82f6] text-[#ffffff] text-[18px] px-8"
        data-testid="btn-manage-posts"
      >
        <FileText className="w-4 h-4 mr-2" />
        Manage Posts
      </Button>

      {/* Right - Small buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddNewLocation}
          className="text-blue-600 border-blue-200 hover:bg-blue-50 h-10 bg-[#ffffff] px-4 text-sm"
          data-testid="btn-add-new-location"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add New Location
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onUploadLocations}
          className="text-blue-600 border-blue-200 hover:bg-blue-50 h-10 bg-[#ffffff] px-4 text-sm"
          data-testid="btn-bulk-updates"
        >
          <Edit className="w-3 h-3 mr-1" />
          Bulk Updates
        </Button>
      </div>
    </div>
  );
}

export default LocationActionsSection;
