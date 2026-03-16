import { Package, Store, RefreshCw, Activity } from 'lucide-react';
import type { CatalogQuickStatsData } from '@/lib/types/catalog';

interface CatalogQuickStatsProps {
  data: CatalogQuickStatsData;
}

export default function CatalogQuickStats({ data }: CatalogQuickStatsProps) {
  const stats = [
    {
      label: 'Total SKUs',
      value: data.totalSkus.toLocaleString('tr-TR'),
      icon: Package,
      color: 'text-gray-700',
    },
    {
      label: 'Stores Covered',
      value: data.totalStores.toString(),
      icon: Store,
      color: 'text-gray-700',
    },
    {
      label: 'Sync Success',
      value: `${data.syncSuccessRate}%`,
      icon: RefreshCw,
      color: data.syncSuccessRate >= 95 ? 'text-green-600' : data.syncSuccessRate >= 80 ? 'text-amber-600' : 'text-red-600',
    },
    {
      label: 'Feed Freshness',
      value: `${data.feedFreshnessScore}%`,
      icon: Activity,
      color: data.feedFreshnessScore >= 95 ? 'text-green-600' : data.feedFreshnessScore >= 80 ? 'text-amber-600' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3"
        >
          <div className="p-2 bg-gray-50 rounded-lg">
            <stat.icon className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
