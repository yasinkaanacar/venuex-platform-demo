// ── Union Types ──────────────────────────────────────────────────────────────

export type ReviewPlatform = 'Google' | 'Facebook' | 'Website' | 'Tripadvisor' | 'Yelp' | 'Apple' | 'Amazon';
export type ReviewSentiment = 'Positive' | 'Neutral' | 'Negative';
export type ReviewSource = 'locations' | 'products';
export type ReplyStatus = 'unreplied' | 'replied' | 'all';
export type SortOrder = 'latest' | 'oldest';
export type CommentFilter = 'all' | 'rating-only' | 'with-comment';
export type ThemeSortBy = 'reviews' | 'venueXScore';
export type SortDirection = 'asc' | 'desc';
export type ChartType = 'scatter' | 'bubble';
export type ThemeView = 'list' | 'chart';
export type AiTone = 'empathetic' | 'professional' | 'concise';

// ── Data Interfaces ─────────────────────────────────────────────────────────

export interface ReviewKpiData {
  totalReviews: number;
  averageRating: number;
  responseRate: number;
  newReviews: number;
  pendingResponses: number;
}

export interface ReviewLocationData {
  code: string;
  name: string;
  city: string;
  sublocation: string;
  reviews: number;
  rating: number;
  replyRate: number;
  sentiment: ReviewSentiment;
  topPositive: string;
  topNegative: string;
}

export interface ThemeAnalysisItem {
  name: string;
  reviews: number;
  avgRating: number;
  venueXScore: number;
}

export type ReviewTrendGranularity = 'daily' | 'weekly' | 'monthly';

export interface ReviewTrendDataPoint {
  /** Date string: "Jan 6" for daily, "Jan 6" for weekly, "Jan 2026" for monthly */
  label: string;
  /** Full period description for tooltip: "Jan 6, 2026" or "Jan 6 – Jan 12, 2026" */
  period: string;
  /** ISO date string of the data point start (for sorting/grouping) */
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  avgRating: number;
  responseRate: number;
  totalReviews: number;
}

/** @deprecated Use ReviewTrendDataPoint instead */
export interface ReviewTrendWeek {
  week: string;
  period: string;
  positive: number;
  neutral: number;
  negative: number;
  avgRating: number;
  responseRate: number;
  totalReviews: number;
}

export interface RatingDistribution {
  stars: number;
  percentage: number;
  fillColor: string;
}

export interface Review {
  id: number;
  platform: ReviewPlatform;
  rating: number;
  reviewer: string;
  date: string;
  location: string;
  product: string;
  productSku: string;
  text: string;
  isNew: boolean;
}

export interface LocationContext {
  overallRating: number;
  totalReviews: number;
  topNegativeTheme: string;
}

export interface ProductContext {
  overallRating: number;
  topNegativeTheme: string;
  sku: string;
}

export interface ReplyTemplate {
  id: number;
  name: string;
  preview: string;
}

// ── Filter State ────────────────────────────────────────────────────────────

export interface LocationsTabFilters {
  dateRange: string;
  region: string;
  city: string;
  storeSet: string;
  sentiment: string;
  avgRating: string;
  replyRate: string;
  search: string;
}

export interface InboxActiveFilters {
  source: string | null;
  rating: number | null;
  week: string | null;
  status: string | null;
}
