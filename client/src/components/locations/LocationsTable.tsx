import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Edit, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface LocationData {
  id: string;
  storeCode: string;
  locationName: string;
  businessStatus: 'Open' | 'Closed' | 'Temporarily Closed';
  platformStatus: 'Optimal Waiting' | 'Needs Attention' | 'Connected';
}

const mockLocationData: LocationData[] = [
  {
    id: "1",
    storeCode: "SMR1",
    locationName: "Gaziosmanpaşa GMK",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  },
  {
    id: "2", 
    storeCode: "SMR2",
    locationName: "Bayrampaşa Yenidoğan",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  },
  {
    id: "3",
    storeCode: "SMR3",
    locationName: "Bayrampaşa - Cardak",
    businessStatus: "Open", 
    platformStatus: "Optimal Waiting"
  },
  {
    id: "4",
    storeCode: "SMR4",
    locationName: "Beşiktaş - Şehit Abid GMK",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  },
  {
    id: "5",
    storeCode: "SMR5",
    locationName: "Beylikdüzü - Yakuplu",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  },
  {
    id: "6",
    storeCode: "SMR6",
    locationName: "Beyoğlu - Büyük Parmakkapı",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  },
  {
    id: "7",
    storeCode: "SMR7",
    locationName: "Büyükçekmece - Otogar Cad Semt",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  },
  {
    id: "8",
    storeCode: "SMR8",
    locationName: "Esenler - Menderes GMK",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  },
  {
    id: "9",
    storeCode: "SMR9",
    locationName: "Esenyurt - Yakuplu Park AVM",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  },
  {
    id: "10",
    storeCode: "SMR11",
    locationName: "Bakırköy - Osmaniye GMK",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  },
  {
    id: "11",
    storeCode: "SMR13",
    locationName: "Bayrampaşa - Altıntepsi 1",
    businessStatus: "Open",
    platformStatus: "Optimal Waiting"
  }
];

interface FilterState {
  search: string;
  city: string;
  businessStatus: string;
  platformStatus: string;
}

interface LocationsTableProps {
  onRowClick: (id: string) => void;
  onEdit: (id: string) => void;
  filters: FilterState;
}

export function LocationsTable({ onRowClick, onEdit, filters }: LocationsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    const locationCity = location.locationName.split(' - ')[0] || location.locationName.split(' ')[0];
    const cityMatch = !filters.city || locationCity.toLowerCase().includes(filters.city.toLowerCase());
    
    return searchMatch && businessStatusMatch && platformStatusMatch && cityMatch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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

  const getBusinessStatusBadge = (status: LocationData['businessStatus']) => {
    const colors = {
      'Open': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Closed': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'Temporarily Closed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    
    return (
      <Badge className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const getPlatformStatusBadge = (status: LocationData['platformStatus']) => {
    const colors = {
      'Optimal Waiting': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'Needs Attention': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'Connected': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    
    return (
      <Badge className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const isAllSelected = paginatedData.length > 0 && selectedIds.size === paginatedData.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < paginatedData.length;

  return (
    <Card className="mx-6 mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            ({filteredData.length}) locations
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 dark:bg-gray-800">
                <TableHead className="w-12 text-white">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                    data-testid="select-all-locations"
                  />
                </TableHead>
                <TableHead className="text-white">Store Code</TableHead>
                <TableHead className="text-white">Location Name</TableHead>
                <TableHead className="text-white">Business Status</TableHead>
                <TableHead className="text-white">Platform Status</TableHead>
                <TableHead className="w-12 text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((location) => (
                <TableRow
                  key={location.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => onRowClick(location.id)}
                  data-testid={`location-row-${location.id}`}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(location.id)}
                      onChange={(event) => handleSelectRow(location.id, event)}
                      data-testid={`select-location-${location.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {location.storeCode}
                    </code>
                  </TableCell>
                  <TableCell>{location.locationName}</TableCell>
                  <TableCell>
                    {getBusinessStatusBadge(location.businessStatus)}
                  </TableCell>
                  <TableCell>
                    {getPlatformStatusBadge(location.platformStatus)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}