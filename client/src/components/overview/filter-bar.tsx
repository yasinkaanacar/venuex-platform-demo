import { FilterState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  

  return (
    <div className="sticky top-0 z-50 bg-card rounded-lg border border-border/30 p-3 mb-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Select value={filters.platform} onValueChange={(value) => updateFilter('platform', value)}>
            <SelectTrigger data-testid="select-platform">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Platforms">All Platforms</SelectItem>
              <SelectItem value="Google">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-xs text-white font-bold">G</span>
                  </div>
                  Google
                </div>
              </SelectItem>
              <SelectItem value="Meta">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-xs text-white font-bold">f</span>
                  </div>
                  Meta
                </div>
              </SelectItem>
              <SelectItem value="TikTok">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                    <span className="text-xs text-white font-bold">🎵</span>
                  </div>
                  TikTok
                </div>
              </SelectItem>
              <SelectItem value="Apple">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs text-white font-bold">🍎</span>
                  </div>
                  Apple
                </div>
              </SelectItem>
              <SelectItem value="Yandex">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-xs text-white font-bold">Y</span>
                  </div>
                  Yandex
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
            <SelectTrigger data-testid="select-date-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 30 days">Last 30 days</SelectItem>
              <SelectItem value="Last 90 days">Last 90 days</SelectItem>
              <SelectItem value="Custom range">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>



        
      </div>
    </div>
  );
}
