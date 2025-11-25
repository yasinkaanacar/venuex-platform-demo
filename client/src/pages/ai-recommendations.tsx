import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, TrendingUp, Target, Zap, MapPin, Clock, CheckCircle, Lightbulb, AlertTriangle } from "lucide-react";
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

const riskColors = {
  low: "text-green-600 bg-green-100",
  medium: "text-yellow-600 bg-yellow-100",
  high: "text-red-600 bg-red-100",
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

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return `rgba(147, 51, 234, ${0.5 + (score / 100) * 0.5})`; // Purple for high opportunity
    if (score >= 60) return `rgba(59, 130, 246, ${0.4 + (score / 100) * 0.4})`; // Blue for medium
    return `rgba(156, 163, 175, ${0.3 + (score / 100) * 0.4})`; // Gray for low
  };

  const getRiskColor = (risk: string, hasRecommendations: boolean) => {
    if (!hasRecommendations) return `rgba(156, 163, 175, 0.4)`;
    if (risk === "high") return `rgba(239, 68, 68, 0.6)`;
    if (risk === "medium") return `rgba(245, 158, 11, 0.5)`;
    return `rgba(34, 197, 94, 0.5)`;
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
      <Card className="bg-[#f9fafb] shadow-none border border-gray-200 mb-6" data-testid="card-ai-recommendations">
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

      {/* Regional AI Opportunity Map */}
      <Card className="bg-[#f9fafb] shadow-none border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle>Regional AI Opportunity Map</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Click regions to view optimization opportunities</p>
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
          {/* Maps Visualization */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* AI Opportunity Score Map */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">AI Opportunity Score</h3>
              <p className="text-xs text-gray-500 mb-3">Higher scores indicate more optimization potential</p>
              <div className="relative h-72 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
                <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {regionOpportunities.map((item) => {
                    const path = provincePaths[item.state];
                    if (!path) return null;
                    const pos = getTextPosition(item.state);
                    const isSelected = selectedRegion === item.state;
                    const fillColor = getOpportunityColor(item.opportunityScore);
                    
                    return (
                      <Tooltip 
                        key={item.state}
                        title={
                          <div className="text-left p-1">
                            <div className="font-semibold text-sm">{item.state}</div>
                            <div className="text-xs mt-1">Opportunity Score: {item.opportunityScore}/100</div>
                            <div className="text-xs">Pending Actions: {item.pendingRecommendations}</div>
                            {item.potentialROAS > 0 && (
                              <div className="text-xs text-green-300">Potential: +{item.potentialROAS}% ROAS</div>
                            )}
                          </div>
                        }
                        arrow
                      >
                        <g>
                          <path
                            d={path}
                            fill={fillColor}
                            stroke={isSelected ? '#9333ea' : '#6b7280'}
                            strokeWidth={isSelected ? '3' : '1'}
                            className="cursor-pointer transition-all duration-200 hover:opacity-80"
                            onClick={() => setSelectedRegion(item.state)}
                            data-testid={`map-opportunity-${item.state.toLowerCase()}`}
                          />
                          <text
                            x={pos.x}
                            y={pos.y}
                            fill="white"
                            fontSize="10"
                            fontWeight="600"
                            textAnchor="middle"
                            className="pointer-events-none drop-shadow-lg"
                          >
                            {item.opportunityScore}
                          </text>
                        </g>
                      </Tooltip>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                <span>Low (0)</span>
                <div className="flex-1 mx-3 h-3 bg-gradient-to-r from-gray-300 via-blue-400 to-purple-600 rounded"></div>
                <span>High (100)</span>
              </div>
            </div>
            
            {/* Risk Assessment Map */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">Risk Assessment</h3>
              <p className="text-xs text-gray-500 mb-3">Regions requiring immediate attention</p>
              <div className="relative h-72 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
                <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {regionOpportunities.map((item) => {
                    const path = provincePaths[item.state];
                    if (!path) return null;
                    const pos = getTextPosition(item.state);
                    const isSelected = selectedRegion === item.state;
                    const fillColor = getRiskColor(item.riskLevel, item.pendingRecommendations > 0);
                    
                    return (
                      <Tooltip 
                        key={item.state}
                        title={
                          <div className="text-left p-1">
                            <div className="font-semibold text-sm">{item.state}</div>
                            <div className="text-xs mt-1">Risk Level: {item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)}</div>
                            <div className="text-xs">Top Action: {item.topAction}</div>
                          </div>
                        }
                        arrow
                      >
                        <g>
                          <path
                            d={path}
                            fill={fillColor}
                            stroke={isSelected ? '#dc2626' : '#6b7280'}
                            strokeWidth={isSelected ? '3' : '1'}
                            className="cursor-pointer transition-all duration-200 hover:opacity-80"
                            onClick={() => setSelectedRegion(item.state)}
                            data-testid={`map-risk-${item.state.toLowerCase()}`}
                          />
                          <text
                            x={pos.x}
                            y={pos.y}
                            fill={item.riskLevel === 'high' ? '#991b1b' : item.riskLevel === 'medium' ? '#92400e' : '#166534'}
                            fontSize="10"
                            fontWeight="700"
                            textAnchor="middle"
                            className="pointer-events-none"
                          >
                            {item.state.slice(0, 3)}
                          </text>
                        </g>
                      </Tooltip>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-3 flex items-center justify-center gap-6 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-green-400"></span> Low Risk
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-yellow-400"></span> Medium Risk
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-400"></span> High Risk
                </span>
              </div>
            </div>
          </div>
          
          {/* Regional Opportunity Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-regional-opportunities">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Region</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Opportunity Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Pending Actions</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Risk Level</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Potential ROAS</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Top Action</th>
                  </tr>
                </thead>
                <tbody>
                  {regionOpportunities
                    .filter(item => selectedRegion === null || item.state === selectedRegion)
                    .sort((a, b) => b.opportunityScore - a.opportunityScore)
                    .map((item) => (
                    <tr 
                      key={item.state} 
                      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedRegion === item.state ? 'bg-purple-50' : ''}`}
                      onClick={() => setSelectedRegion(item.state === selectedRegion ? null : item.state)}
                      data-testid={`opportunity-row-${item.state.toLowerCase()}`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">{item.state}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                              style={{ width: `${item.opportunityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-purple-600">{item.opportunityScore}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.pendingRecommendations > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {item.pendingRecommendations}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${riskColors[item.riskLevel]}`}>
                          {item.riskLevel === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        {item.potentialROAS > 0 ? `+${item.potentialROAS}%` : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{item.topAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
