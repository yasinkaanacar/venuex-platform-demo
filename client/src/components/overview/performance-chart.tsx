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
    <Card className="bg-[#fcfcfc]">
      <CardHeader
        className="bg-[#f3f4f6]"
        title="Online-to-Offline Conversion Funnel"
        subheader="Conversion metrics from digital channels to physical store"
        action={
          <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium" data-testid="button-view-all-funnel">
            View All →
          </Button>
        }
      />
      <CardContent>
        <div className="mb-4 flex justify-center">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-fit">
            <button
              onClick={() => onFiltersChange({ ...filters, platform: 'Google' })}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                filters.platform === 'Google'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-google"
            >
              <div className="w-3.5 h-3.5 bg-red-500 rounded flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">G</span>
              </div>
              Google
            </button>
            
            <button
              onClick={() => onFiltersChange({ ...filters, platform: 'Meta' })}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                filters.platform === 'Meta'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-meta"
            >
              <div className="w-3.5 h-3.5 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">f</span>
              </div>
              Meta
            </button>
            
            <button
              onClick={() => onFiltersChange({ ...filters, platform: 'TikTok' })}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                filters.platform === 'TikTok'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-tiktok"
            >
              <div className="w-3.5 h-3.5 bg-black rounded flex items-center justify-center">
                <SiTiktok className="w-2.5 h-2.5 text-white" />
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