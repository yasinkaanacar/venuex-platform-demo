import { useMemo } from 'react';
import { Info, Crown } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { fCurrency, fPercent } from '@/lib/formatters';
import type { Platform } from '@/lib/mock-campaign-data';
import type { PlatformAggregation } from '@/hooks/useFilteredCampaigns';

interface Props {
  byPlatform: Map<Platform, PlatformAggregation>;
}

const PLATFORMS: Record<Platform, {
  label: string;
  headerBg: string;
  accent: string;
  accentLight: string;
  bar: string;
}> = {
  google: {
    label: 'Google',
    headerBg: 'bg-red-500',
    accent: 'text-red-600',
    accentLight: 'bg-red-50 border-red-100',
    bar: 'bg-red-400',
  },
  meta: {
    label: 'Meta',
    headerBg: 'bg-blue-600',
    accent: 'text-blue-600',
    accentLight: 'bg-blue-50 border-blue-100',
    bar: 'bg-blue-400',
  },
  tiktok: {
    label: 'TikTok',
    headerBg: 'bg-gray-900',
    accent: 'text-gray-900',
    accentLight: 'bg-gray-50 border-gray-200',
    bar: 'bg-gray-700',
  },
};

type MetricKey = 'offlineROAS' | 'onlineROAS' | 'omniROAS' | 'costPerConversion' | 'conversionRate';

export default function PlatformComparison({ byPlatform }: Props) {
  const { t } = useTranslation();

  const perf = t.offlineConversions?.performanceMetrics as Record<string, string> | undefined;
  const oc = (key: string) => perf?.[key] || key;

  const metricDefs: { key: MetricKey; label: string; format: (v: number) => string; lowerIsBetter?: boolean }[] = [
    { key: 'offlineROAS', label: oc('offlineRoas'), format: (v) => `${v.toFixed(1)}x` },
    { key: 'onlineROAS', label: oc('onlineRoas'), format: (v) => `${v.toFixed(1)}x` },
    { key: 'omniROAS', label: oc('omniRoas'), format: (v) => `${v.toFixed(1)}x` },
    { key: 'costPerConversion', label: oc('costPerConvShort'), format: fCurrency, lowerIsBetter: true },
    { key: 'conversionRate', label: oc('convRateShort'), format: fPercent },
  ];

  const activePlatforms = useMemo(() => Array.from(byPlatform.keys()), [byPlatform]);

  // Compute wins per platform + best per metric
  const { bestPerMetric, winsCount } = useMemo(() => {
    const best: Record<string, Platform> = {};
    const wins: Record<Platform, number> = { google: 0, meta: 0, tiktok: 0 };

    for (const m of metricDefs) {
      let bestP: Platform | null = null;
      let bestVal = m.lowerIsBetter ? Infinity : -Infinity;
      for (const p of activePlatforms) {
        const val = byPlatform.get(p)?.derived[m.key] ?? 0;
        const isBetter = m.lowerIsBetter ? val < bestVal : val > bestVal;
        if (isBetter) { bestVal = val; bestP = p; }
      }
      if (bestP) { best[m.key] = bestP; wins[bestP]++; }
    }
    return { bestPerMetric: best, winsCount: wins };
  }, [byPlatform, activePlatforms]);

  // Normalize per metric for mini-bar width
  const maxPerMetric = useMemo(() => {
    const result: Record<MetricKey, number> = {} as any;
    for (const m of metricDefs) {
      let max = 0;
      for (const p of activePlatforms) {
        const v = byPlatform.get(p)?.derived[m.key] ?? 0;
        if (v > max) max = v;
      }
      result[m.key] = max || 1;
    }
    return result;
  }, [byPlatform, activePlatforms]);

  // Find overall leader
  const overallLeader = useMemo(() => {
    let leader: Platform = activePlatforms[0];
    let maxWins = 0;
    for (const p of activePlatforms) {
      if (winsCount[p] > maxWins) { maxWins = winsCount[p]; leader = p; }
    }
    return leader;
  }, [winsCount, activePlatforms]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          {oc('platformComparison')}
        </h3>
        <div className="relative group">
          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
            {oc('platformComparisonTooltip')}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
          </div>
        </div>
        <span className="text-xs text-gray-400">{oc('platformComparisonDesc')}</span>
      </div>

      <div className={`grid gap-3 ${activePlatforms.length === 3 ? 'grid-cols-3' : activePlatforms.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {activePlatforms.map(p => {
          const style = PLATFORMS[p];
          const agg = byPlatform.get(p);
          const isLeader = p === overallLeader && activePlatforms.length > 1;

          return (
            <div
              key={p}
              className={`rounded-lg border overflow-hidden ${isLeader ? style.accentLight : 'border-gray-100'}`}
            >
              {/* Platform header */}
              <div className={`${style.headerBg} px-3 py-2 flex items-center justify-between`}>
                <span className="text-white text-xs font-bold tracking-wide">{style.label}</span>
                {isLeader && (
                  <div className="flex items-center gap-1 bg-white/20 rounded-full px-1.5 py-0.5">
                    <Crown className="w-3 h-3 text-amber-300" />
                    <span className="text-[9px] font-bold text-white">{winsCount[p]}/{metricDefs.length}</span>
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="px-3 py-2 space-y-2">
                {metricDefs.map(m => {
                  const val = agg?.derived[m.key] ?? 0;
                  const isBest = bestPerMetric[m.key] === p && activePlatforms.length > 1;
                  const pct = m.lowerIsBetter
                    ? ((maxPerMetric[m.key] - val) / maxPerMetric[m.key]) * 100 + 10
                    : (val / maxPerMetric[m.key]) * 100;

                  return (
                    <div key={m.key}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-gray-600">{m.label}</span>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs tabular-nums ${isBest ? `font-bold ${style.accent}` : 'text-gray-700'}`}>
                            {m.format(val)}
                          </span>
                          {isBest && (
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          )}
                        </div>
                      </div>
                      {/* Mini bar */}
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isBest ? style.bar : 'bg-gray-300'}`}
                          style={{ width: `${Math.max(pct, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
