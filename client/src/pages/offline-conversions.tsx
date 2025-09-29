import { useState } from 'react';
import Header from '@/components/overview/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

        {/* CFO-Credible KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Attributed Offline Revenue */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Attributed Offline Revenue
                </CardTitle>
                <DollarSign className="w-4 h-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(kpiData.attributedRevenue.current)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 text-sm ${
                    kpiData.attributedRevenue.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpiData.attributedRevenue.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{formatPercent(kpiData.attributedRevenue.change)}</span>
                  </div>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
                <div className="text-xs text-gray-500">
                  Previous: {formatCurrency(kpiData.attributedRevenue.previous)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offline ROAS */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Offline ROAS
                </CardTitle>
                <Target className="w-4 h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {kpiData.offlineROAS.current.toFixed(2)}:1
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 text-sm ${
                    kpiData.offlineROAS.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpiData.offlineROAS.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{formatPercent(kpiData.offlineROAS.change)}</span>
                  </div>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
                <div className="text-xs text-gray-500">
                  Previous: {kpiData.offlineROAS.previous.toFixed(2)}:1
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Conversions */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Store Conversions
                </CardTitle>
                <Store className="w-4 h-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(kpiData.totalConversions.current)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 text-sm ${
                    kpiData.totalConversions.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpiData.totalConversions.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{formatPercent(kpiData.totalConversions.change)}</span>
                  </div>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
                <div className="text-xs text-gray-500">
                  Previous: {formatNumber(kpiData.totalConversions.previous)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Order Value */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Order Value
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(kpiData.avgOrderValue.current)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 text-sm ${
                    kpiData.avgOrderValue.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpiData.avgOrderValue.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{formatPercent(kpiData.avgOrderValue.change)}</span>
                  </div>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
                <div className="text-xs text-gray-500">
                  Previous: {formatCurrency(kpiData.avgOrderValue.previous)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Attribution Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                <span>Revenue Attribution Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Revenue attribution chart will be implemented here
              </div>
            </CardContent>
          </Card>

          {/* Top Converting Stores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>Top Converting Stores</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Istanbul Zorlu Center', 'Ankara Ankamall', 'Izmir Optimum'].map((store, index) => (
                  <div key={store} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{store}</div>
                      <div className="text-xs text-gray-500">#{index + 1} performer</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{formatCurrency((850 - index * 150) * 1000)}</div>
                      <div className="text-xs text-gray-500">{120 - index * 15} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Campaign Performance Matrix</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Campaign performance matrix and detailed analytics will be implemented here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}