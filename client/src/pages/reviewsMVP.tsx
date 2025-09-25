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
  BookOpen,
  ShoppingBag
} from 'lucide-react';
import Header from '@/components/overview/header';

export default function ReviewsMVP() {
  const [activeTab, setActiveTab] = useState("ozet");
  const [dateRange, setDateRange] = useState("30");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Desktop Filter Bar state
  const [reviewSource, setReviewSource] = useState("locations"); // New Review Source filter
  const [replyStatusFilter, setReplyStatusFilter] = useState("unreplied");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all"); // New Product filter
  
  // Location Filter Bar state
  const [regionFilter, setRegionFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [avgRatingFilter, setAvgRatingFilter] = useState("all");
  const [replyRateFilter, setReplyRateFilter] = useState("all");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
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
              Overview
            </TabsTrigger>
            <TabsTrigger value="inbox" data-testid="tab-inbox">
              <MessageSquare className="w-4 h-4 mr-2" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="locations" data-testid="tab-locations">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="ozet" className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Average Rating Card */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" data-testid="card-average-rating">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Average Rating</CardTitle>
                  <div className="text-sm text-gray-500">(Last 30 days)</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-gray-900">{kpiData.averageRating}</div>
                  <div className="text-sm text-gray-500 mb-4">{kpiData.totalReviews.toLocaleString()} reviews</div>
                  
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

              {/* Review Volume Card */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" data-testid="card-review-volume">
                <CardHeader className="pb-3">
                  <CardTitle className="tracking-tight text-[#111827] font-semibold text-[18px]">Review Volume</CardTitle>
                  <div className="text-sm text-gray-500">(Last 30 Days)</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{kpiData.totalReviews.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <ArrowUp className="w-3 h-3" />
                        +12% vs previous period
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Reply Rate</div>
                        <div className="text-base font-bold text-gray-900">{kpiData.responseRate}%</div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <ArrowUp className="w-2 h-2" />
                          +5%
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs text-gray-600">Response Time</div>
                        </div>
                        <div className="text-base font-bold text-gray-900">{kpiData.avgResponseTime}</div>
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <ArrowUp className="w-2 h-2" />
                          +2h
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-1 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-600">Unanswered Count</div>
                        <Badge variant="destructive" className="text-xs px-1 py-0.5" data-testid="badge-urgent-action">
                          Urgent
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-base font-bold text-red-600">{openIssuesData.unreplied}</div>
                        <div className="text-xs text-red-600">Needs attention</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Analysis Card */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" data-testid="card-sentiment">
                <CardHeader className="pb-3">
                  <CardTitle className="tracking-tight text-[#111827] font-semibold text-[18px]">Sentiment Analysis</CardTitle>
                  <div className="text-sm text-gray-500">(Last 30 Days)</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Positive</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">68%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Neutral</span>
                      </div>
                      <span className="text-lg font-bold text-gray-600">24%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Negative</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">8%</span>
                    </div>
                  </div>
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
                        {stars: 5, count: 2890, percentage: 78.7, color: "green-500"},
                        {stars: 4, count: 445, percentage: 12.1, color: "lime-500"},
                        {stars: 3, count: 185, percentage: 5.0, color: "yellow-500"},
                        {stars: 2, count: 89, percentage: 2.4, color: "orange-500"},
                        {stars: 1, count: 63, percentage: 1.7, color: "red-500"}
                      ].map((rating) => (
                        <div key={rating.stars} className="text-center">
                          <div className="text-lg font-bold">{rating.stars}★</div>
                          <div className="h-24 bg-gray-100 rounded mb-2 flex items-end justify-center">
                            <div 
                              className={`w-8 bg-${rating.color} rounded-t`}
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
                            {/* Tooltip overlay */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black bg-opacity-75 text-white p-2 text-xs rounded flex items-center justify-center transition-opacity">
                              Avg: {location.avg}★ | Total: {location.total}
                            </div>
                          </div>
                          <div className="w-16 text-sm font-medium text-right">{location.avg}★</div>
                          <div className="w-12 text-xs text-gray-500 text-right">{location.total}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Weekly Summary - Advantages / Disadvantages</h2>
              <div className="text-sm text-gray-500">Last 7 days</div>
            </div>

            {/* Advantages / Disadvantages Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Bulk Actions
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
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
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setReplyStatusFilter("unreplied")}
                      >
                        Unreplied
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                          replyStatusFilter === "replied" 
                            ? "bg-slate-800 text-white" 
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setReplyStatusFilter("replied")}
                      >
                        Replied
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                          replyStatusFilter === "all" 
                            ? "bg-slate-800 text-white" 
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
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
                        <SelectItem value="1-2">1-2 Stars ★</SelectItem>
                        <SelectItem value="3">3 Stars ★</SelectItem>
                        <SelectItem value="4-5">4-5 Stars ★</SelectItem>
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
                </div>
              </CardContent>
            </Card>
            
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
                            {review.isNew && <Badge variant="destructive" className="text-xs px-1 py-0">NEW</Badge>}
                          </div>
                          <div className="font-medium text-sm mb-1">{review.reviewer}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                            {reviewSource === "locations" ? (
                              <>
                                <MapPin className="w-3 h-3" />
                                <span>{review.location}</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3 h-3" />
                                <span>{review.product}</span>
                                <span className="text-gray-400">({review.productSku})</span>
                              </>
                            )}
                          </div>
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
                    <CardTitle className="text-base">Review Details</CardTitle>
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
                        <span className="text-sm text-gray-500">- 
                          {reviewSource === "locations" ? (
                            <span className="inline-flex items-center gap-1 ml-1">
                              <MapPin className="w-3 h-3" />
                              {recentReviews[0].location}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 ml-1">
                              <ShoppingBag className="w-3 h-3" />
                              {recentReviews[0].product} ({recentReviews[0].productSku})
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-gray-500">- {recentReviews[0].date}</span>
                      </div>
                      <p className="text-gray-700">{recentReviews[0].text}</p>
                    </div>

                    {/* Contextual Snippet */}
                    <div className="border border-blue-200 rounded-lg bg-blue-50 p-4">
                      {reviewSource === "locations" ? (
                        // Location Snapshot
                        <div>
                          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location Snapshot: {recentReviews[0].location}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-blue-800">Overall Rating:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-blue-900">
                                  {locationContextData[recentReviews[0].location]?.overallRating || 4.0} ★
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-blue-800">Total Reviews:</span>
                              <span className="font-medium text-blue-900">
                                {locationContextData[recentReviews[0].location]?.totalReviews || 150} Reviews
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-blue-800">Top Issue:</span>
                              <span className="font-medium text-blue-900">
                                {locationContextData[recentReviews[0].location]?.topNegativeTheme || "Staff Attitude"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Product Snapshot
                        <div>
                          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Product Snapshot: {recentReviews[0].product}
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">SKU / ID:</span>
                                <span className="font-medium text-blue-900">
                                  {productContextData[recentReviews[0].product]?.sku || recentReviews[0].productSku}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">Overall Rating:</span>
                                <span className="font-medium text-blue-900">
                                  {productContextData[recentReviews[0].product]?.overallRating || 4.0} ★
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">Top Issue:</span>
                                <span className="font-medium text-blue-900">
                                  {productContextData[recentReviews[0].product]?.topNegativeTheme || "Quality"}
                                </span>
                              </div>
                              <div className="w-12 h-12 bg-white rounded border flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reply Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
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
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">Store Code</th>
                        <th className="text-left p-4 font-medium text-gray-900">Store Name</th>
                        <th className="text-left p-4 font-medium text-gray-900">Reviews</th>
                        <th className="text-left p-4 font-medium text-gray-900">Avg. Rating</th>
                        <th className="text-left p-4 font-medium text-gray-900">Reply Rate</th>
                        <th className="text-left p-4 font-medium text-gray-900">Sentiment</th>
                        <th className="text-left p-4 font-medium text-gray-900">Top Themes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationsData.map((location, index) => (
                        <tr 
                          key={location.code} 
                          className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            setActiveTab("inbox");
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
    </div>
  );
}