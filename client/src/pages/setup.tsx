import { useState } from 'react';
import { 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
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
  Upload,
  Globe,
  Phone,
  Mail,
  Image as ImageIcon,
  Plus,
  Shield
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import venueXLogo from '@assets/vx-logo-1000x1000_1756566252817.png';

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
      status: 'connected' 
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
      status: 'connected' 
    },
  ],
  sales: [
    { 
      id: 'google-ads', 
      name: 'Google Ads', 
      description: 'Track offline conversions from Google Ads',
      logo: 'google',
      status: 'connected' 
    },
    { 
      id: 'meta-conversions', 
      name: 'Meta Conversions', 
      description: 'Send conversion events to Meta',
      logo: 'meta',
      status: 'connected' 
    },
    { 
      id: 'tiktok', 
      name: 'TikTok Conversions', 
      description: 'Track TikTok ad conversions',
      logo: 'tiktok',
      status: 'connected' 
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
      status: 'connected' 
    },
  ],
};

const steps = [
  { label: 'Brand Infos', icon: Building2 },
  { label: 'Locations', icon: MapPin },
  { label: 'Sales', icon: ShoppingCart },
  { label: 'Catalog', icon: Package },
];

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#3b82f6',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#22c55e',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#e5e7eb',
    borderRadius: 1,
  },
}));

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

interface StepIconProps {
  active: boolean;
  completed: boolean;
  icon: React.ElementType;
}

function CustomStepIcon({ active, completed, icon: Icon }: StepIconProps) {
  return (
    <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
      completed 
        ? 'bg-green-500 text-white' 
        : active 
          ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
          : 'bg-gray-100 text-gray-400'
    }`}>
      {completed ? <CheckCircle2 size={20} /> : <Icon size={20} />}
    </div>
  );
}

const panelToStep: Record<string, number> = {
  'panel1': 0,
  'panel2': 1,
  'panel3': 2,
  'panel4': 3,
};

export default function Setup() {
  const [expanded, setExpanded] = useState<string | false>('panel2');
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [salesDataModalOpen, setSalesDataModalOpen] = useState(false);
  const [dataMappingModalOpen, setDataMappingModalOpen] = useState(false);
  const [brandInfo, setBrandInfo] = useState({
    businessName: 'VenueX Demo Store',
    description: 'Premium retail experience across multiple locations',
    website: 'https://venuex.com',
    phone: '+90 212 555 0123',
    email: 'info@venuex.com',
    category: 'Retail',
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
  
  const activeStep = expanded ? panelToStep[expanded] : 1;

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const handleStepClick = (stepIndex: number) => {
    const panelId = `panel${stepIndex + 1}`;
    setExpanded(panelId);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Dashboard</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Setup</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">VenueX Setup</h1>
          <p className="text-gray-500">
            Complete the setup steps below to connect your business data and unlock the full potential of VenueX. 
            Each step helps you integrate different aspects of your retail operations.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel 
            connector={<CustomConnector />}
          >
            {steps.map((step, index) => (
              <Step 
                key={step.label} 
                completed={index < activeStep}
                onClick={() => handleStepClick(index)}
                sx={{ cursor: 'pointer' }}
              >
                <StepLabel 
                  StepIconComponent={() => (
                    <CustomStepIcon 
                      active={index === activeStep}
                      completed={index < activeStep}
                      icon={step.icon}
                    />
                  )}
                >
                  <span className={`text-sm font-medium ${
                    index === activeStep 
                      ? 'text-blue-600' 
                      : index < activeStep 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        <div className="space-y-4">
          <Accordion 
            expanded={expanded === 'panel1'} 
            onChange={handleChange('panel1')}
            sx={{ 
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: '1px solid #e5e7eb',
              '&.Mui-expanded': { margin: 0 }
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronRight className={`transition-transform ${expanded === 'panel1' ? 'rotate-90' : ''}`} />}
              sx={{ 
                borderRadius: '12px',
                '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Update Brand Information</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>
                  </div>
                  <p className="text-sm text-gray-500">Keep your brand details consistent across all platforms</p>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid #e5e7eb', pt: 3 }}>
              <p className="text-gray-600 mb-4">
                Your brand information has been successfully configured. This ensures consistent branding 
                across all connected platforms including Google Business Profile, Apple Maps, and social media.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setBrandModalOpen(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Update Information
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <ExternalLink size={16} />
                  View Details
                </button>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'panel2'} 
            onChange={handleChange('panel2')}
            sx={{ 
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: expanded === 'panel2' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
              '&.Mui-expanded': { margin: 0 }
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronRight className={`transition-transform ${expanded === 'panel2' ? 'rotate-90' : ''}`} />}
              sx={{ 
                borderRadius: '12px',
                '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Business Profile (Locations & Reviews)</h3>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">In Progress</span>
                  </div>
                  <p className="text-sm text-gray-500">Connect your business profiles and manage location data</p>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid #e5e7eb', pt: 3 }}>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <SiGoogle className="w-6 h-6 text-[#4285F4]" />
                    <h4 className="font-semibold text-gray-900">Google Business Profile</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button disabled className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed">
                      <Check size={16} />
                      Account Connected
                    </button>
                    <button disabled className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed">
                      <Check size={16} />
                      Reviews Activated
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
                      Disconnect
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Check Location Data</h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Verify your location data is synced correctly with VenueX
                  </p>
                  <button disabled className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed">
                    <Check size={16} />
                    Locations Checked
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Other Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockPlatformCards.locations.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'panel3'} 
            onChange={handleChange('panel3')}
            sx={{ 
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: '1px solid #e5e7eb',
              '&.Mui-expanded': { margin: 0 }
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronRight className={`transition-transform ${expanded === 'panel3' ? 'rotate-90' : ''}`} />}
              sx={{ 
                borderRadius: '12px',
                '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sales Data</h3>
                  <p className="text-sm text-gray-500">Connect your sales data sources and ad platforms</p>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid #e5e7eb', pt: 3 }}>
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => setSalesDataModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Database className="w-4 h-4" />
                    1. Connect Data Source
                  </button>
                  <div className="flex-1 h-px bg-gray-200" />
                  <button 
                    onClick={() => setDataMappingModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    2. Perform Data Mapping
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Connected Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockPlatformCards.sales.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expanded === 'panel4'} 
            onChange={handleChange('panel4')}
            sx={{ 
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: '1px solid #e5e7eb',
              '&.Mui-expanded': { margin: 0 }
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronRight className={`transition-transform ${expanded === 'panel4' ? 'rotate-90' : ''}`} />}
              sx={{ 
                borderRadius: '12px',
                '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Catalog Data</h3>
                  <p className="text-sm text-gray-500">Sync your product catalog across platforms</p>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid #e5e7eb', pt: 3 }}>
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Circle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">1. Connect Data Source</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Circle className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-400">2. Perform Data Mapping</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <SiGoogle className="w-6 h-6 text-[#4285F4]" />
                    <h4 className="font-semibold text-gray-900">Google Merchant Center</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button disabled className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed">
                      <Check size={16} />
                      Account Connected
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      <Settings size={16} />
                      Configure
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Other Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPlatformCards.catalog.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
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
