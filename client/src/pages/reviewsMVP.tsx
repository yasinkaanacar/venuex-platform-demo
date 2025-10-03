import { useState, useMemo, useRef, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown,
  MessageSquare,
  MessageSquareReply,
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
  Globe,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Meh,
  Share2,
  Target,
  BookOpen,
  ShoppingBag,
  Bell,
  FileText,
  Settings,
  X,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { SiGoogle, SiFacebook, SiTripadvisor, SiYelp, SiApple, SiAmazon } from 'react-icons/si';
import Header from '@/components/overview/header';

// Platform icon mapping function
const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'google':
      return <SiGoogle className="w-4 h-4 text-blue-600" />;
    case 'facebook':
      return <SiFacebook className="w-4 h-4 text-blue-700" />;
    case 'website':
      return <Globe className="w-4 h-4 text-gray-600" />;
    case 'tripadvisor':
      return <SiTripadvisor className="w-4 h-4 text-green-600" />;
    case 'yelp':
      return <SiYelp className="w-4 h-4 text-red-600" />;
    case 'apple':
      return <SiApple className="w-4 h-4 text-gray-800" />;
    case 'amazon':
      return <SiAmazon className="w-4 h-4 text-orange-500" />;
    default:
      return <Globe className="w-4 h-4 text-gray-600" />;
  }
};

