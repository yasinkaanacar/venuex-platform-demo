import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, MapPin, ShoppingCart, Receipt, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { KPI } from '@/lib/types';

interface KpiCardsProps {
  kpis?: {
    o2oAttribution: KPI;
    locationListings: KPI;
    localInventory: KPI;
    reviewManagement: KPI;
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
      value: kpis?.o2oAttribution?.value || '0x',
      trend: kpis?.o2oAttribution?.trend || '0%',
      previousValue: kpis?.o2oAttribution?.previousValue || '0x'
    },
    {
      id: 'location-engagements',
      title: 'Location Interactions',
      icon: MapPin,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      value: kpis?.locationListings?.value || '0',
      trend: kpis?.locationListings?.trend || '0%',
      previousValue: kpis?.locationListings?.previousValue || '0'
    },
    {
      id: 'local-inventory',
      title: 'Local Inventory',
      icon: ShoppingCart,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      value: kpis?.localInventory?.value || '0%',
      trend: kpis?.localInventory?.trend || '0%',
      previousValue: kpis?.localInventory?.previousValue || '0%'
    },
    {
      id: 'average-rating',
      title: 'Average Star Rating',
      icon: Receipt,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      value: kpis?.reviewManagement?.value || '0.0',
      trend: kpis?.reviewManagement?.trend || '0%',
      previousValue: kpis?.reviewManagement?.previousValue || '0.0'
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
