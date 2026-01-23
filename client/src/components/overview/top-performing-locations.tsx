// UI components removed - using plain HTML elements
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import { FilterState } from '@/lib/types';
import { Dispatch, SetStateAction, useState } from 'react';

interface TopPerformingLocationsProps {
  filters: FilterState;
  onFiltersChange: Dispatch<SetStateAction<FilterState>>;
}

export default function TopPerformingLocations({ filters, onFiltersChange }: TopPerformingLocationsProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  // Individual platform state for this component to work independently
  const [topLocationsePlatform, setTopLocationsPlatform] = useState<string>('Google');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Performing Store Locations</h3>
          <p className="text-sm text-muted-foreground">Store visits and conversions by location</p>
        </div>
        <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-locations">
          View All →
        </button>
      </div>
      <div className="bg-[#f9fafb] p-6">
        <div className="mb-4 flex justify-center">
          <div className="flex items-center dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-fit bg-[#ffffff]">
            <button
              onClick={() => setTopLocationsPlatform('Google')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                topLocationsePlatform === 'Google'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-google"
            >
              <div className="w-3.5 h-3.5 bg-[#EA4335] rounded flex items-center justify-center">
                <SiGoogle className="w-2.5 h-2.5 text-white" />
              </div>
              Google
            </button>
            
            <button
              onClick={() => setTopLocationsPlatform('Meta')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                topLocationsePlatform === 'Meta'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-meta"
            >
              <div className="w-3.5 h-3.5 bg-[#1877F2] rounded flex items-center justify-center">
                <SiMeta className="w-2.5 h-2.5 text-white" />
              </div>
              Meta
            </button>
            
            <button
              onClick={() => setTopLocationsPlatform('TikTok')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                topLocationsePlatform === 'TikTok'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-tiktok"
            >
              <div className="w-3.5 h-3.5 bg-black rounded flex items-center justify-center">
                <SiTiktok className="w-2.5 h-2.5 text-white" />
              </div>
              TikTok
            </button>
            
            <button
              onClick={() => setTopLocationsPlatform('Apple')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                topLocationsePlatform === 'Apple'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-apple"
            >
              <div className="w-3.5 h-3.5 bg-black rounded flex items-center justify-center">
                <SiApple className="w-2.5 h-2.5 text-white" />
              </div>
              Apple
            </button>
            
            <button
              onClick={() => setTopLocationsPlatform('Yandex')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                topLocationsePlatform === 'Yandex'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-yandex"
            >
              <div className="w-3.5 h-3.5 bg-red-600 rounded flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">Y</span>
              </div>
              Yandex
            </button>
          </div>
        </div>
        
        <div>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('location')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Store Location
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('impressions')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Impressions
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('clicks')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Website Clicks
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('calls')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Calls
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('directions')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Directions
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('visits')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Visits
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('sales')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Sales Value
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('purchases')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Purchases
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('ratio')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Visit/Purchases
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-2 border-r border-border/30">
                  <div>
                    <div className="font-medium text-foreground text-sm">Istanbul - Beyoğlu</div>
                    <div className="text-xs text-muted-foreground">İstiklal Caddesi 125</div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">89,420</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">4,821</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">276</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">549</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">2,845</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>$68,712</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+12%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>1,186</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+8%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>2.4x</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+5%</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-2 border-r border-border/30">
                  <div>
                    <div className="font-medium text-foreground text-sm">Ankara - Çankaya</div>
                    <div className="text-xs text-muted-foreground">Tunalı Hilmi Caddesi 89</div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">76,230</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">4,103</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">242</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">514</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">2,371</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>$58,590</span>
                    <div className="flex items-center text-red-600">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-xs">-3%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>987</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+2%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>2.4x</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+7%</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-2 border-r border-border/30">
                  <div>
                    <div className="font-medium text-foreground text-sm">İzmir - Alsancak</div>
                    <div className="text-xs text-muted-foreground">Kordon Caddesi 67</div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">82,155</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">4,427</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">267</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">559</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">2,757</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>$67,536</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+15%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>1,143</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+11%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>2.4x</span>
                    <div className="flex items-center text-red-600">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-xs">-2%</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-2 border-r border-border/30">
                  <div>
                    <div className="font-medium text-foreground text-sm">Bursa - Nilüfer</div>
                    <div className="text-xs text-muted-foreground">Görükle Mahallesi 45</div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">71,845</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">3,927</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">231</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">486</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">2,198</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>$52,340</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+6%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>894</span>
                    <div className="flex items-center text-red-600">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-xs">-1%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>2.5x</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+3%</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-2 border-r border-border/30">
                  <div>
                    <div className="font-medium text-foreground text-sm">Antalya - Muratpaşa</div>
                    <div className="text-xs text-muted-foreground">Lara Caddesi 112</div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">94,672</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">5,183</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">298</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm border-r border-border/30">627</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">3,124</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>$74,890</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+18%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm border-r border-border/30">
                  <div className="flex items-center justify-center gap-1">
                    <span>1,267</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+14%</span>
                    </div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>2.5x</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+9%</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}