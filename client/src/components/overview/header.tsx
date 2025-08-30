import { Store, User } from 'lucide-react';
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';

interface HeaderProps {
  lastSync?: string;
}

export default function Header({ lastSync }: HeaderProps) {
  const formatSyncTime = (timestamp?: string) => {
    if (!timestamp) return 'No sync data';
    
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - syncTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={venueXLogo} 
              alt="VenueX Logo" 
              className="w-10 h-10 object-contain"
              data-testid="img-venuex-logo"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">VenueX</h1>
              <p className="text-sm text-muted-foreground">Overview Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span data-testid="text-last-sync">
                Last sync: {formatSyncTime(lastSync)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium" data-testid="text-user-name">
                Sarah Johnson
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
