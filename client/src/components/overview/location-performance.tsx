import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Location } from '@shared/schema';

interface LocationPerformanceProps {
  locations?: Location[];
}

export default function LocationPerformance({ locations = [] }: LocationPerformanceProps) {
  // Mock alerts and notifications data
  const alerts = [
    {
      id: '1',
      type: 'warning',
      icon: AlertTriangle,
      title: 'Data sync delay detected',
      description: 'Meta Ads data is 15 minutes behind schedule',
      timestamp: '11 minutes ago',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600'
    },
    {
      id: '2',
      type: 'success',
      icon: CheckCircle,
      title: 'Data enrichment completed',
      description: '47 location profiles updated with new attributes',
      timestamp: '11 minutes ago',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600'
    },
    {
      id: '3',
      type: 'error',
      icon: AlertCircle,
      title: 'API rate limit warning',
      description: 'Google Ads API approaching rate limit (85% used)',
      timestamp: '11 minutes ago',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Alerts & Notifications
            </CardTitle>
          </div>
          
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="button-view-all-alerts">
            View all
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <div 
                key={alert.id}
                className={`flex items-start justify-between p-4 rounded-lg border ${alert.bgColor} ${alert.borderColor}`}
                data-testid={`alert-${alert.id}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${alert.iconColor} mt-0.5`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {alert.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {alert.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {alert.timestamp}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  data-testid={`close-alert-${alert.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
