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
  ExternalLink
} from 'lucide-react';
import Header from '@/components/overview/header';

export default function ReviewsX() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30");
  const [locationFilter, setLocationFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");

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
      reviewer: "Ayşe K.",
      platform: "google",
      rating: 5,
      text: "Harika bir alışveriş deneyimi yaşadım, personel çok yardımseverdi...",
      location: "Zorlu Center",
      date: "2 saat önce",
      isNew: true
    },
    {
      id: 2,
      reviewer: "Mehmet Y.",
      platform: "facebook",
      rating: 2,
      text: "Ürün kalitesi beklediğim gibi değildi, iade süreci de uzun...",
      location: "Kanyon",
      date: "4 saat önce",
      isNew: true
    },
    {
      id: 3,
      reviewer: "Zeynep A.",
      platform: "yandex",
      rating: 4,
      text: "Genel olarak memnunum ama fiyatlar biraz yüksek...",
      location: "İstinye Park",
      date: "6 saat önce",
      isNew: false
    }
  ];

  const locations = [
    {
      id: 1,
      name: "Zorlu Center",
      city: "İstanbul",
      region: "Avrupa",
      rating: 4.8,
      reviewCount: 234,
      negativePercent: 8,
      responseRate: 92,
      lastReview: "2 saat önce"
    },
    {
      id: 2,
      name: "Kanyon",
      city: "İstanbul", 
      region: "Avrupa",
      rating: 4.2,
      reviewCount: 189,
      negativePercent: 15,
      responseRate: 78,
      lastReview: "4 saat önce"
    },
    {
      id: 3,
      name: "İstinye Park",
      city: "İstanbul",
      region: "Avrupa", 
      rating: 4.6,
      reviewCount: 156,
      negativePercent: 12,
      responseRate: 88,
      lastReview: "6 saat önce"
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
      topComplaint: "boyut",
      topCompliment: "rahatlık"
    },
    {
      id: 3,
      name: "Blazer - Lacivert",
      sku: "BYN-BL-012",
      category: "Üst Giyim",
      rating: 4.7,
      reviewCount: 43,
      sentiment: "positive", 
      topComplaint: "kesim",
      topCompliment: "kumaş"
    }
  ];

  const themeAnalysis = [
    { theme: "Ürün Kalitesi", positive: 78, neutral: 15, negative: 7, total: 450, trend: "up" },
    { theme: "Müşteri Hizmeti", positive: 82, neutral: 12, negative: 6, total: 380, trend: "up" },
    { theme: "Mağaza Atmosferi", positive: 71, neutral: 20, negative: 9, total: 325, trend: "stable" },
    { theme: "Fiyat-Performans", positive: 65, neutral: 25, negative: 10, total: 290, trend: "down" },
    { theme: "Ürün Çeşitliliği", positive: 88, neutral: 8, negative: 4, total: 275, trend: "up" }
  ];

  const responseTemplates = [
    { id: 1, name: "Pozitif Teşekkür", category: "5 Yıldız", content: "Değerli müşterimiz, güzel yorumunuz için teşekkür ederiz..." },
    { id: 2, name: "Özür Genel", category: "Negatif", content: "Yaşadığınız olumsuz deneyim için özür dileriz..." },
    { id: 3, name: "Bilgi Talebi", category: "Nötr", content: "Geri bildiriminiz için teşekkürler. Daha detaylı bilgi için..." }
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
            <span className="text-gray-900 font-medium">Reviews</span>
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
                  <SelectItem value="7">Son 7 gün</SelectItem>
                  <SelectItem value="30">Son 30 gün</SelectItem>
                  <SelectItem value="90">Son 90 gün</SelectItem>
                  <SelectItem value="365">Son 1 yıl</SelectItem>
                  <SelectItem value="custom">Özel tarih</SelectItem>
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Lokasyonlar</SelectItem>
                  <SelectItem value="istanbul">İstanbul</SelectItem>
                  <SelectItem value="ankara">Ankara</SelectItem>
                  <SelectItem value="izmir">İzmir</SelectItem>
                </SelectContent>
              </Select>

              {/* Product Filter */}
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-48">
                  <Package className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Ürünler</SelectItem>
                  <SelectItem value="clothing">Giyim</SelectItem>
                  <SelectItem value="shoes">Ayakkabı</SelectItem>
                  <SelectItem value="accessories">Aksesuar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* New Review Alerts */}
            <Button variant="outline" className="relative">
              <Bell className="w-4 h-4 mr-2" />
              Yeni Yorumlar
              {alertsCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {alertsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-50 rounded-none border-t border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <BarChart className="w-4 h-4 mr-2" />
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <MapPin className="w-4 h-4 mr-2" />
              Lokasyonlar
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <Package className="w-4 h-4 mr-2" />
              Ürünler
            </TabsTrigger>
            <TabsTrigger value="inbox" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <Inbox className="w-4 h-4 mr-2" />
              Gelen Kutusu
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              İçgörüler
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              Ayarlar
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="p-6">
            
            {/* Overview Section */}
            <TabsContent value="overview" className="space-y-6">
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="pb-3 pt-6">
                    <CardTitle className="text-sm font-semibold text-gray-800">Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{kpiData.averageRating}</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <ArrowUp className="w-3 h-3" />
                      +0.1 önceki dönem
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 pt-6">
                    <CardTitle className="text-sm font-semibold text-gray-800">Review Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{kpiData.totalReviews.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <ArrowUp className="w-3 h-3" />
                      +12% önceki dönem
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 pt-6">
                    <CardTitle className="text-sm font-semibold text-gray-800">Reply Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{kpiData.responseRate}%</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <ArrowUp className="w-3 h-3" />
                      +5% önceki dönem
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 pt-6">
                    <CardTitle className="text-sm font-semibold text-gray-800">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{kpiData.avgResponseTime}</div>
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <ArrowUp className="w-3 h-3" />
                      +2h önceki dönem
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 pt-6">
                    <CardTitle className="text-sm font-semibold text-gray-800">Sentiment Index</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{kpiData.sentimentIndex}%</div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <ArrowUp className="w-3 h-3" />
                      +3% önceki dönem
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Yorum Hacmi ve Ortalama Puan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-xs text-gray-500">Son 12 hafta</div>
                        <div className="flex gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span>Yorum Sayısı</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Ortalama Puan</span>
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
                        
                        {/* Y-axis labels for rating */}
                        <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -mr-8">
                          <span>5.0★</span>
                          <span>4.5★</span>
                          <span>4.0★</span>
                          <span>3.5★</span>
                          <span>3.0★</span>
                        </div>
                        
                        {/* Data visualization */}
                        <div className="absolute inset-0 flex items-end justify-between px-2 pb-4">
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
                            <div key={i} className="flex flex-col items-center gap-1 relative">
                              {/* Volume bar */}
                              <div 
                                className="w-6 bg-blue-400 rounded-t" 
                                style={{height: `${(data.volume / 400) * 160}px`}}
                                title={`${data.volume} yorum`}
                              ></div>
                              <div className="text-xs text-gray-400">W{data.week}</div>
                              
                              {/* Rating line point */}
                              <div 
                                className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"
                                style={{
                                  bottom: `${20 + ((data.rating - 3) / 2) * 160}px`,
                                  left: '50%',
                                  transform: 'translateX(-50%)'
                                }}
                                title={`${data.rating}★ ortalama`}
                              ></div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Rating trend line */}
                        <svg className="absolute inset-0 pointer-events-none">
                          <polyline
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2"
                            points={[
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
                            ].map((d, i) => {
                              const x = (i / 11) * 100;
                              const y = 100 - (((d.rating - 3) / 2) * 100);
                              return `${x}%,${y}%`;
                            }).join(' ')}
                          />
                        </svg>
                        
                        <div className="absolute top-4 right-4 text-green-600 font-medium">
                          ▲ 4.75★ Ortalama (+0.15)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Kaynak Dağılımı</CardTitle>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Grafik Görünümü
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 font-bold text-sm">G</span>
                          </div>
                          <span className="text-sm font-medium">Google My Business</span>
                        </div>
                        <span className="text-sm font-medium">65% (2,386 yorum)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-red-500 h-3 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">f</span>
                          </div>
                          <span className="text-sm font-medium">Facebook</span>
                        </div>
                        <span className="text-sm font-medium">20% (734 yorum)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{width: '20%'}}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <span className="text-yellow-600 font-bold text-sm">Y</span>
                          </div>
                          <span className="text-sm font-medium">Yandex Maps</span>
                        </div>
                        <span className="text-sm font-medium">15% (552 yorum)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-yellow-500 h-3 rounded-full" style={{width: '15%'}}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rating Distribution Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Puan Dağılımı ve Analiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overall" className="w-full">
                    <TabsList className="grid w-fit grid-cols-2">
                      <TabsTrigger value="overall">Genel</TabsTrigger>
                      <TabsTrigger value="locations">Lokasyonlara Göre</TabsTrigger>
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
                      <div className="text-sm text-gray-600 mb-4">En fazla yoruma sahip 20 lokasyon için puan dağılımı</div>
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
                            <div className="w-16 text-xs text-gray-500">{location.total} yorum</div>
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
                    <CardTitle>Anahtar Kelimeler - Bahis Sayısı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {keyword: "mağaza", mentions: 245, trend: "up"},
                        {keyword: "ürün", mentions: 189, trend: "up"},
                        {keyword: "personel", mentions: 156, trend: "stable"},
                        {keyword: "kalite", mentions: 134, trend: "up"},
                        {keyword: "fiyat", mentions: 98, trend: "down"},
                        {keyword: "hizmet", mentions: 87, trend: "up"},
                        {keyword: "çeşit", mentions: 76, trend: "stable"},
                        {keyword: "atmosfer", mentions: 65, trend: "up"}
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-gray-500 w-6">#{index + 1}</span>
                            <span className="font-medium">{item.keyword}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">{item.mentions} bahis</span>
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
                    <CardTitle>Anahtar Kelimeler - Duygu Analizi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {keyword: "mağaza", positive: 78, negative: 22, sentiment: "positive"},
                        {keyword: "ürün", positive: 82, negative: 18, sentiment: "positive"},
                        {keyword: "personel", positive: 91, negative: 9, sentiment: "positive"},
                        {keyword: "kalite", positive: 88, negative: 12, sentiment: "positive"},
                        {keyword: "fiyat", positive: 45, negative: 55, sentiment: "negative"},
                        {keyword: "hizmet", positive: 76, negative: 24, sentiment: "positive"},
                        {keyword: "çeşit", positive: 69, negative: 31, sentiment: "positive"},
                        {keyword: "atmosfer", positive: 84, negative: 16, sentiment: "positive"}
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
                    <CardTitle>Son Yorumlar & Uyarılar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReviews.map((review) => (
                        <div key={review.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            {review.isNew && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
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
                            <div className="font-medium text-sm">{review.reviewer} - {review.location}</div>
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
                    <CardTitle>En İyi & En Kötü Temalar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">👍 En Çok Beğenilenler</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Personel Nezaketi</span>
                            <span className="text-green-600">95% pozitif (45 bahis)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Ürün Kalitesi</span>
                            <span className="text-green-600">88% pozitif (67 bahis)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">👎 En Çok Şikâyet Edilenler</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Bekleme Süresi</span>
                            <span className="text-red-600">40% negatif (30 bahis)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Fiyat Politikası</span>
                            <span className="text-red-600">35% negatif (22 bahis)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Location Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Lokasyon Sıralaması</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-green-600 mb-3">🏆 En İyi 5 Lokasyon</h4>
                      <div className="space-y-2">
                        {locations.slice(0, 3).map((location, index) => (
                          <div key={location.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-600">#{index + 1}</span>
                              <span className="text-sm">{location.name}</span>
                            </div>
                            <span className="text-sm font-medium">{location.rating}★</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-red-600 mb-3">⚠️ İyileştirme Gereken</h4>
                      <div className="space-y-2">
                        {locations.slice(-2).map((location, index) => (
                          <div key={location.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-red-600">#{locations.length - 1 + index}</span>
                              <span className="text-sm">{location.name}</span>
                            </div>
                            <span className="text-sm font-medium">{location.rating}★</span>
                          </div>
                        ))}
                      </div>
                    </div>
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
                            <th className="text-center py-3 px-4 font-medium text-gray-600">Yorum Sayısı</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">% Negatif</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">Yanıt Oranı</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">Son Yorum</th>
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
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Yorum Sayısı</th>
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
                                {product.sentiment === "positive" ? "Pozitif" : product.sentiment === "mixed" ? "Karışık" : "Negatif"}
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
                <h2 className="text-2xl font-bold">Yorum Gelen Kutusu</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{recentReviews.filter(r => r.isNew).length} Yeni</Badge>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrele
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Review List */}
                <div className="col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Yorumlar ({recentReviews.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {recentReviews.map((review) => (
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
                        <CardTitle className="text-base">Yorum Detayı</CardTitle>
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
                          <h4 className="font-medium">Yanıt Yazın</h4>
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
                          placeholder="Yanıtınızı buraya yazın..."
                          className="min-h-[100px]"
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox id="internal-note" />
                            <label htmlFor="internal-note" className="text-sm">İç not olarak kaydet</label>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">Taslak Kaydet</Button>
                            <Button>
                              <Send className="w-4 h-4 mr-2" />
                              Gönder
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Internal Notes */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">İç Notlar</h4>
                        <div className="space-y-2">
                          <div className="text-sm p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                            <div className="font-medium">Ahmet Y. - 2 saat önce</div>
                            <div>Bu müşteriyle telefonda konuştum, sorun çözüldü.</div>
                          </div>
                        </div>
                        <Textarea
                          placeholder="Yeni iç not ekle..."
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
                <h2 className="text-2xl font-bold">Derin Analiz & İçgörüler</h2>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Rapor İndir
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Zamanla Rapor
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
                      <div className="text-sm text-gray-600">Net Duygu Skoru</div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pozitif</span>
                          <span className="font-medium text-green-600">80%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Nötr</span>
                          <span className="font-medium text-gray-600">15%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Negatif</span>
                          <span className="font-medium text-red-600">5%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trend Analizi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-center justify-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mr-3" />
                      Trend grafiği burada gösterilecek
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Yanıt Performansı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">24 saat içinde</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '67%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">48 saat içinde</span>
                        <span className="font-medium">89%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{width: '89%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">48+ saat</span>
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
                  <CardTitle>Tema Analizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Tema</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Pozitif %</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Nötr %</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Negatif %</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Toplam Bahis</th>
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
                    <CardTitle>Yanıt Şablonları</CardTitle>
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
                        <span className="text-sm">1-2 yıldızlı yorumlar için anında e-posta</span>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Günlük yorum özeti</span>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Yanıt onayı gerektiğinde bildir</span>
                        <Checkbox />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Haftalık performans raporu</span>
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
                        <span className="text-sm">5 yıldızlı yorumlara otomatik teşekkür</span>
                        <Checkbox />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI yanıt önerileri</span>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Otomatik duygu analizi</span>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Yabancı dil çevirileri</span>
                        <Checkbox defaultChecked />
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <label className="text-sm font-medium">AI Yanıt Tonu</label>
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