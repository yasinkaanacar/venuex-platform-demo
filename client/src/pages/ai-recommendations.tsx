import { AIRecommendationCard } from "@/components/ai-recommendation-card";
import { useState } from "react";
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';

const recommendations = [
  "Move 15% from Meta to Google in Istanbul: +12% incremental ROAS, 82% confidence.",
  "Increase bid on high-converting Ankara stores by 20%: +8% incremental ROAS, 78% confidence.",
  "Shift 10% budget to evening hours in Izmir: +15% incremental ROAS, 85% confidence.",
];

export default function AIRecommendations() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const handleNext = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setAllDone(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto py-16 px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-page-title">
            From Reporting to Action
          </h1>
          <p className="text-base text-gray-600" data-testid="text-page-subtitle">
            Clear recommendations and confidence by platform, campaign, region & store, not just charts
          </p>
        </div>

        {/* AI Recommendation */}
        {!allDone ? (
          <AIRecommendationCard
            key={currentIndex}
            recommendation={recommendations[currentIndex]}
            onApply={handleNext}
            onDismiss={handleNext}
          />
        ) : (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600 text-sm">You've reviewed all current recommendations.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Copyright © VenueX. Confidential and proprietary
          </p>
          <img src={venueXLogo} alt="VenueX" className="h-8 w-8 object-contain" />
        </div>
      </div>
    </div>
  );
}
