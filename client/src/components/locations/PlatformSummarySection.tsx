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
}: PlatformSummarySectionProps = {}) {
  const [activePlatform, setActivePlatform] = useState(0);

  // Get current date and time
  const now = new Date();
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const renderContent = () => {
    if (activePlatform === 1) { // Google Business Profile
      return (
        <div className="p-8 bg-gray-50">
          <div className="flex items-start justify-between mb-8">
            {/* Left side - Main count */}
            <div>
              <div className="text-7xl font-bold text-gray-900 mb-2">131</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* Middle - Status grid */}
            <div className="flex-1 mx-12">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <StatusItem count={5} label="Doğrulanmamış" icon />
                
                <StatusItem count={4} label="Yinelenmış" icon />
                <StatusItem count={1} label="Kalıcı Olarak Kapalı" icon />
                <StatusItem count={0} label="Güncelleme Talebi Platforma Gönderildi" icon />
              </div>
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
          <div className="flex items-start justify-between mb-8">
            {/* Left side - Main count */}
            <div>
              <div className="text-7xl font-bold text-gray-900 mb-2">127</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* Middle - Status grid */}
            <div className="flex-1 mx-12">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <StatusItem count={3} label="Beklemede" icon />
                <StatusItem count={2} label="Reddedilmiş" icon />
                <StatusItem count={1} label="İncelenmede" icon />
                <StatusItem count={2} label="Yinelenmış" icon />
                <StatusItem count={0} label="Geçici Kapalı" icon />
                <StatusItem count={1} label="Güncelleme Gerekli" icon />
              </div>
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
          <div className="flex items-start justify-between mb-8">
            {/* Left side - Main count */}
            <div>
              <div className="text-7xl font-bold text-gray-900 mb-2">98</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* Middle - Status grid */}
            <div className="flex-1 mx-12">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <StatusItem count={2} label="Doğrulama Bekliyor" icon />
                <StatusItem count={1} label="Güncellenmeyi Bekliyor" icon />
                <StatusItem count={0} label="Hata" icon />
                <StatusItem count={1} label="Yinelenmış" icon />
                <StatusItem count={0} label="Kapalı" icon />
                <StatusItem count={1} label="Bilgi Eksik" icon />
              </div>
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
          <div className="flex items-start justify-between mb-8">
            {/* Left side - Main count */}
            <div>
              <div className="text-7xl font-bold text-gray-900 mb-2">89</div>
              <div className="text-lg text-gray-600">Lokasyon</div>
            </div>

            {/* Middle - Status grid */}
            <div className="flex-1 mx-12">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <StatusItem count={4} label="Moderasyonda" icon />
                <StatusItem count={1} label="Reddedildi" icon />
                <StatusItem count={2} label="Eksik Bilgi" icon />
                <StatusItem count={3} label="Yinelenmış" icon />
                <StatusItem count={0} label="Askıda" icon />
                <StatusItem count={1} label="Güncelleme Bekliyor" icon />
              </div>
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
        <div className="flex items-start justify-between">
          {/* Left side - Main count */}
          <div>
            <div className="text-7xl font-bold text-gray-900 mb-2">130</div>
            <div className="text-lg text-gray-600">Lokasyon</div>
          </div>

          {/* Right side - Last update */}
          <div className="text-right">
            <div className="text-lg font-medium text-gray-900 mb-4">
              {formattedDate} {formattedTime}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onManageFields}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                data-testid="btn-manage-fields"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Posts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddNewLocation}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                data-testid="btn-add-new-location"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Location
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onUploadLocations}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="btn-upload-locations"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Locations
              </Button>
            </div>
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

      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
}