import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useState } from "react";

interface Recommendation {
  id: number;
  text: string;
  roas: string;
  confidence: number;
}

interface AIRecommendationCardProps {
  recommendations?: Recommendation[];
}

const defaultRecommendations: Recommendation[] = [
  { id: 1, text: "Move 15% from Meta to Google in Istanbul", roas: "+12%", confidence: 82 },
  { id: 2, text: "Increase bid on high-converting Ankara stores by 20%", roas: "+8%", confidence: 78 },
  { id: 3, text: "Shift 10% budget to evening hours in Izmir", roas: "+15%", confidence: 85 },
];

export function AIRecommendationCard({ recommendations = defaultRecommendations }: AIRecommendationCardProps) {
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <CardTitle className="text-base font-semibold">AI Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div 
              key={item.id}
              className="bg-[#00a0e3] rounded-lg p-4"
              data-testid={`recommendation-${item.id}`}
            >
              <p className="text-white text-sm font-medium mb-3">
                "{item.text}: {item.roas} incremental ROAS, {item.confidence}% confidence."
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApply(item.id)}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-4 h-8"
                  data-testid={`button-apply-${item.id}`}
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDismiss(item.id)}
                  className="bg-[#9b4d4d] hover:bg-[#8b3d3d] text-white text-xs px-4 h-8"
                  data-testid={`button-dismiss-${item.id}`}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))
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
