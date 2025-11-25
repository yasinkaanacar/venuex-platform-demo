import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, TrendingUp, Target, Zap, MapPin, Clock, CheckCircle, Lightbulb } from "lucide-react";
import { SiGoogle, SiMeta } from 'react-icons/si';
import { Tooltip } from '@mui/material';

interface Recommendation {
  id: number;
  text: string;
  roas: string;
  confidence: number;
  category: "budget" | "targeting" | "bidding" | "creative";
  platform: "Google" | "Meta" | "All";
  region: string;
}

interface RegionOpportunity {
  state: string;
  opportunityScore: number;
  pendingRecommendations: number;
  potentialROAS: number;
  riskLevel: "low" | "medium" | "high";
  topAction: string;
}

const allRecommendations: Recommendation[] = [
  { id: 1, text: "Move 15% from Meta to Google in Istanbul", roas: "+12%", confidence: 82, category: "budget", platform: "Google", region: "Istanbul" },
  { id: 2, text: "Increase bid on high-converting Ankara stores by 20%", roas: "+8%", confidence: 78, category: "bidding", platform: "Google", region: "Ankara" },
  { id: 3, text: "Shift 10% budget to evening hours in Izmir", roas: "+15%", confidence: 85, category: "targeting", platform: "All", region: "Izmir" },
  { id: 4, text: "Pause underperforming Bursa campaigns", roas: "+4%", confidence: 91, category: "budget", platform: "Meta", region: "Bursa" },
  { id: 5, text: "Enable location extensions for Antalya stores", roas: "+6%", confidence: 74, category: "creative", platform: "Google", region: "Antalya" },
];

const regionOpportunities: RegionOpportunity[] = [
  { state: "Istanbul", opportunityScore: 92, pendingRecommendations: 3, potentialROAS: 18, riskLevel: "low", topAction: "Budget reallocation" },
  { state: "Ankara", opportunityScore: 78, pendingRecommendations: 2, potentialROAS: 12, riskLevel: "low", topAction: "Bid optimization" },
  { state: "Izmir", opportunityScore: 85, pendingRecommendations: 2, potentialROAS: 15, riskLevel: "medium", topAction: "Time targeting" },
  { state: "Antalya", opportunityScore: 71, pendingRecommendations: 1, potentialROAS: 8, riskLevel: "low", topAction: "Creative update" },
  { state: "Bursa", opportunityScore: 45, pendingRecommendations: 1, potentialROAS: 4, riskLevel: "high", topAction: "Campaign pause" },
  { state: "Adana", opportunityScore: 62, pendingRecommendations: 0, potentialROAS: 0, riskLevel: "medium", topAction: "Monitor" },
  { state: "Konya", opportunityScore: 58, pendingRecommendations: 0, potentialROAS: 0, riskLevel: "medium", topAction: "Monitor" },
  { state: "Gaziantep", opportunityScore: 67, pendingRecommendations: 0, potentialROAS: 0, riskLevel: "low", topAction: "Monitor" },
  { state: "Kocaeli", opportunityScore: 54, pendingRecommendations: 0, potentialROAS: 0, riskLevel: "medium", topAction: "Review needed" },
  { state: "Mersin", opportunityScore: 48, pendingRecommendations: 0, potentialROAS: 0, riskLevel: "high", topAction: "Attention required" },
];

const provincePaths: Record<string, string> = {
  'Istanbul': 'M150,120 L180,110 L200,115 L210,130 L200,150 L170,155 L140,145 Z',
  'Kocaeli': 'M215,125 L245,120 L260,135 L255,155 L235,160 L210,150 Z',
  'Bursa': 'M140,160 L170,160 L190,175 L185,200 L160,210 L130,195 Z',
  'Izmir': 'M50,280 L90,275 L110,290 L105,320 L80,335 L45,320 Z',
  'Ankara': 'M350,180 L410,175 L435,195 L430,230 L395,245 L340,230 Z',
  'Konya': 'M340,280 L410,275 L440,295 L435,340 L390,360 L330,345 Z',
  'Antalya': 'M180,380 L230,375 L255,390 L250,425 L215,440 L175,425 Z',
  'Mersin': 'M360,370 L410,365 L435,380 L430,415 L395,430 L355,415 Z',
  'Adana': 'M445,355 L495,350 L520,365 L515,400 L480,415 L440,400 Z',
  'Gaziantep': 'M600,320 L650,315 L675,330 L670,365 L635,380 L595,365 Z'
};

