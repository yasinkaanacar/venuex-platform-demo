import { Store, User, Check } from 'lucide-react';
import { Tooltip } from '@mui/material';

interface HeaderProps {
  lastSync?: string;
  title?: string;
}

export default function Header({ lastSync, title = "Dashboard" }: HeaderProps) {
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
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center bg-[#f9fafb]">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <div className="p-2">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">{title}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                {/* Step 1 - Completed */}
                <Tooltip title="İşletme Profili" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </Tooltip>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                
                {/* Step 2 - Completed */}
                <Tooltip title="Satışlar ve Offline Conversion" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </Tooltip>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                
                {/* Step 3 - Pending */}
                <Tooltip title="İşletme Profili" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                  <div className="w-6 h-6 border border-gray-400 bg-white rounded-full"></div>
                </Tooltip>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                
                {/* Step 4 - Pending */}
                <Tooltip title="Satışlar ve Offline Conversion" arrow componentsProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
                  <div className="w-6 h-6 border border-gray-400 bg-white rounded-full"></div>
                </Tooltip>
              </div>
              <div className="text-xs text-gray-500 mt-2">VenueX Kurulum</div>
            </div>
              <div className="w-4"></div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium" data-testid="text-user-name">Kürşad Arman</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
