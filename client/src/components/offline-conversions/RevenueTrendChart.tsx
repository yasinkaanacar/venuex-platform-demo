import { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import type { Platform } from '@/lib/mock/campaigns';
import type { AggregatedTotals, PlatformAggregation } from '@/hooks/useFilteredCampaigns';

interface Props {
  totals: AggregatedTotals;
  byPlatform: Map<Platform, PlatformAggregation>;
  dateRange?: string;
}

// ─── Date helpers ──────────────────────────────────────────────────

function getDaysFromRange(range: string): number {
  if (range.endsWith('d')) return parseInt(range, 10) || 30;
  const now = new Date();
  switch (range) {
    case 'thisMonth': return now.getDate();
    case 'lastMonth': {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return new Date(prev.getFullYear(), prev.getMonth() + 1, 0).getDate();
    }
    case 'qtd': {
      const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      return Math.ceil((now.getTime() - qStart.getTime()) / (1000 * 60 * 60 * 24));
    }
    default: return 30;
  }
}

type BucketMode = 'daily' | 'weekly' | 'monthly';

interface TimeBucket {
  label: string;
  shortLabel: string;
}

function getBucketMode(days: number): BucketMode {
  if (days <= 20) return 'daily';
  if (days <= 84) return 'weekly';
  return 'monthly';
}

function generateBuckets(days: number, mode: BucketMode): TimeBucket[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - days + 1);

  if (mode === 'daily') {
    const buckets: TimeBucket[] = [];
    const d = new Date(start);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < days; i++) {
      buckets.push({
        label: `${d.getDate()} ${months[d.getMonth()]}`,
        shortLabel: `${d.getDate()}`,
      });
      d.setDate(d.getDate() + 1);
    }
    return buckets;
  }

  if (mode === 'weekly') {
    const buckets: TimeBucket[] = [];
    const d = new Date(start);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let weekNum = 1;
    while (d <= now) {
      const weekEnd = new Date(d);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (weekEnd > now) weekEnd.setTime(now.getTime());
      buckets.push({
        label: `${d.getDate()} ${months[d.getMonth()]} – ${weekEnd.getDate()} ${months[weekEnd.getMonth()]}`,
        shortLabel: `W${weekNum}`,
      });
      weekNum++;
      d.setDate(d.getDate() + 7);
    }
    return buckets;
  }

  // monthly
  const buckets: TimeBucket[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(start.getFullYear(), start.getMonth(), 1);
  while (d <= now) {
    buckets.push({
      label: `${months[d.getMonth()]} ${d.getFullYear()}`,
      shortLabel: months[d.getMonth()],
    });
    d.setMonth(d.getMonth() + 1);
  }
  return buckets;
}

// Generate deterministic but varied distribution weights
function generateWeights(count: number, seed: number): number[] {
  const raw: number[] = [];
  for (let i = 0; i < count; i++) {
    // Simple seeded pseudo-random variation
    const base = 1 / count;
    const variation = Math.sin((i + 1) * seed * 0.7) * 0.3 * base;
    raw.push(base + variation);
  }
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map(v => v / sum);
}

// ─── Platform constants ────────────────────────────────────────────

const PLATFORM_COLORS: Record<Platform, string> = {
  google: '#EA4335',
  meta: '#1877F2',
  tiktok: '#111827',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  google: 'Google',
  meta: 'Meta',
  tiktok: 'TikTok',
};

const ONLINE_COLORS: Record<Platform, string> = {
  google: '#FBCAC6',
  meta: '#A8CCFA',
  tiktok: '#9CA3AF',
};

// Platform-specific seed offsets for varied curves
const PLATFORM_SEEDS: Record<Platform, number> = {
  google: 1.3,
  meta: 2.7,
  tiktok: 4.1,
};

const formatAxis = (value: number) => {
  if (value >= 1000000) return `₺${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₺${(value / 1000).toFixed(0)}K`;
  return `₺${value}`;
};

