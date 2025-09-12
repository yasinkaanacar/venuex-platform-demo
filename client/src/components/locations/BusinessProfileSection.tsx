import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Calendar, Info } from 'lucide-react';

const chartData = [
  { name: 'Aug 25', current: 2000, previous: 1950 },
  { name: '03 Aug', current: 1850, previous: 2100 },
  { name: '05 Aug', current: 1900, previous: 2000 },
  { name: '07 Aug', current: 2400, previous: 1800 },
  { name: '09 Aug', current: 1950, previous: 2050 },
  { name: '11 Aug', current: 1800, previous: 2100 },
  { name: '14 Aug', current: 2100, previous: 1900 },
  { name: '16 Aug', current: 2250, previous: 2200 },
  { name: '18 Aug', current: 1900, previous: 2050 },
  { name: '20 Aug', current: 1850, previous: 1950 },
  { name: '22 Aug', current: 1950, previous: 1900 },
  { name: '24 Aug', current: 2000, previous: 1850 },
  { name: '26 Aug', current: 1950, previous: 1800 },
  { name: '28 Aug', current: 1900, previous: 1950 },
  { name: '30 Aug', current: 2400, previous: 1750 },
];

const platformData = [
  { name: 'Search mobile', value: 58.7, color: '#f59e0b', count: '1,009,909' },
  { name: 'Search web', value: 25.4, color: '#3b82f6', count: '437,131' },
  { name: 'Maps mobile', value: 15.3, color: '#06b6d4', count: '262,691' },
  { name: 'Maps Desktop', value: 0.5, color: '#8b5cf6', count: '9,285' }
];

const searchTerms = [
  { term: 'boyner', count: '920,816' },
  { term: 'calvin klein', count: '16,075' },
  { term: 'avm', count: '11,985' },
  { term: 'boyner mağazaları', count: '10,335' },
  { term: 'boyner outlet', count: '10,049' },
  { term: 'tommy hilfiger', count: '9,373' }
];

const tabs = [
  { label: 'Total', value: '62006', active: true },
  { label: 'Calls Made', value: '23499', active: false },
  { label: 'Website Clicks', value: '3875', active: false },
  { label: 'Direction Requests', value: '34632', active: false }
];

export function BusinessProfileSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Card className="mx-6 mb-6">
      <div className="bg-gradient-to-b from-white to-stone-50 p-6 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-semibold text-foreground">Business Profile Interactions</h3>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center space-x-8">
          <nav className="inline-flex items-center gap-6" role="tablist">
            {tabs.map((tab, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={activeTab === index}
                onClick={() => setActiveTab(index)}
                className={`relative -mb-px inline-flex items-center border-b-2 px-1 py-3 text-sm font-medium transition-all duration-200 focus:outline-none ${
                  activeTab === index
                    ? 'text-emerald-600 border-emerald-500'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
                data-testid={`link-metric-${tab.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="text-center">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-60">({tab.value})</div>
                </div>
              </button>
            ))}
          </nav>
          <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>August 2025</span>
          </button>
        </div>
      </div>
      <CardContent className="bg-stone-50">

        {/* Main Metrics */}
        <div className="mb-6">
          <div className="flex items-baseline space-x-4 mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">62,006</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-lg text-gray-600 dark:text-gray-400">63,615</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Previous</span>
            </div>
            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
              -2.5%
            </Badge>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            July 2025 vs August 2025
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                className="text-xs text-gray-500"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs text-gray-500"
              />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="previous" 
                stroke="#9ca3af" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Views */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">Profile views</h4>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">1,716,216</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +82.4%
                </Badge>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              July 2025 vs August 2025
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="flex items-center justify-center">
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Platform Breakdown */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Platform and device breakdown that people used to find your profile
                </h5>
                {platformData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                      <span className="text-gray-500">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total Searches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">Total searches</h4>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">1,230,916</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +88.4%
                </Badge>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              July 2025 vs August 2025
            </div>
            
            <div className="space-y-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                Search terms breakdown that showed your Business Profile in the search results
              </h5>
              
              <div className="space-y-3">
                {searchTerms.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">{item.term}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                See More
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}