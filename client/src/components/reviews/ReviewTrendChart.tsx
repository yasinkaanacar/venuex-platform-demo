import { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import type { ReviewTrendWeek } from '@/lib/types/reviews';

interface ReviewTrendChartProps {
  data: ReviewTrendWeek[];
}

export default function ReviewTrendChart({ data }: ReviewTrendChartProps) {
  const { t } = useTranslation();
  const metrics = useMemo(() => {
    const totalReviews = data.reduce((sum, w) => sum + w.totalReviews, 0);
    const avgRating = data.reduce((sum, w) => sum + w.avgRating, 0) / data.length;
    const positiveRate = data.reduce((sum, w) => sum + w.positive, 0) / totalReviews * 100;
    const avgResponseRate = data.reduce((sum, w) => sum + w.responseRate, 0) / data.length;
    const totalPositive = data.reduce((sum, w) => sum + w.positive, 0);
    const totalNegative = data.reduce((sum, w) => sum + w.negative, 0);
    const sentimentScore = Math.round((totalPositive - totalNegative) / totalReviews * 100);

    // Week-over-week change
    const lastWeek = data[data.length - 1];
    const prevWeek = data[data.length - 2];
    const wowChange = prevWeek
      ? ((lastWeek.totalReviews - prevWeek.totalReviews) / prevWeek.totalReviews * 100).toFixed(1)
      : '0';
    const wowPositive = Number(wowChange) >= 0;

    return { totalReviews, avgRating, positiveRate, avgResponseRate, sentimentScore, wowChange, wowPositive };
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload as ReviewTrendWeek;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[240px]">
        <p className="font-semibold text-sm text-gray-900 mb-1">{d.week}</p>
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

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <h3 className="text-lg font-semibold text-gray-900">{t.reviews.trend.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{t.reviews.trend.subtitle}</p>

        {/* Summary Metrics */}
        <div className="grid grid-cols-5 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{t.reviews.trend.totalReviews}</p>
            <p className="text-lg font-bold text-gray-900">{metrics.totalReviews.toLocaleString()}</p>
            <div className={`flex items-center gap-1 ${metrics.wowPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.wowPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs font-medium">{metrics.wowPositive ? '+' : ''}{metrics.wowChange}% WoW</span>
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
            <ComposedChart data={data} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
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
                barSize={32}
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
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
