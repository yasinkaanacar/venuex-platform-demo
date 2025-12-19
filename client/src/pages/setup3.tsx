import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShoppingCart, 
  Package,
  Plug,
  Unplug,
  Database,
  Settings,
  Check,
  X,
  Globe,
  Mail,
  Image as ImageIcon,
  Plus,
  Shield,
  Upload,
  Info,
  Users,
  UserPlus,
  ChevronRight
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
    { id: 'apple', name: 'Apple Business Connect', description: 'Manage your presence on Apple Maps', logo: 'apple', status: 'connect' },
    { id: 'meta', name: 'Meta Pages', description: 'Connect your Facebook & Instagram pages', logo: 'meta', status: 'connected' },
    { id: 'yandex', name: 'Yandex Business', description: 'Manage your Yandex Maps listing', logo: 'yandex', status: 'coming_soon' },
    { id: 'togg', name: 'Togg', description: 'Connect to Togg ecosystem', logo: 'togg', status: 'connect' },
  ],
  sales: [
    { id: 'google-ads', name: 'Google Ads', description: 'Track offline conversions from Google Ads', logo: 'google', status: 'connect' },
    { id: 'meta-conversions', name: 'Meta Conversions', description: 'Send conversion events to Meta', logo: 'meta', status: 'connect' },
    { id: 'tiktok', name: 'TikTok Conversions', description: 'Track TikTok ad conversions', logo: 'tiktok', status: 'connect' },
  ],
  catalog: [
    { id: 'google-merchant', name: 'Google Merchant Center', description: 'Sync products with Google Shopping', logo: 'google', status: 'connect' },
    { id: 'meta-catalog', name: 'Meta Catalog', description: 'Sync products with Meta Commerce', logo: 'meta', status: 'connect' },
    { id: 'togg-catalog', name: 'Togg', description: 'Sync inventory with Togg', logo: 'togg', status: 'connect' },
  ],
};

const steps = [
  { id: 0, label: 'Brand Info', icon: Building2, description: 'Business details & contact' },
  { id: 1, label: 'Locations', icon: MapPin, description: 'Connect location profiles' },
  { id: 2, label: 'Sales', icon: ShoppingCart, description: 'Sales data & conversions' },
  { id: 3, label: 'Catalog', icon: Package, description: 'Product catalog sync' },
];

interface IntegrationCardProps {
  name: string;
  description: string;
  logo: string;
  status: IntegrationStatus;
}

