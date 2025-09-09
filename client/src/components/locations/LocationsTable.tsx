import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, ChevronDown, Info, Download, Facebook, Instagram, CheckCircle, AlertTriangle } from "lucide-react";
import { FilterBar } from "@/components/locations/FilterBar";

// Updated mock data to match screenshot
const mockLocationData = [
  {
    id: '1',
    storeCode: 'CB06',
    locationName: 'Boyner Eskişehir Kanatlı',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  },
  {
    id: '2', 
    storeCode: 'CB08',
    locationName: 'Boyner Denizli Forum',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  },
  {
    id: '3',
    storeCode: 'CB13',
    locationName: 'Boyner Çanakkale 17 Burda',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  },
  {
    id: '4',
    storeCode: 'CB14',
    locationName: 'Boyner Adapazarı Agora',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  },
  {
    id: '5',
    storeCode: 'CB15',
    locationName: 'Boyner Forum Diyarbakır',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  },
  {
    id: '6',
    storeCode: 'CB21',
    locationName: 'Boyner Van',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  },
  {
    id: '7',
    storeCode: 'CB22',
    locationName: 'Boyner Adapazarı Serdivan',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  },
  {
    id: '8',
    storeCode: 'CB23',
    locationName: 'Boyner Antalya Alanyum',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  },
  {
    id: '9',
    storeCode: 'CB27',
    locationName: 'Boyner Şanlıurfa Piazza',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  },
  {
    id: '10',
    storeCode: 'CB28',
    locationName: 'Boyner Tekirdağ Orion',
    businessStatus: 'Open' as const,
    platformStatus: 'Looks Good!',
    poiStatus: 'Looks Good!',
    platforms: ['facebook', 'google', 'instagram', 'yelp']
  }
];

interface FilterState {
  search: string;
  city: string;
  businessStatus: string;
  platformStatus: string;
  storeSet: string;
  missingPOI: string;
}

interface LocationsTableProps {
  onRowClick: (id: string) => void;
  onEdit: (id: string) => void;
  filters: FilterState;
  onManageFields: () => void;
  onAddNewLocation: () => void;
  onUploadLocations: () => void;
  onFiltersChange: (filters: FilterState) => void;
}

export function LocationsTable({ onRowClick, onEdit, filters, onManageFields, onAddNewLocation, onUploadLocations, onFiltersChange }: LocationsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = mockLocationData.filter(location => {
    // Search filter
    const searchMatch = !filters.search || 
      location.locationName.toLowerCase().includes(filters.search.toLowerCase()) ||
      location.storeCode.toLowerCase().includes(filters.search.toLowerCase());
    
    // Business status filter
    const businessStatusMatch = !filters.businessStatus || location.businessStatus === filters.businessStatus;
    
    // Platform status filter  
    const platformStatusMatch = !filters.platformStatus || location.platformStatus === filters.platformStatus;
    
    // City filter (extract city from location name)
    const locationCity = location.locationName.split(' ')[1] || location.locationName.split(' ')[0];
    const cityMatch = !filters.city || locationCity.toLowerCase().includes(filters.city.toLowerCase());
    
    // Store Set filter (based on store code prefix)
    const storeSetMatch = !filters.storeSet || location.storeCode.startsWith(filters.storeSet);
    
    return searchMatch && businessStatusMatch && platformStatusMatch && cityMatch && storeSetMatch;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(new Set(paginatedData.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = new Set(selectedIds);
    if (event.target.checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected = paginatedData.length > 0 && selectedIds.size === paginatedData.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < paginatedData.length;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <div className="w-4 h-4 bg-blue-600 rounded text-white flex items-center justify-center text-xs">f</div>;
      case 'google':
        return <div className="w-4 h-4 bg-red-500 rounded text-white flex items-center justify-center text-xs">G</div>;
      case 'instagram':
        return <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded text-white flex items-center justify-center text-xs">📷</div>;
      case 'yelp':
        return <div className="w-4 h-4 bg-red-600 rounded text-white flex items-center justify-center text-xs">Y</div>;
      default:
        return null;
    }
  };

  return (
    <Card className="mx-6 mb-6">
      {/* Title Header */}
      <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-lg font-semibold text-foreground">Locations (131)</h3>
      </div>
      
      {/* Filter Bar */}
      <FilterBar
        onManageFields={onManageFields}
        onAddNewLocation={onAddNewLocation}
        onUploadLocations={onUploadLocations}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      
      {/* Actions Header */}
      <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <span>Bulk Actions</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export Selected</DropdownMenuItem>
              <DropdownMenuItem>Delete Selected</DropdownMenuItem>
              <DropdownMenuItem>Update Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Rows per page:</span>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                <span className="text-sm text-gray-500">...</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(14)}
                  className="w-8 h-8 p-0"
                >
                  14
                </Button>
              </>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              ›
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="bg-[#f9fafb] p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-700 hover:bg-slate-700">
                <TableHead className="w-12 text-[#1a1a1a]">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                    data-testid="select-all-locations"
                  />
                </TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">
                  <div className="flex items-center space-x-1">
                    <span>Store Code</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Location Name</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Business Status</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">
                  <div className="flex items-center space-x-1">
                    <span>POI</span>
                    <Info className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Platform Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((location) => (
                <TableRow
                  key={location.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b"
                  data-testid={`location-row-${location.id}`}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(location.id)}
                      onChange={(event) => handleSelectRow(location.id, event)}
                      data-testid={`select-location-${location.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {location.storeCode}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{location.locationName}</div>
                      <div className="text-sm text-gray-500">
                        {location.locationName.includes('Eskişehir') ? 'Eskişehir\nTepetaş' : 
                         location.locationName.includes('Denizli') ? 'Denizli\nCamlik' :
                         location.locationName.includes('Çanakkale') ? 'Çanakkale\nMerkez' :
                         location.locationName.includes('Adapazarı Agora') ? 'Sakarya\nSerdivan' :
                         location.locationName.includes('Diyarbakır') ? 'Diyarbakır\nYenişehir' :
                         location.locationName.includes('Van') ? 'Van\nMerkez' :
                         location.locationName.includes('Adapazarı Serdivan') ? 'Sakarya\nSerdivan' :
                         location.locationName.includes('Antalya') ? 'Antalya\nAlanya' :
                         location.locationName.includes('Şanlıurfa') ? 'Şanlıurfa\nMerkez' :
                         location.locationName.includes('Tekirdağ') ? 'Tekirdağ\nCorlu' : 'Location Details'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-600 hover:bg-blue-600 text-white">
                      {location.businessStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 text-sm">{location.poiStatus}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {location.platforms.slice(0, 4).map((platform, index) => (
                          <div key={index}>
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(location.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            data-testid={`actions-menu-${location.id}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onRowClick(location.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(location.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Bottom Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <span>Bulk Actions</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export Selected</DropdownMenuItem>
                <DropdownMenuItem>Delete Selected</DropdownMenuItem>
                <DropdownMenuItem>Update Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Rows per page:</span>
              <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="text-sm text-gray-500">...</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(14)}
                    className="w-8 h-8 p-0"
                  >
                    14
                  </Button>
                </>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}