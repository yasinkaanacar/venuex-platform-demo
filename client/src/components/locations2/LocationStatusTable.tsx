import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Link } from 'wouter';
import { SiGoogle, SiMeta, SiApple } from 'react-icons/si';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2, Phone, Mail, MapPin, Image, ShieldCheck, ShieldAlert, XCircle, PauseCircle, ChevronRight, MoreHorizontal, RefreshCw, Link2, Unlink, ExternalLink, Download, X, Save, Upload, Layers, Search, Filter, Building2, Ban, Unplug, Clock3, Trash2, XOctagon, Plus, Pencil, Info, Edit } from 'lucide-react';
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
import {
  mockLocations,
  LocationData,
  PlatformData,
  WarningType,
  SyncErrorCode,
  MissingFieldKey,
  MissingFieldInfo,
  LocationWarning,
  PlatformStatusType,
  BusinessStatus,
  PlatformKey,
  calculateDataHealth,
  allFieldsInfo
} from '@/lib/mock-locations';



interface FilterState {
  search: string;
  platform: PlatformKey | 'all';
  storeSet: string;
  showProblemsOnly: boolean;
  businessStatus: BusinessStatus | 'all';
}

const initialFilters: FilterState = {
  search: '',
  platform: 'all',
  storeSet: 'all',
  showProblemsOnly: false,
  businessStatus: 'all'
};

// ========== API STATUS MAPPING TYPES ==========

interface GoogleLocationState {
  isPublished: boolean;
  isDisabled: boolean;
  isDisconnected: boolean;
  isDuplicate: boolean;
  hasPendingEdits: boolean;
  isVerified: boolean;
}

type AppleStatusEnum = 'PUBLISHED' | 'PENDING_REVIEW' | 'REJECTED' | 'SUSPENDED' | 'DELETED' | 'NEEDS_VERIFICATION';

interface MetaPageState {
  is_published: boolean;
  has_added_app: boolean;
  verification_status?: 'verified' | 'not_verified';
  error_code?: number; // Error 4/17 for rate limiting
}

interface StatusMappingResult {
  status: PlatformStatusType;
  reasonCode: string;
  message: string;
}

// ========== API STATUS MAPPING HELPERS ==========

// Google: PM Priority Order - isDisabled > isDuplicate > isDisconnected > !isVerified > hasPendingEdits > isPublished
const mapGoogleLocationState = (state: GoogleLocationState): StatusMappingResult => {
  if (state.isDisabled) {
    return { status: 'suspended', reasonCode: 'disabled', message: 'Google tarafından askıya alındı' };
  }
  if (state.isDuplicate) {
    return { status: 'rejected', reasonCode: 'duplicate', message: 'Kopya lokasyon tespit edildi' };
  }
  if (state.isDisconnected) {
    return { status: 'action_required', reasonCode: 'disconnected', message: 'Hesap bağlantısı koptu' };
  }
  if (!state.isVerified) {
    return { status: 'pending', reasonCode: 'unverified', message: 'Doğrulama bekliyor' };
  }
  if (state.hasPendingEdits) {
    return { status: 'pending', reasonCode: 'pending_edits', message: 'Değişiklikler inceleniyor' };
  }
  if (state.isPublished) {
    return { status: 'live', reasonCode: 'published', message: 'Yayında' };
  }
  return { status: 'pending', reasonCode: 'unknown', message: 'Durum belirlenemedi' };
};

// Apple: Direct enum mapping - REJECTED triggers validation_error in SmartFix
const mapAppleStatus = (status: AppleStatusEnum): StatusMappingResult => {
  switch (status) {
    case 'PUBLISHED':
      return { status: 'live', reasonCode: 'published', message: 'Yayında' };
    case 'PENDING_REVIEW':
      return { status: 'pending', reasonCode: 'pending_review', message: 'Apple incelemesi bekliyor (1-3 gün)' };
    case 'REJECTED':
      // REJECTED → triggers SmartFix with validation_error flow (address/category fix)
      return { status: 'rejected', reasonCode: 'validation_error', message: 'Reddedildi - düzeltme gerekli' };
    case 'SUSPENDED':
      return { status: 'suspended', reasonCode: 'suspended', message: 'Apple tarafından askıya alındı' };
    case 'DELETED':
      return { status: 'closed', reasonCode: 'deleted', message: 'Lokasyon silindi' };
    case 'NEEDS_VERIFICATION':
      return { status: 'pending', reasonCode: 'needs_verification', message: 'Sahiplik doğrulaması gerekli' };
    default:
      return { status: 'pending', reasonCode: 'unknown', message: 'Durum belirlenemedi' };
  }
};