export default function ReviewsMVP() {
  const [activeTab, setActiveTab] = useState("ozet");
  const [dateRange, setDateRange] = useState("30");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("BOY007");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Desktop Filter Bar state
  const [reviewSource, setReviewSource] = useState("locations"); // New Review Source filter
  const [replyStatusFilter, setReplyStatusFilter] = useState("unreplied");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [commentFilter, setCommentFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all"); // New Product filter
  
  // Location Filter Bar state
  const [regionFilter, setRegionFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("Istanbul");
  const [storeSetFilter, setStoreSetFilter] = useState("marmara");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [avgRatingFilter, setAvgRatingFilter] = useState("all");
  const [replyRateFilter, setReplyRateFilter] = useState("all");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationsDateRange, setLocationsDateRange] = useState("30");
  const [inboxFilters, setInboxFilters] = useState({
    source: null,
    rating: null,
    week: null,
    status: null
  });

  // Modal state management
  const [alertSettingsOpen, setAlertSettingsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);

  // Selected review state
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const reviewDetailsRef = useRef<HTMLDivElement>(null);
  const [reviewsCardHeight, setReviewsCardHeight] = useState<number | undefined>(undefined);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Locations table sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Leaderboard sorting state
  const [leaderboardSortBy, setLeaderboardSortBy] = useState<'rating' | 'volume' | 'replyRate'>('rating');
  
  // Period selector state
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  // Effect to sync Reviews card height with Review Details card
  useEffect(() => {
    const updateHeight = () => {
      if (reviewDetailsRef.current) {
        const height = reviewDetailsRef.current.offsetHeight;
        setReviewsCardHeight(height);
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (reviewDetailsRef.current) {
      observer.observe(reviewDetailsRef.current);
    }

    return () => observer.disconnect();
  }, [selectedReviewId, activeTab]); // Re-run when selection or tab changes

  // Handle tab change with scroll
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    if (newTab === "inbox") {
      // Scroll to filter bar when switching to inbox
      setTimeout(() => {
        if (filterBarRef.current) {
          filterBarRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 300);
    }
  };

  // Sorting function for locations table
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sample data for MVP
  const kpiData = {
    totalReviews: 1247,
    averageRating: 4.3,
    responseRate: 85,
    avgResponseTime: "2.5 hours",
    newReviews: 23,
    pendingResponses: 12,
    sentimentIndex: 82
  };

  const openIssuesData = {
    unreplied: 12,
    slaRisk: 8,
    escalated: 3
  };

  // Mock locations data
  const locationsData = [
    { code: "BOY001", name: "Bağdat Caddesi", city: "Istanbul", sublocation: "Kadıköy", reviews: 542, rating: 4.7, replyRate: 85, sentiment: "Positive", topPositive: "Staff Service", topNegative: "Parking" },
    { code: "BOY002", name: "Kanyon AVM", city: "Istanbul", sublocation: "Levent", reviews: 489, rating: 4.6, replyRate: 78, sentiment: "Positive", topPositive: "Product Quality", topNegative: "Wait Time" },
    { code: "BOY003", name: "İstinyePark", city: "Istanbul", sublocation: "Sarıyer", reviews: 456, rating: 4.8, replyRate: 92, sentiment: "Positive", topPositive: "Store Design", topNegative: "Price" },
    { code: "BOY004", name: "Zorlu Center", city: "Istanbul", sublocation: "Beşiktaş", reviews: 423, rating: 4.6, replyRate: 81, sentiment: "Positive", topPositive: "Staff Service", topNegative: "Crowded" },
    { code: "BOY005", name: "Nişantaşı", city: "Istanbul", sublocation: "Şişli", reviews: 398, rating: 4.7, replyRate: 88, sentiment: "Positive", topPositive: "Fashion Selection", topNegative: "Expensive" },
    { code: "BOY006", name: "Akasya AVM", city: "Istanbul", sublocation: "Acıbadem", reviews: 376, rating: 4.6, replyRate: 79, sentiment: "Positive", topPositive: "Cleanliness", topNegative: "Long Queues" },
    { code: "BOY007", name: "Cevahir AVM", city: "Istanbul", sublocation: "Şişli", reviews: 365, rating: 4.7, replyRate: 83, sentiment: "Positive", topPositive: "Variety", topNegative: "Navigation" },
    { code: "BOY008", name: "Emaar AVM", city: "Istanbul", sublocation: "Ümraniye", reviews: 342, rating: 4.6, replyRate: 76, sentiment: "Positive", topPositive: "Modern Design", topNegative: "Accessibility" },
    { code: "BOY009", name: "Ankamall", city: "Ankara", sublocation: "Çankaya", reviews: 325, rating: 4.6, replyRate: 74, sentiment: "Positive", topPositive: "Staff Helpfulness", topNegative: "Limited Stock" },
    { code: "BOY010", name: "Forum İzmir", city: "Izmir", sublocation: "Bornova", reviews: 312, rating: 4.5, replyRate: 71, sentiment: "Positive", topPositive: "Location", topNegative: "Parking Fee" },
    { code: "BOY011", name: "Kent Meydanı", city: "Bursa", sublocation: "Osmangazi", reviews: 298, rating: 4.5, replyRate: 68, sentiment: "Neutral", topPositive: "Product Range", topNegative: "Service Speed" },
    { code: "BOY012", name: "Migros AVM", city: "Antalya", sublocation: "Konyaaltı", reviews: 287, rating: 4.5, replyRate: 72, sentiment: "Positive", topPositive: "Beach Proximity", topNegative: "Tourist Prices" },
    { code: "BOY013", name: "Optimum", city: "Adana", sublocation: "Seyhan", reviews: 276, rating: 4.5, replyRate: 67, sentiment: "Positive", topPositive: "Air Conditioning", topNegative: "Noise Level" },
    { code: "BOY014", name: "Forum Mersin", city: "Mersin", sublocation: "Akdeniz", reviews: 265, rating: 4.6, replyRate: 75, sentiment: "Positive", topPositive: "Sea View", topNegative: "Traffic Access" },
    { code: "BOY015", name: "Sanko Park", city: "Gaziantep", sublocation: "Şahinbey", reviews: 254, rating: 4.5, replyRate: 69, sentiment: "Positive", topPositive: "Local Culture", topNegative: "Language Barrier" },
    { code: "BOY016", name: "Kulesite", city: "Konya", sublocation: "Meram", reviews: 243, rating: 4.4, replyRate: 63, sentiment: "Neutral", topPositive: "Traditional Feel", topNegative: "Old Building" },
    { code: "BOY017", name: "Espark", city: "Eskişehir", sublocation: "Tepebaşı", reviews: 232, rating: 4.5, replyRate: 66, sentiment: "Positive", topPositive: "Student Friendly", topNegative: "Limited Premium" },
    { code: "BOY018", name: "Park AVM", city: "Kayseri", sublocation: "Kocasinan", reviews: 221, rating: 4.4, replyRate: 61, sentiment: "Neutral", topPositive: "Central Location", topNegative: "Outdated Style" },
    { code: "BOY019", name: "Forum Trabzon", city: "Trabzon", sublocation: "Ortahisar", reviews: 210, rating: 4.5, replyRate: 64, sentiment: "Positive", topPositive: "Regional Products", topNegative: "Weather Dependent" },
    { code: "BOY020", name: "Piazza Samsun", city: "Samsun", sublocation: "Atakum", reviews: 198, rating: 4.4, replyRate: 59, sentiment: "Neutral", topPositive: "Coastal Location", topNegative: "Seasonal Crowds" },
    { code: "BOY021", name: "Forum Erzurum", city: "Erzurum", sublocation: "Yakutiye", reviews: 189, rating: 4.1, replyRate: 58, sentiment: "Neutral", topPositive: "Winter Sports", topNegative: "Cold Weather" },
    { code: "BOY022", name: "Arasta Park", city: "Malatya", sublocation: "Battalgazi", reviews: 167, rating: 3.8, replyRate: 52, sentiment: "Negative", topPositive: "Apricot Season", topNegative: "Limited Options" },
    { code: "BOY023", name: "100. Yıl AVM", city: "Van", sublocation: "İpekyolu", reviews: 156, rating: 3.3, replyRate: 39, sentiment: "Negative", topPositive: "Lake View", topNegative: "Remote Location" },
    { code: "BOY024", name: "Piazza Şanlıurfa", city: "Şanlıurfa", sublocation: "Haliliye", reviews: 145, rating: 4.0, replyRate: 55, sentiment: "Neutral", topPositive: "Historical Context", topNegative: "Hot Climate" },
    { code: "BOY025", name: "Forum Diyarbakır", city: "Diyarbakır", sublocation: "Bağlar", reviews: 134, rating: 3.9, replyRate: 48, sentiment: "Neutral", topPositive: "Cultural Heritage", topNegative: "Security Concerns" },
    { code: "BOY026", name: "Kentpark", city: "Denizli", sublocation: "Pamukkale", reviews: 128, rating: 4.4, replyRate: 71, sentiment: "Positive", topPositive: "Thermal Tourism", topNegative: "Tourist Season" },
    { code: "BOY027", name: "Forum Çamlık", city: "Manisa", sublocation: "Yunusemre", reviews: 121, rating: 4.2, replyRate: 62, sentiment: "Positive", topPositive: "Grape Harvest", topNegative: "Agricultural Area" },
    { code: "BOY028", name: "Novada Söke", city: "Aydın", sublocation: "Söke", reviews: 115, rating: 4.0, replyRate: 57, sentiment: "Neutral", topPositive: "Cotton Fields", topNegative: "Rural Setting" },
    { code: "BOY029", name: "Mavera AVM", city: "Muğla", sublocation: "Bodrum", reviews: 108, rating: 4.3, replyRate: 68, sentiment: "Positive", topPositive: "Resort Atmosphere", topNegative: "Seasonal Business" },
    { code: "BOY030", name: "Akçaabat Çarşı", city: "Trabzon", sublocation: "Akçaabat", reviews: 98, rating: 4.1, replyRate: 54, sentiment: "Neutral", topPositive: "Local Cuisine", topNegative: "Transportation" }
  ];

  // Sort the locations data using useMemo for performance
  const sortedLocationsData = useMemo(() => {
    if (!sortField) return locationsData;
    
    return [...locationsData].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'code':
          aValue = a.code;
          bValue = b.code;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'reviews':
          aValue = a.reviews;
          bValue = b.reviews;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'replyRate':
          aValue = a.replyRate;
          bValue = b.replyRate;
          break;
        case 'sentiment':
          aValue = a.sentiment;
          bValue = b.sentiment;
          break;
        case 'city':
          aValue = a.city;
          bValue = b.city;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });
  }, [locationsData, sortField, sortDirection]);

  // Location leaderboard data function (migrated from reviewsX)
  const getLocationLeaderboardData = () => {
    // All mock location data for the leaderboard
    const allLocations = [
      { id: 1, name: "İstinyePark", rating: 4.8, reviewCount: 456, responseRate: 92, trend: "+8%" },
      { id: 2, name: "Bağdat Caddesi", rating: 4.7, reviewCount: 542, responseRate: 85, trend: "+5%" },
      { id: 3, name: "Nişantaşı", rating: 4.7, reviewCount: 398, responseRate: 88, trend: "+3%" },
      { id: 4, name: "Emaar AVM", rating: 4.6, reviewCount: 342, responseRate: 76, trend: "-2%" },
      { id: 5, name: "Trabzon Forum", rating: 4.5, reviewCount: 210, responseRate: 68, trend: "-5%" },
      { id: 6, name: "Samsun Piazza", rating: 4.4, reviewCount: 198, responseRate: 62, trend: "-3%" }
    ];

    // Sort locations based on selected criteria
    const sortedLocations = [...allLocations].sort((a, b) => {
      switch (leaderboardSortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'volume':
          return b.reviewCount - a.reviewCount;
        case 'replyRate':
          return b.responseRate - a.responseRate;
        default:
          return b.rating - a.rating;
      }
    });

    // Split into top performers and needs attention
    const topPerformers = sortedLocations.slice(0, 3);
    const needsAttention = sortedLocations.slice(3, 6);

    return {
      topPerformers,
      needsAttention
    };
  };

  // Get leaderboard data
  const leaderboardData = getLocationLeaderboardData();

  // Themes data for Advantages/Disadvantages
  const themesData = {
    positive: [
      { theme: "Taste", percentage: 91, count: 156, sentiment: "positive" },
      { theme: "Staff", percentage: 87, count: 142, sentiment: "positive" },
      { theme: "Cleanliness", percentage: 84, count: 128, sentiment: "positive" },
      { theme: "Atmosphere", percentage: 79, count: 115, sentiment: "positive" },
      { theme: "Fast Service", percentage: 76, count: 98, sentiment: "positive" }
    ],
    negative: [
      { theme: "Price", percentage: 67, count: 89, sentiment: "negative" },
      { theme: "Waiting Time", percentage: 58, count: 76, sentiment: "negative" },
      { theme: "Parking Issue", percentage: 52, count: 64, sentiment: "negative" },
      { theme: "Noise", percentage: 45, count: 52, sentiment: "negative" },
      { theme: "Portion", percentage: 41, count: 43, sentiment: "negative" }
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
      product: "Running Shoes",
      productSku: "RS-001",
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
      product: "Winter Coat",
      productSku: "WC-045",
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
      product: "Coffee Maker",
      productSku: "CM-123",
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
      product: "Wireless Headphones",
      productSku: "WH-078",
      text: "Product quality was disappointing. Sound quality not as expected.",
      isNew: true
    },
    {
      id: 5,
      platform: "Website",
      rating: 5,
      reviewer: "Selin M.",
      date: "1 day ago",
      location: "Nişantaşı",
      product: "Laptop Bag",
      productSku: "LB-256",
      text: "Excellent product! Very durable and stylish design.",
      isNew: false
    },
    {
      id: 6,
      platform: "Google",
      rating: 4,
      reviewer: "Emre D.",
      date: "30 minutes ago",
      location: "Akasya AVM",
      product: "Smartphone Case",
      productSku: "SC-189",
      text: "Great protection for my phone. Fits perfectly and looks elegant.",
      isNew: true
    },
    {
      id: 7,
      platform: "Facebook",
      rating: 1,
      reviewer: "Fatma A.",
      date: "4 hours ago",
      location: "Cevahir AVM",
      product: "Yoga Mat",
      productSku: "YM-067",
      text: "Very disappointed. The mat is too thin and slippery. Not worth the price.",
      isNew: true
    },
    {
      id: 8,
      platform: "Google",
      rating: 5,
      reviewer: "Ahmet B.",
      date: "6 hours ago",
      location: "Emaar AVM",
      product: "Kitchen Knife",
      productSku: "KK-234",
      text: "Exceptional sharpness and build quality. Professional grade knife.",
      isNew: true
    },
    {
      id: 9,
      platform: "Website",
      rating: 3,
      reviewer: "Deniz C.",
      date: "2 days ago",
      location: "Ankamall",
      product: "Desk Lamp",
      productSku: "DL-145",
      text: "Decent lamp but the brightness adjustment is not smooth.",
      isNew: false
    },
    {
      id: 10,
      platform: "Google",
      rating: 4,
      reviewer: "Pınar E.",
      date: "1 day ago",
      location: "Forum İzmir",
      product: "Bluetooth Speaker",
      productSku: "BS-098",
      text: "Good sound quality for the price. Battery life could be better.",
      isNew: false
    },
    {
      id: 11,
      platform: "Facebook",
      rating: 5,
      reviewer: "Oğuz F.",
      date: "8 hours ago",
      location: "Kent Meydanı",
      product: "Running Shoes",
      productSku: "RS-002",
      text: "Perfect fit and very comfortable for long runs. Highly recommended!",
      isNew: true
    },
    {
      id: 12,
      platform: "Website",
      rating: 2,
      reviewer: "Gül H.",
      date: "3 days ago",
      location: "Migros AVM",
      product: "Coffee Maker",
      productSku: "CM-124",
      text: "Machine stopped working after one week. Poor build quality.",
      isNew: false
    },
    {
      id: 13,
      platform: "Google",
      rating: 4,
      reviewer: "Burak I.",
      date: "12 hours ago",
      location: "Optimum",
      product: "Wireless Headphones",
      productSku: "WH-079",
      text: "Great noise cancellation. Comfortable for extended use.",
      isNew: true
    },
    {
      id: 14,
      platform: "Facebook",
      rating: 3,
      reviewer: "Ebru J.",
      date: "1 day ago",
      location: "Forum Mersin",
      product: "Winter Coat",
      productSku: "WC-046",
      text: "Warm but the zipper feels cheap. Average quality overall.",
      isNew: false
    },
    {
      id: 15,
      platform: "Website",
      rating: 5,
      reviewer: "Kemal K.",
      date: "4 hours ago",
      location: "Sanko Park",
      product: "Laptop Bag",
      productSku: "LB-257",
      text: "Excellent craftsmanship. Perfect size for my 15-inch laptop.",
      isNew: true
    },
    {
      id: 16,
      platform: "Google",
      rating: 1,
      reviewer: "Aylin L.",
      date: "2 days ago",
      location: "Kulesite",
      product: "Smartphone Case",
      productSku: "SC-190",
      text: "Case broke within two days. Very poor quality plastic.",
      isNew: false
    },
    {
      id: 17,
      platform: "Facebook",
      rating: 4,
      reviewer: "Serkan M.",
      date: "7 hours ago",
      location: "Espark",
      product: "Yoga Mat",
      productSku: "YM-068",
      text: "Good thickness and grip. Happy with the purchase.",
      isNew: true
    },
    {
      id: 18,
      platform: "Website",
      rating: 5,
      reviewer: "Nihal N.",
      date: "1 hour ago",
      location: "Park AVM",
      product: "Kitchen Knife",
      productSku: "KK-235",
      text: "Sharp and well-balanced. Great addition to my kitchen tools.",
      isNew: true
    },
    {
      id: 19,
      platform: "Google",
      rating: 2,
      reviewer: "Cem O.",
      date: "3 days ago",
      location: "Forum Trabzon",
      product: "Desk Lamp",
      productSku: "DL-146",
      text: "Light flickers frequently. Not suitable for reading.",
      isNew: false
    },
    {
      id: 20,
      platform: "Facebook",
      rating: 4,
      reviewer: "Elif P.",
      date: "5 hours ago",
      location: "Piazza Samsun",
      product: "Bluetooth Speaker",
      productSku: "BS-099",
      text: "Nice design and decent bass. Worth the money.",
      isNew: true
    },
    {
      id: 21,
      platform: "Website",
      rating: 3,
      reviewer: "Murat Q.",
      date: "2 days ago",
      location: "Forum Erzurum",
      product: "Running Shoes",
      productSku: "RS-003",
      text: "Comfortable but not very durable. Sole started wearing out quickly.",
      isNew: false
    },
    {
      id: 22,
      platform: "Google",
      rating: 5,
      reviewer: "Sevgi R.",
      date: "9 hours ago",
      location: "Arasta Park",
      product: "Coffee Maker",
      productSku: "CM-125",
      text: "Makes perfect coffee every time. Easy to clean and use.",
      isNew: true
    },
    {
      id: 23,
      platform: "Facebook",
      rating: 1,
      reviewer: "Yusuf S.",
      date: "4 days ago",
      location: "100. Yıl AVM",
      product: "Wireless Headphones",
      productSku: "WH-080",
      text: "Connection keeps dropping. Very frustrating experience.",
      isNew: false
    },
    {
      id: 24,
      platform: "Website",
      rating: 4,
      reviewer: "Gamze T.",
      date: "6 hours ago",
      location: "Piazza Şanlıurfa",
      product: "Winter Coat",
      productSku: "WC-047",
      text: "Stylish and warm. Sizing runs a bit large.",
      isNew: true
    },
    {
      id: 25,
      platform: "Google",
      rating: 3,
      reviewer: "İbrahim U.",
      date: "1 day ago",
      location: "Forum Diyarbakır",
      product: "Laptop Bag",
      productSku: "LB-258",
      text: "Functional but not the most comfortable to carry.",
      isNew: false
    },
    {
      id: 26,
      platform: "Facebook",
      rating: 5,
      reviewer: "Zeynep V.",
      date: "3 hours ago",
      location: "Kentpark",
      product: "Smartphone Case",
      productSku: "SC-191",
      text: "Perfect fit and great protection. Love the color options!",
      isNew: true
    },
    {
      id: 27,
      platform: "Website",
      rating: 2,
      reviewer: "Hasan W.",
      date: "2 days ago",
      location: "Forum Çamlık",
      product: "Yoga Mat",
      productSku: "YM-069",
      text: "Mat has a strong chemical smell that won't go away.",
      isNew: false
    },
    {
      id: 28,
      platform: "Google",
      rating: 4,
      reviewer: "Leyla X.",
      date: "10 hours ago",
      location: "Novada Söke",
      product: "Kitchen Knife",
      productSku: "KK-236",
      text: "Good quality steel. Handle could be more ergonomic.",
      isNew: true
    },
    {
      id: 29,
      platform: "Facebook",
      rating: 5,
      reviewer: "Kadir Y.",
      date: "4 hours ago",
      location: "Mavera AVM",
      product: "Desk Lamp",
      productSku: "DL-147",
      text: "Excellent adjustable brightness. Perfect for my home office.",
      isNew: true
    },
    {
      id: 30,
      platform: "Website",
      rating: 3,
      reviewer: "Gizem Z.",
      date: "1 day ago",
      location: "Akçaabat Çarşı",
      product: "Bluetooth Speaker",
      productSku: "BS-100",
      text: "Average sound quality. Good for casual listening.",
      isNew: false
    },
    {
      id: 31,
      platform: "Google",
      rating: 4,
      reviewer: "Tolga A1.",
      date: "2 hours ago",
      location: "Bağdat Caddesi",
      product: "Running Shoes",
      productSku: "RS-004",
      text: "Great for daily workouts. Good arch support.",
      isNew: true
    },
    {
      id: 32,
      platform: "Facebook",
      rating: 1,
      reviewer: "Neslihan B1.",
      date: "5 days ago",
      location: "Kanyon AVM",
      product: "Coffee Maker",
      productSku: "CM-126",
      text: "Leaked water from the first day. Terrible quality control.",
      isNew: false
    },
    {
      id: 33,
      platform: "Website",
      rating: 5,
      reviewer: "Barış C1.",
      date: "8 hours ago",
      location: "İstinyePark",
      product: "Wireless Headphones",
      productSku: "WH-081",
      text: "Outstanding audio quality. Best purchase I've made this year!",
      isNew: true
    },
    {
      id: 34,
      platform: "Google",
      rating: 2,
      reviewer: "Seda D1.",
      date: "3 days ago",
      location: "Zorlu Center",
      product: "Winter Coat",
      productSku: "WC-048",
      text: "Not as warm as advertised. Disappointed with the quality.",
      isNew: false
    },
    {
      id: 35,
      platform: "Facebook",
      rating: 4,
      reviewer: "Erhan E1.",
      date: "1 hour ago",
      location: "Nişantaşı",
      product: "Laptop Bag",
      productSku: "LB-259",
      text: "Well-designed compartments. Good value for money.",
      isNew: true
    },
    {
      id: 36,
      platform: "Website",
      rating: 3,
      reviewer: "Merve F1.",
      date: "6 days ago",
      location: "Akasya AVM",
      product: "Smartphone Case",
      productSku: "SC-192",
      text: "Basic protection but nothing special. Gets the job done.",
      isNew: false
    },
    {
      id: 37,
      platform: "Google",
      rating: 5,
      reviewer: "Ali G1.",
      date: "11 hours ago",
      location: "Cevahir AVM",
      product: "Yoga Mat",
      productSku: "YM-070",
      text: "Perfect thickness and excellent grip. Yoga sessions are much better now.",
      isNew: true
    },
    {
      id: 38,
      platform: "Facebook",
      rating: 4,
      reviewer: "Canan H1.",
      date: "2 days ago",
      location: "Emaar AVM",
      product: "Kitchen Knife",
      productSku: "KK-237",
      text: "Very sharp and reliable. Happy with the purchase.",
      isNew: false
    },
    {
      id: 39,
      platform: "Website",
      rating: 1,
      reviewer: "Özgür I1.",
      date: "4 days ago",
      location: "Ankamall",
      product: "Desk Lamp",
      productSku: "DL-148",
      text: "Broke after one week of use. Very poor construction.",
      isNew: false
    },
    {
      id: 40,
      platform: "Google",
      rating: 5,
      reviewer: "Didem J1.",
      date: "7 hours ago",
      location: "Forum İzmir",
      product: "Bluetooth Speaker",
      productSku: "BS-101",
      text: "Amazing sound quality! Perfect for parties and outdoor activities.",
      isNew: true
    }
  ];

  // Mock contextual data for locations and products
  const locationContextData: { [key: string]: { overallRating: number; totalReviews: number; topNegativeTheme: string } } = {
    "Bağdat Caddesi": { overallRating: 4.2, totalReviews: 287, topNegativeTheme: "Parking Issues" },
    "Kanyon AVM": { overallRating: 3.8, totalReviews: 412, topNegativeTheme: "Long Wait Times" },
    "İstinyePark": { overallRating: 4.1, totalReviews: 356, topNegativeTheme: "Staff Attitude" },
    "Zorlu Center": { overallRating: 3.9, totalReviews: 298, topNegativeTheme: "Product Availability" },
    "Nişantaşı": { overallRating: 4.5, totalReviews: 189, topNegativeTheme: "Pricing" },
    "Akasya AVM": { overallRating: 3.7, totalReviews: 223, topNegativeTheme: "Store Layout" },
    "Cevahir AVM": { overallRating: 3.6, totalReviews: 445, topNegativeTheme: "Crowd Management" },
    "Emaar AVM": { overallRating: 4.0, totalReviews: 312, topNegativeTheme: "Product Quality" },
    "Ankamall": { overallRating: 3.5, totalReviews: 156, topNegativeTheme: "Staff Attitude" },
    "Forum İzmir": { overallRating: 3.9, totalReviews: 278, topNegativeTheme: "Delivery Times" },
    "Kent Meydanı": { overallRating: 3.8, totalReviews: 167, topNegativeTheme: "Product Selection" },
    "Migros AVM": { overallRating: 3.4, totalReviews: 134, topNegativeTheme: "Service Speed" },
    "Optimum": { overallRating: 4.2, totalReviews: 389, topNegativeTheme: "Parking Issues" },
    "Forum Mersin": { overallRating: 3.7, totalReviews: 145, topNegativeTheme: "Staff Training" },
    "Sanko Park": { overallRating: 3.9, totalReviews: 198, topNegativeTheme: "Product Availability" },
    "Kulesite": { overallRating: 3.3, totalReviews: 112, topNegativeTheme: "Accessibility" },
    "Espark": { overallRating: 3.8, totalReviews: 156, topNegativeTheme: "Maintenance" },
    "Park AVM": { overallRating: 4.0, totalReviews: 201, topNegativeTheme: "Parking Fees" },
    "Forum Trabzon": { overallRating: 3.6, totalReviews: 178, topNegativeTheme: "Weather Protection" },
    "Piazza Samsun": { overallRating: 3.9, totalReviews: 189, topNegativeTheme: "Food Court" }
  };

  const productContextData: { [key: string]: { overallRating: number; topNegativeTheme: string; sku: string } } = {
    "Running Shoes": { overallRating: 4.3, topNegativeTheme: "Sizing Issues", sku: "RS-001" },
    "Winter Coat": { overallRating: 3.8, topNegativeTheme: "Zipper Quality", sku: "WC-045" },
    "Coffee Maker": { overallRating: 3.2, topNegativeTheme: "Build Quality", sku: "CM-123" },
    "Wireless Headphones": { overallRating: 4.1, topNegativeTheme: "Connection Issues", sku: "WH-078" },
    "Laptop Bag": { overallRating: 4.4, topNegativeTheme: "Strap Durability", sku: "LB-256" },
    "Smartphone Case": { overallRating: 3.9, topNegativeTheme: "Material Quality", sku: "SC-189" },
    "Yoga Mat": { overallRating: 3.6, topNegativeTheme: "Thickness", sku: "YM-067" },
    "Kitchen Knife": { overallRating: 4.2, topNegativeTheme: "Handle Comfort", sku: "KK-234" },
    "Desk Lamp": { overallRating: 3.7, topNegativeTheme: "Brightness Control", sku: "DL-145" },
    "Bluetooth Speaker": { overallRating: 4.0, topNegativeTheme: "Battery Life", sku: "BS-098" }
  };

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
    <div className="min-h-screen bg-[#ffffff]">
      <Header title="Reviews" />
      <div className="px-6 py-6 bg-[#ffffff]">
        

        {/* Global Settings Header */}
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-2 border-gray-300 bg-[#e7e5e4] hover:bg-gray-50 hover:border-gray-400 shadow-sm"
              onClick={() => setAlertSettingsOpen(true)}
            >
              <Bell className="w-4 h-4 mr-2" />
              Alert Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-sm"
              onClick={() => setTemplatesOpen(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Review Templates
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-sm"
              onClick={() => setAiSettingsOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              AI Settings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="h-12 items-center justify-center rounded-none p-0 text-muted-foreground grid w-full grid-cols-3 mb-6 bg-transparent border-b border-gray-200">
            <TabsTrigger 
              value="ozet" 
              data-testid="tab-ozet"
              className="px-6 py-3 text-base rounded-none border-b-2 border-transparent transition-all duration-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent hover:text-gray-700 hover:border-gray-300 relative font-semibold"
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="inbox" 
              data-testid="tab-inbox"
              className="px-6 py-3 text-base rounded-none border-b-2 border-transparent transition-all duration-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent hover:text-gray-700 hover:border-gray-300 relative font-semibold"
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              Inbox
            </TabsTrigger>
            <TabsTrigger 
              value="locations" 
              data-testid="tab-locations"
              className="px-6 py-3 text-base rounded-none border-b-2 border-transparent transition-all duration-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent hover:text-gray-700 hover:border-gray-300 relative font-semibold"
            >
              <MapPin className="w-5 h-5 mr-3" />
              Locations
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="ozet" className="space-y-6">
            {/* Date Range and Filters */}
            <div className="flex justify-end items-center mb-4 gap-3">
              {/* Store Set Filter */}
              <Select value={storeSetFilter} onValueChange={setStoreSetFilter}>
                <SelectTrigger 
                  className="h-10 w-48 border-gray-200 rounded-md bg-[#f9fafb]"
                  data-testid="select-store-set"
                >
                  <SelectValue placeholder="Store Set" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Store Sets</SelectItem>
                  <SelectItem value="marmara">Marmara Region</SelectItem>
                  <SelectItem value="BOY">BOY</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>

              {/* City Filter */}
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger 
                  className="h-10 w-40 border-gray-200 rounded-md bg-[#f9fafb]"
                  data-testid="select-city"
                >
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Istanbul">İstanbul</SelectItem>
                  <SelectItem value="Ankara">Ankara</SelectItem>
                  <SelectItem value="Izmir">İzmir</SelectItem>
                  <SelectItem value="Bursa">Bursa</SelectItem>
                  <SelectItem value="Antalya">Antalya</SelectItem>
                  <SelectItem value="Adana">Adana</SelectItem>
                  <SelectItem value="Mersin">Mersin</SelectItem>
                  <SelectItem value="Gaziantep">Gaziantep</SelectItem>
                  <SelectItem value="Konya">Konya</SelectItem>
                  <SelectItem value="Eskişehir">Eskişehir</SelectItem>
                  <SelectItem value="Kayseri">Kayseri</SelectItem>
                  <SelectItem value="Trabzon">Trabzon</SelectItem>
                  <SelectItem value="Samsun">Samsun</SelectItem>
                  <SelectItem value="Erzurum">Erzurum</SelectItem>
                  <SelectItem value="Malatya">Malatya</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Şanlıurfa">Şanlıurfa</SelectItem>
                  <SelectItem value="Diyarbakır">Diyarbakır</SelectItem>
                  <SelectItem value="Denizli">Denizli</SelectItem>
                  <SelectItem value="Manisa">Manisa</SelectItem>
                  <SelectItem value="Aydın">Aydın</SelectItem>
                  <SelectItem value="Muğla">Muğla</SelectItem>
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger 
                  className="h-10 w-48 border-gray-200 rounded-md bg-[#f9fafb]"
                  data-testid="select-location"
                >
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locationsData.map((location) => (
                    <SelectItem key={location.code} value={location.code}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range Selector */}
              <button 
                data-testid="button-date-picker"
                className="h-10 border border-gray-200 focus:border-gray-300 w-40 pl-3 pr-10 rounded-md text-sm appearance-none bg-no-repeat bg-right text-left"
                style={{ 
                  backgroundColor: '#f9fafb',
                  backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0ibTQgNiA0IDQgNC00IiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==")',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '16px 16px'
                }}
              >
                Last 30 Days
              </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Average Rating Card */}
              <Card className="rounded-lg border text-card-foreground shadow-sm cursor-pointer hover:shadow-md transition-shadow bg-[#f9fafb]" data-testid="card-average-rating">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Average Rating</CardTitle>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Total Review</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        <div className="text-4xl font-bold text-gray-900">{kpiData.averageRating}</div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">+0.2 (3.1%)</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-8 h-8 text-blue-500" />
                        <div className="text-4xl font-bold text-gray-900">1247</div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">+89 (7.7%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[
                      { stars: 5, percentage: 45, count: 561, fillColor: 'bg-green-500' },
                      { stars: 4, percentage: 28, count: 349, fillColor: 'bg-blue-500' },
                      { stars: 3, percentage: 15, count: 187, fillColor: 'bg-yellow-500' },
                      { stars: 2, percentage: 8, count: 100, fillColor: 'bg-orange-500' },
                      { stars: 1, percentage: 4, count: 50, fillColor: 'bg-red-500' }
                    ].map((rating) => (
                      <div 
                        key={rating.stars} 
                        className="flex items-center gap-3 relative group cursor-pointer"
                        data-testid={`rating-${rating.stars}-star`}
                      >
                        <span className="text-sm font-medium w-2">{rating.stars}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div 
                            className={`${rating.fillColor} h-2 rounded-full`}
                            style={{ width: `${rating.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">{rating.percentage}%</span>
                        
                        {/* Tooltip */}
                        <div className="absolute left-0 bottom-full mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="font-semibold mb-1">{rating.stars}-Star Reviews</div>
                          <div>• Make up {rating.percentage}% of all reviews</div>
                          <div>• {rating.count} reviews total</div>
                          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Review Volume Card */}
              <Card className="rounded-lg border text-card-foreground shadow-sm cursor-pointer hover:shadow-md transition-shadow bg-[#f9fafb]" data-testid="card-review-volume">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="tracking-tight text-[#111827] font-semibold text-[18px]">Response Rate</CardTitle>
                    </div>
                    <div>
                      <CardTitle className="tracking-tight text-[#111827] font-semibold text-[18px]">Unanswered</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Reply className="w-8 h-8 text-blue-500" />
                        <div className="text-4xl font-bold text-gray-900">96%</div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">+2.1%</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-8 h-8 text-orange-500" />
                        <div className="text-4xl font-bold text-gray-900">50</div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">-12 (19%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Response Rate by Star Rating */}
                  <div className="space-y-2">
                    {[
                      { stars: 5, percentage: 45, fillColor: 'bg-green-600' },
                      { stars: 4, percentage: 72, fillColor: 'bg-blue-600' },
                      { stars: 3, percentage: 85, fillColor: 'bg-yellow-600' },
                      { stars: 2, percentage: 94, fillColor: 'bg-orange-600' },
                      { stars: 1, percentage: 98, fillColor: 'bg-red-600' }
                    ].map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-2">{rating.stars}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div 
                            className={`${rating.fillColor} h-2 rounded-full`}
                            style={{ width: `${rating.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">{rating.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Analysis Card */}
              <Card className="rounded-lg border text-card-foreground shadow-sm cursor-pointer hover:shadow-md transition-shadow bg-[#f9fafb] h-full flex flex-col" data-testid="card-sentiment">
                <CardHeader className="pb-3">
                  <CardTitle className="tracking-tight text-[#111827] font-semibold text-[18px]">Review Sentiment</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center flex-1">
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <ThumbsUp className="w-10 h-10 text-green-500" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">68%</div>
                      <div className="text-sm text-gray-600 mb-1">Positive</div>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">+3.2%</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <Meh className="w-10 h-10 text-gray-500" />
                      </div>
                      <div className="text-3xl font-bold text-gray-600 mb-2">24%</div>
                      <div className="text-sm text-gray-600 mb-1">Neutral</div>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingDown className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">-1.8%</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <ThumbsDown className="w-10 h-10 text-red-500" />
                      </div>
                      <div className="text-3xl font-bold text-red-600 mb-2">8%</div>
                      <div className="text-sm text-gray-600 mb-1">Negative</div>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingDown className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">-1.4%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* Weekly Summary - Advantages / Disadvantages Card */}
            <Card className="bg-[#f9fafb]">
              <CardHeader className="pb-4 relative">
                <Sparkles className="absolute top-4 right-4 w-5 h-5 text-blue-500" />
                <CardTitle className="text-2xl font-semibold">Weekly Summary - Advantages / Disadvantages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Advantages Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-700">Advantages</h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">Most positive themes</p>
                    <div className="space-y-3">
                      {themesData.positive.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{item.theme}</span>
                            <div className="flex items-center gap-2 text-xs text-green-600">
                              <span>{item.percentage}%</span>
                              <span className="text-gray-500">({item.count})</span>
                            </div>
                          </div>
                          <div className="w-full bg-[#f9fafb] rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${(item.count / themesData.positive[0].count) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disadvantages Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <h3 className="text-lg font-semibold text-red-700">Disadvantages</h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">Most negative themes</p>
                    <div className="space-y-3">
                      {themesData.negative.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{item.theme}</span>
                            <div className="flex items-center gap-2 text-xs text-red-600">
                              <span>{item.percentage}%</span>
                              <span className="text-gray-500">({item.count})</span>
                            </div>
                          </div>
                          <div className="w-full bg-[#f9fafb] rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${(item.count / themesData.negative[0].count) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Leaderboard */}
            <Card className="bg-[#f9fafb]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Location Leaderboard</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
                    <Select value={leaderboardSortBy} onValueChange={(value) => setLeaderboardSortBy(value as 'rating' | 'volume' | 'replyRate')}>
                      <SelectTrigger className="w-40 border-gray-300 rounded-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="volume">Volume</SelectItem>
                        <SelectItem value="replyRate">Reply Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Top Performers
                    </h4>
                    <div className="space-y-3">
                      {leaderboardData.topPerformers.map((location, index) => (
                        <div key={location.id} className="p-3 bg-[#f9fafb] border border-green-200 rounded-lg hover:bg-[#f9fafb] cursor-pointer transition-colors" onClick={() => handleTabChange("locations")}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-600">#{index + 1}</span>
                              <span className="font-medium text-sm">{location.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                              <ArrowUp className="w-3 h-3" />
                              <span className="text-xs">{location.trend}</span>
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
                      {leaderboardData.needsAttention.map((location, index) => (
                        <div key={location.id} className="p-3 bg-[#f9fafb] border border-red-200 rounded-lg hover:bg-[#f9fafb] cursor-pointer transition-colors" onClick={() => handleTabChange("locations")}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-red-600">#{index + 1}</span>
                              <span className="font-medium text-sm">{location.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-red-600">
                              <ArrowDown className="w-3 h-3" />
                              <span className="text-xs">{location.trend}</span>
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
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => handleTabChange("locations")}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View All Locations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="space-y-6">
            

            {/* Desktop Filter Bar */}
            <Card className="border-gray-200 bg-[#f9fafb]" ref={filterBarRef}>
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
                            : "bg-[#f9fafb] text-gray-700 hover:bg-[#f9fafb]"
                        }`}
                        onClick={() => setReviewSource("locations")}
                      >
                        Locations
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                          reviewSource === "products" 
                            ? "bg-slate-800 text-white" 
                            : "bg-[#f9fafb] text-gray-700 hover:bg-[#f9fafb]"
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
                            <SelectItem key={location.code} value={location.code}>
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
                          <SelectItem value="running-shoes">Running Shoes</SelectItem>
                          <SelectItem value="winter-coat">Winter Coat</SelectItem>
                          <SelectItem value="coffee-maker">Coffee Maker</SelectItem>
                          <SelectItem value="wireless-headphones">Wireless Headphones</SelectItem>
                          <SelectItem value="smartphone-case">Smartphone Case</SelectItem>
                          <SelectItem value="laptop-bag">Laptop Bag</SelectItem>
                          <SelectItem value="yoga-mat">Yoga Mat</SelectItem>
                          <SelectItem value="kitchen-knife">Kitchen Knife</SelectItem>
                          <SelectItem value="desk-lamp">Desk Lamp</SelectItem>
                          <SelectItem value="bluetooth-speaker">Bluetooth Speaker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Reply Status - Pill Style Buttons */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          replyStatusFilter === "unreplied" 
                            ? "bg-slate-800 text-white" 
                            : "bg-[#f9fafb] text-gray-700 hover:bg-[#f9fafb]"
                        }`}
                        onClick={() => setReplyStatusFilter("unreplied")}
                      >
                        Unreplied
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                          replyStatusFilter === "replied" 
                            ? "bg-slate-800 text-white" 
                            : "bg-[#f9fafb] text-gray-700 hover:bg-[#f9fafb]"
                        }`}
                        onClick={() => setReplyStatusFilter("replied")}
                      >
                        Replied
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                          replyStatusFilter === "all" 
                            ? "bg-slate-800 text-white" 
                            : "bg-[#f9fafb] text-gray-700 hover:bg-[#f9fafb]"
                        }`}
                        onClick={() => setReplyStatusFilter("all")}
                      >
                        All
                      </button>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Rating:</label>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger className="w-36 border-gray-300 rounded-md">
                        <SelectValue placeholder="All Ratings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="1">1 Star ★</SelectItem>
                        <SelectItem value="2">2 Stars ★★</SelectItem>
                        <SelectItem value="3">3 Stars ★★★</SelectItem>
                        <SelectItem value="4">4 Stars ★★★★</SelectItem>
                        <SelectItem value="5">5 Stars ★★★★★</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Order */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort:</label>
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          sortOrder === "latest" 
                            ? "bg-slate-800 text-white" 
                            : "bg-[#f9fafb] text-gray-700 hover:bg-[#f9fafb]"
                        }`}
                        onClick={() => setSortOrder("latest")}
                      >
                        Latest
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                          sortOrder === "oldest" 
                            ? "bg-slate-800 text-white" 
                            : "bg-[#f9fafb] text-gray-700 hover:bg-[#f9fafb]"
                        }`}
                        onClick={() => setSortOrder("oldest")}
                      >
                        Oldest
                      </button>
                    </div>
                  </div>

                  {/* Select By Comment Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select By Comment:</label>
                    <Select value={commentFilter} onValueChange={setCommentFilter}>
                      <SelectTrigger className="w-40 border-gray-300 rounded-md">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="rating-only">Rating Only</SelectItem>
                        <SelectItem value="with-comment">With Comment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Theme Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Theme:</label>
                    <Select value={themeFilter} onValueChange={setThemeFilter}>
                      <SelectTrigger className="w-40 border-gray-300 rounded-md">
                        <SelectValue placeholder="All Themes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Themes</SelectItem>
                        <SelectItem value="staff-service">Staff Service</SelectItem>
                        <SelectItem value="product-quality">Product Quality</SelectItem>
                        <SelectItem value="store-design">Store Design</SelectItem>
                        <SelectItem value="cleanliness">Cleanliness</SelectItem>
                        <SelectItem value="pricing">Pricing</SelectItem>
                        <SelectItem value="wait-time">Wait Time</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Store Set Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Store Set:</label>
                    <Select value={storeSetFilter} onValueChange={setStoreSetFilter}>
                      <SelectTrigger className="w-40 border-gray-300 rounded-md">
                        <SelectValue placeholder="All Store Sets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Store Sets</SelectItem>
                        <SelectItem value="smr">SMR</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Active Filters Display */}
            {(inboxFilters.source || inboxFilters.rating || inboxFilters.week || inboxFilters.status) && (
              <div className="flex items-center gap-2 p-3 bg-[#f9fafb] rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                {inboxFilters.source && (
                  <Badge variant="secondary" className="bg-[#f9fafb] text-blue-800">
                    Source: {inboxFilters.source}
                    <button 
                      onClick={() => setInboxFilters({...inboxFilters, source: null})}
                      className="ml-1 hover:bg-[#f9fafb] rounded-full p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {inboxFilters.rating && (
                  <Badge variant="secondary" className="bg-[#f9fafb] text-blue-800">
                    Rating: {inboxFilters.rating}★
                    <button 
                      onClick={() => setInboxFilters({...inboxFilters, rating: null})}
                      className="ml-1 hover:bg-[#f9fafb] rounded-full p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {inboxFilters.week && (
                  <Badge variant="secondary" className="bg-[#f9fafb] text-blue-800">
                    Week: {inboxFilters.week}
                    <button 
                      onClick={() => setInboxFilters({...inboxFilters, week: null})}
                      className="ml-1 hover:bg-[#f9fafb] rounded-full p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                {inboxFilters.status && (
                  <Badge variant="secondary" className="bg-[#f9fafb] text-blue-800">
                    Status: {inboxFilters.status}
                    <button 
                      onClick={() => setInboxFilters({...inboxFilters, status: null})}
                      className="ml-1 hover:bg-[#f9fafb] rounded-full p-0.5"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
              </div>
            )}

            <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 3fr' }}>
              {/* Review List */}
              <div className="col-span-1">
                <Card className="bg-[#f9fafb] flex flex-col h-[600px]">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle className="text-base">Reviews ({recentReviews.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden">
                    <div className="space-y-1 h-full overflow-y-auto">
                      {recentReviews.filter(review => {
                        if (inboxFilters.source && review.platform !== inboxFilters.source) return false;
                        if (inboxFilters.rating && review.rating !== inboxFilters.rating) return false;
                        if (ratingFilter !== "all" && review.rating !== parseInt(ratingFilter)) return false;
                        if (commentFilter !== "all") {
                          if (commentFilter === "rating-only" && review.text.length > 50) return false;
                          if (commentFilter === "with-comment" && review.text.length <= 50) return false;
                        }
                        if (inboxFilters.status) {
                          // Add status filtering logic here
                        }
                        return true;
                      }).sort((a, b) => {
                        // Sort by date based on sortOrder
                        const parseDate = (dateStr: string) => {
                          if (dateStr.includes('hours ago') || dateStr.includes('minutes ago') || dateStr.includes('hour ago') || dateStr.includes('minute ago')) {
                            const hours = parseInt(dateStr) || 0;
                            return new Date(Date.now() - hours * 60 * 60 * 1000).getTime();
                          }
                          if (dateStr.includes('days ago') || dateStr.includes('day ago')) {
                            const days = parseInt(dateStr) || 0;
                            return new Date(Date.now() - days * 24 * 60 * 60 * 1000).getTime();
                          }
                          return new Date(dateStr).getTime();
                        };
                        
                        const dateA = parseDate(a.date);
                        const dateB = parseDate(b.date);
                        return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
                      }).slice(0, 15).map((review) => (
                        <div 
                          key={review.id} 
                          className={`p-4 border-b hover:bg-[#f9fafb] cursor-pointer transition-colors relative ${
                            review.isNew ? 'bg-[#f9fafb] border-l-4 border-l-blue-500' : ''
                          } ${
                            selectedReviewId === review.id ? 'bg-[#f9fafb] border-l-4 border-l-blue-600' : ''
                          }`}
                          onClick={() => setSelectedReviewId(review.id)}
                        >
                          {/* Platform Icon - Top Right */}
                          <div className="absolute top-3 right-3">
                            {getPlatformIcon(review.platform)}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            {review.isNew && <span className="text-xs px-2 py-1 text-white font-medium rounded-sm" style={{ backgroundColor: '#25c55f' }}>NEW</span>}
                          </div>
                          <div className="font-medium text-sm mb-1">{review.reviewer}</div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-1 whitespace-nowrap">
                            {reviewSource === "locations" ? (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {review.location}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" />
                                {review.product} ({review.productSku})
                              </span>
                            )}
                            <span className="flex items-center gap-1 ml-3">
                              <Calendar className="w-3 h-3" />
                              <span>{review.date}</span>
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 line-clamp-2">{review.text}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Review Detail & Reply Pane */}
              <div className="col-span-1">
                <Card className="bg-[#f9fafb] h-[600px] flex flex-col" ref={reviewDetailsRef}>
                  <CardHeader className="flex-shrink-0">
                    <CardTitle className="text-base">Review Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 overflow-y-auto">
                    {/* Selected Review Display */}
                    {(() => {
                      const selectedReview = selectedReviewId 
                        ? recentReviews.find(r => r.id === selectedReviewId) 
                        : recentReviews[0];
                      
                      if (!selectedReview) {
                        return (
                          <div className="border rounded-lg p-4 bg-[#f9fafb] text-center text-gray-500">
                            Select a review from the list to view details
                          </div>
                        );
                      }

                      return (
                        <div className="border rounded-lg p-4 bg-[#f9fafb]">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < selectedReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">{selectedReview.reviewer}</span>
                            <span className="text-sm text-gray-500">
                              {reviewSource === "locations" ? (
                                <span className="inline-flex items-center gap-1 ml-3">
                                  <MapPin className="w-3 h-3" />
                                  {selectedReview.location}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 ml-1">
                                  <ShoppingBag className="w-3 h-3" />
                                  {selectedReview.product} ({selectedReview.productSku})
                                </span>
                              )}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500 ml-3">
                              <Calendar className="w-3 h-3" />
                              <span>{selectedReview.date}</span>
                            </span>
                          </div>
                          <p className="text-gray-700">{selectedReview.text}</p>
                        </div>
                      );
                    })()}

                    {/* Contextual Snippet */}
                    {(() => {
                      const selectedReview = selectedReviewId 
                        ? recentReviews.find(r => r.id === selectedReviewId) 
                        : recentReviews[0];
                      
                      if (!selectedReview) return null;

                      return (
                        <div className="border-0 rounded-lg bg-slate-500 p-3 w-fit">
                          {reviewSource === "locations" ? (
                            // Location Snapshot
                            (<div>
                              <h4 className="font-medium text-white mb-1 flex items-center gap-2 text-sm">
                                <MapPin className="w-3 h-3 text-white" />
                                {selectedReview.location}
                              </h4>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-5">
                                  <span className="text-sm text-gray-300">Overall Rating:</span>
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-white text-sm">
                                      ★ {locationContextData[selectedReview.location]?.overallRating || 4.0}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between gap-5">
                                  <span className="text-sm text-gray-300">Total Reviews:</span>
                                  <span className="font-medium text-white text-sm">
                                    {locationContextData[selectedReview.location]?.totalReviews || 150} Reviews
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-5">
                                  <span className="text-sm text-gray-300">Top Issue:</span>
                                  <span className="font-medium text-white text-sm">
                                    {locationContextData[selectedReview.location]?.topNegativeTheme || "Staff Attitude"}
                                  </span>
                                </div>
                              </div>
                            </div>)
                          ) : (
                            // Product Snapshot
                            (<div>
                              <h4 className="font-medium text-white mb-1 flex items-center gap-2 text-sm">
                                <ShoppingBag className="w-3 h-3 text-white" />
                                {selectedReview.product}
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between gap-5">
                                    <span className="text-sm text-gray-300">SKU / ID:</span>
                                    <span className="font-medium text-white text-sm">
                                      {productContextData[selectedReview.product]?.sku || selectedReview.productSku}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between gap-5">
                                    <span className="text-sm text-gray-300">Overall Rating:</span>
                                    <span className="font-medium text-white text-sm">
                                      ★ {productContextData[selectedReview.product]?.overallRating || 4.0}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between gap-5">
                                    <span className="text-sm text-gray-300">Top Issue:</span>
                                    <span className="font-medium text-white text-sm">
                                      {productContextData[selectedReview.product]?.topNegativeTheme || "Quality"}
                                    </span>
                                  </div>
                                  <div className="w-8 h-8 bg-slate-600 rounded border flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-gray-300" />
                                  </div>
                                </div>
                              </div>
                            </div>)
                          )}
                        </div>
                      );
                    })()}

                    {/* Reply Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mt-6 pt-4">
                        <h4 className="font-medium">Write Reply</h4>
                        <div className="flex gap-2">
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
                      
                      <Textarea
                        placeholder="Write your reply here..."
                        className="min-h-[100px]"
                      />
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Save Draft</Button>
                        <Button>
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            {/* Date Range Selector for Locations */}
            <div className="flex justify-end mb-4">
              <div className="w-fit">
                <button 
                  data-testid="button-locations-date-picker"
                  className="border border-gray-200 focus:border-gray-300 w-40 pl-3 pr-10 py-2 rounded-md text-sm appearance-none bg-no-repeat bg-right text-left"
                  style={{ 
                    backgroundColor: '#f9fafb',
                    backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0ibTQgNiA0IDQgNC00IiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==")',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '16px 16px'
                  }}
                >
                  Last 30 Days
                </button>
              </div>
            </div>

            {/* Location Filter Bar */}
            <Card className="border-gray-200 bg-[#f9fafb]">
              <CardContent className="p-4">
                <div className="flex items-center gap-6">
                  {/* Geographic Hierarchy */}
                  <div className="flex items-center gap-4">
                    {/* Region Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Region:</label>
                      <Select value={regionFilter} onValueChange={(value) => {
                        setRegionFilter(value);
                        setCityFilter("all"); // Reset city when region changes
                      }}>
                        <SelectTrigger className="w-40 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Regions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="marmara">Marmara Region</SelectItem>
                          <SelectItem value="aegean">Aegean Region</SelectItem>
                          <SelectItem value="central">Central Anatolia</SelectItem>
                          <SelectItem value="mediterranean">Mediterranean Region</SelectItem>
                          <SelectItem value="blacksea">Black Sea Region</SelectItem>
                          <SelectItem value="eastern">Eastern Anatolia</SelectItem>
                          <SelectItem value="southeastern">Southeastern Anatolia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">City:</label>
                      <Select value={cityFilter} onValueChange={setCityFilter}>
                        <SelectTrigger className="w-36 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          {regionFilter === "all" || regionFilter === "marmara" ? (
                            <>
                              <SelectItem value="istanbul">Istanbul</SelectItem>
                              <SelectItem value="bursa">Bursa</SelectItem>
                            </>
                          ) : null}
                          {regionFilter === "all" || regionFilter === "aegean" ? (
                            <>
                              <SelectItem value="izmir">Izmir</SelectItem>
                              <SelectItem value="manisa">Manisa</SelectItem>
                              <SelectItem value="aydin">Aydın</SelectItem>
                              <SelectItem value="mugla">Muğla</SelectItem>
                              <SelectItem value="denizli">Denizli</SelectItem>
                            </>
                          ) : null}
                          {regionFilter === "all" || regionFilter === "central" ? (
                            <>
                              <SelectItem value="ankara">Ankara</SelectItem>
                              <SelectItem value="konya">Konya</SelectItem>
                              <SelectItem value="eskisehir">Eskişehir</SelectItem>
                              <SelectItem value="kayseri">Kayseri</SelectItem>
                            </>
                          ) : null}
                          {regionFilter === "all" || regionFilter === "mediterranean" ? (
                            <>
                              <SelectItem value="antalya">Antalya</SelectItem>
                              <SelectItem value="adana">Adana</SelectItem>
                              <SelectItem value="mersin">Mersin</SelectItem>
                            </>
                          ) : null}
                          {regionFilter === "all" || regionFilter === "blacksea" ? (
                            <>
                              <SelectItem value="trabzon">Trabzon</SelectItem>
                              <SelectItem value="samsun">Samsun</SelectItem>
                            </>
                          ) : null}
                          {regionFilter === "all" || regionFilter === "eastern" ? (
                            <SelectItem value="erzurum">Erzurum</SelectItem>
                          ) : null}
                          {regionFilter === "all" || regionFilter === "southeastern" ? (
                            <>
                              <SelectItem value="gaziantep">Gaziantep</SelectItem>
                              <SelectItem value="sanliurfa">Şanlıurfa</SelectItem>
                              <SelectItem value="diyarbakir">Diyarbakır</SelectItem>
                              <SelectItem value="van">Van</SelectItem>
                              <SelectItem value="malatya">Malatya</SelectItem>
                            </>
                          ) : null}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Store Set Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Store Set:</label>
                      <Select value={storeSetFilter} onValueChange={setStoreSetFilter}>
                        <SelectTrigger className="w-40 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Store Sets" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Store Sets</SelectItem>
                          <SelectItem value="smr">SMR</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="regional">Regional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sentiment Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sentiment:</label>
                      <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                        <SelectTrigger className="w-40 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Sentiments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sentiments</SelectItem>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="flex items-center gap-4">
                    {/* Average Rating Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Avg. Rating:</label>
                      <Select value={avgRatingFilter} onValueChange={setAvgRatingFilter}>
                        <SelectTrigger className="w-44 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="excellent">Excellent (4.5+ ★)</SelectItem>
                          <SelectItem value="good">Good (4.0 - 4.4 ★)</SelectItem>
                          <SelectItem value="average">Average (3.5 - 3.9 ★)</SelectItem>
                          <SelectItem value="poor">Poor (&lt; 3.5 ★)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reply Rate Filter */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Reply Rate:</label>
                      <Select value={replyRateFilter} onValueChange={setReplyRateFilter}>
                        <SelectTrigger className="w-48 border-gray-300 rounded-md">
                          <SelectValue placeholder="All Reply Rates" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Reply Rates</SelectItem>
                          <SelectItem value="excellent">Excellent (&gt; 95%)</SelectItem>
                          <SelectItem value="good">Good (80-94%)</SelectItem>
                          <SelectItem value="needs-improvement">Needs Improvement (&lt; 80%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Direct Search */}
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by location name..."
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        className="pl-10 w-56 border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#f9fafb]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f9fafb] border-b">
                      <tr>
                        <th 
                          className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-[#f9fafb] select-none"
                          onClick={() => handleSort('code')}
                        >
                          <div className="flex items-center gap-1">
                            Store Code
                            {sortField === 'code' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-[#f9fafb] select-none"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-1">
                            Store Name
                            {sortField === 'name' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-[#f9fafb] select-none"
                          onClick={() => handleSort('reviews')}
                        >
                          <div className="flex items-center gap-1">
                            Reviews
                            {sortField === 'reviews' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-[#f9fafb] select-none"
                          onClick={() => handleSort('rating')}
                        >
                          <div className="flex items-center gap-1">
                            Avg. Rating
                            {sortField === 'rating' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-[#f9fafb] select-none"
                          onClick={() => handleSort('replyRate')}
                        >
                          <div className="flex items-center gap-1">
                            Reply Rate
                            {sortField === 'replyRate' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-[#f9fafb] select-none"
                          onClick={() => handleSort('sentiment')}
                        >
                          <div className="flex items-center gap-1">
                            Sentiment
                            {sortField === 'sentiment' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">Top Themes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedLocationsData.map((location, index) => (
                        <tr 
                          key={location.code} 
                          className="border-b hover:bg-[#f9fafb] cursor-pointer transition-colors"
                          onClick={() => {
                            handleTabChange("inbox");
                            // Here you could set location filter in inbox
                          }}
                        >
                          <td className="p-4">
                            <div className="font-mono text-sm text-gray-600">{location.code}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{location.name}</div>
                            <div className="text-sm text-gray-500 opacity-75">{location.city} / {location.sublocation}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{location.reviews.toLocaleString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-gray-900">{location.rating}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{location.replyRate}%</div>
                          </td>
                          <td className="p-4">
                            <Badge variant={
                              location.sentiment === "Positive" ? "default" :
                              location.sentiment === "Negative" ? "destructive" : "secondary"
                            } className="text-xs">
                              {location.sentiment}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">{location.topPositive}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">{location.topNegative}</span>
                              </div>
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
      {/* Alert Settings Modal */}
      <Dialog open={alertSettingsOpen} onOpenChange={setAlertSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Notifications</DialogTitle>
            <DialogDescription>
              Configure your notification preferences for reviews and alerts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">1-2 Star Review Alerts</div>
                <div className="text-xs text-gray-500">Email me for every new 1-2 star review</div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Price Mentions</div>
                <div className="text-xs text-gray-500">Email me for every review mentioning "Price"</div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Daily Summary</div>
                <div className="text-xs text-gray-500">Send me a daily summary email at 8:00 AM</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlertSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAlertSettingsOpen(false)}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Review Templates Modal */}
      <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Reply Templates</DialogTitle>
            <DialogDescription>
              Create and manage standardized reply templates for common review scenarios.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Create New Template
            </Button>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Positive Reply - 5 Star</div>
                  <div className="text-sm text-gray-500">Thank you for your wonderful feedback...</div>
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
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Negative Reply - Staff Issue</div>
                  <div className="text-sm text-gray-500">We sincerely apologize for the staff issue...</div>
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplatesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setTemplatesOpen(false)}>
              Save Templates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* AI Settings Modal */}
      <Dialog open={aiSettingsOpen} onOpenChange={setAiSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure AI Assistant</DialogTitle>
            <DialogDescription>
              Customize the AI assistant behavior and brand guidelines for automated replies.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">AI-Assisted Reply Drafts</div>
                <div className="text-xs text-gray-500">Enable AI-assisted reply drafts in the Inbox</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Default AI Tone</div>
              <Select defaultValue="empathetic">
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empathetic">Empathetic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Brand Guidelines</div>
              <Textarea 
                placeholder="Enter key phrases or facts about your brand for the AI to use (e.g., 'Our return policy is 30 days', 'Always address the customer by their first name')"
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAiSettingsOpen(false)}>
              Save AI Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}