import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TopPerformingLocations() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Top Performing Store Locations</CardTitle>
          <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium" data-testid="button-view-all-locations">
            View All →
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Store visits and conversions by location</p>
      </CardHeader>
      
      <CardContent>
        <div>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Store Location
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Impressions
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Website Clicks
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Calls
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Directions
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Visits
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Sales Value
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Purchases
                </th>
                <th className="text-center py-2 px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Visit/Purchases
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-2">
                  <div>
                    <div className="font-medium text-foreground text-sm">Istanbul - Beyoğlu</div>
                    <div className="text-xs text-muted-foreground">İstiklal Caddesi 125</div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">89,420</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">4,821</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">276</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">549</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">2,845</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">$68,712</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">1,186</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">2.4x</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-2">
                  <div>
                    <div className="font-medium text-foreground text-sm">Ankara - Çankaya</div>
                    <div className="text-xs text-muted-foreground">Tunalı Hilmi Caddesi 89</div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">76,230</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">4,103</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">242</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">514</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">2,371</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">$58,590</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">987</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">2.4x</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-2">
                  <div>
                    <div className="font-medium text-foreground text-sm">İzmir - Alsancak</div>
                    <div className="text-xs text-muted-foreground">Kordon Caddesi 67</div>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">82,155</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">4,427</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">267</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">559</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">2,757</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">$67,536</td>
                <td className="text-center py-3 px-1 text-foreground font-medium text-sm">1,143</td>
                <td className="text-center py-3 px-1 text-muted-foreground text-sm">2.4x</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}