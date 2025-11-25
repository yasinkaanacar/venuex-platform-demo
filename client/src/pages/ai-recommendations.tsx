import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, TrendingUp, Target, MapPin, Zap, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { useState } from "react";

interface Recommendation {
  id: number;
  text: string;
  description: string;
  roas: string;
  confidence: number;
  category: "budget" | "targeting" | "bidding" | "creative";
  platform: "Google" | "Meta" | "All";
  region: string;
  impact: "high" | "medium" | "low";
  status: "pending" | "applied" | "dismissed";
}

const allRecommendations: Recommendation[] = [
  { 
    id: 1, 
    text: "Move 15% from Meta to Google in Istanbul", 
    description: "Based on store visit data, Google campaigns in Istanbul are showing 23% higher conversion rates than Meta.",
    roas: "+12%", 
    confidence: 82, 
    category: "budget",
    platform: "Google",
    region: "Istanbul",
    impact: "high",
    status: "pending"
  },
  { 
    id: 2, 
    text: "Increase bid on high-converting Ankara stores by 20%", 
    description: "5 stores in Ankara are consistently outperforming with 2.3x average ROAS. Increasing bids could capture more traffic.",
    roas: "+8%", 
    confidence: 78, 
    category: "bidding",
    platform: "Google",
    region: "Ankara",
    impact: "medium",
    status: "pending"
  },
  { 
    id: 3, 
    text: "Shift 10% budget to evening hours in Izmir", 
    description: "Store visits spike between 6-9 PM in Izmir region. Current budget allocation is not optimized for this pattern.",
    roas: "+15%", 
    confidence: 85, 
    category: "targeting",
    platform: "All",
    region: "Izmir",
    impact: "high",
    status: "pending"
  },
  { 
    id: 4, 
    text: "Pause underperforming Bursa campaigns", 
    description: "3 campaigns in Bursa have shown negative ROAS for the past 14 days with no signs of improvement.",
    roas: "+4%", 
    confidence: 91, 
    category: "budget",
    platform: "Meta",
    region: "Bursa",
    impact: "low",
    status: "pending"
  },
  { 
    id: 5, 
    text: "Enable location extensions for Antalya stores", 
    description: "Stores with location extensions are seeing 34% higher click-through rates in similar regions.",
    roas: "+6%", 
    confidence: 74, 
    category: "creative",
    platform: "Google",
    region: "Antalya",
    impact: "medium",
    status: "pending"
  },
];

const categoryIcons = {
  budget: TrendingUp,
  targeting: Target,
  bidding: Zap,
  creative: MapPin,
};

const categoryLabels = {
  budget: "Budget Allocation",
  targeting: "Targeting",
  bidding: "Bidding",
  creative: "Creative",
};

const impactColors = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(allRecommendations);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");

  const handleApply = (id: number) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, status: "applied" as const } : rec)
    );
  };

  const handleDismiss = (id: number) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, status: "dismissed" as const } : rec)
    );
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (categoryFilter !== "all" && rec.category !== categoryFilter) return false;
    if (platformFilter !== "all" && rec.platform !== platformFilter) return false;
    if (impactFilter !== "all" && rec.impact !== impactFilter) return false;
    return true;
  });

  const pendingRecs = filteredRecommendations.filter(r => r.status === "pending");
  const appliedRecs = recommendations.filter(r => r.status === "applied");
  const dismissedRecs = recommendations.filter(r => r.status === "dismissed");

  const totalPotentialROAS = pendingRecs.reduce((sum, rec) => {
    const roasValue = parseFloat(rec.roas.replace('+', '').replace('%', ''));
    return sum + roasValue;
  }, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">AI Recommendations</h1>
            <p className="text-sm text-gray-600">Actionable insights to optimize your campaigns</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#f9fafb] border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRecs.length}</p>
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
                <p className="text-2xl font-bold text-green-600">{appliedRecs.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#f9fafb] border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dismissed</p>
                <p className="text-2xl font-bold text-gray-500">{dismissedRecs.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-gray-400" />
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

      {/* Filters */}
      <Card className="bg-white border border-gray-200 shadow-none mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 border-gray-300" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="budget">Budget Allocation</SelectItem>
                <SelectItem value="targeting">Targeting</SelectItem>
                <SelectItem value="bidding">Bidding</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-32 border-gray-300" data-testid="select-platform">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Meta">Meta</SelectItem>
              </SelectContent>
            </Select>
            <Select value={impactFilter} onValueChange={setImpactFilter}>
              <SelectTrigger className="w-32 border-gray-300" data-testid="select-impact">
                <SelectValue placeholder="Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <Card className="bg-white border border-gray-200 shadow-none">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold">Pending Recommendations ({pendingRecs.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {pendingRecs.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {pendingRecs.map((rec) => {
                const CategoryIcon = categoryIcons[rec.category];
                return (
                  <div 
                    key={rec.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                    data-testid={`recommendation-${rec.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#00a0e3] flex items-center justify-center flex-shrink-0">
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{rec.text}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColors[rec.impact]}`}>
                            {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)} Impact
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{categoryLabels[rec.category]}</span>
                          </span>
                          <span>•</span>
                          <span>{rec.platform}</span>
                          <span>•</span>
                          <span>{rec.region}</span>
                          <span>•</span>
                          <span className="text-green-600 font-semibold">{rec.roas} ROAS</span>
                          <span>•</span>
                          <span>{rec.confidence}% confidence</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleApply(rec.id)}
                          className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-4 h-8"
                          data-testid={`button-apply-${rec.id}`}
                        >
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDismiss(rec.id)}
                          className="bg-[#9b4d4d] hover:bg-[#8b3d3d] text-white text-xs px-4 h-8"
                          data-testid={`button-dismiss-${rec.id}`}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm">No pending recommendations match your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applied Recommendations */}
      {appliedRecs.length > 0 && (
        <Card className="bg-white border border-gray-200 shadow-none mt-6">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base font-semibold text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Applied Recommendations ({appliedRecs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {appliedRecs.map((rec) => (
                <div key={rec.id} className="p-4 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{rec.text}</p>
                      <p className="text-sm text-gray-600">{rec.region} • {rec.platform}</p>
                    </div>
                    <span className="text-green-600 font-semibold">{rec.roas} ROAS</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
