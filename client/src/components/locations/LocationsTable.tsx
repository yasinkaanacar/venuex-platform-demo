import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { FilterBar } from "@/components/locations/FilterBar";
import { LocationDataTable } from "@/components/locations/LocationDataTable";
import { LocationsFilterState } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Updated mock data to match screenshot
const mockLocationData = [
  {
    id: "1",
    storeCode: "CB06",
    locationName: "Boyner Eskişehir Kanatlı",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "92%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "2",
    storeCode: "CB08",
    locationName: "Boyner Denizli Forum",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "68%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "3",
    storeCode: "CB13",
    locationName: "Boyner Çanakkale 17 Burda",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "45%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "4",
    storeCode: "CB14",
    locationName: "Boyner Adapazarı Agora",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "87%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "5",
    storeCode: "CB15",
    locationName: "Boyner Forum Diyarbakır",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "75%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "6",
    storeCode: "CB21",
    locationName: "Boyner Van",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "33%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "7",
    storeCode: "CB22",
    locationName: "Boyner Adapazarı Serdivan",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "95%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "8",
    storeCode: "CB23",
    locationName: "Boyner Antalya Alanyum",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "62%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "9",
    storeCode: "CB27",
    locationName: "Boyner Şanlıurfa Piazza",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "81%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "10",
    storeCode: "CB28",
    locationName: "Boyner Tekirdağ Orion",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "52%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
];

// Business Profile analytics data
const chartData = [
  { name: "Aug 25", current: 2000, previous: 1950 },
  { name: "03 Aug", current: 1850, previous: 2100 },
  { name: "05 Aug", current: 1900, previous: 2000 },
  { name: "07 Aug", current: 2400, previous: 1800 },
  { name: "09 Aug", current: 1950, previous: 2050 },
  { name: "11 Aug", current: 1800, previous: 2100 },
  { name: "14 Aug", current: 2100, previous: 1900 },
  { name: "16 Aug", current: 2250, previous: 2200 },
  { name: "18 Aug", current: 1900, previous: 2050 },
  { name: "20 Aug", current: 1850, previous: 1950 },
  { name: "22 Aug", current: 1950, previous: 1900 },
  { name: "24 Aug", current: 2000, previous: 1850 },
  { name: "26 Aug", current: 1950, previous: 1800 },
  { name: "28 Aug", current: 1900, previous: 1950 },
  { name: "30 Aug", current: 2400, previous: 1750 },
];

const platformData = [
  { name: "Search mobile", value: 58.7, color: "#f59e0b", count: "1,009,909" },
  { name: "Search web", value: 25.4, color: "#3b82f6", count: "437,131" },
  { name: "Maps mobile", value: 15.3, color: "#06b6d4", count: "262,691" },
  { name: "Maps Desktop", value: 0.5, color: "#8b5cf6", count: "9,285" },
];

const searchTerms = [
  { term: "boyner", count: "920,816" },
  { term: "calvin klein", count: "16,075" },
  { term: "avm", count: "11,985" },
  { term: "boyner mağazaları", count: "10,335" },
  { term: "boyner outlet", count: "10,049" },
  { term: "tommy hilfiger", count: "9,373" },
];

const tabs = [
  { label: "Total", value: "62006", active: true },
  { label: "Calls Made", value: "23499", active: false },
  { label: "Website Clicks", value: "3875", active: false },
  { label: "Direction Requests", value: "34632", active: false },
];

interface LocationsTableProps {
  onRowClick: (id: string) => void;
  onEdit: (id: string) => void;
  filters: LocationsFilterState;
  onManageFields: () => void;
  onAddNewLocation: () => void;
  onUploadLocations: () => void;
  onFiltersChange: (filters: LocationsFilterState) => void;
}

export function LocationsTable({
  onRowClick,
  onEdit,
  filters,
  onManageFields,
  onAddNewLocation,
  onUploadLocations,
  onFiltersChange,
}: LocationsTableProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLocationsExpanded, setIsLocationsExpanded] = useState(false);

  const filteredData = mockLocationData.filter((location) => {
    // Search filter
    const searchMatch =
      !filters.search ||
      location.locationName
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      location.storeCode.toLowerCase().includes(filters.search.toLowerCase());

    // Business status filter
    const businessStatusMatch =
      !filters.businessStatus ||
      location.businessStatus === filters.businessStatus;

    // Platform status filter
    const platformStatusMatch =
      !filters.platformStatus ||
      location.platformStatus === filters.platformStatus;

    // City filter (extract city from location name)
    const locationCity =
      location.locationName.split(" ")[1] ||
      location.locationName.split(" ")[0];
    const cityMatch =
      !filters.city ||
      locationCity.toLowerCase().includes(filters.city.toLowerCase());

    // Store Set filter (based on store code prefix)
    const storeSetMatch =
      !filters.storeSet || location.storeCode.startsWith(filters.storeSet);

    return (
      searchMatch &&
      businessStatusMatch &&
      platformStatusMatch &&
      cityMatch &&
      storeSetMatch
    );
  });

  return (
    <>
      <Card className="mx-6 mb-6 shadow-none border-gray-200 dark:border-gray-700">
        {/* First Div - Locations Table */}
        <div>
          {/* Title Header */}
          <div className="bg-[#f9fafb] py-2 px-6 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-lg font-semibold text-foreground">Performance</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
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

              {/* Business Profile Interactions Section - First Part */}
              <div className="border-t border-gray-200">
                {/* Business Profile Interactions Header */}
                <div className="bg-[#f9fafb] py-2 px-6 flex justify-between items-center border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-foreground">
                    Business Profile Interactions
                  </h3>
                </div>

                <div className="bg-[#f9fafb] p-6">
                  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Business Profile Interaction
                      </h4>
                      {/* Tabs */}
                      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        {tabs.map((tab, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              activeTab === index
                                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-medium">{tab.label}</div>
                              <div className="text-xs text-gray-500">
                                ({tab.value})
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Main Metrics */}
                      <div className="mb-6">
                        <div className="flex items-baseline space-x-4 mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              62,006
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Current
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span className="text-lg text-gray-600 dark:text-gray-400">
                              63,615
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Previous
                            </span>
                          </div>
                          <Badge
                            variant="destructive"
                            className="bg-red-100 text-red-800 hover:bg-red-100"
                          >
                            -2.5%
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          July 2025 vs August 2025
                        </div>
                      </div>

                      {/* Chart */}
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
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Profile Views and Total Searches Section - Second Part */}
              <div className="border-t border-gray-200">
                <div className="bg-[#f9fafb] p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Views */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Profile views
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold">
                                1,716,216
                              </span>
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
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={entry.color}
                                        />
                                      ))}
                                    </Pie>
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Platform Breakdown */}
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                Platform and device breakdown that people used
                                to find your profile
                              </h5>
                              {platformData.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {item.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {item.count}
                                    </span>
                                    <span className="text-gray-500">
                                      {item.value}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Total Searches */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Total searches
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold">
                                1,230,916
                              </span>
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
                              Search terms breakdown that showed your Business
                              Profile in the search results
                            </h5>

                            <div className="space-y-3">
                              {searchTerms.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between py-2"
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                                      {index + 1}
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                      {item.term}
                                    </span>
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
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
      {/* Locations Data Table Section - Standalone Card */}
      <div className="mx-6 mb-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-none">
          {/* Title Header */}
          <div className="bg-[#f9fafb] py-2 px-6 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-lg font-semibold text-foreground">Locations</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLocationsExpanded(!isLocationsExpanded)}
              className="h-8 w-8 p-0"
            >
              {isLocationsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          {isLocationsExpanded && (
            <>
              <FilterBar
                onManageFields={onManageFields}
                onAddNewLocation={onAddNewLocation}
                onUploadLocations={onUploadLocations}
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
              <CardContent className="p-0 bg-[#f9fafb]">
                <LocationDataTable
                  data={filteredData}
                  onRowClick={onRowClick}
                  onEdit={onEdit}
                />
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
