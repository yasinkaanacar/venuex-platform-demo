import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Globe, 
  Smartphone,
  Check,
  ArrowRight,
  Zap,
  Building2,
  ShoppingBag,
  Video
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';

interface PlatformConnection {
  id: string;
  name: string;
  description: string;
  icon: typeof SiGoogle;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  hoverBorderColor: string;
  services: string[];
  connected: boolean;
  connecting: boolean;
}

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [platforms, setPlatforms] = useState<PlatformConnection[]>([
    {
      id: 'google',
      name: 'Google',
      description: 'Ads, Business Profile, Merchant Center',
      icon: SiGoogle,
      iconColor: 'text-[#4285F4]',
      bgColor: 'bg-blue-50',
      borderColor: 'border-gray-200',
      hoverBorderColor: 'hover:border-blue-400',
      services: ['Google Ads', 'Business Profile', 'Merchant Center'],
      connected: false,
      connecting: false
    },
    {
      id: 'meta',
      name: 'Meta',
      description: 'Business Manager, Facebook & Instagram Ads',
      icon: SiMeta,
      iconColor: 'text-[#0081FB]',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-gray-200',
      hoverBorderColor: 'hover:border-indigo-400',
      services: ['Business Manager', 'Facebook Ads', 'Instagram Ads'],
      connected: false,
      connecting: false
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Ads Manager',
      icon: SiTiktok,
      iconColor: 'text-black',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      hoverBorderColor: 'hover:border-gray-400',
      services: ['TikTok Ads Manager'],
      connected: false,
      connecting: false
    },
    {
      id: 'apple',
      name: 'Apple',
      description: 'Business Connect',
      icon: SiApple,
      iconColor: 'text-black',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      hoverBorderColor: 'hover:border-gray-400',
      services: ['Apple Business Connect'],
      connected: false,
      connecting: false
    }
  ]);

  const connectedCount = platforms.filter(p => p.connected).length;
  const progress = (connectedCount / platforms.length) * 100;

  const handleConnect = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, connecting: true } : p
    ));

    // Simulate OAuth flow
    setTimeout(() => {
      setPlatforms(prev => prev.map(p => 
        p.id === platformId ? { ...p, connecting: false, connected: true } : p
      ));
    }, 1500);
  };

  const handleDisconnect = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, connected: false } : p
    ));
  };

  const handleContinue = () => {
    // Navigate to next step or dashboard
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">VenueX Data Bridge</h1>
                <p className="text-xs text-gray-500">Adım 1/3</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{connectedCount}/{platforms.length} Bağlandı</p>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Globe size={16} />
            Platform Bağlantıları
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Reklam Platformlarını Bağla
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Platformlarınızı bağlayarak lokasyon verilerinizi ve reklam performansınızı tek panelden yönetin.
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <div
                key={platform.id}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  platform.connected 
                    ? 'bg-white border-green-400 shadow-lg shadow-green-100' 
                    : `bg-white ${platform.borderColor} ${platform.hoverBorderColor} hover:shadow-lg`
                }`}
              >
                {/* Connected Badge */}
                {platform.connected && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check size={18} className="text-white" />
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl ${platform.bgColor} flex items-center justify-center`}>
                      <IconComponent className={`w-7 h-7 ${platform.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-500">{platform.description}</p>
                    </div>
                  </div>
                </div>

                {/* Services List */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {platform.services.map((service) => (
                    <span 
                      key={service}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        platform.connected 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Connect Button */}
                {platform.connected ? (
                  <button
                    onClick={() => handleDisconnect(platform.id)}
                    className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    data-testid={`button-disconnect-${platform.id}`}
                  >
                    <Check size={18} className="text-green-500" />
                    Bağlandı
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={platform.connecting}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      platform.connecting
                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                    }`}
                    data-testid={`button-connect-${platform.id}`}
                  >
                    {platform.connecting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                        Bağlanıyor...
                      </>
                    ) : (
                      <>
                        <IconComponent className="w-5 h-5" />
                        {platform.name} ile Bağlan
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={connectedCount === 0}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 ${
              connectedCount > 0
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            data-testid="button-continue"
          >
            Devam Et
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Helper Text */}
        {connectedCount === 0 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Devam etmek için en az bir platform bağlayın
          </p>
        )}

        {connectedCount > 0 && connectedCount < platforms.length && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Daha fazla platform bağlayarak daha kapsamlı analizler elde edebilirsiniz
          </p>
        )}
      </main>
    </div>
  );
}
