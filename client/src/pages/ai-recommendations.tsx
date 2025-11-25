import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, TrendingUp, Target, Zap, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
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

interface GeoPerformanceData {
  state: string;
  offlineRevenue: number;
  offlineROAS: number;
  storeVisits: number;
  conversions: number;
}

const allRecommendations: Recommendation[] = [
  { id: 1, text: "Move 15% from Meta to Google in Istanbul", roas: "+12%", confidence: 82, category: "budget", platform: "Google", region: "Istanbul" },
  { id: 2, text: "Increase bid on high-converting Ankara stores by 20%", roas: "+8%", confidence: 78, category: "bidding", platform: "Google", region: "Ankara" },
  { id: 3, text: "Shift 10% budget to evening hours in Izmir", roas: "+15%", confidence: 85, category: "targeting", platform: "All", region: "Izmir" },
  { id: 4, text: "Pause underperforming Bursa campaigns", roas: "+4%", confidence: 91, category: "budget", platform: "Meta", region: "Bursa" },
  { id: 5, text: "Enable location extensions for Antalya stores", roas: "+6%", confidence: 74, category: "creative", platform: "Google", region: "Antalya" },
];

const mockGeoData: GeoPerformanceData[] = [
  { state: "Istanbul", offlineRevenue: 80173725, offlineROAS: 78.8, storeVisits: 45000, conversions: 8900 },
  { state: "Ankara", offlineRevenue: 48960000, offlineROAS: 77.3, storeVisits: 28000, conversions: 5600 },
  { state: "Izmir", offlineRevenue: 55360000, offlineROAS: 76.5, storeVisits: 32000, conversions: 6400 },
  { state: "Antalya", offlineRevenue: 32400000, offlineROAS: 79.6, storeVisits: 19000, conversions: 3800 },
  { state: "Bursa", offlineRevenue: 37800000, offlineROAS: 76.0, storeVisits: 22000, conversions: 4400 },
  { state: "Adana", offlineRevenue: 25200000, offlineROAS: 74.2, storeVisits: 15000, conversions: 3000 },
  { state: "Konya", offlineRevenue: 16200000, offlineROAS: 75.4, storeVisits: 9800, conversions: 1950 },
  { state: "Gaziantep", offlineRevenue: 13500000, offlineROAS: 76.5, storeVisits: 8000, conversions: 1600 },
  { state: "Kocaeli", offlineRevenue: 20700000, offlineROAS: 73.2, storeVisits: 12800, conversions: 2550 },
  { state: "Mersin", offlineRevenue: 11250000, offlineROAS: 73.2, storeVisits: 6900, conversions: 1380 },
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
  const [selectedMapState, setSelectedMapState] = useState<string | null>(null);
  const [geoState, setGeoState] = useState<string>("all");

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

      {/* Geographic Performance Dashboard */}
      <Card className="bg-[#f9fafb] shadow-none border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Geographic Performance</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Country:</label>
                <Select value="turkey">
                  <SelectTrigger className="w-36 border-gray-300" data-testid="select-geo-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turkey">Turkey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">State:</label>
                <Select value={geoState} onValueChange={(value) => {
                  setGeoState(value);
                  setSelectedMapState(value === "all" ? null : value);
                }}>
                  <SelectTrigger className="w-40 border-gray-300" data-testid="select-geo-state">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {mockGeoData.map(item => (
                      <SelectItem key={item.state} value={item.state}>{item.state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Maps Visualization */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Offline Revenue Distribution Map */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Offline Revenue Distribution</h3>
              <div className="relative h-72 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
                <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {mockGeoData.map((item) => {
                    const totalRevenue = item.offlineRevenue;
                    const maxRevenue = Math.max(...mockGeoData.map(d => d.offlineRevenue));
                    const intensity = (totalRevenue / maxRevenue);
                    const isSelected = selectedMapState === item.state;
                    const fillColor = `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
                    const path = provincePaths[item.state];
                    if (!path) return null;
                    const pos = getTextPosition(item.state);
                    
                    return (
                      <Tooltip 
                        key={item.state}
                        title={
                          <div className="text-left">
                            <div className="font-medium">{item.state}</div>
                            <div className="text-sm">Revenue: ₺{(totalRevenue / 1000000).toFixed(1)}M</div>
                          </div>
                        }
                        arrow
                      >
                        <g>
                          <path
                            d={path}
                            fill={fillColor}
                            stroke={isSelected ? '#3b82f6' : '#9ca3af'}
                            strokeWidth={isSelected ? '3' : '1'}
                            className="cursor-pointer transition-all duration-200 hover:opacity-80"
                            onClick={() => {
                              setGeoState(item.state);
                              setSelectedMapState(item.state);
                            }}
                            data-testid={`map-revenue-${item.state.toLowerCase()}`}
                          />
                          <text
                            x={pos.x}
                            y={pos.y}
                            fill="white"
                            fontSize="11"
                            fontWeight="600"
                            textAnchor="middle"
                            className="pointer-events-none drop-shadow-lg"
                          >
                            {item.state}
                          </text>
                        </g>
                      </Tooltip>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                <span>₺11.3M</span>
                <div className="flex-1 mx-3 h-3 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded"></div>
                <span>₺80.2M</span>
              </div>
            </div>
            
            {/* Offline ROAS Distribution Map */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Offline ROAS Distribution</h3>
              <div className="relative h-72 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
                <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {mockGeoData.map((item) => {
                    const avgROAS = item.offlineROAS;
                    const maxROAS = Math.max(...mockGeoData.map(d => d.offlineROAS));
                    const intensity = (avgROAS / maxROAS);
                    const isSelected = selectedMapState === item.state;
                    const fillColor = `rgba(34, 197, 94, ${0.3 + intensity * 0.7})`;
                    const path = provincePaths[item.state];
                    if (!path) return null;
                    const pos = getTextPosition(item.state);
                    
                    return (
                      <Tooltip 
                        key={item.state}
                        title={
                          <div className="text-left">
                            <div className="font-medium">{item.state}</div>
                            <div className="text-sm">ROAS: {item.offlineROAS.toFixed(1)}x</div>
                          </div>
                        }
                        arrow
                      >
                        <g>
                          <path
                            d={path}
                            fill={fillColor}
                            stroke={isSelected ? '#22c55e' : '#9ca3af'}
                            strokeWidth={isSelected ? '3' : '1'}
                            className="cursor-pointer transition-all duration-200 hover:opacity-80"
                            onClick={() => {
                              setGeoState(item.state);
                              setSelectedMapState(item.state);
                            }}
                            data-testid={`map-roas-${item.state.toLowerCase()}`}
                          />
                          <text
                            x={pos.x}
                            y={pos.y}
                            fill="white"
                            fontSize="11"
                            fontWeight="600"
                            textAnchor="middle"
                            className="pointer-events-none drop-shadow-lg"
                          >
                            {item.state}
                          </text>
                        </g>
                      </Tooltip>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                <span>73.2x</span>
                <div className="flex-1 mx-3 h-3 bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded"></div>
                <span>79.6x</span>
              </div>
            </div>
          </div>
          
          {/* Geographic Performance Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-geo-performance">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">State</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Store Visits</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Conversions</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Offline Revenue</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Offline ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {mockGeoData
                    .filter(item => selectedMapState === null || item.state === selectedMapState)
                    .map((item) => (
                    <tr 
                      key={item.state} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      data-testid={`geo-row-${item.state.toLowerCase()}`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">{item.state}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{item.storeVisits.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{item.conversions.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">₺{(item.offlineRevenue / 1000000).toFixed(1)}M</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">{item.offlineROAS.toFixed(1)}x</td>
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
