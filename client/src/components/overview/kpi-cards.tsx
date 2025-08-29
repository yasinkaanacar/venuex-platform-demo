import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, MapPin, ShoppingCart, Receipt, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { KPI } from '@/lib/types';

interface KpiCardsProps {
  kpis?: {
    offlineROAS: KPI;
    storeVisits: KPI;
    conversionRate: KPI;
    avgOrderValue: KPI;
    engagements: KPI;
  };
}

export default function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    {
      id: 'offline-roas',
      title: 'Offline ROAS',
      icon: DollarSign,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      value: kpis?.offlineROAS.value || '0x',
      trend: kpis?.offlineROAS.trend || '0%',
      previousValue: kpis?.offlineROAS.previousValue || '0x'
    },
    {
      id: 'store-visits',
      title: 'Store Visits',
      icon: MapPin,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      value: kpis?.storeVisits.value || '0',
      trend: kpis?.storeVisits.trend || '0%',
      previousValue: kpis?.storeVisits.previousValue || '0'
    },
    {
      id: 'conversion-rate',
      title: 'Visit → Purchase %',
      icon: ShoppingCart,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      value: kpis?.conversionRate.value || '0%',
      trend: kpis?.conversionRate.trend || '0%',
      previousValue: kpis?.conversionRate.previousValue || '0%'
    },
    {
      id: 'avg-order-value',
      title: 'Avg Order Value',
      icon: Receipt,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      value: kpis?.avgOrderValue.value || '$0',
      trend: kpis?.avgOrderValue.trend || '0%',
      previousValue: kpis?.avgOrderValue.previousValue || '$0'
    },
    {
      id: 'engagements',
      title: 'Engagements',
      icon: Eye,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      value: kpis?.engagements.value || '0',
      trend: kpis?.engagements.trend || '0%',
      previousValue: kpis?.engagements.previousValue || '0'
    }
  ];

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) return TrendingUp;
    if (trend.startsWith('-')) return TrendingDown;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {cards.map((card) => {
        const TrendIcon = getTrendIcon(card.trend);
        const Icon = card.icon;
        
        return (
          <Card key={card.id} className="hover:shadow-lg transition-shadow" data-testid={`card-${card.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
                </div>
                
                <div className={`flex items-center space-x-1 text-xs ${getTrendColor(card.trend)}`}>
                  {TrendIcon && <TrendIcon className="w-3 h-3" />}
                  <span data-testid={`text-trend-${card.id}`}>{card.trend}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground" data-testid={`text-value-${card.id}`}>
                  {card.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  vs {card.previousValue} previous period
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
