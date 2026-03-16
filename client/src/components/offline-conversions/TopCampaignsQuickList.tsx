import { ArrowRight, Info } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { useTranslation } from '@/contexts/LanguageContext';
import { fCurrency } from '@/lib/formatters';
import { calcOfflineROAS, calcOmniROAS, CAMPAIGN_TYPE_LABELS } from '@/lib/mock/campaigns';
import type { Campaign } from '@/lib/mock/campaigns';

interface Props {
  campaigns: Campaign[];
  onNavigateToTab: (tab: string) => void;
}

const platformIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  google: { icon: SiGoogle, color: '#EA4335' },
  meta: { icon: SiMeta, color: '#1877F2' },
  tiktok: { icon: SiTiktok, color: '#000000' },
};

function roasColor(roas: number): string {
  if (roas >= 5) return 'text-emerald-600 bg-emerald-50';
  if (roas >= 3) return 'text-blue-600 bg-blue-50';
  return 'text-amber-600 bg-amber-50';
}

export default function TopCampaignsQuickList({ campaigns, onNavigateToTab }: Props) {
  const { t } = useTranslation();

  const perf = t.offlineConversions?.performanceMetrics as Record<string, string> | undefined;
  const oc = (key: string) => perf?.[key] || key;

  // Sort by omni ROAS descending, take top 5
  const sorted = [...campaigns]
    .map(c => ({ ...c, offlineRoas: calcOfflineROAS(c), omniRoas: calcOmniROAS(c) }))
    .sort((a, b) => b.omniRoas - a.omniRoas)
    .slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          {oc('topCampaigns')}
        </h3>
        <div className="relative group">
          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
            {oc('topCampaignsTooltip')}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
          </div>
        </div>
        <span className="text-xs text-gray-400">{oc('topCampaignsDesc')}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 pb-2.5 pr-3 w-8">#</th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 pb-2.5 pr-3">
                {t.offlineConversions?.campaignTable?.campaign || 'Campaign'}
              </th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 pb-2.5 pr-3 w-10">
                {t.offlineConversions?.campaignTable?.platform || 'Platform'}
              </th>
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 pb-2.5 pr-3">
                {t.offlineConversions?.campaignTable?.type || 'Type'}
              </th>
              <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 pb-2.5 pr-3">
                {t.offlineConversions?.campaignTable?.spend || 'Spend'}
              </th>
              <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 pb-2.5 pr-3">
                {oc('offlineRevenue')}
              </th>
              <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 pb-2.5 pr-3">
                {oc('offlineRoas')}
              </th>
              <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400 pb-2.5">
                {oc('omniRoas')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => {
              const PlatformIcon = platformIcons[c.platform]?.icon;
              const platformColor = platformIcons[c.platform]?.color;
              return (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-2.5 pr-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-500">{i + 1}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="text-sm font-medium text-gray-900 truncate block max-w-[240px]">
                      {c.name}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3">
                    {PlatformIcon && (
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ backgroundColor: platformColor }}
                      >
                        <PlatformIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {CAMPAIGN_TYPE_LABELS[c.campaignType] || c.campaignType}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className="text-sm text-gray-700">{fCurrency(c.spend)}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className="text-sm font-medium text-gray-900">{fCurrency(c.offlineRevenue)}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className="text-xs font-medium text-gray-500">
                      {c.offlineRoas.toFixed(1)}x
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${roasColor(c.omniRoas)}`}>
                      {c.omniRoas.toFixed(1)}x
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View all link */}
      <button
        onClick={() => onNavigateToTab('kampanyalar')}
        className="flex items-center gap-1.5 mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        {oc('viewAllCampaigns')}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
