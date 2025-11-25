import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, TrendingUp, Target, Zap, Clock, CheckCircle, 
  AlertTriangle, ChevronRight, X, LayoutGrid, List,
  DollarSign, Users, BarChart3, Lightbulb
} from "lucide-react";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  objective: "awareness" | "conversion" | "retention";
  channel: "google" | "meta" | "all";
  region: string;
  category: "budget" | "targeting" | "bidding" | "creative";
  confidence: "high" | "medium";
  impact: string;
  effort: "low" | "medium" | "high";
  potentialROAS: string;
  details: {
    currentState: string;
    recommendation: string;
    expectedOutcome: string;
    steps: string[];
  };
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    title: "Reallocate Istanbul budget to Google",
    description: "Move 15% of Meta spend to Google Ads for better ROAS in Istanbul region",
    objective: "conversion",
    channel: "google",
    region: "Istanbul",
    category: "budget",
    confidence: "high",
    impact: "+12% ROAS",
    effort: "low",
    potentialROAS: "+12%",
    details: {
      currentState: "Current Meta spend in Istanbul: $45,000/month with 2.1x ROAS",
      recommendation: "Shift $6,750 (15%) from Meta to Google Ads campaigns",
      expectedOutcome: "Projected combined ROAS improvement of 12% based on historical performance",
      steps: [
        "Review current Meta campaign performance by ad set",
        "Identify lowest performing 15% of spend",
        "Create equivalent Google Ads campaigns",
        "Gradually shift budget over 2 weeks",
        "Monitor and optimize daily"
      ]
    }
  },
  {
    id: 2,
    title: "Optimize Ankara bid strategy",
    description: "Increase bids on high-converting store locations in Ankara by 20%",
    objective: "conversion",
    channel: "google",
    region: "Ankara",
    category: "bidding",
    confidence: "high",
    impact: "+8% ROAS",
    effort: "low",
    potentialROAS: "+8%",
    details: {
      currentState: "Top 5 Ankara stores have 3.2x ROAS but limited impression share (62%)",
      recommendation: "Increase location bid adjustments by 20% for top performers",
      expectedOutcome: "Capture additional 15% impression share, driving 8% more conversions",
      steps: [
        "Identify top 5 converting store locations",
        "Apply +20% bid adjustment",
        "Set up automated rules for monitoring",
        "Review after 7 days"
      ]
    }
  },
  {
    id: 3,
    title: "Evening dayparting for Izmir",
    description: "Shift 10% budget to evening hours (6PM-10PM) in Izmir campaigns",
    objective: "conversion",
    channel: "all",
    region: "Izmir",
    category: "targeting",
    confidence: "high",
    impact: "+15% ROAS",
    effort: "medium",
    potentialROAS: "+15%",
    details: {
      currentState: "Izmir campaigns show 40% higher conversion rate during evening hours",
      recommendation: "Implement dayparting to concentrate 60% of budget in peak hours",
      expectedOutcome: "15% improvement in overall campaign ROAS",
      steps: [
        "Analyze hourly performance data",
        "Create custom ad schedules",
        "Apply bid modifiers: +25% for 6PM-10PM",
        "Reduce bids by 15% for low-performing hours",
        "Monitor for 2 weeks before full rollout"
      ]
    }
  },
  {
    id: 4,
    title: "Pause underperforming Bursa campaigns",
    description: "Pause 3 campaigns with negative ROAS and reallocate budget",
    objective: "conversion",
    channel: "meta",
    region: "Bursa",
    category: "budget",
    confidence: "medium",
    impact: "+4% ROAS",
    effort: "low",
    potentialROAS: "+4%",
    details: {
      currentState: "3 Bursa campaigns have 0.6x ROAS, spending $8,500/month",
      recommendation: "Pause these campaigns and redistribute to top performers",
      expectedOutcome: "Eliminate waste and improve overall account ROAS by 4%",
      steps: [
        "Pause campaigns: Bursa_Awareness_01, Bursa_Retarget_03, Bursa_Lookalike_02",
        "Redistribute budget to top 3 performing campaigns",
        "Document learnings for future campaign creation"
      ]
    }
  },
  {
    id: 5,
    title: "Enable location extensions for Antalya",
    description: "Add location extensions to drive more store visits in Antalya",
    objective: "awareness",
    channel: "google",
    region: "Antalya",
    category: "creative",
    confidence: "medium",
    impact: "+6% visits",
    effort: "low",
    potentialROAS: "+6%",
    details: {
      currentState: "Antalya campaigns lack location extensions, missing local intent traffic",
      recommendation: "Enable location extensions for all 12 Antalya store locations",
      expectedOutcome: "6% increase in store visit rate based on benchmark data",
      steps: [
        "Verify Google Business Profile accuracy",
        "Link locations to Google Ads",
        "Enable location extensions at campaign level",
        "Add location-specific ad copy variations"
      ]
    }
  },
  {
    id: 6,
    title: "Audience expansion for retention",
    description: "Expand customer match audiences with email subscribers",
    objective: "retention",
    channel: "all",
    region: "All Regions",
    category: "targeting",
    confidence: "high",
    impact: "+22% LTV",
    effort: "medium",
    potentialROAS: "+22%",
    details: {
      currentState: "Current customer match list: 45,000 emails, 6 months old",
      recommendation: "Upload fresh email list (82,000 subscribers) and create similar audiences",
      expectedOutcome: "22% improvement in customer lifetime value through better targeting",
      steps: [
        "Export updated email subscriber list",
        "Hash and format for platform requirements",
        "Upload to Google and Meta",
        "Create similar/lookalike audiences",
        "Launch retention campaigns"
      ]
    }
  }
];

