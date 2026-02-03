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
          className="border border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600 w-40 pl-3 pr-10 py-2 rounded-md text-sm appearance-none bg-no-repeat bg-right"
          style={{
            backgroundColor: '#f9fafb',
            backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0ibTQgNiA0IDQgNC00IiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==")',
            backgroundPosition: 'right 8px center',
            backgroundSize: '16px 16px'
          }}
        >
          <option value="Last 30 days">Last 30 days</option>
          <option value="Last 90 days">Last 90 days</option>
          <option value="Custom range">Custom range</option>
        </select>
      </div>
    </div>
  );
}
