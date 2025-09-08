import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const platforms = [
  "VenueX",
  "Google Business Profile", 
  "Meta Business",
  "Apple Business Connect",
  "Tiktok Business"
];

export function PlatformSummarySection() {
  const [activePlatform, setActivePlatform] = useState(0);

  // Get current date and time
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="mx-6 mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Platform Tabs */}
      <div className="flex border-b border-gray-200">
        {platforms.map((platform, index) => (
          <button
            key={index}
            onClick={() => setActivePlatform(index)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-r border-gray-200 last:border-r-0 ${
              activePlatform === index
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-8 bg-gray-50">
        <div className="flex items-start justify-between">
          {/* Left side - Main count */}
          <div>
            <div className="text-7xl font-bold text-gray-900 mb-2">130</div>
            <div className="text-lg text-gray-600">Lokasyon</div>
          </div>

          {/* Right side - Last update */}
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Son Güncelleme Tarihi:</div>
            <div className="text-lg font-medium text-gray-900">
              {formattedDate} {formattedTime}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center">
              <span className="text-gray-900 font-medium">Lokasyonlar</span>
              <span className="text-gray-500 ml-1">(130)</span>
            </div>
            <Button size="sm" className="rounded-full w-8 h-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}