import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Platform, Alert as AlertType } from '@shared/schema';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface DataHealthCardProps {
  platforms?: Platform[];
  alerts?: AlertType[];
}

export default function DataHealthCard({ platforms = [], alerts = [] }: DataHealthCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'syncing':
        return <Clock className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'syncing':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const getPlatformIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'google ads':
        return '🟦'; // Google blue placeholder
      case 'meta ads':
        return '🔷'; // Meta blue placeholder
      case 'tiktok ads':
        return '⚫'; // TikTok black placeholder
      case 'apple maps':
        return '🔘'; // Apple gray placeholder
      default:
        return '📊';
    }
  };

  const formatLastSync = (lastSync?: Date | null) => {
    if (!lastSync) return 'Never synced';
    
    const now = new Date();
    const syncDate = new Date(lastSync);
    const diffInMinutes = Math.floor((now.getTime() - syncDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Data Health & Flow
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Integration status and data freshness
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Healthy</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {platforms.map((platform) => (
            <div 
              key={platform.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              data-testid={`platform-status-${platform.name.toLowerCase().replace(' ', '-')}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-sm">{getPlatformIcon(platform.name)}</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{platform.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Last sync: {formatLastSync(platform.lastSync)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(platform.status)}
                <span className={`text-sm capitalize ${getStatusColor(platform.status)}`}>
                  {platform.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {alerts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-sm font-medium text-foreground mb-2">Active Alerts</div>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
