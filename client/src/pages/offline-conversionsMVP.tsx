import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card as ShadcnCard, CardContent as ShadcnCardContent, CardHeader as ShadcnCardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip } from '@mui/material';
import { TrendingUp, TrendingDown, Calendar, Filter, X, Search, ChevronDown, Check, CheckCircle, Receipt, AlertTriangle, AlertCircle, ArrowUpDown, Package, MapPin, DollarSign, ShoppingCart } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import funnelImage from '@assets/Screenshot 2025-08-29 at 18.31.46_1756481891401.png';
import vxLogo from '@assets/vx-logo-1000x1000_1756824361260.png';
import EnrichmentSuggestions from '../components/offline-conversions/enrichment-suggestions';
import WeeklySalesChart from '../components/offline-conversions/weekly-sales-chart';

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
  icon: any;
  iconColor: string;
  iconBg: string;
  previousValue?: string;
}

function KPICard({ title, primaryMetric, changePercent, isPositiveChange, icon: Icon, iconColor, iconBg, previousValue }: KPICardProps) {
  const getTrendColor = (isPositive: boolean) => {
    return isPositive ? "text-green-600" : "text-red-600";
  };

  const TrendIcon = isPositiveChange ? TrendingUp : TrendingDown;

  return (
    <div 
      className="bg-[#f9fafb] shadow-none hover:shadow-sm transition-all duration-200 cursor-pointer hover:scale-105 rounded-lg border border-gray-200 overflow-hidden" 
      data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="p-6 pt-3 bg-[#f9fafb]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground whitespace-nowrap">{title}</h3>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-foreground" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-metric`}>
            {primaryMetric}
          </div>
          <div className={`flex items-center space-x-1 text-xs ${getTrendColor(isPositiveChange)}`}>
            <TrendIcon className="w-3 h-3" />
            <span data-testid={`text-trend-${title.toLowerCase().replace(/\s+/g, '-')}`}>{isPositiveChange ? '+' : ''}{changePercent}%</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          vs {previousValue || primaryMetric} previous period
        </div>
      </div>
    </div>
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

const campaignTypeOptions = [
  { value: "performance", label: "Performance", icon: "📊" },
  { value: "awareness", label: "Awareness", icon: "👁️" },
  { value: "consideration", label: "Consideration", icon: "🤔" },
  { value: "conversion", label: "Conversion", icon: "🎯" }
];

interface FilterState {
  dateRange: string;
  platforms: string[];
  campaigns: string[];
  campaignTypes: string[];
}

// Campaign data interface
interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  platform: 'google' | 'meta' | 'tiktok';
  adSpend: number;
  offlineRevenue: number;
  offlineConversions: number;
  offlineROAS: number;
  blendedROAS: number;
}

// Geographic Performance Data Interface
interface GeoPerformanceData {
  country: string;
  state: string;
  spends: number;
  impressions: number;
  interactions: number;
  directionRequests: number;
  callsMade: number;
  storeVisits: number;
  websiteVisits: number;
  onlineTransactions: number;
  offlineTransactions: number;
  onlineRevenue: number;
  offlineRevenue: number;
  onlineROAS: number;
  offlineROAS: number;
  aov: number;
  multiplier: number;
}

// Mock geographic performance data for Turkish states
const mockGeoData: GeoPerformanceData[] = [
  {
    country: "Turkey", state: "Istanbul", spends: 450000, impressions: 2500000, interactions: 125000, directionRequests: 18000, callsMade: 8500, storeVisits: 45000, 
    websiteVisits: 95000, onlineTransactions: 12500, offlineTransactions: 8900, 
    onlineRevenue: 89000000, offlineRevenue: 80173725, onlineROAS: 87.6, offlineROAS: 78.8, aov: 9800, multiplier: 1.8
  },
  {
    country: "Turkey", state: "Ankara", spends: 280000, impressions: 1800000, interactions: 78000, directionRequests: 12000, callsMade: 5800, storeVisits: 28000, 
    websiteVisits: 62000, onlineTransactions: 8200, offlineTransactions: 5600, 
    onlineRevenue: 54000000, offlineRevenue: 48960000, onlineROAS: 85.2, offlineROAS: 77.3, aov: 9200, multiplier: 1.7
  },
  {
    country: "Turkey", state: "Izmir", spends: 320000, impressions: 2100000, interactions: 89000, directionRequests: 14000, callsMade: 6700, storeVisits: 32000, 
    websiteVisits: 71000, onlineTransactions: 9400, offlineTransactions: 6400, 
    onlineRevenue: 62000000, offlineRevenue: 55360000, onlineROAS: 85.8, offlineROAS: 76.5, aov: 9400, multiplier: 1.75
  },
  {
    country: "Turkey", state: "Antalya", spends: 180000, impressions: 1400000, interactions: 52000, directionRequests: 8500, callsMade: 4200, storeVisits: 19000, 
    websiteVisits: 42000, onlineTransactions: 5600, offlineTransactions: 3800, 
    onlineRevenue: 36000000, offlineRevenue: 32400000, onlineROAS: 88.4, offlineROAS: 79.6, aov: 10200, multiplier: 1.9
  },
  {
    country: "Turkey", state: "Bursa", spends: 220000, impressions: 1600000, interactions: 61000, directionRequests: 9800, callsMade: 4900, storeVisits: 22000, 
    websiteVisits: 49000, onlineTransactions: 6500, offlineTransactions: 4400, 
    onlineRevenue: 42000000, offlineRevenue: 37800000, onlineROAS: 84.4, offlineROAS: 76.0, aov: 9100, multiplier: 1.7
  },
  {
    country: "Turkey", state: "Adana", spends: 150000, impressions: 1200000, interactions: 42000, directionRequests: 7200, callsMade: 3600, storeVisits: 15000, 
    websiteVisits: 34000, onlineTransactions: 4500, offlineTransactions: 3000, 
    onlineRevenue: 28000000, offlineRevenue: 25200000, onlineROAS: 82.5, offlineROAS: 74.2, aov: 8900, multiplier: 1.6
  },
  {
    country: "Turkey", state: "Konya", spends: 95000, impressions: 950000, interactions: 27000, directionRequests: 5400, callsMade: 2700, storeVisits: 9800, 
    websiteVisits: 22000, onlineTransactions: 2900, offlineTransactions: 1950, 
    onlineRevenue: 18000000, offlineRevenue: 16200000, onlineROAS: 83.8, offlineROAS: 75.4, aov: 9300, multiplier: 1.65
  },
  {
    country: "Turkey", state: "Gaziantep", spends: 78000, impressions: 780000, interactions: 22000, directionRequests: 4400, callsMade: 2200, storeVisits: 8000, 
    websiteVisits: 18000, onlineTransactions: 2400, offlineTransactions: 1600, 
    onlineRevenue: 15000000, offlineRevenue: 13500000, onlineROAS: 85.0, offlineROAS: 76.5, aov: 9500, multiplier: 1.7
  },
  {
    country: "Turkey", state: "Kocaeli", spends: 125000, impressions: 1100000, interactions: 35000, directionRequests: 6300, callsMade: 3150, storeVisits: 12800, 
    websiteVisits: 28000, onlineTransactions: 3700, offlineTransactions: 2550, 
    onlineRevenue: 23000000, offlineRevenue: 20700000, onlineROAS: 81.3, offlineROAS: 73.2, aov: 8800, multiplier: 1.6
  },
  {
    country: "Turkey", state: "Mersin", spends: 68000, impressions: 680000, interactions: 19000, directionRequests: 3800, callsMade: 1900, storeVisits: 6900, 
    websiteVisits: 15000, onlineTransactions: 2000, offlineTransactions: 1380, 
    onlineRevenue: 12500000, offlineRevenue: 11250000, onlineROAS: 81.2, offlineROAS: 73.2, aov: 8900, multiplier: 1.62
  }
];

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Holiday Sale Campaign',
    status: 'active',
    platform: 'google',
    adSpend: 45000,
    offlineRevenue: 234000,
    offlineConversions: 456,
    offlineROAS: 5.2,
    blendedROAS: 6.8
  },
  {
    id: '2',
    name: 'Social Commerce Push',
    status: 'active',
    platform: 'meta',
    adSpend: 32000,
    offlineRevenue: 128000,
    offlineConversions: 289,
    offlineROAS: 4.0,
    blendedROAS: 5.5
  },
  {
    id: '3',
    name: 'Brand Awareness Q4',
    status: 'active',
    platform: 'google',
    adSpend: 28000,
    offlineRevenue: 89600,
    offlineConversions: 167,
    offlineROAS: 3.2,
    blendedROAS: 4.1
  },
  {
    id: '4',
    name: 'Gen Z Fashion Trends',
    status: 'active',
    platform: 'tiktok',
    adSpend: 18000,
    offlineRevenue: 108000,
    offlineConversions: 201,
    offlineROAS: 6.0,
    blendedROAS: 7.2
  },
  {
    id: '5',
    name: 'Product Launch - Denim',
    status: 'paused',
    platform: 'google',
    adSpend: 22000,
    offlineRevenue: 44000,
    offlineConversions: 89,
    offlineROAS: 2.0,
    blendedROAS: 3.5
  },
  {
    id: '6',
    name: 'Video Content Campaign',
    status: 'active',
    platform: 'meta',
    adSpend: 25000,
    offlineRevenue: 125000,
    offlineConversions: 234,
    offlineROAS: 5.0,
    blendedROAS: 6.3
  },
  {
    id: '7',
    name: 'Influencer Collaborations',
    status: 'active',
    platform: 'tiktok',
    adSpend: 15000,
    offlineRevenue: 52500,
    offlineConversions: 98,
    offlineROAS: 3.5,
    blendedROAS: 4.8
  },
  {
    id: '8',
    name: 'Retargeting - Website',
    status: 'error',
    platform: 'google',
    adSpend: 12000,
    offlineRevenue: 36000,
    offlineConversions: 67,
    offlineROAS: 3.0,
    blendedROAS: 5.2
  }
];

