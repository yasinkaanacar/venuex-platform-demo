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
        sx={{ 
          backgroundColor: '#dbeafe', 
          color: '#1d4ed8', 
          borderColor: '#93c5fd',
          fontSize: '0.8125rem',
          height: '40px',
          '&:hover': { 
            backgroundColor: '#bfdbfe' 
          }
        }}
        data-testid="btn-manage-posts"
      >
        <FileText className="w-3 h-3 mr-1" />
        Manage Posts
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onAddNewLocation}
        sx={{ 
          backgroundColor: '#dcfce7', 
          color: '#15803d', 
          borderColor: '#86efac',
          fontSize: '0.8125rem',
          height: '40px',
          '&:hover': { 
            backgroundColor: '#bbf7d0' 
          }
        }}
        data-testid="btn-add-new-location"
      >
        <Plus className="w-3 h-3 mr-1" />
        Add New Location
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onUploadLocations}
        sx={{ 
          backgroundColor: '#f3e8ff', 
          color: '#7c3aed', 
          borderColor: '#c4b5fd',
          fontSize: '0.8125rem',
          height: '40px',
          '&:hover': { 
            backgroundColor: '#e9d5ff' 
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
