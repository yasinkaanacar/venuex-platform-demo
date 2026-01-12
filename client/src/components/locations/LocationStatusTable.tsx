import { useState } from 'react';
import { Link } from 'wouter';
import { SiGoogle, SiMeta, SiApple } from 'react-icons/si';
import { Clock, AlertTriangle, Phone, Mail, MapPin, Image, ShieldCheck, ShieldAlert, XCircle, PauseCircle, ChevronRight, MoreHorizontal, RefreshCw, Link2, Unlink, ExternalLink, Download, X, Save, Upload, Layers } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

type WarningType = 'phone_missing' | 'email_missing' | 'address_error' | 'image_missing' | 'sync_error';

interface LocationWarning {
  type: WarningType;
  label: string;
  errorLog?: string;
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
  google: PlatformData;
  meta: PlatformData;
  apple: PlatformData;
  yandex: PlatformData;
}

const mockLocations: LocationData[] = [
  {
    id: 1,
    storeCode: 'DY_001',
    name: 'İstanbul - Kadıköy',
    address: 'Caferağa Mah. Moda Cad. No:12',
    phone: '+90 216 555 0001',
    email: 'kadikoy@doyuyo.com',
    imageUrl: 'https://example.com/kadikoy.jpg',
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
    google: { status: 'action_required', lastSync: '3 saat önce', warnings: [
      { type: 'sync_error', label: 'Sync Hatası', errorLog: 'Error: Store ID mismatch (Google: 76 vs VenueX: 76_TR)\nTimestamp: 2026-01-12T14:32:00Z\nAPI Response: 400 Bad Request\nDetails: The store identifier format does not match the expected pattern.' },
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
    google: { status: 'verified', lastSync: '15 dk önce', warnings: [] },
    meta: { status: 'verified', lastSync: '1 gün önce', warnings: [
      { type: 'sync_error', label: 'Sync Hatası', errorLog: 'Error: API Token expired\nTimestamp: 2026-01-11T09:15:00Z\nAPI Response: 401 Unauthorized\nDetails: The OAuth token has expired. Please re-authenticate.' }
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
    google: { status: 'unverified', lastSync: '30 dk önce', warnings: [{ type: 'address_error', label: 'Adres Hatalı' }] },
    meta: { status: 'verified', lastSync: '20 dk önce', warnings: [
      { type: 'sync_error', label: 'Sync Hatası', errorLog: 'Error: Rate limit exceeded\nTimestamp: 2026-01-12T10:45:00Z\nAPI Response: 429 Too Many Requests\nDetails: You have exceeded the rate limit. Please retry after 60 seconds.' },
      { type: 'phone_missing', label: 'Telefon Eksik' },
      { type: 'email_missing', label: 'Email Eksik' },
      { type: 'image_missing', label: 'Görsel Eksik' }
    ]},
    apple: { status: 'verified', lastSync: '1 saat önce', warnings: [] },
    yandex: { status: 'verified', lastSync: '2 saat önce', warnings: [{ type: 'address_error', label: 'Adres Hatalı' }] }
  }
];

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
  location, 
  onErrorClick 
}: { 
  warning: LocationWarning; 
  location: LocationData; 
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

function ErrorDetailModal({ open, onClose, warning, locationName, storeCode }: { open: boolean; onClose: () => void; warning: LocationWarning | null; locationName: string; storeCode: string }) {
  if (!warning) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Sync Hatası Detayı
          </DialogTitle>
          <DialogDescription>
            {locationName} ({storeCode})
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
            {warning.errorLog || 'Hata detayı bulunamadı.'}
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>
              Kapat
            </Button>
            <Button size="sm" className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Tekrar Dene
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
  const [errorModal, setErrorModal] = useState<{ open: boolean; warning: LocationWarning | null; locationName: string; storeCode: string }>({
    open: false,
    warning: null,
    locationName: '',
    storeCode: ''
  });

  const handleSyncErrorClick = (warning: LocationWarning, location: LocationData) => {
    setErrorModal({ open: true, warning, locationName: location.name, storeCode: location.storeCode });
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
    if (selectedIds.size === mockLocations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(mockLocations.map(l => l.id)));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                checked={selectedIds.size === mockLocations.length}
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
          {mockLocations.map((location) => (
            <tr key={location.id} className={`hover:bg-blue-50/50 transition-colors ${selectedIds.has(location.id) ? 'bg-blue-50' : ''}`}>
              <td className="text-center px-3 py-4">
                <Checkbox
                  checked={selectedIds.has(location.id)}
                  onChange={() => toggleSelect(location.id)}
                />
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-medium text-gray-900">{location.name}</p>
                <p className="text-xs text-gray-500">{location.address}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">#{location.storeCode}</p>
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
          ))}
        </tbody>
      </table>
      
      <ErrorDetailModal
        open={errorModal.open}
        onClose={() => setErrorModal({ ...errorModal, open: false })}
        warning={errorModal.warning}
        locationName={errorModal.locationName}
        storeCode={errorModal.storeCode}
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

  const sortedWarnings = [...platform.warnings].sort((a, b) => {
    if (a.type === 'sync_error') return -1;
    if (b.type === 'sync_error') return 1;
    return 0;
  });

  const hasWarnings = sortedWarnings.length > 0;

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

      {hasWarnings && (
        <div className="flex flex-wrap justify-center gap-1">
          {!isOpen && sortedWarnings.slice(0, 2).map((warning, idx) => (
            warning.type === 'sync_error' ? (
              <SyncErrorBubble 
                key={`${cellKey}-${idx}`}
                warning={warning}
                location={location}
                onErrorClick={() => onSyncErrorClick?.(warning)}
              />
            ) : (
              <InlineFieldEditorPopover
                key={`${cellKey}-${idx}`}
                warning={warning}
                location={location}
                cellKey={cellKey}
                idx={idx}
              />
            )
          ))}
          {sortedWarnings.length > 2 && (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium rounded-full border bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {isOpen ? 'Kapat' : `+${sortedWarnings.length - 2}`}
                  <ChevronRight className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start" side="right" sideOffset={8}>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-gray-500 font-medium mb-1">Tüm Uyarılar ({sortedWarnings.length})</span>
                  {sortedWarnings.map((warning, idx) => (
                    warning.type === 'sync_error' ? (
                      <SyncErrorBubble 
                        key={`${cellKey}-all-${idx}`}
                        warning={warning}
                        location={location}
                        onErrorClick={() => onSyncErrorClick?.(warning)}
                      />
                    ) : (
                      <InlineFieldEditorPopover
                        key={`${cellKey}-all-${idx}`}
                        warning={warning}
                        location={location}
                        cellKey={`${cellKey}-all`}
                        idx={idx}
                      />
                    )
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
