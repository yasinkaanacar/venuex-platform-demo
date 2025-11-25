import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, TrendingUp, Target, Zap, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { SiGoogle, SiMeta } from 'react-icons/si';

interface Recommendation {
  id: number;
  text: string;
  roas: string;
  confidence: number;
  category: "budget" | "targeting" | "bidding" | "creative";
  platform: "Google" | "Meta" | "All";
  region: string;
}

const allRecommendations: Recommendation[] = [
  { id: 1, text: "Move 15% from Meta to Google in Istanbul", roas: "+12%", confidence: 82, category: "budget", platform: "Google", region: "Istanbul" },
  { id: 2, text: "Increase bid on high-converting Ankara stores by 20%", roas: "+8%", confidence: 78, category: "bidding", platform: "Google", region: "Ankara" },
  { id: 3, text: "Shift 10% budget to evening hours in Izmir", roas: "+15%", confidence: 85, category: "targeting", platform: "All", region: "Izmir" },
  { id: 4, text: "Pause underperforming Bursa campaigns", roas: "+4%", confidence: 91, category: "budget", platform: "Meta", region: "Bursa" },
  { id: 5, text: "Enable location extensions for Antalya stores", roas: "+6%", confidence: 74, category: "creative", platform: "Google", region: "Antalya" },
];

const categoryIcons = {
  budget: TrendingUp,
  targeting: Target,
  bidding: Zap,
  creative: MapPin,
};

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(allRecommendations);
  const [platform, setPlatform] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30d");

  const handleApply = (id: number) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  const handleDismiss = (id: number) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (platform !== "all" && rec.platform !== platform && rec.platform !== "All") return false;
    return true;
  });

  const appliedCount = allRecommendations.length - recommendations.length;
  const pendingCount = filteredRecommendations.length;
  const totalPotentialROAS = filteredRecommendations.reduce((sum, rec) => {
    return sum + parseFloat(rec.roas.replace('+', '').replace('%', ''));
  }, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1" data-testid="text-page-title">AI Recommendations</h1>
        <p className="text-sm text-gray-600">Actionable insights powered by VenueX AI</p>
      </div>

      {/* Filter Bar */}
      <Card className="bg-white border border-gray-200 shadow-none mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Platform:</span>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-36 border-gray-300" data-testid="select-platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Google">
                    <div className="flex items-center gap-2">
                      <SiGoogle className="w-3 h-3" />
                      Google
                    </div>
                  </SelectItem>
                  <SelectItem value="Meta">
                    <div className="flex items-center gap-2">
                      <SiMeta className="w-3 h-3" />
                      Meta
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-36 border-gray-300" data-testid="select-date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#f9fafb] border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#f9fafb] border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-green-600">{appliedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#f9fafb] border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Potential ROAS</p>
                <p className="text-2xl font-bold text-purple-600">+{totalPotentialROAS}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations Card */}
      <Card className="bg-[#f9fafb] shadow-none border border-gray-200" data-testid="card-ai-recommendations">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-base font-semibold">Recommendations</CardTitle>
            </div>
            {filteredRecommendations.length > 0 && (
              <span className="text-xs text-gray-500">{filteredRecommendations.length} pending</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((item) => {
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
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/70 text-xs">{item.region}</span>
                        <span className="text-white/50">•</span>
                        <span className="text-white/70 text-xs">{item.platform}</span>
                      </div>
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
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-500" />
              <p className="font-medium text-sm">All caught up!</p>
              <p className="text-xs">No pending recommendations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
