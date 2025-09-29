import { useState } from 'react';
import Header from '@/components/overview/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataQualityEnrichment from '@/components/overview/data-quality-enrichment';
import DataHealthAlerts from '@/components/overview/data-health-alerts';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Store, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  MapPin,
  Users
} from 'lucide-react';

export default function OfflineConversions() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [platform, setPlatform] = useState('all');

  // Mock data for CFO-credible metrics
  const kpiData = {
    attributedRevenue: {
      current: 2847500,
      previous: 2234100,
      change: 27.5
    },
    offlineROAS: {
      current: 4.23,
      previous: 3.87,
      change: 9.3
    },
    totalConversions: {
      current: 1847,
      previous: 1623,
      change: 13.8
    },
    avgOrderValue: {
      current: 1542,
      previous: 1377,
      change: 12.0
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatPercent = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Strategic Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Offline Conversions Intelligence Engine
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                Strategic analytics transforming digital advertising impact into CFO-credible financial outcomes. 
                Bridge the omnichannel gap with transaction-based proof of performance.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Executive Summary
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Period:</span>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 days</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2 ml-6">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform:</span>
                </div>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="facebook">Facebook Ads</SelectItem>
                    <SelectItem value="microsoft">Microsoft Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Live Data • Updated 2 min ago
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary for C-Suite Reporting */}
        <Card className="mb-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-slate-600" />
                  <span>Executive Summary</span>
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Strategic financial impact of digital advertising on in-store revenue performance
                </p>
              </div>
              <Badge variant="secondary" className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                CFO Report Ready
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Financial Performance Overview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Key Financial Metrics */}
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Financial Performance Summary</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(2847500)}</div>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Attributed Revenue</div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1 text-green-600">
                          <ArrowUpRight className="w-3 h-3" />
                          <span className="text-xs font-semibold">+27.5%</span>
                        </div>
                        <span className="text-xs text-slate-500">vs previous period</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">4.23:1</div>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Average ROAS</div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1 text-green-600">
                          <ArrowUpRight className="w-3 h-3" />
                          <span className="text-xs font-semibold">+9.3%</span>
                        </div>
                        <span className="text-xs text-slate-500">above target (4:1)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategic Insights */}
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Strategic Performance Insights</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-blue-800 dark:text-blue-300 text-sm">Platform Diversification Success</div>
                          <div className="text-blue-700 dark:text-blue-400 text-xs mt-1">
                            Google Ads leads with 43.8% revenue share, while Facebook (35.1%) and Microsoft (13.6%) provide balanced risk distribution across platforms.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-green-800 dark:text-green-300 text-sm">Store Performance Excellence</div>
                          <div className="text-green-700 dark:text-green-400 text-xs mt-1">
                            Istanbul Zorlu Center generates ₺487,200 in attributed revenue with 3.8% conversion rate, establishing it as the flagship digital-to-physical performance leader.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-orange-800 dark:text-orange-300 text-sm">Temporal Optimization Opportunity</div>
                          <div className="text-orange-700 dark:text-orange-400 text-xs mt-1">
                            Evening hours (19:00-21:00) show 23% higher conversion rates. Budget reallocation could yield additional ₺156K monthly revenue.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Executive Action Items */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Executive Action Items</span>
                </h3>
                <div className="space-y-4">
                  {/* Priority Actions */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs">
                        High Priority
                      </Badge>
                      <span className="text-xs text-slate-500">Est. Impact: +₺156K/mo</span>
                    </div>
                    <div className="font-medium text-slate-900 dark:text-white text-sm mb-2">Budget Reallocation Strategy</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs">
                      Shift 15% of morning budgets to evening hours (19:00-21:00) based on 23% higher conversion performance.
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
                        Medium Priority
                      </Badge>
                      <span className="text-xs text-slate-500">Est. Impact: +₺89K/mo</span>
                    </div>
                    <div className="font-medium text-slate-900 dark:text-white text-sm mb-2">Weekend Campaign Focus</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs">
                      Develop weekend-specific campaigns targeting Saturday's 22% revenue premium over weekday average.
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                        Strategic
                      </Badge>
                      <span className="text-xs text-slate-500">Long-term ROI</span>
                    </div>
                    <div className="font-medium text-slate-900 dark:text-white text-sm mb-2">Data Attribution Enhancement</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs">
                      Implement advanced attribution modeling to capture 54% more revenue attribution vs first-touch model.
                    </div>
                  </div>
                </div>

                {/* Financial Confidence Indicator */}
                <div className="mt-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">94%</div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Data Confidence</div>
                    <div className="text-xs text-slate-500 mt-1">Attribution accuracy level</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CFO-Credible KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Attributed Offline Revenue */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  Attributed Offline Revenue
                </CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Primary Metric */}
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {formatCurrency(kpiData.attributedRevenue.current)}
              </div>
              
              {/* Variance Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  kpiData.attributedRevenue.change > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {kpiData.attributedRevenue.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{formatPercent(kpiData.attributedRevenue.change)}</span>
                </div>
                <div className="text-xs text-gray-500 font-medium">vs last period</div>
              </div>
              
              {/* Comparison Value */}
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 rounded-md px-3 py-2">
                <span className="font-medium">Previous:</span> {formatCurrency(kpiData.attributedRevenue.previous)}
              </div>
              
              {/* Mini Trendline */}
              <div className="absolute bottom-0 right-0 w-24 h-12 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 96 48" preserveAspectRatio="none">
                  <path 
                    d="M0,40 Q24,32 48,24 T96,8" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    className="text-blue-600"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Offline ROAS */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wider">
                  Offline ROAS
                </CardTitle>
                <div className="p-2 bg-green-500 rounded-lg">
                  <Target className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Primary Metric */}
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {kpiData.offlineROAS.current.toFixed(2)}:1
              </div>
              
              {/* Variance Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  kpiData.offlineROAS.change > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {kpiData.offlineROAS.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{formatPercent(kpiData.offlineROAS.change)}</span>
                </div>
                <div className="text-xs text-gray-500 font-medium">vs last period</div>
              </div>
              
              {/* Comparison Value */}
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 rounded-md px-3 py-2">
                <span className="font-medium">Previous:</span> {kpiData.offlineROAS.previous.toFixed(2)}:1
              </div>
              
              {/* Mini Trendline */}
              <div className="absolute bottom-0 right-0 w-24 h-12 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 96 48" preserveAspectRatio="none">
                  <path 
                    d="M0,36 Q24,30 48,20 T96,12" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    className="text-green-600"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Total Conversions */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-800/10 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  Store Conversions
                </CardTitle>
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Store className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Primary Metric */}
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {formatNumber(kpiData.totalConversions.current)}
              </div>
              
              {/* Variance Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  kpiData.totalConversions.change > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {kpiData.totalConversions.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{formatPercent(kpiData.totalConversions.change)}</span>
                </div>
                <div className="text-xs text-gray-500 font-medium">vs last period</div>
              </div>
              
              {/* Comparison Value */}
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 rounded-md px-3 py-2">
                <span className="font-medium">Previous:</span> {formatNumber(kpiData.totalConversions.previous)}
              </div>
              
              {/* Mini Trendline */}
              <div className="absolute bottom-0 right-0 w-24 h-12 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 96 48" preserveAspectRatio="none">
                  <path 
                    d="M0,42 Q24,38 48,28 T96,16" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    className="text-purple-600"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Average Order Value */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                  Avg Order Value
                </CardTitle>
                <div className="p-2 bg-orange-500 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Primary Metric */}
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {formatCurrency(kpiData.avgOrderValue.current)}
              </div>
              
              {/* Variance Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  kpiData.avgOrderValue.change > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {kpiData.avgOrderValue.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{formatPercent(kpiData.avgOrderValue.change)}</span>
                </div>
                <div className="text-xs text-gray-500 font-medium">vs last period</div>
              </div>
              
              {/* Comparison Value */}
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 rounded-md px-3 py-2">
                <span className="font-medium">Previous:</span> {formatCurrency(kpiData.avgOrderValue.previous)}
              </div>
              
              {/* Mini Trendline */}
              <div className="absolute bottom-0 right-0 w-24 h-12 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 96 48" preserveAspectRatio="none">
                  <path 
                    d="M0,44 Q24,38 48,26 T96,14" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    className="text-orange-600"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Attribution Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <span>Revenue Attribution Analysis</span>
                </div>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  Last 30 Days
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Attribution Breakdown */}
              <div className="space-y-6">
                {/* Platform Attribution */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-4">Digital Platform Attribution</h4>
                  <div className="space-y-4">
                    {[
                      { platform: 'Google Ads', revenue: 1247800, percentage: 43.8, color: 'bg-blue-500', conversions: 672 },
                      { platform: 'Facebook Ads', revenue: 998600, percentage: 35.1, color: 'bg-green-500', conversions: 534 },
                      { platform: 'Microsoft Ads', revenue: 387200, percentage: 13.6, color: 'bg-purple-500', conversions: 221 },
                      { platform: 'Direct/Organic', revenue: 213900, percentage: 7.5, color: 'bg-gray-500', conversions: 142 }
                    ].map((item, index) => (
                      <div key={item.platform} className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color.replace('bg-', '') === 'blue-500' ? '#3B82F6' : item.color.replace('bg-', '') === 'green-500' ? '#10B981' : item.color.replace('bg-', '') === 'purple-500' ? '#8B5CF6' : '#6B7280' }}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.platform}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.revenue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-4">
                              <div 
                                className={`h-2 rounded-full ${item.color}`} 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 min-w-0 flex space-x-3">
                              <span>{item.percentage}%</span>
                              <span>{item.conversions} orders</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attribution Model Impact */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-4">Attribution Model Impact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(1847500)}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">First-Touch Attribution</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Credits first interaction</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(2847500)}</div>
                      <div className="text-sm text-green-700 dark:text-green-300 font-medium">Data-Driven Attribution</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">AI-powered model (current)</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-green-600 dark:text-green-400">+54.1%</span> revenue attribution improvement using data-driven model vs first-touch
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store-Level Conversion Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>Store-Level Conversion Insights</span>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Revenue Leaders
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {[
                  {
                    store: 'Istanbul Zorlu Center',
                    city: 'Istanbul',
                    attributedRevenue: 487200,
                    digitalOrders: 142,
                    conversionRate: 3.8,
                    avgOrderValue: 3431,
                    topChannel: 'Google Ads',
                    channelShare: 67,
                    performance: 'excellent'
                  },
                  {
                    store: 'Ankara Ankamall',
                    city: 'Ankara', 
                    attributedRevenue: 356800,
                    digitalOrders: 124,
                    conversionRate: 3.2,
                    avgOrderValue: 2877,
                    topChannel: 'Facebook Ads',
                    channelShare: 54,
                    performance: 'excellent'
                  },
                  {
                    store: 'Izmir Optimum',
                    city: 'Izmir',
                    attributedRevenue: 298600,
                    digitalOrders: 96,
                    conversionRate: 2.9,
                    avgOrderValue: 3110,
                    topChannel: 'Google Ads',
                    channelShare: 61,
                    performance: 'good'
                  },
                  {
                    store: 'Bursa Kent Meydanı',
                    city: 'Bursa',
                    attributedRevenue: 189400,
                    digitalOrders: 67,
                    conversionRate: 2.4,
                    avgOrderValue: 2827,
                    topChannel: 'Facebook Ads',
                    channelShare: 48,
                    performance: 'good'
                  },
                  {
                    store: 'Antalya Terracity',
                    city: 'Antalya',
                    attributedRevenue: 156700,
                    digitalOrders: 53,
                    conversionRate: 2.1,
                    avgOrderValue: 2957,
                    topChannel: 'Microsoft Ads',
                    channelShare: 42,
                    performance: 'moderate'
                  }
                ].map((location, index) => {
                  const performanceColor = location.performance === 'excellent' ? 'border-l-green-500 bg-green-50 dark:bg-green-900/10' :
                                         location.performance === 'good' ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10' :
                                         'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
                  
                  return (
                    <div key={location.store} className={`border-l-4 ${performanceColor} rounded-lg p-4`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{location.store}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{location.city} • #{index + 1} Revenue Performance</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(location.attributedRevenue)}</div>
                          <div className="text-xs text-gray-500">Digital Attribution</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Digital Orders:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatNumber(location.digitalOrders)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Conversion Rate:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{location.conversionRate}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Avg Order Value:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(location.avgOrderValue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Top Channel:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{location.topChannel} ({location.channelShare}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Store Performance Summary */}
                <div className="border-t pt-5 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(1488700)}</div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Store Revenue</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">From digital attribution across 5 locations</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">2.87%</div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Store Conversion Rate</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Digital campaign to in-store purchase</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span>Campaign Performance Matrix</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-purple-700 border-purple-300">
                  Financial Impact
                </Badge>
                <Button variant="outline" size="sm" className="text-xs">
                  Export Data
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Performance Table Header */}
              <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">
                <div>Campaign</div>
                <div className="text-right">Ad Spend</div>
                <div className="text-right">Store Revenue</div>
                <div className="text-right">ROAS</div>
                <div className="text-right">Conversions</div>
                <div className="text-right">Revenue/Conv</div>
              </div>

              {/* Campaign Performance Rows */}
              <div className="space-y-3">
                {[
                  {
                    name: 'Spring Fashion Collection',
                    platform: 'Google Ads',
                    spend: 125400,
                    revenue: 672800,
                    roas: 5.36,
                    conversions: 284,
                    revenuePerConv: 2369,
                    performance: 'excellent'
                  },
                  {
                    name: 'Men\'s Casual Wear',
                    platform: 'Facebook Ads',
                    spend: 89200,
                    revenue: 445600,
                    roas: 4.99,
                    conversions: 198,
                    revenuePerConv: 2251,
                    performance: 'excellent'
                  },
                  {
                    name: 'Women\'s Summer Sale',
                    platform: 'Google Ads',
                    spend: 67800,
                    revenue: 298300,
                    roas: 4.40,
                    conversions: 156,
                    revenuePerConv: 1912,
                    performance: 'good'
                  },
                  {
                    name: 'Footwear Collection',
                    platform: 'Microsoft Ads',
                    spend: 45600,
                    revenue: 167200,
                    roas: 3.67,
                    conversions: 89,
                    revenuePerConv: 1879,
                    performance: 'good'
                  },
                  {
                    name: 'Accessories Campaign',
                    platform: 'Facebook Ads',
                    spend: 32100,
                    revenue: 89400,
                    roas: 2.78,
                    conversions: 52,
                    revenuePerConv: 1719,
                    performance: 'moderate'
                  }
                ].map((campaign, index) => {
                  const performanceColor = campaign.performance === 'excellent' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' :
                                         campaign.performance === 'good' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' :
                                         'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
                  
                  return (
                    <div key={index} className="grid grid-cols-6 gap-4 px-4 py-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{campaign.name}</div>
                        <div className="text-xs text-gray-500">{campaign.platform}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(campaign.spend)}</div>
                        <div className="text-xs text-gray-500">Budget</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(campaign.revenue)}</div>
                        <div className="text-xs text-gray-500">Attributed</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-sm px-2 py-1 rounded-full ${performanceColor}`}>
                          {campaign.roas.toFixed(2)}:1
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">{formatNumber(campaign.conversions)}</div>
                        <div className="text-xs text-gray-500">Orders</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(campaign.revenuePerConv)}</div>
                        <div className="text-xs text-gray-500">Avg Value</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Insights */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">4.54:1</div>
                    <div className="text-sm font-medium text-green-700 dark:text-green-300">Avg Campaign ROAS</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Above 4:1 target threshold</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(1673300)}</div>
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Attributed Revenue</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">From active campaigns</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">779</div>
                    <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Store Conversions</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Digital-driven purchases</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time-Series Analysis for Trend Identification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Revenue Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Revenue Trend Analysis</span>
                </div>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  7-Day Trends
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Weekly Revenue Trend */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-4">Daily Attributed Revenue</h4>
                  <div className="space-y-3">
                    {[
                      { day: 'Monday', revenue: 456200, change: +12.3, isOptimal: true },
                      { day: 'Tuesday', revenue: 398600, change: +8.7, isOptimal: true },
                      { day: 'Wednesday', revenue: 423800, change: +15.2, isOptimal: true },
                      { day: 'Thursday', revenue: 387400, change: +5.9, isOptimal: false },
                      { day: 'Friday', revenue: 521300, change: +18.6, isOptimal: true },
                      { day: 'Saturday', revenue: 612700, change: +22.4, isOptimal: true },
                      { day: 'Sunday', revenue: 447500, change: +9.8, isOptimal: false }
                    ].map((dayData, index) => {
                      const maxRevenue = 612700;
                      const percentage = (dayData.revenue / maxRevenue) * 100;
                      
                      return (
                        <div key={dayData.day} className="flex items-center space-x-4">
                          <div className="w-16 text-xs text-gray-600 dark:text-gray-400 font-medium">{dayData.day}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(dayData.revenue)}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs font-semibold ${dayData.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {dayData.change > 0 ? '+' : ''}{dayData.change}%
                                </span>
                                {dayData.isOptimal && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Optimal
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Insights */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Weekly Insights</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>Weekend peak:</strong> Saturday generates 22.4% higher revenue than weekday average
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>Optimization opportunity:</strong> Thursday shows lowest performance, consider increasing budget
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Rate Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Conversion Rate Optimization</span>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Performance Peaks
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Hourly Conversion Patterns */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-4">Peak Conversion Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { time: '10:00-12:00', rate: 4.2, impact: 'high', orders: 89 },
                      { time: '14:00-16:00', rate: 3.8, impact: 'high', orders: 76 },
                      { time: '19:00-21:00', rate: 5.1, impact: 'peak', orders: 112 },
                      { time: '21:00-23:00', rate: 3.2, impact: 'medium', orders: 58 }
                    ].map((timeSlot, index) => {
                      const impactColor = timeSlot.impact === 'peak' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
                                         timeSlot.impact === 'high' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' :
                                         'border-orange-500 bg-orange-50 dark:bg-orange-900/10';
                      
                      return (
                        <div key={index} className={`border-l-4 ${impactColor} rounded-lg p-3`}>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{timeSlot.time}</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{timeSlot.rate}%</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{timeSlot.orders} conversions</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Platform Performance by Time */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Platform Performance Timing</h4>
                  <div className="space-y-3">
                    {[
                      { platform: 'Google Ads', peakTime: '19:00-21:00', peakRate: 5.8, color: 'text-blue-600' },
                      { platform: 'Facebook Ads', peakTime: '20:00-22:00', peakRate: 4.9, color: 'text-green-600' },
                      { platform: 'Microsoft Ads', peakTime: '10:00-12:00', peakRate: 3.7, color: 'text-purple-600' }
                    ].map((platform, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div>
                          <div className={`font-medium text-sm ${platform.color}`}>{platform.platform}</div>
                          <div className="text-xs text-gray-500">Peak: {platform.peakTime}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white">{platform.peakRate}%</div>
                          <div className="text-xs text-gray-500">Conversion rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimization Recommendations */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Smart Recommendations</h4>
                  <div className="space-y-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Increase evening budgets</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        19:00-21:00 shows 23% higher conversion rates. Shift 15% of morning budget to evening.
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-3">
                      <div className="text-sm font-medium text-green-700 dark:text-green-300">Weekend optimization</div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Saturday revenue 22% above average. Consider weekend-specific campaigns.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Quality Assessment */}
        <div className="mt-8">
          <DataQualityEnrichment context="dashboard" />
        </div>

        {/* Data Health & Flow - Last Section */}
        <div className="mt-8">
          <DataHealthAlerts 
            bannerMode={false}
            alwaysExpanded={true}
          />
        </div>
      </div>
    </div>
  );
}