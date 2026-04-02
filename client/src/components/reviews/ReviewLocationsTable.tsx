import { useState, useMemo } from 'react';
import { Star, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/contexts/LanguageContext';
import { TableEmptyState } from '@/components/shared/table-states';
import type { ReviewLocationData, SortDirection } from '@/lib/types/reviews';

interface ReviewLocationsTableProps {
  locations: ReviewLocationData[];
  onLocationClick: (code: string) => void;
}

export default function ReviewLocationsTable({ locations, onLocationClick }: ReviewLocationsTableProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    const q = searchQuery.toLowerCase();
    return locations.filter((loc) =>
      loc.code.toLowerCase().includes(q) ||
      loc.name.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      loc.sublocation.toLowerCase().includes(q)
    );
  }, [locations, searchQuery]);

  const sortedLocations = useMemo(() => {
    if (!sortField) return filteredLocations;
    return [...filteredLocations].sort((a, b) => {
      const aValue = (a as any)[sortField];
      const bValue = (b as any)[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const cmp = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      const cmp = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredLocations, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const columns = [
    { key: 'code', label: t.reviews.table.storeCode },
    { key: 'name', label: t.reviews.table.storeName },
    { key: 'reviews', label: t.reviews.table.reviews },
    { key: 'rating', label: t.reviews.table.avgRating },
    { key: 'replyRate', label: t.reviews.table.replyRate },
    { key: 'sentiment', label: t.reviews.table.sentiment },
  ];

  return (
    <div className="vx-card">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.reviews?.locations?.searchPlaceholder || 'Mağaza ara...'}
            aria-label={t.reviews?.locations?.searchPlaceholder || 'Mağaza ara'}
            className="pl-10"
          />
        </div>
      </div>
      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="vx-th text-left cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon field={col.key} />
                    </div>
                  </th>
                ))}
                <th className="vx-th text-left">{t.reviews.table.topThemes}</th>
              </tr>
            </thead>
            <tbody>
              {sortedLocations.length === 0 && searchQuery.trim() && (
                <TableEmptyState
                  colSpan={columns.length + 1}
                  title={t.reviews?.locations?.noResults || 'Aramanızla eşleşen mağaza bulunamadı.'}
                  className="py-8"
                />
              )}
              {sortedLocations.map((location) => (
                <tr
                  key={location.code}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onLocationClick(location.code)}
                >
                  <td className="vx-td">
                    <div className="font-mono text-sm text-gray-600">{location.code}</div>
                  </td>
                  <td className="vx-td">
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500 opacity-75">{location.city} / {location.sublocation}</div>
                  </td>
                  <td className="vx-td">
                    <div className="font-medium text-gray-900">{location.reviews.toLocaleString()}</div>
                  </td>
                  <td className="vx-td">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900">{location.rating}</span>
                    </div>
                  </td>
                  <td className="vx-td">
                    <div className="font-medium text-gray-900">{location.replyRate}%</div>
                  </td>
                  <td className="vx-td">
                    <Badge
                      variant={
                        location.sentiment === 'positive_sentiment' ? 'default' :
                        location.sentiment === 'negative_sentiment' ? 'destructive' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {location.sentiment === 'positive_sentiment' ? 'Olumlu' :
                       location.sentiment === 'negative_sentiment' ? 'Olumsuz' :
                       location.sentiment === 'neutral_sentiment' ? 'Nötr' : location.sentiment}
                    </Badge>
                  </td>
                  <td className="vx-td">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm text-gray-700">{location.topPositive}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-sm text-gray-700">{location.topNegative}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