const getTextPosition = (state: string) => {
  const positions: Record<string, { x: number; y: number }> = {
    'Istanbul': { x: 175, y: 135 },
    'Kocaeli': { x: 237, y: 142 },
    'Bursa': { x: 160, y: 185 },
    'Izmir': { x: 77, y: 305 },
    'Ankara': { x: 385, y: 210 },
    'Konya': { x: 385, y: 315 },
    'Antalya': { x: 212, y: 407 },
    'Mersin': { x: 397, y: 397 },
    'Adana': { x: 477, y: 382 },
    'Gaziantep': { x: 632, y: 347 }
  };
  return positions[state] || { x: 0, y: 0 };
};

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
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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

  const getRegionColor = (item: RegionOpportunity) => {
    const baseOpacity = 0.4 + (item.opportunityScore / 100) * 0.5;
    if (item.riskLevel === 'high') {
      return `rgba(239, 68, 68, ${baseOpacity})`;
    } else if (item.riskLevel === 'medium') {
      return `rgba(245, 158, 11, ${baseOpacity})`;
    } else if (item.opportunityScore >= 80) {
      return `rgba(147, 51, 234, ${baseOpacity})`;
    } else if (item.opportunityScore >= 60) {
      return `rgba(59, 130, 246, ${baseOpacity})`;
    }
    return `rgba(34, 197, 94, ${baseOpacity})`;
  };

  const getStrokeColor = (item: RegionOpportunity, isSelected: boolean) => {
    if (isSelected) return '#1e293b';
    if (item.riskLevel === 'high') return '#dc2626';
    if (item.riskLevel === 'medium') return '#d97706';
    return '#6b7280';
  };

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

      {/* Regional AI Opportunity Map */}
      <Card className="bg-[#f9fafb] shadow-none border border-gray-200 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle>Regional AI Opportunity Map</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Opportunity scores with risk indicators</p>
              </div>
            </div>
            {selectedRegion && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedRegion(null)}
                className="text-xs"
              >
                Clear Selection
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Single Merged Map */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">AI Confidence by Region</h3>
                <p className="text-xs text-gray-500">Regions colored by recommendation confidence level</p>
              </div>
            </div>
            <div className="relative h-80 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
              <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="turkeyBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                </defs>
                
                <path d="M50,180 Q80,120 150,100 L200,95 L280,90 Q350,85 400,100 L450,110 L500,120 Q550,130 600,145 L650,160 Q700,175 750,200 L760,220 Q765,250 750,280 L720,300 Q680,330 620,340 L560,345 Q500,350 440,340 L380,330 Q320,320 260,300 L200,280 Q140,260 100,230 L70,200 Q55,190 50,180 Z" fill="url(#turkeyBg)" stroke="#cbd5e1" strokeWidth="2" />
                
                <Tooltip title={<div className="p-1"><div className="font-semibold">Istanbul</div><div className="text-xs">Confidence: 82%</div></div>} arrow>
                  <g>
                    <ellipse cx="165" cy="115" rx="35" ry="25" fill="rgba(34, 197, 94, 0.7)" stroke="#16a34a" strokeWidth="2" className="cursor-pointer hover:opacity-80" />
                    <text x="165" y="112" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">Istanbul</text>
                    <text x="165" y="125" fill="white" fontSize="10" fontWeight="600" textAnchor="middle">82%</text>
                  </g>
                </Tooltip>
                
                <Tooltip title={<div className="p-1"><div className="font-semibold">Bursa</div><div className="text-xs">Confidence: 91%</div></div>} arrow>
                  <g>
                    <ellipse cx="140" cy="165" rx="30" ry="20" fill="rgba(34, 197, 94, 0.85)" stroke="#15803d" strokeWidth="2" className="cursor-pointer hover:opacity-80" />
                    <text x="140" y="162" fill="white" fontSize="10" fontWeight="700" textAnchor="middle">Bursa</text>
                    <text x="140" y="174" fill="white" fontSize="9" fontWeight="600" textAnchor="middle">91%</text>
                  </g>
                </Tooltip>
                
                <Tooltip title={<div className="p-1"><div className="font-semibold">Izmir</div><div className="text-xs">Confidence: 85%</div></div>} arrow>
                  <g>
                    <ellipse cx="95" cy="220" rx="32" ry="22" fill="rgba(34, 197, 94, 0.75)" stroke="#16a34a" strokeWidth="2" className="cursor-pointer hover:opacity-80" />
                    <text x="95" y="217" fill="white" fontSize="10" fontWeight="700" textAnchor="middle">Izmir</text>
                    <text x="95" y="229" fill="white" fontSize="9" fontWeight="600" textAnchor="middle">85%</text>
                  </g>
                </Tooltip>
                
                <Tooltip title={<div className="p-1"><div className="font-semibold">Ankara</div><div className="text-xs">Confidence: 78%</div></div>} arrow>
                  <g>
                    <ellipse cx="350" cy="160" rx="45" ry="30" fill="rgba(59, 130, 246, 0.7)" stroke="#2563eb" strokeWidth="2" className="cursor-pointer hover:opacity-80" />
                    <text x="350" y="157" fill="white" fontSize="12" fontWeight="700" textAnchor="middle">Ankara</text>
                    <text x="350" y="172" fill="white" fontSize="10" fontWeight="600" textAnchor="middle">78%</text>
                  </g>
                </Tooltip>
                
                <Tooltip title={<div className="p-1"><div className="font-semibold">Antalya</div><div className="text-xs">Confidence: 74%</div></div>} arrow>
                  <g>
                    <ellipse cx="280" cy="310" rx="35" ry="22" fill="rgba(251, 191, 36, 0.7)" stroke="#f59e0b" strokeWidth="2" className="cursor-pointer hover:opacity-80" />
                    <text x="280" y="307" fill="white" fontSize="10" fontWeight="700" textAnchor="middle">Antalya</text>
                    <text x="280" y="319" fill="white" fontSize="9" fontWeight="600" textAnchor="middle">74%</text>
                  </g>
                </Tooltip>
                
                <ellipse cx="220" cy="220" rx="30" ry="20" fill="rgba(203, 213, 225, 0.5)" stroke="#94a3b8" strokeWidth="1" />
                <text x="220" y="223" fill="#64748b" fontSize="9" fontWeight="500" textAnchor="middle">Konya</text>
                
                <ellipse cx="440" cy="280" rx="28" ry="18" fill="rgba(203, 213, 225, 0.5)" stroke="#94a3b8" strokeWidth="1" />
                <text x="440" y="283" fill="#64748b" fontSize="9" fontWeight="500" textAnchor="middle">Mersin</text>
                
                <ellipse cx="520" cy="260" rx="28" ry="18" fill="rgba(203, 213, 225, 0.5)" stroke="#94a3b8" strokeWidth="1" />
                <text x="520" y="263" fill="#64748b" fontSize="9" fontWeight="500" textAnchor="middle">Adana</text>
                
                <ellipse cx="620" cy="230" rx="32" ry="20" fill="rgba(203, 213, 225, 0.5)" stroke="#94a3b8" strokeWidth="1" />
                <text x="620" y="233" fill="#64748b" fontSize="9" fontWeight="500" textAnchor="middle">Gaziantep</text>
                
                <ellipse cx="500" cy="150" rx="28" ry="18" fill="rgba(203, 213, 225, 0.5)" stroke="#94a3b8" strokeWidth="1" />
                <text x="500" y="153" fill="#64748b" fontSize="9" fontWeight="500" textAnchor="middle">Samsun</text>
                
                <ellipse cx="680" cy="180" rx="30" ry="20" fill="rgba(203, 213, 225, 0.5)" stroke="#94a3b8" strokeWidth="1" />
                <text x="680" y="183" fill="#64748b" fontSize="9" fontWeight="500" textAnchor="middle">Van</text>
              </svg>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>Confidence:</span>
                <span className="w-3 h-3 rounded bg-yellow-400"></span>
                <span>70-79%</span>
                <span className="w-3 h-3 rounded bg-blue-500"></span>
                <span>80-84%</span>
                <span className="w-3 h-3 rounded bg-green-500"></span>
                <span>85%+</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3 h-3 rounded bg-gray-300"></span>
                <span>No recommendations</span>
              </div>
            </div>
          </div>
          
          {/* Recommendations Section - Merged with Stats */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" data-testid="card-ai-recommendations">
            {/* Stats Header Row */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Recommendations</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Pending:</span>
                    <span className="font-bold text-gray-900">{pendingCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Applied:</span>
                    <span className="font-bold text-green-600">{appliedCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Potential ROAS:</span>
                    <span className="font-bold text-purple-600">+{totalPotentialROAS}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recommendations List */}
            <div className="p-4 space-y-3">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
