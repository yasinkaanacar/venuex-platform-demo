import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card as ShadcnCard, CardContent as ShadcnCardContent, CardHeader as ShadcnCardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip } from '@mui/material';
import { TrendingUp, TrendingDown, Calendar, Filter, X, Search, ChevronDown, Check, CheckCircle, Receipt, AlertTriangle, AlertCircle, ArrowUpDown, Package, MapPin, DollarSign, ShoppingCart, Info } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import funnelImage from '@assets/Screenshot 2025-08-29 at 18.31.46_1756481891401.png';
import vxLogo from '@assets/vx-logo-1000x1000_1756824361260.png';
import EnrichmentSuggestions from '../components/offline-conversions/enrichment-suggestions';
import WeeklySalesChart from '../components/offline-conversions/weekly-sales-chart';
import OfflineSummary from '../components/offline-conversions/OfflineSummary';
import PerformanceChart from '../components/offline-conversions/performance-chart';
import AttributionBreakdown from '../components/offline-conversions/AttributionBreakdown';

import CampaignPerformanceTable from '../components/offline-conversions/CampaignPerformanceTable';
import CampaignTable from '../components/offline-conversions/CampaignTable';
import GeographicPerformance from '../components/offline-conversions/GeographicPerformance';
import OfflineActivityLog from '../components/offline-conversions/OfflineActivityLog';
import DataPipelineStatus from '../components/offline-conversions/DataPipelineStatus';
import ExecutiveMetrics from '../components/offline-conversions/ExecutiveMetrics';
import { useTranslation } from '@/contexts/LanguageContext';

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
      className="vx-card shadow-none hover:shadow-sm transition-all duration-200 cursor-pointer hover:scale-105"
      data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="vx-card-body pt-3 vx-surface-muted">
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

