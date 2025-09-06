import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const chartData = [
  { name: 'Jan', desktop: 186, mobile: 80 },
  { name: 'Feb', desktop: 205, mobile: 120 },
  { name: 'Mar', desktop: 207, mobile: 110 },
  { name: 'Apr', desktop: 175, mobile: 150 },
  { name: 'May', desktop: 209, mobile: 170 },
  { name: 'Jun', desktop: 214, mobile: 180 },
];

const pieData = [
  { name: 'Desktop', value: 60.4, color: '#3b82f6' },
  { name: 'Mobile', value: 39.6, color: '#ef4444' }
];

const profileData = [
  { platform: 'Desktop', value: 249.4, percentage: 60.4 },
  { platform: 'Search visit', value: 166.532, percentage: 40.3 },
  { platform: 'Maps mobile', value: 94.637, percentage: 22.9 },
  { platform: 'Maps Desktop', value: 5.329, percentage: 1.3 }
];

const totalSearches = [
  { type: 'Searches', count: '2,863.2M', change: '+8.2%', isPositive: true },
  { type: 'Views', count: '404.4M', change: '+5.4%', isPositive: true },
  { type: 'Clicks', count: '6.945', change: '-0.6%', isPositive: false },
  { type: 'Calls', count: '4.446', change: '-0.9%', isPositive: false }
];

export function BusinessProfileSection() {
  return (
    <Card className="mx-6 mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Business Profile Interactions
          </CardTitle>
          <div className="text-sm text-gray-500">
            August 2024
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line Chart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Desktop (60%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Mobile (40%)</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="desktop" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mobile" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {totalSearches.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.count}
                  </div>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.type}
                    </span>
                    <Badge 
                      variant={stat.isPositive ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Views Section */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Profile views - 166.4K</h4>
              <div className="flex items-center justify-center">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="text-sm text-center space-y-1">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2">
                    <div className={`w-3 h-3 rounded`} style={{ backgroundColor: entry.color }}></div>
                    <span>{entry.name}</span>
                    <span className="font-medium">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Platform usage breakdown that people used to find your profile.
              </h4>
              <div className="space-y-3">
                {profileData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.platform}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.value}K
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}