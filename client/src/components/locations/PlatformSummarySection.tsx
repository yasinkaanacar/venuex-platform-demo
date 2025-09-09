import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChevronRight, Info, Phone, Navigation, Eye, MousePointer, Search, TrendingUp, Calendar, Plus, Upload, Settings } from "lucide-react";

const platforms = [
  "VenueX",
  "Google Business Profile", 
  "Meta Business",
  "Apple Business Connect",
  "Yandex Maps"
];

const StatusItem = ({ count, label, icon }: { count: number; label: string; icon?: boolean }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-gray-900">{count}</span>
      <span className="text-sm text-gray-600">{label}</span>
      {icon && <Info className="w-4 h-4 text-gray-400" />}
    </div>
  </div>
);

const EngagementMetric = ({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) => (
  <div className="text-center">
    <div className="flex items-center justify-center mb-2">
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

interface FilterState {
  search: string;
  city: string;
  businessStatus: string;
  platformStatus: string;
  storeSet: string;
  missingPOI: string;
}

interface PlatformSummarySectionProps {
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
  onManageFields?: () => void;
  onAddNewLocation?: () => void;
  onUploadLocations?: () => void;
}

export function PlatformSummarySection({
  filters = {
    search: "",
    city: "",
    businessStatus: "",
    platformStatus: "",
    storeSet: "",
    missingPOI: ""
  },
  onFiltersChange,
  onManageFields,
  onAddNewLocation,
  onUploadLocations
}: PlatformSummarySectionProps) {
  const [activePlatform, setActivePlatform] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // Business Profile data
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

  // Filter data
  const cities = ["Istanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Gaziantep"];
  const businessStatuses = ["Open", "Closed", "Temporarily Closed"];
  const platformStatuses = ["Optimal Waiting", "Needs Attention", "Connected"];
  const storeSets = ["SMR", "Premium", "Express", "Standard", "Regional"];

  // Get current date and time
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        [key]: value
      });
    }
  };

  const renderContent = () => {
    if (activePlatform === 1) { // Google Business Profile
      return (
        <div className="p-8 bg-gray-50">
          <div className="flex items-start justify-between mb-8">
            {/* Left side - Main count */}
            <div>
              <div className="text-7xl font-bold text-gray-900 mb-2">131</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* Middle - Status grid */}
            <div className="flex-1 mx-12">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <StatusItem count={5} label="Doğrulanmamış" icon />
                
                <StatusItem count={4} label="Yinelenmış" icon />
                <StatusItem count={1} label="Kalıcı Olarak Kapalı" icon />
                <StatusItem count={0} label="Güncelleme Talebi Platforma Gönderildi" icon />
              </div>
            </div>
          </div>

          {/* Listings Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Listings Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-8">
              <EngagementMetric 
                value={423} 
                label="Profile Views" 
                icon={<Eye className="w-5 h-5 text-blue-500" />}
              />
              <EngagementMetric 
                value={105} 
                label="Phone Calls" 
                icon={<Phone className="w-5 h-5 text-green-500" />}
              />
              <EngagementMetric 
                value={50} 
                label="Driving Directions" 
                icon={<Navigation className="w-5 h-5 text-purple-500" />}
              />
              <EngagementMetric 
                value={45} 
                label="Clicks to Website" 
                icon={<MousePointer className="w-5 h-5 text-orange-500" />}
              />
            </div>
          </div>
        </div>
      );
    }

    if (activePlatform === 2) { // Meta Business
      return (
        <div className="p-8 bg-gray-50">
          <div className="flex items-start justify-between mb-8">
            {/* Left side - Main count */}
            <div>
              <div className="text-7xl font-bold text-gray-900 mb-2">127</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* Middle - Status grid */}
            <div className="flex-1 mx-12">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <StatusItem count={3} label="Beklemede" icon />
                <StatusItem count={2} label="Reddedilmiş" icon />
                <StatusItem count={1} label="İncelenmede" icon />
                <StatusItem count={2} label="Yinelenmış" icon />
                <StatusItem count={0} label="Geçici Kapalı" icon />
                <StatusItem count={1} label="Güncelleme Gerekli" icon />
              </div>
            </div>
          </div>

          {/* Page Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Page Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-8">
              <EngagementMetric 
                value={312} 
                label="Page Views" 
                icon={<Eye className="w-5 h-5 text-blue-500" />}
              />
              <EngagementMetric 
                value={87} 
                label="Phone Calls" 
                icon={<Phone className="w-5 h-5 text-green-500" />}
              />
              <EngagementMetric 
                value={34} 
                label="Get Directions" 
                icon={<Navigation className="w-5 h-5 text-purple-500" />}
              />
              <EngagementMetric 
                value={29} 
                label="Website Clicks" 
                icon={<MousePointer className="w-5 h-5 text-orange-500" />}
              />
            </div>
          </div>
        </div>
      );
    }

    if (activePlatform === 3) { // Apple Business Connect
      return (
        <div className="p-8 bg-gray-50">
          <div className="flex items-start justify-between mb-8">
            {/* Left side - Main count */}
            <div>
              <div className="text-7xl font-bold text-gray-900 mb-2">98</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* Middle - Status grid */}
            <div className="flex-1 mx-12">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <StatusItem count={2} label="Doğrulama Bekliyor" icon />
                <StatusItem count={1} label="Güncellenmeyi Bekliyor" icon />
                <StatusItem count={0} label="Hata" icon />
                <StatusItem count={1} label="Yinelenmış" icon />
                <StatusItem count={0} label="Kapalı" icon />
                <StatusItem count={1} label="Bilgi Eksik" icon />
              </div>
            </div>
          </div>

          {/* Business Connect Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Maps Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-8">
              <EngagementMetric 
                value={256} 
                label="Maps Views" 
                icon={<Eye className="w-5 h-5 text-blue-500" />}
              />
              <EngagementMetric 
                value={72} 
                label="Phone Calls" 
                icon={<Phone className="w-5 h-5 text-green-500" />}
              />
              <EngagementMetric 
                value={45} 
                label="Directions Requests" 
                icon={<Navigation className="w-5 h-5 text-purple-500" />}
              />
              <EngagementMetric 
                value={18} 
                label="Website Visits" 
                icon={<MousePointer className="w-5 h-5 text-orange-500" />}
              />
            </div>
          </div>
        </div>
      );
    }

    if (activePlatform === 4) { // Yandex Maps
      return (
        <div className="p-8 bg-gray-50">
          <div className="flex items-start justify-between mb-8">
            {/* Left side - Main count */}
            <div>
              <div className="text-7xl font-bold text-gray-900 mb-2">89</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* Middle - Status grid */}
            <div className="flex-1 mx-12">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <StatusItem count={4} label="Moderasyonda" icon />
                <StatusItem count={1} label="Reddedildi" icon />
                <StatusItem count={2} label="Eksik Bilgi" icon />
                <StatusItem count={3} label="Yinelenmış" icon />
                <StatusItem count={0} label="Askıda" icon />
                <StatusItem count={1} label="Güncelleme Bekliyor" icon />
              </div>
            </div>
          </div>

          {/* Yandex Maps Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Yandex Maps Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-8">
              <EngagementMetric 
                value={189} 
                label="Profile Views" 
                icon={<Eye className="w-5 h-5 text-blue-500" />}
              />
              <EngagementMetric 
                value={62} 
                label="Phone Calls" 
                icon={<Phone className="w-5 h-5 text-green-500" />}
              />
              <EngagementMetric 
                value={38} 
                label="Route Requests" 
                icon={<Navigation className="w-5 h-5 text-purple-500" />}
              />
              <EngagementMetric 
                value={21} 
                label="Website Clicks" 
                icon={<MousePointer className="w-5 h-5 text-orange-500" />}
              />
            </div>
          </div>
        </div>
      );
    }

    // Default layout for VenueX (index 0) - Combined Locations and Business Profile
    return (
      <div className="p-8 bg-gray-50 space-y-6">
        {/* Header Section with Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Locations</span>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">All</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {onManageFields && (
              <Button
                variant="outline"
                size="sm"
                onClick={onManageFields}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                data-testid="btn-manage-fields"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Posts
              </Button>
            )}
            
            {onAddNewLocation && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddNewLocation}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                data-testid="btn-add-new-location"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Location
              </Button>
            )}
            
            {onUploadLocations && (
              <Button
                size="sm"
                onClick={onUploadLocations}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="btn-upload-locations"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Locations
              </Button>
            )}
          </div>
        </div>

        {/* Combined Locations & Business Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-foreground">Locations & Business Profile Interactions</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>August 2025</span>
            </button>
          </div>

          <div className="bg-[#f9fafb] p-6 space-y-6">
            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by store code, store name or address"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                    data-testid="filter-search"
                  />
                </div>

                {/* Business Status Filter */}
                <Select value={filters.businessStatus || "All"} onValueChange={(value) => handleFilterChange('businessStatus', value === "All" ? "" : value)}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-business-status">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Business Status</div>
                      <div className="text-sm">{filters.businessStatus || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {businessStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Platform Status Filter */}
                <Select value={filters.platformStatus || "All"} onValueChange={(value) => handleFilterChange('platformStatus', value === "All" ? "" : value)}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-platform-status">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Platform Status</div>
                      <div className="text-sm">{filters.platformStatus || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {platformStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Store Set Filter */}
                <Select value={filters.storeSet || ""} onValueChange={(value) => handleFilterChange('storeSet', value)}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-store-set">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm text-gray-500">{filters.storeSet || "Select a store set"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select a store set</SelectItem>
                    {storeSets.map((set) => (
                      <SelectItem key={set} value={set}>
                        {set}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Locations Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Locations Overview</h4>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Son Güncelleme:</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formattedDate} {formattedTime}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">125</div>
                    <div className="text-sm text-gray-600">Aktif</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">3</div>
                    <div className="text-sm text-gray-600">Beklemede</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-1">2</div>
                    <div className="text-sm text-gray-600">Sorunlu</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">130</div>
                  <div className="text-sm text-gray-600">Total Locations</div>
                </div>
              </div>

              {/* Business Profile Interactions Tabs */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Profile Interactions</h4>
                
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
                <div className="flex items-baseline space-x-4 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">62,006</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
                  </div>
                  <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                    -2.5%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Interaction Trends</h4>
              <div className="h-64">
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
            </div>

            {/* Bottom Analytics Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Views */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Profile views</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold">1,716,216</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +82.4%
                    </Badge>
                  </div>
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
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Total searches</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold">1,230,916</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +88.4%
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                    Search terms breakdown
                  </h5>
                  
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
                  
                  <Button variant="outline" className="w-full mt-4">
                    See More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-6 mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Platform Tabs */}
      <div className="flex border-b border-gray-200">
        {platforms.map((platform, index) => (
          <button
            key={index}
            onClick={() => setActivePlatform(index)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-r border-gray-200 last:border-r-0 ${
              activePlatform === index
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
}