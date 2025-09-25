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
import { Checkbox } from "@/components/ui/checkbox";
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
  Share2,
  Target,
  BookOpen
} from 'lucide-react';
import Header from '@/components/overview/header';

export default function ReviewsMVP() {
  const [activeTab, setActiveTab] = useState("ozet");
  const [dateRange, setDateRange] = useState("30");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inboxFilters, setInboxFilters] = useState({
    source: null,
    rating: null,
    week: null,
    status: null
  });

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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Haftanın Özeti - Avantajlar / Dezavantajlar</h2>
              <div className="text-sm text-gray-500">Son 7 gün</div>
            </div>

            {/* Avantajlar / Dezavantajlar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avantajlar (Advantages) Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-green-700 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Avantajlar
                  </CardTitle>
                  <p className="text-sm text-gray-600">En olumlu temalar</p>
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

              {/* Dezavantajlar (Disadvantages) Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-red-700 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Dezavantajlar
                  </CardTitle>
                  <p className="text-sm text-gray-600">En olumsuz temalar</p>
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

          {/* Gelen Kutusu (Inbox) Tab */}
          <TabsContent value="inbox" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Review Inbox</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{recentReviews.filter(r => r.isNew).length} New</Badge>
                <Button variant="outline" size="sm" onClick={() => setInboxFilters({ source: null, rating: null, week: null, status: null })}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(inboxFilters.source || inboxFilters.rating || inboxFilters.week || inboxFilters.status) && (
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
                {inboxFilters.status && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Status: {inboxFilters.status}
                    <button 
                      onClick={() => setInboxFilters({...inboxFilters, status: null})}
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
                    <CardTitle className="text-base">Reviews ({recentReviews.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {recentReviews.filter(review => {
                        if (inboxFilters.source && review.platform !== inboxFilters.source) return false;
                        if (inboxFilters.rating && review.rating !== inboxFilters.rating) return false;
                        if (inboxFilters.status) {
                          // Add status filtering logic here
                        }
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

        </Tabs>
      </div>
    </div>
  );
}