function IntegrationCard({ name, description, logo, status }: IntegrationCardProps) {
  const getLogo = () => {
    switch (logo) {
      case 'google': return <SiGoogle className="w-6 h-6 text-[#4285F4]" />;
      case 'meta': return <SiMeta className="w-6 h-6 text-[#0081FB]" />;
      case 'tiktok': return <SiTiktok className="w-6 h-6 text-black" />;
      case 'apple': return <SiApple className="w-6 h-6 text-black" />;
      case 'yandex': return <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs">Y</div>;
      case 'togg': return <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">T</div>;
      default: return <div className="w-6 h-6 bg-gray-300 rounded" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3 flex-1">
        <div className="p-2 bg-gray-50 rounded-lg">{getLogo()}</div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm">{name}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="mt-auto">
        {status === 'connected' ? (
          <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded transition-colors">
            <Unplug size={12} /> Disconnect
          </button>
        ) : status === 'coming_soon' ? (
          <span className="inline-flex px-2 py-1.5 bg-gray-100 text-gray-400 text-xs font-medium rounded">Coming Soon</span>
        ) : (
          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors">
            <Plug size={12} /> Connect
          </button>
        )}
      </div>
    </div>
  );
}

export default function Setup3() {
  const [activeStep, setActiveStep] = useState(0);
  const [salesDataModalOpen, setSalesDataModalOpen] = useState(false);
  const [dataMappingModalOpen, setDataMappingModalOpen] = useState(false);
  const [inviteTeamModalOpen, setInviteTeamModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ firstName: '', lastName: '', email: '', role: 'Viewer' });
  const [inviteSentTo, setInviteSentTo] = useState<string | null>(null);
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
    const fullName = `${inviteForm.firstName} ${inviteForm.lastName}`.trim();
    setInviteSentTo(fullName || 'Team Member');
    setInviteForm({ firstName: '', lastName: '', email: '', role: 'Viewer' });
  };

  const addUrlSegment = () => setUrlSegments([...urlSegments, '']);
  const updateUrlSegment = (index: number, value: string) => {
    const newSegments = [...urlSegments];
    newSegments[index] = value;
    setUrlSegments(newSegments);
  };
  const removeUrlSegment = (index: number) => setUrlSegments(urlSegments.filter((_, i) => i !== index));

  const progressPercent = Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">#{integrationId}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{companyName}</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Account Setup</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <span className="text-sm text-gray-500">Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="text-sm font-medium text-blue-600">{progressPercent}%</span>
              </div>
            </div>
            <button
              onClick={() => setInviteTeamModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              data-testid="button-invite-team"
            >
              <Users size={16} />
              Invite Team
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Horizontal Step Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6">
            <div className="flex gap-1">
              {steps.map((step, index) => {
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;
                const Icon = step.icon;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                    data-testid={`step-tab-${index}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? 'bg-white text-blue-600' 
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isCompleted ? <Check size={12} /> : index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                      <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                        {step.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
            {/* Brand Info */}
            {activeStep === 0 && (
              <div data-testid="tab-panel-brand">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Brand Information</h2>
                  <p className="text-sm text-gray-500 mb-6">Keep your brand details consistent across all platforms</p>
                  
                  <div className="space-y-5">
                    {/* Logo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                        <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF (min 250x250px)</p>
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
                      <Autocomplete
                        multiple
                        options={categoryOptions}
                        value={brandInfo.categories}
                        onChange={(_, newValue) => handleBrandInfoChange('categories', newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} label={option} size="small" sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }} />
                          ))
                        }
                        renderInput={(params) => <TextField {...params} label="Categories" placeholder="Select categories..." size="small" />}
                      />
                      <p className="text-xs text-gray-400 mt-1">First category is primary. GBP accepts 9, Apple 2, Meta 2 categories.</p>
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

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <TextField
                        label="Email"
                        value={brandInfo.email}
                        onChange={(e) => handleBrandInfoChange('email', e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{ startAdornment: <Mail className="w-4 h-4 text-gray-400 mr-2" /> }}
                      />
                      <TextField
                        label="Website"
                        value={brandInfo.website}
                        onChange={(e) => handleBrandInfoChange('website', e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{ startAdornment: <Globe className="w-4 h-4 text-gray-400 mr-2" /> }}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="flex gap-2">
                        <select
                          value={brandInfo.phoneCountryCode}
                          onChange={(e) => handleBrandInfoChange('phoneCountryCode', e.target.value)}
                          className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="+90">+90</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                        </select>
                        <TextField
                          value={brandInfo.phone}
                          onChange={(e) => handleBrandInfoChange('phone', e.target.value)}
                          fullWidth
                          size="small"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="border-t border-gray-100 pt-5">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Social Media</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <TextField label="Facebook" value={brandInfo.facebook} onChange={(e) => handleBrandInfoChange('facebook', e.target.value)} fullWidth size="small" />
                        <TextField label="Instagram" value={brandInfo.instagram} onChange={(e) => handleBrandInfoChange('instagram', e.target.value)} fullWidth size="small" />
                        <TextField label="X (Twitter)" value={brandInfo.twitter} onChange={(e) => handleBrandInfoChange('twitter', e.target.value)} fullWidth size="small" />
                        <TextField label="TikTok" value={brandInfo.tiktok} onChange={(e) => handleBrandInfoChange('tiktok', e.target.value)} fullWidth size="small" />
                        <TextField label="YouTube" value={brandInfo.youtube} onChange={(e) => handleBrandInfoChange('youtube', e.target.value)} fullWidth size="small" />
                        <TextField label="LinkedIn" value={brandInfo.linkedin} onChange={(e) => handleBrandInfoChange('linkedin', e.target.value)} fullWidth size="small" />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Locations */}
            {activeStep === 1 && (
              <div data-testid="tab-panel-locations" className="space-y-4">
                {/* Google Business Profile */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <SiGoogle className="w-6 h-6 text-[#4285F4]" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Google Business Profile</h3>
                      <p className="text-sm text-gray-500">Connect to sync location listings and reviews</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-800">GBP locations should be listed under a single group</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      <Plug size={16} /> Connect Account
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      Activate Reviews
                    </button>
                  </div>
                </div>

                {/* Check Location Data */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Verify Location Data</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Check that your location data is synced correctly with VenueX</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    <Database size={16} /> Check Locations
                  </button>
                </div>

                {/* Other Platforms */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Other Platforms</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {mockPlatformCards.locations.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sales */}
            {activeStep === 2 && (
              <div data-testid="tab-panel-sales" className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Sales Data</h2>
                  <p className="text-sm text-gray-500 mb-6">Connect your sales data sources and ad platforms</p>
                  
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setSalesDataModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Database size={16} /> 1. Connect Data Source
                    </button>
                    <button
                      onClick={() => setDataMappingModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Settings size={16} /> 2. Data Mapping
                    </button>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-3">Ad Platforms</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {mockPlatformCards.sales.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Catalog */}
            {activeStep === 3 && (
              <div data-testid="tab-panel-catalog" className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Catalog Data</h2>
                  <p className="text-sm text-gray-500 mb-6">Sync your product catalog across platforms</p>
                  
                  <div className="flex gap-3 mb-6">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      <Database size={16} /> 1. Connect Data Source
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      <Settings size={16} /> 2. Data Mapping
                    </button>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-3">Catalog Platforms</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {mockPlatformCards.catalog.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Sales Data Modal */}
      <Dialog open={salesDataModalOpen} onClose={() => setSalesDataModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', pb: 2 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sales Data Settings</h2>
              <p className="text-sm text-gray-500">Configure your data source connection</p>
            </div>
          </div>
          <IconButton onClick={() => setSalesDataModalOpen(false)} size="small"><X className="w-5 h-5 text-gray-500" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Data Source Type</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={salesConfig.dataSourceType} onChange={(e) => handleSalesConfigChange('dataSourceType', e.target.value)}>
                  <option value="HTTP">HTTP</option>
                  <option value="FTP">FTP</option>
                  <option value="SFTP">SFTP</option>
                  <option value="S3">AWS S3</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">File URL Type</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={salesConfig.fileUrlType} onChange={(e) => handleSalesConfigChange('fileUrlType', e.target.value)}>
                  <option value="File URL">File URL</option>
                  <option value="Folder Path">Folder Path</option>
                </select>
              </div>
            </div>
            <TextField label="File URL" value={salesConfig.fileUrl} onChange={(e) => handleSalesConfigChange('fileUrl', e.target.value)} fullWidth size="small" placeholder="https://example.com/data/sales.csv" />
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">Dynamic URL Path</label>
                <button onClick={addUrlSegment} className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"><Plus size={12} />Add</button>
              </div>
              {urlSegments.length === 0 ? (
                <p className="text-xs text-gray-400">No segments added</p>
              ) : (
                <div className="space-y-2">
                  {urlSegments.map((segment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="text" value={segment} onChange={(e) => updateUrlSegment(index, e.target.value)} className="flex-1 p-2 border border-gray-200 rounded text-sm" placeholder={`Segment ${index + 1}`} />
                      <button onClick={() => removeUrlSegment(index)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">URL segments will override the path in the main URL.</p>
            </div>
            <TextField label="File Regex" value={salesConfig.fileRegex} onChange={(e) => handleSalesConfigChange('fileRegex', e.target.value)} fullWidth size="small" placeholder="*.csv, store-sales-*, inventory-*.xml" helperText="Pattern to match files: *.csv, store-sales-*, etc." />
            <TextField label="Date Format" value={salesConfig.dateFormat} onChange={(e) => handleSalesConfigChange('dateFormat', e.target.value)} fullWidth size="small" placeholder="YYYY-MM-DD" helperText="Date format used in file names" />
            <TextField label="Content Field Path" value={salesConfig.contentFieldPath} onChange={(e) => handleSalesConfigChange('contentFieldPath', e.target.value)} fullWidth size="small" placeholder="$.list.datas or $.items" helperText="Path to access content inside the file (like xpath)" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={salesConfig.schedulerFrequency} onChange={(e) => handleSalesConfigChange('schedulerFrequency', e.target.value)}>
                  <option value="HOURLY">HOURLY</option>
                  <option value="DAILY">DAILY</option>
                  <option value="WEEKLY">WEEKLY</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                <input type="time" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={salesConfig.schedulerTime} onChange={(e) => handleSalesConfigChange('schedulerTime', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Timezone</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={salesConfig.timezone} onChange={(e) => handleSalesConfigChange('timezone', e.target.value)}>
                  <option value="Europe/Istanbul">Europe/Istanbul</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Authentication (Optional)</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <TextField label="Username" value={salesConfig.username} onChange={(e) => handleSalesConfigChange('username', e.target.value)} fullWidth size="small" />
                <TextField label="Password" type="password" value={salesConfig.password} onChange={(e) => handleSalesConfigChange('password', e.target.value)} fullWidth size="small" />
              </div>
              <TextField label="Private Key" value={salesConfig.privateKey} onChange={(e) => handleSalesConfigChange('privateKey', e.target.value)} fullWidth multiline rows={2} size="small" placeholder="Paste .pem file content here" helperText="For connections requiring private key authentication" />
            </div>
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">IP Restrictions</h4>
                <p className="text-xs text-blue-700 mb-2">Allow access only from these IPs:</p>
                <div className="flex flex-wrap gap-2">
                  <code className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700">18.197.128.133</code>
                  <code className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700">18.197.126.156</code>
                  <code className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700">3.65.9.112</code>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e5e7eb', p: 2 }}>
          <button onClick={() => setSalesDataModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => setSalesDataModalOpen(false)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Save</button>
        </DialogActions>
      </Dialog>

      {/* Data Mapping Modal */}
      <Dialog open={dataMappingModalOpen} onClose={() => setDataMappingModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', pb: 2 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Data Mapping</h2>
              <p className="text-sm text-gray-500">Map your data columns</p>
            </div>
          </div>
          <IconButton onClick={() => setDataMappingModalOpen(false)} size="small"><X className="w-5 h-5 text-gray-500" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h4 className="font-medium text-gray-900 mb-1">Upload Sample File</h4>
              <p className="text-sm text-gray-500 mb-3">Upload a file to analyze column structure</p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Choose File</button>
              <p className="text-xs text-gray-400 mt-2">CSV, XLSX, XML, JSON</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
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
        <DialogActions sx={{ borderTop: '1px solid #e5e7eb', p: 2 }}>
          <button onClick={() => setDataMappingModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => setDataMappingModalOpen(false)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Continue</button>
        </DialogActions>
      </Dialog>

      {/* Invite Team Modal */}
      <Dialog open={inviteTeamModalOpen} onClose={() => setInviteTeamModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', pb: 2, px: 3, pt: 3 }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
              <p className="text-sm text-gray-500">Collaborate with your team on VenueX</p>
            </div>
          </div>
          <IconButton onClick={() => setInviteTeamModalOpen(false)} size="small" sx={{ bgcolor: '#f3f4f6', '&:hover': { bgcolor: '#e5e7eb' } }}><X className="w-4 h-4 text-gray-500" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '20px', pb: '20px', px: 3 }}>
          {inviteSentTo && (
            <div className="mb-5 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800 font-medium">Davetiniz {inviteSentTo}'a gönderildi.</p>
              <button onClick={() => setInviteSentTo(null)} className="ml-auto text-green-600 hover:text-green-700">
                <X size={16} />
              </button>
            </div>
          )}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input 
                  type="text"
                  value={inviteForm.firstName} 
                  onChange={(e) => handleInviteFormChange('firstName', e.target.value)} 
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John"
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input 
                  type="text"
                  value={inviteForm.lastName} 
                  onChange={(e) => handleInviteFormChange('lastName', e.target.value)} 
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Doe"
                  data-testid="input-last-name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email"
                  value={inviteForm.email} 
                  onChange={(e) => handleInviteFormChange('email', e.target.value)} 
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="john@company.com"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
              <div className="grid grid-cols-3 gap-2" data-testid="select-role">
                {[
                  { value: 'Admin', icon: Shield, desc: 'Full access' },
                  { value: 'Manager', icon: Users, desc: 'Edit & manage' },
                  { value: 'Viewer', icon: Users, desc: 'View only' },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleInviteFormChange('role', role.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      inviteForm.role === role.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <role.icon className={`w-5 h-5 mx-auto mb-1 ${inviteForm.role === role.value ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${inviteForm.role === role.value ? 'text-blue-900' : 'text-gray-700'}`}>{role.value}</p>
                    <p className="text-xs text-gray-400">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">An invitation email will be sent to the provided address. The invite link expires in 7 days.</p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e5e7eb', p: 2.5, gap: 1 }}>
          <button onClick={() => setInviteTeamModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSendInvite} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all" data-testid="button-send-invite">
            <Mail size={16} /> Send Invitation
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
