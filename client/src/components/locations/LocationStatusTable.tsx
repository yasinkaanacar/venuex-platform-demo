import { useState, useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { SiGoogle, SiMeta, SiApple } from 'react-icons/si';
import { Clock, AlertTriangle, Phone, Mail, MapPin, Image, ShieldCheck, ShieldAlert, XCircle, PauseCircle, ChevronRight, MoreHorizontal, RefreshCw, Link2, Unlink, ExternalLink, Download, X, Save, Upload, Layers, Search, Filter, Building2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type WarningType = 'phone_missing' | 'email_missing' | 'address_error' | 'image_missing' | 'sync_error';

type SyncErrorCode = 'auth_expired' | 'missing_coordinates' | 'validation_error' | 'rate_limit' | 'unknown';

type MissingFieldKey = 'phone' | 'email' | 'address' | 'imageUrl' | 'website' | 'workingHours' | 'description';

interface MissingFieldInfo {
  key: MissingFieldKey;
  label: string;
  placeholder: string;
  type: 'text' | 'tel' | 'email' | 'url' | 'textarea';
  icon: JSX.Element;
}

interface LocationWarning {
  type: WarningType;
  label: string;
  errorLog?: string;
  errorCode?: SyncErrorCode;
  platform?: PlatformKey;
}

type PlatformStatusType = 'verified' | 'unverified' | 'action_required' | 'fully_passive' | 'temporarily_passive';

interface PlatformData {
  status: PlatformStatusType;
  lastSync: string | null;
  warnings: LocationWarning[];
}

interface LocationData {
  id: number;
  storeCode: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  imageUrl: string;
  website: string;
  workingHours: string;
  description: string;
  storeSet: string;
  google: PlatformData;
  meta: PlatformData;
  apple: PlatformData;
  yandex: PlatformData;
}

interface FilterState {
  search: string;
  platform: PlatformKey | 'all';
  errorType: ErrorTypeFilter;
  storeSet: string;
}

const initialFilters: FilterState = {
  search: '',
  platform: 'all',
  errorType: 'all',
  storeSet: 'all'
};

const mockLocations: LocationData[] = [
  {
    id: 1,
    storeCode: 'DY_001',
    name: 'İstanbul - Kadıköy',
    address: 'Caferağa Mah. Moda Cad. No:12',
    phone: '+90 216 555 0001',
    email: 'kadikoy@doyuyo.com',
    imageUrl: 'https://example.com/kadikoy.jpg',
    website: 'https://doyuyo.com/kadikoy',
    workingHours: '09:00 - 22:00',
    description: 'Kadıköy şubemiz, Moda sahilinde hizmet vermektedir.',
    storeSet: 'Cadde',
    google: { status: 'verified', lastSync: '2 dk önce', warnings: [] },
    meta: { status: 'verified', lastSync: '5 dk önce', warnings: [] },
    apple: { status: 'verified', lastSync: '10 dk önce', warnings: [] },
    yandex: { status: 'verified', lastSync: '15 dk önce', warnings: [] }
  },
  {
    id: 2,
    storeCode: 'DY_002',
    name: 'İstanbul - Beşiktaş',
    address: 'Sinanpaşa Mah. Ortabahçe Cad. No:8',
    phone: '',
    email: 'besiktas@doyuyo.com',
    imageUrl: '',
    website: '',
    workingHours: '10:00 - 21:00',
    description: '',
    storeSet: 'AVM',
    google: { status: 'verified', lastSync: '1 saat önce', warnings: [{ type: 'phone_missing', label: 'Telefon Eksik' }] },
    meta: { status: 'unverified', lastSync: '45 dk önce', warnings: [] },
    apple: { status: 'action_required', lastSync: '2 saat önce', warnings: [{ type: 'image_missing', label: 'Görsel Eksik' }] },
    yandex: { status: 'verified', lastSync: '3 saat önce', warnings: [{ type: 'phone_missing', label: 'Telefon Eksik' }] }
  },
  {
    id: 3,
    storeCode: 'DY_076',
    name: 'Ankara - Çankaya',
    address: 'Kızılay Mah. Atatürk Blv. No:45',
    phone: '+90 312 555 0076',
    email: '',
    imageUrl: '',
    website: 'https://doyuyo.com/cankaya',
    workingHours: '',
    description: 'Ankara merkezde hizmet veren şubemiz.',
    storeSet: 'Cadde',
    google: { status: 'action_required', lastSync: '3 saat önce', warnings: [
      { type: 'sync_error', label: 'Koordinat Eksik', errorCode: 'missing_coordinates', platform: 'google', errorLog: 'Error: Missing coordinates\nTimestamp: 2026-01-12T14:32:00Z\nAPI Response: 400 Bad Request\nDetails: Latitude and longitude are required for listing.' },
      { type: 'email_missing', label: 'Email Eksik' },
      { type: 'image_missing', label: 'Görsel Eksik' }
    ]},
    meta: { status: 'fully_passive', lastSync: null, warnings: [] },
    apple: { status: 'unverified', lastSync: '1 gün önce', warnings: [] },
    yandex: { status: 'verified', lastSync: null, warnings: [] }
  },
  {
    id: 4,
    storeCode: 'DY_004',
    name: 'İzmir - Alsancak',
    address: 'Alsancak Mah. Kıbrıs Şehitleri Cad. No:22',
    phone: '+90 232 555 0004',
    email: 'alsancak@doyuyo.com',
    imageUrl: 'https://example.com/alsancak.jpg',
    website: 'https://doyuyo.com/alsancak',
    workingHours: '08:00 - 23:00',
    description: 'Alsancak kordon üzerinde bulunan şubemiz.',
    storeSet: 'Express',
    google: { status: 'verified', lastSync: '15 dk önce', warnings: [] },
    meta: { status: 'verified', lastSync: '1 gün önce', warnings: [
      { type: 'sync_error', label: 'Bağlantı Kesildi', errorCode: 'auth_expired', platform: 'meta', errorLog: 'Error: API Token expired\nTimestamp: 2026-01-11T09:15:00Z\nAPI Response: 401 Unauthorized\nDetails: The OAuth token has expired. Please re-authenticate.' }
    ]},
    apple: { status: 'temporarily_passive', lastSync: null, warnings: [] },
    yandex: { status: 'verified', lastSync: '30 dk önce', warnings: [] }
  },
  {
    id: 5,
    storeCode: 'DY_005',
    name: 'Bursa - Nilüfer',
    address: 'Özlüce Mah. Mudanya Cad. No:100',
    phone: '+90 224 555 0005',
    email: 'nilufer@doyuyo.com',
    imageUrl: 'https://example.com/nilufer.jpg',
    website: 'https://doyuyo.com/nilufer',
    workingHours: '09:00 - 21:00',
    description: 'Bursa Nilüfer ilçesinde hizmet veren şubemiz.',
    storeSet: 'AVM',
    google: { status: 'fully_passive', lastSync: null, warnings: [] },
    meta: { status: 'fully_passive', lastSync: null, warnings: [] },
    apple: { status: 'fully_passive', lastSync: null, warnings: [] },
    yandex: { status: 'verified', lastSync: null, warnings: [] }
  },
  {
    id: 6,
    storeCode: 'DY_006',
    name: 'Antalya - Muratpaşa',
    address: 'Konyaaltı Cad. No:55',
    phone: '',
    email: '',
    imageUrl: '',
    website: '',
    workingHours: '',
    description: '',
    storeSet: 'Express',
    google: { status: 'unverified', lastSync: '30 dk önce', warnings: [{ type: 'address_error', label: 'Adres Hatalı' }] },
    meta: { status: 'verified', lastSync: '20 dk önce', warnings: [
      { type: 'sync_error', label: 'Saat Formatı Hatalı', errorCode: 'validation_error', platform: 'meta', errorLog: 'Error: Invalid working hours format\nTimestamp: 2026-01-12T10:45:00Z\nAPI Response: 400 Bad Request\nDetails: Working hours must be in HH:MM - HH:MM format.' },
      { type: 'phone_missing', label: 'Telefon Eksik' },
      { type: 'email_missing', label: 'Email Eksik' },
      { type: 'image_missing', label: 'Görsel Eksik' }
    ]},
    apple: { status: 'verified', lastSync: '1 saat önce', warnings: [] },
    yandex: { status: 'verified', lastSync: '2 saat önce', warnings: [{ type: 'address_error', label: 'Adres Hatalı' }] }
  }
];

type PlatformKey = 'google' | 'meta' | 'apple' | 'yandex';
type ErrorTypeFilter = 'all' | 'sync_error' | 'content_error';

const getWarningIcon = (type: WarningType) => {
  switch (type) {
    case 'phone_missing': return <Phone className="w-3 h-3" />;
    case 'email_missing': return <Mail className="w-3 h-3" />;
    case 'address_error': return <MapPin className="w-3 h-3" />;
    case 'image_missing': return <Image className="w-3 h-3" />;
    case 'sync_error': return <AlertTriangle className="w-3 h-3" />;
  }
};

const getWarningColor = (type: WarningType) => {
  if (type === 'sync_error') return 'bg-red-100 text-red-700 border-red-200';
  return 'bg-yellow-100 text-yellow-700 border-yellow-200';
};

const getStatusConfig = (status: PlatformStatusType) => {
  switch (status) {
    case 'verified':
      return {
        icon: <ShieldCheck className="w-4 h-4" />,
        label: 'Verified',
        color: 'text-green-600'
      };
    case 'unverified':
      return {
        icon: <ShieldAlert className="w-4 h-4" />,
        label: 'Unverified',
        color: 'text-orange-500'
      };
    case 'action_required':
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Aksiyon Gerekli',
        color: 'text-amber-600'
      };
    case 'fully_passive':
      return {
        icon: <XCircle className="w-4 h-4" />,
        label: 'Tamamen Kapalı',
        color: 'text-gray-400'
      };
    case 'temporarily_passive':
      return {
        icon: <PauseCircle className="w-4 h-4" />,
        label: 'Geçici Kapalı',
        color: 'text-gray-500'
      };
  }
};

const getFieldConfig = (warningType: WarningType) => {
  switch (warningType) {
    case 'phone_missing':
      return { label: 'Telefon', placeholder: '+90 5XX XXX XX XX', icon: <Phone className="w-4 h-4" />, type: 'tel' };
    case 'email_missing':
      return { label: 'Email', placeholder: 'magaza@example.com', icon: <Mail className="w-4 h-4" />, type: 'email' };
    case 'address_error':
      return { label: 'Adres', placeholder: 'Mahalle, Cadde, No', icon: <MapPin className="w-4 h-4" />, type: 'text' };
    case 'image_missing':
      return { label: 'Görsel URL', placeholder: 'https://...', icon: <Image className="w-4 h-4" />, type: 'url' };
    default:
      return null;
  }
};

const calculateDataHealth = (location: LocationData): number => {
  const fields = [
    location.phone,
    location.email,
    location.address,
    location.imageUrl,
    location.website,
    location.workingHours,
    location.description
  ];
  const filledFields = fields.filter(f => f && f.trim() !== '').length;
  return Math.round((filledFields / fields.length) * 100);
};

const allFieldsInfo: MissingFieldInfo[] = [
  { key: 'phone', label: 'Telefon Numarası', placeholder: '+90 5XX XXX XX XX', type: 'tel', icon: <Phone className="w-4 h-4" /> },
  { key: 'email', label: 'Email Adresi', placeholder: 'magaza@example.com', type: 'email', icon: <Mail className="w-4 h-4" /> },
  { key: 'address', label: 'Adres', placeholder: 'Mahalle, Cadde, No', type: 'text', icon: <MapPin className="w-4 h-4" /> },
  { key: 'imageUrl', label: 'Logo / Görsel', placeholder: 'https://example.com/logo.png', type: 'url', icon: <Image className="w-4 h-4" /> },
  { key: 'website', label: 'Website', placeholder: 'https://example.com', type: 'url', icon: <ExternalLink className="w-4 h-4" /> },
  { key: 'workingHours', label: 'Çalışma Saatleri', placeholder: '09:00 - 22:00', type: 'text', icon: <Clock className="w-4 h-4" /> },
  { key: 'description', label: 'Açıklama', placeholder: 'Mağazanız hakkında kısa bir açıklama...', type: 'textarea', icon: <Layers className="w-4 h-4" /> }
];

const getMissingFields = (location: LocationData): MissingFieldInfo[] => {
  return allFieldsInfo.filter(field => {
    const value = location[field.key];
    return !value || value.trim() === '';
  });
};

const getFilledFields = (location: LocationData): MissingFieldInfo[] => {
  return allFieldsInfo.filter(field => {
    const value = location[field.key];
    return value && value.trim() !== '';
  });
};

function DataHealthBar({ 
  percentage, 
  onClick 
}: { 
  percentage: number; 
  onClick?: () => void;
}) {
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isClickable = percentage < 100 && onClick;

  return (
    <button 
      onClick={onClick}
      disabled={!isClickable}
      className={`flex items-center gap-2 mt-1.5 w-full text-left ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'}`}
    >
      <span className="text-[10px] text-gray-400">Data Quality</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
        <div 
          className={`h-full rounded-full transition-all ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-[10px] font-medium ${isClickable ? 'text-blue-600 underline underline-offset-2' : 'text-gray-500'}`}>
        {percentage}%
      </span>
    </button>
  );
}

function FilterToolbar({ 
  filters,
  setFilters,
  storeSets,
  resultCount,
  totalCount
}: { 
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  storeSets: string[];
  resultCount: number;
  totalCount: number;
}) {
  const hasActiveFilters = filters.search !== '' || filters.platform !== 'all' || filters.errorType !== 'all' || filters.storeSet !== 'all';

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters({ ...filters, [key]: value });
  };

  const getStoreSetLabel = () => {
    if (filters.storeSet === 'all') return 'Grup';
    return filters.storeSet;
  };

  const getPlatformLabel = () => {
    if (filters.platform === 'all') return 'Platform';
    const labels: Record<string, string> = { google: 'Google', meta: 'Meta', apple: 'Apple', yandex: 'Yandex' };
    return labels[filters.platform] || 'Platform';
  };

  const getStatusLabel = () => {
    if (filters.errorType === 'all') return 'Durum';
    if (filters.errorType === 'sync_error') return 'Sync Hataları';
    return 'İçerik Eksikleri';
  };

  return (
    <div className="flex flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-b border-gray-200">
      <div className="relative flex-1 min-w-[200px] max-w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Store ID veya isim ara..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <div className="flex items-center gap-3">
        <Select value={filters.storeSet} onValueChange={(v) => updateFilter('storeSet', v)} displayLabel={getStoreSetLabel()} width={150}>
          <SelectContent>
            <SelectItem value="all">Tüm Gruplar</SelectItem>
            {storeSets.map((set) => (
              <SelectItem key={set} value={set}>{set}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.platform} onValueChange={(v) => updateFilter('platform', v as PlatformKey | 'all')} displayLabel={getPlatformLabel()} width={150}>
          <SelectContent>
            <SelectItem value="all">Tüm Platformlar</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="meta">Meta</SelectItem>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="yandex">Yandex</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.errorType} onValueChange={(v) => updateFilter('errorType', v as ErrorTypeFilter)} displayLabel={getStatusLabel()} width={150}>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="sync_error">Sync Hataları</SelectItem>
            <SelectItem value="content_error">İçerik Eksikleri</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 px-3 text-gray-500"
            onClick={() => setFilters(initialFilters)}
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Temizle
          </Button>
        )}

        <div className="text-xs text-gray-500 whitespace-nowrap">
          {hasActiveFilters ? (
            <span>{resultCount} / {totalCount}</span>
          ) : (
            <span>{totalCount} lokasyon</span>
          )}
        </div>
      </div>
    </div>
  );
}