// Local filter state for this page supporting multiple platforms
interface PageFilterState {
  dateRange: string | any;
  platforms: string[];
  platform?: string;
  campaigns: string[];
  campaignTypes: string[];
  isAllCampaignsSelected?: boolean;
  compareMode: boolean;
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


// Helper to convert string date range to Date objects
const getDateRangeFromValue = (value: string | any) => {
  if (typeof value !== 'string') return value;

  const endDate = new Date();
  const startDate = new Date();

  switch (value) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case 'thisMonth':
      startDate.setDate(1);
      break;
    case 'lastMonth':
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      endDate.setDate(0); // Last day of previous month
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      return { startDate, endDate };
    case 'qtd':
      startDate.setMonth(Math.floor(startDate.getMonth() / 3) * 3);
      startDate.setDate(1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }

  return { startDate, endDate };
};

export default function OfflineConversionsMVP() {
  const [filters, setFilters] = useState<PageFilterState>({
    dateRange: "30d",
    platforms: [],
    campaigns: [],
    campaignTypes: [],
    compareMode: false
  });

  const [mainTab, setMainTab] = useState<'ozet' | 'performans' | 'kampanyalar' | 'veri_baglantisi'>('ozet');
  const { t, language } = useTranslation();

  const [campaignSearch, setCampaignSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");
  const [campaignTypeSearch, setCampaignTypeSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showDeduplicationTooltip, setShowDeduplicationTooltip] = useState(false);

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
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      id: '2',
      type: 'success',
      icon: CheckCircle,
      title: 'Data enrichment completed',
      description: '47 location profiles updated with new attributes',
      timestamp: '11 minutes ago',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: '3',
      type: 'error',
      icon: AlertCircle,
      title: 'API rate limit warning',
      description: 'Google Ads API approaching rate limit (85% used)',
      timestamp: '11 minutes ago',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
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
      campaignTypes: [],
      compareMode: false
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
    <div className="vx-page">
      {/* Tab Navigation - Sticky */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="vx-tabs">
            <button
              onClick={() => setMainTab('ozet')}
              className={`vx-tab ${mainTab === 'ozet' ? 'vx-tab-active' : ''}`}
              data-testid="tab-ozet"
            >
              {t.common.summary}
            </button>
            <button
              onClick={() => setMainTab('performans')}
              className={`vx-tab ${mainTab === 'performans' ? 'vx-tab-active' : ''}`}
              data-testid="tab-performans"
            >
              {t.common.performance}
            </button>
            <button
              onClick={() => setMainTab('kampanyalar')}
              className={`vx-tab ${mainTab === 'kampanyalar' ? 'vx-tab-active' : ''}`}
              data-testid="tab-kampanyalar"
            >
              {language === 'en' ? 'Campaigns' : 'Kampanyalar'}
            </button>
            <button
              onClick={() => setMainTab('veri_baglantisi')}
              className={`vx-tab ${mainTab === 'veri_baglantisi' ? 'vx-tab-active' : ''}`}
              data-testid="tab-veri-baglantisi"
            >
              {language === 'en' ? 'Data Connection' : 'Veri Bağlantısı'}
            </button>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="vx-page-body min-h-[calc(100vh-8rem)]">
        {/* Özet Tab */}
        {mainTab === 'ozet' && (
          <>
            <OfflineSummary />

            {/* Weekly Sales Performance - Full Width */}
            <div className="vx-section-stack">
              <WeeklySalesChart />
            </div>

            {/* Online-to-Offline Conversion Funnel */}
            <div className="vx-section-stack">
              <PerformanceChart filters={filters as any} onFiltersChange={setFilters as any} showProviderFilter={true} />
            </div>


          </>
        )}

        {/* Performans Tab */}
        {mainTab === 'performans' && (
          <>
            {/* Sticky Filter Bar */}
            <div className="sticky top-[104px] z-30 bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="vx-filter-row">
                {/* Platform Filter */}
                <div className="relative" ref={platformDropdownRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
                    className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${filters.platforms.length > 0 ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
                  >
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span>{filters.platforms.length > 0 ? `Platform (${filters.platforms.length})` : 'Platform'}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {openDropdown === 'platform' && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        {/* All Platforms */}
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, platforms: [] }));
                            setOpenDropdown(null);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 ${filters.platforms.length === 0 ? 'bg-gray-50' : ''}`}
                        >
                          <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${filters.platforms.length === 0 ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                            {filters.platforms.length === 0 && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-[10px] font-bold text-gray-600">All</span>
                          </div>
                          <span className="text-gray-700">Tüm Platformlar</span>
                          <div className="relative group ml-auto">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeduplicationTooltip(!showDeduplicationTooltip);
                              }}
                              className="p-0.5 rounded hover:bg-gray-100"
                            >
                              <Info className="w-3.5 h-3.5 text-amber-500 cursor-help" />
                            </button>
                            <div className={`absolute right-0 top-full mt-1 px-3 py-2.5 bg-gray-900 text-white text-xs rounded-lg transition-all duration-200 w-64 z-[9999] ${showDeduplicationTooltip ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                              <div className="font-semibold text-amber-400 mb-1">Deduplication Notice</div>
                              <div className="leading-relaxed">When viewing all platforms, there may be duplications as platforms sometimes attribute the same sales at the same time. For accurate attribution, view individual platform data.</div>
                            </div>
                          </div>
                        </button>

                        <div className="border-t border-gray-100 my-1" />

                        {/* Google */}
                        <button
                          onClick={() => handlePlatformToggle('google')}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50"
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${filters.platforms.includes('google') ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                            {filters.platforms.includes('google') && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="w-6 h-6 bg-[#EA4335] rounded flex items-center justify-center">
                            <SiGoogle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700">Google Ads</span>
                        </button>
                        {/* Meta */}
                        <button
                          onClick={() => handlePlatformToggle('meta')}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50"
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${filters.platforms.includes('meta') ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                            {filters.platforms.includes('meta') && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="w-6 h-6 bg-[#1877F2] rounded flex items-center justify-center">
                            <SiMeta className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700">Meta Ads</span>
                        </button>
                        {/* TikTok */}
                        <button
                          onClick={() => handlePlatformToggle('tiktok')}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50"
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${filters.platforms.includes('tiktok') ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                            {filters.platforms.includes('tiktok') && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                            <SiTiktok className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700">TikTok Ads</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Campaign Type Filter */}
                <div className="relative" ref={campaignTypeDropdownRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'campaignType' ? null : 'campaignType')}
                    className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${filters.campaignTypes.length > 0 ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
                  >
                    <span>{filters.campaignTypes.length > 0 ? `Kampanya Tipi (${filters.campaignTypes.length})` : 'Kampanya Tipi'}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {openDropdown === 'campaignType' && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-2 border-b border-gray-100">
                        <div className="flex gap-2">
                          <button onClick={handleSelectAllCampaignTypes} className="flex-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded">Tümünü Seç</button>
                          <button onClick={handleDeselectAllCampaignTypes} className="flex-1 text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-2 py-1.5 rounded">Temizle</button>
                        </div>
                      </div>
                      <div className="py-1">
                        {campaignTypeOptions.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => handleCampaignTypeToggle(type.value)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50"
                          >
                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${filters.campaignTypes.includes(type.value) ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                              {filters.campaignTypes.includes(type.value) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-gray-700">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Campaign Filter */}
                <div className="relative" ref={campaignDropdownRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'campaign' ? null : 'campaign')}
                    className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${filters.campaigns.length > 0 ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
                  >
                    <span>{filters.campaigns.length > 0 ? `Kampanya (${filters.campaigns.length})` : 'Kampanya'}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {openDropdown === 'campaign' && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Kampanya ara..."
                            value={campaignSearch}
                            onChange={(e) => setCampaignSearch(e.target.value)}
                            className="pl-8 h-8 text-sm border-gray-200"
                          />
                        </div>
                      </div>
                      <div className="p-2 border-b border-gray-100">
                        <div className="flex gap-2">
                          <button onClick={handleSelectAllCampaigns} className="flex-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded">Tümünü Seç</button>
                          <button onClick={handleDeselectAllCampaigns} className="flex-1 text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-2 py-1.5 rounded">Temizle</button>
                        </div>
                      </div>
                      <div className="max-h-56 overflow-y-auto py-1">
                        {getFilteredCampaigns().map((campaign) => (
                          <button
                            key={campaign}
                            onClick={() => handleCampaignToggle(campaign)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 text-left"
                          >
                            <div className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 ${filters.campaigns.includes(campaign) ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                              {filters.campaigns.includes(campaign) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-gray-700 truncate">{campaign}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reset Filters Button */}
                {(filters.platforms.length > 0 || filters.campaignTypes.length > 0 || filters.campaigns.length > 0) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Temizle</span>
                  </button>
                )}
              </div>
            </div>

            {/* Executive Metrics Summary */}
            <div className="vx-section-stack">
              <ExecutiveMetrics />
            </div>

            {/* Attribution Breakdown */}
            <div className="vx-section-stack">
              <AttributionBreakdown />
            </div>

            {/* Conversion Funnel - No Platform Selector */}
            <div className="vx-section-stack">
              <PerformanceChart filters={filters as any} onFiltersChange={setFilters as any} showProviderFilter={false} />
            </div>

            {/* Campaign List */}
            <div className="vx-section-stack">
              <CampaignPerformanceTable />
            </div>
          </>
        )}

        {/* Veri Bağlantısı Tab */}
        {mainTab === 'veri_baglantisi' && (
          <div className="vx-section-stack space-y-6">
            <DataPipelineStatus />
            <OfflineActivityLog />
          </div>
        )}

        {/* Kampanyalar Tab */}
        {mainTab === 'kampanyalar' && (
          <div className="vx-section-stack">
            <CampaignTable />
          </div>
        )}


      </div>
    </div >
  );
}
