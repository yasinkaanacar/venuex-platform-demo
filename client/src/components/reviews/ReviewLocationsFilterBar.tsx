import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PopoverSelect } from '@/components/ui/popover-select';
import { useTranslation } from '@/contexts/LanguageContext';
import type { LocationsTabFilters } from '@/lib/types/reviews';

interface ReviewLocationsFilterBarProps {
  filters: LocationsTabFilters;
  onFiltersChange: (updates: Partial<LocationsTabFilters>) => void;
}

const citiesByRegion: Record<string, { value: string; label: string }[]> = {
  marmara: [
    { value: 'istanbul', label: 'Istanbul' },
    { value: 'bursa', label: 'Bursa' },
  ],
  aegean: [
    { value: 'izmir', label: 'Izmir' },
    { value: 'manisa', label: 'Manisa' },
    { value: 'aydin', label: 'Aydın' },
    { value: 'mugla', label: 'Muğla' },
    { value: 'denizli', label: 'Denizli' },
  ],
  central: [
    { value: 'ankara', label: 'Ankara' },
    { value: 'konya', label: 'Konya' },
    { value: 'eskisehir', label: 'Eskişehir' },
    { value: 'kayseri', label: 'Kayseri' },
  ],
  mediterranean: [
    { value: 'antalya', label: 'Antalya' },
    { value: 'adana', label: 'Adana' },
    { value: 'mersin', label: 'Mersin' },
  ],
  blacksea: [
    { value: 'trabzon', label: 'Trabzon' },
    { value: 'samsun', label: 'Samsun' },
  ],
  eastern: [
    { value: 'erzurum', label: 'Erzurum' },
  ],
  southeastern: [
    { value: 'gaziantep', label: 'Gaziantep' },
    { value: 'sanliurfa', label: 'Şanlıurfa' },
    { value: 'diyarbakir', label: 'Diyarbakır' },
    { value: 'van', label: 'Van' },
    { value: 'malatya', label: 'Malatya' },
  ],
};

export default function ReviewLocationsFilterBar({ filters, onFiltersChange }: ReviewLocationsFilterBarProps) {
  const { t } = useTranslation();

  const regionOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allRegions },
    { value: 'marmara', label: 'Marmara' },
    { value: 'aegean', label: 'Ege' },
    { value: 'central', label: 'İç Anadolu' },
    { value: 'mediterranean', label: 'Akdeniz' },
    { value: 'blacksea', label: 'Karadeniz' },
    { value: 'eastern', label: 'Doğu Anadolu' },
    { value: 'southeastern', label: 'Güneydoğu Anadolu' },
  ], [t]);

  const cityOptions = useMemo(() => {
    const cities = filters.region === 'all'
      ? Object.values(citiesByRegion).flat()
      : citiesByRegion[filters.region] || [];
    return [{ value: 'all', label: t.reviews.filters.allCities }, ...cities];
  }, [t, filters.region]);

  const storeSetOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allStoreSets },
    { value: 'smr', label: 'SMR' },
    { value: 'premium', label: 'Premium' },
    { value: 'express', label: 'Express' },
    { value: 'standard', label: 'Standard' },
    { value: 'regional', label: 'Regional' },
  ], [t]);

  const sentimentOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allSentiments },
    { value: 'positive_sentiment', label: t.reviews.positive },
    { value: 'neutral_sentiment', label: t.reviews.neutral },
    { value: 'negative_sentiment', label: t.reviews.negative },
  ], [t]);

  const avgRatingOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allRatings },
    { value: 'excellent', label: 'Mükemmel (4,5+ ★)' },
    { value: 'good', label: 'İyi (4,0 - 4,4 ★)' },
    { value: 'average', label: 'Orta (3,5 - 3,9 ★)' },
    { value: 'poor', label: 'Zayıf (< 3,5 ★)' },
  ], [t]);

  const replyRateOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allReplyRates },
    { value: 'excellent', label: 'Mükemmel (> %95)' },
    { value: 'good', label: 'İyi (%80-94)' },
    { value: 'needs-improvement', label: 'Geliştirilmeli (< %80)' },
  ], [t]);

  return (
    <div className="vx-card">
      <div className="vx-surface-muted">
        <div className="px-6 py-3">
          <div className="vx-filter-row">
            <PopoverSelect
              options={regionOptions}
              value={filters.region}
              onValueChange={(v) => onFiltersChange({ region: v, city: 'all' })}
              triggerLabel={t.reviews.filters.region}
              popoverWidth="w-[240px]"
            />

            <PopoverSelect
              options={cityOptions}
              value={filters.city}
              onValueChange={(v) => onFiltersChange({ city: v })}
              triggerLabel={t.reviews.filters.city}
              popoverWidth="w-[200px]"
            />

            <PopoverSelect
              options={storeSetOptions}
              value={filters.storeSet}
              onValueChange={(v) => onFiltersChange({ storeSet: v })}
              triggerLabel={t.reviews.filters.storeSet}
            />

            <PopoverSelect
              options={sentimentOptions}
              value={filters.sentiment}
              onValueChange={(v) => onFiltersChange({ sentiment: v })}
              triggerLabel={t.reviews.filters.sentiment}
            />

            <PopoverSelect
              options={avgRatingOptions}
              value={filters.avgRating}
              onValueChange={(v) => onFiltersChange({ avgRating: v })}
              triggerLabel={t.reviews.filters.avgRating}
              popoverWidth="w-[220px]"
            />

            <PopoverSelect
              options={replyRateOptions}
              value={filters.replyRate}
              onValueChange={(v) => onFiltersChange({ replyRate: v })}
              triggerLabel={t.reviews.table.replyRate}
              popoverWidth="w-[240px]"
            />

            <div className="flex-1" />

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t.reviews.filters.searchLocation}
                value={filters.search}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
                className="pl-10 w-56 border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
