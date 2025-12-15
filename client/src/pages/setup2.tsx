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
  Info,
  Users,
  UserPlus
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Autocomplete,
  Chip
} from '@mui/material';
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';

const integrationId = '59796';
const companyName = 'Acarlar Perakende';

const categoryOptions = [
  'Building materials store',
  'Hardware store',
  'Home improvement store',
  'Lumber store',
  'Paint store',
  'Flooring store',
  'Plumbing supply store',
  'Electrical supply store',
  'Tool store',
  'Garden center',
  'Tile store',
  'Kitchen supply store',
  'Bathroom supply store',
  'Lighting store',
  'Door store',
  'Window store',
  'Roofing supply store',
  'Insulation supplier',
  'Concrete supplier',
  'Brick supplier',
];

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
      id: 'google-merchant', 
      name: 'Google Merchant Center', 
      description: 'Sync products with Google Shopping',
      logo: 'google',
      status: 'connect' 
    },
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
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col h-full min-h-[160px]">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          {getLogo()}
        </div>
        {status === 'connected' && (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
        )}
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
      <p className="text-sm text-gray-500 flex-1">{description}</p>
      <div className="mt-3">
        {getButton()}
      </div>
    </div>
  );
}

export default function Setup2() {
  const [activeStep, setActiveStep] = useState(0);
  const [salesDataModalOpen, setSalesDataModalOpen] = useState(false);
  const [dataMappingModalOpen, setDataMappingModalOpen] = useState(false);
  const [inviteTeamModalOpen, setInviteTeamModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Viewer',
  });
  const [brandInfo, setBrandInfo] = useState({
    businessName: 'Demo VenueX',
    description: "That's a description box",
    website: 'venuex.io',
    phoneCountryCode: '+90',
    phone: '',
    email: '',
    categories: ['Building materials store', 'Hardware store'],
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    twitter: 'https://www.twitter.com/',
    tiktok: '',
    youtube: 'https://www.youtube.com/user/',
    pinterest: '',
    linkedin: '',
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

  const handleBrandInfoChange = (field: string, value: string | string[]) => {
    setBrandInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSalesConfigChange = (field: string, value: string) => {
    setSalesConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleInviteFormChange = (field: string, value: string) => {
    setInviteForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSendInvite = () => {
    setInviteForm({ firstName: '', lastName: '', email: '', role: 'Viewer' });
    setInviteTeamModalOpen(false);
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
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-6">
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
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">

        {/* Integrated Step Tabs with Progress Bar */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-6 shadow-sm">
          {/* Step Tabs */}
          <div className="flex">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              const stepDescs = [
                'Business name, logo & contact',
                'Sync location listings',
                'POS data & ad platforms',
                'Product feeds & inventory'
              ];
              
              return (
                <div
                  key={step.label}
                  onClick={() => handleStepClick(index)}
                  className={`flex-1 cursor-pointer transition-all duration-200 ${
                    index !== steps.length - 1 ? 'border-r border-gray-200' : ''
                  } ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  data-testid={`step-card-${index}`}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Step Number / Check */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? <Check size={16} /> : index + 1}
                      </div>
                    </div>
                    
                    <h3 className={`font-semibold text-sm mb-1 ${
                      isActive ? 'text-blue-900' : isCompleted ? 'text-green-800' : 'text-gray-700'
                    }`}>
                      {step.label}
                    </h3>
                    <p className="text-xs text-gray-500">{stepDescs[index]}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Integrated Progress Bar */}
          <div className="bg-gray-100 px-4 py-2 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedCount / totalSteps) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-blue-600 min-w-[32px] text-right">{Math.round((completedCount / totalSteps) * 100)}%</span>
            </div>
          </div>
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
              
              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Upload logo</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center justify-center text-center">
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Drag files here to upload.</p>
                      <p className="text-xs text-gray-400">Compatible file types: .jpg, .gif, .png, .bmp</p>
                      <p className="text-xs text-gray-400">The photo should be at least Width: 250px & Height: 250px in size.</p>
                    </div>
                  </div>
                </div>

                {/* Business Name */}
                <TextField
                  label="Business Name"
                  value={brandInfo.businessName}
                  onChange={(e) => handleBrandInfoChange('businessName', e.target.value)}
                  fullWidth
                  size="small"
                />

                {/* Categories */}
                <div>
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">
                      The first selection will be your primary category. GBP accepts 9, Apple 2, Meta 2 additional categories. Your selections will be updated in related publishers according to that.
                    </p>
                  </div>
                  <Autocomplete
                    multiple
                    options={categoryOptions}
                    value={brandInfo.categories}
                    onChange={(_, newValue) => handleBrandInfoChange('categories', newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                          size="small"
                          sx={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            '& .MuiChip-deleteIcon': {
                              color: '#3b82f6',
                              '&:hover': {
                                color: '#1d4ed8',
                              },
                            },
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search and select categories..."
                        size="small"
                      />
                    )}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </div>

                {/* Description */}
                <TextField
                  label="Description"
                  value={brandInfo.description}
                  onChange={(e) => handleBrandInfoChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                />

                {/* Email */}
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

                {/* Website */}
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

                {/* Phone with Country Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary phone number</label>
                  <div className="flex gap-2">
                    <select 
                      value={brandInfo.phoneCountryCode}
                      onChange={(e) => handleBrandInfoChange('phoneCountryCode', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="+90">+90</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+49">+49</option>
                      <option value="+33">+33</option>
                      <option value="+81">+81</option>
                      <option value="+86">+86</option>
                    </select>
                    <TextField
                      value={brandInfo.phone}
                      onChange={(e) => handleBrandInfoChange('phone', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Social Media</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Facebook"
                      value={brandInfo.facebook}
                      onChange={(e) => handleBrandInfoChange('facebook', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="https://www.facebook.com/"
                    />
                    <TextField
                      label="Instagram"
                      value={brandInfo.instagram}
                      onChange={(e) => handleBrandInfoChange('instagram', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="https://www.instagram.com/"
                    />
                    <TextField
                      label="X"
                      value={brandInfo.twitter}
                      onChange={(e) => handleBrandInfoChange('twitter', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="https://www.twitter.com/"
                    />
                    <TextField
                      label="Tiktok"
                      value={brandInfo.tiktok}
                      onChange={(e) => handleBrandInfoChange('tiktok', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="Tiktok"
                    />
                    <TextField
                      label="Youtube"
                      value={brandInfo.youtube}
                      onChange={(e) => handleBrandInfoChange('youtube', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="https://www.youtube.com/user/"
                    />
                    <TextField
                      label="Pinterest"
                      value={brandInfo.pinterest}
                      onChange={(e) => handleBrandInfoChange('pinterest', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="Pinterest"
                    />
                    <TextField
                      label="Linkedin"
                      value={brandInfo.linkedin}
                      onChange={(e) => handleBrandInfoChange('linkedin', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="Linkedin"
                    />
                  </div>
                </div>

                {/* Confirmation Footer */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Your <span className="font-semibold">0</span> businesses will be updated with the changes made. Are you sure?
                    </p>
                    <button 
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
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
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      GBP locations should be listed under a single group
                    </p>
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

                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Connected Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockPlatformCards.catalog.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invite Team Section */}
        <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Invite Your Team</h3>
                <p className="text-indigo-100 text-sm">Collaborate with your team to complete setup faster</p>
              </div>
            </div>
            <button 
              onClick={() => setInviteTeamModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 text-indigo-600 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              data-testid="button-invite-team"
            >
              <UserPlus size={18} />
              Invite Team Members
            </button>
          </div>
          
          {/* Team Roles Info */}
          <div className="mt-5 pt-5 border-t border-white/20">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-indigo-200" />
                  <span className="text-sm font-semibold text-white">Admin</span>
                </div>
                <p className="text-xs text-indigo-100">Full access to all settings and integrations</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-indigo-200" />
                  <span className="text-sm font-semibold text-white">Manager</span>
                </div>
                <p className="text-xs text-indigo-100">Manage locations, campaigns and analytics</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-indigo-200" />
                  <span className="text-sm font-semibold text-white">Viewer</span>
                </div>
                <p className="text-xs text-indigo-100">View-only access to dashboards and reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <Dialog 
        open={inviteTeamModalOpen} 
        onClose={() => setInviteTeamModalOpen(false)}
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
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
              <p className="text-sm text-gray-500">Add a new member to your team</p>
            </div>
          </div>
          <IconButton onClick={() => setInviteTeamModalOpen(false)} size="small">
            <X className="w-5 h-5 text-gray-500" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="First Name"
                value={inviteForm.firstName}
                onChange={(e) => handleInviteFormChange('firstName', e.target.value)}
                fullWidth
                size="small"
                data-testid="input-first-name"
              />
              <TextField
                label="Last Name"
                value={inviteForm.lastName}
                onChange={(e) => handleInviteFormChange('lastName', e.target.value)}
                fullWidth
                size="small"
                data-testid="input-last-name"
              />
            </div>
            
            <TextField
              label="E-mail"
              type="email"
              value={inviteForm.email}
              onChange={(e) => handleInviteFormChange('email', e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <Mail className="w-4 h-4 text-gray-400 mr-2" />
              }}
              data-testid="input-email"
            />
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
              <select 
                className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-sm"
                value={inviteForm.role}
                onChange={(e) => handleInviteFormChange('role', e.target.value)}
                data-testid="select-role"
              >
                <option value="Admin">Admin - Full access to all settings and integrations</option>
                <option value="Manager">Manager - Manage locations, campaigns and analytics</option>
                <option value="Viewer">Viewer - View-only access to dashboards and reports</option>
              </select>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-indigo-900 mb-1">Invitation Email</h4>
                  <p className="text-xs text-indigo-700">An email invitation will be sent to the team member with instructions to join your VenueX workspace.</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #e5e7eb', p: 3 }}>
          <button 
            onClick={() => setInviteTeamModalOpen(false)}
            className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSendInvite}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            data-testid="button-send-invite"
          >
            <UserPlus size={16} />
            Send Invitation
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
