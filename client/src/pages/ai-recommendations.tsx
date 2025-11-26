import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { 
  Brain, TrendingUp, ChevronDown, ChevronUp,
  ArrowUpRight, Sparkles, Clock, Lightbulb, CheckCircle2
} from "lucide-react";
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';

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
  campaign?: string;
  timeToImpact: string;
  insight: string;
  dataPoints: string[];
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    type: "budget_shift",
    title: "Shift 15% budget from Meta Prospecting to Google PMax in Marmara Region",
    confidence: 92,
    estimatedRevenue: "+₺180K",
    currentROAS: "3.2x",
    projectedROAS: "3.9x",
    affectedSpend: "₺250K",
    channels: ["Google", "Meta"],
    region: "Marmara",
    category: "Women's Wear",
    campaign: "Women_Marmara_PMax_Q4",
    timeToImpact: "1-2 weeks",
    insight: "Google PMax shows 2.1x higher store visit rate vs Meta for Women's Wear in this region",
    dataPoints: [
      "Store conversion rate: 12.4% (Google) vs 5.8% (Meta)",
      "Avg. basket value: ₺890 (Google) vs ₺620 (Meta)",
      "Last 30 days: 1,240 attributed store visits"
    ]
  },
  {
    id: 2,
    type: "new_format",
    title: "Launch Performance Max for Men's Wear in Aegean",
    confidence: 85,
    estimatedRevenue: "+₺95K",
    currentROAS: "2.1x",
    projectedROAS: "2.8x",
    affectedSpend: "₺120K",
    channels: ["Google"],
    region: "Aegean",
    category: "Men's Wear",
    campaign: "Mens_Aegean_PMax_New",
    timeToImpact: "2-3 weeks",
    insight: "PMax campaigns outperform standard Shopping by 35% for Men's Wear nationally",
    dataPoints: [
      "Regional search volume up 28% YoY",
      "Competitor PMax adoption: 3 of 5 brands",
      "Estimated new customer reach: 45,000/month"
    ]
  },
  {
    id: 3,
    type: "budget_shift",
    title: "Increase budget 20% for Shoes Istanbul PMax campaign",
    confidence: 88,
    estimatedRevenue: "+₺320K",
    currentROAS: "2.8x",
    projectedROAS: "3.4x",
    affectedSpend: "₺180K",
    channels: ["Google"],
    region: "Istanbul",
    category: "Shoes",
    campaign: "Shoes_Istanbul_PMax_Q4",
    timeToImpact: "1 week",
    insight: "Campaign hitting budget cap by 2pm daily, missing 40% of high-intent evening traffic",
    dataPoints: [
      "Evening conversion rate: 18.2% vs 11.4% daytime",
      "Current daily budget exhaustion: 14:00 avg",
      "Competitor impression share gap: 23%"
    ]
  },
  {
    id: 4,
    type: "experiment",
    title: "Test video ads for Kids apparel on TikTok",
    confidence: 72,
    estimatedRevenue: "+₺65K",
    currentROAS: "2.3x",
    projectedROAS: "2.9x",
    affectedSpend: "₺50K",
    channels: ["Meta", "TikTok"],
    region: "Central Anatolia",
    category: "Kids",
    campaign: "Kids_CentralAnatolia_Video",
    timeToImpact: "3-4 weeks",
    insight: "Video engagement 3.2x higher than static for parent audiences aged 25-40",
    dataPoints: [
      "TikTok parent audience: 890K reachable",
      "Competitor video CTR: 4.2% vs 1.1% static",
      "Suggested test budget: ₺50K over 4 weeks"
    ]
  }
];

const typeLabels: Record<string, { label: string; color: string }> = {
  budget_shift: { label: "Budget Shift", color: "bg-blue-100 text-blue-700" },
  new_format: { label: "New Format", color: "bg-purple-100 text-purple-700" },
  listing_fix: { label: "Listing Fix", color: "bg-orange-100 text-orange-700" },
  experiment: { label: "Experiment", color: "bg-green-100 text-green-700" },
};

const PlatformIcon = ({ channel }: { channel: string }) => {
  const iconClass = "w-3.5 h-3.5";
  switch (channel) {
    case "Google":
      return <SiGoogle className={iconClass} />;
    case "Meta":
      return <SiMeta className={iconClass} />;
    case "TikTok":
      return <SiTiktok className={iconClass} />;
    default:
      return null;
  }
};

