// UI components removed - using plain HTML elements
import { DollarSign, MapPin, ShoppingCart, Receipt, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import { KPI, FilterState } from '@/lib/types';
import { Dispatch, SetStateAction, useState } from 'react';

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
  // Individual platform states for each card to work independently
  const [offlineRoasPlatform, setOfflineRoasPlatform] = useState<string>('Google');
  const [locationEngagementsPlatform, setLocationEngagementsPlatform] = useState<string>('Google');
  const [localInventoryPlatform, setLocalInventoryPlatform] = useState<string>('Google');
  const [averageRatingPlatform, setAverageRatingPlatform] = useState<string>('Google');

  const cards = [
    {
      id: 'offline-roas',
      title: 'Offline ROAS',
      icon: DollarSign,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
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
      title: 'Average Rating',
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const TrendIcon = getTrendIcon(card.trend);
        const Icon = card.icon;
        
        return (
        <div key={card.id} className="bg-[#f9fafb] shadow-none hover:shadow-sm transition-all duration-200 cursor-pointer hover:scale-105 rounded-lg border border-gray-200" data-testid={`card-${card.id}`}>
                {/* Platform tabs at the top */}
                {card.id === 'offline-roas' && (
                  <div className="p-3 pb-0 flex justify-center bg-[#f9fafb] rounded-t-lg">
                    <div className="flex items-center dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-full bg-[#ffffff]">
                      <button
                        onClick={() => setOfflineRoasPlatform('Google')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          offlineRoasPlatform === 'Google'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-google"
                      >
                        <div className="w-3.5 h-3.5 bg-[#EA4335] rounded flex items-center justify-center">
                          <SiGoogle className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="hidden 2xl:inline">Google</span>
                      </button>
                      
                      <button
                        onClick={() => setOfflineRoasPlatform('Meta')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          offlineRoasPlatform === 'Meta'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-meta"
                      >
                        <div className="w-3.5 h-3.5 bg-[#1877F2] rounded flex items-center justify-center">
                          <SiMeta className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="hidden 2xl:inline">Meta</span>
                      </button>
                      
                      <button
                        onClick={() => setOfflineRoasPlatform('TikTok')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          offlineRoasPlatform === 'TikTok'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-tiktok"
                      >
                        <div className="w-3.5 h-3.5 bg-black rounded flex items-center justify-center">
                          <SiTiktok className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="hidden 2xl:inline">TikTok</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {card.id === 'location-engagements' && (
                  <div className="p-3 pb-0 flex justify-center bg-[#f9fafb] rounded-t-lg">
                    <div className="flex items-center dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-full bg-[#ffffff]">
                      <button
                        onClick={() => setLocationEngagementsPlatform('Google')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          locationEngagementsPlatform === 'Google'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-google"
                      >
                        <div className="w-3.5 h-3.5 bg-[#EA4335] rounded flex items-center justify-center">
                          <SiGoogle className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="hidden 2xl:inline">Google</span>
                      </button>
                      
                      <button
                        onClick={() => setLocationEngagementsPlatform('Apple')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          locationEngagementsPlatform === 'Apple'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-apple"
                      >
                        <div className="w-3.5 h-3.5 bg-black rounded flex items-center justify-center">
                          <SiApple className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="hidden 2xl:inline">Apple</span>
                      </button>
                      
                      <button
                        onClick={() => setLocationEngagementsPlatform('Yandex')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          locationEngagementsPlatform === 'Yandex'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-yandex"
                      >
                        <div className="w-3.5 h-3.5 bg-red-600 rounded flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold">Y</span>
                        </div>
                        <span className="hidden 2xl:inline">Yandex</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {card.id === 'local-inventory' && (
                  <div className="p-3 pb-0 flex justify-center bg-[#f9fafb] rounded-t-lg">
                    <div className="flex items-center dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-full bg-[#ffffff]">
                      <button
                        onClick={() => setLocalInventoryPlatform('Google')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          localInventoryPlatform === 'Google'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-google"
                      >
                        <div className="w-3.5 h-3.5 bg-[#EA4335] rounded flex items-center justify-center">
                          <SiGoogle className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="hidden 2xl:inline">Google</span>
                      </button>
                      
                      <button
                        onClick={() => setLocalInventoryPlatform('Meta')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          localInventoryPlatform === 'Meta'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-meta"
                      >
                        <div className="w-3.5 h-3.5 bg-[#1877F2] rounded flex items-center justify-center">
                          <SiMeta className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="hidden 2xl:inline">Meta</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {card.id === 'average-rating' && (
                  <div className="p-3 pb-0 flex justify-center bg-[#f9fafb] rounded-t-lg">
                    <div className="flex items-center dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-full bg-[#ffffff]">
                      <button
                        onClick={() => setAverageRatingPlatform('Google')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          averageRatingPlatform === 'Google'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-google"
                      >
                        <div className="w-3.5 h-3.5 bg-[#EA4335] rounded flex items-center justify-center">
                          <SiGoogle className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="hidden 2xl:inline">Google</span>
                      </button>
                      
                      <button
                        onClick={() => setAverageRatingPlatform('Yandex')}
                        className={`flex items-center gap-1.5 px-2 2xl:px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
                          averageRatingPlatform === 'Yandex'
                            ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        data-testid="tab-yandex"
                      >
                        <div className="w-3.5 h-3.5 bg-red-600 rounded flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold">Y</span>
                        </div>
                        <span className="hidden 2xl:inline">Yandex</span>
                      </button>
                    </div>
                  </div>
                )}

          <div className="p-6 pt-3 bg-[#f9fafb] rounded-b-lg">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground whitespace-nowrap">{card.title}</h3>
              </div>
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
          </div>
        </div>
        );
      })}
    </div>
  );
}