const categoryIcons = {
  budget: DollarSign,
  targeting: Target,
  bidding: Zap,
  creative: Lightbulb,
};

const objectiveColors = {
  awareness: "bg-blue-100 text-blue-700",
  conversion: "bg-green-100 text-green-700",
  retention: "bg-purple-100 text-purple-700",
};

export default function AIRecommendations() {
  const [activeTab, setActiveTab] = useState<"recommendations" | "scenarios" | "history">("recommendations");
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(recommendations[0]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [dateRange, setDateRange] = useState("30d");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    objective: "all",
    channel: "all",
    region: "all",
    category: "all",
    confidenceHigh: true,
    confidenceMedium: true,
  });

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.objective !== "all" && rec.objective !== filters.objective) return false;
    if (filters.channel !== "all" && rec.channel !== filters.channel && rec.channel !== "all") return false;
    if (filters.region !== "all" && rec.region !== filters.region && rec.region !== "All Regions") return false;
    if (filters.category !== "all" && rec.category !== filters.category) return false;
    if (!filters.confidenceHigh && rec.confidence === "high") return false;
    if (!filters.confidenceMedium && rec.confidence === "medium") return false;
    return true;
  });

  const totalPotentialROAS = filteredRecommendations.reduce((sum, rec) => {
    const value = parseFloat(rec.potentialROAS.replace('+', '').replace('%', ''));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const highConfidenceCount = filteredRecommendations.filter(r => r.confidence === "high").length;
  const lowEffortCount = filteredRecommendations.filter(r => r.effort === "low").length;

  const handleSelectRecommendation = (rec: Recommendation) => {
    setSelectedRecommendation(rec);
    setMobileDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">AI Enhance</h1>
              <p className="text-xs text-gray-500">Powered by VenueX AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 h-9 text-sm border-gray-300" data-testid="select-date-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {[
            { id: "recommendations", label: "Recommendations" },
            { id: "scenarios", label: "Scenarios" },
            { id: "history", label: "History" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "recommendations" && (
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border border-gray-200 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Recommendations</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredRecommendations.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">High Confidence</p>
                    <p className="text-2xl font-bold text-green-600">{highConfidenceCount}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Quick Wins</p>
                    <p className="text-2xl font-bold text-blue-600">{lowEffortCount}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Potential ROAS</p>
                    <p className="text-2xl font-bold text-purple-600">+{totalPotentialROAS}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={filters.objective} onValueChange={(v) => setFilters(f => ({ ...f, objective: v }))}>
                <SelectTrigger className="w-32 h-9 text-sm border-gray-300" data-testid="filter-objective">
                  <SelectValue placeholder="Objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Objectives</SelectItem>
                  <SelectItem value="awareness">Awareness</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.channel} onValueChange={(v) => setFilters(f => ({ ...f, channel: v }))}>
                <SelectTrigger className="w-32 h-9 text-sm border-gray-300" data-testid="filter-channel">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="meta">Meta</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.region} onValueChange={(v) => setFilters(f => ({ ...f, region: v }))}>
                <SelectTrigger className="w-32 h-9 text-sm border-gray-300" data-testid="filter-region">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Istanbul">Istanbul</SelectItem>
                  <SelectItem value="Ankara">Ankara</SelectItem>
                  <SelectItem value="Izmir">Izmir</SelectItem>
                  <SelectItem value="Antalya">Antalya</SelectItem>
                  <SelectItem value="Bursa">Bursa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(v) => setFilters(f => ({ ...f, category: v }))}>
                <SelectTrigger className="w-32 h-9 text-sm border-gray-300" data-testid="filter-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="targeting">Targeting</SelectItem>
                  <SelectItem value="bidding">Bidding</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>

              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Confidence:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.confidenceHigh}
                    onChange={(e) => setFilters(f => ({ ...f, confidenceHigh: e.target.checked }))}
                    data-testid="filter-confidence-high"
                  />
                  <span className="text-sm text-gray-700">High</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.confidenceMedium}
                    onChange={(e) => setFilters(f => ({ ...f, confidenceMedium: e.target.checked }))}
                    data-testid="filter-confidence-medium"
                  />
                  <span className="text-sm text-gray-700">Medium</span>
                </label>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-1.5 rounded ${viewMode === "cards" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:text-gray-600"}`}
                  data-testid="view-cards"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded ${viewMode === "table" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:text-gray-600"}`}
                  data-testid="view-table"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex gap-6">
            {/* List Panel */}
            <div className="w-full lg:w-2/5 space-y-3">
              {filteredRecommendations.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recommendations match your filters</p>
                </div>
              ) : viewMode === "cards" ? (
                filteredRecommendations.map(rec => {
                  const CategoryIcon = categoryIcons[rec.category];
                  const isSelected = selectedRecommendation?.id === rec.id;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => handleSelectRecommendation(rec)}
                      className={`bg-white border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected ? "border-purple-400 ring-1 ring-purple-200" : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`recommendation-card-${rec.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          rec.confidence === "high" ? "bg-green-100" : "bg-yellow-100"
                        }`}>
                          <CategoryIcon className={`w-4 h-4 ${
                            rec.confidence === "high" ? "text-green-600" : "text-yellow-600"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{rec.title}</h3>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rec.description}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="secondary" className={`text-[10px] ${objectiveColors[rec.objective]}`}>
                              {rec.objective}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600">
                              {rec.region}
                            </Badge>
                            <span className="text-xs font-semibold text-green-600 ml-auto">{rec.impact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium text-gray-600">Recommendation</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600">Region</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600">Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecommendations.map(rec => {
                        const isSelected = selectedRecommendation?.id === rec.id;
                        return (
                          <tr
                            key={rec.id}
                            onClick={() => handleSelectRecommendation(rec)}
                            className={`border-b border-gray-100 cursor-pointer transition-colors ${
                              isSelected ? "bg-purple-50" : "hover:bg-gray-50"
                            }`}
                            data-testid={`recommendation-row-${rec.id}`}
                          >
                            <td className="py-2 px-3">
                              <div className="font-medium text-gray-900 line-clamp-1">{rec.title}</div>
                            </td>
                            <td className="py-2 px-3 text-gray-600">{rec.region}</td>
                            <td className="py-2 px-3 text-right font-semibold text-green-600">{rec.impact}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Detail Panel - Desktop */}
            <div className="hidden lg:block lg:w-3/5">
              {selectedRecommendation ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedRecommendation.confidence === "high" ? "bg-green-100" : "bg-yellow-100"
                      }`}>
                        {(() => {
                          const Icon = categoryIcons[selectedRecommendation.category];
                          return <Icon className={`w-5 h-5 ${
                            selectedRecommendation.confidence === "high" ? "text-green-600" : "text-yellow-600"
                          }`} />;
                        })()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{selectedRecommendation.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={`text-xs ${objectiveColors[selectedRecommendation.objective]}`}>
                            {selectedRecommendation.objective}
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            {selectedRecommendation.channel}
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            {selectedRecommendation.region}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{selectedRecommendation.impact}</div>
                      <div className="text-xs text-gray-500">Expected Impact</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6">{selectedRecommendation.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Confidence</div>
                      <div className={`text-sm font-semibold ${
                        selectedRecommendation.confidence === "high" ? "text-green-600" : "text-yellow-600"
                      }`}>
                        {selectedRecommendation.confidence === "high" ? "High" : "Medium"}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Effort</div>
                      <div className="text-sm font-semibold text-gray-900 capitalize">{selectedRecommendation.effort}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Category</div>
                      <div className="text-sm font-semibold text-gray-900 capitalize">{selectedRecommendation.category}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Current State</h4>
                      <p className="text-sm text-gray-600">{selectedRecommendation.details.currentState}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Recommendation</h4>
                      <p className="text-sm text-gray-600">{selectedRecommendation.details.recommendation}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Expected Outcome</h4>
                      <p className="text-sm text-gray-600">{selectedRecommendation.details.expectedOutcome}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Implementation Steps</h4>
                    <ol className="space-y-2">
                      {selectedRecommendation.details.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700" data-testid="button-apply">
                      Apply Recommendation
                    </Button>
                    <Button variant="outline" className="flex-1" data-testid="button-dismiss">
                      Dismiss
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a recommendation to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "scenarios" && (
        <div className="p-6">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Scenarios Coming Soon</h3>
            <p className="text-sm text-gray-500">Create and compare different optimization scenarios</p>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="p-6">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">History Coming Soon</h3>
            <p className="text-sm text-gray-500">Track applied recommendations and their results</p>
          </div>
        </div>
      )}

      {/* Mobile Detail Drawer */}
      {mobileDetailOpen && selectedRecommendation && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileDetailOpen(false)}>
          <div 
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recommendation Details</h2>
              <button onClick={() => setMobileDetailOpen(false)} className="p-1">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedRecommendation.confidence === "high" ? "bg-green-100" : "bg-yellow-100"
                }`}>
                  {(() => {
                    const Icon = categoryIcons[selectedRecommendation.category];
                    return <Icon className={`w-5 h-5 ${
                      selectedRecommendation.confidence === "high" ? "text-green-600" : "text-yellow-600"
                    }`} />;
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{selectedRecommendation.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className={`text-xs ${objectiveColors[selectedRecommendation.objective]}`}>
                      {selectedRecommendation.objective}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      {selectedRecommendation.region}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">{selectedRecommendation.impact}</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{selectedRecommendation.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500">Confidence</div>
                  <div className={`text-sm font-semibold ${
                    selectedRecommendation.confidence === "high" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {selectedRecommendation.confidence === "high" ? "High" : "Medium"}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500">Effort</div>
                  <div className="text-sm font-semibold text-gray-900 capitalize">{selectedRecommendation.effort}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500">Category</div>
                  <div className="text-sm font-semibold text-gray-900 capitalize">{selectedRecommendation.category}</div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Current State</h4>
                  <p className="text-sm text-gray-600">{selectedRecommendation.details.currentState}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Expected Outcome</h4>
                  <p className="text-sm text-gray-600">{selectedRecommendation.details.expectedOutcome}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Steps</h4>
                <ol className="space-y-1.5">
                  {selectedRecommendation.details.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 text-[10px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Apply</Button>
                <Button variant="outline" className="flex-1">Dismiss</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
