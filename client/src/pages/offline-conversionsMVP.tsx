import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip } from '@mui/material';
import { TrendingUp, TrendingDown, Calendar, Filter, X, Search } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from "recharts";

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

  const resetFilters = () => {
    setFilters({
      dateRange: "30d",
      platforms: [],
      campaigns: [],
      locations: []
    });
    setCampaignSearch("");
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
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1">Platforms</label>
              <div className="flex gap-2">
                {platformOptions.map(platform => (
                  <Button
                    key={platform.value}
                    variant={filters.platforms.includes(platform.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePlatformToggle(platform.value)}
                    className="text-xs"
                    data-testid={`filter-platform-${platform.value}`}
                  >
                    <span className="mr-1">{platform.icon}</span>
                    {platform.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Campaign Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1">Campaigns</label>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      placeholder="Search campaigns..."
                      value={campaignSearch}
                      onChange={(e) => setCampaignSearch(e.target.value)}
                      className="pl-8 w-[200px] h-8"
                      size="small"
                      data-testid="filter-campaign-search"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 max-w-[250px]">
                  {getFilteredCampaigns().slice(0, 4).map(campaign => (
                    <Button
                      key={campaign}
                      variant={filters.campaigns.includes(campaign) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCampaignToggle(campaign)}
                      className="text-xs px-2 py-1 h-6"
                      data-testid={`filter-campaign-${campaign.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {campaign}
                    </Button>
                  ))}
                  {getFilteredCampaigns().length > 4 && (
                    <span className="text-xs text-gray-500 self-center">+{getFilteredCampaigns().length - 4} more</span>
                  )}
                </div>
              </div>
            </div>

            {/* Location Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1">Locations</label>
              <div className="flex flex-wrap gap-1 max-w-[250px]">
                {locationOptions.map(region => (
                  <div key={region.region} className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">{region.region}:</div>
                    <div className="flex flex-wrap gap-1">
                      {region.stores.map(store => (
                        <Button
                          key={store}
                          variant={filters.locations.includes(store) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleLocationToggle(store)}
                          className="text-xs px-2 py-1 h-6"
                          data-testid={`filter-location-${store.replace(/\s+/g, '-').toLowerCase()}`}
                        >
                          {store.replace("Demo ", "")}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="kpi-cards-container">
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
        </div>
      </div>
    </div>
  );
}