import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Target, Zap, MapPin } from "lucide-react";
import { useState } from "react";

interface Recommendation {
  id: number;
  text: string;
  roas: string;
  confidence: number;
  category: "budget" | "targeting" | "bidding" | "creative";
  region: string;
}

const defaultRecommendations: Recommendation[] = [
  { id: 1, text: "Move 15% from Meta to Google in Istanbul", roas: "+12%", confidence: 82, category: "budget", region: "Istanbul" },
  { id: 2, text: "Increase bid on high-converting Ankara stores by 20%", roas: "+8%", confidence: 78, category: "bidding", region: "Ankara" },
  { id: 3, text: "Shift 10% budget to evening hours in Izmir", roas: "+15%", confidence: 85, category: "targeting", region: "Izmir" },
];

const categoryIcons = {
  budget: TrendingUp,
  targeting: Target,
  bidding: Zap,
  creative: MapPin,
};

interface AIRecommendationCardProps {
  recommendations?: Recommendation[];
  title?: string;
}

export function AIRecommendationCard({ 
  recommendations = defaultRecommendations,
  title = "AI Recommendations"
}: AIRecommendationCardProps) {
  const [items, setItems] = useState<Recommendation[]>(recommendations);

  const handleApply = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleDismiss = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Card className="bg-[#f9fafb] shadow-none border border-gray-200" data-testid="card-ai-recommendations">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </div>
          {items.length > 0 && (
            <span className="text-xs text-gray-500">{items.length} pending</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => {
            const CategoryIcon = categoryIcons[item.category];
            return (
              <div 
                key={item.id}
                className="bg-[#00a0e3] rounded-lg p-4"
                data-testid={`recommendation-${item.id}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CategoryIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium leading-snug">
                      "{item.text}: {item.roas} incremental ROAS, {item.confidence}% confidence."
                    </p>
                    <p className="text-white/70 text-xs mt-1">{item.region}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApply(item.id)}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-4 h-7"
                    data-testid={`button-apply-${item.id}`}
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDismiss(item.id)}
                    className="bg-[#9b4d4d] hover:bg-[#8b3d3d] text-white text-xs px-4 h-7"
                    data-testid={`button-dismiss-${item.id}`}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            No pending recommendations
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AIRecommendationCard;
