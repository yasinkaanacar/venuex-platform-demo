import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, TrendingUp, Target, MapPin, BarChart3 } from "lucide-react";
import { useState } from "react";
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';

interface Recommendation {
  id: number;
  text: string;
  incrementalROAS: string;
  confidence: number;
  category: "budget" | "targeting" | "creative" | "bidding";
  applied: boolean;
  dismissed: boolean;
}

const initialRecommendations: Recommendation[] = [
  {
    id: 1,
    text: "Move 15% from Meta to Google in Istanbul: +12% incremental ROAS, 82% confidence.",
    incrementalROAS: "+12%",
    confidence: 82,
    category: "budget",
    applied: false,
    dismissed: false
  },
  {
    id: 2,
    text: "Increase bid on high-converting Ankara stores by 20%: +8% incremental ROAS, 78% confidence.",
    incrementalROAS: "+8%",
    confidence: 78,
    category: "bidding",
    applied: false,
    dismissed: false
  },
  {
    id: 3,
    text: "Shift 10% budget to evening hours in Izmir: +15% incremental ROAS, 85% confidence.",
    incrementalROAS: "+15%",
    confidence: 85,
    category: "targeting",
    applied: false,
    dismissed: false
  },
  {
    id: 4,
    text: "Reallocate underperforming Bursa campaigns to Antalya: +6% incremental ROAS, 74% confidence.",
    incrementalROAS: "+6%",
    confidence: 74,
    category: "budget",
    applied: false,
    dismissed: false
  }
];

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);

  const handleApply = (id: number) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, applied: true } : rec)
    );
  };

  const handleDismiss = (id: number) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, dismissed: true } : rec)
    );
  };

  const activeRecommendations = recommendations.filter(r => !r.applied && !r.dismissed);
  const appliedRecommendations = recommendations.filter(r => r.applied);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-16 px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
            From Reporting to Action
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="text-page-subtitle">
            Clear recommendations and confidence by platform, campaign, region & store, not just charts
          </p>
        </div>

        {/* AI Icon */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          {activeRecommendations.map((recommendation) => (
            <Card 
              key={recommendation.id} 
              className="bg-[#00a0e3] border-none shadow-lg overflow-hidden"
              data-testid={`card-recommendation-${recommendation.id}`}
            >
              <CardContent className="p-8">
                <p className="text-xl text-white font-medium text-center mb-8 leading-relaxed" data-testid={`text-recommendation-${recommendation.id}`}>
                  "{recommendation.text}"
                </p>
                
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => handleApply(recommendation.id)}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 text-base font-medium rounded-md min-w-[120px]"
                    data-testid={`button-apply-${recommendation.id}`}
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={() => handleDismiss(recommendation.id)}
                    className="bg-[#9b4d4d] hover:bg-[#8b3d3d] text-white px-8 py-3 text-base font-medium rounded-md min-w-[120px]"
                    data-testid={`button-dismiss-${recommendation.id}`}
                  >
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeRecommendations.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">You've reviewed all current recommendations.</p>
            </div>
          )}
        </div>

        {/* Applied Recommendations Summary */}
        {appliedRecommendations.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Applied Recommendations ({appliedRecommendations.length})
            </h3>
            <div className="space-y-3">
              {appliedRecommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200"
                  data-testid={`applied-recommendation-${rec.id}`}
                >
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700">{rec.text}</p>
                  <span className="ml-auto text-sm font-medium text-green-600">{rec.incrementalROAS} ROAS</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Copyright © VenueX. Confidential and proprietary
          </p>
          <img 
            src={venueXLogo} 
            alt="VenueX" 
            className="h-10 w-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
