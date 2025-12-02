import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Zap,
  Package,
  Globe,
  Smartphone
} from 'lucide-react';
import { SiGoogle, SiApple } from 'react-icons/si';
import StepsSidebar from '@/components/onboarding/steps-sidebar';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const mockLocations: Location[] = [
  { id: '1', name: 'Downtown Store', lat: 41.0082, lng: 28.9784 },
  { id: '2', name: 'Mall Location', lat: 41.0422, lng: 29.0083 },
  { id: '3', name: 'Airport Branch', lat: 40.9769, lng: 28.8146 },
  { id: '4', name: 'Kadıköy Store', lat: 40.9927, lng: 29.0230 },
  { id: '5', name: 'Beşiktaş Branch', lat: 41.0430, lng: 29.0067 },
];

export default function OnboardingStep2Page() {
  const [, setLocation] = useLocation();
  const [googleConnected, setGoogleConnected] = useState(false);
  const [appleConnected, setAppleConnected] = useState(false);
  const [yandexConnected, setYandexConnected] = useState(false);
  const [googleConnecting, setGoogleConnecting] = useState(false);
  const [enableLIA, setEnableLIA] = useState(false);
  const [merchantConnected, setMerchantConnected] = useState(false);
  const [integrationId] = useState(() => Math.floor(10000 + Math.random() * 90000));

  const handleConnectGoogle = () => {
    setGoogleConnecting(true);
    setTimeout(() => {
      setGoogleConnecting(false);
      setGoogleConnected(true);
    }, 1500);
  };

  const handleContinue = () => {
    setLocation('/onboarding/step3');
  };

  const isFormValid = googleConnected || appleConnected;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Steps Sidebar */}
      <StepsSidebar currentStep={2} />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Developer Navigation */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          <span className="text-gray-400 mr-2">Dev:</span>
          <button
            onClick={() => setLocation('/onboarding')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
            data-testid="dev-back"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-blue-400 font-medium">Step 2</span>
          <button
            onClick={() => setLocation('/onboarding/step3')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
            data-testid="dev-next"
          >
            Next <ArrowRight size={14} />
          </button>
        </div>

        {/* Header */}
        <header className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">VenueX</span>
              </div>
              <div className="text-sm text-gray-400">
                Integration ID: <span className="font-mono text-gray-600">#{integrationId}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Headline */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Sync your physical locations.
          </h1>
          <p className="text-gray-500">
            Automatically import your store data, reviews, and hours. No manual entry required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Connection Cards */}
          <div className="space-y-6">
            {/* Primary Card - Google Business Profile */}
            <div 
              className={`relative p-6 rounded-xl border-2 transition-all ${
                googleConnected 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
            >
              {/* Recommended Badge */}
              {!googleConnected && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  Recommended
                </div>
              )}

              {/* Connected Badge */}
              {googleConnected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check size={18} className="text-white" />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <SiGoogle className="w-7 h-7 text-[#4285F4]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Google Business Profile
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Import locations, reviews, photos, and business hours automatically.
                  </p>
                  
                  {googleConnected ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <Check size={18} />
                      {mockLocations.length} locations synced
                    </div>
                  ) : (
                    <button
                      onClick={handleConnectGoogle}
                      disabled={googleConnecting}
                      className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        googleConnecting
                          ? 'bg-gray-100 text-gray-400 cursor-wait'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      data-testid="button-connect-google"
                    >
                      {googleConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <SiGoogle className="w-4 h-4" />
                          Connect Google Business Profile
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setAppleConnected(!appleConnected)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  appleConnected
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid="button-connect-apple"
              >
                {appleConnected && <Check size={16} />}
                <SiApple className="w-4 h-4" />
                Apple Business Connect
              </button>
              
              <button
                onClick={() => setYandexConnected(!yandexConnected)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  yandexConnected
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid="button-connect-yandex"
              >
                {yandexConnected && <Check size={16} />}
                <Globe className="w-4 h-4" />
                Yandex Maps
              </button>
            </div>

            {/* LIA Toggle */}
            <div className="border-t border-gray-100 pt-6">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={enableLIA}
                    onChange={(e) => setEnableLIA(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    data-testid="checkbox-enable-lia"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={18} className="text-gray-600" />
                    <span className="font-medium text-gray-900">Enable Local Inventory Ads (LIA)</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Show your in-store product availability on Google Search & Maps.
                  </p>
                </div>
              </label>

              {/* Merchant Center Button (Conditional) */}
              {enableLIA && (
                <div className="mt-4 ml-9">
                  <button
                    onClick={() => setMerchantConnected(!merchantConnected)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      merchantConnected
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                    }`}
                    data-testid="button-connect-merchant"
                  >
                    {merchantConnected ? (
                      <>
                        <Check size={16} />
                        Merchant Center Connected
                      </>
                    ) : (
                      <>
                        <SiGoogle className="w-4 h-4" />
                        Connect Google Merchant Center
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Map Preview */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                Location Preview
              </h3>
            </div>
            
            <div className="relative h-80 bg-gradient-to-br from-blue-50 to-indigo-50">
              {/* Map Grid Background */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Location Pins */}
              {googleConnected ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {mockLocations.map((loc, index) => (
                      <div
                        key={loc.id}
                        className="absolute animate-bounce"
                        style={{
                          left: `${20 + (index * 15)}%`,
                          top: `${25 + (index % 3) * 20}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        <div className="relative group">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2">
                            <MapPin size={16} className="text-white" />
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {loc.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{mockLocations.length} Locations Imported</p>
                        <p className="text-xs text-gray-500">All locations synced successfully</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={20} className="text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <MapPin size={28} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Connect a platform to see your locations</p>
                    <p className="text-sm text-gray-400 mt-1">Pins will appear on the map automatically</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!isFormValid}
            className={`px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              isFormValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            data-testid="button-continue"
          >
            Save & Continue
            <ArrowRight size={18} />
          </button>
        </div>
        </main>
      </div>
    </div>
  );
}
