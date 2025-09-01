import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import funnelImage from '@assets/Screenshot 2025-08-29 at 18.31.46_1756481891401.png';

export default function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Online-to-Offline Conversion Funnel</CardTitle>
            <p className="text-sm text-muted-foreground">Conversion metrics from digital channels to physical store
</p>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium" data-testid="button-view-all-funnel">
            View All →
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative" data-testid="chart-performance">
          <img 
            src={funnelImage} 
            alt="Customer Journey Funnel" 
            className="w-full rounded-lg shadow-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}