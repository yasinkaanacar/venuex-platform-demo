import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, TrendingUp, Target, Zap, Clock, CheckCircle, 
  ChevronRight, X, LayoutGrid, List, MoreHorizontal,
  DollarSign, Users, AlertTriangle, Lightbulb, Store,
  ArrowUpRight, ArrowDownRight, Beaker, Eye, BellOff
} from "lucide-react";
import { SiGoogle, SiMeta } from 'react-icons/si';

interface Recommendation {
  id: number;
  type: "budget_shift" | "new_format" | "listing_fix" | "experiment";
  title: string;
  confidence: number;
  estimatedRevenue: string;
  currentROAS: string;
  projectedROAS: string;
  affectedSpend: string;
  channels: string[];
  region: string;
  category: string;
  timeToImpact: string;
  reasons: string[];
  status?: "applied" | "snoozed";
  statusDate?: string;
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    type: "budget_shift",
    title: "Shift 15% budget from Meta Prospecting to Google PMax for Women's Wear in Marmara",
    confidence: 92,
    estimatedRevenue: "+₺180,000",
    currentROAS: "3.2x",
    projectedROAS: "3.9x",
    affectedSpend: "₺250,000",
    channels: ["Google", "Meta"],
    region: "Marmara",
    category: "Women's Wear",
    timeToImpact: "1–2 weeks",
    reasons: [
      "Google campaigns in Marmara have 2× higher average store basket value vs Meta for Women's Wear.",
      "Google currently receives only 42% of spend for this combo."
    ]
  },
  {
    id: 2,
    type: "budget_shift",
    title: "Increase budget by 20% for 'Shoes_Istanbul_PMax_Q4' campaign on Google Ads",
    confidence: 88,
    estimatedRevenue: "+₺320,000",
    currentROAS: "2.8x",
    projectedROAS: "3.4x",
    affectedSpend: "₺180,000",
    channels: ["Google"],
    region: "Istanbul",
    category: "Shoes",
    timeToImpact: "1 week",
    reasons: [
      "This Performance Max campaign shows 45% higher conversion rate during evening hours.",
      "Competitor share of voice dropped 15% this month, opportunity to capture market share."
    ]
  },
  {
    id: 3,
    type: "new_format",
    title: "Launch Performance Max campaign for Men's Wear in Aegean region",
    confidence: 85,
    estimatedRevenue: "+₺95,000",
    currentROAS: "2.1x",
    projectedROAS: "2.8x",
    affectedSpend: "₺120,000",
    channels: ["Google"],
    region: "Aegean",
    category: "Men's Wear",
    timeToImpact: "2–3 weeks",
    reasons: [
      "PMax campaigns show 35% better performance for Men's Wear nationally.",
      "Aegean region has high mobile search volume for apparel products."
    ]
  },
  {
    id: 4,
    type: "listing_fix",
    title: "Fix product feed errors for 234 Accessories items missing GTINs",
    confidence: 95,
    estimatedRevenue: "+₺45,000",
    currentROAS: "1.8x",
    projectedROAS: "2.4x",
    affectedSpend: "₺85,000",
    channels: ["Google", "Meta"],
    region: "All Regions",
    category: "Accessories",
    timeToImpact: "3–5 days",
    reasons: [
      "Missing GTINs reduce product visibility by 60% in Shopping results.",
      "234 products currently not showing in Shopping campaigns."
    ],
    status: "applied",
    statusDate: "3 days ago"
  },
  {
    id: 5,
    type: "experiment",
    title: "Test video ads for Kids apparel in Central Anatolia",
    confidence: 72,
    estimatedRevenue: "+₺65,000",
    currentROAS: "2.3x",
    projectedROAS: "2.9x",
    affectedSpend: "₺50,000",
    channels: ["Meta", "TikTok"],
    region: "Central Anatolia",
    category: "Kids",
    timeToImpact: "3–4 weeks",
    reasons: [
      "Video engagement rates are 3× higher than static images for this audience.",
      "Competitor video ads seeing strong performance in this region."
    ]
  },
  {
    id: 6,
    type: "budget_shift",
    title: "Reduce Meta spend by 25% for low-performing Shoes campaigns",
    confidence: 82,
    estimatedRevenue: "+₺120,000",
    currentROAS: "1.4x",
    projectedROAS: "2.1x",
    affectedSpend: "₺200,000",
    channels: ["Meta"],
    region: "Mediterranean",
    category: "Shoes",
    timeToImpact: "1 week",
    reasons: [
      "3 campaigns have sub-1.5x ROAS for over 60 days.",
      "Reallocating to top performers could recover ₺120K in wasted spend."
    ],
    status: "snoozed",
    statusDate: "until 12 Dec"
  }
];

