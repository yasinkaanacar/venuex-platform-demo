import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";

interface LocationActionsSectionProps {
  onAddNewLocation?: () => void;
  onUploadLocations?: () => void;
}

export function LocationActionsSection({
  onAddNewLocation,
  onUploadLocations,
}: LocationActionsSectionProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onAddNewLocation}
        sx={{
          backgroundColor: '#f5f5f4 !important',
          color: '#374151 !important',
          borderColor: '#d1d5db !important',
          fontSize: '0.8125rem',
          height: '40px',
          '&:hover': {
            backgroundColor: '#e7e5e4 !important'
          }
        }}
        data-testid="btn-add-new-location"
      >
        <Plus className="w-3 h-3 mr-1" />
        Add New Location(s)
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onUploadLocations}
        sx={{
          backgroundColor: '#f5f5f4 !important',
          color: '#374151 !important',
          borderColor: '#d1d5db !important',
          fontSize: '0.8125rem',
          height: '40px',
          '&:hover': {
            backgroundColor: '#e7e5e4 !important'
          }
        }}
        data-testid="btn-bulk-updates"
      >
        <Edit className="w-3 h-3 mr-1" />
        Bulk Updates
      </Button>
    </div>
  );
}

export default LocationActionsSection;

