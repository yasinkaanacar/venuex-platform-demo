import { Star, MapPin, ShoppingBag, Calendar, Flag, BookOpen, Target, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/contexts/LanguageContext';
import type { Review, ReviewSource, LocationContext, ProductContext } from '@/lib/types/reviews';

interface ReviewDetailProps {
  review: Review | undefined;
  reviewSource: ReviewSource;
  locationContextData: Record<string, LocationContext>;
  productContextData: Record<string, ProductContext>;
}

export default function ReviewDetail({
  review, reviewSource, locationContextData, productContextData,
}: ReviewDetailProps) {
  const { t } = useTranslation();

  if (!review) {
    return (
      <div className="vx-card h-[600px] flex flex-col">
        <div className="vx-card-header flex-shrink-0">
          <h3 className="text-base font-semibold">{t.reviews.detail.title}</h3>
        </div>
        <div className="vx-card-body flex items-center justify-center flex-1">
          <p className="text-gray-500">{t.reviews.detail.selectReview}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vx-card h-[600px] flex flex-col">
      <div className="vx-card-header flex-shrink-0">
        <h3 className="text-base font-semibold">{t.reviews.detail.title}</h3>
      </div>
      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
        {/* Selected Review Display */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="font-medium truncate">{review.reviewer}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {reviewSource === 'locations' ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                {review.location}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <ShoppingBag className="w-3 h-3 shrink-0" />
                {review.product} ({review.productSku})
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              {review.date}
            </span>
          </div>
          <p className="text-gray-700">{review.text}</p>
        </div>

        {/* Contextual Snapshot */}
        <div className="rounded-lg bg-slate-500 p-3">
          {reviewSource === 'locations' ? (
            <div>
              <h4 className="font-medium text-white mb-1 flex items-center gap-2 text-sm">
                <MapPin className="w-3 h-3 text-white" />
                {review.location}
              </h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm text-gray-300">{t.reviews.detail.overallRating}:</span>
                  <span className="font-medium text-white text-sm">
                    {locationContextData[review.location]?.overallRating || 4.0}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm text-gray-300">{t.reviews.detail.totalReviews}:</span>
                  <span className="font-medium text-white text-sm">
                    {locationContextData[review.location]?.totalReviews || 150}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm text-gray-300">{t.reviews.detail.topIssue}:</span>
                  <span className="font-medium text-white text-sm">
                    {locationContextData[review.location]?.topNegativeTheme || "Staff Attitude"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-medium text-white mb-1 flex items-center gap-2 text-sm">
                <ShoppingBag className="w-3 h-3 text-white" />
                {review.product}
              </h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm text-gray-300">{t.reviews.detail.skuId}:</span>
                  <span className="font-medium text-white text-sm">
                    {productContextData[review.product]?.sku || review.productSku}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm text-gray-300">{t.reviews.detail.overallRating}:</span>
                  <span className="font-medium text-white text-sm">
                    {productContextData[review.product]?.overallRating || 4.0}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <span className="text-sm text-gray-300">{t.reviews.detail.topIssue}:</span>
                  <span className="font-medium text-white text-sm">
                    {productContextData[review.product]?.topNegativeTheme || "Quality"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reply Section */}
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{t.reviews.detail.writeReply}</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="!border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white hover:!border-red-600 [&_svg]:text-red-600 hover:[&_svg]:text-white"
              >
                <Flag className="w-4 h-4 mr-2" />
                {t.reviews.detail.report}
              </Button>
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                {t.reviews.detail.selectTemplate}
              </Button>
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4 mr-2" />
                {t.reviews.detail.aiSuggestion}
              </Button>
            </div>
          </div>

          <Textarea placeholder={t.reviews.detail.replyPlaceholder} className="min-h-[100px]" />

          <div className="flex justify-end gap-2">
            <Button variant="outline">{t.reviews.detail.saveDraft}</Button>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              {t.reviews.detail.send}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
