// UI components removed - using plain HTML elements
import { FilterState } from '@/lib/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import funnelImage from '@assets/Screenshot 2025-08-29 at 18.31.46_1756481891401.png';

interface PerformanceChartProps {
  filters: FilterState;
  onFiltersChange: Dispatch<SetStateAction<FilterState>>;
}

export default function PerformanceChart({ filters, onFiltersChange }: PerformanceChartProps) {
  // Individual platform state for this component to work independently
  const [performanceChartPlatform, setPerformanceChartPlatform] = useState<string>('Google');

  return (
    <div className="bg-[#fcfcfc] rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#f9fafb] p-6 flex justify-between items-center border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Online-to-Offline Conversion Funnel</h3>
          <p className="text-sm text-muted-foreground">Conversion metrics from digital channels to physical store</p>
        </div>
        <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-funnel">
          View All →
        </button>
      </div>
      <div className="bg-[#f9fafb] p-6">
        <div className="mb-4 flex justify-center">
          <div className="flex items-center dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-fit bg-[#ffffff]">
            <button
              onClick={() => setPerformanceChartPlatform('Google')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                performanceChartPlatform === 'Google'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-google"
            >
              <div className="w-3.5 h-3.5 bg-[#EA4335] rounded flex items-center justify-center">
                <SiGoogle className="w-2.5 h-2.5 text-white" />
              </div>
              Google
            </button>
            
            <button
              onClick={() => setPerformanceChartPlatform('Meta')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                performanceChartPlatform === 'Meta'
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              data-testid="tab-meta"
            >
              <div className="w-3.5 h-3.5 bg-[#1877F2] rounded flex items-center justify-center">
                <SiMeta className="w-2.5 h-2.5 text-white" />
              </div>
              Meta
            </button>
            
            <button
              onClick={() => setPerformanceChartPlatform('TikTok')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                performanceChartPlatform === 'TikTok'
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
      </div>
    </div>
  );
}