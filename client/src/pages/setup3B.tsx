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
  Info,
  Users,
  UserPlus,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react';
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
  { id: 0, label: 'Brand', icon: Building2, description: 'Identity & contact' },
  { id: 1, label: 'Locations', icon: MapPin, description: 'Store profiles' },
  { id: 2, label: 'Sales', icon: ShoppingCart, description: 'Conversions' },
  { id: 3, label: 'Catalog', icon: Package, description: 'Products' },
];

const features = [
  { icon: MapPin, title: 'Multi-Location', desc: 'Manage thousands of locations' },
  { icon: Target, title: 'Attribution', desc: 'Connect store sales to ads' },
  { icon: BarChart3, title: 'AI Insights', desc: 'Smart recommendations' },
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
    title: 'Locations',
    sections: [
      {
        heading: 'Before you connect',
        items: [
          { text: 'Locations under single GBP group', tooltip: 'All your store locations should be organized within one Business Group in GBP.' },
          { text: 'Accurate business details', tooltip: 'Accurate NAP data ensures proper syncing and avoids duplicate entries.' },
          { text: 'Fix unverified locations first', tooltip: 'Problematic listings can cause sync failures.' },
          { text: 'Unique store codes assigned', tooltip: 'Store codes link your locations to sales data.' },
          { text: 'Owner access in GBP', tooltip: 'Only Owner roles can grant VenueX necessary permissions.' }
        ]
      },
      {
        heading: 'Step 1 — Address Data',
        items: [
          { text: 'Check NAP consistency', tooltip: 'Consistent data improves search visibility.' },
          { text: 'Confirm store code format', tooltip: 'Store codes are critical for matching data.' }
        ]
      },
      {
        heading: 'Step 2 — Platforms',
        items: [
          { text: 'Select sync platforms', tooltip: 'Choose which platforms to sync with VenueX.' },
          { text: 'Apple needs Business Connect', tooltip: 'Create account at business.apple.com first.' }
        ]
      }
    ]
  },
  sales: {
    title: 'Offline Sales',
    sections: [
      {
        heading: 'Before you begin',
        items: [
          { text: 'SFTP/FTP ingestion ready', tooltip: 'We provide secure credentials for automated uploads.' },
          { text: 'CSV format (UTF-8)', tooltip: 'UTF-8 ensures special characters handled correctly.' },
          { text: 'Daily frequency preferred', tooltip: 'More frequent uploads enable faster attribution.' },
          { text: 'PII SHA-256 hashed', tooltip: 'Hash personal info to protect privacy.' }
        ]
      },
      {
        heading: 'Required Fields',
        items: [
          { text: 'Country, Conversion Name', tooltip: 'Use 2-letter ISO country codes.' },
          { text: 'Conversion Time (ISO-8601)', tooltip: 'Include timezone for accurate attribution.' },
          { text: 'Value & Currency', tooltip: 'Use ISO currency codes: TRY, USD, EUR.' }
        ]
      }
    ]
  },
  catalog: {
    title: 'Local Inventory',
    sections: [
      {
        heading: 'Before you begin',
        items: [
          { text: 'Store-level availability data', tooltip: 'Each row indicates product availability at store.' },
          { text: 'Product IDs match catalog', tooltip: 'Use same identifiers as Merchant Center.' },
          { text: 'SFTP/FTP + CSV (UTF-8)', tooltip: 'Same secure transfer as sales data.' },
          { text: 'Store codes match exactly', tooltip: 'Mismatched codes prevent association.' }
        ]
      },
      {
        heading: 'Required Fields',
        items: [
          { text: 'Product ID', tooltip: 'Unique SKU or GTIN from your catalog.' },
          { text: 'Store Code', tooltip: 'Must match location data in VenueX.' },
          { text: 'Availability status', tooltip: 'Use in_stock or out_of_stock values.' }
        ]
      }
    ]
  }
};

const testimonials = [
  { 
    quote: "Dijital kampanyalarımızın gerçek dönüşümlerini ölçümledik ve reklam performansımızı zirveye taşıdık.",
    name: "Mehmet Emre",
    role: "Pazarlama Müdürü",
    company: "Koçtaş",
    kpi: "4.6x",
    kpiLabel: "ROAS"
  },
  { 
    quote: "VenueX helped us uncover the true impact of our digital campaigns on store sales.",
    name: "Mustafa Cengiz",
    role: "Digital Director",
    company: "MediaMarkt",
    kpi: "2.8x",
    kpiLabel: "Attribution"
  },
];

