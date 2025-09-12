import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Info, Phone, Navigation, Eye, MousePointer, Plus, Upload, Settings, Edit } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { BusinessMetricsSection } from "@/components/locations/BusinessMetricsSection";

const platforms = [
  "VenueX",
  "Google Business Profile", 
  "Meta Business",
  "Apple Business Connect",
  "Yandex Maps"
];

const getTooltipContent = (label: string) => {
  const tooltips: { [key: string]: { title: string; description: string } } = {
    'Verified': {
      title: 'What are verified listings?',
      description: 'Business profiles that have been verified by the platform and are showing accurate information to customers.'
    },
    'Unverified': {
      title: 'What are unverified listings?',
      description: 'Business profiles that have not yet been verified by the platform and may need additional confirmation.'
    },
    'Duplicated': {
      title: 'What are duplicated listings?',
      description: 'Business profiles that have duplicate entries on the platform and need to be merged or removed.'
    },
    'Suspended': {
      title: 'What are suspended listings?',
      description: 'Business profiles that have been temporarily suspended due to policy violations or other issues.'
    },
    'Published': {
      title: 'What are published listings?',
      description: 'Business profiles that are live and visible to customers on the platform.'
    },
    'Rejected': {
      title: 'What are rejected listings?',
      description: 'Business profiles that were rejected during the review process and need to be corrected.'
    }
  };
  return tooltips[label] || { title: 'Information', description: 'Additional details about this metric.' };
};

