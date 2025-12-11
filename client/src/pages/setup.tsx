import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Building2, 
  MapPin, 
  ShoppingCart, 
  Package,
  Link as LinkIcon,
  Database,
  Settings,
  ExternalLink,
  Check,
  X,
  Globe,
  Phone,
  Mail,
  Image as ImageIcon,
  Plus,
  Shield,
  Upload,
  Zap,
  ArrowRight,
  Lock,
  Info
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';

const integrationId = '59796';
const companyName = 'Acarlar Perakende';

type IntegrationStatus = 'connect' | 'connected' | 'coming_soon';

interface PlatformCard {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: IntegrationStatus;
}

const mockPlatformCards: { locations: PlatformCard[]; sales: PlatformCard[]; catalog: PlatformCard[] } = {
  locations: [
    { 
      id: 'apple', 
      name: 'Apple Business Connect', 
      description: 'Manage your presence on Apple Maps',
      logo: 'apple',
      status: 'connect' 
    },
    { 
      id: 'meta', 
      name: 'Meta Pages', 
      description: 'Connect your Facebook & Instagram pages',
      logo: 'meta',
      status: 'connect' 
    },
    { 
      id: 'yandex', 
      name: 'Yandex Business', 
      description: 'Manage your Yandex Maps listing',
      logo: 'yandex',
      status: 'coming_soon' 
    },
    { 
      id: 'togg', 
      name: 'Togg', 
      description: 'Connect to Togg ecosystem',
      logo: 'togg',
      status: 'connect' 
    },
  ],
  sales: [
    { 
      id: 'google-ads', 
      name: 'Google Ads', 
      description: 'Track offline conversions from Google Ads',
      logo: 'google',
      status: 'connect' 
    },
    { 
      id: 'meta-conversions', 
      name: 'Meta Conversions', 
      description: 'Send conversion events to Meta',
      logo: 'meta',
      status: 'connect' 
    },
    { 
      id: 'tiktok', 
      name: 'TikTok Conversions', 
      description: 'Track TikTok ad conversions',
      logo: 'tiktok',
      status: 'connect' 
    },
  ],
  catalog: [
    { 
      id: 'meta-catalog', 
      name: 'Meta Catalog', 
      description: 'Sync products with Meta Commerce',
      logo: 'meta',
      status: 'connect' 
    },
    { 
      id: 'togg-catalog', 
      name: 'Togg', 
      description: 'Sync inventory with Togg',
      logo: 'togg',
      status: 'connect' 
    },
  ],
};

const steps = [
  { label: 'Brand Infos', icon: Building2 },
  { label: 'Locations', icon: MapPin },
  { label: 'Sales', icon: ShoppingCart },
  { label: 'Catalog', icon: Package },
];


interface IntegrationCardProps {
  name: string;
  description: string;
  logo: string;
  status: 'connect' | 'connected' | 'coming_soon';
}

