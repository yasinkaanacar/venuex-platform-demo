import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import funnelImage from '@assets/Screenshot 2025-08-29 at 18.31.46_1756481891401.png';

export default function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Customer Journey Funnel
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Online-to-offline conversion metrics
            </p>
          </div>
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