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
    <div className="mx-6 mb-6 flex items-center justify-end">
      {/* Right - All small buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation("/locations/posts")}
          className="border-blue-300 hover:bg-blue-200 h-10 bg-blue-100 text-blue-700 px-4 text-sm"
          data-testid="btn-manage-posts"
        >
          <FileText className="w-3 h-3 mr-1" />
          Manage Posts
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onAddNewLocation}
          className="border-green-300 hover:bg-green-200 h-10 bg-green-100 text-green-700 px-4 text-sm"
          data-testid="btn-add-new-location"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add New Location
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onUploadLocations}
          className="border-amber-300 hover:bg-amber-200 h-10 bg-amber-100 text-amber-700 px-4 text-sm"
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
