import type {
  ReviewKpiData,
  ReviewLocationData,
  ThemeAnalysisItem,
  RatingDistribution,
  ReviewTrendWeek,
  ReviewTrendDataPoint,
  ReviewTrendGranularity,
  Review,
  LocationContext,
  ProductContext,
  ReplyTemplate,
} from '../types/reviews';
import { ReviewSourceEnum, ReviewStatusEnum, ReviewSentimentEnum } from '../types/common';

// ── KPI ─────────────────────────────────────────────────────────────────────

export const reviewKpiData: ReviewKpiData = {
  totalReviews: 1247,
  averageRating: 4.3,
  responseRate: 85,
  newReviews: 23,
  pendingResponses: 12,
};

// ── Rating Distribution ─────────────────────────────────────────────────────

export const ratingDistribution: RatingDistribution[] = [
  { stars: 5, percentage: 45, fillColor: 'bg-green-500' },
  { stars: 4, percentage: 28, fillColor: 'bg-green-400' },
  { stars: 3, percentage: 15, fillColor: 'bg-yellow-500' },
  { stars: 2, percentage: 8, fillColor: 'bg-orange-500' },
  { stars: 1, percentage: 4, fillColor: 'bg-red-500' },
];

// ── Themes ──────────────────────────────────────────────────────────────────

export const themeAnalysisData: ThemeAnalysisItem[] = [
  { name: 'Taste', reviews: 156, avgRating: 4.5, venueXScore: 92 },
  { name: 'Staff Service', reviews: 142, avgRating: 4.3, venueXScore: 87 },
  { name: 'Cleanliness', reviews: 128, avgRating: 4.4, venueXScore: 89 },
  { name: 'Atmosphere', reviews: 115, avgRating: 4.2, venueXScore: 84 },
  { name: 'Fast Service', reviews: 98, avgRating: 3.9, venueXScore: 76 },
  { name: 'Price', reviews: 89, avgRating: 3.2, venueXScore: 58 },
  { name: 'Waiting Time', reviews: 76, avgRating: 3.0, venueXScore: 52 },
  { name: 'Parking', reviews: 64, avgRating: 2.8, venueXScore: 45 },
  { name: 'Noise Level', reviews: 52, avgRating: 3.1, venueXScore: 54 },
  { name: 'Portion Size', reviews: 43, avgRating: 3.5, venueXScore: 62 },
];

// ── Review Trend — Daily granularity (90 days of data) ──────────────────────

function generateDailyReviewData(): ReviewTrendDataPoint[] {
  const data: ReviewTrendDataPoint[] = [];
  const startDate = new Date(2025, 11, 1); // Dec 1, 2025
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Seeded pseudo-random for deterministic data
  let seed = 42;
  const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };

  for (let i = 0; i < 90; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    const dayOfWeek = d.getDay();
    // Weekend bump
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.25 : 1.0;
    // Slight upward trend over 90 days
    const trendMultiplier = 1 + (i / 90) * 0.15;

    const basePositive = Math.round((14 + rand() * 6) * weekendMultiplier * trendMultiplier);
    const baseNeutral = Math.round((4 + rand() * 3) * weekendMultiplier);
    const baseNegative = Math.round((1 + rand() * 2) * weekendMultiplier);
    const total = basePositive + baseNeutral + baseNegative;

    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    const iso = d.toISOString().slice(0, 10);

    data.push({
      label: `${month} ${day}`,
      period: `${month} ${day}, ${year}`,
      date: iso,
      positive: basePositive,
      neutral: baseNeutral,
      negative: baseNegative,
      avgRating: parseFloat((4.0 + rand() * 0.5 + (i / 90) * 0.1).toFixed(2)),
      responseRate: Math.round(75 + rand() * 15 + (i / 90) * 5),
      totalReviews: total,
    });
  }
  return data;
}

export const reviewDailyData: ReviewTrendDataPoint[] = generateDailyReviewData();

// ── Aggregation helper ──────────────────────────────────────────────────────

/**
 * Determines granularity from number of days:
 *  1-20 days  → daily
 *  21-84 days → weekly
 *  84+ days   → monthly
 */