function LocationEditSheet({ 
  open, 
  onClose, 
  location 
}: { 
  open: boolean; 
  onClose: () => void; 
  location: LocationData | null;
}) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    workingHours: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        address: location.address,
        phone: location.phone,
        email: location.email,
        website: location.website,
        workingHours: location.workingHours,
        description: location.description,
        imageUrl: location.imageUrl
      });
    }
  }, [location]);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && location) {
      setFormData({
        name: location.name,
        address: location.address,
        phone: location.phone,
        email: location.email,
        website: location.website,
        workingHours: location.workingHours,
        description: location.description,
        imageUrl: location.imageUrl
      });
    }
    if (!isOpen) {
      onClose();
    }
  };

  if (!location) return null;

  const dataHealth = calculateDataHealth(location);

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent className="w-[400px] sm:w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            POI Veri Yönetimi
          </SheetTitle>
          <SheetDescription className="flex items-center justify-between">
            <span>{location.name} <span className="text-gray-400">#{location.storeCode}</span></span>
            <span className={`text-xs font-medium ${dataHealth >= 80 ? 'text-green-600' : dataHealth >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              Veri Doluluk: {dataHealth}%
            </span>
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Lokasyon Adı</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Şube adı"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-gray-500" />
              Adres
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Mahalle, Cadde, No, İlçe/İl"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4 text-gray-500" />
                Telefon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+90 5XX XXX XX XX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4 text-gray-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="magaza@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2 text-sm font-medium">
              <ExternalLink className="w-4 h-4 text-gray-500" />
              Website
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workingHours" className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-gray-500" />
              Çalışma Saatleri
            </Label>
            <Input
              id="workingHours"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              placeholder="09:00 - 22:00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Şube hakkında kısa bilgi..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2 text-sm font-medium">
              <Image className="w-4 h-4 text-gray-500" />
              Görsel
            </Label>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button className="gap-1.5" onClick={onClose}>
              <Save className="w-4 h-4" />
              Kaydet ve Sync
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InlineFieldEditorPopover({ 
  warning, 
  location, 
  cellKey,
  idx 
}: { 
  warning: LocationWarning; 
  location: LocationData; 
  cellKey: string;
  idx: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  
  const fieldConfig = getFieldConfig(warning.type);
  if (!fieldConfig) return null;

  const getCurrentValue = () => {
    switch (warning.type) {
      case 'phone_missing': return location.phone;
      case 'email_missing': return location.email;
      case 'address_error': return location.address;
      case 'image_missing': return location.imageUrl;
      default: return '';
    }
  };

  const handleOpen = (open: boolean) => {
    if (open) {
      setValue(getCurrentValue());
    }
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <span 
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${getWarningColor(warning.type)}`}
        >
          {getWarningIcon(warning.type)}
          {warning.label}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start" side="right" sideOffset={8}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="p-1.5 bg-gray-100 rounded">
              {fieldConfig.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">{location.name}</p>
              <p className="text-[10px] text-gray-500">#{location.storeCode}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">{fieldConfig.label}</label>
            <div className="flex gap-2">
              <Input
                type={fieldConfig.type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={fieldConfig.placeholder}
                className="h-8 text-sm"
              />
              {warning.type === 'image_missing' && (
                <Button variant="outline" size="sm" className="h-8 px-2">
                  <Upload className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1 h-8 gap-1.5 text-xs" onClick={() => setIsOpen(false)}>
              <Save className="w-3 h-3" />
              Kaydet
            </Button>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Link href="/locations">
              <Button variant="ghost" size="sm" className="w-full h-8 gap-1.5 text-xs text-gray-600">
                <Layers className="w-3.5 h-3.5" />
                Toplu İşlemler
              </Button>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SyncErrorBubble({ 
  warning, 
  onErrorClick 
}: { 
  warning: LocationWarning; 
  onErrorClick: () => void;
}) {
  return (
    <span 
      onClick={onErrorClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${getWarningColor(warning.type)}`}
    >
      {getWarningIcon(warning.type)}
      {warning.label}
    </span>
  );
}

function SmartFixSheet({ 
  open, 
  onClose, 
  warning, 
  location 
}: { 
  open: boolean; 
  onClose: () => void; 
  warning: LocationWarning | null; 
  location: LocationData | null;
}) {
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [workingHours, setWorkingHours] = useState('');

  useEffect(() => {
    if (open && location) {
      setCoordinates({ lat: '', lng: '' });
      setWorkingHours(location.workingHours || '');
    }
  }, [open, location, warning]);

  if (!warning || !location) return null;

  const errorCode = warning.errorCode || 'unknown';
  const platform = warning.platform;

  const getPlatformIcon = () => {
    switch (platform) {
      case 'google': return <SiGoogle className="w-5 h-5" />;
      case 'meta': return <SiMeta className="w-5 h-5" />;
      case 'apple': return <SiApple className="w-5 h-5" />;
      case 'yandex': return <span className="text-red-500 font-bold text-lg">Я</span>;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'google': return 'Google';
      case 'meta': return 'Meta';
      case 'apple': return 'Apple';
      case 'yandex': return 'Yandex';
      default: return 'Platform';
    }
  };

  const getErrorTitle = () => {
    switch (errorCode) {
      case 'auth_expired': return 'Hesap Bağlantısı Kesildi';
      case 'missing_coordinates': return 'Koordinat Eksik';
      case 'validation_error': return 'Format Hatası';
      case 'rate_limit': return 'API Limiti Aşıldı';
      default: return 'Sync Hatası';
    }
  };

  const getErrorDescription = () => {
    switch (errorCode) {
      case 'auth_expired': 
        return `${getPlatformName()} hesabınızla bağlantı kesildi. Listelenmeye devam etmek için tekrar bağlanmanız gerekiyor.`;
      case 'missing_coordinates': 
        return 'Bu lokasyonun koordinat bilgisi eksik. Haritada listelenebilmesi için enlem ve boylam bilgisi gerekli.';
      case 'validation_error': 
        return 'Gönderilen veri formatı platforma uygun değil. Lütfen aşağıdaki alanı düzeltin.';
      case 'rate_limit': 
        return 'API istek limiti aşıldı. Birkaç dakika sonra otomatik olarak tekrar denenecek.';
      default: 
        return 'Senkronizasyon sırasında bir hata oluştu.';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${errorCode === 'auth_expired' ? 'bg-orange-100 text-orange-600' : errorCode === 'missing_coordinates' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
              {getPlatformIcon()}
            </div>
            <div>
              <span className="text-base">{getErrorTitle()}</span>
              <p className="text-xs font-normal text-gray-500 mt-0.5">{getPlatformName()}</p>
            </div>
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 pt-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span>{location.name}</span>
            <span className="text-gray-400">#{location.storeCode}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">{getErrorDescription()}</p>
          </div>

          {errorCode === 'auth_expired' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Link2 className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">Yeniden Bağlanma Gerekli</p>
                  <p className="text-xs text-orange-600 mt-0.5">OAuth tokenı süresi dolmuş</p>
                </div>
              </div>
              <Button className="w-full gap-2" size="lg">
                {getPlatformIcon()}
                {getPlatformName()} ile Yeniden Bağlan
              </Button>
            </div>
          )}

          {errorCode === 'missing_coordinates' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Adres</span>
                </div>
                <p className="text-sm text-blue-700">{location.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lat" className="text-sm font-medium">Enlem (Latitude)</Label>
                  <Input
                    id="lat"
                    value={coordinates.lat}
                    onChange={(e) => setCoordinates({ ...coordinates, lat: e.target.value })}
                    placeholder="41.0082"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng" className="text-sm font-medium">Boylam (Longitude)</Label>
                  <Input
                    id="lng"
                    value={coordinates.lng}
                    onChange={(e) => setCoordinates({ ...coordinates, lng: e.target.value })}
                    placeholder="28.9784"
                  />
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2">
                <MapPin className="w-4 h-4" />
                Adresten Koordinat Al
              </Button>

              <Button className="w-full gap-2" size="lg">
                <Save className="w-4 h-4" />
                Kaydet ve Sync
              </Button>
            </div>
          )}

          {errorCode === 'validation_error' && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Beklenen Format</span>
                </div>
                <code className="text-xs bg-yellow-100 px-2 py-1 rounded text-yellow-800">HH:MM - HH:MM</code>
                <p className="text-xs text-yellow-600 mt-2">Örnek: 09:00 - 22:00</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours" className="text-sm font-medium">Çalışma Saatleri</Label>
                <Input
                  id="workingHours"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="09:00 - 22:00"
                />
              </div>

              <Button className="w-full gap-2" size="lg">
                <Save className="w-4 h-4" />
                Düzelt ve Sync
              </Button>
            </div>
          )}

          {errorCode === 'rate_limit' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                <div className="p-2 bg-gray-200 rounded-full">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Bekleme Süresi</p>
                  <p className="text-xs text-gray-500 mt-0.5">~60 saniye sonra otomatik retry</p>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Şimdi Tekrar Dene
              </Button>
            </div>
          )}

          {errorCode === 'unknown' && (
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                  <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                  Hata Detayını Göster
                </summary>
                <div className="mt-3 bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {warning.errorLog || 'Hata detayı bulunamadı.'}
                </div>
              </details>
              <Button className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Tekrar Dene
              </Button>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button variant="ghost" className="w-full text-gray-500" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DataQualitySheet({
  open,
  onClose,
  location
}: {
  open: boolean;
  onClose: () => void;
  location: LocationData | null;
}) {
  const [editingField, setEditingField] = useState<MissingFieldKey | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<MissingFieldKey, string>>({
    phone: '', email: '', address: '', imageUrl: '', website: '', workingHours: '', description: ''
  });
  const [savedFields, setSavedFields] = useState<Set<MissingFieldKey>>(new Set());

  useEffect(() => {
    if (open && location) {
      setFieldValues({
        phone: location.phone || '',
        email: location.email || '',
        address: location.address || '',
        imageUrl: location.imageUrl || '',
        website: location.website || '',
        workingHours: location.workingHours || '',
        description: location.description || ''
      });
      setEditingField(null);
      setSavedFields(new Set());
    }
  }, [open, location]);

  if (!location) return null;

  const missingFields = getMissingFields(location);
  const filledFields = getFilledFields(location);
  const totalFields = allFieldsInfo.length;
  const completedCount = filledFields.length + savedFields.size;
  const progressPercent = Math.round((completedCount / totalFields) * 100);

  const handleSave = (fieldKey: MissingFieldKey) => {
    const newSavedFields = new Set(savedFields);
    if (fieldValues[fieldKey].trim() !== '') {
      newSavedFields.add(fieldKey);
    } else {
      newSavedFields.delete(fieldKey);
    }
    setSavedFields(newSavedFields);
    setEditingField(null);
  };

  const isFieldComplete = (field: MissingFieldInfo) => {
    return savedFields.has(field.key) || (location[field.key] && location[field.key].trim() !== '');
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[440px] sm:max-w-[440px] overflow-y-auto">
        <SheetHeader className="space-y-3 mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Veri Tamamlama
          </SheetTitle>
          <SheetDescription>
            {location.name} için eksik bilgileri tamamlayın
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Tamamlanma Oranı</span>
              <span className={`text-lg font-bold ${progressPercent >= 100 ? 'text-green-600' : progressPercent >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                %{progressPercent}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${progressPercent >= 100 ? 'bg-green-500' : progressPercent >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{completedCount}/{totalFields} alan tamamlandı</p>
          </div>

          {missingFields.filter(f => !savedFields.has(f.key)).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Eksik Alanlar ({missingFields.filter(f => !savedFields.has(f.key)).length})
              </h3>
              <div className="space-y-2">
                {missingFields.filter(f => !savedFields.has(f.key)).map((field) => (
                  <div key={field.key} className="border border-amber-200 bg-amber-50 rounded-lg overflow-hidden">
                    {editingField === field.key ? (
                      <div className="p-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-600">{field.icon}</span>
                          <Label className="text-sm font-medium text-amber-800">{field.label}</Label>
                        </div>
                        {field.type === 'textarea' ? (
                          <Textarea
                            value={fieldValues[field.key]}
                            onChange={(e) => setFieldValues({ ...fieldValues, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            rows={3}
                            className="bg-white"
                          />
                        ) : (
                          <Input
                            type={field.type}
                            value={fieldValues[field.key]}
                            onChange={(e) => setFieldValues({ ...fieldValues, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            className="bg-white"
                          />
                        )}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 gap-1.5"
                            onClick={() => handleSave(field.key)}
                            disabled={!fieldValues[field.key].trim()}
                          >
                            <Save className="w-3.5 h-3.5" />
                            Kaydet & Sync Et
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setEditingField(null)}
                          >
                            İptal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingField(field.key)}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-amber-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-amber-600">{field.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-amber-800">{field.label}</p>
                            <p className="text-xs text-amber-600">Tamamlamak için tıkla</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-amber-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(filledFields.length > 0 || savedFields.size > 0) && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Tamamlanan Alanlar ({completedCount})
              </h3>
              <div className="space-y-2">
                {allFieldsInfo.filter(f => isFieldComplete(f)).map((field) => (
                  <div key={field.key} className="border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-green-600">{field.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-green-800">{field.label}</p>
                          <p className="text-xs text-green-600 truncate max-w-[240px]">
                            {savedFields.has(field.key) ? fieldValues[field.key] : location[field.key]}
                          </p>
                        </div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {progressPercent >= 100 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800">Tebrikler!</p>
              <p className="text-xs text-green-600 mt-1">Tüm alanlar tamamlandı. Veriler platformlara sync edilecek.</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button variant="ghost" className="w-full text-gray-500" onClick={onClose}>
              Kapat
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BulkActionBar({ selectedCount, onClear }: { selectedCount: number; onClear: () => void }) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4">
      <span className="text-sm font-medium">{selectedCount} lokasyon seçildi</span>
      <div className="h-4 w-px bg-gray-600" />
      <Button size="sm" variant="secondary" className="gap-1.5 h-8">
        <RefreshCw className="w-3.5 h-3.5" />
        Retry Sync
      </Button>
      <Button size="sm" variant="secondary" className="gap-1.5 h-8">
        <Download className="w-3.5 h-3.5" />
        Export
      </Button>
      <Button size="sm" variant="ghost" className="h-8 text-gray-400 hover:text-white" onClick={onClear}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

function StatusLegend() {
  const statuses: PlatformStatusType[] = ['verified', 'unverified', 'action_required', 'fully_passive', 'temporarily_passive'];
  
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-xs font-medium text-gray-500 uppercase">Durumlar:</span>
      {statuses.map((status) => {
        const config = getStatusConfig(status);
        return (
          <div key={status} className={`flex items-center gap-1.5 ${config.color}`}>
            {config.icon}
            <span className="text-xs font-medium">{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ActionsMenu({ location, platform }: { location: LocationData; platform: PlatformData }) {
  const isPassive = platform.status === 'fully_passive' || platform.status === 'temporarily_passive';
  const isUnverified = platform.status === 'unverified';
  const hasSyncError = platform.warnings.some(w => w.type === 'sync_error');
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {!isPassive && (
          <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Now
          </DropdownMenuItem>
        )}
        {hasSyncError && (
          <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Sync
          </DropdownMenuItem>
        )}
        {isUnverified && (
          <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
            <Link2 className="w-3.5 h-3.5" />
            Connect
          </DropdownMenuItem>
        )}
        {isPassive && (
          <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
            <Link2 className="w-3.5 h-3.5" />
            Activate
          </DropdownMenuItem>
        )}
        {!isPassive && (
          <DropdownMenuItem className="gap-2 text-xs cursor-pointer text-gray-500">
            <Unlink className="w-3.5 h-3.5" />
            Deactivate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function LocationStatusTable() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [smartFixSheet, setSmartFixSheet] = useState<{ open: boolean; warning: LocationWarning | null; location: LocationData | null }>({
    open: false,
    warning: null,
    location: null
  });
  const [editSheet, setEditSheet] = useState<{ open: boolean; location: LocationData | null }>({
    open: false,
    location: null
  });
  const [dataQualitySheet, setDataQualitySheet] = useState<{ open: boolean; location: LocationData | null }>({
    open: false,
    location: null
  });

  const uniqueStoreSets = useMemo(() => {
    const sets = new Set(mockLocations.map(l => l.storeSet));
    return Array.from(sets).sort();
  }, []);

  const filteredLocations = useMemo(() => {
    return mockLocations.filter(location => {
      const searchMatch = filters.search === '' || 
        location.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        location.storeCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        location.address.toLowerCase().includes(filters.search.toLowerCase());

      const platformMatch = filters.platform === 'all' || (() => {
        const platformData = location[filters.platform];
        return platformData.status !== 'verified' || platformData.warnings.length > 0;
      })();

      const errorTypeMatch = filters.errorType === 'all' || (() => {
        const allWarnings = [
          ...location.google.warnings,
          ...location.meta.warnings,
          ...location.apple.warnings,
          ...location.yandex.warnings
        ];
        if (filters.errorType === 'sync_error') {
          return allWarnings.some(w => w.type === 'sync_error');
        } else if (filters.errorType === 'content_error') {
          return allWarnings.some(w => w.type !== 'sync_error');
        }
        return true;
      })();

      const storeSetMatch = filters.storeSet === 'all' || location.storeSet === filters.storeSet;

      return searchMatch && platformMatch && errorTypeMatch && storeSetMatch;
    });
  }, [filters]);

  const handleSyncErrorClick = (warning: LocationWarning, location: LocationData) => {
    setSmartFixSheet({ open: true, warning, location });
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLocations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLocations.map(l => l.id)));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <FilterToolbar
        filters={filters}
        setFilters={setFilters}
        storeSets={uniqueStoreSets}
        resultCount={filteredLocations.length}
        totalCount={mockLocations.length}
      />

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <StatusLegend />
        <Link href="/locations">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            Lokasyon Listesine Git
          </Button>
        </Link>
      </div>
      
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-center px-3 py-3 w-10">
              <Checkbox
                checked={selectedIds.size === filteredLocations.length && filteredLocations.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Lokasyon</th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">
              <div className="flex items-center justify-center gap-1.5">
                <SiGoogle className="w-3.5 h-3.5" />
                Google
              </div>
            </th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">
              <div className="flex items-center justify-center gap-1.5">
                <SiMeta className="w-3.5 h-3.5" />
                Meta
              </div>
            </th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">
              <div className="flex items-center justify-center gap-1.5">
                <SiApple className="w-3.5 h-3.5" />
                Apple
              </div>
            </th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-red-500 font-bold text-sm">Я</span>
                Yandex
              </div>
            </th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredLocations.map((location) => {
            const dataHealth = calculateDataHealth(location);
            return (
              <tr key={location.id} className={`hover:bg-blue-50/50 transition-colors ${selectedIds.has(location.id) ? 'bg-blue-50' : ''}`}>
                <td className="text-center px-3 py-4">
                  <Checkbox
                    checked={selectedIds.has(location.id)}
                    onChange={() => toggleSelect(location.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <button 
                    onClick={() => setEditSheet({ open: true, location })}
                    className="text-left hover:bg-gray-50 rounded-md p-1 -m-1 transition-colors group"
                  >
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{location.name}</p>
                    <p className="text-xs text-gray-500">{location.address}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">#{location.storeCode}</p>
                  </button>
                  <DataHealthBar 
                    percentage={dataHealth} 
                    onClick={() => setDataQualitySheet({ open: true, location })}
                  />
                </td>
                <td className="px-4 py-4">
                  <PlatformCell 
                    platform={location.google} 
                    location={location}
                    cellKey={`${location.id}-google`}
                    onSyncErrorClick={(warning) => handleSyncErrorClick(warning, location)}
                  />
                </td>
                <td className="px-4 py-4">
                  <PlatformCell 
                    platform={location.meta} 
                    location={location}
                    cellKey={`${location.id}-meta`}
                    onSyncErrorClick={(warning) => handleSyncErrorClick(warning, location)}
                  />
                </td>
                <td className="px-4 py-4">
                  <PlatformCell 
                    platform={location.apple} 
                    location={location}
                    cellKey={`${location.id}-apple`}
                    onSyncErrorClick={(warning) => handleSyncErrorClick(warning, location)}
                  />
                </td>
                <td className="px-4 py-4">
                  <PlatformCell 
                    platform={location.yandex} 
                    location={location}
                    cellKey={`${location.id}-yandex`} 
                    showStatusLabel={false}
                    onSyncErrorClick={(warning) => handleSyncErrorClick(warning, location)}
                  />
                </td>
                <td className="px-4 py-4">
                  <ActionsMenu location={location} platform={location.google} />
                </td>
              </tr>
            );
          })}
          {filteredLocations.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center">
                <div className="text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Filtrelerle eşleşen lokasyon bulunamadı</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      <SmartFixSheet
        open={smartFixSheet.open}
        onClose={() => setSmartFixSheet({ ...smartFixSheet, open: false })}
        warning={smartFixSheet.warning}
        location={smartFixSheet.location}
      />

      <LocationEditSheet
        open={editSheet.open}
        onClose={() => setEditSheet({ open: false, location: null })}
        location={editSheet.location}
      />

      <DataQualitySheet
        open={dataQualitySheet.open}
        onClose={() => setDataQualitySheet({ open: false, location: null })}
        location={dataQualitySheet.location}
      />

      <BulkActionBar 
        selectedCount={selectedIds.size} 
        onClear={() => setSelectedIds(new Set())} 
      />
    </div>
  );
}

function PlatformCell({ 
  platform, 
  location,
  cellKey, 
  showStatusLabel = true, 
  onSyncErrorClick 
}: { 
  platform: PlatformData; 
  location: LocationData;
  cellKey: string; 
  showStatusLabel?: boolean; 
  onSyncErrorClick?: (warning: LocationWarning) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const statusConfig = getStatusConfig(platform.status);
  const isPassive = platform.status === 'fully_passive' || platform.status === 'temporarily_passive';

  if (isPassive) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className={`flex items-center gap-1.5 ${statusConfig.color}`}>
          {statusConfig.icon}
          <span className="text-xs font-medium">{statusConfig.label}</span>
        </div>
        <span className="text-[10px] text-gray-400">Henüz sync yok</span>
      </div>
    );
  }

  const syncErrors = platform.warnings.filter(w => w.type === 'sync_error');

  const hasSyncErrors = syncErrors.length > 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        {showStatusLabel && (
          <div className={`flex items-center gap-1 ${statusConfig.color}`}>
            {statusConfig.icon}
            <span className="text-xs font-medium">{statusConfig.label}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{platform.lastSync || 'Bilgi yok'}</span>
        </div>
      </div>

      {hasSyncErrors && (
        <div className="flex flex-wrap justify-center gap-1">
          {syncErrors.slice(0, 2).map((warning, idx) => (
            <SyncErrorBubble 
              key={`${cellKey}-${idx}`}
              warning={warning}
              onErrorClick={() => onSyncErrorClick?.(warning)}
            />
          ))}
          {syncErrors.length > 2 && (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium rounded-full border bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {isOpen ? 'Kapat' : `+${syncErrors.length - 2}`}
                  <ChevronRight className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start" side="right" sideOffset={8}>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-gray-500 font-medium mb-1">Sync Hataları ({syncErrors.length})</span>
                  {syncErrors.map((warning, idx) => (
                    <SyncErrorBubble 
                      key={`${cellKey}-all-${idx}`}
                      warning={warning}
                      onErrorClick={() => onSyncErrorClick?.(warning)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}
    </div>
  );
}
