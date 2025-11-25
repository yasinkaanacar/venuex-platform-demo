import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";
import { useState } from "react";

interface AIRecommendationCardProps {
  recommendation: string;
  onApply?: () => void;
  onDismiss?: () => void;
}

export function AIRecommendationCard({ 
  recommendation, 
  onApply, 
  onDismiss 
}: AIRecommendationCardProps) {
  const [status, setStatus] = useState<'pending' | 'applied' | 'dismissed'>('pending');

  const handleApply = () => {
    setStatus('applied');
    onApply?.();
  };

  const handleDismiss = () => {
    setStatus('dismissed');
    onDismiss?.();
  };

  if (status !== 'pending') {
    return null;
  }

  return (
    <div className="text-center">
      {/* AI Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <Card className="bg-[#00a0e3] border-none shadow-lg" data-testid="card-ai-recommendation">
        <CardContent className="p-6">
          <p className="text-lg text-white font-medium text-center mb-6 leading-relaxed" data-testid="text-ai-recommendation">
            "{recommendation}"
          </p>
          
          <div className="flex justify-center gap-3">
            <Button
              onClick={handleApply}
              className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 text-sm font-medium rounded-md min-w-[100px]"
              data-testid="button-ai-apply"
            >
              Apply
            </Button>
            <Button
              onClick={handleDismiss}
              className="bg-[#9b4d4d] hover:bg-[#8b3d3d] text-white px-6 py-2 text-sm font-medium rounded-md min-w-[100px]"
              data-testid="button-ai-dismiss"
            >
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIRecommendationCard;