export default function AIRecommendations() {
  const [expandedId, setExpandedId] = useState<number>(1);
  const [filters, setFilters] = useState({
    channel: "all",
    region: "all",
    category: "all",
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? -1 : id);
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.channel !== "all" && !rec.channels.includes(filters.channel)) return false;
    if (filters.region !== "all" && rec.region !== filters.region) return false;
    if (filters.category !== "all" && rec.category !== filters.category) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">AI Recommendations</h1>
            <p className="text-xs text-gray-500">Powered by VenueX AI</p>
          </div>
        </div>
      </div>
      <div className="p-6 max-w-4xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">Revenue Opportunity</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">+₺1.3M</p>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />18%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">High Confidence</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">Budget at Risk</p>
              <p className="text-2xl font-bold text-red-600">₺450K</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">Applied</p>
              <p className="text-2xl font-bold text-green-600">7</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-4">
          <Select 
            value={filters.channel} 
            onValueChange={(v) => setFilters(f => ({ ...f, channel: v }))}
            displayLabel={filters.channel === "all" ? "Channel" : filters.channel}
            data-testid="filter-channel"
          >
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Meta">Meta</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
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
              <SelectItem value="Kids">Kids</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recommendations Accordion */}
        <div className="space-y-3">
          {filteredRecommendations.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const typeInfo = typeLabels[rec.type];
            
            return (
              <div
                key={rec.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all ${
                  isExpanded ? "border-blue-300 shadow-md" : "border-gray-200 hover:border-gray-300"
                }`}
                data-testid={`recommendation-card-${rec.id}`}
              >
                {/* Collapsed Header - Always visible */}
                <div
                  onClick={() => toggleExpand(rec.id)}
                  className={`p-4 cursor-pointer ${isExpanded ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Type Badge */}
                      <Badge className={`${typeInfo.color} text-xs font-medium`}>
                        {typeInfo.label}
                      </Badge>
                      
                      {/* Platform Icons */}
                      <div className="flex items-center gap-1">
                        {rec.channels.map(ch => (
                          <span 
                            key={ch} 
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                            title={ch}
                          >
                            <PlatformIcon channel={ch} />
                          </span>
                        ))}
                      </div>

                      {/* Confidence */}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        rec.confidence >= 80 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {rec.confidence}%
                      </span>
                    </div>
                    
                    {/* Revenue & Expand */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-green-600">{rec.estimatedRevenue}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 mt-2">{rec.title}</h3>
                  
                  {/* Campaign & Region tags - compact */}
                  {!isExpanded && (
                    <div className="flex items-center gap-2 mt-2">
                      {rec.campaign && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {rec.campaign}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{rec.region}</span>
                    </div>
                  )}
                </div>
                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 bg-white">
                    {/* Context Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                      {rec.campaign && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                          <Sparkles className="w-3 h-3" />
                          {rec.campaign}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-xs font-medium text-blue-700">
                        {rec.region}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-purple-50 text-xs font-medium text-purple-700">
                        {rec.category}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-xs font-medium text-orange-700">
                        <Clock className="w-3 h-3" />
                        {rec.timeToImpact}
                      </span>
                    </div>

                    {/* AI Insight */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{rec.insight}</p>
                      </div>
                    </div>

                    {/* Data Points */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Supporting Data</p>
                      <div className="space-y-1.5">
                        {rec.dataPoints.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-lg">
                          <TrendingUp className="w-4 h-4" />
                          {rec.estimatedRevenue}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Est. Revenue / 30d</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-bold text-lg text-gray-900">
                          {rec.currentROAS} → {rec.projectedROAS}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">ROAS Change</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-bold text-lg text-gray-700">{rec.affectedSpend}</div>
                        <p className="text-xs text-gray-500 mt-1">Affected Budget</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-10" data-testid="button-apply">
                        Apply Recommendation
                      </Button>
                      <Button variant="outline" className="flex-1 text-sm h-10" data-testid="button-details">
                        View Details
                      </Button>
                      <Button variant="ghost" className="text-sm h-10 text-gray-500 hover:text-gray-700" data-testid="button-dismiss">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
