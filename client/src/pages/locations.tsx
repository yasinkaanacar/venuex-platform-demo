import { useState, useMemo } from "react";
import { Location, LocationFilters, Channel } from "@/lib/types/locations";
import { mockLocations, filterLocations, paginateLocations } from "@/lib/mock/locations";
import { showToast } from "@/lib/toast";
import { TopBar } from "@/components/locations/TopBar";
import { LocationTable } from "@/components/locations/LocationTable";
import { DetailsDrawer } from "@/components/locations/DetailsDrawer";
import { BulkActionBar } from "@/components/locations/BulkActionBar";
import { PaginationBar } from "@/components/locations/PaginationBar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function LocationsPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<LocationFilters>({
    cities: [],
    statuses: [],
    channels: [],
  });
  const [selectedLocationIds, setSelectedLocationIds] = useState<Set<string>>(new Set());
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filtered and paginated data
  const filteredLocations = useMemo(() => {
    return filterLocations(mockLocations, searchQuery, filters);
  }, [searchQuery, filters]);

  const paginatedData = useMemo(() => {
    return paginateLocations(filteredLocations, currentPage, pageSize);
  }, [filteredLocations, currentPage, pageSize]);

  const selectedLocation = useMemo(() => {
    return selectedLocationId ? mockLocations.find(loc => loc.id === selectedLocationId) || null : null;
  }, [selectedLocationId]);

  // Event handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (key: keyof LocationFilters, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: values
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleRowClick = (id: string) => {
    setSelectedLocationId(id);
    setDetailsDrawerOpen(true);
    console.log('Opening location details for:', id);
    showToast({
      type: 'info',
      title: 'Location Details',
      description: 'Viewing location details'
    });
  };

  const handleSelectionChange = (ids: Set<string>) => {
    setSelectedLocationIds(ids);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Stub action handlers with toast notifications
  const handleAddLocation = () => {
    console.log('Add location clicked');
    showToast({
      type: 'info',
      title: 'Add Location',
      description: 'Opening new location form'
    });
  };

  const handleBulkImport = () => {
    console.log('Bulk import clicked');
    showToast({
      type: 'info',
      title: 'Bulk Import',
      description: 'Opening import dialog'
    });
  };

  const handleExportCSV = () => {
    console.log('Export CSV clicked');
    showToast({
      type: 'success',
      title: 'Export Started',
      description: 'CSV export will begin shortly'
    });
  };

  const handleSyncSelected = () => {
    console.log('Sync selected clicked for:', selectedLocationIds);
    showToast({
      type: 'info',
      title: 'Sync Started',
      description: `Syncing ${selectedLocationIds.size} locations`
    });
  };

  const handleSyncNow = (id: string, channel?: Channel) => {
    console.log('Sync now clicked for:', id, channel ? `channel: ${channel}` : 'all channels');
    const location = mockLocations.find(loc => loc.id === id);
    showToast({
      type: 'success',
      title: 'Sync Started',
      description: `Syncing ${location?.name}${channel ? ` - ${channel}` : ''}`
    });
  };

  const handleEdit = (id: string) => {
    console.log('Edit clicked for:', id);
    const location = mockLocations.find(loc => loc.id === id);
    showToast({
      type: 'info',
      title: 'Edit Location',
      description: `Editing ${location?.name}`
    });
  };

  const handleToggleStatus = (id: string) => {
    console.log('Toggle status clicked for:', id);
    const location = mockLocations.find(loc => loc.id === id);
    showToast({
      type: 'info',
      title: 'Status Updated',
      description: `Status toggled for ${location?.name}`
    });
  };

  const handleConnect = (locationId: string, channel: Channel) => {
    console.log('Connect clicked for:', locationId, 'channel:', channel);
    const location = mockLocations.find(loc => loc.id === locationId);
    showToast({
      type: 'success',
      title: 'Connection Started',
      description: `Connecting ${location?.name} to ${channel}`
    });
  };

  const handleFix = (locationId: string, channel: Channel) => {
    console.log('Fix clicked for:', locationId, 'channel:', channel);
    const location = mockLocations.find(loc => loc.id === locationId);
    showToast({
      type: 'info',
      title: 'Fix Applied',
      description: `Fixing issues for ${location?.name} - ${channel}`
    });
  };

  // Bulk actions
  const handleBulkExport = () => {
    console.log('Bulk export clicked for:', selectedLocationIds);
    showToast({
      type: 'success',
      title: 'Export Started',
      description: `Exporting ${selectedLocationIds.size} selected locations`
    });
  };

  const handleBulkPublish = () => {
    console.log('Bulk publish clicked for:', selectedLocationIds);
    showToast({
      type: 'success',
      title: 'Publishing',
      description: `Publishing ${selectedLocationIds.size} locations`
    });
  };

  const handleBulkUnpublish = () => {
    console.log('Bulk unpublish clicked for:', selectedLocationIds);
    showToast({
      type: 'warning',
      title: 'Unpublishing',
      description: `Unpublishing ${selectedLocationIds.size} locations`
    });
  };

  const handleClearSelection = () => {
    setSelectedLocationIds(new Set());
    showToast({
      type: 'info',
      title: 'Selection Cleared',
      description: 'All selections have been cleared'
    });
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-400 mb-4">
        <RefreshCw className="w-16 h-16" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No locations found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
        Try adjusting your search terms or filters to find what you're looking for.
      </p>
      <Button
        variant="outline"
        onClick={() => {
          setSearchQuery("");
          setFilters({ cities: [], statuses: [], channels: [] });
          setCurrentPage(1);
        }}
      >
        Clear filters
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        selectedCount={selectedLocationIds.size}
        onAddLocation={handleAddLocation}
        onBulkImport={handleBulkImport}
        onExportCSV={handleExportCSV}
        onSyncSelected={handleSyncSelected}
      />

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedLocationIds.size}
        totalCount={filteredLocations.length}
        onSyncSelected={handleSyncSelected}
        onExportSelected={handleBulkExport}
        onPublishSelected={handleBulkPublish}
        onUnpublishSelected={handleBulkUnpublish}
        onClearSelection={handleClearSelection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {paginatedData.data.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Table */}
            <div className="flex-1 overflow-auto p-4">
              <LocationTable
                locations={paginatedData.data}
                selectedIds={selectedLocationIds}
                onSelectionChange={handleSelectionChange}
                onRowClick={handleRowClick}
                onSyncNow={handleSyncNow}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
            </div>

            {/* Pagination */}
            <PaginationBar
              currentPage={currentPage}
              totalPages={paginatedData.totalPages}
              totalCount={paginatedData.totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>

      {/* Details Drawer */}
      <DetailsDrawer
        location={selectedLocation}
        isOpen={detailsDrawerOpen}
        onClose={() => {
          setDetailsDrawerOpen(false);
          setSelectedLocationId(null);
        }}
        onConnect={handleConnect}
        onFix={handleFix}
      />
    </div>
  );
}