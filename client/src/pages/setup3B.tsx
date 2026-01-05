import { useState, useEffect } from 'react';
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
  ChevronRight,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import koctasLogo from '@assets/image_1764932445923.png';
import venuexLogo from '@assets/venuex-logo-1000-200_1766151107474.png';
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
import { Tooltip } from '@/components/ui/tooltip';

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

const features = [
  { icon: MapPin, title: 'Multi-Location Management', desc: 'Manage thousands of locations from one dashboard' },
  { icon: Target, title: 'Offline Attribution', desc: 'Connect in-store sales to digital campaigns' },
  { icon: BarChart3, title: 'AI-Powered Insights', desc: 'Get actionable recommendations automatically' },
];

interface GuideItem {
  text: string;
  tooltip: string;
}

interface GuideSection {
  heading: string;
  items: GuideItem[];
}

interface StepGuide {
  title: string;
  sections: GuideSection[];
}

const stepGuides: Record<string, StepGuide> = {
  locations: {
    title: 'Locations Guide',
    sections: [
      {
        heading: 'Before you connect',
        items: [
          { text: 'Your locations must be listed under a single group in Google Business Profile', tooltip: 'All your store locations should be organized within one Business Group in GBP. This allows VenueX to import and manage them together.' },
          { text: 'Make sure your business details are accurate (name, category, address, phone, website, hours)', tooltip: 'Accurate NAP (Name, Address, Phone) data ensures proper syncing and avoids duplicate entries across platforms.' },
          { text: 'Fix any Unverified/Suspended/Duplicate locations in GBP first', tooltip: 'Problematic listings can cause sync failures. Resolve these issues in Google Business Profile before connecting.' },
          { text: 'Assign a unique, standardized store code to every location', tooltip: 'Store codes link your locations to sales data. Use a consistent format like "STORE001" across all systems.' },
          { text: 'You need Owner/Primary Owner access in GBP (Manager cannot manage access)', tooltip: 'Only Owner or Primary Owner roles can grant VenueX the necessary permissions for full integration.' }
        ]
      },
      {
        heading: 'Step 1 — Your Address Data',
        items: [
          { text: 'Check consistency: Name–Address–Phone, category, hours (incl. special days), map pin, links', tooltip: 'Consistent data across all fields improves search visibility and customer trust.' },
          { text: 'Confirm each location has a unique store code with consistent format', tooltip: 'Store codes are critical for matching sales and inventory data to specific locations.' }
        ]
      },
      {
        heading: 'Step 2 — Where to Sync',
        items: [
          { text: 'Select platforms to sync (Google, Apple, etc.)', tooltip: 'Choose which platforms you want to keep in sync with VenueX.' },
          { text: 'Apple requires an Apple Business Connect account', tooltip: 'Create an Apple Business Connect account at business.apple.com before enabling Apple Maps sync.' }
        ]
      },
      {
        heading: 'Step 3 — Review & Connect',
        items: [
          { text: 'After connecting GBP, VenueX imports your locations automatically', tooltip: 'The import process typically takes a few minutes depending on the number of locations.' },
          { text: 'Reviews can be enabled right after import', tooltip: 'Enable review monitoring to track and respond to customer reviews from one dashboard.' }
        ]
      }
    ]
  },
  sales: {
    title: 'Offline Sales Guide',
    sections: [
      {
        heading: 'Before you begin',
        items: [
          { text: 'VenueX ingests sales files via SFTP/FTP', tooltip: 'We provide secure SFTP/FTP credentials for automated file uploads from your POS or ERP system.' },
          { text: 'File format must be CSV (UTF-8)', tooltip: 'Use UTF-8 encoding to ensure special characters (Turkish İ, ş, ğ, etc.) are handled correctly.' },
          { text: 'Recommended frequency: daily (minimum weekly)', tooltip: 'More frequent uploads enable faster attribution and more accurate campaign optimization.' },
          { text: 'PII (email/phone/name) must be SHA-256 hashed on your side', tooltip: 'Hash personally identifiable information before sending. This protects customer privacy while enabling match rates.' }
        ]
      },
      {
        heading: 'Required Fields',
        items: [
          { text: 'Country (ISO code), Conversion Name', tooltip: 'Use 2-letter ISO country codes (TR, US, DE). Conversion name identifies the type of sale.' },
          { text: 'Conversion Time (ISO-8601 with timezone)', tooltip: 'Format: 2024-01-15T14:30:00+03:00. Include timezone for accurate attribution.' },
          { text: 'Conversion Value (numeric), Currency (ISO code)', tooltip: 'Value should be numeric without symbols. Use ISO currency codes: TRY, USD, EUR.' }
        ]
      },
      {
        heading: 'Strongly Recommended',
        items: [
          { text: 'Email (lowercase + trimmed, then SHA-256)', tooltip: 'Normalize email: lowercase, trim spaces, then hash. Example: "User@Email.com " → "user@email.com" → hash.' },
          { text: 'Phone (E.164 format, then SHA-256)', tooltip: 'E.164 format includes country code: +905551234567. Remove spaces and dashes before hashing.' },
          { text: 'Store Code (must match Locations), Order ID', tooltip: 'Store codes must exactly match your location data. Order ID helps with deduplication.' }
        ]
      },
      {
        heading: 'Tips',
        items: [
          { text: 'Normalize identifiers BEFORE hashing', tooltip: 'Inconsistent formatting before hashing creates different hashes, reducing match rates.' },
          { text: 'Start with a small test file to validate mapping', tooltip: 'Upload 10-50 rows first to verify field mappings are correct before sending full data.' },
          { text: 'Backfill up to 90 days of data for pilots', tooltip: 'Historical data helps establish baseline performance and improves attribution models.' }
        ]
      }
    ]
  },
  catalog: {
    title: 'Local Inventory Guide',
    sections: [
      {
        heading: 'Before you begin',
        items: [
          { text: 'You need store-level availability by Product ID + Store Code', tooltip: 'Each row should indicate which product is available at which store location.' },
          { text: 'Product IDs must match your catalog (e.g., Merchant Center)', tooltip: 'Use the same product identifiers as in Google Merchant Center or your e-commerce platform.' },
          { text: 'Data delivery: SFTP/FTP + CSV (UTF-8)', tooltip: 'Same secure file transfer method as sales data. Use UTF-8 encoding.' },
          { text: 'Store Codes must match Locations/Sales exactly', tooltip: 'Mismatched store codes will prevent inventory from being associated with the correct location.' }
        ]
      },
      {
        heading: 'Required Fields',
        items: [
          { text: 'Product ID (must match catalog identifier)', tooltip: 'The unique SKU or GTIN that identifies the product in your catalog system.' },
          { text: 'Store Code', tooltip: 'The store identifier that matches your location data in VenueX.' },
          { text: 'Availability (in_stock / out_of_stock)', tooltip: 'Simple boolean status. Use "in_stock" or "out_of_stock" as values.' }
        ]
      },
      {
        heading: 'Optional Fields',
        items: [
          { text: 'Price (if store price differs)', tooltip: 'Include local price only if it differs from your online/catalog price.' },
          { text: 'Quantity', tooltip: 'Stock quantity helps with "limited availability" messaging in ads.' }
        ]
      },
      {
        heading: 'Tips',
        items: [
          { text: 'Confirm Product ID and Store Code formats match exactly', tooltip: 'Even small differences (spaces, case) will cause matching failures.' },
          { text: 'Standardize availability values', tooltip: 'Use consistent values across all rows: "in_stock" not "InStock" or "available".' },
          { text: 'Daily updates strongly recommended', tooltip: 'Frequent updates prevent showing out-of-stock items in local inventory ads.' }
        ]
      }
    ]
  }
};

