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
    <div className="flex justify-end mb-4">
      <div className="w-fit">
        <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
          <SelectTrigger 
            data-testid="select-date-range" 
            className="border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600 w-40" 
            style={{ backgroundColor: '#f9fafb' }}
          >
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
  );
}