// Campaign Table Component
function CampaignTable({ filters }: { filters: FilterState }) {
  const [sortColumn, setSortColumn] = useState<keyof Campaign | null>('offlineROAS');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: keyof Campaign) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getROASColor = (roas: number) => {
    if (roas >= 5) return 'text-green-600 bg-green-50';
    if (roas >= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-gray-400';
      case 'error': return 'bg-red-500';
    }
  };

  const getPlatformBadge = (platform: Campaign['platform']) => {
    switch (platform) {
      case 'google':
        return (
          <Badge className="bg-[#EA4335] text-white hover:bg-[#EA4335]">
            <SiGoogle className="w-3 h-3 mr-1" />
            Google
          </Badge>
        );
      case 'meta':
        return (
          <Badge className="bg-[#1877F2] text-white hover:bg-[#1877F2]">
            <SiMeta className="w-3 h-3 mr-1" />
            Meta
          </Badge>
        );
      case 'tiktok':
        return (
          <Badge className="bg-black text-white hover:bg-black">
            <SiTiktok className="w-3 h-3 mr-1" />
            TikTok
          </Badge>
        );
    }
  };

  // Filter campaigns based on filter state
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    if (filters.platforms.length > 0 && !filters.platforms.includes(campaign.platform)) {
      return false;
    }
    if (filters.campaigns.length > 0 && !filters.campaigns.includes(campaign.name)) {
      return false;
    }
    return true;
  });

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });

  const formatCurrency = (amount: number) => {
    return `₺${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
              Campaign Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('platform')}>
              Platform {sortColumn === 'platform' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('adSpend')}>
              Ad Spend {sortColumn === 'adSpend' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('offlineRevenue')}>
              Offline Revenue {sortColumn === 'offlineRevenue' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('offlineConversions')}>
              Offline Conversions {sortColumn === 'offlineConversions' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('offlineROAS')}>
              Offline ROAS {sortColumn === 'offlineROAS' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('blendedROAS')}>
              Blended ROAS {sortColumn === 'blendedROAS' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCampaigns.map((campaign) => (
            <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" data-testid={`campaign-row-${campaign.id}`}>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status)}`} />
                  <span className="text-sm font-medium text-gray-900">{campaign.name}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                {getPlatformBadge(campaign.platform)}
              </td>
              <td className="py-3 px-4 text-right text-sm text-gray-900">
                {formatCurrency(campaign.adSpend)}
              </td>
              <td className="py-3 px-4 text-right text-sm font-medium text-gray-900">
                {formatCurrency(campaign.offlineRevenue)}
              </td>
              <td className="py-3 px-4 text-right text-sm text-gray-900">
                {campaign.offlineConversions.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right">
                <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${getROASColor(campaign.offlineROAS)}`}>
                  {campaign.offlineROAS.toFixed(1)}x
                </span>
              </td>
              <td className="py-3 px-4 text-right text-sm font-medium text-gray-900">
                {campaign.blendedROAS.toFixed(1)}x
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sortedCampaigns.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No campaigns match the selected filters
        </div>
      )}
    </div>
  );
}

// Top Performing Campaigns Component
function TopPerformingCampaigns() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Performing Campaigns</h3>
          <p className="text-sm text-muted-foreground">Spend, Roas, Visits, Purchase by campaign</p>
        </div>
      </div>
      <div className="bg-[#f9fafb] p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('campaign')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Campaign
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('impressions')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Impressions
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('ctv')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    CTV (Click to Visit)
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('spend')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Spend
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('roas')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    ROAS
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('visits')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Visits
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('purchases')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Purchases
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              <tr className="hover:bg-muted/50" data-testid="row-campaign-summer-sale">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#EA4335] rounded flex items-center justify-center flex-shrink-0">
                      <SiGoogle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Summer Sale 2024</div>
                      <div className="text-sm text-muted-foreground">google-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">142,580</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">3.4%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$16,350</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">4.2x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">24,387</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">1,247</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-local-shopping">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#EA4335] rounded flex items-center justify-center flex-shrink-0">
                      <SiGoogle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Local Shopping Campaign</div>
                      <div className="text-sm text-muted-foreground">google-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">118,420</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">2.9%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$15,420</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">3.8x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">18,652</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">923</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-store-promo">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">f</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Local Store Promo</div>
                      <div className="text-sm text-muted-foreground">meta-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">89,670</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">4.1%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$12,840</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">5.1x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">16,234</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">785</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-visit-drive">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">f</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Store Visit Drive</div>
                      <div className="text-sm text-muted-foreground">meta-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">135,240</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">3.7%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$18,960</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">3.6x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">21,089</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">634</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-gen-z">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0">
                      <SiTiktok className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Gen Z Store Discovery</div>
                      <div className="text-sm text-muted-foreground">tiktok-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">78,950</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">2.8%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$8,920</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">2.9x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">12,473</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">298</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OfflineConversionsMVP() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: "30d",
    platforms: [],
    campaigns: [],
    campaignTypes: []
  });

  const [campaignSearch, setCampaignSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");
  const [campaignTypeSearch, setCampaignTypeSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Geographic Performance Dashboard State
  const [geoCountry, setGeoCountry] = useState<string>("turkey");
  const [geoState, setGeoState] = useState<string>("all");
  const [selectedMapState, setSelectedMapState] = useState<string | null>(null);

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
  
  const dateRangeDropdownRef = useRef<HTMLDivElement>(null);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const campaignDropdownRef = useRef<HTMLDivElement>(null);
  const campaignTypeDropdownRef = useRef<HTMLDivElement>(null);
  const dataHealthFlowRef = useRef<HTMLDivElement>(null);

  // Scroll to Data Health & Flow section
  const scrollToBottom = () => {
    dataHealthFlowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateRangeDropdownRef.current && !dateRangeDropdownRef.current.contains(event.target as Node) &&
        platformDropdownRef.current && !platformDropdownRef.current.contains(event.target as Node) &&
        campaignDropdownRef.current && !campaignDropdownRef.current.contains(event.target as Node) &&
        campaignTypeDropdownRef.current && !campaignTypeDropdownRef.current.contains(event.target as Node)
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

  // Filter campaign types by search term
  const getFilteredCampaignTypes = () => {
    if (!campaignTypeSearch) return campaignTypeOptions;
    return campaignTypeOptions.filter(type => 
      type.label.toLowerCase().includes(campaignTypeSearch.toLowerCase())
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

  const handleCampaignTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      campaignTypes: prev.campaignTypes.includes(type)
        ? prev.campaignTypes.filter(t => t !== type)
        : [...prev.campaignTypes, type]
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

  const handleSelectAllCampaignTypes = () => {
    const filteredTypes = getFilteredCampaignTypes();
    setFilters(prev => {
      const newTypes = new Set([...prev.campaignTypes, ...filteredTypes.map(t => t.value)]);
      return {
        ...prev,
        campaignTypes: Array.from(newTypes)
      };
    });
  };

  const handleDeselectAllCampaignTypes = () => {
    const filteredTypes = getFilteredCampaignTypes();
    setFilters(prev => ({
      ...prev,
      campaignTypes: prev.campaignTypes.filter(t => !filteredTypes.some(ft => ft.value === t))
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: "30d",
      platforms: [],
      campaigns: [],
      campaignTypes: []
    });
    setCampaignSearch("");
    setPlatformSearch("");
    setCampaignTypeSearch("");
    setOpenDropdown(null);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateRange !== "30d") count++;
    if (filters.platforms.length > 0) count++;
    if (filters.campaigns.length > 0) count++;
    if (filters.campaignTypes.length > 0) count++;
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
      case 'campaignType':
        if (value) handleCampaignTypeToggle(value);
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
      ],
      icon: DollarSign,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      previousValue: "₺1.1M"
    },
    {
      title: "Attributed In-Store Sales",
      primaryMetric: "2,150",
      changePercent: 12,
      isPositiveChange: true,
      sparklineData: conversionsSparklineData,
      tooltipContent: [
        "Conversions by Platform",
        "• Google Ads: 1,290",
        "• Meta: 720",
        "• TikTok: 140"
      ],
      icon: ShoppingCart,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      previousValue: "1,920"
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
      ],
      icon: TrendingUp,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      previousValue: "4.0x"
    },
    {
      title: "Attributed Revenue Share",
      primaryMetric: "35%",
      changePercent: 5,
      isPositiveChange: true,
      sparklineData: contributionSparklineData,
      tooltipContent: [
        "Revenue Breakdown",
        "• Attributed Offline: ₺1.2M",
        "• Attributed Online: ₺2.2M",
        "Total Attributed: ₺3.4M"
      ],
      icon: Receipt,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      previousValue: "33%"
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
        {/* Data Health & Flow Banner */}
        <div className="px-6 pt-6 mb-6">
          <div 
            className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 rounded-lg shadow-none cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors"
            onClick={scrollToBottom}
          >
            <div className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    Data Health & Flow
                  </h2>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Everything is well</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs pointer-events-none"
                  data-testid="button-scroll-to-bottom"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-end gap-3 mb-4">
            {/* Date Range Picker */}
            <div className="relative" ref={dateRangeDropdownRef}>
              <Button
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'dateRange' ? null : 'dateRange')}
                className="h-9 px-4 justify-between !border-gray-300 !bg-gray-100 hover:!bg-gray-200 !text-black"
                data-testid="filter-date-range"
              >
                <span className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {dateRangeOptions.find(d => d.value === filters.dateRange)?.label}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
              {openDropdown === 'dateRange' && (
                <div className="absolute top-full left-0 mt-1 w-[180px] bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                  <div className="max-h-[250px] overflow-y-auto">
                    {dateRangeOptions.map(option => (
                      <div
                        key={option.value}
                        className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs ${
                          filters.dateRange === option.value ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => {
                          handleDateRangeChange(option.value);
                          setOpenDropdown(null);
                        }}
                        data-testid={`filter-date-${option.value}`}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                          {filters.dateRange === option.value && (
                            <Check className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Platform Filter */}
            <div className="relative" ref={platformDropdownRef}>
              <Button
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'platforms' ? null : 'platforms')}
                className="h-9 px-4 justify-between !border-gray-300 !bg-gray-100 hover:!bg-gray-200 !text-black"
                data-testid="filter-platforms-dropdown"
              >
                <span className="text-sm">
                  {filters.platforms.length === 0 
                    ? "Platforms" 
                    : `Platforms (${filters.platforms.length})`}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
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

            {/* Campaign Type Filter */}
            <div className="relative" ref={campaignTypeDropdownRef}>
              <Button
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'campaignTypes' ? null : 'campaignTypes')}
                className="h-9 px-4 justify-between !border-gray-300 !bg-gray-100 hover:!bg-gray-200 !text-black"
                data-testid="filter-campaign-types-dropdown"
              >
                <span className="text-sm">
                  {filters.campaignTypes.length === 0 
                    ? "Campaign Type" 
                    : `Campaign Type (${filters.campaignTypes.length})`}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
              {openDropdown === 'campaignTypes' && (
                <div className="absolute top-full left-0 mt-1 w-[280px] bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[300px] overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <Input
                        placeholder="Search campaign types..."
                        value={campaignTypeSearch}
                        onChange={(e) => setCampaignTypeSearch(e.target.value)}
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
                        onClick={handleSelectAllCampaignTypes}
                        className="text-xs h-6 flex-1"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeselectAllCampaignTypes}
                        className="text-xs h-6 flex-1"
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-[200px] overflow-y-auto">
                    {getFilteredCampaignTypes().map(type => (
                      <div
                        key={type.value}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs"
                        onClick={() => handleCampaignTypeToggle(type.value)}
                        data-testid={`filter-campaign-type-${type.value}`}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                          {filters.campaignTypes.includes(type.value) && (
                            <Check className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <span className="mr-2">{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Filter */}
            <div className="relative" ref={campaignDropdownRef}>
              <Button
                variant="outline"
                onClick={() => setOpenDropdown(openDropdown === 'campaigns' ? null : 'campaigns')}
                className="h-9 px-4 justify-between !border-gray-300 !bg-gray-100 hover:!bg-gray-200 !text-black"
                data-testid="filter-campaigns-dropdown"
              >
                <span className="text-sm">
                  {filters.campaigns.length === 0 
                    ? "Campaigns" 
                    : `Campaigns (${filters.campaigns.length})`}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
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

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={resetFilters}
              className="h-9 px-4 text-sm !border-gray-300 !bg-gray-100 hover:!bg-gray-200 !text-black"
              data-testid="filter-reset"
            >
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
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
              
              {filters.campaignTypes.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {campaignTypeOptions.find(t => t.value === type)?.icon} {campaignTypeOptions.find(t => t.value === type)?.label}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter('campaignType', type)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-6">
          {/* Strategic KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" data-testid="kpi-cards-container">
            <KPICard
              title={kpiData[0].title}
              primaryMetric={kpiData[0].primaryMetric}
              changePercent={kpiData[0].changePercent}
              isPositiveChange={kpiData[0].isPositiveChange}
              sparklineData={kpiData[0].sparklineData}
              tooltipContent={kpiData[0].tooltipContent}
              icon={kpiData[0].icon}
              iconColor={kpiData[0].iconColor}
              iconBg={kpiData[0].iconBg}
              previousValue={kpiData[0].previousValue}
            />
            <KPICard
              title={kpiData[1].title}
              primaryMetric={kpiData[1].primaryMetric}
              changePercent={kpiData[1].changePercent}
              isPositiveChange={kpiData[1].isPositiveChange}
              sparklineData={kpiData[1].sparklineData}
              tooltipContent={kpiData[1].tooltipContent}
              icon={kpiData[1].icon}
              iconColor={kpiData[1].iconColor}
              iconBg={kpiData[1].iconBg}
              previousValue={kpiData[1].previousValue}
            />
            <KPICard
              title={kpiData[2].title}
              primaryMetric={kpiData[2].primaryMetric}
              changePercent={kpiData[2].changePercent}
              isPositiveChange={kpiData[2].isPositiveChange}
              sparklineData={kpiData[2].sparklineData}
              tooltipContent={kpiData[2].tooltipContent}
              icon={kpiData[2].icon}
              iconColor={kpiData[2].iconColor}
              iconBg={kpiData[2].iconBg}
              previousValue={kpiData[2].previousValue}
            />
            <KPICard
              title={kpiData[3].title}
              primaryMetric={kpiData[3].primaryMetric}
              changePercent={kpiData[3].changePercent}
              isPositiveChange={kpiData[3].isPositiveChange}
              sparklineData={kpiData[3].sparklineData}
              tooltipContent={kpiData[3].tooltipContent}
              icon={kpiData[3].icon}
              iconColor={kpiData[3].iconColor}
              iconBg={kpiData[3].iconBg}
              previousValue={kpiData[3].previousValue}
            />
          </div>
          
          {/* Online-to-Offline Conversion Funnel */}
          <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Online-to-Offline Conversion Funnel</h3>
                <p className="text-sm text-muted-foreground">Conversion metrics from digital channels to physical store</p>
              </div>
            </div>
            <div className="bg-[#f9fafb] p-6">
              <div className="relative" data-testid="chart-performance">
                <img 
                  src={funnelImage} 
                  alt="Customer Journey Funnel" 
                  className="w-full rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Weekly Sales Chart */}
          <div className="mt-6">
            <WeeklySalesChart />
          </div>

          {/* Top Performing Campaigns */}
          <div className="mt-6">
            <TopPerformingCampaigns />
          </div>
          
          {/* Geographic Performance Dashboard */}
          <div className="mt-6">
            <Card className="bg-[#f9fafb]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Geographic Performance</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Country:</label>
                      <Select value={geoCountry} onValueChange={setGeoCountry}>
                        <SelectTrigger className="w-36 border-gray-300" data-testid="select-geo-country">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="turkey">Turkey</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">State:</label>
                      <Select value={geoState} onValueChange={(value) => {
                        setGeoState(value);
                        setSelectedMapState(value === "all" ? null : value);
                      }}>
                        <SelectTrigger className="w-40 border-gray-300" data-testid="select-geo-state">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All States</SelectItem>
                          {mockGeoData.map(item => (
                            <SelectItem key={item.state} value={item.state}>{item.state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Maps Visualization */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Offline Revenue Distribution Map */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Offline Revenue Distribution</h3>
                    <div className="relative h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center p-4">
                      <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        {mockGeoData.map((item) => {
                          const totalRevenue = item.offlineRevenue;
                          const maxRevenue = Math.max(...mockGeoData.map(d => d.offlineRevenue));
                          const intensity = (totalRevenue / maxRevenue);
                          const isSelected = selectedMapState === item.state;
                          const fillColor = `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
                          
                          // SVG paths for Turkish provinces (simplified shapes)
                          const provincePaths: Record<string, string> = {
                            'Istanbul': 'M150,120 L180,110 L200,115 L210,130 L200,150 L170,155 L140,145 Z',
                            'Kocaeli': 'M215,125 L245,120 L260,135 L255,155 L235,160 L210,150 Z',
                            'Bursa': 'M140,160 L170,160 L190,175 L185,200 L160,210 L130,195 Z',
                            'Izmir': 'M50,280 L90,275 L110,290 L105,320 L80,335 L45,320 Z',
                            'Ankara': 'M350,180 L410,175 L435,195 L430,230 L395,245 L340,230 Z',
                            'Konya': 'M340,280 L410,275 L440,295 L435,340 L390,360 L330,345 Z',
                            'Antalya': 'M180,380 L230,375 L255,390 L250,425 L215,440 L175,425 Z',
                            'Mersin': 'M360,370 L410,365 L435,380 L430,415 L395,430 L355,415 Z',
                            'Adana': 'M445,355 L495,350 L520,365 L515,400 L480,415 L440,400 Z',
                            'Gaziantep': 'M600,320 L650,315 L675,330 L670,365 L635,380 L595,365 Z'
                          };
                          
                          const path = provincePaths[item.state];
                          if (!path) return null;
                          
                          return (
                            <Tooltip 
                              key={item.state}
                              title={
                                <div className="text-left">
                                  <div className="font-medium">{item.state}</div>
                                  <div className="text-sm">Revenue: ₺{(totalRevenue / 1000000).toFixed(1)}M</div>
                                </div>
                              }
                              arrow
                            >
                              <g>
                                <path
                                  d={path}
                                  fill={fillColor}
                                  stroke={isSelected ? '#3b82f6' : '#9ca3af'}
                                  strokeWidth={isSelected ? '3' : '1'}
                                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                                  onClick={() => {
                                    setGeoState(item.state);
                                    setSelectedMapState(item.state);
                                  }}
                                  data-testid={`map-revenue-${item.state.toLowerCase()}`}
                                />
                                <text
                                  x={path.includes('Istanbul') ? 175 : path.includes('Ankara') ? 385 : path.includes('Izmir') ? 77 : path.includes('Konya') ? 385 : path.includes('Bursa') ? 160 : path.includes('Kocaeli') ? 237 : path.includes('Antalya') ? 212 : path.includes('Mersin') ? 397 : path.includes('Adana') ? 477 : 632}
                                  y={path.includes('Istanbul') ? 135 : path.includes('Ankara') ? 210 : path.includes('Izmir') ? 305 : path.includes('Konya') ? 315 : path.includes('Bursa') ? 185 : path.includes('Kocaeli') ? 142 : path.includes('Antalya') ? 407 : path.includes('Mersin') ? 397 : path.includes('Adana') ? 382 : 347}
                                  fill="white"
                                  fontSize="11"
                                  fontWeight="600"
                                  textAnchor="middle"
                                  className="pointer-events-none drop-shadow-lg"
                                >
                                  {item.state}
                                </text>
                              </g>
                            </Tooltip>
                          );
                        })}
                      </svg>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span>₺37,956</span>
                      <div className="flex-1 mx-3 h-4 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded"></div>
                      <span>₺169,173,725</span>
                    </div>
                  </div>
                  
                  {/* Offline ROAS Distribution Map */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Offline ROAS Distribution</h3>
                    <div className="relative h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center p-4">
                      <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        {mockGeoData.map((item) => {
                          const avgROAS = item.offlineROAS;
                          const maxROAS = Math.max(...mockGeoData.map(d => d.offlineROAS));
                          const intensity = (avgROAS / maxROAS);
                          const isSelected = selectedMapState === item.state;
                          const fillColor = `rgba(34, 197, 94, ${0.3 + intensity * 0.7})`;
                          
                          // SVG paths for Turkish provinces (same as revenue map)
                          const provincePaths: Record<string, string> = {
                            'Istanbul': 'M150,120 L180,110 L200,115 L210,130 L200,150 L170,155 L140,145 Z',
                            'Kocaeli': 'M215,125 L245,120 L260,135 L255,155 L235,160 L210,150 Z',
                            'Bursa': 'M140,160 L170,160 L190,175 L185,200 L160,210 L130,195 Z',
                            'Izmir': 'M50,280 L90,275 L110,290 L105,320 L80,335 L45,320 Z',
                            'Ankara': 'M350,180 L410,175 L435,195 L430,230 L395,245 L340,230 Z',
                            'Konya': 'M340,280 L410,275 L440,295 L435,340 L390,360 L330,345 Z',
                            'Antalya': 'M180,380 L230,375 L255,390 L250,425 L215,440 L175,425 Z',
                            'Mersin': 'M360,370 L410,365 L435,380 L430,415 L395,430 L355,415 Z',
                            'Adana': 'M445,355 L495,350 L520,365 L515,400 L480,415 L440,400 Z',
                            'Gaziantep': 'M600,320 L650,315 L675,330 L670,365 L635,380 L595,365 Z'
                          };
                          
                          const path = provincePaths[item.state];
                          if (!path) return null;
                          
                          return (
                            <Tooltip 
                              key={item.state}
                              title={
                                <div className="text-left">
                                  <div className="font-medium">{item.state}</div>
                                  <div className="text-sm">ROAS: {item.offlineROAS.toFixed(1)}x</div>
                                </div>
                              }
                              arrow
                            >
                              <g>
                                <path
                                  d={path}
                                  fill={fillColor}
                                  stroke={isSelected ? '#22c55e' : '#9ca3af'}
                                  strokeWidth={isSelected ? '3' : '1'}
                                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                                  onClick={() => {
                                    setGeoState(item.state);
                                    setSelectedMapState(item.state);
                                  }}
                                  data-testid={`map-roas-${item.state.toLowerCase()}`}
                                />
                                <text
                                  x={path.includes('Istanbul') ? 175 : path.includes('Ankara') ? 385 : path.includes('Izmir') ? 77 : path.includes('Konya') ? 385 : path.includes('Bursa') ? 160 : path.includes('Kocaeli') ? 237 : path.includes('Antalya') ? 212 : path.includes('Mersin') ? 397 : path.includes('Adana') ? 477 : 632}
                                  y={path.includes('Istanbul') ? 135 : path.includes('Ankara') ? 210 : path.includes('Izmir') ? 305 : path.includes('Konya') ? 315 : path.includes('Bursa') ? 185 : path.includes('Kocaeli') ? 142 : path.includes('Antalya') ? 407 : path.includes('Mersin') ? 397 : path.includes('Adana') ? 382 : 347}
                                  fill="white"
                                  fontSize="11"
                                  fontWeight="600"
                                  textAnchor="middle"
                                  className="pointer-events-none drop-shadow-lg"
                                >
                                  {item.state}
                                </text>
                              </g>
                            </Tooltip>
                          );
                        })}
                      </svg>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span>15.4x</span>
                      <div className="flex-1 mx-3 h-4 bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded"></div>
                      <span>158.4x</span>
                    </div>
                  </div>
                </div>
                
                {/* Geographic Performance Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-geo-performance">
                      <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">State</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Spends</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Impressions</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Interactions</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Direction Requests</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Calls Made</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Store Visits</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Website Visits</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Offline Trans.</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Offline Revenue</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Offline ROAS</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">AOV</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockGeoData
                          .filter(item => selectedMapState === null || item.state === selectedMapState)
                          .map((item) => (
                          <tr 
                            key={item.state} 
                            className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                            data-testid={`geo-row-${item.state.toLowerCase()}`}
                          >
                            <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{item.country}</td>
                            <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{item.state}</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">₺{(item.spends / 1000).toFixed(0)}K</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{(item.impressions / 1000000).toFixed(1)}M</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.interactions.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.directionRequests.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.callsMade.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.storeVisits.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.websiteVisits.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.offlineTransactions.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-gray-100">₺{(item.offlineRevenue / 1000000).toFixed(1)}M</td>
                            <td className="py-3 px-4 text-right font-semibold text-green-600">{item.offlineROAS.toFixed(1)}x</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">₺{(item.aov / 1000).toFixed(1)}K</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      1 - {mockGeoData.filter(item => selectedMapState === null || item.state === selectedMapState).length} / {mockGeoData.length}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled className="h-8">
                        &lt;
                      </Button>
                      <Button variant="outline" size="sm" disabled className="h-8">
                        &gt;
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          {/* Data Health & Flow Card */}
          <div className="mt-6" ref={dataHealthFlowRef}>
            <ShadcnCard>
              <ShadcnCardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Data Health & Flow</CardTitle>
                    <p className="text-sm text-muted-foreground">Data flow from source systems through VenueX to platforms</p>
                  </div>
                  <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-data-quality">
                    View All →
                  </button>
                </div>
              </ShadcnCardHeader>
              <ShadcnCardContent className="space-y-8">
              <div className="relative">
                {/* Vertical VenueX alignment guide */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 transform -translate-x-1/2 z-0"></div>
                
                <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 py-4 px-6">
                  {/* Clean Data Flow Layout */}
                  <div className="relative w-full h-[200px]">
                    
                    {/* Connection Lines SVG */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        {/* Clean modern arrowheads - unique IDs for offline-conversions page */}
                        <marker id="oc-arrow-success" markerWidth="8" markerHeight="6" 
                          refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                          <polygon points="0,0 0,6 8,3" fill="#10b981" />
                        </marker>
                        
                        {/* Smooth animated gradients for data flow - unique IDs for offline-conversions page */}
                        <linearGradient id="oc-flowActive" x1="0%" y1="0%" x2="100%" y2="0%">
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
                      </defs>
                      
                      {/* Base connection lines - always visible */}
                      <g opacity="0.3">
                        {/* Store Sales to VenueX */}
                        <path d="M 280 100 L 460 100" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                        {/* VenueX to Ad Platforms */}
                        <path d="M 540 100 L 720 100" stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                      </g>
                      
                      {/* Status-based colored lines */}
                      <g>
                        {/* Store Sales to VenueX (green) */}
                        <path d="M 280 100 L 460 100" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#oc-arrow-success)" opacity="0.8" />
                        {/* VenueX to Ad Platforms (green) */}
                        <path d="M 540 100 L 720 100" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#oc-arrow-success)" opacity="0.8" />
                      </g>
                      
                      {/* Status-based animated flow overlays */}
                      <g>
                        {/* Store Sales active flow */}
                        <path d="M 280 100 L 460 100" stroke="url(#oc-flowActive)" strokeWidth="2" fill="none" opacity="0.8">
                          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin="0s" repeatCount="indefinite"/>
                        </path>
                        {/* VenueX to Ad Platforms flow */}
                        <path d="M 540 100 L 720 100" stroke="url(#oc-flowActive)" strokeWidth="2" fill="none" opacity="0.9">
                          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.8s" begin="0.2s" repeatCount="indefinite"/>
                        </path>
                      </g>
                      
                      {/* Data pulse indicators */}
                      <g>
                        <circle cx="370" cy="100" r="3" fill="#10b981" opacity="0.8">
                          <animate attributeName="r" values="2;5;2" dur="2s" begin="0s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="0s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="630" cy="100" r="3" fill="#10b981" opacity="0.8">
                          <animate attributeName="r" values="2;5;2" dur="2s" begin="1s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="1s" repeatCount="indefinite"/>
                        </circle>
                      </g>
                      
                      {/* Connection nodes */}
                      <circle cx="460" cy="100" r="4" fill="#3b82f6" opacity="0.9" stroke="#ffffff" strokeWidth="2"/>
                      <circle cx="540" cy="100" r="4" fill="#3b82f6" opacity="0.9" stroke="#ffffff" strokeWidth="2"/>
                    </svg>

                    {/* Data Source - Left Side */}
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

                    {/* Ad Platforms - Right Side */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700 w-56">
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
          
        </div>
      </div>
    </div>
  );
}