// Meta: Priority - error_code > has_added_app > is_published
const mapMetaPageState = (state: MetaPageState): StatusMappingResult => {
  // Error 4 or 17 = Rate Limit
  if (state.error_code === 4 || state.error_code === 17) {
    return { status: 'action_required', reasonCode: 'rate_limit', message: 'API limiti aşıldı - otomatik yeniden deneniyor' };
  }
  if (!state.has_added_app) {
    return { status: 'action_required', reasonCode: 'app_revoked', message: 'VenueX erişim izni kaldırıldı' };
  }
  if (!state.is_published) {
    return { status: 'suspended', reasonCode: 'unpublished', message: 'Sayfa yayından kaldırıldı' };
  }
  return { status: 'live', reasonCode: 'published', message: 'Yayında' };
};

// ========== MOCK DATA ==========




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

// Status config now gets labels from translation context
const useStatusConfig = () => {
  const { t } = useTranslation();

  const getStatusConfig = (status: PlatformStatusType) => {
    switch (status) {
      case 'live':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          label: t.platformStatus.live,
          color: 'text-emerald-600',
          dotColor: 'bg-emerald-500'
        };
      case 'pending':
        return {
          icon: <Clock3 className="w-3.5 h-3.5" />,
          label: t.platformStatus.pending,
          color: 'text-sky-600',
          dotColor: 'bg-sky-500'
        };
      case 'action_required':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: t.platformStatus.actionRequired,
          color: 'text-amber-600',
          dotColor: 'bg-amber-500'
        };
      case 'rejected':
        return {
          icon: <XOctagon className="w-3.5 h-3.5" />,
          label: t.platformStatus.rejected,
          color: 'text-rose-600',
          dotColor: 'bg-rose-500'
        };
      case 'suspended':
        return {
          icon: <Ban className="w-3.5 h-3.5" />,
          label: t.platformStatus.suspended,
          color: 'text-red-600',
          dotColor: 'bg-red-500'
        };
      case 'closed':
        return {
          icon: <Trash2 className="w-3.5 h-3.5" />,
          label: t.platformStatus.closed,
          color: 'text-slate-500',
          dotColor: 'bg-slate-400'
        };
      case 'unclaimed':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          label: t.platformStatus.unclaimed,
          color: 'text-slate-400',
          dotColor: 'bg-slate-300'
        };
      case 'not_connected':
        return {
          icon: <Unplug className="w-3.5 h-3.5" />,
          label: t.platformStatus.notConnected,
          color: 'text-slate-400',
          dotColor: 'bg-slate-300'
        };
    }
  };

  const getBusinessStatusConfig = (status: BusinessStatus) => {
    switch (status) {
      case 'open':
        return {
          label: t.businessStatus.open,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          dotColor: 'bg-emerald-500'
        };
      case 'closed':
        return {
          label: t.businessStatus.closed,
          color: 'text-slate-500',
          bgColor: 'bg-slate-100',
          dotColor: 'bg-slate-400'
        };
      case 'temporarily_closed':
        return {
          label: t.businessStatus.temporarilyClosed,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          dotColor: 'bg-amber-500'
        };
    }
  };

  return { getStatusConfig, getBusinessStatusConfig };
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
  missingCount,
  onClick
}: {
  percentage: number;
  missingCount: number;
  onClick?: () => void;
}) {
  const { t } = useTranslation();
  const getGradient = () => {
    if (percentage >= 80) return 'from-green-400 to-green-500';
    if (percentage >= 50) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-red-500';
  };

  const getTextColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (percentage >= 100) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
    if (percentage >= 70) {
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
    return <XCircle className="w-4 h-4 text-rose-500" />;
  };

  const isClickable = percentage < 100 && onClick;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`group flex items-center gap-2 mt-2 px-2.5 py-2 -mx-2 rounded-lg w-full text-left transition-all duration-200 ${isClickable ? 'cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md active:scale-[0.98]' : 'cursor-default'}`}
    >
      {getStatusIcon()}
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[60px] shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getGradient()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-xs font-bold ${getTextColor()} tabular-nums`}>
        {percentage}%
      </span>
      {missingCount > 0 && (
        <span className="text-xs font-semibold text-rose-500">
          ({missingCount} {t.common.missing})
        </span>
      )}
      {isClickable && <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />}
    </button>
  );
}

function FilterToolbar({
  filters,
  setFilters,
  storeSets,
  resultCount,
  totalCount,
  problemCount
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  storeSets: string[];
  resultCount: number;
  totalCount: number;
  problemCount: number;
}) {
  const { t } = useTranslation();
  const hasActiveFilters = filters.search !== '' || filters.platform !== 'all' || filters.storeSet !== 'all' || filters.showProblemsOnly;

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters({ ...filters, [key]: value });
  };

  const getStoreSetLabel = () => {
    if (filters.storeSet === 'all') return t.common.group;
    return filters.storeSet;
  };

  const getPlatformLabel = () => {
    if (filters.platform === 'all') return t.common.platform;
    const labels: Record<string, string> = { google: 'Google', meta: 'Meta', apple: 'Apple', yandex: 'Yandex' };
    return labels[filters.platform] || t.common.platform;
  };

  const getBusinessStatusLabel = () => {
    if (filters.businessStatus === 'all') return t.common.status;
    const labels: Record<string, string> = {
      open: t.businessStatus.open,
      closed: t.businessStatus.closed,
      temporarily_closed: t.businessStatus.temporarilyClosed
    };
    return labels[filters.businessStatus] || t.common.status;
  };


  return (
    <div className="vx-card-header flex flex-col gap-3 px-4">
      {/* Main Filter Row */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t.common.searchPlaceholder}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="vx-input pl-9 bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={filters.storeSet} onValueChange={(v) => updateFilter('storeSet', v)} displayLabel={getStoreSetLabel()} width={150}>
            <SelectContent>
              <SelectItem value="all">{t.common.allGroups}</SelectItem>
              {storeSets.map((set) => (
                <SelectItem key={set} value={set}>{set}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.platform} onValueChange={(v) => updateFilter('platform', v as PlatformKey | 'all')} displayLabel={getPlatformLabel()} width={150}>
            <SelectContent>
              <SelectItem value="all">{t.common.allPlatforms}</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="meta">Meta</SelectItem>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="yandex">Yandex</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.businessStatus} onValueChange={(v) => updateFilter('businessStatus', v as BusinessStatus | 'all')} displayLabel={getBusinessStatusLabel()} width={130}>
            <SelectContent>
              <SelectItem value="all">{t.common.allStatuses}</SelectItem>
              <SelectItem value="open">{t.businessStatus.open}</SelectItem>
              <SelectItem value="closed">{t.businessStatus.closed}</SelectItem>
              <SelectItem value="temporarily_closed">{t.businessStatus.temporarilyClosed}</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              className="vx-button text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
              onClick={() => setFilters(initialFilters)}
            >
              <X className="w-3.5 h-3.5 mr-1" />
              {t.common.clear}
            </Button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 font-medium shadow-sm">
            <span className="text-blue-600 font-bold">{resultCount}</span>
            <span className="text-gray-400">/</span>
            <span>{totalCount}</span>
            <span className="text-gray-400 ml-0.5">{t.common.location}</span>
          </div>

          <button
            onClick={() => updateFilter('showProblemsOnly', !filters.showProblemsOnly)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-colors ${filters.showProblemsOnly
              ? 'bg-rose-600 text-white ring-2 ring-rose-300'
              : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              }`}
          >
            <AlertTriangle className="w-3 h-3" />
            {t.common.actionRequired}
            <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${filters.showProblemsOnly
              ? 'bg-white/20 text-white'
              : 'bg-rose-200 text-rose-700'
              }`}>
              {problemCount}
            </span>
            {filters.showProblemsOnly && <span className="ml-0.5">✓</span>}
          </button>
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

  const { t } = useTranslation();

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
            {t.locations.poiDataManagement}
          </SheetTitle>
          <SheetDescription className="flex items-center justify-between">
            <span>{location.name} <span className="text-gray-400">#{location.storeCode}</span></span>
            <span className={`text-xs font-medium ${dataHealth >= 80 ? 'text-green-600' : dataHealth >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {t.locations.dataCompleteness}: {dataHealth}%
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">{t.locations.locationName}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.locations.branchName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-gray-500" />
              {t.locations.address}
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
                {t.locations.phone}
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
                {t.locations.email}
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
              {t.locations.website}
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
              {t.locations.workingHours}
            </Label>
            <Input
              id="workingHours"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              placeholder="09:00 - 22:00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">{t.locations.description}</Label>
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
              {t.locations.image}
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
              {t.common.cancel}
            </Button>
            <Button className="gap-1.5" onClick={onClose}>
              <Save className="w-4 h-4" />
              {t.common.saveAndSync}
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
  const { t } = useTranslation();
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
                className="vx-input text-sm"
              />
              {warning.type === 'image_missing' && (
                <Button variant="outline" size="sm" className="vx-icon-button">
                  <Upload className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" className="vx-button flex-1 gap-1.5 text-xs" onClick={() => setIsOpen(false)}>
              <Save className="w-3 h-3" />
              {t.common.save}
            </Button>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Link href="/locations">
              <Button variant="ghost" size="sm" className="vx-button w-full gap-1.5 text-xs text-gray-600">
                <Layers className="w-3.5 h-3.5" />
                {t.common.bulkOperations}
              </Button>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const getActionLabel = (errorCode: SyncErrorCode | undefined, t: any): string => {
  switch (errorCode) {
    case 'auth_expired': return t.common.reconnect;
    case 'missing_coordinates': return t.common.addCoordinates;
    case 'validation_error': return t.common.fix;
    case 'rate_limit': return t.common.waiting;
    case 'invalid_store_code': return t.common.fixCode;
    default: return t.common.repair;
  }
};

function SyncErrorBubble({
  warning,
  onErrorClick
}: {
  warning: LocationWarning;
  onErrorClick: () => void;
}) {
  const { t } = useTranslation();
  const actionLabel = getActionLabel(warning.errorCode, t);
  const isWaiting = warning.errorCode === 'rate_limit';

  return (
    <button
      onClick={onErrorClick}
      disabled={isWaiting}
      className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md transition-all duration-150 ${isWaiting ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95'}`}
    >
      <AlertTriangle className="w-3 h-3" />
      <span>{actionLabel}</span>
    </button>
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
  const { t } = useTranslation();
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
      <Button size="sm" variant="secondary" className="vx-button gap-1.5">
        <RefreshCw className="w-3.5 h-3.5" />
        Retry Sync
      </Button>
      <Button size="sm" variant="secondary" className="vx-button gap-1.5">
        <Download className="w-3.5 h-3.5" />
        Export
      </Button>
      <Button size="sm" variant="ghost" className="vx-icon-button text-gray-400 hover:text-white" onClick={onClear}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}


function ActionsMenu({ location, platform }: { location: LocationData; platform: PlatformData }) {
  const isPassive = platform.status === 'not_connected' || platform.status === 'closed';
  const isPending = platform.status === 'pending';
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
        {isPending && (
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

interface LocationStatusTableProps {
  onAddNewLocation?: () => void;
  onUploadLocations?: () => void;
}

export default function LocationStatusTable({ onAddNewLocation, onUploadLocations }: LocationStatusTableProps) {
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

  // Get translated status config functions
  const { getStatusConfig, getBusinessStatusConfig } = useStatusConfig();
  const { t } = useTranslation();

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
        return platformData.status !== 'live' || platformData.warnings.length > 0;
      })();

      const storeSetMatch = filters.storeSet === 'all' || location.storeSet === filters.storeSet;

      const businessStatusMatch = filters.businessStatus === 'all' || location.businessStatus === filters.businessStatus;

      // Check if location has any problems (non-live status or warnings)
      const hasProblems = () => {
        const platforms = [location.google, location.meta, location.apple, location.yandex];
        return platforms.some(p => p.status !== 'live' || p.warnings.length > 0);
      };
      const problemsMatch = !filters.showProblemsOnly || hasProblems();

      return searchMatch && platformMatch && storeSetMatch && businessStatusMatch && problemsMatch;
    });
  }, [filters]);

  // Calculate active (verified) locations per platform
  const platformCounts = useMemo(() => {
    return {
      google: filteredLocations.filter(l => l.google.status === 'live').length,
      meta: filteredLocations.filter(l => l.meta.status === 'live').length,
      apple: filteredLocations.filter(l => l.apple.status === 'live').length,
      yandex: filteredLocations.filter(l => l.yandex.status === 'live').length,
    };
  }, [filteredLocations]);

  // Calculate problematic locations count per platform
  const platformProblemCounts = useMemo(() => {
    return {
      google: mockLocations.filter(l => l.google.status !== 'live' || l.google.warnings.length > 0).length,
      meta: mockLocations.filter(l => l.meta.status !== 'live' || l.meta.warnings.length > 0).length,
      apple: mockLocations.filter(l => l.apple.status !== 'live' || l.apple.warnings.length > 0).length,
      yandex: mockLocations.filter(l => l.yandex.status !== 'live' || l.yandex.warnings.length > 0).length,
    };
  }, []);

  // Calculate problematic locations count (any platform with non-live status or warnings)
  const problemCount = useMemo(() => {
    return mockLocations.filter(location => {
      const platforms = [location.google, location.meta, location.apple, location.yandex];
      return platforms.some(p => p.status !== 'live' || p.warnings.length > 0);
    }).length;
  }, []);

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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="vx-card-header flex items-center justify-between gap-4 px-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-gray-900">{t.locations.title}</h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                {t.locations.generalStatus}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t.locations.platformStatuses}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddNewLocation}
            className="vx-button bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm whitespace-nowrap"
            data-testid="btn-add-new-location"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            {t.locations.addNewLocation}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onUploadLocations}
            className="vx-button bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm whitespace-nowrap"
            data-testid="btn-bulk-updates"
          >
            <Edit className="w-3.5 h-3.5 mr-1.5" />
            {t.common.bulkOperations}
          </Button>
        </div>
      </div>

      <FilterToolbar
        filters={filters}
        setFilters={setFilters}
        storeSets={uniqueStoreSets}
        resultCount={filteredLocations.length}
        totalCount={mockLocations.length}
        problemCount={problemCount}
      />

      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
          <tr>
            <th className="text-center px-3 py-4 w-10">
              <Checkbox
                checked={selectedIds.size === filteredLocations.length && filteredLocations.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-4">{t.common.location}</th>
            <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-4">{t.common.status}</th>
            <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-4">
              <div className="flex items-center justify-center gap-1.5">
                <SiGoogle className="w-3.5 h-3.5" />
                Google
                <span className={`text-[10px] font-normal ${filters.showProblemsOnly ? 'text-rose-500' : 'text-gray-400'}`}>
                  {filters.showProblemsOnly ? `(${platformProblemCounts.google}/${mockLocations.length})` : `(${platformCounts.google})`}
                </span>
              </div>
            </th>
            <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-4">
              <div className="flex items-center justify-center gap-1.5">
                <SiMeta className="w-3.5 h-3.5" />
                Meta
                <span className={`text-[10px] font-normal ${filters.showProblemsOnly ? 'text-rose-500' : 'text-gray-400'}`}>
                  {filters.showProblemsOnly ? `(${platformProblemCounts.meta}/${mockLocations.length})` : `(${platformCounts.meta})`}
                </span>
              </div>
            </th>
            <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-4">
              <div className="flex items-center justify-center gap-1.5">
                <SiApple className="w-3.5 h-3.5" />
                Apple
                <span className={`text-[10px] font-normal ${filters.showProblemsOnly ? 'text-rose-500' : 'text-gray-400'}`}>
                  {filters.showProblemsOnly ? `(${platformProblemCounts.apple}/${mockLocations.length})` : `(${platformCounts.apple})`}
                </span>
              </div>
            </th>
            <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-4">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-red-500 font-bold text-sm">Я</span>
                Yandex
                <span className={`text-[10px] font-normal ${filters.showProblemsOnly ? 'text-rose-500' : 'text-gray-400'}`}>
                  {filters.showProblemsOnly ? `(${platformProblemCounts.yandex}/${mockLocations.length})` : `(${platformCounts.yandex})`}
                </span>
              </div>
            </th>
            <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-4 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredLocations.map((location) => {
            const dataHealth = calculateDataHealth(location);
            const missingFields = getMissingFields(location);
            return (
              <tr key={location.id} className={`group transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/40 hover:shadow-sm ${selectedIds.has(location.id) ? 'bg-blue-50/70' : 'bg-white'}`}>
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
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">#{location.storeCode}</p>
                  </button>
                  <DataHealthBar
                    percentage={dataHealth}
                    missingCount={missingFields.length}
                    onClick={() => setDataQualitySheet({ open: true, location })}
                  />
                </td>
                <td className="px-4 py-4">
                  {(() => {
                    const statusConfig = getBusinessStatusConfig(location.businessStatus);
                    return (
                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}></span>
                          {statusConfig.label}
                        </span>
                      </div>
                    );
                  })()}
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditSheet({ open: true, location })}
                      className="p-1.5 hover:bg-blue-100 rounded-md transition-colors group/edit"
                      title="Düzenle"
                    >
                      <Pencil className="w-4 h-4 text-gray-400 group-hover/edit:text-blue-600" />
                    </button>
                    <ActionsMenu location={location} platform={location.google} />
                  </div>
                </td>
              </tr>
            );
          })}
          {filteredLocations.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center">
                <div className="text-gray-500">
                  {filters.showProblemsOnly && filters.search === '' && filters.platform === 'all' && filters.storeSet === 'all' ? (
                    <>
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
                      <p className="text-base font-medium text-emerald-600 mb-1">{t.locations.allLocationsOk}</p>
                      <p className="text-sm text-gray-400">{t.locations.noActionsRequired}</p>
                    </>
                  ) : (
                    <>
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm mb-3">{t.locations.noLocationsFound}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilters(initialFilters)}
                        className="gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        {t.locations.clearFilters}
                      </Button>
                    </>
                  )}
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
  const { t } = useTranslation();
  const { getStatusConfig } = useStatusConfig();

  // If business is closed, show passive status for all platforms
  const isBusinessClosed = location.businessStatus === 'closed' || location.businessStatus === 'temporarily_closed';
  const effectiveStatus = isBusinessClosed ? 'not_connected' : platform.status;
  const statusConfig = getStatusConfig(effectiveStatus);
  const isPassive = effectiveStatus === 'not_connected' || effectiveStatus === 'closed';
  const isSetupRequired = effectiveStatus === 'not_connected' && !isBusinessClosed;

  if (isSetupRequired) {
    return (
      <div className="flex flex-col items-center justify-center h-20 text-center">
        <Link href="/setup3B#locations">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            {t.common.setupRequired}
          </span>
        </Link>
      </div>
    );
  }

  if (isPassive) {
    return (
      <div className="flex flex-col items-center justify-center h-20 text-center">
        <div className={`flex items-center gap-1.5 ${statusConfig.color}`}>
          {statusConfig.icon}
          <span className="text-xs font-medium">{statusConfig.label}</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">—</span>
      </div>
    );
  }

  const syncErrors = platform.warnings.filter(w => w.type === 'sync_error');
  const hasSyncErrors = syncErrors.length > 0;

  return (
    <div className="flex flex-col items-center justify-center h-20 text-center">
      {/* Status Row */}
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}></span>
        <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-slate-400 mt-0.5">{platform.lastSync || '—'}</span>

      {/* Error Actions */}
      {hasSyncErrors && (
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {syncErrors.slice(0, 1).map((warning, idx) => (
            <SyncErrorBubble
              key={`${cellKey}-${idx}`}
              warning={warning}
              onErrorClick={() => onSyncErrorClick?.(warning)}
            />
          ))}
          {syncErrors.length > 1 && (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center justify-center w-6 h-6 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                  +{syncErrors.length - 1}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3 shadow-lg" align="center" side="bottom" sideOffset={4}>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-500 font-medium">{t.locations.otherErrors}</span>
                  {syncErrors.slice(1).map((warning, idx) => (
                    <SyncErrorBubble
                      key={`${cellKey}-more-${idx}`}
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
