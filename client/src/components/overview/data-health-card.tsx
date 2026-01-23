import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Chip } from '@mui/material';
import { Alert, AlertTitle } from '@mui/material';
import { Platform, Alert as AlertType } from '@shared/schema';
import { CheckCircle, Clock, XCircle, AlertTriangle, ArrowRight, Database, Store, MapPin, Package, Receipt } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';

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
        return <SiGoogle className="w-3 h-3 text-blue-600" />; // Google proper logo
      case 'meta ads':
        return <SiMeta className="w-3 h-3 text-blue-500" />; // Meta proper logo
      case 'tiktok ads':
        return <SiTiktok className="w-3 h-3 text-black" />; // TikTok proper logo
      case 'apple maps':
        return <SiApple className="w-3 h-3 text-gray-700" />; // Apple proper logo
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
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title="Data Health & Flow"
        subheader="Data flow from source systems through VenueX to platforms"
      />
      
      <CardContent>
        <div className="space-y-6">
          {/* Location Data Flow */}
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">Location Data</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-1">
                  <Store className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-xs text-muted-foreground">Store Systems</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-xs font-bold text-primary">VX</span>
                </div>
                <span className="text-xs text-muted-foreground">VenueX</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mb-1">
                    <span className="text-xs">🟦</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Google</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mb-1">
                    <span className="text-xs">🔷</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Meta</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mb-1">
                    <span className="text-xs">🔘</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Apple</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Data Flow */}
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">Inventory Data</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-600 animate-spin" />
                <span className="text-xs text-yellow-600">Syncing</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-1">
                  <Database className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-xs text-muted-foreground">ERP Systems</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-xs font-bold text-primary">VX</span>
                </div>
                <span className="text-xs text-muted-foreground">VenueX</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mb-1">
                    <span className="text-xs">🟦</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Google</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mb-1">
                    <span className="text-xs">🔷</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Meta</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 bg-black rounded flex items-center justify-center mb-1">
                    <SiTiktok className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-muted-foreground">TikTok</span>
                </div>
              </div>
            </div>
          </div>

          {/* In-Store Sales Data Flow */}
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-sm">In-Store Sales Data</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-1">
                  <Receipt className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-xs text-muted-foreground">POS Systems</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
                  <span className="text-xs font-bold text-primary">VX</span>
                </div>
                <span className="text-xs text-muted-foreground">VenueX</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mb-1">
                    <span className="text-xs">🟦</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Google</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mb-1">
                    <span className="text-xs">🔷</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Meta</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </CardContent>
    </Card>
  );
}