export function getGranularity(days: number): ReviewTrendGranularity {
  if (days <= 20) return 'daily';
  if (days <= 84) return 'weekly';
  return 'monthly';
}

/**
 * Slice the last N days of daily data and aggregate into the appropriate granularity.
 */
export function aggregateReviewTrend(
  dailyData: ReviewTrendDataPoint[],
  days: number,
): ReviewTrendDataPoint[] {
  const granularity = getGranularity(days);
  const sliced = dailyData.slice(-days);
  if (sliced.length === 0) return [];

  if (granularity === 'daily') return sliced;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const buckets = new Map<string, ReviewTrendDataPoint[]>();

  for (const point of sliced) {
    const d = new Date(point.date);
    let key: string;

    if (granularity === 'weekly') {
      // ISO week: bucket by Monday of the week
      const day = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((day + 6) % 7));
      key = monday.toISOString().slice(0, 10);
    } else {
      // Monthly: bucket by YYYY-MM
      key = point.date.slice(0, 7);
    }

    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(point);
  }

  const result: ReviewTrendDataPoint[] = [];
  buckets.forEach((points: ReviewTrendDataPoint[], _key: string) => {
    const positive = points.reduce((s: number, p: ReviewTrendDataPoint) => s + p.positive, 0);
    const neutral = points.reduce((s: number, p: ReviewTrendDataPoint) => s + p.neutral, 0);
    const negative = points.reduce((s: number, p: ReviewTrendDataPoint) => s + p.negative, 0);
    const total = positive + neutral + negative;
    const avgRating = parseFloat((points.reduce((s: number, p: ReviewTrendDataPoint) => s + p.avgRating, 0) / points.length).toFixed(2));
    const responseRate = Math.round(points.reduce((s: number, p: ReviewTrendDataPoint) => s + p.responseRate, 0) / points.length);

    const first = points[0];
    const last = points[points.length - 1];
    const firstDate = new Date(first.date);
    const lastDate = new Date(last.date);

    let label: string;
    let period: string;

    if (granularity === 'weekly') {
      label = `${months[firstDate.getMonth()]} ${firstDate.getDate()}`;
      period = `${months[firstDate.getMonth()]} ${firstDate.getDate()} – ${months[lastDate.getMonth()]} ${lastDate.getDate()}, ${lastDate.getFullYear()}`;
    } else {
      label = `${months[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
      period = `${months[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
    }

    result.push({ label, period, date: first.date, positive, neutral, negative, avgRating, responseRate, totalReviews: total });
  });

  return result;
}

/** Backward-compat: old weekly format for any consumer still using ReviewTrendWeek[] */
export const reviewTrendData: ReviewTrendWeek[] = aggregateReviewTrend(reviewDailyData, 56).map(p => ({
  week: p.label,
  period: p.period,
  positive: p.positive,
  neutral: p.neutral,
  negative: p.negative,
  avgRating: p.avgRating,
  responseRate: p.responseRate,
  totalReviews: p.totalReviews,
}));

// ── Locations ───────────────────────────────────────────────────────────────

export const reviewLocationsData: ReviewLocationData[] = [
  { code: "STR001", name: "Bağdat Caddesi", city: "Istanbul", sublocation: "Kadıköy", reviews: 542, rating: 4.7, replyRate: 85, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Staff Service", topNegative: "Parking" },
  { code: "STR002", name: "Kanyon AVM", city: "Istanbul", sublocation: "Levent", reviews: 489, rating: 4.6, replyRate: 78, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Product Quality", topNegative: "Wait Time" },
  { code: "STR003", name: "İstinyePark", city: "Istanbul", sublocation: "Sarıyer", reviews: 456, rating: 4.8, replyRate: 92, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Store Design", topNegative: "Price" },
  { code: "STR004", name: "Zorlu Center", city: "Istanbul", sublocation: "Beşiktaş", reviews: 423, rating: 4.6, replyRate: 81, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Staff Service", topNegative: "Crowded" },
  { code: "STR005", name: "Nişantaşı", city: "Istanbul", sublocation: "Şişli", reviews: 398, rating: 4.7, replyRate: 88, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Fashion Selection", topNegative: "Expensive" },
  { code: "STR006", name: "Akasya AVM", city: "Istanbul", sublocation: "Acıbadem", reviews: 376, rating: 4.6, replyRate: 79, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Cleanliness", topNegative: "Long Queues" },
  { code: "STR007", name: "Cevahir AVM", city: "Istanbul", sublocation: "Şişli", reviews: 365, rating: 4.7, replyRate: 83, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Variety", topNegative: "Navigation" },
  { code: "STR008", name: "Emaar AVM", city: "Istanbul", sublocation: "Ümraniye", reviews: 342, rating: 4.6, replyRate: 76, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Modern Design", topNegative: "Accessibility" },
  { code: "STR009", name: "Ankamall", city: "Ankara", sublocation: "Çankaya", reviews: 325, rating: 4.6, replyRate: 74, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Staff Helpfulness", topNegative: "Limited Stock" },
  { code: "STR010", name: "Forum İzmir", city: "Izmir", sublocation: "Bornova", reviews: 312, rating: 4.5, replyRate: 71, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Location", topNegative: "Parking Fee" },
  { code: "STR011", name: "Kent Meydanı", city: "Bursa", sublocation: "Osmangazi", reviews: 298, rating: 4.5, replyRate: 68, sentiment: ReviewSentimentEnum.NEUTRAL, topPositive: "Product Range", topNegative: "Service Speed" },
  { code: "STR012", name: "Marina Mall", city: "Antalya", sublocation: "Konyaaltı", reviews: 287, rating: 4.5, replyRate: 72, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Beach Proximity", topNegative: "Tourist Prices" },
  { code: "STR013", name: "Optimum", city: "Adana", sublocation: "Seyhan", reviews: 276, rating: 4.5, replyRate: 67, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Air Conditioning", topNegative: "Noise Level" },
  { code: "STR014", name: "Forum Mersin", city: "Mersin", sublocation: "Akdeniz", reviews: 265, rating: 4.6, replyRate: 75, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Sea View", topNegative: "Traffic Access" },
  { code: "STR015", name: "Sanko Park", city: "Gaziantep", sublocation: "Şahinbey", reviews: 254, rating: 4.5, replyRate: 69, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Local Culture", topNegative: "Language Barrier" },
  { code: "STR016", name: "Kulesite", city: "Konya", sublocation: "Meram", reviews: 243, rating: 4.4, replyRate: 63, sentiment: ReviewSentimentEnum.NEUTRAL, topPositive: "Traditional Feel", topNegative: "Old Building" },
  { code: "STR017", name: "Espark", city: "Eskişehir", sublocation: "Tepebaşı", reviews: 232, rating: 4.5, replyRate: 66, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Student Friendly", topNegative: "Limited Premium" },
  { code: "STR018", name: "Park AVM", city: "Kayseri", sublocation: "Kocasinan", reviews: 221, rating: 4.4, replyRate: 61, sentiment: ReviewSentimentEnum.NEUTRAL, topPositive: "Central Location", topNegative: "Outdated Style" },
  { code: "STR019", name: "Forum Trabzon", city: "Trabzon", sublocation: "Ortahisar", reviews: 210, rating: 4.5, replyRate: 64, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Regional Products", topNegative: "Weather Dependent" },
  { code: "STR020", name: "Piazza Samsun", city: "Samsun", sublocation: "Atakum", reviews: 198, rating: 4.4, replyRate: 59, sentiment: ReviewSentimentEnum.NEUTRAL, topPositive: "Coastal Location", topNegative: "Seasonal Crowds" },
  { code: "STR021", name: "Forum Erzurum", city: "Erzurum", sublocation: "Yakutiye", reviews: 189, rating: 4.1, replyRate: 58, sentiment: ReviewSentimentEnum.NEUTRAL, topPositive: "Winter Sports", topNegative: "Cold Weather" },
  { code: "STR022", name: "Arasta Park", city: "Malatya", sublocation: "Battalgazi", reviews: 167, rating: 3.8, replyRate: 52, sentiment: ReviewSentimentEnum.NEGATIVE, topPositive: "Apricot Season", topNegative: "Limited Options" },
  { code: "STR023", name: "100. Yıl AVM", city: "Van", sublocation: "İpekyolu", reviews: 156, rating: 3.3, replyRate: 39, sentiment: ReviewSentimentEnum.NEGATIVE, topPositive: "Lake View", topNegative: "Remote Location" },
  { code: "STR024", name: "Piazza Şanlıurfa", city: "Şanlıurfa", sublocation: "Haliliye", reviews: 145, rating: 4.0, replyRate: 55, sentiment: ReviewSentimentEnum.NEUTRAL, topPositive: "Historical Context", topNegative: "Hot Climate" },
  { code: "STR025", name: "Forum Diyarbakır", city: "Diyarbakır", sublocation: "Bağlar", reviews: 134, rating: 3.9, replyRate: 48, sentiment: ReviewSentimentEnum.NEUTRAL, topPositive: "Cultural Heritage", topNegative: "Security Concerns" },
  { code: "STR026", name: "Kentpark", city: "Denizli", sublocation: "Pamukkale", reviews: 128, rating: 4.4, replyRate: 71, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Thermal Tourism", topNegative: "Tourist Season" },
  { code: "STR027", name: "Forum Çamlık", city: "Manisa", sublocation: "Yunusemre", reviews: 121, rating: 4.2, replyRate: 62, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Grape Harvest", topNegative: "Agricultural Area" },
  { code: "STR028", name: "Novada Söke", city: "Aydın", sublocation: "Söke", reviews: 115, rating: 4.0, replyRate: 57, sentiment: ReviewSentimentEnum.NEUTRAL, topPositive: "Cotton Fields", topNegative: "Rural Setting" },
  { code: "STR029", name: "Mavera AVM", city: "Muğla", sublocation: "Bodrum", reviews: 108, rating: 4.3, replyRate: 68, sentiment: ReviewSentimentEnum.POSITIVE, topPositive: "Resort Atmosphere", topNegative: "Seasonal Business" },
  { code: "STR030", name: "Akçaabat Çarşı", city: "Trabzon", sublocation: "Akçaabat", reviews: 98, rating: 4.1, replyRate: 54, sentiment: ReviewSentimentEnum.NEUTRAL, topPositive: "Local Cuisine", topNegative: "Transportation" },
];

// ── Reviews ─────────────────────────────────────────────────────────────────

export const recentReviews: Review[] = [
  { id: 1, platform: ReviewSourceEnum.GOOGLE, rating: 5, reviewer: "Ayşe K.", date: "2 hours ago", location: "Bağdat Caddesi", product: "Running Shoes", productSku: "RS-001", text: "Harika bir deneyim! Personel çok yardımseverdi ve ürün kalitesi mükemmeldi.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Staff Service", category_scores: { "Staff Service": 0.92, "Product Quality": 0.85 } } },
  { id: 2, platform: ReviewSourceEnum.META, rating: 4, reviewer: "Mehmet S.", date: "5 hours ago", location: "Kanyon AVM", product: "Winter Coat", productSku: "WC-045", text: "Güzel ürünler var ama fiyatlar biraz yüksek. Yine de tavsiye ederim.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "neutral", category: "Pricing", category_scores: { "Pricing": 0.65, "Product Quality": 0.78 } } },
  { id: 3, platform: ReviewSourceEnum.APPLE, rating: 2, reviewer: "Elif Y.", date: "1 day ago", location: "İstinyePark", product: "Coffee Maker", productSku: "CM-123", text: "Ürün beklentilerimi karşılamadı. İade sürecinde sorun yaşadım.", isNew: false, status: ReviewStatusEnum.ANSWERED, analyzeResult: { overall_emotion: "negative", category: "Product Quality", category_scores: { "Product Quality": 0.25, "Return Process": 0.18 }, safety_issue: false } },
  { id: 4, platform: ReviewSourceEnum.GOOGLE, rating: 5, reviewer: "Ali R.", date: "3 hours ago", location: "Zorlu Center", product: "Wireless Headphones", productSku: "WH-078", text: "Perfect sound quality and very comfortable to wear for long sessions!", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Product Quality", category_scores: { "Product Quality": 0.95, "Comfort": 0.90 } } },
  { id: 5, platform: ReviewSourceEnum.META, rating: 1, reviewer: "Zeynep T.", date: "2 days ago", location: "Nişantaşı", product: "Laptop Bag", productSku: "LB-256", text: "Çanta bir hafta içinde söküldü. Kalite kontrol yapılmalı.", isNew: false, status: ReviewStatusEnum.ANSWERED, analyzeResult: { overall_emotion: "negative", category: "Product Quality", category_scores: { "Product Quality": 0.10, "Durability": 0.08 }, anomaly: true } },
  { id: 6, platform: ReviewSourceEnum.GOOGLE, rating: 4, reviewer: "Burak M.", date: "6 hours ago", location: "Akasya AVM", product: "Smartphone Case", productSku: "SC-189", text: "Nice design but could be more protective. Still good value for the price.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Design", category_scores: { "Design": 0.80, "Protection": 0.55 } } },
  { id: 7, platform: ReviewSourceEnum.TIKTOK, rating: 3, reviewer: "Selin K.", date: "4 days ago", location: "Cevahir AVM", product: "Yoga Mat", productSku: "YM-067", text: "Orta kalite. Daha kalın bir mat bekliyordum ama iş görür.", isNew: false, status: ReviewStatusEnum.ANSWERED, analyzeResult: { overall_emotion: "neutral", category: "Product Quality", category_scores: { "Product Quality": 0.50, "Thickness": 0.35 } } },
  { id: 8, platform: ReviewSourceEnum.GOOGLE, rating: 5, reviewer: "Hakan D.", date: "1 hour ago", location: "Emaar AVM", product: "Kitchen Knife", productSku: "KK-234", text: "Exceptional quality! The sharpness is incredible and it feels great.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Product Quality", category_scores: { "Product Quality": 0.97, "Sharpness": 0.95 } } },
  { id: 9, platform: ReviewSourceEnum.META, rating: 4, reviewer: "Deniz A.", date: "8 hours ago", location: "Ankamall", product: "Desk Lamp", productSku: "DL-145", text: "Great lighting for my workspace. The adjustable brightness is a plus.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Functionality", category_scores: { "Functionality": 0.85, "Brightness": 0.82 } } },
  { id: 10, platform: ReviewSourceEnum.APPLE, rating: 2, reviewer: "Ceren G.", date: "3 days ago", location: "Forum İzmir", product: "Bluetooth Speaker", productSku: "BS-098", text: "Sound quality is disappointing. Bass is almost non-existent.", isNew: false, status: ReviewStatusEnum.ANSWERED, analyzeResult: { overall_emotion: "negative", category: "Sound Quality", category_scores: { "Sound Quality": 0.20, "Bass": 0.10 } } },
  { id: 11, platform: ReviewSourceEnum.GOOGLE, rating: 5, reviewer: "Murat P.", date: "4 hours ago", location: "Kent Meydanı", product: "Running Shoes", productSku: "RS-002", text: "Best running shoes I've ever owned! Amazing support.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Comfort", category_scores: { "Comfort": 0.95, "Support": 0.92 } } },
  { id: 12, platform: ReviewSourceEnum.META, rating: 3, reviewer: "Aslı F.", date: "5 days ago", location: "Marina Mall", product: "Winter Coat", productSku: "WC-046", text: "Decent quality but the sizing runs small. Order one size up.", isNew: false, status: ReviewStatusEnum.ANSWERED, analyzeResult: { overall_emotion: "neutral", category: "Sizing", category_scores: { "Sizing": 0.40, "Quality": 0.65 } } },
  { id: 13, platform: ReviewSourceEnum.GOOGLE, rating: 4, reviewer: "Emre B.", date: "7 hours ago", location: "Optimum", product: "Coffee Maker", productSku: "CM-124", text: "Makes great coffee. Easy to clean. Would recommend.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Functionality", category_scores: { "Functionality": 0.88, "Cleaning": 0.82 } } },
  { id: 14, platform: ReviewSourceEnum.TIKTOK, rating: 1, reviewer: "Fatma N.", date: "6 days ago", location: "Forum Mersin", product: "Wireless Headphones", productSku: "WH-079", text: "Broke after 2 weeks. Very disappointed. Not worth the price.", isNew: false, status: ReviewStatusEnum.ANSWERED, analyzeResult: { overall_emotion: "negative", category: "Durability", category_scores: { "Durability": 0.05, "Value": 0.12 }, anomaly: true } },
  { id: 15, platform: ReviewSourceEnum.GOOGLE, rating: 5, reviewer: "Oğuz L.", date: "2 hours ago", location: "Sanko Park", product: "Laptop Bag", productSku: "LB-257", text: "Perfect for daily commute. Fits my 15-inch laptop perfectly.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Design", category_scores: { "Design": 0.90, "Fit": 0.88 } } },
  { id: 16, platform: ReviewSourceEnum.META, rating: 4, reviewer: "Pınar Ç.", date: "9 hours ago", location: "Kulesite", product: "Smartphone Case", productSku: "SC-190", text: "Looks great and fits perfectly. Wish it came in more colors.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Design", category_scores: { "Design": 0.82, "Color Options": 0.45 } } },
  { id: 17, platform: ReviewSourceEnum.APPLE, rating: 3, reviewer: "Kerem V.", date: "2 days ago", location: "Espark", product: "Yoga Mat", productSku: "YM-068", text: "Adequate for basic yoga. Not the best grip when sweating.", isNew: false, status: ReviewStatusEnum.ANSWERED, analyzeResult: { overall_emotion: "neutral", category: "Grip", category_scores: { "Grip": 0.40, "Basic Use": 0.60 } } },
  { id: 18, platform: ReviewSourceEnum.GOOGLE, rating: 5, reviewer: "İrem H.", date: "3 hours ago", location: "Park AVM", product: "Kitchen Knife", productSku: "KK-235", text: "Mükemmel keskinlik! Mutfakta olmazsa olmaz. Kesinlikle tavsiye ederim.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Sharpness", category_scores: { "Sharpness": 0.96, "Essential": 0.90 } } },
  { id: 19, platform: ReviewSourceEnum.META, rating: 2, reviewer: "Cem Ö.", date: "4 days ago", location: "Forum Trabzon", product: "Desk Lamp", productSku: "DL-146", text: "Işık çok zayıf. Çalışma masası için yetersiz kalıyor.", isNew: false, status: ReviewStatusEnum.ANSWERED, analyzeResult: { overall_emotion: "negative", category: "Brightness", category_scores: { "Brightness": 0.15, "Work Use": 0.20 } } },
  { id: 20, platform: ReviewSourceEnum.TIKTOK, rating: 4, reviewer: "Yasemin U.", date: "11 hours ago", location: "Piazza Samsun", product: "Bluetooth Speaker", productSku: "BS-099", text: "Good battery life and decent sound. Perfect for outdoor use.", isNew: true, status: ReviewStatusEnum.UNANSWERED, analyzeResult: { overall_emotion: "positive", category: "Battery", category_scores: { "Battery": 0.85, "Sound": 0.70 } } },
  { id: 21, platform: ReviewSourceEnum.GOOGLE, rating: 5, reviewer: "Tolga W.", date: "1 hour ago", location: "Bağdat Caddesi", product: "Running Shoes", productSku: "RS-003", text: "Incredible comfort from day one. No break-in period needed!", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 22, platform: ReviewSourceEnum.META, rating: 3, reviewer: "Neslihan Q.", date: "3 days ago", location: "Kanyon AVM", product: "Winter Coat", productSku: "WC-047", text: "Looks nice but not very warm. Better for mild winters.", isNew: false, status: ReviewStatusEnum.ANSWERED },
  { id: 23, platform: ReviewSourceEnum.APPLE, rating: 4, reviewer: "Barış Z.", date: "6 hours ago", location: "İstinyePark", product: "Coffee Maker", productSku: "CM-125", text: "Sleek design and makes excellent espresso. Very happy with it.", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 24, platform: ReviewSourceEnum.GOOGLE, rating: 1, reviewer: "Seda R.", date: "5 days ago", location: "Zorlu Center", product: "Wireless Headphones", productSku: "WH-080", text: "Connection drops constantly. Had to return them.", isNew: false, status: ReviewStatusEnum.ANSWERED },
  { id: 25, platform: ReviewSourceEnum.META, rating: 5, reviewer: "Erhan T.", date: "2 hours ago", location: "Nişantaşı", product: "Laptop Bag", productSku: "LB-258", text: "Premium quality leather. Gets compliments everywhere I go!", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 26, platform: ReviewSourceEnum.TIKTOK, rating: 4, reviewer: "Merve S.", date: "1 day ago", location: "Akasya AVM", product: "Smartphone Case", productSku: "SC-191", text: "Good protection. Survived a few drops without any damage.", isNew: false, status: ReviewStatusEnum.ANSWERED },
  { id: 27, platform: ReviewSourceEnum.GOOGLE, rating: 3, reviewer: "Ali V.", date: "7 hours ago", location: "Cevahir AVM", product: "Yoga Mat", productSku: "YM-069", text: "Average quality. Started peeling after a month of regular use.", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 28, platform: ReviewSourceEnum.META, rating: 4, reviewer: "Leyla X.", date: "10 hours ago", location: "Novada Söke", product: "Kitchen Knife", productSku: "KK-236", text: "Good quality steel. Handle could be more ergonomic.", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 29, platform: ReviewSourceEnum.META, rating: 5, reviewer: "Kadir Y.", date: "4 hours ago", location: "Mavera AVM", product: "Desk Lamp", productSku: "DL-147", text: "Excellent adjustable brightness. Perfect for my home office.", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 30, platform: ReviewSourceEnum.APPLE, rating: 3, reviewer: "Gizem Z.", date: "1 day ago", location: "Akçaabat Çarşı", product: "Bluetooth Speaker", productSku: "BS-100", text: "Average sound quality. Good for casual listening.", isNew: false, status: ReviewStatusEnum.ANSWERED },
  { id: 31, platform: ReviewSourceEnum.GOOGLE, rating: 4, reviewer: "Tolga A1.", date: "2 hours ago", location: "Bağdat Caddesi", product: "Running Shoes", productSku: "RS-004", text: "Great for daily workouts. Good arch support.", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 32, platform: ReviewSourceEnum.META, rating: 1, reviewer: "Neslihan B1.", date: "5 days ago", location: "Kanyon AVM", product: "Coffee Maker", productSku: "CM-126", text: "Leaked water from the first day. Terrible quality control.", isNew: false, status: ReviewStatusEnum.ANSWERED },
  { id: 33, platform: ReviewSourceEnum.TIKTOK, rating: 5, reviewer: "Barış C1.", date: "8 hours ago", location: "İstinyePark", product: "Wireless Headphones", productSku: "WH-081", text: "Outstanding audio quality. Best purchase I've made this year!", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 34, platform: ReviewSourceEnum.GOOGLE, rating: 2, reviewer: "Seda D1.", date: "3 days ago", location: "Zorlu Center", product: "Winter Coat", productSku: "WC-048", text: "Not as warm as advertised. Disappointed with the quality.", isNew: false, status: ReviewStatusEnum.ANSWERED },
  { id: 35, platform: ReviewSourceEnum.META, rating: 4, reviewer: "Erhan E1.", date: "1 hour ago", location: "Nişantaşı", product: "Laptop Bag", productSku: "LB-259", text: "Well-designed compartments. Good value for money.", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 36, platform: ReviewSourceEnum.APPLE, rating: 3, reviewer: "Merve F1.", date: "6 days ago", location: "Akasya AVM", product: "Smartphone Case", productSku: "SC-192", text: "Basic protection but nothing special. Gets the job done.", isNew: false, status: ReviewStatusEnum.ANSWERED },
  { id: 37, platform: ReviewSourceEnum.GOOGLE, rating: 5, reviewer: "Ali G1.", date: "11 hours ago", location: "Cevahir AVM", product: "Yoga Mat", productSku: "YM-070", text: "Perfect thickness and excellent grip. Yoga sessions are much better now.", isNew: true, status: ReviewStatusEnum.UNANSWERED },
  { id: 38, platform: ReviewSourceEnum.META, rating: 4, reviewer: "Canan H1.", date: "2 days ago", location: "Emaar AVM", product: "Kitchen Knife", productSku: "KK-237", text: "Very sharp and reliable. Happy with the purchase.", isNew: false, status: ReviewStatusEnum.ANSWERED },
  { id: 39, platform: ReviewSourceEnum.TIKTOK, rating: 1, reviewer: "Özgür I1.", date: "4 days ago", location: "Ankamall", product: "Desk Lamp", productSku: "DL-148", text: "Broke after one week of use. Very poor construction.", isNew: false, status: ReviewStatusEnum.ANSWERED },
  { id: 40, platform: ReviewSourceEnum.GOOGLE, rating: 5, reviewer: "Didem J1.", date: "7 hours ago", location: "Forum İzmir", product: "Bluetooth Speaker", productSku: "BS-101", text: "Amazing sound quality! Perfect for parties and outdoor activities.", isNew: true, status: ReviewStatusEnum.UNANSWERED },
];

// ── Context Data ────────────────────────────────────────────────────────────

export const locationContextData: Record<string, LocationContext> = {
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
  "Marina Mall": { overallRating: 3.4, totalReviews: 134, topNegativeTheme: "Service Speed" },
  "Optimum": { overallRating: 4.2, totalReviews: 389, topNegativeTheme: "Parking Issues" },
  "Forum Mersin": { overallRating: 3.7, totalReviews: 145, topNegativeTheme: "Staff Training" },
  "Sanko Park": { overallRating: 3.9, totalReviews: 198, topNegativeTheme: "Product Availability" },
  "Kulesite": { overallRating: 3.3, totalReviews: 112, topNegativeTheme: "Accessibility" },
  "Espark": { overallRating: 3.8, totalReviews: 156, topNegativeTheme: "Maintenance" },
  "Park AVM": { overallRating: 4.0, totalReviews: 201, topNegativeTheme: "Parking Fees" },
  "Forum Trabzon": { overallRating: 3.6, totalReviews: 178, topNegativeTheme: "Weather Protection" },
  "Piazza Samsun": { overallRating: 3.9, totalReviews: 189, topNegativeTheme: "Food Court" },
};

export const productContextData: Record<string, ProductContext> = {
  "Running Shoes": { overallRating: 4.3, topNegativeTheme: "Sizing Issues", sku: "RS-001" },
  "Winter Coat": { overallRating: 3.8, topNegativeTheme: "Zipper Quality", sku: "WC-045" },
  "Coffee Maker": { overallRating: 3.2, topNegativeTheme: "Build Quality", sku: "CM-123" },
  "Wireless Headphones": { overallRating: 4.1, topNegativeTheme: "Connection Issues", sku: "WH-078" },
  "Laptop Bag": { overallRating: 4.4, topNegativeTheme: "Strap Durability", sku: "LB-256" },
  "Smartphone Case": { overallRating: 3.9, topNegativeTheme: "Material Quality", sku: "SC-189" },
  "Yoga Mat": { overallRating: 3.6, topNegativeTheme: "Thickness", sku: "YM-067" },
  "Kitchen Knife": { overallRating: 4.2, topNegativeTheme: "Handle Comfort", sku: "KK-234" },
  "Desk Lamp": { overallRating: 3.7, topNegativeTheme: "Brightness Control", sku: "DL-145" },
  "Bluetooth Speaker": { overallRating: 4.0, topNegativeTheme: "Battery Life", sku: "BS-098" },
};

// ── Reply Templates ─────────────────────────────────────────────────────────

export const replyTemplates: ReplyTemplate[] = [
  { id: 1, name: "Positive Reply - 5 Star", preview: "Thank you for your wonderful feedback..." },
  { id: 2, name: "Negative Reply - Staff Issue", preview: "We sincerely apologize for the staff issue..." },
];
