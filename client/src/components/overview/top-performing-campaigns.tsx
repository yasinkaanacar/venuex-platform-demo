import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { FilterState } from '@/lib/types';
import { Dispatch, SetStateAction, useState } from 'react';

interface TopPerformingCampaignsProps {
  filters: FilterState;
  onFiltersChange: Dispatch<SetStateAction<FilterState>>;
}

export default function TopPerformingCampaigns({ filters, onFiltersChange }: TopPerformingCampaignsProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  return (
    <Card className="bg-[#fcfcfc]">
      <CardHeader
        className="bg-[#f9fafb]"
        title="Top Performing Campaigns"
        subheader="Spend, Roas, Visits, Purchase by campaign"
        action={
          <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium" data-testid="button-view-all-campaigns">
            View All →
          </Button>
        }
      />
      
      <CardContent className="bg-[#f9fafb]">
        <div className="mb-4 flex justify-center">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-fit">
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
                <SiTiktok className="w-2.5 h-2.5 text-white" />
              </div>
              TikTok
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('campaign')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Campaign
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('impressions')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Impressions
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('ctv')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    CTV (Click to Visit)
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('spend')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Spend
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('roas')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    ROAS
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border/30">
                  <button 
                    onClick={() => handleSort('visits')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Visits
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('purchases')}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
                  >
                    Purchases
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              <tr className="hover:bg-muted/50" data-testid="row-campaign-summer-sale">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">G</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Summer Sale 2024</div>
                      <div className="text-sm text-muted-foreground">google-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">142,580</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">3.4%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$16,350</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">4.2x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">24,387</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">1,247</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-local-shopping">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">G</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Local Shopping Campaign</div>
                      <div className="text-sm text-muted-foreground">google-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">118,420</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">2.9%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$15,420</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">3.8x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">18,652</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">923</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-store-promo">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">f</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Local Store Promo</div>
                      <div className="text-sm text-muted-foreground">meta-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">89,670</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">4.1%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$12,840</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">5.1x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">16,234</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">785</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-visit-drive">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">f</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Store Visit Drive</div>
                      <div className="text-sm text-muted-foreground">meta-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">135,240</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">3.7%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$18,960</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">3.6x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">21,089</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">634</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-gen-z">
                <td className="py-4 px-4 border-r border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0">
                      <SiTiktok className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Gen Z Store Discovery</div>
                      <div className="text-sm text-muted-foreground">tiktok-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">78,950</td>
                <td className="text-center py-4 px-4 text-muted-foreground border-r border-border/30">2.8%</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">$8,920</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">2.9x</td>
                <td className="text-center py-4 px-4 text-foreground font-medium border-r border-border/30">12,473</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">298</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}