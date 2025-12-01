import { useState, useRef, useEffect } from "react";
import { useLocation } from 'wouter';
import { showToast } from "@/lib/toast";
import { LocationsFilterState } from "@/lib/types";
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';

import { LocationsTable } from "@/components/locations/LocationsTable";
import { LocationDataTable } from "@/components/locations/LocationDataTable";
import { FieldManagementDialog } from "@/components/locations/FieldManagementDialog";
import { PlatformSummarySection } from "@/components/locations/PlatformSummarySection";
import { LocationActionsSection } from "@/components/locations/LocationActionsSection";
import DataQualityEnrichment from "@/components/overview/data-quality-enrichment";
import LocationsDataHealthAlerts from "@/components/locations/locations-data-health-alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import { Store, User, Check, Search, GitCompare, X, TrendingUp, ChevronLeft, ChevronRight, ChevronDown, Clock, Globe, Smartphone, ThumbsUp, Plus, Sparkles, MapPin, Map } from 'lucide-react';
import { Tooltip } from '@mui/material';

// Chart data for Business Profile Interaction
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
  { name: "22 Aug", current: 2000, previous: 2100 },
  { name: "24 Aug", current: 2200, previous: 1980 },
  { name: "26 Aug", current: 2150, previous: 2050 },
  { name: "30 Aug", current: 1900, previous: 2000 },
];

