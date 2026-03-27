import { Star, TrendingUp, TrendingDown, MessageCircle, ThumbsUp, ThumbsDown, Meh, BarChart3, Info } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import type { ReviewKpiData, RatingDistribution } from '@/lib/types/reviews';

interface ReviewKpiCardsProps {
  kpiData: ReviewKpiData;
  ratingDistribution: RatingDistribution[];
}

function TrendBadge({ change, suffix = '%' }: { change: number; suffix?: string }) {
  const isPositive = change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
      <Icon className="w-3 h-3" />
      {isPositive ? '+' : ''}{change}{suffix}
    </span>
  );
}

function MetricBlock({ label, value, change, changeSuffix, subValues, tooltip }: {
  label: string;
  value: string;
  change?: number;
  changeSuffix?: string;
  subValues?: { label: string; value: string }[];
  tooltip?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</span>
        {tooltip && (
          <div className="relative group/tip">
            <Info className="w-3 h-3 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-200 w-56 z-[9999]">
              {tooltip}
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-900">{value}</span>
        {change !== undefined && <TrendBadge change={change} suffix={changeSuffix} />}
      </div>
      {subValues && (
        <div className="flex gap-3 mt-1.5">
          {subValues.map((sub) => (
            <div key={sub.label} className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-[10px] text-gray-500">{sub.label}:</span>
              <span className="text-[10px] font-semibold text-gray-700">{sub.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReviewKpiCards({ kpiData, ratingDistribution }: ReviewKpiCardsProps) {
  const { t } = useTranslation();
  const oc = t.reviews?.kpi as any;
  const maxPercentage = Math.max(...ratingDistribution.map(r => r.percentage));

  return (
    <div className="vx-card">
      {/* Header */}
      <div className="vx-card-header">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-foreground">{oc?.title || 'Review Performance Summary'}</h3>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
              {oc?.tooltip || 'Key review metrics across all connected platforms.'}
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{oc?.desc || 'Monitor review volume, ratings, and response performance at a glance.'}</p>
      </div>

      {/* Body — gray muted background */}
      <div className="vx-card-body vx-surface-muted space-y-4">
        {/* Metrics Grid — 3 tiles */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Reviews */}
          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center mb-2">
              <MessageCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <MetricBlock
              label={oc?.totalReviews || 'Total Reviews'}
              tooltip={oc?.totalReviewsTooltip}
              value={kpiData.totalReviews.toLocaleString()}
              change={8.5}
              subValues={[{ label: oc?.newReviews || 'New Reviews', value: `+${kpiData.newReviews}` }]}
            />
          </div>

          {/* Average Rating */}
          <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
            <div className="w-7 h-7 bg-amber-500 rounded-md flex items-center justify-center mb-2">
              <Star className="w-3.5 h-3.5 text-white" />
            </div>
            <MetricBlock
              label={oc?.averageRating || 'Average Rating'}
              tooltip={oc?.averageRatingTooltip}
              value={kpiData.averageRating.toFixed(1)}
              change={0.2}
              changeSuffix=""
            />
          </div>

          {/* Response Rate */}
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
            <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <MetricBlock
              label={oc?.responseRate || 'Response Rate'}
              tooltip={oc?.responseRateTooltip}
              value={`${kpiData.responseRate}%`}
              change={2.5}
              subValues={[{ label: oc?.pendingResponses || 'Pending Responses', value: String(kpiData.pendingResponses) }]}
            />
          </div>
        </div>

        {/* Rating Distribution + Sentiment — 2-column */}
        <div className="grid grid-cols-2 gap-4">
          {/* Rating Distribution */}
          <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <h4 className="text-sm font-semibold text-gray-900">{t.reviews?.charts?.ratingDistribution || 'Rating Distribution'}</h4>
              <div className="relative group/rd">
                <Info className="w-3 h-3 text-gray-400 cursor-help" />
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/rd:opacity-100 group-hover/rd:visible transition-all duration-200 w-56 z-[9999]">
                  {oc?.ratingDistributionTooltip || 'Breakdown of reviews by star rating.'}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-8">
                    <span className="text-sm font-medium text-gray-700">{rating.stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`${rating.fillColor} h-2 rounded-full transition-all`}
                      style={{ width: `${(rating.percentage / maxPercentage) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-10 text-right">{rating.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Breakdown */}
          <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <h4 className="text-sm font-semibold text-gray-900">{t.reviews?.charts?.sentimentDistribution || 'Sentiment Distribution'}</h4>
              <div className="relative group/st">
                <Info className="w-3 h-3 text-gray-400 cursor-help" />
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/st:opacity-100 group-hover/st:visible transition-all duration-200 w-56 z-[9999]">
                  {oc?.sentimentTooltip || 'AI-analyzed sentiment classification of review text.'}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">{t.reviews?.positive || 'Positive'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-green-600">68%</span>
                  <TrendBadge change={3.2} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Meh className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{t.reviews?.neutral || 'Neutral'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-600">24%</span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-500">
                    <TrendingDown className="w-3 h-3" />
                    -1.8%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">{t.reviews?.negative || 'Negative'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-red-600">8%</span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                    <TrendingDown className="w-3 h-3" />
                    -1.4%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
