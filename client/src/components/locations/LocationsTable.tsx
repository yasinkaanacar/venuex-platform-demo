import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, ChevronDown, ChevronUp, Download, Facebook, Instagram, CheckCircle, AlertTriangle, Info, Calendar, TrendingUp } from "lucide-react";
import { FilterBar } from "@/components/locations/FilterBar";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

// Business Profile analytics data
const chartData = [
  { name: 'Aug 25', current: 2000, previous: 1950 },
  { name: '03 Aug', current: 1850, previous: 2100 },
  { name: '05 Aug', current: 1900, previous: 2000 },
  { name: '07 Aug', current: 2400, previous: 1800 },
  { name: '09 Aug', current: 1950, previous: 2050 },
  { name: '11 Aug', current: 1800, previous: 2100 },
  { name: '14 Aug', current: 2100, previous: 1900 },
  { name: '16 Aug', current: 2250, previous: 2200 },
  { name: '18 Aug', current: 1900, previous: 2050 },
  { name: '20 Aug', current: 1850, previous: 1950 },
  { name: '22 Aug', current: 1950, previous: 1900 },
  { name: '24 Aug', current: 2000, previous: 1850 },
  { name: '26 Aug', current: 1950, previous: 1800 },
  { name: '28 Aug', current: 1900, previous: 1950 },
  { name: '30 Aug', current: 2400, previous: 1750 },
];

const platformData = [
  { name: 'Search mobile', value: 58.7, color: '#f59e0b', count: '1,009,909' },
  { name: 'Search web', value: 25.4, color: '#3b82f6', count: '437,131' },
  { name: 'Maps mobile', value: 15.3, color: '#06b6d4', count: '262,691' },
  { name: 'Maps Desktop', value: 0.5, color: '#8b5cf6', count: '9,285' }
];

const searchTerms = [
  { term: 'boyner', count: '920,816' },
  { term: 'calvin klein', count: '16,075' },
  { term: 'avm', count: '11,985' },
  { term: 'boyner mağazaları', count: '10,335' },
  { term: 'boyner outlet', count: '10,049' },
  { term: 'tommy hilfiger', count: '9,373' }
];

const tabs = [
  { label: 'Total', value: '62006', active: true },
  { label: 'Calls Made', value: '23499', active: false },
  { label: 'Website Clicks', value: '3875', active: false },
  { label: 'Direction Requests', value: '34632', active: false }
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
  const [activeTab, setActiveTab] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

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
      {/* First Div - Locations Table */}
      <div>
        {/* Title Header */}
        <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg font-semibold text-foreground">Locations & Performance</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        {isExpanded && (
          <>
            {/* Filter Bar */}
            <FilterBar
              onManageFields={onManageFields}
              onAddNewLocation={onAddNewLocation}
              onUploadLocations={onUploadLocations}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
            
            {/* Business Profile Interactions Section */}
            <div className="border-t border-gray-200">
              <div className="bg-[#f9fafb] p-6">
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    {tabs.map((tab, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === index
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-medium">{tab.label}</div>
                          <div className="text-xs text-gray-500">({tab.value})</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Main Metrics */}
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">62,006</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-lg text-gray-600 dark:text-gray-400">63,615</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Previous</span>
                      </div>
                      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                        -2.5%
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      July 2025 vs August 2025
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-64 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          className="text-xs text-gray-500"
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          className="text-xs text-gray-500"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="current" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="previous" 
                          stroke="#9ca3af" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bottom Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Views */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">Profile views</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold">1,716,216</span>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +82.4%
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        July 2025 vs August 2025
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <div className="flex items-center justify-center">
                          <div className="w-32 h-32">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={platformData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={25}
                                  outerRadius={60}
                                  dataKey="value"
                                >
                                  {platformData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Platform Breakdown */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Platform and device breakdown that people used to find your profile
                          </h5>
                          {platformData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                                <span className="text-gray-500">{item.value}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Total Searches */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">Total searches</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold">1,230,916</span>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +88.4%
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        July 2025 vs August 2025
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          Search terms breakdown that showed your Business Profile in the search results
                        </h5>
                        
                        <div className="space-y-3">
                          {searchTerms.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2">
                              <div className="flex items-center space-x-3">
                                <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">{item.term}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.count}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="outline" className="w-full mt-4">
                          See More
                        </Button>
                      </div>
                    </div>
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
          </>
        )}
      </div>

    </Card>
  );
}