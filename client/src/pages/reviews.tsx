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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Calendar,
  Send,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function Reviews() {
  const [selectedPlatform, setSelectedPlatform] = useState("google");
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReviewId, setSelectedReviewId] = useState(1);
  const [replyText, setReplyText] = useState("");
  
  // Location table sorting
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  // Location data for table
  const locationData = [
    { name: "Boyner Eskişehir Kanatlı", rating: 4.2, reviews: 847, responseRate: 78, sentiment: "Positive" },
    { name: "Boyner İstanbul AVM", rating: 3.8, reviews: 1243, responseRate: 45, sentiment: "Neutral" },
    { name: "Boyner Ankara Kızılay", rating: 4.5, reviews: 692, responseRate: 92, sentiment: "Positive" },
    { name: "Boyner Bursa Kent Meydanı", rating: 3.2, reviews: 528, responseRate: 38, sentiment: "Negative" },
    { name: "Boyner İzmir Konak", rating: 4.1, reviews: 934, responseRate: 67, sentiment: "Positive" },
    { name: "Boyner Adana Optimum", rating: 3.9, reviews: 421, responseRate: 58, sentiment: "Neutral" },
    { name: "Boyner Antalya MarkAntalya", rating: 4.3, reviews: 756, responseRate: 82, sentiment: "Positive" },
    { name: "Boyner Trabzon Forum", rating: 3.6, reviews: 389, responseRate: 55, sentiment: "Neutral" },
    { name: "Boyner Samsun Piazza", rating: 4.0, reviews: 623, responseRate: 71, sentiment: "Positive" },
    { name: "Boyner Gaziantep Forum", rating: 3.4, reviews: 445, responseRate: 42, sentiment: "Negative" },
    { name: "Boyner Kayseri Forum", rating: 4.2, reviews: 567, responseRate: 76, sentiment: "Positive" },
    { name: "Boyner Konya M1", rating: 3.7, reviews: 398, responseRate: 63, sentiment: "Neutral" },
    { name: "Boyner Denizli Forum", rating: 4.4, reviews: 312, responseRate: 88, sentiment: "Positive" },
    { name: "Boyner Mersin Marina", rating: 3.5, reviews: 478, responseRate: 47, sentiment: "Negative" },
    { name: "Boyner Diyarbakır Kay", rating: 3.9, reviews: 234, responseRate: 69, sentiment: "Positive" },
    { name: "Boyner Erzurum Palandöken", rating: 4.1, reviews: 189, responseRate: 74, sentiment: "Positive" },
    { name: "Boyner Malatya Arasta Park", rating: 3.8, reviews: 267, responseRate: 52, sentiment: "Neutral" },
    { name: "Boyner Van 100. Yıl", rating: 3.3, reviews: 156, responseRate: 39, sentiment: "Negative" },
    { name: "Boyner Şanlıurfa Piazza", rating: 4.0, reviews: 298, responseRate: 65, sentiment: "Positive" },
    { name: "Boyner Batman Park", rating: 3.6, reviews: 134, responseRate: 44, sentiment: "Negative" }
  ];

  // Sorting function
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort data
  const sortedLocationData = [...locationData].sort((a: any, b: any) => {
    if (!sortColumn) return 0;
    
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];
    
    if (sortColumn === "name") {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  // Generate star rating display
  const generateStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  // Get response rate color
  const getResponseRateColor = (rate: number) => {
    if (rate >= 70) return "text-green-600";
    if (rate >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Get sentiment badge
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
      case "Neutral":
        return <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>;
      case "Negative":
        return <Badge className="bg-red-100 text-red-800">Negative</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{sentiment}</Badge>;
    }
  };

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
        {/* Summary Section */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
            <h3 className="text-base font-semibold text-foreground">Review Summary</h3>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </div>
          <div className="bg-stone-50 p-6">
            <div className="grid grid-cols-4 gap-6">
              {/* Average Rating */}
              <div className="bg-white rounded-md border border-slate-200 p-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">AVERAGE RATING</div>
                  <div className="flex justify-center mb-2">
                    {getRatingStars(3)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">3.28</div>
                  <div className="text-sm text-gray-500">Out of 5.0</div>
                </div>
              </div>

              {/* Total Reviews */}
              <div className="bg-white rounded-md border border-slate-200 p-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">TOTAL REVIEWS</div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">3,672</div>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+12% vs prev period</span>
                  </div>
                </div>
              </div>

              {/* Unanswered Reviews */}
              <div className="bg-white rounded-md border border-slate-200 p-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-3">UNANSWERED</div>
                  <div className="text-2xl font-bold text-red-600 mb-2">4,708</div>
                  <div className="text-sm text-gray-500 mb-3">Needs attention</div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="text-xs text-gray-600 mb-1">Reply Rate</div>
                    <div className="text-lg font-semibold text-orange-600">62.3%</div>
                  </div>
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="bg-white rounded-md border border-slate-200 p-6">
                <div className="text-sm font-medium text-gray-600 mb-3">SENTIMENT</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">Positive</span>
                    <span className="font-medium text-green-600">58.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Neutral</span>
                    <span className="font-medium text-gray-600">23.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">Negative</span>
                    <span className="font-medium text-red-600">18.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="mx-6 mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-none">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
            <h3 className="text-base font-semibold text-foreground">Rating Distribution</h3>
          </div>
          <div className="bg-stone-50 p-6">
            <div className="bg-white rounded-md border border-slate-200 p-6">
              {/* Column Chart */}
              <div className="relative">
                <div className="flex items-end justify-between gap-8 h-40 mb-4">
                  {[1, 2, 3, 4, 5].map((starCount) => {
                    const rating = ratingBreakdown.find(r => r.stars === starCount);
                    if (!rating) return null;
                    
                    return (
                      <div key={rating.stars} className="flex-1 flex flex-col items-center">
                        {/* Count above bar */}
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          {rating.count.toLocaleString()}
                        </div>
                        
                        {/* Bar */}
                        <div className="w-full flex justify-center">
                          <div 
                            className={`w-16 rounded-t transition-all duration-700 ${
                              rating.stars === 5 ? 'bg-green-600' :
                              rating.stars === 4 ? 'bg-green-400' :
                              rating.stars === 3 ? 'bg-yellow-500' :
                              rating.stars === 2 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              height: `${Math.max((rating.percentage / 25) * 120, 20)}px`,
                              minHeight: '20px'
                            }}
                            data-testid={`rating-column-${rating.stars}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Labels */}
                <div className="flex justify-between gap-8">
                  {[1, 2, 3, 4, 5].map((starCount) => (
                    <div key={starCount} className="flex-1 text-center">
                      <div className="text-sm text-gray-600 font-medium">
                        {starCount} Star{starCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
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
            <div className="grid grid-cols-2 gap-6">
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
              {/* Search */}
              <div className="relative flex-1 max-w-[400px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search reviews..." className="pl-10" />
              </div>

              {/* Filter Bar */}
              <div className="flex items-center gap-3 text-xs">
                {/* Sort By Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Sort By:</span>
                  <Select value="newest" onValueChange={() => {}}>
                    <SelectTrigger className="w-32 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest to Oldest</SelectItem>
                      <SelectItem value="oldest">Oldest to Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Store Set Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Store Set:</span>
                  <Select value="create" onValueChange={() => {}}>
                    <SelectTrigger className="w-28 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create">+Create Store Set</SelectItem>
                      <SelectItem value="istanbul">İstanbul AVM</SelectItem>
                      <SelectItem value="ankara">Ankara Kızılay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Content:</span>
                  <Select value="all" onValueChange={() => {}}>
                    <SelectTrigger className="w-24 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="rating">Rating Only</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Rating:</span>
                  <Select value="all" onValueChange={() => {}}>
                    <SelectTrigger className="w-20 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="3">⭐⭐⭐</SelectItem>
                      <SelectItem value="2">⭐⭐</SelectItem>
                      <SelectItem value="1">⭐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Status:</span>
                  <Select value="all" onValueChange={() => {}}>
                    <SelectTrigger className="w-24 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="answered">Answered</SelectItem>
                      <SelectItem value="unanswered">Unanswered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sentiment Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Sentiment:</span>
                  <Select value="all" onValueChange={() => {}}>
                    <SelectTrigger className="w-20 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700">
                  Clear
                </Button>
              </div>
            </div>

            {/* Split View - Reviews Content */}
            <div className="bg-white rounded-md border border-slate-200 flex" style={{height: '600px'}}>
              {/* Left Panel - Reviews List */}
              <div className="w-1/2 border-r border-slate-200 overflow-y-auto">
                <div className="p-4 border-b border-slate-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <span className="text-sm text-gray-600">Select All</span>
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" size="sm">Bulk Actions ↓</Button>
                      <Button variant="outline" size="sm">Export Reviews ↓</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-0">
                  {reviews.map((review, index) => (
                    <div 
                      key={review.id} 
                      className={`p-4 border-b border-slate-200 cursor-pointer hover:bg-gray-50 ${
                        selectedReviewId === review.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      } ${index === reviews.length - 1 ? 'border-b-0' : ''}`}
                      onClick={() => setSelectedReviewId(review.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox checked={selectedReviewId === review.id} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm">{review.name}</h4>
                            {review.status === "Answered" && (
                              <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">New</Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {review.date && <span>{review.date}</span>}
                            {review.date && <span> · </span>}
                            <span>İyi</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {getRatingStars(review.rating)}
                          </div>
                          <p className="text-gray-700 text-sm line-clamp-2">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel - Review Details & Reply */}
              <div className="w-1/2 flex flex-col">
                {selectedReviewId && (() => {
                  const selectedReview = reviews.find(r => r.id === selectedReviewId);
                  return selectedReview ? (
                    <div className="flex flex-col h-full">
                      {/* Selected Review Header */}
                      <div className="p-4 border-b border-slate-200 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{selectedReview.name}</h3>
                          <span className="text-sm text-gray-500">(Google Business Profile)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{selectedReview.rating}.0</span>
                          {getRatingStars(selectedReview.rating)}
                          <span>{selectedReview.date || 'Recently'}</span>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1 p-4 overflow-y-auto">
                        <div className="mb-6">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                              selectedReview.rating >= 4 ? 'bg-green-500' : 
                              selectedReview.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}>
                              {selectedReview.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{selectedReview.name}</div>
                              <div className="flex items-center gap-1 my-1">
                                {getRatingStars(selectedReview.rating)}
                              </div>
                              <div className={`text-sm mb-2 ${
                                selectedReview.status === "Answered" ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {selectedReview.status || 'Unanswered'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-gray-700 text-sm mb-2">{selectedReview.comment}</p>
                            <p className="text-xs text-gray-500">(Translated by Google)</p>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-4">
                            {selectedReview.comment === "İyi" ? "Good" : 
                             selectedReview.comment === "Güzel" ? "Nice" :
                             selectedReview.comment === "Kötü" ? "Bad" : "Translation available"}
                          </div>
                        </div>

                        {/* Reply Composer */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              B
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Boyner Eskişehir Kanatlı</div>
                              <div className="text-xs text-gray-500">Write a reply</div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex gap-2 mb-2">
                              <Button variant="outline" size="sm" className="text-purple-600 border-purple-600" data-testid="button-reply-ai">
                                Reply with AI
                              </Button>
                              <Button variant="outline" size="sm" className="text-blue-600 border-blue-600" data-testid="button-review-templates">
                                Review Templates
                              </Button>
                            </div>
                            <Textarea
                              placeholder="Write your reply here..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="min-h-[120px] resize-none"
                              data-testid="textarea-reply"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-4 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                            Delete Review
                          </Button>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setReplyText("")}>
                              Clear
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                              <Send className="w-4 h-4" />
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <Select value="10" onValueChange={() => {}}>
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">2 3 4 5 ... 7188</span>
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

          {/* Location Summary Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-6 mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lokasyon Özeti</h2>
              <p className="text-sm text-gray-600">Tüm lokasyonların yorum performansı</p>
            </div>
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <button 
                        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                        onClick={() => handleSort("name")}
                        data-testid="sort-location"
                      >
                        Lokasyon
                        {getSortIcon("name")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                        onClick={() => handleSort("rating")}
                        data-testid="sort-rating"
                      >
                        Ortalama Rating
                        {getSortIcon("rating")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                        onClick={() => handleSort("reviews")}
                        data-testid="sort-reviews"
                      >
                        Toplam Yorum
                        {getSortIcon("reviews")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                        onClick={() => handleSort("responseRate")}
                        data-testid="sort-response-rate"
                      >
                        Cevaplanma Oranı
                        {getSortIcon("responseRate")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
                        onClick={() => handleSort("sentiment")}
                        data-testid="sort-sentiment"
                      >
                        Sentiment
                        {getSortIcon("sentiment")}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLocationData.map((location, index) => (
                    <TableRow 
                      key={location.name} 
                      data-testid={`location-row-${index}`}
                    >
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{location.rating.toFixed(1)}</span>
                          {generateStarRating(location.rating)}
                        </div>
                      </TableCell>
                      <TableCell data-testid={`total-reviews-${index}`}>
                        {location.reviews.toLocaleString()}
                      </TableCell>
                      <TableCell data-testid={`response-rate-${index}`}>
                        <span className={getResponseRateColor(location.responseRate)}>
                          {location.responseRate}%
                        </span>
                      </TableCell>
                      <TableCell data-testid={`sentiment-${index}`}>
                        {getSentimentBadge(location.sentiment)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}