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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Send,
  Eye,
  Filter,
  BarChart3,
  MapPin,
  Package,
  Plus,
  Download,
  Mail,
  Users,
  Clock,
  ArrowUp,
  ArrowDown,
  Home,
  Reply,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Bookmark,
  Share2
} from 'lucide-react';
import Header from '@/components/overview/header';

export default function ReviewsMVP() {
  const [activeTab, setActiveTab] = useState("ozet");
  const [dateRange, setDateRange] = useState("30");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for MVP
  const kpiData = {
    totalReviews: 1247,
    averageRating: 4.3,
    responseRate: 85,
    avgResponseTime: "2.5 hours",
    newReviews: 23,
    pendingResponses: 12
  };

  // Themes data for Avantajlar/Dezavantajlar
  const themesData = {
    positive: [
      { theme: "Lezzet", percentage: 91, count: 156, sentiment: "positive" },
      { theme: "Personel", percentage: 87, count: 142, sentiment: "positive" },
      { theme: "Temizlik", percentage: 84, count: 128, sentiment: "positive" },
      { theme: "Atmosfer", percentage: 79, count: 115, sentiment: "positive" },
      { theme: "Hızlı Servis", percentage: 76, count: 98, sentiment: "positive" }
    ],
    negative: [
      { theme: "Fiyat", percentage: 67, count: 89, sentiment: "negative" },
      { theme: "Bekleme Süresi", percentage: 58, count: 76, sentiment: "negative" },
      { theme: "Park Sorunu", percentage: 52, count: 64, sentiment: "negative" },
      { theme: "Gürültü", percentage: 45, count: 52, sentiment: "negative" },
      { theme: "Porsiyon", percentage: 41, count: 43, sentiment: "negative" }
    ]
  };

  const recentReviews = [
    {
      id: 1,
      platform: "Google",
      rating: 5,
      reviewer: "Ayşe K.",
      date: "2 hours ago",
      location: "Bağdat Caddesi",
      text: "Harika bir deneyim! Personel çok yardımseverdi ve ürün kalitesi mükemmeldi.",
      isNew: true
    },
    {
      id: 2,
      platform: "Facebook",
      rating: 4,
      reviewer: "Mehmet S.",
      date: "5 hours ago", 
      location: "Kanyon AVM",
      text: "Güzel ürünler var ama fiyatlar biraz yüksek. Yine de tavsiye ederim.",
      isNew: true
    },
    {
      id: 3,
      platform: "Website",
      rating: 3,
      reviewer: "Zehra T.",
      date: "1 day ago",
      location: "İstinyePark",
      text: "Ortalama bir deneyim. Beklenti daha yüksekti ama fena değildi.",
      isNew: false
    }
  ];

  const locationStats = [
    { name: "Bağdat Caddesi", reviews: 234, rating: 4.5, trend: "up" },
    { name: "Kanyon AVM", reviews: 189, rating: 4.2, trend: "stable" },
    { name: "İstinyePark", reviews: 156, rating: 4.4, trend: "up" },
    { name: "Zorlu Center", reviews: 143, rating: 4.1, trend: "down" }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="px-6 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="page-title">
            Reviews MVP Dashboard
          </h1>
          <p className="text-gray-600">
            Simplified review management and analytics for your retail locations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="ozet" data-testid="tab-ozet">
              <BarChart3 className="w-4 h-4 mr-2" />
              Özet (Overview)
            </TabsTrigger>
            <TabsTrigger value="inbox" data-testid="tab-inbox">
              <MessageSquare className="w-4 h-4 mr-2" />
              Gelen Kutusu (Inbox)
            </TabsTrigger>
          </TabsList>

          {/* Özet (Overview) Tab */}
          <TabsContent value="ozet" className="space-y-6">
            {/* Filter Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filters:</span>
                  </div>
                  
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-40" data-testid="select-date-range">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 Days</SelectItem>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-40" data-testid="select-source">
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-48" data-testid="select-location">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="bagdat">Bağdat Caddesi</SelectItem>
                      <SelectItem value="kanyon">Kanyon AVM</SelectItem>
                      <SelectItem value="istinyepark">İstinyePark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card data-testid="card-total-reviews">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{kpiData.totalReviews.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    +12% vs last period
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-average-rating">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl font-bold text-gray-900">{kpiData.averageRating}</div>
                    {renderStars(Math.floor(kpiData.averageRating))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <ArrowUp className="w-3 h-3" />
                    +0.2 vs last period
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-response-rate">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{kpiData.responseRate}%</div>
                  <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <ArrowDown className="w-3 h-3" />
                    -3% vs last period
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-response-time">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{kpiData.avgResponseTime}</div>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <ArrowDown className="w-3 h-3" />
                    -30 min improvement
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* New Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            {review.isNew && (
                              <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2" data-testid={`review-text-${review.id}`}>
                          {review.text}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{review.reviewer} • {review.location}</span>
                          <Badge variant="outline" className="text-xs">
                            {review.platform}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {locationStats.map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm" data-testid={`location-name-${index}`}>
                            {location.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{location.reviews} reviews</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span>{location.rating}</span>
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {location.trend === "up" && <ArrowUp className="w-4 h-4 text-green-600" />}
                          {location.trend === "down" && <ArrowDown className="w-4 h-4 text-red-600" />}
                          {location.trend === "stable" && <div className="w-4 h-0.5 bg-gray-400"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gelen Kutusu (Inbox) Tab */}
          <TabsContent value="inbox" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Reviews</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                        data-testid="search-reviews"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {renderStars(review.rating)}
                          <Badge variant="outline" className="text-xs">
                            {review.platform}
                          </Badge>
                          {review.isNew && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Reply className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{review.text}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{review.reviewer} • {review.location} • {review.date}</span>
                        <Button variant="outline" size="sm" className="h-7">
                          <Reply className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}