const typeLabels: Record<string, { label: string; color: string }> = {
  budget_shift: { label: "Budget shift", color: "bg-blue-100 text-blue-700" },
  new_format: { label: "New format", color: "bg-purple-100 text-purple-700" },
  listing_fix: { label: "Listing fix", color: "bg-orange-100 text-orange-700" },
  experiment: { label: "Experiment", color: "bg-green-100 text-green-700" },
};

export default function AIRecommendations() {
  const [activeTab, setActiveTab] = useState<"recommendations" | "scenarios" | "history">("recommendations");
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(recommendations[0]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState<number | null>(null);
  
  const [filters, setFilters] = useState({
    objective: "all",
    channel: "all",
    region: "all",
    category: "all",
    confidenceHigh: true,
    confidenceMedium: false,
  });

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.channel !== "all" && !rec.channels.includes(filters.channel)) return false;
    if (filters.region !== "all" && rec.region !== filters.region && rec.region !== "All Regions") return false;
    if (filters.category !== "all" && rec.category !== filters.category) return false;
    if (!filters.confidenceHigh && rec.confidence >= 80) return false;
    if (!filters.confidenceMedium && rec.confidence >= 60 && rec.confidence < 80) return false;
    if (filters.confidenceHigh && rec.confidence >= 80) return true;
    if (filters.confidenceMedium && rec.confidence >= 60 && rec.confidence < 80) return true;
    if (!filters.confidenceHigh && !filters.confidenceMedium) return true;
    return false;
  });

  const handleSelectRecommendation = (rec: Recommendation) => {
    setSelectedRecommendation(rec);
    setMobileDetailOpen(true);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-100";
    if (confidence >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
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
              <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">Enhance</h1>
              <p className="text-xs text-gray-500">Powered by VenueX AI</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {[
            { id: "recommendations", label: "Recommendations" },
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
        <div className="p-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Card className="bg-white border border-gray-200 shadow-none">
              <CardContent className="p-3">
                <p className="text-[10px] text-gray-500 mb-0.5">Potential incremental revenue</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-lg font-bold text-gray-900">+₺1.3M</p>
                  <span className="inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium bg-green-100 text-green-700">
                    <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />+18%
                  </span>
                </div>
                <p className="text-[9px] text-gray-400 mt-0.5">If all high-confidence recs applied in 30 days</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-none">
              <CardContent className="p-3">
                <p className="text-[10px] text-gray-500 mb-0.5">High-confidence recommendations</p>
                <p className="text-lg font-bold text-gray-900">12</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Budget & visibility actions with confidence ≥80%</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-none">
              <CardContent className="p-3">
                <p className="text-[10px] text-gray-500 mb-0.5">Budget at risk</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-lg font-bold text-red-600">₺450K</p>
                </div>
                <p className="text-[9px] text-gray-400 mt-0.5">Spend in low-ROAS campaigns flagged by AI</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-none">
              <CardContent className="p-3">
                <p className="text-[10px] text-gray-500 mb-0.5">Applied this period</p>
                <p className="text-lg font-bold text-green-600">7</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Recommendations marked as applied</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 mb-4">
            <Select 
              value={filters.objective} 
              onValueChange={(v) => setFilters(f => ({ ...f, objective: v }))}
              displayLabel={filters.objective === "all" ? "Objective" : 
                filters.objective === "revenue" ? "Max Revenue" :
                filters.objective === "roas" ? "Max ROAS" :
                filters.objective === "visits" ? "Store Visits" : "Clear Inventory"}
              data-testid="filter-objective"
            >
              <SelectContent>
                <SelectItem value="all">All Objectives</SelectItem>
                <SelectItem value="revenue">Maximize revenue</SelectItem>
                <SelectItem value="roas">Maximize Omni-ROAS</SelectItem>
                <SelectItem value="visits">Increase store visits</SelectItem>
                <SelectItem value="inventory">Clear inventory</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.channel} 
              onValueChange={(v) => setFilters(f => ({ ...f, channel: v }))}
              displayLabel={filters.channel === "all" ? "Channels" : filters.channel}
              data-testid="filter-channel"
            >
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Meta">Meta</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.region} 
              onValueChange={(v) => setFilters(f => ({ ...f, region: v }))}
              displayLabel={filters.region === "all" ? "Region" : filters.region}
              data-testid="filter-region"
            >
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Istanbul">Istanbul</SelectItem>
                <SelectItem value="Marmara">Marmara</SelectItem>
                <SelectItem value="Aegean">Aegean</SelectItem>
                <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                <SelectItem value="Central Anatolia">Central Anatolia</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.category} 
              onValueChange={(v) => setFilters(f => ({ ...f, category: v }))}
              displayLabel={filters.category === "all" ? "Category" : filters.category}
              data-testid="filter-category"
            >
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Women's Wear">Women's Wear</SelectItem>
                <SelectItem value="Men's Wear">Men's Wear</SelectItem>
                <SelectItem value="Shoes">Shoes</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Kids">Kids</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-5 w-px bg-gray-300 mx-1" />

            <button
              onClick={() => setFilters(f => ({ ...f, confidenceHigh: !f.confidenceHigh }))}
              className={`h-7 px-2.5 text-[10px] font-medium rounded border transition-colors ${
                filters.confidenceHigh 
                  ? "bg-green-50 border-green-300 text-green-700" 
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="filter-confidence-high"
            >
              High
            </button>
            <button
              onClick={() => setFilters(f => ({ ...f, confidenceMedium: !f.confidenceMedium }))}
              className={`h-7 px-2.5 text-[10px] font-medium rounded border transition-colors ${
                filters.confidenceMedium 
                  ? "bg-yellow-50 border-yellow-300 text-yellow-700" 
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
              data-testid="filter-confidence-medium"
            >
              Medium
            </button>

            <div className="ml-auto flex items-center">
              <div className="flex bg-gray-100 rounded p-0.5">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-1 rounded transition-colors ${
                    viewMode === "cards" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                  }`}
                  data-testid="view-cards"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1 rounded transition-colors ${
                    viewMode === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                  }`}
                  data-testid="view-table"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex gap-4">
            {/* List Panel */}
            <div className="w-full lg:w-1/2 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
              {filteredRecommendations.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recommendations match your filters</p>
                </div>
              ) : viewMode === "cards" ? (
                filteredRecommendations.map(rec => {
                  const isSelected = selectedRecommendation?.id === rec.id;
                  const typeInfo = typeLabels[rec.type];
                  return (
                    <div
                      key={rec.id}
                      onClick={() => handleSelectRecommendation(rec)}
                      className={`p-3 cursor-pointer transition-all ${
                        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                      } ${rec.status ? "opacity-75" : ""}`}
                      data-testid={`recommendation-card-${rec.id}`}
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Badge className={`${typeInfo.color} text-[10px] font-medium`}>
                            {typeInfo.label}
                          </Badge>
                          {rec.channels.map(ch => (
                            <span key={ch} className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              {ch === "Google" && <SiGoogle className="w-2.5 h-2.5 text-gray-600" />}
                              {ch === "Meta" && <SiMeta className="w-2.5 h-2.5 text-gray-600" />}
                              {ch === "TikTok" && <span className="text-[8px] font-bold text-gray-600">TT</span>}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${getConfidenceColor(rec.confidence)}`}>
                            {rec.confidence >= 80 ? "High" : "Medium"} · {rec.confidence}%
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xs font-semibold text-gray-900 mb-2 leading-snug">{rec.title}</h3>

                      {/* Impact row */}
                      <div className="grid grid-cols-3 gap-2 mb-2 p-1.5 bg-gray-50 rounded">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-0.5 text-green-600 font-semibold text-xs">
                            <TrendingUp className="w-2.5 h-2.5" />
                            {rec.estimatedRevenue}
                          </div>
                          <p className="text-[9px] text-gray-500">Est. revenue / 30d</p>
                        </div>
                        <div className="text-center border-x border-gray-200">
                          <div className="text-xs font-semibold text-gray-900">
                            {rec.currentROAS} → {rec.projectedROAS}
                          </div>
                          <p className="text-[9px] text-gray-500">Offline ROAS</p>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-semibold text-gray-700">{rec.affectedSpend}</div>
                          <p className="text-[9px] text-gray-500">Affected spend</p>
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="flex items-center justify-start pt-2 mt-2 border-t border-gray-100">
                        <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2 text-gray-500">
                          <Eye className="w-2.5 h-2.5 mr-0.5" />
                          Details
                        </Button>
                      </div>

                      {/* Status indicator */}
                      {rec.status && (
                        <div className="mt-1.5 pt-1.5 border-t border-gray-100">
                          <span className={`text-[10px] ${rec.status === "applied" ? "text-green-600" : "text-yellow-600"}`}>
                            Status: {rec.status === "applied" ? "Applied" : "Snoozed"} · {rec.statusDate}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium text-gray-600">Type</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600">Recommendation</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600">Region</th>
                        <th className="text-center py-2 px-3 font-medium text-gray-600">Confidence</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-600">Est. Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecommendations.map(rec => {
                        const isSelected = selectedRecommendation?.id === rec.id;
                        const typeInfo = typeLabels[rec.type];
                        return (
                          <tr
                            key={rec.id}
                            onClick={() => handleSelectRecommendation(rec)}
                            className={`border-b border-gray-100 cursor-pointer transition-colors ${
                              isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                            }`}
                            data-testid={`recommendation-row-${rec.id}`}
                          >
                            <td className="py-2 px-3">
                              <Badge className={`${typeInfo.color} text-[10px]`}>{typeInfo.label}</Badge>
                            </td>
                            <td className="py-2 px-3">
                              <div className="font-medium text-gray-900 line-clamp-1 max-w-[300px]">{rec.title}</div>
                            </td>
                            <td className="py-2 px-3 text-gray-600">{rec.region}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${getConfidenceColor(rec.confidence)}`}>
                                {rec.confidence}%
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right font-semibold text-green-600">{rec.estimatedRevenue}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Detail Panel - Desktop */}
            <div className="hidden lg:block lg:w-1/2">
              {selectedRecommendation ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`${typeLabels[selectedRecommendation.type].color} text-[10px] flex-shrink-0`}>
                      {typeLabels[selectedRecommendation.type].label}
                    </Badge>
                    <h2 className="text-sm font-bold text-gray-900 leading-snug flex-1">{selectedRecommendation.title}</h2>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${getConfidenceColor(selectedRecommendation.confidence)}`}>
                      {selectedRecommendation.confidence}% confidence
                    </span>
                  </div>

                  {/* Impact metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">Estimated Revenue</p>
                      <p className="text-base font-bold text-green-600">{selectedRecommendation.estimatedRevenue}</p>
                      <p className="text-[9px] text-gray-400">per 30 days</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">ROAS Change</p>
                      <p className="text-base font-bold text-gray-900">
                        {selectedRecommendation.currentROAS} → {selectedRecommendation.projectedROAS}
                      </p>
                      <p className="text-[9px] text-gray-400">offline ROAS</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">Affected Spend</p>
                      <p className="text-base font-bold text-gray-700">{selectedRecommendation.affectedSpend}</p>
                      <p className="text-[9px] text-gray-400">per 30 days</p>
                    </div>
                  </div>

                  {/* Context */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-900 mb-1.5">Context</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRecommendation.channels.map(ch => (
                        <span key={ch} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-700">
                          {ch === "Google" && <SiGoogle className="w-2.5 h-2.5" />}
                          {ch === "Meta" && <SiMeta className="w-2.5 h-2.5" />}
                          {ch}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-xs text-blue-700">{selectedRecommendation.region}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-xs text-purple-700">{selectedRecommendation.category}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600">
                        <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                        Impact in {selectedRecommendation.timeToImpact}
                      </span>
                    </div>
                  </div>

                  {/* Why we suggest this */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-900 mb-1.5">Why we suggest this</h4>
                    <ul className="space-y-1.5">
                      {selectedRecommendation.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 text-[10px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs h-8" data-testid="button-apply">
                      Apply change
                    </Button>
                    <Button variant="outline" className="flex-1 text-xs h-8" data-testid="button-experiment">
                      <Beaker className="w-3 h-3 mr-1" />
                      Create experiment
                    </Button>
                  </div>

                  {/* Status */}
                  {selectedRecommendation.status && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className={`text-xs ${selectedRecommendation.status === "applied" ? "text-green-600" : "text-yellow-600"}`}>
                        Status: {selectedRecommendation.status === "applied" ? "Applied" : "Snoozed"} · {selectedRecommendation.statusDate}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <Lightbulb className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Select a recommendation to view details</p>
                </div>
              )}
            </div>
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
              <Badge className={`${typeLabels[selectedRecommendation.type].color} text-xs mb-2`}>
                {typeLabels[selectedRecommendation.type].label}
              </Badge>
              <h3 className="font-bold text-gray-900 mb-3">{selectedRecommendation.title}</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-bold text-green-600">{selectedRecommendation.estimatedRevenue}</p>
                  <p className="text-[10px] text-gray-500">Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{selectedRecommendation.projectedROAS}</p>
                  <p className="text-[10px] text-gray-500">ROAS</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-700">{selectedRecommendation.affectedSpend}</p>
                  <p className="text-[10px] text-gray-500">Spend</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedRecommendation.channels.map(ch => (
                  <span key={ch} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600">{ch}</span>
                ))}
                <span className="px-2 py-0.5 rounded bg-blue-50 text-xs text-blue-600">{selectedRecommendation.region}</span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-xs text-purple-600">{selectedRecommendation.category}</span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Why we suggest this</h4>
                <ul className="space-y-1">
                  {selectedRecommendation.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-purple-500">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Apply</Button>
                <Button variant="outline" className="flex-1">Experiment</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
