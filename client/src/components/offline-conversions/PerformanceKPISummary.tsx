import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { fCurrency, fNumber, fPercent } from '@/lib/formatters';
import type { AggregatedTotals, DerivedMetrics } from '@/hooks/useFilteredCampaigns';

interface Props {
  totals: AggregatedTotals;
  derived: DerivedMetrics;
}

// Fixed seed change percentages for realistic period-over-period trends
const CHANGE_SEEDS = [
  { change: 12.4, direction: 'up' as const },
  { change: 18.7, direction: 'up' as const },
  { change: 14.9, direction: 'up' as const },
  { change: -5.1, direction: 'down' as const },
  { change: 6.8, direction: 'up' as const },
];

interface Breakdown {
  offline: string;
  online: string;
}

interface CardDef {
  label: string;
  value: string;
  breakdown?: Breakdown;
  change: number;
  direction: 'up' | 'down';
}

export default function PerformanceKPISummary({ totals, derived }: Props) {
  const { t } = useTranslation();

  const perf = t.offlineConversions?.performanceMetrics as Record<string, string> | undefined;
  const oc = (key: string) => perf?.[key] || key;

  const totalRevenue = totals.offlineRevenue + totals.onlineRevenue;
  const totalConversions = totals.offlineConversions + totals.onlineConversions;

  // Omni cost per conversion
  const omniCPC = totalConversions > 0 ? totals.spend / totalConversions : 0;
  const offlineCPC = totals.offlineConversions > 0 ? totals.spend / totals.offlineConversions : 0;
  const onlineCPC = totals.onlineConversions > 0 ? totals.spend / totals.onlineConversions : 0;

  // Omni conversion rate
  const omniCR = totals.clicks > 0 ? (totalConversions / totals.clicks) * 100 : 0;
  const offlineCR = totals.clicks > 0 ? (totals.offlineConversions / totals.clicks) * 100 : 0;
  const onlineCR = totals.clicks > 0 ? (totals.onlineConversions / totals.clicks) * 100 : 0;

  const cards: CardDef[] = [
    {
      label: oc('totalAdSpend'),
      value: fCurrency(totals.spend),
      ...CHANGE_SEEDS[0],
    },
    {
      label: oc('omniRevenue'),
      value: fCurrency(totalRevenue),
      breakdown: {
        offline: fCurrency(totals.offlineRevenue),
        online: fCurrency(totals.onlineRevenue),
      },
      ...CHANGE_SEEDS[1],
    },
    {
      label: oc('totalConversions'),
      value: fNumber(totalConversions),
      breakdown: {
        offline: fNumber(totals.offlineConversions),
        online: fNumber(totals.onlineConversions),
      },
      ...CHANGE_SEEDS[2],
    },
    {
      label: oc('costPerConversion'),
      value: fCurrency(omniCPC),
      breakdown: {
        offline: fCurrency(offlineCPC),
        online: fCurrency(onlineCPC),
      },
      ...CHANGE_SEEDS[3],
    },
    {
      label: oc('convRateShort'),
      value: fPercent(omniCR),
      breakdown: {
        offline: fPercent(offlineCR),
        online: fPercent(onlineCR),
      },
      ...CHANGE_SEEDS[4],
    },
  ];

  const vsLabel = oc('vsLastPeriod');

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{oc('kpiTitle')}</h3>
        <div className="relative group">
          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-[9999]">
            {oc('kpiSummaryTooltip')}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
          </div>
        </div>
        <span className="text-xs text-gray-400">{oc('kpiSummaryDesc')}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {card.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>

            {/* Offline / Online breakdown */}
            {card.breakdown && (
              <div className="flex flex-col gap-1 mb-2 pt-1.5 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-800 flex-shrink-0" />
                  <span className="text-[11px] text-gray-500">{oc('offline')}</span>
                  <span className="text-[11px] font-semibold text-gray-700 ml-auto">{card.breakdown.offline}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-[11px] text-gray-500">{oc('online')}</span>
                  <span className="text-[11px] font-semibold text-blue-600 ml-auto">{card.breakdown.online}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              {card.direction === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  card.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {card.direction === 'up' ? '+' : ''}
                {card.change}%
              </span>
              <span className="text-xs text-gray-400">{vsLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
