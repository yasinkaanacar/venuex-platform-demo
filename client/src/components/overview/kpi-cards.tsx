import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DollarSign, MapPin, ShoppingCart, Receipt, Eye, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { KPI, FilterState } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';

interface KpiCardsProps {
  kpis?: {
    o2oAttribution: KPI;
    locationListings: KPI;
    localInventory: KPI;
    reviewManagement: KPI;
  };
  filters: FilterState;
  onFiltersChange: Dispatch<SetStateAction<FilterState>>;
}

export default function KpiCards({ kpis, filters, onFiltersChange }: KpiCardsProps) {
  const cards = [
    {
      id: 'offline-roas',
      title: 'Offline ROAS',
      icon: DollarSign,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      value: kpis?.o2oAttribution?.value || '0x',
      trend: kpis?.o2oAttribution?.trend || '0%',
      previousValue: kpis?.o2oAttribution?.previousValue || '0x',
      hoverMetrics: {
        'Revenue Generated': '$127,340',
        'Ad Spend': '$34,520',
        'Store Visits': '2,847',
        'Conversion Rate': '4.2%',
        'Average Order Value': '$44.75',
        'Attribution Window': '7 days'
      }
    },
    {
      id: 'location-engagements',
      title: 'Location Interactions',
      icon: MapPin,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      value: kpis?.locationListings?.value || '0',
      trend: kpis?.locationListings?.trend || '0%',
      previousValue: kpis?.locationListings?.previousValue || '0',
      hoverMetrics: {
        'Direction Requests': '12,340',
        'Phone Calls': '2,847',
        'Website Clicks': '8,921',
        'Photo Views': '45,672',
        'Review Interactions': '1,234',
        'Hours Viewed': '3,456'
      }
    },
    {
      id: 'local-inventory',
      title: 'Local Inventory',
      icon: ShoppingCart,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      value: kpis?.localInventory?.value || '0%',
      trend: kpis?.localInventory?.trend || '0%',
      previousValue: kpis?.localInventory?.previousValue || '0%',
      hoverMetrics: {
        'Items in Stock': '1,847',
        'Out of Stock': '123',
        'Low Stock Alerts': '45',
        'Reorder Points Set': '892',
        'Inventory Turnover': '8.4x',
        'Stock Accuracy': '97.2%'
      }
    },
    {
      id: 'average-rating',
      title: 'Average Star Rating',
      icon: Receipt,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      value: kpis?.reviewManagement?.value || '0.0',
      trend: kpis?.reviewManagement?.trend || '0%',
      previousValue: kpis?.reviewManagement?.previousValue || '0.0',
      hoverMetrics: {
        'Positive Sentiment': '73.2%',
        'Neutral Sentiment': '18.7%',
        'Negative Sentiment': '8.1%',
        'Emotion Score': '0.84',
        'Satisfaction Index': '87.3%',
        'Recommendation Rate': '76.8%'
      }
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
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const TrendIcon = getTrendIcon(card.trend);
          const Icon = card.icon;
          
          return (
            <Tooltip key={card.id}>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105" data-testid={`card-${card.id}`}>
                  <CardContent className="p-6">
                    {card.id === 'offline-roas' && (
                      <div className="mb-4 flex justify-center">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border shadow-inner max-w-fit">
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'Google' })}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                              filters.platform === 'Google'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                                : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                            }`}
                            data-testid="tab-google"
                          >
                            <div className="w-3.5 h-3.5 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">G</span>
                            </div>
                            Google
                          </button>
                          
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'Meta' })}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                              filters.platform === 'Meta'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                                : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                            }`}
                            data-testid="tab-meta"
                          >
                            <div className="w-3.5 h-3.5 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">f</span>
                            </div>
                            Meta
                          </button>
                          
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'TikTok' })}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                              filters.platform === 'TikTok'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                                : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                            }`}
                            data-testid="tab-tiktok"
                          >
                            <div className="w-3.5 h-3.5 bg-black rounded flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">🎵</span>
                            </div>
                            TikTok
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {card.id === 'location-engagements' && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-0.5 bg-gray-50 dark:bg-gray-800/50 p-0.5 rounded-md w-fit">
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'Google' })}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                              filters.platform === 'Google'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
                            }`}
                            data-testid="tab-google"
                          >
                            <div className="w-3 h-3 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">G</span>
                            </div>
                            Google
                          </button>
                          
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'Apple' })}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                              filters.platform === 'Apple'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
                            }`}
                            data-testid="tab-apple"
                          >
                            <div className="w-3 h-3 bg-gray-800 rounded flex items-center justify-center">
                              <span className="text-[9px] text-white font-bold">🍎</span>
                            </div>
                            Apple
                          </button>
                          
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'Yandex' })}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                              filters.platform === 'Yandex'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
                            }`}
                            data-testid="tab-yandex"
                          >
                            <div className="w-3 h-3 bg-red-600 rounded flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">Y</span>
                            </div>
                            Yandex
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {card.id === 'local-inventory' && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-0.5 bg-gray-50 dark:bg-gray-800/50 p-0.5 rounded-md w-fit">
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'Google' })}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                              filters.platform === 'Google'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
                            }`}
                            data-testid="tab-google"
                          >
                            <div className="w-3 h-3 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">G</span>
                            </div>
                            Google
                          </button>
                          
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'Meta' })}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                              filters.platform === 'Meta'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
                            }`}
                            data-testid="tab-meta"
                          >
                            <div className="w-3 h-3 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">f</span>
                            </div>
                            Meta
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {card.id === 'average-rating' && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-0.5 bg-gray-50 dark:bg-gray-800/50 p-0.5 rounded-md w-fit">
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'Google' })}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                              filters.platform === 'Google'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
                            }`}
                            data-testid="tab-google"
                          >
                            <div className="w-3 h-3 bg-red-500 rounded flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">G</span>
                            </div>
                            Google
                          </button>
                          
                          <button
                            onClick={() => onFiltersChange({ ...filters, platform: 'Yandex' })}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                              filters.platform === 'Yandex'
                                ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
                            }`}
                            data-testid="tab-yandex"
                          >
                            <div className="w-3 h-3 bg-red-600 rounded flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold">Y</span>
                            </div>
                            Yandex
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${card.iconColor}`} />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" data-testid={`button-external-${card.id}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold text-foreground" data-testid={`text-value-${card.id}`}>
                        {card.value}{card.id === 'average-rating' ? ' ⭐' : ''}
                      </div>
                      <div className={`flex items-center space-x-1 text-xs ${getTrendColor(card.trend)}`}>
                        {TrendIcon && <TrendIcon className="w-3 h-3" />}
                        <span data-testid={`text-trend-${card.id}`}>{card.trend}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      vs {card.previousValue} previous period
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="w-64 p-4" side="bottom">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground mb-3">{card.title} Details</h4>
                  {Object.entries(card.hoverMetrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
