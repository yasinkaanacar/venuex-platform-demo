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
    <div className="mx-6 mb-6 flex items-center justify-end gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setLocation("/locations/posts")}
        className="border-blue-200 hover:bg-blue-100 h-10 bg-blue-50 text-blue-700 px-4 text-sm"
        data-testid="btn-manage-posts"
      >
        <FileText className="w-3 h-3 mr-1" />
        Manage Posts
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onAddNewLocation}
        className="text-green-700 border-green-200 hover:bg-green-100 h-10 bg-green-50 px-4 text-sm"
        data-testid="btn-add-new-location"
      >
        <Plus className="w-3 h-3 mr-1" />
        Add New Location
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onUploadLocations}
        className="text-purple-700 border-purple-200 hover:bg-purple-100 h-10 bg-purple-50 px-4 text-sm"
        data-testid="btn-bulk-updates"
      >
        <Edit className="w-3 h-3 mr-1" />
        Bulk Updates
      </Button>
    </div>
  );
}

export default LocationActionsSection;