const testimonials = [
  { 
    quote: "1P mağaza verilerimizi dijital kanallarla ilişkilendirerek dijital kampanyalarımızın gerçek dönüşümlerini ölçümledik ve reklam performansımızı zirveye taşıdık.",
    name: "Mehmet Emre",
    role: "Kıdemli Pazarlama ve Kurumsal İletişim Müdürü",
    company: "Koçtaş",
    kpi: "4.6x",
    kpiLabel: "Offline ROAS"
  },
  { 
    quote: "VenueX helped us uncover the true impact of our digital campaigns on store sales—unlocking higher returns and smarter spend allocation.",
    name: "Mustafa Cengiz",
    role: "Director of Growth & Digital Marketing",
    company: "Boyner",
    kpi: "3x",
    kpiLabel: "Offline ROAS"
  },
  { 
    quote: "Performans ve büyüme odaklı dijital pazarlama çözümleri sunan Ingage olarak, iş ortağımız VenueX ile Koçtaş'ın omnichannel deneyimini güçlendirdik.",
    name: "Kemal Kar",
    role: "Teknoloji ve Ürün Direktörü",
    company: "Ingage",
    kpi: "+112%",
    kpiLabel: "Mağaza Ziyareti"
  },
  { 
    quote: "VenueX integrated our CRM, POS, and inventory systems with major digital platforms enabling end-to-end visibility and optimization.",
    name: "Mustafa Cengiz",
    role: "Director of Growth & Digital Marketing",
    company: "Boyner",
    kpi: "208K+",
    kpiLabel: "Products Synced"
  },
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

export default function Setup3B() {
  const [activeStep, setActiveStep] = useState(0);
  const [salesDataModalOpen, setSalesDataModalOpen] = useState(false);
  const [dataMappingModalOpen, setDataMappingModalOpen] = useState(false);
  const [inviteTeamModalOpen, setInviteTeamModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ firstName: '', lastName: '', email: '', role: 'Viewer' });
  const [inviteSentTo, setInviteSentTo] = useState<string | null>(null);
  const [invitedUsers, setInvitedUsers] = useState([
    { firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet@company.com', role: 'Admin', status: 'accepted' as const },
    { firstName: 'Elif', lastName: 'Demir', email: 'elif@company.com', role: 'Manager', status: 'pending' as const },
    { firstName: 'Mehmet', lastName: 'Kaya', email: 'mehmet@company.com', role: 'Viewer', status: 'pending' as const },
  ]);
  const [adminMode, setAdminMode] = useState(() => {
    return localStorage.getItem('venuex_admin_mode') === 'true';
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAdminMode(prev => {
          const newValue = !prev;
          localStorage.setItem('venuex_admin_mode', String(newValue));
          return newValue;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
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
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheckItem = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
    if (inviteForm.email) {
      setInvitedUsers(prev => [...prev, {
        firstName: inviteForm.firstName || 'New',
        lastName: inviteForm.lastName || 'User',
        email: inviteForm.email,
        role: inviteForm.role,
        status: 'pending' as const
      }]);
    }
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
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-[400px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 flex-col relative overflow-hidden flex-shrink-0 sticky top-0 h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        {/* Logo */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-3">
            <img src={venuexLogo} alt="VenueX" className="w-40" />
          </div>
          {activeStep === 0 && (
            <p className="mt-3 text-sm text-white/80">
              Connect your in-store data with digital advertising for unprecedented insights.
            </p>
          )}
        </div>

        {/* Features or Step Guide */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          {activeStep === 0 ? (
            <div className="space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                    <p className="text-white/70 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(() => {
                const guide = activeStep === 1 ? stepGuides.locations : activeStep === 2 ? stepGuides.sales : stepGuides.catalog;
                const guideKey = activeStep === 1 ? 'locations' : activeStep === 2 ? 'sales' : 'catalog';
                const isBeforeSection = (heading: string) => heading.toLowerCase().includes('before');
                return (
                  <>
                    <h3 className="text-sm font-bold text-white mb-3">{guide.title}</h3>
                    {guide.sections.map((section, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                        <h4 className="text-xs font-semibold text-white mb-2">{section.heading}</h4>
                        <ul className="space-y-1">
                          {section.items.map((item, itemIdx) => {
                            const checkKey = `${guideKey}-${idx}-${itemIdx}`;
                            const isChecked = checkedItems[checkKey] || false;
                            
                            if (isBeforeSection(section.heading)) {
                              return (
                                <li 
                                  key={itemIdx}
                                  className="flex items-start gap-2 text-white/80 text-xs"
                                >
                                  <div 
                                    className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer ${isChecked ? 'bg-green-500 border-green-500' : 'border-white/50 hover:border-white'}`}
                                    onClick={() => toggleCheckItem(checkKey)}
                                  >
                                    {isChecked && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <span className={`flex-1 ${isChecked ? 'line-through opacity-60' : ''}`}>{item.text}</span>
                                  <Tooltip title={item.tooltip} arrow placement="right">
                                    <button className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center flex-shrink-0 transition-colors">
                                      <Info className="w-2.5 h-2.5 text-white" />
                                    </button>
                                  </Tooltip>
                                </li>
                              );
                            }
                            
                            return (
                              <li key={itemIdx} className="flex items-start gap-2 text-white/80 text-xs">
                                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{item.text}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Testimonial Carousel - only on Brand Info */}
        {activeStep === 0 && (
          <div className="relative z-10 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-500 min-h-[140px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-bold text-blue-600">{testimonials[testimonialIndex].company.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-xs">{testimonials[testimonialIndex].name}</p>
                    <p className="text-white/60 text-[10px]">{testimonials[testimonialIndex].role}, {testimonials[testimonialIndex].company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">{testimonials[testimonialIndex].kpi}</p>
                  <p className="text-white/60 text-[10px]">{testimonials[testimonialIndex].kpiLabel}</p>
                </div>
              </div>
              <p className="text-white/90 italic text-xs">"{testimonials[testimonialIndex].quote}"</p>
            </div>
            {/* Carousel Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === testimonialIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Setup Content */}
      <div className="flex-1 bg-gray-50 overflow-y-auto h-screen">
        {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
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
            {adminMode && (
              <button
                onClick={() => {
                  setAdminMode(false);
                  localStorage.setItem('venuex_admin_mode', 'false');
                }}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 border border-orange-200 rounded-lg hover:bg-orange-200 transition-all"
                title="Admin Mode aktif - tüm adımları atlayabilirsiniz. Kapatmak için tıklayın veya Ctrl+Shift+A"
                data-testid="admin-mode-badge"
              >
                <Shield size={12} />
                Admin
              </button>
            )}
            <div className="text-right mr-4">
              <span className="text-sm text-gray-500">Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${adminMode ? 100 : progressPercent}%` }} />
                </div>
                <span className="text-sm font-medium text-blue-600">{adminMode ? 100 : progressPercent}%</span>
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
                const isCompleted = adminMode || index < activeStep;
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

            {/* Invited Users List */}
            {invitedUsers.length > 0 && (
              <div className="border-t border-gray-200 pt-5 mt-2">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Team Members</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Name</th>
                        <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Email</th>
                        <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Role</th>
                        <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invitedUsers.map((user, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900">{user.firstName} {user.lastName}</td>
                          <td className="px-3 py-2 text-gray-600">{user.email}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                              user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>{user.role}</span>
                          </td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${
                              user.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {user.status === 'accepted' ? (
                                <><Check size={10} /> Accepted</>
                              ) : (
                                <><Mail size={10} /> Pending</>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
