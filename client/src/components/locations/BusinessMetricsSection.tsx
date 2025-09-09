import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Settings, BarChart3, Star, StarHalf } from 'lucide-react';

const CircularProgress = ({ percentage, size = 60, strokeWidth = 6 }: { percentage: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-500 transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold">{percentage}%</span>
      </div>
    </div>
  );
};

const GaugeChart = ({ percentage }: { percentage: number }) => {
  const angle = (percentage / 100) * 180 - 90;
  
  return (
    <div className="relative w-24 h-12 mb-4">
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="w-20 h-10 border-4 border-gray-200 rounded-t-full relative overflow-hidden">
          <div 
            className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-blue-500 origin-bottom transform -translate-x-1/2"
            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
          />
        </div>
      </div>
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center text-green-600 font-semibold">
          <span className="text-sm">+{percentage}%</span>
          <div className="ml-1 w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-green-600" />
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
  }

  return <div className="flex items-center space-x-1">{stars}</div>;
};

export function BusinessMetricsSection() {
  return (
    <div className="mx-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Geojet Index */}
        <Card className="p-6 text-center">
          <CardContent className="p-0">
            <div className="flex flex-col items-center">
              <GaugeChart percentage={25} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Geojet Index</h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Tips will appear here on how to improve your online map presence and company performance
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Avva Mobile */}
        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avva Mobile</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">4</div>
                  <div className="text-sm text-gray-600">Locations</div>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgress percentage={75} size={50} strokeWidth={4} />
                  <div className="text-sm text-gray-600 mt-1">Completeness</div>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 px-0">
                <Plus className="w-4 h-4 mr-2" />
                Add location
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Listings */}
        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listings</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">2</div>
                  <div className="text-sm text-gray-600">On 1 directories</div>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgress percentage={100} size={50} strokeWidth={4} />
                  <div className="text-sm text-gray-600 mt-1">Accuracy</div>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 px-0">
                <FileText className="w-4 h-4 mr-2" />
                Presence report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
                  <StarRating rating={4.8} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">4</div>
                  <div className="text-sm text-gray-600">Total reviews</div>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 px-0">
                <Settings className="w-4 h-4 mr-2" />
                Manage reviews
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">177</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">66</div>
                  <div className="text-sm text-gray-600">Actions</div>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 px-0">
                <BarChart3 className="w-4 h-4 mr-2" />
                View insights
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}