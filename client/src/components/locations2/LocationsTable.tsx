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
import { FilterBar } from "@/components/shared/locations/FilterBar";
import { LocationDataTable } from "@/components/locations2/LocationDataTable";
import { LocationsFilterState } from "@/lib/types/locations";
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
    locationName: "Demo Eskişehir Kanatlı",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "92%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "2",
    storeCode: "CB08",
    locationName: "Demo Denizli Forum",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "68%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "3",
    storeCode: "CB13",
    locationName: "Demo Çanakkale 17 Burda",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "45%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "4",
    storeCode: "CB14",
    locationName: "Demo Adapazarı Agora",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "87%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "5",
    storeCode: "CB15",
    locationName: "Demo Forum Diyarbakır",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "75%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "6",
    storeCode: "CB21",
    locationName: "Demo Van",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "33%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "7",
    storeCode: "CB22",
    locationName: "Demo Adapazarı Serdivan",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "95%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "8",
    storeCode: "CB23",
    locationName: "Demo Antalya Alanyum",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "62%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "9",
    storeCode: "CB27",
    locationName: "Demo Şanlıurfa Piazza",
    businessStatus: "Open" as const,
    platformStatus: "Looks Good!",
    poiStatus: "81%",
    platforms: ["facebook", "google", "instagram", "yelp"],
  },
  {
    id: "10",
    storeCode: "CB28",
    locationName: "Demo Tekirdağ Orion",
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
  { term: "demo", count: "920,816" },
  { term: "calvin klein", count: "16,075" },
  { term: "avm", count: "11,985" },
  { term: "demo mağazaları", count: "10,335" },
  { term: "demo outlet", count: "10,049" },
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
      {/* Locations Data Table Section - Standalone Card */}
      <div className="mx-6 mb-6">
        <Card className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-none">
          {/* Title Header */}
          <div className="vx-surface-muted px-6 py-4 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-base font-semibold text-foreground">Lokasyonlar</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLocationsExpanded(!isLocationsExpanded)}
              className="vx-icon-button"
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
            </>
          )}
        </Card>
      </div>
    </>
  );
}
