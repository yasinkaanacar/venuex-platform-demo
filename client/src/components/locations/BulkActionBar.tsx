import { Button } from "@/components/ui/button";
import { RotateCw, Download, Eye, EyeOff, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSyncSelected: () => void;
  onExportSelected: () => void;
  onPublishSelected: () => void;
  onUnpublishSelected: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  totalCount,
  onSyncSelected,
  onExportSelected,
  onPublishSelected,
  onUnpublishSelected,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div 
      className="sticky top-[76px] z-10 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-3"
      data-testid="bulkbar"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {selectedCount} of {totalCount} locations selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            data-testid="btn-clear-selection"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSyncSelected}
            className="border-blue-300 text-blue-700 bg-blue-100 hover:bg-blue-200 dark:border-blue-700 dark:text-blue-300 dark:bg-blue-800/30 dark:hover:bg-blue-800"
            data-testid="btn-bulk-sync"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Sync Selected
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportSelected}
            className="border-green-300 text-green-700 bg-green-100 hover:bg-green-200 dark:border-green-700 dark:text-green-300 dark:bg-green-800/30 dark:hover:bg-green-800"
            data-testid="btn-bulk-export"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Selected
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onPublishSelected}
            className="border-emerald-300 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:border-emerald-700 dark:text-emerald-300 dark:bg-emerald-800/30 dark:hover:bg-emerald-800"
            data-testid="btn-bulk-publish"
          >
            <Eye className="w-4 h-4 mr-2" />
            Publish
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onUnpublishSelected}
            className="border-orange-300 text-orange-700 bg-orange-100 hover:bg-orange-200 dark:border-orange-700 dark:text-orange-300 dark:bg-orange-800/30 dark:hover:bg-orange-800"
            data-testid="btn-bulk-unpublish"
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Unpublish
          </Button>
        </div>
      </div>
    </div>
  );
}