import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card as ShadcnCard, CardContent as ShadcnCardContent, CardHeader as ShadcnCardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip } from '@mui/material';
import { TrendingUp, TrendingDown, Calendar, Filter, X, Search, ChevronDown, Check, CheckCircle, Receipt, AlertTriangle, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import funnelImage from '@assets/Screenshot 2025-08-29 at 18.31.46_1756481891401.png';
import vxLogo from '@assets/vx-logo-1000x1000_1756824361260.png';
import EnrichmentSuggestions from '../components/overview/enrichment-suggestions';

// Mock sparkline data for each KPI
const revenueSparklineData = [
  { value: 1100000 }, { value: 1050000 }, { value: 1150000 }, { value: 1200000 }, 
  { value: 1180000 }, { value: 1220000 }, { value: 1250000 }, { value: 1200000 }
];

const conversionsSparklineData = [
  { value: 1980 }, { value: 1920 }, { value: 2050 }, { value: 2100 }, 
  { value: 2080 }, { value: 2150 }, { value: 2200 }, { value: 2150 }
];

const roasSparklineData = [
  { value: 4.2 }, { value: 4.1 }, { value: 4.3 }, { value: 4.5 }, 
  { value: 4.4 }, { value: 4.6 }, { value: 4.7 }, { value: 4.6 }
];

const contributionSparklineData = [
  { value: 32 }, { value: 31 }, { value: 33 }, { value: 34 }, 
  { value: 34 }, { value: 35 }, { value: 36 }, { value: 35 }
];

interface KPICardProps {
  title: string;
  primaryMetric: string;
  changePercent: number;
  isPositiveChange: boolean;
  sparklineData: { value: number }[];
  tooltipContent: string[];
}

function KPICard({ title, primaryMetric, changePercent, isPositiveChange, sparklineData, tooltipContent }: KPICardProps) {
  const formatChange = (percent: number, isPositive: boolean) => {
    const icon = isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
    const color = isPositive ? "text-green-600" : "text-red-600";
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-sm font-medium">{Math.abs(percent)}% vs. previous 30 days</span>
      </div>
    );
  };

  const tooltipTitle = (
    <div className="text-left">
      <div className="font-medium mb-2">{tooltipContent[0]}</div>
      {tooltipContent.slice(1).map((line, index) => (
        <div key={index} className="text-sm">{line}</div>
      ))}
    </div>
  );

  return (
    <Tooltip 
      title={tooltipTitle} 
      arrow 
      componentsProps={{ 
        tooltip: { 
          sx: { 
            fontSize: '14px',
            backgroundColor: '#1f2937',
            '& .MuiTooltip-arrow': {
              color: '#1f2937',
            }
          } 
        } 
      }}
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200" data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <CardContent className="p-6">
          {/* Title */}
          <div className="text-sm font-medium text-gray-600 mb-3" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-title`}>
            {title}
          </div>
          
          {/* Primary Metric */}
          <div className="text-3xl font-bold text-gray-900 mb-2" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-metric`}>
            {primaryMetric}
          </div>
          
          {/* Comparison Metric */}
          <div className="mb-4">
            {formatChange(changePercent, isPositiveChange)}
          </div>
          
          {/* Sparkline Chart */}
          <div className="h-12 w-full" data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}-sparkline`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositiveChange ? "#16a34a" : "#dc2626"} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </Tooltip>
  );
}

// Mock data for filters
const dateRangeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "qtd", label: "Quarter to Date" }
];

const platformOptions = [
  { value: "google", label: "Google Ads", icon: "🔍" },
  { value: "meta", label: "Meta", icon: "📘" },
  { value: "tiktok", label: "TikTok", icon: "🎵" }
];

const campaignsByPlatform = {
  google: [
    "Holiday Sale Campaign",
    "Brand Awareness Q4",
    "Product Launch - Denim",
    "Retargeting - Website"
  ],
  meta: [
    "Social Commerce Push",
    "Video Content Campaign",
    "Lookalike Audiences",
    "Dynamic Product Ads"
  ],
  tiktok: [
    "Gen Z Fashion Trends",
    "Influencer Collaborations",
    "Short Video Ads"
  ]
};

const locationOptions = [
  {
    region: "Istanbul",
    stores: ["Demo Kadıköy Store", "Demo Beşiktaş Store", "Demo Şişli Store"]
  },
  {
    region: "Ankara", 
    stores: ["Demo Kızılay Store", "Demo Çankaya Store"]
  },
  {
    region: "Izmir",
    stores: ["Demo Konak Store", "Demo Bornova Store"]
  }
];

interface FilterState {
  dateRange: string;
  platforms: string[];
  campaigns: string[];
  locations: string[];
}

export default function OfflineConversionsMVP() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: "30d",
    platforms: [],
    campaigns: [],
    locations: []
  });

  const [campaignSearch, setCampaignSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [performanceChartPlatform, setPerformanceChartPlatform] = useState<string>('Google');

  // Mock system alerts data
  const systemAlerts = [
    {
      id: '1',
      type: 'warning',
      icon: AlertTriangle,
      title: 'Data sync delay detected',
      description: 'Meta Ads data is 15 minutes behind schedule',
      timestamp: '11 minutes ago',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600'
    },
    {
      id: '2',
      type: 'success',
      icon: CheckCircle,
      title: 'Data enrichment completed',
      description: '47 location profiles updated with new attributes',
      timestamp: '11 minutes ago',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600'
    },
    {
      id: '3',
      type: 'error',
      icon: AlertCircle,
      title: 'API rate limit warning',
      description: 'Google Ads API approaching rate limit (85% used)',
      timestamp: '11 minutes ago',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600'
    }
  ];
  
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const campaignDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        platformDropdownRef.current && !platformDropdownRef.current.contains(event.target as Node) &&
        campaignDropdownRef.current && !campaignDropdownRef.current.contains(event.target as Node) &&
        locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get available campaigns based on selected platforms
  const getAvailableCampaigns = () => {
    if (filters.platforms.length === 0) {
      return Object.values(campaignsByPlatform).flat();
    }
    return filters.platforms.flatMap(platform => 
      campaignsByPlatform[platform as keyof typeof campaignsByPlatform] || []
    );
  };

  // Filter campaigns by search term
  const getFilteredCampaigns = () => {
    const availableCampaigns = getAvailableCampaigns();
    if (!campaignSearch) return availableCampaigns;
    return availableCampaigns.filter(campaign => 
      campaign.toLowerCase().includes(campaignSearch.toLowerCase())
    );
  };

  // Filter platforms by search term
  const getFilteredPlatforms = () => {
    if (!platformSearch) return platformOptions;
    return platformOptions.filter(platform => 
      platform.label.toLowerCase().includes(platformSearch.toLowerCase())
    );
  };

  // Filter locations by search term
  const getFilteredLocations = () => {
    if (!locationSearch) return locationOptions;
    return locationOptions.map(region => ({
      ...region,
      stores: region.stores.filter(store => 
        store.toLowerCase().includes(locationSearch.toLowerCase()) ||
        region.region.toLowerCase().includes(locationSearch.toLowerCase())
      )
    })).filter(region => region.stores.length > 0);
  };

  // Get all location store names as flat array
  const getAllLocationStores = () => {
    return locationOptions.flatMap(region => region.stores);
  };

  // Handle filter changes
  const handleDateRangeChange = (value: string) => {
    setFilters(prev => ({ ...prev, dateRange: value }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFilters(prev => {
      const newPlatforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      
      // Clear campaigns if platform is deselected
      const availableCampaigns = newPlatforms.flatMap(p => 
        campaignsByPlatform[p as keyof typeof campaignsByPlatform] || []
      );
      const newCampaigns = prev.campaigns.filter(c => availableCampaigns.includes(c));
      
      return { 
        ...prev, 
        platforms: newPlatforms,
        campaigns: newCampaigns
      };
    });
  };

  const handleCampaignToggle = (campaign: string) => {
    setFilters(prev => ({
      ...prev,
      campaigns: prev.campaigns.includes(campaign)
        ? prev.campaigns.filter(c => c !== campaign)
        : [...prev.campaigns, campaign]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  // Handle select/deselect all functions
  const handleSelectAllPlatforms = () => {
    const filteredPlatforms = getFilteredPlatforms();
    setFilters(prev => {
      const newPlatforms = new Set([...prev.platforms, ...filteredPlatforms.map(p => p.value)]);
      return {
        ...prev,
        platforms: Array.from(newPlatforms)
      };
    });
  };

  const handleDeselectAllPlatforms = () => {
    const filteredPlatforms = getFilteredPlatforms();
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.filter(p => !filteredPlatforms.some(fp => fp.value === p))
    }));
  };

  const handleSelectAllCampaigns = () => {
    const filteredCampaigns = getFilteredCampaigns();
    setFilters(prev => {
      const newCampaigns = new Set([...prev.campaigns, ...filteredCampaigns]);
      return {
        ...prev,
        campaigns: Array.from(newCampaigns)
      };
    });
  };

  const handleDeselectAllCampaigns = () => {
    const filteredCampaigns = getFilteredCampaigns();
    setFilters(prev => ({
      ...prev,
      campaigns: prev.campaigns.filter(c => !filteredCampaigns.includes(c))
    }));
  };

  const handleSelectAllLocations = () => {
    const filteredStores = getFilteredLocations().flatMap(region => region.stores);
    setFilters(prev => {
      const newLocations = new Set([...prev.locations, ...filteredStores]);
      return {
        ...prev,
        locations: Array.from(newLocations)
      };
    });
  };

  const handleDeselectAllLocations = () => {
    const filteredStores = getFilteredLocations().flatMap(region => region.stores);
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.filter(l => !filteredStores.includes(l))
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: "30d",
      platforms: [],
      campaigns: [],
      locations: []
    });
    setCampaignSearch("");
    setPlatformSearch("");
    setLocationSearch("");
    setOpenDropdown(null);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateRange !== "30d") count++;
    if (filters.platforms.length > 0) count++;
    if (filters.campaigns.length > 0) count++;
    if (filters.locations.length > 0) count++;
    return count;
  };

  // Remove specific filter
  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case 'dateRange':
        setFilters(prev => ({ ...prev, dateRange: "30d" }));
        break;
      case 'platform':
        if (value) handlePlatformToggle(value);
        break;
      case 'campaign':
        if (value) handleCampaignToggle(value);
        break;
      case 'location':
        if (value) handleLocationToggle(value);
        break;
    }
  };
  const kpiData = [
    {
      title: "Attributed Offline Revenue",
      primaryMetric: "₺1.2M",
      changePercent: 8,
      isPositiveChange: true,
      sparklineData: revenueSparklineData,
      tooltipContent: [
        "Revenue by Platform",
        "• Google Ads: ₺700,000",
        "• Meta: ₺450,000",
        "• TikTok: ₺50,000"
      ]
    },
    {
      title: "Attributed Offline Conversions",
      primaryMetric: "2,150",
      changePercent: 12,
      isPositiveChange: true,
      sparklineData: conversionsSparklineData,
      tooltipContent: [
        "Conversions by Platform",
        "• Google Ads: 1,290",
        "• Meta: 720",
        "• TikTok: 140"
      ]
    },
    {
      title: "Attributed Offline ROAS",
      primaryMetric: "4.6x",
      changePercent: 15,
      isPositiveChange: true,
      sparklineData: roasSparklineData,
      tooltipContent: [
        "Calculation Method",
        "This ROAS is calculated using the total ad spend for campaigns driving both online and offline outcomes. It represents the return generated from the attributed in-store sales portion of the investment."
      ]
    },
    {
      title: "Offline Revenue Contribution",
      primaryMetric: "35%",
      changePercent: 5,
      isPositiveChange: true,
      sparklineData: contributionSparklineData,
      tooltipContent: [
        "Revenue Breakdown",
        "• Attributed Offline: ₺1.2M",
        "• Attributed Online: ₺2.2M",
        "Total Attributed: ₺3.4M"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center bg-[#f9fafb]">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">Offline Conversions MVP</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pb-6 bg-[#ffffff]">
        {/* Filter Bar */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Date Range Picker */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1">Date Range</label>
              <Select value={filters.dateRange} onValueChange={handleDateRangeChange} data-testid="filter-date-range">
                <SelectTrigger className="w-[180px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform Filter */}
            <div className="flex flex-col relative" ref={platformDropdownRef}>
              <label className="text-xs font-medium text-gray-700 mb-1">Platforms</label>
              <Button
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'platforms' ? null : 'platforms')}
                className="w-[200px] justify-between text-xs h-8"
                data-testid="filter-platforms-dropdown"
              >
                <span>
                  {filters.platforms.length === 0 
                    ? "Select platforms..." 
                    : `${filters.platforms.length} selected`}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
              
              {openDropdown === 'platforms' && (
                <div className="absolute top-full left-0 mt-1 w-[280px] bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[300px] overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <Input
                        placeholder="Search platforms..."
                        value={platformSearch}
                        onChange={(e) => setPlatformSearch(e.target.value)}
                        className="pl-8 h-7 text-xs"
                        size="small"
                      />
                    </div>
                  </div>
                  
                  <div className="p-1 border-b border-gray-100 bg-gray-50">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAllPlatforms}
                        className="text-xs h-6 flex-1"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeselectAllPlatforms}
                        className="text-xs h-6 flex-1"
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-[200px] overflow-y-auto">
                    {getFilteredPlatforms().map(platform => (
                      <div
                        key={platform.value}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs"
                        onClick={() => handlePlatformToggle(platform.value)}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                          {filters.platforms.includes(platform.value) && (
                            <Check className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <span className="mr-2">{platform.icon}</span>
                        <span>{platform.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Filter */}
            <div className="flex flex-col relative" ref={campaignDropdownRef}>
              <label className="text-xs font-medium text-gray-700 mb-1">Campaigns</label>
              <Button
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'campaigns' ? null : 'campaigns')}
                className="w-[200px] justify-between text-xs h-8"
                data-testid="filter-campaigns-dropdown"
              >
                <span>
                  {filters.campaigns.length === 0 
                    ? "Select campaigns..." 
                    : `${filters.campaigns.length} selected`}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
              
              {openDropdown === 'campaigns' && (
                <div className="absolute top-full left-0 mt-1 w-[320px] bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[350px] overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <Input
                        placeholder="Search campaigns..."
                        value={campaignSearch}
                        onChange={(e) => setCampaignSearch(e.target.value)}
                        className="pl-8 h-7 text-xs"
                        size="small"
                        data-testid="filter-campaign-search"
                      />
                    </div>
                  </div>
                  
                  <div className="p-1 border-b border-gray-100 bg-gray-50">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAllCampaigns}
                        className="text-xs h-6 flex-1"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeselectAllCampaigns}
                        className="text-xs h-6 flex-1"
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-[250px] overflow-y-auto">
                    {getFilteredCampaigns().map(campaign => (
                      <div
                        key={campaign}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs"
                        onClick={() => handleCampaignToggle(campaign)}
                        data-testid={`filter-campaign-${campaign.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                          {filters.campaigns.includes(campaign) && (
                            <Check className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <span className="truncate">{campaign}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location Filter */}
            <div className="flex flex-col relative" ref={locationDropdownRef}>
              <label className="text-xs font-medium text-gray-700 mb-1">Locations</label>
              <Button
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'locations' ? null : 'locations')}
                className="w-[200px] justify-between text-xs h-8"
                data-testid="filter-locations-dropdown"
              >
                <span>
                  {filters.locations.length === 0 
                    ? "Select locations..." 
                    : `${filters.locations.length} selected`}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
              
              {openDropdown === 'locations' && (
                <div className="absolute top-full left-0 mt-1 w-[300px] bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[350px] overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <Input
                        placeholder="Search locations..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="pl-8 h-7 text-xs"
                        size="small"
                      />
                    </div>
                  </div>
                  
                  <div className="p-1 border-b border-gray-100 bg-gray-50">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAllLocations}
                        className="text-xs h-6 flex-1"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeselectAllLocations}
                        className="text-xs h-6 flex-1"
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-[250px] overflow-y-auto">
                    {getFilteredLocations().map(region => (
                      <div key={region.region}>
                        <div className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-700">
                          {region.region}
                        </div>
                        {region.stores.map(store => (
                          <div
                            key={store}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs ml-2"
                            onClick={() => handleLocationToggle(store)}
                            data-testid={`filter-location-${store.replace(/\s+/g, '-').toLowerCase()}`}
                          >
                            <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                              {filters.locations.includes(store) && (
                                <Check className="w-3 h-3 text-blue-600" />
                              )}
                            </div>
                            <span className="truncate">{store.replace("Demo ", "")}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <div className="flex flex-col justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs"
                data-testid="filter-reset"
              >
                <X className="w-3 h-3 mr-1" />
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {getActiveFilterCount() > 0 && (
            <div className="flex items-center gap-2 flex-wrap" data-testid="active-filters">
              <span className="text-xs text-gray-600">Active filters:</span>
              
              {filters.dateRange !== "30d" && (
                <Badge variant="secondary" className="text-xs">
                  Date: {dateRangeOptions.find(d => d.value === filters.dateRange)?.label}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter('dateRange')}
                  />
                </Badge>
              )}
              
              {filters.platforms.map(platform => (
                <Badge key={platform} variant="secondary" className="text-xs">
                  {platformOptions.find(p => p.value === platform)?.icon} {platformOptions.find(p => p.value === platform)?.label}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter('platform', platform)}
                  />
                </Badge>
              ))}
              
              {filters.campaigns.map(campaign => (
                <Badge key={campaign} variant="secondary" className="text-xs">
                  Campaign: {campaign}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter('campaign', campaign)}
                  />
                </Badge>
              ))}
              
              {filters.locations.map(location => (
                <Badge key={location} variant="secondary" className="text-xs">
                  Location: {location.replace("Demo ", "")}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter('location', location)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-6">
          {/* Strategic KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" data-testid="kpi-cards-container">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                primaryMetric={kpi.primaryMetric}
                changePercent={kpi.changePercent}
                isPositiveChange={kpi.isPositiveChange}
                sparklineData={kpi.sparklineData}
                tooltipContent={kpi.tooltipContent}
              />
            ))}
          </div>
          
          {/* Online-to-Offline Conversion Funnel */}
          <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Online-to-Offline Conversion Funnel</h3>
                <p className="text-sm text-muted-foreground">Conversion metrics from digital channels to physical store</p>
              </div>
              <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-funnel">
                View All →
              </button>
            </div>
            <div className="bg-[#f9fafb] p-6">
              <div className="mb-4 flex justify-center">
                <div className="flex items-center dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-fit bg-[#ffffff]">
                  <button
                    onClick={() => setPerformanceChartPlatform('Google')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                      performanceChartPlatform === 'Google'
                        ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                    data-testid="tab-google"
                  >
                    <div className="w-3.5 h-3.5 bg-[#EA4335] rounded flex items-center justify-center">
                      <SiGoogle className="w-2.5 h-2.5 text-white" />
                    </div>
                    Google
                  </button>
                  
                  <button
                    onClick={() => setPerformanceChartPlatform('Meta')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                      performanceChartPlatform === 'Meta'
                        ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                    data-testid="tab-meta"
                  >
                    <div className="w-3.5 h-3.5 bg-[#1877F2] rounded flex items-center justify-center">
                      <SiMeta className="w-2.5 h-2.5 text-white" />
                    </div>
                    Meta
                  </button>
                  
                  <button
                    onClick={() => setPerformanceChartPlatform('TikTok')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                      performanceChartPlatform === 'TikTok'
                        ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                    data-testid="tab-tiktok"
                  >
                    <div className="w-3.5 h-3.5 bg-black rounded flex items-center justify-center">
                      <SiTiktok className="w-2.5 h-2.5 text-white" />
                    </div>
                    TikTok
                  </button>
                </div>
              </div>
              <div className="relative" data-testid="chart-performance">
                <img 
                  src={funnelImage} 
                  alt="Customer Journey Funnel" 
                  className="w-full rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Data Health & Flow Card */}
          <div className="mt-6">
            <ShadcnCard>
              <ShadcnCardHeader>
                <CardTitle>Data Health & Flow</CardTitle>
                <p className="text-sm text-muted-foreground">Data flow from source systems through VenueX to platforms</p>
              </ShadcnCardHeader>
              
              <ShadcnCardContent className="space-y-8">
              <div className="relative">
                {/* Vertical VenueX alignment guide */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 transform -translate-x-1/2 z-0"></div>
                
                <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 py-4 px-6">
                  {/* Clean Data Flow Layout */}
                  <div className="relative w-full h-[300px]">
                    
                    {/* Connection Lines SVG */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        {/* Clean modern arrowheads */}
                        <marker id="arrow-primary" markerWidth="8" markerHeight="6" 
                          refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                          <polygon points="0,0 0,6 8,3" fill="#3b82f6" />
                        </marker>
                        <marker id="arrow-success" markerWidth="8" markerHeight="6" 
                          refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                          <polygon points="0,0 0,6 8,3" fill="#10b981" />
                        </marker>
                        <marker id="arrow-warning" markerWidth="8" markerHeight="6" 
                          refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                          <polygon points="0,0 0,6 8,3" fill="#f59e0b" />
                        </marker>
                        <marker id="arrow-error" markerWidth="8" markerHeight="6" 
                          refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                          <polygon points="0,0 0,6 8,3" fill="#ef4444" />
                        </marker>
                        
                        {/* Smooth animated gradients for data flow */}
                        <linearGradient id="flowActive" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="20%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                          <stop offset="80%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="transparent" />
                          <animateTransform
                            attributeName="gradientTransform"
                            type="translate"
                            values="-100,0;300,0;-100,0"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </linearGradient>
                        
                        <linearGradient id="flowError" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="20%" stopColor="#ef4444" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#ef4444" stopOpacity="0.7" />
                          <stop offset="80%" stopColor="#ef4444" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="transparent" />
                          <animateTransform
                            attributeName="gradientTransform"
                            type="translate"
                            values="-100,0;300,0;-100,0"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </linearGradient>
                        
                        <linearGradient id="flowWarning" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="20%" stopColor="#f59e0b" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7" />
                          <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="transparent" />
                          <animateTransform
                            attributeName="gradientTransform"
                            type="translate"
                            values="-100,0;300,0;-100,0"
                            dur="2.5s"
                            repeatCount="indefinite"
                          />
                        </linearGradient>
                        
                        {/* Subtle shadow filter */}
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Base connection lines - always visible */}
                      <g opacity="0.3">
                        {/* Store Sales to VenueX */}
                        <path d="M 280 200 L 460 200" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                        {/* VenueX to Ad Platforms */}
                        <path d="M 540 200 L 720 200" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                      </g>
                      
                      {/* Status-based colored lines */}
                      <g>
                        {/* Store Sales (Online - green line) */}
                        <path d="M 280 200 L 460 200" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrow-success)" opacity="0.8" />
                        {/* VenueX to Ad Platforms (Good sync status - green) */}
                        <path d="M 540 200 L 720 200" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrow-success)" opacity="0.8" />
                      </g>
                      
                      {/* Status-based animated flow overlays */}
                      <g>
                        {/* Store Sales active flow - healthy animation */}
                        <path d="M 280 200 L 460 200" stroke="url(#flowActive)" strokeWidth="2" fill="none" opacity="0.8">
                          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                        </path>
                        {/* VenueX to Ad Platforms flow */}
                        <path d="M 540 200 L 720 200" stroke="url(#flowActive)" strokeWidth="2" fill="none" opacity="0.9">
                          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.8s" begin="0.2s" repeatCount="indefinite"/>
                        </path>
                      </g>
                      
                      {/* Data pulse indicators */}
                      <g>
                        <circle cx="375" cy="200" r="3" fill="#10b981" opacity="0.8">
                          <animate attributeName="r" values="2;5;2" dur="2s" begin="0s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="0s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="625" cy="200" r="3" fill="#10b981" opacity="0.8">
                          <animate attributeName="r" values="2;5;2" dur="2s" begin="1s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="1s" repeatCount="indefinite"/>
                        </circle>
                      </g>
                      
                      {/* Connection nodes */}
                      <circle cx="460" cy="200" r="4" fill="#3b82f6" opacity="0.9" stroke="#ffffff" strokeWidth="2"/>
                      <circle cx="540" cy="200" r="4" fill="#3b82f6" opacity="0.9" stroke="#ffffff" strokeWidth="2"/>
                    </svg>

                    {/* Data Sources - Left Side */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 w-56">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">Store Sales</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600">Online - Updated 30s ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Central VenueX Hub */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <img src={vxLogo} alt="VenueX" className="w-8 h-8 object-contain" />
                          </div>
                          <div className="mt-2 font-semibold text-foreground">VenueX</div>
                          <div className="text-xs text-muted-foreground">Data Processing Hub</div>
                        </div>
                      </div>
                    </div>

                    {/* Destination Categories - Right Side */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      {/* Ad Platforms Only */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700 w-48">
                        <div className="text-xs font-semibold text-purple-600 mb-1.5">Ad Platforms</div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-[#EA4335] rounded flex items-center justify-center">
                              <SiGoogle className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">Google Ads</div>
                              <div className="text-xs text-muted-foreground">Synced 10m ago</div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-xs text-white font-bold">M</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">Meta Ads</div>
                              <div className="text-xs text-muted-foreground">Synced 3m ago</div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                              <SiTiktok className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-foreground">TikTok Ads</div>
                              <div className="text-xs text-muted-foreground">Synced 7m ago</div>
                            </div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Alerts & Notifications Section */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Alerts & Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Recent system alerts and data notifications
                    </p>
                  </div>
                  
                  <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-alerts">
                    View All →
                  </button>
                </div>
                
                <div className="space-y-3">
                  {systemAlerts.map((alert) => {
                    const IconComponent = alert.icon;
                    return (
                      <div 
                        key={alert.id}
                        className={`flex items-start p-4 rounded-lg border-2 ${alert.bgColor} ${alert.borderColor} shadow-sm`}
                        data-testid={`alert-${alert.id}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`${alert.iconColor} mt-0.5`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground mb-1">
                              {alert.title}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {alert.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {alert.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              </ShadcnCardContent>
            </ShadcnCard>
          </div>
          
          {/* Data Quality Assessment Card */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Data Quality Assessment</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Overall Score: <span className="text-green-600 font-semibold">97%</span>
                    </p>
                  </div>
                  <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-data-quality">
                    View All →
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Customer Data (Hashed) */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-4">Customer Data (Hashed)</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">First Name</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '92%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">92%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Name</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '89%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">89%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">E-mail</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '78%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">78%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Phone Number</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '71%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">71%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Gender</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '43%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">43%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conversion Data */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-4">Conversion Data</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">City</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '96%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">96%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Zip</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '94%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">94%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Country</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '99%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">99%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Store Code</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '100%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">100%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Value</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '97%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">97%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Time</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '98%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">98%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Data */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-4">Content Data</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Contents</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '94%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">94%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Contents_ID_#</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '91%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">91%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Contents_Quantity_#</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '87%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">87%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Contents_Price_#</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '84%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">84%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Contents_Category_#</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '79%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">79%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Contents_Brand_#</span>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="w-20 sm:w-24 lg:w-32 xl:w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner border border-gray-300 dark:border-gray-600">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm transition-all duration-300" style={{ width: '67%' }}></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-8">67%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Data Enrichment Suggestions */}
                <div className="pt-8 border-t border-border">
                  <EnrichmentSuggestions context={'dashboard'} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}