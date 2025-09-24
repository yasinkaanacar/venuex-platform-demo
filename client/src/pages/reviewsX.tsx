import { useState, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown,
  List,
  Map,
  Filter,
  BarChart3,
  Globe,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Send,
  Eye,
  Settings,
  Bell,
  MapPin,
  Package,
  Inbox,
  BarChart,
  Plus,
  Download,
  Mail,
  Users,
  Clock,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Home,
  Target,
  BookOpen,
  Reply,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Bookmark,
  Share2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/overview/header';

export default function ReviewsX() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [chartToggle, setChartToggle] = useState("source"); // "source" or "rating"
  const [inboxFilters, setInboxFilters] = useState({ source: null, rating: null, week: null });

  // Function to navigate to inbox with filters
  const navigateToInboxWithFilter = (filterType: string, filterValue: string | number | null) => {
    setInboxFilters(prev => ({ ...prev, [filterType]: filterValue }));
    setActiveTab("inbox");
  };

  // Get Tailwind color classes for rating distribution
  const getRatingColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      green: 'bg-green-500',
      lime: 'bg-lime-500', 
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  // Sample data for the components
  const kpiData = {
    averageRating: 4.78,
    totalReviews: 3672,
    responseRate: 87.5,
    avgResponseTime: "18h",
    sentimentIndex: 82.3
  };

  const alertsCount = 12;

  const recentReviews = [
    {
      id: 1,
      reviewer: "Ayse K.",
      platform: "google",
      rating: 5,
      text: "Great shopping experience, staff was very helpful...",
      location: "Zorlu Center",
      date: "2 hours ago",
      isNew: true,
      isUrgent: false
    },
    {
      id: 2,
      reviewer: "Mehmet Y.",
      platform: "facebook",
      rating: 2,
      text: "Product quality wasn't as expected, return process took too long...",
      location: "Kanyon",
      date: "4 hours ago",
      isNew: true,
      isUrgent: true
    },
    {
      id: 3,
      reviewer: "Zeynep A.",
      platform: "yandex",
      rating: 4,
      text: "Generally satisfied but prices are a bit high...",
      location: "İstinye Park",
      date: "6 hours ago",
      isNew: false,
      isUrgent: false
    },
    {
      id: 4,
      reviewer: "Ali D.",
      platform: "google",
      rating: 1,
      text: "Poor service, waited too long and couldn't get any explanation...",
      location: "Akmerkez",
      date: "12 hours ago",
      isNew: true,
      isUrgent: true
    },
    {
      id: 5,
      reviewer: "Elif S.",
      platform: "instagram",
      rating: 5,
      text: "Perfect! Everything was great, I definitely recommend it...",
      location: "Metrocity",
      date: "1 day ago",
      isNew: false,
      isUrgent: false
    }
  ];

  // Memoized filtered reviews for inbox
  const filteredInboxReviews = useMemo(() => {
    return recentReviews.filter(review => {
      if (inboxFilters.source && review.platform !== inboxFilters.source) return false;
      if (inboxFilters.rating && review.rating !== inboxFilters.rating) return false;
      if (inboxFilters.week) {
        // For demo purposes, map review ID to week (1-12)
        const reviewWeek = (review.id % 12) + 1;
        if (reviewWeek !== inboxFilters.week) return false;
      }
      return true;
    });
  }, [recentReviews, inboxFilters]);

  const locations = [
    {
      id: 1,
      name: "Zorlu Center",
      city: "Istanbul",
      region: "Europe",
      rating: 4.8,
      reviewCount: 234,
      negativePercent: 8,
      responseRate: 92,
      lastReview: "2 hours ago"
    },
    {
      id: 2,
      name: "Kanyon",
      city: "Istanbul", 
      region: "Europe",
      rating: 4.2,
      reviewCount: 189,
      negativePercent: 15,
      responseRate: 78,
      lastReview: "4 hours ago"
    },
    {
      id: 3,
      name: "İstinye Park",
      city: "Istanbul",
      region: "Europe", 
      rating: 4.6,
      reviewCount: 156,
      negativePercent: 12,
      responseRate: 88,
      lastReview: "6 hours ago"
    }
  ];

  const products = [
    {
      id: 1,
      name: "Deri Ceket - Siyah",
      sku: "BYN-LC-001",
      category: "Dış Giyim",
      rating: 4.5,
      reviewCount: 87,
      sentiment: "positive",
      topComplaint: "fiyat",
      topCompliment: "kalite"
    },
    {
      id: 2,
      name: "Sneaker - Beyaz",
      sku: "BYN-SH-045", 
      category: "Ayakkabı",
      rating: 4.1,
      reviewCount: 234,
      sentiment: "mixed",
      topComplaint: "size",
      topCompliment: "comfort"
    },
    {
      id: 3,
      name: "Blazer - Lacivert",
      sku: "BYN-BL-012",
      category: "Outerwear",
      rating: 4.7,
      reviewCount: 43,
      sentiment: "positive", 
      topComplaint: "cut",
      topCompliment: "fabric"
    }
  ];

  const themeAnalysis = [
    { theme: "Product Quality", positive: 78, neutral: 15, negative: 7, total: 450, trend: "up" },
    { theme: "Customer Service", positive: 82, neutral: 12, negative: 6, total: 380, trend: "up" },
    { theme: "Store Atmosphere", positive: 71, neutral: 20, negative: 9, total: 325, trend: "stable" },
    { theme: "Price-Performance", positive: 65, neutral: 25, negative: 10, total: 290, trend: "down" },
    { theme: "Product Variety", positive: 88, neutral: 8, negative: 4, total: 275, trend: "up" }
  ];

  const responseTemplates = [
    { id: 1, name: "Positive Thank You", category: "5 Star", content: "Dear customer, thank you for your wonderful review..." },
    { id: 2, name: "General Apology", category: "Negative", content: "We apologize for the negative experience you had..." },
    { id: 3, name: "Information Request", category: "Neutral", content: "Thank you for your feedback. For more detailed information..." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Reviews" />
      
      {/* Global Navigation Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Home className="w-4 h-4" />
            <span>VenueX</span>
            <ChevronRight className="w-4 h-4" />
            <span>Reviews</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Overview</span>
          </div>
          
          {/* Filters Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Date Range Filter */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last 1 year</SelectItem>
                  <SelectItem value="custom">Custom date</SelectItem>
                </SelectContent>
              </Select>

              {/* Source Channel Filter */}
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-48">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="google">Google My Business</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="yandex">Yandex Maps</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="istanbul">Istanbul</SelectItem>
                  <SelectItem value="ankara">Ankara</SelectItem>
                  <SelectItem value="izmir">Izmir</SelectItem>
                </SelectContent>
              </Select>

              {/* Product Filter */}
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-48">
                  <Package className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search reviews..." 
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Export */}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              {/* New Review Alerts */}
              <Button variant="outline" className="relative">
                <Bell className="w-4 h-4 mr-2" />
                New Reviews
                {alertsCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {alertsCount}
                  </Badge>
                )}
              </Button>

              {/* Save View */}
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save View
              </Button>

              {/* Share Snapshot */}
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Snapshot
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-50 rounded-none border-t border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <BarChart className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="inbox" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <Inbox className="w-4 h-4 mr-2" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="p-6">
            
            {/* Overview Section */}
            <TabsContent value="overview" className="space-y-6">
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-5 gap-6">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("insights")}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Average Rating
                    </CardTitle>
                    <div className="text-sm text-gray-500">(Last 12 months)</div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-4xl font-bold text-gray-900">
                      {kpiData.averageRating}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {kpiData.totalReviews.toLocaleString()} reviews
                    </div>
                    
                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      {[
                        { stars: 5, percentage: 92, color: 'bg-yellow-500' },
                        { stars: 4, percentage: 5, color: 'bg-orange-400' },
                        { stars: 3, percentage: 1, color: 'bg-orange-400' },
                        { stars: 2, percentage: 2, color: 'bg-orange-400' },
                        { stars: 1, percentage: 2, color: 'bg-orange-400' }
                      ].map((rating) => (
                        <div key={rating.stars} className="flex items-center gap-3">
                          <span className="text-sm font-medium w-2">{rating.stars}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                            <div 
                              className={`${rating.color} h-2 rounded-full`}
                              style={{ width: `${rating.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{rating.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("insights")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="tracking-tight text-[#111827] font-semibold text-[18px]">Review Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{kpiData.totalReviews.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <ArrowUp className="w-3 h-3" />
                      +12% vs previous period
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("inbox")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="tracking-tight text-[#111827] font-semibold text-[18px]">Reply Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{kpiData.responseRate}%</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <ArrowUp className="w-3 h-3" />
                      +5% vs previous period
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("inbox")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="tracking-tight text-[#111827] font-semibold text-[18px]">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{kpiData.avgResponseTime}</div>
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <ArrowUp className="w-3 h-3" />
                      +2h vs previous period
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("insights")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="tracking-tight text-[#111827] font-semibold text-[18px]">Sentiment Index</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{kpiData.sentimentIndex}%</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <ArrowUp className="w-3 h-3" />
                      +3% vs previous period
                    </div>
                  </CardContent>
                </Card>
                </div>

              {/* Charts Row */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Review Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-xs text-gray-500">Last 12 weeks</div>
                        <div className="flex gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span>Review Count</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative h-48 border-l border-b border-gray-300">
                        {/* Y-axis labels for volume */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-8">
                          <span>400</span>
                          <span>300</span>
                          <span>200</span>
                          <span>100</span>
                          <span>0</span>
                        </div>
                        
                        {/* Volume bars layer */}
                        <div className="absolute inset-0 flex items-end justify-between px-2 pb-6">
                          {[
                            {week: 1, volume: 245, rating: 4.6},
                            {week: 2, volume: 312, rating: 4.7},
                            {week: 3, volume: 198, rating: 4.5},
                            {week: 4, volume: 287, rating: 4.8},
                            {week: 5, volume: 334, rating: 4.9},
                            {week: 6, volume: 275, rating: 4.7},
                            {week: 7, volume: 356, rating: 4.8},
                            {week: 8, volume: 298, rating: 4.6},
                            {week: 9, volume: 267, rating: 4.7},
                            {week: 10, volume: 385, rating: 4.9},
                            {week: 11, volume: 298, rating: 4.8},
                            {week: 12, volume: 342, rating: 4.7}
                          ].map((data, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-50 rounded p-1" onClick={() => navigateToInboxWithFilter('week', data.week)}>
                              {/* Volume bar */}
                              <div 
                                className="w-6 bg-blue-400 rounded-t hover:bg-blue-500 transition-colors" 
                                style={{height: `${(data.volume / 400) * 160}px`}}
                                title={`${data.volume} reviews - Click to view`}
                              ></div>
                              <div className="text-xs text-gray-400">W{data.week}</div>
                            </div>
                          ))}
                        </div>
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{chartToggle === "source" ? "Source Distribution" : "Rating Distribution"}</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setChartToggle(chartToggle === "source" ? "rating" : "source")}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Switch to {chartToggle === "source" ? "Rating" : "Source"} View
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {chartToggle === "source" ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => navigateToInboxWithFilter('source', 'google')}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <span className="text-red-600 font-bold text-sm">G</span>
                            </div>
                            <span className="text-sm font-medium">Google My Business</span>
                          </div>
                          <span className="text-sm font-medium">65% (2,386 reviews)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-red-500 h-3 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        
                        <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => navigateToInboxWithFilter('source', 'facebook')}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">f</span>
                            </div>
                            <span className="text-sm font-medium">Facebook</span>
                          </div>
                          <span className="text-sm font-medium">20% (734 reviews)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-blue-500 h-3 rounded-full" style={{width: '20%'}}></div>
                        </div>
                        
                        <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => navigateToInboxWithFilter('source', 'yandex')}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <span className="text-yellow-600 font-bold text-sm">Y</span>
                            </div>
                            <span className="text-sm font-medium">Yandex Maps</span>
                          </div>
                          <span className="text-sm font-medium">15% (552 reviews)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-yellow-500 h-3 rounded-full" style={{width: '15%'}}></div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-4">
                        {[
                          {stars: 5, count: 2890, percentage: 78.7, color: "green"},
                          {stars: 4, count: 445, percentage: 12.1, color: "lime"},
                          {stars: 3, count: 185, percentage: 5.0, color: "yellow"},
                          {stars: 2, count: 89, percentage: 2.4, color: "orange"},
                          {stars: 1, count: 63, percentage: 1.7, color: "red"}
                        ].map((rating) => (
                          <div key={rating.stars} className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded" onClick={() => navigateToInboxWithFilter('rating', rating.stars)}>
                            <div className="text-lg font-bold">{rating.stars}★</div>
                            <div className="h-24 bg-gray-100 rounded mb-2 flex items-end justify-center">
                              <div 
                                className={`w-8 rounded-t ${getRatingColorClass(rating.color)}`}
                                style={{height: `${rating.percentage}%`}}
                              ></div>
                            </div>
                            <div className="text-sm font-medium">{rating.count}</div>
                            <div className="text-xs text-gray-500">{rating.percentage}%</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Rating Distribution Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution and Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overall" className="w-full">
                    <TabsList className="grid w-fit grid-cols-2">
                      <TabsTrigger value="overall">Overall</TabsTrigger>
                      <TabsTrigger value="locations">By Location</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overall" className="space-y-4">
                      <div className="grid grid-cols-5 gap-4">
                        {[
                          {stars: 5, count: 2890, percentage: 78.7, color: "green"},
                          {stars: 4, count: 445, percentage: 12.1, color: "lime"},
                          {stars: 3, count: 185, percentage: 5.0, color: "yellow"},
                          {stars: 2, count: 89, percentage: 2.4, color: "orange"},
                          {stars: 1, count: 63, percentage: 1.7, color: "red"}
                        ].map((rating) => (
                          <div key={rating.stars} className="text-center">
                            <div className="text-lg font-bold">{rating.stars}★</div>
                            <div className="h-24 bg-gray-100 rounded mb-2 flex items-end justify-center">
                              <div 
                                className={`w-8 bg-${rating.color}-500 rounded-t`}
                                style={{height: `${rating.percentage}%`}}
                              ></div>
                            </div>
                            <div className="text-sm font-medium">{rating.count}</div>
                            <div className="text-xs text-gray-500">{rating.percentage}%</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="locations" className="space-y-4">
                      <div className="text-sm text-gray-600 mb-4">Rating distribution for top 20 locations by review volume</div>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {[
                          {name: "Boyner Bağdat Caddesi", total: 542, ratings: {5: 420, 4: 75, 3: 28, 2: 12, 1: 7}, avg: 4.7},
                          {name: "Boyner Kanyon AVM", total: 489, ratings: {5: 380, 4: 68, 3: 25, 2: 10, 1: 6}, avg: 4.6},
                          {name: "Boyner İstinyePark", total: 456, ratings: {5: 345, 4: 78, 3: 22, 2: 8, 1: 3}, avg: 4.8},
                          {name: "Boyner Zorlu Center", total: 423, ratings: {5: 310, 4: 72, 3: 25, 2: 11, 1: 5}, avg: 4.6},
                          {name: "Boyner Nişantaşı", total: 398, ratings: {5: 295, 4: 68, 3: 20, 2: 10, 1: 5}, avg: 4.7},
                          {name: "Boyner Akasya AVM", total: 376, ratings: {5: 275, 4: 65, 3: 22, 2: 9, 1: 5}, avg: 4.6},
                          {name: "Boyner Cevahir AVM", total: 365, ratings: {5: 270, 4: 58, 3: 25, 2: 8, 1: 4}, avg: 4.7},
                          {name: "Boyner Emaar AVM", total: 342, ratings: {5: 245, 4: 62, 3: 20, 2: 10, 1: 5}, avg: 4.6},
                          {name: "Boyner Ankara Ankamall", total: 325, ratings: {5: 235, 4: 55, 3: 22, 2: 8, 1: 5}, avg: 4.6},
                          {name: "Boyner İzmir Forum", total: 312, ratings: {5: 220, 4: 58, 3: 20, 2: 9, 1: 5}, avg: 4.5},
                          {name: "Boyner Bursa Kent Meydanı", total: 298, ratings: {5: 210, 4: 52, 3: 23, 2: 8, 1: 5}, avg: 4.5},
                          {name: "Boyner Antalya Migros AVM", total: 287, ratings: {5: 200, 4: 55, 3: 20, 2: 7, 1: 5}, avg: 4.5},
                          {name: "Boyner Adana Optimum", total: 276, ratings: {5: 195, 4: 48, 3: 22, 2: 7, 1: 4}, avg: 4.5},
                          {name: "Boyner Mersin Forum", total: 265, ratings: {5: 185, 4: 52, 3: 18, 2: 6, 1: 4}, avg: 4.6},
                          {name: "Boyner Gaziantep Sanko Park", total: 254, ratings: {5: 175, 4: 48, 3: 20, 2: 7, 1: 4}, avg: 4.5},
                          {name: "Boyner Konya Kulesite", total: 243, ratings: {5: 165, 4: 45, 3: 22, 2: 7, 1: 4}, avg: 4.4},
                          {name: "Boyner Eskişehir Espark", total: 232, ratings: {5: 155, 4: 48, 3: 18, 2: 7, 1: 4}, avg: 4.5},
                          {name: "Boyner Kayseri Park", total: 221, ratings: {5: 145, 4: 44, 3: 20, 2: 8, 1: 4}, avg: 4.4},
                          {name: "Boyner Trabzon Forum", total: 210, ratings: {5: 140, 4: 42, 3: 18, 2: 6, 1: 4}, avg: 4.5},
                          {name: "Boyner Samsun Piazza", total: 198, ratings: {5: 130, 4: 38, 3: 20, 2: 6, 1: 4}, avg: 4.4}
                        ].map((location, index) => (
                          <div key={index} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded">
                            <div className="w-8 text-xs text-gray-500 font-mono">#{index + 1}</div>
                            <div className="w-48 text-sm font-medium">{location.name}</div>
                            <div className="flex-1 flex h-8 bg-gray-200 rounded overflow-hidden relative group">
                              {/* Stacked horizontal bar */}
                              {[5,4,3,2,1].map((star) => {
                                const count = location.ratings[star as keyof typeof location.ratings];
                                const percentage = (count / location.total) * 100;
                                return (
                                  <div 
                                    key={star}
                                    className={`h-full ${
                                      star === 5 ? 'bg-green-500' : 
                                      star === 4 ? 'bg-lime-500' : 
                                      star === 3 ? 'bg-yellow-500' : 
                                      star === 2 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                    style={{width: `${percentage}%`}}
                                  ></div>
                                );
                              })}
                              
                              {/* Hover tooltip */}
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-10 bg-black text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-max">
                                <div className="space-y-1">
                                  {[5,4,3,2,1].map((star) => {
                                    const count = location.ratings[star as keyof typeof location.ratings];
                                    const percentage = (count / location.total) * 100;
                                    return (
                                      <div key={star} className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded ${
                                          star === 5 ? 'bg-green-500' : 
                                          star === 4 ? 'bg-lime-500' : 
                                          star === 3 ? 'bg-yellow-500' : 
                                          star === 2 ? 'bg-orange-500' : 'bg-red-500'
                                        }`}></div>
                                        <span>{star}★: {count} ({percentage.toFixed(1)}%)</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="w-16 text-sm text-gray-600 font-medium">{location.avg}★</div>
                            <div className="w-16 text-xs text-gray-500">{location.total} reviews</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Keyword Analysis Tables */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Keywords - Mention Count</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {keyword: "store", mentions: 245, trend: "up"},
                        {keyword: "product", mentions: 189, trend: "up"},
                        {keyword: "staff", mentions: 156, trend: "stable"},
                        {keyword: "quality", mentions: 134, trend: "up"},
                        {keyword: "price", mentions: 98, trend: "down"},
                        {keyword: "service", mentions: 87, trend: "up"},
                        {keyword: "variety", mentions: 76, trend: "stable"},
                        {keyword: "atmosphere", mentions: 65, trend: "up"}
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-gray-500 w-6">#{index + 1}</span>
                            <span className="font-medium">{item.keyword}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">{item.mentions} mentions</span>
                            {item.trend === "up" && <ArrowUp className="w-4 h-4 text-green-600" />}
                            {item.trend === "down" && <ArrowDown className="w-4 h-4 text-red-600" />}
                            {item.trend === "stable" && <div className="w-4 h-0.5 bg-gray-400"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Keywords - Sentiment Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {keyword: "store", positive: 78, negative: 22, sentiment: "positive"},
                        {keyword: "product", positive: 82, negative: 18, sentiment: "positive"},
                        {keyword: "staff", positive: 91, negative: 9, sentiment: "positive"},
                        {keyword: "quality", positive: 88, negative: 12, sentiment: "positive"},
                        {keyword: "price", positive: 45, negative: 55, sentiment: "negative"},
                        {keyword: "service", positive: 76, negative: 24, sentiment: "positive"},
                        {keyword: "variety", positive: 69, negative: 31, sentiment: "positive"},
                        {keyword: "atmosphere", positive: 84, negative: 16, sentiment: "positive"}
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                          <span className="font-mono text-xs text-gray-500 w-6">#{index + 1}</span>
                          <span className="font-medium w-20">{item.keyword}</span>
                          <div className="flex-1 flex bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 rounded-l-full h-2" 
                              style={{width: `${item.positive}%`}}
                            ></div>
                            <div 
                              className="bg-red-500 rounded-r-full h-2" 
                              style={{width: `${item.negative}%`}}
                            ></div>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <span className="text-green-600">+{item.positive}%</span>
                            <span className="text-red-600">-{item.negative}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Reviews and Themes */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reviews & Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReviews.map((review) => (
                        <div 
                          key={review.id} 
                          className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setActiveTab("inbox")}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {review.isNew && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                              {review.isUrgent && <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">!</div>}
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm flex items-center gap-2">
                              <span>{review.reviewer} - {review.location}</span>
                              {review.isUrgent && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">URGENT</span>}
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-2">{review.text}</div>
                            <div className="text-xs text-gray-500 mt-1">{review.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Open Issues Digest</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Unreplied Reviews */}
                      <div 
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                        onClick={() => {
                          setInboxFilters(prev => ({ ...prev, source: null, rating: null, week: null, status: 'unreplied' }));
                          setActiveTab("inbox");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-medium text-red-900">Unreplied Reviews</div>
                            <div className="text-xs text-red-700">Requires immediate response</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-red-600">23</div>
                      </div>

                      {/* SLA At Risk */}
                      <div 
                        className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => {
                          setInboxFilters(prev => ({ ...prev, source: null, rating: null, week: null, status: 'sla-risk' }));
                          setActiveTab("inbox");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-orange-600" />
                          <div>
                            <div className="font-medium text-orange-900">SLA At Risk</div>
                            <div className="text-xs text-orange-700">Response time approaching limit</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">8</div>
                      </div>

                      {/* Escalated Issues */}
                      <div 
                        className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                        onClick={() => {
                          setInboxFilters(prev => ({ ...prev, source: null, rating: null, week: null, status: 'escalated' }));
                          setActiveTab("inbox");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium text-purple-900">Escalated Issues</div>
                            <div className="text-xs text-purple-700">Requires management attention</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">4</div>
                      </div>

                      {/* Total Open Issues Summary */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">Total Open Issues</span>
                          <span className="font-bold text-gray-900">35</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Themes Spotlight */}
              <Card>
                <CardHeader>
                  <CardTitle>Themes Spotlight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Top Positive Themes */}
                    <div>
                      <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Top Positive Themes
                      </h4>
                      <div className="space-y-2">
                        {[
                          { theme: "Staff Courtesy", volume: 45, sentiment: 95, total: 450 },
                          { theme: "Product Quality", volume: 67, sentiment: 88, total: 380 },
                          { theme: "Store Atmosphere", volume: 32, sentiment: 85, total: 325 }
                        ].map((item, index) => (
                          <div 
                            key={index}
                            className="cursor-pointer hover:bg-green-50 p-2 rounded-lg border border-green-200 transition-colors"
                            onClick={() => {
                              // Navigate to insights with theme filter
                              setActiveTab("insights");
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-green-800">{item.theme}</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                {item.sentiment}% positive
                              </Badge>
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              {item.volume} mentions • {item.total} total reviews
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Negative Themes */}
                    <div>
                      <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Top Negative Themes
                      </h4>
                      <div className="space-y-2">
                        {[
                          { theme: "Wait Time", volume: 30, sentiment: 40, total: 290 },
                          { theme: "Pricing Policy", volume: 22, sentiment: 35, total: 275 },
                          { theme: "Product Availability", volume: 18, sentiment: 38, total: 245 }
                        ].map((item, index) => (
                          <div 
                            key={index}
                            className="cursor-pointer hover:bg-red-50 p-2 rounded-lg border border-red-200 transition-colors"
                            onClick={() => {
                              // Navigate to insights with theme filter
                              setActiveTab("insights");
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-red-800">{item.theme}</span>
                              <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                                {item.sentiment}% negative
                              </Badge>
                            </div>
                            <div className="text-xs text-red-600 mt-1">
                              {item.volume} mentions • {item.total} total reviews
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab("insights")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View All Themes in Insights
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Location Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Top Performers
                      </h4>
                      <div className="space-y-3">
                        {locations.slice(0, 5).map((location, index) => (
                          <div key={location.id} className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 cursor-pointer transition-colors" onClick={() => setActiveTab("locations")}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-green-600">#{index + 1}</span>
                                <span className="font-medium text-sm">{location.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-green-600">
                                <ArrowUp className="w-3 h-3" />
                                <span className="text-xs">+0.2</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <div className="text-gray-500">Rating</div>
                                <div className="font-medium">{location.rating}★</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Volume</div>
                                <div className="font-medium">{location.reviewCount}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Reply Rate</div>
                                <div className="font-medium">{location.responseRate}%</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Needs Attention
                      </h4>
                      <div className="space-y-3">
                        {locations.slice(-5).map((location, index) => (
                          <div key={location.id} className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer transition-colors" onClick={() => setActiveTab("locations")}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-red-600">#{locations.length - 5 + index + 1}</span>
                                <span className="font-medium text-sm">{location.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-red-600">
                                <ArrowDown className="w-3 h-3" />
                                <span className="text-xs">-0.3</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <div className="text-gray-500">Rating</div>
                                <div className="font-medium">{location.rating}★</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Volume</div>
                                <div className="font-medium">{location.reviewCount}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Reply Rate</div>
                                <div className="font-medium">{location.responseRate}%</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("locations")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View All Locations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Locations Section */}
            <TabsContent value="locations" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Lokasyon Yönetimi</h2>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    onClick={() => setViewMode("table")}
                  >
                    <List className="w-4 h-4 mr-2" />
                    Tablo
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    onClick={() => setViewMode("map")}
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Harita
                  </Button>
                </div>
              </div>

              {viewMode === "table" ? (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Lokasyon</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Şehir/Bölge</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">Ortalama Puan</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">Review Count</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">% Negative</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">Response Rate</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">Last Review</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locations.map((location) => (
                            <tr key={location.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{location.name}</td>
                              <td className="py-3 px-4 text-gray-600">{location.city} / {location.region}</td>
                              <td className="text-center py-3 px-4">
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{location.rating}</span>
                                </div>
                              </td>
                              <td className="text-center py-3 px-4">{location.reviewCount}</td>
                              <td className="text-center py-3 px-4">
                                <Badge variant={location.negativePercent > 20 ? "destructive" : "secondary"}>
                                  {location.negativePercent}%
                                </Badge>
                              </td>
                              <td className="text-center py-3 px-4">
                                <Badge variant={location.responseRate > 80 ? "default" : "secondary"}>
                                  {location.responseRate}%
                                </Badge>
                              </td>
                              <td className="text-center py-3 px-4 text-sm text-gray-600">{location.lastReview}</td>
                              <td className="text-center py-3 px-4">
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="text-center">
                        <Map className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">Harita görünümü burada gösterilecek</p>
                        <p className="text-sm text-gray-400">Lokasyonlar harita üzerinde pin olarak görüntülenecek</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Products Section */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Ürün İncelemeleri</h2>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Kategori Filtrele
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Ürün</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">SKU</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Kategori</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Ortalama Puan</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Review Count</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Duygu</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">En Çok Beğenilen</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">En Çok Şikâyet</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{product.name}</td>
                            <td className="py-3 px-4 text-gray-600 font-mono text-xs">{product.sku}</td>
                            <td className="py-3 px-4 text-gray-600">{product.category}</td>
                            <td className="text-center py-3 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{product.rating}</span>
                              </div>
                            </td>
                            <td className="text-center py-3 px-4">{product.reviewCount}</td>
                            <td className="text-center py-3 px-4">
                              <Badge variant={product.sentiment === "positive" ? "default" : product.sentiment === "mixed" ? "secondary" : "destructive"}>
                                {product.sentiment === "positive" ? "Positive" : product.sentiment === "mixed" ? "Mixed" : "Negative"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-green-600">{product.topCompliment}</td>
                            <td className="py-3 px-4 text-sm text-red-600">{product.topComplaint}</td>
                            <td className="text-center py-3 px-4">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inbox Section */}
            <TabsContent value="inbox" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Review Inbox</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{recentReviews.filter(r => r.isNew).length} New</Badge>
                  <Button variant="outline" size="sm" onClick={() => setInboxFilters({ source: null, rating: null, week: null })}>
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
              
              {/* Active Filters Display */}
              {(inboxFilters.source || inboxFilters.rating || inboxFilters.week) && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                  {inboxFilters.source && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Source: {inboxFilters.source}
                      <button 
                        onClick={() => setInboxFilters({...inboxFilters, source: null})}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        ✕
                      </button>
                    </Badge>
                  )}
                  {inboxFilters.rating && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Rating: {inboxFilters.rating}★
                      <button 
                        onClick={() => setInboxFilters({...inboxFilters, rating: null})}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        ✕
                      </button>
                    </Badge>
                  )}
                  {inboxFilters.week && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Week: {inboxFilters.week}
                      <button 
                        onClick={() => setInboxFilters({...inboxFilters, week: null})}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        ✕
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-6">
                {/* Review List */}
                <div className="col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Reviews ({filteredInboxReviews.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {recentReviews.filter(review => {
                          if (inboxFilters.source && review.platform !== inboxFilters.source) return false;
                          if (inboxFilters.rating && review.rating !== inboxFilters.rating) return false;
                          // For week filter, you'd need to implement date logic here
                          return true;
                        }).map((review) => (
                          <div key={review.id} className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${review.isNew ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{review.platform}</span>
                              {review.isNew && <Badge variant="destructive" className="text-xs px-1 py-0">YENİ</Badge>}
                            </div>
                            <div className="font-medium text-sm mb-1">{review.reviewer}</div>
                            <div className="text-xs text-gray-600 mb-1">{review.location}</div>
                            <div className="text-sm text-gray-700 line-clamp-2">{review.text}</div>
                            <div className="text-xs text-gray-500 mt-2">{review.date}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Review Detail & Reply Pane */}
                <div className="col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Review Details</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Users className="w-4 h-4 mr-2" />
                            Ata
                          </Button>
                          <Button variant="outline" size="sm">
                            <Target className="w-4 h-4 mr-2" />
                            Durumu Değiştir
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Selected Review Display */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < recentReviews[0].rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{recentReviews[0].reviewer}</span>
                          <span className="text-sm text-gray-500">- {recentReviews[0].location}</span>
                          <span className="text-sm text-gray-500">- {recentReviews[0].date}</span>
                        </div>
                        <p className="text-gray-700">{recentReviews[0].text}</p>
                      </div>

                      {/* Reply Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Write Reply</h4>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Şablon Seç
                            </Button>
                            <Button variant="outline" size="sm">
                              <Target className="w-4 h-4 mr-2" />
                              AI Öneri
                            </Button>
                          </div>
                        </div>
                        
                        <Textarea
                          placeholder="Write your reply here..."
                          className="min-h-[100px]"
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox id="internal-note" />
                            <label htmlFor="internal-note" className="text-sm">Save as internal note</label>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">Save Draft</Button>
                            <Button>
                              <Send className="w-4 h-4 mr-2" />
                              Gönder
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Internal Notes */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Internal Notes</h4>
                        <div className="space-y-2">
                          <div className="text-sm p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                            <div className="font-medium">Ahmet Y. - 2 hours ago</div>
                            <div>Spoke with this customer by phone, issue resolved.</div>
                          </div>
                        </div>
                        <Textarea
                          placeholder="Add new internal note..."
                          className="mt-2"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Insights Section */}
            <TabsContent value="insights" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Deep Analysis & Insights</h2>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>
              </div>

              {/* Sentiment Overview */}
              <div className="grid grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Duygu Genel Görünümü</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">+82</div>
                      <div className="text-sm text-gray-600">Net Sentiment Score</div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Positive</span>
                          <span className="font-medium text-green-600">80%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Neutral</span>
                          <span className="font-medium text-gray-600">15%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Negative</span>
                          <span className="font-medium text-red-600">5%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trend Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-center justify-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mr-3" />
                      Trend chart will be displayed here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Within 24 hours</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '67%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Within 48 hours</span>
                        <span className="font-medium">89%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{width: '89%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">48+ hours</span>
                        <span className="font-medium text-red-600">11%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{width: '11%'}}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Theme Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Theme Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Theme</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Positive %</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Neutral %</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Negative %</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Total Mentions</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {themeAnalysis.map((theme, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{theme.theme}</td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                {theme.positive}%
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="secondary">
                                {theme.neutral}%
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="destructive" className="bg-red-100 text-red-800">
                                {theme.negative}%
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">{theme.total}</td>
                            <td className="text-center py-3 px-4">
                              {theme.trend === "up" && <ArrowUp className="w-4 h-4 text-green-600 mx-auto" />}
                              {theme.trend === "down" && <ArrowDown className="w-4 h-4 text-red-600 mx-auto" />}
                              {theme.trend === "stable" && <div className="w-4 h-0.5 bg-gray-400 mx-auto"></div>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Section */}
            <TabsContent value="settings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Ayarlar & Yapılandırma</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Sources & Integrations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Kaynaklar & Entegrasyonlar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">G</span>
                        </div>
                        <span>Google My Business</span>
                      </div>
                      <Badge variant="default">Bağlı ✅</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">f</span>
                        </div>
                        <span>Facebook</span>
                      </div>
                      <Badge variant="default">Bağlı ✅</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">Y</span>
                        </div>
                        <span>Yandex</span>
                      </div>
                      <Badge variant="secondary">Yalnızca İzleme</Badge>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Kaynak Ekle
                    </Button>
                  </CardContent>
                </Card>

                {/* Response Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Response Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {responseTemplates.map((template) => (
                      <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-600">{template.category}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Şablon Ekle
                    </Button>
                  </CardContent>
                </Card>

                {/* Alerts & Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Uyarılar & Bildirimler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Instant email for 1-2 star reviews</span>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily review summary</span>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Notify when response approval needed</span>
                        <Checkbox />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Weekly performance report</span>
                        <Checkbox defaultChecked />
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Bildirim Ayarlarını Düzenle
                    </Button>
                  </CardContent>
                </Card>

                {/* AI & Automations */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI & Otomasyonlar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-thank for 5-star reviews</span>
                        <Checkbox />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI response suggestions</span>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Automatic sentiment analysis</span>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Yabancı dil çevirileri</span>
                        <Checkbox defaultChecked />
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <label className="text-sm font-medium">AI Response Tone</label>
                      <Select defaultValue="professional">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Profesyonel</SelectItem>
                          <SelectItem value="friendly">Samimi</SelectItem>
                          <SelectItem value="formal">Resmi</SelectItem>
                          <SelectItem value="enthusiastic">Coşkulu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}