function IntegrationCard({ name, description, logo, status }: PlatformCard) {
  const getLogo = () => {
    const logoClass = "w-5 h-5";
    switch (logo) {
      case 'google': return <SiGoogle className={`${logoClass} text-amber-400`} />;
      case 'meta': return <SiMeta className={`${logoClass} text-amber-400`} />;
      case 'tiktok': return <SiTiktok className={`${logoClass} text-amber-400`} />;
      case 'apple': return <SiApple className={`${logoClass} text-amber-400`} />;
      default: return <Zap className={`${logoClass} text-amber-400`} />;
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-5 hover:border-amber-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(251,191,36,0.08)]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-start gap-4">
        <div className="w-12 h-12 bg-zinc-800/80 rounded-xl flex items-center justify-center border border-zinc-700/50 group-hover:border-amber-500/30 transition-colors">
          {getLogo()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-zinc-100 text-sm tracking-wide">{name}</h4>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="relative mt-4">
        {status === 'connected' ? (
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium rounded-xl hover:bg-emerald-500/20 transition-all">
            <Check size={14} /> Connected
          </button>
        ) : status === 'coming_soon' ? (
          <span className="w-full flex items-center justify-center px-4 py-2.5 bg-zinc-800/50 text-zinc-500 text-xs font-medium rounded-xl border border-zinc-700/30">Soon</span>
        ) : (
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium rounded-xl hover:bg-amber-500/20 hover:border-amber-500/50 transition-all">
            <Plug size={14} /> Connect
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
  const [inviteForm, setInviteForm] = useState({ firstName: '', lastName: '', email: '', role: 'Manager' });
  const [inviteSentTo, setInviteSentTo] = useState<string | null>(null);
  const [invitedUsers, setInvitedUsers] = useState([
    { firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet@company.com', role: 'Admin', status: 'accepted' as const },
    { firstName: 'Elif', lastName: 'Demir', email: 'elif@company.com', role: 'Manager', status: 'pending' as const },
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
    description: "Premium retail experience",
    website: 'venuex.io',
    phoneCountryCode: '+90',
    phone: '',
    email: '',
    categories: ['Building materials store', 'Hardware store'],
    facebook: '',
    instagram: '',
    twitter: '',
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
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round(((activeStep) / steps.length) * 100);

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
    setInviteForm({ firstName: '', lastName: '', email: '', role: 'Manager' });
  };

  const addUrlSegment = () => setUrlSegments([...urlSegments, '']);
  const updateUrlSegment = (index: number, value: string) => {
    const newSegments = [...urlSegments];
    newSegments[index] = value;
    setUrlSegments(newSegments);
  };
  const removeUrlSegment = (index: number) => setUrlSegments(urlSegments.filter((_, i) => i !== index));

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;1,400&display=swap');
        
        .font-display { font-family: 'Outfit', sans-serif; }
        .font-editorial { font-family: 'Crimson Pro', serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.1); }
          50% { box-shadow: 0 0 40px rgba(251,191,36,0.2); }
        }
        
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); }
          50% { transform: translate(12%, 9%); }
          70% { transform: translate(9%, 4%); }
          90% { transform: translate(-1%, 7%); }
        }
        
        .noise-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          animation: grain 8s steps(10) infinite;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-slide {
          animation: fadeSlideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .glass-card {
          background: linear-gradient(135deg, rgba(39,39,42,0.6) 0%, rgba(24,24,27,0.8) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(113,113,122,0.2);
        }
        
        .input-luxury {
          background: rgba(39,39,42,0.5);
          border: 1px solid rgba(113,113,122,0.3);
          transition: all 0.3s ease;
        }
        
        .input-luxury:focus {
          border-color: rgba(251,191,36,0.5);
          box-shadow: 0 0 0 3px rgba(251,191,36,0.1);
          outline: none;
        }
      `}</style>

      {/* Left Panel - Luxury Dark */}
      <div className="w-[420px] bg-zinc-950 relative overflow-hidden flex flex-col p-8 noise-overlay sticky top-0 h-screen">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Decorative line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
        
        {/* Logo */}
        <div className="relative z-10 mb-12 animate-fade-slide">
          <img src={venuexLogo} alt="VenueX" className="w-36 opacity-90" />
          {activeStep === 0 && (
            <p className="mt-4 text-sm text-zinc-500 font-display leading-relaxed max-w-[280px]">
              Connect your in-store data with digital advertising for unprecedented insights.
            </p>
          )}
        </div>

        {/* Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          {activeStep === 0 ? (
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`animate-fade-slide stagger-${index + 1} group flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-900/50 transition-all duration-300 cursor-default`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                    <feature.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-medium text-zinc-200 tracking-wide">{feature.title}</h3>
                    <p className="text-zinc-500 text-xs mt-1 font-display">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 animate-fade-slide">
              {(() => {
                const guide = activeStep === 1 ? stepGuides.locations : activeStep === 2 ? stepGuides.sales : stepGuides.catalog;
                const guideKey = activeStep === 1 ? 'locations' : activeStep === 2 ? 'sales' : 'catalog';
                const isBeforeSection = (heading: string) => heading.toLowerCase().includes('before');
                return (
                  <>
                    <h3 className="text-xs font-display font-semibold text-amber-400 tracking-[0.2em] uppercase mb-4">{guide.title}</h3>
                    {guide.sections.map((section, idx) => (
                      <div key={idx} className="glass-card rounded-2xl p-4 mb-3">
                        <h4 className="text-xs font-display font-medium text-zinc-300 mb-3 tracking-wide">{section.heading}</h4>
                        <ul className="space-y-2">
                          {section.items.map((item, itemIdx) => {
                            const checkKey = `${guideKey}-${idx}-${itemIdx}`;
                            const isChecked = checkedItems[checkKey] || false;
                            
                            if (isBeforeSection(section.heading)) {
                              return (
                                <li 
                                  key={itemIdx}
                                  className="flex items-start gap-3 text-zinc-400 text-xs font-display group"
                                >
                                  <button 
                                    className={`w-4 h-4 rounded-md border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${isChecked ? 'bg-amber-500 border-amber-500' : 'border-zinc-600 hover:border-amber-500/50'}`}
                                    onClick={() => toggleCheckItem(checkKey)}
                                  >
                                    {isChecked && <Check className="w-2.5 h-2.5 text-zinc-900" />}
                                  </button>
                                  <span className={`flex-1 leading-relaxed ${isChecked ? 'line-through text-zinc-600' : ''}`}>{item.text}</span>
                                  <Tooltip title={item.tooltip} arrow placement="right">
                                    <button className="w-4 h-4 rounded-full bg-zinc-800 hover:bg-amber-500/20 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                                      <Info className="w-2.5 h-2.5 text-zinc-500" />
                                    </button>
                                  </Tooltip>
                                </li>
                              );
                            }
                            
                            return (
                              <li key={itemIdx} className="flex items-start gap-3 text-zinc-400 text-xs font-display">
                                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500/50" />
                                <span className="leading-relaxed">{item.text}</span>
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

        {/* Testimonial */}
        {activeStep === 0 && (
          <div className="relative z-10 mt-8 animate-fade-slide stagger-4">
            <div className="glass-card rounded-2xl p-5 transition-all duration-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-display font-bold text-zinc-900">{testimonials[testimonialIndex].company.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-zinc-200 font-display text-sm font-medium">{testimonials[testimonialIndex].name}</p>
                  <p className="text-zinc-500 text-xs font-display">{testimonials[testimonialIndex].role}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-display font-bold text-xl">{testimonials[testimonialIndex].kpi}</p>
                  <p className="text-zinc-600 text-[10px] font-display uppercase tracking-wider">{testimonials[testimonialIndex].kpiLabel}</p>
                </div>
              </div>
              <p className="text-zinc-400 font-editorial italic text-sm leading-relaxed">"{testimonials[testimonialIndex].quote}"</p>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === testimonialIndex ? 'w-6 bg-amber-500' : 'w-2 bg-zinc-700 hover:bg-zinc-600'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Setup Content */}
      <div className="flex-1 bg-zinc-900 overflow-y-auto h-screen">
        {/* Header */}
        <div className="bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 px-8 py-5 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-display font-medium rounded-lg border border-amber-500/20">#{integrationId}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-sm text-zinc-400 font-display">{companyName}</span>
              </div>
              <h1 className="text-xl font-display font-semibold text-zinc-100 tracking-tight">Account Setup</h1>
            </div>
            <div className="flex items-center gap-4">
              {adminMode && (
                <button
                  onClick={() => {
                    setAdminMode(false);
                    localStorage.setItem('venuex_admin_mode', 'false');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-display font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all"
                  data-testid="admin-mode-badge"
                >
                  <Shield size={12} />
                  Admin
                </button>
              )}
              <div className="text-right mr-2">
                <span className="text-xs text-zinc-500 font-display uppercase tracking-wider">Progress</span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-28 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${adminMode ? 100 : progressPercent}%` }} />
                  </div>
                  <span className="text-sm font-display font-medium text-amber-400">{adminMode ? 100 : progressPercent}%</span>
                </div>
              </div>
              <button
                onClick={() => setInviteTeamModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-display text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 hover:border-zinc-600 transition-all"
                data-testid="button-invite-team"
              >
                <Users size={16} />
                Invite
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Step Navigation */}
            <div className="glass-card rounded-2xl p-2 mb-8">
              <div className="flex gap-2">
                {steps.map((step, index) => {
                  const isActive = index === activeStep;
                  const isCompleted = adminMode || index < activeStep;
                  const Icon = step.icon;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(index)}
                      className={`flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-900 shadow-lg shadow-amber-500/20' 
                          : 'hover:bg-zinc-800/50 text-zinc-400'
                      }`}
                      data-testid={`step-tab-${index}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-semibold ${
                        isCompleted 
                          ? 'bg-emerald-500 text-white' 
                          : isActive 
                            ? 'bg-zinc-900/30 text-amber-900' 
                            : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {isCompleted ? <Check size={14} /> : index + 1}
                      </div>
                      <div className="text-left">
                        <span className={`text-sm font-display font-medium block ${isActive ? 'text-zinc-900' : 'text-zinc-300'}`}>
                          {step.label}
                        </span>
                        <span className={`text-[10px] font-display ${isActive ? 'text-zinc-800' : 'text-zinc-500'}`}>
                          {step.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Info */}
            {activeStep === 0 && (
              <div data-testid="tab-panel-brand" className="animate-fade-slide">
                <div className="glass-card rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <div>
                      <h2 className="text-lg font-display font-semibold text-zinc-100">Brand Identity</h2>
                      <p className="text-sm text-zinc-500 font-display">Keep your brand consistent across platforms</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Logo</label>
                      <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 text-center hover:border-amber-500/40 transition-colors cursor-pointer group">
                        <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto mb-3 group-hover:text-amber-500/50 transition-colors" />
                        <p className="text-sm text-zinc-400 font-display">Drop your logo here</p>
                        <p className="text-xs text-zinc-600 mt-1 font-display">PNG, JPG, SVG up to 2MB</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Business Name</label>
                        <input
                          type="text"
                          value={brandInfo.businessName}
                          onChange={(e) => handleBrandInfoChange('businessName', e.target.value)}
                          className="w-full px-4 py-3 input-luxury rounded-xl text-zinc-200 font-display text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Website</label>
                        <input
                          type="text"
                          value={brandInfo.website}
                          onChange={(e) => handleBrandInfoChange('website', e.target.value)}
                          className="w-full px-4 py-3 input-luxury rounded-xl text-zinc-200 font-display text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Categories</label>
                      <Autocomplete
                        multiple
                        options={categoryOptions}
                        value={brandInfo.categories}
                        onChange={(_, newValue) => handleBrandInfoChange('categories', newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} label={option} size="small" sx={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)', fontFamily: 'Outfit' }} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            placeholder="Select categories..." 
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(39,39,42,0.5)',
                                borderRadius: '12px',
                                '& fieldset': { borderColor: 'rgba(113,113,122,0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(251,191,36,0.4)' },
                                '&.Mui-focused fieldset': { borderColor: 'rgba(251,191,36,0.5)' },
                              },
                              '& .MuiInputBase-input': { color: '#e4e4e7', fontFamily: 'Outfit' },
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Description</label>
                      <textarea
                        value={brandInfo.description}
                        onChange={(e) => handleBrandInfoChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 input-luxury rounded-xl text-zinc-200 font-display text-sm resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-zinc-800">
                      <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-900 font-display font-medium rounded-xl transition-all shadow-lg shadow-amber-500/20">
                        Continue <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Locations */}
            {activeStep === 1 && (
              <div data-testid="tab-panel-locations" className="space-y-5 animate-fade-slide">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                      <SiGoogle className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-zinc-100">Google Business Profile</h3>
                      <p className="text-sm text-zinc-500 font-display">Sync location listings and reviews</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-900 font-display font-medium rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30">
                      <Plug size={16} /> Connect Account
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-zinc-800 border border-zinc-700 text-zinc-300 font-display font-medium rounded-xl hover:bg-zinc-700 transition-all">
                      Activate Reviews
                    </button>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-zinc-100 mb-4">Other Platforms</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {mockPlatformCards.locations.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sales */}
            {activeStep === 2 && (
              <div data-testid="tab-panel-sales" className="space-y-5 animate-fade-slide">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Database className="w-5 h-5 text-amber-400" />
                    <div>
                      <h2 className="text-lg font-display font-semibold text-zinc-100">Sales Data</h2>
                      <p className="text-sm text-zinc-500 font-display">Connect your sales sources and ad platforms</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setSalesDataModalOpen(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-900 font-display font-medium rounded-xl transition-all shadow-lg shadow-amber-500/20"
                    >
                      <Database size={16} /> 1. Data Source
                    </button>
                    <button
                      onClick={() => setDataMappingModalOpen(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-zinc-800 border border-zinc-700 text-zinc-300 font-display font-medium rounded-xl hover:bg-zinc-700 transition-all"
                    >
                      <Settings size={16} /> 2. Mapping
                    </button>
                  </div>

                  <h3 className="font-display font-medium text-zinc-300 mb-4 text-sm uppercase tracking-wider">Ad Platforms</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {mockPlatformCards.sales.map((card) => (
                      <IntegrationCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Catalog */}
            {activeStep === 3 && (
              <div data-testid="tab-panel-catalog" className="space-y-5 animate-fade-slide">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Package className="w-5 h-5 text-amber-400" />
                    <div>
                      <h2 className="text-lg font-display font-semibold text-zinc-100">Catalog Data</h2>
                      <p className="text-sm text-zinc-500 font-display">Sync products across platforms</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mb-6">
                    <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-900 font-display font-medium rounded-xl transition-all shadow-lg shadow-amber-500/20">
                      <Database size={16} /> 1. Data Source
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-zinc-800 border border-zinc-700 text-zinc-300 font-display font-medium rounded-xl hover:bg-zinc-700 transition-all">
                      <Settings size={16} /> 2. Mapping
                    </button>
                  </div>

                  <h3 className="font-display font-medium text-zinc-300 mb-4 text-sm uppercase tracking-wider">Catalog Platforms</h3>
                  <div className="grid grid-cols-3 gap-4">
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
      <Dialog 
        open={salesDataModalOpen} 
        onClose={() => setSalesDataModalOpen(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: '24px', 
            backgroundColor: '#18181b',
            backgroundImage: 'linear-gradient(135deg, rgba(39,39,42,0.8) 0%, rgba(24,24,27,1) 100%)',
            border: '1px solid rgba(113,113,122,0.2)',
          } 
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(113,113,122,0.2)', pb: 2, px: 3, pt: 3 }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <Database className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-zinc-100">Data Source</h2>
              <p className="text-sm text-zinc-500 font-display">Configure your connection</p>
            </div>
          </div>
          <IconButton onClick={() => setSalesDataModalOpen(false)} size="small" sx={{ bgcolor: 'rgba(39,39,42,0.8)', '&:hover': { bgcolor: 'rgba(63,63,70,0.8)' } }}>
            <X className="w-4 h-4 text-zinc-400" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3, px: 3 }}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Source Type</label>
                <select className="w-full p-3 input-luxury rounded-xl text-zinc-200 font-display text-sm" value={salesConfig.dataSourceType} onChange={(e) => handleSalesConfigChange('dataSourceType', e.target.value)}>
                  <option value="HTTP">HTTP</option>
                  <option value="FTP">FTP</option>
                  <option value="SFTP">SFTP</option>
                  <option value="S3">AWS S3</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">URL Type</label>
                <select className="w-full p-3 input-luxury rounded-xl text-zinc-200 font-display text-sm" value={salesConfig.fileUrlType} onChange={(e) => handleSalesConfigChange('fileUrlType', e.target.value)}>
                  <option value="File URL">File URL</option>
                  <option value="Folder Path">Folder Path</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">File URL</label>
              <input 
                type="text"
                value={salesConfig.fileUrl} 
                onChange={(e) => handleSalesConfigChange('fileUrl', e.target.value)} 
                className="w-full p-3 input-luxury rounded-xl text-zinc-200 font-display text-sm"
                placeholder="https://example.com/data/sales.csv"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Frequency</label>
                <select className="w-full p-3 input-luxury rounded-xl text-zinc-200 font-display text-sm" value={salesConfig.schedulerFrequency} onChange={(e) => handleSalesConfigChange('schedulerFrequency', e.target.value)}>
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Time</label>
                <input type="time" className="w-full p-3 input-luxury rounded-xl text-zinc-200 font-display text-sm" value={salesConfig.schedulerTime} onChange={(e) => handleSalesConfigChange('schedulerTime', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Timezone</label>
                <select className="w-full p-3 input-luxury rounded-xl text-zinc-200 font-display text-sm" value={salesConfig.timezone} onChange={(e) => handleSalesConfigChange('timezone', e.target.value)}>
                  <option value="Europe/Istanbul">Istanbul</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(113,113,122,0.2)', p: 2.5, gap: 1.5 }}>
          <button onClick={() => setSalesDataModalOpen(false)} className="px-5 py-2.5 text-zinc-400 font-display font-medium rounded-xl hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={() => setSalesDataModalOpen(false)} className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-900 font-display font-medium rounded-xl shadow-lg shadow-amber-500/20">Save</button>
        </DialogActions>
      </Dialog>

      {/* Data Mapping Modal */}
      <Dialog 
        open={dataMappingModalOpen} 
        onClose={() => setDataMappingModalOpen(false)} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: '24px', 
            backgroundColor: '#18181b',
            backgroundImage: 'linear-gradient(135deg, rgba(39,39,42,0.8) 0%, rgba(24,24,27,1) 100%)',
            border: '1px solid rgba(113,113,122,0.2)',
          } 
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(113,113,122,0.2)', pb: 2, px: 3, pt: 3 }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <Settings className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-zinc-100">Data Mapping</h2>
              <p className="text-sm text-zinc-500 font-display">Map your fields to VenueX</p>
            </div>
          </div>
          <IconButton onClick={() => setDataMappingModalOpen(false)} size="small" sx={{ bgcolor: 'rgba(39,39,42,0.8)', '&:hover': { bgcolor: 'rgba(63,63,70,0.8)' } }}>
            <X className="w-4 h-4 text-zinc-400" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3, px: 3 }}>
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-display font-medium text-zinc-200">How it works</h3>
              </div>
              <ul className="space-y-3">
                {['Analyze file structure', 'Auto-match columns', 'Review and confirm'].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400 font-display">
                    <div className="w-6 h-6 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-amber-400">{i + 1}</span>
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(113,113,122,0.2)', p: 2.5, gap: 1.5 }}>
          <button onClick={() => setDataMappingModalOpen(false)} className="px-5 py-2.5 text-zinc-400 font-display font-medium rounded-xl hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={() => setDataMappingModalOpen(false)} className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-900 font-display font-medium rounded-xl shadow-lg shadow-amber-500/20">Continue</button>
        </DialogActions>
      </Dialog>

      {/* Invite Team Modal */}
      <Dialog 
        open={inviteTeamModalOpen} 
        onClose={() => setInviteTeamModalOpen(false)} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: '24px', 
            backgroundColor: '#18181b',
            backgroundImage: 'linear-gradient(135deg, rgba(39,39,42,0.8) 0%, rgba(24,24,27,1) 100%)',
            border: '1px solid rgba(113,113,122,0.2)',
          } 
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(113,113,122,0.2)', pb: 2, px: 3, pt: 3 }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <UserPlus className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-zinc-100">Invite Team</h2>
              <p className="text-sm text-zinc-500 font-display">Collaborate on VenueX</p>
            </div>
          </div>
          <IconButton onClick={() => setInviteTeamModalOpen(false)} size="small" sx={{ bgcolor: 'rgba(39,39,42,0.8)', '&:hover': { bgcolor: 'rgba(63,63,70,0.8)' } }}>
            <X className="w-4 h-4 text-zinc-400" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3, px: 3 }}>
          {inviteSentTo && (
            <div className="mb-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-emerald-300 font-display font-medium">Invite sent to {inviteSentTo}</p>
              <button onClick={() => setInviteSentTo(null)} className="ml-auto text-emerald-400 hover:text-emerald-300">
                <X size={16} />
              </button>
            </div>
          )}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">First Name</label>
                <input 
                  type="text"
                  value={inviteForm.firstName} 
                  onChange={(e) => handleInviteFormChange('firstName', e.target.value)} 
                  className="w-full px-4 py-3 input-luxury rounded-xl text-zinc-200 font-display text-sm"
                  placeholder="John"
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Last Name</label>
                <input 
                  type="text"
                  value={inviteForm.lastName} 
                  onChange={(e) => handleInviteFormChange('lastName', e.target.value)} 
                  className="w-full px-4 py-3 input-luxury rounded-xl text-zinc-200 font-display text-sm"
                  placeholder="Doe"
                  data-testid="input-last-name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-display font-medium text-zinc-400 mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="email"
                  value={inviteForm.email} 
                  onChange={(e) => handleInviteFormChange('email', e.target.value)} 
                  className="w-full pl-11 pr-4 py-3 input-luxury rounded-xl text-zinc-200 font-display text-sm"
                  placeholder="john@company.com"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-medium text-zinc-400 mb-3 uppercase tracking-wider">Role</label>
              <div className="grid grid-cols-2 gap-3" data-testid="select-role">
                {[
                  { value: 'Admin', icon: Shield, desc: 'Full access' },
                  { value: 'Manager', icon: Users, desc: 'Edit & manage' },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleInviteFormChange('role', role.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      inviteForm.role === role.value
                        ? 'border-amber-500/50 bg-amber-500/10'
                        : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                    }`}
                  >
                    <role.icon className={`w-5 h-5 mx-auto mb-2 ${inviteForm.role === role.value ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <p className={`text-sm font-display font-medium ${inviteForm.role === role.value ? 'text-zinc-100' : 'text-zinc-400'}`}>{role.value}</p>
                    <p className="text-xs text-zinc-500 font-display mt-0.5">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {invitedUsers.length > 0 && (
              <div className="border-t border-zinc-800 pt-5">
                <h3 className="text-xs font-display font-medium text-zinc-400 mb-3 uppercase tracking-wider">Team Members</h3>
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-800/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-display font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-display font-medium text-zinc-500 uppercase tracking-wider">Role</th>
                        <th className="text-left px-4 py-3 text-xs font-display font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {invitedUsers.map((user, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-zinc-200 font-display">{user.firstName} {user.lastName}</p>
                              <p className="text-zinc-500 text-xs font-display">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-display font-medium rounded-lg ${
                              user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>{user.role}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-display font-medium rounded-lg ${
                              user.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {user.status === 'accepted' ? <Check size={12} /> : <Mail size={12} />}
                              {user.status === 'accepted' ? 'Active' : 'Pending'}
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
        <DialogActions sx={{ borderTop: '1px solid rgba(113,113,122,0.2)', p: 2.5, gap: 1.5 }}>
          <button onClick={() => setInviteTeamModalOpen(false)} className="px-5 py-2.5 text-zinc-400 font-display font-medium rounded-xl hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={handleSendInvite} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-900 font-display font-medium rounded-xl shadow-lg shadow-amber-500/20" data-testid="button-send-invite">
            <Mail size={16} /> Send Invite
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