const tabs = [
  { label: "Total", value: "62006", active: true },
  { label: "Calls Made", value: "23499", active: false },
  { label: "Website Clicks", value: "3875", active: false },
  { label: "Direction Requests", value: "34632", active: false },
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

// Mock location data for table
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

const mockCalendarPosts = [
  {
    id: 1,
    title: 'Summer Collection Launch',
    platforms: ['google', 'apple'],
    status: 'published',
    startDate: new Date(),
    time: '10:15',
    likes: 45,
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop',
  },
  {
    id: 2,
    title: 'Weekend Flash Sale',
    platforms: ['google'],
    status: 'scheduled',
    startDate: addDays(new Date(), 1),
    time: '16:00',
    likes: 0,
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&h=120&fit=crop',
  },
  {
    id: 3,
    title: 'New Store Opening',
    platforms: ['google', 'apple'],
    status: 'scheduled',
    startDate: addDays(new Date(), 2),
    time: '16:00',
    likes: 0,
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop',
  },
  {
    id: 4,
    title: 'Holiday Special Promo',
    platforms: ['apple'],
    status: 'scheduled',
    startDate: addDays(new Date(), 2),
    time: '09:00',
    likes: 0,
    thumbnail: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=120&h=120&fit=crop',
  },
];

export default function LocationsPage() {
  // State management
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [fieldManagementOpen, setFieldManagementOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [contentTypeOpen, setContentTypeOpen] = useState(false);
  const [contentType, setContentType] = useState('All Content');
  const [, setLocationPath] = useLocation();
  const contentTypeRef = useRef<HTMLDivElement>(null);
  const dayMenuRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<LocationsFilterState>({
    search: "",
    city: "",
    businessStatus: "",
    platformStatus: "",
    storeSet: "",
    missingPOI: "",
    dateRange: "30d",
    platform: "",
    compareMode: false,
    startDate: undefined,
    endDate: undefined,
    compareStartDate: undefined,
    compareEndDate: undefined
  });

  // Filter the location data based on filters
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
      !filters.businessStatus || location.businessStatus === filters.businessStatus;

    // Platform status filter
    const platformStatusMatch =
      !filters.platformStatus || location.platformStatus === filters.platformStatus;

    return searchMatch && businessStatusMatch && platformStatusMatch;
  });

  // Event handlers
  const handleManageFields = () => {
    console.log('Manage fields clicked');
    setFieldManagementOpen(true);
  };

  const scrollToDataHealthDetails = () => {
    const element = document.getElementById('data-health-details');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddNewLocation = () => {
    console.log('Add new location clicked');
    showToast({
      type: 'info',
      title: 'Add New Location',
      description: 'Opening new location form'
    });
  };

  const handleUploadLocations = () => {
    console.log('Upload locations clicked');
    showToast({
      type: 'info',
      title: 'Upload Locations',
      description: 'Opening location upload dialog'
    });
  };

  

  const handleRowClick = (id: string) => {
    console.log('Location row clicked:', id);
    showToast({
      type: 'info',
      title: 'Location Details',
      description: 'Viewing location details'
    });
  };

  const handleEdit = (id: string) => {
    console.log('Edit location clicked:', id);
    showToast({
      type: 'info',
      title: 'Edit Location',
      description: 'Opening edit form'
    });
  };

  // Calendar functions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentTypeRef.current && !contentTypeRef.current.contains(event.target as Node)) {
        setContentTypeOpen(false);
      }
      if (dayMenuRef.current && !dayMenuRef.current.contains(event.target as Node)) {
        setSelectedDay(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const goToPrevWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const handleDayClick = (day: Date) => {
    if (selectedDay && isSameDay(selectedDay, day)) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  };

  const handleCreatePost = (type: string, date?: Date) => {
    setSelectedDay(null);
    const dateParam = date ? `&date=${format(date, 'yyyy-MM-dd')}` : '';
    setLocationPath(`/create-post?scope=${type}${dateParam}`);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const today = new Date();

  const getPostsForDay = (date: Date) => {
    return mockCalendarPosts.filter(post => {
      if (!post.startDate) return false;
      return isSameDay(post.startDate, date);
    });
  };

  const getDayName = (date: Date) => format(date, 'EEE');
  const getDayNumber = (date: Date) => format(date, 'd');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center bg-[#f9fafb]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="p-2">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">Locations</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  {/* Step 1 - Completed */}
                  <Tooltip title="İşletme Profili" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </Tooltip>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  
                  {/* Step 2 - Completed */}
                  <Tooltip title="Satışlar ve Offline Conversion" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </Tooltip>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  
                  {/* Step 3 - Pending */}
                  <Tooltip title="İşletme Profili" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                    <div className="w-6 h-6 border border-gray-400 bg-white rounded-full"></div>
                  </Tooltip>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  
                  {/* Step 4 - Pending */}
                  <Tooltip title="Satışlar ve Offline Conversion" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                    <div className="w-6 h-6 border border-gray-400 bg-white rounded-full"></div>
                  </Tooltip>
                </div>
                <div className="text-xs text-gray-500 mt-2">VenueX Kurulum</div>
              </div>
                <div className="w-4"></div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium" data-testid="text-user-name">Kürşad Arman</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="pb-6 bg-[#ffffff]">
        {/* Data Health & Flow Banner */}
        <div className="px-6 py-4">
          <LocationsDataHealthAlerts 
            bannerMode={true}
            locationsPageMode={true}
            onScrollToBottom={scrollToDataHealthDetails}
          />
        </div>

        {/* Location Actions Section */}
        <LocationActionsSection 
          onAddNewLocation={handleAddNewLocation}
          onUploadLocations={handleUploadLocations}
        />

        {/* Platform Summary Section */}
        <PlatformSummarySection />

        {/* Content Calendar Section */}
        <div className="px-6 pb-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={goToPrevWeek}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    data-testid="button-prev-week"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToToday}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    data-testid="button-today"
                  >
                    Today
                  </button>
                  <button
                    onClick={goToNextWeek}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    data-testid="button-next-week"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <h2 className="text-lg font-semibold text-gray-900" data-testid="text-month-year">
                  {format(currentWeekStart, 'MMMM yyyy')}
                </h2>

                <div className="relative" ref={contentTypeRef}>
                  <button
                    onClick={() => setContentTypeOpen(!contentTypeOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    data-testid="button-content-type"
                  >
                    {contentType}
                    <ChevronDown size={16} className={`transition-transform ${contentTypeOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {contentTypeOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {['All Content', 'Published', 'Scheduled', 'Draft'].map((type) => (
                        <button
                          key={type}
                          onClick={() => { setContentType(type); setContentTypeOpen(false); }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                            contentType === type ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-100">
              {weekDays.map((day, index) => {
                const isToday = isSameDay(day, today);
                return (
                  <div
                    key={index}
                    className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${
                      isToday ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {getDayName(day)}
                    </div>
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      isToday ? 'bg-blue-600 text-white' : 'text-gray-900'
                    }`}>
                      {getDayNumber(day)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-7 min-h-[300px]">
              {weekDays.map((day, index) => {
                const dayPosts = getPostsForDay(day);
                const isToday = isSameDay(day, today);
                const isSelected = selectedDay && isSameDay(selectedDay, day);
                
                return (
                  <div
                    key={index}
                    className={`border-r border-gray-100 last:border-r-0 p-2 relative cursor-pointer hover:bg-gray-50 transition-colors ${
                      isToday ? 'bg-blue-50/50 hover:bg-blue-100/50' : ''
                    } ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                    onClick={() => handleDayClick(day)}
                    data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                  >
                    {isSelected && (
                      <div 
                        ref={dayMenuRef}
                        className="absolute top-2 left-2 right-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-2 border-b border-gray-100 bg-gray-50">
                          <div className="text-xs font-medium text-gray-600">
                            Create post for {format(day, 'MMM d')}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCreatePost('store-set', day)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Store size={14} className="text-gray-500" />
                          Store Set
                        </button>
                        <button
                          onClick={() => handleCreatePost('select-locations', day)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <MapPin size={14} className="text-gray-500" />
                          Select Location(s)
                        </button>
                        <button
                          onClick={() => handleCreatePost('all-locations', day)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Map size={14} className="text-gray-500" />
                          All Locations
                        </button>
                      </div>
                    )}

                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm mb-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative">
                          <img 
                            src={post.thumbnail} 
                            alt={post.title}
                            className="w-full h-16 object-cover"
                          />
                          <div className="absolute top-1 left-1 flex items-center gap-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                            <Clock size={10} />
                            {post.time}
                          </div>
                          <div className="absolute top-1 right-1 flex gap-0.5">
                            {post.platforms.includes('google') && (
                              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <Globe size={10} className="text-blue-500" />
                              </div>
                            )}
                            {post.platforms.includes('apple') && (
                              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <Smartphone size={10} className="text-gray-600" />
                              </div>
                            )}
                          </div>
                        </div>
                        {post.likes > 0 && (
                          <div className="px-2 py-1 flex items-center gap-1 text-xs text-gray-500">
                            <ThumbsUp size={10} className="text-blue-500" />
                            {post.likes}
                          </div>
                        )}
                      </div>
                    ))}

                    {isToday && dayPosts.length === 0 && !isSelected && (
                      <div 
                        className="bg-white rounded-lg border-2 border-dashed border-blue-200 p-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center">
                          <Sparkles size={12} className="text-blue-500" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          Best time to post
                        </p>
                        <button 
                          onClick={() => handleDayClick(day)}
                          className="flex items-center justify-center gap-1 w-full text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Schedule
                          <ChevronDown size={10} />
                        </button>
                      </div>
                    )}

                    {!isSelected && dayPosts.length === 0 && !isToday && (
                      <div className="flex items-center justify-center h-full min-h-[60px]">
                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors">
                          <Plus size={12} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Test Section - Same structure as Platform Summary but without tabs */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          {/* Header without tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
            <h3 className="text-base font-semibold text-foreground">Performance</h3>
          </div>
          {/* Content */}
          <div className="bg-stone-50">
            <div className="px-6 py-3">
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-[400px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by store code, store name or address"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                    data-testid="filter-search"
                  />
                </div>

                {/* Business Status Filter */}
                <Select value={filters.businessStatus || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, businessStatus: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-business-status">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Business Status</div>
                      <div className="text-sm">{filters.businessStatus || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Temporarily Closed">Temporarily Closed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Platform Status Filter */}
                <Select value={filters.platformStatus || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, platformStatus: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-platform-status">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Platform Status</div>
                      <div className="text-sm">{filters.platformStatus || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Optimal Waiting">Optimal Waiting</SelectItem>
                    <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                    <SelectItem value="Connected">Connected</SelectItem>
                  </SelectContent>
                </Select>

                {/* Store Set Filter */}
                <Select value={filters.storeSet || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, storeSet: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-store-set">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Store Set</div>
                      <div className="text-sm">{filters.storeSet || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="SMR">SMR</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                  </SelectContent>
                </Select>

                {/* Missing POI Filter */}
                <Select value={filters.missingPOI || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, missingPOI: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[120px]" data-testid="filter-missing-poi">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Missing POI</div>
                      <div className="text-sm">{filters.missingPOI || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Range Selector */}
                <Select value={filters.dateRange || "30d"} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-date-range">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Date Range</div>
                      <div className="text-sm">
                        {filters.dateRange === "7d" ? "Last 7 days" : filters.dateRange === "30d" ? "Last 30 days" : "Last 90 days"}
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>

                {/* Platform Filter */}
                <Select value={filters.platform || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-platform">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Platform</div>
                      <div className="text-sm">{filters.platform || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Apple Maps">Apple Maps</SelectItem>
                  </SelectContent>
                </Select>

                {/* Compare Mode Toggle */}
                <div className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-md" data-testid="compare-mode-toggle">
                  <GitCompare className="w-4 h-4 text-gray-500" />
                  <Label htmlFor="compare-mode" className="text-sm text-gray-600">Compare</Label>
                  <Switch
                    id="compare-mode"
                    checked={filters.compareMode || false}
                    onChange={(event) => setFilters(prev => ({ ...prev, compareMode: event.target.checked }))}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
              
              {/* Active Filters Display */}
              {Object.values(filters).filter(value => value !== "").length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  <Badge variant="secondary" className="text-xs">
                    {Object.values(filters).filter(value => value !== "").length} active
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      search: "",
                      city: "",
                      businessStatus: "",
                      platformStatus: "",
                      storeSet: "",
                      missingPOI: "",
                      dateRange: "30d",
                      platform: "",
                      compareMode: false,
                      startDate: undefined,
                      endDate: undefined,
                      compareStartDate: undefined,
                      compareEndDate: undefined
                    })}
                    className="text-xs h-6 px-2"
                    data-testid="button-clear-filters"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Separator */}
          <div className="border-b border-slate-200"></div>
          
          {/* Business Profile Interaction Content */}
          <div className="p-6 bg-stone-50">
            <h4 className="text-gray-900 dark:text-white mb-4 font-medium text-[16px]">
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
          </div>
          
          {/* Second Separator */}
          <div className="border-b border-slate-200"></div>
          
          {/* Profile Views and Total Searches Content */}
          <div className="p-6 bg-stone-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:divide-x lg:divide-slate-200">
              {/* Profile Views */}
              <div className="space-y-4 lg:pr-8">
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

              {/* Total Searches */}
              <div className="space-y-4 lg:pl-8">
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
            </div>
          </div>
        </div>

        {/* Locations Section - Copy of Performance */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          {/* Header without tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
            <h3 className="text-base font-semibold text-foreground">Locations</h3>
          </div>
          {/* Content */}
          <div className="bg-stone-50">
            <div className="px-6 py-3">
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-[400px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by store code, store name or address"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                    data-testid="filter-search"
                  />
                </div>

                {/* Business Status Filter */}
                <Select value={filters.businessStatus || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, businessStatus: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-business-status">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Business Status</div>
                      <div className="text-sm">{filters.businessStatus || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Temporarily Closed">Temporarily Closed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Platform Status Filter */}
                <Select value={filters.platformStatus || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, platformStatus: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-platform-status">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Platform Status</div>
                      <div className="text-sm">{filters.platformStatus || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Optimal Waiting">Optimal Waiting</SelectItem>
                    <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                    <SelectItem value="Connected">Connected</SelectItem>
                  </SelectContent>
                </Select>

                {/* Store Set Filter */}
                <Select value={filters.storeSet || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, storeSet: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-store-set">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Store Set</div>
                      <div className="text-sm">{filters.storeSet || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="SMR">SMR</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                  </SelectContent>
                </Select>

                {/* Missing POI Filter */}
                <Select value={filters.missingPOI || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, missingPOI: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[120px]" data-testid="filter-missing-poi">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Missing POI</div>
                      <div className="text-sm">{filters.missingPOI || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Range Selector */}
                <Select value={filters.dateRange || "30d"} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-date-range">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Date Range</div>
                      <div className="text-sm">
                        {filters.dateRange === "7d" ? "Last 7 days" : filters.dateRange === "30d" ? "Last 30 days" : "Last 90 days"}
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>

                {/* Platform Filter */}
                <Select value={filters.platform || "All"} onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value === "All" ? "" : value }))}>
                  <SelectTrigger className="w-[150px]" data-testid="filter-platform">
                    <div className="flex flex-col items-start w-full">
                      <div className="text-xs text-gray-500">Platform</div>
                      <div className="text-sm">{filters.platform || "All"}</div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Apple Maps">Apple Maps</SelectItem>
                  </SelectContent>
                </Select>

                {/* Compare Mode Toggle */}
                <div className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-md" data-testid="compare-mode-toggle">
                  <GitCompare className="w-4 h-4 text-gray-500" />
                  <Label htmlFor="compare-mode" className="text-sm text-gray-600">Compare</Label>
                  <Switch
                    id="compare-mode"
                    checked={filters.compareMode || false}
                    onChange={(event) => setFilters(prev => ({ ...prev, compareMode: event.target.checked }))}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
              
              {/* Active Filters Display */}
              {Object.values(filters).filter(value => value !== "").length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  <Badge variant="secondary" className="text-xs">
                    {Object.values(filters).filter(value => value !== "").length} active
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      search: "",
                      city: "",
                      businessStatus: "",
                      platformStatus: "",
                      storeSet: "",
                      missingPOI: "",
                      dateRange: "30d",
                      platform: "",
                      compareMode: false,
                      startDate: undefined,
                      endDate: undefined,
                      compareStartDate: undefined,
                      compareEndDate: undefined
                    })}
                    className="text-xs h-6 px-2"
                    data-testid="button-clear-filters"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Separator */}
          <div className="border-b border-slate-200"></div>
          
          {/* Location Data Table Content */}
          <CardContent className="p-0 bg-stone-50">
            <LocationDataTable
              data={filteredData}
              onRowClick={handleRowClick}
              onEdit={handleEdit}
            />
          </CardContent>
        </div>



        {/* Data Quality Assessment & Data Enrichment Suggestions */}
        <div className="mx-6 mt-8">
          <DataQualityEnrichment context="locations" />
        </div>

        {/* Alerts & Notifications (Expanded) */}
        <div className="mx-6 mt-8" id="data-health-details">
          <LocationsDataHealthAlerts 
            bannerMode={false}
            alwaysExpanded={true}
            locationsPageMode={true}
          />
        </div>
      </div>
      {/* Field Management Dialog */}
      <FieldManagementDialog 
        isOpen={fieldManagementOpen}
        onClose={() => setFieldManagementOpen(false)}
      />
    </div>
  );
}