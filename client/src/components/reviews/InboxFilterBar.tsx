import { forwardRef, useMemo } from 'react';
import { PopoverSelect } from '@/components/ui/popover-select';
import { useTranslation } from '@/contexts/LanguageContext';
import type { ReviewSource, ReplyStatus, SortOrder, CommentFilter, ReviewLocationData } from '@/lib/types/reviews';

interface InboxFilterBarProps {
  reviewSource: ReviewSource;
  onReviewSourceChange: (v: ReviewSource) => void;
  locationFilter: string;
  onLocationFilterChange: (v: string) => void;
  productFilter: string;
  onProductFilterChange: (v: string) => void;
  replyStatusFilter: ReplyStatus;
  onReplyStatusFilterChange: (v: ReplyStatus) => void;
  ratingFilter: string;
  onRatingFilterChange: (v: string) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (v: SortOrder) => void;
  commentFilter: CommentFilter;
  onCommentFilterChange: (v: CommentFilter) => void;
  themeFilter: string;
  onThemeFilterChange: (v: string) => void;
  storeSetFilter: string;
  onStoreSetFilterChange: (v: string) => void;
  locations: ReviewLocationData[];
}

const InboxFilterBar = forwardRef<HTMLDivElement, InboxFilterBarProps>(({
  reviewSource, onReviewSourceChange,
  locationFilter, onLocationFilterChange,
  productFilter, onProductFilterChange,
  replyStatusFilter, onReplyStatusFilterChange,
  ratingFilter, onRatingFilterChange,
  sortOrder, onSortOrderChange,
  commentFilter, onCommentFilterChange,
  themeFilter, onThemeFilterChange,
  storeSetFilter, onStoreSetFilterChange,
  locations,
}, ref) => {
  const { t } = useTranslation();

  const sourceOptions = useMemo(() => [
    { value: 'locations', label: t.reviews.filters.locations },
    { value: 'products', label: t.reviews.filters.products },
  ], [t]);

  const locationOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allLocations },
    ...locations.slice(0, 10).map((loc) => ({ value: loc.code, label: loc.name })),
  ], [t, locations]);

  const productOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allProducts },
    { value: 'running-shoes', label: 'Running Shoes' },
    { value: 'winter-coat', label: 'Winter Coat' },
    { value: 'coffee-maker', label: 'Coffee Maker' },
    { value: 'wireless-headphones', label: 'Wireless Headphones' },
    { value: 'smartphone-case', label: 'Smartphone Case' },
    { value: 'laptop-bag', label: 'Laptop Bag' },
    { value: 'yoga-mat', label: 'Yoga Mat' },
    { value: 'kitchen-knife', label: 'Kitchen Knife' },
    { value: 'desk-lamp', label: 'Desk Lamp' },
    { value: 'bluetooth-speaker', label: 'Bluetooth Speaker' },
  ], [t]);

  const statusOptions = useMemo(() => [
    { value: 'UNANSWERED', label: t.reviews.filters.unreplied },
    { value: 'ANSWERED', label: t.reviews.filters.replied },
    { value: 'all', label: t.reviews.filters.all },
  ], [t]);

  const ratingOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allRatings },
    { value: '5', label: `5 ${t.reviews.filters.stars}` },
    { value: '4', label: `4 ${t.reviews.filters.stars}` },
    { value: '3', label: `3 ${t.reviews.filters.stars}` },
    { value: '2', label: `2 ${t.reviews.filters.stars}` },
    { value: '1', label: `1 ${t.reviews.filters.star}` },
  ], [t]);

  const sortOptions = useMemo(() => [
    { value: 'latest', label: t.reviews.filters.latest },
    { value: 'oldest', label: t.reviews.filters.oldest },
  ], [t]);

  const commentOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.all },
    { value: 'with-comment', label: t.reviews.filters.withComment },
    { value: 'rating-only', label: t.reviews.filters.ratingOnly },
  ], [t]);

  const themeOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allThemes },
    { value: 'staff-service', label: 'Staff Service' },
    { value: 'product-quality', label: 'Product Quality' },
    { value: 'store-design', label: 'Store Design' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'wait-time', label: 'Wait Time' },
    { value: 'parking', label: 'Parking' },
  ], [t]);

  const storeSetOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allStoreSets },
    { value: 'smr', label: 'SMR' },
    { value: 'premium', label: 'Premium' },
    { value: 'express', label: 'Express' },
    { value: 'standard', label: 'Standard' },
    { value: 'regional', label: 'Regional' },
  ], [t]);

  return (
    <div className="vx-card" ref={ref}>
      <div className="vx-surface-muted">
        <div className="px-6 py-3">
          <div className="vx-filter-row">
            <PopoverSelect
              options={sourceOptions}
              value={reviewSource}
              onValueChange={(v) => onReviewSourceChange(v as ReviewSource)}
              triggerLabel={t.reviews.filters.source}
            />

            {reviewSource === 'locations' ? (
              <PopoverSelect
                options={locationOptions}
                value={locationFilter}
                onValueChange={onLocationFilterChange}
                triggerLabel={t.reviews.filters.location}
                popoverWidth="w-[240px]"
              />
            ) : (
              <PopoverSelect
                options={productOptions}
                value={productFilter}
                onValueChange={onProductFilterChange}
                triggerLabel={t.reviews.filters.product}
                popoverWidth="w-[240px]"
              />
            )}

            <PopoverSelect
              options={statusOptions}
              value={replyStatusFilter}
              onValueChange={(v) => onReplyStatusFilterChange(v as ReplyStatus)}
              triggerLabel={t.reviews.filters.status}
            />

            <PopoverSelect
              options={ratingOptions}
              value={ratingFilter}
              onValueChange={onRatingFilterChange}
              triggerLabel={t.reviews.filters.rating}
            />

            <PopoverSelect
              options={sortOptions}
              value={sortOrder}
              onValueChange={(v) => onSortOrderChange(v as SortOrder)}
              triggerLabel={t.reviews.filters.sort}
            />

            <PopoverSelect
              options={commentOptions}
              value={commentFilter}
              onValueChange={(v) => onCommentFilterChange(v as CommentFilter)}
              triggerLabel={t.reviews.filters.comment}
            />

            <PopoverSelect
              options={themeOptions}
              value={themeFilter}
              onValueChange={onThemeFilterChange}
              triggerLabel={t.reviews.filters.theme}
            />

            <PopoverSelect
              options={storeSetOptions}
              value={storeSetFilter}
              onValueChange={onStoreSetFilterChange}
              triggerLabel={t.reviews.filters.storeSet}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

InboxFilterBar.displayName = 'InboxFilterBar';
export default InboxFilterBar;
