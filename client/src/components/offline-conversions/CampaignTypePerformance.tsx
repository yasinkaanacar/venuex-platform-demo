import { useMemo } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { fCurrency } from '@/lib/formatters';
import { CAMPAIGN_TYPE_LABELS } from '@/lib/mock/campaigns';
import type { CampaignTypeAggregation } from '@/hooks/useFilteredCampaigns';

interface Props {
  byCampaignType: Map<string, CampaignTypeAggregation>;
}

function roasColor(roas: number): string {
  if (roas >= 7) return '#059669';
  if (roas >= 5) return '#10b981';
  if (roas >= 3) return '#f59e0b';
  return '#f97316';
}

export default function CampaignTypePerformance({ byCampaignType }: Props) {
  const { t } = useTranslation();

  const perf = t.offlineConversions?.performanceMetrics as Record<string, string> | undefined;
  const oc = (key: string) => perf?.[key] || key;

  const translate = (key: string, options?: Record<string, string | number>) => {
    let text = oc(key);
    if (options && typeof text === 'string') {
      Object.entries(options).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{\\{${k}\\}\\}|\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const data = useMemo(() => {
    const rows: {
      type: string;
      label: string;
      roas: number;
      spend: number;
      count: number;
    }[] = [];

    Array.from(byCampaignType.entries()).forEach(([type, agg]) => {
      rows.push({
        type,
        label: CAMPAIGN_TYPE_LABELS[type] || type,
        roas: Number(agg.derived.omniROAS.toFixed(1)),
        spend: agg.totals.spend,
        count: agg.count,
      });
    });

    return rows.sort((a, b) => b.roas - a.roas);
  }, [byCampaignType]);

  const maxRoas = Math.max(...data.map(d => d.roas), 1);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          {oc('campaignTypePerformance')}
        </h3>
        <div className="relative group">
          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
            {oc('campaignTypeTooltip')}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
          </div>
        </div>
        <span className="text-xs text-gray-400">{oc('campaignTypeDesc')}</span>
      </div>

      <div className="space-y-1.5">
        {data.map(row => (
          <div key={row.type} className="flex items-center gap-3 group/row">
            {/* Label */}
            <span className="text-xs font-medium text-gray-700 w-24 text-right shrink-0 truncate" title={row.label}>
              {row.label}
            </span>

            {/* Bar */}
            <div className="flex-1 h-5 bg-gray-50 rounded overflow-hidden relative">
              <div
                className="h-full rounded transition-all duration-300"
                style={{
                  width: `${(row.roas / maxRoas) * 100}%`,
                  backgroundColor: roasColor(row.roas),
                  minWidth: 4,
                }}
              />
            </div>

            {/* ROAS value */}
            <span className="text-xs font-bold text-gray-900 w-10 text-right shrink-0">
              {row.roas}x
            </span>

            {/* Count + Spend */}
            <span className="text-[10px] text-gray-400 w-28 text-right shrink-0 hidden sm:block">
              {translate('campaignCount', { count: row.count })} · {fCurrency(row.spend)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
