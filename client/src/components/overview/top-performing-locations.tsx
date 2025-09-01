import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TopPerformingLocations() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Top Performing Store Locations</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="button-view-all-locations">
            View All →
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Store visits and conversions by location</p>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Store Location
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Impressions
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Calls
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Directions
                </th>
                <th className="text-center py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Sales Value
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Purchases
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              <tr className="hover:bg-muted/50">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-foreground">Istanbul - Beyoğlu</div>
                    <div className="text-sm text-muted-foreground">İstiklal Caddesi 125</div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium">89,420</td>
                <td className="text-center py-4 px-4 text-muted-foreground">276</td>
                <td className="text-center py-4 px-4 text-muted-foreground">549</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">$68,712</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">1,186</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-foreground">Ankara - Çankaya</div>
                    <div className="text-sm text-muted-foreground">Tunalı Hilmi Caddesi 89</div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium">76,230</td>
                <td className="text-center py-4 px-4 text-muted-foreground">242</td>
                <td className="text-center py-4 px-4 text-muted-foreground">514</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">$58,590</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">987</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-foreground">İzmir - Alsancak</div>
                    <div className="text-sm text-muted-foreground">Kordon Caddesi 67</div>
                  </div>
                </td>
                <td className="text-center py-4 px-4 text-foreground font-medium">82,155</td>
                <td className="text-center py-4 px-4 text-muted-foreground">267</td>
                <td className="text-center py-4 px-4 text-muted-foreground">559</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">$67,536</td>
                <td className="text-center py-4 px-4 text-foreground font-medium">1,143</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}