// ─── Custom tooltip ────────────────────────────────────────────────

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const platforms = (['google', 'meta', 'tiktok'] as Platform[]).filter(
    p => (d[`${p}_offline`] != null && d[`${p}_offline`] > 0) || (d[`${p}_online`] != null && d[`${p}_online`] > 0)
  );
  const totalOffline = platforms.reduce((sum, p) => sum + (d[`${p}_offline`] || 0), 0);
  const totalOnline = platforms.reduce((sum, p) => sum + (d[`${p}_online`] || 0), 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[280px]" style={{ pointerEvents: 'none' }}>
      <div className="border-b border-gray-100 pb-2 mb-2.5">
        <p className="font-semibold text-gray-900 text-sm">{d.period}</p>
        <p className="text-[11px] text-gray-400">{d.bucket}</p>
      </div>
      <div className="space-y-1.5">
        {platforms.map(p => (
          <div key={p} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[p] }} />
              <span className="text-xs text-gray-600">{PLATFORM_LABELS[p]}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{formatAxis(d[`${p}_offline`] || 0)}</span>
              <span className="text-xs text-blue-500">{formatAxis(d[`${p}_online`] || 0)}</span>
            </div>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-1.5 mt-1.5 space-y-1">
          <div className="flex justify-between">
            <span className="text-xs font-medium text-gray-500">Offline</span>
            <span className="text-xs font-bold text-gray-900">{formatAxis(totalOffline)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-medium text-blue-500">Online</span>
            <span className="text-xs font-bold text-blue-600">{formatAxis(totalOnline)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-medium text-emerald-500">Toplam</span>
            <span className="text-xs font-bold text-emerald-600">{formatAxis(totalOffline + totalOnline)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-medium text-gray-400">Harcama</span>
            <span className="text-xs font-bold text-rose-500">{formatAxis(d.spend)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-medium text-gray-400">ROAS</span>
            <span className="text-xs font-bold text-violet-600">{d.omniRoas}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────

export default function RevenueTrendChart({ totals, byPlatform, dateRange = '30d' }: Props) {
  const { t } = useTranslation();

  const perf = t.offlineConversions?.performanceMetrics as Record<string, string> | undefined;
  const oc = (key: string) => perf?.[key] || key;

  const activePlatforms = useMemo(() => Array.from(byPlatform.keys()), [byPlatform]);

  const days = useMemo(() => getDaysFromRange(dateRange), [dateRange]);
  const mode = useMemo(() => getBucketMode(days), [days]);
  const buckets = useMemo(() => generateBuckets(days, mode), [days, mode]);

  const data = useMemo(() => {
    const count = buckets.length;
    const spendWeights = generateWeights(count, 3.5);

    return buckets.map((b, i) => {
      const point: Record<string, string | number> = {
        bucket: b.shortLabel,
        period: b.label,
      };

      let bucketRevenue = 0;
      Array.from(byPlatform.entries()).forEach(([platform, agg]) => {
        const weights = generateWeights(count, PLATFORM_SEEDS[platform]);
        const offVal = Math.round(agg.totals.offlineRevenue * weights[i]);
        const onVal = Math.round(agg.totals.onlineRevenue * weights[i]);
        point[`${platform}_offline`] = offVal;
        point[`${platform}_online`] = onVal;
        bucketRevenue += offVal + onVal;
      });

      const bucketSpend = Math.round(totals.spend * spendWeights[i]);
      point.spend = bucketSpend;
      point.omniRoas = bucketSpend > 0 ? Number((bucketRevenue / bucketSpend).toFixed(1)) : 0;

      return point;
    });
  }, [totals, byPlatform, buckets]);

  // Period-over-period growth (last bucket vs previous)
  const popGrowth = useMemo(() => {
    if (data.length < 2) return { change: 0, isPositive: true };
    const getBucketTotal = (d: Record<string, string | number>) =>
      activePlatforms.reduce((s, p) =>
        s + (Number(d[`${p}_offline`]) || 0) + (Number(d[`${p}_online`]) || 0)
      , 0);
    const last = getBucketTotal(data[data.length - 1]);
    const prev = getBucketTotal(data[data.length - 2]);
    const change = prev > 0 ? ((last - prev) / prev) * 100 : 0;
    return { change: Number(change.toFixed(1)), isPositive: change >= 0 };
  }, [data, activePlatforms]);

  // Dynamic bar thickness based on number of bars
  const barSize = useMemo(() => {
    const count = buckets.length;
    if (count <= 7) return 40;
    if (count <= 12) return 28;
    if (count <= 20) return 18;
    if (count <= 31) return 12;
    return 8;
  }, [buckets.length]);

  // Period label for WoW/DoD/MoM badge
  const popLabel = mode === 'daily' ? 'DoD' : mode === 'weekly' ? 'WoW' : 'MoM';

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="vx-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{oc('revenueTrend')}</h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                {oc('revenueTrendTooltip')}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
              </div>
            </div>
            <span className="text-xs text-gray-400 hidden md:inline">{oc('revenueTrendDesc')}</span>
          </div>
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${popGrowth.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {popGrowth.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {popGrowth.isPositive ? '+' : ''}{popGrowth.change}% {popLabel}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {activePlatforms.map(p => (
            <div key={p} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: PLATFORM_COLORS[p] }} />
              <span className="text-xs text-gray-500">{PLATFORM_LABELS[p]} ({oc('offline')})</span>
            </div>
          ))}
          {activePlatforms.map(p => (
            <div key={`${p}-online`} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded border" style={{ backgroundColor: ONLINE_COLORS[p], borderColor: PLATFORM_COLORS[p] }} />
              <span className="text-xs text-gray-400">{PLATFORM_LABELS[p]} ({oc('online')})</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-5 h-0 border-t-2 border-dashed border-rose-400" />
            <span className="text-xs text-gray-500">{oc('adSpendLine')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0 border-t-2 border-violet-500" />
            <span className="text-xs text-gray-500">ROAS</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 55, bottom: 10, left: 15 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="bucket"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: buckets.length > 14 ? 10 : 12, fill: '#6b7280' }}
              dy={8}
              interval={buckets.length > 20 ? Math.floor(buckets.length / 10) : 0}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickFormatter={formatAxis}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#a78bfa' }}
              tickFormatter={(v: number) => `${v}x`}
              domain={[0, 'auto']}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: '#f9fafb' }}
              wrapperStyle={{ zIndex: 9999 }}
            />

            {/* Stacked bars: offline revenue per platform */}
            {activePlatforms.map((platform) => (
              <Bar
                key={`${platform}_offline`}
                yAxisId="left"
                dataKey={`${platform}_offline`}
                stackId="revenue"
                fill={PLATFORM_COLORS[platform]}
                radius={[0, 0, 0, 0]}
                barSize={barSize}
              />
            ))}

            {/* Stacked bars: online revenue per platform (lighter, on top) */}
            {activePlatforms.map((platform, i) => (
              <Bar
                key={`${platform}_online`}
                yAxisId="left"
                dataKey={`${platform}_online`}
                stackId="revenue"
                fill={ONLINE_COLORS[platform]}
                radius={i === activePlatforms.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                barSize={barSize}
              />
            ))}

            {/* Spend dashed line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="spend"
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              legendType="none"
            />

            {/* Omni ROAS line on right axis */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="omniRoas"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: buckets.length > 14 ? 0 : 3, fill: '#8b5cf6', strokeWidth: 0 }}
              legendType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
