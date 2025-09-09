import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Info, Phone, Navigation, Eye, MousePointer, Plus, Upload, Settings } from "lucide-react";
import { BusinessMetricsSection } from "@/components/locations/BusinessMetricsSection";

const platforms = [
  "VenueX",
  "Google Business Profile", 
  "Meta Business",
  "Apple Business Connect",
  "Yandex Maps"
];

const StatusItem = ({ count, label, icon }: { count: number; label: string; icon?: boolean }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-gray-900">{count}</span>
      <span className="text-sm text-gray-600">{label}</span>
      {icon && <Info className="w-4 h-4 text-gray-400" />}
    </div>
  </div>
);

const EngagementMetric = ({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) => (
  <div className="text-center">
    <div className="flex items-center justify-center mb-2">
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

interface PlatformSummarySectionProps {
  onManageFields?: () => void;
  onAddNewLocation?: () => void;
  onUploadLocations?: () => void;
}

export function PlatformSummarySection({ 
  onManageFields, 
  onAddNewLocation, 
  onUploadLocations 
}: PlatformSummarySectionProps) {
  const [activePlatform, setActivePlatform] = useState(0);

  // Get current date and time
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const renderContent = () => {
    if (activePlatform === 1) { // Google Business Profile
      return (
        <div className="p-8 bg-gray-50">
          <div className="grid grid-cols-3 gap-8 items-center mb-8">
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
            
            <div className="grid grid-cols-4 gap-8">
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
        <div className="p-8 bg-gray-50">
          <div className="grid grid-cols-3 gap-8 items-center mb-8">
            {/* 1/3 - Location count */}
            <div className="text-center">
              <div className="text-7xl font-bold text-gray-900 mb-2">127</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* 1/3 - First pair */}
            <div className="space-y-4 text-center">
              <StatusItem count={3} label="Beklemede" icon />
              <StatusItem count={2} label="Reddedilmiş" icon />
              <StatusItem count={1} label="İncelenmede" icon />
            </div>

            {/* 1/3 - Second pair */}
            <div className="space-y-4 text-center">
              <StatusItem count={2} label="Yinelenmış" icon />
              <StatusItem count={0} label="Geçici Kapalı" icon />
              <StatusItem count={1} label="Güncelleme Gerekli" icon />
            </div>
          </div>

          {/* Page Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Page Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-8">
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
        <div className="p-8 bg-gray-50">
          <div className="grid grid-cols-3 gap-8 items-center mb-8">
            {/* 1/3 - Location count */}
            <div className="text-center">
              <div className="text-7xl font-bold text-gray-900 mb-2">98</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* 1/3 - First pair */}
            <div className="space-y-4 text-center">
              <StatusItem count={2} label="Doğrulama Bekliyor" icon />
              <StatusItem count={1} label="Güncellenmeyi Bekliyor" icon />
              <StatusItem count={0} label="Hata" icon />
            </div>

            {/* 1/3 - Second pair */}
            <div className="space-y-4 text-center">
              <StatusItem count={1} label="Yinelenmış" icon />
              <StatusItem count={0} label="Kapalı" icon />
              <StatusItem count={1} label="Bilgi Eksik" icon />
            </div>
          </div>

          {/* Business Connect Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Maps Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-8">
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
        <div className="p-8 bg-gray-50">
          <div className="grid grid-cols-3 gap-8 items-center mb-8">
            {/* 1/3 - Location count */}
            <div className="text-center">
              <div className="text-7xl font-bold text-gray-900 mb-2">89</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* 1/3 - First pair */}
            <div className="space-y-4 text-center">
              <StatusItem count={4} label="Moderasyonda" icon />
              <StatusItem count={1} label="Reddedildi" icon />
              <StatusItem count={2} label="Eksik Bilgi" icon />
            </div>

            {/* 1/3 - Second pair */}
            <div className="space-y-4 text-center">
              <StatusItem count={3} label="Yinelenmış" icon />
              <StatusItem count={0} label="Askıda" icon />
              <StatusItem count={1} label="Güncelleme Bekliyor" icon />
            </div>
          </div>

          {/* Yandex Maps Engagement Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-sm text-gray-500 mb-1">Yandex Maps Engagement</h4>
              <div className="text-xs text-gray-400">Son 30 Gün</div>
            </div>
            
            <div className="grid grid-cols-4 gap-8">
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
      <div className="p-8 bg-gray-50">
        <div className="grid grid-cols-4 gap-4 items-center">
          {/* 1/4 - Location count */}
          <div className="text-center">
            <div className="text-7xl font-bold text-gray-900 mb-2">130</div>
            <div className="text-lg text-gray-600">Lokasyon</div>
          </div>

          {/* 1/4 - Manage Posts */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onManageFields}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full"
              data-testid="btn-manage-fields"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Posts
            </Button>
          </div>

          {/* 1/4 - Add New Location */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddNewLocation}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full"
              data-testid="btn-add-new-location"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Location
            </Button>
          </div>

          {/* 1/4 - Upload Locations */}
          <div className="flex justify-center">
            <Button
              variant="default"
              size="sm"
              onClick={onUploadLocations}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              data-testid="btn-upload-locations"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Locations
            </Button>
          </div>
        </div>

        {/* Business Metrics Card */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <BusinessMetricsSection />
        </div>
      </div>
    );
  };

  return (
    <div className="mx-6 mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Platform Tabs */}
      <div className="flex border-b border-gray-200">
        {platforms.map((platform, index) => (
          <button
            key={index}
            onClick={() => setActivePlatform(index)}
            className="flex-1 px-4 py-3 text-sm font-medium transition-colors border-r border-gray-200 last:border-r-0 text-gray-900 bg-[#f9fafb]"
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