function IntegrationCard({ name, description, logo, status }: IntegrationCardProps) {
  const getLogo = () => {
    switch (logo) {
      case 'google':
        return <SiGoogle className="w-8 h-8 text-[#4285F4]" />;
      case 'meta':
        return <SiMeta className="w-8 h-8 text-[#0081FB]" />;
      case 'tiktok':
        return <SiTiktok className="w-8 h-8 text-black" />;
      case 'apple':
        return <SiApple className="w-8 h-8 text-black" />;
      case 'yandex':
        return <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm">Y</div>;
      case 'togg':
        return <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">T</div>;
      default:
        return <div className="w-8 h-8 bg-gray-300 rounded" />;
    }
  };

  const getButton = () => {
    switch (status) {
      case 'connected':
        return (
          <button disabled className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed">
            <Check size={14} />
            Connected
          </button>
        );
      case 'coming_soon':
        return (
          <button disabled className="px-3 py-1.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">
            Coming Soon
          </button>
        );
      default:
        return (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            <LinkIcon size={14} />
            Connect
          </button>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          {getLogo()}
        </div>
        {status === 'connected' && (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
        )}
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      {getButton()}
    </div>
  );
}

export default function Setup() {
  const [activeStep, setActiveStep] = useState(0);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [salesDataModalOpen, setSalesDataModalOpen] = useState(false);
  const [dataMappingModalOpen, setDataMappingModalOpen] = useState(false);
  const [brandInfo, setBrandInfo] = useState({
    businessName: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    category: '',
  });
  const [salesConfig, setSalesConfig] = useState({
    dataSourceType: 'HTTP',
    fileUrlType: 'File URL',
    fileUrl: '',
    folderPath: '',
    fileRegex: '',
    dateFormat: '',
    contentFieldPath: '',
    schedulerFrequency: 'DAILY',
    schedulerTime: '02:00',
    timezone: 'Europe/Istanbul',
    username: '',
    password: '',
    privateKey: '',
  });
  const [urlSegments, setUrlSegments] = useState<string[]>([]);
  
  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const handleBrandInfoChange = (field: string, value: string) => {
    setBrandInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSalesConfigChange = (field: string, value: string) => {
    setSalesConfig(prev => ({ ...prev, [field]: value }));
  };

  const addUrlSegment = () => {
    setUrlSegments([...urlSegments, '']);
  };

  const updateUrlSegment = (index: number, value: string) => {
    const newSegments = [...urlSegments];
    newSegments[index] = value;
    setUrlSegments(newSegments);
  };

  const removeUrlSegment = (index: number) => {
    setUrlSegments(urlSegments.filter((_, i) => i !== index));
  };

  const [, navigate] = useLocation();
  const totalSteps = steps.length;
  const completedCount = activeStep;
  
  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-8 py-5 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VenueX</span>
            </div>
          </div>
          <button
            onClick={handleGoToDashboard}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all shadow-sm flex items-center gap-2"
            data-testid="button-go-dashboard"
          >
            Go to Dashboard <ArrowRight size={16} />
          </button>
        </div>
        
        {/* Integration ID Bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full shadow-md">
            <Lock size={14} />
            <span className="text-sm font-semibold">#{integrationId}</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">{companyName}</span>
          <div className="flex items-center gap-2 text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full">
            <Info size={14} />
            <span className="text-xs">Save your progress anytime</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Setup Progress</span>
            <span className="text-xs font-semibold text-blue-600">{Math.round((completedCount / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">

        <div className="flex gap-5 mb-8">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const StepIcon = step.icon;
            const stepStyles = [
              { bg: 'bg-blue-600', shadow: 'shadow-blue-500/30', ring: 'ring-blue-400', desc: 'Business name, logo & contact' },
              { bg: 'bg-cyan-600', shadow: 'shadow-cyan-500/30', ring: 'ring-cyan-400', desc: 'Google & Apple Maps profiles' },
              { bg: 'bg-emerald-600', shadow: 'shadow-emerald-500/30', ring: 'ring-emerald-400', desc: 'POS data & ad platforms' },
              { bg: 'bg-purple-600', shadow: 'shadow-purple-500/30', ring: 'ring-purple-400', desc: 'Product feeds & inventory' }
            ];
            const style = stepStyles[index] || { bg: 'bg-gray-500', shadow: 'shadow-gray-500/30', ring: 'ring-gray-400', desc: '' };
            
            return (
              <div
                key={step.label}
                onClick={() => handleStepClick(index)}
                className={`flex-1 cursor-pointer group transition-all duration-300 ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                data-testid={`step-card-${index}`}
              >
                {/* Visual Card */}
                <div className={`h-[180px] rounded-2xl overflow-hidden relative transition-all duration-300 ${
                  isActive 
                    ? `shadow-xl ${style.shadow} ring-2 ${style.ring}` 
                    : isCompleted 
                      ? 'shadow-lg ring-2 ring-green-400' 
                      : 'shadow-md hover:shadow-lg'
                }`}>
                  {/* Solid Color Background */}
                  <div className={`absolute inset-0 rounded-2xl ${style.bg} ${
                    !isActive && !isCompleted ? 'opacity-50' : 'opacity-100'
                  } transition-opacity duration-300`} />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-4 flex flex-col text-white">
                    {/* Top Row - Icon and Step Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ${isActive ? 'ring-2 ring-white/50' : ''}`}>
                        {isCompleted ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <StepIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          Step {index + 1}
                        </span>
                        {isCompleted && (
                          <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Title and Description */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{step.label}</h3>
                      <p className="text-xs text-white/80">{style.desc}</p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <span className="text-xs font-medium bg-green-400/30 text-green-100 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      ) : isActive ? (
                        <span className="text-xs font-medium bg-white/20 text-white px-2 py-0.5 rounded-full animate-pulse">
                          In Progress
                        </span>
                      ) : (
                        <span className="text-xs font-medium bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
          {/* Brand Info Tab */}
          {activeStep === 0 && (
            <div data-testid="tab-panel-brand">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Update Brand Information</h3>
                  <p className="text-sm text-gray-500">Keep your brand details consistent across all platforms</p>
                </div>
              </div>
              
              <div className="bg-blue-50/50 rounded-xl p-5 mb-6 border border-blue-100">
                <p className="text-gray-700 leading-relaxed">
                  Enter your brand information to ensure consistent branding 
                  across all connected platforms including Google Business Profile, Apple Maps, and social media.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setBrandModalOpen(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Brand Information
                </button>
              </div>
            </div>
          )}

          {/* Locations Tab */}
          {activeStep === 1 && (
            <div data-testid="tab-panel-locations">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-cyan-100">
                  <MapPin className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Business Profile (Locations & Reviews)</h3>
                  <p className="text-sm text-gray-500">Connect your business profiles and manage location data</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-100">
                  <div className="flex items-center gap-3 mb-4">
                    <SiGoogle className="w-7 h-7 text-[#4285F4]" />
                    <h4 className="font-bold text-gray-900">Google Business Profile</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg">
                      <LinkIcon size={16} />
                      Connect Account
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                      Activate Reviews
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-5 h-5 text-cyan-600" />
                    <h4 className="font-semibold text-gray-900">Check Location Data</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Verify your location data is synced correctly with VenueX
                  </p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                    <Database size={16} />
                    Check Locations
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Other Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockPlatformCards.locations.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sales Tab */}
          {activeStep === 2 && (
            <div data-testid="tab-panel-sales">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sales Data</h3>
                  <p className="text-sm text-gray-500">Connect your sales data sources and ad platforms</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Setup Steps */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
                  <h4 className="font-bold text-gray-900 mb-4">Setup Steps</h4>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSalesDataModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      <Database className="w-4 h-4" />
                      1. Connect Data Source
                    </button>
                    <div className="flex-1 h-0.5 bg-emerald-200 rounded-full" />
                    <button 
                      onClick={() => setDataMappingModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      <Settings className="w-4 h-4" />
                      2. Perform Data Mapping
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Connected Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockPlatformCards.sales.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Catalog Tab */}
          {activeStep === 3 && (
            <div data-testid="tab-panel-catalog">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Catalog Data</h3>
                  <p className="text-sm text-gray-500">Sync your product catalog across platforms</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Setup Steps */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
                  <h4 className="font-bold text-gray-900 mb-4">Setup Steps</h4>
                  <div className="flex items-center gap-4">
                    <button 
                      className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      <Database className="w-4 h-4" />
                      1. Connect Data Source
                    </button>
                    <div className="flex-1 h-0.5 bg-purple-200 rounded-full" />
                    <button 
                      className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      <Settings className="w-4 h-4" />
                      2. Perform Data Mapping
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <SiGoogle className="w-7 h-7 text-[#4285F4]" />
                    <h4 className="font-bold text-gray-900">Google Merchant Center</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg">
                      <LinkIcon size={16} />
                      Connect Account
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                      <Settings size={16} />
                      Configure
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Other Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPlatformCards.catalog.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog 
        open={brandModalOpen} 
        onClose={() => setBrandModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          pb: 2
        }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Update Brand Information</h2>
              <p className="text-sm text-gray-500">Edit your business details across all platforms</p>
            </div>
          </div>
          <IconButton onClick={() => setBrandModalOpen(false)} size="small">
            <X className="w-5 h-5 text-gray-500" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload Logo</span>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <TextField
                  label="Business Name"
                  value={brandInfo.businessName}
                  onChange={(e) => handleBrandInfoChange('businessName', e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                  }}
                />
                <TextField
                  label="Business Description"
                  value={brandInfo.description}
                  onChange={(e) => handleBrandInfoChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Website"
                  value={brandInfo.website}
                  onChange={(e) => handleBrandInfoChange('website', e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <Globe className="w-4 h-4 text-gray-400 mr-2" />
                  }}
                />
                <TextField
                  label="Phone"
                  value={brandInfo.phone}
                  onChange={(e) => handleBrandInfoChange('phone', e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  }}
                />
                <TextField
                  label="Email"
                  value={brandInfo.email}
                  onChange={(e) => handleBrandInfoChange('email', e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  }}
                />
                <TextField
                  label="Business Category"
                  value={brandInfo.category}
                  onChange={(e) => handleBrandInfoChange('category', e.target.value)}
                  fullWidth
                  size="small"
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Connected Platforms</h4>
                  <p className="text-xs text-blue-700 mb-2">Changes will be synced to the following platforms:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-blue-200">
                      <SiGoogle className="w-3 h-3 text-[#4285F4]" /> Google Business Profile
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-blue-200">
                      <SiApple className="w-3 h-3 text-black" /> Apple Maps
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-blue-200">
                      <SiMeta className="w-3 h-3 text-[#0081FB]" /> Meta Pages
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #e5e7eb', p: 3 }}>
          <button 
            onClick={() => setBrandModalOpen(false)}
            className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => setBrandModalOpen(false)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={salesDataModalOpen} 
        onClose={() => setSalesDataModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          pb: 2
        }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sales Data Settings</h2>
              <p className="text-sm text-gray-500">Configure your data source connection</p>
            </div>
          </div>
          <IconButton onClick={() => setSalesDataModalOpen(false)} size="small">
            <X className="w-5 h-5 text-gray-500" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Data Source Configuration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Data Source Type</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={salesConfig.dataSourceType}
                    onChange={(e) => handleSalesConfigChange('dataSourceType', e.target.value)}
                  >
                    <option value="HTTP">HTTP</option>
                    <option value="FTP">FTP</option>
                    <option value="SFTP">SFTP</option>
                    <option value="S3">AWS S3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">File URL Type</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={salesConfig.fileUrlType}
                    onChange={(e) => handleSalesConfigChange('fileUrlType', e.target.value)}
                  >
                    <option value="File URL">File URL</option>
                    <option value="Folder Path">Folder Path</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-800">
                  Will the provided URL overwrite existing data in the same folder with each update, or generate a new file every time? 
                  Note that creating a new file for each update could significantly extend the process as it requires individually locating and managing multiple files.
                </p>
              </div>

              <div className="space-y-4">
                <TextField
                  label="File URL"
                  value={salesConfig.fileUrl}
                  onChange={(e) => handleSalesConfigChange('fileUrl', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="https://example.com/data/sales.csv"
                />

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-700">Dynamic URL Path</label>
                    <button 
                      onClick={addUrlSegment}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Plus size={12} />
                      Add Segment
                    </button>
                  </div>
                  <div className="space-y-2 mb-3">
                    {urlSegments.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">Add segments above to build your path</p>
                    ) : (
                      urlSegments.map((segment, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={segment}
                            onChange={(e) => updateUrlSegment(index, e.target.value)}
                            className="flex-1 p-2 border border-gray-200 rounded text-sm"
                            placeholder={`Segment ${index + 1}`}
                          />
                          <button 
                            onClick={() => removeUrlSegment(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2">
                    <span className="text-xs text-gray-500">Preview: </span>
                    <span className="text-xs font-mono text-gray-700">
                      {urlSegments.length > 0 ? `/${urlSegments.filter(s => s).join('/')}` : 'No path configured'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We will search under this folder for files matching the provided 'File Regex' pattern below.
                    <br />
                    <span className="text-gray-400">Note: The "URL Segments" field will override the path in the main URL.</span>
                  </p>
                </div>

                <TextField
                  label="File Regex"
                  value={salesConfig.fileRegex}
                  onChange={(e) => handleSalesConfigChange('fileRegex', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="*.csv, store-sales-*, inventory-*.xml"
                  helperText="How to find files under folder path structure? You can use file extensions or specific file names such as *.csv, store-sales- or inventory-*.xml etc"
                />

                <TextField
                  label="Date Format of File Name"
                  value={salesConfig.dateFormat}
                  onChange={(e) => handleSalesConfigChange('dateFormat', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="YYYY-MM-DD"
                  helperText="Specify the date format used in the file name, e.g., YYYY-MM-DD"
                />

                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Preview: </span>
                  <span className="text-xs font-mono text-red-500">
                    {salesConfig.fileUrl ? salesConfig.fileUrl : 'Invalid URL'}
                  </span>
                </div>

                <TextField
                  label="File Content Field Path"
                  value={salesConfig.contentFieldPath}
                  onChange={(e) => handleSalesConfigChange('contentFieldPath', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="$.list.datas or $.items"
                  helperText="How to access the desired content inside the file? You can think of it as XML files xpath feature, such as $.list.datas or $.items"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Scheduler</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={salesConfig.schedulerFrequency}
                    onChange={(e) => handleSalesConfigChange('schedulerFrequency', e.target.value)}
                  >
                    <option value="HOURLY">HOURLY</option>
                    <option value="DAILY">DAILY</option>
                    <option value="WEEKLY">WEEKLY</option>
                    <option value="MONTHLY">MONTHLY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                    value={salesConfig.schedulerTime}
                    onChange={(e) => handleSalesConfigChange('schedulerTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Time Zone</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={salesConfig.timezone}
                    onChange={(e) => handleSalesConfigChange('timezone', e.target.value)}
                  >
                    <option value="Europe/Istanbul">Europe/Istanbul</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New York</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">User Authentication</h3>
              <p className="text-xs text-gray-500 mb-4">(Optional)</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <TextField
                  label="Username"
                  value={salesConfig.username}
                  onChange={(e) => handleSalesConfigChange('username', e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={salesConfig.password}
                  onChange={(e) => handleSalesConfigChange('password', e.target.value)}
                  fullWidth
                  size="small"
                />
              </div>
              <TextField
                label="Private Key"
                value={salesConfig.privateKey}
                onChange={(e) => handleSalesConfigChange('privateKey', e.target.value)}
                fullWidth
                multiline
                rows={3}
                size="small"
                placeholder="Paste the content of .pem file here"
                helperText="You can paste here the content of .pem file if accessing requires private key"
              />
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">IP Restrictions</h4>
                  <p className="text-xs text-blue-700 mb-2">For enhanced security, you can enable IP-based restrictions by allowing access only to the following IP addresses:</p>
                  <div className="flex flex-wrap gap-2">
                    <code className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700 border border-blue-200">18.197.128.133</code>
                    <code className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700 border border-blue-200">18.197.126.156</code>
                    <code className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700 border border-blue-200">3.65.9.112</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #e5e7eb', p: 3 }}>
          <button 
            onClick={() => setSalesDataModalOpen(false)}
            className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => setSalesDataModalOpen(false)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Save Configuration
          </button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={dataMappingModalOpen} 
        onClose={() => setDataMappingModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          pb: 2
        }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sales Data Settings</h2>
              <p className="text-sm text-gray-500">Map your data columns</p>
            </div>
          </div>
          <IconButton onClick={() => setDataMappingModalOpen(false)} size="small">
            <X className="w-5 h-5 text-gray-500" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Your Data</h3>
              <p className="text-sm text-gray-500 mb-6">
                Upload a sample file to initiate column naming analysis
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Upload Sample File</h4>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Please upload a sample file to initiate column naming analysis. The system will ensure precise and complete matching of all column names in your file.
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Choose File
              </button>
              <p className="text-xs text-gray-400 mt-3">
                Supported formats: CSV, XLSX, XML, JSON
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">What happens next?</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <span>We'll analyze your file structure and column names</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <span>Match columns to VenueX data fields automatically</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <span>Review and confirm the mapping before saving</span>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #e5e7eb', p: 3 }}>
          <button 
            onClick={() => setDataMappingModalOpen(false)}
            className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => setDataMappingModalOpen(false)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Continue
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
