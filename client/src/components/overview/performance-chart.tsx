import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilterState } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';
import { SiTiktok } from 'react-icons/si';
import funnelImage from '@assets/Screenshot 2025-08-29 at 18.31.46_1756481891401.png';

interface PerformanceChartProps {
  filters: FilterState;
  onFiltersChange: Dispatch<SetStateAction<FilterState>>;
}

export default function PerformanceChart({ filters, onFiltersChange }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader
        title="Online-to-Offline Conversion Funnel"
        subheader="Conversion metrics from digital channels to physical store"
        action={
          <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium" data-testid="button-view-all-funnel">
            View All →
          </Button>
        }
      />
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center space-x-0.5 bg-gray-50 dark:bg-gray-800/50 p-0.5 rounded-md w-fit">
            <button
              onClick={() => onFiltersChange({ ...filters, platform: 'Google' })}
              className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                filters.platform === 'Google'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
              }`}
              data-testid="tab-google"
            >
              <div className="w-3 h-3 bg-red-500 rounded flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">G</span>
              </div>
              Google
            </button>
            
            <button
              onClick={() => onFiltersChange({ ...filters, platform: 'Meta' })}
              className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                filters.platform === 'Meta'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
              }`}
              data-testid="tab-meta"
            >
              <div className="w-3 h-3 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">f</span>
              </div>
              Meta
            </button>
            
            <button
              onClick={() => onFiltersChange({ ...filters, platform: 'TikTok' })}
              className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                filters.platform === 'TikTok'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-gray-700/60'
              }`}
              data-testid="tab-tiktok"
            >
              <div className="w-3 h-3 bg-black rounded flex items-center justify-center">
                <SiTiktok className="w-2 h-2 text-white" />
              </div>
              TikTok
            </button>
          </div>
        </div>
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