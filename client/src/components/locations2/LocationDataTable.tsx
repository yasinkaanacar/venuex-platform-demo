import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, ChevronDown, Download, Facebook, Instagram, CheckCircle, AlertTriangle, Info } from "lucide-react";

// Platform icon helper function
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'facebook':
      return <Facebook className="w-4 h-4 text-blue-600" />;
    case 'google':
      return <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>;
    case 'instagram':
      return <Instagram className="w-4 h-4 text-pink-600" />;
    case 'yelp':
      return <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Y</div>;
    default:
      return null;
  }
};

// Data quality index color helper function
const getDataQualityColor = (percentage: string) => {
  const value = parseInt(percentage.replace('%', ''));
  if (value >= 80) {
    return 'text-green-600';
  } else if (value >= 60) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
};

const getDataQualityIcon = (percentage: string) => {
  const value = parseInt(percentage.replace('%', ''));
  if (value >= 80) {
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  } else if (value >= 60) {
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  } else {
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  }
};

interface LocationData {
  id: string;
  storeCode: string;
  locationName: string;
  businessStatus: 'Open' | 'Closed' | 'Temporarily Closed';
  platformStatus: string;
  poiStatus: string;
  platforms: string[];
}

interface LocationDataTableProps {
  data: LocationData[];
  onRowClick: (id: string) => void;
  onEdit: (id: string) => void;
}

export function LocationDataTable({ data, onRowClick, onEdit }: LocationDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedData.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected = paginatedData.length > 0 && selectedIds.size === paginatedData.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < paginatedData.length;

  return (
    <div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-12 vx-th text-gray-700">
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  data-testid="select-all-locations"
                />
              </TableHead>
              <TableHead className="vx-th text-gray-700 font-medium">
                <div className="flex items-center space-x-1">
                  <span>Store Code</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="vx-th text-gray-700 font-medium">Location Name</TableHead>
              <TableHead className="vx-th text-gray-700 font-medium">Business Status</TableHead>
              <TableHead className="vx-th text-gray-700 font-medium">
                <div className="flex items-center space-x-1">
                  <span>Data Quality Index</span>
                  <Info className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="vx-th text-gray-700 font-medium">Platform Status</TableHead>
              <TableHead className="w-20 vx-th text-gray-700"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((location) => (
                <TableRow
                  key={location.id}
                  className="hover:bg-gray-50 border-b"
                  data-testid={`location-row-${location.id}`}
                >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(location.id)}
                    onChange={handleSelectRow(location.id)}
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
                    {getDataQualityIcon(location.poiStatus)}
                    <span className={`text-sm font-medium ${getDataQualityColor(location.poiStatus)}`}>{location.poiStatus}</span>
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
                      className="vx-icon-button"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="vx-icon-button"
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
              <Button variant="outline" className="vx-button flex items-center space-x-2">
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
          
          <Button variant="outline" className="vx-button flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Rows per page:</span>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
            <SelectTrigger className="vx-select w-16">
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
              className="vx-icon-button"
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
                  className="vx-icon-button"
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
                  className="vx-icon-button"
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
              className="vx-icon-button"
            >
              ›
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
