import { FilterState } from '@/lib/types';


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
        <select 
          value={filters.dateRange} 
          onChange={(e) => updateFilter('dateRange', e.target.value)}
          data-testid="select-date-range"
          className="border border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600 w-40 px-3 py-2 rounded-md text-sm"
          style={{ backgroundColor: '#f9fafb' }}
        >
          <option value="Last 7 days">Last 7 days</option>
          <option value="Last 30 days">Last 30 days</option>
          <option value="Last 90 days">Last 90 days</option>
          <option value="Custom range">Custom range</option>
        </select>
      </div>
    </div>
  );
}
