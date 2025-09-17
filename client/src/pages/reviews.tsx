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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown,
  List,
  Map,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';

export default function Reviews() {
  const [selectedPlatform, setSelectedPlatform] = useState("google");
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);

  // Star rating breakdown data
  const ratingBreakdown = [
    { stars: 5, percentage: 16.8, count: 618 },
    { stars: 4, percentage: 16.8, count: 618 },
    { stars: 3, percentage: 20.4, count: 750 },
    { stars: 2, percentage: 22.6, count: 831 },
    { stars: 1, percentage: 23.4, count: 859 }
  ];

  // Dashboard metrics
  const aiAnalysisData = {
    totalReviews: 3672,
    unanswered: 4708,
    answered: 2399
  };

  const issuesData = [
    { type: "Unanswered Reviews", count: 6947, color: "bg-red-100 text-red-800" },
    { type: "Unanswered Reviews (Rating Over)", count: 4293, color: "bg-orange-100 text-orange-800" },
    { type: "1 Star Reviews", count: 6392, color: "bg-red-100 text-red-800" },
    { type: "Reviews with Photos", count: 7714, color: "bg-blue-100 text-blue-800" },
    { type: "5 Star Reviews", count: 7774, color: "bg-green-100 text-green-800" }
  ];

  const statusChangeData = [
    { label: "Answered Count", current: 13, change: 6.2, previous: 2950 },
    { label: "Average Rating", current: 668378, change: -2.3, previous: 668377 },
    { label: "", current: 3.89, change: -2.5, previous: 3.87 }
  ];

  // Reviews data
  const reviews = [
    {
      id: 1,
      name: "Boyner Eskişehir Kanatlı",
      rating: 3,
      date: "4 days ago",
      comment: "İyi hizmet veriyorlar ama alan çok daraltılmış. Personel çok ilgili ancak mağaza çok küçük.",
      location: "Tepebaşı Mh, İsmet İnönü Cd. No:15, Eskişehir",
      status: "Answered",
      hasPhoto: false
    },
    {
      id: 2,
      name: "Boyner Eskişehir Kanatlı",
      rating: 4,
      date: "7 days ago", 
      comment: "3.95 ⭐⭐⭐⭐ 1017 Reviews\nTepebaşı Mh, İsmet İnönü Cd. No:15, Eskişehir",
      location: "Tepebaşı Mh, İsmet İnönü Cd. No:15, Eskişehir",
      status: "Answered",
      hasPhoto: false
    },
    {
      id: 3,
      name: "gece bebeği yurdakul",
      rating: 5,
      date: "",
      comment: "Çalışanlar çok değişmiş. Kaliteli bir personelsiniz artık. Bravo size...",
      location: "",
      status: "Answered", 
      hasPhoto: false
    },
    {
      id: 4,
      name: "Boyner Espark Kanatli",
      rating: 1,
      date: "11 May 2023 8:07 AM",
      comment: "Spor giyim rafik yeterli, çalışan personelin hiç başpara etiketi yoktu. Boyner Eskişehir Kanatlı spor bölümünde kocası bu da rahat güzeldi aracıya iken gizli çekilmiş personel büyük ihtimalle. Ayrıca raflardaki ürünlerin hangi bed",
      location: "",
      status: "Delete",
      hasPhoto: false
    },
    {
      id: 5,
      name: "Boyner Ankara Karum",
      rating: 5,
      date: "",
      comment: "Dur bir... İsmail Hakki Tonguç, thank you for your valuable feedback. At Boyner Eskişehir Kanatli, we value our guests' feedback and you with a better shopping experience. For all your inquiries, please contact us at info@boynergroup.com.tr or call center at +444 0 6 67. Thank you once again.",
      location: "",
      status: "Reply",
      hasPhoto: false
    },
    {
      id: 6,
      name: "Boyner Dynamic Çerkezköy",
      rating: 3,
      date: "",
      comment: "Bayley personel çağırdığında çok 30-35 çalıştırıyor",
      location: "",
      status: "Reply",
      hasPhoto: false
    },
    {
      id: 7,
      name: "Boyner Aydin Forum",
      rating: 5,
      date: "",
      comment: "Ayvalık tekstil mağazası ANTIKA!\nBir çalışanı olmasa mağazalarda satış yapması zorlaşacak.",
      location: "",
      status: "Reply",
      hasPhoto: false
    },
    {
      id: 8,
      name: "Boyner Antalia",
      rating: 1,
      date: "",
      comment: "Boyner Antalya Kapalı şu ana kadar tesadüfen.",
      location: "",
      status: "Reply", 
      hasPhoto: false
    },
    {
      id: 9,
      name: "Boyner Ankara Migros", 
      rating: 5,
      date: "",
      comment: "Mağazadan mağazaya geç çok güzelmiş ve tekliflerim de sayesinde memnun kalıyor, diyor çok.",
      location: "",
      status: "Reply",
      hasPhoto: false
    },
    {
      id: 10,
      name: "Boyner İnan Ayvacıklık",
      rating: 3,
      date: "",
      comment: "Çalışanlar mağaza açış dışında yardımcı olmuyorlar Yeterki mağazalara satin alım sayfalinde de mağazada olanrak.",
      location: "",
      status: "Reply", 
      hasPhoto: false
    },
    {
      id: 11,
      name: "Boyner Gebze Center",
      rating: 4,
      date: "",
      comment: "Beğendiğim boyner çok yakala olmak...",
      location: "",
      status: "Reply",
      hasPhoto: false
    }
  ];

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Answered": { color: "bg-green-100 text-green-800", text: "Reply" },
      "Reply": { color: "bg-blue-100 text-blue-800", text: "Reply" },
      "Delete": { color: "bg-red-100 text-red-800", text: "Delete" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Reply"];
    
    return (
      <Button size="sm" className={`${config.color} hover:${config.color} text-xs px-3 py-1 rounded-md border-0`}>
        {config.text}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="p-6">
        {/* Top Metrics Section */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
            <h3 className="text-base font-semibold text-foreground">Reviews</h3>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="text-blue-600 border-blue-600">
                Review Templates
              </Button>
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium">
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Overall Rating */}
              <div className="col-span-3">
                <div className="bg-white rounded-md border border-slate-200 p-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">RATINGS</div>
                    <div className="flex justify-center mb-2">
                      {getRatingStars(3)}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">3.28</div>
                    <div className="text-sm text-gray-500">Good</div>
                    <div className="text-sm text-gray-500 mt-1">1,625 ★</div>
                  </div>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="col-span-4">
                <div className="bg-white rounded-md border border-slate-200 p-6">
                  <div className="space-y-3">
                    {ratingBreakdown.map((item) => (
                      <div key={item.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{item.stars}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Sentiment */}
              <div className="col-span-5">
                <div className="bg-white rounded-md border border-slate-200 p-6">
                  <div className="text-sm font-medium text-gray-600 mb-4">REVIEW SENTIMENT</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">16.53</div>
                      <div className="text-xs text-green-600">+86% vs previous period</div>
                      <div className="text-xs text-gray-500 mt-1">Positive</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">8.42</div>
                      <div className="text-xs text-gray-500">Neutral</div>
                      <div className="text-xs text-gray-500 mt-1">vs previous period</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">9.35</div>
                      <div className="text-xs text-red-600">-1% vs previous period</div>
                      <div className="text-xs text-gray-500 mt-1">Negative</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium text-gray-600 mb-2">PLATFORMS</div>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Google Business Profile</Badge>
                      <Badge className="bg-gray-100 text-gray-800">Meta</Badge>
                      <Badge className="bg-gray-100 text-gray-800">Tripadvisor</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
            <h3 className="text-base font-semibold text-foreground">Review Analytics</h3>
          </div>
          <div className="bg-stone-50 p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* AI Review Analysis */}
              <div className="bg-white rounded-md border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">AI Review Analysis</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Reviews</span>
                    <span className="font-medium">{aiAnalysisData.totalReviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Unanswered</span>
                    <span className="font-medium">{aiAnalysisData.unanswered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Answered</span>
                    <span className="font-medium">{aiAnalysisData.answered}</span>
                  </div>
                </div>
              </div>

              {/* Issues & Suggestions */}
              <div className="bg-white rounded-md border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Issues & Suggestions</span>
                </div>
                <div className="space-y-3">
                  {issuesData.slice(0, 3).map((issue, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{issue.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{issue.count}</span>
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Status Change */}
              <div className="bg-white rounded-md border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Review Status Change</span>
                </div>
                <div className="space-y-3">
                  {statusChangeData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      {item.label && <span className="text-sm text-gray-600">{item.label}</span>}
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.current.toLocaleString()}</span>
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                          item.change > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                        }`}>
                          {item.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(item.change)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
            <h3 className="text-base font-semibold text-foreground">Reviews (73,880)</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === "list" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  List View
                </Button>
                <Button 
                  variant={viewMode === "map" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="flex items-center gap-2"
                >
                  <Map className="w-4 h-4" />
                  Map View
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-6">
            <div className="flex items-center gap-3 mb-6">
              {/* Platform Selector */}
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-64">
                  <div className="flex flex-col items-start w-full">
                    <div className="text-xs text-gray-500">Platform</div>
                    <div className="text-sm">Google Business Profile</div>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">🔍 Google Business Profile</SelectItem>
                  <SelectItem value="meta">📘 Meta Business</SelectItem>
                  <SelectItem value="yandex">🔴 Yandex Maps</SelectItem>
                </SelectContent>
              </Select>

              {/* Search */}
              <div className="relative flex-1 max-w-[400px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search reviews..." className="pl-10" />
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Bulk Actions ↓</Button>
                <Button variant="outline" size="sm">Export Reviews ↓</Button>
              </div>
            </div>

            {/* Reviews Content */}
            <div className="bg-white rounded-md border border-slate-200">
              <div className="space-y-0">
                {reviews.map((review, index) => (
                  <div key={review.id} className={`p-6 border-b border-slate-200 ${index === reviews.length - 1 ? 'border-b-0' : ''}`}>
                    <div className="flex items-start gap-4">
                      <Checkbox />
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{review.name}</h4>
                          <div className="flex items-center gap-1">
                            {getRatingStars(review.rating)}
                          </div>
                          {review.date && (
                            <span className="text-sm text-gray-500">{review.date}</span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mb-3 leading-relaxed">{review.comment}</p>
                        {review.location && (
                          <p className="text-xs text-gray-500 mb-3">{review.location}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(review.status)}
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <Checkbox />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">1 2 3 ... 7386</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}