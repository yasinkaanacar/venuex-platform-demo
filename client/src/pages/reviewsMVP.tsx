import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/overview/header";
import { 
  BarChart3, 
  Inbox, 
  MapPin, 
  Star, 
  MessageSquare, 
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Filter,
  Search,
  BookOpen,
  Target,
  Send,
  Phone,
  Globe,
  Facebook,
  Building2,
  Package2
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function ReviewsMVP() {
  const [activeTab, setActiveTab] = useState("ozet");
  const [reviewSource, setReviewSource] = useState<"locations" | "products">("locations");
  
  // Filter states
  const [inboxFilters, setInboxFilters] = useState<{
    source: string | null;
    rating: string | null;
    week: string | null;
    status: string | null;
  }>({
    source: null,
    rating: null,
    week: null,
    status: null
  });

  // Location filters
  const [locationFilter, setLocationFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [replyRateFilter, setReplyRateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const kpiData = {
    totalReviews: 8847,
    avgRating: 4.2,
    responseRate: 73,
    avgResponseTime: "4.8h"
  };

  const chartData = [
    { name: "Dec", reviews: 520, sentiment: 4.1 },
    { name: "Jan", reviews: 680, sentiment: 4.2 },
    { name: "Feb", reviews: 750, sentiment: 4.3 },
    { name: "Mar", reviews: 890, sentiment: 4.2 },
    { name: "Apr", reviews: 720, sentiment: 4.1 },
    { name: "May", reviews: 620, sentiment: 4.4 }
  ];

  const themesData = {
    positive: [
      { theme: "Staff Service", percentage: 87, count: 156 },
      { theme: "Product Quality", percentage: 78, count: 140 },
      { theme: "Store Cleanliness", percentage: 71, count: 127 },
      { theme: "Product Variety", percentage: 65, count: 117 },
      { theme: "Store Location", percentage: 58, count: 104 }
    ],
    negative: [
      { theme: "Wait Time", percentage: 52, count: 67 },
      { theme: "Price", percentage: 48, count: 62 },
      { theme: "Stock Availability", percentage: 45, count: 58 },
      { theme: "Store Layout", percentage: 43, count: 55 },
      { theme: "Parking", percentage: 41, count: 43 }
    ]
  };

  // Location Reviews - separate data source
  const locationReviews = [
    {
      id: 1,
      platform: "Google",
      rating: 5,
      reviewer: "Ayşe K.",
      date: "2 hours ago",
      location: "Bağdat Caddesi",
      text: "Harika bir deneyim! Personel çok yardımseverdi ve mağaza atmosferi mükemmeldi.",
      isNew: true
    },
    {
      id: 2,
      platform: "Facebook",
      rating: 4,
      reviewer: "Mehmet S.",
      date: "5 hours ago", 
      location: "Kanyon AVM",
      text: "Güzel mağaza ama biraz kalabalık. Personel yardımcı oldu.",
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
    },
    {
      id: 4,
      platform: "Google",
      rating: 2,
      reviewer: "Can Y.",
      date: "3 hours ago",
      location: "Zorlu Center",
      text: "Mağaza çok dağınıktı ve personel ilgisizdi. Hayal kırıklığı.",
      isNew: true
    },
    {
      id: 5,
      platform: "Website",
      rating: 5,
      reviewer: "Selin M.",
      date: "1 day ago",
      location: "Nişantaşı",
      text: "Mükemmel bir mağaza! Temiz, düzenli ve personel çok profesyonel.",
      isNew: false
    }
  ];

  // Product Reviews - separate data source
  const productReviews = [
    {
      id: 1,
      platform: "Google",
      rating: 5,
      reviewer: "Ayşe K.",
      date: "2 hours ago",
      product: "Running Shoes",
      productSku: "RS-001",
      text: "Harika bir ürün! Çok rahat ve kaliteli. Koşu performansımı artırdı.",
      isNew: true
    },
    {
      id: 2,
      platform: "Facebook",
      rating: 4,
      reviewer: "Mehmet S.",
      date: "5 hours ago", 
      product: "Winter Coat",
      productSku: "WC-045",
      text: "Sıcak tutuyor ama biraz ağır. Genel olarak memnunum.",
      isNew: true
    },
    {
      id: 3,
      platform: "Website",
      rating: 3,
      reviewer: "Zehra T.",
      date: "1 day ago",
      product: "Coffee Maker",
      productSku: "CM-123",
      text: "Ortalama bir kahve makinesi. Beklentimi tam karşılamadı.",
      isNew: false
    },
    {
      id: 4,
      platform: "Google",
      rating: 2,
      reviewer: "Can Y.",
      date: "3 hours ago",
      product: "Wireless Headphones",
      productSku: "WH-078",
      text: "Ses kalitesi hayal kırıklığı. Beklediğim gibi değildi.",
      isNew: true
    },
    {
      id: 5,
      platform: "Website",
      rating: 5,
      reviewer: "Selin M.",
      date: "1 day ago",
      product: "Laptop Bag",
      productSku: "LB-256",
      text: "Mükemmel ürün! Çok dayanıklı ve şık tasarım.",
      isNew: false
    }
  ];

  // Get current reviews based on selected source
  const currentReviews = reviewSource === "locations" ? locationReviews : productReviews;

  const locationStats = [
    { name: "Bağdat Caddesi", reviews: 234, rating: 4.5, trend: "up" },
    { name: "Kanyon AVM", reviews: 189, rating: 4.2, trend: "stable" },
    { name: "İstinyePark", reviews: 156, rating: 4.4, trend: "up" },
    { name: "Zorlu Center", reviews: 143, rating: 4.1, trend: "down" }
  ];

  const locationsData = [
    { code: "BOY001", name: "Bağdat Caddesi", city: "İstanbul", region: "Marmara", reviews: 234, avgRating: 4.5, replyRate: 85, sentiment: "Positive", topThemes: ["Staff", "Quality"] },
    { code: "BOY002", name: "Kanyon AVM", city: "İstanbul", region: "Marmara", reviews: 189, avgRating: 4.2, replyRate: 78, sentiment: "Positive", topThemes: ["Location", "Variety"] },
    { code: "BOY003", name: "İstinyePark", city: "İstanbul", region: "Marmara", reviews: 156, avgRating: 4.4, replyRate: 82, sentiment: "Positive", topThemes: ["Staff", "Cleanliness"] },
    { code: "BOY004", name: "Zorlu Center", city: "İstanbul", region: "Marmara", reviews: 143, avgRating: 4.1, replyRate: 76, sentiment: "Mixed", topThemes: ["Location", "Service"] },
    { code: "BOY005", name: "Nişantaşı", city: "İstanbul", region: "Marmara", reviews: 198, avgRating: 4.6, replyRate: 89, sentiment: "Positive", topThemes: ["Quality", "Staff"] }
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

  // Filter reviews based on various criteria
  const filteredReviews = useMemo(() => {
    return currentReviews.filter(review => {
      // Location/Product filter
      if (reviewSource === "locations" && locationFilter !== "all") {
        if (!('location' in review) || review.location !== locationFilter) return false;
      }
      if (reviewSource === "products" && productFilter !== "all") {
        if (!('product' in review) || review.product !== productFilter) return false;
      }

      // Rating filter
      if (inboxFilters.rating && inboxFilters.rating !== "all") {
        const ratingValue = parseInt(inboxFilters.rating);
        if (review.rating !== ratingValue) return false;
      }

      return true;
    });
  }, [currentReviews, reviewSource, locationFilter, productFilter, inboxFilters]);

  // Filter locations based on various criteria
  const filteredLocations = useMemo(() => {
    return locationsData.filter(location => {
      // Region filter
      if (regionFilter !== "all" && location.region !== regionFilter) return false;
      
      // City filter  
      if (cityFilter !== "all" && location.city !== cityFilter) return false;
      
      // Rating filter
      if (ratingFilter !== "all") {
        const minRating = parseFloat(ratingFilter);
        if (location.avgRating < minRating) return false;
      }
      
      // Reply rate filter
      if (replyRateFilter !== "all") {
        const minReplyRate = parseInt(replyRateFilter);
        if (location.replyRate < minReplyRate) return false;
      }
      
      // Search term filter
      if (searchTerm && !location.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !location.code.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });
  }, [regionFilter, cityFilter, ratingFilter, replyRateFilter, searchTerm]);

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
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="ozet" data-testid="tab-ozet">
              <BarChart3 className="w-4 h-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="inbox" data-testid="tab-inbox">
              <Inbox className="w-4 h-4 mr-2" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="locations" data-testid="tab-locations">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="ozet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* KPI Cards */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                      <p className="text-2xl font-bold">{kpiData.totalReviews}</p>
                    </div>
                    <div className="text-blue-600">
                      <Star className="w-8 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold">{kpiData.avgRating}</p>
                    </div>
                    <div className="text-green-600">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Response Rate</p>
                      <p className="text-2xl font-bold">{kpiData.responseRate}%</p>
                    </div>
                    <div className="text-purple-600">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold">{kpiData.avgResponseTime}</p>
                    </div>
                    <div className="text-orange-600">
                      <Clock className="w-8 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Review Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Area 
                        type="monotone" 
                        dataKey="reviews" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 5]} />
                      <Bar dataKey="sentiment" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Themes Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Advantages Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-green-700 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Advantages
                  </CardTitle>
                  <p className="text-sm text-gray-600">Most positive themes</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {themesData.positive.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{item.theme}</span>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <span>{item.percentage}%</span>
                          <span className="text-gray-500">({item.count})</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${(item.count / themesData.positive[0].count) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Disadvantages Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-red-700 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Disadvantages
                  </CardTitle>
                  <p className="text-sm text-gray-600">Most negative themes</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {themesData.negative.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{item.theme}</span>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <span>{item.percentage}%</span>
                          <span className="text-gray-500">({item.count})</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${(item.count / themesData.negative[0].count) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Review Inbox</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currentReviews.filter(r => r.isNew).length} New</Badge>
                <Button variant="outline" size="sm" onClick={() => setInboxFilters({ source: null, rating: null, week: null, status: null })}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Desktop Filter Bar */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-6">
                  {/* Review Source Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Source:</label>
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          reviewSource === "locations" 
                            ? "bg-slate-800 text-white" 
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setReviewSource("locations")}
                      >
                        Locations
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                          reviewSource === "products" 
                            ? "bg-slate-800 text-white" 
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setReviewSource("products")}
                      >
                        Products
                      </button>
                    </div>
                  </div>

                  {/* Context-Aware Location/Product Filter */}
                  {reviewSource === "locations" ? (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Location:</label>
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="w-48 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {locationsData.slice(0, 10).map((location) => (
                            <SelectItem key={location.code} value={location.name}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Product:</label>
                      <Select value={productFilter} onValueChange={setProductFilter}>
                        <SelectTrigger className="w-48 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Products" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="Running Shoes">Running Shoes</SelectItem>
                          <SelectItem value="Winter Coat">Winter Coat</SelectItem>
                          <SelectItem value="Coffee Maker">Coffee Maker</SelectItem>
                          <SelectItem value="Wireless Headphones">Wireless Headphones</SelectItem>
                          <SelectItem value="Laptop Bag">Laptop Bag</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Rating Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Rating:</label>
                    <Select value={inboxFilters.rating || "all"} onValueChange={(value) => setInboxFilters(prev => ({ ...prev, rating: value === "all" ? null : value }))}>
                      <SelectTrigger className="w-32 border-gray-300 rounded-md">
                        <SelectValue placeholder="All Ratings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className={`${review.isNew ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {review.platform === "Google" && <Globe className="w-3 h-3 mr-1" />}
                            {review.platform === "Facebook" && <Facebook className="w-3 h-3 mr-1" />}
                            {review.platform === "Website" && <Building2 className="w-3 h-3 mr-1" />}
                            {review.platform}
                          </Badge>
                          {reviewSource === "locations" && 'location' in review && (
                            <Badge variant="outline" className="text-xs">
                              <Building2 className="w-3 h-3 mr-1" />
                              {review.location}
                            </Badge>
                          )}
                          {reviewSource === "products" && 'product' in review && (
                            <Badge variant="outline" className="text-xs">
                              <Package2 className="w-3 h-3 mr-1" />
                              {review.product}
                            </Badge>
                          )}
                          {review.isNew && <Badge className="bg-blue-600 text-white text-xs">New</Badge>}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.reviewer}</span>
                          <span className="text-sm text-gray-500">- {review.date}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{review.text}</p>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Select Template
                          </Button>
                          <Button variant="outline" size="sm">
                            <Target className="w-4 h-4 mr-2" />
                            AI Suggestion
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Reply to Review</h4>
                      
                      <Textarea
                        placeholder="Write your reply here..."
                        className="min-h-[100px]"
                      />
                      
                      <div className="flex justify-end gap-2 mt-3">
                        <Button variant="outline">Save Draft</Button>
                        <Button>
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Store Locations</h2>
              <div className="text-sm text-gray-500">{locationsData.length} locations</div>
            </div>

            {/* Location Filter Bar */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-6">
                  {/* Geographic Hierarchy */}
                  <div className="flex items-center gap-4">
                    {/* Region Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Region:</label>
                      <Select value={regionFilter} onValueChange={(value) => {
                        setRegionFilter(value);
                        setCityFilter("all");
                      }}>
                        <SelectTrigger className="w-40 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Regions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="Marmara">Marmara</SelectItem>
                          <SelectItem value="Aegean">Aegean</SelectItem>
                          <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">City:</label>
                      <Select value={cityFilter} onValueChange={setCityFilter}>
                        <SelectTrigger className="w-40 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          <SelectItem value="İstanbul">İstanbul</SelectItem>
                          <SelectItem value="Ankara">Ankara</SelectItem>
                          <SelectItem value="İzmir">İzmir</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="flex items-center gap-4">
                    {/* Rating Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Min Rating:</label>
                      <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger className="w-32 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="4.5">4.5+</SelectItem>
                          <SelectItem value="4.0">4.0+</SelectItem>
                          <SelectItem value="3.5">3.5+</SelectItem>
                          <SelectItem value="3.0">3.0+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reply Rate Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Min Reply Rate:</label>
                      <Select value={replyRateFilter} onValueChange={setReplyRateFilter}>
                        <SelectTrigger className="w-32 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Rates" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Rates</SelectItem>
                          <SelectItem value="80">80%+</SelectItem>
                          <SelectItem value="70">70%+</SelectItem>
                          <SelectItem value="60">60%+</SelectItem>
                          <SelectItem value="50">50%+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Direct Search */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Search:</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Store name or code..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Locations Table */}
            <Card>
              <CardHeader>
                <CardTitle>Store Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Store Code</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Store Name</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Reviews</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Avg Rating</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Reply Rate</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Sentiment</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Top Themes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLocations.map((location) => (
                        <tr key={location.code} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{location.code}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{location.name}</div>
                              <div className="text-sm text-gray-500">{location.city}, {location.region}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">{location.reviews}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {renderStars(Math.floor(location.avgRating))}
                              <span className="ml-2 text-sm font-medium">{location.avgRating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              location.replyRate >= 80 ? 'bg-green-100 text-green-800' :
                              location.replyRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {location.replyRate}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              location.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                              location.sentiment === 'Mixed' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {location.sentiment}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {location.topThemes.map((theme, index) => (
                                <button
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors cursor-pointer"
                                  onClick={() => {
                                    // Theme filtering logic would go here
                                    console.log(`Filter by theme: ${theme}`);
                                  }}
                                >
                                  {theme}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}