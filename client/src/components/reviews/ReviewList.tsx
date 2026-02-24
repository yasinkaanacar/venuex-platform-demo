import { useMemo } from 'react';
import { Star, MapPin, ShoppingBag, Calendar, Inbox } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { getPlatformIcon, parseRelativeDate } from './utils';
import type { Review, ReviewSource, SortOrder, CommentFilter } from '@/lib/types/reviews';

interface ReviewListProps {
  reviews: Review[];
  selectedReviewId: number | null;
  onSelectReview: (id: number) => void;
  reviewSource: ReviewSource;
  ratingFilter: string;
  sortOrder: SortOrder;
  commentFilter: CommentFilter;
}

export default function ReviewList({
  reviews, selectedReviewId, onSelectReview,
  reviewSource, ratingFilter, sortOrder, commentFilter,
}: ReviewListProps) {
  const { t } = useTranslation();
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((review) => {
        if (ratingFilter !== 'all' && review.rating !== parseInt(ratingFilter)) return false;
        if (commentFilter !== 'all') {
          if (commentFilter === 'rating-only' && review.text.length > 50) return false;
          if (commentFilter === 'with-comment' && review.text.length <= 50) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = parseRelativeDate(a.date);
        const dateB = parseRelativeDate(b.date);
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
      })
      .slice(0, 15);
  }, [reviews, ratingFilter, commentFilter, sortOrder]);

  return (
    <div className="vx-card flex flex-col h-[600px]">
      <div className="vx-card-header flex-shrink-0">
        <h3 className="text-base font-semibold">
          {t.reviews.inbox.title}
          <span className="text-gray-500 font-normal ml-1">
            ({filteredReviews.length}{filteredReviews.length < reviews.length ? ` ${t.reviews.inbox.of} ${reviews.length}` : ''})
          </span>
        </h3>
      </div>
      <div className="p-0 flex-1 overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
            <Inbox className="w-10 h-10" />
            <p className="text-sm">{t.reviews.inbox.noReviews}</p>
          </div>
        ) : (
        <div className="h-full overflow-y-auto divide-y divide-gray-100">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${
                review.isNew ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''
              } ${selectedReviewId === review.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : ''}`}
              onClick={() => onSelectReview(review.id)}
            >
              {/* Platform Icon */}
              <div className="absolute top-3 right-3">
                {getPlatformIcon(review.platform)}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                {review.isNew && (
                  <span className="text-xs px-2 py-1 text-white font-medium rounded-sm" style={{ backgroundColor: '#25c55f' }}>NEW</span>
                )}
              </div>
              <div className="font-medium text-sm mb-1">{review.reviewer}</div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-1 whitespace-nowrap">
                {reviewSource === 'locations' ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {review.location}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    {review.product} ({review.productSku})
                  </span>
                )}
                <span className="flex items-center gap-1 ml-3">
                  <Calendar className="w-3 h-3" />
                  <span>{review.date}</span>
                </span>
              </div>
              <div className="text-sm text-gray-700 line-clamp-2">{review.text}</div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