const StatusItem = ({ count, label, icon }: { count: number; label: string; icon?: boolean }) => {
  const tooltipContent = getTooltipContent(label);
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-gray-900">{count}</span>
        <span className="text-sm text-gray-600">{label}</span>
        {icon && (
          <Tooltip 
            title={
              <div>
                <div className="font-medium mb-2">{tooltipContent.title}</div>
                <div className="text-sm">{tooltipContent.description}</div>
              </div>
            }
          >
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const EngagementMetric = ({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) => (
  <div className="text-center">
    <div className="flex items-center justify-center mb-2">
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

interface PlatformSummarySectionProps {}

export function PlatformSummarySection({}: PlatformSummarySectionProps) {
  const [activePlatform, setActivePlatform] = useState(0);

  // Get current date and time
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const renderContent = () => {
    if (activePlatform === 1) { // Google Business Profile
      return (
        <div className="p-6 bg-violet-50">
          <div className="grid grid-cols-3 gap-6 items-center mb-6">
            {/* 1/3 - Location count */}
            <div className="text-center">
              <div className="text-7xl font-bold text-gray-900 mb-2">131</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* 1/3 - Verified/Unverified */}
            <div className="space-y-4 text-center">
              <StatusItem count={120} label="Verified" icon />
              <StatusItem count={6} label="Unverified" icon />
            </div>

            {/* 1/3 - Duplicated/Suspended */}
            <div className="space-y-4 text-center">
              <StatusItem count={4} label="Duplicated" icon />
              <StatusItem count={1} label="Suspended" icon />
            </div>
          </div>

          {/* Listings Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Listings Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              <EngagementMetric 
                value={423} 
                label="Profile Views" 
                icon={<Eye className="w-5 h-5 text-blue-500" />}
              />
              <EngagementMetric 
                value={105} 
                label="Phone Calls" 
                icon={<Phone className="w-5 h-5 text-green-500" />}
              />
              <EngagementMetric 
                value={50} 
                label="Driving Directions" 
                icon={<Navigation className="w-5 h-5 text-purple-500" />}
              />
              <EngagementMetric 
                value={45} 
                label="Clicks to Website" 
                icon={<MousePointer className="w-5 h-5 text-orange-500" />}
              />
            </div>
          </div>
        </div>
      );
    }

    if (activePlatform === 2) { // Meta Business
      return (
        <div className="p-6 bg-violet-50">
          <div className="grid grid-cols-3 gap-6 items-center mb-6">
            {/* 1/3 - Location count */}
            <div className="text-center">
              <div className="text-7xl font-bold text-gray-900 mb-2">127</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* 1/3 - Published */}
            <div className="space-y-4 text-center">
              <StatusItem count={122} label="Published" icon />
            </div>

            {/* 1/3 - Rejected */}
            <div className="space-y-4 text-center">
              <StatusItem count={5} label="Rejected" icon />
            </div>
          </div>

          {/* Page Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Page Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              <EngagementMetric 
                value={312} 
                label="Page Views" 
                icon={<Eye className="w-5 h-5 text-blue-500" />}
              />
              <EngagementMetric 
                value={87} 
                label="Phone Calls" 
                icon={<Phone className="w-5 h-5 text-green-500" />}
              />
              <EngagementMetric 
                value={34} 
                label="Get Directions" 
                icon={<Navigation className="w-5 h-5 text-purple-500" />}
              />
              <EngagementMetric 
                value={29} 
                label="Website Clicks" 
                icon={<MousePointer className="w-5 h-5 text-orange-500" />}
              />
            </div>
          </div>
        </div>
      );
    }

    if (activePlatform === 3) { // Apple Business Connect
      return (
        <div className="p-6 bg-violet-50">
          <div className="grid grid-cols-3 gap-6 items-center mb-6">
            {/* 1/3 - Location count */}
            <div className="text-center">
              <div className="text-7xl font-bold text-gray-900 mb-2">98</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* 1/3 - Published */}
            <div className="space-y-4 text-center">
              <StatusItem count={95} label="Published" icon />
            </div>

            {/* 1/3 - Rejected */}
            <div className="space-y-4 text-center">
              <StatusItem count={3} label="Rejected" icon />
            </div>
          </div>

          {/* Business Connect Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Maps Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              <EngagementMetric 
                value={256} 
                label="Maps Views" 
                icon={<Eye className="w-5 h-5 text-blue-500" />}
              />
              <EngagementMetric 
                value={72} 
                label="Phone Calls" 
                icon={<Phone className="w-5 h-5 text-green-500" />}
              />
              <EngagementMetric 
                value={45} 
                label="Directions Requests" 
                icon={<Navigation className="w-5 h-5 text-purple-500" />}
              />
              <EngagementMetric 
                value={18} 
                label="Website Visits" 
                icon={<MousePointer className="w-5 h-5 text-orange-500" />}
              />
            </div>
          </div>
        </div>
      );
    }

    if (activePlatform === 4) { // Yandex Maps
      return (
        <div className="p-6 bg-violet-50">
          <div className="grid grid-cols-3 gap-6 items-center mb-6">
            {/* 1/3 - Location count */}
            <div className="text-center">
              <div className="text-7xl font-bold text-gray-900 mb-2">89</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* 1/3 - Published */}
            <div className="space-y-4 text-center">
              <StatusItem count={86} label="Published" icon />
            </div>

            {/* 1/3 - Rejected */}
            <div className="space-y-4 text-center">
              <StatusItem count={3} label="Rejected" icon />
            </div>
          </div>

          {/* Yandex Maps Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Yandex Maps Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              <EngagementMetric 
                value={189} 
                label="Profile Views" 
                icon={<Eye className="w-5 h-5 text-blue-500" />}
              />
              <EngagementMetric 
                value={62} 
                label="Phone Calls" 
                icon={<Phone className="w-5 h-5 text-green-500" />}
              />
              <EngagementMetric 
                value={38} 
                label="Route Requests" 
                icon={<Navigation className="w-5 h-5 text-purple-500" />}
              />
              <EngagementMetric 
                value={21} 
                label="Website Clicks" 
                icon={<MousePointer className="w-5 h-5 text-orange-500" />}
              />
            </div>
          </div>
        </div>
      );
    }

    // Default layout for VenueX (index 0)
    return (
      <div className="p-6 bg-[var(--brand-50)]">
        {/* Business Metrics Section */}
        <BusinessMetricsSection />
      </div>
    );
  };

  return (
    <div className="mx-6 mb-6 bg-white rounded-lg border border-violet-200 overflow-hidden shadow-none">
      {/* Platform Tabs */}
      <div className="flex border-b border-violet-200">
        {platforms.map((platform, index) => (
          <button
            key={index}
            onClick={() => setActivePlatform(index)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 border-r border-violet-200 last:border-r-0 ${
              activePlatform === index 
                ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600' 
                : 'bg-violet-50 text-violet-800 hover:bg-violet-100 hover:text-violet-900'
            }`}
          >
            {platform}
          </button>
        ))}
      </div>
      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
}

export default PlatformSummarySection;