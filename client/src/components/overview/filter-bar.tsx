import { FilterState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const formatDateRange = (range: string) => {
    const today = new Date();
    switch (range) {
      case 'Last 7 days':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return `${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'Last 30 days':
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return `${monthAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'Last 90 days':
        const quarterAgo = new Date(today);
        quarterAgo.setDate(quarterAgo.getDate() - 90);
        return `${quarterAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      default:
        return 'Custom range';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
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

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Platform</label>
          <Select value={filters.platform} onValueChange={(value) => updateFilter('platform', value)}>
            <SelectTrigger data-testid="select-platform">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Platforms">All Platforms</SelectItem>
              <SelectItem value="Google Ads">Google Ads</SelectItem>
              <SelectItem value="Meta Ads">Meta Ads</SelectItem>
              <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
              <SelectItem value="Apple Maps">Apple Maps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
            <SelectTrigger data-testid="select-location">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Locations">All Locations</SelectItem>
              <SelectItem value="New York - Manhattan">New York - Manhattan</SelectItem>
              <SelectItem value="Los Angeles - Beverly Hills">Los Angeles - Beverly Hills</SelectItem>
              <SelectItem value="Chicago - Downtown">Chicago - Downtown</SelectItem>
              <SelectItem value="Miami - Brickell">Miami - Brickell</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Campaign</label>
          <Select value={filters.campaign} onValueChange={(value) => updateFilter('campaign', value)}>
            <SelectTrigger data-testid="select-campaign">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Campaigns">All Campaigns</SelectItem>
              <SelectItem value="Holiday Collection 2024">Holiday Collection 2024</SelectItem>
              <SelectItem value="Local Store Visits">Local Store Visits</SelectItem>
              <SelectItem value="Product Discovery">Product Discovery</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button className="w-full" data-testid="button-apply-filters">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="compare"
              checked={filters.compareMode}
              onCheckedChange={(checked) => updateFilter('compareMode', !!checked)}
              data-testid="checkbox-compare-mode"
            />
            <label htmlFor="compare" className="text-sm font-medium text-foreground">
              Compare to previous period
            </label>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing data for{' '}
          <span className="font-medium text-foreground" data-testid="text-date-range-display">
            {formatDateRange(filters.dateRange)}
          </span>
        </div>
      </div>
    </div>
  );
}
