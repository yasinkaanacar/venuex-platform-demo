import { Store, User } from 'lucide-react';

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
    <header className="bg-card border-b-2 border-border sticky top-0 z-50 shadow-sm h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center bg-[#f9fafb]">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <div className="p-2">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">Dashboard
</h1>
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
