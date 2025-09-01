import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TopPerformingCampaigns() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Top Performing Campaigns</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="button-view-all-campaigns">
            View All →
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Campaign
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Spend
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ROAS
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Visits
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              <tr className="hover:bg-muted/50" data-testid="row-campaign-summer-sale">
                <td className="py-4 px-4">
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
                <td className="text-center py-4 px-4 text-foreground font-medium">€6687</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">16001.6</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">1437888</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-local-shopping">
                <td className="py-4 px-4">
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
                <td className="text-center py-4 px-4 text-foreground font-medium">€5862</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">11834.5</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">865198</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-store-promo">
                <td className="py-4 px-4">
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
                <td className="text-center py-4 px-4 text-foreground font-medium">€5166</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">13421.9</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">950363</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-visit-drive">
                <td className="py-4 px-4">
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
                <td className="text-center py-4 px-4 text-foreground font-medium">€5052</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">13805.3</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">902542</td>
              </tr>
              <tr className="hover:bg-muted/50" data-testid="row-campaign-gen-z">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">🎵</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Gen Z Store Discovery</div>
                      <div className="text-sm text-muted-foreground">tiktok-ads</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium">€2103</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">8093.4</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">272188</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}