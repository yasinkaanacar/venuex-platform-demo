import { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import type { ReviewTrendDataPoint } from '@/lib/types/reviews';
import { reviewDailyData, aggregateReviewTrend, getGranularity } from '@/lib/mock-reviews-data';

interface ReviewTrendChartProps {
  /** Number of days for the date range (e.g. 7, 14, 30, 90) */
  dateRange?: number;
  /** @deprecated Use dateRange instead. Legacy prop for backward compat. */
  data?: ReviewTrendDataPoint[] | any[];
}

/**
 * Computes bar thickness based on bar count:
 *  ≤7 bars  → 40px
 *  8-14     → 32px
 *  15-30    → 20px
 *  31-60    → 12px
 *  60+      → 8px
 */
function getBarSize(barCount: number): number {
  if (barCount <= 7) return 40;
  if (barCount <= 14) return 32;
  if (barCount <= 30) return 20;
  if (barCount <= 60) return 12;
  return 8;
}

export default function ReviewTrendChart({ dateRange = 30, data: legacyData }: ReviewTrendChartProps) {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    if (legacyData && !dateRange) return legacyData as ReviewTrendDataPoint[];
    return aggregateReviewTrend(reviewDailyData, dateRange);
  }, [dateRange, legacyData]);

  const granularity = getGranularity(dateRange);
  const barSize = getBarSize(chartData.length);

  const subtitleKey = granularity === 'daily'
    ? (t as any).reviews?.trend?.subtitleDaily
    : granularity === 'monthly'
      ? (t as any).reviews?.trend?.subtitleMonthly
      : (t as any).reviews?.trend?.subtitleWeekly;

  const metrics = useMemo(() => {
    if (chartData.length === 0) return null;
    const totalReviews = chartData.reduce((sum, w) => sum + w.totalReviews, 0);
    const avgRating = chartData.reduce((sum, w) => sum + w.avgRating, 0) / chartData.length;
    const positiveRate = chartData.reduce((sum, w) => sum + w.positive, 0) / totalReviews * 100;
    const avgResponseRate = chartData.reduce((sum, w) => sum + w.responseRate, 0) / chartData.length;
    const totalPositive = chartData.reduce((sum, w) => sum + w.positive, 0);
    const totalNegative = chartData.reduce((sum, w) => sum + w.negative, 0);
    const sentimentScore = Math.round((totalPositive - totalNegative) / totalReviews * 100);

    // Period-over-period change (last vs second-to-last bucket)
    const lastBucket = chartData[chartData.length - 1];
    const prevBucket = chartData[chartData.length - 2];
    const popChange = prevBucket
      ? ((lastBucket.totalReviews - prevBucket.totalReviews) / prevBucket.totalReviews * 100).toFixed(1)
      : '0';
    const popPositive = Number(popChange) >= 0;

    return { totalReviews, avgRating, positiveRate, avgResponseRate, sentimentScore, popChange, popPositive };
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload as ReviewTrendDataPoint;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[240px]">
        <p className="font-semibold text-sm text-gray-900 mb-1">{d.label}</p>
        <p className="text-xs text-gray-500 mb-3">{d.period}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">{t.reviews.trend.totalReviews}</span>
            <span className="font-semibold text-gray-900">{d.totalReviews}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-green-600">{t.reviews.positive}</span>
            <span className="font-semibold text-green-700">{d.positive}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-yellow-600">{t.reviews.neutral}</span>
            <span className="font-semibold text-yellow-700">{d.neutral}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-red-600">{t.reviews.negative}</span>
            <span className="font-semibold text-red-700">{d.negative}</span>
          </div>
          <div className="border-t border-gray-100 pt-1.5 mt-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">{t.reviews.trend.avgRating}</span>
              <span className="font-semibold text-blue-600">{d.avgRating.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">{t.reviews.trend.responseRate}</span>
              <span className="font-semibold text-gray-900">{d.responseRate}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!metrics) return null;

  // Determine period label for WoW/DoD/MoM
  const periodLabel = granularity === 'daily' ? 'DoD' : granularity === 'weekly' ? 'WoW' : 'MoM';

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <h3 className="text-lg font-semibold text-gray-900">{t.reviews.trend.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{subtitleKey || t.reviews.trend.subtitle}</p>

        {/* Summary Metrics */}
        <div className="grid grid-cols-5 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{t.reviews.trend.totalReviews}</p>
            <p className="text-lg font-bold text-gray-900">{metrics.totalReviews.toLocaleString()}</p>
            <div className={`flex items-center gap-1 ${metrics.popPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.popPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs font-medium">{metrics.popPositive ? '+' : ''}{metrics.popChange}% {periodLabel}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{t.reviews.trend.avgRating}</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <p className="text-lg font-bold text-gray-900">{metrics.avgRating.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{t.reviews.trend.positivePercent}</p>
            <p className="text-lg font-bold text-green-600">{metrics.positiveRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{t.reviews.trend.responseRate}</p>
            <p className="text-lg font-bold text-blue-600">{metrics.avgResponseRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{t.reviews.trend.sentimentScore}</p>
            <p className="text-lg font-bold text-indigo-600">{metrics.sentimentScore}</p>
          </div>
        </div>
      </div>

      <div className="vx-card-body">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: chartData.length > 30 ? 10 : 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                interval={chartData.length > 30 ? Math.floor(chartData.length / 15) : 0}
                angle={chartData.length > 20 ? -45 : 0}
                textAnchor={chartData.length > 20 ? 'end' : 'middle'}
                height={chartData.length > 20 ? 50 : 30}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                label={{ value: t.reviews.trend.reviews, angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: '11px', fill: '#94a3b8' } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[3.5, 5]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                label={{ value: t.reviews.trend.avgRatingAxis, angle: 90, position: 'insideRight', offset: 10, style: { fontSize: '11px', fill: '#94a3b8' } }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Bar
                yAxisId="left"
                dataKey="positive"
                name={t.reviews.positive}
                stackId="sentiment"
                fill="#22c55e"
                barSize={barSize}
              />
              <Bar
                yAxisId="left"
                dataKey="neutral"
                name={t.reviews.neutral}
                stackId="sentiment"
                fill="#eab308"
              />
              <Bar
                yAxisId="left"
                dataKey="negative"
                name={t.reviews.negative}
                stackId="sentiment"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgRating"
                name={t.reviews.trend.avgRating}
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={chartData.length <= 20 ? { fill: '#3b82f6', strokeWidth: 2, r: 4 } : false}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
